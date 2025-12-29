/**
 * Campaign Query Hooks
 * TanStack Query hooks for campaign data fetching with optimistic updates
 */
import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { campaignApi, type CreateCampaignDTO, type UpdateCampaignDTO } from '../api/campaignApi';
import type { Campaign, CampaignFilters } from '../../../stores/campaignStore';

// ============================================
// Query Keys Factory
// ============================================

export const campaignKeys = {
  all: ['campaigns'] as const,
  lists: () => [...campaignKeys.all, 'list'] as const,
  list: (filters?: CampaignFilters) => [...campaignKeys.lists(), filters] as const,
  details: () => [...campaignKeys.all, 'detail'] as const,
  detail: (id: string) => [...campaignKeys.details(), id] as const,
  analytics: (id: string) => [...campaignKeys.all, 'analytics', id] as const,
  leads: (id: string) => [...campaignKeys.all, 'leads', id] as const,
};

// ============================================
// Query Hooks
// ============================================

/**
 * Fetch campaigns with filters
 */
export function useCampaigns(
  filters?: CampaignFilters,
  options?: Omit<UseQueryOptions<Campaign[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: campaignKeys.list(filters),
    queryFn: () => campaignApi.list(filters).then(res => res.campaigns),
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
}

/**
 * Fetch a single campaign
 */
export function useCampaign(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Campaign>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: campaignKeys.detail(id!),
    queryFn: () => campaignApi.get(id!),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
    ...options,
  });
}

/**
 * Fetch campaign analytics
 */
export function useCampaignAnalytics(campaignId: string | undefined, period?: string) {
  return useQuery({
    queryKey: campaignKeys.analytics(campaignId!),
    queryFn: () => campaignApi.getAnalytics(campaignId!, period),
    enabled: !!campaignId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // Refetch every minute for live updates
  });
}

/**
 * Fetch campaign leads
 */
export function useCampaignLeads(campaignId: string | undefined) {
  return useQuery({
    queryKey: campaignKeys.leads(campaignId!),
    queryFn: () => campaignApi.getLeads(campaignId!),
    enabled: !!campaignId,
    staleTime: 30 * 1000,
  });
}

// ============================================
// Mutation Hooks
// ============================================

/**
 * Create a new campaign with optimistic update
 */
export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCampaignDTO) => campaignApi.create(data),
    onMutate: async newCampaign => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: campaignKeys.lists() });

      // Snapshot the previous value
      const previousCampaigns = queryClient.getQueryData<Campaign[]>(campaignKeys.lists());

      // Optimistically update to the new value
      if (previousCampaigns) {
        const optimisticCampaign: Campaign = {
          id: `temp-${Date.now()}`,
          name: newCampaign.name,
          type: newCampaign.type,
          objective: newCampaign.objective,
          status: 'draft',
          steps: newCampaign.steps || [],
          metrics: {
            sent: 0,
            opened: 0,
            clicked: 0,
            replied: 0,
            meetings: 0,
            openRate: 0,
            clickRate: 0,
            replyRate: 0,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        queryClient.setQueryData<Campaign[]>(campaignKeys.lists(), [
          optimisticCampaign,
          ...previousCampaigns,
        ]);
      }

      return { previousCampaigns };
    },
    onError: (_err, _newCampaign, context) => {
      // Rollback on error
      if (context?.previousCampaigns) {
        queryClient.setQueryData(campaignKeys.lists(), context.previousCampaigns);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
    },
  });
}

/**
 * Update a campaign with optimistic update
 */
export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCampaignDTO }) =>
      campaignApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: campaignKeys.detail(id) });

      const previousCampaign = queryClient.getQueryData<Campaign>(campaignKeys.detail(id));

      if (previousCampaign) {
        queryClient.setQueryData<Campaign>(campaignKeys.detail(id), {
          ...previousCampaign,
          ...data,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousCampaign };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousCampaign) {
        queryClient.setQueryData(campaignKeys.detail(id), context.previousCampaign);
      }
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
    },
  });
}

/**
 * Delete a campaign
 */
export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => campaignApi.delete(id),
    onMutate: async id => {
      await queryClient.cancelQueries({ queryKey: campaignKeys.lists() });

      const previousCampaigns = queryClient.getQueryData<Campaign[]>(campaignKeys.lists());

      if (previousCampaigns) {
        queryClient.setQueryData<Campaign[]>(
          campaignKeys.lists(),
          previousCampaigns.filter(c => c.id !== id)
        );
      }

      return { previousCampaigns };
    },
    onError: (_err, _id, context) => {
      if (context?.previousCampaigns) {
        queryClient.setQueryData(campaignKeys.lists(), context.previousCampaigns);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
    },
  });
}

/**
 * Duplicate a campaign
 */
export function useDuplicateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name?: string }) => campaignApi.duplicate(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
    },
  });
}

/**
 * Launch a campaign
 */
export function useLaunchCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => campaignApi.launch(id),
    onSuccess: campaign => {
      queryClient.setQueryData(campaignKeys.detail(campaign.id), campaign);
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
    },
  });
}

/**
 * Pause a campaign
 */
export function usePauseCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => campaignApi.pause(id),
    onSuccess: campaign => {
      queryClient.setQueryData(campaignKeys.detail(campaign.id), campaign);
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
    },
  });
}

/**
 * Resume a paused campaign
 */
export function useResumeCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => campaignApi.resume(id),
    onSuccess: campaign => {
      queryClient.setQueryData(campaignKeys.detail(campaign.id), campaign);
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
    },
  });
}

/**
 * Generate AI content for a step
 */
export function useGenerateStepContent() {
  return useMutation({
    mutationFn: ({
      campaignId,
      stepId,
      prompt,
    }: {
      campaignId: string;
      stepId: string;
      prompt: string;
    }) => campaignApi.generateStepContent(campaignId, stepId, prompt),
  });
}

/**
 * Add leads to a campaign
 */
export function useAddCampaignLeads() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ campaignId, leadIds }: { campaignId: string; leadIds: string[] }) =>
      campaignApi.addLeads(campaignId, leadIds),
    onSuccess: (_data, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.leads(campaignId) });
    },
  });
}

/**
 * Remove leads from a campaign
 */
export function useRemoveCampaignLeads() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ campaignId, leadIds }: { campaignId: string; leadIds: string[] }) =>
      campaignApi.removeLeads(campaignId, leadIds),
    onSuccess: (_data, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.leads(campaignId) });
    },
  });
}

// ============================================
// Prefetch Hooks
// ============================================

/**
 * Prefetch campaigns for route transitions
 */
export function usePrefetchCampaigns() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: campaignKeys.lists(),
      queryFn: () => campaignApi.list().then(res => res.campaigns),
      staleTime: 10 * 1000,
    });
  };
}

/**
 * Prefetch a single campaign (useful for hover prefetching)
 */
export function usePrefetchCampaign() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: campaignKeys.detail(id),
      queryFn: () => campaignApi.get(id),
      staleTime: 10 * 1000,
    });
  };
}
