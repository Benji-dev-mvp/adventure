"""
Activity API Routes

REST API endpoints for querying and managing activity events.
Includes SSE endpoint for real-time updates.
"""

from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException, Request
from fastapi.responses import StreamingResponse
from sqlmodel import Session
import json
import asyncio
from collections import defaultdict

from app.core.db import get_session
from app.core.activity_store import ActivityStore
from app.models.activity import (
    ActivityEvent,
    ActivityEventCreate,
    ActivityEventRead,
    ActivityStats,
    EventType,
    EventSource,
    EventStatus,
    EventPriority,
)

router = APIRouter()

# SSE event subscribers (tenant_id -> list of queues)
sse_subscribers: dict[str, list[asyncio.Queue]] = defaultdict(list)


# Helper function to broadcast events to SSE subscribers
async def broadcast_event_delta(tenant_id: str, action: str, event: ActivityEvent):
    """Broadcast an event delta to all SSE subscribers for a tenant"""
    if tenant_id in sse_subscribers and sse_subscribers[tenant_id]:
        delta = {
            "action": action,
            "event": {
                "id": event.id,
                "tenantId": event.tenant_id,
                "type": event.type.value,
                "source": event.source.value,
                "status": event.status.value,
                "priority": event.priority.value,
                "sourceSystem": event.source_system,
                "sourceObjectId": event.source_object_id,
                "sourceObjectType": event.source_object_type,
                "title": event.title,
                "description": event.description,
                "metadata": event.metadata,
                "entityId": event.entity_id,
                "entityType": event.entity_type,
                "userId": event.user_id,
                "userName": event.user_name,
                "timestamp": event.timestamp.isoformat(),
                "createdAt": event.created_at.isoformat(),
                "expiresAt": event.expires_at.isoformat() if event.expires_at else None,
                "idempotencyKey": event.idempotency_key,
                "read": event.read,
                "readAt": event.read_at.isoformat() if event.read_at else None,
                "tags": event.tags,
                "correlationId": event.correlation_id,
            },
            "timestamp": datetime.utcnow().isoformat(),
        }
        
        # Send to all subscribers
        for queue in sse_subscribers[tenant_id]:
            try:
                await queue.put(delta)
            except:
                pass  # Ignore errors for disconnected clients


@router.post("/activities", response_model=ActivityEventRead, status_code=201)
def create_activity(
    event_data: ActivityEventCreate,
    session: Session = Depends(get_session)
):
    """
    Create a new activity event.
    
    This endpoint ingests events into the event spine with idempotency protection.
    """
    store = ActivityStore(session)
    event = store.create_event(event_data)
    
    # Broadcast to SSE subscribers (fire and forget)
    asyncio.create_task(broadcast_event_delta(event.tenant_id, "created", event))
    
    return event


@router.get("/activities/{event_id}", response_model=ActivityEventRead)
def get_activity(
    event_id: str,
    tenant_id: str = Query(..., description="Tenant ID for isolation"),
    session: Session = Depends(get_session)
):
    """Get a single activity event by ID"""
    store = ActivityStore(session)
    event = store.get_event(event_id, tenant_id)
    
    if not event:
        raise HTTPException(status_code=404, detail="Activity event not found")
    
    return event


