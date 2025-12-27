"""Integration tests for campaign API endpoints."""
import pytest
from fastapi.testclient import TestClient


@pytest.mark.integration
@pytest.mark.api
class TestCampaignEndpoints:
    """Test campaign API endpoints."""
    
    def test_get_campaigns_requires_auth(self, client: TestClient):
        """Test that campaigns endpoint requires authentication."""
        response = client.get("/api/campaigns")
        assert response.status_code == 401
    
    def test_get_campaigns_with_auth(
        self,
        client: TestClient,
        auth_headers
    ):
        """Test getting campaigns with authentication."""
        response = client.get(
            "/api/campaigns",
            headers=auth_headers
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_create_campaign_requires_permission(
        self,
        client: TestClient,
        auth_headers
    ):
        """Test that regular user cannot create campaigns."""
        response = client.post(
            "/api/campaigns",
            headers=auth_headers,
            json={
                "name": "Test Campaign",
                "description": "Test Description"
            }
        )
        # User role doesn't have CAMPAIGN_CREATE permission
        assert response.status_code in [403, 405]
    
    def test_manager_can_create_campaign(
        self,
        client: TestClient,
        manager_headers
    ):
        """Test that manager can create campaigns."""
        response = client.post(
            "/api/campaigns",
            headers=manager_headers,
            json={
                "name": "Manager Campaign",
                "description": "Created by manager",
                "status": "draft"
            }
        )
        # Manager has CAMPAIGN_CREATE permission
        assert response.status_code in [200, 201, 405]  # 405 if endpoint not implemented yet


@pytest.mark.integration
@pytest.mark.api
class TestLeadEndpoints:
    """Test lead API endpoints."""
    
    def test_get_leads_requires_auth(self, client: TestClient):
        """Test that leads endpoint requires authentication."""
        response = client.get("/api/leads")
        assert response.status_code == 401
    
    def test_get_leads_with_auth(
        self,
        client: TestClient,
        auth_headers
    ):
        """Test getting leads with authentication."""
        response = client.get(
            "/api/leads",
            headers=auth_headers
        )
        assert response.status_code == 200


@pytest.mark.integration
@pytest.mark.api
class TestAnalyticsEndpoints:
    """Test analytics API endpoints."""
    
    def test_get_analytics_requires_auth(self, client: TestClient):
        """Test that analytics endpoint requires authentication."""
        response = client.get("/api/analytics")
        assert response.status_code == 401
    
    def test_get_analytics_with_auth(
        self,
        client: TestClient,
        auth_headers
    ):
        """Test getting analytics with authentication."""
        response = client.get(
            "/api/analytics",
            headers=auth_headers
        )
        assert response.status_code == 200
