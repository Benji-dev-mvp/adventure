"""Tests for health check API endpoints."""
import pytest
from fastapi.testclient import TestClient


@pytest.mark.integration
@pytest.mark.api
class TestHealthEndpoints:
    """Test health check endpoints."""
    
    def test_basic_health_check(self, client: TestClient):
        """Test basic health endpoint."""
        response = client.get("/api/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
    
    def test_detailed_health_check(self, client: TestClient):
        """Test detailed health endpoint."""
        response = client.get("/api/health/detailed")
        
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "system" in data
        assert "services" in data
        assert "cpu_percent" in data["system"]
        assert "memory_percent" in data["system"]
    
    def test_readiness_probe(self, client: TestClient):
        """Test Kubernetes readiness probe."""
        response = client.get("/api/health/readiness")
        
        assert response.status_code == 200
        data = response.json()
        assert "ready" in data
        assert "checks" in data
    
    def test_liveness_probe(self, client: TestClient):
        """Test Kubernetes liveness probe."""
        response = client.get("/api/health/liveness")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "alive"
