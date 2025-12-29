import re
import time
import uuid
import logging
from typing import Optional, List, Callable, Dict
from collections import defaultdict
from functools import wraps
from datetime import datetime, timedelta
import jwt

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response, JSONResponse
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.models.user import User, UserRole, Permission, ROLE_PERMISSIONS
from app.core.config import settings
from app.core.cache import cache

security = HTTPBearer()
logger = logging.getLogger(__name__)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Adds common security headers to all responses to reduce risk
    from clickjacking, sniffing, and information leakage.
    """

    def __init__(self, app):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        response = await call_next(request)
        # This API doesn't serve HTML; a restrictive CSP is fine.
        response.headers.setdefault(
            "Content-Security-Policy",
            "default-src 'none'; frame-ancestors 'none'; base-uri 'none'"
        )
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "no-referrer")
        response.headers.setdefault(
            "Permissions-Policy",
            "camera=(), microphone=(), geolocation=()"
        )
        return response


class RequestSizeLimitMiddleware(BaseHTTPMiddleware):
    """
    Rejects requests whose body exceeds `max_body_size` to limit abuse.
    Checks Content-Length when present; otherwise reads body to measure.
    """

    def __init__(self, app, max_body_size: int = 1024 * 1024):
        super().__init__(app)
        self.max_body_size = max_body_size

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        content_length: Optional[str] = request.headers.get("content-length")
        if content_length is not None:
            try:
                if int(content_length) > self.max_body_size:
                    return JSONResponse({"detail": "Request body too large"}, status_code=413)
            except ValueError:
                # Fall through to measuring the body
                pass
        else:
            # Only read body for methods that typically include payloads
            if request.method in {"POST", "PUT", "PATCH"}:
                body = await request.body()
                if len(body) > self.max_body_size:
                    return JSONResponse({"detail": "Request body too large"}, status_code=413)
        return await call_next(request)


class RequestIDMiddleware(BaseHTTPMiddleware):
    """
    Attaches a unique request ID to each request for tracing and logging.
    """
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        
        # Attach request_id to log records for this request
        old_factory = logging.getLogRecordFactory()
        def record_factory(*args, **kwargs):
            record = old_factory(*args, **kwargs)
            record.request_id = request_id
            return record
        logging.setLogRecordFactory(record_factory)
        
        start_time = time.time()
        response = await call_next(request)
        duration = time.time() - start_time
        
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Response-Time"] = f"{duration:.3f}s"
        
        logger.info(f"{request.method} {request.url.path} {response.status_code} {duration:.3f}s")
        
        # Restore original factory
        logging.setLogRecordFactory(old_factory)
        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Per-user rate limiter using Redis for distributed rate limiting.
    Falls back to IP-based limiting for unauthenticated requests.
    """
    def __init__(self, app, max_requests: int = 100, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)  # Fallback for when Redis unavailable

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # Try to get user from Authorization header
        user_key = None
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            try:
                token = auth_header.split(" ")[1]
                payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
                user_key = f"ratelimit:user:{payload.get('sub')}"
            except:
                pass
        
        # Fallback to IP-based rate limiting
        if not user_key:
            client_ip = request.client.host if request.client else "unknown"
            user_key = f"ratelimit:ip:{client_ip}"
        
        now = time.time()
        
        # Try Redis first
        try:
            count = cache.get(user_key) or 0
            if count >= self.max_requests:
                return JSONResponse(
                    {"detail": "Rate limit exceeded. Try again later."},
                    status_code=429,
                    headers={"X-RateLimit-Limit": str(self.max_requests), "X-RateLimit-Remaining": "0"}
                )
            cache.set(user_key, count + 1, ttl=self.window_seconds)
        except:
            # Fallback to in-memory
            self.requests[user_key] = [ts for ts in self.requests[user_key] if now - ts < self.window_seconds]
            if len(self.requests[user_key]) >= self.max_requests:
                return JSONResponse({"detail": "Rate limit exceeded"}, status_code=429)
            self.requests[user_key].append(now)
        
        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(self.max_requests)
        return response


def sanitize_text(text: str) -> str:
    """
    Best-effort sanitization for incoming text fields to reduce risk of
    script tags or embedded markup being persisted or echoed.
    Note: Prefer robust, context-aware escaping at render time.
    """
    if text is None:
        return ""
    # Strip HTML tags
    clean = re.sub(r"<[^>]*>", "", text)
    # Remove dangerous control characters
    clean = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F]", "", clean)
    # Collapse excessive whitespace
    clean = " ".join(clean.split())
    return clean


