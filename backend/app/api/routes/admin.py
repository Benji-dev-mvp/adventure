"""
Admin endpoints for user management, audit logs, and system administration
"""

from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.audit import create_audit_log, get_audit_logs
from app.core.security import get_current_user, require_permission, require_role
from app.models.audit import AuditAction, AuditLog, AuditLogFilter
from app.models.user import Permission, User, UserCreate, UserRole, UserUpdate

router = APIRouter()


# ============================================================================
# Audit Log Endpoints
# ============================================================================


@router.get("/audit-logs", response_model=dict)
async def list_audit_logs(
    user_id: Optional[int] = Query(None),
    action: Optional[AuditAction] = Query(None),
    resource_type: Optional[str] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
):
    """
    Get audit logs (Admin only)
    """
    # Check permission
    if not current_user.has_permission(Permission.SYSTEM_AUDIT):
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    # Build filter
    filter_params = AuditLogFilter(
        user_id=user_id,
        action=action,
        resource_type=resource_type,
        start_date=start_date,
        end_date=end_date,
        page=page,
        page_size=page_size,
    )

    # Get logs
    logs = get_audit_logs(filter_params)

    return {"total": len(logs), "page": page, "page_size": page_size, "logs": logs}


@router.get("/audit-logs/stats")
async def audit_log_stats(
    days: int = Query(7, ge=1, le=90), current_user: User = Depends(get_current_user)
):
    """
    Get audit log statistics (Admin only)
    """
    if not current_user.has_permission(Permission.SYSTEM_AUDIT):
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    # Get recent logs
    start_date = datetime.now() - timedelta(days=days)
    filter_params = AuditLogFilter(start_date=start_date, page_size=10000)
    logs = get_audit_logs(filter_params)

    # Calculate stats
    total_actions = len(logs)
    failed_actions = sum(1 for log in logs if not log.success)

    # Action breakdown
    action_counts = {}
    for log in logs:
        action = log.action.value
        action_counts[action] = action_counts.get(action, 0) + 1

    # User activity
    user_activity = {}
    for log in logs:
        user_email = log.user_email or "system"
        user_activity[user_email] = user_activity.get(user_email, 0) + 1

    return {
        "period_days": days,
        "total_actions": total_actions,
        "failed_actions": failed_actions,
        "success_rate": (
            round((total_actions - failed_actions) / total_actions * 100, 2)
            if total_actions > 0
            else 100
        ),
        "action_breakdown": action_counts,
        "top_users": sorted(user_activity.items(), key=lambda x: x[1], reverse=True)[:10],
    }


# ============================================================================
# User Management Endpoints
# ============================================================================


@router.get("/users", response_model=List[dict])
async def list_users(
    role: Optional[UserRole] = Query(None),
    is_active: Optional[bool] = Query(None),
    current_user: User = Depends(get_current_user),
):
    """
    List all users (Admin/Manager)
    """
    if not current_user.has_permission(Permission.USER_READ):
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    # TODO: Query database
    # For now, return mock data
    users = [
        {
            "id": 1,
            "email": "admin@company.com",
            "name": "Admin User",
            "role": UserRole.ADMIN.value,
            "is_active": True,
            "created_at": datetime.now().isoformat(),
            "last_login": datetime.now().isoformat(),
        }
    ]

    return users


@router.post("/users", response_model=dict)
async def create_user(user_data: UserCreate, current_user: User = Depends(get_current_user)):
    """
    Create a new user (Admin only)
    """
    if not current_user.has_permission(Permission.USER_CREATE):
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    # TODO: Implement user creation with password hashing
    # For now, return mock response

    # Log the action
    await create_audit_log(
        action=AuditAction.USER_CREATED,
        user_id=current_user.id,
        user_email=current_user.email,
        resource_type="user",
        resource_id=None,
        details={"email": user_data.email, "role": user_data.role.value},
    )

    return {
        "id": 999,
        "email": user_data.email,
        "name": user_data.name,
        "role": user_data.role.value,
        "is_active": True,
        "created_at": datetime.now().isoformat(),
    }


@router.put("/users/{user_id}", response_model=dict)
async def update_user(
    user_id: int, user_data: UserUpdate, current_user: User = Depends(get_current_user)
):
    """
    Update a user (Admin only)
    """
    if not current_user.has_permission(Permission.USER_UPDATE):
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    # TODO: Implement user update
    # Log the action
    await create_audit_log(
        action=AuditAction.USER_UPDATED,
        user_id=current_user.id,
        user_email=current_user.email,
        resource_type="user",
        resource_id=user_id,
        details=user_data.dict(exclude_unset=True),
    )

    return {"message": "User updated successfully"}


@router.delete("/users/{user_id}")
async def delete_user(user_id: int, current_user: User = Depends(get_current_user)):
    """
    Delete/deactivate a user (Admin only)
    """
    if not current_user.has_permission(Permission.USER_DELETE):
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    # Prevent self-deletion
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")

    # TODO: Implement user deletion (soft delete by setting is_active=False)

    # Log the action
    await create_audit_log(
        action=AuditAction.USER_DELETED,
        user_id=current_user.id,
        user_email=current_user.email,
        resource_type="user",
        resource_id=user_id,
    )

    return {"message": "User deleted successfully"}


# ============================================================================
# Role & Permission Endpoints
# ============================================================================


@router.get("/roles")
async def list_roles(current_user: User = Depends(get_current_user)):
    """
    List all available roles and their permissions
    """
    if not current_user.has_permission(Permission.USER_READ):
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    from app.models.user import ROLE_PERMISSIONS

    roles = []
    for role in UserRole:
        permissions = ROLE_PERMISSIONS.get(role, [])
        roles.append(
            {
                "name": role.value,
                "permissions": [p.value for p in permissions],
                "permission_count": len(permissions),
            }
        )

    return {"roles": roles}


@router.get("/permissions/me")
async def my_permissions(current_user: User = Depends(get_current_user)):
    """
    Get current user's permissions
    """
    from app.core.security import get_user_permissions

    permissions = get_user_permissions(current_user)

    return {
        "user_id": current_user.id,
        "email": current_user.email,
        "role": current_user.role.value,
        "permissions": [p.value for p in permissions],
    }
