/**
 * Campaigns Feature Module
 * Public exports for the campaigns feature
 */

// API
export { campaignApi } from './api/campaignApi';
export type {
  CampaignListResponse,
  CampaignDetailResponse,
  CreateCampaignDTO,
  UpdateCampaignDTO,
  CampaignAnalytics,
} from './api/campaignApi';

// Hooks
export {
  // Query Keys
  campaignKeys,
  // Query Hooks
  useCampaigns,
  useCampaign,
  useCampaignAnalytics,
  useCampaignLeads,
  // Mutation Hooks
  useCreateCampaign,
  useUpdateCampaign,
  useDeleteCampaign,
  useDuplicateCampaign,
  useLaunchCampaign,
  usePauseCampaign,
  useResumeCampaign,
  useGenerateStepContent,
  useAddCampaignLeads,
  useRemoveCampaignLeads,
  // Prefetch Hooks
  usePrefetchCampaigns,
  usePrefetchCampaign,
} from './hooks/useCampaignQueries';

// Re-export types from store
export type {
  Campaign,
  CampaignStep,
  CampaignMetrics,
  CampaignFilters,
  CampaignDraft,
} from '../../stores/campaignStore';
