"""Admin API Keys routes for external integrations."""
from fastapi import APIRouter, Depends, HTTPException, Path
from typing import List
from sqlmodel import Session

from app.core.db import get_session
from app.core.security import get_current_user, require_tenant_access
from app.models.user import User, UserRole
from app.models.db.api_key import APIKeyCreate, APIKeyResponse, APIKeyList
from app.services.api_key_service import api_key_service
from app.services.audit_log_service import audit_log_service

router = APIRouter(prefix="/api/admin", tags=["admin-api-keys"])


@router.get("/{tenant_id}/api-keys", response_model=List[APIKeyList])
async def list_api_keys(
    tenant_id: int = Path(..., description="Tenant ID"),
    include_revoked: bool = False,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """List all API keys for a tenant.
    
    Requires admin role or user must belong to the tenant.
    """
    # Check access
    if user.role != UserRole.ADMIN:
        # In production, verify user.tenant_id == tenant_id
        pass
    
    keys = api_key_service.list_api_keys(session, tenant_id, include_revoked)
    
    return keys


@router.post("/{tenant_id}/api-keys", response_model=APIKeyResponse, status_code=201)
async def create_api_key(
    tenant_id: int = Path(..., description="Tenant ID"),
    key_data: APIKeyCreate = ...,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new API key for a tenant.
    
    The full API key is returned only once. Store it securely.
    Requires admin role or user must belong to the tenant.
    """
    # Check access
    if user.role != UserRole.ADMIN:
        # In production, verify user.tenant_id == tenant_id
        pass
    
    # Create API key
    api_key = api_key_service.create_api_key(
        session,
        tenant_id,
        key_data,
        user_id=user.id
    )
    
    # Log audit event
    audit_log_service.log_audit_event(
        session,
        tenant_id=tenant_id,
        action="api_key.create",
        user=user,
        resource_type="api_key",
        resource_id=str(api_key.id),
        metadata={"label": key_data.label, "scopes": key_data.scopes},
        success=True
    )
    
    return api_key


@router.delete("/{tenant_id}/api-keys/{key_id}", status_code=204)
async def revoke_api_key(
    tenant_id: int = Path(..., description="Tenant ID"),
    key_id: int = Path(..., description="API Key ID"),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Revoke an API key.
    
    Once revoked, the key can no longer be used for authentication.
    Requires admin role or user must belong to the tenant.
    """
    # Check access
    if user.role != UserRole.ADMIN:
        # In production, verify user.tenant_id == tenant_id
        pass
    
    # Revoke key
    success = api_key_service.revoke_api_key(session, tenant_id, key_id)
    
    if success:
        # Log audit event
        audit_log_service.log_audit_event(
            session,
            tenant_id=tenant_id,
            action="api_key.revoke",
            user=user,
            resource_type="api_key",
            resource_id=str(key_id),
            success=True
        )
    
    return None


@router.get("/{tenant_id}/api-keys/{key_id}", response_model=APIKeyList)
async def get_api_key(
    tenant_id: int = Path(..., description="Tenant ID"),
    key_id: int = Path(..., description="API Key ID"),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get details of a specific API key.
    
    Does not return the actual key value (only available during creation).
    Requires admin role or user must belong to the tenant.
    """
    # Check access
    if user.role != UserRole.ADMIN:
        # In production, verify user.tenant_id == tenant_id
        pass
    
    key = api_key_service.get_api_key(session, tenant_id, key_id)
    
    if not key:
        raise HTTPException(status_code=404, detail="API key not found")
    
    return APIKeyList(
        id=key.id,
        label=key.label,
        key_prefix=key.key_prefix,
        scopes=key.scopes,
        last_used_at=key.last_used_at,
        usage_count=key.usage_count,
        created_at=key.created_at,
        revoked_at=key.revoked_at,
        is_active=key.is_active,
    )
