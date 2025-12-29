"""
Playbook Models for AI Operator

Playbooks define automated outbound workflows:
- Target segment and ICP filters
- Channel mix (email, linkedin, calls)
- AI steps (research, scoring, messaging, follow-up)
- Scheduling and execution tracking
"""

import json
from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import validator
from sqlmodel import JSON, TEXT, Column, Field, SQLModel


class PlaybookStatus(str, Enum):
    """Playbook status types"""

    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    ARCHIVED = "archived"


class PlaybookGoal(str, Enum):
    """Playbook goal types"""

    MEETINGS = "meetings"
    REPLIES = "replies"
    PIPELINE = "pipeline"
    AWARENESS = "awareness"


class ScheduleFrequency(str, Enum):
    """Schedule frequency options"""

    ONCE = "once"
    DAILY = "daily"
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    MONTHLY = "monthly"


class PlaybookRunStatus(str, Enum):
    """Playbook run status types"""

    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class Playbook(SQLModel, table=True):
    """
    AI Playbook definition

    A playbook defines an automated outbound campaign strategy:
    - Who to target (segment, ICP filters)
    - What channels to use (email, linkedin, phone)
    - What goal to optimize for
    - When to run (schedule)
    """

    __tablename__ = "playbooks"

    id: Optional[int] = Field(default=None, primary_key=True)
    tenant_id: str = Field(index=True, max_length=100)

    # Basic info
    name: str = Field(max_length=200)
    description: Optional[str] = Field(default=None, sa_column=Column(TEXT))

    # Targeting
    segment: str = Field(default="startup", max_length=50)  # startup, midmarket, enterprise
    icp_filters: Optional[str] = Field(default=None, sa_column=Column(TEXT))  # JSON

    # Channel configuration
    channel_mix: Optional[str] = Field(
        default=None, sa_column=Column(TEXT)
    )  # JSON: {"email": 60, "linkedin": 30, "phone": 10}

    # Goal
    goal: PlaybookGoal = Field(default=PlaybookGoal.MEETINGS)
    target_metric: Optional[int] = Field(default=None)  # e.g., 10 meetings

    # AI Configuration
    ai_config: Optional[str] = Field(
        default=None, sa_column=Column(TEXT)
    )  # JSON: persona, tone, etc.

    # Status and scheduling
    status: PlaybookStatus = Field(default=PlaybookStatus.DRAFT, index=True)
    schedule_frequency: ScheduleFrequency = Field(default=ScheduleFrequency.ONCE)
    scheduled_time: Optional[str] = Field(default=None, max_length=10)  # HH:MM format
    scheduled_days: Optional[str] = Field(default=None, max_length=100)  # JSON array of days
    next_run_at: Optional[datetime] = None

    # Metrics
    total_runs: int = Field(default=0)
    total_leads_targeted: int = Field(default=0)
    total_emails_sent: int = Field(default=0)
    total_responses: int = Field(default=0)
    total_meetings: int = Field(default=0)

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = Field(default=None, max_length=100)

    @validator("icp_filters", "channel_mix", "ai_config", "scheduled_days", pre=True)
    def validate_json_fields(cls, v):
        if v is None:
            return None
        if isinstance(v, dict) or isinstance(v, list):
            return json.dumps(v)
        return v

    def get_icp_filters(self) -> dict:
        """Parse ICP filters JSON"""
        if self.icp_filters:
            return json.loads(self.icp_filters)
        return {}

    def get_channel_mix(self) -> dict:
        """Parse channel mix JSON"""
        if self.channel_mix:
            return json.loads(self.channel_mix)
        return {"email": 100}

    def get_ai_config(self) -> dict:
        """Parse AI config JSON"""
        if self.ai_config:
            return json.loads(self.ai_config)
        return {}


class PlaybookRun(SQLModel, table=True):
    """
    Playbook execution run

    Tracks each execution of a playbook with metrics and status.
    """

    __tablename__ = "playbook_runs"

    id: Optional[int] = Field(default=None, primary_key=True)
    playbook_id: int = Field(foreign_key="playbooks.id", index=True)
    tenant_id: str = Field(index=True, max_length=100)

    # Execution status
    status: PlaybookRunStatus = Field(default=PlaybookRunStatus.PENDING, index=True)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    # Metrics
    leads_matched: int = Field(default=0)
    leads_targeted: int = Field(default=0)
    emails_generated: int = Field(default=0)
    emails_sent: int = Field(default=0)
    linkedin_messages: int = Field(default=0)
    calls_scheduled: int = Field(default=0)

    # Results
    responses: int = Field(default=0)
    meetings_booked: int = Field(default=0)

    # Error tracking
    error_message: Optional[str] = Field(default=None, sa_column=Column(TEXT))

    # Execution details
    execution_log: Optional[str] = Field(default=None, sa_column=Column(TEXT))  # JSON log

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)

    def get_duration_seconds(self) -> Optional[int]:
        """Calculate run duration"""
        if self.started_at and self.completed_at:
            return int((self.completed_at - self.started_at).total_seconds())
        return None


class PlaybookCreate(SQLModel):
    """Schema for creating a playbook"""

    name: str = Field(max_length=200)
    description: Optional[str] = None
    segment: str = Field(default="startup")
    icp_filters: Optional[dict] = None
    channel_mix: Optional[dict] = None
    goal: PlaybookGoal = PlaybookGoal.MEETINGS
    target_metric: Optional[int] = None
    ai_config: Optional[dict] = None
    schedule_frequency: ScheduleFrequency = ScheduleFrequency.ONCE
    scheduled_time: Optional[str] = None
    scheduled_days: Optional[list] = None


class PlaybookUpdate(SQLModel):
    """Schema for updating a playbook"""

    name: Optional[str] = None
    description: Optional[str] = None
    segment: Optional[str] = None
    icp_filters: Optional[dict] = None
    channel_mix: Optional[dict] = None
    goal: Optional[PlaybookGoal] = None
    target_metric: Optional[int] = None
    ai_config: Optional[dict] = None
    status: Optional[PlaybookStatus] = None
    schedule_frequency: Optional[ScheduleFrequency] = None
    scheduled_time: Optional[str] = None
    scheduled_days: Optional[list] = None


class PlaybookResponse(SQLModel):
    """Response schema for playbook"""

    id: int
    tenant_id: str
    name: str
    description: Optional[str]
    segment: str
    icp_filters: Optional[dict]
    channel_mix: Optional[dict]
    goal: PlaybookGoal
    target_metric: Optional[int]
    ai_config: Optional[dict]
    status: PlaybookStatus
    schedule_frequency: ScheduleFrequency
    scheduled_time: Optional[str]
    scheduled_days: Optional[list]
    next_run_at: Optional[datetime]
    total_runs: int
    total_leads_targeted: int
    total_emails_sent: int
    total_responses: int
    total_meetings: int
    created_at: datetime
    updated_at: datetime


class PlaybookRunResponse(SQLModel):
    """Response schema for playbook run"""

    id: int
    playbook_id: int
    status: PlaybookRunStatus
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    leads_matched: int
    leads_targeted: int
    emails_generated: int
    emails_sent: int
    linkedin_messages: int
    calls_scheduled: int
    responses: int
    meetings_booked: int
    error_message: Optional[str]
    duration_seconds: Optional[int]
    created_at: datetime
