"""Webhook service for event-driven integrations."""
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from sqlmodel import Session, select
from fastapi import HTTPException
import httpx
import json
import logging
import asyncio

from app.models.db.webhook import (
    Webhook,
    WebhookCreate,
    WebhookUpdate,
    WebhookDeliveryAttempt,
    WebhookEventType,
)

logger = logging.getLogger(__name__)


class WebhookService:
    """Service for managing webhooks and deliveries."""
    
    MAX_RETRY_ATTEMPTS = 5
    RETRY_DELAYS = [60, 300, 900, 3600, 7200]  # 1min, 5min, 15min, 1hr, 2hr
    
    @staticmethod
    def create_webhook(
        session: Session,
        tenant_id: int,
        webhook_data: WebhookCreate,
        user_id: Optional[int] = None
    ) -> Webhook:
        """Create a new webhook."""
        # Generate secret
        secret = Webhook.generate_secret()
        
        # Convert event types list to comma-separated string
        event_types_str = ",".join(webhook_data.event_types)
        
        webhook = Webhook(
            tenant_id=tenant_id,
            user_id=user_id,
            label=webhook_data.label,
            target_url=webhook_data.target_url,
            secret=secret,
            event_types=event_types_str,
        )
        
        session.add(webhook)
        session.commit()
        session.refresh(webhook)
        
        return webhook
    
    @staticmethod
    def list_webhooks(
        session: Session,
        tenant_id: int,
        include_inactive: bool = False
    ) -> List[Webhook]:
        """List all webhooks for a tenant."""
        query = select(Webhook).where(Webhook.tenant_id == tenant_id)
        
        if not include_inactive:
            query = query.where(Webhook.is_active == True)
        
        return list(session.exec(query).all())
    
    @staticmethod
    def get_webhook(session: Session, tenant_id: int, webhook_id: int) -> Optional[Webhook]:
        """Get a specific webhook."""
        return session.exec(
            select(Webhook)
            .where(Webhook.id == webhook_id)
            .where(Webhook.tenant_id == tenant_id)
        ).first()
    
    @staticmethod
    def update_webhook(
        session: Session,
        tenant_id: int,
        webhook_id: int,
        webhook_data: WebhookUpdate
    ) -> Webhook:
        """Update a webhook."""
        webhook = session.exec(
            select(Webhook)
            .where(Webhook.id == webhook_id)
            .where(Webhook.tenant_id == tenant_id)
        ).first()
        
        if not webhook:
            raise HTTPException(status_code=404, detail="Webhook not found")
        
        update_dict = webhook_data.dict(exclude_unset=True)
        
        # Handle event_types list conversion
        if "event_types" in update_dict and update_dict["event_types"]:
            update_dict["event_types"] = ",".join(update_dict["event_types"])
        
        for key, value in update_dict.items():
            setattr(webhook, key, value)
        
        webhook.updated_at = datetime.utcnow()
        session.add(webhook)
        session.commit()
        session.refresh(webhook)
        
        return webhook
    
    @staticmethod
    def delete_webhook(session: Session, tenant_id: int, webhook_id: int) -> bool:
        """Delete a webhook."""
        webhook = session.exec(
            select(Webhook)
            .where(Webhook.id == webhook_id)
            .where(Webhook.tenant_id == tenant_id)
        ).first()
        
        if not webhook:
            raise HTTPException(status_code=404, detail="Webhook not found")
        
        session.delete(webhook)
        session.commit()
        
        return True
    
    @staticmethod
    async def trigger_event(
        session: Session,
        tenant_id: int,
        event_type: str,
        payload: Dict[str, Any]
    ) -> None:
        """Trigger webhooks for an event.
        
        Finds all active webhooks subscribed to this event type
        and queues delivery attempts.
        """
        # Find webhooks subscribed to this event
        webhooks = session.exec(
            select(Webhook)
            .where(Webhook.tenant_id == tenant_id)
            .where(Webhook.is_active == True)
        ).all()
        
        for webhook in webhooks:
            event_types = webhook.event_types.split(",")
            
            # Check if webhook is subscribed to this event
            if event_type in event_types or "*" in event_types:
                # Queue delivery (in background)
                asyncio.create_task(
                    WebhookService._deliver_webhook(session, webhook, event_type, payload)
                )
    
    @staticmethod
    async def _deliver_webhook(
        session: Session,
        webhook: Webhook,
        event_type: str,
        payload: Dict[str, Any],
        attempt_number: int = 1
    ) -> None:
        """Deliver webhook payload to target URL."""
        # Create delivery attempt record
        attempt = WebhookDeliveryAttempt(
            webhook_id=webhook.id,
            event_type=event_type,
            payload=json.dumps(payload),
            attempt_number=attempt_number,
        )
        
        # Prepare webhook payload
        webhook_payload = {
            "event": event_type,
            "data": payload,
            "timestamp": datetime.utcnow().isoformat(),
            "webhook_id": webhook.id,
        }
        
        # Generate signature
        signature = Webhook.generate_signature(webhook_payload, webhook.secret)
        
        try:
            # Send webhook with timeout
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    webhook.target_url,
                    json=webhook_payload,
                    headers={
                        "X-Webhook-Signature": signature,
                        "X-Webhook-Event": event_type,
                        "Content-Type": "application/json",
                    }
                )
                
                attempt.status_code = response.status_code
                attempt.response_body = response.text[:1000]  # Truncate
                attempt.success = 200 <= response.status_code < 300
                attempt.delivered_at = datetime.utcnow()
                
                if attempt.success:
                    webhook.last_success_at = datetime.utcnow()
                    webhook.failure_count = 0
                else:
                    webhook.last_failure_at = datetime.utcnow()
                    webhook.failure_count += 1
                    attempt.error_message = f"HTTP {response.status_code}"
                
        except Exception as e:
            logger.error(f"Webhook delivery failed: {e}")
            attempt.success = False
            attempt.error_message = str(e)[:1000]
            webhook.last_failure_at = datetime.utcnow()
            webhook.failure_count += 1
        
        # Save attempt
        webhook.last_delivery_at = datetime.utcnow()
        session.add(attempt)
        session.add(webhook)
        session.commit()
        
        # Check if webhook should be disabled
        if webhook.failure_count >= webhook.max_failures:
            webhook.is_active = False
            session.add(webhook)
            session.commit()
            logger.warning(f"Webhook {webhook.id} disabled after {webhook.failure_count} failures")
        
        # Schedule retry if needed
        if not attempt.success and attempt_number < WebhookService.MAX_RETRY_ATTEMPTS:
            retry_delay = WebhookService.RETRY_DELAYS[attempt_number - 1]
            attempt.next_retry_at = datetime.utcnow() + timedelta(seconds=retry_delay)
            session.add(attempt)
            session.commit()
            
            # In production, use a task queue (Celery, etc.)
            # For now, just log
            logger.info(f"Webhook retry scheduled for {attempt.next_retry_at}")
    
    @staticmethod
    async def replay_webhook(
        session: Session,
        tenant_id: int,
        webhook_id: int,
        delivery_id: int
    ) -> bool:
        """Replay a failed webhook delivery."""
        # Get webhook
        webhook = session.exec(
            select(Webhook)
            .where(Webhook.id == webhook_id)
            .where(Webhook.tenant_id == tenant_id)
        ).first()
        
        if not webhook:
            raise HTTPException(status_code=404, detail="Webhook not found")
        
        # Get delivery attempt
        attempt = session.get(WebhookDeliveryAttempt, delivery_id)
        
        if not attempt or attempt.webhook_id != webhook_id:
            raise HTTPException(status_code=404, detail="Delivery attempt not found")
        
        # Parse payload
        payload = json.loads(attempt.payload)
        
        # Trigger new delivery
        await WebhookService._deliver_webhook(
            session,
            webhook,
            attempt.event_type,
            payload,
            attempt_number=1  # Start from attempt 1
        )
        
        return True


# Singleton instance
webhook_service = WebhookService()
