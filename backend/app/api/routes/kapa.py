"""Kapa.ai API routes for AI-powered assistant."""
from fastapi import APIRouter, Depends, HTTPException, Path, Body
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field
from sqlmodel import Session

from app.core.db import get_session
from app.core.security import get_current_user
from app.models.user import User
from app.services.kapa_service import kapa_service
from app.services.audit_log_service import audit_log_service

router = APIRouter(prefix="/api/assistant", tags=["ai-assistant"])


class AssistantQuery(BaseModel):
    """Assistant query request."""
    question: str = Field(..., min_length=1, max_length=2000, description="User's question")
    context: Optional[Dict[str, Any]] = Field(None, description="Additional context")
    conversation_id: Optional[str] = Field(None, description="Conversation ID for tracking")


class AssistantResponse(BaseModel):
    """Assistant query response."""
    answer: str
    sources: List[Dict[str, Any]]
    confidence: float
    follow_up_questions: List[str]


class DocSearchQuery(BaseModel):
    """Documentation search query."""
    query: str = Field(..., min_length=1, max_length=500, description="Search query")
    filters: Optional[Dict[str, Any]] = Field(None, description="Optional filters")
    limit: int = Field(10, ge=1, le=50, description="Max results")


class FeedbackRequest(BaseModel):
    """User feedback request."""
    interaction_id: str
    feedback_type: str = Field(..., pattern="^(thumbs_up|thumbs_down|report)$")
    reason: Optional[str] = Field(None, max_length=1000)


@router.post("/query", response_model=AssistantResponse)
async def query_assistant(
    query: AssistantQuery = Body(...),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Query the AI assistant with a question.
    
    The assistant uses Kapa.ai to provide intelligent answers based on
    your documentation, knowledge base, and product context.
    
    Responses include:
    - Comprehensive answer
    - Source citations
    - Confidence score
    - Follow-up question suggestions
    """
    # Get tenant ID (in production, from user.tenant_id)
    tenant_id = 1
    
    try:
        # Query Kapa
        response = await kapa_service.query(
            question=query.question,
            tenant_id=tenant_id,
            user_id=user.id,
            context=query.context
        )
        
        # Log interaction for analytics
        audit_log_service.log_audit_event(
            session,
            tenant_id=tenant_id,
            action="assistant.query",
            user=user,
            resource_type="assistant",
            metadata={
                "question": query.question[:200],  # Truncate for storage
                "conversation_id": query.conversation_id,
                "confidence": response.get("confidence")
            },
            success=True
        )
        
        return AssistantResponse(
            answer=response["answer"],
            sources=response["sources"],
            confidence=response["confidence"],
            follow_up_questions=response.get("follow_up_questions", [])
        )
    
    except Exception as e:
        # Log error
        audit_log_service.log_audit_event(
            session,
            tenant_id=tenant_id,
            action="assistant.query",
            user=user,
            resource_type="assistant",
            metadata={"question": query.question[:200]},
            success=False,
            error_message=str(e)
        )
        
        raise HTTPException(
            status_code=500,
            detail="Failed to process assistant query"
        )


@router.post("/docs/search", response_model=List[Dict[str, Any]])
async def search_docs(
    search: DocSearchQuery = Body(...),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Search documentation using RAG-style semantic search.
    
    Returns relevant documentation snippets based on your query,
    ranked by relevance using AI embeddings.
    """
    # Get tenant ID (in production, from user.tenant_id)
    tenant_id = 1
    
    try:
        # Search docs
        results = await kapa_service.search_docs(
            query=search.query,
            tenant_id=tenant_id,
            filters=search.filters,
            limit=search.limit
        )
        
        # Log search
        audit_log_service.log_audit_event(
            session,
            tenant_id=tenant_id,
            action="assistant.search_docs",
            user=user,
            resource_type="docs",
            metadata={
                "query": search.query,
                "results_count": len(results)
            },
            success=True
        )
        
        return results
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Failed to search documentation"
        )


@router.post("/conversation/feedback", status_code=204)
async def record_feedback(
    feedback: FeedbackRequest = Body(...),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Record user feedback on assistant responses.
    
    Feedback helps improve the AI assistant's accuracy and relevance.
    
    Feedback types:
    - thumbs_up: Helpful response
    - thumbs_down: Unhelpful response
    - report: Report an issue (requires reason)
    """
    # Get tenant ID (in production, from user.tenant_id)
    tenant_id = 1
    
    if feedback.feedback_type == "report" and not feedback.reason:
        raise HTTPException(
            status_code=400,
            detail="Reason required when reporting an issue"
        )
    
    try:
        # Record feedback
        success = await kapa_service.record_feedback(
            interaction_id=feedback.interaction_id,
            tenant_id=tenant_id,
            user_id=user.id,
            feedback_type=feedback.feedback_type,
            reason=feedback.reason
        )
        
        # Log feedback
        audit_log_service.log_audit_event(
            session,
            tenant_id=tenant_id,
            action="assistant.feedback",
            user=user,
            resource_type="assistant",
            metadata={
                "interaction_id": feedback.interaction_id,
                "feedback_type": feedback.feedback_type
            },
            success=success
        )
        
        return None
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Failed to record feedback"
        )
