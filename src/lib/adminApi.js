/**
 * Admin API Module
 * API calls for admin features: API keys, webhooks, audit logs, compliance
 */
import { apiClient } from './apiClient';

export const AdminApi = {
  // ============================================
  // API Keys Management
  // ============================================
  
  /**
   * List all API keys for a tenant
   */
  listApiKeys(tenantId) {
    return apiClient.get(`/admin/${tenantId}/api-keys`);
  },
  
  /**
   * Create a new API key
   */
  createApiKey(tenantId, payload) {
    return apiClient.post(`/admin/${tenantId}/api-keys`, payload);
  },
  
  /**
   * Revoke/delete an API key
   */
  revokeApiKey(tenantId, keyId) {
    return apiClient.delete(`/admin/${tenantId}/api-keys/${keyId}`);
  },
  
  /**
   * Update API key permissions
   */
  updateApiKey(tenantId, keyId, payload) {
    return apiClient.patch(`/admin/${tenantId}/api-keys/${keyId}`, payload);
  },
  
  /**
   * Get API key usage stats
   */
  getApiKeyUsage(tenantId, keyId) {
    return apiClient.get(`/admin/${tenantId}/api-keys/${keyId}/usage`);
  },

  // ============================================
  // Webhooks Management
  // ============================================
  
  /**
   * List all webhooks for a tenant
   */
  listWebhooks(tenantId) {
    return apiClient.get(`/admin/${tenantId}/webhooks`);
  },
  
  /**
   * Create a new webhook
   */
  createWebhook(tenantId, payload) {
    return apiClient.post(`/admin/${tenantId}/webhooks`, payload);
  },
  
  /**
   * Update a webhook
   */
  updateWebhook(tenantId, webhookId, payload) {
    return apiClient.patch(`/admin/${tenantId}/webhooks/${webhookId}`, payload);
  },
  
  /**
   * Delete a webhook
   */
  deleteWebhook(tenantId, webhookId) {
    return apiClient.delete(`/admin/${tenantId}/webhooks/${webhookId}`);
  },
  
  /**
   * Test a webhook
   */
  testWebhook(tenantId, webhookId) {
    return apiClient.post(`/admin/${tenantId}/webhooks/${webhookId}/test`);
  },
  
  /**
   * Get webhook delivery logs
   */
  getWebhookLogs(tenantId, webhookId, params = {}) {
    return apiClient.get(`/admin/${tenantId}/webhooks/${webhookId}/logs`, { params });
  },

  // ============================================
  // Audit Logs
  // ============================================
  
  /**
   * Get audit logs for a tenant
   */
  getAuditLogs(tenantId, params = {}) {
    return apiClient.get(`/admin/${tenantId}/audit-logs`, { params });
  },
  
  /**
   * Export audit logs
   */
  exportAuditLogs(tenantId, format = 'csv') {
    return apiClient.get(`/admin/${tenantId}/audit-logs/export`, {
      params: { format },
      responseType: 'blob',
    });
  },

  // ============================================
  // Compliance & Security
  // ============================================
  
  /**
   * Get compliance status
   */
  getComplianceStatus(tenantId) {
    return apiClient.get(`/admin/${tenantId}/compliance/status`);
  },
  
  /**
   * Get data retention policies
   */
  getDataRetentionPolicies(tenantId) {
    return apiClient.get(`/admin/${tenantId}/compliance/retention-policies`);
  },
  
  /**
   * Update data retention policy
   */
  updateRetentionPolicy(tenantId, policy) {
    return apiClient.put(`/admin/${tenantId}/compliance/retention-policies`, policy);
  },
  
  /**
   * Request data export (GDPR)
   */
  requestDataExport(tenantId, userId) {
    return apiClient.post(`/admin/${tenantId}/compliance/data-export`, { userId });
  },
  
  /**
   * Request data deletion (GDPR)
   */
  requestDataDeletion(tenantId, userId) {
    return apiClient.post(`/admin/${tenantId}/compliance/data-deletion`, { userId });
  },

  // ============================================
  // User & Team Management
  // ============================================
  
  /**
   * List team members
   */
  listTeamMembers(tenantId) {
    return apiClient.get(`/admin/${tenantId}/team`);
  },
  
  /**
   * Invite team member
   */
  inviteTeamMember(tenantId, email, role) {
    return apiClient.post(`/admin/${tenantId}/team/invite`, { email, role });
  },
  
  /**
   * Update team member role
   */
  updateTeamMemberRole(tenantId, userId, role) {
    return apiClient.patch(`/admin/${tenantId}/team/${userId}`, { role });
  },
  
  /**
   * Remove team member
   */
  removeTeamMember(tenantId, userId) {
    return apiClient.delete(`/admin/${tenantId}/team/${userId}`);
  },
};

export default AdminApi;
