"""
Pydantic AI Type-Safe Agent Integration

Provides type-safe AI agents with:
- Full type inference for tools and outputs
- Structured output validation
- Dependency injection via RunContext
- Retry logic with validation
- Integration with OpenAI and Anthropic
"""

import os
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, field_validator
from pydantic_ai import Agent, RunContext
from pydantic_ai.models.anthropic import AnthropicModel
from pydantic_ai.models.openai import OpenAIModel

# ============================================================================
# Output Schemas (Type-Safe)
# ============================================================================


class LeadScore(BaseModel):
    """Type-safe lead scoring output"""

    score: int = Field(..., ge=0, le=100, description="Lead score 0-100")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence level")
    factors: List[str] = Field(default_factory=list, description="Scoring factors")
    recommendation: str = Field(..., description="Action recommendation")

    @field_validator("score")
    @classmethod
    def validate_score(cls, v):
        if not 0 <= v <= 100:
            raise ValueError("Score must be between 0 and 100")
        return v


class EmailGeneration(BaseModel):
    """Type-safe email generation output"""

    subject: str = Field(..., min_length=5, max_length=100)
    body: str = Field(..., min_length=50, max_length=2000)
    tone: str = Field(..., description="Detected tone")
    personalization_score: float = Field(..., ge=0.0, le=1.0)
    call_to_action: str = Field(..., description="Primary CTA")

    @field_validator("subject")
    @classmethod
    def validate_subject(cls, v):
        if v.count("!") > 1:
            raise ValueError("Subject line should not have excessive exclamation marks")
        return v


class CampaignStrategy(BaseModel):
    """Type-safe campaign strategy output"""

    objective: str = Field(..., description="Primary objective")
    target_segments: List[str] = Field(..., min_items=1, max_items=5)
    channels: List[str] = Field(..., description="Recommended channels")
    sequence_steps: int = Field(..., ge=3, le=10)
    estimated_roi: float = Field(..., description="Estimated ROI percentage")
    timeline_days: int = Field(..., ge=7, le=90)
    budget_estimate: float = Field(..., ge=0.0)


class SentimentAnalysis(BaseModel):
    """Type-safe sentiment analysis output"""

    sentiment: str = Field(..., description="positive, negative, or neutral")
    confidence: float = Field(..., ge=0.0, le=1.0)
    key_phrases: List[str] = Field(default_factory=list)
    intent: str = Field(..., description="Detected intent")

    @field_validator("sentiment")
    @classmethod
    def validate_sentiment(cls, v):
        if v not in ["positive", "negative", "neutral"]:
            raise ValueError("Sentiment must be positive, negative, or neutral")
        return v


# ============================================================================
# Dependency Context
# ============================================================================


class SalesContext(BaseModel):
    """Dependency context for sales operations"""

    user_id: str
    company_name: Optional[str] = None
    industry: Optional[str] = None
    historical_campaigns: List[Dict[str, Any]] = Field(default_factory=list)
    lead_database: Dict[str, Any] = Field(default_factory=dict)


# ============================================================================
# Type-Safe Agents
# ============================================================================


class PydanticAIAgent:
    """
    Type-safe AI agent framework using Pydantic AI

    Features:
    - Full type inference for inputs/outputs
    - Automatic validation with retry
    - Dependency injection via RunContext
    - Structured outputs with Pydantic models
    - Integration with OpenAI and Anthropic
    """

    def __init__(
        self,
        model_provider: str = "openai",
        model_name: str = "gpt-4",
        temperature: float = 0.7,
    ):
        self.model_provider = model_provider
        self.model_name = model_name
        self.temperature = temperature

        # Initialize model
        self.model = self._initialize_model()

        # Create specialized agents
        self.lead_scorer = self._create_lead_scorer()
        self.email_generator = self._create_email_generator()
        self.campaign_strategist = self._create_campaign_strategist()
        self.sentiment_analyzer = self._create_sentiment_analyzer()

    def _initialize_model(self):
        """Initialize the model based on provider"""
        if self.model_provider == "openai":
            return OpenAIModel(
                model_name=self.model_name,
                api_key=os.getenv("OPENAI_API_KEY"),
            )
        elif self.model_provider == "anthropic":
            return AnthropicModel(
                model_name=self.model_name,
                api_key=os.getenv("ANTHROPIC_API_KEY"),
            )
        else:
            raise ValueError(f"Unsupported model provider: {self.model_provider}")

    def _create_lead_scorer(self) -> Agent[SalesContext, LeadScore]:
        """Create type-safe lead scoring agent"""

        agent = Agent(
            self.model,
            result_type=LeadScore,
            system_prompt="""You are an expert lead scoring AI for B2B sales.

Analyze leads based on:
1. Company size and industry fit
2. Budget indicators and decision-making authority
3. Engagement signals (website visits, email opens, content downloads)
4. Timing indicators (hiring, funding, technology changes)
5. Historical campaign performance

Provide a score 0-100 where:
- 0-30: Low priority (poor fit or low engagement)
- 31-60: Medium priority (moderate fit or engagement)
- 61-85: High priority (good fit and engagement)
- 86-100: Urgent priority (ideal customer profile + high intent)

Include specific factors that influenced the score and actionable recommendations.""",
        )

        @agent.tool
        async def get_company_info(ctx: RunContext[SalesContext], company_name: str) -> str:
            """Get company information from lead database"""
            # Access dependency context
            lead_db = ctx.deps.lead_database
            company_data = lead_db.get(company_name, {})
            return f"Company: {company_name}, Size: {company_data.get('size', 'Unknown')}, Industry: {company_data.get('industry', 'Unknown')}"

        @agent.tool
        async def get_engagement_metrics(ctx: RunContext[SalesContext], company_name: str) -> str:
            """Get engagement metrics for a company"""
            # Mock engagement data - integrate with actual analytics
            return f"Engagement for {company_name}: 5 page views, 2 email opens, 1 demo request"

        return agent

    def _create_email_generator(self) -> Agent[SalesContext, EmailGeneration]:
        """Create type-safe email generation agent"""

        agent = Agent(
            self.model,
            result_type=EmailGeneration,
            system_prompt="""You are an expert B2B email copywriter for Artisan platform.

Write personalized, compelling emails that:
1. Open with relevant insight or shared connection
2. Quickly establish value proposition
3. Include specific, relevant examples
4. Have a clear, low-friction call-to-action
5. Keep subject lines under 50 characters
6. Maintain professional yet conversational tone
7. Avoid spam triggers (excessive caps, exclamation marks, urgency words)

Personalization factors to consider:
- Company name and industry
- Recent company news or achievements
- Mutual connections or shared interests
- Specific pain points for their industry
- Role-specific challenges""",
        )

        @agent.tool
        async def get_company_news(ctx: RunContext[SalesContext], company_name: str) -> str:
            """Get recent news about a company"""
            # Mock news - integrate with actual news API
            return f"Recent news for {company_name}: Announced Series B funding, expanding to European market"

        @agent.tool
        async def get_industry_insights(ctx: RunContext[SalesContext], industry: str) -> str:
            """Get industry-specific insights"""
            insights = {
                "technology": "Tech companies are prioritizing AI integration and automation",
                "finance": "Financial services are focusing on compliance and digital transformation",
                "healthcare": "Healthcare orgs are investing in patient experience and data analytics",
            }
            return insights.get(industry.lower(), "General B2B trends: efficiency and growth")

        return agent

    def _create_campaign_strategist(self) -> Agent[SalesContext, CampaignStrategy]:
        """Create type-safe campaign strategy agent"""

        agent = Agent(
            self.model,
            result_type=CampaignStrategy,
            system_prompt="""You are an expert B2B campaign strategist.

Design multi-channel campaigns that:
1. Align with business objectives (brand awareness, lead generation, conversion)
2. Target the right audience segments with precision
3. Use appropriate channels (email, LinkedIn, calls, ads)
4. Follow proven sequence patterns (touch points 3-10)
5. Estimate realistic ROI based on industry benchmarks
6. Set achievable timelines (1 week to 3 months)
7. Provide accurate budget estimates

Consider:
- Target market characteristics
- Product/service complexity
- Sales cycle length
- Competitive landscape
- Historical performance data""",
        )

        @agent.tool
        async def get_historical_performance(ctx: RunContext[SalesContext]) -> str:
            """Get historical campaign performance"""
            campaigns = ctx.deps.historical_campaigns
            if not campaigns:
                return "No historical data available"

            avg_roi = sum(c.get("roi", 0) for c in campaigns) / len(campaigns)
            return f"Historical campaigns: Avg ROI {avg_roi:.1f}%, Avg conversion 3.5%"

        @agent.tool
        async def get_industry_benchmarks(ctx: RunContext[SalesContext], industry: str) -> str:
            """Get industry benchmarks"""
            benchmarks = {
                "technology": "Tech industry: Avg email open 22%, reply 8%, conversion 4%",
                "finance": "Finance industry: Avg email open 19%, reply 6%, conversion 3.2%",
                "healthcare": "Healthcare industry: Avg email open 21%, reply 7%, conversion 3.8%",
            }
            return benchmarks.get(
                industry.lower(),
                "General B2B: Avg email open 20%, reply 7%, conversion 3.5%",
            )

        return agent

    def _create_sentiment_analyzer(self) -> Agent[SalesContext, SentimentAnalysis]:
        """Create type-safe sentiment analysis agent"""

        agent = Agent(
            self.model,
            result_type=SentimentAnalysis,
            system_prompt="""You are an expert at analyzing email responses and lead interactions.

Analyze sentiment and intent to categorize responses as:
- positive: Interested, wants more info, ready to engage
- negative: Not interested, wrong timing, unsubscribe request
- neutral: Informational, out of office, neutral acknowledgment

Detect intent patterns:
- "interested": Wants demo, pricing, more information
- "later": Not now but keep in touch, wrong timing
- "not_relevant": Not a fit, wrong person, unsubscribe
- "question": Has questions, needs clarification
- "objection": Concerns about price, features, competitors

Extract key phrases that indicate buyer readiness.""",
        )

        return agent

    async def score_lead(self, lead_data: Dict[str, Any], context: SalesContext) -> LeadScore:
        """
        Score a lead with type-safe output

        Args:
            lead_data: Lead information
            context: Sales context with dependencies

        Returns:
            Validated LeadScore object
        """
        prompt = f"""Score this lead:
Company: {lead_data.get('company', 'Unknown')}
Industry: {lead_data.get('industry', 'Unknown')}
Size: {lead_data.get('size', 'Unknown')} employees
Contact: {lead_data.get('name', 'Unknown')} ({lead_data.get('title', 'Unknown')})
Engagement: {lead_data.get('engagement', 'No data')}
"""

        result = await self.lead_scorer.run(prompt, deps=context)
        return result.data  # Type: LeadScore (fully validated)

    async def generate_email(
        self,
        lead_data: Dict[str, Any],
        campaign_objective: str,
        tone: str,
        context: SalesContext,
    ) -> EmailGeneration:
        """
        Generate personalized email with type-safe output

        Args:
            lead_data: Lead information
            campaign_objective: Campaign goal
            tone: Desired tone (professional, casual, enthusiastic)
            context: Sales context with dependencies

        Returns:
            Validated EmailGeneration object
        """
        prompt = f"""Generate a personalized email for:
Lead: {lead_data.get('name', 'there')} at {lead_data.get('company', 'their company')}
Industry: {lead_data.get('industry', 'Unknown')}
Objective: {campaign_objective}
Tone: {tone}
Context: {lead_data.get('context', 'Initial outreach')}
"""

        result = await self.email_generator.run(prompt, deps=context)
        return result.data  # Type: EmailGeneration (fully validated)

    async def create_campaign_strategy(
        self,
        objective: str,
        target_audience: str,
        budget_range: str,
        context: SalesContext,
    ) -> CampaignStrategy:
        """
        Create campaign strategy with type-safe output

        Args:
            objective: Campaign objective
            target_audience: Target audience description
            budget_range: Budget range
            context: Sales context with dependencies

        Returns:
            Validated CampaignStrategy object
        """
        prompt = f"""Design a campaign strategy for:
Objective: {objective}
Target Audience: {target_audience}
Budget Range: {budget_range}
Industry: {context.industry or 'B2B'}
"""

        result = await self.campaign_strategist.run(prompt, deps=context)
        return result.data  # Type: CampaignStrategy (fully validated)

    async def analyze_sentiment(
        self, email_response: str, context: SalesContext
    ) -> SentimentAnalysis:
        """
        Analyze email response sentiment with type-safe output

        Args:
            email_response: Email response text
            context: Sales context with dependencies

        Returns:
            Validated SentimentAnalysis object
        """
        prompt = f"Analyze this email response:\n\n{email_response}"

        result = await self.sentiment_analyzer.run(prompt, deps=context)
        return result.data  # Type: SentimentAnalysis (fully validated)


# Example usage
async def example_usage():
    """Example of using Pydantic AI agents"""

    # Initialize agent
    agent = PydanticAIAgent(
        model_provider="openai",
        model_name="gpt-4",
        temperature=0.7,
    )

    # Create context with dependencies
    context = SalesContext(
        user_id="user_123",
        company_name="TechCorp",
        industry="technology",
        historical_campaigns=[
            {"name": "Q4 2024", "roi": 245.0, "conversion": 0.035},
        ],
        lead_database={
            "TechCorp": {"size": 500, "industry": "SaaS"},
        },
    )

    # Score a lead (type-safe)
    lead_score = await agent.score_lead(
        lead_data={
            "company": "TechCorp",
            "industry": "SaaS",
            "size": 500,
            "name": "John Smith",
            "title": "VP of Sales",
            "engagement": "high",
        },
        context=context,
    )
    print(f"Lead Score: {lead_score.score}/100 (Confidence: {lead_score.confidence:.2f})")
    print(f"Recommendation: {lead_score.recommendation}")

    # Generate email (type-safe)
    email = await agent.generate_email(
        lead_data={"name": "John Smith", "company": "TechCorp", "industry": "SaaS"},
        campaign_objective="Book demo meeting",
        tone="professional",
        context=context,
    )
    print(f"\nSubject: {email.subject}")
    print(f"Body:\n{email.body}")
    print(f"Personalization Score: {email.personalization_score:.2f}")

    # Create campaign strategy (type-safe)
    strategy = await agent.create_campaign_strategy(
        objective="Generate 100 qualified leads",
        target_audience="SaaS companies 100-1000 employees",
        budget_range="$10,000-$20,000",
        context=context,
    )
    print(f"\nCampaign Strategy:")
    print(f"Segments: {strategy.target_segments}")
    print(f"Channels: {strategy.channels}")
    print(f"Est. ROI: {strategy.estimated_roi:.1f}%")

    # Analyze sentiment (type-safe)
    sentiment = await agent.analyze_sentiment(
        email_response="Thanks for reaching out! I'd love to learn more about your solution. Can we schedule a call next week?",
        context=context,
    )
    print(f"\nSentiment: {sentiment.sentiment} (Confidence: {sentiment.confidence:.2f})")
    print(f"Intent: {sentiment.intent}")


if __name__ == "__main__":
    import asyncio

    asyncio.run(example_usage())
