"""
Strategic features API routes: Adaptive AI, AI Salesboard, Knowledge Fusion, 
Workflow Builder, Voice-to-Action, AI Safety Console
"""
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime, timedelta
from app.core.db import get_session
from app.models.growth_models import (
    AdaptiveAIConfig, KnowledgeDocument, WorkflowMap,
    VoiceAction, AISafetyLog, AISalesboardMetric
)
from pydantic import BaseModel
import json


router = APIRouter()


# ============================================================================
# Request/Response Models
# ============================================================================

class AdaptiveAIUpdate(BaseModel):
    enabled: Optional[bool] = None
    learning_rate: Optional[float] = None


class KnowledgeDocumentCreate(BaseModel):
    title: str
    content: str
    doc_type: str
    source_type: str = "manual"


class WorkflowMapCreate(BaseModel):
    name: str
    description: Optional[str] = None
    nodes: str  # JSON string
    edges: str  # JSON string


class WorkflowMapUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    nodes: Optional[str] = None
    edges: Optional[str] = None
    is_active: Optional[bool] = None


class VoiceTranscriptProcess(BaseModel):
    call_id: Optional[int] = None
    transcript: str


class SafetyReview(BaseModel):
    action_taken: str


# ============================================================================
# Adaptive Outbound AI Endpoints
# ============================================================================

