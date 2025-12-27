"""Tests for security module."""
import pytest
from datetime import timedelta
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    decode_access_token,
)
from app.models.user import User, UserRole
from app.models.schemas import Permission


@pytest.mark.unit
@pytest.mark.security
class TestPasswordHashing:
    """Test password hashing and verification."""
    
    def test_password_hashing(self):
        """Test that password hashing works correctly."""
        password = "mysecurepassword123"
        hashed = get_password_hash(password)
        
        assert hashed != password
        assert verify_password(password, hashed)
    
    def test_password_verification_fails_with_wrong_password(self):
        """Test that verification fails with wrong password."""
        password = "mysecurepassword123"
        wrong_password = "wrongpassword"
        hashed = get_password_hash(password)
        
        assert not verify_password(wrong_password, hashed)
    
    def test_different_hashes_for_same_password(self):
        """Test that same password generates different hashes (salt)."""
        password = "mysecurepassword123"
        hash1 = get_password_hash(password)
        hash2 = get_password_hash(password)
        
        assert hash1 != hash2
        assert verify_password(password, hash1)
        assert verify_password(password, hash2)


@pytest.mark.unit
@pytest.mark.security
class TestJWTTokens:
    """Test JWT token creation and validation."""
    
    def test_create_access_token(self):
        """Test access token creation."""
        data = {"sub": "test@example.com"}
        token = create_access_token(data)
        
        assert isinstance(token, str)
        assert len(token) > 0
    
    def test_decode_access_token(self):
        """Test access token decoding."""
        email = "test@example.com"
        data = {"sub": email}
        token = create_access_token(data)
        
        decoded = decode_access_token(token)
        assert decoded["sub"] == email
    
    def test_token_with_expiration(self):
        """Test token with custom expiration."""
        data = {"sub": "test@example.com"}
        token = create_access_token(data, expires_delta=timedelta(minutes=5))
        
        decoded = decode_access_token(token)
        assert "exp" in decoded
    
    def test_invalid_token_raises_error(self):
        """Test that invalid token raises error."""
        invalid_token = "invalid.token.here"
        
        with pytest.raises(Exception):
            decode_access_token(invalid_token)


@pytest.mark.unit
@pytest.mark.security
class TestRBACPermissions:
    """Test Role-Based Access Control."""
    
    def test_admin_has_all_permissions(self):
        """Test that admin role has all permissions."""
        user = User(
            email="admin@example.com",
            username="admin",
            role=UserRole.ADMIN,
            hashed_password="hashed"
        )
        
        # Admin should have all permissions
        assert user.has_permission(Permission.CAMPAIGN_CREATE)
        assert user.has_permission(Permission.USER_DELETE)
        assert user.has_permission(Permission.SYSTEM_SETTINGS)
    
    def test_manager_permissions(self):
        """Test manager role permissions."""
        user = User(
            email="manager@example.com",
            username="manager",
            role=UserRole.MANAGER,
            hashed_password="hashed"
        )
        
        # Manager should have campaign and lead permissions
        assert user.has_permission(Permission.CAMPAIGN_CREATE)
        assert user.has_permission(Permission.LEAD_UPDATE)
        
        # Manager should NOT have user management permissions
        assert not user.has_permission(Permission.USER_DELETE)
        assert not user.has_permission(Permission.SYSTEM_SETTINGS)
    
    def test_user_permissions(self):
        """Test basic user permissions."""
        user = User(
            email="user@example.com",
            username="user",
            role=UserRole.USER,
            hashed_password="hashed"
        )
        
        # User should have read permissions only
        assert user.has_permission(Permission.CAMPAIGN_READ)
        assert user.has_permission(Permission.LEAD_READ)
        
        # User should NOT have write permissions
        assert not user.has_permission(Permission.CAMPAIGN_CREATE)
        assert not user.has_permission(Permission.CAMPAIGN_DELETE)
        assert not user.has_permission(Permission.USER_DELETE)
    
    def test_has_all_permissions(self):
        """Test checking multiple permissions at once."""
        admin = User(
            email="admin@example.com",
            username="admin",
            role=UserRole.ADMIN,
            hashed_password="hashed"
        )
        
        user = User(
            email="user@example.com",
            username="user",
            role=UserRole.USER,
            hashed_password="hashed"
        )
        
        # Admin has all permissions
        assert admin.has_all_permissions([
            Permission.CAMPAIGN_CREATE,
            Permission.USER_DELETE,
            Permission.SYSTEM_SETTINGS
        ])
        
        # User doesn't have all these permissions
        assert not user.has_all_permissions([
            Permission.CAMPAIGN_CREATE,
            Permission.USER_DELETE
        ])
