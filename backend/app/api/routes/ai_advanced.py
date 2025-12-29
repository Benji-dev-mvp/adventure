"""
Advanced AI API Routes

Exposes advanced AI capabilities through REST API:
- Lead scoring with context
- Personalized email generation
- Campaign strategy planning
- Conversational assistance
- Memory management
- RAG document search
"""

import os
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlmodel import Session

from ...core.ai_orchestrator import UnifiedAIOrchestrator
from ...core.db import get_session
from ...core.security import get_current_user
from ...models.user import User

router = APIRouter(prefix="/ai-advanced", tags=["AI Advanced"])


# ============================================================================
# Request/Response Models
# ============================================================================


class LeadScoreRequest(BaseModel):
    """Request for lead scoring"""

    lead_data: Dict[str, Any] = Field(..., description="Lead information")


class LeadScoreResponse(BaseModel):
    """Response for lead scoring"""

    lead_score: Dict[str, Any]
    past_interactions: int
    similar_leads_found: int
    context_used: bool


class EmailGenerationRequest(BaseModel):
    """Request for email generation"""

    lead_data: Dict[str, Any] = Field(..., description="Lead information")
    campaign_objective: str = Field(..., description="Campaign objective")
    tone: str = Field(default="professional", description="Email tone")


class EmailGenerationResponse(BaseModel):
    """Response for email generation"""

    email: Dict[str, Any]
    preferences_applied: bool
    past_interactions_considered: int
    campaign_insights_used: int


class CampaignStrategyRequest(BaseModel):
    """Request for campaign strategy"""

    objective: str = Field(..., description="Campaign objective")
    target_audience: str = Field(..., description="Target audience description")
    budget_range: str = Field(..., description="Budget range (e.g., $10k-$20k)")


class CampaignStrategyResponse(BaseModel):
    """Response for campaign strategy"""

    strategy: Dict[str, Any]
    tactical_recommendations: str
    past_learnings_incorporated: int
    historical_data_analyzed: int


class ConversationRequest(BaseModel):
    """Request for conversational assistance"""

    message: str = Field(..., min_length=1, max_length=2000)
    context: Optional[str] = Field(None, description="Optional conversation context")


class ConversationResponse(BaseModel):
    """Response for conversation"""

    response: str
    memory_context_used: bool
    knowledge_base_used: bool
    intermediate_steps: List[Any] = Field(default_factory=list)


class MemoryAddRequest(BaseModel):
    """Request to add memory"""

    content: str = Field(..., description="Memory content")
    category: str = Field(..., description="Memory category")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")


class MemorySearchRequest(BaseModel):
    """Request to search memories"""

    query: str = Field(..., description="Search query")
    category: Optional[str] = Field(None, description="Filter by category")
    limit: int = Field(default=10, ge=1, le=50)


class RAGIngestRequest(BaseModel):
    """Request to ingest documents into RAG"""

    documents: List[Dict[str, Any]] = Field(..., description="Documents to ingest")
    index_name: str = Field(default="default", description="Index name")


class RAGQueryRequest(BaseModel):
    """Request to query RAG"""

    query: str = Field(..., description="Query text")
    index_name: str = Field(default="default", description="Index name")
    top_k: int = Field(default=5, ge=1, le=20)


class BatchLeadAnalysisRequest(BaseModel):
    """Request for batch lead analysis"""

    leads: List[Dict[str, Any]] = Field(..., min_items=1, max_items=100)


# ============================================================================
# Initialize Orchestrator
# ============================================================================


def get_orchestrator() -> UnifiedAIOrchestrator:
    """Get or create orchestrator instance"""
    # In production, consider caching this or using dependency injection
    return UnifiedAIOrchestrator(
        model_provider=os.getenv("AI_PROVIDER", "openai"),
        model_name=os.getenv("AI_MODEL", "gpt-4"),
        temperature=float(os.getenv("AI_TEMPERATURE", "0.7")),
        use_hosted_mem0=os.getenv("MEM0_HOSTED", "false").lower() == "true",
    )


# ============================================================================
# API Endpoints
# ============================================================================


