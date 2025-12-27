"""
Memory Governance Service

Enterprise-grade memory management with:
- TTL policies
- Compliance purge
- Tenant isolation
- PII scrubbing
- Audit logging
"""

from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
from sqlmodel import Session, select
from ..models.ai_enterprise import MemoryPolicy, MemoryAuditLog
import re
import logging

logger = logging.getLogger(__name__)


class PIIScrubber:
    """PII scrubbing layer for memory content"""
    
    # Common PII patterns
    EMAIL_PATTERN = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    PHONE_PATTERN = r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'
    SSN_PATTERN = r'\b\d{3}-\d{2}-\d{4}\b'
    CREDIT_CARD_PATTERN = r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b'
    
    @classmethod
    def scrub(cls, content: str, mode: str = "mask") -> str:
        """
        Scrub PII from content
        
        Args:
            content: Content to scrub
            mode: mask or redact
            
        Returns:
            Scrubbed content
        """
        if mode == "mask":
            # Replace with masked values
            content = re.sub(cls.EMAIL_PATTERN, '[EMAIL]', content)
            content = re.sub(cls.PHONE_PATTERN, '[PHONE]', content)
            content = re.sub(cls.SSN_PATTERN, '[SSN]', content)
            content = re.sub(cls.CREDIT_CARD_PATTERN, '[CREDIT_CARD]', content)
        elif mode == "redact":
            # Remove entirely
            content = re.sub(cls.EMAIL_PATTERN, '', content)
            content = re.sub(cls.PHONE_PATTERN, '', content)
            content = re.sub(cls.SSN_PATTERN, '', content)
            content = re.sub(cls.CREDIT_CARD_PATTERN, '', content)
        
        return content
    
    @classmethod
    def detect_pii(cls, content: str) -> List[str]:
        """Detect PII types in content"""
        detected = []
        
        if re.search(cls.EMAIL_PATTERN, content):
            detected.append("email")
        if re.search(cls.PHONE_PATTERN, content):
            detected.append("phone")
        if re.search(cls.SSN_PATTERN, content):
            detected.append("ssn")
        if re.search(cls.CREDIT_CARD_PATTERN, content):
            detected.append("credit_card")
        
        return detected


class MemoryGovernanceService:
    """Memory governance and compliance service"""
    
    def __init__(self, db_session: Session):
        """Initialize governance service"""
        self.db = db_session
        self.pii_scrubber = PIIScrubber()
    
    async def get_or_create_policy(self, tenant_id: str) -> MemoryPolicy:
        """Get or create memory policy for tenant"""
        statement = select(MemoryPolicy).where(MemoryPolicy.tenant_id == tenant_id)
        policy = self.db.exec(statement).first()
        
        if not policy:
            # Create default policy
            policy = MemoryPolicy(
                tenant_id=tenant_id,
                ttl_days=90,
                pii_scrub_enabled=True,
                auto_purge_enabled=True,
                compliance_mode="standard",
            )
            self.db.add(policy)
            self.db.commit()
            self.db.refresh(policy)
        
        return policy
    
    async def update_policy(
        self,
        tenant_id: str,
        ttl_days: Optional[int] = None,
        pii_scrub_enabled: Optional[bool] = None,
        auto_purge_enabled: Optional[bool] = None,
        compliance_mode: Optional[str] = None,
    ) -> MemoryPolicy:
        """Update memory policy"""
        policy = await self.get_or_create_policy(tenant_id)
        
        if ttl_days is not None:
            policy.ttl_days = ttl_days
        if pii_scrub_enabled is not None:
            policy.pii_scrub_enabled = pii_scrub_enabled
        if auto_purge_enabled is not None:
            policy.auto_purge_enabled = auto_purge_enabled
        if compliance_mode is not None:
            policy.compliance_mode = compliance_mode
        
        policy.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(policy)
        
        return policy
    
    async def scrub_content_if_needed(
        self,
        content: str,
        tenant_id: str,
    ) -> Dict[str, Any]:
        """
        Scrub PII from content based on tenant policy
        
        Returns:
            Dict with scrubbed content and PII detected
        """
        policy = await self.get_or_create_policy(tenant_id)
        
        pii_detected = self.pii_scrubber.detect_pii(content)
        
        if policy.pii_scrub_enabled and pii_detected:
            scrubbed = self.pii_scrubber.scrub(content, mode="mask")
            return {
                "content": scrubbed,
                "pii_detected": pii_detected,
                "scrubbed": True,
            }
        
        return {
            "content": content,
            "pii_detected": pii_detected,
            "scrubbed": False,
        }
    
    async def purge_memories(
        self,
        tenant_id: str,
        user_id: str,
        reason: str,
        category: Optional[str] = None,
        before_date: Optional[datetime] = None,
    ) -> Dict[str, int]:
        """
        Purge memories for compliance
        
        Args:
            tenant_id: Tenant identifier
            user_id: User performing purge
            reason: Reason for purge
            category: Optional category filter
            before_date: Optional date filter
            
        Returns:
            Count of purged memories
        """
        # In real implementation, this would:
        # 1. Query Mem0 or vector store
        # 2. Delete matching memories
        # 3. Log audit trail
        
        # Simulate purge
        purged_count = 0
        
        # Log audit trail
        audit_log = MemoryAuditLog(
            tenant_id=tenant_id,
            user_id=user_id,
            operation="purge",
            category=category,
            reason=reason,
            metadata='{"before_date": "' + (before_date.isoformat() if before_date else "null") + '"}',
        )
        self.db.add(audit_log)
        self.db.commit()
        
        logger.info(
            f"Memory purge requested: tenant={tenant_id}, user={user_id}, "
            f"category={category}, reason={reason}"
        )
        
        return {
            "purged_count": purged_count,
            "tenant_id": tenant_id,
            "category": category,
            "audit_log_id": audit_log.id,
        }
    
    async def auto_purge_expired(self) -> Dict[str, int]:
        """
        Auto-purge expired memories based on TTL policies
        
        Should be run as scheduled task (e.g., daily).
        
        Returns:
            Summary of purged memories per tenant
        """
        # Get all policies with auto-purge enabled
        statement = select(MemoryPolicy).where(MemoryPolicy.auto_purge_enabled == True)
        policies = self.db.exec(statement).all()
        
        results = {}
        
        for policy in policies:
            if policy.ttl_days is None:
                continue
            
            cutoff_date = datetime.utcnow() - timedelta(days=policy.ttl_days)
            
            # Purge expired memories
            result = await self.purge_memories(
                tenant_id=policy.tenant_id,
                user_id="system",
                reason=f"Auto-purge: TTL expired ({policy.ttl_days} days)",
                before_date=cutoff_date,
            )
            
            results[policy.tenant_id] = result["purged_count"]
        
        return results
    
    async def get_audit_logs(
        self,
        tenant_id: str,
        user_id: Optional[str] = None,
        operation: Optional[str] = None,
        limit: int = 100,
    ) -> List[MemoryAuditLog]:
        """Get audit logs for tenant"""
        statement = (
            select(MemoryAuditLog)
            .where(MemoryAuditLog.tenant_id == tenant_id)
            .order_by(MemoryAuditLog.timestamp.desc())
            .limit(limit)
        )
        
        if user_id:
            statement = statement.where(MemoryAuditLog.user_id == user_id)
        if operation:
            statement = statement.where(MemoryAuditLog.operation == operation)
        
        return list(self.db.exec(statement).all())
    
    async def enforce_tenant_isolation(
        self,
        memory_query: Dict[str, Any],
        tenant_id: str,
    ) -> Dict[str, Any]:
        """
        Enforce tenant isolation on memory queries
        
        Adds tenant_id filter to all queries to prevent cross-tenant access.
        """
        # Add tenant filter to query
        if "filters" not in memory_query:
            memory_query["filters"] = {}
        
        memory_query["filters"]["tenant_id"] = tenant_id
        
        return memory_query
    
    async def log_memory_operation(
        self,
        tenant_id: str,
        user_id: str,
        operation: str,
        memory_id: Optional[str] = None,
        category: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ):
        """Log memory operation for audit"""
        import json
        
        audit_log = MemoryAuditLog(
            tenant_id=tenant_id,
            user_id=user_id,
            operation=operation,
            memory_id=memory_id,
            category=category,
            metadata=json.dumps(metadata) if metadata else None,
        )
        self.db.add(audit_log)
        self.db.commit()
