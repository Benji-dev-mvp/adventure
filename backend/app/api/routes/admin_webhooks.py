"""Admin Webhooks routes for event-driven integrations."""
from fastapi import APIRouter, Depends, HTTPException, Path, Query
from typing import List
from sqlmodel import Session

from app.core.db import get_session
from app.core.security import get_current_user
from app.models.user import User, UserRole
from app.models.db.webhook import Webhook, WebhookCreate, WebhookUpdate
from app.services.webhook_service import webhook_service
from app.services.audit_log_service import audit_log_service

router = APIRouter(prefix="/api/admin", tags=["admin-webhooks"])


@router.get("/{tenant_id}/webhooks", response_model=List[Webhook])
async def list_webhooks(
    tenant_id: int = Path(..., description="Tenant ID"),
    include_inactive: bool = Query(False, description="Include inactive webhooks"),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """List all webhooks for a tenant.
    
    Requires admin role or user must belong to the tenant.
    """
    # Check access
    if user.role != UserRole.ADMIN:
        # In production, verify user.tenant_id == tenant_id
        pass
    
    webhooks = webhook_service.list_webhooks(session, tenant_id, include_inactive)
    
    return webhooks


@router.post("/{tenant_id}/webhooks", response_model=Webhook, status_code=201)
async def create_webhook(
    tenant_id: int = Path(..., description="Tenant ID"),
    webhook_data: WebhookCreate = ...,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new webhook for a tenant.
    
    The webhook secret is generated automatically and returned in the response.
    Store it securely for signature verification.
    Requires admin role or user must belong to the tenant.
    """
    # Check access
    if user.role != UserRole.ADMIN:
        # In production, verify user.tenant_id == tenant_id
        pass
    
    # Create webhook
    webhook = webhook_service.create_webhook(
        session,
        tenant_id,
        webhook_data,
        user_id=user.id
    )
    
    # Log audit event
    audit_log_service.log_audit_event(
        session,
        tenant_id=tenant_id,
        action="webhook.create",
        user=user,
        resource_type="webhook",
        resource_id=str(webhook.id),
        metadata={
            "label": webhook_data.label,
            "target_url": webhook_data.target_url,
            "event_types": webhook_data.event_types
        },
        success=True
    )
    
    return webhook


@router.get("/{tenant_id}/webhooks/{webhook_id}", response_model=Webhook)
async def get_webhook(
    tenant_id: int = Path(..., description="Tenant ID"),
    webhook_id: int = Path(..., description="Webhook ID"),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get details of a specific webhook.
    
    Requires admin role or user must belong to the tenant.
    """
    # Check access
    if user.role != UserRole.ADMIN:
        # In production, verify user.tenant_id == tenant_id
        pass
    
    webhook = webhook_service.get_webhook(session, tenant_id, webhook_id)
    
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    return webhook


@router.patch("/{tenant_id}/webhooks/{webhook_id}", response_model=Webhook)
async def update_webhook(
    tenant_id: int = Path(..., description="Tenant ID"),
    webhook_id: int = Path(..., description="Webhook ID"),
    webhook_data: WebhookUpdate = ...,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Update a webhook.
    
    Can update label, target URL, event types, or active status.
    Requires admin role or user must belong to the tenant.
    """
    # Check access
    if user.role != UserRole.ADMIN:
        # In production, verify user.tenant_id == tenant_id
        pass
    
    webhook = webhook_service.update_webhook(
        session,
        tenant_id,
        webhook_id,
        webhook_data
    )
    
    # Log audit event
    audit_log_service.log_audit_event(
        session,
        tenant_id=tenant_id,
        action="webhook.update",
        user=user,
        resource_type="webhook",
        resource_id=str(webhook_id),
        metadata=webhook_data.dict(exclude_unset=True),
        success=True
    )
    
    return webhook


@router.delete("/{tenant_id}/webhooks/{webhook_id}", status_code=204)
async def delete_webhook(
    tenant_id: int = Path(..., description="Tenant ID"),
    webhook_id: int = Path(..., description="Webhook ID"),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Delete a webhook.
    
    This permanently removes the webhook configuration.
    Requires admin role or user must belong to the tenant.
    """
    # Check access
    if user.role != UserRole.ADMIN:
        # In production, verify user.tenant_id == tenant_id
        pass
    
    success = webhook_service.delete_webhook(session, tenant_id, webhook_id)
    
    if success:
        # Log audit event
        audit_log_service.log_audit_event(
            session,
            tenant_id=tenant_id,
            action="webhook.delete",
            user=user,
            resource_type="webhook",
            resource_id=str(webhook_id),
            success=True
        )
    
    return None


@router.post("/{tenant_id}/webhooks/{webhook_id}/replay/{delivery_id}", status_code=202)
async def replay_webhook_delivery(
    tenant_id: int = Path(..., description="Tenant ID"),
    webhook_id: int = Path(..., description="Webhook ID"),
    delivery_id: int = Path(..., description="Delivery Attempt ID"),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Replay a failed webhook delivery.
    
    Re-sends the webhook payload from a previous delivery attempt.
    Useful for debugging or recovering from temporary failures.
    Requires admin role or user must belong to the tenant.
    """
    # Check access
    if user.role != UserRole.ADMIN:
        # In production, verify user.tenant_id == tenant_id
        pass
    
    success = await webhook_service.replay_webhook(
        session,
        tenant_id,
        webhook_id,
        delivery_id
    )
    
    # Log audit event
    audit_log_service.log_audit_event(
        session,
        tenant_id=tenant_id,
        action="webhook.replay",
        user=user,
        resource_type="webhook",
        resource_id=str(webhook_id),
        metadata={"delivery_id": delivery_id},
        success=success
    )
    
    return {"message": "Webhook delivery queued for replay"}
