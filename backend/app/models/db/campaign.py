"""Campaign database models."""
from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Column, TEXT, Index
from enum import Enum


class CampaignStatus(str, Enum):
    """Campaign status."""
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class CampaignDB(SQLModel, table=True):
    """Campaign database model with tenant support."""
    __tablename__ = "campaigns_v2"
    __table_args__ = (
        Index("idx_campaign_tenant_id", "tenant_id"),
        Index("idx_campaign_status", "status"),
        Index("idx_campaign_created_at", "created_at"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    tenant_id: int = Field(foreign_key="tenants.id", index=True)
    user_id: Optional[int] = Field(default=None, index=True)
    
    # Basic info
    name: str = Field(min_length=1, max_length=200, index=True)
    objective: str = Field(min_length=1, max_length=2000)
    description: Optional[str] = Field(default=None, sa_column=Column(TEXT))
    
    # Status
    status: CampaignStatus = Field(default=CampaignStatus.DRAFT, index=True)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    scheduled_at: Optional[datetime] = None
    activated_at: Optional[datetime] = None
    
    # Configuration (JSON stored as text)
    config: Optional[str] = Field(default=None, sa_column=Column(TEXT))


class CampaignEvent(SQLModel, table=True):
    """Campaign event tracking."""
    __tablename__ = "campaign_events"
    __table_args__ = (
        Index("idx_event_campaign_id", "campaign_id"),
        Index("idx_event_type", "event_type"),
        Index("idx_event_timestamp", "timestamp"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    campaign_id: int = Field(foreign_key="campaigns_v2.id", index=True)
    tenant_id: int = Field(foreign_key="tenants.id", index=True)
    
    # Event details
    event_type: str = Field(max_length=100, index=True)  # sent, opened, clicked, replied, etc.
    lead_email: Optional[str] = Field(default=None, max_length=255)
    
    # Metadata
    metadata: Optional[str] = Field(default=None, sa_column=Column(TEXT))  # JSON
    
    # Timestamp
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)
