"""
Multi-tenant organization models for enterprise architecture.
Implements organization, workspace, and seat management.
"""
from enum import Enum
from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from pydantic import EmailStr


class PlanTier(str, Enum):
    """Subscription plan tiers"""
    FREE = "free"
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"


class OrganizationStatus(str, Enum):
    """Organization status"""
    ACTIVE = "active"
    SUSPENDED = "suspended"
    TRIAL = "trial"
    CANCELLED = "cancelled"


class Organization(SQLModel, table=True):
    """
    Top-level tenant entity. Each organization has workspaces and users.
    """
    __tablename__ = "organizations"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=200, index=True)
    slug: str = Field(max_length=100, unique=True, index=True)
    domain: Optional[str] = Field(default=None, max_length=200)
    
    # Subscription & billing
    plan_tier: PlanTier = Field(default=PlanTier.FREE)
    status: OrganizationStatus = Field(default=OrganizationStatus.TRIAL)
    seat_limit: int = Field(default=5)
    seats_used: int = Field(default=0)
    
    # Compliance & security
    enforce_sso: bool = Field(default=False)
    require_mfa: bool = Field(default=False)
    allowed_domains: Optional[str] = Field(default=None, max_length=500)  # Comma-separated
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[int] = Field(default=None, foreign_key="users.id")
    
    # Logo/branding
    logo_url: Optional[str] = Field(default=None, max_length=500)
    primary_color: Optional[str] = Field(default=None, max_length=7)


class WorkspaceRole(str, Enum):
    """Workspace-level roles (RBAC)"""
    ADMIN = "admin"
    MANAGER = "manager"
    MEMBER = "member"
    READ_ONLY = "read_only"


class Workspace(SQLModel, table=True):
    """
    Workspaces within an organization. Users can belong to multiple workspaces.
    """
    __tablename__ = "workspaces"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=200)
    slug: str = Field(max_length=100, index=True)
    description: Optional[str] = Field(default=None, max_length=500)
    
    # Foreign keys
    organization_id: int = Field(foreign_key="organizations.id", index=True)
    
    # Settings
    is_active: bool = Field(default=True)
    allow_external_sharing: bool = Field(default=False)
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[int] = Field(default=None, foreign_key="users.id")


class OrganizationUser(SQLModel, table=True):
    """
    Junction table for organization membership with role.
    Links users to organizations.
    """
    __tablename__ = "organization_users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    organization_id: int = Field(foreign_key="organizations.id", index=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    role: WorkspaceRole = Field(default=WorkspaceRole.MEMBER)
    
    # Metadata
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    invited_by: Optional[int] = Field(default=None, foreign_key="users.id")
    is_active: bool = Field(default=True)


class WorkspaceMember(SQLModel, table=True):
    """
    Junction table for workspace membership.
    Links users to workspaces with specific roles.
    """
    __tablename__ = "workspace_members"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    workspace_id: int = Field(foreign_key="workspaces.id", index=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    role: WorkspaceRole = Field(default=WorkspaceRole.MEMBER)
    
    # Metadata
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    invited_by: Optional[int] = Field(default=None, foreign_key="users.id")
    is_active: bool = Field(default=True)


# ============================================================================
# Pydantic schemas for API requests/responses
# ============================================================================

class OrganizationCreate(SQLModel):
    """Schema for creating a new organization"""
    name: str = Field(min_length=1, max_length=200)
    slug: str = Field(min_length=1, max_length=100)
    domain: Optional[str] = None
    plan_tier: PlanTier = PlanTier.FREE


class OrganizationUpdate(SQLModel):
    """Schema for updating an organization"""
    name: Optional[str] = None
    domain: Optional[str] = None
    plan_tier: Optional[PlanTier] = None
    status: Optional[OrganizationStatus] = None
    seat_limit: Optional[int] = None
    enforce_sso: Optional[bool] = None
    require_mfa: Optional[bool] = None
    allowed_domains: Optional[str] = None
    logo_url: Optional[str] = None
    primary_color: Optional[str] = None


class WorkspaceCreate(SQLModel):
    """Schema for creating a new workspace"""
    name: str = Field(min_length=1, max_length=200)
    slug: str = Field(min_length=1, max_length=100)
    description: Optional[str] = None
    organization_id: int


class WorkspaceUpdate(SQLModel):
    """Schema for updating a workspace"""
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    allow_external_sharing: Optional[bool] = None


class InviteUserRequest(SQLModel):
    """Schema for inviting a user to organization/workspace"""
    email: EmailStr
    role: WorkspaceRole = WorkspaceRole.MEMBER
    workspace_id: Optional[int] = None


class UpdateMemberRoleRequest(SQLModel):
    """Schema for updating a member's role"""
    role: WorkspaceRole
