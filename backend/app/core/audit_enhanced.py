"""
Enhanced audit and compliance features.
Includes auto-logging decorators, GDPR compliance, and retention policies.
"""
import logging
from typing import Callable, Optional, Dict, Any
from functools import wraps
from datetime import datetime, timedelta
from fastapi import Request
from app.core.db import get_session
from app.models.user import User
from sqlmodel import select, delete
import json

logger = logging.getLogger(__name__)


def audit_action(action: str, resource_type: Optional[str] = None):
    """
    Decorator to automatically log actions to audit trail.
    
    Usage:
        @audit_action("campaign.delete", resource_type="campaign")
        async def delete_campaign(campaign_id: int, user: User):
            ...
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Extract user from kwargs
            user = kwargs.get('user')
            request = kwargs.get('request')
            
            # Extract resource ID from args/kwargs
            resource_id = None
            if args and len(args) > 0:
                resource_id = args[0] if isinstance(args[0], (int, str)) else None
            if not resource_id and 'id' in kwargs:
                resource_id = kwargs['id']
            
            # Capture metadata
            metadata = {
                "function": func.__name__,
                "args": str(args)[:200],  # Truncate
                "timestamp": datetime.now().isoformat()
            }
            
            if request:
                metadata["ip_address"] = request.client.host if request.client else "unknown"
                metadata["user_agent"] = request.headers.get("user-agent", "")
            
            try:
                # Execute function
                result = await func(*args, **kwargs)
                
                # Log success
                await log_audit_event(
                    user_id=user.id if user else None,
                    action=action,
                    resource_type=resource_type,
                    resource_id=resource_id,
                    status="success",
                    metadata=metadata
                )
                
                return result
                
            except Exception as e:
                # Log failure
                metadata["error"] = str(e)
                await log_audit_event(
                    user_id=user.id if user else None,
                    action=action,
                    resource_type=resource_type,
                    resource_id=resource_id,
                    status="failure",
                    metadata=metadata
                )
                raise
        
        return wrapper
    return decorator


async def log_audit_event(
    user_id: Optional[int],
    action: str,
    resource_type: Optional[str] = None,
    resource_id: Optional[Any] = None,
    status: str = "success",
    metadata: Optional[Dict] = None
):
    """Log an audit event to the database"""
    with get_session() as session:
        from app.models.audit import AuditLog
        
        audit_log = AuditLog(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=str(resource_id) if resource_id else None,
            status=status,
            metadata=json.dumps(metadata) if metadata else None,
            timestamp=datetime.now()
        )
        
        session.add(audit_log)
        session.commit()
        
        logger.info(f"Audit log created: {action} by user {user_id}")


class GDPRCompliance:
    """GDPR compliance utilities"""
    
    @staticmethod
    def export_user_data(user_id: int) -> Dict[str, Any]:
        """
        Export all user data for GDPR compliance.
        Returns complete data package.
        """
        with get_session() as session:
            data = {
                "user": {},
                "leads": [],
                "campaigns": [],
                "activities": [],
                "audit_logs": [],
                "export_date": datetime.now().isoformat()
            }
            
            # Get user data
            from app.models.user import User
            from app.models.schemas import Lead, Campaign
            from app.models.audit import AuditLog
            
            # User info (simplified - in production fetch from User table)
            data["user"] = {
                "id": user_id,
                "note": "User data would be fetched from database"
            }
            
            # Leads owned by user
            leads = session.exec(
                select(Lead).where(Lead.owner_id == user_id)
            ).all()
            data["leads"] = [lead.dict() for lead in leads]
            
            # Campaigns created by user
            campaigns = session.exec(
                select(Campaign).where(Campaign.created_by == user_id)
            ).all()
            data["campaigns"] = [campaign.dict() for campaign in campaigns]
            
            # Audit logs
            audit_logs = session.exec(
                select(AuditLog).where(AuditLog.user_id == user_id)
            ).all()
            data["audit_logs"] = [
                {
                    "action": log.action,
                    "timestamp": log.timestamp.isoformat(),
                    "resource_type": log.resource_type
                }
                for log in audit_logs
            ]
            
            return data
    
    @staticmethod
    def anonymize_user_data(user_id: int):
        """
        Anonymize user data while preserving analytics.
        Used for GDPR "right to be forgotten".
        """
        with get_session() as session:
            from app.models.schemas import Lead
            
            # Anonymize leads
            leads = session.exec(
                select(Lead).where(Lead.owner_id == user_id)
            ).all()
            
            for lead in leads:
                lead.email = f"anonymized_{lead.id}@example.com"
                lead.name = f"Anonymized User {lead.id}"
                if hasattr(lead, 'phone'):
                    lead.phone = None
                session.add(lead)
            
            session.commit()
            
            logger.info(f"Anonymized data for user {user_id}")
            
            return {"anonymized_records": len(leads)}
    
    @staticmethod
    def get_consent_status(user_id: int) -> Dict[str, Any]:
        """Get user's consent status for data processing"""
        # In production: fetch from consent table
        return {
            "user_id": user_id,
            "marketing_emails": True,
            "data_processing": True,
            "third_party_sharing": False,
            "last_updated": datetime.now().isoformat()
        }


