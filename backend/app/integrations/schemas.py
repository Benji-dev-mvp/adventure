"""
Versioned API Schemas for AI Endpoints

Strict Pydantic models for all AI API surfaces with versioning support
"""

from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, field_validator

# ============================================================================
# Error Models
# ============================================================================


class ErrorCode(str, Enum):
    """Standard error codes for AI operations"""

    BUDGET_EXCEEDED = "budget_exceeded"
    INVALID_INPUT = "invalid_input"
    MODEL_ERROR = "model_error"
    TIMEOUT = "timeout"
    RATE_LIMIT = "rate_limit"
    UNAUTHORIZED = "unauthorized"
    POLICY_NOT_FOUND = "policy_not_found"
    PROVIDER_ERROR = "provider_error"
    VALIDATION_ERROR = "validation_error"


class AiErrorResponse(BaseModel):
    """Standardized error response for AI operations"""

    error_code: ErrorCode
    message: str
    details: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    request_id: Optional[str] = None
    retry_after: Optional[int] = None  # Seconds to wait before retry


# ============================================================================
# Lead Scoring V1
# ============================================================================


class LeadScoreRequestV1(BaseModel):
    """Request for lead scoring - Version 1"""

    lead_id: str = Field(..., description="Unique lead identifier")
    company_name: str = Field(..., min_length=1, max_length=200)
    industry: Optional[str] = Field(None, max_length=100)
    company_size: Optional[int] = Field(None, ge=1)
    revenue: Optional[float] = Field(None, ge=0)
    engagement_summary: Optional[str] = Field(None, max_length=1000)
    buying_signals: List[str] = Field(default_factory=list, max_items=20)
    contact_id: Optional[str] = None
    account_id: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ScoringFactor(BaseModel):
    """Individual factor contributing to score"""

    category: str = Field(..., description="Factor category (e.g., 'firmographic', 'engagement')")
    name: str = Field(..., description="Factor name")
    weight: float = Field(..., ge=0, le=1, description="Weight in final score")
    value: str = Field(..., description="Human-readable value")
    impact: int = Field(..., ge=-100, le=100, description="Impact on score (-100 to +100)")


class LeadScoreResponseV1(BaseModel):
    """Response for lead scoring - Version 1"""

    lead_id: str
    score: int = Field(..., ge=0, le=100, description="Lead score 0-100")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence level")
    grade: str = Field(..., description="Grade (A/B/C/D/F)")
    factors: List[ScoringFactor] = Field(..., description="Scoring factors with rationale")
    recommendation: str = Field(..., max_length=500, description="Action recommendation")
    priority: str = Field(..., description="Priority level (high/medium/low)")
    next_best_action: Optional[str] = None
    estimated_conversion_probability: Optional[float] = Field(None, ge=0.0, le=1.0)
    model_version: str = "v1"
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    @field_validator("grade")
    @classmethod
    def validate_grade(cls, v):
        if v not in ["A", "B", "C", "D", "F"]:
            raise ValueError("Grade must be A, B, C, D, or F")
        return v

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v):
        if v not in ["high", "medium", "low"]:
            raise ValueError("Priority must be high, medium, or low")
        return v


# ============================================================================
# Email Generation V1
# ============================================================================


class EmailTone(str, Enum):
    """Email tone options"""

    PROFESSIONAL = "professional"
    CASUAL = "casual"
    ENTHUSIASTIC = "enthusiastic"
    CONSULTATIVE = "consultative"


class EmailGenerateRequestV1(BaseModel):
    """Request for email generation - Version 1"""

    recipient_name: str = Field(..., min_length=1, max_length=100)
    company_name: str = Field(..., min_length=1, max_length=200)
    job_title: Optional[str] = Field(None, max_length=100)
    tone: EmailTone = EmailTone.PROFESSIONAL
    objective: str = Field(..., max_length=200, description="Email objective/goal")
    context: Optional[str] = Field(None, max_length=1000)
    personalization_data: Dict[str, Any] = Field(default_factory=dict)
    lead_id: Optional[str] = None
    contact_id: Optional[str] = None
    account_id: Optional[str] = None
    max_length: int = Field(800, ge=100, le=2000, description="Max email body length")


class EmailGenerateResponseV1(BaseModel):
    """Response for email generation - Version 1"""

    subject: str = Field(..., min_length=5, max_length=100)
    body: str = Field(..., min_length=50, max_length=2000)
    preview_text: Optional[str] = Field(None, max_length=150)
    tone: EmailTone
    personalization_score: float = Field(..., ge=0.0, le=1.0)
    call_to_action: str = Field(..., max_length=100)
    estimated_effectiveness: float = Field(
        ..., ge=0.0, le=1.0, description="Predicted open/reply rate"
    )
    variables_used: List[str] = Field(default_factory=list)
    model_version: str = "v1"
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    @field_validator("subject")
    @classmethod
    def validate_subject(cls, v):
        if v.count("!") > 1:
            raise ValueError("Subject line should not have excessive exclamation marks")
        if v.isupper():
            raise ValueError("Subject line should not be all caps")
        return v


