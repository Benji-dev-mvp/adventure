"""
Follow-up Sequence Service
Manages multi-step automated outreach sequences with AI personalization
"""
import logging
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from enum import Enum
from uuid import uuid4

logger = logging.getLogger(__name__)


class SequenceStepType(str, Enum):
    EMAIL = "email"
    LINKEDIN_MESSAGE = "linkedin_message"
    LINKEDIN_CONNECTION = "linkedin_connection"
    PHONE_CALL = "phone_call"
    SMS = "sms"
    TASK = "task"  # Manual task reminder


class SequenceStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class StepStatus(str, Enum):
    PENDING = "pending"
    SCHEDULED = "scheduled"
    SENT = "sent"
    OPENED = "opened"
    CLICKED = "clicked"
    REPLIED = "replied"
    BOUNCED = "bounced"
    SKIPPED = "skipped"
    FAILED = "failed"


class SequenceStep(BaseModel):
    """A single step in a sequence"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    step_number: int
    step_type: SequenceStepType
    delay_days: int = 0  # Days after previous step
    delay_hours: int = 0  # Hours after previous step
    
    # Content
    subject_template: Optional[str] = None  # For emails
    body_template: str  # Main content template
    
    # AI personalization settings
    use_ai_personalization: bool = True
    tone: str = "professional"  # professional, casual, friendly, urgent
    
    # Conditions
    skip_if_replied: bool = True
    skip_if_opened: bool = False
    skip_weekends: bool = True
    
    # A/B testing
    variant: Optional[str] = None  # A, B, etc.


class SequenceEnrollment(BaseModel):
    """A lead enrolled in a sequence"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    sequence_id: str
    lead_id: str
    lead_email: str
    lead_name: str
    
    status: StepStatus = StepStatus.PENDING
    current_step: int = 1
    enrolled_at: datetime = Field(default_factory=datetime.utcnow)
    next_step_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    # Tracking
    emails_sent: int = 0
    emails_opened: int = 0
    emails_clicked: int = 0
    replied: bool = False
    reply_received_at: Optional[datetime] = None
    
    # Personalization context
    personalization_context: Dict[str, Any] = {}


class Sequence(BaseModel):
    """A complete outreach sequence"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    description: Optional[str] = None
    status: SequenceStatus = SequenceStatus.DRAFT
    
    # Steps
    steps: List[SequenceStep] = []
    
    # Settings
    sender_email: Optional[str] = None
    sender_name: Optional[str] = None
    reply_to: Optional[str] = None
    
    # Schedule
    send_window_start: int = 9  # 9 AM
    send_window_end: int = 17  # 5 PM
    timezone: str = "America/Los_Angeles"
    
    # Limits
    daily_limit: int = 50
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = None
    
    # Stats
    total_enrolled: int = 0
    total_completed: int = 0
    total_replied: int = 0


class SequenceService:
    """
    Manages outreach sequences and enrollments
    """
    
    def __init__(self):
        # In-memory storage for development
        self._sequences: Dict[str, Sequence] = {}
        self._enrollments: Dict[str, SequenceEnrollment] = {}
        self._lead_enrollments: Dict[str, List[str]] = {}  # lead_id -> [enrollment_ids]
        
        # Initialize with sample sequences
        self._init_sample_sequences()
    
    def _init_sample_sequences(self):
        """Create sample sequences for demo"""
        # Cold Outreach Sequence
        cold_outreach = Sequence(
            id="seq_cold_outreach",
            name="Cold Outreach - Enterprise",
            description="5-step sequence for cold enterprise outreach",
            status=SequenceStatus.ACTIVE,
            steps=[
                SequenceStep(
                    step_number=1,
                    step_type=SequenceStepType.EMAIL,
                    delay_days=0,
                    subject_template="Quick question about {{company}}'s {{pain_point}}",
                    body_template="""Hi {{first_name}},

I noticed {{company}} is {{observation}}. Many {{title}}s in {{industry}} are dealing with similar challenges.

We've helped companies like {{similar_company}} achieve {{result}}.

Would you be open to a 15-minute call this week to explore if we could help {{company}} too?

Best,
{{sender_name}}""",
                    tone="professional"
                ),
                SequenceStep(
                    step_number=2,
                    step_type=SequenceStepType.EMAIL,
                    delay_days=3,
                    subject_template="Re: Quick question about {{company}}'s {{pain_point}}",
                    body_template="""Hi {{first_name}},

Following up on my previous email. I wanted to share a quick case study that might be relevant.

{{case_study_summary}}

Would love to show you how we could replicate these results for {{company}}.

Are you available for a brief call?

Best,
{{sender_name}}""",
                    tone="friendly"
                ),
                SequenceStep(
                    step_number=3,
                    step_type=SequenceStepType.LINKEDIN_CONNECTION,
                    delay_days=2,
                    body_template="Hi {{first_name}}, I've been reaching out about {{pain_point}} solutions. Would love to connect!",
                    tone="casual"
                ),
                SequenceStep(
                    step_number=4,
                    step_type=SequenceStepType.EMAIL,
                    delay_days=4,
                    subject_template="{{first_name}}, one more thing",
                    body_template="""Hi {{first_name}},

