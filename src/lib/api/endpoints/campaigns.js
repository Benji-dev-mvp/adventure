/**
 * Campaign API Endpoints
 */
import { apiClient } from '../client';

/**
 * Get all campaigns with optional filters
 */
export const getCampaigns = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  return apiClient.get(`/campaigns?${params.toString()}`);
};

/**
 * Get a single campaign by ID
 */
export const getCampaign = async (id) => {
  return apiClient.get(`/campaigns/${id}`);
};

/**
 * Create a new campaign
 */
export const createCampaign = async (data) => {
  return apiClient.post('/campaigns', data);
};

/**
 * Update an existing campaign
 */
export const updateCampaign = async (id, data) => {
  return apiClient.put(`/campaigns/${id}`, data);
};

/**
 * Delete a campaign
 */
export const deleteCampaign = async (id) => {
  return apiClient.delete(`/campaigns/${id}`);
};

/**
 * Get campaign statistics
 */
export const getCampaignStats = async (id) => {
  return apiClient.get(`/campaigns/${id}/stats`);
};

/**
 * Get campaign analytics
 */
export const getCampaignAnalytics = async (id, period = '7d') => {
  return apiClient.get(`/campaigns/${id}/analytics?period=${period}`);
};

/**
 * Start/pause a campaign
 */
export const toggleCampaign = async (id, action) => {
  return apiClient.post(`/campaigns/${id}/${action}`);
};

/**
 * Duplicate a campaign
 */
export const duplicateCampaign = async (id) => {
  return apiClient.post(`/campaigns/${id}/duplicate`);
};

export default {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaignStats,
  getCampaignAnalytics,
  toggleCampaign,
  duplicateCampaign,
};
