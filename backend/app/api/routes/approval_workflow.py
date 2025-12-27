"""
Human-in-the-Loop Approval Workflow
AI drafts → Human reviews → AI learns from edits
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel
from enum import Enum

from app.core.db import get_session
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()


class ApprovalStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    NEEDS_REVISION = "needs_revision"


class ApprovalRequest(BaseModel):
    """Request for human approval"""
    content_type: str  # "email", "campaign", "message"
    content: Dict[str, Any]
    ai_reasoning: Optional[str] = None
    confidence_score: float
    target_lead: Optional[str] = None
    campaign_id: Optional[int] = None


class ApprovalResponse(BaseModel):
    """Human's response to approval request"""
    status: ApprovalStatus
    feedback: Optional[str] = None
    edited_content: Optional[Dict[str, Any]] = None
    approval_notes: Optional[str] = None


class ApprovalItem(BaseModel):
    """Full approval item with tracking"""
    id: int
    content_type: str
    original_content: Dict[str, Any]
    status: ApprovalStatus
    ai_reasoning: Optional[str]
    confidence_score: float
    submitted_by: str
    submitted_at: datetime
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    feedback: Optional[str] = None
    edited_content: Optional[Dict[str, Any]] = None
    learning_applied: bool = False


# In-memory storage (replace with database in production)
approval_queue: List[Dict[str, Any]] = []
approval_counter = 0


