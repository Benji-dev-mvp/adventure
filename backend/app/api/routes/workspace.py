"""
Workspace and team management API routes
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime, timedelta
import secrets
from app.core.db import get_session
from app.models.growth_models import (
    Workspace, TeamMember, Invitation, InvitationStatus
)
from pydantic import BaseModel, EmailStr


router = APIRouter()


# ============================================================================
# Request/Response Models
# ============================================================================

class WorkspaceCreate(BaseModel):
    name: str
    description: Optional[str] = None


class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    settings: Optional[str] = None


class InvitationCreate(BaseModel):
    email: EmailStr
    role: str = "member"


class InvitationAccept(BaseModel):
    token: str


# ============================================================================
# Workspace Endpoints
# ============================================================================

@router.get("/workspaces")
def list_workspaces(
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """List user's workspaces"""
    # Get workspaces where user is owner
    statement = select(Workspace).where(
        Workspace.owner_id == user_id,
        Workspace.is_active == True
    )
    owned_workspaces = session.exec(statement).all()
    
    # Get workspaces where user is a member
    member_statement = select(Workspace).join(TeamMember).where(
        TeamMember.user_id == user_id,
        TeamMember.is_active == True,
        Workspace.is_active == True
    )
    member_workspaces = session.exec(member_statement).all()
    
    # Combine and deduplicate
    all_workspaces = list({w.id: w for w in owned_workspaces + member_workspaces}.values())
    
    return all_workspaces