# ============================================================================
# RBAC Functions and Decorators
# ============================================================================

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """
    Get current user from JWT token with full validation.
    Checks token signature, expiry, and user status.
    """
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode and validate JWT
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        user_id: int = payload.get("sub")
        email: str = payload.get("email")
        if user_id is None or email is None:
            raise credentials_exception
        
        # Check token expiry
        exp = payload.get("exp")
        if exp and datetime.fromtimestamp(exp) < datetime.now():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Get user from cache or database
        cache_key = f"user:{user_id}"
        cached_user = cache.get(cache_key)
        if cached_user:
            user_data = cached_user
        else:
            # In production, fetch from database
            # For now, construct from payload
            user_data = {
                "id": user_id,
                "email": email,
                "name": payload.get("name", "User"),
                "role": payload.get("role", UserRole.USER.value),
                "is_active": payload.get("is_active", True),
                "created_at": datetime.now().isoformat(),
            }
            cache.set(cache_key, user_data, ttl=300)
        
        user = User(**user_data)
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is disabled"
            )
        
        return user
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.JWTError:
        raise credentials_exception


def require_role(*roles: UserRole):
    """
    Decorator to require specific role(s) for an endpoint.
    
    Usage:
        @require_role(UserRole.ADMIN, UserRole.MANAGER)
        async def admin_only_endpoint(user: User = Depends(get_current_user)):
            ...
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, user: User = Depends(get_current_user), **kwargs):
            if user.role not in roles:
                raise HTTPException(
                    status_code=403,
                    detail=f"Access denied. Required roles: {[r.value for r in roles]}"
                )
            return await func(*args, user=user, **kwargs)
        return wrapper
    return decorator


def require_permission(*permissions: Permission):
    """
    Decorator to require specific permission(s) for an endpoint.
    
    Usage:
        @require_permission(Permission.CAMPAIGN_DELETE)
        async def delete_campaign(user: User = Depends(get_current_user)):
            ...
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, user: User = Depends(get_current_user), **kwargs):
            if not user.has_all_permissions(list(permissions)):
                raise HTTPException(
                    status_code=403,
                    detail=f"Access denied. Required permissions: {[p.value for p in permissions]}"
                )
            return await func(*args, user=user, **kwargs)
        return wrapper
    return decorator


def get_user_permissions(user: User) -> List[Permission]:
    """Get all permissions for a user based on their role"""
    return ROLE_PERMISSIONS.get(user.role, [])


async def get_current_tenant(user: User = Depends(get_current_user)):
    """
    Get current tenant from authenticated user.
    Requires get_current_user dependency.
    
    TODO: Implement actual database lookup using user.tenant_id.
    Currently returns mock data - this must be implemented properly
    for tenant isolation before production deployment.
    """
    from app.models.db.tenant import Tenant
    from app.core.db import get_session
    from sqlmodel import select
    
    # TODO: Implement actual database query
    # Example:
    # with next(get_session()) as session:
    #     tenant = session.get(Tenant, user.tenant_id)
    #     if not tenant:
    #         raise HTTPException(status_code=404, detail="Tenant not found")
    #     return tenant
    
    # Mock tenant data (for development only)
    tenant_data = {
        "id": 1,
        "name": "Default Organization",
        "slug": "default",
        "plan": "enterprise",
        "is_active": True,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
    }
    
    # Create a mock Tenant object
    class MockTenant:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
    
    return MockTenant(**tenant_data)


def require_tenant_access(resource_tenant_id: int):
    """
    Dependency to verify user has access to a specific tenant's resource.
    
    Usage:
        @app.get("/admin/{tenant_id}/api-keys")
        async def get_api_keys(
            tenant_id: int,
            user: User = Depends(get_current_user),
            _: None = Depends(require_tenant_access)
        ):
            ...
    """
    async def check_access(user: User = Depends(get_current_user)):
        # For now, allow access if user is admin
        # In production, check if user.tenant_id matches resource_tenant_id
        if user.role != UserRole.ADMIN:
            # Check tenant match
            user_tenant_id = getattr(user, 'tenant_id', 1)
            if user_tenant_id != resource_tenant_id:
                raise HTTPException(
                    status_code=403,
                    detail="Access denied to this tenant's resources"
                )
        return None
    
    return check_access


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create JWT access token with proper signing and expiration.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=settings.jwt_expiration_hours)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access"
    })
    
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)
    return encoded_jwt


def create_refresh_token(data: dict) -> str:
    """
    Create JWT refresh token with longer expiration (7 days).
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "refresh"
    })
    
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)
    return encoded_jwt


def verify_refresh_token(token: str) -> Dict:
    """
    Verify and decode refresh token.
    """
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate refresh token"
        )


async def get_current_user_ws(token: str) -> User:
    """
    Get current user from JWT token for WebSocket connections.
    In production, implement proper JWT validation.
    """
    # TODO: Implement JWT token validation for WebSocket
    # For now, return a mock user for demonstration
    return User(
        id=1,
        email="user@company.com",
        name="WebSocket User",
        role=UserRole.USER,
        is_active=True,
        created_at=datetime.now()
    )
