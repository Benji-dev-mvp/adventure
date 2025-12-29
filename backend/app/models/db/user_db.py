"""User database model with tenant support."""
from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field
from pydantic import EmailStr
from app.models.user import UserRole


class UserDB(SQLModel, table=True):
    """User model with multi-tenant support."""
    __tablename__ = "users_db"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    email: EmailStr = Field(unique=True, index=True)
    name: str = Field(min_length=1, max_length=200)
    hashed_password: str = Field(max_length=255)
    
    # Tenant association
    tenant_id: int = Field(foreign_key="tenants.id", index=True)
    
    # Role and permissions
    role: UserRole = Field(default=UserRole.USER, index=True)
    
    # OAuth fields
    oauth_provider: Optional[str] = Field(default=None, max_length=50)
    oauth_provider_id: Optional[str] = Field(default=None, max_length=255)
    
    # Status
    is_active: bool = Field(default=True, index=True)
    is_verified: bool = Field(default=False)
    
    # MFA
    mfa_enabled: bool = Field(default=False)
    mfa_secret: Optional[str] = Field(default=None, max_length=255)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None


class UserCreate(SQLModel):
    """Schema for creating a user."""
    email: EmailStr
    name: str = Field(min_length=1, max_length=200)
    password: str = Field(min_length=8, max_length=100)
    tenant_id: int
    role: UserRole = UserRole.USER


class UserUpdate(SQLModel):
    """Schema for updating a user."""
    name: Optional[str] = Field(default=None, min_length=1, max_length=200)
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None
