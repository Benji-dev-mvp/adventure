"""
Activity Event Models

SQLModel definitions for the Activity Event Spine architecture.
"""

from datetime import datetime
from typing import Optional, Dict, Any, List
from sqlmodel import SQLModel, Field, Column, JSON
from enum import Enum


class EventType(str, Enum):
    """Event Types - Categories of activity events"""
    # Campaign Events
    CAMPAIGN_LAUNCHED = "campaign_launched"
    CAMPAIGN_PAUSED = "campaign_paused"
    CAMPAIGN_COMPLETED = "campaign_completed"
    CAMPAIGN_FAILING = "campaign_failing"
    
    # Lead Events
    LEAD_CREATED = "lead_created"
    LEAD_UPDATED = "lead_updated"
    LEAD_SCORED = "lead_scored"
    LEAD_HIGH_INTENT = "lead_high_intent"
    LEAD_REPLIED = "lead_replied"
    LEAD_MEETING_BOOKED = "lead_meeting_booked"
    LEAD_ASSIGNED = "lead_assigned"
    
    # Email Events
    EMAIL_SENT = "email_sent"
    EMAIL_OPENED = "email_opened"
    EMAIL_CLICKED = "email_clicked"
    EMAIL_REPLIED = "email_replied"
    EMAIL_BOUNCED = "email_bounced"
    EMAIL_UNSUBSCRIBED = "email_unsubscribed"
    
    # Call Events
    CALL_SCHEDULED = "call_scheduled"
    CALL_COMPLETED = "call_completed"
    CALL_MISSED = "call_missed"
    
    # AI Events
    AI_OPTIMIZATION = "ai_optimization"
    AI_SCORING = "ai_scoring"
    AI_RECOMMENDATION = "ai_recommendation"
    
    # System Events
    SYSTEM_INTEGRATION_ERROR = "system_integration_error"
    SYSTEM_USAGE_WARNING = "system_usage_warning"
    SYSTEM_SYNC_COMPLETED = "system_sync_completed"


class EventSource(str, Enum):
    """Source Systems - Where events originate"""
    INTERNAL = "internal"
    SALESFORCE = "salesforce"
    HUBSPOT = "hubspot"
    OUTREACH = "outreach"
    SALESLOFT = "salesloft"
    APOLLO = "apollo"
    GONG = "gong"
    ZOOM = "zoom"
    CALENDLY = "calendly"
    LINKEDIN = "linkedin"
    GMAIL = "gmail"
    SENDGRID = "sendgrid"
    TWILIO = "twilio"
    WEBHOOK = "webhook"
    AI_ENGINE = "ai_engine"


class EventStatus(str, Enum):
    """Event Status"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class EventPriority(str, Enum):
    """Event Priority/Severity"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ActivityEventBase(SQLModel):
    """Base model for Activity Events"""
    # Multi-tenancy
    tenant_id: str = Field(index=True)
    
    # Event classification
    type: EventType = Field(index=True)
    source: EventSource = Field(index=True)
    status: EventStatus = Field(default=EventStatus.COMPLETED, index=True)
    priority: EventPriority = Field(default=EventPriority.MEDIUM, index=True)
    
    # Source tracking (for idempotency and tracing)
    source_system: str = Field(index=True)
    source_object_id: str = Field(index=True)
    source_object_type: Optional[str] = None
    
    # Event payload
    title: str
    description: str
    metadata: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    
    # Entity relationships
    entity_id: Optional[str] = Field(default=None, index=True)
    entity_type: Optional[str] = Field(default=None, index=True)
    
    # User context
    user_id: Optional[str] = Field(default=None, index=True)
    user_name: Optional[str] = None
    
    # Temporal data
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)
    expires_at: Optional[datetime] = None
    
    # Idempotency
    idempotency_key: str = Field(unique=True, index=True)
    
    # Read tracking
    read: bool = Field(default=False, index=True)
    read_at: Optional[datetime] = None
    
    # Additional context
    tags: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    correlation_id: Optional[str] = Field(default=None, index=True)


class ActivityEvent(ActivityEventBase, table=True):
    """Activity Event - Immutable event stored in the database"""
    __tablename__ = "activity_events"
    
    id: Optional[str] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)


class ActivityEventCreate(SQLModel):
    """Schema for creating a new activity event"""
    tenant_id: str
    type: EventType
    source: EventSource
    source_system: str
    source_object_id: str
    source_object_type: Optional[str] = None
    title: str
    description: str
    metadata: Optional[Dict[str, Any]] = None
    entity_id: Optional[str] = None
    entity_type: Optional[str] = None
    user_id: Optional[str] = None
    user_name: Optional[str] = None
    timestamp: Optional[datetime] = None
    priority: Optional[EventPriority] = EventPriority.MEDIUM
    tags: Optional[List[str]] = None
    correlation_id: Optional[str] = None


class ActivityEventRead(ActivityEventBase):
    """Schema for reading an activity event"""
    id: str
    created_at: datetime


class ActivityEventUpdate(SQLModel):
    """Schema for updating an activity event (limited fields)"""
    read: Optional[bool] = None
    read_at: Optional[datetime] = None
    status: Optional[EventStatus] = None


class ActivityStats(SQLModel):
    """Activity statistics"""
    total: int
    unread: int
    by_type: Dict[str, int] = Field(default_factory=dict)
    by_source: Dict[str, int] = Field(default_factory=dict)
    by_priority: Dict[str, int] = Field(default_factory=dict)
