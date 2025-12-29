# Activity Event Spine Architecture

## Overview

The Activity Event Spine is an industrialized event-driven architecture that provides a canonical, immutable source of truth for all activity events in the Artisan platform. It replaces demo data with a production-ready event system that supports:

- **Immutable event storage** with idempotency
- **Multi-tenant isolation** for RBAC compliance
- **Real-time updates** via Server-Sent Events (SSE)
- **Flexible querying** with comprehensive filters and pagination
- **External system ingestion** for webhooks and integrations

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/TypeScript)               │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ ActivityCenter │  │ useActivity  │  │ activityService │ │
│  │   Components   │─▶│  Feed Hook   │─▶│   (API Client)  │ │
│  └────────────────┘  └──────────────┘  └─────────────────┘ │
└───────────────────────────────────┬─────────────────────────┘
                                    │ HTTP/SSE
┌───────────────────────────────────▼─────────────────────────┐
│                    Backend (FastAPI/Python)                  │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Activity    │  │ Activity     │  │ Event Ingestors  │   │
│  │ API Routes  │─▶│ Store        │◀─│ (Normalizers)    │   │
│  │ (+ SSE)     │  │ (Persistence)│  │                  │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
└───────────────────────────────────┬─────────────────────────┘
                                    │
┌───────────────────────────────────▼─────────────────────────┐
│                Database (SQLite/PostgreSQL)                  │
│                   activity_events table                      │
│              (Immutable, tenant-isolated)                    │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

### Frontend

#### 1. Contracts (`src/contracts/activity.ts`)
Canonical TypeScript types that define the event contract:
- `ActivityEvent` - The core event structure
- `EventType`, `EventSource`, `EventPriority` - Enums for classification
- `ActivityEventFilters` - Query parameters
- `PaginatedResponse<T>` - Standard pagination wrapper

#### 2. Service Layer (`src/services/activityService.ts`)
HTTP client for Activity API:
```typescript
import activityService from '@/services/activityService';

// List activities
const result = await activityService.list({
  tenantId: 'my-tenant',
  types: [EventType.LEAD_HIGH_INTENT],
  read: false
}, { page: 1, pageSize: 30 });

// Subscribe to real-time updates
const unsubscribe = activityService.subscribe(
  'my-tenant',
  (delta) => console.log('New event:', delta),
  (error) => console.error('SSE error:', error)
);
```

#### 3. React Hook (`src/hooks/useActivityFeed.ts`)
React Query-powered hook with SSE integration:
```typescript
import { useActivityFeed } from '@/hooks/useActivityFeed';

const MyComponent = () => {
  const {
    activities,
    groupedActivities,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useActivityFeed({
    enableSSE: true,
    autoRefresh: true,
    tenantId: 'my-tenant'
  });
  
  // Use activities in your UI
};
```

### Backend

#### 1. Models (`backend/app/models/activity.py`)
SQLModel definitions:
- `ActivityEvent` - Database table model
- `ActivityEventCreate` - Input schema
- `ActivityEventRead` - Output schema
- Enums: `EventType`, `EventSource`, `EventStatus`, `EventPriority`

#### 2. Activity Store (`backend/app/core/activity_store.py`)
Core persistence layer with:
- **Idempotency** - Prevents duplicate events via hashed keys
- **Tenant isolation** - All queries filtered by tenant_id
- **Comprehensive filtering** - By type, source, date, entity, tags, etc.
- **Pagination** - Configurable page size and sorting

#### 3. API Routes (`backend/app/api/routes/activity.py`)
REST endpoints:
```
POST   /api/activities           - Create new event
GET    /api/activities           - List events (with filters)
GET    /api/activities/{id}      - Get single event
PATCH  /api/activities/{id}/read - Mark as read
PATCH  /api/activities/read-all  - Mark all as read
GET    /api/activities/stats     - Get statistics
GET    /api/activities/stream    - SSE real-time updates
```

#### 4. Event Ingestion (`backend/app/server/ingest/`)
Normalizers for external systems:
- `SalesforceEventNormalizer`
- `HubSpotEventNormalizer`
- `WebhookEventNormalizer` (generic)

## Usage Examples

### Creating Events (Backend)

```python
from app.core.activity_store import ActivityStore
from app.models.activity import ActivityEventCreate, EventType, EventSource

event_data = ActivityEventCreate(
    tenant_id="customer-123",
    type=EventType.LEAD_HIGH_INTENT,
    source=EventSource.INTERNAL,
    source_system="internal",
    source_object_id="lead-456",
    title="High-intent lead detected",
    description="Lead opened email 5 times and visited pricing",
    event_metadata={
        "lead_id": "lead-456",
        "email_opens": 5
    },
    entity_id="lead-456",
    entity_type="lead",
    priority=EventPriority.HIGH,
    tags=["lead", "high-intent"]
)

store = ActivityStore(session)
event = store.create_event(event_data)  # Idempotent
```

### Querying Events (Frontend)

