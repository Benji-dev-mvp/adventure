"""Tests for audit logging module."""
import pytest
from app.models.audit import AuditAction
from app.core.audit import create_audit_log


@pytest.mark.unit
@pytest.mark.audit
@pytest.mark.asyncio
class TestAuditLogging:
    """Test audit logging functionality."""
    
    async def test_create_audit_log(self, db_session):
        """Test creating an audit log entry."""
        log = await create_audit_log(
            session=db_session,
            action=AuditAction.CAMPAIGN_CREATED,
            user_id=1,
            user_email="test@example.com",
            resource_type="campaign",
            resource_id=123,
            ip_address="192.168.1.1",
            user_agent="Mozilla/5.0",
            details={"name": "Test Campaign"}
        )
        
        assert log.id is not None
        assert log.action == AuditAction.CAMPAIGN_CREATED
        assert log.user_email == "test@example.com"
        assert log.resource_type == "campaign"
        assert log.resource_id == 123
        assert log.success is True
    
    async def test_audit_log_failure(self, db_session):
        """Test audit log for failed actions."""
        log = await create_audit_log(
            session=db_session,
            action=AuditAction.LOGIN_ATTEMPT,
            user_email="hacker@example.com",
            ip_address="192.168.1.1",
            success=False,
            error_message="Invalid credentials"
        )
        
        assert log.success is False
        assert log.error_message == "Invalid credentials"
    
    async def test_audit_log_without_user(self, db_session):
        """Test audit log for system actions without user."""
        log = await create_audit_log(
            session=db_session,
            action=AuditAction.SYSTEM_BACKUP,
            details={"backup_file": "backup_2024.sql"}
        )
        
        assert log.user_id is None
        assert log.action == AuditAction.SYSTEM_BACKUP
