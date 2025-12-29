"""
Enhanced database models with proper indexing, constraints, and relationships
"""

import re
from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import EmailStr, constr, validator
from sqlmodel import TEXT, Column, Field, Index, Relationship, SQLModel


class CampaignStatus(str, Enum):
    """Campaign status types"""

    DRAFT = "draft"
    SCHEDULED = "scheduled"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class LeadStatus(str, Enum):
    """Lead status types"""

    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    CLOSED_WON = "closed_won"
    CLOSED_LOST = "closed_lost"
    NURTURING = "nurturing"


class Priority(str, Enum):
    """Priority levels"""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class EnhancedLead(SQLModel, table=True):
    """Enhanced Lead model with better validation and indexing"""

    __tablename__ = "leads_enhanced"
    __table_args__ = (
        Index("idx_email", "email"),
        Index("idx_status", "status"),
        Index("idx_score", "score"),
        Index("idx_company", "company"),
        Index("idx_created_at", "created_at"),
        Index("idx_updated_at", "updated_at"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(min_length=1, max_length=100, index=True)
    email: EmailStr = Field(index=True, unique=True)
    phone: Optional[str] = Field(default=None, max_length=20)
    company: Optional[str] = Field(default=None, max_length=200, index=True)
    title: Optional[str] = Field(default=None, max_length=100)
    industry: Optional[str] = Field(default=None, max_length=100)

    # Status and scoring
    status: LeadStatus = Field(default=LeadStatus.NEW, index=True)
    score: int = Field(default=0, ge=0, le=100, index=True)
    priority: Priority = Field(default=Priority.MEDIUM)

    # Location
    country: Optional[str] = Field(default=None, max_length=100)
    state: Optional[str] = Field(default=None, max_length=100)
    city: Optional[str] = Field(default=None, max_length=100)

    # Engagement
    last_contacted: Optional[datetime] = None
    last_activity: Optional[datetime] = None
    engagement_score: int = Field(default=0, ge=0, le=100)

    # Metadata
    source: Optional[str] = Field(default=None, max_length=50)
    tags: Optional[str] = Field(default=None, sa_column=Column(TEXT))  # JSON array stored as text
    notes: Optional[str] = Field(default=None, sa_column=Column(TEXT))
    custom_fields: Optional[str] = Field(
        default=None, sa_column=Column(TEXT)
    )  # JSON stored as text

    # Ownership
    owner_id: Optional[int] = Field(default=None, foreign_key="users.id")
    team_id: Optional[int] = Field(default=None, foreign_key="teams.id")

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow, index=True)

    # Soft delete
    deleted_at: Optional[datetime] = None
    is_deleted: bool = Field(default=False, index=True)

    @validator("email")
    def validate_email(cls, v):
        if not v or "@" not in v:
            raise ValueError("Invalid email address")
        return v.lower()

    @validator("phone")
    def validate_phone(cls, v):
        if v and not re.match(r"^\+?[0-9\s\-\(\)]+$", v):
            raise ValueError("Invalid phone number format")
        return v


class EnhancedCampaign(SQLModel, table=True):
    """Enhanced Campaign model with better tracking and analytics"""

    __tablename__ = "campaigns_enhanced"
    __table_args__ = (
        Index("idx_status", "status"),
        Index("idx_type", "type"),
        Index("idx_created_at", "created_at"),
        Index("idx_owner_id", "owner_id"),
        Index("idx_scheduled_start", "scheduled_start"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(min_length=1, max_length=120, index=True)
    objective: str = Field(min_length=1, max_length=2000)
    description: Optional[str] = Field(default=None, sa_column=Column(TEXT))

    # Status and type
    status: CampaignStatus = Field(default=CampaignStatus.DRAFT, index=True)
    type: str = Field(default="email", max_length=50)  # email, linkedin, sms, call, multi-channel
    priority: Priority = Field(default=Priority.MEDIUM)

    # Scheduling
    scheduled_start: Optional[datetime] = Field(default=None, index=True)
    scheduled_end: Optional[datetime] = None
    actual_start: Optional[datetime] = None
    actual_end: Optional[datetime] = None

    # Analytics
    total_recipients: int = Field(default=0, ge=0)
    sent_count: int = Field(default=0, ge=0)
    delivered_count: int = Field(default=0, ge=0)
    opened_count: int = Field(default=0, ge=0)
    clicked_count: int = Field(default=0, ge=0)
    replied_count: int = Field(default=0, ge=0)
    bounced_count: int = Field(default=0, ge=0)
    conversion_count: int = Field(default=0, ge=0)

    # Budget and ROI
    budget: Optional[float] = Field(default=None, ge=0)
    spent: float = Field(default=0, ge=0)
    revenue: float = Field(default=0, ge=0)
    roi: Optional[float] = None

    # Ownership
    owner_id: Optional[int] = Field(default=None, foreign_key="users.id", index=True)
    team_id: Optional[int] = Field(default=None, foreign_key="teams.id")

    # Settings
    settings: Optional[str] = Field(default=None, sa_column=Column(TEXT))  # JSON configuration
    tags: Optional[str] = Field(default=None, sa_column=Column(TEXT))

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = None
    is_deleted: bool = Field(default=False, index=True)


class Team(SQLModel, table=True):
    """Team/Organization model for multi-tenancy"""

    __tablename__ = "teams"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(min_length=1, max_length=100, index=True)
    slug: str = Field(min_length=1, max_length=100, unique=True, index=True)
    description: Optional[str] = Field(default=None, max_length=500)

    # Settings
    settings: Optional[str] = Field(default=None, sa_column=Column(TEXT))
    subscription_tier: str = Field(default="free", max_length=50)
    max_users: int = Field(default=5, ge=1)
    max_leads: int = Field(default=1000, ge=100)
    max_campaigns: int = Field(default=10, ge=1)

    # Ownership
    owner_id: int = Field(foreign_key="users.id")

    # Status
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class AuditLog(SQLModel, table=True):
    """Comprehensive audit trail for compliance"""

    __tablename__ = "audit_logs"
    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_action", "action"),
        Index("idx_resource", "resource_type", "resource_id"),
        Index("idx_timestamp", "timestamp"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)

    # Who
    user_id: Optional[int] = Field(default=None, foreign_key="users.id", index=True)
    user_email: Optional[str] = Field(default=None, max_length=255)
    ip_address: Optional[str] = Field(default=None, max_length=45)
    user_agent: Optional[str] = Field(default=None, max_length=500)

    # What
    action: str = Field(max_length=100, index=True)  # create, read, update, delete, login, etc.
    resource_type: str = Field(max_length=100, index=True)  # lead, campaign, user, etc.
    resource_id: Optional[int] = Field(default=None, index=True)

    # Details
    changes: Optional[str] = Field(default=None, sa_column=Column(TEXT))  # JSON of before/after
    metadata: Optional[str] = Field(default=None, sa_column=Column(TEXT))  # Additional context

    # When
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)

    # Status
    success: bool = Field(default=True)
    error_message: Optional[str] = Field(default=None, max_length=1000)


class APIKey(SQLModel, table=True):
    """API key management for external integrations"""

    __tablename__ = "api_keys"
    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_key_hash", "key_hash"),
        Index("idx_expires_at", "expires_at"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    team_id: Optional[int] = Field(default=None, foreign_key="teams.id")

    name: str = Field(min_length=1, max_length=100)
    key_hash: str = Field(max_length=255, index=True, unique=True)  # Hashed API key
    key_prefix: str = Field(max_length=10)  # First few chars for identification

    # Permissions
    scopes: Optional[str] = Field(default=None, max_length=500)  # Comma-separated scopes

    # Usage
    last_used: Optional[datetime] = None
    usage_count: int = Field(default=0, ge=0)

    # Lifecycle
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = Field(default=None, index=True)
    revoked_at: Optional[datetime] = None
    is_active: bool = Field(default=True)


class Webhook(SQLModel, table=True):
    """Webhook configuration for event notifications"""

    __tablename__ = "webhooks"
    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_is_active", "is_active"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    team_id: Optional[int] = Field(default=None, foreign_key="teams.id")

    name: str = Field(min_length=1, max_length=100)
    url: str = Field(min_length=1, max_length=500)
    secret: str = Field(max_length=255)  # For HMAC signature

    # Events
    events: str = Field(max_length=1000)  # Comma-separated event types

    # Status
    is_active: bool = Field(default=True, index=True)
    last_triggered: Optional[datetime] = None
    last_success: Optional[datetime] = None
    last_failure: Optional[datetime] = None
    failure_count: int = Field(default=0, ge=0)

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
