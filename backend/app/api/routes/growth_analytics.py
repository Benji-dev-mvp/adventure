"""
Growth analytics and feedback API routes
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime, timedelta
from app.core.db import get_session
from app.models.growth_models import (
    ActivationMetrics, RetentionMetrics, ExpansionMetrics,
    NPSResponse, FeedbackSubmission, ReleaseNote
)
from pydantic import BaseModel


router = APIRouter()


# ============================================================================
# Request/Response Models
# ============================================================================

class ActivationMilestoneCreate(BaseModel):
    milestone: str


class NPSResponseCreate(BaseModel):
    score: int  # 0-10
    feedback: Optional[str] = None
    survey_context: Optional[str] = None


class FeedbackCreate(BaseModel):
    category: str
    title: str
    description: str


class FeedbackUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    admin_response: Optional[str] = None


# ============================================================================
# Activation Metrics Endpoints
# ============================================================================

@router.get("/analytics/activation")
def get_activation_metrics(
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Get user activation metrics"""
    statement = select(ActivationMetrics).where(
        ActivationMetrics.user_id == user_id
    )
    metrics = session.exec(statement).all()
    
    # Define all milestones
    all_milestones = [
        "account_created",
        "profile_completed",
        "onboarding_completed",
        "first_lead_added",
        "first_campaign_created",
        "first_campaign_launched",
        "first_email_sent",
        "email_account_connected",
        "crm_connected",
        "team_member_invited"
    ]
    
    # Build response
    milestones_status = {}
    for milestone in all_milestones:
        metric = next((m for m in metrics if m.milestone == milestone), None)
        milestones_status[milestone] = {
            "completed": metric.completed if metric else False,
            "completed_at": metric.completed_at if metric else None
        }
    
    completed_count = sum(1 for m in milestones_status.values() if m["completed"])
    activation_percentage = (completed_count / len(all_milestones)) * 100
    
    return {
        "milestones": milestones_status,
        "completed_count": completed_count,
        "total_milestones": len(all_milestones),
        "activation_percentage": activation_percentage
    }


@router.post("/analytics/activation/milestone")
def complete_milestone(
    data: ActivationMilestoneCreate,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Mark activation milestone as completed"""
    # Check if milestone already exists
    existing = session.exec(
        select(ActivationMetrics).where(
            ActivationMetrics.user_id == user_id,
            ActivationMetrics.milestone == data.milestone
        )
    ).first()
    
    if existing:
        if not existing.completed:
            existing.completed = True
            existing.completed_at = datetime.utcnow()
            existing.updated_at = datetime.utcnow()
            session.add(existing)
            session.commit()
            session.refresh(existing)
        return existing
    
    # Create new milestone
    metric = ActivationMetrics(
        user_id=user_id,
        milestone=data.milestone,
        completed=True,
        completed_at=datetime.utcnow()
    )
    
    session.add(metric)
    session.commit()
    session.refresh(metric)
    
    return metric


# ============================================================================
# Retention Metrics Endpoints
# ============================================================================

@router.get("/analytics/retention")
def get_retention_metrics(
    user_id: int = 1,  # TODO: Get from auth
    days: int = 30,
    session: Session = Depends(get_session)
):
    """Get user retention metrics"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    statement = select(RetentionMetrics).where(
        RetentionMetrics.user_id == user_id,
        RetentionMetrics.period_start >= start_date
    ).order_by(RetentionMetrics.period_start.desc())
    
    metrics = session.exec(statement).all()
    
    # Calculate aggregates
    total_logins = sum(m.login_count for m in metrics)
    total_campaigns = sum(m.campaigns_created for m in metrics)
    total_leads = sum(m.leads_added for m in metrics)
    total_emails = sum(m.emails_sent for m in metrics)
    
    # Get latest churn risk
    latest_metric = metrics[0] if metrics else None
    churn_risk = {
        "score": latest_metric.churn_risk_score if latest_metric else 0,
        "is_at_risk": latest_metric.is_at_risk if latest_metric else False
    }
    
    return {
        "period_days": days,
        "metrics": metrics,
        "summary": {
            "total_logins": total_logins,
            "total_campaigns": total_campaigns,
            "total_leads": total_leads,
            "total_emails": total_emails,
            "avg_active_days_per_week": sum(m.active_days for m in metrics) / max(len(metrics), 1)
        },
        "churn_risk": churn_risk
    }


# ============================================================================
# Expansion Metrics Endpoints
# ============================================================================

