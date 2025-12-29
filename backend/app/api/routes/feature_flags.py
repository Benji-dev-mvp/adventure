"""Feature flags API routes."""

from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException

from app.core.feature_flags import FeatureFlag, feature_flags
from app.core.security import get_current_user, require_role
from app.models.user import User, UserRole

router = APIRouter(prefix="/api/feature-flags", tags=["feature-flags"])


@router.get("/")
async def get_all_flags(
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """Get all feature flags and their status for current user."""
    all_flags = feature_flags.get_all_flags()

    result = {}
    for name, flag in all_flags.items():
        result[name] = {
            "enabled": feature_flags.is_enabled(name, current_user.id),
            "description": flag.description,
            "status": flag.status,
        }

    return result


@router.get("/{flag_name}")
async def check_flag(
    flag_name: str, current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Check if specific feature flag is enabled for user."""
    is_enabled = feature_flags.is_enabled(flag_name, current_user.id)
    flag = feature_flags.get_flag(flag_name)

    if not flag:
        raise HTTPException(status_code=404, detail="Feature flag not found")

    return {"flag": flag_name, "enabled": is_enabled, "description": flag.description}


@router.post("/{flag_name}/enable")
@require_role(UserRole.ADMIN)
async def enable_flag_for_user(
    flag_name: str, user_id: int, current_user: User = Depends(get_current_user)
):
    """Enable feature flag for specific user (Admin only)."""
    feature_flags.enable_for_user(flag_name, user_id)
    return {"message": f"Feature '{flag_name}' enabled for user {user_id}"}


@router.post("/{flag_name}/disable")
@require_role(UserRole.ADMIN)
async def disable_flag_for_user(
    flag_name: str, user_id: int, current_user: User = Depends(get_current_user)
):
    """Disable feature flag for specific user (Admin only)."""
    feature_flags.disable_for_user(flag_name, user_id)
    return {"message": f"Feature '{flag_name}' disabled for user {user_id}"}
