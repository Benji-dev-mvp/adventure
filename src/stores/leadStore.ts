/**
 * Lead Store - Zustand with Immer middleware
 * Handles lead state, selection, and bulk operations
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Types
export interface Lead {
  id: string;
  name: string;
  email: string;
  title: string;
  company: string;
  industry: string;
  location: string;
  phone?: string;
  linkedin?: string;
  score: number;
  status: 'new' | 'contacted' | 'qualified' | 'hot' | 'warm' | 'cold' | 'converted' | 'lost';
  source: string;
  lastContact?: string;
  enrichment?: LeadEnrichment;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LeadEnrichment {
  companySize?: string;
  revenue?: string;
  techStack?: string[];
  recentNews?: string;
  fundingStage?: string;
  linkedinFollowers?: number;
}

export interface LeadFilters {
  status?: Lead['status'];
  scoreMin?: number;
  scoreMax?: number;
  industry?: string;
  source?: string;
  search?: string;
  tags?: string[];
}

interface LeadState {
  // State
  leads: Lead[];
  selectedLeads: Set<string>;
  activeLead: Lead | null;
  filters: LeadFilters;
  sortBy: keyof Lead;
  sortDirection: 'asc' | 'desc';

  // Actions
  setLeads: (leads: Lead[]) => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  deleteLeads: (ids: string[]) => void;

  // Selection
  selectLead: (id: string | null) => void;
  toggleLeadSelection: (id: string) => void;
  selectAllLeads: () => void;
  clearSelection: () => void;
  getSelectedLeads: () => Lead[];

  // Filtering & Sorting
  setFilters: (filters: Partial<LeadFilters>) => void;
  clearFilters: () => void;
  setSort: (column: keyof Lead, direction?: 'asc' | 'desc') => void;

  // Bulk operations
  bulkUpdateStatus: (ids: string[], status: Lead['status']) => void;
  bulkAddTags: (ids: string[], tags: string[]) => void;
  bulkRemoveTags: (ids: string[], tags: string[]) => void;
}

export const useLeadStore = create<LeadState>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      leads: [],
      selectedLeads: new Set(),
      activeLead: null,
      filters: {},
      sortBy: 'score',
      sortDirection: 'desc',

      // Actions
      setLeads: leads =>
        set(state => {
          state.leads = leads;
        }),

      addLead: lead =>
        set(state => {
          state.leads.unshift(lead);
        }),

      updateLead: (id, updates) =>
        set(state => {
          const index = state.leads.findIndex(l => l.id === id);
          if (index !== -1) {
            state.leads[index] = { ...state.leads[index], ...updates };
            if (state.activeLead?.id === id) {
              state.activeLead = { ...state.activeLead, ...updates };
            }
          }
        }),

      deleteLead: id =>
        set(state => {
          state.leads = state.leads.filter(l => l.id !== id);
          state.selectedLeads.delete(id);
          if (state.activeLead?.id === id) {
            state.activeLead = null;
          }
        }),

      deleteLeads: ids =>
        set(state => {
          const idSet = new Set(ids);
          state.leads = state.leads.filter(l => !idSet.has(l.id));
          ids.forEach(id => state.selectedLeads.delete(id));
          if (state.activeLead && idSet.has(state.activeLead.id)) {
            state.activeLead = null;
          }
        }),

      // Selection
      selectLead: id =>
        set(state => {
          state.activeLead = id ? state.leads.find(l => l.id === id) || null : null;
        }),

      toggleLeadSelection: id =>
        set(state => {
          if (state.selectedLeads.has(id)) {
            state.selectedLeads.delete(id);
          } else {
            state.selectedLeads.add(id);
          }
        }),

      selectAllLeads: () =>
        set(state => {
          state.selectedLeads = new Set(state.leads.map(l => l.id));
        }),

      clearSelection: () =>
        set(state => {
          state.selectedLeads = new Set();
        }),

      getSelectedLeads: () => {
        const { leads, selectedLeads } = get();
        return leads.filter(l => selectedLeads.has(l.id));
      },

      // Filtering & Sorting
      setFilters: filters =>
        set(state => {
          state.filters = { ...state.filters, ...filters };
        }),

      clearFilters: () =>
        set(state => {
          state.filters = {};
        }),

      setSort: (column, direction) =>
        set(state => {
          if (state.sortBy === column && !direction) {
            state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
          } else {
            state.sortBy = column;
            state.sortDirection = direction || 'desc';
          }
        }),

      // Bulk operations
      bulkUpdateStatus: (ids, status) =>
        set(state => {
          const idSet = new Set(ids);
          state.leads.forEach(lead => {
            if (idSet.has(lead.id)) {
              lead.status = status;
            }
          });
        }),

      bulkAddTags: (ids, tags) =>
        set(state => {
          const idSet = new Set(ids);
          state.leads.forEach(lead => {
            if (idSet.has(lead.id)) {
              const existingTags = new Set(lead.tags);
              tags.forEach(tag => existingTags.add(tag));
              lead.tags = Array.from(existingTags);
            }
          });
        }),

      bulkRemoveTags: (ids, tags) =>
        set(state => {
          const idSet = new Set(ids);
          const tagsToRemove = new Set(tags);
          state.leads.forEach(lead => {
            if (idSet.has(lead.id)) {
              lead.tags = lead.tags.filter(t => !tagsToRemove.has(t));
            }
          });
        }),
    })),
    { name: 'LeadStore' }
  )
);

// Selectors
export const selectLeads = (state: LeadState) => state.leads;
export const selectActiveLead = (state: LeadState) => state.activeLead;
export const selectSelectedLeads = (state: LeadState) => state.selectedLeads;
export const selectFilters = (state: LeadState) => state.filters;

// Derived selectors
export const selectFilteredLeads = (state: LeadState) => {
  const { leads, filters, sortBy, sortDirection } = state;

  const filtered = leads.filter(lead => {
    if (filters.status && lead.status !== filters.status) return false;
    if (filters.scoreMin !== undefined && lead.score < filters.scoreMin) return false;
    if (filters.scoreMax !== undefined && lead.score > filters.scoreMax) return false;
    if (filters.industry && lead.industry !== filters.industry) return false;
    if (filters.source && lead.source !== filters.source) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const searchable = `${lead.name} ${lead.email} ${lead.company} ${lead.title}`.toLowerCase();
      if (!searchable.includes(search)) return false;
    }
    if (filters.tags?.length) {
      const hasAllTags = filters.tags.every(tag => lead.tags.includes(tag));
      if (!hasAllTags) return false;
    }
    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (aVal === bVal) return 0;
    if (aVal === undefined) return 1;
    if (bVal === undefined) return -1;
    const comparison = aVal < bVal ? -1 : 1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return filtered;
};

export const selectLeadStats = (state: LeadState) => {
  const { leads } = state;
  return {
    total: leads.length,
    hot: leads.filter(l => l.status === 'hot').length,
    warm: leads.filter(l => l.status === 'warm').length,
    cold: leads.filter(l => l.status === 'cold').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    avgScore: leads.length
      ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length)
      : 0,
  };
};
