"""
Multi-Tier Caching Strategy with Cache Warming and Predictive Invalidation.
L1: In-memory (LRU), L2: Redis, L3: Database (with write-through/write-back).
"""
import logging
from typing import Any, Optional, Callable, Dict, List
from functools import wraps, lru_cache
from datetime import datetime, timedelta
import asyncio
import hashlib
import pickle
from collections import OrderedDict
import time

from app.core.cache import cache as redis_cache

logger = logging.getLogger(__name__)


class LRUCache:
    """
    Thread-safe LRU cache (L1 - in-memory).
    Fastest access, limited size.
    """
    
    def __init__(self, max_size: int = 1000):
        self.cache: OrderedDict = OrderedDict()
        self.max_size = max_size
        self.hits = 0
        self.misses = 0
        self._lock = asyncio.Lock()
    
    async def get(self, key: str) -> Optional[Any]:
        """Get from cache, updating LRU order"""
        async with self._lock:
            if key in self.cache:
                # Move to end (most recently used)
                self.cache.move_to_end(key)
                self.hits += 1
                return self.cache[key]
            
            self.misses += 1
            return None
    
    async def set(self, key: str, value: Any) -> None:
        """Set value, evicting LRU item if full"""
        async with self._lock:
            if key in self.cache:
                self.cache.move_to_end(key)
            
            self.cache[key] = value
            
            # Evict LRU if over size
            if len(self.cache) > self.max_size:
                self.cache.popitem(last=False)
    
    async def delete(self, key: str) -> None:
        """Remove from cache"""
        async with self._lock:
            self.cache.pop(key, None)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        total = self.hits + self.misses
        return {
            "size": len(self.cache),
            "max_size": self.max_size,
            "hits": self.hits,
            "misses": self.misses,
            "hit_rate": self.hits / total if total > 0 else 0,
            "utilization": len(self.cache) / self.max_size
        }


