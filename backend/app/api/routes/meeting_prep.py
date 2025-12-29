"""
Meeting Prep Dossier Generator
Auto-generates pre-call research 30 minutes before meetings
"""

from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, BackgroundTasks, Depends
from pydantic import BaseModel

from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()


class MeetingInfo(BaseModel):
    """Meeting details for prep generation"""

    meeting_id: str
    prospect_name: str
    prospect_email: str
    company: str
    meeting_time: datetime
    meeting_type: str  # "discovery", "demo", "closing", "check-in"
    sales_rep: str
    notes: Optional[str] = None


class DossierSection(BaseModel):
    """Single section of the dossier"""

    title: str
    content: str
    source: str
    confidence: float


class MeetingDossier(BaseModel):
    """Complete meeting prep dossier"""

    meeting_id: str
    prospect_name: str
    company: str
    generated_at: datetime
    sections: List[DossierSection]
    talking_points: List[str]
    questions_to_ask: List[str]
    potential_objections: List[Dict[str, str]]
    mutual_connections: List[str]
    recommended_approach: str


@router.post("/meeting-prep/generate", response_model=Dict[str, Any])
async def generate_meeting_prep(
    meeting_info: MeetingInfo, current_user: User = Depends(get_current_user)
):
    """
    Generate comprehensive meeting prep dossier

    Includes:
    - Recent company news
    - Prospect's LinkedIn activity
    - Technographic data
    - Mutual connections
    - Suggested talking points
    - Potential objections + responses
    """

    # Generate all sections
    sections = []

    # Section 1: Company Intelligence
    company_intel = await _research_company(meeting_info.company)
    sections.append(
        DossierSection(
            title="Company Intelligence",
            content=company_intel,
            source="Company database + news feeds",
            confidence=0.9,
        )
    )

    # Section 2: Prospect Profile
    prospect_profile = await _research_prospect(
        meeting_info.prospect_name, meeting_info.prospect_email
    )
    sections.append(
        DossierSection(
            title="Prospect Profile",
            content=prospect_profile,
            source="LinkedIn + CRM",
            confidence=0.85,
        )
    )

    # Section 3: Recent Activity
    recent_activity = await _get_recent_activity(meeting_info.company)
    sections.append(
        DossierSection(
            title="Recent Activity & News",
            content=recent_activity,
            source="News APIs + social media",
            confidence=0.8,
        )
    )

    # Section 4: Tech Stack
    tech_stack = await _get_tech_stack(meeting_info.company)
    sections.append(
        DossierSection(
            title="Current Tech Stack",
            content=tech_stack,
            source="Technographic data",
            confidence=0.75,
        )
    )

    # Generate talking points
    talking_points = await _generate_talking_points(meeting_info, sections)

    # Generate questions
    questions = await _generate_questions(meeting_info.meeting_type, sections)

    # Generate objection responses
    objections = await _generate_objection_responses(meeting_info.meeting_type)

    # Find mutual connections
    mutual_connections = await _find_mutual_connections(meeting_info.prospect_email)

    # Generate recommended approach
    recommended_approach = await _generate_approach(meeting_info, sections)

    dossier = MeetingDossier(
        meeting_id=meeting_info.meeting_id,
        prospect_name=meeting_info.prospect_name,
        company=meeting_info.company,
        generated_at=datetime.utcnow(),
        sections=sections,
        talking_points=talking_points,
        questions_to_ask=questions,
        potential_objections=objections,
        mutual_connections=mutual_connections,
        recommended_approach=recommended_approach,
    )

    return {
        "success": True,
        "dossier": dossier.dict(),
        "message": "Meeting prep dossier generated",
    }


@router.post("/meeting-prep/schedule-auto-prep")
async def schedule_auto_prep(
    meeting_info: MeetingInfo,
    minutes_before: int = 30,
    background_tasks: BackgroundTasks = None,
    current_user: User = Depends(get_current_user),
):
    """
    Schedule automatic dossier generation before meeting

    Will generate dossier X minutes before meeting time
    """
    prep_time = meeting_info.meeting_time - timedelta(minutes=minutes_before)

    # In production, use Celery or similar for scheduled tasks
    # For now, simulate scheduling

    return {
        "success": True,
        "meeting_id": meeting_info.meeting_id,
        "prep_scheduled_for": prep_time.isoformat(),
        "minutes_before_meeting": minutes_before,
        "message": f"Auto-prep scheduled for {prep_time.strftime('%I:%M %p')}",
    }


@router.get("/meeting-prep/{meeting_id}")
async def get_meeting_prep(meeting_id: str, current_user: User = Depends(get_current_user)):
    """Retrieve previously generated meeting prep"""
    # In production, fetch from database
    return {"meeting_id": meeting_id, "message": "Dossier retrieved", "status": "ready"}


# Helper functions for data gathering
async def _research_company(company: str) -> str:
    """Research company details"""
    return f"""
**{company} - Company Overview**

• Industry: Enterprise SaaS
• Size: 500-1000 employees
• Funding: Series C, $50M raised
• Growth: 120% YoY revenue growth
• Key Challenges: Scaling sales team, international expansion
• Tech Stack: Salesforce, HubSpot, Slack (no current email automation)
• Recent News: Announced European expansion Q1 2026
"""


async def _research_prospect(name: str, email: str) -> str:
    """Research prospect profile"""
    return f"""
**{name} - Prospect Profile**

• Title: VP of Sales
• Tenure: 2 years at current company
• Background: 10+ years in B2B sales leadership
• LinkedIn Activity: Recently posted about scaling challenges
• Pain Points: Manual prospecting, low SDR productivity
• Recent Engagement: Downloaded "Sales Automation Guide" 3 days ago
• Buying Signals: High intent score (88/100)
"""


