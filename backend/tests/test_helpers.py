"""
Comprehensive test utilities and helpers for backend testing
"""
import pytest
import jwt
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from fastapi.testclient import TestClient
from sqlmodel import Session, create_engine, SQLModel
from sqlalchemy.pool import StaticPool

from app.core.config import settings
from app.models.user import User, UserRole


class TestDatabase:
    """Test database helper"""
    
    @staticmethod
    def get_test_engine():
        """Create in-memory SQLite engine for testing"""
        return create_engine(
            "sqlite:///:memory:",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
    
    @staticmethod
    def init_test_db(engine):
        """Initialize test database with tables"""
        SQLModel.metadata.create_all(engine)
    
    @staticmethod
    def get_test_session(engine):
        """Get test database session"""
        return Session(engine)


class TestAuth:
    """Authentication helpers for testing"""
    
    @staticmethod
    def create_test_token(
        user_id: int = 1,
        email: str = "test@example.com",
        role: str = "user",
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Create a test JWT token"""
        if expires_delta is None:
            expires_delta = timedelta(hours=1)
        
        expire = datetime.utcnow() + expires_delta
        token_data = {
            "sub": str(user_id),
            "email": email,
            "role": role,
            "exp": expire
        }
        
        return jwt.encode(
            token_data,
            settings.secret_key,
            algorithm="HS256"
        )
    
    @staticmethod
    def get_auth_headers(
        user_id: int = 1,
        email: str = "test@example.com",
        role: str = "user"
    ) -> Dict[str, str]:
        """Get authorization headers with test token"""
        token = TestAuth.create_test_token(user_id, email, role)
        return {"Authorization": f"Bearer {token}"}
    
    @staticmethod
    def create_test_user(
        user_id: int = 1,
        email: str = "test@example.com",
        name: str = "Test User",
        role: UserRole = UserRole.USER
    ) -> User:
        """Create a test user object"""
        return User(
            id=user_id,
            email=email,
            name=name,
            role=role,
            is_active=True,
            created_at=datetime.utcnow()
        )


class APITestHelper:
    """Helper for API testing"""
    
    def __init__(self, client: TestClient):
        self.client = client
    
    def get(self, url: str, auth: bool = False, **kwargs) -> Any:
        """Make authenticated GET request"""
        if auth:
            kwargs['headers'] = TestAuth.get_auth_headers()
        return self.client.get(url, **kwargs)
    
    def post(self, url: str, auth: bool = False, **kwargs) -> Any:
        """Make authenticated POST request"""
        if auth:
            if 'headers' not in kwargs:
                kwargs['headers'] = {}
            kwargs['headers'].update(TestAuth.get_auth_headers())
        return self.client.post(url, **kwargs)
    
    def put(self, url: str, auth: bool = False, **kwargs) -> Any:
        """Make authenticated PUT request"""
        if auth:
            if 'headers' not in kwargs:
                kwargs['headers'] = {}
            kwargs['headers'].update(TestAuth.get_auth_headers())
        return self.client.put(url, **kwargs)
    
    def delete(self, url: str, auth: bool = False, **kwargs) -> Any:
        """Make authenticated DELETE request"""
        if auth:
            if 'headers' not in kwargs:
                kwargs['headers'] = {}
            kwargs['headers'].update(TestAuth.get_auth_headers())
        return self.client.delete(url, **kwargs)


class MockData:
    """Mock data generators for testing"""
    
    @staticmethod
    def create_lead_data(overrides: Optional[Dict] = None) -> Dict:
        """Create mock lead data"""
        data = {
            "name": "John Doe",
            "email": "john@example.com",
            "company": "Test Corp",
            "phone": "+1234567890",
            "status": "new"
        }
        if overrides:
            data.update(overrides)
        return data
    
    @staticmethod
    def create_campaign_data(overrides: Optional[Dict] = None) -> Dict:
        """Create mock campaign data"""
        data = {
            "name": "Test Campaign",
            "objective": "Increase sales",
            "type": "email",
            "status": "draft"
        }
        if overrides:
            data.update(overrides)
        return data
    
    @staticmethod
    def create_user_data(overrides: Optional[Dict] = None) -> Dict:
        """Create mock user data"""
        data = {
            "email": "user@example.com",
            "name": "Test User",
            "password": "SecurePass123!",
            "role": "user"
        }
        if overrides:
            data.update(overrides)
        return data


@pytest.fixture
def test_db():
    """Fixture for test database"""
    engine = TestDatabase.get_test_engine()
    TestDatabase.init_test_db(engine)
    session = TestDatabase.get_test_session(engine)
    yield session
    session.close()


@pytest.fixture
def auth_headers():
    """Fixture for auth headers"""
    return TestAuth.get_auth_headers()


@pytest.fixture
def admin_headers():
    """Fixture for admin auth headers"""
    return TestAuth.get_auth_headers(role="admin")


@pytest.fixture
def api_helper(client):
    """Fixture for API test helper"""
    return APITestHelper(client)


# Performance testing helpers
class PerformanceAssertion:
    """Assert performance requirements"""
    
    @staticmethod
    def assert_response_time(duration: float, max_seconds: float = 1.0):
        """Assert response time is within acceptable range"""
        assert duration < max_seconds, (
            f"Response time {duration:.3f}s exceeds limit of {max_seconds}s"
        )
    
    @staticmethod
    def assert_memory_usage(current_mb: float, max_mb: float = 500):
        """Assert memory usage is within acceptable range"""
        assert current_mb < max_mb, (
            f"Memory usage {current_mb:.1f}MB exceeds limit of {max_mb}MB"
        )
