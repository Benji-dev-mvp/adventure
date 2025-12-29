"""
Autonomous AI BDR 2.0 - Full autonomy with meeting booking and objection handling
Handles the entire outreach lifecycle from research to meeting booking
"""

import logging
import re
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional

from app.core.ai_provider import chat_with_history

logger = logging.getLogger(__name__)


class ConversationStage(str, Enum):
    """Stages of sales conversation"""

    INITIAL_OUTREACH = "initial_outreach"
    FOLLOW_UP = "follow_up"
    OBJECTION_HANDLING = "objection_handling"
    MEETING_BOOKING = "meeting_booking"
    QUALIFIED = "qualified"
    DISQUALIFIED = "disqualified"


class ObjectionType(str, Enum):
    """Common objection types"""

    NO_TIME = "no_time"
    NO_BUDGET = "no_budget"
    NOT_INTERESTED = "not_interested"
    ALREADY_HAVE_SOLUTION = "already_have_solution"
    NEED_TO_THINK = "need_to_think"
    WRONG_PERSON = "wrong_person"
    BAD_TIMING = "bad_timing"


class AutonomousAIBDR:
    """
    Autonomous AI BDR that handles full sales cycle

    Features:
    - Research prospects before outreach
    - Write personalized emails without templates
    - Detect and categorize replies
    - Handle objections autonomously
    - Book meetings on calendar
    - Hand off to human when qualified
    """

    def __init__(self):
        self.conversation_history: Dict[str, List[Dict]] = {}
        self.lead_stages: Dict[str, ConversationStage] = {}

    async def research_prospect(self, lead: Dict) -> Dict:
        """
        Research a prospect before outreach

        In production, this would:
        - Scrape LinkedIn profile
        - Check company website
        - Find recent news/social posts
        - Identify pain points
        """
        logger.info(f"Researching prospect: {lead.get('name')}")

        prompt = f"""
        Research the following prospect and provide key insights for outreach:
        
        Name: {lead.get('name')}
        Title: {lead.get('title')}
        Company: {lead.get('company')}
        Industry: {lead.get('industry')}
        Company Size: {lead.get('company_size')} employees
        
        Provide:
        1. Likely pain points based on role and industry
        2. Relevant value proposition angles
        3. Personalization hooks (recent company news, initiatives)
        4. Best approach for initial outreach
        
        Format as JSON with keys: pain_points, value_props, hooks, approach
        """

        try:
            response = await chat_with_history(
                [
                    {
                        "role": "system",
                        "content": "You are an AI sales research assistant. Provide concise, actionable insights.",
                    },
                    {"role": "user", "content": prompt},
                ]
            )

            # Parse response (simplified - in production use structured output)
            research = {
                "prospect_id": lead.get("id"),
                "researched_at": datetime.utcnow().isoformat(),
                "insights": response.get("content", ""),
                "pain_points": self._extract_pain_points(lead),
                "personalization_hooks": self._find_hooks(lead),
            }

            return research

        except Exception as e:
            logger.error(f"Error researching prospect: {e}")
            return self._fallback_research(lead)

    def _extract_pain_points(self, lead: Dict) -> List[str]:
        """Extract likely pain points based on role/industry"""
        title = lead.get("title", "").lower()
        industry = lead.get("industry", "").lower()

        pain_points = []

        # Role-based pain points
        if "sales" in title or "revenue" in title:
            pain_points.extend(
                [
                    "Need to scale outbound without scaling headcount",
                    "Low reply rates on cold outreach",
                    "Manual prospecting is time-consuming",
                ]
            )
        elif "marketing" in title:
            pain_points.extend(
                [
                    "Lead quality is inconsistent",
                    "Hard to track ROI on campaigns",
                    "Need better lead nurturing",
                ]
            )

        # Industry-specific
        if "saas" in industry or "software" in industry:
            pain_points.append("Need to accelerate sales velocity in competitive market")

        return pain_points[:3]

    def _find_hooks(self, lead: Dict) -> List[str]:
        """Find personalization hooks"""
        hooks = []

        if lead.get("recent_funding"):
            hooks.append(f"Congrats on the recent ${lead['recent_funding']} funding round")

        if lead.get("company_growth"):
            hooks.append(f"Noticed {lead['company']} is growing rapidly")

        if lead.get("job_postings"):
            hooks.append(f"Saw you're hiring for {lead['job_postings']} positions")

        return hooks

    def _fallback_research(self, lead: Dict) -> Dict:
        """Fallback research when AI fails"""
        return {
            "prospect_id": lead.get("id"),
            "researched_at": datetime.utcnow().isoformat(),
            "insights": "Basic profile information available",
            "pain_points": self._extract_pain_points(lead),
            "personalization_hooks": self._find_hooks(lead),
        }

    async def write_initial_email(self, lead: Dict, research: Dict) -> Dict:
        """
        Write personalized initial outreach email (no templates)

        Uses AI to craft unique email based on research
        """
        logger.info(f"Writing initial email for {lead.get('name')}")

        prompt = f"""
        Write a personalized cold email for the following prospect.
        
        Prospect:
        - Name: {lead.get('name')}
        - Title: {lead.get('title')}
        - Company: {lead.get('company')}
        
        Research insights:
        {research.get('insights', '')}
        
        Pain points:
        {', '.join(research.get('pain_points', []))}
        
        Personalization hooks:
        {', '.join(research.get('personalization_hooks', []))}
        
        Requirements:
        - Keep it under 100 words
        - Use a personalization hook in first sentence
        - Focus on ONE pain point
        - Include a clear, low-friction CTA (e.g., "quick 10-minute call")
        - Professional but conversational tone
        - NO cliches like "I hope this email finds you well"
        
        Subject line should be:
        - Specific to their situation
        - Intriguing, not salesy
        - Under 50 characters
        
        Format response as:
        SUBJECT: [subject line]
        BODY: [email body]
        """

        try:
            response = await chat_with_history(
                [
                    {
                        "role": "system",
                        "content": "You are Ava, an AI BDR expert at writing high-converting cold emails. You write like a human, not a bot.",
                    },
                    {"role": "user", "content": prompt},
                ]
            )

            content = response.get("content", "")

            # Parse subject and body
            subject_match = re.search(r"SUBJECT:\s*(.+)", content)
            body_match = re.search(r"BODY:\s*(.+)", content, re.DOTALL)

            subject = (
                subject_match.group(1).strip()
                if subject_match
                else "Quick question about your outreach"
            )
            body = body_match.group(1).strip() if body_match else content

            return {
                "subject": subject,
                "body": body,
                "sent_at": datetime.utcnow().isoformat(),
                "stage": ConversationStage.INITIAL_OUTREACH,
            }

        except Exception as e:
            logger.error(f"Error writing email: {e}")
            return self._fallback_email(lead, research)

    def _fallback_email(self, lead: Dict, research: Dict) -> Dict:
        """Fallback email template when AI fails"""
        hooks = research.get("personalization_hooks", [])
        first_line = hooks[0] if hooks else f"I noticed {lead.get('company')} is growing"

        return {
            "subject": f"Quick thought for {lead.get('company')}",
            "body": f"{lead.get('name').split()[0]},\n\n{first_line}.\n\nI work with {lead.get('industry', 'similar')} companies to help them scale outbound without scaling headcount.\n\nWould you be open to a quick 10-minute call next week to explore if there's a fit?\n\nBest,\nAva",
            "sent_at": datetime.utcnow().isoformat(),
            "stage": ConversationStage.INITIAL_OUTREACH,
        }

    async def analyze_reply(self, reply_text: str, lead: Dict) -> Dict:
        """
        Analyze prospect reply and categorize intent

        Detects:
        - Positive interest
        - Objections (and type)
        - Questions
        - Disqualification signals
        """
        logger.info(f"Analyzing reply from {lead.get('name')}")

        prompt = f"""
        Analyze this reply from a sales prospect and extract:
        
        Reply: "{reply_text}"
        
        Determine:
        1. Sentiment (positive/neutral/negative)
        2. Intent (interested/objection/question/not_interested)
        3. Objection type if applicable (no_time/no_budget/already_have_solution/etc)
        4. Next best action (respond/book_meeting/escalate/disengage)
        5. Key points to address in response
        
        Format as JSON.
        """

        try:
            response = await chat_with_history(
                [
                    {
                        "role": "system",
                        "content": "You are an AI that analyzes sales email replies with expert precision.",
                    },
                    {"role": "user", "content": prompt},
                ]
            )

            # Simplified analysis (in production, use structured output)
            analysis = {
                "reply_text": reply_text,
                "analyzed_at": datetime.utcnow().isoformat(),
                "sentiment": self._detect_sentiment(reply_text),
                "intent": self._detect_intent(reply_text),
                "objection_type": self._detect_objection(reply_text),
                "next_action": self._determine_next_action(reply_text),
                "ai_analysis": response.get("content", ""),
            }

            return analysis

        except Exception as e:
            logger.error(f"Error analyzing reply: {e}")
            return self._fallback_analysis(reply_text)

    def _detect_sentiment(self, text: str) -> str:
        """Quick sentiment detection"""
        text_lower = text.lower()

        positive_keywords = [
            "interested",
            "yes",
            "sounds good",
            "let's chat",
            "tell me more",
        ]
        negative_keywords = [
            "not interested",
            "no thanks",
            "unsubscribe",
            "stop emailing",
        ]

        if any(kw in text_lower for kw in positive_keywords):
            return "positive"
        elif any(kw in text_lower for kw in negative_keywords):
            return "negative"
        else:
            return "neutral"

    def _detect_intent(self, text: str) -> str:
        """Detect prospect intent"""
        text_lower = text.lower()

        if any(
            kw in text_lower
            for kw in ["interested", "tell me more", "let's talk", "meeting", "call"]
        ):
            return "interested"
        elif any(kw in text_lower for kw in ["not interested", "no thanks", "remove"]):
            return "not_interested"
        elif "?" in text:
            return "question"
        else:
            return "objection"

    def _detect_objection(self, text: str) -> Optional[ObjectionType]:
        """Detect objection type"""
        text_lower = text.lower()

        objection_patterns = {
            ObjectionType.NO_TIME: ["busy", "no time", "swamped"],
            ObjectionType.NO_BUDGET: ["budget", "expensive", "cost"],
            ObjectionType.ALREADY_HAVE_SOLUTION: [
                "already have",
                "already using",
                "current solution",
            ],
            ObjectionType.NEED_TO_THINK: [
                "think about it",
                "consider",
                "get back to you",
            ],
            ObjectionType.WRONG_PERSON: [
                "not the right person",
                "wrong person",
                "someone else",
            ],
            ObjectionType.BAD_TIMING: ["bad timing", "later", "not right now"],
        }

        for objection_type, patterns in objection_patterns.items():
            if any(pattern in text_lower for pattern in patterns):
                return objection_type

        return None

    def _determine_next_action(self, text: str) -> str:
        """Determine next action based on reply"""
        intent = self._detect_intent(text)

        if intent == "interested":
            return "book_meeting"
        elif intent == "not_interested":
            return "disengage"
        elif intent == "question":
            return "respond"
        else:
            return "handle_objection"

    def _fallback_analysis(self, text: str) -> Dict:
        """Fallback analysis when AI fails"""
        return {
            "reply_text": text,
            "analyzed_at": datetime.utcnow().isoformat(),
            "sentiment": self._detect_sentiment(text),
            "intent": self._detect_intent(text),
            "objection_type": self._detect_objection(text),
            "next_action": self._determine_next_action(text),
            "ai_analysis": "Automated analysis",
        }

    async def handle_objection(
        self, objection_type: ObjectionType, original_reply: str, lead: Dict
    ) -> Dict:
        """
        Handle objection autonomously with AI-generated response

        Uses proven objection-handling frameworks
        """
        logger.info(f"Handling {objection_type} objection for {lead.get('name')}")

        prompt = f"""
        The prospect replied with this objection: "{original_reply}"
        Objection type: {objection_type}
        
        Write a short, empathetic response that:
        1. Acknowledges their concern (don't dismiss it)
        2. Provides a reframe or new perspective
        3. Includes social proof if relevant
        4. Ends with a very low-friction next step
        
        Keep it under 75 words. Be human, not robotic.
        """

        try:
            response = await chat_with_history(
                [
                    {
                        "role": "system",
                        "content": "You are Ava, an AI BDR expert at handling objections with empathy and skill.",
                    },
                    {"role": "user", "content": prompt},
                ]
            )

            return {
                "objection_type": objection_type,
                "response": response.get("content", ""),
                "handled_at": datetime.utcnow().isoformat(),
                "stage": ConversationStage.OBJECTION_HANDLING,
            }

        except Exception as e:
            logger.error(f"Error handling objection: {e}")
            return self._fallback_objection_response(objection_type, lead)

    def _fallback_objection_response(self, objection_type: ObjectionType, lead: Dict) -> Dict:
        """Fallback objection responses"""
        responses = {
            ObjectionType.NO_TIME: f"I completely understand - that's exactly why {lead.get('company')} might benefit. Our customers save 20+ hours/week on outreach. How about a quick 10-min call to see if it's a fit?",
            ObjectionType.NO_BUDGET: "I hear you. Most of our customers saw positive ROI within 30 days - the tool essentially pays for itself. Would you be open to seeing a quick cost breakdown?",
            ObjectionType.ALREADY_HAVE_SOLUTION: "That's great! Curious - what are you using? We often complement existing tools rather than replace them. Mind if I share how in a quick call?",
            ObjectionType.NEED_TO_THINK: "Absolutely, makes sense to think it through. Would it be helpful if I sent over a quick 1-pager with pricing and ROI data? Or would a brief call be better?",
            ObjectionType.WRONG_PERSON: f"Thanks for letting me know! Who would be the right person to chat with about {lead.get('company')}'s outbound sales strategy?",
            ObjectionType.BAD_TIMING: "Totally understand. When would be a better time to reconnect? I'll follow up then.",
        }

        return {
            "objection_type": objection_type,
            "response": responses.get(
                objection_type,
                "I understand. Would you still be open to a brief conversation?",
            ),
            "handled_at": datetime.utcnow().isoformat(),
            "stage": ConversationStage.OBJECTION_HANDLING,
        }

    async def book_meeting(self, lead: Dict, prospect_availability: Optional[str] = None) -> Dict:
        """
        Autonomously book meeting on calendar

        In production:
        - Parse availability from reply ("I'm free Tuesday afternoon")
        - Check calendar API for open slots
        - Send calendar invite via Gmail API
        - Add to CRM
        """
        logger.info(f"Booking meeting for {lead.get('name')}")

        # Parse availability (simplified)
        if prospect_availability:
            # Use NLP to extract preferred times
            prompt = f"""
            Extract preferred meeting time from this text: "{prospect_availability}"
            
            Return in format: Day of week, time (or "flexible" if not specified)
            """

            # In production, integrate with calendar API
            meeting_slot = await self._find_available_slot(prospect_availability)
        else:
            # Suggest default slot
            meeting_slot = (datetime.utcnow() + timedelta(days=2)).replace(hour=14, minute=0)

        return {
            "lead_id": lead.get("id"),
            "meeting_time": (
                meeting_slot.isoformat() if isinstance(meeting_slot, datetime) else meeting_slot
            ),
            "booked_at": datetime.utcnow().isoformat(),
            "stage": ConversationStage.MEETING_BOOKING,
            "calendar_invite_sent": False,  # Would be True after API call
            "confirmation_email": self._generate_confirmation_email(lead, meeting_slot),
        }

    async def _find_available_slot(self, availability_text: str) -> datetime:
        """Find available calendar slot (mock implementation)"""
        # In production: integrate with Google Calendar API or Calendly
        # For now, return next business day at 2pm
        next_slot = datetime.utcnow() + timedelta(days=1)
        while next_slot.weekday() >= 5:  # Skip weekends
            next_slot += timedelta(days=1)
        return next_slot.replace(hour=14, minute=0, second=0, microsecond=0)

    def _generate_confirmation_email(self, lead: Dict, meeting_time) -> str:
        """Generate meeting confirmation email"""
        time_str = (
            meeting_time.strftime("%A, %B %d at %I:%M %p")
            if isinstance(meeting_time, datetime)
            else meeting_time
        )

        return f"""
        Great! I've booked us for {time_str}.
        
        Calendar invite on the way. Looking forward to chatting!
        
        Best,
        Ava
        """

    async def run_autonomous_campaign(self, lead: Dict) -> Dict:
        """
        Run full autonomous outreach campaign for one lead

        Steps:
        1. Research prospect
        2. Write initial email
        3. Wait for reply (simulated)
        4. Analyze reply
        5. Take appropriate action (handle objection / book meeting / follow up)
        """
        logger.info(f"Starting autonomous campaign for {lead.get('name')}")

        # Step 1: Research
        research = await self.research_prospect(lead)

        # Step 2: Write email
        email = await self.write_initial_email(lead, research)

        # Return campaign setup (actual sending would happen via email service)
        return {
            "lead_id": lead.get("id"),
            "lead_name": lead.get("name"),
            "research": research,
            "initial_email": email,
            "status": "active",
            "stage": ConversationStage.INITIAL_OUTREACH,
            "created_at": datetime.utcnow().isoformat(),
            "autonomous_mode": True,
        }


# Global instance
ai_bdr = AutonomousAIBDR()


async def start_autonomous_campaign(lead: Dict) -> Dict:
    """Start autonomous campaign for a lead"""
    return await ai_bdr.run_autonomous_campaign(lead)


async def process_reply(lead_id: str, reply_text: str, lead: Dict) -> Dict:
    """Process incoming reply and take autonomous action"""
    # Analyze reply
    analysis = await ai_bdr.analyze_reply(reply_text, lead)

    # Take action based on analysis
    next_action = analysis.get("next_action")

    if next_action == "book_meeting":
        result = await ai_bdr.book_meeting(lead, reply_text)
        result["analysis"] = analysis
        return result

    elif next_action == "handle_objection":
        objection_type = analysis.get("objection_type")
        if objection_type:
            result = await ai_bdr.handle_objection(objection_type, reply_text, lead)
            result["analysis"] = analysis
            return result

    elif next_action == "disengage":
        return {
            "action": "disengage",
            "analysis": analysis,
            "stage": ConversationStage.DISQUALIFIED,
        }

    # Default: prepare response
    return {"action": "respond", "analysis": analysis, "requires_human_review": True}