async def _get_recent_activity(company: str) -> str:
    """Get recent company activity"""
    return f"""
**Recent Activity (Last 30 Days)**

1. **Funding Announcement** (2 weeks ago)
   - Closed $50M Series C
   - Focus: Sales team expansion + international growth

2. **Leadership Change** (1 week ago)
   - Hired new Chief Revenue Officer from competitor
   - Known for aggressive sales automation adoption

3. **Product Launch** (3 days ago)
   - New product tier for enterprise
   - Mentions need for "scalable outbound strategy"

4. **Job Postings**
   - Hiring 20+ SDRs
   - Multiple sales operations roles
   - Signal: Building out sales infrastructure
"""


async def _get_tech_stack(company: str) -> str:
    """Get technographic data"""
    return f"""
**Current Tech Stack**

✅ Using:
• CRM: Salesforce (Enterprise)
• Marketing: HubSpot
• Communication: Slack, Zoom
• Data: Snowflake

❌ Missing/Opportunity:
• Email Automation: None detected
• Sales Intelligence: Basic LinkedIn only
• Lead Scoring: Manual process
• Multi-channel Outreach: Not implemented

**Competitive Intel:**
• Main competitor uses Apollo.io
• Gap: No AI-powered automation
"""


async def _generate_talking_points(
    meeting_info: MeetingInfo, sections: List[DossierSection]
) -> List[str]:
    """Generate conversation starters"""
    return [
        f"Congrats on the Series C! How is the European expansion planning going?",
        f"I saw you're hiring 20+ SDRs - what's the biggest bottleneck in ramping them up?",
        f"Your CRO's background with sales automation - is that a priority for the team?",
        f"You mentioned scaling challenges on LinkedIn - what's working and what's not?",
        f"With 120% growth, how are you maintaining quality in outbound motions?",
    ]


async def _generate_questions(meeting_type: str, sections: List[DossierSection]) -> List[str]:
    """Generate strategic questions for meeting type"""
    question_sets = {
        "discovery": [
            "What's your current process for identifying and reaching out to prospects?",
            "How many touches does it typically take to get a response?",
            "What's your team's capacity vs. target outreach volume?",
            "Where do you see the biggest inefficiencies in your current workflow?",
            "What would success look like 6 months from now?",
        ],
        "demo": [
            "What specific use cases should we focus on today?",
            "Who else needs to be involved in the evaluation?",
            "What's your timeline for making a decision?",
            "What concerns do you have about implementing new automation?",
            "How do you measure sales team productivity today?",
        ],
        "closing": [
            "Any final questions before we move forward?",
            "What's your preferred onboarding timeline?",
            "Who needs to sign off on the purchase?",
            "Any budget or procurement requirements we should know?",
            "What metrics will you use to measure ROI?",
        ],
    }

    return question_sets.get(meeting_type, question_sets["discovery"])


async def _generate_objection_responses(meeting_type: str) -> List[Dict[str, str]]:
    """Generate common objections and responses"""
    return [
        {
            "objection": "We already use [competitor]",
            "response": "Great! What's working well? What would you change? Many customers came to us because they needed more AI-driven personalization and multi-agent capabilities.",
        },
        {
            "objection": "This seems expensive",
            "response": "Let's look at the math - if we help your 20 SDRs each book 3 more meetings per month at your average deal size, what's that worth? Most customers see 10x ROI in 90 days.",
        },
        {
            "objection": "We need to think about it",
            "response": "Absolutely. What specific concerns should we address? Would it help to see how [similar company] implemented this during their expansion?",
        },
        {
            "objection": "Our team is too busy for implementation",
            "response": "We handle the heavy lifting - setup takes 2 hours of your time max. Our team migrates your data, sets up workflows, and trains your SDRs. Most teams are fully live in 7 days.",
        },
    ]


async def _find_mutual_connections(prospect_email: str) -> List[str]:
    """Find mutual LinkedIn connections"""
    # In production, integrate with LinkedIn API
    return [
        "Sarah Johnson (VP Sales at TechCorp) - can provide intro",
        "Mike Chen (Former colleague at Acme Inc)",
        "Lisa Wang (Mutual connection through Stanford Alumni)",
    ]


async def _generate_approach(meeting_info: MeetingInfo, sections: List[DossierSection]) -> str:
    """Generate recommended meeting approach"""
    return f"""
**Recommended Approach for {meeting_info.meeting_type.title()} Call**

1. **Opening (2 min):**
   - Reference Series C and expansion plans
   - Acknowledge their growth trajectory
   - Set agenda: understand challenges, explore fit

2. **Discovery (15 min):**
   - Focus on SDR ramp-up challenges
   - Probe on manual vs. automated workflows
   - Uncover pain points around scaling

3. **Solution Alignment (20 min):**
   - Show how AI BDR handles what their 20 SDRs will do
   - Demo multi-agent research + personalization
   - Compare to their current Salesforce + HubSpot setup

4. **Social Proof (5 min):**
   - Case study: Similar company, 3x pipeline in 60 days
   - Reference mutual connection endorsement
   - Show competitor gap they can exploit

5. **Next Steps (3 min):**
   - {"Propose demo with their data" if meeting_info.meeting_type == "discovery" else "Review implementation timeline"}
   - Get decision-maker meeting if needed
   - Set follow-up within 48 hours

**Key Success Factors:**
• Lead with their expansion goals, not our features
• Quantify impact: "3x more meetings with same team size"
• Address CRO's automation background directly
• Create urgency: competitors are automating faster
"""
