from fastapi import APIRouter, Body, Depends, HTTPException
from pydantic import BaseModel

from app.core.security import (
    create_access_token,
    create_refresh_token,
    get_current_user,
    verify_refresh_token,
)
from app.models.schemas import AuthToken, LoginRequest
from app.models.user import User, UserRole

router = APIRouter()


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


@router.post("/auth/login", response_model=TokenPair)
async def login(payload: LoginRequest):
    """Login endpoint with JWT token generation"""
    if payload.username and payload.password:
        # In production, verify credentials against database
        # For demo, accept any credentials
        user_data = {
            "sub": 1,
            "email": payload.username,
            "name": "Demo User",
            "role": UserRole.ADMIN.value,
            "is_active": True,
        }

        access_token = create_access_token(user_data)
        refresh_token = create_refresh_token(user_data)

        return TokenPair(access_token=access_token, refresh_token=refresh_token)
    raise HTTPException(status_code=400, detail="Invalid credentials")


@router.post("/auth/refresh", response_model=TokenPair)
async def refresh_token(payload: RefreshRequest):
    """
    Refresh access token using refresh token.
    Returns new access and refresh token pair.
    """
    # Verify refresh token
    token_data = verify_refresh_token(payload.refresh_token)

    # Create new token pair
    user_data = {
        "sub": token_data.get("sub"),
        "email": token_data.get("email"),
        "name": token_data.get("name"),
        "role": token_data.get("role"),
        "is_active": token_data.get("is_active", True),
    }

    new_access_token = create_access_token(user_data)
    new_refresh_token = create_refresh_token(user_data)

    return TokenPair(access_token=new_access_token, refresh_token=new_refresh_token)


@router.post("/auth/logout")
async def logout(user: User = Depends(get_current_user)):
    """
    Logout endpoint. In production, invalidate token in Redis.
    """
    # TODO: Add token to blacklist in Redis
    return {"message": "Successfully logged out"}


@router.get("/auth/me", response_model=User)
async def get_current_user_info(user: User = Depends(get_current_user)):
    """Get current authenticated user information"""
    return user
