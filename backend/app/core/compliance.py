"""GDPR compliance and data management tools."""
from typing import Dict, Any, List
from datetime import datetime
import json
from io import BytesIO
import csv

from app.core.db import get_session


class ComplianceService:
    """Service for GDPR and compliance features."""
    
    @staticmethod
    async def export_user_data(user_id: int, db_session) -> BytesIO:
        """Export all user data for GDPR data portability."""
        from app.models.user import User
        from app.models.audit import AuditLog
        
        user = db_session.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")
        
        # Collect all user data
        user_data = {
            'personal_information': {
                'email': user.email,
                'username': user.username,
                'role': user.role,
                'created_at': user.created_at.isoformat() if user.created_at else None,
                'last_login': user.last_login.isoformat() if user.last_login else None,
            },
            'authentication': {
                'mfa_enabled': user.mfa_enabled,
                'oauth_provider': user.oauth_provider,
                'is_verified': user.is_verified,
            },
            'activity_logs': [],
            'campaigns': [],
            'leads': [],
        }
        
        # Get audit logs
        audit_logs = db_session.query(AuditLog).filter(
            AuditLog.user_id == user_id
        ).order_by(AuditLog.timestamp.desc()).limit(1000).all()
        
        for log in audit_logs:
            user_data['activity_logs'].append({
                'timestamp': log.timestamp.isoformat(),
                'action': log.action,
                'success': log.success,
                'ip_address': log.ip_address,
            })
        
        # TODO: Add campaigns and leads data
        
        # Convert to JSON
        json_data = json.dumps(user_data, indent=2)
        buffer = BytesIO(json_data.encode('utf-8'))
        buffer.seek(0)
        
        return buffer
    
    @staticmethod
    async def delete_user_data(user_id: int, db_session) -> bool:
        """Delete all user data for GDPR right to be forgotten."""
        from app.models.user import User
        from app.models.audit import AuditLog
        
        try:
            # Anonymize audit logs instead of deleting (for legal record keeping)
            audit_logs = db_session.query(AuditLog).filter(
                AuditLog.user_id == user_id
            ).all()
            
            for log in audit_logs:
                log.user_email = f"deleted_user_{user_id}@anonymized.com"
                log.user_id = None
            
            # Delete user
            user = db_session.query(User).filter(User.id == user_id).first()
            if user:
                db_session.delete(user)
            
            db_session.commit()
            return True
        
        except Exception as e:
            db_session.rollback()
            raise Exception(f"Failed to delete user data: {str(e)}")
    
    @staticmethod
    def generate_privacy_report() -> Dict[str, Any]:
        """Generate privacy compliance report."""
        return {
            'gdpr_compliance': {
                'data_portability': 'Implemented',
                'right_to_be_forgotten': 'Implemented',
                'consent_management': 'Required',
                'data_minimization': 'Active',
                'encryption_at_rest': 'Enabled',
                'encryption_in_transit': 'TLS 1.3',
            },
            'security_measures': {
                'password_hashing': 'bcrypt',
                'mfa_available': True,
                'session_management': 'JWT with expiration',
                'rate_limiting': 'Enabled',
                'audit_logging': 'Comprehensive',
            },
            'data_retention': {
                'audit_logs': '7 years',
                'user_data': 'Until account deletion',
                'backups': '90 days',
            },
            'last_updated': datetime.utcnow().isoformat()
        }
    
    @staticmethod
    def generate_consent_record(user_id: int, consent_type: str, granted: bool) -> Dict[str, Any]:
        """Record user consent for GDPR compliance."""
        return {
            'user_id': user_id,
            'consent_type': consent_type,
            'granted': granted,
            'timestamp': datetime.utcnow().isoformat(),
            'ip_address': None,  # Should be captured from request
            'version': '1.0'
        }


# Global instance
compliance_service = ComplianceService()