@router.get("/analytics/expansion")
def get_expansion_opportunities(
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Get expansion opportunities for upsell"""
    statement = select(ExpansionMetrics).where(
        ExpansionMetrics.user_id == user_id,
        ExpansionMetrics.converted == False
    ).order_by(ExpansionMetrics.score.desc())
    
    opportunities = session.exec(statement).all()
    
    return {
        "opportunities": opportunities,
        "total_potential_revenue": sum(o.expansion_revenue for o in opportunities)
    }


@router.post("/analytics/expansion/{opportunity_id}/present")
def present_expansion_opportunity(
    opportunity_id: int,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Mark expansion opportunity as presented"""
    opportunity = session.get(ExpansionMetrics, opportunity_id)
    
    if not opportunity or opportunity.user_id != user_id:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    opportunity.presented = True
    opportunity.presented_at = datetime.utcnow()
    opportunity.updated_at = datetime.utcnow()
    
    session.add(opportunity)
    session.commit()
    session.refresh(opportunity)
    
    return opportunity


@router.post("/analytics/expansion/{opportunity_id}/convert")
def convert_expansion_opportunity(
    opportunity_id: int,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Mark expansion opportunity as converted"""
    opportunity = session.get(ExpansionMetrics, opportunity_id)
    
    if not opportunity or opportunity.user_id != user_id:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    opportunity.converted = True
    opportunity.converted_at = datetime.utcnow()
    opportunity.updated_at = datetime.utcnow()
    
    session.add(opportunity)
    session.commit()
    session.refresh(opportunity)
    
    return opportunity


# ============================================================================
# NPS Endpoints
# ============================================================================

@router.post("/feedback/nps")
def submit_nps_response(
    data: NPSResponseCreate,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Submit NPS response"""
    if data.score < 0 or data.score > 10:
        raise HTTPException(status_code=400, detail="Score must be between 0 and 10")
    
    # Categorize
    if data.score <= 6:
        category = "detractor"
    elif data.score <= 8:
        category = "passive"
    else:
        category = "promoter"
    
    nps_response = NPSResponse(
        user_id=user_id,
        score=data.score,
        category=category,
        feedback=data.feedback,
        survey_context=data.survey_context
    )
    
    session.add(nps_response)
    session.commit()
    session.refresh(nps_response)
    
    return nps_response


@router.get("/feedback/nps/score")
def get_nps_score(
    days: int = 30,
    session: Session = Depends(get_session)
):
    """Calculate NPS score"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    statement = select(NPSResponse).where(
        NPSResponse.submitted_at >= start_date
    )
    responses = session.exec(statement).all()
    
    if not responses:
        return {"nps_score": None, "total_responses": 0}
    
    total = len(responses)
    promoters = sum(1 for r in responses if r.category == "promoter")
    detractors = sum(1 for r in responses if r.category == "detractor")
    
    nps_score = ((promoters - detractors) / total) * 100
    
    return {
        "nps_score": round(nps_score, 1),
        "total_responses": total,
        "promoters": promoters,
        "passives": sum(1 for r in responses if r.category == "passive"),
        "detractors": detractors,
        "period_days": days
    }


# ============================================================================
# Feedback Endpoints
# ============================================================================

@router.post("/feedback")
def submit_feedback(
    data: FeedbackCreate,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Submit feedback"""
    feedback = FeedbackSubmission(
        user_id=user_id,
        category=data.category,
        title=data.title,
        description=data.description
    )
    
    session.add(feedback)
    session.commit()
    session.refresh(feedback)
    
    return feedback


@router.get("/feedback")
def list_feedback(
    category: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 20,
    session: Session = Depends(get_session)
):
    """List feedback submissions"""
    statement = select(FeedbackSubmission)
    
    if category:
        statement = statement.where(FeedbackSubmission.category == category)
    if status:
        statement = statement.where(FeedbackSubmission.status == status)
    
    statement = statement.order_by(FeedbackSubmission.created_at.desc()).limit(limit)
    
    feedback_list = session.exec(statement).all()
    return feedback_list


@router.get("/feedback/{feedback_id}")
def get_feedback(
    feedback_id: int,
    session: Session = Depends(get_session)
):
    """Get feedback details"""
    feedback = session.get(FeedbackSubmission, feedback_id)
    
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    
    return feedback


@router.put("/feedback/{feedback_id}")
def update_feedback(
    feedback_id: int,
    data: FeedbackUpdate,
    user_id: int = 1,  # TODO: Get from auth (admin only)
    session: Session = Depends(get_session)
):
    """Update feedback (admin only)"""
    feedback = session.get(FeedbackSubmission, feedback_id)
    
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    
    if data.status:
        feedback.status = data.status
    if data.priority:
        feedback.priority = data.priority
    if data.admin_response:
        feedback.admin_response = data.admin_response
        feedback.responded_at = datetime.utcnow()
    
    feedback.updated_at = datetime.utcnow()
    
    session.add(feedback)
    session.commit()
    session.refresh(feedback)
    
    return feedback


@router.post("/feedback/{feedback_id}/upvote")
def upvote_feedback(
    feedback_id: int,
    session: Session = Depends(get_session)
):
    """Upvote feedback"""
    feedback = session.get(FeedbackSubmission, feedback_id)
    
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    
    feedback.upvotes += 1
    feedback.updated_at = datetime.utcnow()
    
    session.add(feedback)
    session.commit()
    session.refresh(feedback)
    
    return feedback


# ============================================================================
# Release Notes Endpoints
# ============================================================================

@router.get("/releases")
def list_releases(
    limit: int = 10,
    session: Session = Depends(get_session)
):
    """List published release notes"""
    statement = select(ReleaseNote).where(
        ReleaseNote.is_published == True
    ).order_by(ReleaseNote.release_date.desc()).limit(limit)
    
    releases = session.exec(statement).all()
    return releases


@router.get("/releases/{release_id}")
def get_release(
    release_id: int,
    session: Session = Depends(get_session)
):
    """Get release note details"""
    release = session.get(ReleaseNote, release_id)
    
    if not release or not release.is_published:
        raise HTTPException(status_code=404, detail="Release not found")
    
    return release
