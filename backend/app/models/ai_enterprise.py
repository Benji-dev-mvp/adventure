"""
Enterprise AI Models

Database models for:
- Model orchestration policies
- Memory governance policies
- Usage metering records
- Knowledge graph entities
- Voice intelligence sessions
"""

from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel
import json


# ============================================================================
# Model Orchestration
# ============================================================================

class ModelPolicy(SQLModel, table=True):
    """Model policy configuration per workspace/tenant"""
    __tablename__ = "model_policies"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    workspace_id: str = Field(index=True)
    tenant_id: str = Field(index=True)
    rules: str = Field(default="[]")  # JSON array of ModelRule objects
    fallback_strategy: str = Field(default="latency")  # latency, cost, quality
    auto_fallback_enabled: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    def get_rules(self) -> List[Dict[str, Any]]:
        """Parse rules from JSON"""
        return json.loads(self.rules) if self.rules else []
    
    def set_rules(self, rules: List[Dict[str, Any]]):
        """Serialize rules to JSON"""
        self.rules = json.dumps(rules)


class ModelRule(BaseModel):
    """Individual model routing rule"""
    segment: str  # executives, bulk, creative, default
    provider: str  # openai, anthropic, azure_openai, custom
    model: str  # gpt-4, claude-3-opus, etc.
    fallback: List[str] = []  # Fallback model names
    latency_budget_ms: Optional[int] = None
    cost_limit_per_1k_tokens: Optional[float] = None
    priority: int = 100  # Lower = higher priority


class ModelHealthMetric(SQLModel, table=True):
    """Track model provider health and latency"""
    __tablename__ = "model_health_metrics"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    provider: str = Field(index=True)
    model: str = Field(index=True)
    status: str = Field(default="healthy")  # healthy, degraded, unhealthy
    avg_latency_ms: float = Field(default=0.0)
    error_rate: float = Field(default=0.0)
    last_checked: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[str] = None  # JSON metadata


# ============================================================================
# Memory Governance
# ============================================================================

class MemoryPolicy(SQLModel, table=True):
    """Memory governance policy per tenant"""
    __tablename__ = "memory_policies"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    tenant_id: str = Field(index=True, unique=True)
    ttl_days: Optional[int] = Field(default=90)  # None = no expiry
    pii_scrub_enabled: bool = Field(default=True)
    auto_purge_enabled: bool = Field(default=True)
    compliance_mode: str = Field(default="standard")  # standard, strict, custom
    retention_categories: str = Field(default="[]")  # JSON array of categories to retain
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class MemoryAuditLog(SQLModel, table=True):
    """Audit log for memory operations"""
    __tablename__ = "memory_audit_logs"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    tenant_id: str = Field(index=True)
    user_id: str = Field(index=True)
    operation: str  # add, search, purge, update, delete
    memory_id: Optional[str] = None
    category: Optional[str] = None
    reason: Optional[str] = None
    metadata: Optional[str] = None  # JSON metadata
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)


# ============================================================================
# Knowledge Graph
# ============================================================================

class KnowledgeGraphEntity(SQLModel, table=True):
    """Knowledge graph entity node"""
    __tablename__ = "kg_entities"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    tenant_id: str = Field(index=True)
    entity_id: str = Field(unique=True, index=True)
    entity_type: str = Field(index=True)  # product, feature, customer, document, issue
    name: str
    properties: str = Field(default="{}")  # JSON properties
    embedding: Optional[str] = None  # JSON array of embedding vector
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class KnowledgeGraphRelation(SQLModel, table=True):
    """Knowledge graph relationship edge"""
    __tablename__ = "kg_relations"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    tenant_id: str = Field(index=True)
    source_entity_id: str = Field(index=True)
    target_entity_id: str = Field(index=True)
    relation_type: str = Field(index=True)  # has_feature, mentioned_in, reported_by, related_to
    properties: str = Field(default="{}")  # JSON properties
    weight: float = Field(default=1.0)  # Relationship strength
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# Usage Metering
# ============================================================================

class UsageMeteringRecord(SQLModel, table=True):
    """Usage metering for billing and monitoring"""
    __tablename__ = "usage_metering"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    tenant_id: str = Field(index=True)
    workspace_id: Optional[str] = Field(index=True)
    user_id: Optional[str] = Field(index=True)
    
    # Request info
    endpoint: str
    request_id: str = Field(index=True)
    
    # Model info
    model_provider: str
    model_name: str
    
    # Usage metrics
    tokens_in: int = Field(default=0)
    tokens_out: int = Field(default=0)
    total_tokens: int = Field(default=0)
    
    # Performance
    latency_ms: float = Field(default=0.0)
    success: bool = Field(default=True)
    
    # Cost
    cost_usd: float = Field(default=0.0)
    
    # Metadata
    metadata: Optional[str] = None  # JSON metadata
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)


