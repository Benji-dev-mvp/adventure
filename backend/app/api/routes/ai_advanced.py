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

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from sqlmodel import Session
from ...core.db import get_session
from ...core.ai_orchestrator import UnifiedAIOrchestrator
from ...core.security import get_current_user
from ...core.error_handling import handle_api_errors, handle_not_found
from ...models.user import User
import os


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
@handle_api_errors(error_prefix="Lead scoring failed")
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
    result = await orchestrator.intelligent_lead_scoring(
        user_id=str(current_user.id),
        lead_data=request.lead_data,
    )
    return LeadScoreResponse(**result)


@router.post("/email/generate", response_model=EmailGenerationResponse)
@handle_api_errors(error_prefix="Email generation failed")
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
    result = await orchestrator.personalized_email_generation(
        user_id=str(current_user.id),
        lead_data=request.lead_data,
        campaign_objective=request.campaign_objective,
        tone=request.tone,
    )
    return EmailGenerationResponse(**result)


@router.post("/campaign/strategy", response_model=CampaignStrategyResponse)
@handle_api_errors(error_prefix="Campaign strategy creation failed")
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
    result = await orchestrator.strategic_campaign_planning(
        user_id=str(current_user.id),
        objective=request.objective,
        target_audience=request.target_audience,
        budget_range=request.budget_range,
    )
    return CampaignStrategyResponse(**result)


@router.post("/conversation", response_model=ConversationResponse)
@handle_api_errors(error_prefix="Conversation failed")
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
    result = await orchestrator.conversational_assistance(
        user_id=str(current_user.id),
        message=request.message,
        conversation_context=request.context,
    )
    return ConversationResponse(**result)


@router.post("/lead/batch-analyze")
@handle_api_errors(error_prefix="Batch analysis failed")
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
    result = await orchestrator.batch_lead_analysis(
        user_id=str(current_user.id),
        leads=request.leads,
    )
    return {
        "success": True,
        "analyzed_count": len(result),
        "results": result,
    }


# ============================================================================
# Memory Management Endpoints
# ============================================================================

@router.post("/memory/add")
@handle_api_errors(error_prefix="Memory add failed")
async def add_memory(
    request: MemoryAddRequest,
    current_user: User = Depends(get_current_user),
    orchestrator: UnifiedAIOrchestrator = Depends(get_orchestrator),
):
    """Add a memory to the user's memory store"""
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


@router.post("/memory/search")
@handle_api_errors(error_prefix="Memory search failed")
async def search_memory(
    request: MemorySearchRequest,
    current_user: User = Depends(get_current_user),
    orchestrator: UnifiedAIOrchestrator = Depends(get_orchestrator),
):
    """Search user's memories"""
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


@router.get("/memory/all")
@handle_api_errors(error_prefix="Memory retrieval failed")
async def get_all_memories(
    current_user: User = Depends(get_current_user),
    orchestrator: UnifiedAIOrchestrator = Depends(get_orchestrator),
):
    """Get all memories for the user"""
    results = await orchestrator.memory.get_all_memories(
        user_id=str(current_user.id),
        agent_id="ava",
        app_id="artisan",
    )
    return {"success": True, "count": len(results), "results": results}


@router.delete("/memory/{memory_id}")
@handle_api_errors(error_prefix="Memory deletion failed")
async def delete_memory(
    memory_id: str,
    current_user: User = Depends(get_current_user),
    orchestrator: UnifiedAIOrchestrator = Depends(get_orchestrator),
):
    """Delete a specific memory"""
    result = await orchestrator.memory.delete_memory(memory_id=memory_id)
    return {"success": True, "result": result}


# ============================================================================
# RAG Endpoints
# ============================================================================

@router.post("/rag/ingest")
@handle_api_errors(error_prefix="Document ingestion failed")
async def ingest_documents(
    request: RAGIngestRequest,
    current_user: User = Depends(get_current_user),
    orchestrator: UnifiedAIOrchestrator = Depends(get_orchestrator),
):
    """Ingest documents into RAG system"""
    # Create user-specific index name
    index_name = f"{request.index_name}_{current_user.id}"
    
    result = await orchestrator.rag.ingest_structured_data(
        data=request.documents,
        text_field="content",
        index_name=index_name,
    )
    return {"success": True, "index_name": index_name, "document_count": len(request.documents)}


@router.post("/rag/query")
@handle_api_errors(error_prefix="RAG query failed")
async def query_documents(
    request: RAGQueryRequest,
    current_user: User = Depends(get_current_user),
    orchestrator: UnifiedAIOrchestrator = Depends(get_orchestrator),
):
    """Query RAG system for relevant documents"""
    # Use user-specific index
    index_name = f"{request.index_name}_{current_user.id}"
    
    result = await orchestrator.rag.query(
        query=request.query,
        index_name=index_name,
        similarity_top_k=request.top_k,
    )
    return {"success": True, "result": result}


@router.post("/rag/chat")
@handle_api_errors(error_prefix="RAG chat failed")
async def chat_with_documents(
    request: RAGQueryRequest,
    current_user: User = Depends(get_current_user),
    orchestrator: UnifiedAIOrchestrator = Depends(get_orchestrator),
):
    """Chat with documents using RAG"""
    # Use user-specific index
    index_name = f"{request.index_name}_{current_user.id}"
    
    result = await orchestrator.rag.chat(
        message=request.query,
        index_name=index_name,
        session_id=str(current_user.id),
    )
    return {"success": True, "result": result}


# ============================================================================
# System Status
# ============================================================================

@router.get("/status")
@handle_api_errors(error_prefix="Status check failed")
async def get_system_status(
    current_user: User = Depends(get_current_user),
    orchestrator: UnifiedAIOrchestrator = Depends(get_orchestrator),
):
    """Get status of all AI systems"""
    status = await orchestrator.get_system_status()
    return {"success": True, "status": status}
