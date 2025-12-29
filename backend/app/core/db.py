import logging
from contextlib import asynccontextmanager, contextmanager
from typing import AsyncIterator, Iterator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import Session, SQLModel, create_engine, select

from app.core.config import settings
from app.models.schemas import Campaign, Lead

logger = logging.getLogger(__name__)

_engine_kwargs = {
    "echo": False,
    "pool_size": settings.db_pool_size,
    "max_overflow": settings.db_max_overflow,
    "pool_timeout": settings.db_pool_timeout,
    "pool_pre_ping": True,  # Verify connections before use
}

if settings.database_url.startswith("sqlite"):
    # SQLite-specific settings
    _engine_kwargs["connect_args"] = {"check_same_thread": False}
    # SQLite doesn't support pool_size
    _engine_kwargs.pop("pool_size", None)
    _engine_kwargs.pop("max_overflow", None)
    _engine_kwargs.pop("pool_timeout", None)
    _engine_kwargs.pop("pool_pre_ping", None)

engine = create_engine(settings.database_url, **_engine_kwargs)

# Async engine for future async operations
if settings.database_url.startswith("sqlite"):
    async_db_url = settings.database_url.replace("sqlite:///", "sqlite+aiosqlite:///")
else:
    async_db_url = settings.database_url.replace("postgresql://", "postgresql+asyncpg://")

async_engine = create_async_engine(async_db_url, echo=False)
AsyncSessionLocal = sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)


@contextmanager
def get_session() -> Iterator[Session]:
    session = Session(engine)
    try:
        yield session
    finally:
        session.close()


@asynccontextmanager
async def get_async_session() -> AsyncIterator[AsyncSession]:
    """Async session for non-blocking DB operations."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


def init_db() -> None:
    logger.info("Initializing database tables")
    SQLModel.metadata.create_all(engine)


def seed_if_empty() -> None:
    with Session(engine) as session:
        has_leads = session.exec(select(Lead).limit(1)).first()
        has_campaigns = session.exec(select(Campaign).limit(1)).first()

        if not has_leads:
            session.add_all(
                [
                    Lead(
                        id=1,
                        name="Alice Johnson",
                        email="alice@example.com",
                        status="new",
                    ),
                    Lead(
                        id=2,
                        name="Bob Smith",
                        email="bob@example.com",
                        status="contacted",
                    ),
                    Lead(
                        id=3,
                        name="Charlie Brown",
                        email="charlie@example.com",
                        status="qualified",
                    ),
                ]
            )

        if not has_campaigns:
            session.add_all(
                [
                    Campaign(
                        id=1,
                        name="Holiday Promo",
                        objective="Increase sales",
                        active=True,
                    ),
                    Campaign(
                        id=2,
                        name="Referral Drive",
                        objective="Grow referrals",
                        active=False,
                    ),
                ]
            )
        session.commit()
