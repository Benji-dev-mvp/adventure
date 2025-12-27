"""
API Key management models for programmatic access.
Supports key generation, rotation, and permission scoping.
"""
from enum import Enum
from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Column
from sqlalchemy import JSON
import secrets
import hashlib


class APIKeyPermission(str, Enum):
    """API Key permission scopes"""
    READ = "read"
    WRITE = "write"
    DELETE = "delete"
    ADMIN = "admin"


class APIKeyStatus(str, Enum):
    """API Key status"""
    ACTIVE = "active"
    REVOKED = "revoked"
    EXPIRED = "expired"


class APIKey(SQLModel, table=True):
    """
    API keys for programmatic access.
    Keys are hashed before storage for security.
    """
    __tablename__ = "api_keys"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=200)
    key_prefix: str = Field(max_length=20, index=True)  # First 8 chars for display
    key_hash: str = Field(max_length=128, unique=True, index=True)  # SHA-256 hash
    
    # Ownership
    user_id: int = Field(foreign_key="users.id", index=True)
    organization_id: int = Field(foreign_key="organizations.id", index=True)
    workspace_id: Optional[int] = Field(default=None, foreign_key="workspaces.id", index=True)
    
    # Permissions
    permissions: List[str] = Field(default=[], sa_column=Column(JSON))  # List of APIKeyPermission values
    scopes: List[str] = Field(default=[], sa_column=Column(JSON))  # Additional scope constraints
    
    # Rate limiting
    rate_limit: int = Field(default=1000)  # Requests per hour
    
    # Status and usage
    status: APIKeyStatus = Field(default=APIKeyStatus.ACTIVE)
    last_used_at: Optional[datetime] = None
    last_used_ip: Optional[str] = Field(default=None, max_length=45)
    request_count: int = Field(default=0)
    
    # Lifecycle
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    revoked_at: Optional[datetime] = None
    revoked_by: Optional[int] = Field(default=None, foreign_key="users.id")
    revoke_reason: Optional[str] = Field(default=None, max_length=500)
    
    # Rotation tracking
    rotated_from: Optional[int] = Field(default=None, foreign_key="api_keys.id")
    
    @staticmethod
    def generate_key() -> str:
        """Generate a new API key with prefix"""
        random_bytes = secrets.token_urlsafe(32)
        return f"sk_live_{random_bytes}"
    
    @staticmethod
    def hash_key(key: str) -> str:
        """Hash an API key for storage"""
        return hashlib.sha256(key.encode()).hexdigest()
    
    @staticmethod
    def get_key_prefix(key: str) -> str:
        """Extract prefix from key for display"""
        return key[:12] if len(key) >= 12 else key
    
    def verify_key(self, key: str) -> bool:
        """Verify a key matches this record"""
        return self.key_hash == self.hash_key(key)
    
    def is_valid(self) -> bool:
        """Check if key is active and not expired"""
        if self.status != APIKeyStatus.ACTIVE:
            return False
        if self.expires_at and self.expires_at < datetime.utcnow():
            return False
        return True
    
    def has_permission(self, permission: APIKeyPermission) -> bool:
        """Check if key has a specific permission"""
        return permission.value in self.permissions or APIKeyPermission.ADMIN.value in self.permissions


# ============================================================================
# Pydantic schemas for API requests/responses
# ============================================================================

class APIKeyCreate(SQLModel):
    """Schema for creating a new API key"""
    name: str = Field(min_length=1, max_length=200)
    permissions: List[APIKeyPermission]
    workspace_id: Optional[int] = None
    rate_limit: int = Field(default=1000, ge=1, le=100000)
    expires_at: Optional[datetime] = None


class APIKeyResponse(SQLModel):
    """Response schema for API key (without showing the actual key)"""
    id: int
    name: str
    key_prefix: str
    permissions: List[str]
    workspace_id: Optional[int]
    status: APIKeyStatus
    rate_limit: int
    request_count: int
    last_used_at: Optional[datetime]
    created_at: datetime
    expires_at: Optional[datetime]


class APIKeyCreated(SQLModel):
    """Response when a new key is created (includes the actual key once)"""
    key: str  # Only shown once at creation
    id: int
    name: str
    key_prefix: str
    permissions: List[str]
    created_at: datetime
    expires_at: Optional[datetime]
    warning: str = "Save this key now. You won't be able to see it again."


class APIKeyRotateRequest(SQLModel):
    """Schema for rotating an API key"""
    name: Optional[str] = None
    permissions: Optional[List[APIKeyPermission]] = None
    rate_limit: Optional[int] = None


class APIKeyUsageStats(SQLModel):
    """Usage statistics for an API key"""
    key_id: int
    key_name: str
    total_requests: int
    requests_last_hour: int
    requests_last_day: int
    last_used_at: Optional[datetime]
    average_requests_per_day: float
