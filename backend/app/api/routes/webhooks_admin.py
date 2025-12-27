"""
API routes for webhook management.
Handles webhook subscriptions, delivery tracking, and testing.
"""
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from typing import List, Optional
from datetime import datetime
from sqlmodel import Session, select
import httpx

from app.models.webhooks import (
    WebhookSubscription, WebhookDelivery, WebhookLog,
    WebhookCreate, WebhookUpdate, WebhookResponse, WebhookCreated,
    WebhookTestRequest, WebhookDeliveryResponse,
    WebhookEvent, WebhookStatus, DeliveryStatus
)
from app.models.user import User
from app.core.security import get_current_user
from app.core.db import get_session
from app.models.audit import AuditAction
from app.core.audit import create_audit_log

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


@router.get("", response_model=List[WebhookResponse])
async def list_webhooks(
    workspace_id: Optional[int] = Query(None),
    status: Optional[WebhookStatus] = Query(None),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    List all webhooks for the current user's organization.
    """
    statement = select(WebhookSubscription).where(
        WebhookSubscription.user_id == current_user.id
    )
    
    if workspace_id:
        statement = statement.where(WebhookSubscription.workspace_id == workspace_id)
    
    if status:
        statement = statement.where(WebhookSubscription.status == status)
    
    statement = statement.order_by(WebhookSubscription.created_at.desc())
    
    webhooks = session.exec(statement).all()
    
    return [
        WebhookResponse(
            id=wh.id,
            url=wh.url,
            events=wh.events,
            status=wh.status,
            workspace_id=wh.workspace_id,
            total_deliveries=wh.total_deliveries,
            successful_deliveries=wh.successful_deliveries,
            failed_deliveries=wh.failed_deliveries,
            last_triggered_at=wh.last_triggered_at,
            created_at=wh.created_at
        )
        for wh in webhooks
    ]


@router.post("", response_model=WebhookCreated)
async def create_webhook(
    webhook_data: WebhookCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new webhook subscription.
    """
    # Validate URL starts with https
    if not webhook_data.url.startswith("https://"):
        raise HTTPException(
            status_code=400,
            detail="Webhook URL must use HTTPS for security"
        )
    
    # Generate secret
    secret = WebhookSubscription.generate_secret()
    
    # Create webhook
    webhook = WebhookSubscription(
        url=webhook_data.url,
        secret=secret,
        events=[e.value for e in webhook_data.events],
        user_id=current_user.id,
        organization_id=getattr(current_user, 'organization_id', 1),
        workspace_id=webhook_data.workspace_id,
        timeout_seconds=webhook_data.timeout_seconds,
        max_retries=webhook_data.max_retries
    )
    
    session.add(webhook)
    session.commit()
    session.refresh(webhook)
    
    # Audit log
    await create_audit_log(
        action=AuditAction.SYSTEM_CONFIG_CHANGED,
        user_id=current_user.id,
        user_email=current_user.email,
        resource_type="webhook",
        resource_id=webhook.id,
        details={
            "action": "created",
            "url": webhook.url,
            "events": webhook.events
        }
    )
    
    return WebhookCreated(
        id=webhook.id,
        url=webhook.url,
        events=webhook.events,
        secret=secret,
        created_at=webhook.created_at
    )


@router.get("/{webhook_id}", response_model=WebhookResponse)
async def get_webhook(
    webhook_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Get details of a specific webhook.
    """
    webhook = session.get(WebhookSubscription, webhook_id)
    
    if not webhook or webhook.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    return WebhookResponse(
        id=webhook.id,
        url=webhook.url,
        events=webhook.events,
        status=webhook.status,
        workspace_id=webhook.workspace_id,
        total_deliveries=webhook.total_deliveries,
        successful_deliveries=webhook.successful_deliveries,
        failed_deliveries=webhook.failed_deliveries,
        last_triggered_at=webhook.last_triggered_at,
        created_at=webhook.created_at
    )


@router.patch("/{webhook_id}", response_model=WebhookResponse)
async def update_webhook(
    webhook_id: int,
    webhook_data: WebhookUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Update a webhook subscription.
    """
    webhook = session.get(WebhookSubscription, webhook_id)
    
    if not webhook or webhook.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    # Update fields
    if webhook_data.url:
        if not webhook_data.url.startswith("https://"):
            raise HTTPException(
                status_code=400,
                detail="Webhook URL must use HTTPS"
            )
        webhook.url = webhook_data.url
    
    if webhook_data.events is not None:
        webhook.events = [e.value for e in webhook_data.events]
    
    if webhook_data.status is not None:
        webhook.status = webhook_data.status
    
    if webhook_data.timeout_seconds is not None:
        webhook.timeout_seconds = webhook_data.timeout_seconds
    
    if webhook_data.max_retries is not None:
        webhook.max_retries = webhook_data.max_retries
    
    webhook.updated_at = datetime.utcnow()
    
    session.commit()
    session.refresh(webhook)
    
    # Audit log
    await create_audit_log(
        action=AuditAction.SYSTEM_CONFIG_CHANGED,
        user_id=current_user.id,
        user_email=current_user.email,
        resource_type="webhook",
        resource_id=webhook.id,
        details={
            "action": "updated",
            "changes": webhook_data.dict(exclude_unset=True)
        }
    )
    
    return WebhookResponse(
        id=webhook.id,
        url=webhook.url,
        events=webhook.events,
        status=webhook.status,
        workspace_id=webhook.workspace_id,
        total_deliveries=webhook.total_deliveries,
        successful_deliveries=webhook.successful_deliveries,
        failed_deliveries=webhook.failed_deliveries,
        last_triggered_at=webhook.last_triggered_at,
        created_at=webhook.created_at
    )


@router.delete("/{webhook_id}")
async def delete_webhook(
    webhook_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a webhook subscription.
    """
    webhook = session.get(WebhookSubscription, webhook_id)
    
    if not webhook or webhook.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    session.delete(webhook)
    session.commit()
    
    # Audit log
    await create_audit_log(
        action=AuditAction.SYSTEM_CONFIG_CHANGED,
        user_id=current_user.id,
        user_email=current_user.email,
        resource_type="webhook",
        resource_id=webhook_id,
        details={
            "action": "deleted",
            "url": webhook.url
        }
    )
    
    return {"message": "Webhook deleted successfully", "webhook_id": webhook_id}


@router.post("/{webhook_id}/test")
async def test_webhook(
    webhook_id: int,
    test_request: WebhookTestRequest,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Send a test payload to the webhook.
    """
    webhook = session.get(WebhookSubscription, webhook_id)
    
    if not webhook or webhook.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    # Create test payload
    test_payload = {
        "event": test_request.event.value,
        "data": test_request.test_data or {
            "test": True,
            "message": "This is a test webhook delivery"
        },
        "timestamp": datetime.utcnow().isoformat(),
        "webhook_id": webhook.id
    }
    
    # Generate signature
    signature = WebhookSubscription.generate_signature(test_payload, webhook.secret)
    
    # Send in background
    background_tasks.add_task(
        send_webhook_delivery,
        webhook.url,
        test_payload,
        signature,
        webhook.timeout_seconds
    )
    
    return {
        "message": "Test webhook queued for delivery",
        "webhook_id": webhook_id,
        "event": test_request.event.value
    }


@router.get("/{webhook_id}/deliveries", response_model=List[WebhookDeliveryResponse])
async def list_webhook_deliveries(
    webhook_id: int,
    status: Optional[DeliveryStatus] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    List delivery attempts for a webhook.
    """
    webhook = session.get(WebhookSubscription, webhook_id)
    
    if not webhook or webhook.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    statement = select(WebhookDelivery).where(
        WebhookDelivery.webhook_id == webhook_id
    )
    
    if status:
        statement = statement.where(WebhookDelivery.status == status)
    
    statement = statement.order_by(WebhookDelivery.created_at.desc()).limit(limit)
    
    deliveries = session.exec(statement).all()
    
    return [
        WebhookDeliveryResponse(
            id=d.id,
            event=d.event.value,
            status=d.status,
            attempt_count=d.attempt_count,
            http_status=d.http_status,
            error_message=d.error_message,
            created_at=d.created_at,
            delivered_at=d.delivered_at,
            next_retry_at=d.next_retry_at
        )
        for d in deliveries
    ]


async def send_webhook_delivery(
    url: str,
    payload: dict,
    signature: str,
    timeout: int = 30
):
    """
    Background task to send webhook delivery.
    """
    headers = {
        "Content-Type": "application/json",
        "X-Webhook-Signature": signature,
        "X-Webhook-Event": payload.get("event", "unknown"),
        "User-Agent": "Enterprise-Webhook/2.0"
    }
    
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(url, json=payload, headers=headers)
            return {
                "status_code": response.status_code,
                "success": response.status_code < 400
            }
    except Exception as e:
        return {
            "status_code": None,
            "success": False,
            "error": str(e)
        }
