"""
Enterprise AI Advanced Routes Extension

New endpoints for:
- Model policy management
- Memory governance
- Knowledge graph
- Voice intelligence
- Usage metering
"""

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status, Query
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Literal
from sqlmodel import Session
from datetime import datetime
from ...core.db import get_session
from ...core.ai_orchestrator import model_policy_manager
from ...core.security import get_current_user
from ...models.user import User
from ...models.ai_enterprise import (
    ModelPolicy,
    ModelRule,
    MemoryPolicy,
    MemoryAuditLog,
    TenantUsageQuota,
    VoiceSession,
)
from ...services.memory_governance import MemoryGovernanceService
from ...services.voice_intelligence import VoiceIntelligenceService
from ...services.usage_metering import UsageAnalyticsService
from ...integrations.llamaindex_rag import LlamaIndexRAG
import uuid

router = APIRouter(prefix="/ai-advanced", tags=["AI Advanced Enterprise"])


# ============================================================================
# Model Policy Endpoints
# ============================================================================

class ModelPolicySetRequest(BaseModel):
    """Request to set model policy"""
    workspace_id: str
    rules: List[Dict[str, Any]]
    fallback_strategy: Literal["latency", "cost", "quality"] = "latency"
    auto_fallback_enabled: bool = True


class ModelPolicyResponse(BaseModel):
    """Model policy response"""
    id: int
    workspace_id: str
    tenant_id: str
    rules: List[Dict[str, Any]]
    fallback_strategy: str
    auto_fallback_enabled: bool
    created_at: datetime
    updated_at: datetime


