from datetime import datetime
from enum import Enum
from typing import Any, Dict, Optional

from pydantic import BaseModel


class AuditAction(str, Enum):
    """Audit action types"""

    # Authentication
    LOGIN = "auth.login"
    LOGOUT = "auth.logout"
    LOGIN_FAILED = "auth.login_failed"

    # Campaign actions
    CAMPAIGN_CREATED = "campaign.created"
    CAMPAIGN_UPDATED = "campaign.updated"
    CAMPAIGN_DELETED = "campaign.deleted"
    CAMPAIGN_SENT = "campaign.sent"
    CAMPAIGN_PAUSED = "campaign.paused"

    # Lead actions
    LEAD_CREATED = "lead.created"
    LEAD_UPDATED = "lead.updated"
    LEAD_DELETED = "lead.deleted"
    LEAD_IMPORTED = "lead.imported"
    LEAD_EXPORTED = "lead.exported"

    # User management
    USER_CREATED = "user.created"
    USER_UPDATED = "user.updated"
    USER_DELETED = "user.deleted"
    USER_ROLE_CHANGED = "user.role_changed"

    # Settings
    SETTINGS_UPDATED = "settings.updated"

    # System
    SYSTEM_CONFIG_CHANGED = "system.config_changed"


class AuditLog(BaseModel):
    """Audit log entry"""

    id: int
    action: AuditAction
    user_id: Optional[int] = None
    user_email: Optional[str] = None
    resource_type: Optional[str] = None  # "campaign", "lead", "user", etc.
    resource_id: Optional[int] = None
    details: Optional[Dict[str, Any]] = None  # JSON details
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    timestamp: datetime
    success: bool = True
    error_message: Optional[str] = None


class AuditLogCreate(BaseModel):
    """Create audit log entry"""

    action: AuditAction
    user_id: Optional[int] = None
    user_email: Optional[str] = None
    resource_type: Optional[str] = None
    resource_id: Optional[int] = None
    details: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    success: bool = True
    error_message: Optional[str] = None


class AuditLogFilter(BaseModel):
    """Filter for audit logs"""

    user_id: Optional[int] = None
    action: Optional[AuditAction] = None
    resource_type: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    limit: int = 100
    offset: int = 0
