/**
 * React Query Configuration
 * Provides data fetching with automatic caching, refetching, and optimistic updates
 */
import { QueryClient } from '@tanstack/react-query';

// Create a client with sensible defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 30 seconds
      staleTime: 30 * 1000,
      // Cache data for 5 minutes
      gcTime: 5 * 60 * 1000,
      // Retry failed requests up to 3 times
      retry: 3,
      // Exponential backoff for retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for real-time feel
      refetchOnWindowFocus: true,
      // Don't refetch on mount if data is fresh
      refetchOnMount: true,
      // Keep previous data while fetching new data
      placeholderData: (previousData) => previousData,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
    },
  },
});

// Query keys factory for consistent cache key management
export const queryKeys = {
  // Leads
  leads: {
    all: ['leads'],
    list: (filters) => ['leads', 'list', filters],
    detail: (id) => ['leads', 'detail', id],
    stats: () => ['leads', 'stats'],
  },
  
  // Campaigns
  campaigns: {
    all: ['campaigns'],
    list: (filters) => ['campaigns', 'list', filters],
    detail: (id) => ['campaigns', 'detail', id],
    stats: () => ['campaigns', 'stats'],
    analytics: (id) => ['campaigns', 'analytics', id],
  },
  
  // Dashboard
  dashboard: {
    stats: () => ['dashboard', 'stats'],
    activities: () => ['dashboard', 'activities'],
    metrics: (period) => ['dashboard', 'metrics', period],
  },
  
  // Templates
  templates: {
    all: ['templates'],
    list: (type) => ['templates', 'list', type],
    detail: (id) => ['templates', 'detail', id],
  },
  
  // Integrations
  integrations: {
    all: ['integrations'],
    status: () => ['integrations', 'status'],
  },
  
  // User
  user: {
    current: () => ['user', 'current'],
    preferences: () => ['user', 'preferences'],
    notifications: () => ['user', 'notifications'],
  },
};

// Prefetch helper for route transitions
export const prefetchOnHover = (queryKey, queryFn) => {
  return () => {
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: 10 * 1000, // Consider fresh for 10s for prefetch
    });
  };
};

// Optimistic update helper
export const createOptimisticUpdate = (queryKey, updateFn) => {
  return {
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update
      queryClient.setQueryData(queryKey, (old) => updateFn(old, newData));

      // Return context with snapshot
      return { previousData };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey });
    },
  };
};

// Invalidate related queries helper
export const invalidateRelated = (...queryKeys) => {
  queryKeys.forEach((key) => {
    queryClient.invalidateQueries({ queryKey: key });
  });
};

export default queryClient;
