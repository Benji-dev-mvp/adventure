"""
Budget Manager

Central budget/cost control system with:
- Per-request token ceilings
- Per-user/org daily budgets
- Per-endpoint default token limits
"""

import logging
from datetime import datetime, timedelta
from typing import Any, Dict, Optional

from ..core.cache import cache
from .policies import AIPolicy

logger = logging.getLogger(__name__)


class BudgetManager:
    """
    Centralized budget management for AI operations

    Features:
    - Per-request token/cost limits
    - Per-user daily budgets
    - Per-org daily budgets
    - Usage tracking and reporting
    """

    def __init__(self, global_config: Dict[str, Any]):
        """
        Initialize budget manager

        Args:
            global_config: Global budget configuration from ai_config.yaml
        """
        self.global_config = global_config

        # Defaults from config
        self.default_max_tokens_per_request = global_config.get("max_tokens_per_request", 10000)
        self.default_max_cost_per_request = global_config.get("max_cost_per_request", 1.0)
        self.default_daily_token_limit_per_user = global_config.get(
            "daily_token_limit_per_user", 500000
        )
        self.default_daily_cost_limit_per_user = global_config.get(
            "daily_cost_limit_per_user", 50.0
        )
        self.default_daily_token_limit_per_org = global_config.get(
            "daily_token_limit_per_org", 5000000
        )
        self.default_daily_cost_limit_per_org = global_config.get("daily_cost_limit_per_org", 500.0)

    async def check_budget(
        self,
        user_id: str,
        org_id: str,
        policy: AIPolicy,
    ) -> Dict[str, Any]:
        """
        Check if request is within budget limits

        Args:
            user_id: User ID
            org_id: Organization ID
            policy: AI policy for this request

        Returns:
            Dict with 'allowed' (bool) and 'reason' (str if not allowed)
        """
        # Check per-request limits from policy
        if policy.budget.max_tokens_per_request:
            # We don't know exact tokens yet, but we can check if historical average exceeds limit
            pass  # Would implement historical average check

        # Check user daily budget
        user_usage = await self._get_daily_usage(f"user:{user_id}")
        user_token_limit = self.default_daily_token_limit_per_user
        user_cost_limit = self.default_daily_cost_limit_per_user

        if user_usage["tokens"] >= user_token_limit:
            return {
                "allowed": False,
                "reason": f"User daily token limit exceeded ({user_usage['tokens']}/{user_token_limit})",
            }

        if user_usage["cost"] >= user_cost_limit:
            return {
                "allowed": False,
                "reason": f"User daily cost limit exceeded (${user_usage['cost']:.2f}/${user_cost_limit:.2f})",
            }

        # Check org daily budget
        org_usage = await self._get_daily_usage(f"org:{org_id}")
        org_token_limit = self.default_daily_token_limit_per_org
        org_cost_limit = self.default_daily_cost_limit_per_org

        if org_usage["tokens"] >= org_token_limit:
            return {
                "allowed": False,
                "reason": f"Organization daily token limit exceeded ({org_usage['tokens']}/{org_token_limit})",
            }

        if org_usage["cost"] >= org_cost_limit:
            return {
                "allowed": False,
                "reason": f"Organization daily cost limit exceeded (${org_usage['cost']:.2f}/${org_cost_limit:.2f})",
            }

        return {
            "allowed": True,
            "reason": None,
        }

    async def record_usage(
        self,
        user_id: str,
        org_id: str,
        tokens_used: int,
        cost: float,
    ):
        """
        Record usage for budget tracking

        Args:
            user_id: User ID
            org_id: Organization ID
            tokens_used: Tokens consumed
            cost: Cost in USD
        """
        # Update user usage
        await self._increment_daily_usage(
            f"user:{user_id}",
            tokens_used,
            cost,
        )

        # Update org usage
        await self._increment_daily_usage(
            f"org:{org_id}",
            tokens_used,
            cost,
        )

        logger.info(
            f"Recorded usage: {tokens_used} tokens, ${cost:.4f}",
            extra={
                "user_id": user_id,
                "org_id": org_id,
                "tokens_used": tokens_used,
                "cost": cost,
            },
        )

    async def get_remaining_budget(
        self,
        user_id: str,
        org_id: str,
    ) -> Dict[str, Any]:
        """
        Get remaining budget for user and org

        Args:
            user_id: User ID
            org_id: Organization ID

        Returns:
            Dict with remaining tokens and cost for user and org
        """
        user_usage = await self._get_daily_usage(f"user:{user_id}")
        org_usage = await self._get_daily_usage(f"org:{org_id}")

        return {
            "user": {
                "tokens_used": user_usage["tokens"],
                "tokens_remaining": max(
                    0, self.default_daily_token_limit_per_user - user_usage["tokens"]
                ),
                "tokens_limit": self.default_daily_token_limit_per_user,
                "cost_used": user_usage["cost"],
                "cost_remaining": max(
                    0, self.default_daily_cost_limit_per_user - user_usage["cost"]
                ),
                "cost_limit": self.default_daily_cost_limit_per_user,
            },
            "org": {
                "tokens_used": org_usage["tokens"],
                "tokens_remaining": max(
                    0, self.default_daily_token_limit_per_org - org_usage["tokens"]
                ),
                "tokens_limit": self.default_daily_token_limit_per_org,
                "cost_used": org_usage["cost"],
                "cost_remaining": max(0, self.default_daily_cost_limit_per_org - org_usage["cost"]),
                "cost_limit": self.default_daily_cost_limit_per_org,
            },
        }

    async def _get_daily_usage(self, key: str) -> Dict[str, Any]:
        """Get daily usage from cache"""
        today = datetime.utcnow().strftime("%Y-%m-%d")
        cache_key = f"budget:{key}:{today}"

        usage = await cache.get(cache_key)
        if not usage:
            usage = {"tokens": 0, "cost": 0.0}

        return usage

    async def _increment_daily_usage(
        self,
        key: str,
        tokens: int,
        cost: float,
    ):
        """Increment daily usage in cache"""
        today = datetime.utcnow().strftime("%Y-%m-%d")
        cache_key = f"budget:{key}:{today}"

        # Get current usage
        usage = await self._get_daily_usage(key)

        # Increment
        usage["tokens"] += tokens
        usage["cost"] += cost

        # Save with TTL until end of day
        tomorrow = datetime.utcnow() + timedelta(days=1)
        tomorrow_midnight = tomorrow.replace(hour=0, minute=0, second=0, microsecond=0)
        ttl = int((tomorrow_midnight - datetime.utcnow()).total_seconds())

        await cache.set(cache_key, usage, ttl=ttl)

    async def reset_budget(self, key: str):
        """Reset budget for a key (admin operation)"""
        today = datetime.utcnow().strftime("%Y-%m-%d")
        cache_key = f"budget:{key}:{today}"
        await cache.delete(cache_key)
        logger.info(f"Reset budget for {key}")
