"""
Event Sourcing & CQRS (Command Query Responsibility Segregation) Pattern.
Immutable event log with event replay capabilities and optimized read models.
"""

import asyncio
import logging
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from functools import wraps
from typing import Any, Callable, Dict, List, Optional

from app.core.cache import cache
from app.core.db import get_session

logger = logging.getLogger(__name__)


class EventType(str, Enum):
    """Domain event types"""

    # Lead events
    LEAD_CREATED = "lead.created"
    LEAD_UPDATED = "lead.updated"
    LEAD_SCORED = "lead.scored"
    LEAD_ENRICHED = "lead.enriched"
    LEAD_QUALIFIED = "lead.qualified"

    # Campaign events
    CAMPAIGN_CREATED = "campaign.created"
    CAMPAIGN_LAUNCHED = "campaign.launched"
    CAMPAIGN_PAUSED = "campaign.paused"
    CAMPAIGN_COMPLETED = "campaign.completed"

    # Email events
    EMAIL_SENT = "email.sent"
    EMAIL_OPENED = "email.opened"
    EMAIL_CLICKED = "email.clicked"
    EMAIL_REPLIED = "email.replied"
    EMAIL_BOUNCED = "email.bounced"

    # Engagement events
    MEETING_SCHEDULED = "meeting.scheduled"
    DEMO_COMPLETED = "demo.completed"
    DEAL_CREATED = "deal.created"
    DEAL_WON = "deal.won"
    DEAL_LOST = "deal.lost"