I know you're busy, so I'll keep this brief.

Here's what we've seen work for {{industry}} companies:
• {{benefit_1}}
• {{benefit_2}}
• {{benefit_3}}

If any of these resonate, I'd love to chat. If not, no worries at all.

Best,
{{sender_name}}""",
                    tone="casual"
                ),
                SequenceStep(
                    step_number=5,
                    step_type=SequenceStepType.EMAIL,
                    delay_days=7,
                    subject_template="Closing the loop",
                    body_template="""Hi {{first_name}},

I haven't heard back, so I'll assume the timing isn't right.

I'll close this out for now, but feel free to reach out if things change.

Wishing you and {{company}} continued success!

Best,
{{sender_name}}""",
                    tone="professional"
                )
            ]
        )
        
        # Follow-up After Demo
        demo_followup = Sequence(
            id="seq_demo_followup",
            name="Post-Demo Follow-up",
            description="Follow-up sequence after a demo call",
            status=SequenceStatus.ACTIVE,
            steps=[
                SequenceStep(
                    step_number=1,
                    step_type=SequenceStepType.EMAIL,
                    delay_days=0,
                    subject_template="Thanks for the call, {{first_name}}!",
                    body_template="""Hi {{first_name}},

Great speaking with you today! As promised, here's a quick recap:

**What we discussed:**
{{meeting_notes}}

**Next steps:**
{{next_steps}}

Let me know if you have any questions.

Best,
{{sender_name}}""",
                    tone="friendly"
                ),
                SequenceStep(
                    step_number=2,
                    step_type=SequenceStepType.EMAIL,
                    delay_days=3,
                    subject_template="Resources for {{company}}",
                    body_template="""Hi {{first_name}},

Following up with some resources that might help:

• {{resource_1}}
• {{resource_2}}

Would you like to schedule a follow-up call to discuss implementation?

