"""OAuth2 and MFA authentication routes."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.db import get_session
from app.core.mfa import MFASetup, mfa_service
from app.core.oauth import get_oauth_provider
from app.core.security import create_access_token, get_current_user
from app.models.schemas import Token
from app.models.user import User

router = APIRouter(prefix="/api/auth", tags=["authentication"])


class OAuthCallbackRequest(BaseModel):
    """OAuth callback request."""

    code: str
    state: str


class MFAVerifyRequest(BaseModel):
    """MFA verification request."""

    token: str


class MFASetupResponse(BaseModel):
    """MFA setup response."""

    secret: str
    qr_code: str
    backup_codes: list[str]


# OAuth2 Routes
@router.get("/oauth/{provider}/login")
async def oauth_login(provider: str, request: Request):
    """Initiate OAuth login flow."""
    oauth_provider = get_oauth_provider(provider)
    redirect_uri = f"{request.base_url}api/auth/oauth/{provider}/callback"

    auth_url, state = await oauth_provider.get_authorization_url(redirect_uri)

    # Store state in session for verification
    request.session["oauth_state"] = state

    return {"authorization_url": auth_url, "state": state}


@router.get("/oauth/{provider}/callback")
async def oauth_callback(
    provider: str,
    code: str,
    state: str,
    request: Request,
    db: Session = Depends(get_session),
):
    """Handle OAuth callback."""
    # Verify state
    stored_state = request.session.get("oauth_state")
    if not stored_state or stored_state != state:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid state parameter"
        )

    # Get OAuth provider
    oauth_provider = get_oauth_provider(provider)
    redirect_uri = f"{request.base_url}api/auth/oauth/{provider}/callback"

    # Exchange code for token
    token = await oauth_provider.get_access_token(code, redirect_uri)

    # Get user info
    user_info = await oauth_provider.get_user_info(token)

    # Find or create user
    user = db.query(User).filter(User.email == user_info["email"]).first()

    if not user:
        # Create new user
        user = User(
            email=user_info["email"],
            username=user_info["username"] or user_info["email"].split("@")[0],
            hashed_password="",  # No password for OAuth users
            is_verified=user_info.get("email_verified", False),
            oauth_provider=provider,
            oauth_provider_id=user_info.get("provider_id"),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Generate JWT token
    access_token = create_access_token(data={"sub": user.email})

    return Token(access_token=access_token, token_type="bearer", user=user)


# MFA Routes
@router.post("/mfa/setup", response_model=MFASetupResponse)
async def setup_mfa(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_session)
):
    """Setup MFA for current user."""
    if current_user.mfa_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="MFA is already enabled for this account",
        )

    # Generate MFA setup
    mfa_setup = mfa_service.setup_mfa(current_user.email)

    # Store secret (temporarily, until verified)
    current_user.mfa_secret = mfa_setup.secret
    current_user.mfa_backup_codes = mfa_setup.backup_codes
    db.commit()

    return MFASetupResponse(
        secret=mfa_setup.secret,
        qr_code=mfa_setup.qr_code,
        backup_codes=mfa_setup.backup_codes,
    )


@router.post("/mfa/enable")
async def enable_mfa(
    request: MFAVerifyRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """Enable MFA after verifying setup token."""
    if not current_user.mfa_secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="MFA setup not initiated"
        )

    # Verify token
    if not mfa_service.verify_totp(current_user.mfa_secret, request.token):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid verification code"
        )

    # Enable MFA
    current_user.mfa_enabled = True
    db.commit()

    return {"message": "MFA enabled successfully"}


@router.post("/mfa/verify")
async def verify_mfa(request: MFAVerifyRequest, current_user: User = Depends(get_current_user)):
    """Verify MFA token during login."""
    if not current_user.mfa_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="MFA is not enabled for this account",
        )

    # Try TOTP first
    if mfa_service.verify_totp(current_user.mfa_secret, request.token):
        return {"verified": True, "message": "MFA verification successful"}

    # Try backup code
    is_valid, updated_codes = mfa_service.verify_backup_code(
        current_user.mfa_backup_codes or [], request.token
    )

    if is_valid:
        # Update backup codes
        current_user.mfa_backup_codes = updated_codes
        return {"verified": True, "message": "Backup code accepted"}

    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid MFA code")


@router.post("/mfa/disable")
async def disable_mfa(
    request: MFAVerifyRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """Disable MFA for current user."""
    if not current_user.mfa_enabled:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="MFA is not enabled")

    # Verify token before disabling
    if not mfa_service.verify_totp(current_user.mfa_secret, request.token):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid verification code"
        )

    # Disable MFA
    current_user.mfa_enabled = False
    current_user.mfa_secret = None
    current_user.mfa_backup_codes = None
    db.commit()

    return {"message": "MFA disabled successfully"}


@router.get("/mfa/backup-codes")
async def get_backup_codes(current_user: User = Depends(get_current_user)):
    """Get remaining backup codes."""
    if not current_user.mfa_enabled:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="MFA is not enabled")

    return {
        "backup_codes": current_user.mfa_backup_codes or [],
        "remaining": len(current_user.mfa_backup_codes or []),
    }


@router.post("/mfa/regenerate-backup-codes")
async def regenerate_backup_codes(
    request: MFAVerifyRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """Regenerate backup codes."""
    if not current_user.mfa_enabled:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="MFA is not enabled")

    # Verify token
    if not mfa_service.verify_totp(current_user.mfa_secret, request.token):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid verification code"
        )

    # Generate new backup codes
    new_codes = mfa_service.generate_backup_codes()
    current_user.mfa_backup_codes = new_codes
    db.commit()

    return {"backup_codes": new_codes}
