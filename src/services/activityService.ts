/**
 * Activity Service
 * 
 * Client-side service for interacting with the Activity Event API.
 * Provides methods for fetching, creating, and subscribing to activity events.
 */

import {
  ActivityEvent,
  ActivityEventCreate,
  ActivityEventFilters,
  PaginationParams,
  PaginatedResponse,
  ActivityEventDelta,
  ActivityStats,
} from '../contracts/activity';

const API_BASE = import.meta?.env?.VITE_API_URL || 'http://localhost:8000/api';

/**
 * List activity events with filters and pagination
 */
export async function listActivities(
  filters: ActivityEventFilters,
  pagination?: PaginationParams
): Promise<PaginatedResponse<ActivityEvent>> {
  const params = new URLSearchParams();
  
  // Add filters
  params.append('tenantId', filters.tenantId);
  if (filters.types?.length) {
    filters.types.forEach(type => params.append('types', type));
  }
  if (filters.sources?.length) {
    filters.sources.forEach(source => params.append('sources', source));
  }
  if (filters.statuses?.length) {
    filters.statuses.forEach(status => params.append('statuses', status));
  }
  if (filters.priorities?.length) {
    filters.priorities.forEach(priority => params.append('priorities', priority));
  }
  if (filters.entityId) params.append('entityId', filters.entityId);
  if (filters.entityType) params.append('entityType', filters.entityType);
  if (filters.userId) params.append('userId', filters.userId);
  if (filters.read !== undefined) params.append('read', String(filters.read));
  if (filters.tags?.length) {
    filters.tags.forEach(tag => params.append('tags', tag));
  }
  if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
  if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
  if (filters.search) params.append('search', filters.search);
  
  // Add pagination
  if (pagination?.page) params.append('page', String(pagination.page));
  if (pagination?.pageSize) params.append('pageSize', String(pagination.pageSize));
  if (pagination?.sortBy) params.append('sortBy', pagination.sortBy);
  if (pagination?.sortOrder) params.append('sortOrder', pagination.sortOrder);
  
  const response = await fetch(`${API_BASE}/activities?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch activities: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Convert date strings to Date objects
  return {
    ...data,
    items: data.items.map((event: any) => ({
      ...event,
      timestamp: new Date(event.timestamp),
      createdAt: new Date(event.createdAt),
      expiresAt: event.expiresAt ? new Date(event.expiresAt) : undefined,
      readAt: event.readAt ? new Date(event.readAt) : undefined,
    })),
  };
}

/**
 * Get a single activity event by ID
 */
export async function getActivity(id: string, tenantId: string): Promise<ActivityEvent> {
  const response = await fetch(`${API_BASE}/activities/${id}?tenantId=${tenantId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch activity: ${response.statusText}`);
  }
  
  const event = await response.json();
  
  // Convert date strings to Date objects
  return {
    ...event,
    timestamp: new Date(event.timestamp),
    createdAt: new Date(event.createdAt),
    expiresAt: event.expiresAt ? new Date(event.expiresAt) : undefined,
    readAt: event.readAt ? new Date(event.readAt) : undefined,
  };
}

/**
 * Create a new activity event
 */
export async function createActivity(
  eventData: ActivityEventCreate
): Promise<ActivityEvent> {
  const response = await fetch(`${API_BASE}/activities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...eventData,
      timestamp: eventData.timestamp?.toISOString(),
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create activity: ${response.statusText}`);
  }
  
  const event = await response.json();
  
  return {
    ...event,
    timestamp: new Date(event.timestamp),
    createdAt: new Date(event.createdAt),
    expiresAt: event.expiresAt ? new Date(event.expiresAt) : undefined,
    readAt: event.readAt ? new Date(event.readAt) : undefined,
  };
}

/**
 * Mark an activity as read
 */
export async function markActivityAsRead(
  id: string,
  tenantId: string
): Promise<ActivityEvent> {
  const response = await fetch(`${API_BASE}/activities/${id}/read`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tenantId }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to mark activity as read: ${response.statusText}`);
  }
  
  const event = await response.json();
  
  return {
    ...event,
    timestamp: new Date(event.timestamp),
    createdAt: new Date(event.createdAt),
    expiresAt: event.expiresAt ? new Date(event.expiresAt) : undefined,
    readAt: event.readAt ? new Date(event.readAt) : undefined,
  };
}

/**
 * Mark all activities as read for a tenant
 */
export async function markAllActivitiesAsRead(tenantId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/activities/read-all`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tenantId }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to mark all activities as read: ${response.statusText}`);
  }
}

/**
 * Get activity statistics
 */
export async function getActivityStats(
  tenantId: string,
  filters?: Partial<ActivityEventFilters>
): Promise<ActivityStats> {
  const params = new URLSearchParams({ tenantId });
  
  if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
  if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());
  
  const response = await fetch(`${API_BASE}/activities/stats?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch activity stats: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Subscribe to real-time activity updates via SSE
 */
export function subscribeToActivityUpdates(
  tenantId: string,
  onEvent: (delta: ActivityEventDelta) => void,
  onError?: (error: Error) => void
): () => void {
  const eventSource = new EventSource(
    `${API_BASE}/activities/stream?tenantId=${tenantId}`
  );
  
  eventSource.onmessage = (event) => {
    try {
      const delta: ActivityEventDelta = JSON.parse(event.data);
      // Convert date strings to Date objects
      const processedDelta: ActivityEventDelta = {
        ...delta,
        timestamp: new Date(delta.timestamp),
        event: {
          ...delta.event,
          timestamp: new Date(delta.event.timestamp),
          createdAt: new Date(delta.event.createdAt),
          expiresAt: delta.event.expiresAt ? new Date(delta.event.expiresAt) : undefined,
          readAt: delta.event.readAt ? new Date(delta.event.readAt) : undefined,
        },
      };
      onEvent(processedDelta);
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
    }
  };
  
  eventSource.onerror = (error) => {
    if (onError) {
      onError(new Error('SSE connection error'));
    }
  };
  
  // Return cleanup function
  return () => {
    eventSource.close();
  };
}

/**
 * Activity Service object for easy imports
 */
export const activityService = {
  list: listActivities,
  get: getActivity,
  create: createActivity,
  markAsRead: markActivityAsRead,
  markAllAsRead: markAllActivitiesAsRead,
  getStats: getActivityStats,
  subscribe: subscribeToActivityUpdates,
};

export default activityService;
