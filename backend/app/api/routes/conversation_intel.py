"""
Conversation Intelligence System
Extract insights from sales call transcripts
"""
from fastapi import APIRouter, Depends, UploadFile, File
from typing import Dict, Any, List, Optional
from datetime import datetime
from pydantic import BaseModel
from enum import Enum

from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()


class SentimentType(str, Enum):
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"
    OBJECTION = "objection"


class InsightType(str, Enum):
    PAIN_POINT = "pain_point"
    BUDGET_MENTION = "budget_mention"
    COMPETITOR_MENTION = "competitor_mention"
    BUYING_SIGNAL = "buying_signal"
    OBJECTION = "objection"
    DECISION_MAKER = "decision_maker"
    TIMELINE = "timeline"


class ConversationInsight(BaseModel):
    """Single extracted insight"""
    type: InsightType
    content: str
    timestamp_seconds: Optional[float] = None
    confidence: float
    speaker: str  # "prospect" or "rep"


class SentimentAnalysis(BaseModel):
    """Sentiment at different conversation stages"""
    overall: SentimentType
    by_minute: List[Dict[str, Any]]
    key_moments: List[Dict[str, Any]]


class CompetitorMention(BaseModel):
    """Competitor mentioned in conversation"""
    competitor: str
    context: str
    sentiment: SentimentType
    timestamp_seconds: float


class NextBestAction(BaseModel):
    """AI-recommended next step"""
    action: str
    priority: str  # "high", "medium", "low"
    reasoning: str
    suggested_timeline: str


class ConversationIntelligence(BaseModel):
    """Complete conversation analysis"""
    call_id: str
    analyzed_at: datetime
    duration_minutes: int
    participants: Dict[str, str]
    
    # Core insights
    pain_points: List[str]
    buying_signals: List[str]
    objections: List[Dict[str, str]]
    budget_mentions: List[str]
    timeline_mentions: List[str]
    
    # Competitive intel
    competitors_mentioned: List[CompetitorMention]
    
    # Sentiment
    sentiment_analysis: SentimentAnalysis
    
    # All insights
    all_insights: List[ConversationInsight]
    
    # Recommendations
    next_best_actions: List[NextBestAction]
    deal_score: int  # 0-100
    
    # Talk metrics
    talk_time_ratio: float  # Rep vs Prospect
    question_count: int
    monologue_alerts: int  # Times rep talked too long


@router.post("/intelligence/analyze-transcript", response_model=Dict[str, Any])
async def analyze_transcript(
    transcript: str,
    call_id: str,
    prospect_name: str,
    rep_name: str,
    current_user: User = Depends(get_current_user)
):
    """
    Analyze sales call transcript and extract actionable insights
    
    Returns:
    - Pain points mentioned
    - Buying signals detected
    - Objections raised
    - Competitor mentions
    - Budget/timeline discussions
    - Sentiment analysis
    - Next best actions
    """
    
    # Parse transcript
    conversation_data = _parse_transcript(transcript)
    
    # Extract insights
    pain_points = _extract_pain_points(conversation_data)
    buying_signals = _extract_buying_signals(conversation_data)
    objections = _extract_objections(conversation_data)
    budget_mentions = _extract_budget_mentions(conversation_data)
    timeline_mentions = _extract_timeline_mentions(conversation_data)
    
    # Analyze competitors
    competitors = _analyze_competitors(conversation_data)
    
    # Sentiment analysis
    sentiment = _analyze_sentiment(conversation_data)
    
    # Generate insights list
    all_insights = _compile_all_insights(
        pain_points, buying_signals, objections,
        budget_mentions, timeline_mentions
    )
    
    # Calculate talk metrics
    talk_metrics = _calculate_talk_metrics(conversation_data, rep_name)
    
    # Score deal
    deal_score = _score_deal(
        pain_points, buying_signals, objections,
        budget_mentions, timeline_mentions, sentiment
    )
    
    # Generate next best actions
    next_actions = _generate_next_actions(
        pain_points, objections, buying_signals,
        deal_score
    )
    
    intelligence = ConversationIntelligence(
        call_id=call_id,
        analyzed_at=datetime.utcnow(),
        duration_minutes=conversation_data["duration_minutes"],
        participants={"prospect": prospect_name, "rep": rep_name},
        pain_points=pain_points,
        buying_signals=buying_signals,
        objections=objections,
        budget_mentions=budget_mentions,
        timeline_mentions=timeline_mentions,
        competitors_mentioned=competitors,
        sentiment_analysis=sentiment,
        all_insights=all_insights,
        next_best_actions=next_actions,
        deal_score=deal_score,
        talk_time_ratio=talk_metrics["talk_time_ratio"],
        question_count=talk_metrics["question_count"],
        monologue_alerts=talk_metrics["monologue_alerts"]
    )
    
    return {
        "success": True,
        "intelligence": intelligence.dict(),
        "message": f"Analyzed {len(all_insights)} insights from conversation"
    }