class MultiTierCache:
    """
    Multi-tier caching system.
    L1: In-memory LRU (microseconds)
    L2: Redis (milliseconds)
    L3: Database (with write-through)
    """
    
    def __init__(self):
        self.l1 = LRUCache(max_size=1000)
        self.l2 = redis_cache
        # L3 is database - handled by ORM
        
        # Track access patterns for predictive invalidation
        self.access_patterns: Dict[str, List[datetime]] = {}
    
    async def get(self, key: str) -> Optional[Any]:
        """
        Get from cache with tier fallback.
        L1 -> L2 -> L3 (database)
        """
        # Try L1 (memory)
        value = await self.l1.get(key)
        if value is not None:
            logger.debug(f"L1 HIT: {key}")
            self._track_access(key)
            return value
        
        # Try L2 (Redis)
        value = self.l2.get(key)
        if value is not None:
            logger.debug(f"L2 HIT: {key}")
            # Promote to L1
            await self.l1.set(key, value)
            self._track_access(key)
            return value
        
        logger.debug(f"CACHE MISS: {key}")
        return None
    
    async def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None,
        write_through: bool = True
    ) -> None:
        """
        Set value in all tiers.
        write_through: immediately persist to all levels
        """
        # Set in L1
        await self.l1.set(key, value)
        
        # Set in L2 with TTL
        if ttl:
            self.l2.set(key, value, ttl=ttl)
        else:
            self.l2.set(key, value)
        
        logger.debug(f"CACHE SET: {key}")
    
    async def delete(self, key: str) -> None:
        """Delete from all tiers"""
        await self.l1.delete(key)
        self.l2.delete(key)
        logger.debug(f"CACHE DELETE: {key}")
    
    async def invalidate_pattern(self, pattern: str) -> int:
        """
        Invalidate all keys matching pattern.
        Example: invalidate_pattern("user:123:*")
        """
        count = 0
        
        # L1: check all keys
        keys_to_delete = [k for k in self.l1.cache.keys() if self._matches_pattern(k, pattern)]
        for key in keys_to_delete:
            await self.l1.delete(key)
            count += 1
        
        # L2: use Redis SCAN (in production)
        # For now, just delete exact match
        self.l2.delete(pattern)
        count += 1
        
        logger.info(f"Invalidated {count} keys matching {pattern}")
        return count
    
    def _matches_pattern(self, key: str, pattern: str) -> bool:
        """Simple pattern matching (* wildcard)"""
        if "*" not in pattern:
            return key == pattern
        
        parts = pattern.split("*")
        if len(parts) == 2:
            return key.startswith(parts[0]) and key.endswith(parts[1])
        
        return False
    
    def _track_access(self, key: str) -> None:
        """Track access patterns for predictive invalidation"""
        if key not in self.access_patterns:
            self.access_patterns[key] = []
        
        self.access_patterns[key].append(datetime.now())
        
        # Keep only recent accesses (last 100)
        self.access_patterns[key] = self.access_patterns[key][-100:]
    
    def get_hot_keys(self, top_n: int = 10) -> List[tuple[str, int]]:
        """
        Get most frequently accessed keys.
        Useful for cache warming.
        """
        access_counts = {
            key: len(accesses)
            for key, accesses in self.access_patterns.items()
        }
        
        sorted_keys = sorted(
            access_counts.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        return sorted_keys[:top_n]
    
    def predict_invalidation(self, key: str) -> Optional[datetime]:
        """
        Predict when key should be invalidated based on access patterns.
        Uses simple heuristic: if not accessed in 2x avg interval, invalidate.
        """
        if key not in self.access_patterns:
            return None
        
        accesses = self.access_patterns[key]
        if len(accesses) < 3:
            return None
        
        # Calculate average time between accesses
        intervals = [
            (accesses[i] - accesses[i-1]).total_seconds()
            for i in range(1, len(accesses))
        ]
        
        avg_interval = sum(intervals) / len(intervals)
        
        # Predict next invalidation
        last_access = accesses[-1]
        predicted_next = last_access + timedelta(seconds=avg_interval * 2)
        
        return predicted_next
    
    def get_stats(self) -> Dict[str, Any]:
        """Get comprehensive cache statistics"""
        return {
            "l1": self.l1.get_stats(),
            "hot_keys": self.get_hot_keys(5),
            "total_tracked_keys": len(self.access_patterns)
        }


class CacheWarmer:
    """
    Proactive cache warming based on predictive analytics.
    Pre-loads cache before high-traffic periods.
    """
    
    def __init__(self, cache: MultiTierCache):
        self.cache = cache
        self.warming_tasks: List[asyncio.Task] = []
    
    async def warm_hot_paths(self, query_func: Callable, keys: List[str]) -> None:
        """
        Warm cache for frequently accessed keys.
        
        Args:
            query_func: Function to fetch data if not cached
            keys: List of keys to warm
        """
        logger.info(f"Starting cache warming for {len(keys)} keys")
        
        async def warm_key(key: str):
            value = await self.cache.get(key)
            if value is None:
                # Fetch from database
                value = await query_func(key)
                if value is not None:
                    await self.cache.set(key, value, ttl=3600)
        
        # Warm in parallel (rate-limited)
        semaphore = asyncio.Semaphore(10)  # Max 10 concurrent
        
        async def rate_limited_warm(key: str):
            async with semaphore:
                await warm_key(key)
        
        tasks = [rate_limited_warm(key) for key in keys]
        await asyncio.gather(*tasks, return_exceptions=True)
        
        logger.info(f"Cache warming completed for {len(keys)} keys")
    
    async def schedule_warming(
        self,
        query_func: Callable,
        schedule_time: datetime,
        keys: List[str]
    ) -> None:
        """
        Schedule cache warming for specific time.
        Useful before known high-traffic periods (e.g., campaign launches).
        """
        now = datetime.now()
        delay = (schedule_time - now).total_seconds()
        
        if delay > 0:
            logger.info(f"Scheduled cache warming for {schedule_time}")
            await asyncio.sleep(delay)
        
        await self.warm_hot_paths(query_func, keys)


# Decorators for easy caching

def cached(
    ttl: int = 300,
    key_prefix: str = "",
    skip_cache_if: Optional[Callable] = None
):
    """
    Decorator for caching function results.
    
    Usage:
        @cached(ttl=600, key_prefix="user_profile")
        async def get_user_profile(user_id: int):
            return await fetch_from_db(user_id)
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = f"{key_prefix}:{func.__name__}:{args}:{kwargs}"
            cache_key_hash = hashlib.md5(cache_key.encode()).hexdigest()
            
            # Check if we should skip cache
            if skip_cache_if and skip_cache_if(*args, **kwargs):
                return await func(*args, **kwargs)
            
            # Try cache
            cached_value = await multi_tier_cache.get(cache_key_hash)
            if cached_value is not None:
                return cached_value
            
            # Execute function
            result = await func(*args, **kwargs)
            
            # Cache result
            await multi_tier_cache.set(cache_key_hash, result, ttl=ttl)
            
            return result
        return wrapper
    return decorator


def invalidate_on_write(key_pattern: str):
    """
    Decorator to invalidate cache on write operations.
    
    Usage:
        @invalidate_on_write("user:*")
        async def update_user(user_id: int, data: dict):
            ...
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            result = await func(*args, **kwargs)
            
            # Invalidate matching cache entries
            await multi_tier_cache.invalidate_pattern(key_pattern)
            
            return result
        return wrapper
    return decorator


# Global instances
multi_tier_cache = MultiTierCache()
cache_warmer = CacheWarmer(multi_tier_cache)


# Example usage functions

async def example_cached_query(lead_id: int) -> Dict[str, Any]:
    """Example of cached database query"""
    @cached(ttl=600, key_prefix="lead")
    async def _fetch_lead(lead_id: int):
        # Simulate DB query
        await asyncio.sleep(0.1)
        return {
            "id": lead_id,
            "name": f"Lead {lead_id}",
            "score": 75
        }
    
    return await _fetch_lead(lead_id)


async def warm_campaign_data(campaign_id: int):
    """Example: Warm cache before campaign launch"""
    async def fetch_campaign_leads(key: str):
        # Fetch leads for campaign
        lead_ids = [1, 2, 3, 4, 5]  # From DB
        return {"campaign_id": campaign_id, "leads": lead_ids}
    
    keys_to_warm = [f"campaign:{campaign_id}:leads"]
    await cache_warmer.warm_hot_paths(fetch_campaign_leads, keys_to_warm)
