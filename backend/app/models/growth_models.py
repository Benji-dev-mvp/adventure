"""
Growth infrastructure models: billing, subscriptions, teams, analytics, and strategic features
"""
from datetime import datetime
from typing import Optional, List
from enum import Enum
from sqlmodel import SQLModel, Field, Index, Column, TEXT
from pydantic import EmailStr


class SubscriptionTier(str, Enum):
    """Subscription tier levels"""
    FREE = "free"
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"
    TRIAL = "trial"


class SubscriptionStatus(str, Enum):
    """Subscription status types"""
    ACTIVE = "active"
    TRIALING = "trialing"
    PAST_DUE = "past_due"
    CANCELED = "canceled"
    INCOMPLETE = "incomplete"
    INCOMPLETE_EXPIRED = "incomplete_expired"


class BillingPeriod(str, Enum):
    """Billing period types"""
    MONTHLY = "monthly"
    YEARLY = "yearly"


class InvitationStatus(str, Enum):
    """Team invitation status"""
    PENDING = "pending"
    ACCEPTED = "accepted"
    EXPIRED = "expired"
    REVOKED = "revoked"


# ============================================================================
# Billing & Subscription Models
# ============================================================================

class Subscription(SQLModel, table=True):
    """User/Team subscription with Stripe integration"""
    __tablename__ = "subscriptions"
    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_team_id", "team_id"),
        Index("idx_status", "status"),
        Index("idx_stripe_subscription_id", "stripe_subscription_id"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="users.id", index=True)
    team_id: Optional[int] = Field(default=None, foreign_key="teams.id", index=True)
    
    # Stripe data
    stripe_customer_id: Optional[str] = Field(default=None, max_length=255)
    stripe_subscription_id: Optional[str] = Field(default=None, max_length=255, index=True)
    stripe_price_id: Optional[str] = Field(default=None, max_length=255)
    
    # Subscription details
    tier: SubscriptionTier = Field(default=SubscriptionTier.FREE)
    status: SubscriptionStatus = Field(default=SubscriptionStatus.ACTIVE, index=True)
    billing_period: BillingPeriod = Field(default=BillingPeriod.MONTHLY)
    
    # Pricing
    price_per_seat: float = Field(default=0.0, ge=0)
    seats: int = Field(default=1, ge=1)
    total_price: float = Field(default=0.0, ge=0)
    
    # Trial
    trial_start: Optional[datetime] = None
    trial_end: Optional[datetime] = None
    is_trial: bool = Field(default=False)
    
    # Lifecycle
    current_period_start: Optional[datetime] = None
    current_period_end: Optional[datetime] = None
    cancel_at_period_end: bool = Field(default=False)
    canceled_at: Optional[datetime] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class UsageMetrics(SQLModel, table=True):
    """Track usage for metered billing"""
    __tablename__ = "usage_metrics"
    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_team_id", "team_id"),
        Index("idx_subscription_id", "subscription_id"),
        Index("idx_period_start", "period_start"),
        Index("idx_metric_type", "metric_type"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="users.id", index=True)
    team_id: Optional[int] = Field(default=None, foreign_key="teams.id", index=True)
    subscription_id: int = Field(foreign_key="subscriptions.id", index=True)
    
    # Metric details
    metric_type: str = Field(max_length=50, index=True)  # emails_sent, api_calls, leads_created, etc.
    quantity: int = Field(default=0, ge=0)
    
    # Period
    period_start: datetime = Field(index=True)
    period_end: datetime
    
    # Billing
    unit_price: float = Field(default=0.0, ge=0)
    total_cost: float = Field(default=0.0, ge=0)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Invoice(SQLModel, table=True):
    """Invoice records"""
    __tablename__ = "invoices"
    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_team_id", "team_id"),
        Index("idx_subscription_id", "subscription_id"),
        Index("idx_status", "status"),
        Index("idx_stripe_invoice_id", "stripe_invoice_id"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="users.id", index=True)
    team_id: Optional[int] = Field(default=None, foreign_key="teams.id", index=True)
    subscription_id: Optional[int] = Field(default=None, foreign_key="subscriptions.id", index=True)
    
    # Stripe data
    stripe_invoice_id: Optional[str] = Field(default=None, max_length=255, index=True)
    stripe_payment_intent_id: Optional[str] = Field(default=None, max_length=255)
    
    # Invoice details
    invoice_number: str = Field(max_length=100, unique=True)
    status: str = Field(default="draft", max_length=50, index=True)  # draft, open, paid, void, uncollectible
    
    # Amounts
    subtotal: float = Field(default=0.0, ge=0)
    tax: float = Field(default=0.0, ge=0)
    total: float = Field(default=0.0, ge=0)
    amount_paid: float = Field(default=0.0, ge=0)
    amount_due: float = Field(default=0.0, ge=0)
    
    # Dates
    invoice_date: datetime
    due_date: Optional[datetime] = None
    paid_at: Optional[datetime] = None
    
    # Line items (JSON)
    line_items: Optional[str] = Field(default=None, sa_column=Column(TEXT))
    
    # URLs
    invoice_pdf_url: Optional[str] = Field(default=None, max_length=500)
    hosted_invoice_url: Optional[str] = Field(default=None, max_length=500)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# Team & Workspace Models
