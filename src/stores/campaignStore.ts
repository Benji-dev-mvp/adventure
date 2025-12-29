/**
 * Campaign Store - Zustand with Immer middleware
 * Handles campaign state, selection, and draft management
 */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Types
export interface CampaignStep {
  id: string;
  type: 'email' | 'linkedin' | 'call' | 'sms' | 'delay';
  subject?: string;
  content: string;
  delay?: number;
  delayUnit?: 'hours' | 'days';
}

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  type: 'email' | 'linkedin' | 'multichannel';
  objective: string;
  steps: CampaignStep[];
  leadListId?: string;
  metrics: CampaignMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignMetrics {
  sent: number;
  opened: number;
  clicked: number;
  replied: number;
  meetings: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
}

export interface CampaignFilters {
  status?: Campaign['status'];
  type?: Campaign['type'];
  search?: string;
  dateRange?: { start: Date; end: Date };
}

export interface CampaignDraft {
  name: string;
  objective: string;
  type: Campaign['type'];
  steps: CampaignStep[];
  lastSaved: string;
}

interface CampaignState {
  // State
  campaigns: Campaign[];
  activeCampaign: Campaign | null;
  filters: CampaignFilters;
  draft: CampaignDraft | null;
  isBuilderOpen: boolean;

  // Actions
  setCampaigns: (campaigns: Campaign[]) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  selectCampaign: (id: string | null) => void;
  setFilters: (filters: Partial<CampaignFilters>) => void;
  clearFilters: () => void;

  // Draft management
  saveDraft: (draft: Partial<CampaignDraft>) => void;
  clearDraft: () => void;
  restoreDraft: () => CampaignDraft | null;

  // Builder state
  setBuilderOpen: (open: boolean) => void;
}

const defaultFilters: CampaignFilters = {};

export const useCampaignStore = create<CampaignState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        campaigns: [],
        activeCampaign: null,
        filters: defaultFilters,
        draft: null,
        isBuilderOpen: false,

        // Actions
        setCampaigns: (campaigns) =>
          set((state) => {
            state.campaigns = campaigns;
          }),

        addCampaign: (campaign) =>
          set((state) => {
            state.campaigns.push(campaign);
          }),

        updateCampaign: (id, updates) =>
          set((state) => {
            const index = state.campaigns.findIndex((c) => c.id === id);
            if (index !== -1) {
              state.campaigns[index] = { ...state.campaigns[index], ...updates };
              // Update active campaign if it's the one being updated
              if (state.activeCampaign?.id === id) {
                state.activeCampaign = { ...state.activeCampaign, ...updates };
              }
            }
          }),

        deleteCampaign: (id) =>
          set((state) => {
            state.campaigns = state.campaigns.filter((c) => c.id !== id);
            if (state.activeCampaign?.id === id) {
              state.activeCampaign = null;
            }
          }),

        selectCampaign: (id) =>
          set((state) => {
            state.activeCampaign = id
              ? state.campaigns.find((c) => c.id === id) || null
              : null;
          }),

        setFilters: (filters) =>
          set((state) => {
            state.filters = { ...state.filters, ...filters };
          }),

        clearFilters: () =>
          set((state) => {
            state.filters = defaultFilters;
          }),

        // Draft management
        saveDraft: (draft) =>
          set((state) => {
            state.draft = {
              name: draft.name || state.draft?.name || '',
              objective: draft.objective || state.draft?.objective || '',
              type: draft.type || state.draft?.type || 'email',
              steps: draft.steps || state.draft?.steps || [],
              lastSaved: new Date().toISOString(),
            };
          }),

        clearDraft: () =>
          set((state) => {
            state.draft = null;
          }),

        restoreDraft: () => get().draft,

        setBuilderOpen: (open) =>
          set((state) => {
            state.isBuilderOpen = open;
          }),
      })),
      {
        name: 'campaign-storage',
        partialize: (state) => ({
          draft: state.draft,
          filters: state.filters,
        }),
      }
    ),
    { name: 'CampaignStore' }
  )
);

// Selectors
export const selectCampaigns = (state: CampaignState) => state.campaigns;
export const selectActiveCampaign = (state: CampaignState) => state.activeCampaign;
export const selectFilters = (state: CampaignState) => state.filters;
export const selectDraft = (state: CampaignState) => state.draft;

// Derived selectors
export const selectFilteredCampaigns = (state: CampaignState) => {
  const { campaigns, filters } = state;
  return campaigns.filter((campaign) => {
    if (filters.status && campaign.status !== filters.status) return false;
    if (filters.type && campaign.type !== filters.type) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (!campaign.name.toLowerCase().includes(search)) return false;
    }
    return true;
  });
};

export const selectCampaignStats = (state: CampaignState) => {
  const { campaigns } = state;
  return {
    total: campaigns.length,
    active: campaigns.filter((c) => c.status === 'active').length,
    draft: campaigns.filter((c) => c.status === 'draft').length,
    paused: campaigns.filter((c) => c.status === 'paused').length,
    completed: campaigns.filter((c) => c.status === 'completed').length,
  };
};
