/**
 * useActivityFeed Hook (Enhanced with Real API)
 * 
 * Integrates with the Activity Event Spine API for real activity data.
 * Supports SSE for real-time updates and maintains backward compatibility.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import activityService from '../services/activityService';
import { 
  ActivityEvent, 
  ActivityEventFilters, 
  PaginationParams,
  ActivityEventDelta,
  GroupedActivities
} from '../contracts/activity';

// Default tenant ID (in a real app, this would come from auth context)
const DEFAULT_TENANT_ID = 'default';

interface UseActivityFeedOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  enableSSE?: boolean;
  tenantId?: string;
  filters?: Partial<ActivityEventFilters>;
}

interface UseActivityFeedReturn {
  activities: ActivityEvent[];
  groupedActivities: GroupedActivities;
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  filter: string;
  setFilter: (filter: string) => void;
  markAsRead: (activityId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => void;
}

/**
 * Map old activity format to new format for backward compatibility
 */
function mapToLegacyFormat(event: ActivityEvent): any {
  // Extract icon and color from metadata or derive from type
  const typeMap: Record<string, { icon: string; color: string }> = {
    campaign_launched: { icon: 'Rocket', color: 'green' },
    campaign_paused: { icon: 'PauseCircle', color: 'amber' },
    campaign_failing: { icon: 'AlertTriangle', color: 'amber' },
    lead_high_intent: { icon: 'Target', color: 'purple' },
    lead_replied: { icon: 'MessageSquare', color: 'blue' },
    lead_meeting_booked: { icon: 'Calendar', color: 'green' },
    ai_optimization: { icon: 'Sparkles', color: 'cyan' },
    ai_scoring: { icon: 'Brain', color: 'purple' },
    system_integration_error: { icon: 'AlertCircle', color: 'red' },
    system_usage_warning: { icon: 'TrendingUp', color: 'amber' },
  };

  const mapping = typeMap[event.type] || { icon: 'Bell', color: 'blue' };

  return {
    id: event.id,
    type: event.entityType || 'system',
    event: event.type,
    title: event.title,
    description: event.description,
    timestamp: event.timestamp,
    icon: mapping.icon,
    color: mapping.color,
    read: event.read || false,
    entityId: event.entityId,
    entityType: event.entityType,
  };
}

/**
 * Group activities by time period
 */
function groupActivitiesByTime(activities: ActivityEvent[]): GroupedActivities {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  return {
    today: activities.filter(a => new Date(a.timestamp) >= today),
    yesterday: activities.filter(a => {
      const ts = new Date(a.timestamp);
      return ts >= yesterday && ts < today;
    }),
    older: activities.filter(a => new Date(a.timestamp) < yesterday),
  };
}

export const useActivityFeed = (options: UseActivityFeedOptions = {}): UseActivityFeedReturn => {
  const {
    autoRefresh = false,
    refreshInterval = 30000,
    enableSSE = true,
    tenantId = DEFAULT_TENANT_ID,
    filters = {},
  } = options;

  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>('all');
  const sseCleanupRef = useRef<(() => void) | null>(null);

  // Build filters based on current filter selection
  const buildFilters = useCallback((): ActivityEventFilters => {
    const baseFilters: ActivityEventFilters = {
      tenantId,
      ...filters,
    };

    if (filter === 'unread') {
      baseFilters.read = false;
    } else if (filter !== 'all') {
      // Filter by entity type (campaign, lead, ai, system)
      baseFilters.entityType = filter;
    }

    return baseFilters;
  }, [tenantId, filter, filters]);

  // Fetch activities using React Query
  const {
    data: paginatedData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['activities', tenantId, filter, filters],
    queryFn: async () => {
      const filters = buildFilters();
      const pagination: PaginationParams = {
        page: 1,
        pageSize: 50,
        sortBy: 'timestamp',
        sortOrder: 'desc',
      };
      return activityService.list(filters, pagination);
    },
    refetchInterval: autoRefresh ? refreshInterval : false,
    staleTime: 10000, // Consider data fresh for 10 seconds
  });

  const activities = paginatedData?.items || [];
  const unreadCount = activities.filter(a => !a.read).length;

  // Set up SSE connection for real-time updates
  useEffect(() => {
    if (!enableSSE) return;

    const cleanup = activityService.subscribe(
      tenantId,
      (delta: ActivityEventDelta) => {
        // Update query cache with new/updated event
        queryClient.setQueryData(
          ['activities', tenantId, filter, filters],
          (oldData: any) => {
            if (!oldData) return oldData;

            const items = [...oldData.items];
            
            if (delta.action === 'created') {
              // Add new event to the beginning
              items.unshift(delta.event);
            } else if (delta.action === 'updated') {
              // Update existing event
              const index = items.findIndex(e => e.id === delta.event.id);
              if (index >= 0) {
                items[index] = delta.event;
              }
            } else if (delta.action === 'deleted') {
              // Remove event
              const index = items.findIndex(e => e.id === delta.event.id);
              if (index >= 0) {
                items.splice(index, 1);
              }
            }

            return {
              ...oldData,
              items,
              total: items.length,
            };
          }
        );
      },
      (error) => {
        console.error('SSE error:', error);
      }
    );

    sseCleanupRef.current = cleanup;

    return () => {
      if (sseCleanupRef.current) {
        sseCleanupRef.current();
        sseCleanupRef.current = null;
      }
    };
  }, [enableSSE, tenantId, filter, filters, queryClient]);

  // Mark activity as read
  const markAsRead = useCallback(async (activityId: string) => {
    try {
      await activityService.markAsRead(activityId, tenantId);
      // Refetch to update UI
      refetch();
    } catch (error) {
      console.error('Failed to mark activity as read:', error);
    }
  }, [tenantId, refetch]);

  // Mark all activities as read
  const markAllAsRead = useCallback(async () => {
    try {
      await activityService.markAllAsRead(tenantId);
      // Refetch to update UI
      refetch();
    } catch (error) {
      console.error('Failed to mark all activities as read:', error);
    }
  }, [tenantId, refetch]);

  // Group activities by time
  const groupedActivities = groupActivitiesByTime(activities);

  return {
    activities,
    groupedActivities,
    unreadCount,
    isLoading,
    error: error as Error | null,
    filter,
    setFilter,
    markAsRead,
    markAllAsRead,
    refresh: refetch,
  };
};

export default useActivityFeed;
