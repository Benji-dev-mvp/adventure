"""Simple in-memory cache with TTL support."""
import time
import logging
from typing import Any, Optional
from threading import Lock

logger = logging.getLogger(__name__)


class SimpleCache:
    """Thread-safe in-memory cache with TTL. For production, use Redis."""
    
    def __init__(self):
        self._cache = {}
        self._lock = Lock()
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache if not expired."""
        with self._lock:
            if key in self._cache:
                value, expiry = self._cache[key]
                if expiry is None or time.time() < expiry:
                    return value
                else:
                    del self._cache[key]
        return None
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Set value in cache with optional TTL in seconds."""
        expiry = None if ttl is None else time.time() + ttl
        with self._lock:
            self._cache[key] = (value, expiry)
    
    def delete(self, key: str) -> None:
        """Remove key from cache."""
        with self._lock:
            self._cache.pop(key, None)
    
    def clear(self) -> None:
        """Clear all cached values."""
        with self._lock:
            count = len(self._cache)
            self._cache.clear()
            logger.info(f"Cleared {count} cached items")
    
    def cleanup_expired(self) -> int:
        """Remove expired entries and return count removed."""
        with self._lock:
            now = time.time()
            expired = [k for k, (_, exp) in self._cache.items() if exp and exp < now]
            for k in expired:
                del self._cache[k]
            return len(expired)


cache = SimpleCache()
