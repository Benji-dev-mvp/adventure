"""Generic event model for analytics."""
from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Column, TEXT, Index


class Event(SQLModel, table=True):
    """Generic event model for analytics and tracking."""
    __tablename__ = "events"
    __table_args__ = (
        Index("idx_event_tenant_id", "tenant_id"),
        Index("idx_event_type", "event_type"),
        Index("idx_event_timestamp", "timestamp"),
        Index("idx_event_channel", "channel"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    tenant_id: int = Field(foreign_key="tenants.id", index=True)
    
    # Event classification
    event_type: str = Field(max_length=100, index=True)  # send, open, reply, meeting, revenue, etc.
    channel: Optional[str] = Field(default=None, max_length=50, index=True)  # email, linkedin, sms, call
    
    # Related entities
    campaign_id: Optional[int] = None
    lead_id: Optional[int] = None
    user_id: Optional[int] = None
    
    # Metrics
    value: Optional[float] = None  # For revenue tracking
    
    # Additional context (JSON stored as text)
    properties: Optional[str] = Field(default=None, sa_column=Column(TEXT))
    
    # Timestamp
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)


class EventCreate(SQLModel):
    """Schema for creating an event."""
    tenant_id: int
    event_type: str
    channel: Optional[str] = None
    campaign_id: Optional[int] = None
    lead_id: Optional[int] = None
    user_id: Optional[int] = None
    value: Optional[float] = None
    properties: Optional[dict] = None
