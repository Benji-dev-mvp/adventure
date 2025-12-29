"""Webhook models for event-driven integrations."""
from typing import Optional
from datetime import datetime
from enum import Enum
from sqlmodel import SQLModel, Field, Column, TEXT
import secrets
import hmac
import hashlib
import json


class WebhookEventType(str, Enum):
    """Webhook event types."""
    # Campaign events
    CAMPAIGN_CREATED = "campaign.created"
    CAMPAIGN_UPDATED = "campaign.updated"
    CAMPAIGN_ACTIVATED = "campaign.activated"
    CAMPAIGN_PAUSED = "campaign.paused"
    
    # Lead events
    LEAD_CREATED = "lead.created"
    LEAD_UPDATED = "lead.updated"
    LEAD_STATUS_CHANGED = "lead.status_changed"
    
    # Email events
    EMAIL_SENT = "email.sent"
    EMAIL_OPENED = "email.opened"
    EMAIL_CLICKED = "email.clicked"
    EMAIL_REPLIED = "email.replied"
    EMAIL_BOUNCED = "email.bounced"
    
    # Meeting events
    MEETING_BOOKED = "meeting.booked"
    MEETING_CANCELLED = "meeting.cancelled"


class Webhook(SQLModel, table=True):
    """Webhook configuration model."""
    __tablename__ = "webhooks_v2"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    tenant_id: int = Field(foreign_key="tenants.id", index=True)
    user_id: Optional[int] = Field(default=None, index=True)
    
    # Configuration
    label: str = Field(min_length=1, max_length=200)
    target_url: str = Field(min_length=1, max_length=500)
    secret: str = Field(max_length=255)  # HMAC secret
    
    # Event types (comma-separated)
    event_types: str = Field(max_length=1000)
    
    # Status and tracking
    is_active: bool = Field(default=True, index=True)
    failure_count: int = Field(default=0, ge=0)
    max_failures: int = Field(default=5, ge=1)
    last_delivery_at: Optional[datetime] = None
    last_success_at: Optional[datetime] = None
    last_failure_at: Optional[datetime] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    @staticmethod
    def generate_secret() -> str:
        """Generate webhook secret."""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def generate_signature(payload: dict, secret: str) -> str:
        """Generate HMAC signature for webhook payload."""
        payload_str = json.dumps(payload, sort_keys=True)
        return hmac.new(
            secret.encode(),
            payload_str.encode(),
            hashlib.sha256
        ).hexdigest()


class WebhookCreate(SQLModel):
    """Schema for creating a webhook."""
    label: str = Field(min_length=1, max_length=200)
    target_url: str = Field(min_length=1, max_length=500)
    event_types: list[str]


class WebhookUpdate(SQLModel):
    """Schema for updating a webhook."""
    label: Optional[str] = Field(default=None, min_length=1, max_length=200)
    target_url: Optional[str] = Field(default=None, min_length=1, max_length=500)
    event_types: Optional[list[str]] = None
    is_active: Optional[bool] = None


class WebhookDeliveryAttempt(SQLModel, table=True):
    """Webhook delivery attempt tracking."""
    __tablename__ = "webhook_delivery_attempts"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    webhook_id: int = Field(foreign_key="webhooks_v2.id", index=True)
    
    # Event details
    event_type: str = Field(max_length=100, index=True)
    payload: str = Field(sa_column=Column(TEXT))  # JSON payload
    
    # Delivery status
    success: bool = Field(default=False, index=True)
    status_code: Optional[int] = None
    response_body: Optional[str] = Field(default=None, sa_column=Column(TEXT))
    error_message: Optional[str] = Field(default=None, max_length=1000)
    
    # Retry tracking
    attempt_number: int = Field(default=1, ge=1)
    next_retry_at: Optional[datetime] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    delivered_at: Optional[datetime] = None
