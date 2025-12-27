"""Tenant model for multi-tenancy support."""
from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Column, TEXT
from pydantic import validator


class Tenant(SQLModel, table=True):
    """Tenant/Organization model."""
    __tablename__ = "tenants"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(min_length=1, max_length=200, index=True)
    slug: str = Field(min_length=1, max_length=100, unique=True, index=True)
    
    # Plan and limits
    plan: str = Field(default="free", max_length=50)  # free, starter, pro, enterprise
    max_users: int = Field(default=5, ge=1)
    max_leads: int = Field(default=1000, ge=1)
    max_campaigns: int = Field(default=10, ge=1)
    
    # Feature flags (JSON stored as text)
    flags: Optional[str] = Field(default=None, sa_column=Column(TEXT))
    settings: Optional[str] = Field(default=None, sa_column=Column(TEXT))
    
    # Status
    is_active: bool = Field(default=True, index=True)
    trial_ends_at: Optional[datetime] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    @validator('slug')
    def validate_slug(cls, v):
        if not v or not v.replace('-', '').replace('_', '').isalnum():
            raise ValueError('Slug must be alphanumeric with hyphens or underscores')
        return v.lower()


class TenantCreate(SQLModel):
    """Schema for creating a tenant."""
    name: str = Field(min_length=1, max_length=200)
    slug: str = Field(min_length=1, max_length=100)
    plan: str = Field(default="free")
    max_users: int = Field(default=5, ge=1)
    max_leads: int = Field(default=1000, ge=1)
    max_campaigns: int = Field(default=10, ge=1)


class TenantUpdate(SQLModel):
    """Schema for updating a tenant."""
    name: Optional[str] = Field(default=None, min_length=1, max_length=200)
    plan: Optional[str] = None
    max_users: Optional[int] = Field(default=None, ge=1)
    max_leads: Optional[int] = Field(default=None, ge=1)
    max_campaigns: Optional[int] = Field(default=None, ge=1)
    is_active: Optional[bool] = None