@dataclass
class DomainEvent:
    """Base domain event - immutable after creation"""

    event_id: str
    event_type: EventType
    aggregate_id: str  # ID of entity this event relates to
    aggregate_type: str  # Type of entity (Lead, Campaign, etc.)
    timestamp: datetime
    user_id: Optional[int]
    data: Dict[str, Any]
    metadata: Dict[str, Any] = field(default_factory=dict)
    version: int = 1

    def to_dict(self) -> Dict[str, Any]:
        """Serialize event"""
        return {
            "event_id": self.event_id,
            "event_type": self.event_type.value,
            "aggregate_id": self.aggregate_id,
            "aggregate_type": self.aggregate_type,
            "timestamp": self.timestamp.isoformat(),
            "user_id": self.user_id,
            "data": self.data,
            "metadata": self.metadata,
            "version": self.version,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "DomainEvent":
        """Deserialize event"""
        return cls(
            event_id=data["event_id"],
            event_type=EventType(data["event_type"]),
            aggregate_id=data["aggregate_id"],
            aggregate_type=data["aggregate_type"],
            timestamp=datetime.fromisoformat(data["timestamp"]),
            user_id=data.get("user_id"),
            data=data.get("data", {}),
            metadata=data.get("metadata", {}),
            version=data.get("version", 1),
        )


class EventStore:
    """
    Immutable event store - append-only log of all domain events.
    Provides event replay, temporal queries, and stream processing.
    """

    def __init__(self):
        self.events: List[DomainEvent] = []
        self.subscribers: Dict[EventType, List[Callable]] = defaultdict(list)
        self._lock = asyncio.Lock()

    async def append(self, event: DomainEvent) -> None:
        """
        Append event to store (immutable, append-only).
        Triggers registered subscribers.
        """
        async with self._lock:
            self.events.append(event)

            # Persist to database
            await self._persist_event(event)

            # Notify subscribers
            await self._notify_subscribers(event)

            logger.info(
                f"Event appended: {event.event_type} for {event.aggregate_type}:{event.aggregate_id}"
            )

    async def _persist_event(self, event: DomainEvent) -> None:
        """Persist event to database"""
        with get_session() as session:
            # In production: store in dedicated events table
            # CREATE TABLE events (
            #     event_id UUID PRIMARY KEY,
            #     event_type VARCHAR,
            #     aggregate_id VARCHAR,
            #     aggregate_type VARCHAR,
            #     timestamp TIMESTAMP,
            #     data JSONB,
            #     ...
            # )
            pass

    async def _notify_subscribers(self, event: DomainEvent) -> None:
        """Notify event subscribers asynchronously"""
        subscribers = self.subscribers.get(event.event_type, [])
        tasks = [subscriber(event) for subscriber in subscribers]
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

    def subscribe(self, event_type: EventType, handler: Callable) -> None:
        """Subscribe to specific event type"""
        self.subscribers[event_type].append(handler)
        logger.info(f"Subscribed handler to {event_type}")

    def get_events_by_aggregate(
        self, aggregate_id: str, aggregate_type: str, after: Optional[datetime] = None
    ) -> List[DomainEvent]:
        """Get all events for specific aggregate (entity)"""
        events = [
            e
            for e in self.events
            if e.aggregate_id == aggregate_id and e.aggregate_type == aggregate_type
        ]

        if after:
            events = [e for e in events if e.timestamp > after]

        return sorted(events, key=lambda e: e.timestamp)

    def get_events_by_type(
        self, event_type: EventType, after: Optional[datetime] = None, limit: int = 100
    ) -> List[DomainEvent]:
        """Get events by type"""
        events = [e for e in self.events if e.event_type == event_type]

        if after:
            events = [e for e in events if e.timestamp > after]

        events = sorted(events, key=lambda e: e.timestamp, reverse=True)
        return events[:limit]

    def replay_events(
        self, aggregate_id: str, aggregate_type: str, up_to: Optional[datetime] = None
    ) -> Any:
        """
        Replay events to reconstruct aggregate state at any point in time.
        This is the core of event sourcing - rebuild state from events.
        """
        events = self.get_events_by_aggregate(aggregate_id, aggregate_type)

        if up_to:
            events = [e for e in events if e.timestamp <= up_to]

        # Reconstruct state by applying events in order
        state = self._apply_events(events, aggregate_type)
        return state

    def _apply_events(self, events: List[DomainEvent], aggregate_type: str) -> Dict[str, Any]:
        """Apply events to build current state"""
        state = {"id": None, "history": []}

        for event in events:
            if event.event_type == EventType.LEAD_CREATED:
                state.update(event.data)
                state["id"] = event.aggregate_id
                state["created_at"] = event.timestamp

            elif event.event_type == EventType.LEAD_UPDATED:
                state.update(event.data)
                state["updated_at"] = event.timestamp

            elif event.event_type == EventType.LEAD_SCORED:
                state["score"] = event.data.get("score")
                state["last_scored_at"] = event.timestamp

            elif event.event_type == EventType.LEAD_QUALIFIED:
                state["qualified"] = True
                state["qualified_at"] = event.timestamp

            # Track history
            state["history"].append(
                {
                    "event": event.event_type.value,
                    "timestamp": event.timestamp.isoformat(),
                    "data": event.data,
                }
            )

        return state

    async def get_event_stream(
        self,
        event_types: Optional[List[EventType]] = None,
        after: Optional[datetime] = None,
    ):
        """
        Async generator for event streaming.
        Yields events as they're appended to the store.
        """
        start_idx = 0

        # Find starting position
        if after:
            for idx, event in enumerate(self.events):
                if event.timestamp > after:
                    start_idx = idx
                    break

        # Yield existing events
        for event in self.events[start_idx:]:
            if not event_types or event.event_type in event_types:
                yield event

        # In production: use Redis pub/sub or message queue
        # for real-time event streaming


class ReadModel:
    """
    Optimized read model (CQRS pattern).
    Materialized views for fast queries, updated from events.
    """

    def __init__(self, event_store: EventStore):
        self.event_store = event_store
        self.views: Dict[str, Dict[str, Any]] = defaultdict(dict)
        self._subscribe_to_events()

    def _subscribe_to_events(self) -> None:
        """Subscribe to events to keep read models updated"""
        # Lead analytics view
        self.event_store.subscribe(EventType.LEAD_CREATED, self._update_lead_analytics)
        self.event_store.subscribe(EventType.LEAD_SCORED, self._update_lead_analytics)
        self.event_store.subscribe(EventType.LEAD_QUALIFIED, self._update_lead_analytics)

        # Campaign performance view
        self.event_store.subscribe(EventType.EMAIL_SENT, self._update_campaign_performance)
        self.event_store.subscribe(EventType.EMAIL_OPENED, self._update_campaign_performance)
        self.event_store.subscribe(EventType.EMAIL_CLICKED, self._update_campaign_performance)

        # Engagement funnel view
        self.event_store.subscribe(EventType.MEETING_SCHEDULED, self._update_engagement_funnel)
        self.event_store.subscribe(EventType.DEMO_COMPLETED, self._update_engagement_funnel)
        self.event_store.subscribe(EventType.DEAL_WON, self._update_engagement_funnel)

    async def _update_lead_analytics(self, event: DomainEvent) -> None:
        """Update lead analytics view"""
        view = self.views["lead_analytics"]

        if event.event_type == EventType.LEAD_CREATED:
            view["total_leads"] = view.get("total_leads", 0) + 1

        elif event.event_type == EventType.LEAD_QUALIFIED:
            view["qualified_leads"] = view.get("qualified_leads", 0) + 1
            view["qualification_rate"] = (
                view["qualified_leads"] / view["total_leads"] if view["total_leads"] > 0 else 0
            )

        # Cache updated view
        cache.set("read_model:lead_analytics", view, ttl=300)

    async def _update_campaign_performance(self, event: DomainEvent) -> None:
        """Update campaign performance view"""
        campaign_id = event.data.get("campaign_id")
        if not campaign_id:
            return

        view_key = f"campaign:{campaign_id}"
        view = self.views["campaign_performance"].get(
            view_key, {"sent": 0, "opened": 0, "clicked": 0, "replied": 0}
        )

        if event.event_type == EventType.EMAIL_SENT:
            view["sent"] += 1
        elif event.event_type == EventType.EMAIL_OPENED:
            view["opened"] += 1
        elif event.event_type == EventType.EMAIL_CLICKED:
            view["clicked"] += 1

        # Calculate rates
        if view["sent"] > 0:
            view["open_rate"] = view["opened"] / view["sent"]
            view["click_rate"] = view["clicked"] / view["sent"]

        self.views["campaign_performance"][view_key] = view
        cache.set(f"read_model:{view_key}", view, ttl=300)

    async def _update_engagement_funnel(self, event: DomainEvent) -> None:
        """Update engagement funnel view"""
        view = self.views["engagement_funnel"]

        if event.event_type == EventType.MEETING_SCHEDULED:
            view["meetings"] = view.get("meetings", 0) + 1
        elif event.event_type == EventType.DEMO_COMPLETED:
            view["demos"] = view.get("demos", 0) + 1
        elif event.event_type == EventType.DEAL_WON:
            view["deals_won"] = view.get("deals_won", 0) + 1

        cache.set("read_model:engagement_funnel", view, ttl=300)

    def get_view(self, view_name: str, key: Optional[str] = None) -> Dict[str, Any]:
        """Get materialized view"""
        # Try cache first
        cache_key = f"read_model:{view_name}"
        if key:
            cache_key += f":{key}"

        cached = cache.get(cache_key)
        if cached:
            return cached

        # Fallback to in-memory
        if key:
            return self.views.get(view_name, {}).get(key, {})
        return self.views.get(view_name, {})


# Global event store and read model
event_store = EventStore()
read_model = ReadModel(event_store)


# Decorator for commands (write operations)
def command_handler(aggregate_type: str):
    """
    Decorator for command handlers.
    Commands change state and produce events.
    """

    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            result = await func(*args, **kwargs)

            # Command should return list of events
            if isinstance(result, list):
                for event in result:
                    if isinstance(event, DomainEvent):
                        await event_store.append(event)
            elif isinstance(result, DomainEvent):
                await event_store.append(result)

            return result

        return wrapper

    return decorator


# Example command handlers
@command_handler("Lead")
async def create_lead_command(lead_data: Dict[str, Any], user_id: int) -> DomainEvent:
    """Command to create a lead - produces LEAD_CREATED event"""
    import uuid

    event = DomainEvent(
        event_id=str(uuid.uuid4()),
        event_type=EventType.LEAD_CREATED,
        aggregate_id=lead_data.get("id", str(uuid.uuid4())),
        aggregate_type="Lead",
        timestamp=datetime.now(),
        user_id=user_id,
        data=lead_data,
        metadata={"source": "api"},
    )

    return event


@command_handler("Lead")
async def score_lead_command(lead_id: str, score: float, user_id: int) -> DomainEvent:
    """Command to score a lead - produces LEAD_SCORED event"""
    import uuid

    event = DomainEvent(
        event_id=str(uuid.uuid4()),
        event_type=EventType.LEAD_SCORED,
        aggregate_id=lead_id,
        aggregate_type="Lead",
        timestamp=datetime.now(),
        user_id=user_id,
        data={"score": score},
        metadata={"scoring_model": "v2.0"},
    )

    return event


class TemporalQuery:
    """
    Query system state at any point in time.
    "What was this lead's score on December 1st?"
    """

    def __init__(self, event_store: EventStore):
        self.event_store = event_store

    def get_state_at(
        self, aggregate_id: str, aggregate_type: str, timestamp: datetime
    ) -> Dict[str, Any]:
        """Get aggregate state at specific point in time"""
        return self.event_store.replay_events(aggregate_id, aggregate_type, up_to=timestamp)

    def get_changes_between(
        self, aggregate_id: str, aggregate_type: str, start: datetime, end: datetime
    ) -> List[DomainEvent]:
        """Get all changes to aggregate in time range"""
        events = self.event_store.get_events_by_aggregate(aggregate_id, aggregate_type)
        return [e for e in events if start <= e.timestamp <= end]


# Export singleton
temporal_query = TemporalQuery(event_store)