# ============================================================================
# Campaign Strategy V1
# ============================================================================


class CampaignObjective(str, Enum):
    """Campaign objectives"""

    LEAD_GENERATION = "lead_generation"
    NURTURE = "nurture"
    REACTIVATION = "reactivation"
    EXPANSION = "expansion"
    DEMO_BOOKING = "demo_booking"


class ChannelRecommendation(BaseModel):
    """Channel recommendation with reasoning"""

    channel: str = Field(..., description="Channel name (email, linkedin, call, ads)")
    priority: int = Field(..., ge=1, le=10, description="Priority 1-10")
    reasoning: str = Field(..., max_length=500)
    estimated_reach: Optional[int] = None
    estimated_cost: Optional[float] = None


class SequenceStep(BaseModel):
    """Campaign sequence step"""

    step_number: int = Field(..., ge=1)
    channel: str
    timing_days: int = Field(..., ge=0, description="Days after previous step")
    message_theme: str = Field(..., max_length=200)
    cta: str = Field(..., max_length=100)


class CampaignStrategyRequestV1(BaseModel):
    """Request for campaign strategy - Version 1"""

    objective: CampaignObjective
    target_description: str = Field(..., max_length=1000)
    budget: Optional[float] = Field(None, ge=0)
    timeline_days: int = Field(..., ge=7, le=180)
    constraints: Optional[str] = Field(None, max_length=500)
    historical_data: Optional[Dict[str, Any]] = None
    industry: Optional[str] = None
    account_id: Optional[str] = None


class CampaignStrategyResponseV1(BaseModel):
    """Response for campaign strategy - Version 1"""

    objective: CampaignObjective
    strategy_summary: str = Field(..., max_length=1000)
    target_segments: List[str] = Field(..., min_items=1, max_items=5)
    channels: List[ChannelRecommendation] = Field(..., min_items=1)
    sequence_steps: List[SequenceStep] = Field(..., min_items=3, max_items=10)
    estimated_roi: float = Field(..., description="Estimated ROI percentage")
    estimated_reach: int = Field(..., ge=0)
    budget_allocation: Dict[str, float] = Field(default_factory=dict)
    success_metrics: List[str] = Field(..., min_items=1)
    risks_and_mitigations: List[Dict[str, str]] = Field(default_factory=list)
    model_version: str = "v1"
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# Conversation V1
# ============================================================================


class ConversationRole(str, Enum):
    """Conversation roles"""

    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class ConversationMessage(BaseModel):
    """Single conversation message"""

    role: ConversationRole
    content: str = Field(..., min_length=1, max_length=10000)
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ConversationRequestV1(BaseModel):
    """Request for conversation - Version 1"""

    message: str = Field(..., min_length=1, max_length=10000)
    session_id: str = Field(..., description="Conversation session ID")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict)
    max_history: int = Field(10, ge=1, le=50, description="Max messages to include from history")
    tools_enabled: bool = Field(True, description="Whether to enable tool calling")


class ToolCall(BaseModel):
    """Tool/function called during conversation"""

    tool_name: str
    arguments: Dict[str, Any]
    result: Optional[str] = None


class ConversationResponseV1(BaseModel):
    """Response for conversation - Version 1"""

    message: str = Field(..., min_length=1)
    session_id: str
    tools_called: List[ToolCall] = Field(default_factory=list)
    suggested_actions: List[str] = Field(default_factory=list)
    confidence: float = Field(..., ge=0.0, le=1.0)
    requires_followup: bool = False
    model_version: str = "v1"
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# Batch Operations V1
# ============================================================================


class BatchScoreLeadsRequestV1(BaseModel):
    """Request for batch lead scoring - Version 1"""

    lead_ids: List[str] = Field(..., min_items=1, max_items=1000)
    async_processing: bool = Field(True, description="Process asynchronously in background")
    callback_url: Optional[str] = Field(None, description="Webhook URL for completion notification")
    priority: str = Field("normal", description="Priority level (low/normal/high)")


class BatchJobStatus(str, Enum):
    """Batch job status"""

    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    PARTIAL = "partial"


class BatchScoreLeadsResponseV1(BaseModel):
    """Response for batch lead scoring - Version 1"""

    job_id: str = Field(..., description="Unique job identifier")
    status: BatchJobStatus
    total_leads: int
    processed_leads: int = 0
    failed_leads: int = 0
    estimated_completion_time: Optional[datetime] = None
    results_url: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# Budget/Usage V1
# ============================================================================


class UsageStats(BaseModel):
    """Usage statistics"""

    tokens_used: int = Field(..., ge=0)
    tokens_remaining: int = Field(..., ge=0)
    tokens_limit: int = Field(..., ge=0)
    cost_used: float = Field(..., ge=0.0)
    cost_remaining: float = Field(..., ge=0.0)
    cost_limit: float = Field(..., ge=0.0)
    reset_at: datetime


class BudgetResponseV1(BaseModel):
    """Budget/usage response - Version 1"""

    user: UsageStats
    org: UsageStats
    timestamp: datetime = Field(default_factory=datetime.utcnow)