@router.post("/approvals/submit", response_model=Dict[str, Any])
async def submit_for_approval(
    request: ApprovalRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Submit AI-generated content for human approval
    
    Flow:
    1. AI generates content
    2. Submits to approval queue
    3. Human reviews
    4. System learns from edits
    """
    global approval_counter
    approval_counter += 1
    
    approval_item = {
        "id": approval_counter,
        "content_type": request.content_type,
        "original_content": request.content,
        "status": ApprovalStatus.PENDING,
        "ai_reasoning": request.ai_reasoning,
        "confidence_score": request.confidence_score,
        "target_lead": request.target_lead,
        "campaign_id": request.campaign_id,
        "submitted_by": current_user.email,
        "submitted_at": datetime.utcnow(),
        "reviewed_by": None,
        "reviewed_at": None,
        "feedback": None,
        "edited_content": None,
        "learning_applied": False
    }
    
    approval_queue.append(approval_item)
    
    return {
        "approval_id": approval_counter,
        "status": "pending",
        "message": "Submitted for approval",
        "queue_position": len([a for a in approval_queue if a["status"] == ApprovalStatus.PENDING])
    }


@router.get("/approvals/pending", response_model=List[Dict[str, Any]])
async def get_pending_approvals(
    content_type: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Get all pending approval requests"""
    pending = [
        a for a in approval_queue
        if a["status"] == ApprovalStatus.PENDING
    ]
    
    if content_type:
        pending = [a for a in pending if a["content_type"] == content_type]
    
    return pending


@router.get("/approvals/{approval_id}", response_model=Dict[str, Any])
async def get_approval(
    approval_id: int,
    current_user: User = Depends(get_current_user)
):
    """Get specific approval request"""
    for item in approval_queue:
        if item["id"] == approval_id:
            return item
    
    raise HTTPException(status_code=404, detail="Approval request not found")


@router.post("/approvals/{approval_id}/review")
async def review_approval(
    approval_id: int,
    response: ApprovalResponse,
    current_user: User = Depends(get_current_user)
):
    """
    Review and respond to approval request
    
    Options:
    - APPROVED: Use as-is
    - NEEDS_REVISION: Edit and use
    - REJECTED: Don't use, provide feedback
    """
    for item in approval_queue:
        if item["id"] == approval_id:
            item["status"] = response.status
            item["reviewed_by"] = current_user.email
            item["reviewed_at"] = datetime.utcnow()
            item["feedback"] = response.feedback
            item["edited_content"] = response.edited_content
            
            # Learn from edits
            if response.edited_content and response.status == ApprovalStatus.NEEDS_REVISION:
                learning_insights = await _analyze_edits(
                    item["original_content"],
                    response.edited_content,
                    response.feedback
                )
                item["learning_insights"] = learning_insights
                item["learning_applied"] = True
            
            return {
                "success": True,
                "approval_id": approval_id,
                "status": response.status,
                "learning_applied": item.get("learning_applied", False),
                "message": "Review recorded and learning applied"
            }
    
    raise HTTPException(status_code=404, detail="Approval request not found")


@router.get("/approvals/stats/summary")
async def get_approval_stats(
    current_user: User = Depends(get_current_user)
):
    """Get approval workflow statistics"""
    total = len(approval_queue)
    pending = len([a for a in approval_queue if a["status"] == ApprovalStatus.PENDING])
    approved = len([a for a in approval_queue if a["status"] == ApprovalStatus.APPROVED])
    revised = len([a for a in approval_queue if a["status"] == ApprovalStatus.NEEDS_REVISION])
    rejected = len([a for a in approval_queue if a["status"] == ApprovalStatus.REJECTED])
    
    # Calculate approval rate
    reviewed = approved + revised + rejected
    approval_rate = (approved / reviewed * 100) if reviewed > 0 else 0
    revision_rate = (revised / reviewed * 100) if reviewed > 0 else 0
    
    # Calculate average confidence for approved vs rejected
    approved_items = [a for a in approval_queue if a["status"] == ApprovalStatus.APPROVED]
    rejected_items = [a for a in approval_queue if a["status"] == ApprovalStatus.REJECTED]
    
    avg_approved_confidence = (
        sum(a["confidence_score"] for a in approved_items) / len(approved_items)
        if approved_items else 0
    )
    avg_rejected_confidence = (
        sum(a["confidence_score"] for a in rejected_items) / len(rejected_items)
        if rejected_items else 0
    )
    
    return {
        "total_submissions": total,
        "pending": pending,
        "approved": approved,
        "needs_revision": revised,
        "rejected": rejected,
        "approval_rate": round(approval_rate, 1),
        "revision_rate": round(revision_rate, 1),
        "avg_approved_confidence": round(avg_approved_confidence, 2),
        "avg_rejected_confidence": round(avg_rejected_confidence, 2),
        "learning_insights_count": len([a for a in approval_queue if a.get("learning_applied")])
    }


@router.post("/approvals/{approval_id}/fast-approve")
async def fast_approve(
    approval_id: int,
    current_user: User = Depends(get_current_user)
):
    """Quick approve for high-confidence AI content"""
    for item in approval_queue:
        if item["id"] == approval_id:
            if item["confidence_score"] < 0.8:
                raise HTTPException(
                    status_code=400,
                    detail="Fast approve only available for confidence > 80%"
                )
            
            item["status"] = ApprovalStatus.APPROVED
            item["reviewed_by"] = current_user.email
            item["reviewed_at"] = datetime.utcnow()
            item["feedback"] = "Fast approved - high confidence"
            
            return {
                "success": True,
                "message": "Fast approved",
                "confidence": item["confidence_score"]
            }
    
    raise HTTPException(status_code=404, detail="Approval request not found")


async def _analyze_edits(
    original: Dict[str, Any],
    edited: Dict[str, Any],
    feedback: Optional[str]
) -> Dict[str, Any]:
    """
    Analyze what was changed and why to improve AI
    
    This feeds back into the AI training loop
    """
    changes = {}
    
    for key in original:
        if key in edited and original[key] != edited[key]:
            changes[key] = {
                "original": original[key],
                "edited": edited[key],
                "type": "modification"
            }
    
    for key in edited:
        if key not in original:
            changes[key] = {
                "edited": edited[key],
                "type": "addition"
            }
    
    return {
        "changes": changes,
        "feedback": feedback,
        "change_count": len(changes),
        "timestamp": datetime.utcnow().isoformat(),
        "actionable_insights": _extract_insights(changes, feedback)
    }


def _extract_insights(changes: Dict, feedback: Optional[str]) -> List[str]:
    """Extract actionable insights from edits"""
    insights = []
    
    if "subject" in changes:
        insights.append("Subject lines need adjustment - focus on brevity")
    
    if "tone" in changes:
        insights.append("Tone adjustment needed - match company voice")
    
    if len(changes) > 5:
        insights.append("Major content revision needed - review targeting")
    
    if feedback and "personalization" in feedback.lower():
        insights.append("Increase personalization depth")
    
    return insights
