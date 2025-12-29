/**
 * Campaign API Module
 * Type-safe API calls for campaign operations
 */
import { api } from '../../../lib/apiClient';
import type { Campaign, CampaignFilters, CampaignStep } from '../../../stores/campaignStore';

// API Response types
export interface CampaignListResponse {
  campaigns: Campaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CampaignDetailResponse {
  campaign: Campaign;
}

export interface CreateCampaignDTO {
  name: string;
  type: Campaign['type'];
  objective: string;
  steps?: CampaignStep[];
  leadListId?: string;
  templateId?: string;
}

export interface UpdateCampaignDTO {
  name?: string;
  type?: Campaign['type'];
  objective?: string;
  status?: Campaign['status'];
  steps?: CampaignStep[];
}

export interface CampaignAnalytics {
  campaignId: string;
  period: string;
  metrics: {
    sent: number;
    opened: number;
    clicked: number;
    replied: number;
    meetings: number;
    unsubscribed: number;
    bounced: number;
  };
  timeline: Array<{
    date: string;
    sent: number;
    opened: number;
    clicked: number;
    replied: number;
  }>;
  topPerformingSteps: Array<{
    stepId: string;
    type: string;
    openRate: number;
    replyRate: number;
  }>;
}

// Campaign API methods
export const campaignApi = {
  /**
   * List campaigns with optional filters
   */
  list: (filters?: CampaignFilters): Promise<CampaignListResponse> =>
    api.get<CampaignListResponse>('campaigns', {
      searchParams: filters as Record<string, string>,
    }),

  /**
   * Get a single campaign by ID
   */
  get: (id: string): Promise<Campaign> =>
    api
      .get<CampaignDetailResponse>(`campaigns/${id}`)
      .then((res: CampaignDetailResponse) => res.campaign),

  /**
   * Create a new campaign
   */
  create: (data: CreateCampaignDTO): Promise<Campaign> => api.post<Campaign>('campaigns', data),

  /**
   * Update an existing campaign
   */
  update: (id: string, data: UpdateCampaignDTO): Promise<Campaign> =>
    api.patch<Campaign>(`campaigns/${id}`, data),

  /**
   * Delete a campaign
   */
  delete: (id: string): Promise<void> => api.delete<void>(`campaigns/${id}`),

  /**
   * Duplicate a campaign
   */
  duplicate: (id: string, name?: string): Promise<Campaign> =>
    api.post<Campaign>(`campaigns/${id}/duplicate`, { name }),

  /**
   * Launch a campaign (change status to active)
   */
  launch: (id: string): Promise<Campaign> => api.post<Campaign>(`campaigns/${id}/launch`),

  /**
   * Pause a campaign
   */
  pause: (id: string): Promise<Campaign> => api.post<Campaign>(`campaigns/${id}/pause`),

  /**
   * Resume a paused campaign
   */
  resume: (id: string): Promise<Campaign> => api.post<Campaign>(`campaigns/${id}/resume`),

  /**
   * Archive a campaign
   */
  archive: (id: string): Promise<Campaign> => api.post<Campaign>(`campaigns/${id}/archive`),

  /**
   * Get campaign analytics
   */
  getAnalytics: (id: string, period?: string): Promise<CampaignAnalytics> =>
    api.get<CampaignAnalytics>(`campaigns/${id}/analytics`, {
      searchParams: period ? { period } : undefined,
    }),

  /**
   * Add a step to a campaign
   */
  addStep: (campaignId: string, step: Omit<CampaignStep, 'id'>): Promise<CampaignStep> =>
    api.post<CampaignStep>(`campaigns/${campaignId}/steps`, step),

  /**
   * Update a campaign step
   */
  updateStep: (
    campaignId: string,
    stepId: string,
    step: Partial<CampaignStep>
  ): Promise<CampaignStep> =>
    api.patch<CampaignStep>(`campaigns/${campaignId}/steps/${stepId}`, step),

  /**
   * Delete a campaign step
   */
  deleteStep: (campaignId: string, stepId: string): Promise<void> =>
    api.delete<void>(`campaigns/${campaignId}/steps/${stepId}`),

  /**
   * Reorder campaign steps
   */
  reorderSteps: (campaignId: string, stepIds: string[]): Promise<CampaignStep[]> =>
    api.post<CampaignStep[]>(`campaigns/${campaignId}/steps/reorder`, { stepIds }),

  /**
   * Generate AI content for a step
   */
  generateStepContent: (
    campaignId: string,
    stepId: string,
    prompt: string
  ): Promise<{ content: string; subject?: string }> =>
    api.post<{ content: string; subject?: string }>(
      `campaigns/${campaignId}/steps/${stepId}/generate`,
      { prompt }
    ),

  /**
   * Preview campaign email
   */
  preview: (
    campaignId: string,
    stepId: string,
    leadId: string
  ): Promise<{ subject: string; body: string }> =>
    api.get<{ subject: string; body: string }>(`campaigns/${campaignId}/steps/${stepId}/preview`, {
      searchParams: { leadId },
    }),

  /**
   * Get campaign leads
   */
  getLeads: (campaignId: string): Promise<{ leads: Array<{ id: string; status: string }> }> =>
    api.get<{ leads: Array<{ id: string; status: string }> }>(`campaigns/${campaignId}/leads`),

  /**
   * Add leads to campaign
   */
  addLeads: (campaignId: string, leadIds: string[]): Promise<void> =>
    api.post<void>(`campaigns/${campaignId}/leads`, { leadIds }),

  /**
   * Remove leads from campaign
   */
  removeLeads: (campaignId: string, leadIds: string[]): Promise<void> =>
    api.delete<void>(`campaigns/${campaignId}/leads`, {
      json: { leadIds },
    }),
};

export default campaignApi;
