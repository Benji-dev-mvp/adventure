"""Compliance and GDPR API routes."""
from fastapi import APIRouter, Depends, HTTPException, Response, Path, Query
from fastapi.responses import StreamingResponse, JSONResponse
from typing import Optional
import json
import io
from sqlmodel import Session

from app.core.db import get_session
from app.core.security import get_current_user
from app.models.user import User
from app.services.compliance_service import compliance_service
from app.services.audit_log_service import audit_log_service

router = APIRouter(prefix="/api/compliance", tags=["compliance"])


@router.get("/{tenant_id}/status")
async def get_compliance_status(
    tenant_id: int = Path(..., description="Tenant ID"),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get compliance status for a tenant.
    
    Returns detailed compliance information including:
    - Framework compliance (GDPR, CCPA, etc.)
    - Data inventory
    - Security measures
    - User rights implementation
    """
    # Check access (admin only)
    # In production, verify user.tenant_id == tenant_id or user is admin
    
    report = compliance_service.generate_privacy_report(tenant_id)
    
    # Log access
    audit_log_service.log_audit_event(
        session,
        tenant_id=tenant_id,
        action="compliance.view_status",
        user=user,
        resource_type="compliance",
        success=True
    )
    
    return report


@router.get("/{tenant_id}/data-export")
async def export_user_data(
    tenant_id: int = Path(..., description="Tenant ID"),
    user_id: Optional[int] = Query(None, description="User ID (defaults to current user)"),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Export all user data for GDPR compliance (Right to Data Portability).
    
    Returns a comprehensive JSON file containing all data associated
    with the user, including profile, campaigns, leads, and activity.
    """
    # Determine which user's data to export
    target_user_id = user_id if user_id else user.id
    
    # Check access - users can only export their own data unless admin
    # In production, verify permissions
    
    try:
        # Export data
        data = await compliance_service.export_user_data(
            session,
            tenant_id,
            target_user_id
        )
        
        # Log export
        audit_log_service.log_audit_event(
            session,
            tenant_id=tenant_id,
            action="compliance.data_export",
            user=user,
            resource_type="user_data",
            resource_id=str(target_user_id),
            success=True
        )
        
        # Return as downloadable JSON
        json_data = json.dumps(data, indent=2)
        filename = f"user_data_{tenant_id}_{target_user_id}.json"
        
        return Response(
            content=json_data,
            media_type="application/json",
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
    
    except Exception as e:
        # Log error
        audit_log_service.log_audit_event(
            session,
            tenant_id=tenant_id,
            action="compliance.data_export",
            user=user,
            resource_type="user_data",
            resource_id=str(target_user_id),
            success=False,
            error_message=str(e)
        )
        
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{tenant_id}/delete-account")
async def delete_user_account(
    tenant_id: int = Path(..., description="Tenant ID"),
    user_id: Optional[int] = Query(None, description="User ID (defaults to current user)"),
    reason: Optional[str] = Query(None, description="Reason for deletion"),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Delete user account and all data (Right to be Forgotten).
    
    This operation is irreversible and will delete all user data
    according to the data retention policy.
    """
    # Determine which user to delete
    target_user_id = user_id if user_id else user.id
    
    # Check access - users can only delete their own account unless admin
    # In production, verify permissions
    
    try:
        # Delete data
        success = await compliance_service.delete_user_data(
            session,
            tenant_id,
            target_user_id,
            reason=reason
        )
        
        if success:
            # Log deletion
            audit_log_service.log_audit_event(
                session,
                tenant_id=tenant_id,
                action="compliance.account_delete",
                user=user,
                resource_type="user_data",
                resource_id=str(target_user_id),
                metadata={"reason": reason},
                success=True
            )
            
            return {"message": "Account and data deletion initiated successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to delete account")
    
    except Exception as e:
        # Log error
        audit_log_service.log_audit_event(
            session,
            tenant_id=tenant_id,
            action="compliance.account_delete",
            user=user,
            resource_type="user_data",
            resource_id=str(target_user_id),
            success=False,
            error_message=str(e)
        )
        
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{tenant_id}/privacy-report")
async def get_privacy_report(
    tenant_id: int = Path(..., description="Tenant ID"),
    user: User = Depends(get_current_user)
):
    """Get detailed privacy and compliance report.
    
    Provides comprehensive information about data handling,
    compliance frameworks, and security measures.
    """
    report = compliance_service.generate_privacy_report(tenant_id)
    return report


@router.post("/{tenant_id}/consent")
async def record_consent(
    tenant_id: int = Path(..., description="Tenant ID"),
    consent_type: str = Query(..., description="Type of consent"),
    granted: bool = Query(..., description="Whether consent is granted"),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Record user consent for GDPR compliance.
    
    Tracks user consent for various data processing activities:
    - marketing: Marketing communications
    - analytics: Usage analytics
    - personalization: Personalized content
    - third_party: Third-party data sharing
    """
    record = compliance_service.generate_consent_record(
        tenant_id,
        user.id,
        consent_type,
        granted
    )
    
    # Log consent change
    audit_log_service.log_audit_event(
        session,
        tenant_id=tenant_id,
        action="compliance.consent_change",
        user=user,
        resource_type="consent",
        metadata={
            "consent_type": consent_type,
            "granted": granted
        },
        success=True
    )
    
    return record


@router.get("/{tenant_id}/data-retention")
async def check_data_retention(
    tenant_id: int = Path(..., description="Tenant ID"),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Check data retention compliance.
    
    Returns information about data eligible for deletion or archival
    based on retention policies.
    
    Admin only.
    """
    # Check admin access
    # In production, verify user is admin
    
    status = compliance_service.check_data_retention(session, tenant_id)
    
    return status