class DataRetentionPolicy:
    """Enforce data retention policies"""
    
    RETENTION_PERIODS = {
        "audit_logs": 365,  # days
        "analytics_events": 90,
        "email_logs": 730,
        "lead_data": 1095  # 3 years
    }
    
    @staticmethod
    def cleanup_expired_data(resource_type: str):
        """Delete data past retention period"""
        retention_days = DataRetentionPolicy.RETENTION_PERIODS.get(resource_type)
        if not retention_days:
            logger.warning(f"No retention policy for {resource_type}")
            return
        
        cutoff_date = datetime.now() - timedelta(days=retention_days)
        
        with get_session() as session:
            deleted_count = 0
            
            if resource_type == "audit_logs":
                from app.models.audit import AuditLog
                result = session.exec(
                    delete(AuditLog).where(AuditLog.timestamp < cutoff_date)
                )
                deleted_count = result.rowcount if hasattr(result, 'rowcount') else 0
            
            # Add more resource types as needed
            
            session.commit()
            
            logger.info(f"Deleted {deleted_count} {resource_type} records older than {cutoff_date}")
            
            return {
                "resource_type": resource_type,
                "deleted_count": deleted_count,
                "cutoff_date": cutoff_date.isoformat()
            }
    
    @staticmethod
    def get_retention_report() -> Dict[str, Any]:
        """Generate report on data retention status"""
        report = {
            "generated_at": datetime.now().isoformat(),
            "policies": {}
        }
        
        for resource_type, retention_days in DataRetentionPolicy.RETENTION_PERIODS.items():
            cutoff_date = datetime.now() - timedelta(days=retention_days)
            
            with get_session() as session:
                # Count records past retention
                count = 0
                if resource_type == "audit_logs":
                    from app.models.audit import AuditLog
                    from sqlalchemy import func
                    count = session.exec(
                        select(func.count(AuditLog.id)).where(AuditLog.timestamp < cutoff_date)
                    ).one()
                
                report["policies"][resource_type] = {
                    "retention_days": retention_days,
                    "cutoff_date": cutoff_date.isoformat(),
                    "records_to_delete": count
                }
        
        return report


class AuditLogSearch:
    """Search and filter audit logs"""
    
    @staticmethod
    def search(
        user_id: Optional[int] = None,
        action: Optional[str] = None,
        resource_type: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 100
    ):
        """
        Search audit logs with filters.
        
        Returns list of matching audit log entries.
        """
        with get_session() as session:
            from app.models.audit import AuditLog
            
            query = select(AuditLog)
            
            # Apply filters
            if user_id:
                query = query.where(AuditLog.user_id == user_id)
            if action:
                query = query.where(AuditLog.action.like(f"%{action}%"))
            if resource_type:
                query = query.where(AuditLog.resource_type == resource_type)
            if start_date:
                query = query.where(AuditLog.timestamp >= start_date)
            if end_date:
                query = query.where(AuditLog.timestamp <= end_date)
            
            # Order and limit
            query = query.order_by(AuditLog.timestamp.desc()).limit(limit)
            
            results = session.exec(query).all()
            
            return [
                {
                    "id": log.id,
                    "user_id": log.user_id,
                    "action": log.action,
                    "resource_type": log.resource_type,
                    "resource_id": log.resource_id,
                    "status": log.status,
                    "timestamp": log.timestamp.isoformat(),
                    "metadata": json.loads(log.metadata) if log.metadata else {}
                }
                for log in results
            ]