class TenantUsageQuota(SQLModel, table=True):
    """Usage quotas and limits per tenant"""
    __tablename__ = "tenant_usage_quotas"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    tenant_id: str = Field(index=True, unique=True)
    
    # Quotas
    monthly_token_limit: Optional[int] = None  # None = unlimited
    monthly_cost_limit_usd: Optional[float] = None
    requests_per_minute: int = Field(default=100)
    
    # Current usage (reset monthly)
    current_tokens_used: int = Field(default=0)
    current_cost_usd: float = Field(default=0.0)
    
    # Enforcement
    hard_cap_enabled: bool = Field(default=False)
    soft_cap_enabled: bool = Field(default=True)
    soft_cap_threshold: float = Field(default=0.8)  # 80% of limit
    
    # Billing
    stripe_subscription_id: Optional[str] = None
    billing_cycle_start: datetime = Field(default_factory=datetime.utcnow)
    
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# Voice Intelligence
# ============================================================================

class VoiceSession(SQLModel, table=True):
    """Voice/call session record"""
    __tablename__ = "voice_sessions"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: str = Field(unique=True, index=True)
    tenant_id: str = Field(index=True)
    user_id: str = Field(index=True)
    
    # Session info
    channel: str = Field(default="websocket")  # websocket, phone, meeting
    status: str = Field(default="active")  # active, completed, failed
    
    # Content
    transcript: Optional[str] = None
    summary: Optional[str] = None
    actions: str = Field(default="[]")  # JSON array of action items
    sentiment: Optional[str] = None  # positive, neutral, negative
    
    # Metrics
    duration_seconds: float = Field(default=0.0)
    words_spoken: int = Field(default=0)
    
    # Timestamps
    started_at: datetime = Field(default_factory=datetime.utcnow)
    ended_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    def get_actions(self) -> List[Dict[str, Any]]:
        """Parse actions from JSON"""
        return json.loads(self.actions) if self.actions else []
    
    def set_actions(self, actions: List[Dict[str, Any]]):
        """Serialize actions to JSON"""
        self.actions = json.dumps(actions)


class VoiceTranscriptChunk(SQLModel, table=True):
    """Real-time transcript chunks for streaming"""
    __tablename__ = "voice_transcript_chunks"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: str = Field(index=True)
    sequence_number: int
    text: str
    speaker: Optional[str] = None
    confidence: float = Field(default=1.0)
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# Analytics & Observability
# ============================================================================

class VectorSearchMetric(SQLModel, table=True):
    """Track vector search quality metrics"""
    __tablename__ = "vector_search_metrics"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    tenant_id: str = Field(index=True)
    query: str
    top_k: int
    results_returned: int
    clicked_position: Optional[int] = None  # Which result was clicked
    relevant: Optional[bool] = None  # User feedback
    recall_score: Optional[float] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)


class EmailPerformanceMetric(SQLModel, table=True):
    """Track email performance attribution"""
    __tablename__ = "email_performance_metrics"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    tenant_id: str = Field(index=True)
    campaign_id: str = Field(index=True)
    email_id: str = Field(index=True)
    
    # Generation info
    model_used: str
    generation_method: str  # ai, template, manual
    
    # Performance
    sent: bool = Field(default=False)
    opened: bool = Field(default=False)
    clicked: bool = Field(default=False)
    replied: bool = Field(default=False)
    
    # Metrics
    open_rate: Optional[float] = None
    click_rate: Optional[float] = None
    reply_rate: Optional[float] = None
    
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class LeadScoreAccuracyMetric(SQLModel, table=True):
    """Track lead scoring accuracy"""
    __tablename__ = "lead_score_accuracy_metrics"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    tenant_id: str = Field(index=True)
    lead_id: str = Field(index=True)
    
    # Prediction
    predicted_score: int
    predicted_tier: str  # hot, warm, cold
    model_used: str
    
    # Outcome
    actual_converted: Optional[bool] = None
    actual_value: Optional[float] = None
    days_to_conversion: Optional[int] = None
    
    # Accuracy
    score_error: Optional[float] = None
    tier_correct: Optional[bool] = None
    
    predicted_at: datetime = Field(default_factory=datetime.utcnow)
    outcome_at: Optional[datetime] = None


class AIResponseQualityFeedback(SQLModel, table=True):
    """User feedback on AI response quality"""
    __tablename__ = "ai_response_quality_feedback"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    tenant_id: str = Field(index=True)
    user_id: str = Field(index=True)
    
    # Request context
    endpoint: str
    request_id: str
    model_used: str
    
    # Feedback
    rating: int = Field(ge=1, le=5)  # 1-5 stars
    helpful: bool
    feedback_text: Optional[str] = None
    issues: str = Field(default="[]")  # JSON array: [incorrect, irrelevant, incomplete, etc.]
    
    timestamp: datetime = Field(default_factory=datetime.utcnow)
