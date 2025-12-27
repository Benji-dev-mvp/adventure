"""
Follow-up Sequence API Routes
Manage multi-step outreach sequences
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.services.sequence_service import (
    sequence_service,
    Sequence,
    SequenceStep,
    SequenceStepType,
    SequenceStatus,
    SequenceEnrollment,
    StepStatus
)

router = APIRouter()


# Request/Response Models
class CreateSequenceRequest(BaseModel):
    """Request to create a sequence"""
    name: str
    description: Optional[str] = None
    sender_email: Optional[str] = None
    sender_name: Optional[str] = None


class CreateStepRequest(BaseModel):
    """Request to add a step to a sequence"""
    step_type: SequenceStepType
    delay_days: int = 0
    delay_hours: int = 0
    subject_template: Optional[str] = None
    body_template: str
    use_ai_personalization: bool = True
    tone: str = "professional"
    skip_if_replied: bool = True
    skip_weekends: bool = True


class EnrollLeadRequest(BaseModel):
    """Request to enroll a lead in a sequence"""
    lead_id: str
    lead_email: str
    lead_name: str
    personalization_context: Optional[Dict[str, Any]] = None


class BulkEnrollRequest(BaseModel):
    """Request to enroll multiple leads"""
    leads: List[EnrollLeadRequest]


class UpdateSequenceRequest(BaseModel):
    """Request to update a sequence"""
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[SequenceStatus] = None
    sender_email: Optional[str] = None
    sender_name: Optional[str] = None
    daily_limit: Optional[int] = None


# Sequence CRUD
@router.get("/", response_model=List[Sequence])
async def list_sequences(
    status: Optional[SequenceStatus] = Query(None, description="Filter by status")
):
    """List all sequences"""
    return sequence_service.list_sequences(status=status)


@router.post("/", response_model=Sequence)
async def create_sequence(request: CreateSequenceRequest):
    """Create a new sequence"""
    sequence = Sequence(
        name=request.name,
        description=request.description,
        sender_email=request.sender_email,
        sender_name=request.sender_name
    )
    return sequence_service.create_sequence(sequence)


@router.get("/{sequence_id}", response_model=Sequence)
async def get_sequence(sequence_id: str):
    """Get a sequence by ID"""
    sequence = sequence_service.get_sequence(sequence_id)
    if not sequence:
        raise HTTPException(status_code=404, detail="Sequence not found")
    return sequence


@router.patch("/{sequence_id}", response_model=Sequence)
async def update_sequence(sequence_id: str, request: UpdateSequenceRequest):
    """Update a sequence"""
    updates = request.model_dump(exclude_unset=True)
    sequence = sequence_service.update_sequence(sequence_id, updates)
    if not sequence:
        raise HTTPException(status_code=404, detail="Sequence not found")
    return sequence


@router.delete("/{sequence_id}")
async def delete_sequence(sequence_id: str):
    """Delete a sequence"""
    if not sequence_service.delete_sequence(sequence_id):
        raise HTTPException(status_code=404, detail="Sequence not found")
    return {"status": "deleted", "sequence_id": sequence_id}


@router.post("/{sequence_id}/activate")
async def activate_sequence(sequence_id: str):
    """Activate a sequence"""
    sequence = sequence_service.update_sequence(sequence_id, {"status": SequenceStatus.ACTIVE})
    if not sequence:
        raise HTTPException(status_code=404, detail="Sequence not found")
    return {"status": "activated", "sequence": sequence}


@router.post("/{sequence_id}/pause")
async def pause_sequence(sequence_id: str):
    """Pause a sequence"""
    sequence = sequence_service.update_sequence(sequence_id, {"status": SequenceStatus.PAUSED})
    if not sequence:
        raise HTTPException(status_code=404, detail="Sequence not found")
    return {"status": "paused", "sequence": sequence}


# Steps Management
@router.post("/{sequence_id}/steps", response_model=Sequence)
async def add_step(sequence_id: str, request: CreateStepRequest):
    """Add a step to a sequence"""
    sequence = sequence_service.get_sequence(sequence_id)
    if not sequence:
        raise HTTPException(status_code=404, detail="Sequence not found")
    
    # Get next step number
    next_number = len(sequence.steps) + 1
    
    step = SequenceStep(
        step_number=next_number,
        step_type=request.step_type,
        delay_days=request.delay_days,
        delay_hours=request.delay_hours,
        subject_template=request.subject_template,
        body_template=request.body_template,
        use_ai_personalization=request.use_ai_personalization,
        tone=request.tone,
        skip_if_replied=request.skip_if_replied,
        skip_weekends=request.skip_weekends
    )
    
    sequence.steps.append(step)
    sequence_service.update_sequence(sequence_id, {"steps": sequence.steps})
    
    return sequence


@router.delete("/{sequence_id}/steps/{step_number}")
async def remove_step(sequence_id: str, step_number: int):
    """Remove a step from a sequence"""
    sequence = sequence_service.get_sequence(sequence_id)
    if not sequence:
        raise HTTPException(status_code=404, detail="Sequence not found")
    
    # Remove step and renumber
    new_steps = [s for s in sequence.steps if s.step_number != step_number]
    for i, step in enumerate(new_steps):
        step.step_number = i + 1
    
    sequence_service.update_sequence(sequence_id, {"steps": new_steps})
    return {"status": "removed", "step_number": step_number}


# Enrollment Management
@router.post("/{sequence_id}/enroll", response_model=SequenceEnrollment)
async def enroll_lead(sequence_id: str, request: EnrollLeadRequest):
    """Enroll a lead in a sequence"""
    enrollment = sequence_service.enroll_lead(
        sequence_id=sequence_id,
        lead_id=request.lead_id,
        lead_email=request.lead_email,
        lead_name=request.lead_name,
        personalization_context=request.personalization_context
    )
    
    if not enrollment:
        raise HTTPException(
            status_code=400,
            detail="Could not enroll lead. Sequence may be inactive."
        )
    
    return enrollment


@router.post("/{sequence_id}/enroll/bulk")
async def bulk_enroll(sequence_id: str, request: BulkEnrollRequest):
    """Enroll multiple leads in a sequence"""
    results = []
    for lead in request.leads:
        enrollment = sequence_service.enroll_lead(
            sequence_id=sequence_id,
            lead_id=lead.lead_id,
            lead_email=lead.lead_email,
            lead_name=lead.lead_name,
            personalization_context=lead.personalization_context
        )
        results.append({
            "lead_id": lead.lead_id,
            "success": enrollment is not None,
            "enrollment_id": enrollment.id if enrollment else None
        })
    
    return {
        "total": len(results),
        "successful": len([r for r in results if r["success"]]),
        "results": results
    }


@router.get("/{sequence_id}/enrollments")
async def list_enrollments(sequence_id: str):
    """List all enrollments for a sequence"""
    sequence = sequence_service.get_sequence(sequence_id)
    if not sequence:
        raise HTTPException(status_code=404, detail="Sequence not found")
    
    enrollments = [
        e for e in sequence_service._enrollments.values()
        if e.sequence_id == sequence_id
    ]
    
    return {
        "sequence_id": sequence_id,
        "total": len(enrollments),
        "enrollments": enrollments
    }


@router.delete("/enrollments/{enrollment_id}")
async def unenroll(enrollment_id: str):
    """Remove a lead from a sequence"""
    if not sequence_service.unenroll_lead(enrollment_id):
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return {"status": "unenrolled", "enrollment_id": enrollment_id}


# Tracking
@router.post("/enrollments/{enrollment_id}/open")
async def track_open(enrollment_id: str):
    """Record an email open"""
    enrollment = sequence_service.record_open(enrollment_id)
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return {"status": "recorded", "opens": enrollment.emails_opened}


@router.post("/enrollments/{enrollment_id}/click")
async def track_click(enrollment_id: str):
    """Record an email click"""
    enrollment = sequence_service.record_click(enrollment_id)
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return {"status": "recorded", "clicks": enrollment.emails_clicked}


@router.post("/enrollments/{enrollment_id}/reply")
async def track_reply(enrollment_id: str):
    """Record a reply (ends sequence)"""
    enrollment = sequence_service.advance_enrollment(enrollment_id, StepStatus.REPLIED)
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return {"status": "reply_recorded", "enrollment": enrollment}


# Stats
@router.get("/{sequence_id}/stats")
async def get_stats(sequence_id: str):
    """Get statistics for a sequence"""
    stats = sequence_service.get_sequence_stats(sequence_id)
    if not stats:
        raise HTTPException(status_code=404, detail="Sequence not found")
    return stats


# Processing
@router.get("/pending-steps")
async def get_pending_steps(limit: int = Query(100, le=500)):
    """Get steps that are ready to be executed"""
    pending = sequence_service.get_pending_steps(limit=limit)
    
    return {
        "count": len(pending),
        "steps": [
            {
                "enrollment_id": p["enrollment"].id,
                "lead_email": p["enrollment"].lead_email,
                "sequence_name": p["sequence"].name,
                "step_number": p["step"].step_number,
                "step_type": p["step"].step_type,
                "subject": p["step"].subject_template,
                "scheduled_for": p["enrollment"].next_step_at
            }
            for p in pending
        ]
    }
