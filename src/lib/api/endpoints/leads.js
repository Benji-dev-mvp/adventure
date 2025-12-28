/**
 * Lead API Endpoints
 */
import { apiClient } from '../client';

/**
 * Get all leads with optional filters
 */
export const getLeads = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  return apiClient.get(`/leads?${params.toString()}`);
};

/**
 * Get a single lead by ID
 */
export const getLead = async (id) => {
  return apiClient.get(`/leads/${id}`);
};

/**
 * Create a new lead
 */
export const createLead = async (data) => {
  return apiClient.post('/leads', data);
};

/**
 * Update an existing lead
 */
export const updateLead = async (id, data) => {
  return apiClient.put(`/leads/${id}`, data);
};

/**
 * Delete a lead
 */
export const deleteLead = async (id) => {
  return apiClient.delete(`/leads/${id}`);
};

/**
 * Get lead statistics
 */
export const getLeadStats = async () => {
  return apiClient.get('/leads/stats');
};

/**
 * Bulk import leads
 */
export const bulkImportLeads = async (leads) => {
  return apiClient.post('/leads/bulk', { leads });
};

/**
 * Enrich lead data
 */
export const enrichLead = async (id) => {
  return apiClient.post(`/leads/${id}/enrich`);
};

/**
 * Get lead activity history
 */
export const getLeadActivity = async (id) => {
  return apiClient.get(`/leads/${id}/activity`);
};

export default {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  getLeadStats,
  bulkImportLeads,
  enrichLead,
  getLeadActivity,
};
