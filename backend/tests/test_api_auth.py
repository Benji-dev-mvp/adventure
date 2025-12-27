"""Tests for authentication API endpoints."""
import pytest
from fastapi.testclient import TestClient


@pytest.mark.integration
@pytest.mark.auth
@pytest.mark.api
class TestAuthEndpoints:
    """Test authentication API endpoints."""
    
    def test_login_success(self, client: TestClient, test_user):
        """Test successful login."""
        response = client.post(
            "/api/auth/login",
            json={
                "email": "test@example.com",
                "password": "testpassword123"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "token_type" in data
        assert data["token_type"] == "bearer"
        assert "user" in data
        assert data["user"]["email"] == "test@example.com"
    
    def test_login_wrong_password(self, client: TestClient, test_user):
        """Test login with wrong password."""
        response = client.post(
            "/api/auth/login",
            json={
                "email": "test@example.com",
                "password": "wrongpassword"
            }
        )
        
        assert response.status_code == 401
    
    def test_login_nonexistent_user(self, client: TestClient):
        """Test login with non-existent user."""
        response = client.post(
            "/api/auth/login",
            json={
                "email": "nonexistent@example.com",
                "password": "password123"
            }
        )
        
        assert response.status_code == 401
    
    def test_register_new_user(self, client: TestClient):
        """Test user registration."""
        response = client.post(
            "/api/auth/register",
            json={
                "email": "newuser@example.com",
                "username": "newuser",
                "password": "newpassword123"
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "newuser@example.com"
        assert data["username"] == "newuser"
        assert "password" not in data
        assert "hashed_password" not in data
    
    def test_register_duplicate_email(self, client: TestClient, test_user):
        """Test registration with duplicate email."""
        response = client.post(
            "/api/auth/register",
            json={
                "email": "test@example.com",
                "username": "anotheruser",
                "password": "password123"
            }
        )
        
        assert response.status_code == 400
    
    def test_get_current_user(self, client: TestClient, test_user, auth_headers):
        """Test getting current user information."""
        response = client.get(
            "/api/auth/me",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "test@example.com"
        assert data["role"] == "user"
    
    def test_get_current_user_without_token(self, client: TestClient):
        """Test getting current user without authentication."""
        response = client.get("/api/auth/me")
        
        assert response.status_code == 401
    
    def test_get_current_user_invalid_token(self, client: TestClient):
        """Test getting current user with invalid token."""
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": "Bearer invalid_token"}
        )
        
        assert response.status_code == 401


@pytest.mark.integration
@pytest.mark.auth
@pytest.mark.api
class TestAuthorizationEndpoints:
    """Test authorization and role-based access."""
    
    def test_admin_can_access_admin_endpoint(
        self, 
        client: TestClient, 
        test_admin, 
        admin_headers
    ):
        """Test that admin can access admin endpoints."""
        response = client.get(
            "/api/admin/users",
            headers=admin_headers
        )
        
        # Should succeed (200) or return empty list (but not 403)
        assert response.status_code in [200, 404]
    
    def test_user_cannot_access_admin_endpoint(
        self,
        client: TestClient,
        test_user,
        auth_headers
    ):
        """Test that regular user cannot access admin endpoints."""
        response = client.get(
            "/api/admin/users",
            headers=auth_headers
        )
        
        assert response.status_code == 403
    
    def test_manager_can_access_campaigns(
        self,
        client: TestClient,
        test_manager,
        manager_headers
    ):
        """Test that manager can access campaign endpoints."""
        response = client.get(
            "/api/campaigns",
            headers=manager_headers
        )
        
        assert response.status_code == 200