```typescript
// Using the hook
const { activities, isLoading } = useActivityFeed({
  tenantId: 'customer-123',
  filters: {
    types: [EventType.LEAD_HIGH_INTENT, EventType.LEAD_REPLIED],
    startDate: new Date('2024-01-01'),
    read: false
  }
});

// Direct API call
const result = await activityService.list(
  {
    tenantId: 'customer-123',
    entityType: 'campaign',
    entityId: 'camp-001'
  },
  { page: 1, pageSize: 50, sortOrder: 'desc' }
);
```

### Real-Time Updates

The SSE endpoint automatically broadcasts events to all connected clients for a tenant:

```typescript
// Auto-connected in useActivityFeed with enableSSE: true
// Or manually:
const cleanup = activityService.subscribe(
  'customer-123',
  (delta) => {
    if (delta.action === 'created') {
      // New event received
      console.log('New event:', delta.event);
    }
  }
);

// Cleanup on unmount
return () => cleanup();
```

## Database Schema

The `activity_events` table includes:

```sql
CREATE TABLE activity_events (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,  -- Multi-tenancy
    type TEXT NOT NULL,       -- EventType enum
    source TEXT NOT NULL,     -- EventSource enum
    status TEXT NOT NULL,     -- EventStatus enum
    priority TEXT NOT NULL,   -- EventPriority enum
    
    -- Source tracking
    source_system TEXT NOT NULL,
    source_object_id TEXT NOT NULL,
    source_object_type TEXT,
    
    -- Event payload
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    event_metadata JSON,
    
    -- Entity relationships
    entity_id TEXT,
    entity_type TEXT,
    
    -- User context
    user_id TEXT,
    user_name TEXT,
    
    -- Temporal
    timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP,
    
    -- Idempotency
    idempotency_key TEXT UNIQUE NOT NULL,
    
    -- Read tracking
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Additional
    tags JSON,
    correlation_id TEXT
);

-- Indexes for performance
CREATE INDEX idx_tenant_id ON activity_events(tenant_id);
CREATE INDEX idx_type ON activity_events(type);
CREATE INDEX idx_timestamp ON activity_events(timestamp);
CREATE INDEX idx_entity ON activity_events(entity_id, entity_type);
```

## Seeding Sample Data

Run the seed script to populate sample events:

```bash
cd backend
source .venv/bin/activate
python seed_activities.py
```

This creates 10 sample events across different types (campaigns, leads, AI actions, system events).

## Integration Checklist

To integrate the Activity Event Spine into your application:

- [x] Backend models and persistence layer
- [x] API routes with filtering and pagination
- [x] SSE endpoint for real-time updates
- [x] Frontend TypeScript contracts
- [x] Frontend service layer (HTTP client)
- [x] React hook with TanStack Query
- [x] Multi-tenant isolation
- [ ] Update existing UI components to use new hook
- [ ] Add authentication/authorization middleware
- [ ] Configure production database (PostgreSQL)
- [ ] Set up monitoring and alerting
- [ ] Document external webhook integrations

## Migration from Demo Data

To migrate existing components from mock data:

1. **Import the new hook:**
   ```typescript
   import { useActivityFeed } from '@/hooks/useActivityFeed.ts';
   ```

2. **Replace mock usage:**
   ```typescript
   // Before:
   const activities = generateMockActivities();
   
   // After:
   const { activities, isLoading } = useActivityFeed();
   ```

3. **Handle loading states:**
   ```typescript
   if (isLoading) return <LoadingSpinner />;
   ```

4. **Enable real-time updates:**
   ```typescript
   const { activities } = useActivityFeed({ enableSSE: true });
   ```

## Security Considerations

- **Tenant Isolation**: All queries MUST include `tenant_id` filter
- **Input Sanitization**: `sanitize_text()` applied to title/description
- **Idempotency**: Prevents event duplication via hashed keys
- **RBAC**: Implement permission checks in middleware (TODO)
- **Rate Limiting**: Apply to API endpoints (TODO)

## Performance Optimizations

- **Indexes**: Added on tenant_id, type, timestamp, entity fields
- **Pagination**: Default 30 items, max 100 per page
- **Caching**: TanStack Query caches for 10s (staleTime)
- **SSE Keepalive**: 30s pings prevent connection drops
- **Connection Pooling**: Configured in SQLAlchemy engine

## Next Steps

1. **UI Integration**: Update ActivityCenter component to use `useActivityFeed.ts`
2. **Authentication**: Add tenant_id from JWT claims
3. **Webhook Endpoints**: Create routes for Salesforce, HubSpot, etc.
4. **Monitoring**: Add metrics for event creation rate, SSE connections
5. **Testing**: E2E tests for event flow and SSE updates
6. **Documentation**: API docs in OpenAPI/Swagger

## Support

For questions or issues:
- Backend: Check `backend/app/api/routes/activity.py`
- Frontend: Check `src/hooks/useActivityFeed.ts`
- Contracts: Check `src/contracts/activity.ts`
