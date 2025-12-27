"""API Key models for external integrations."""
from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, Column, TEXT
from pydantic import validator
import secrets
import hashlib


class APIKey(SQLModel, table=True):
    """API key model for external integrations."""
    __tablename__ = "api_keys_v2"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    tenant_id: int = Field(foreign_key="tenants.id", index=True)
    user_id: Optional[int] = Field(default=None, index=True)
    
    # Key identification
    label: str = Field(min_length=1, max_length=200)
    key_hash: str = Field(max_length=255, unique=True, index=True)
    key_prefix: str = Field(max_length=12)  # For display purposes
    
    # Permissions
    scopes: Optional[str] = Field(default=None, max_length=1000)  # Comma-separated
    
    # Usage tracking
    last_used_at: Optional[datetime] = None
    usage_count: int = Field(default=0, ge=0)
    
    # Lifecycle
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    revoked_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    is_active: bool = Field(default=True, index=True)
    
    @staticmethod
    def generate_key() -> tuple[str, str]:
        """Generate API key and its hash.
        
        Returns:
            tuple: (api_key, key_hash)
        """
        # Generate secure random key
        key = f"sk_{secrets.token_urlsafe(32)}"
        # Hash the key for storage
        key_hash = hashlib.sha256(key.encode()).hexdigest()
        return key, key_hash
    
    @staticmethod
    def hash_key(key: str) -> str:
        """Hash an API key."""
        return hashlib.sha256(key.encode()).hexdigest()


class APIKeyCreate(SQLModel):
    """Schema for creating an API key."""
    label: str = Field(min_length=1, max_length=200)
    scopes: Optional[List[str]] = None
    expires_at: Optional[datetime] = None


class APIKeyResponse(SQLModel):
    """Response schema for API key creation."""
    id: int
    label: str
    key: str  # Only returned on creation
    key_prefix: str
    scopes: Optional[str] = None
    created_at: datetime
    expires_at: Optional[datetime] = None


class APIKeyList(SQLModel):
    """List response for API keys (without actual key)."""
    id: int
    label: str
    key_prefix: str
    scopes: Optional[str] = None
    last_used_at: Optional[datetime] = None
    usage_count: int
    created_at: datetime
    revoked_at: Optional[datetime] = None
    is_active: bool