@router.get("/workspaces/{workspace_id}")
def get_workspace(
    workspace_id: int,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Get workspace details"""
    workspace = session.get(Workspace, workspace_id)
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    # Check access
    has_access = (
        workspace.owner_id == user_id or
        session.exec(
            select(TeamMember).where(
                TeamMember.workspace_id == workspace_id,
                TeamMember.user_id == user_id,
                TeamMember.is_active == True
            )
        ).first() is not None
    )
    
    if not has_access:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return workspace


@router.post("/workspaces")
def create_workspace(
    data: WorkspaceCreate,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Create new workspace"""
    # Generate unique slug
    base_slug = data.name.lower().replace(" ", "-")
    slug = base_slug
    counter = 1
    
    while session.exec(select(Workspace).where(Workspace.slug == slug)).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    workspace = Workspace(
        name=data.name,
        slug=slug,
        description=data.description,
        owner_id=user_id
    )
    
    session.add(workspace)
    session.commit()
    session.refresh(workspace)
    
    return workspace


@router.put("/workspaces/{workspace_id}")
def update_workspace(
    workspace_id: int,
    data: WorkspaceUpdate,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Update workspace"""
    workspace = session.get(Workspace, workspace_id)
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    if workspace.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Only owner can update workspace")
    
    if data.name:
        workspace.name = data.name
    if data.description is not None:
        workspace.description = data.description
    if data.settings is not None:
        workspace.settings = data.settings
    
    workspace.updated_at = datetime.utcnow()
    
    session.add(workspace)
    session.commit()
    session.refresh(workspace)
    
    return workspace


@router.delete("/workspaces/{workspace_id}")
def delete_workspace(
    workspace_id: int,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Delete workspace"""
    workspace = session.get(Workspace, workspace_id)
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    if workspace.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Only owner can delete workspace")
    
    workspace.is_active = False
    workspace.updated_at = datetime.utcnow()
    
    session.add(workspace)
    session.commit()
    
    return {"message": "Workspace deleted successfully"}


# ============================================================================
# Team Member Endpoints
# ============================================================================

@router.get("/workspaces/{workspace_id}/members")
def list_workspace_members(
    workspace_id: int,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """List workspace members"""
    # Verify access
    workspace = session.get(Workspace, workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    statement = select(TeamMember).where(
        TeamMember.workspace_id == workspace_id,
        TeamMember.is_active == True
    )
    members = session.exec(statement).all()
    
    return members


@router.delete("/workspaces/{workspace_id}/members/{member_id}")
def remove_workspace_member(
    workspace_id: int,
    member_id: int,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Remove member from workspace"""
    workspace = session.get(Workspace, workspace_id)
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    if workspace.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Only owner can remove members")
    
    member = session.get(TeamMember, member_id)
    
    if not member or member.workspace_id != workspace_id:
        raise HTTPException(status_code=404, detail="Member not found")
    
    member.is_active = False
    
    session.add(member)
    session.commit()
    
    return {"message": "Member removed successfully"}


# ============================================================================
# Invitation Endpoints
# ============================================================================

@router.post("/workspaces/{workspace_id}/invitations")
def create_invitation(
    workspace_id: int,
    data: InvitationCreate,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Invite user to workspace"""
    workspace = session.get(Workspace, workspace_id)
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    if workspace.owner_id != user_id:
        # Check if user is admin
        member = session.exec(
            select(TeamMember).where(
                TeamMember.workspace_id == workspace_id,
                TeamMember.user_id == user_id,
                TeamMember.role == "admin"
            )
        ).first()
        
        if not member:
            raise HTTPException(status_code=403, detail="Only owner/admin can invite members")
    
    # Check if invitation already exists
    existing = session.exec(
        select(Invitation).where(
            Invitation.workspace_id == workspace_id,
            Invitation.email == data.email,
            Invitation.status == InvitationStatus.PENDING
        )
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Invitation already sent")
    
    # Generate secure token
    token = secrets.token_urlsafe(32)
    
    # Create invitation
    invitation = Invitation(
        team_id=workspace.team_id if workspace.team_id else 1,  # Default to team 1
        workspace_id=workspace_id,
        email=data.email,
        invited_by_user_id=user_id,
        token=token,
        role=data.role,
        expires_at=datetime.utcnow() + timedelta(days=7)
    )
    
    session.add(invitation)
    session.commit()
    session.refresh(invitation)
    
    # TODO: Send email with invitation link
    
    return {
        "invitation": invitation,
        "invitation_link": f"/accept-invitation?token={token}"
    }


@router.get("/invitations")
def list_invitations(
    workspace_id: Optional[int] = None,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """List invitations (sent or received)"""
    if workspace_id:
        # List invitations for workspace
        workspace = session.get(Workspace, workspace_id)
        if not workspace or workspace.owner_id != user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        statement = select(Invitation).where(
            Invitation.workspace_id == workspace_id
        ).order_by(Invitation.created_at.desc())
    else:
        # List invitations sent by user
        statement = select(Invitation).where(
            Invitation.invited_by_user_id == user_id
        ).order_by(Invitation.created_at.desc())
    
    invitations = session.exec(statement).all()
    return invitations


@router.post("/invitations/accept")
def accept_invitation(
    data: InvitationAccept,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Accept workspace invitation"""
    # Find invitation by token
    invitation = session.exec(
        select(Invitation).where(Invitation.token == data.token)
    ).first()
    
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    if invitation.status != InvitationStatus.PENDING:
        raise HTTPException(status_code=400, detail=f"Invitation is {invitation.status}")
    
    if invitation.expires_at < datetime.utcnow():
        invitation.status = InvitationStatus.EXPIRED
        session.add(invitation)
        session.commit()
        raise HTTPException(status_code=400, detail="Invitation expired")
    
    # Create team member
    member = TeamMember(
        team_id=invitation.team_id,
        workspace_id=invitation.workspace_id,
        user_id=user_id,
        role=invitation.role
    )
    
    session.add(member)
    
    # Update invitation
    invitation.status = InvitationStatus.ACCEPTED
    invitation.accepted_at = datetime.utcnow()
    invitation.updated_at = datetime.utcnow()
    
    session.add(invitation)
    session.commit()
    session.refresh(member)
    
    return {
        "message": "Invitation accepted",
        "member": member
    }


@router.delete("/invitations/{invitation_id}")
def revoke_invitation(
    invitation_id: int,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Revoke invitation"""
    invitation = session.get(Invitation, invitation_id)
    
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    if invitation.invited_by_user_id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    invitation.status = InvitationStatus.REVOKED
    invitation.revoked_at = datetime.utcnow()
    invitation.updated_at = datetime.utcnow()
    
    session.add(invitation)
    session.commit()
    
    return {"message": "Invitation revoked"}