@router.get("/activities")
def list_activities(
    tenant_id: str = Query(..., description="Tenant ID for isolation"),
    types: Optional[List[str]] = Query(None),
    sources: Optional[List[str]] = Query(None),
    statuses: Optional[List[str]] = Query(None),
    priorities: Optional[List[str]] = Query(None),
    entity_id: Optional[str] = Query(None),
    entity_type: Optional[str] = Query(None),
    user_id: Optional[str] = Query(None),
    read: Optional[bool] = Query(None),
    tags: Optional[List[str]] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(30, ge=1, le=100),
    sort_by: str = Query("timestamp"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    session: Session = Depends(get_session)
):
    """
    List activity events with comprehensive filtering and pagination.
    
    Returns paginated list of events matching the filters.
    """
    store = ActivityStore(session)
    
    # Convert string enums to enum types
    type_enums = [EventType(t) for t in types] if types else None
    source_enums = [EventSource(s) for s in sources] if sources else None
    status_enums = [EventStatus(s) for s in statuses] if statuses else None
    priority_enums = [EventPriority(p) for p in priorities] if priorities else None
    
    # Parse dates
    start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00')) if start_date else None
    end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00')) if end_date else None
    
    events, total = store.list_events(
        tenant_id=tenant_id,
        types=type_enums,
        sources=source_enums,
        statuses=status_enums,
        priorities=priority_enums,
        entity_id=entity_id,
        entity_type=entity_type,
        user_id=user_id,
        read=read,
        tags=tags,
        start_date=start_dt,
        end_date=end_dt,
        search=search,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    
    total_pages = (total + page_size - 1) // page_size
    
    return {
        "items": events,
        "total": total,
        "page": page,
        "pageSize": page_size,
        "totalPages": total_pages,
    }


@router.patch("/activities/{event_id}/read", response_model=ActivityEventRead)
def mark_activity_as_read(
    event_id: str,
    tenant_id: str = Query(..., description="Tenant ID for isolation"),
    session: Session = Depends(get_session)
):
    """Mark an activity as read"""
    store = ActivityStore(session)
    event = store.mark_as_read(event_id, tenant_id)
    
    if not event:
        raise HTTPException(status_code=404, detail="Activity event not found")
    
    # Broadcast update to SSE subscribers
    asyncio.create_task(broadcast_event_delta(tenant_id, "updated", event))
    
    return event


@router.patch("/activities/read-all")
def mark_all_activities_as_read(
    tenant_id: str = Query(..., description="Tenant ID for isolation"),
    session: Session = Depends(get_session)
):
    """Mark all unread activities as read for a tenant"""
    store = ActivityStore(session)
    count = store.mark_all_as_read(tenant_id)
    
    return {"marked_as_read": count}


@router.get("/activities/stats", response_model=ActivityStats)
def get_activity_stats(
    tenant_id: str = Query(..., description="Tenant ID for isolation"),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    session: Session = Depends(get_session)
):
    """Get activity statistics for a tenant"""
    store = ActivityStore(session)
    
    # Parse dates
    start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00')) if start_date else None
    end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00')) if end_date else None
    
    stats = store.get_stats(tenant_id, start_dt, end_dt)
    
    return stats


@router.get("/activities/stream")
async def stream_activity_updates(
    request: Request,
    tenant_id: str = Query(..., description="Tenant ID for isolation"),
):
    """
    SSE endpoint for real-time activity updates.
    
    Clients can subscribe to this endpoint to receive real-time event deltas
    (created, updated, deleted) as they occur.
    """
    # Create a queue for this client
    queue: asyncio.Queue = asyncio.Queue()
    
    # Register subscriber
    sse_subscribers[tenant_id].append(queue)
    
    async def event_generator():
        try:
            # Send initial connection message
            yield f"data: {json.dumps({'action': 'connected', 'timestamp': datetime.utcnow().isoformat()})}\n\n"
            
            # Stream events
            while True:
                # Check if client disconnected
                if await request.is_disconnected():
                    break
                
                try:
                    # Wait for new event with timeout
                    delta = await asyncio.wait_for(queue.get(), timeout=30.0)
                    yield f"data: {json.dumps(delta)}\n\n"
                except asyncio.TimeoutError:
                    # Send keepalive ping
                    yield f": keepalive\n\n"
        finally:
            # Cleanup on disconnect
            if queue in sse_subscribers[tenant_id]:
                sse_subscribers[tenant_id].remove(queue)
            
            # Remove tenant key if no more subscribers
            if tenant_id in sse_subscribers and not sse_subscribers[tenant_id]:
                del sse_subscribers[tenant_id]
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )
