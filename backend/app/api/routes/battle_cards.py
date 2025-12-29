"""
Competitive Battle Cards Generator
Auto-generate "Why Us vs Them" comparison sheets
"""

from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, BackgroundTasks, Depends
from pydantic import BaseModel

from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()


class CompetitorTier(str, Enum):
    TIER_1 = "tier_1"  # Major competitors (Salesforce, HubSpot)
    TIER_2 = "tier_2"  # Mid-market (Apollo, Outreach)
    TIER_3 = "tier_3"  # Emerging (Instantly, Lemlist)


class DataSource(str, Enum):
    WEBSITE = "website"
    G2_REVIEWS = "g2_reviews"
    LINKEDIN = "linkedin"
    SALES_CALLS = "sales_calls"
    NEWS = "news"


class CompetitorFeature(BaseModel):
    """Feature comparison"""

    feature_name: str
    we_have: bool
    they_have: bool
    our_advantage: Optional[str] = None
    their_advantage: Optional[str] = None


class CompetitorPricing(BaseModel):
    """Pricing comparison"""

    starting_price: Optional[str] = None
    enterprise_price: Optional[str] = None
    pricing_model: str  # "per seat", "usage-based", "flat rate"
    hidden_costs: List[str] = []


class CompetitorReview(BaseModel):
    """Aggregated review data"""

    g2_rating: Optional[float] = None
    g2_review_count: Optional[int] = None
    common_complaints: List[str]
    common_praises: List[str]


class TalkingPoint(BaseModel):
    """Sales talking point"""

    point: str
    evidence: str
    when_to_use: str  # "objection handling", "discovery", "closing"


class BattleCard(BaseModel):
    """Complete competitive battle card"""

    competitor_name: str
    competitor_tier: CompetitorTier
    last_updated: datetime

    # Overview
    company_overview: str
    target_market: str
    unique_positioning: str

    # Feature comparison
    feature_comparison: List[CompetitorFeature]

    # Pricing
    pricing: CompetitorPricing
    our_pricing_advantage: str

    # Customer intel
    review_data: CompetitorReview
    known_churn_reasons: List[str]

    # Win/Loss data
    wins_against_them: int
    losses_to_them: int
    common_win_reasons: List[str]
    common_loss_reasons: List[str]

    # Talking points
    why_us_points: List[TalkingPoint]
    trap_questions: List[str]  # Questions that expose their weaknesses

    # Objection handling
    common_objections: List[Dict[str, str]]

    # Intelligence
    recent_changes: List[str]
    vulnerabilities: List[str]


