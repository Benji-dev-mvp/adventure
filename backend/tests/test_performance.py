"""Load tests for API performance benchmarking."""
import pytest
import asyncio
import time
from concurrent.futures import ThreadPoolExecutor
from fastapi.testclient import TestClient


@pytest.mark.slow
@pytest.mark.integration
class TestAPIPerformance:
    """Test API performance and load handling."""
    
    def test_health_check_response_time(self, client: TestClient):
        """Test that health check responds quickly."""
        start = time.time()
        response = client.get("/api/health")
        duration = time.time() - start
        
        assert response.status_code == 200
        assert duration < 0.1  # Should respond in under 100ms
    
    def test_concurrent_health_checks(self, client: TestClient):
        """Test handling concurrent health check requests."""
        def make_request():
            return client.get("/api/health").status_code
        
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(make_request) for _ in range(50)]
            results = [f.result() for f in futures]
        
        assert all(code == 200 for code in results)
    
    def test_auth_endpoint_load(self, client: TestClient, test_user):
        """Test authentication endpoint under load."""
        def login():
            return client.post(
                "/api/auth/login",
                json={
                    "email": "test@example.com",
                    "password": "testpassword123"
                }
            ).status_code
        
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(login) for _ in range(20)]
            results = [f.result() for f in futures]
        
        success_count = sum(1 for code in results if code == 200)
        assert success_count >= 15  # At least 75% success rate
