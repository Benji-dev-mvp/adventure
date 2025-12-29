"""
Pagination and filtering utilities for API endpoints.
"""

from math import ceil
from typing import Any, Dict, Generic, List, Optional, TypeVar

from pydantic import BaseModel, Field
from sqlalchemy import func, or_
from sqlmodel import Select, Session, select

T = TypeVar("T")


class PaginationParams(BaseModel):
    """Standard pagination parameters"""

    page: int = Field(default=1, ge=1, description="Page number (1-indexed)")
    limit: int = Field(default=20, ge=1, le=100, description="Items per page")
    offset: int = Field(default=0, ge=0, description="Items to skip")
    sort_by: Optional[str] = Field(default=None, description="Field to sort by")
    sort_order: str = Field(default="asc", description="Sort order: asc or desc")

    @classmethod
    def from_query(
        cls,
        page: int = 1,
        limit: int = 20,
        sort_by: Optional[str] = None,
        sort_order: str = "asc",
    ):
        """Create from query parameters"""
        offset = (page - 1) * limit
        return cls(
            page=page,
            limit=limit,
            offset=offset,
            sort_by=sort_by,
            sort_order=sort_order,
        )


class PageInfo(BaseModel):
    """Pagination metadata"""

    total_items: int
    total_pages: int
    current_page: int
    items_per_page: int
    has_next: bool
    has_previous: bool


class PaginatedResponse(BaseModel, Generic[T]):
    """Standard paginated response envelope"""

    data: List[T]
    page_info: PageInfo


class CursorParams(BaseModel):
    """Cursor-based pagination for large datasets"""

    cursor: Optional[str] = Field(default=None, description="Cursor for next page")
    limit: int = Field(default=20, ge=1, le=100, description="Items per page")


class FilterBuilder:
    """Dynamic query filter builder"""

    @staticmethod
    def build_filters(model_class, filters: Dict[str, Any]) -> List:
        """
        Build SQLAlchemy filters from dictionary.

        Supports:
        - Equality: {"status": "active"}
        - IN: {"status__in": ["active", "pending"]}
        - Range: {"created_at__gte": "2024-01-01", "created_at__lte": "2024-12-31"}
        - LIKE: {"name__contains": "john"}
        - NULL checks: {"email__isnull": True}
        """
        conditions = []

        for key, value in filters.items():
            if "__" in key:
                field_name, operator = key.rsplit("__", 1)
                field = getattr(model_class, field_name, None)

                if field is None:
                    continue

                if operator == "in" and isinstance(value, list):
                    conditions.append(field.in_(value))
                elif operator == "gte":
                    conditions.append(field >= value)
                elif operator == "lte":
                    conditions.append(field <= value)
                elif operator == "gt":
                    conditions.append(field > value)
                elif operator == "lt":
                    conditions.append(field < value)
                elif operator == "contains":
                    conditions.append(field.like(f"%{value}%"))
                elif operator == "startswith":
                    conditions.append(field.like(f"{value}%"))
                elif operator == "endswith":
                    conditions.append(field.like(f"%{value}"))
                elif operator == "isnull":
                    conditions.append(field.is_(None) if value else field.isnot(None))
            else:
                # Simple equality
                field = getattr(model_class, key, None)
                if field is not None:
                    conditions.append(field == value)

        return conditions

    @staticmethod
    def search_fields(model_class, search: str, fields: List[str]) -> List:
        """
        Create OR conditions for searching across multiple fields.

        Example: search_fields(Lead, "john", ["name", "email", "company"])
        """
        conditions = []
        for field_name in fields:
            field = getattr(model_class, field_name, None)
            if field is not None:
                conditions.append(field.like(f"%{search}%"))
        return [or_(*conditions)] if conditions else []


def paginate(
    session: Session, query: Select, params: PaginationParams, model_class: type = None
) -> tuple[List[Any], PageInfo]:
    """
    Apply pagination to a SQLModel query and return results with metadata.

    Args:
        session: Database session
        query: SQLModel select query
        params: Pagination parameters
        model_class: Model class for sorting (optional)

    Returns:
        Tuple of (results, page_info)
    """
    # Get total count
    count_query = select(func.count()).select_from(query.alias())
    total_items = session.exec(count_query).one()

    # Apply sorting
    if params.sort_by and model_class:
        sort_field = getattr(model_class, params.sort_by, None)
        if sort_field is not None:
            if params.sort_order.lower() == "desc":
                query = query.order_by(sort_field.desc())
            else:
                query = query.order_by(sort_field.asc())

    # Apply pagination
    query = query.offset(params.offset).limit(params.limit)
    results = session.exec(query).all()

    # Calculate metadata
    total_pages = ceil(total_items / params.limit) if params.limit > 0 else 0

    page_info = PageInfo(
        total_items=total_items,
        total_pages=total_pages,
        current_page=params.page,
        items_per_page=params.limit,
        has_next=params.page < total_pages,
        has_previous=params.page > 1,
    )

    return results, page_info


def paginate_response(
    session: Session, query: Select, params: PaginationParams, model_class: type = None
) -> PaginatedResponse:
    """
    Convenience function that returns a complete PaginatedResponse.
    """
    results, page_info = paginate(session, query, params, model_class)
    return PaginatedResponse(data=results, page_info=page_info)