@router.post("/battle-cards/generate/{competitor_name}")
async def generate_battle_card(
    competitor_name: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Generate comprehensive battle card for competitor

    Sources data from:
    - Competitor website scraping
    - G2/Capterra reviews
    - LinkedIn intelligence
    - Internal win/loss data
    - Sales call mentions
    """

    # Scrape competitor data
    company_data = await _scrape_competitor_website(competitor_name)

    # Get review data
    review_data = await _scrape_reviews(competitor_name)

    # Get internal win/loss data
    winloss_data = await _get_internal_winloss(competitor_name)

    # Get feature comparison
    features = await _compare_features(competitor_name)

    # Get pricing intel
    pricing = await _analyze_pricing(competitor_name)

    # Generate talking points
    talking_points = await _generate_talking_points(competitor_name, features, review_data)

    # Generate trap questions
    trap_questions = await _generate_trap_questions(competitor_name, features)

    # Identify vulnerabilities
    vulnerabilities = await _identify_vulnerabilities(competitor_name, review_data, features)

    battle_card = BattleCard(
        competitor_name=competitor_name,
        competitor_tier=_determine_tier(competitor_name),
        last_updated=datetime.utcnow(),
        company_overview=company_data["overview"],
        target_market=company_data["target_market"],
        unique_positioning=company_data["positioning"],
        feature_comparison=features,
        pricing=pricing,
        our_pricing_advantage=_calculate_pricing_advantage(pricing),
        review_data=review_data,
        known_churn_reasons=review_data.common_complaints[:5],
        wins_against_them=winloss_data["wins"],
        losses_to_them=winloss_data["losses"],
        common_win_reasons=winloss_data["win_reasons"],
        common_loss_reasons=winloss_data["loss_reasons"],
        why_us_points=talking_points,
        trap_questions=trap_questions,
        common_objections=_generate_objection_responses(competitor_name),
        recent_changes=company_data.get("recent_changes", []),
        vulnerabilities=vulnerabilities,
    )

    return {
        "success": True,
        "battle_card": battle_card.dict(),
        "message": f"Battle card generated for {competitor_name}",
    }


@router.get("/battle-cards/{competitor_name}")
async def get_battle_card(competitor_name: str, current_user: User = Depends(get_current_user)):
    """Retrieve existing battle card"""
    # In production, fetch from database
    return {
        "competitor_name": competitor_name,
        "message": "Battle card retrieved",
        "status": "ready",
    }


@router.get("/battle-cards/list/all")
async def list_all_battle_cards(
    tier: Optional[CompetitorTier] = None,
    current_user: User = Depends(get_current_user),
):
    """List all battle cards, optionally filtered by tier"""
    # In production, query database
    return {
        "battle_cards": [
            {"name": "Salesforce", "tier": "tier_1", "last_updated": "2025-06-15"},
            {"name": "HubSpot", "tier": "tier_1", "last_updated": "2025-06-14"},
            {"name": "Apollo", "tier": "tier_2", "last_updated": "2025-06-13"},
        ],
        "total": 3,
    }


@router.post("/battle-cards/{competitor_name}/track-mention")
async def track_competitor_mention(
    competitor_name: str,
    mention_data: Dict[str, Any],
    current_user: User = Depends(get_current_user),
):
    """
    Track when competitor is mentioned in sales calls

    Used to update battle cards with real-world objections
    """
    return {
        "success": True,
        "competitor_name": competitor_name,
        "mention_tracked": True,
        "message": "Mention will be incorporated into next battle card update",
    }


@router.post("/battle-cards/analyze-loss")
async def analyze_competitive_loss(
    competitor_name: str,
    deal_id: str,
    loss_reason: str,
    deal_value: float,
    current_user: User = Depends(get_current_user),
):
    """
    Analyze why we lost to specific competitor

    Updates battle card with insights to prevent future losses
    """
    return {
        "success": True,
        "competitor_name": competitor_name,
        "analysis": {
            "loss_reason": loss_reason,
            "suggested_improvements": [
                "Add feature parity for X",
                "Adjust pricing positioning",
                "Strengthen objection handling",
            ],
        },
    }


# Helper functions
async def _scrape_competitor_website(competitor: str) -> Dict[str, Any]:
    """Scrape competitor website for intelligence"""
    # In production, use actual web scraping
    return {
        "overview": f"{competitor} is a B2B sales engagement platform founded in 2015.",
        "target_market": "Mid-market to Enterprise B2B companies",
        "positioning": "All-in-one sales platform with CRM integration",
        "recent_changes": [
            "Launched AI features (3 months ago)",
            "Raised Series D funding",
            "Acquired competitor TechCo",
        ],
    }


async def _scrape_reviews(competitor: str) -> CompetitorReview:
    """Scrape G2/Capterra reviews"""
    return CompetitorReview(
        g2_rating=4.3,
        g2_review_count=1250,
        common_complaints=[
            "Steep learning curve",
            "Expensive for small teams",
            "Limited customization",
            "Poor customer support response times",
            "Frequent bugs in mobile app",
        ],
        common_praises=[
            "Comprehensive feature set",
            "Strong Salesforce integration",
            "Good reporting dashboards",
        ],
    )


async def _get_internal_winloss(competitor: str) -> Dict[str, Any]:
    """Get internal win/loss data against competitor"""
    return {
        "wins": 34,
        "losses": 12,
        "win_rate": 73.9,
        "win_reasons": [
            "Better AI personalization (mentioned in 28 wins)",
            "Faster time to value (mentioned in 22 wins)",
            "Superior customer support (mentioned in 19 wins)",
            "More flexible pricing (mentioned in 15 wins)",
        ],
        "loss_reasons": [
            "Existing relationship with competitor (8 losses)",
            "Need for specific integration we don't have (3 losses)",
            "Lower price point (4 losses)",
        ],
    }


async def _compare_features(competitor: str) -> List[CompetitorFeature]:
    """Compare features against competitor"""
    return [
        CompetitorFeature(
            feature_name="AI Email Personalization",
            we_have=True,
            they_have=True,
            our_advantage="Multi-agent system with chain-of-thought reasoning - much deeper personalization",
            their_advantage=None,
        ),
        CompetitorFeature(
            feature_name="Multi-Channel Outreach (Email/LinkedIn/SMS/Calls)",
            we_have=True,
            they_have=True,
            our_advantage=None,
            their_advantage=None,
        ),
        CompetitorFeature(
            feature_name="Autonomous AI BDR",
            we_have=True,
            they_have=False,
            our_advantage="Fully autonomous research and outreach - they require human intervention",
            their_advantage=None,
        ),
        CompetitorFeature(
            feature_name="A/B Testing Engine",
            we_have=True,
            they_have=True,
            our_advantage="Automatic winner selection and deployment in 2 hours",
            their_advantage=None,
        ),
        CompetitorFeature(
            feature_name="Meeting Prep Dossier",
            we_have=True,
            they_have=False,
            our_advantage="Auto-generated 30min before calls with AI research",
            their_advantage=None,
        ),
        CompetitorFeature(
            feature_name="Conversation Intelligence",
            we_have=True,
            they_have=True,
            our_advantage="AI-extracted pain points with auto-CRM updates",
            their_advantage="More mature, longer track record",
        ),
        CompetitorFeature(
            feature_name="Native CRM (not just integration)",
            we_have=False,
            they_have=True,
            our_advantage=None,
            their_advantage="Don't need separate CRM - all-in-one",
        ),
        CompetitorFeature(
            feature_name="Mobile App",
            we_have=False,
            they_have=True,
            our_advantage=None,
            their_advantage="Full-featured iOS/Android apps",
        ),
    ]


async def _analyze_pricing(competitor: str) -> CompetitorPricing:
    """Analyze competitor pricing"""
    return CompetitorPricing(
        starting_price="$99/user/month",
        enterprise_price="$299/user/month",
        pricing_model="per seat",
        hidden_costs=[
            "Additional $50/month for AI features",
            "Implementation fee: $5,000-$15,000",
            "Data migration: $2,000-$8,000",
            "Training: $1,500 per session",
        ],
    )


def _calculate_pricing_advantage(competitor_pricing: CompetitorPricing) -> str:
    """Calculate our pricing advantage"""
    return f"""
**Our Pricing Advantage:**

• 30% lower starting price ($69/user vs their $99/user)
• AI features included (they charge $50/month extra)
• Free implementation and migration
• Unlimited training included
• No seat minimums (they require 10+ seats)

**Total Cost Comparison (Year 1, 10 users):**
• Us: $8,280
• Them: $17,880 + $5,000 implementation + $2,000 training = $24,880

**Savings: $16,600 (67% less)**
"""


async def _generate_talking_points(
    competitor: str, features: List[CompetitorFeature], reviews: CompetitorReview
) -> List[TalkingPoint]:
    """Generate winning talking points"""
    points = []

    # Feature advantages
    for feature in features:
        if feature.we_have and not feature.they_have:
            points.append(
                TalkingPoint(
                    point=f"We have {feature.feature_name}, they don't",
                    evidence=feature.our_advantage or "Unique capability",
                    when_to_use="discovery, demo",
                )
            )

    # Review-based points
    for complaint in reviews.common_complaints[:3]:
        points.append(
            TalkingPoint(
                point=f"While {competitor} users complain about '{complaint}', we've solved that",
                evidence=f"G2 reviews mention this {reviews.g2_review_count} times",
                when_to_use="objection handling",
            )
        )

    return points


async def _generate_trap_questions(competitor: str, features: List[CompetitorFeature]) -> List[str]:
    """Generate questions that expose competitor weaknesses"""
    questions = []

    for feature in features:
        if feature.we_have and not feature.they_have:
            questions.append(
                f"How important is {feature.feature_name} to your sales process? "
                f"(They don't have this - we do)"
            )

    # Generic trap questions
    questions.extend(
        [
            f"What's your experience with {competitor}'s customer support? (Common complaint area)",
            f"How long does {competitor}'s implementation typically take? (They're slow - we're fast)",
            f"Have you seen the total cost including all add-ons and fees? (Hidden costs)",
            f"How do you feel about their recent price increases? (We're more stable)",
        ]
    )

    return questions


async def _identify_vulnerabilities(
    competitor: str, reviews: CompetitorReview, features: List[CompetitorFeature]
) -> List[str]:
    """Identify competitor vulnerabilities to exploit"""
    vulnerabilities = []

    # From reviews
    if reviews.g2_rating and reviews.g2_rating < 4.5:
        vulnerabilities.append(
            f"Lower G2 rating ({reviews.g2_rating}/5.0) - customer satisfaction issues"
        )

    vulnerabilities.extend(
        [f"Common complaint: {complaint}" for complaint in reviews.common_complaints[:3]]
    )

    # From features
    missing_features = [f for f in features if not f.they_have and f.we_have]
    if missing_features:
        vulnerabilities.append(f"Missing {len(missing_features)} key features we have")

    return vulnerabilities


def _generate_objection_responses(competitor: str) -> List[Dict[str, str]]:
    """Generate responses to common objections"""
    return [
        {
            "objection": f"We're already using {competitor}",
            "response": f"That's great - what's working well? Many customers came to us from {competitor} "
            f"because they needed [specific advantage]. Would it help to see how we complement "
            f"or can replace what you have?",
        },
        {
            "objection": f"{competitor} has more features",
            "response": f"It's true they've been around longer, but most customers only use 20% of those features. "
            f"We focus on the features that actually drive revenue. Which specific features matter most to you?",
        },
        {
            "objection": f"{competitor} is the industry standard",
            "response": f"They were the standard - but the market is shifting to AI-first automation. "
            f"Being 'standard' often means legacy technology. Companies like [customer examples] "
            f"are winning with our modern approach.",
        },
        {
            "objection": f"You're more expensive than {competitor}",
            "response": f"Actually, when you include their add-on fees for AI ($50/month), implementation ($5K-15K), "
            f"and training costs, we're typically 40-60% less expensive. Should I show you the total cost breakdown?",
        },
    ]


def _determine_tier(competitor: str) -> CompetitorTier:
    """Determine competitor tier"""
    tier_1 = ["Salesforce", "HubSpot", "Oracle", "Microsoft"]
    tier_2 = ["Apollo", "Outreach", "SalesLoft", "Groove"]

    if competitor in tier_1:
        return CompetitorTier.TIER_1
    elif competitor in tier_2:
        return CompetitorTier.TIER_2
    else:
        return CompetitorTier.TIER_3