@router.post("/lead/score", response_model=LeadScoreResponse)
async def score_lead(
    request: LeadScoreRequest,
    current_user: User = Depends(get_current_user),
    orchestrator: UnifiedAIOrchestrator = Depends(get_orchestrator),
):
    """
    Score a lead using intelligent context from memory and similar leads

    Features:
    - Recalls past interactions with lead
    - Finds similar high-value leads
    - Provides type-safe scoring
    - Remembers scoring decision
    """
    try:
        result = await orchestrator.intelligent_lead_scoring(
            user_id=str(current_user.id),
            lead_data=request.lead_data,
        )
        return LeadScoreResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lead scoring failed: {str(e)}",
        )


@router.post("/email/generate", response_model=EmailGenerationResponse)
async def generate_email(
    request: EmailGenerationRequest,
    current_user: User = Depends(get_current_user),
    orchestrator: UnifiedAIOrchestrator = Depends(get_orchestrator),
):
    """
    Generate highly personalized email using all available context

    Features:
    - Applies user email preferences
    - Considers past lead interactions
    - Uses successful campaign patterns
    - Type-safe output validation
    - Remembers generated emails
    """
    try:
        result = await orchestrator.personalized_email_generation(
            user_id=str(current_user.id),
            lead_data=request.lead_data,
            campaign_objective=request.campaign_objective,
            tone=request.tone,
        )
        return EmailGenerationResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Email generation failed: {str(e)}",
        )


@router.post("/campaign/strategy", response_model=CampaignStrategyResponse)
async def create_campaign_strategy(
    request: CampaignStrategyRequest,
    current_user: User = Depends(get_current_user),
    orchestrator: UnifiedAIOrchestrator = Depends(get_orchestrator),
):
    """
    Create data-driven campaign strategy with tactical recommendations

    Features:
    - Incorporates past campaign learnings
    - Analyzes historical performance data
    - Provides type-safe strategy
    - Generates tactical recommendations
    - Remembers strategy for future reference
    """
    try:
        result = await orchestrator.strategic_campaign_planning(
            user_id=str(current_user.id),
            objective=request.objective,
            target_audience=request.target_audience,
            budget_range=request.budget_range,
        )
        return CampaignStrategyResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Campaign strategy creation failed: {str(e)}",
        )


@router.post("/conversation", response_model=ConversationResponse)
async def conversational_assistance(
    request: ConversationRequest,
    current_user: User = Depends(get_current_user),
    orchestrator: UnifiedAIOrchestrator = Depends(get_orchestrator),
):
    """
    Get conversational assistance with full context awareness

    Features:
    - Retrieves relevant memories
    - Searches knowledge base
    - Executes agent tools as needed
    - Remembers conversation
    """
    try:
        result = await orchestrator.conversational_assistance(
            user_id=str(current_user.id),
            message=request.message,
            conversation_context=request.context,
        )
        return ConversationResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Conversation failed: {str(e)}",
        )


@router.post("/lead/batch-analyze")
async def batch_analyze_leads(
    request: BatchLeadAnalysisRequest,
    current_user: User = Depends(get_current_user),
    orchestrator: UnifiedAIOrchestrator = Depends(get_orchestrator),
):
    """
    Analyze multiple leads in batch with intelligent prioritization

    Features:
    - Scores all leads
    - Prioritizes by score
    - Uses similarity for comparison
    - Returns sorted list
    """
    try:
        result = await orchestrator.batch_lead_analysis(
            user_id=str(current_user.id),
            leads=request.leads,
        )
        return {
            "success": True,
            "analyzed_count": len(result),
            "results": result,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Batch analysis failed: {str(e)}",
        )


# ============================================================================
# Memory Management Endpoints
# ============================================================================


@router.post("/memory/add")
async def add_memory(
    request: MemoryAddRequest,
    current_user: User = Depends(get_current_user),
    orchestrator: UnifiedAIOrchestrator = Depends(get_orchestrator),
):
    """Add a memory to the user's memory store"""
    try:
        metadata = request.metadata or {}
        metadata["category"] = request.category

        result = await orchestrator.memory.add_memory(
            messages=request.content,
            user_id=str(current_user.id),
            agent_id="ava",
            app_id="artisan",
            metadata=metadata,
        )
        return {"success": True, "result": result}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Memory add failed: {str(e)}",
        )


