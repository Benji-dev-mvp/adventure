"""
Event Ingestion Base Module

Base classes and utilities for ingesting events from external sources
into the Activity Event Spine.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from datetime import datetime
from app.models.activity import (
    ActivityEventCreate,
    EventType,
    EventSource,
    EventPriority,
)


class EventNormalizer(ABC):
    """
    Base class for normalizing events from external sources
    into canonical ActivityEventCreate objects.
    """
    
    @abstractmethod
    def normalize(self, raw_event: Dict[str, Any]) -> ActivityEventCreate:
        """
        Normalize a raw event from an external source into ActivityEventCreate.
        
        Args:
            raw_event: Raw event data from external source
            
        Returns:
            ActivityEventCreate ready for ingestion
        """
        pass
    
    def extract_timestamp(self, raw_event: Dict[str, Any]) -> datetime:
        """Helper to extract timestamp from various formats"""
        timestamp_fields = ['timestamp', 'created_at', 'createdAt', 'date', 'time']
        
        for field in timestamp_fields:
            if field in raw_event:
                value = raw_event[field]
                if isinstance(value, datetime):
                    return value
                elif isinstance(value, str):
                    try:
                        return datetime.fromisoformat(value.replace('Z', '+00:00'))
                    except:
                        pass
                elif isinstance(value, (int, float)):
                    return datetime.fromtimestamp(value)
        
        return datetime.utcnow()


class SalesforceEventNormalizer(EventNormalizer):
    """Normalize events from Salesforce"""
    
    def normalize(self, raw_event: Dict[str, Any]) -> ActivityEventCreate:
        """Normalize Salesforce event"""
        event_type_map = {
            'OpportunityCreated': EventType.LEAD_CREATED,
            'OpportunityUpdated': EventType.LEAD_UPDATED,
            'TaskCompleted': EventType.CALL_COMPLETED,
            'EmailSent': EventType.EMAIL_SENT,
            'EmailOpened': EventType.EMAIL_OPENED,
        }
        
        sf_event_type = raw_event.get('eventType', 'Unknown')
        event_type = event_type_map.get(sf_event_type, EventType.LEAD_UPDATED)
        
        return ActivityEventCreate(
            tenant_id=raw_event.get('tenantId', 'default'),
            type=event_type,
            source=EventSource.SALESFORCE,
            source_system='salesforce',
            source_object_id=raw_event.get('Id', raw_event.get('id', '')),
            source_object_type=raw_event.get('objectType', 'Unknown'),
            title=raw_event.get('title', f"Salesforce: {sf_event_type}"),
            description=raw_event.get('description', ''),
            event_metadata=raw_event,
            entity_id=raw_event.get('entityId'),
            entity_type=raw_event.get('entityType'),
            user_id=raw_event.get('userId'),
            user_name=raw_event.get('userName'),
            timestamp=self.extract_timestamp(raw_event),
            priority=EventPriority.MEDIUM,
            tags=raw_event.get('tags', []),
        )


class HubSpotEventNormalizer(EventNormalizer):
    """Normalize events from HubSpot"""
    
    def normalize(self, raw_event: Dict[str, Any]) -> ActivityEventCreate:
        """Normalize HubSpot event"""
        event_type_map = {
            'contact.creation': EventType.LEAD_CREATED,
            'contact.propertyChange': EventType.LEAD_UPDATED,
            'deal.creation': EventType.LEAD_CREATED,
            'engagement.email.send': EventType.EMAIL_SENT,
            'engagement.email.open': EventType.EMAIL_OPENED,
            'engagement.meeting.scheduled': EventType.LEAD_MEETING_BOOKED,
        }
        
        hs_event_type = raw_event.get('subscriptionType', 'Unknown')
        event_type = event_type_map.get(hs_event_type, EventType.LEAD_UPDATED)
        
        return ActivityEventCreate(
            tenant_id=raw_event.get('tenantId', 'default'),
            type=event_type,
            source=EventSource.HUBSPOT,
            source_system='hubspot',
            source_object_id=raw_event.get('objectId', ''),
            source_object_type=raw_event.get('objectType', 'contact'),
            title=raw_event.get('title', f"HubSpot: {hs_event_type}"),
            description=raw_event.get('description', ''),
            event_metadata=raw_event,
            entity_id=raw_event.get('entityId'),
            entity_type=raw_event.get('entityType'),
            timestamp=self.extract_timestamp(raw_event),
            priority=EventPriority.MEDIUM,
            tags=raw_event.get('tags', []),
        )


class WebhookEventNormalizer(EventNormalizer):
    """Normalize generic webhook events"""
    
    def normalize(self, raw_event: Dict[str, Any]) -> ActivityEventCreate:
        """Normalize generic webhook event"""
        return ActivityEventCreate(
            tenant_id=raw_event.get('tenantId', 'default'),
            type=EventType[raw_event.get('type', 'LEAD_UPDATED')],
            source=EventSource.WEBHOOK,
            source_system=raw_event.get('source', 'webhook'),
            source_object_id=raw_event.get('objectId', raw_event.get('id', '')),
            source_object_type=raw_event.get('objectType'),
            title=raw_event.get('title', 'Webhook Event'),
            description=raw_event.get('description', ''),
            event_event_metadata=raw_event.get('metadata', raw_event),
            entity_id=raw_event.get('entityId'),
            entity_type=raw_event.get('entityType'),
            user_id=raw_event.get('userId'),
            user_name=raw_event.get('userName'),
            timestamp=self.extract_timestamp(raw_event),
            priority=EventPriority[raw_event.get('priority', 'MEDIUM')],
            tags=raw_event.get('tags', []),
            correlation_id=raw_event.get('correlationId'),
        )


class EventIngestor:
    """
    Event Ingestor - Routes raw events to appropriate normalizers
    and ingests them into the activity store.
    """
    
    def __init__(self):
        self.normalizers: Dict[str, EventNormalizer] = {
            'salesforce': SalesforceEventNormalizer(),
            'hubspot': HubSpotEventNormalizer(),
            'webhook': WebhookEventNormalizer(),
        }
    
    def register_normalizer(self, source: str, normalizer: EventNormalizer):
        """Register a custom normalizer for a source"""
        self.normalizers[source] = normalizer
    
    def ingest(self, source: str, raw_event: Dict[str, Any]) -> ActivityEventCreate:
        """
        Ingest a raw event from a source.
        
        Args:
            source: Source system identifier (e.g., 'salesforce', 'hubspot')
            raw_event: Raw event data
            
        Returns:
            Normalized ActivityEventCreate
            
        Raises:
            ValueError: If source is not supported
        """
        normalizer = self.normalizers.get(source.lower())
        
        if not normalizer:
            # Fallback to webhook normalizer for unknown sources
            normalizer = self.normalizers['webhook']
        
        return normalizer.normalize(raw_event)
