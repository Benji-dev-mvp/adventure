from typing import Optional, List, Dict
from sqlmodel import SQLModel, Field
from pydantic import EmailStr


class Lead(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    status: str = Field(default="new", min_length=2, max_length=32)


class Campaign(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(min_length=1, max_length=120)
    objective: str = Field(min_length=1, max_length=2000)
    active: bool = True


class LeadCreate(SQLModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    status: str = Field(default="new", min_length=2, max_length=32)


class CampaignCreate(SQLModel):
    name: str = Field(min_length=1, max_length=120)
    objective: str = Field(min_length=1, max_length=2000)
    active: bool = True


class AnalyticsSummary(SQLModel):
    total_leads: int
    active_campaigns: int
    conversion_rate: float


class DashboardSnapshot(SQLModel):
    kpis: List[Dict]
    kpiTrends: Dict[str, List]
    emailData: List[Dict]


class LoginRequest(SQLModel):
    username: str
    password: str


class AuthToken(SQLModel):
    access_token: str
    token_type: str = "bearer"


class Token(SQLModel):
    """OAuth/JWT token response"""
    access_token: str
    token_type: str = "bearer"
    expires_in: Optional[int] = None
    refresh_token: Optional[str] = None
    token_type: str = "bearer"


class ServiceStatus(SQLModel):
    name: str
    status: str
    latencyMs: int


class SystemStatus(SQLModel):
    lastUpdated: str
    services: List[ServiceStatus]