@router.post("/memory/search")
async def search_memory(
    request: MemorySearchRequest,
    current_user: User = Depends(get_current_user),
    orchestrator: UnifiedAIOrchestrator = Depends(get_orchestrator),
):
    """Search user's memories"""
    try:
        filters = {"category": request.category} if request.category else None

        results = await orchestrator.memory.search_memory(
            query=request.query,
            user_id=str(current_user.id),
            agent_id="ava",
            app_id="artisan",
            limit=request.limit,
            filters=filters,
        )
        return {"success": True, "count": len(results), "results": results}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Memory search failed: {str(e)}",
        )


@router.get("/memory/all")
async def get_all_memories(
    current_user: User = Depends(get_current_user),
    orchestrator: UnifiedAIOrchestrator = Depends(get_orchestrator),
):
    """Get all memories for the user"""
    try:
        results = await orchestrator.memory.get_all_memories(
            user_id=str(current_user.id),
            agent_id="ava",
            app_id="artisan",
        )
        return {"success": True, "count": len(results), "results": results}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Memory retrieval failed: {str(e)}",
        )


@router.delete("/memory/{memory_id}")
async def delete_memory(
    memory_id: str,
    current_user: User = Depends(get_current_user),
    orchestrator: UnifiedAIOrchestrator = Depends(get_orchestrator),
):
    """Delete a specific memory"""
    try:
        result = await orchestrator.memory.delete_memory(memory_id=memory_id)
        return {"success": True, "result": result}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Memory deletion failed: {str(e)}",
        )


# ============================================================================
# RAG Endpoints
# ============================================================================


@router.post("/rag/ingest")
async def ingest_documents(
    request: RAGIngestRequest,
    current_user: User = Depends(get_current_user),
    orchestrator: UnifiedAIOrchestrator = Depends(get_orchestrator),
):
    """Ingest documents into RAG system"""
    try:
        # Create user-specific index name
        index_name = f"{request.index_name}_{current_user.id}"

        result = await orchestrator.rag.ingest_structured_data(
            data=request.documents,
            text_field="content",
            index_name=index_name,
        )
        return {
            "success": True,
            "index_name": index_name,
            "document_count": len(request.documents),
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Document ingestion failed: {str(e)}",
        )


@router.post("/rag/query")
async def query_documents(
    request: RAGQueryRequest,
    current_user: User = Depends(get_current_user),
    orchestrator: UnifiedAIOrchestrator = Depends(get_orchestrator),
):
    """Query RAG system for relevant documents"""
    try:
        # Use user-specific index
        index_name = f"{request.index_name}_{current_user.id}"

        result = await orchestrator.rag.query(
            query=request.query,
            index_name=index_name,
            similarity_top_k=request.top_k,
        )
        return {"success": True, "result": result}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"RAG query failed: {str(e)}",
        )


@router.post("/rag/chat")
async def chat_with_documents(
    request: RAGQueryRequest,
    current_user: User = Depends(get_current_user),
    orchestrator: UnifiedAIOrchestrator = Depends(get_orchestrator),
):
    """Chat with documents using RAG"""
    try:
        # Use user-specific index
        index_name = f"{request.index_name}_{current_user.id}"

        result = await orchestrator.rag.chat(
            message=request.query,
            index_name=index_name,
            session_id=str(current_user.id),
        )
        return {"success": True, "result": result}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"RAG chat failed: {str(e)}",
        )


# ============================================================================
# System Status
# ============================================================================


@router.get("/status")
async def get_system_status(
    current_user: User = Depends(get_current_user),
    orchestrator: UnifiedAIOrchestrator = Depends(get_orchestrator),
):
    """Get status of all AI systems"""
    try:
        status = await orchestrator.get_system_status()
        return {"success": True, "status": status}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Status check failed: {str(e)}",
        )
