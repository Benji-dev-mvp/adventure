"""Webhook system for external integrations."""

import hashlib
import hmac
import json
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional

import httpx
from pydantic import BaseModel, HttpUrl
from sqlalchemy import JSON, Boolean, Column, DateTime, Integer, String, Text

from app.core.db import Base


class WebhookEvent(str, Enum):
    """Webhook event types."""

    CAMPAIGN_CREATED = "campaign.created"
    CAMPAIGN_UPDATED = "campaign.updated"
    CAMPAIGN_SENT = "campaign.sent"
    LEAD_CREATED = "lead.created"
    LEAD_UPDATED = "lead.updated"
    EMAIL_OPENED = "email.opened"
    EMAIL_CLICKED = "email.clicked"
    EMAIL_BOUNCED = "email.bounced"


class Webhook(Base):
    """Webhook subscription model."""

    __tablename__ = "webhooks"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(500), nullable=False)
    secret = Column(String(100), nullable=False)
    events = Column(JSON, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_triggered = Column(DateTime, nullable=True)
    failure_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    timeout_seconds = Column(Integer, default=30)


class WebhookPayload(BaseModel):
    """Webhook payload structure."""

    event: WebhookEvent
    data: Dict[str, Any]
    timestamp: str
    webhook_id: int


class WebhookService:
    """Service for managing and triggering webhooks."""

    @staticmethod
    def generate_signature(payload: dict, secret: str) -> str:
        """Generate HMAC signature for webhook payload."""
        payload_str = json.dumps(payload, sort_keys=True)
        signature = hmac.new(secret.encode(), payload_str.encode(), hashlib.sha256).hexdigest()
        return signature

    @staticmethod
    async def trigger_webhook(
        webhook: Webhook,
        event: WebhookEvent,
        data: Dict[str, Any],
        retry_count: int = 0,
    ) -> bool:
        """Trigger a webhook with payload."""
        if not webhook.is_active:
            return False

        if event not in webhook.events:
            return False

        # Prepare payload
        payload = {
            "event": event,
            "data": data,
            "timestamp": datetime.utcnow().isoformat(),
            "webhook_id": webhook.id,
        }

        # Generate signature
        signature = WebhookService.generate_signature(payload, webhook.secret)

        headers = {
            "Content-Type": "application/json",
            "X-Webhook-Signature": signature,
            "X-Webhook-Event": event,
            "User-Agent": "Enterprise-Webhook/1.0",
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    webhook.url,
                    json=payload,
                    headers=headers,
                    timeout=webhook.timeout_seconds,
                )

                if response.status_code >= 200 and response.status_code < 300:
                    # Success
                    webhook.last_triggered = datetime.utcnow()
                    webhook.failure_count = 0
                    return True
                else:
                    # Failed
                    webhook.failure_count += 1

                    # Retry logic
                    if retry_count < webhook.max_retries:
                        await asyncio.sleep(2**retry_count)  # Exponential backoff
                        return await WebhookService.trigger_webhook(
                            webhook, event, data, retry_count + 1
                        )

                    # Disable after max failures
                    if webhook.failure_count >= 10:
                        webhook.is_active = False

                    return False

        except Exception as e:
            print(f"Webhook error: {e}")
            webhook.failure_count += 1
            return False

    @staticmethod
    async def trigger_event(db_session, event: WebhookEvent, data: Dict[str, Any]):
        """Trigger all webhooks subscribed to an event."""
        webhooks = db_session.query(Webhook).filter(Webhook.is_active == True).all()

        for webhook in webhooks:
            if event in webhook.events:
                await WebhookService.trigger_webhook(webhook, event, data)


# Import asyncio for retry logic
import asyncio
