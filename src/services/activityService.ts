/**
 * Activity Service
 * 
 * Service boundary for all activity/event operations.
 * Provides abstraction between UI and data source (demo or real API).
 */

import type {
  ActivityEvent,
  ActivityListResponse,
  ActivityListParams,
  ActivitySubscriptionParams,
  ActivityEventCallback,
  ActorType,
  EntityType,
  EventType,
  ImportanceLevel,
  SourceSystem,
} from '@/contracts/activity';
import { getDemoEvents, type DemoEvent, type PlanTier } from '@/demo/demoData';
import { ACTIVITY_ROUTES } from './apiRoutes';

/**
 * Map DemoEvent to canonical ActivityEvent
 * 
 * Adapts the demo data format to the canonical contract.
 * In production, this mapper will be replaced with direct API responses.
 */
function mapDemoEventToActivityEvent(demoEvent: DemoEvent, tenantId: string = 'demo-tenant-001'): ActivityEvent {
  // Infer actor type from the actor name
  let actorType: ActorType = 'Human';
  if (demoEvent.actor.includes('Ava AI') || demoEvent.actor.includes('AI')) {
    actorType = 'AI';
  } else if (demoEvent.actor.includes('System')) {
    actorType = 'System';
  }
  
  // Infer entity type and event type from the description
  let entityType: EntityType = 'lead';
  let eventType: EventType = 'execution';
  
  const desc = demoEvent.description.toLowerCase();
  if (desc.includes('campaign')) {
    entityType = 'campaign';
  } else if (desc.includes('playbook') || desc.includes('sequence')) {
    entityType = 'playbook';
  } else if (desc.includes('account')) {
    entityType = 'account';
  }
  
  if (desc.includes('sent') || desc.includes('email')) {
    eventType = 'message';
  } else if (desc.includes('meeting') || desc.includes('scheduled')) {
    eventType = 'meeting';
  } else if (desc.includes('qualified') || desc.includes('scored')) {
    eventType = 'qualification';
  } else if (desc.includes('enriched') || desc.includes('data')) {
    eventType = 'enrichment';
  } else if (desc.includes('updated') || desc.includes('changed')) {
    eventType = 'status_change';
  } else if (desc.includes('optimized') || desc.includes('analyzed')) {
    eventType = 'optimization';
  } else if (desc.includes('recommend')) {
    eventType = 'recommendation';
  }
  
  // Infer source system from context
  let sourceSystem: SourceSystem = 'internal';
  if (desc.includes('salesforce')) {
    sourceSystem = 'salesforce';
  } else if (desc.includes('hubspot')) {
    sourceSystem = 'hubspot';
  } else if (desc.includes('slack')) {
    sourceSystem = 'slack';
  } else if (desc.includes('calendar')) {
    sourceSystem = 'calendar';
  }
  
  return {
    id: demoEvent.id,
    tenantId,
    sourceSystem,
    sourceObjectType: entityType,
    sourceObjectId: demoEvent.id,
    entityType,
    entityId: demoEvent.id,
    eventType,
    actorType,
    actorName: demoEvent.actor,
    importance: demoEvent.importance,
    timestamp: demoEvent.timestamp,
    summary: `${demoEvent.actor}: ${demoEvent.description}`,
    description: demoEvent.description,
    provenance: {
      refs: [demoEvent.id],
    },
    metadata: {
      originalDemoType: demoEvent.type,
    },
  };
}

/**
 * Filter ActivityEvents based on parameters
 */
function filterActivityEvents(
  events: ActivityEvent[],
  params: ActivityListParams
): ActivityEvent[] {
  let filtered = [...events];
  
  // Filter by entity type
  if (params.entityType) {
    const types = Array.isArray(params.entityType) ? params.entityType : [params.entityType];
    filtered = filtered.filter((e) => types.includes(e.entityType));
  }
  
  // Filter by entity ID
  if (params.entityId) {
    filtered = filtered.filter((e) => e.entityId === params.entityId);
  }
  
  // Filter by event type
  if (params.eventType) {
    const types = Array.isArray(params.eventType) ? params.eventType : [params.eventType];
    filtered = filtered.filter((e) => types.includes(e.eventType));
  }
  
  // Filter by actor type
  if (params.actorType) {
    const types = Array.isArray(params.actorType) ? params.actorType : [params.actorType];
    filtered = filtered.filter((e) => types.includes(e.actorType));
  }
  
  // Filter by importance
  if (params.importance) {
    const levels = Array.isArray(params.importance) ? params.importance : [params.importance];
    filtered = filtered.filter((e) => levels.includes(e.importance));
  }
  
  // Filter by time range
  if (params.after) {
    const afterDate = new Date(params.after).getTime();
    filtered = filtered.filter((e) => new Date(e.timestamp).getTime() > afterDate);
  }
  
  if (params.before) {
    const beforeDate = new Date(params.before).getTime();
    filtered = filtered.filter((e) => new Date(e.timestamp).getTime() < beforeDate);
  }
  
  return filtered;
}

/**
 * Activity Service
 * 
 * In demo mode: uses getDemoEvents and maps to ActivityEvent.
 * In production: will call real API endpoints.
 */
export const activityService = {
  /**
   * List activities with filtering and pagination
   * 
   * TODO: Replace with fetch to ACTIVITY_ROUTES.LIST when backend is ready
   * 
   * @param params - Query parameters for filtering and pagination
   * @param plan - Current plan tier (for demo mode only)
   * @returns Promise resolving to paginated activity list
   */
  async list(
    params: ActivityListParams = {},
    plan: PlanTier = 'enterprise'
  ): Promise<ActivityListResponse> {
    // Demo mode: use demo data and map to ActivityEvent
    const demoEvents = getDemoEvents(plan);
    const activityEvents = demoEvents.map((e) => mapDemoEventToActivityEvent(e, params.tenantId));
    
    // Apply filters
    const filtered = filterActivityEvents(activityEvents, params);
    
    // Apply limit
    const limit = params.limit || 50;
    const items = filtered.slice(0, limit);
    
    // Simple pagination (no real cursor in demo mode)
    const nextCursor = filtered.length > limit ? `cursor-${limit}` : undefined;
    
    // TODO: When backend is ready, replace with:
    // const response = await fetch(`${ACTIVITY_ROUTES.LIST}?${new URLSearchParams(params)}`);
    // return response.json();
    
    return {
      items,
      nextCursor,
      totalCount: filtered.length,
    };
  },
  
  /**
   * Subscribe to real-time activity events via Server-Sent Events
   * 
   * TODO: Implement with EventSource when backend SSE endpoint is ready
   * 
   * @param params - Subscription parameters for filtering
   * @param onEvent - Callback to handle incoming events
   * @returns Unsubscribe function
   */
  subscribeSSE(
    params: ActivitySubscriptionParams,
    onEvent: ActivityEventCallback
  ): () => void {
    // Demo mode: stub implementation
    // Returns a no-op unsubscribe function
    
    // TODO: When backend is ready, implement with:
    // const eventSource = new EventSource(`${ACTIVITY_ROUTES.STREAM}?${new URLSearchParams(params)}`);
    // eventSource.onmessage = (event) => {
    //   const activityEvent: ActivityEvent = JSON.parse(event.data);
    //   onEvent(activityEvent);
    // };
    // return () => eventSource.close();
    
    console.log('[activityService] SSE subscription requested (stub)', params);
    
    return () => {
      console.log('[activityService] SSE unsubscribe (stub)');
    };
  },
};
