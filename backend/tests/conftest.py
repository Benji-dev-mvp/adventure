"""Pytest configuration and fixtures."""
import asyncio
import pytest
from typing import Generator, AsyncGenerator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.db import Base, get_session
from app.core.cache import cache
from app.models.user import User, UserRole
from app.core.security import get_password_hash, create_access_token


# Test database setup
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
def db_session() -> Generator:
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session) -> Generator:
    """Create a test client with dependency overrides."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_session] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(db_session) -> User:
    """Create a test user."""
    user = User(
        email="test@example.com",
        username="testuser",
        hashed_password=get_password_hash("testpassword123"),
        role=UserRole.USER,
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def test_admin(db_session) -> User:
    """Create a test admin user."""
    admin = User(
        email="admin@example.com",
        username="admin",
        hashed_password=get_password_hash("adminpassword123"),
        role=UserRole.ADMIN,
        is_active=True,
    )
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)
    return admin


@pytest.fixture
def test_manager(db_session) -> User:
    """Create a test manager user."""
    manager = User(
        email="manager@example.com",
        username="manager",
        hashed_password=get_password_hash("managerpassword123"),
        role=UserRole.MANAGER,
        is_active=True,
    )
    db_session.add(manager)
    db_session.commit()
    db_session.refresh(manager)
    return manager


@pytest.fixture
def user_token(test_user) -> str:
    """Generate JWT token for test user."""
    return create_access_token(data={"sub": test_user.email})


@pytest.fixture
def admin_token(test_admin) -> str:
    """Generate JWT token for test admin."""
    return create_access_token(data={"sub": test_admin.email})


@pytest.fixture
def manager_token(test_manager) -> str:
    """Generate JWT token for test manager."""
    return create_access_token(data={"sub": test_manager.email})


@pytest.fixture(scope="function")
def clear_cache():
    """Clear cache before and after each test."""
    cache.clear()
    yield
    cache.clear()


@pytest.fixture
def auth_headers(user_token) -> dict:
    """Return authorization headers for test user."""
    return {"Authorization": f"Bearer {user_token}"}


@pytest.fixture
def admin_headers(admin_token) -> dict:
    """Return authorization headers for admin user."""
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture
def manager_headers(manager_token) -> dict:
    """Return authorization headers for manager user."""
    return {"Authorization": f"Bearer {manager_token}"}
