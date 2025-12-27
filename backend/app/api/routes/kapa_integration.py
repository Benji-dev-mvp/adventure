"""
Kapa.ai Integration for AI-powered documentation and support.

This module provides integration with Kapa.ai to enable:
- AI-powered documentation search
- In-app support queries
- Knowledge base integration
- Analytics and feedback collection
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import httpx
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()


class KapaQuery(BaseModel):
    """Request model for Kapa.ai queries."""
    query: str = Field(..., description="User's question or search query")
    integration_id: Optional[str] = Field(None, description="Integration ID for analytics")
    thread_id: Optional[str] = Field(None, description="Thread ID to continue conversation")
    sources: Optional[List[str]] = Field(None, description="Specific sources to search")


class KapaResponse(BaseModel):
    """Response model from Kapa.ai."""
    answer: str = Field(..., description="AI-generated answer")
    sources: List[Dict[str, Any]] = Field(default_factory=list, description="Source documents")
    thread_id: str = Field(..., description="Thread ID for conversation continuity")
    confidence: Optional[float] = Field(None, description="Confidence score")


class KapaFeedback(BaseModel):
    """Feedback for Kapa.ai responses."""
    thread_id: str = Field(..., description="Thread ID of the response")
    helpful: bool = Field(..., description="Whether the response was helpful")
    comment: Optional[str] = Field(None, description="Additional feedback")


@router.post("/kapa/query", response_model=KapaResponse)
async def query_kapa_ai(query: KapaQuery):
    """
    Query Kapa.ai for documentation and support answers.
    
    This endpoint forwards user queries to Kapa.ai and returns AI-generated
    answers with relevant source documentation.
    """
    if not settings.kapa_api_key or not settings.kapa_project_id:
        raise HTTPException(
            status_code=503,
            detail="Kapa.ai integration is not configured. Please set KAPA_API_KEY and KAPA_PROJECT_ID."
        )
    
    try:
        async with httpx.AsyncClient() as client:
            url = f"https://api.kapa.ai/query/v1/projects/{settings.kapa_project_id}/chat/"
            
            headers = {
                "X-API-KEY": settings.kapa_api_key,
                "Content-Type": "application/json"
            }
            
            payload = {
                "query": query.query,
            }
            
            if query.integration_id:
                payload["integration_id"] = query.integration_id
            
            if query.thread_id:
                payload["thread_id"] = query.thread_id
            
            if query.sources:
                payload["sources"] = query.sources
            
            response = await client.post(url, json=payload, headers=headers, timeout=30.0)
            response.raise_for_status()
            
            data = response.json()
            
            return KapaResponse(
                answer=data.get("answer", ""),
                sources=data.get("sources", []),
                thread_id=data.get("thread_id", ""),
                confidence=data.get("confidence")
            )
    
    except httpx.HTTPError as e:
        logger.error(f"Kapa.ai API error: {str(e)}")
        raise HTTPException(
            status_code=502,
            detail=f"Failed to query Kapa.ai: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error querying Kapa.ai: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred"
        )


@router.post("/kapa/feedback")
async def submit_kapa_feedback(feedback: KapaFeedback):
    """
    Submit feedback for a Kapa.ai response.
    
    This helps improve the AI assistant's accuracy and relevance over time.
    """
    if not settings.kapa_api_key or not settings.kapa_project_id:
        raise HTTPException(
            status_code=503,
            detail="Kapa.ai integration is not configured"
        )
    
    try:
        async with httpx.AsyncClient() as client:
            url = f"https://api.kapa.ai/feedback/v1/projects/{settings.kapa_project_id}/threads/{feedback.thread_id}"
            
            headers = {
                "X-API-KEY": settings.kapa_api_key,
                "Content-Type": "application/json"
            }
            
            payload = {
                "helpful": feedback.helpful,
            }
            
            if feedback.comment:
                payload["comment"] = feedback.comment
            
            response = await client.post(url, json=payload, headers=headers, timeout=10.0)
            response.raise_for_status()
            
            return {"status": "success", "message": "Feedback submitted successfully"}
    
    except httpx.HTTPError as e:
        logger.error(f"Kapa.ai feedback API error: {str(e)}")
        raise HTTPException(
            status_code=502,
            detail=f"Failed to submit feedback: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error submitting feedback: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred"
        )


@router.get("/kapa/status")
async def get_kapa_status():
    """
    Check Kapa.ai integration status.
    
    Returns whether Kapa.ai is configured and operational.
    """
    is_configured = bool(settings.kapa_api_key and settings.kapa_project_id)
    
    status = {
        "configured": is_configured,
        "project_id": settings.kapa_project_id if is_configured else None,
        "status": "operational" if is_configured else "not_configured"
    }
    
    if is_configured:
        # Test the connection
        try:
            async with httpx.AsyncClient() as client:
                url = f"https://api.kapa.ai/query/v1/projects/{settings.kapa_project_id}/chat/"
                headers = {
                    "X-API-KEY": settings.kapa_api_key,
                    "Content-Type": "application/json"
                }
                # Simple test query
                response = await client.post(
                    url,
                    json={"query": "test"},
                    headers=headers,
                    timeout=5.0
                )
                status["status"] = "operational" if response.status_code == 200 else "error"
        except Exception as e:
            logger.warning(f"Kapa.ai connection test failed: {str(e)}")
            status["status"] = "error"
            status["error"] = str(e)
    
    return status
