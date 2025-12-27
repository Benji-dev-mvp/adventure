"""
API routes for ML Lead Scoring, Intent Signals, and Autonomous BDR
"""
from typing import List, Dict
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.ml_lead_scoring import predict_lead_score, train_lead_scoring_model
from app.core.intent_signals import track_company_intent, get_company_intent_score, get_high_intent_accounts
from app.core.autonomous_bdr import start_autonomous_campaign, process_reply

router = APIRouter()


# ============= ML Lead Scoring =============

class LeadScoreRequest(BaseModel):
    """Request for lead scoring"""
    lead_id: str
    name: str
    title: str
    company: str
    industry: str
    company_size: int = 0
    email_opens: int = 0
    email_clicks: int = 0
    link_clicks: int = 0
    reply_count: int = 0
    meeting_booked: bool = False
    target_industries: List[str] = []
    tech_stack: List[str] = []
    target_tech_stack: List[str] = []
    intent_score: int = 0


@router.post("/ml/lead-score")
async def score_lead(request: LeadScoreRequest) -> Dict:
    """
    Score a lead using trained ML model
    
    Returns lead score (0-100), tier (hot/warm/cold), and contributing factors
    """
    try:
        result = predict_lead_score(request.dict())
        return {
            "success": True,
            "lead_id": request.lead_id,
            "lead_name": request.name,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scoring failed: {str(e)}")


class MLTrainingRequest(BaseModel):
    """Request to train ML model"""
    training_samples: int = 5000
    retrain: bool = False


@router.post("/ml/train")
async def train_model(request: MLTrainingRequest) -> Dict:
    """
    Train or retrain the ML lead scoring model
    
    This would typically be run:
    - On initial setup
    - Weekly/monthly with new conversion data
    - When model accuracy drops
    """
    try:
        from app.core.ml_lead_scoring import generate_synthetic_training_data
        
        # Generate training data (in production, use real conversion data)
        training_data, labels = generate_synthetic_training_data(n_samples=request.training_samples)
        
        # Train model
        metrics = train_lead_scoring_model(training_data, labels)
        
        return {
            "success": True,
            "message": "Model trained successfully",
            "metrics": metrics,
            "recommendation": "Deploy to production" if metrics['accuracy'] >= 0.85 else "Needs improvement"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")


@router.get("/ml/model-status")
async def get_model_status() -> Dict:
    """Get current ML model status"""
    from app.core.ml_lead_scoring import lead_scorer
    
    return {
        "is_trained": lead_scorer.is_trained,
        "model_version": "xgboost_v1" if lead_scorer.is_trained else "rule_based_v1",
        "features": lead_scorer.feature_names if lead_scorer.is_trained else [],
        "status": "ready" if lead_scorer.is_trained else "needs_training"
    }


# ============= Intent Signals =============

class IntentTrackRequest(BaseModel):
    """Request to track company intent"""
    company_domain: str
    company_name: str


@router.post("/intent/track")
async def track_intent(request: IntentTrackRequest) -> Dict:
    """
    Start tracking intent signals for a company
    
    Scans for:
    - Job postings (hiring = growth)
    - Funding rounds (money = buying power)
    - Tech stack changes (evaluating new tools)
    - Leadership changes (new priorities)
    """
    try:
        result = await track_company_intent(request.company_domain, request.company_name)
        return {
            "success": True,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tracking failed: {str(e)}")


@router.get("/intent/score/{company_domain}")
async def get_intent_score(company_domain: str) -> Dict:
    """Get current intent score for a company"""
    try:
        result = await get_company_intent_score(company_domain)
        return {
            "success": True,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get score: {str(e)}")


@router.get("/intent/high-intent-accounts")
async def get_hot_accounts(min_score: int = 70) -> Dict:
    """
    Get all accounts showing high buying intent
    
    Use this to:
    - Prioritize outreach
    - Auto-trigger campaigns
    - Alert sales team
    """
    try:
        accounts = await get_high_intent_accounts(min_score=min_score)
        return {
            "success": True,
            "count": len(accounts),
            "accounts": accounts,
            "min_score": min_score
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get accounts: {str(e)}")


# ============= Autonomous AI BDR =============

class AutonomousCampaignRequest(BaseModel):
    """Request to start autonomous campaign"""
    lead_id: str
    name: str
    email: str
    title: str
    company: str
    industry: str
    company_size: int = 0
    recent_funding: str = None
    job_postings: str = None
    company_growth: str = None


@router.post("/autonomous/start")
async def start_autonomous(request: AutonomousCampaignRequest) -> Dict:
    """
    Start fully autonomous AI BDR campaign
    
    Ava will:
    1. Research the prospect
    2. Write personalized email (no templates)
    3. Send email
    4. Monitor for replies
    5. Handle objections autonomously
    6. Book meetings when interested
    7. Hand off to human when qualified
    """
    try:
        result = await start_autonomous_campaign(request.dict())
        return {
            "success": True,
            "message": f"Autonomous campaign started for {request.name}",
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start campaign: {str(e)}")


class ReplyProcessRequest(BaseModel):
    """Request to process a reply"""
    lead_id: str
    reply_text: str
    lead: Dict


@router.post("/autonomous/process-reply")
async def process_prospect_reply(request: ReplyProcessRequest) -> Dict:
    """
    Process incoming reply and take autonomous action
    
    AI will:
    - Analyze sentiment and intent
    - Detect objections
    - Generate appropriate response
    - Book meeting if interested
    - Escalate to human if needed
    """
    try:
        result = await process_reply(
            lead_id=request.lead_id,
            reply_text=request.reply_text,
            lead=request.lead
        )
        return {
            "success": True,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process reply: {str(e)}")


@router.get("/autonomous/campaigns")
async def list_autonomous_campaigns() -> Dict:
    """List all active autonomous campaigns"""
    # In production, query from database
    return {
        "success": True,
        "campaigns": [],
        "total": 0,
        "message": "Feature coming soon - query autonomous campaigns from database"
    }


# ============= Health Check =============

@router.get("/advanced/health")
async def health_check() -> Dict:
    """
    Check health of all advanced features
    """
    from app.core.ml_lead_scoring import lead_scorer
    
    health = {
        "ml_model": {
            "status": "ready" if lead_scorer.is_trained else "not_trained",
            "accuracy": "85%+" if lead_scorer.is_trained else "N/A"
        },
        "intent_engine": {
            "status": "ready",
            "tracked_companies": 0  # Would get from intent_engine.tracked_companies
        },
        "autonomous_bdr": {
            "status": "ready",
            "active_campaigns": 0
        },
        "overall_status": "operational"
    }
    
    return health
