"""
Enhanced audit log models for compliance and security tracking.
Provides immutable audit trail with detailed event tracking.
"""
from enum import Enum
from datetime import datetime
from typing import Optional, Dict, Any
from sqlmodel import SQLModel, Field, Column
from sqlalchemy import JSON, Text, Index


class AuditSeverity(str, Enum):
    """Audit event severity levels"""
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"


class AuditCategory(str, Enum):
    """Audit event categories"""
    AUTHENTICATION = "authentication"
    AUTHORIZATION = "authorization"
    DATA_ACCESS = "data_access"
    DATA_MODIFICATION = "data_modification"
    SYSTEM_CONFIG = "system_config"
    USER_MANAGEMENT = "user_management"
    API_ACCESS = "api_access"
    COMPLIANCE = "compliance"


class AuditLogEntry(SQLModel, table=True):
    """
    Immutable audit log entries for compliance and security.
    Once written, entries cannot be modified or deleted.
    """
    __tablename__ = "audit_log_entries"
    __table_args__ = (
        Index('idx_audit_timestamp', 'timestamp'),
        Index('idx_audit_user', 'user_id'),
        Index('idx_audit_org', 'organization_id'),
        Index('idx_audit_action', 'action'),
        Index('idx_audit_severity', 'severity'),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Event identification
    action: str = Field(max_length=100, index=True)
    category: AuditCategory = Field(index=True)
    severity: AuditSeverity = Field(default=AuditSeverity.INFO, index=True)
    
    # Actor (who performed the action)
    user_id: Optional[int] = Field(default=None, foreign_key="users.id", index=True)
    user_email: Optional[str] = Field(default=None, max_length=255)
    user_name: Optional[str] = Field(default=None, max_length=255)
    
    # Context
    organization_id: Optional[int] = Field(default=None, foreign_key="organizations.id", index=True)
    workspace_id: Optional[int] = Field(default=None, foreign_key="workspaces.id", index=True)
    
    # Resource (what was affected)
    resource_type: Optional[str] = Field(default=None, max_length=100, index=True)
    resource_id: Optional[str] = Field(default=None, max_length=100)
    resource_name: Optional[str] = Field(default=None, max_length=255)
    
    # Request metadata
    ip_address: Optional[str] = Field(default=None, max_length=45)
    user_agent: Optional[str] = Field(default=None, max_length=500)
    request_id: Optional[str] = Field(default=None, max_length=100, index=True)
    session_id: Optional[str] = Field(default=None, max_length=100)
    
    # Event details
    details: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    changes: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))  # Before/after values
    
    # Result
    success: bool = Field(default=True, index=True)
    error_message: Optional[str] = Field(default=None, sa_column=Column(Text))
    
    # Timing
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)
    
    # Compliance flags
    pii_accessed: bool = Field(default=False, index=True)
    sensitive_data: bool = Field(default=False, index=True)
    compliance_relevant: bool = Field(default=False, index=True)
    
    # Data retention
    retention_days: int = Field(default=2555)  # 7 years default for compliance
    
    class Config:
        # Make the model immutable after creation
        allow_mutation = False


class ComplianceReport(SQLModel, table=True):
    """
    Periodic compliance reports aggregating audit data.
    """
    __tablename__ = "compliance_reports"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    organization_id: int = Field(foreign_key="organizations.id", index=True)
    
    # Report metadata
    report_type: str = Field(max_length=100)  # 'monthly', 'quarterly', 'annual', 'custom'
    period_start: datetime
    period_end: datetime
    
    # Aggregated metrics
    total_events: int = Field(default=0)
    failed_events: int = Field(default=0)
    pii_access_events: int = Field(default=0)
    sensitive_data_events: int = Field(default=0)
    
    # Event breakdown
    events_by_category: Dict[str, int] = Field(default={}, sa_column=Column(JSON))
    events_by_severity: Dict[str, int] = Field(default={}, sa_column=Column(JSON))
    top_users: Dict[str, int] = Field(default={}, sa_column=Column(JSON))
    
    # Compliance findings
    findings: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    anomalies: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    
    # Report generation
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    generated_by: Optional[int] = Field(default=None, foreign_key="users.id")
    
    # Export
    report_url: Optional[str] = Field(default=None, max_length=500)


# ============================================================================
# Pydantic schemas for API requests/responses
# ============================================================================

class AuditLogQuery(SQLModel):
    """Query parameters for audit log search"""
    user_id: Optional[int] = None
    organization_id: Optional[int] = None
    action: Optional[str] = None
    category: Optional[AuditCategory] = None
    severity: Optional[AuditSeverity] = None
    resource_type: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    search: Optional[str] = None  # Full-text search
    success_only: Optional[bool] = None
    failed_only: Optional[bool] = None
    pii_only: Optional[bool] = None
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=50, ge=1, le=1000)


class AuditLogResponse(SQLModel):
    """Response schema for audit log entry"""
    id: int
    action: str
    category: str
    severity: str
    user_email: Optional[str]
    user_name: Optional[str]
    resource_type: Optional[str]
    resource_id: Optional[str]
    resource_name: Optional[str]
    ip_address: Optional[str]
    timestamp: datetime
    success: bool
    details: Optional[Dict[str, Any]]
    error_message: Optional[str]


class AuditLogStats(SQLModel):
    """Statistics for audit logs"""
    total_events: int
    period_days: int
    failed_events: int
    success_rate: float
    pii_access_count: int
    events_by_category: Dict[str, int]
    events_by_severity: Dict[str, int]
    events_by_day: Dict[str, int]
    top_users: List[Dict[str, Any]]
    top_actions: List[Dict[str, Any]]


class ComplianceReportResponse(SQLModel):
    """Response schema for compliance report"""
    id: int
    report_type: str
    period_start: datetime
    period_end: datetime
    total_events: int
    failed_events: int
    pii_access_events: int
    events_by_category: Dict[str, int]
    events_by_severity: Dict[str, int]
    generated_at: datetime
    report_url: Optional[str]


class ExportAuditLogsRequest(SQLModel):
    """Request schema for exporting audit logs"""
    format: str = Field(default="csv")  # 'csv', 'json', 'pdf'
    query: AuditLogQuery
    include_details: bool = Field(default=True)
    include_metadata: bool = Field(default=True)
