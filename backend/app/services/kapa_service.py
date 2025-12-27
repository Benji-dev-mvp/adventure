"""Kapa.ai integration service for AI-powered documentation and Q&A."""
from typing import Dict, Any, Optional, List
import httpx
import asyncio
import logging
import json
from datetime import datetime

from app.core.config import settings

logger = logging.getLogger(__name__)


class KapaService:
    """Service for interacting with Kapa.ai API."""
    
    KAPA_API_URL = "https://api.kapa.ai/query/v1"
    TIMEOUT = 30.0
    MAX_RETRIES = 3
    
    def __init__(self):
        self.api_key = settings.ai_api_key  # or specific KAPA_API_KEY
    
    async def query(
        self,
        question: str,
        tenant_id: int,
        user_id: Optional[int] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Query Kapa.ai with a question.
        
        Args:
            question: User's question
            tenant_id: Tenant ID for tracking
            user_id: User ID for tracking
            context: Additional context (conversation history, etc.)
        
        Returns:
            AI response with answer and sources
        """
        # Prepare request payload
        payload = {
            "query": question,
            "metadata": {
                "tenant_id": str(tenant_id),
                "user_id": str(user_id) if user_id else None,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        
        if context:
            payload["context"] = context
        
        # Make request with retries
        for attempt in range(self.MAX_RETRIES):
            try:
                async with httpx.AsyncClient(timeout=self.TIMEOUT) as client:
                    response = await client.post(
                        self.KAPA_API_URL,
                        json=payload,
                        headers={
                            "Authorization": f"Bearer {self.api_key}",
                            "Content-Type": "application/json"
                        }
                    )
                    
                    if response.status_code == 200:
                        result = response.json()
                        
                        # Log successful interaction
                        logger.info(f"Kapa query successful for tenant {tenant_id}")
                        
                        return {
                            "answer": result.get("answer", ""),
                            "sources": result.get("sources", []),
                            "confidence": result.get("confidence", 0.0),
                            "follow_up_questions": result.get("follow_up_questions", [])
                        }
                    
                    elif response.status_code == 429:
                        # Rate limit - wait and retry
                        logger.warning(f"Kapa rate limit hit, attempt {attempt + 1}")
                        if attempt < self.MAX_RETRIES - 1:
                            await asyncio.sleep(2 ** attempt)
                            continue
                    
                    else:
                        logger.error(f"Kapa API error: {response.status_code} - {response.text}")
                        raise Exception(f"Kapa API error: {response.status_code}")
            
            except httpx.TimeoutException:
                logger.error(f"Kapa API timeout, attempt {attempt + 1}")
                if attempt < self.MAX_RETRIES - 1:
                    continue
                raise Exception("Kapa API timeout after retries")
            
            except Exception as e:
                logger.error(f"Kapa API error: {e}")
                if attempt < self.MAX_RETRIES - 1:
                    continue
                raise
        
        # If all retries failed
        return {
            "answer": "I apologize, but I'm having trouble accessing the knowledge base right now. Please try again later.",
            "sources": [],
            "confidence": 0.0,
            "error": "Service temporarily unavailable"
        }
    
    async def search_docs(
        self,
        query: str,
        tenant_id: int,
        filters: Optional[Dict[str, Any]] = None,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Search documentation using RAG-style search.
        
        Args:
            query: Search query
            tenant_id: Tenant ID for tracking
            filters: Optional filters (category, tags, etc.)
            limit: Max number of results
        
        Returns:
            List of relevant documents
        """
        # For now, return mock results
        # In production, this would call Kapa's search endpoint
        
        logger.info(f"Doc search for tenant {tenant_id}: {query}")
        
        return [
            {
                "title": "Getting Started Guide",
                "excerpt": "Learn how to set up your first campaign...",
                "url": "/docs/getting-started",
                "relevance": 0.95
            },
            {
                "title": "Campaign Best Practices",
                "excerpt": "Optimize your campaigns with these proven strategies...",
                "url": "/docs/campaigns/best-practices",
                "relevance": 0.87
            }
        ]
    
    async def record_feedback(
        self,
        interaction_id: str,
        tenant_id: int,
        user_id: Optional[int],
        feedback_type: str,  # thumbs_up, thumbs_down, report
        reason: Optional[str] = None
    ) -> bool:
        """Record user feedback on AI responses.
        
        Args:
            interaction_id: ID of the interaction
            tenant_id: Tenant ID
            user_id: User ID
            feedback_type: Type of feedback
            reason: Optional reason/comment
        
        Returns:
            Success status
        """
        # Log feedback for analytics
        logger.info(
            f"Feedback recorded: tenant={tenant_id}, "
            f"type={feedback_type}, interaction={interaction_id}"
        )
        
        # In production, store in database for analytics
        return True


# Singleton instance
kapa_service = KapaService()
