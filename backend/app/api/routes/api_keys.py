"""
API routes for API key management.
Handles creation, rotation, revocation, and usage tracking.
"""
from fastapi import APIRouter, Depends, HTTPException, Query, Header
from typing import List, Optional
from datetime import datetime, timedelta
from sqlmodel import Session, select

from app.models.api_keys import (
    APIKey, APIKeyCreate, APIKeyResponse, APIKeyCreated,
    APIKeyRotateRequest, APIKeyUsageStats, APIKeyPermission, APIKeyStatus
)
from app.models.user import User, Permission
from app.core.security import get_current_user
from app.core.db import get_session
from app.models.audit import AuditAction
from app.core.audit import create_audit_log

router = APIRouter(prefix="/api-keys", tags=["API Keys"])


@router.get("", response_model=List[APIKeyResponse])
async def list_api_keys(
    workspace_id: Optional[int] = Query(None),
    status: Optional[APIKeyStatus] = Query(None),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    List all API keys for the current user's organization.
    """
    # Build query
    statement = select(APIKey).where(
        APIKey.user_id == current_user.id
    )
    
    if workspace_id:
        statement = statement.where(APIKey.workspace_id == workspace_id)
    
    if status:
        statement = statement.where(APIKey.status == status)
    
    statement = statement.order_by(APIKey.created_at.desc())
    
    keys = session.exec(statement).all()
    
    return [
        APIKeyResponse(
            id=key.id,
            name=key.name,
            key_prefix=key.key_prefix,
            permissions=key.permissions,
            workspace_id=key.workspace_id,
            status=key.status,
            rate_limit=key.rate_limit,
            request_count=key.request_count,
            last_used_at=key.last_used_at,
            created_at=key.created_at,
            expires_at=key.expires_at
        )
        for key in keys
    ]


@router.post("", response_model=APIKeyCreated)
async def create_api_key(
    key_data: APIKeyCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new API key. The key is only shown once.
    """
    # Generate the key
    key_string = APIKey.generate_key()
    key_hash = APIKey.hash_key(key_string)
    key_prefix = APIKey.get_key_prefix(key_string)
    
    # Create the API key record
    api_key = APIKey(
        name=key_data.name,
        key_prefix=key_prefix,
        key_hash=key_hash,
        user_id=current_user.id,
        organization_id=getattr(current_user, 'organization_id', 1),  # TODO: Get from user
        workspace_id=key_data.workspace_id,
        permissions=[p.value for p in key_data.permissions],
        rate_limit=key_data.rate_limit,
        expires_at=key_data.expires_at
    )
    
    session.add(api_key)
    session.commit()
    session.refresh(api_key)
    
    # Audit log
    await create_audit_log(
        action=AuditAction.SYSTEM_CONFIG_CHANGED,
        user_id=current_user.id,
        user_email=current_user.email,
        resource_type="api_key",
        resource_id=api_key.id,
        details={
            "action": "created",
            "key_name": api_key.name,
            "permissions": api_key.permissions
        }
    )
    
    return APIKeyCreated(
        key=key_string,
        id=api_key.id,
        name=api_key.name,
        key_prefix=api_key.key_prefix,
        permissions=api_key.permissions,
        created_at=api_key.created_at,
        expires_at=api_key.expires_at
    )


@router.get("/{key_id}", response_model=APIKeyResponse)
async def get_api_key(
    key_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Get details of a specific API key.
    """
    api_key = session.get(APIKey, key_id)
    
    if not api_key or api_key.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="API key not found")
    
    return APIKeyResponse(
        id=api_key.id,
        name=api_key.name,
        key_prefix=api_key.key_prefix,
        permissions=api_key.permissions,
        workspace_id=api_key.workspace_id,
        status=api_key.status,
        rate_limit=api_key.rate_limit,
        request_count=api_key.request_count,
        last_used_at=api_key.last_used_at,
        created_at=api_key.created_at,
        expires_at=api_key.expires_at
    )


@router.post("/{key_id}/rotate", response_model=APIKeyCreated)
async def rotate_api_key(
    key_id: int,
    rotate_data: Optional[APIKeyRotateRequest] = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Rotate an API key. Creates a new key and revokes the old one.
    """
    old_key = session.get(APIKey, key_id)
    
    if not old_key or old_key.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="API key not found")
    
    if old_key.status != APIKeyStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Can only rotate active keys")
    
    # Generate new key
    key_string = APIKey.generate_key()
    key_hash = APIKey.hash_key(key_string)
    key_prefix = APIKey.get_key_prefix(key_string)
    
    # Update old key data if provided
    new_name = rotate_data.name if rotate_data and rotate_data.name else old_key.name
    new_permissions = (
        [p.value for p in rotate_data.permissions]
        if rotate_data and rotate_data.permissions
        else old_key.permissions
    )
    new_rate_limit = (
        rotate_data.rate_limit
        if rotate_data and rotate_data.rate_limit
        else old_key.rate_limit
    )
    
    # Create new key
    new_key = APIKey(
        name=new_name,
        key_prefix=key_prefix,
        key_hash=key_hash,
        user_id=current_user.id,
        organization_id=old_key.organization_id,
        workspace_id=old_key.workspace_id,
        permissions=new_permissions,
        rate_limit=new_rate_limit,
        rotated_from=old_key.id
    )
    
    # Revoke old key
    old_key.status = APIKeyStatus.REVOKED
    old_key.revoked_at = datetime.utcnow()
    old_key.revoked_by = current_user.id
    old_key.revoke_reason = "Rotated to new key"
    
    session.add(new_key)
    session.commit()
    session.refresh(new_key)
    
    # Audit log
    await create_audit_log(
        action=AuditAction.SYSTEM_CONFIG_CHANGED,
        user_id=current_user.id,
        user_email=current_user.email,
        resource_type="api_key",
        resource_id=new_key.id,
        details={
            "action": "rotated",
            "old_key_id": old_key.id,
            "new_key_id": new_key.id
        }
    )
    
    return APIKeyCreated(
        key=key_string,
        id=new_key.id,
        name=new_key.name,
        key_prefix=new_key.key_prefix,
        permissions=new_key.permissions,
        created_at=new_key.created_at,
        expires_at=new_key.expires_at
    )


@router.delete("/{key_id}")
async def revoke_api_key(
    key_id: int,
    reason: Optional[str] = Query(None, max_length=500),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Revoke an API key. This action cannot be undone.
    """
    api_key = session.get(APIKey, key_id)
    
    if not api_key or api_key.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="API key not found")
    
    if api_key.status == APIKeyStatus.REVOKED:
        raise HTTPException(status_code=400, detail="Key is already revoked")
    
    # Revoke the key
    api_key.status = APIKeyStatus.REVOKED
    api_key.revoked_at = datetime.utcnow()
    api_key.revoked_by = current_user.id
    api_key.revoke_reason = reason or "Manually revoked"
    
    session.commit()
    
    # Audit log
    await create_audit_log(
        action=AuditAction.SYSTEM_CONFIG_CHANGED,
        user_id=current_user.id,
        user_email=current_user.email,
        resource_type="api_key",
        resource_id=api_key.id,
        details={
            "action": "revoked",
            "key_name": api_key.name,
            "reason": api_key.revoke_reason
        }
    )
    
    return {"message": "API key revoked successfully", "key_id": key_id}


@router.get("/{key_id}/usage", response_model=APIKeyUsageStats)
async def get_api_key_usage(
    key_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Get usage statistics for an API key.
    """
    api_key = session.get(APIKey, key_id)
    
    if not api_key or api_key.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="API key not found")
    
    # TODO: Implement actual usage tracking from metrics/logs
    # For now, return basic stats from the key itself
    days_active = (datetime.utcnow() - api_key.created_at).days or 1
    avg_requests_per_day = api_key.request_count / days_active
    
    return APIKeyUsageStats(
        key_id=api_key.id,
        key_name=api_key.name,
        total_requests=api_key.request_count,
        requests_last_hour=0,  # TODO: Track from metrics
        requests_last_day=0,  # TODO: Track from metrics
        last_used_at=api_key.last_used_at,
        average_requests_per_day=round(avg_requests_per_day, 2)
    )
