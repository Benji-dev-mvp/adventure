"""Audit log database models."""
from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Column, TEXT, Index
from enum import Enum


class AuditAction(str, Enum):
    """Audit action types."""
    # Authentication
    AUTH_LOGIN = "auth.login"
    AUTH_LOGOUT = "auth.logout"
    AUTH_LOGIN_FAILED = "auth.login_failed"
    
    # Campaign actions
    CAMPAIGN_CREATE = "campaign.create"
    CAMPAIGN_UPDATE = "campaign.update"
    CAMPAIGN_DELETE = "campaign.delete"
    CAMPAIGN_ACTIVATE = "campaign.activate"
    CAMPAIGN_PAUSE = "campaign.pause"
    
    # Lead actions
    LEAD_CREATE = "lead.create"
    LEAD_UPDATE = "lead.update"
    LEAD_DELETE = "lead.delete"
    LEAD_IMPORT = "lead.import"
    LEAD_EXPORT = "lead.export"
    
    # API key actions
    API_KEY_CREATE = "api_key.create"
    API_KEY_REVOKE = "api_key.revoke"
    
    # Webhook actions
    WEBHOOK_CREATE = "webhook.create"
    WEBHOOK_UPDATE = "webhook.update"
    WEBHOOK_DELETE = "webhook.delete"
    
    # User management
    USER_CREATE = "user.create"
    USER_UPDATE = "user.update"
    USER_DELETE = "user.delete"
    USER_ROLE_CHANGE = "user.role_change"
    
    # Settings
    SETTINGS_UPDATE = "settings.update"
    
    # System
    SYSTEM_CONFIG_CHANGE = "system.config_change"


class AuditLogDB(SQLModel, table=True):
    """Audit log database model."""
    __tablename__ = "audit_logs_v2"
    __table_args__ = (
        Index("idx_audit_tenant_id", "tenant_id"),
        Index("idx_audit_user_id", "user_id"),
        Index("idx_audit_action", "action"),
        Index("idx_audit_resource", "resource_type", "resource_id"),
        Index("idx_audit_timestamp", "timestamp"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Tenant isolation
    tenant_id: int = Field(foreign_key="tenants.id", index=True)
    
    # Actor (who)
    user_id: Optional[int] = Field(default=None, index=True)
    user_email: Optional[str] = Field(default=None, max_length=255)
    ip_address: Optional[str] = Field(default=None, max_length=45)
    user_agent: Optional[str] = Field(default=None, max_length=500)
    
    # Action (what)
    action: str = Field(max_length=100, index=True)
    resource_type: Optional[str] = Field(default=None, max_length=100, index=True)
    resource_id: Optional[str] = Field(default=None, max_length=100)
    
    # Details
    metadata: Optional[str] = Field(default=None, sa_column=Column(TEXT))  # JSON
    changes: Optional[str] = Field(default=None, sa_column=Column(TEXT))  # JSON before/after
    
    # Timestamp
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)
    
    # Status
    success: bool = Field(default=True, index=True)
    error_message: Optional[str] = Field(default=None, max_length=1000)


class AuditLogCreate(SQLModel):
    """Schema for creating an audit log entry."""
    tenant_id: int
    user_id: Optional[int] = None
    user_email: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    action: str
    resource_type: Optional[str] = None
    resource_id: Optional[str] = None
    metadata: Optional[dict] = None
    success: bool = True
    error_message: Optional[str] = None


class AuditLogFilter(SQLModel):
    """Filter parameters for audit log queries."""
    tenant_id: Optional[int] = None
    user_id: Optional[int] = None
    action: Optional[str] = None
    resource_type: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    limit: int = 100
    offset: int = 0
