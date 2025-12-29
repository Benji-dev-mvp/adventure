/**
 * Store Exports
 * Central export point for all Zustand stores
 */

// User Store
export {
  useUserStore,
  selectUser,
  selectToken,
  selectPreferences,
  selectIsAuthenticated,
  selectTheme,
} from './userStore';
export type { User, UserPreferences } from './userStore';

// Campaign Store
export {
  useCampaignStore,
  selectCampaigns,
  selectActiveCampaign,
  selectFilters as selectCampaignFilters,
  selectDraft,
  selectFilteredCampaigns,
  selectCampaignStats,
} from './campaignStore';
export type {
  Campaign,
  CampaignStep,
  CampaignMetrics,
  CampaignFilters,
  CampaignDraft,
} from './campaignStore';

// Lead Store
export {
  useLeadStore,
  selectLeads,
  selectActiveLead,
  selectSelectedLeads,
  selectFilters as selectLeadFilters,
  selectFilteredLeads,
  selectLeadStats,
} from './leadStore';
export type { Lead, LeadEnrichment, LeadFilters } from './leadStore';

// UI Store
export { useUIStore, selectSidebarCollapsed, selectModals } from './uiStore';
