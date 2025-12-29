"""Audit log service for compliance and tracking."""
from typing import Optional, List, Dict, Any
from datetime import datetime
from sqlmodel import Session, select, func
from fastapi import Request
import json
import csv
import io

from app.models.db.audit_log import AuditLogDB, AuditLogCreate, AuditLogFilter, AuditAction
from app.models.user import User


class AuditLogService:
    """Service for managing audit logs."""
    
    @staticmethod
    def log_audit_event(
        session: Session,
        tenant_id: int,
        action: str,
        user: Optional[User] = None,
        request: Optional[Request] = None,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        success: bool = True,
        error_message: Optional[str] = None,
    ) -> AuditLogDB:
        """Log an audit event.
        
        This is the main method for creating audit logs throughout the application.
        """
        # Extract request metadata
        ip_address = None
        user_agent = None
        if request:
            ip_address = request.client.host if request.client else None
            user_agent = request.headers.get("user-agent")
        
        # Create audit log entry
        audit_log = AuditLogDB(
            tenant_id=tenant_id,
            user_id=user.id if user else None,
            user_email=user.email if user else None,
            ip_address=ip_address,
            user_agent=user_agent,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            metadata=json.dumps(metadata) if metadata else None,
            success=success,
            error_message=error_message,
        )
        
        session.add(audit_log)
        session.commit()
        session.refresh(audit_log)
        
        return audit_log
    
    @staticmethod
    def get_audit_logs(
        session: Session,
        filter_params: AuditLogFilter
    ) -> List[Dict[str, Any]]:
        """Get audit logs with filtering and pagination."""
        query = select(AuditLogDB)
        
        # Apply filters
        if filter_params.tenant_id:
            query = query.where(AuditLogDB.tenant_id == filter_params.tenant_id)
        
        if filter_params.user_id:
            query = query.where(AuditLogDB.user_id == filter_params.user_id)
        
        if filter_params.action:
            query = query.where(AuditLogDB.action == filter_params.action)
        
        if filter_params.resource_type:
            query = query.where(AuditLogDB.resource_type == filter_params.resource_type)
        
        if filter_params.start_date:
            query = query.where(AuditLogDB.timestamp >= filter_params.start_date)
        
        if filter_params.end_date:
            query = query.where(AuditLogDB.timestamp <= filter_params.end_date)
        
        # Order by timestamp descending (most recent first)
        query = query.order_by(AuditLogDB.timestamp.desc())
        
        # Apply pagination
        query = query.offset(filter_params.offset).limit(filter_params.limit)
        
        # Execute query
        logs = session.exec(query).all()
        
        # Convert to dict format with parsed metadata
        result = []
        for log in logs:
            log_dict = {
                "id": log.id,
                "tenant_id": log.tenant_id,
                "user_id": log.user_id,
                "user_email": log.user_email,
                "ip_address": log.ip_address,
                "action": log.action,
                "resource_type": log.resource_type,
                "resource_id": log.resource_id,
                "metadata": json.loads(log.metadata) if log.metadata else None,
                "timestamp": log.timestamp.isoformat(),
                "success": log.success,
                "error_message": log.error_message,
            }
            result.append(log_dict)
        
        return result
    
    @staticmethod
    def get_audit_log_count(
        session: Session,
        filter_params: AuditLogFilter
    ) -> int:
        """Get total count of audit logs matching filters."""
        query = select(func.count(AuditLogDB.id))
        
        # Apply same filters as get_audit_logs
        if filter_params.tenant_id:
            query = query.where(AuditLogDB.tenant_id == filter_params.tenant_id)
        
        if filter_params.user_id:
            query = query.where(AuditLogDB.user_id == filter_params.user_id)
        
        if filter_params.action:
            query = query.where(AuditLogDB.action == filter_params.action)
        
        if filter_params.resource_type:
            query = query.where(AuditLogDB.resource_type == filter_params.resource_type)
        
        if filter_params.start_date:
            query = query.where(AuditLogDB.timestamp >= filter_params.start_date)
        
        if filter_params.end_date:
            query = query.where(AuditLogDB.timestamp <= filter_params.end_date)
        
        return session.exec(query).one()
    
    @staticmethod
    def export_audit_logs_csv(
        session: Session,
        filter_params: AuditLogFilter
    ) -> str:
        """Export audit logs to CSV format."""
        logs = AuditLogService.get_audit_logs(session, filter_params)
        
        # Create CSV in memory
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow([
            "ID",
            "Timestamp",
            "User Email",
            "Action",
            "Resource Type",
            "Resource ID",
            "IP Address",
            "Success",
            "Error Message",
        ])
        
        # Write data
        for log in logs:
            writer.writerow([
                log["id"],
                log["timestamp"],
                log["user_email"] or "",
                log["action"],
                log["resource_type"] or "",
                log["resource_id"] or "",
                log["ip_address"] or "",
                "Yes" if log["success"] else "No",
                log["error_message"] or "",
            ])
        
        return output.getvalue()
    
    @staticmethod
    def get_audit_stats(
        session: Session,
        tenant_id: int,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Get audit log statistics for a tenant."""
        query = select(AuditLogDB).where(AuditLogDB.tenant_id == tenant_id)
        
        if start_date:
            query = query.where(AuditLogDB.timestamp >= start_date)
        
        if end_date:
            query = query.where(AuditLogDB.timestamp <= end_date)
        
        logs = session.exec(query).all()
        
        # Calculate statistics
        total_events = len(logs)
        failed_events = sum(1 for log in logs if not log.success)
        success_rate = ((total_events - failed_events) / total_events * 100) if total_events > 0 else 100
        
        # Action breakdown
        action_counts: Dict[str, int] = {}
        for log in logs:
            action_counts[log.action] = action_counts.get(log.action, 0) + 1
        
        # User activity
        user_activity: Dict[str, int] = {}
        for log in logs:
            user_email = log.user_email or "system"
            user_activity[user_email] = user_activity.get(user_email, 0) + 1
        
        # Resource type breakdown
        resource_counts: Dict[str, int] = {}
        for log in logs:
            if log.resource_type:
                resource_counts[log.resource_type] = resource_counts.get(log.resource_type, 0) + 1
        
        return {
            "total_events": total_events,
            "failed_events": failed_events,
            "success_rate": round(success_rate, 2),
            "action_breakdown": action_counts,
            "top_users": sorted(user_activity.items(), key=lambda x: x[1], reverse=True)[:10],
            "resource_breakdown": resource_counts,
        }


# Singleton instance
audit_log_service = AuditLogService()
