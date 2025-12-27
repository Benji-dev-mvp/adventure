"""
Webhook models for event-driven integrations.
Supports delivery tracking, retries, and dead-letter queue.
"""
from enum import Enum
from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlmodel import SQLModel, Field, Column
from sqlalchemy import JSON, Text
import secrets
import hmac
import hashlib
import json


class WebhookEvent(str, Enum):
    """Webhook event types"""
    # Campaign events
    CAMPAIGN_SENT = "campaign.sent"
    CAMPAIGN_COMPLETED = "campaign.completed"
    CAMPAIGN_PAUSED = "campaign.paused"
    
    # Lead events
    LEAD_CREATED = "lead.created"
    LEAD_UPDATED = "lead.updated"
    LEAD_REPLIED = "lead.replied"
    LEAD_UNSUBSCRIBED = "lead.unsubscribed"
    
    # Meeting events
    MEETING_BOOKED = "meeting.booked"
    MEETING_COMPLETED = "meeting.completed"
    MEETING_CANCELLED = "meeting.cancelled"
    
    # Analytics events
    EMAIL_OPENED = "email.opened"
    EMAIL_CLICKED = "email.clicked"
    EMAIL_BOUNCED = "email.bounced"


class WebhookStatus(str, Enum):
    """Webhook subscription status"""
    ACTIVE = "active"
    PAUSED = "paused"
    DISABLED = "disabled"


class DeliveryStatus(str, Enum):
    """Webhook delivery status"""
    PENDING = "pending"
    DELIVERED = "delivered"
    FAILED = "failed"
    RETRY = "retry"
    DLQ = "dlq"  # Dead Letter Queue


class WebhookSubscription(SQLModel, table=True):
    """
    Webhook subscription configuration.
    Users can subscribe to specific events.
    """
    __tablename__ = "webhook_subscriptions"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    url: str = Field(max_length=500)
    secret: str = Field(max_length=100)  # For HMAC signature verification
    
    # Event filtering
    events: List[str] = Field(default=[], sa_column=Column(JSON))  # List of WebhookEvent values
    
    # Ownership
    user_id: int = Field(foreign_key="users.id", index=True)
    organization_id: int = Field(foreign_key="organizations.id", index=True)
    workspace_id: Optional[int] = Field(default=None, foreign_key="workspaces.id", index=True)
    
    # Configuration
    status: WebhookStatus = Field(default=WebhookStatus.ACTIVE)
    timeout_seconds: int = Field(default=30, ge=1, le=300)
    max_retries: int = Field(default=3, ge=0, le=10)
    retry_delay_seconds: int = Field(default=60)
    
    # Statistics
    total_deliveries: int = Field(default=0)
    successful_deliveries: int = Field(default=0)
    failed_deliveries: int = Field(default=0)
    last_triggered_at: Optional[datetime] = None
    last_success_at: Optional[datetime] = None
    last_failure_at: Optional[datetime] = None
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    @staticmethod
    def generate_secret() -> str:
        """Generate a webhook secret for HMAC signing"""
        return f"whsec_{secrets.token_urlsafe(32)}"
    
    @staticmethod
    def generate_signature(payload: Dict[str, Any], secret: str) -> str:
        """Generate HMAC signature for webhook payload"""
        payload_str = json.dumps(payload, sort_keys=True)
        signature = hmac.new(
            secret.encode(),
            payload_str.encode(),
            hashlib.sha256
        ).hexdigest()
        return signature
    
    def verify_signature(self, payload: Dict[str, Any], signature: str) -> bool:
        """Verify webhook signature"""
        expected = self.generate_signature(payload, self.secret)
        return hmac.compare_digest(expected, signature)