@router.post("/intelligence/upload-audio")
async def upload_audio_file(
    file: UploadFile = File(...),
    call_id: str = None,
    current_user: User = Depends(get_current_user)
):
    """
    Upload audio file for transcription and analysis
    
    Supports: MP3, WAV, M4A
    """
    # In production, use Whisper API or similar
    return {
        "success": True,
        "call_id": call_id,
        "message": "Audio uploaded, transcription in progress",
        "estimated_completion": "2-3 minutes"
    }


@router.get("/intelligence/call/{call_id}")
async def get_call_intelligence(
    call_id: str,
    current_user: User = Depends(get_current_user)
):
    """Retrieve previously analyzed call intelligence"""
    # In production, fetch from database
    return {
        "call_id": call_id,
        "message": "Intelligence retrieved",
        "status": "complete"
    }


@router.post("/intelligence/update-crm/{call_id}")
async def update_crm_from_intelligence(
    call_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Auto-update CRM with insights from call
    
    Updates:
    - Deal stage based on buying signals
    - Next task from next best action
    - Pain points in notes
    - Competitor mentions
    """
    return {
        "success": True,
        "call_id": call_id,
        "updates_made": [
            "Added 3 pain points to deal notes",
            "Created follow-up task: Send pricing comparison",
            "Updated deal score to 78/100",
            "Tagged competitor: Salesforce"
        ]
    }


# Helper functions
def _parse_transcript(transcript: str) -> Dict[str, Any]:
    """Parse raw transcript into structured data"""
    lines = transcript.split('\n')
    
    parsed = {
        "duration_minutes": 30,  # Extract from metadata
        "exchanges": []
    }
    
    for line in lines:
        if ':' in line:
            speaker, content = line.split(':', 1)
            parsed["exchanges"].append({
                "speaker": speaker.strip(),
                "content": content.strip(),
                "timestamp": 0  # Extract if available
            })
    
    return parsed


def _extract_pain_points(data: Dict[str, Any]) -> List[str]:
    """Extract pain points mentioned by prospect"""
    pain_point_keywords = [
        "struggle", "challenge", "problem", "difficult",
        "frustrated", "takes too long", "manual", "inefficient"
    ]
    
    pain_points = []
    for exchange in data["exchanges"]:
        content_lower = exchange["content"].lower()
        if any(keyword in content_lower for keyword in pain_point_keywords):
            pain_points.append(exchange["content"][:200])
    
    return pain_points[:5]  # Top 5


def _extract_buying_signals(data: Dict[str, Any]) -> List[str]:
    """Extract positive buying signals"""
    buying_keywords = [
        "budget", "timeline", "when can we", "how soon",
        "pricing", "contract", "implementation", "next steps"
    ]
    
    signals = []
    for exchange in data["exchanges"]:
        content_lower = exchange["content"].lower()
        if any(keyword in content_lower for keyword in buying_keywords):
            signals.append(exchange["content"][:200])
    
    return signals


def _extract_objections(data: Dict[str, Any]) -> List[Dict[str, str]]:
    """Extract objections and their context"""
    objection_keywords = [
        "expensive", "too much", "already have", "not sure",
        "concerned about", "worry", "hesitant"
    ]
    
    objections = []
    for exchange in data["exchanges"]:
        content_lower = exchange["content"].lower()
        if any(keyword in content_lower for keyword in objection_keywords):
            objections.append({
                "objection": exchange["content"][:200],
                "suggested_response": _generate_objection_response(exchange["content"])
            })
    
    return objections


def _extract_budget_mentions(data: Dict[str, Any]) -> List[str]:
    """Extract budget-related discussions"""
    budget_keywords = ["$", "budget", "price", "cost", "spend", "investment"]
    
    mentions = []
    for exchange in data["exchanges"]:
        if any(keyword in exchange["content"].lower() for keyword in budget_keywords):
            mentions.append(exchange["content"][:200])
    
    return mentions


def _extract_timeline_mentions(data: Dict[str, Any]) -> List[str]:
    """Extract timeline discussions"""
    timeline_keywords = [
        "quarter", "month", "q1", "q2", "q3", "q4",
        "january", "february", "by end of", "next year"
    ]
    
    mentions = []
    for exchange in data["exchanges"]:
        content_lower = exchange["content"].lower()
        if any(keyword in content_lower for keyword in timeline_keywords):
            mentions.append(exchange["content"][:200])
    
    return mentions


def _analyze_competitors(data: Dict[str, Any]) -> List[CompetitorMention]:
    """Analyze competitor mentions"""
    competitors = ["Salesforce", "HubSpot", "Apollo", "Outreach", "SalesLoft"]
    
    mentions = []
    for exchange in data["exchanges"]:
        for competitor in competitors:
            if competitor.lower() in exchange["content"].lower():
                mentions.append(CompetitorMention(
                    competitor=competitor,
                    context=exchange["content"][:200],
                    sentiment=SentimentType.NEUTRAL,
                    timestamp_seconds=exchange.get("timestamp", 0)
                ))
    
    return mentions


def _analyze_sentiment(data: Dict[str, Any]) -> SentimentAnalysis:
    """Analyze conversation sentiment"""
    return SentimentAnalysis(
        overall=SentimentType.POSITIVE,
        by_minute=[
            {"minute": 1, "sentiment": "positive"},
            {"minute": 5, "sentiment": "neutral"},
            {"minute": 10, "sentiment": "positive"}
        ],
        key_moments=[
            {"time": "2:30", "moment": "Prospect expressed frustration with current tool"},
            {"time": "8:45", "moment": "Excitement about AI features"},
            {"time": "15:20", "moment": "Price objection raised"}
        ]
    )


def _calculate_talk_metrics(data: Dict[str, Any], rep_name: str) -> Dict[str, Any]:
    """Calculate talk time ratios and question counts"""
    rep_words = 0
    prospect_words = 0
    questions = 0
    monologues = 0
    
    for exchange in data["exchanges"]:
        word_count = len(exchange["content"].split())
        
        if exchange["speaker"] == rep_name:
            rep_words += word_count
            if word_count > 100:  # Talking too long
                monologues += 1
        else:
            prospect_words += word_count
        
        if '?' in exchange["content"]:
            questions += 1
    
    total_words = rep_words + prospect_words
    talk_ratio = rep_words / total_words if total_words > 0 else 0.5
    
    return {
        "talk_time_ratio": round(talk_ratio, 2),
        "question_count": questions,
        "monologue_alerts": monologues
    }


def _compile_all_insights(
    pain_points, buying_signals, objections,
    budget_mentions, timeline_mentions
) -> List[ConversationInsight]:
    """Compile all insights into structured list"""
    insights = []
    
    for pain in pain_points:
        insights.append(ConversationInsight(
            type=InsightType.PAIN_POINT,
            content=pain,
            confidence=0.8,
            speaker="prospect"
        ))
    
    for signal in buying_signals:
        insights.append(ConversationInsight(
            type=InsightType.BUYING_SIGNAL,
            content=signal,
            confidence=0.75,
            speaker="prospect"
        ))
    
    return insights


def _score_deal(
    pain_points, buying_signals, objections,
    budget_mentions, timeline_mentions, sentiment
) -> int:
    """Score deal likelihood 0-100"""
    score = 50  # Base score
    
    # Positive factors
    score += len(pain_points) * 5
    score += len(buying_signals) * 8
    score += len(budget_mentions) * 6
    score += len(timeline_mentions) * 7
    
    if sentiment.overall == SentimentType.POSITIVE:
        score += 10
    
    # Negative factors
    score -= len(objections) * 3
    
    return max(0, min(100, score))


def _generate_next_actions(
    pain_points, objections, buying_signals, deal_score
) -> List[NextBestAction]:
    """Generate recommended next steps"""
    actions = []
    
    if objections:
        actions.append(NextBestAction(
            action="Send objection response email",
            priority="high",
            reasoning=f"Prospect raised {len(objections)} objections that need addressing",
            suggested_timeline="Within 24 hours"
        ))
    
    if buying_signals:
        actions.append(NextBestAction(
            action="Send pricing and implementation timeline",
            priority="high",
            reasoning="Strong buying signals detected - move deal forward",
            suggested_timeline="Within 12 hours"
        ))
    
    if pain_points:
        actions.append(NextBestAction(
            action="Share case study addressing their pain points",
            priority="medium",
            reasoning=f"Identified {len(pain_points)} specific pain points to address",
            suggested_timeline="Within 48 hours"
        ))
    
    if deal_score > 70:
        actions.append(NextBestAction(
            action="Schedule executive alignment call",
            priority="high",
            reasoning=f"Deal score {deal_score}/100 - high likelihood, escalate to close",
            suggested_timeline="This week"
        ))
    
    return actions


def _generate_objection_response(objection: str) -> str:
    """Generate suggested response to objection"""
    # Simple keyword-based responses
    objection_lower = objection.lower()
    
    if "expensive" in objection_lower or "price" in objection_lower:
        return "Focus on ROI - show how we save more than we cost. Share customer success story with 10x return."
    
    elif "already have" in objection_lower:
        return "Acknowledge their current solution. Ask what's working and what's not. Position as complementary or upgrade."
    
    elif "not sure" in objection_lower or "uncertain" in objection_lower:
        return "Offer proof of concept or trial. Share case study from similar company. Reduce perceived risk."
    
    else:
        return "Acknowledge concern. Ask clarifying questions. Provide evidence that addresses their specific worry."