@router.post("/model-policy/set")
async def set_model_policy(
    request: ModelPolicySetRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """
    Set model orchestration policy for workspace
    
    Configure which models to use for different segments (executives, bulk, etc.)
    with fallback strategies and latency budgets.
    """
    from sqlmodel import select
    
    tenant_id = getattr(current_user, "tenant_id", "default")
    
    # Check if policy exists
    statement = select(ModelPolicy).where(
        ModelPolicy.workspace_id == request.workspace_id,
        ModelPolicy.tenant_id == tenant_id,
    )
    policy = db.exec(statement).first()
    
    if policy:
        # Update existing
        policy.set_rules(request.rules)
        policy.fallback_strategy = request.fallback_strategy
        policy.auto_fallback_enabled = request.auto_fallback_enabled
        policy.updated_at = datetime.utcnow()
    else:
        # Create new
        policy = ModelPolicy(
            workspace_id=request.workspace_id,
            tenant_id=tenant_id,
            fallback_strategy=request.fallback_strategy,
            auto_fallback_enabled=request.auto_fallback_enabled,
        )
        policy.set_rules(request.rules)
        db.add(policy)
    
    db.commit()
    db.refresh(policy)
    
    return ModelPolicyResponse(
        id=policy.id,
        workspace_id=policy.workspace_id,
        tenant_id=policy.tenant_id,
        rules=policy.get_rules(),
        fallback_strategy=policy.fallback_strategy,
        auto_fallback_enabled=policy.auto_fallback_enabled,
        created_at=policy.created_at,
        updated_at=policy.updated_at,
    )


@router.get("/model-policy")
async def get_model_policy(
    workspace_id: str = Query(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """Get model policy for workspace"""
    from sqlmodel import select
    
    tenant_id = getattr(current_user, "tenant_id", "default")
    
    statement = select(ModelPolicy).where(
        ModelPolicy.workspace_id == workspace_id,
        ModelPolicy.tenant_id == tenant_id,
    )
    policy = db.exec(statement).first()
    
    if not policy:
        raise HTTPException(
            status_code=404,
            detail="Model policy not found for workspace",
        )
    
    return ModelPolicyResponse(
        id=policy.id,
        workspace_id=policy.workspace_id,
        tenant_id=policy.tenant_id,
        rules=policy.get_rules(),
        fallback_strategy=policy.fallback_strategy,
        auto_fallback_enabled=policy.auto_fallback_enabled,
        created_at=policy.created_at,
        updated_at=policy.updated_at,
    )


# ============================================================================
# Memory Governance Endpoints
# ============================================================================

class MemoryPolicySetRequest(BaseModel):
    """Request to set memory policy"""
    ttl_days: Optional[int] = None
    pii_scrub_enabled: bool = True
    auto_purge_enabled: bool = True
    compliance_mode: Literal["standard", "strict", "custom"] = "standard"


class MemoryPurgeRequest(BaseModel):
    """Request to purge memories"""
    reason: str
    category: Optional[str] = None
    before_date: Optional[datetime] = None


@router.post("/memory/policy")
async def set_memory_policy(
    request: MemoryPolicySetRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """
    Set memory governance policy
    
    Configure TTL, PII scrubbing, and compliance settings.
    """
    tenant_id = getattr(current_user, "tenant_id", "default")
    
    governance = MemoryGovernanceService(db)
    policy = await governance.update_policy(
        tenant_id=tenant_id,
        ttl_days=request.ttl_days,
        pii_scrub_enabled=request.pii_scrub_enabled,
        auto_purge_enabled=request.auto_purge_enabled,
        compliance_mode=request.compliance_mode,
    )
    
    return {
        "tenant_id": policy.tenant_id,
        "ttl_days": policy.ttl_days,
        "pii_scrub_enabled": policy.pii_scrub_enabled,
        "auto_purge_enabled": policy.auto_purge_enabled,
        "compliance_mode": policy.compliance_mode,
        "updated_at": policy.updated_at.isoformat(),
    }


@router.delete("/memory/purge")
async def purge_memories(
    request: MemoryPurgeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """
    Purge memories for compliance (GDPR, Right to be Forgotten)
    
    All purges are logged in audit trail.
    """
    tenant_id = getattr(current_user, "tenant_id", "default")
    user_id = str(current_user.id)
    
    governance = MemoryGovernanceService(db)
    result = await governance.purge_memories(
        tenant_id=tenant_id,
        user_id=user_id,
        reason=request.reason,
        category=request.category,
        before_date=request.before_date,
    )
    
    return result


@router.get("/memory/audit-logs")
async def get_memory_audit_logs(
    operation: Optional[str] = None,
    limit: int = Query(default=100, le=500),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """Get memory operation audit logs"""
    tenant_id = getattr(current_user, "tenant_id", "default")
    
    governance = MemoryGovernanceService(db)
    logs = await governance.get_audit_logs(
        tenant_id=tenant_id,
        user_id=None,
        operation=operation,
        limit=limit,
    )
    
    return {
        "logs": [
            {
                "id": log.id,
                "user_id": log.user_id,
                "operation": log.operation,
                "memory_id": log.memory_id,
                "category": log.category,
                "reason": log.reason,
                "timestamp": log.timestamp.isoformat(),
            }
            for log in logs
        ]
    }


# ============================================================================
# Knowledge Graph Endpoints
# ============================================================================

class GraphIngestRequest(BaseModel):
    """Request to ingest into knowledge graph"""
    documents: List[Dict[str, Any]]
    extract_entities: bool = True


class GraphQueryRequest(BaseModel):
    """Request to query knowledge graph"""
    query: str
    entity_types: Optional[List[str]] = None
    relation_types: Optional[List[str]] = None
    max_hops: int = Field(default=2, ge=1, le=5)


@router.post("/rag/graph/ingest")
async def ingest_knowledge_graph(
    request: GraphIngestRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """
    Ingest documents into knowledge graph
    
    Extracts entities and relationships automatically.
    """
    tenant_id = getattr(current_user, "tenant_id", "default")
    
    rag = LlamaIndexRAG()
    result = await rag.ingest_graph_documents(
        documents=request.documents,
        tenant_id=tenant_id,
        extract_entities=request.extract_entities,
    )
    
    return result


@router.post("/rag/graph/query")
async def query_knowledge_graph(
    request: GraphQueryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """
    Query knowledge graph with natural language
    
    Example: "Show customers who asked X after feature Y release"
    """
    tenant_id = getattr(current_user, "tenant_id", "default")
    
    rag = LlamaIndexRAG()
    result = await rag.query_knowledge_graph(
        query=request.query,
        tenant_id=tenant_id,
        entity_types=request.entity_types,
        relation_types=request.relation_types,
        max_hops=request.max_hops,
    )
    
    return result


# ============================================================================
# Voice Intelligence Endpoints
# ============================================================================

@router.websocket("/voice/stream")
async def voice_stream_websocket(
    websocket: WebSocket,
    session_id: str = Query(...),
    tenant_id: str = Query(...),
    user_id: str = Query(...),
    db: Session = Depends(get_session),
):
    """
    WebSocket endpoint for real-time voice streaming
    
    Protocol:
    - Client sends audio chunks as base64
    - Server returns partial transcripts
    - Server provides real-time suggestions
    - Client ends session to get summary
    """
    service = VoiceIntelligenceService(db)
    await service.handle_websocket_connection(
        websocket=websocket,
        session_id=session_id,
        tenant_id=tenant_id,
        user_id=user_id,
    )


@router.get("/voice/summary")
async def get_voice_summary(
    session_id: str = Query(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """Get summary for completed voice session"""
    service = VoiceIntelligenceService(db)
    summary = await service.get_session_summary(session_id)
    
    if not summary:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return summary


@router.get("/voice/actions")
async def get_voice_actions(
    session_id: str = Query(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """Get action items from voice session"""
    service = VoiceIntelligenceService(db)
    actions = await service.get_session_actions(session_id)
    
    return {"session_id": session_id, "actions": actions}


# ============================================================================
# Usage Metering Endpoints
# ============================================================================

@router.get("/usage/summary")
async def get_usage_summary(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """
    Get usage summary for tenant
    
    Includes tokens, costs, requests, and quota status.
    """
    tenant_id = getattr(current_user, "tenant_id", "default")
    
    analytics = UsageAnalyticsService(db)
    summary = await analytics.get_tenant_usage(
        tenant_id=tenant_id,
        start_date=start_date,
        end_date=end_date,
    )
    
    return summary


@router.get("/usage/breakdown")
async def get_usage_breakdown(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """Get usage breakdown by model"""
    tenant_id = getattr(current_user, "tenant_id", "default")
    
    analytics = UsageAnalyticsService(db)
    breakdown = await analytics.get_model_usage_breakdown(tenant_id)
    
    return {"models": breakdown}


@router.get("/usage/quota")
async def get_usage_quota(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """Get current usage quota status"""
    from sqlmodel import select
    
    tenant_id = getattr(current_user, "tenant_id", "default")
    
    statement = select(TenantUsageQuota).where(
        TenantUsageQuota.tenant_id == tenant_id
    )
    quota = db.exec(statement).first()
    
    if not quota:
        return {
            "tenant_id": tenant_id,
            "quota_configured": False,
            "unlimited": True,
        }
    
    return {
        "tenant_id": tenant_id,
        "quota_configured": True,
        "monthly_token_limit": quota.monthly_token_limit,
        "monthly_cost_limit_usd": quota.monthly_cost_limit_usd,
        "current_tokens_used": quota.current_tokens_used,
        "current_cost_usd": quota.current_cost_usd,
        "tokens_remaining": (
            quota.monthly_token_limit - quota.current_tokens_used
            if quota.monthly_token_limit
            else None
        ),
        "cost_remaining_usd": (
            quota.monthly_cost_limit_usd - quota.current_cost_usd
            if quota.monthly_cost_limit_usd
            else None
        ),
        "usage_percentage": (
            (quota.current_tokens_used / quota.monthly_token_limit * 100)
            if quota.monthly_token_limit
            else 0
        ),
        "hard_cap_enabled": quota.hard_cap_enabled,
        "soft_cap_enabled": quota.soft_cap_enabled,
    }
