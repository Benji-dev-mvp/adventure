"""
AI Orchestration Policies

Defines explicit policies per use case: lead scoring, email, campaign, chat
Each policy specifies model, temperature, tools, memory + RAG usage
"""

from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class UseCaseType(str, Enum):
    """Supported AI use cases"""

    LEAD_SCORING = "lead_scoring"
    EMAIL_GENERATION = "email_generation"
    CAMPAIGN_STRATEGY = "campaign_strategy"
    CONVERSATION = "conversation"
    SENTIMENT_ANALYSIS = "sentiment_analysis"
    CONTENT_PERSONALIZATION = "content_personalization"


class MemoryConfig(BaseModel):
    """Memory configuration for a use case"""

    enabled: bool = True
    memory_type: str = "buffer"  # buffer, summary, vector
    max_tokens: int = 2000
    ttl_seconds: Optional[int] = None  # None = permanent
    namespace_template: str = "org_{org_id}:user_{user_id}"
    compress_after: Optional[int] = 10  # Compress after N interactions
    redact_pii: bool = True


class RAGConfig(BaseModel):
    """RAG configuration for a use case"""

    enabled: bool = False
    collections: List[str] = Field(default_factory=list)
    similarity_threshold: float = 0.7
    max_results: int = 5
    hybrid_search: bool = True  # Vector + keyword
    safe_context_filter: bool = True  # Mitigate prompt injection
    index_version: str = "kb_v1"


class ToolConfig(BaseModel):
    """Tool configuration for a use case"""

    enabled: bool = False
    available_tools: List[str] = Field(default_factory=list)
    max_iterations: int = 5


class BudgetConfig(BaseModel):
    """Budget/cost control configuration"""

    max_tokens_per_request: Optional[int] = None
    max_cost_per_request: Optional[float] = None  # USD
    daily_token_limit: Optional[int] = None
    daily_cost_limit: Optional[float] = None  # USD


class AIPolicy(BaseModel):
    """
    Complete policy definition for an AI use case

    Defines all parameters needed to execute an AI operation:
    - Which model and parameters to use
    - Memory configuration
    - RAG retrieval settings
    - Available tools
    - Cost controls
    """

    use_case: UseCaseType
    name: str
    description: str

    # Model configuration
    provider: str = "openai"  # Can be overridden via config
    model: str = "gpt-4"
    temperature: float = 0.7
    max_tokens: Optional[int] = None
    top_p: float = 1.0

    # Capabilities
    memory: MemoryConfig = Field(default_factory=MemoryConfig)
    rag: RAGConfig = Field(default_factory=RAGConfig)
    tools: ToolConfig = Field(default_factory=ToolConfig)
    budget: BudgetConfig = Field(default_factory=BudgetConfig)

    # Prompts
    system_prompt: str
    user_prompt_template: str

    # Performance
    streaming_enabled: bool = False
    cache_results: bool = False
    cache_ttl_seconds: int = 300

    # Observability
    trace_enabled: bool = True
    log_inputs: bool = True
    log_outputs: bool = True


# ============================================================================
# Default Policies
# ============================================================================

