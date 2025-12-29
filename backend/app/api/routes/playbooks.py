"""
Playbooks API Routes

CRUD operations for AI Playbooks:
- Create, read, update, delete playbooks
- Run and schedule playbook executions
- Get playbook runs and metrics
"""

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
import json

from ...core.db import get_session
from ...core.security import get_current_user
from ...models.user import User
from ...models.playbook import (
    Playbook, PlaybookRun,
    PlaybookCreate, PlaybookUpdate, PlaybookResponse, PlaybookRunResponse,
    PlaybookStatus, PlaybookRunStatus
)


router = APIRouter(prefix="/playbooks", tags=["Playbooks"])


# ============================================================================
# Helper Functions
# ============================================================================

def get_tenant_id(user: User) -> str:
    """Get tenant ID from user (use org_id or user_id as fallback)"""
    return getattr(user, 'org_id', None) or str(user.id) or "default"


def playbook_to_response(playbook: Playbook) -> dict:
    """Convert Playbook model to response dict with parsed JSON fields"""
    return {
        "id": playbook.id,
        "tenant_id": playbook.tenant_id,
        "name": playbook.name,
        "description": playbook.description,
        "segment": playbook.segment,
        "icp_filters": playbook.get_icp_filters() if playbook.icp_filters else None,
        "channel_mix": playbook.get_channel_mix() if playbook.channel_mix else None,
        "goal": playbook.goal,
        "target_metric": playbook.target_metric,
        "ai_config": playbook.get_ai_config() if playbook.ai_config else None,
        "status": playbook.status,
        "schedule_frequency": playbook.schedule_frequency,
        "scheduled_time": playbook.scheduled_time,
        "scheduled_days": json.loads(playbook.scheduled_days) if playbook.scheduled_days else None,
        "next_run_at": playbook.next_run_at,
        "total_runs": playbook.total_runs,
        "total_leads_targeted": playbook.total_leads_targeted,
        "total_emails_sent": playbook.total_emails_sent,
        "total_responses": playbook.total_responses,
        "total_meetings": playbook.total_meetings,
        "created_at": playbook.created_at,
        "updated_at": playbook.updated_at,
    }


def run_to_response(run: PlaybookRun) -> dict:
    """Convert PlaybookRun model to response dict"""
    return {
        "id": run.id,
        "playbook_id": run.playbook_id,
        "status": run.status,
        "started_at": run.started_at,
        "completed_at": run.completed_at,
        "leads_matched": run.leads_matched,
        "leads_targeted": run.leads_targeted,
        "emails_generated": run.emails_generated,
        "emails_sent": run.emails_sent,
        "linkedin_messages": run.linkedin_messages,
        "calls_scheduled": run.calls_scheduled,
        "responses": run.responses,
        "meetings_booked": run.meetings_booked,
        "error_message": run.error_message,
        "duration_seconds": run.get_duration_seconds(),
        "created_at": run.created_at,
    }


# ============================================================================
# CRUD Endpoints
# ============================================================================

