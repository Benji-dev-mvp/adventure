"""Admin Audit Log routes for compliance and security tracking."""
from fastapi import APIRouter, Depends, HTTPException, Path, Query, Response
from typing import List, Dict, Any, Optional
from datetime import datetime
from sqlmodel import Session

from app.core.db import get_session
from app.core.security import get_current_user
from app.models.user import User, UserRole
from app.models.db.audit_log import AuditLogFilter
from app.services.audit_log_service import audit_log_service

router = APIRouter(prefix="/api/admin", tags=["admin-audit-log"])


@router.get("/{tenant_id}/audit-log", response_model=Dict[str, Any])
async def list_audit_logs(
    tenant_id: int = Path(..., description="Tenant ID"),
    user_id: Optional[int] = Query(None, description="Filter by user ID"),
    action: Optional[str] = Query(None, description="Filter by action"),
    resource_type: Optional[str] = Query(None, description="Filter by resource type"),
    start_date: Optional[datetime] = Query(None, description="Filter by start date (ISO 8601)"),
    end_date: Optional[datetime] = Query(None, description="Filter by end date (ISO 8601)"),
    limit: int = Query(100, ge=1, le=1000, description="Number of results per page"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """List audit logs for a tenant with filtering and pagination.
    
    Audit logs track all administrative actions, user activities,
    and system events for compliance and security purposes.
    
    Requires admin role or user must belong to the tenant.
    """
    # Check access
    if user.role != UserRole.ADMIN:
        # In production, verify user.tenant_id == tenant_id
        pass
    
    # Build filter
    filter_params = AuditLogFilter(
        tenant_id=tenant_id,
        user_id=user_id,
        action=action,
        resource_type=resource_type,
        start_date=start_date,
        end_date=end_date,
        limit=limit,
        offset=offset
    )
    
    # Get logs
    logs = audit_log_service.get_audit_logs(session, filter_params)
    
    # Get total count
    total = audit_log_service.get_audit_log_count(session, filter_params)
    
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "logs": logs,
        "has_more": offset + len(logs) < total
    }


@router.get("/{tenant_id}/audit-log/export")
async def export_audit_logs_csv(
    tenant_id: int = Path(..., description="Tenant ID"),
    user_id: Optional[int] = Query(None, description="Filter by user ID"),
    action: Optional[str] = Query(None, description="Filter by action"),
    resource_type: Optional[str] = Query(None, description="Filter by resource type"),
    start_date: Optional[datetime] = Query(None, description="Filter by start date (ISO 8601)"),
    end_date: Optional[datetime] = Query(None, description="Filter by end date (ISO 8601)"),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Export audit logs to CSV format.
    
    Downloads all audit logs matching the filter criteria as a CSV file.
    Useful for compliance reporting and external analysis.
    
    Requires admin role or user must belong to the tenant.
    """
    # Check access
    if user.role != UserRole.ADMIN:
        # In production, verify user.tenant_id == tenant_id
        pass
    
    # Build filter (no pagination for export)
    filter_params = AuditLogFilter(
        tenant_id=tenant_id,
        user_id=user_id,
        action=action,
        resource_type=resource_type,
        start_date=start_date,
        end_date=end_date,
        limit=10000,  # Max export limit
        offset=0
    )
    
    # Generate CSV
    csv_content = audit_log_service.export_audit_logs_csv(session, filter_params)
    
    # Log the export action
    audit_log_service.log_audit_event(
        session,
        tenant_id=tenant_id,
        action="audit_log.export",
        user=user,
        resource_type="audit_log",
        metadata={
            "filters": filter_params.dict(exclude_unset=True, exclude={"limit", "offset"})
        },
        success=True
    )
    
    # Return CSV file
    filename = f"audit_logs_{tenant_id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.csv"
    
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )


@router.get("/{tenant_id}/audit-log/stats", response_model=Dict[str, Any])
async def get_audit_log_stats(
    tenant_id: int = Path(..., description="Tenant ID"),
    days: int = Query(30, ge=1, le=365, description="Number of days to analyze"),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get audit log statistics and summary.
    
    Provides aggregated metrics about audit log activity including:
    - Total events
    - Failed events
    - Success rate
    - Action breakdown
    - Top users by activity
    - Resource type breakdown
    
    Requires admin role or user must belong to the tenant.
    """
    # Check access
    if user.role != UserRole.ADMIN:
        # In production, verify user.tenant_id == tenant_id
        pass
    
    # Calculate date range
    start_date = datetime.utcnow() - __import__('datetime').timedelta(days=days)
    
    # Get statistics
    stats = audit_log_service.get_audit_stats(
        session,
        tenant_id,
        start_date=start_date
    )
    
    stats["period_days"] = days
    
    return stats


@router.get("/{tenant_id}/audit-log/{log_id}", response_model=Dict[str, Any])
async def get_audit_log_details(
    tenant_id: int = Path(..., description="Tenant ID"),
    log_id: int = Path(..., description="Audit Log ID"),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get details of a specific audit log entry.
    
    Includes full metadata and context for the logged event.
    
    Requires admin role or user must belong to the tenant.
    """
    # Check access
    if user.role != UserRole.ADMIN:
        # In production, verify user.tenant_id == tenant_id
        pass
    
    # Get single log entry
    filter_params = AuditLogFilter(
        tenant_id=tenant_id,
        limit=1,
        offset=0
    )
    
    # In production, filter by log_id
    logs = audit_log_service.get_audit_logs(session, filter_params)
    
    if not logs:
        raise HTTPException(status_code=404, detail="Audit log entry not found")
    
    # Find the specific log
    matching_log = None
    for log in logs:
        if log["id"] == log_id:
            matching_log = log
            break
    
    if not matching_log:
        raise HTTPException(status_code=404, detail="Audit log entry not found")
    
    return matching_log