DEFAULT_POLICIES: Dict[UseCaseType, AIPolicy] = {
    UseCaseType.LEAD_SCORING: AIPolicy(
        use_case=UseCaseType.LEAD_SCORING,
        name="Lead Scoring v1",
        description="Score leads based on firmographic, behavioral, and engagement data",
        model="gpt-4.1-mini",  # Faster, cheaper for structured scoring
        temperature=0.3,  # Lower temperature for consistent scoring
        max_tokens=500,
        memory=MemoryConfig(
            enabled=True,
            memory_type="summary",
            max_tokens=1000,
            ttl_seconds=86400 * 30,  # 30 days
            compress_after=5,
            redact_pii=True,
        ),
        rag=RAGConfig(
            enabled=True,
            collections=["ideal_customer_profiles", "historical_conversions"],
            similarity_threshold=0.75,
            max_results=3,
            hybrid_search=True,
        ),
        tools=ToolConfig(enabled=False),
        budget=BudgetConfig(
            max_tokens_per_request=1000,
            max_cost_per_request=0.05,
        ),
        system_prompt="""You are an expert B2B lead scoring AI. Analyze leads based on:
- Company size, industry, revenue
- Engagement signals (website visits, email opens, content downloads)
- Fit with ideal customer profile
- Buying signals and intent

Provide scores 0-100 with confidence levels and clear reasoning.""",
        user_prompt_template="""Score this lead:
Company: {company_name}
Industry: {industry}
Size: {company_size}
Engagement: {engagement_summary}
Signals: {buying_signals}

Context from similar successful conversions:
{rag_context}""",
        cache_results=True,
        cache_ttl_seconds=3600,  # Cache for 1 hour
    ),
    UseCaseType.EMAIL_GENERATION: AIPolicy(
        use_case=UseCaseType.EMAIL_GENERATION,
        name="Email Generation v1",
        description="Generate personalized outbound emails",
        model="gpt-4",
        temperature=0.8,  # Higher creativity for engaging content
        max_tokens=800,
        memory=MemoryConfig(
            enabled=True,
            memory_type="buffer",
            max_tokens=2000,
            ttl_seconds=86400 * 7,  # 7 days
            namespace_template="org_{org_id}:account_{account_id}",
            redact_pii=True,
        ),
        rag=RAGConfig(
            enabled=True,
            collections=["email_templates", "successful_campaigns", "product_info"],
            similarity_threshold=0.7,
            max_results=5,
            hybrid_search=True,
            safe_context_filter=True,
        ),
        tools=ToolConfig(enabled=False),
        budget=BudgetConfig(
            max_tokens_per_request=2000,
            max_cost_per_request=0.10,
        ),
        system_prompt="""You are an expert B2B email copywriter. Write personalized, engaging emails that:
- Hook readers in the subject line
- Demonstrate understanding of their business
- Provide clear value proposition
- Include compelling CTA
- Match the specified tone (professional/casual/enthusiastic)

Avoid: Generic templates, excessive length, hard selling.""",
        user_prompt_template="""Generate an email for:
Recipient: {recipient_name} at {company_name}
Role: {job_title}
Context: {context}
Tone: {tone}
Goal: {objective}

Personalization data:
{personalization_data}

Reference material:
{rag_context}""",
        cache_results=False,  # Don't cache - each email should be unique
    ),
    UseCaseType.CAMPAIGN_STRATEGY: AIPolicy(
        use_case=UseCaseType.CAMPAIGN_STRATEGY,
        name="Campaign Strategy v1",
        description="Generate multi-channel campaign strategies",
        model="gpt-4",
        temperature=0.7,
        max_tokens=2000,
        memory=MemoryConfig(
            enabled=True,
            memory_type="summary",
            max_tokens=3000,
            compress_after=3,
            redact_pii=True,
        ),
        rag=RAGConfig(
            enabled=True,
            collections=["campaign_playbooks", "industry_benchmarks", "best_practices"],
            similarity_threshold=0.7,
            max_results=10,
            hybrid_search=True,
        ),
        tools=ToolConfig(
            enabled=True,
            available_tools=[
                "analyze_past_campaigns",
                "fetch_industry_benchmarks",
                "calculate_roi",
            ],
            max_iterations=3,
        ),
        budget=BudgetConfig(
            max_tokens_per_request=5000,
            max_cost_per_request=0.25,
        ),
        system_prompt="""You are an expert B2B marketing strategist. Design comprehensive campaign strategies including:
- Target audience segmentation
- Channel mix (email, LinkedIn, calls, ads)
- Sequence timing and cadence
- Messaging themes per segment
- Success metrics and KPIs
- Budget allocation

Base recommendations on data and proven tactics.""",
        user_prompt_template="""Design a campaign for:
Objective: {objective}
Target audience: {target_description}
Budget: {budget}
Timeline: {timeline}
Constraints: {constraints}

Historical performance:
{historical_data}

Industry insights:
{rag_context}""",
        streaming_enabled=True,  # Long-form content benefits from streaming
        cache_results=True,
        cache_ttl_seconds=1800,  # 30 minutes
    ),
    UseCaseType.CONVERSATION: AIPolicy(
        use_case=UseCaseType.CONVERSATION,
        name="AI Assistant Chat v1",
        description="Interactive AI assistant conversations (Ava)",
        model="gpt-4",
        temperature=0.7,
        max_tokens=1500,
        memory=MemoryConfig(
            enabled=True,
            memory_type="buffer",
            max_tokens=4000,
            ttl_seconds=3600,  # 1 hour for active sessions
            namespace_template="org_{org_id}:user_{user_id}:session_{session_id}",
            compress_after=15,
            redact_pii=True,
        ),
        rag=RAGConfig(
            enabled=True,
            collections=["documentation", "faq", "product_info", "user_data"],
            similarity_threshold=0.65,
            max_results=8,
            hybrid_search=True,
            safe_context_filter=True,
        ),
        tools=ToolConfig(
            enabled=True,
            available_tools=[
                "search_leads",
                "get_campaign_stats",
                "generate_report",
                "schedule_meeting",
                "send_email",
            ],
            max_iterations=5,
        ),
        budget=BudgetConfig(
            max_tokens_per_request=3000,
            daily_token_limit=100000,  # Per user
        ),
        system_prompt="""You are Ava, an AI assistant for B2B sales automation. Help users with:
- Campaign planning and execution
- Lead research and scoring
- Email generation and optimization
- Analytics and reporting
- Strategy recommendations

Be helpful, conversational, and proactive. Use tools when needed.""",
        user_prompt_template="""{user_message}

{rag_context}""",
        streaming_enabled=True,
        cache_results=False,  # Conversations are unique
    ),
}
