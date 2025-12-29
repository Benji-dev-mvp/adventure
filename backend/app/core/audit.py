from datetime import datetime
from functools import wraps
from typing import Any, Callable, Dict, Optional

from fastapi import Request

from app.models.audit import AuditAction, AuditLog, AuditLogCreate
from app.models.user import User

# In-memory storage for demo - replace with database in production
audit_logs: list[AuditLog] = []
audit_log_id_counter = 1


async def create_audit_log(
    action: AuditAction,
    user: Optional[User] = None,
    resource_type: Optional[str] = None,
    resource_id: Optional[int] = None,
    details: Optional[Dict[str, Any]] = None,
    request: Optional[Request] = None,
    success: bool = True,
    error_message: Optional[str] = None,
) -> AuditLog:
    """Create an audit log entry"""
    global audit_log_id_counter

    # Extract request metadata
    ip_address = None
    user_agent = None
    if request:
        ip_address = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")

    log_entry = AuditLog(
        id=audit_log_id_counter,
        action=action,
        user_id=user.id if user else None,
        user_email=user.email if user else None,
        resource_type=resource_type,
        resource_id=resource_id,
        details=details,
        ip_address=ip_address,
        user_agent=user_agent,
        timestamp=datetime.now(),
        success=success,
        error_message=error_message,
    )

    audit_logs.append(log_entry)
    audit_log_id_counter += 1

    return log_entry


def audit_action(
    action: AuditAction,
    resource_type: Optional[str] = None,
    extract_resource_id: Optional[Callable] = None,
):
    """
    Decorator to automatically audit an API endpoint.

    Usage:
        @audit_action(AuditAction.CAMPAIGN_CREATED, resource_type="campaign")
        async def create_campaign(campaign_data: dict, user: User = Depends(get_current_user)):
            ...
    """

    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, request: Request = None, user: User = None, **kwargs):
            try:
                result = await func(*args, request=request, user=user, **kwargs)

                # Extract resource ID if function provided
                resource_id = None
                if extract_resource_id:
                    resource_id = extract_resource_id(result)
                elif isinstance(result, dict) and "id" in result:
                    resource_id = result["id"]

                # Create audit log
                await create_audit_log(
                    action=action,
                    user=user,
                    resource_type=resource_type,
                    resource_id=resource_id,
                    details={"result": str(result)[:500]},  # Truncate large results
                    request=request,
                    success=True,
                )

                return result
            except Exception as e:
                # Log the error
                await create_audit_log(
                    action=action,
                    user=user,
                    resource_type=resource_type,
                    details={"error": str(e)},
                    request=request,
                    success=False,
                    error_message=str(e),
                )
                raise

        return wrapper

    return decorator


async def get_audit_logs(
    user_id: Optional[int] = None,
    action: Optional[AuditAction] = None,
    resource_type: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = 100,
    offset: int = 0,
) -> list[AuditLog]:
    """Query audit logs with filters"""
    filtered_logs = audit_logs

    if user_id:
        filtered_logs = [log for log in filtered_logs if log.user_id == user_id]

    if action:
        filtered_logs = [log for log in filtered_logs if log.action == action]

    if resource_type:
        filtered_logs = [log for log in filtered_logs if log.resource_type == resource_type]

    if start_date:
        filtered_logs = [log for log in filtered_logs if log.timestamp >= start_date]

    if end_date:
        filtered_logs = [log for log in filtered_logs if log.timestamp <= end_date]

    # Sort by timestamp descending
    filtered_logs.sort(key=lambda x: x.timestamp, reverse=True)

    return filtered_logs[offset : offset + limit]
