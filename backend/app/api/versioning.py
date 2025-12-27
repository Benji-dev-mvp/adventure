"""
API Versioning support - Allows backward compatibility while evolving the API
"""
from fastapi import APIRouter, Request, HTTPException, status
from typing import Callable, Optional
from functools import wraps
import logging

logger = logging.getLogger(__name__)


class APIVersion:
    """API version helper class"""
    V1 = "v1"
    V2 = "v2"
    LATEST = V2
    
    SUPPORTED_VERSIONS = [V1, V2]
    
    @classmethod
    def is_supported(cls, version: str) -> bool:
        return version in cls.SUPPORTED_VERSIONS


def get_api_version(request: Request) -> str:
    """
    Extract API version from request
    Priority: Header > Query param > Default to latest
    """
    # Check Accept-Version header
    version = request.headers.get("Accept-Version")
    if version and APIVersion.is_supported(version):
        return version
    
    # Check query parameter
    version = request.query_params.get("version")
    if version and APIVersion.is_supported(version):
        return version
    
    # Default to latest
    return APIVersion.LATEST


def versioned_endpoint(**version_handlers):
    """
    Decorator to handle multiple API versions in a single endpoint
    
    Usage:
        @versioned_endpoint(
            v1=handle_v1,
            v2=handle_v2
        )
        async def my_endpoint(request: Request):
            pass
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            version = get_api_version(request)
            handler = version_handlers.get(version)
            
            if not handler:
                raise HTTPException(
                    status_code=status.HTTP_406_NOT_ACCEPTABLE,
                    detail=f"API version {version} not supported for this endpoint"
                )
            
            logger.info(f"Using API version {version} for {request.url.path}")
            return await handler(request, *args, **kwargs)
        
        return wrapper
    return decorator


class DeprecationWarning:
    """Helper to add deprecation warnings to responses"""
    
    @staticmethod
    def add_header(response, version: str, sunset_date: Optional[str] = None):
        """Add deprecation warning header"""
        response.headers["Deprecated"] = "true"
        response.headers["X-API-Deprecation-Version"] = version
        if sunset_date:
            response.headers["Sunset"] = sunset_date
        response.headers["Link"] = '<https://docs.example.com/api/migration>; rel="deprecation"'


# Version-specific routers
v1_router = APIRouter(prefix="/api/v1", tags=["API v1"])
v2_router = APIRouter(prefix="/api/v2", tags=["API v2"])


# Example versioned endpoints
@v1_router.get("/campaigns")
async def list_campaigns_v1():
    """V1 endpoint - legacy format"""
    return {
        "campaigns": [
            {"id": 1, "name": "Campaign 1", "status": "active"}
        ]
    }


@v2_router.get("/campaigns")
async def list_campaigns_v2():
    """V2 endpoint - enhanced format with pagination and filtering"""
    return {
        "data": [
            {
                "id": 1,
                "name": "Campaign 1",
                "status": "active",
                "metrics": {
                    "sent": 100,
                    "opened": 50,
                    "clicked": 10
                }
            }
        ],
        "pagination": {
            "page": 1,
            "per_page": 20,
            "total": 1,
            "pages": 1
        },
        "meta": {
            "api_version": "v2",
            "timestamp": "2025-12-27T00:00:00Z"
        }
    }
