"""Base model with common fields for all database models."""
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class BaseDBModel(SQLModel):
    """Base model with common fields."""
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    deleted_at: Optional[datetime] = None
    is_deleted: bool = Field(default=False, index=True)