@router.get("", response_model=List[dict])
async def list_playbooks(
    status: Optional[PlaybookStatus] = None,
    segment: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """List all playbooks for the current tenant"""
    tenant_id = get_tenant_id(current_user)
    
    query = select(Playbook).where(Playbook.tenant_id == tenant_id)
    
    if status:
        query = query.where(Playbook.status == status)
    if segment:
        query = query.where(Playbook.segment == segment)
    
    query = query.order_by(Playbook.updated_at.desc()).offset(offset).limit(limit)
    
    playbooks = session.exec(query).all()
    return [playbook_to_response(p) for p in playbooks]


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_playbook(
    payload: PlaybookCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Create a new playbook"""
    tenant_id = get_tenant_id(current_user)
    
    playbook = Playbook(
        tenant_id=tenant_id,
        name=payload.name,
        description=payload.description,
        segment=payload.segment,
        icp_filters=json.dumps(payload.icp_filters) if payload.icp_filters else None,
        channel_mix=json.dumps(payload.channel_mix) if payload.channel_mix else None,
        goal=payload.goal,
        target_metric=payload.target_metric,
        ai_config=json.dumps(payload.ai_config) if payload.ai_config else None,
        schedule_frequency=payload.schedule_frequency,
        scheduled_time=payload.scheduled_time,
        scheduled_days=json.dumps(payload.scheduled_days) if payload.scheduled_days else None,
        created_by=str(current_user.id) if current_user.id else None,
    )
    
    session.add(playbook)
    session.commit()
    session.refresh(playbook)
    
    return playbook_to_response(playbook)


@router.get("/{playbook_id}", response_model=dict)
async def get_playbook(
    playbook_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Get a specific playbook"""
    tenant_id = get_tenant_id(current_user)
    
    playbook = session.exec(
        select(Playbook)
        .where(Playbook.id == playbook_id)
        .where(Playbook.tenant_id == tenant_id)
    ).first()
    
    if not playbook:
        raise HTTPException(status_code=404, detail="Playbook not found")
    
    return playbook_to_response(playbook)


@router.patch("/{playbook_id}", response_model=dict)
async def update_playbook(
    playbook_id: int,
    payload: PlaybookUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Update a playbook"""
    tenant_id = get_tenant_id(current_user)
    
    playbook = session.exec(
        select(Playbook)
        .where(Playbook.id == playbook_id)
        .where(Playbook.tenant_id == tenant_id)
    ).first()
    
    if not playbook:
        raise HTTPException(status_code=404, detail="Playbook not found")
    
    update_data = payload.dict(exclude_unset=True)
    
    # Handle JSON fields
    for field in ['icp_filters', 'channel_mix', 'ai_config', 'scheduled_days']:
        if field in update_data and update_data[field] is not None:
            update_data[field] = json.dumps(update_data[field])
    
    for key, value in update_data.items():
        setattr(playbook, key, value)
    
    playbook.updated_at = datetime.utcnow()
    session.add(playbook)
    session.commit()
    session.refresh(playbook)
    
    return playbook_to_response(playbook)


@router.delete("/{playbook_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_playbook(
    playbook_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Delete a playbook"""
    tenant_id = get_tenant_id(current_user)
    
    playbook = session.exec(
        select(Playbook)
        .where(Playbook.id == playbook_id)
        .where(Playbook.tenant_id == tenant_id)
    ).first()
    
    if not playbook:
        raise HTTPException(status_code=404, detail="Playbook not found")
    
    # Delete associated runs
    runs = session.exec(
        select(PlaybookRun).where(PlaybookRun.playbook_id == playbook_id)
    ).all()
    for run in runs:
        session.delete(run)
    
    session.delete(playbook)
    session.commit()


# ============================================================================
# Status Management
# ============================================================================

@router.post("/{playbook_id}/activate", response_model=dict)
async def activate_playbook(
    playbook_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Activate a playbook"""
    tenant_id = get_tenant_id(current_user)
    
    playbook = session.exec(
        select(Playbook)
        .where(Playbook.id == playbook_id)
        .where(Playbook.tenant_id == tenant_id)
    ).first()
    
    if not playbook:
        raise HTTPException(status_code=404, detail="Playbook not found")
    
    playbook.status = PlaybookStatus.ACTIVE
    playbook.updated_at = datetime.utcnow()
    session.add(playbook)
    session.commit()
    session.refresh(playbook)
    
    return playbook_to_response(playbook)


@router.post("/{playbook_id}/pause", response_model=dict)
async def pause_playbook(
    playbook_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Pause a playbook"""
    tenant_id = get_tenant_id(current_user)
    
    playbook = session.exec(
        select(Playbook)
        .where(Playbook.id == playbook_id)
        .where(Playbook.tenant_id == tenant_id)
    ).first()
    
    if not playbook:
        raise HTTPException(status_code=404, detail="Playbook not found")
    
    playbook.status = PlaybookStatus.PAUSED
    playbook.updated_at = datetime.utcnow()
    session.add(playbook)
    session.commit()
    session.refresh(playbook)
    
    return playbook_to_response(playbook)


# ============================================================================
# Execution
# ============================================================================

async def execute_playbook_run(
    playbook_id: int,
    run_id: int,
    tenant_id: str,
    session: Session
):
    """Background task to execute a playbook run"""
    import random
    import asyncio
    
    # Get the run
    run = session.exec(
        select(PlaybookRun).where(PlaybookRun.id == run_id)
    ).first()
    
    if not run:
        return
    
    # Update status to running
    run.status = PlaybookRunStatus.RUNNING
    run.started_at = datetime.utcnow()
    session.add(run)
    session.commit()
    
    try:
        # Simulate execution with realistic metrics
        await asyncio.sleep(2)  # Simulate processing time
        
        # Simulate lead matching and targeting
        run.leads_matched = random.randint(50, 200)
        run.leads_targeted = min(run.leads_matched, random.randint(30, 100))
        
        # Simulate email generation and sending
        run.emails_generated = run.leads_targeted
        run.emails_sent = int(run.emails_generated * random.uniform(0.9, 1.0))
        
        # Simulate other channels
        run.linkedin_messages = int(run.leads_targeted * random.uniform(0.2, 0.4))
        run.calls_scheduled = int(run.leads_targeted * random.uniform(0.05, 0.15))
        
        # Simulate responses (realistic rates)
        run.responses = int(run.emails_sent * random.uniform(0.15, 0.35))
        run.meetings_booked = int(run.responses * random.uniform(0.2, 0.5))
        
        run.status = PlaybookRunStatus.COMPLETED
        run.completed_at = datetime.utcnow()
        
        # Update playbook metrics
        playbook = session.exec(
            select(Playbook).where(Playbook.id == playbook_id)
        ).first()
        
        if playbook:
            playbook.total_runs += 1
            playbook.total_leads_targeted += run.leads_targeted
            playbook.total_emails_sent += run.emails_sent
            playbook.total_responses += run.responses
            playbook.total_meetings += run.meetings_booked
            session.add(playbook)
        
    except Exception as e:
        run.status = PlaybookRunStatus.FAILED
        run.error_message = str(e)
        run.completed_at = datetime.utcnow()
    
    session.add(run)
    session.commit()


@router.post("/{playbook_id}/run", response_model=dict, status_code=status.HTTP_202_ACCEPTED)
async def run_playbook(
    playbook_id: int,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Trigger a playbook run"""
    tenant_id = get_tenant_id(current_user)
    
    playbook = session.exec(
        select(Playbook)
        .where(Playbook.id == playbook_id)
        .where(Playbook.tenant_id == tenant_id)
    ).first()
    
    if not playbook:
        raise HTTPException(status_code=404, detail="Playbook not found")
    
    # Create a new run
    run = PlaybookRun(
        playbook_id=playbook_id,
        tenant_id=tenant_id,
        status=PlaybookRunStatus.PENDING,
    )
    session.add(run)
    session.commit()
    session.refresh(run)
    
    # Execute in background
    background_tasks.add_task(
        execute_playbook_run,
        playbook_id,
        run.id,
        tenant_id,
        session
    )
    
    return {
        "message": "Playbook run started",
        "run_id": run.id,
        "status": run.status,
    }


@router.get("/{playbook_id}/runs", response_model=List[dict])
async def list_playbook_runs(
    playbook_id: int,
    limit: int = 20,
    offset: int = 0,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """List runs for a playbook"""
    tenant_id = get_tenant_id(current_user)
    
    # Verify playbook exists and belongs to tenant
    playbook = session.exec(
        select(Playbook)
        .where(Playbook.id == playbook_id)
        .where(Playbook.tenant_id == tenant_id)
    ).first()
    
    if not playbook:
        raise HTTPException(status_code=404, detail="Playbook not found")
    
    runs = session.exec(
        select(PlaybookRun)
        .where(PlaybookRun.playbook_id == playbook_id)
        .order_by(PlaybookRun.created_at.desc())
        .offset(offset)
        .limit(limit)
    ).all()
    
    return [run_to_response(r) for r in runs]


@router.get("/{playbook_id}/runs/{run_id}", response_model=dict)
async def get_playbook_run(
    playbook_id: int,
    run_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Get a specific playbook run"""
    tenant_id = get_tenant_id(current_user)
    
    run = session.exec(
        select(PlaybookRun)
        .where(PlaybookRun.id == run_id)
        .where(PlaybookRun.playbook_id == playbook_id)
        .where(PlaybookRun.tenant_id == tenant_id)
    ).first()
    
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    
    return run_to_response(run)


# ============================================================================
# Analytics
# ============================================================================

@router.get("/analytics/summary", response_model=dict)
async def get_playbooks_summary(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Get summary analytics for all playbooks"""
    tenant_id = get_tenant_id(current_user)
    
    playbooks = session.exec(
        select(Playbook).where(Playbook.tenant_id == tenant_id)
    ).all()
    
    total_playbooks = len(playbooks)
    active_playbooks = sum(1 for p in playbooks if p.status == PlaybookStatus.ACTIVE)
    
    total_runs = sum(p.total_runs for p in playbooks)
    total_leads = sum(p.total_leads_targeted for p in playbooks)
    total_emails = sum(p.total_emails_sent for p in playbooks)
    total_responses = sum(p.total_responses for p in playbooks)
    total_meetings = sum(p.total_meetings for p in playbooks)
    
    response_rate = (total_responses / total_emails * 100) if total_emails > 0 else 0
    meeting_rate = (total_meetings / total_responses * 100) if total_responses > 0 else 0
    
    return {
        "total_playbooks": total_playbooks,
        "active_playbooks": active_playbooks,
        "total_runs": total_runs,
        "total_leads_targeted": total_leads,
        "total_emails_sent": total_emails,
        "total_responses": total_responses,
        "total_meetings": total_meetings,
        "response_rate": round(response_rate, 1),
        "meeting_rate": round(meeting_rate, 1),
        "by_segment": {
            segment: {
                "count": sum(1 for p in playbooks if p.segment == segment),
                "leads": sum(p.total_leads_targeted for p in playbooks if p.segment == segment),
                "meetings": sum(p.total_meetings for p in playbooks if p.segment == segment),
            }
            for segment in ["startup", "midmarket", "enterprise"]
        }
    }
