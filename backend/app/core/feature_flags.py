"""Feature flags system for gradual rollouts."""
from typing import Optional, Dict, Any, List
from enum import Enum
from datetime import datetime
from pydantic import BaseModel

from app.core.cache import cache


class FeatureFlagStatus(str, Enum):
    """Feature flag status."""
    ENABLED = "enabled"
    DISABLED = "disabled"
    PERCENTAGE = "percentage"
    USER_LIST = "user_list"
    BETA = "beta"


class FeatureFlag(BaseModel):
    """Feature flag configuration."""
    name: str
    status: FeatureFlagStatus
    description: str
    percentage: int = 0  # For percentage rollout (0-100)
    user_ids: List[int] = []  # For user-specific flags
    metadata: Dict[str, Any] = {}
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()


class FeatureFlagService:
    """Service for managing feature flags."""
    
    CACHE_PREFIX = "feature_flag:"
    CACHE_TTL = 300  # 5 minutes
    
    # Default feature flags
    DEFAULT_FLAGS = {
        "oauth_login": FeatureFlag(
            name="oauth_login",
            status=FeatureFlagStatus.ENABLED,
            description="OAuth/SSO login support"
        ),
        "mfa_authentication": FeatureFlag(
            name="mfa_authentication",
            status=FeatureFlagStatus.ENABLED,
            description="Multi-factor authentication"
        ),
        "ai_assistant": FeatureFlag(
            name="ai_assistant",
            status=FeatureFlagStatus.ENABLED,
            description="AI-powered assistant"
        ),
        "advanced_analytics": FeatureFlag(
            name="advanced_analytics",
            status=FeatureFlagStatus.PERCENTAGE,
            percentage=50,
            description="Advanced analytics dashboard"
        ),
        "webhooks": FeatureFlag(
            name="webhooks",
            status=FeatureFlagStatus.BETA,
            description="Webhook integrations"
        ),
        "bulk_operations": FeatureFlag(
            name="bulk_operations",
            status=FeatureFlagStatus.ENABLED,
            description="Bulk import/export operations"
        ),
        "real_time_updates": FeatureFlag(
            name="real_time_updates",
            status=FeatureFlagStatus.ENABLED,
            description="WebSocket real-time updates"
        ),
    }
    
    @staticmethod
    def get_flag(flag_name: str) -> Optional[FeatureFlag]:
        """Get feature flag configuration."""
        # Try cache first
        cache_key = f"{FeatureFlagService.CACHE_PREFIX}{flag_name}"
        cached_flag = cache.get(cache_key)
        
        if cached_flag:
            return FeatureFlag(**cached_flag)
        
        # Get from defaults
        flag = FeatureFlagService.DEFAULT_FLAGS.get(flag_name)
        
        if flag:
            # Cache it
            cache.set(cache_key, flag.dict(), ttl=FeatureFlagService.CACHE_TTL)
        
        return flag
    
    @staticmethod
    def is_enabled(flag_name: str, user_id: Optional[int] = None) -> bool:
        """Check if feature flag is enabled for user."""
        flag = FeatureFlagService.get_flag(flag_name)
        
        if not flag:
            return False
        
        if flag.status == FeatureFlagStatus.ENABLED:
            return True
        
        if flag.status == FeatureFlagStatus.DISABLED:
            return False
        
        if flag.status == FeatureFlagStatus.USER_LIST and user_id:
            return user_id in flag.user_ids
        
        if flag.status == FeatureFlagStatus.PERCENTAGE and user_id:
            # Consistent hashing for percentage rollout
            user_hash = hash(f"{flag_name}:{user_id}") % 100
            return user_hash < flag.percentage
        
        if flag.status == FeatureFlagStatus.BETA and user_id:
            # Beta users
            return user_id in flag.user_ids
        
        return False
    
    @staticmethod
    def set_flag(flag: FeatureFlag):
        """Update feature flag."""
        cache_key = f"{FeatureFlagService.CACHE_PREFIX}{flag.name}"
        flag.updated_at = datetime.utcnow()
        cache.set(cache_key, flag.dict(), ttl=FeatureFlagService.CACHE_TTL)
        FeatureFlagService.DEFAULT_FLAGS[flag.name] = flag
    
    @staticmethod
    def get_all_flags() -> Dict[str, FeatureFlag]:
        """Get all feature flags."""
        return FeatureFlagService.DEFAULT_FLAGS.copy()
    
    @staticmethod
    def enable_for_user(flag_name: str, user_id: int):
        """Enable feature for specific user."""
        flag = FeatureFlagService.get_flag(flag_name)
        if flag and user_id not in flag.user_ids:
            flag.user_ids.append(user_id)
            FeatureFlagService.set_flag(flag)
    
    @staticmethod
    def disable_for_user(flag_name: str, user_id: int):
        """Disable feature for specific user."""
        flag = FeatureFlagService.get_flag(flag_name)
        if flag and user_id in flag.user_ids:
            flag.user_ids.remove(user_id)
            FeatureFlagService.set_flag(flag)


# Global instance
feature_flags = FeatureFlagService()


def require_feature(flag_name: str):
    """Decorator to require feature flag."""
    def decorator(func):
        async def wrapper(*args, user_id: Optional[int] = None, **kwargs):
            if not feature_flags.is_enabled(flag_name, user_id):
                from fastapi import HTTPException, status
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Feature '{flag_name}' is not enabled"
                )
            return await func(*args, **kwargs)
        return wrapper
    return decorator
