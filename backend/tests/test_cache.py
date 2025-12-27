"""Tests for caching module."""
import pytest
from app.core.cache import cache


@pytest.mark.unit
@pytest.mark.cache
class TestCache:
    """Test cache functionality."""
    
    def test_cache_set_and_get(self, clear_cache):
        """Test setting and getting cache values."""
        cache.set("test_key", "test_value")
        value = cache.get("test_key")
        
        assert value == "test_value"
    
    def test_cache_get_nonexistent_key(self, clear_cache):
        """Test getting non-existent key returns None."""
        value = cache.get("nonexistent_key")
        
        assert value is None
    
    def test_cache_delete(self, clear_cache):
        """Test deleting cache key."""
        cache.set("test_key", "test_value")
        cache.delete("test_key")
        value = cache.get("test_key")
        
        assert value is None
    
    def test_cache_ttl(self, clear_cache):
        """Test cache with TTL."""
        cache.set("test_key", "test_value", ttl=1)
        value = cache.get("test_key")
        
        assert value == "test_value"
        
        # After TTL expires, value should be None
        import time
        time.sleep(2)
        value = cache.get("test_key")
        assert value is None
    
    def test_cache_clear(self, clear_cache):
        """Test clearing all cache."""
        cache.set("key1", "value1")
        cache.set("key2", "value2")
        
        cache.clear()
        
        assert cache.get("key1") is None
        assert cache.get("key2") is None
    
    def test_cache_with_dict(self, clear_cache):
        """Test caching dictionary objects."""
        data = {"name": "John", "age": 30}
        cache.set("user_data", data)
        
        retrieved = cache.get("user_data")
        assert retrieved == data
        assert retrieved["name"] == "John"
    
    def test_cache_with_list(self, clear_cache):
        """Test caching list objects."""
        data = [1, 2, 3, 4, 5]
        cache.set("numbers", data)
        
        retrieved = cache.get("numbers")
        assert retrieved == data
        assert len(retrieved) == 5
