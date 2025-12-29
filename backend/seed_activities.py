"""
Seed Activity Events

Populates the database with sample activity events for testing.
"""

from datetime import datetime, timedelta
from sqlmodel import Session
from app.core.db import engine
from app.core.activity_store import ActivityStore
from app.models.activity import (
    ActivityEventCreate,
    EventType,
    EventSource,
    EventPriority,
)


def seed_activity_events():
    """Seed the database with sample activity events"""
    
    with Session(engine) as session:
        store = ActivityStore(session)
        
        now = datetime.utcnow()
        
        # Sample events
        events = [
            ActivityEventCreate(
                tenant_id="default",
                type=EventType.CAMPAIGN_LAUNCHED,
                source=EventSource.INTERNAL,
                source_system="internal",
                source_object_id="camp-001",
                source_object_type="campaign",
                title='Campaign "Q1 Outbound Blitz" launched',
                description="Started sending to 2,450 prospects in the Tech Startup segment",
                event_metadata={
                    "campaign_name": "Q1 Outbound Blitz",
                    "prospect_count": 2450,
                    "segment": "Tech Startup"
                },
                entity_id="camp-001",
                entity_type="campaign",
                user_id="user-1",
                user_name="Sarah Chen",
                timestamp=now - timedelta(minutes=12),
                priority=EventPriority.HIGH,
                tags=["campaign", "launch"],
            ),
            ActivityEventCreate(
                tenant_id="default",
                type=EventType.LEAD_HIGH_INTENT,
                source=EventSource.INTERNAL,
                source_system="internal",
                source_object_id="lead-042",
                source_object_type="lead",
                title="High-intent lead detected",
                description="Sarah Chen (Acme Corp) opened emails 5x and visited pricing page",
                event_metadata={
                    "lead_name": "Sarah Chen",
                    "company": "Acme Corp",
                    "email_opens": 5,
                    "page_visited": "pricing"
                },
                entity_id="lead-042",
                entity_type="lead",
                timestamp=now - timedelta(minutes=28),
                priority=EventPriority.HIGH,
                tags=["lead", "high-intent"],
            ),
            ActivityEventCreate(
                tenant_id="default",
                type=EventType.LEAD_REPLIED,
                source=EventSource.INTERNAL,
                source_system="internal",
                source_object_id="lead-089",
                source_object_type="lead",
                title="Reply received",
                description='James Wilson responded positively to the "Re-engagement" sequence',
                event_metadata={
                    "lead_name": "James Wilson",
                    "sequence": "Re-engagement",
                    "sentiment": "positive"
                },
                entity_id="lead-089",
                entity_type="lead",
                timestamp=now - timedelta(minutes=45),
                priority=EventPriority.MEDIUM,
                tags=["lead", "reply"],
            ),
            ActivityEventCreate(
                tenant_id="default",
                type=EventType.AI_OPTIMIZATION,
                source=EventSource.AI_ENGINE,
                source_system="ava",
                source_object_id="opt-001",
                title="Ava optimized send times",
                description="Updated delivery windows for 3 campaigns based on engagement patterns",
                event_metadata={
                    "campaigns_updated": 3,
                    "optimization_type": "send_time"
                },
                entity_type="ai",
                timestamp=now - timedelta(hours=1, minutes=30),
                priority=EventPriority.MEDIUM,
                tags=["ai", "optimization"],
            ),
            ActivityEventCreate(
                tenant_id="default",
                type=EventType.CAMPAIGN_FAILING,
                source=EventSource.INTERNAL,
                source_system="internal",
                source_object_id="camp-003",
                source_object_type="campaign",
                title="Campaign performance alert",
                description='"Enterprise Outreach" has 2.1% open rate - below 5% threshold',
                event_metadata={
                    "campaign_name": "Enterprise Outreach",
                    "open_rate": 2.1,
                    "threshold": 5.0
                },
                entity_id="camp-003",
                entity_type="campaign",
                timestamp=now - timedelta(hours=2),
                priority=EventPriority.HIGH,
                tags=["campaign", "alert"],
            ),
            ActivityEventCreate(
                tenant_id="default",
                type=EventType.SYSTEM_INTEGRATION_ERROR,
                source=EventSource.SALESFORCE,
                source_system="salesforce",
                source_object_id="sync-error-001",
                title="Salesforce sync issue",
                description="Failed to sync 12 leads. API rate limit exceeded.",
                event_metadata={
                    "failed_leads": 12,
                    "error_type": "rate_limit"
                },
                entity_type="integration",
                timestamp=now - timedelta(hours=3),
                priority=EventPriority.CRITICAL,
                tags=["system", "error", "salesforce"],
            ),
            ActivityEventCreate(
                tenant_id="default",
                type=EventType.SYSTEM_USAGE_WARNING,
                source=EventSource.INTERNAL,
                source_system="internal",
                source_object_id="usage-001",
                title="Email quota at 85%",
                description="You have used 8,500 of 10,000 monthly emails. Consider upgrading.",
                event_metadata={
                    "used": 8500,
                    "total": 10000,
                    "percentage": 85
                },
                entity_type="billing",
                timestamp=now - timedelta(hours=4),
                priority=EventPriority.MEDIUM,
                tags=["system", "usage"],
            ),
            ActivityEventCreate(
                tenant_id="default",
                type=EventType.AI_SCORING,
                source=EventSource.AI_ENGINE,
                source_system="ava",
                source_object_id="scoring-001",
                title="Ava scored 156 new leads",
                description="23 marked as hot, 67 warm, 66 cold. Review recommended.",
                event_metadata={
                    "total_scored": 156,
                    "hot": 23,
                    "warm": 67,
                    "cold": 66
                },
                entity_type="ai",
                timestamp=now - timedelta(hours=5),
                priority=EventPriority.MEDIUM,
                tags=["ai", "scoring"],
            ),
            ActivityEventCreate(
                tenant_id="default",
                type=EventType.CAMPAIGN_PAUSED,
                source=EventSource.INTERNAL,
                source_system="internal",
                source_object_id="camp-004",
                source_object_type="campaign",
                title="Campaign auto-paused",
                description='"Holiday Promo" paused due to high bounce rate (12%)',
                event_metadata={
                    "campaign_name": "Holiday Promo",
                    "bounce_rate": 12.0,
                    "reason": "high_bounce_rate"
                },
                entity_id="camp-004",
                entity_type="campaign",
                timestamp=now - timedelta(hours=8),
                priority=EventPriority.HIGH,
                tags=["campaign", "paused"],
            ),
            ActivityEventCreate(
                tenant_id="default",
                type=EventType.LEAD_MEETING_BOOKED,
                source=EventSource.CALENDLY,
                source_system="calendly",
                source_object_id="meeting-001",
                source_object_type="meeting",
                title="Meeting booked!",
                description="Michael Torres (Globex) scheduled a demo for tomorrow at 2pm",
                event_metadata={
                    "lead_name": "Michael Torres",
                    "company": "Globex",
                    "meeting_type": "demo",
                    "scheduled_time": (now + timedelta(days=1, hours=2)).isoformat()
                },
                entity_id="lead-112",
                entity_type="lead",
                timestamp=now - timedelta(hours=12),
                priority=EventPriority.HIGH,
                tags=["lead", "meeting"],
            ),
        ]
        
        # Create events with idempotency
        created_count = 0
        for event_data in events:
            try:
                event = store.create_event(event_data)
                created_count += 1
                print(f"✓ Created event: {event.title}")
            except Exception as e:
                print(f"✗ Failed to create event: {event_data.title} - {e}")
        
        print(f"\n✅ Seeded {created_count} activity events")


if __name__ == "__main__":
    print("🌱 Seeding activity events...")
    seed_activity_events()
