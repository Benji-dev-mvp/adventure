"""
Typed Memory System for Mem0

Defines explicit memory types with Pydantic models, retention policies, 
namespacing, and PII redaction
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from enum import Enum
import logging
import re

logger = logging.getLogger(__name__)


# ============================================================================
# Memory Types
# ============================================================================

class MemoryType(str, Enum):
    """Types of memories that can be stored"""
    LEAD_INTERACTION = "lead_interaction"
    EMAIL_THREAD = "email_thread"
    MEETING_SUMMARY = "meeting_summary"
    CAMPAIGN_RESULT = "campaign_result"
    CHAT_CONVERSATION = "chat_conversation"
    DECISION_POINT = "decision_point"


class RetentionPolicy(str, Enum):
    """Memory retention policies"""
    SHORT_TERM = "short_term"  # Hours to days
    MEDIUM_TERM = "medium_term"  # Weeks
    LONG_TERM = "long_term"  # Months to years
    PERMANENT = "permanent"


# ============================================================================
# Base Memory Model
# ============================================================================

class BaseMemory(BaseModel):
    """Base memory model with common fields"""
    memory_id: Optional[str] = None
    memory_type: MemoryType
    org_id: str = Field(..., description="Organization ID for tenancy")
    user_id: Optional[str] = Field(None, description="User ID if user-specific")
    account_id: Optional[str] = Field(None, description="Account/company ID if account-specific")
    
    content: str = Field(..., min_length=1, max_length=10000)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    retention_policy: RetentionPolicy = RetentionPolicy.MEDIUM_TERM
    ttl_seconds: Optional[int] = None  # None = permanent
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    
    # PII flags
    contains_pii: bool = False
    redacted: bool = False
    
    class Config:
        json_schema_extra = {
            "example": {
                "memory_type": "lead_interaction",
                "org_id": "org_12345",
                "user_id": "user_67890",
                "content": "Lead expressed interest in enterprise plan",
                "retention_policy": "long_term",
            }
        }


# ============================================================================
# Specialized Memory Models
# ============================================================================

class LeadInteractionMemory(BaseMemory):
    """Memory of interactions with a lead"""
    memory_type: MemoryType = MemoryType.LEAD_INTERACTION
    lead_id: str = Field(..., description="Lead identifier")
    contact_id: Optional[str] = None
    
    interaction_type: str = Field(..., description="Type: email, call, meeting, demo, etc.")
    outcome: Optional[str] = Field(None, description="Outcome or result")
    sentiment: Optional[str] = Field(None, description="positive, neutral, negative")
    key_points: List[str] = Field(default_factory=list, max_items=10)
    next_steps: List[str] = Field(default_factory=list, max_items=5)
    
    retention_policy: RetentionPolicy = RetentionPolicy.LONG_TERM
    
    class Config:
        json_schema_extra = {
            "example": {
                "lead_id": "lead_abc123",
                "interaction_type": "demo",
                "outcome": "positive",
                "sentiment": "positive",
                "content": "Demonstrated enterprise features. Lead impressed with automation capabilities.",
                "key_points": ["Interested in API integration", "Needs multi-user support"],
                "next_steps": ["Send pricing", "Schedule technical call"],
            }
        }


class EmailThreadMemory(BaseMemory):
    """Memory of email conversations"""
    memory_type: MemoryType = MemoryType.EMAIL_THREAD
    thread_id: str = Field(..., description="Email thread identifier")
    lead_id: Optional[str] = None
    contact_id: Optional[str] = None
    
    subject: str = Field(..., max_length=200)
    message_count: int = Field(..., ge=1)
    last_sender: str = Field(..., description="user or lead")
    sentiment_trend: Optional[str] = Field(None, description="improving, declining, stable")
    engagement_level: Optional[str] = Field(None, description="high, medium, low")
    
    retention_policy: RetentionPolicy = RetentionPolicy.MEDIUM_TERM
    ttl_seconds: int = 86400 * 90  # 90 days
    
    class Config:
        json_schema_extra = {
            "example": {
                "thread_id": "thread_xyz789",
                "subject": "Partnership Opportunity",
                "message_count": 5,
                "last_sender": "lead",
                "content": "Ongoing discussion about partnership terms. Lead asked about integration options.",
                "sentiment_trend": "improving",
                "engagement_level": "high",
            }
        }


class MeetingSummaryMemory(BaseMemory):
    """Memory of meeting summaries"""
    memory_type: MemoryType = MemoryType.MEETING_SUMMARY
    meeting_id: Optional[str] = None
    lead_id: Optional[str] = None
    account_id: Optional[str] = None
    
    meeting_title: str = Field(..., max_length=200)
    meeting_date: datetime
    duration_minutes: Optional[int] = Field(None, ge=0)
    attendees: List[str] = Field(default_factory=list, max_items=20)
    
    key_decisions: List[str] = Field(default_factory=list, max_items=10)
    action_items: List[Dict[str, str]] = Field(default_factory=list, max_items=15)
    concerns_raised: List[str] = Field(default_factory=list, max_items=5)
    
    retention_policy: RetentionPolicy = RetentionPolicy.LONG_TERM
    
    class Config:
        json_schema_extra = {
            "example": {
                "meeting_title": "Q4 Strategy Review",
                "meeting_date": "2025-12-15T14:00:00Z",
                "duration_minutes": 60,
                "attendees": ["john@acme.com", "sarah@acme.com"],
                "content": "Discussed Q4 campaign performance and 2026 planning.",
                "key_decisions": ["Increase budget by 20%", "Focus on enterprise segment"],
                "action_items": [{"owner": "john", "task": "Prepare budget proposal"}],
            }
        }


class CampaignResultMemory(BaseMemory):
    """Memory of campaign results and learnings"""
    memory_type: MemoryType = MemoryType.CAMPAIGN_RESULT
    campaign_id: str = Field(..., description="Campaign identifier")
    campaign_name: str = Field(..., max_length=200)
    
    objective: str = Field(..., max_length=100)
    channels_used: List[str] = Field(..., min_items=1)
    target_segment: str = Field(..., max_length=200)
    
    metrics: Dict[str, float] = Field(default_factory=dict)
    what_worked: List[str] = Field(default_factory=list, max_items=10)
    what_didnt_work: List[str] = Field(default_factory=list, max_items=10)
    learnings: List[str] = Field(default_factory=list, max_items=10)
    
    retention_policy: RetentionPolicy = RetentionPolicy.PERMANENT
    
    class Config:
        json_schema_extra = {
            "example": {
                "campaign_id": "camp_123",
                "campaign_name": "Enterprise Outreach Q4",
                "objective": "Book demos with Fortune 500 companies",
                "channels_used": ["email", "linkedin"],
                "target_segment": "VP Sales at F500",
                "content": "Multi-touch campaign targeting enterprise segment achieved 18% demo booking rate.",
                "metrics": {"open_rate": 0.42, "reply_rate": 0.18, "demo_rate": 0.18},
                "what_worked": ["Personalized subject lines", "Industry-specific case studies"],
                "learnings": ["Best contact time: Tuesday 10am", "3-touch sequence optimal"],
            }
        }


class ChatConversationMemory(BaseMemory):
    """Memory of chat/AI assistant conversations"""
    memory_type: MemoryType = MemoryType.CHAT_CONVERSATION
    session_id: str = Field(..., description="Chat session identifier")
    
    message_count: int = Field(..., ge=1)
    topics_discussed: List[str] = Field(default_factory=list, max_items=10)
    tools_used: List[str] = Field(default_factory=list)
    user_satisfaction: Optional[str] = Field(None, description="positive, neutral, negative")
    
    retention_policy: RetentionPolicy = RetentionPolicy.SHORT_TERM
    ttl_seconds: int = 3600  # 1 hour for active sessions
    
    class Config:
        json_schema_extra = {
            "example": {
                "session_id": "session_abc",
                "message_count": 12,
                "topics_discussed": ["Campaign optimization", "Lead scoring"],
                "content": "User asked about improving email open rates. Provided recommendations on subject lines.",
                "tools_used": ["search_campaigns", "get_analytics"],
                "user_satisfaction": "positive",
            }
        }


# ============================================================================
# Retention Policy Configuration
# ============================================================================

RETENTION_CONFIG = {
    RetentionPolicy.SHORT_TERM: {
        "ttl_seconds": 3600,  # 1 hour
        "compress_after": None,  # Don't compress
    },
    RetentionPolicy.MEDIUM_TERM: {
        "ttl_seconds": 86400 * 30,  # 30 days
        "compress_after": 10,  # Compress after 10 items
    },
    RetentionPolicy.LONG_TERM: {
        "ttl_seconds": 86400 * 365,  # 1 year
        "compress_after": 20,  # Compress after 20 items
    },
    RetentionPolicy.PERMANENT: {
        "ttl_seconds": None,  # Never expires
        "compress_after": 50,  # Compress after 50 items
    },
}


# ============================================================================
# PII Redaction
# ============================================================================

class PIIRedactor:
    """Redact PII from memory content before persistence"""
    
    # Patterns to detect and redact
    PATTERNS = {
        "email": re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'),
        "phone": re.compile(r'\b(\+?\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}\b'),
        "ssn": re.compile(r'\b\d{3}-\d{2}-\d{4}\b'),
        "credit_card": re.compile(r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b'),
        "ip_address": re.compile(r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b'),
    }
    
    # Replacement templates
    REPLACEMENTS = {
        "email": "[EMAIL_REDACTED]",
        "phone": "[PHONE_REDACTED]",
        "ssn": "[SSN_REDACTED]",
        "credit_card": "[CC_REDACTED]",
        "ip_address": "[IP_REDACTED]",
    }
    
    @classmethod
    def redact(cls, text: str, keep_structure: bool = True) -> tuple[str, bool]:
        """
        Redact PII from text
        
        Args:
            text: Text to redact
            keep_structure: If True, replace with placeholders. If False, remove entirely.
            
        Returns:
            Tuple of (redacted_text, was_redacted)
        """
        original_text = text
        was_redacted = False
        
        for pattern_name, pattern in cls.PATTERNS.items():
            if pattern.search(text):
                was_redacted = True
                if keep_structure:
                    text = pattern.sub(cls.REPLACEMENTS[pattern_name], text)
                else:
                    text = pattern.sub('', text)
        
        if was_redacted:
            logger.info(f"PII redacted from text: {pattern_name}")
        
        return text, was_redacted


# ============================================================================
# Memory Namespace Builder
# ============================================================================

class MemoryNamespace:
    """Build namespaced keys for memory isolation"""
    
    @staticmethod
    def build(
        org_id: str,
        user_id: Optional[str] = None,
        account_id: Optional[str] = None,
        session_id: Optional[str] = None,
        memory_type: Optional[MemoryType] = None,
    ) -> str:
        """
        Build namespace key for memory
        
        Args:
            org_id: Organization ID (required)
            user_id: User ID (optional)
            account_id: Account ID (optional)
            session_id: Session ID (optional)
            memory_type: Memory type (optional)
            
        Returns:
            Namespace string like "org_123:user_456:type_lead_interaction"
        """
        parts = [f"org_{org_id}"]
        
        if user_id:
            parts.append(f"user_{user_id}")
        
        if account_id:
            parts.append(f"account_{account_id}")
        
        if session_id:
            parts.append(f"session_{session_id}")
        
        if memory_type:
            parts.append(f"type_{memory_type.value}")
        
        return ":".join(parts)
    
    @staticmethod
    def validate_tenancy(namespace: str, org_id: str) -> bool:
        """
        Validate that namespace belongs to org
        
        Args:
            namespace: Namespace string
            org_id: Organization ID to check
            
        Returns:
            True if namespace belongs to org
        """
        return namespace.startswith(f"org_{org_id}:")