Best,
{{sender_name}}""",
                    tone="helpful"
                )
            ]
        )
        
        self._sequences[cold_outreach.id] = cold_outreach
        self._sequences[demo_followup.id] = demo_followup
    
    # CRUD Operations
    def create_sequence(self, sequence: Sequence) -> Sequence:
        """Create a new sequence"""
        sequence.created_at = datetime.utcnow()
        sequence.updated_at = datetime.utcnow()
        self._sequences[sequence.id] = sequence
        logger.info(f"Created sequence: {sequence.name} ({sequence.id})")
        return sequence
    
    def get_sequence(self, sequence_id: str) -> Optional[Sequence]:
        """Get a sequence by ID"""
        return self._sequences.get(sequence_id)
    
    def list_sequences(self, status: Optional[SequenceStatus] = None) -> List[Sequence]:
        """List all sequences, optionally filtered by status"""
        sequences = list(self._sequences.values())
        if status:
            sequences = [s for s in sequences if s.status == status]
        return sorted(sequences, key=lambda s: s.created_at, reverse=True)
    
    def update_sequence(self, sequence_id: str, updates: Dict[str, Any]) -> Optional[Sequence]:
        """Update a sequence"""
        sequence = self._sequences.get(sequence_id)
        if not sequence:
            return None
        
        for key, value in updates.items():
            if hasattr(sequence, key):
                setattr(sequence, key, value)
        
        sequence.updated_at = datetime.utcnow()
        self._sequences[sequence_id] = sequence
        return sequence
    
    def delete_sequence(self, sequence_id: str) -> bool:
        """Delete a sequence"""
        if sequence_id in self._sequences:
            del self._sequences[sequence_id]
            return True
        return False
    
    # Enrollment Operations
    def enroll_lead(
        self,
        sequence_id: str,
        lead_id: str,
        lead_email: str,
        lead_name: str,
        personalization_context: Optional[Dict[str, Any]] = None
    ) -> Optional[SequenceEnrollment]:
        """Enroll a lead in a sequence"""
        sequence = self.get_sequence(sequence_id)
        if not sequence or sequence.status != SequenceStatus.ACTIVE:
            return None
        
        # Check if already enrolled
        if lead_id in self._lead_enrollments:
            for enrollment_id in self._lead_enrollments[lead_id]:
                enrollment = self._enrollments.get(enrollment_id)
                if enrollment and enrollment.sequence_id == sequence_id and enrollment.status == StepStatus.PENDING:
                    return enrollment  # Already enrolled
        
        enrollment = SequenceEnrollment(
            sequence_id=sequence_id,
            lead_id=lead_id,
            lead_email=lead_email,
            lead_name=lead_name,
            personalization_context=personalization_context or {},
            next_step_at=datetime.utcnow()  # First step sends immediately
        )
        
        self._enrollments[enrollment.id] = enrollment
        
        if lead_id not in self._lead_enrollments:
            self._lead_enrollments[lead_id] = []
        self._lead_enrollments[lead_id].append(enrollment.id)
        
        # Update sequence stats
        sequence.total_enrolled += 1
        
        logger.info(f"Enrolled lead {lead_email} in sequence {sequence.name}")
        return enrollment
    
    def unenroll_lead(self, enrollment_id: str) -> bool:
        """Remove a lead from a sequence"""
        enrollment = self._enrollments.get(enrollment_id)
        if not enrollment:
            return False
        
        enrollment.status = StepStatus.SKIPPED
        enrollment.completed_at = datetime.utcnow()
        return True
    
    def get_enrollment(self, enrollment_id: str) -> Optional[SequenceEnrollment]:
        """Get an enrollment by ID"""
        return self._enrollments.get(enrollment_id)
    
    def get_lead_enrollments(self, lead_id: str) -> List[SequenceEnrollment]:
        """Get all enrollments for a lead"""
        enrollment_ids = self._lead_enrollments.get(lead_id, [])
        return [self._enrollments[eid] for eid in enrollment_ids if eid in self._enrollments]
    
    def get_pending_steps(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get steps that are ready to be executed"""
        now = datetime.utcnow()
        pending = []
        
        for enrollment in self._enrollments.values():
            if enrollment.status != StepStatus.PENDING:
                continue
            
            if enrollment.next_step_at and enrollment.next_step_at <= now:
                sequence = self.get_sequence(enrollment.sequence_id)
                if not sequence:
                    continue
                
                # Find current step
                current_step = None
                for step in sequence.steps:
                    if step.step_number == enrollment.current_step:
                        current_step = step
                        break
                
                if current_step:
                    pending.append({
                        "enrollment": enrollment,
                        "sequence": sequence,
                        "step": current_step
                    })
        
        return pending[:limit]
    
    def advance_enrollment(self, enrollment_id: str, step_status: StepStatus) -> Optional[SequenceEnrollment]:
        """Advance an enrollment to the next step"""
        enrollment = self._enrollments.get(enrollment_id)
        if not enrollment:
            return None
        
        sequence = self.get_sequence(enrollment.sequence_id)
        if not sequence:
            return None
        
        # Check if replied (ends sequence)
        if step_status == StepStatus.REPLIED:
            enrollment.replied = True
            enrollment.reply_received_at = datetime.utcnow()
            enrollment.status = StepStatus.REPLIED
            enrollment.completed_at = datetime.utcnow()
            sequence.total_replied += 1
            return enrollment
        
        # Find next step
        next_step_number = enrollment.current_step + 1
        next_step = None
        for step in sequence.steps:
            if step.step_number == next_step_number:
                next_step = step
                break
        
        if next_step:
            # Schedule next step
            delay = timedelta(days=next_step.delay_days, hours=next_step.delay_hours)
            enrollment.current_step = next_step_number
            enrollment.next_step_at = datetime.utcnow() + delay
        else:
            # Sequence completed
            enrollment.status = StepStatus.SENT  # Mark as completed
            enrollment.completed_at = datetime.utcnow()
            sequence.total_completed += 1
        
        return enrollment
    
    def record_open(self, enrollment_id: str) -> Optional[SequenceEnrollment]:
        """Record an email open"""
        enrollment = self._enrollments.get(enrollment_id)
        if enrollment:
            enrollment.emails_opened += 1
            enrollment.status = StepStatus.OPENED
        return enrollment
    
    def record_click(self, enrollment_id: str) -> Optional[SequenceEnrollment]:
        """Record an email click"""
        enrollment = self._enrollments.get(enrollment_id)
        if enrollment:
            enrollment.emails_clicked += 1
            enrollment.status = StepStatus.CLICKED
        return enrollment
    
    def get_sequence_stats(self, sequence_id: str) -> Dict[str, Any]:
        """Get stats for a sequence"""
        sequence = self.get_sequence(sequence_id)
        if not sequence:
            return {}
        
        enrollments = [e for e in self._enrollments.values() if e.sequence_id == sequence_id]
        
        total_sent = sum(e.emails_sent for e in enrollments)
        total_opened = sum(e.emails_opened for e in enrollments)
        total_clicked = sum(e.emails_clicked for e in enrollments)
        total_replied = len([e for e in enrollments if e.replied])
        
        return {
            "sequence_id": sequence_id,
            "sequence_name": sequence.name,
            "total_enrolled": len(enrollments),
            "active": len([e for e in enrollments if e.status == StepStatus.PENDING]),
            "completed": len([e for e in enrollments if e.completed_at is not None]),
            "emails_sent": total_sent,
            "emails_opened": total_opened,
            "emails_clicked": total_clicked,
            "replies": total_replied,
            "open_rate": (total_opened / total_sent * 100) if total_sent > 0 else 0,
            "click_rate": (total_clicked / total_sent * 100) if total_sent > 0 else 0,
            "reply_rate": (total_replied / len(enrollments) * 100) if enrollments else 0
        }


# Singleton instance
sequence_service = SequenceService()
