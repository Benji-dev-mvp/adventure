/**
 * Campaigns API Module
 * API calls for campaign management and multi-channel operations
 */
import { apiClient } from './apiClient';

export const CampaignsApi = {
  // ============================================
  // Campaign CRUD
  // ============================================
  
  /**
   * List all campaigns
   */
  listCampaigns(tenantId, params = {}) {
    return apiClient.get(`/campaigns/${tenantId}`, { params });
  },
  
  /**
   * Get single campaign details
   */
  getCampaign(tenantId, campaignId) {
    return apiClient.get(`/campaigns/${tenantId}/${campaignId}`);
  },
  
  /**
   * Create new campaign
   */
  createCampaign(tenantId, payload) {
    return apiClient.post(`/campaigns/${tenantId}`, payload);
  },
  
  /**
   * Update campaign
   */
  updateCampaign(tenantId, campaignId, payload) {
    return apiClient.patch(`/campaigns/${tenantId}/${campaignId}`, payload);
  },
  
  /**
   * Delete campaign
   */
  deleteCampaign(tenantId, campaignId) {
    return apiClient.delete(`/campaigns/${tenantId}/${campaignId}`);
  },
  
  /**
   * Clone/duplicate campaign
   */
  cloneCampaign(tenantId, campaignId) {
    return apiClient.post(`/campaigns/${tenantId}/${campaignId}/clone`);
  },

  // ============================================
  // Campaign Operations
  // ============================================
  
  /**
   * Start/launch campaign
   */
  launchCampaign(tenantId, campaignId) {
    return apiClient.post(`/campaigns/${tenantId}/${campaignId}/launch`);
  },
  
  /**
   * Pause campaign
   */
  pauseCampaign(tenantId, campaignId) {
    return apiClient.post(`/campaigns/${tenantId}/${campaignId}/pause`);
  },
  
  /**
   * Resume paused campaign
   */
  resumeCampaign(tenantId, campaignId) {
    return apiClient.post(`/campaigns/${tenantId}/${campaignId}/resume`);
  },
  
  /**
   * Stop/end campaign
   */
  stopCampaign(tenantId, campaignId) {
    return apiClient.post(`/campaigns/${tenantId}/${campaignId}/stop`);
  },

  // ============================================
  // Multi-Channel Operations
  // ============================================
  
  /**
   * Get campaign channels configuration
   */
  getCampaignChannels(tenantId, campaignId) {
    return apiClient.get(`/campaigns/${tenantId}/${campaignId}/channels`);
  },
  
  /**
   * Update campaign channels
   */
  updateCampaignChannels(tenantId, campaignId, channels) {
    return apiClient.put(`/campaigns/${tenantId}/${campaignId}/channels`, channels);
  },
  
  /**
   * Send test campaign
   */
  sendTestCampaign(tenantId, campaignId, testRecipients) {
    return apiClient.post(`/campaigns/${tenantId}/${campaignId}/test`, {
      recipients: testRecipients,
    });
  },

  // ============================================
  // Campaign Sequences
  // ============================================
  
  /**
   * Get campaign sequence steps
   */
  getSequenceSteps(tenantId, campaignId) {
    return apiClient.get(`/campaigns/${tenantId}/${campaignId}/sequence`);
  },
  
  /**
   * Update sequence steps
   */
  updateSequenceSteps(tenantId, campaignId, steps) {
    return apiClient.put(`/campaigns/${tenantId}/${campaignId}/sequence`, { steps });
  },
  
  /**
   * Add sequence step
   */
  addSequenceStep(tenantId, campaignId, step) {
    return apiClient.post(`/campaigns/${tenantId}/${campaignId}/sequence/steps`, step);
  },

  // ============================================
  // Campaign Templates
  // ============================================
  
  /**
   * Get campaign templates
   */
  getTemplates(tenantId, type = 'all') {
    return apiClient.get(`/campaigns/${tenantId}/templates`, {
      params: { type },
    });
  },
  
  /**
   * Create campaign from template
   */
  createFromTemplate(tenantId, templateId) {
    return apiClient.post(`/campaigns/${tenantId}/templates/${templateId}/create`);
  },
  
  /**
   * Save campaign as template
   */
  saveAsTemplate(tenantId, campaignId, templateName) {
    return apiClient.post(`/campaigns/${tenantId}/${campaignId}/save-template`, {
      name: templateName,
    });
  },

  // ============================================
  // Campaign Leads
  // ============================================
  
  /**
   * Get campaign leads/recipients
   */
  getCampaignLeads(tenantId, campaignId, params = {}) {
    return apiClient.get(`/campaigns/${tenantId}/${campaignId}/leads`, { params });
  },
  
  /**
   * Add leads to campaign
   */
  addLeadsToCampaign(tenantId, campaignId, leadIds) {
    return apiClient.post(`/campaigns/${tenantId}/${campaignId}/leads`, {
      leadIds,
    });
  },
  
  /**
   * Remove leads from campaign
   */
  removeLeadsFromCampaign(tenantId, campaignId, leadIds) {
    return apiClient.delete(`/campaigns/${tenantId}/${campaignId}/leads`, {
      data: { leadIds },
    });
  },
};

export default CampaignsApi;