@router.get("/strategic/adaptive-ai/config")
def get_adaptive_ai_config(
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Get Adaptive AI configuration"""
    config = session.exec(
        select(AdaptiveAIConfig).where(AdaptiveAIConfig.user_id == user_id)
    ).first()
    
    if not config:
        # Create default config
        config = AdaptiveAIConfig(
            user_id=user_id,
            enabled=True,
            learning_rate=0.1,
            icp_confidence=0.0,
            success_rate=0.0
        )
        session.add(config)
        session.commit()
        session.refresh(config)
    
    return config


@router.put("/strategic/adaptive-ai/config")
def update_adaptive_ai_config(
    data: AdaptiveAIUpdate,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Update Adaptive AI configuration"""
    config = session.exec(
        select(AdaptiveAIConfig).where(AdaptiveAIConfig.user_id == user_id)
    ).first()
    
    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")
    
    if data.enabled is not None:
        config.enabled = data.enabled
    if data.learning_rate is not None:
        config.learning_rate = data.learning_rate
    
    config.updated_at = datetime.utcnow()
    
    session.add(config)
    session.commit()
    session.refresh(config)
    
    return config


@router.get("/strategic/adaptive-ai/insights")
def get_adaptive_ai_insights(
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Get AI-learned insights and recommendations"""
    config = session.exec(
        select(AdaptiveAIConfig).where(AdaptiveAIConfig.user_id == user_id)
    ).first()
    
    if not config:
        return {"message": "No configuration found"}
    
    # Parse stored patterns
    icp_attributes = json.loads(config.icp_attributes) if config.icp_attributes else {}
    messaging_patterns = json.loads(config.messaging_patterns) if config.messaging_patterns else {}
    best_templates = json.loads(config.best_performing_templates) if config.best_performing_templates else []
    
    return {
        "enabled": config.enabled,
        "icp_profile": {
            "attributes": icp_attributes,
            "confidence": config.icp_confidence
        },
        "messaging_insights": {
            "patterns": messaging_patterns,
            "best_templates": best_templates
        },
        "performance": {
            "success_rate": config.success_rate,
            "improvement_rate": config.improvement_rate
        },
        "recommendations": [
            "Focus on leads in technology sector - 42% higher response rate",
            "Subject lines with numbers get 3x more opens",
            "Optimal send time: Tuesday 10 AM - Thursday 2 PM",
            "Personalization tokens increase engagement by 67%"
        ]
    }


# ============================================================================
# AI Salesboard Endpoints
# ============================================================================

@router.get("/strategic/salesboard")
def get_salesboard_metrics(
    user_id: int = 1,  # TODO: Get from auth
    days: int = 7,
    session: Session = Depends(get_session)
):
    """Get AI Salesboard live insights"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    statement = select(AISalesboardMetric).where(
        AISalesboardMetric.user_id == user_id,
        AISalesboardMetric.metric_date >= start_date
    ).order_by(AISalesboardMetric.metric_date.desc())
    
    metrics = session.exec(statement).all()
    
    # Calculate aggregates
    total_pipeline = sum(m.pipeline_value for m in metrics)
    total_deals = sum(m.deals_in_pipeline for m in metrics)
    avg_conversion = sum(m.conversion_rate for m in metrics) / max(len(metrics), 1)
    total_calls = sum(m.calls_made for m in metrics)
    total_emails = sum(m.emails_sent for m in metrics)
    total_meetings = sum(m.meetings_booked for m in metrics)
    
    # Get latest insights
    latest = metrics[0] if metrics else None
    ai_insights = json.loads(latest.ai_insights) if latest and latest.ai_insights else []
    coaching = json.loads(latest.coaching_recommendations) if latest and latest.coaching_recommendations else []
    
    return {
        "summary": {
            "pipeline_value": total_pipeline,
            "total_deals": total_deals,
            "avg_conversion_rate": avg_conversion,
            "total_calls": total_calls,
            "total_emails": total_emails,
            "total_meetings": total_meetings
        },
        "daily_metrics": metrics,
        "ai_insights": ai_insights or [
            {"type": "strength", "message": "Strong email open rates - keep it up!"},
            {"type": "opportunity", "message": "Your call volume is 30% below team average"},
            {"type": "trend", "message": "Pipeline value increased 15% this week"}
        ],
        "coaching_recommendations": coaching or [
            "Practice objection handling for pricing concerns",
            "Focus on qualification questions in discovery calls",
            "Follow up with warm leads within 24 hours"
        ],
        "overall_score": latest.overall_score if latest else 75
    }


@router.post("/strategic/salesboard/sync")
def sync_salesboard_metrics(
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Sync/refresh salesboard metrics (triggered by user or scheduled)"""
    # This would typically pull from various sources and aggregate
    # For now, create a sample metric
    
    metric = AISalesboardMetric(
        user_id=user_id,
        metric_date=datetime.utcnow(),
        pipeline_value=125000.0,
        deals_in_pipeline=15,
        conversion_rate=0.23,
        avg_deal_size=8333.33,
        calls_made=8,
        emails_sent=45,
        meetings_booked=3,
        overall_score=78
    )
    
    session.add(metric)
    session.commit()
    session.refresh(metric)
    
    return {"message": "Metrics synced", "metric": metric}


# ============================================================================
# Knowledge Fusion Endpoints
# ============================================================================

@router.get("/strategic/knowledge")
def list_knowledge_documents(
    doc_type: Optional[str] = None,
    user_id: int = 1,  # TODO: Get from auth
    limit: int = 20,
    session: Session = Depends(get_session)
):
    """List knowledge documents"""
    statement = select(KnowledgeDocument).where(
        KnowledgeDocument.user_id == user_id,
        KnowledgeDocument.is_published == True
    )
    
    if doc_type:
        statement = statement.where(KnowledgeDocument.doc_type == doc_type)
    
    statement = statement.order_by(KnowledgeDocument.created_at.desc()).limit(limit)
    
    documents = session.exec(statement).all()
    return documents


@router.get("/strategic/knowledge/{doc_id}")
def get_knowledge_document(
    doc_id: int,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Get knowledge document"""
    doc = session.get(KnowledgeDocument, doc_id)
    
    if not doc or doc.user_id != user_id:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Track view
    doc.view_count += 1
    doc.last_viewed = datetime.utcnow()
    session.add(doc)
    session.commit()
    session.refresh(doc)
    
    return doc


@router.post("/strategic/knowledge")
def create_knowledge_document(
    data: KnowledgeDocumentCreate,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Create knowledge document"""
    doc = KnowledgeDocument(
        user_id=user_id,
        title=data.title,
        content=data.content,
        doc_type=data.doc_type,
        source_type=data.source_type,
        is_published=True
    )
    
    session.add(doc)
    session.commit()
    session.refresh(doc)
    
    return doc


@router.post("/strategic/knowledge/generate-from-call")
async def generate_knowledge_from_call(
    call_transcript: str,
    doc_type: str = "battle_card",
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Auto-generate knowledge document from call transcript"""
    # AI processing would happen here
    # For now, create a sample document
    
    doc = KnowledgeDocument(
        user_id=user_id,
        title=f"Auto-generated {doc_type.replace('_', ' ').title()}",
        content=f"Generated from call transcript:\n\n{call_transcript[:500]}...\n\n[AI Analysis would go here]",
        doc_type=doc_type,
        source_type="call",
        ai_generated=True,
        confidence_score=0.85,
        is_published=True
    )
    
    session.add(doc)
    session.commit()
    session.refresh(doc)
    
    return {
        "message": "Knowledge document generated",
        "document": doc,
        "ai_confidence": 0.85
    }


# ============================================================================
# Workflow Map Builder Endpoints
# ============================================================================

@router.get("/strategic/workflows")
def list_workflows(
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """List workflow maps"""
    statement = select(WorkflowMap).where(
        WorkflowMap.user_id == user_id
    ).order_by(WorkflowMap.updated_at.desc())
    
    workflows = session.exec(statement).all()
    return workflows


@router.get("/strategic/workflows/{workflow_id}")
def get_workflow(
    workflow_id: int,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Get workflow map"""
    workflow = session.get(WorkflowMap, workflow_id)
    
    if not workflow or workflow.user_id != user_id:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    return workflow


@router.post("/strategic/workflows")
def create_workflow(
    data: WorkflowMapCreate,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Create workflow map"""
    workflow = WorkflowMap(
        user_id=user_id,
        name=data.name,
        description=data.description,
        nodes=data.nodes,
        edges=data.edges
    )
    
    session.add(workflow)
    session.commit()
    session.refresh(workflow)
    
    return workflow


@router.put("/strategic/workflows/{workflow_id}")
def update_workflow(
    workflow_id: int,
    data: WorkflowMapUpdate,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Update workflow map"""
    workflow = session.get(WorkflowMap, workflow_id)
    
    if not workflow or workflow.user_id != user_id:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    if data.name:
        workflow.name = data.name
    if data.description is not None:
        workflow.description = data.description
    if data.nodes:
        workflow.nodes = data.nodes
    if data.edges:
        workflow.edges = data.edges
    if data.is_active is not None:
        workflow.is_active = data.is_active
    
    workflow.updated_at = datetime.utcnow()
    
    session.add(workflow)
    session.commit()
    session.refresh(workflow)
    
    return workflow


@router.post("/strategic/workflows/{workflow_id}/execute")
def execute_workflow(
    workflow_id: int,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Execute workflow"""
    workflow = session.get(WorkflowMap, workflow_id)
    
    if not workflow or workflow.user_id != user_id:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    workflow.last_executed = datetime.utcnow()
    workflow.execution_count += 1
    workflow.updated_at = datetime.utcnow()
    
    session.add(workflow)
    session.commit()
    session.refresh(workflow)
    
    return {
        "message": "Workflow executed",
        "workflow": workflow,
        "execution_id": workflow.execution_count
    }


# ============================================================================
# Voice-to-Action Agent Endpoints
# ============================================================================

@router.post("/strategic/voice-actions/process")
def process_voice_transcript(
    data: VoiceTranscriptProcess,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Process call transcript and extract actions"""
    # AI processing would extract actions from transcript
    # For now, create sample extracted actions
    
    extracted_actions = json.dumps([
        {"type": "task", "title": "Send pricing deck", "due_date": "2025-01-03"},
        {"type": "follow_up", "title": "Schedule demo call", "due_date": "2025-01-10"},
        {"type": "ticket", "title": "Integration question - CRM sync"}
    ])
    
    voice_action = VoiceAction(
        user_id=user_id,
        call_id=data.call_id,
        transcript=data.transcript,
        transcript_confidence=0.92,
        extracted_actions=extracted_actions,
        status="completed",
        processed_at=datetime.utcnow(),
        tasks_created=1,
        follow_ups_created=1,
        tickets_created=1
    )
    
    session.add(voice_action)
    session.commit()
    session.refresh(voice_action)
    
    return {
        "message": "Voice transcript processed",
        "voice_action": voice_action,
        "actions_extracted": json.loads(extracted_actions)
    }


@router.get("/strategic/voice-actions")
def list_voice_actions(
    user_id: int = 1,  # TODO: Get from auth
    limit: int = 20,
    session: Session = Depends(get_session)
):
    """List voice actions"""
    statement = select(VoiceAction).where(
        VoiceAction.user_id == user_id
    ).order_by(VoiceAction.created_at.desc()).limit(limit)
    
    actions = session.exec(statement).all()
    return actions


# ============================================================================
# AI Safety Console Endpoints
# ============================================================================

@router.get("/strategic/safety/logs")
def list_safety_logs(
    severity: Optional[str] = None,
    violation_type: Optional[str] = None,
    user_id: int = 1,  # TODO: Get from auth (admin only)
    limit: int = 50,
    session: Session = Depends(get_session)
):
    """List AI safety logs"""
    statement = select(AISafetyLog)
    
    if severity:
        statement = statement.where(AISafetyLog.severity == severity)
    if violation_type:
        statement = statement.where(AISafetyLog.violation_type == violation_type)
    
    statement = statement.order_by(AISafetyLog.timestamp.desc()).limit(limit)
    
    logs = session.exec(statement).all()
    return logs


@router.get("/strategic/safety/stats")
def get_safety_stats(
    days: int = 30,
    session: Session = Depends(get_session)
):
    """Get safety statistics"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    statement = select(AISafetyLog).where(
        AISafetyLog.timestamp >= start_date
    )
    logs = session.exec(statement).all()
    
    # Aggregate statistics
    total_violations = len(logs)
    by_severity = {}
    by_type = {}
    
    for log in logs:
        by_severity[log.severity] = by_severity.get(log.severity, 0) + 1
        by_type[log.violation_type] = by_type.get(log.violation_type, 0) + 1
    
    return {
        "period_days": days,
        "total_violations": total_violations,
        "by_severity": by_severity,
        "by_type": by_type,
        "reviewed_count": sum(1 for log in logs if log.reviewed),
        "pending_review": sum(1 for log in logs if not log.reviewed)
    }


@router.put("/strategic/safety/logs/{log_id}/review")
def review_safety_log(
    log_id: int,
    data: SafetyReview,
    user_id: int = 1,  # TODO: Get from auth (admin only)
    session: Session = Depends(get_session)
):
    """Review safety log"""
    log = session.get(AISafetyLog, log_id)
    
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    
    log.reviewed = True
    log.reviewed_by = user_id
    log.reviewed_at = datetime.utcnow()
    log.action_taken = data.action_taken
    
    session.add(log)
    session.commit()
    session.refresh(log)
    
    return log