# ============================================================================

class Workspace(SQLModel, table=True):
    """Workspace for team collaboration"""
    __tablename__ = "workspaces"
    __table_args__ = (
        Index("idx_slug", "slug"),
        Index("idx_owner_id", "owner_id"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(min_length=1, max_length=100)
    slug: str = Field(min_length=1, max_length=100, unique=True, index=True)
    description: Optional[str] = Field(default=None, max_length=500)
    
    # Settings
    settings: Optional[str] = Field(default=None, sa_column=Column(TEXT))  # JSON configuration
    
    # Ownership
    owner_id: int = Field(foreign_key="users.id", index=True)
    team_id: Optional[int] = Field(default=None, foreign_key="teams.id")
    
    # Status
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TeamMember(SQLModel, table=True):
    """Team member with role-based access"""
    __tablename__ = "team_members"
    __table_args__ = (
        Index("idx_team_id", "team_id"),
        Index("idx_user_id", "user_id"),
        Index("idx_workspace_id", "workspace_id"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    team_id: int = Field(foreign_key="teams.id", index=True)
    workspace_id: Optional[int] = Field(default=None, foreign_key="workspaces.id", index=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    
    # Role and permissions
    role: str = Field(default="member", max_length=50)  # owner, admin, member, viewer
    permissions: Optional[str] = Field(default=None, sa_column=Column(TEXT))  # JSON permissions
    
    # Status
    is_active: bool = Field(default=True)
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    last_active: Optional[datetime] = None


class Invitation(SQLModel, table=True):
    """Team invitation for workspace provisioning"""
    __tablename__ = "invitations"
    __table_args__ = (
        Index("idx_team_id", "team_id"),
        Index("idx_workspace_id", "workspace_id"),
        Index("idx_email", "email"),
        Index("idx_token", "token"),
        Index("idx_status", "status"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    team_id: int = Field(foreign_key="teams.id", index=True)
    workspace_id: Optional[int] = Field(default=None, foreign_key="workspaces.id", index=True)
    
    # Invitee
    email: EmailStr = Field(index=True)
    invited_by_user_id: int = Field(foreign_key="users.id")
    
    # Invitation details
    token: str = Field(max_length=255, unique=True, index=True)
    role: str = Field(default="member", max_length=50)
    status: InvitationStatus = Field(default=InvitationStatus.PENDING, index=True)
    
    # Lifecycle
    expires_at: datetime
    accepted_at: Optional[datetime] = None
    revoked_at: Optional[datetime] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# Analytics Models
# ============================================================================

class ActivationMetrics(SQLModel, table=True):
    """Track user activation milestones"""
    __tablename__ = "activation_metrics"
    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_team_id", "team_id"),
        Index("idx_milestone", "milestone"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    team_id: Optional[int] = Field(default=None, foreign_key="teams.id", index=True)
    
    # Milestone tracking
    milestone: str = Field(max_length=100, index=True)  # onboarding_completed, first_campaign, first_lead, etc.
    completed: bool = Field(default=False)
    completed_at: Optional[datetime] = None
    
    # Additional data
    metadata: Optional[str] = Field(default=None, sa_column=Column(TEXT))  # JSON metadata
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class RetentionMetrics(SQLModel, table=True):
    """Track user retention and engagement"""
    __tablename__ = "retention_metrics"
    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_team_id", "team_id"),
        Index("idx_period_start", "period_start"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    team_id: Optional[int] = Field(default=None, foreign_key="teams.id", index=True)
    
    # Period
    period_start: datetime = Field(index=True)
    period_end: datetime
    
    # Engagement metrics
    login_count: int = Field(default=0, ge=0)
    active_days: int = Field(default=0, ge=0)
    campaigns_created: int = Field(default=0, ge=0)
    leads_added: int = Field(default=0, ge=0)
    emails_sent: int = Field(default=0, ge=0)
    
    # Churn risk
    churn_risk_score: int = Field(default=0, ge=0, le=100)
    is_at_risk: bool = Field(default=False)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ExpansionMetrics(SQLModel, table=True):
    """Track expansion opportunities and upsells"""
    __tablename__ = "expansion_metrics"
    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_team_id", "team_id"),
        Index("idx_opportunity_type", "opportunity_type"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    team_id: Optional[int] = Field(default=None, foreign_key="teams.id", index=True)
    
    # Opportunity
    opportunity_type: str = Field(max_length=100, index=True)  # add_seats, upgrade_tier, add_feature, etc.
    score: int = Field(default=0, ge=0, le=100)  # Propensity score
    
    # Details
    current_value: float = Field(default=0.0, ge=0)
    potential_value: float = Field(default=0.0, ge=0)
    expansion_revenue: float = Field(default=0.0, ge=0)
    
    # Status
    presented: bool = Field(default=False)
    presented_at: Optional[datetime] = None
    converted: bool = Field(default=False)
    converted_at: Optional[datetime] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# Release Center & Changelog
# ============================================================================

class ReleaseNote(SQLModel, table=True):
    """Release notes and changelog"""
    __tablename__ = "release_notes"
    __table_args__ = (
        Index("idx_version", "version"),
        Index("idx_release_date", "release_date"),
        Index("idx_category", "category"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    version: str = Field(max_length=50, index=True)  # e.g., "2.1.0"
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(sa_column=Column(TEXT))
    
    # Categorization
    category: str = Field(default="feature", max_length=50, index=True)  # feature, bugfix, improvement, security
    tags: Optional[str] = Field(default=None, max_length=500)  # Comma-separated
    
    # Release info
    release_date: datetime = Field(index=True)
    author: Optional[str] = Field(default=None, max_length=100)
    
    # Visibility
    is_published: bool = Field(default=False)
    is_featured: bool = Field(default=False)
    
    # Content
    changelog_markdown: Optional[str] = Field(default=None, sa_column=Column(TEXT))
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# Feedback & NPS
# ============================================================================

class NPSResponse(SQLModel, table=True):
    """Net Promoter Score responses"""
    __tablename__ = "nps_responses"
    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_team_id", "team_id"),
        Index("idx_score", "score"),
        Index("idx_submitted_at", "submitted_at"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    team_id: Optional[int] = Field(default=None, foreign_key="teams.id", index=True)
    
    # NPS details
    score: int = Field(ge=0, le=10, index=True)  # 0-10 scale
    category: str = Field(max_length=20)  # detractor (0-6), passive (7-8), promoter (9-10)
    
    # Feedback
    feedback: Optional[str] = Field(default=None, sa_column=Column(TEXT))
    
    # Context
    survey_context: Optional[str] = Field(default=None, max_length=100)  # where/when survey was shown
    
    # Follow-up
    contacted: bool = Field(default=False)
    contacted_at: Optional[datetime] = None
    
    # Timestamps
    submitted_at: datetime = Field(default_factory=datetime.utcnow, index=True)


class FeedbackSubmission(SQLModel, table=True):
    """User feedback submissions"""
    __tablename__ = "feedback_submissions"
    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_team_id", "team_id"),
        Index("idx_category", "category"),
        Index("idx_status", "status"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    team_id: Optional[int] = Field(default=None, foreign_key="teams.id", index=True)
    
    # Feedback details
    category: str = Field(max_length=50, index=True)  # bug, feature_request, improvement, question
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(sa_column=Column(TEXT))
    
    # Status
    status: str = Field(default="open", max_length=50, index=True)  # open, in_review, planned, completed, closed
    priority: str = Field(default="medium", max_length=20)  # low, medium, high, critical
    
    # Engagement
    upvotes: int = Field(default=0, ge=0)
    
    # Response
    admin_response: Optional[str] = Field(default=None, sa_column=Column(TEXT))
    responded_at: Optional[datetime] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# Strategic Feature Models
# ============================================================================

class AdaptiveAIConfig(SQLModel, table=True):
    """Configuration for Adaptive Outbound AI"""
    __tablename__ = "adaptive_ai_configs"
    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_team_id", "team_id"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    team_id: Optional[int] = Field(default=None, foreign_key="teams.id", index=True)
    
    # Learning configuration
    enabled: bool = Field(default=True)
    learning_rate: float = Field(default=0.1, ge=0, le=1)
    
    # ICP (Ideal Customer Profile) learning
    icp_attributes: Optional[str] = Field(default=None, sa_column=Column(TEXT))  # JSON
    icp_confidence: float = Field(default=0.0, ge=0, le=1)
    
    # Messaging optimization
    messaging_patterns: Optional[str] = Field(default=None, sa_column=Column(TEXT))  # JSON
    best_performing_templates: Optional[str] = Field(default=None, sa_column=Column(TEXT))  # JSON
    
    # Performance
    success_rate: float = Field(default=0.0, ge=0, le=1)
    improvement_rate: float = Field(default=0.0)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class KnowledgeDocument(SQLModel, table=True):
    """Knowledge Fusion - Auto-created docs from calls/emails"""
    __tablename__ = "knowledge_documents"
    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_team_id", "team_id"),
        Index("idx_doc_type", "doc_type"),
        Index("idx_source_type", "source_type"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    team_id: Optional[int] = Field(default=None, foreign_key="teams.id", index=True)
    
    # Document details
    title: str = Field(min_length=1, max_length=200)
    content: str = Field(sa_column=Column(TEXT))
    doc_type: str = Field(max_length=50, index=True)  # battle_card, playbook, objection_handler, faq
    
    # Source
    source_type: str = Field(max_length=50, index=True)  # call, email, meeting, manual
    source_id: Optional[int] = None
    source_metadata: Optional[str] = Field(default=None, sa_column=Column(TEXT))  # JSON
    
    # AI processing
    ai_generated: bool = Field(default=False)
    confidence_score: float = Field(default=0.0, ge=0, le=1)
    
    # Usage
    view_count: int = Field(default=0, ge=0)
    last_viewed: Optional[datetime] = None
    
    # Status
    is_published: bool = Field(default=False)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class WorkflowMap(SQLModel, table=True):
    """Visual automation canvas - Workflow Map Builder"""
    __tablename__ = "workflow_maps"
    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_team_id", "team_id"),
        Index("idx_is_active", "is_active"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    team_id: Optional[int] = Field(default=None, foreign_key="teams.id", index=True)
    
    # Workflow details
    name: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    
    # Canvas data (JSON)
    nodes: str = Field(sa_column=Column(TEXT))  # Visual nodes
    edges: str = Field(sa_column=Column(TEXT))  # Connections
    config: Optional[str] = Field(default=None, sa_column=Column(TEXT))  # Additional configuration
    
    # Execution
    is_active: bool = Field(default=False, index=True)
    last_executed: Optional[datetime] = None
    execution_count: int = Field(default=0, ge=0)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class VoiceAction(SQLModel, table=True):
    """Voice-to-Action Agent - Call to tasks/tickets automatically"""
    __tablename__ = "voice_actions"
    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_team_id", "team_id"),
        Index("idx_call_id", "call_id"),
        Index("idx_status", "status"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    team_id: Optional[int] = Field(default=None, foreign_key="teams.id", index=True)
    
    # Call reference
    call_id: Optional[int] = None
    call_recording_url: Optional[str] = Field(default=None, max_length=500)
    
    # Transcription
    transcript: Optional[str] = Field(default=None, sa_column=Column(TEXT))
    transcript_confidence: float = Field(default=0.0, ge=0, le=1)
    
    # Extracted actions (JSON array)
    extracted_actions: str = Field(sa_column=Column(TEXT))
    
    # Processing
    status: str = Field(default="pending", max_length=50, index=True)  # pending, processing, completed, failed
    processed_at: Optional[datetime] = None
    
    # Generated artifacts
    tasks_created: int = Field(default=0, ge=0)
    tickets_created: int = Field(default=0, ge=0)
    follow_ups_created: int = Field(default=0, ge=0)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class AISafetyLog(SQLModel, table=True):
    """AI Safety Console - Admin guardrails + compliance"""
    __tablename__ = "ai_safety_logs"
    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_team_id", "team_id"),
        Index("idx_violation_type", "violation_type"),
        Index("idx_severity", "severity"),
        Index("idx_timestamp", "timestamp"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="users.id", index=True)
    team_id: Optional[int] = Field(default=None, foreign_key="teams.id", index=True)
    
    # Violation details
    violation_type: str = Field(max_length=100, index=True)  # spam, profanity, pii_exposure, etc.
    severity: str = Field(max_length=20, index=True)  # low, medium, high, critical
    
    # Context
    context_type: str = Field(max_length=50)  # email, message, campaign, etc.
    context_id: Optional[int] = None
    content_sample: Optional[str] = Field(default=None, sa_column=Column(TEXT))
    
    # Detection
    detection_method: str = Field(max_length=50)  # ai_classifier, rule_based, manual_review
    confidence_score: float = Field(default=0.0, ge=0, le=1)
    
    # Action taken
    action_taken: Optional[str] = Field(default=None, max_length=200)  # blocked, flagged, modified, none
    
    # Review
    reviewed: bool = Field(default=False)
    reviewed_by: Optional[int] = Field(default=None, foreign_key="users.id")
    reviewed_at: Optional[datetime] = None
    
    # Timestamps
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)


class AISalesboardMetric(SQLModel, table=True):
    """AI Salesboard - Live insights and rep coaching"""
    __tablename__ = "ai_salesboard_metrics"
    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_team_id", "team_id"),
        Index("idx_metric_date", "metric_date"),
    )
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    team_id: Optional[int] = Field(default=None, foreign_key="teams.id", index=True)
    
    # Metric date
    metric_date: datetime = Field(index=True)
    
    # Performance metrics
    pipeline_value: float = Field(default=0.0, ge=0)
    deals_in_pipeline: int = Field(default=0, ge=0)
    conversion_rate: float = Field(default=0.0, ge=0, le=1)
    avg_deal_size: float = Field(default=0.0, ge=0)
    
    # Activity metrics
    calls_made: int = Field(default=0, ge=0)
    emails_sent: int = Field(default=0, ge=0)
    meetings_booked: int = Field(default=0, ge=0)
    
    # AI insights (JSON)
    ai_insights: Optional[str] = Field(default=None, sa_column=Column(TEXT))
    coaching_recommendations: Optional[str] = Field(default=None, sa_column=Column(TEXT))
    
    # Performance score
    overall_score: int = Field(default=0, ge=0, le=100)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
