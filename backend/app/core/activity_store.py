"""
Activity Store - Immutable Event Persistence Layer

This module provides the core persistence logic for the Activity Event Spine.
It ensures:
- Immutable event storage
- Idempotency (no duplicate events)
- Efficient querying with filters
- Multi-tenant isolation
"""

import hashlib
from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlmodel import Session, select, func, or_
from app.models.activity import (
    ActivityEvent,
    ActivityEventCreate,
    ActivityEventUpdate,
    EventType,
    EventSource,
    EventStatus,
    EventPriority,
    ActivityStats,
)
from app.core.security import sanitize_text
import uuid


def generate_idempotency_key(
    source_system: str,
    source_object_id: str,
    timestamp: datetime
) -> str:
    """
    Generate idempotency key for an event.
    This prevents duplicate events from the same source.
    """
    key_string = f"{source_system}:{source_object_id}:{timestamp.isoformat()}"
    return hashlib.sha256(key_string.encode()).hexdigest()


class ActivityStore:
    """
    Activity Store - Handles all persistence operations for activity events.
    """
    
    def __init__(self, session: Session):
        self.session = session
    
    def create_event(self, event_data: ActivityEventCreate) -> ActivityEvent:
        """
        Create a new activity event with idempotency protection.
        
        Args:
            event_data: Event creation data
            
        Returns:
            Created ActivityEvent
            
        Raises:
            ValueError: If event with same idempotency key already exists
        """
        # Generate idempotency key
        timestamp = event_data.timestamp or datetime.utcnow()
        idempotency_key = generate_idempotency_key(
            event_data.source_system,
            event_data.source_object_id,
            timestamp
        )
        
        # Check for existing event
        existing = self.session.exec(
            select(ActivityEvent).where(
                ActivityEvent.idempotency_key == idempotency_key
            )
        ).first()
        
        if existing:
            # Return existing event (idempotent operation)
            return existing
        
        # Sanitize text fields
        title = sanitize_text(event_data.title)
        description = sanitize_text(event_data.description)
        
        # Create new event
        event = ActivityEvent(
            id=str(uuid.uuid4()),
            tenant_id=event_data.tenant_id,
            type=event_data.type,
            source=event_data.source,
            source_system=event_data.source_system,
            source_object_id=event_data.source_object_id,
            source_object_type=event_data.source_object_type,
            title=title,
            description=description,
            metadata=event_data.metadata or {},
            entity_id=event_data.entity_id,
            entity_type=event_data.entity_type,
            user_id=event_data.user_id,
            user_name=event_data.user_name,
            timestamp=timestamp,
            priority=event_data.priority or EventPriority.MEDIUM,
            idempotency_key=idempotency_key,
            tags=event_data.tags or [],
            correlation_id=event_data.correlation_id,
            created_at=datetime.utcnow(),
        )
        
        self.session.add(event)
        self.session.commit()
        self.session.refresh(event)
        
        return event
    
    def get_event(self, event_id: str, tenant_id: str) -> Optional[ActivityEvent]:
        """
        Get a single event by ID with tenant isolation.
        
        Args:
            event_id: Event ID
            tenant_id: Tenant ID for isolation
            
        Returns:
            ActivityEvent if found, None otherwise
        """
        return self.session.exec(
            select(ActivityEvent).where(
                ActivityEvent.id == event_id,
                ActivityEvent.tenant_id == tenant_id
            )
        ).first()
    
    def list_events(
        self,
        tenant_id: str,
        types: Optional[List[EventType]] = None,
        sources: Optional[List[EventSource]] = None,
        statuses: Optional[List[EventStatus]] = None,
        priorities: Optional[List[EventPriority]] = None,
        entity_id: Optional[str] = None,
        entity_type: Optional[str] = None,
        user_id: Optional[str] = None,
        read: Optional[bool] = None,
        tags: Optional[List[str]] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        search: Optional[str] = None,
        page: int = 1,
        page_size: int = 30,
        sort_by: str = "timestamp",
        sort_order: str = "desc",
    ) -> tuple[List[ActivityEvent], int]:
        """
        List events with comprehensive filtering and pagination.
        
        Args:
            tenant_id: Required tenant ID for isolation
            ... (see parameters above)
            
        Returns:
            Tuple of (events, total_count)
        """
        # Build base query with tenant isolation
        query = select(ActivityEvent).where(ActivityEvent.tenant_id == tenant_id)
        
        # Apply filters
        if types:
            query = query.where(ActivityEvent.type.in_(types))
        
        if sources:
            query = query.where(ActivityEvent.source.in_(sources))
        
        if statuses:
            query = query.where(ActivityEvent.status.in_(statuses))
        
        if priorities:
            query = query.where(ActivityEvent.priority.in_(priorities))
        
        if entity_id:
            query = query.where(ActivityEvent.entity_id == entity_id)
        
        if entity_type:
            query = query.where(ActivityEvent.entity_type == entity_type)
        
        if user_id:
            query = query.where(ActivityEvent.user_id == user_id)
        
        if read is not None:
            query = query.where(ActivityEvent.read == read)
        
        if tags:
            # Filter events that have any of the specified tags
            for tag in tags:
                query = query.where(ActivityEvent.tags.contains([tag]))
        
        if start_date:
            query = query.where(ActivityEvent.timestamp >= start_date)
        
        if end_date:
            query = query.where(ActivityEvent.timestamp <= end_date)
        
        if search:
            # Full-text search on title and description
            search_pattern = f"%{search}%"
            query = query.where(
                or_(
                    ActivityEvent.title.ilike(search_pattern),
                    ActivityEvent.description.ilike(search_pattern)
                )
            )
        
        # Get total count before pagination
        count_query = select(func.count()).select_from(query.subquery())
        total = self.session.exec(count_query).one()
        
        # Apply sorting
        if sort_order == "asc":
            query = query.order_by(getattr(ActivityEvent, sort_by).asc())
        else:
            query = query.order_by(getattr(ActivityEvent, sort_by).desc())
        
        # Apply pagination
        offset = (page - 1) * page_size
        query = query.offset(offset).limit(page_size)
        
        # Execute query
        events = self.session.exec(query).all()
        
        return list(events), total
    
    def mark_as_read(self, event_id: str, tenant_id: str) -> Optional[ActivityEvent]:
        """
        Mark an event as read.
        
        Args:
            event_id: Event ID
            tenant_id: Tenant ID for isolation
            
        Returns:
            Updated ActivityEvent if found, None otherwise
        """
        event = self.get_event(event_id, tenant_id)
        if event:
            event.read = True
            event.read_at = datetime.utcnow()
            self.session.add(event)
            self.session.commit()
            self.session.refresh(event)
        return event
    
    def mark_all_as_read(self, tenant_id: str) -> int:
        """
        Mark all unread events as read for a tenant.
        
        Args:
            tenant_id: Tenant ID
            
        Returns:
            Number of events marked as read
        """
        query = select(ActivityEvent).where(
            ActivityEvent.tenant_id == tenant_id,
            ActivityEvent.read == False
        )
        events = self.session.exec(query).all()
        
        count = 0
        now = datetime.utcnow()
        for event in events:
            event.read = True
            event.read_at = now
            self.session.add(event)
            count += 1
        
        self.session.commit()
        return count
    
    def get_stats(
        self,
        tenant_id: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> ActivityStats:
        """
        Get activity statistics for a tenant.
        
        Args:
            tenant_id: Tenant ID
            start_date: Optional start date filter
            end_date: Optional end date filter
            
        Returns:
            ActivityStats
        """
        query = select(ActivityEvent).where(ActivityEvent.tenant_id == tenant_id)
        
        if start_date:
            query = query.where(ActivityEvent.timestamp >= start_date)
        
        if end_date:
            query = query.where(ActivityEvent.timestamp <= end_date)
        
        events = self.session.exec(query).all()
        
        # Calculate stats
        total = len(events)
        unread = sum(1 for e in events if not e.read)
        
        by_type: Dict[str, int] = {}
        by_source: Dict[str, int] = {}
        by_priority: Dict[str, int] = {}
        
        for event in events:
            # Count by type
            type_key = event.type.value
            by_type[type_key] = by_type.get(type_key, 0) + 1
            
            # Count by source
            source_key = event.source.value
            by_source[source_key] = by_source.get(source_key, 0) + 1
            
            # Count by priority
            priority_key = event.priority.value
            by_priority[priority_key] = by_priority.get(priority_key, 0) + 1
        
        return ActivityStats(
            total=total,
            unread=unread,
            by_type=by_type,
            by_source=by_source,
            by_priority=by_priority,
        )
