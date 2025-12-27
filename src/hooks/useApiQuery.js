/**
 * API Query Hooks
 * Custom hooks for data fetching with React Query
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, createOptimisticUpdate } from '../lib/queryClient';
import * as api from '../lib/dataService';

// ============================================
// Dashboard Hooks
// ============================================

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: api.getDashboardStats,
    staleTime: 60 * 1000, // Fresh for 1 minute
  });
}

export function useDashboardActivities() {
  return useQuery({
    queryKey: queryKeys.dashboard.activities(),
    queryFn: api.getActivities,
    staleTime: 30 * 1000, // Fresh for 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

// ============================================
// Leads Hooks
// ============================================

export function useLeads(filters = {}) {
  return useQuery({
    queryKey: queryKeys.leads.list(filters),
    queryFn: () => api.getLeads(filters),
    staleTime: 30 * 1000,
  });
}

export function useLead(id) {
  return useQuery({
    queryKey: queryKeys.leads.detail(id),
    queryFn: () => api.getLead(id),
    enabled: !!id,
  });
}

export function useLeadStats() {
  return useQuery({
    queryKey: queryKeys.leads.stats(),
    queryFn: api.getLeadStats,
    staleTime: 60 * 1000,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.createLead,
    onSuccess: () => {
      // Invalidate and refetch leads
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => api.updateLead(id, data),
    ...createOptimisticUpdate(
      queryKeys.leads.all,
      (oldLeads, { id, data }) => 
        oldLeads?.map(lead => lead.id === id ? { ...lead, ...data } : lead)
    ),
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
    },
  });
}

// ============================================
// Campaigns Hooks
// ============================================

export function useCampaigns(filters = {}) {
  return useQuery({
    queryKey: queryKeys.campaigns.list(filters),
    queryFn: () => api.getCampaigns(filters),
    staleTime: 30 * 1000,
  });
}

export function useCampaign(id) {
  return useQuery({
    queryKey: queryKeys.campaigns.detail(id),
    queryFn: () => api.getCampaign(id),
    enabled: !!id,
  });
}

export function useCampaignStats() {
  return useQuery({
    queryKey: queryKeys.campaigns.stats(),
    queryFn: api.getCampaignStats,
    staleTime: 60 * 1000,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => api.updateCampaign(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
    },
  });
}

// ============================================
// Templates Hooks
// ============================================

export function useTemplates(type = 'all') {
  return useQuery({
    queryKey: queryKeys.templates.list(type),
    queryFn: () => api.getTemplates(type),
    staleTime: 5 * 60 * 1000, // Templates change less frequently
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
    },
  });
}

// ============================================
// Integrations Hooks
// ============================================

export function useIntegrations() {
  return useQuery({
    queryKey: queryKeys.integrations.all,
    queryFn: api.getIntegrations,
    staleTime: 60 * 1000,
  });
}

export function useIntegrationStatus() {
  return useQuery({
    queryKey: queryKeys.integrations.status(),
    queryFn: api.getIntegrationStatus,
    refetchInterval: 5 * 60 * 1000, // Check every 5 minutes
  });
}

// ============================================
// User Hooks
// ============================================

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.user.current(),
    queryFn: api.getCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: false, // Don't retry if user not authenticated
  });
}

export function useUserPreferences() {
  return useQuery({
    queryKey: queryKeys.user.preferences(),
    queryFn: api.getUserPreferences,
    staleTime: 10 * 60 * 1000,
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.updateUserPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.preferences() });
    },
  });
}

// ============================================
// Prefetch Hooks
// ============================================

export function usePrefetchDashboard() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.dashboard.stats(),
      queryFn: api.getDashboardStats,
    });
    queryClient.prefetchQuery({
      queryKey: queryKeys.dashboard.activities(),
      queryFn: api.getActivities,
    });
  };
}

export function usePrefetchLeads() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.leads.list({}),
      queryFn: () => api.getLeads({}),
    });
  };
}

// ============================================
// Enrichment Hooks
// ============================================

export function useEnrichEmail() {
  return useMutation({
    mutationFn: (email) => api.enrichEmail(email),
  });
}

export function useEnrichBulk() {
  return useMutation({
    mutationFn: (emails) => api.enrichBulk(emails),
  });
}

export function useEnrichCompany() {
  return useMutation({
    mutationFn: (domain) => api.enrichCompany(domain),
  });
}

export function useEnrichmentStatus() {
  return useQuery({
    queryKey: ['enrichment', 'status'],
    queryFn: api.getEnrichmentStatus,
    staleTime: 60 * 1000,
  });
}

// ============================================
// Sequences Hooks
// ============================================

export function useSequences(status = null) {
  return useQuery({
    queryKey: ['sequences', 'list', status],
    queryFn: () => api.getSequences(status),
    staleTime: 30 * 1000,
  });
}

export function useSequence(id) {
  return useQuery({
    queryKey: ['sequences', 'detail', id],
    queryFn: () => api.getSequence(id),
    enabled: !!id,
  });
}

export function useCreateSequence() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.createSequence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sequences'] });
    },
  });
}

export function useUpdateSequence() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => api.updateSequence(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['sequences', 'detail', id] });
      queryClient.invalidateQueries({ queryKey: ['sequences', 'list'] });
    },
  });
}

export function useEnrollLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ sequenceId, leadData }) => api.enrollLead(sequenceId, leadData),
    onSuccess: (_, { sequenceId }) => {
      queryClient.invalidateQueries({ queryKey: ['sequences', 'detail', sequenceId] });
    },
  });
}

export function useSequenceStats(id) {
  return useQuery({
    queryKey: ['sequences', 'stats', id],
    queryFn: () => api.getSequenceStats(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

// ============================================
// AI Hooks
// ============================================

export function useGenerateEmail() {
  return useMutation({
    mutationFn: (params) => api.generateEmail(params),
  });
}

export function useAiChat() {
  return useMutation({
    mutationFn: (message) => api.aiChat(message),
  });
}