class WebhookDelivery(SQLModel, table=True):
    """
    Individual webhook delivery attempt.
    Tracks retries and eventual success/failure.
    """
    __tablename__ = "webhook_deliveries"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    webhook_id: int = Field(foreign_key="webhook_subscriptions.id", index=True)
    
    # Event data
    event: WebhookEvent = Field(index=True)
    payload: Dict[str, Any] = Field(default={}, sa_column=Column(JSON))
    
    # Delivery tracking
    status: DeliveryStatus = Field(default=DeliveryStatus.PENDING, index=True)
    attempt_count: int = Field(default=0)
    next_retry_at: Optional[datetime] = None
    
    # Response tracking
    http_status: Optional[int] = None
    response_body: Optional[str] = Field(default=None, sa_column=Column(Text))
    error_message: Optional[str] = Field(default=None, sa_column=Column(Text))
    
    # Timing
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    first_attempted_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    failed_at: Optional[datetime] = None
    
    def calculate_next_retry(self, base_delay: int = 60) -> datetime:
        """Calculate next retry time with exponential backoff"""
        from datetime import timedelta
        delay_seconds = base_delay * (2 ** self.attempt_count)  # Exponential backoff
        max_delay = 3600  # 1 hour max
        delay_seconds = min(delay_seconds, max_delay)
        return datetime.utcnow() + timedelta(seconds=delay_seconds)


class WebhookLog(SQLModel, table=True):
    """
    Detailed log of webhook delivery attempts.
    Used for debugging and analytics.
    """
    __tablename__ = "webhook_logs"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    webhook_id: int = Field(foreign_key="webhook_subscriptions.id", index=True)
    delivery_id: int = Field(foreign_key="webhook_deliveries.id", index=True)
    
    # Attempt details
    attempt_number: int
    url: str = Field(max_length=500)
    http_method: str = Field(default="POST", max_length=10)
    headers: Dict[str, str] = Field(default={}, sa_column=Column(JSON))
    
    # Response
    http_status: Optional[int] = None
    response_headers: Dict[str, str] = Field(default={}, sa_column=Column(JSON))
    response_body: Optional[str] = Field(default=None, sa_column=Column(Text))
    
    # Timing
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    duration_ms: Optional[int] = None
    
    # Error tracking
    error: Optional[str] = Field(default=None, sa_column=Column(Text))


# ============================================================================
# Pydantic schemas for API requests/responses
# ============================================================================

class WebhookCreate(SQLModel):
    """Schema for creating a webhook subscription"""
    url: str = Field(min_length=1, max_length=500)
    events: List[WebhookEvent]
    workspace_id: Optional[int] = None
    timeout_seconds: int = Field(default=30, ge=1, le=300)
    max_retries: int = Field(default=3, ge=0, le=10)


class WebhookUpdate(SQLModel):
    """Schema for updating a webhook subscription"""
    url: Optional[str] = None
    events: Optional[List[WebhookEvent]] = None
    status: Optional[WebhookStatus] = None
    timeout_seconds: Optional[int] = None
    max_retries: Optional[int] = None


class WebhookResponse(SQLModel):
    """Response schema for webhook subscription"""
    id: int
    url: str
    events: List[str]
    status: WebhookStatus
    workspace_id: Optional[int]
    total_deliveries: int
    successful_deliveries: int
    failed_deliveries: int
    last_triggered_at: Optional[datetime]
    created_at: datetime


class WebhookCreated(SQLModel):
    """Response when a webhook is created (includes secret once)"""
    id: int
    url: str
    events: List[str]
    secret: str  # Only shown once at creation
    created_at: datetime
    warning: str = "Save this secret now. You'll need it to verify webhook signatures."


class WebhookTestRequest(SQLModel):
    """Schema for testing a webhook"""
    event: WebhookEvent
    test_data: Optional[Dict[str, Any]] = None


class WebhookDeliveryResponse(SQLModel):
    """Response schema for delivery record"""
    id: int
    event: str
    status: DeliveryStatus
    attempt_count: int
    http_status: Optional[int]
    error_message: Optional[str]
    created_at: datetime
    delivered_at: Optional[datetime]
    next_retry_at: Optional[datetime]
