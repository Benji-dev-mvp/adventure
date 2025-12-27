/**
 * Analytics API Module
 * API calls for analytics, metrics, and reporting
 */
import { apiClient } from './apiClient';

export const AnalyticsApi = {
  // ============================================
  // Dashboard Analytics
  // ============================================
  
  /**
   * Get dashboard overview stats
   */
  getDashboardStats(tenantId, timeRange = '30d') {
    return apiClient.get(`/analytics/${tenantId}/dashboard`, {
      params: { timeRange },
    });
  },
  
  /**
   * Get real-time activity feed
   */
  getActivityFeed(tenantId, limit = 50) {
    return apiClient.get(`/analytics/${tenantId}/activity`, {
      params: { limit },
    });
  },

  // ============================================
  // Campaign Analytics
  // ============================================
  
  /**
   * Get campaign performance metrics
   */
  getCampaignMetrics(tenantId, campaignId) {
    return apiClient.get(`/analytics/${tenantId}/campaigns/${campaignId}`);
  },
  
  /**
   * Get all campaigns performance summary
   */
  getAllCampaignsMetrics(tenantId, params = {}) {
    return apiClient.get(`/analytics/${tenantId}/campaigns`, { params });
  },
  
  /**
   * Get campaign conversion funnel
   */
  getCampaignFunnel(tenantId, campaignId) {
    return apiClient.get(`/analytics/${tenantId}/campaigns/${campaignId}/funnel`);
  },

  // ============================================
  // Lead Analytics
  // ============================================
  
  /**
   * Get lead engagement metrics
   */
  getLeadEngagement(tenantId, params = {}) {
    return apiClient.get(`/analytics/${tenantId}/leads/engagement`, { params });
  },
  
  /**
   * Get lead scoring distribution
   */
  getLeadScoring(tenantId) {
    return apiClient.get(`/analytics/${tenantId}/leads/scoring`);
  },
  
  /**
   * Get lead conversion rates
   */
  getLeadConversion(tenantId, timeRange = '30d') {
    return apiClient.get(`/analytics/${tenantId}/leads/conversion`, {
      params: { timeRange },
    });
  },

  // ============================================
  // Revenue & Forecasting
  // ============================================
  
  /**
   * Get revenue metrics
   */
  getRevenueMetrics(tenantId, timeRange = '30d') {
    return apiClient.get(`/analytics/${tenantId}/revenue`, {
      params: { timeRange },
    });
  },
  
  /**
   * Get revenue forecast
   */
  getRevenueForecast(tenantId, months = 6) {
    return apiClient.get(`/analytics/${tenantId}/revenue/forecast`, {
      params: { months },
    });
  },
  
  /**
   * Get pipeline analysis
   */
  getPipelineAnalysis(tenantId) {
    return apiClient.get(`/analytics/${tenantId}/pipeline`);
  },

  // ============================================
  // Email Analytics
  // ============================================
  
  /**
   * Get email performance stats
   */
  getEmailStats(tenantId, timeRange = '30d') {
    return apiClient.get(`/analytics/${tenantId}/emails`, {
      params: { timeRange },
    });
  },
  
  /**
   * Get email deliverability metrics
   */
  getEmailDeliverability(tenantId) {
    return apiClient.get(`/analytics/${tenantId}/emails/deliverability`);
  },

  // ============================================
  // A/B Testing Analytics
  // ============================================
  
  /**
   * Get A/B test results
   */
  getABTestResults(tenantId, testId) {
    return apiClient.get(`/analytics/${tenantId}/ab-tests/${testId}`);
  },
  
  /**
   * List all A/B tests
   */
  listABTests(tenantId, status = 'active') {
    return apiClient.get(`/analytics/${tenantId}/ab-tests`, {
      params: { status },
    });
  },

  // ============================================
  // Executive Reports
  // ============================================
  
  /**
   * Get executive summary report
   */
  getExecutiveSummary(tenantId, timeRange = '30d') {
    return apiClient.get(`/analytics/${tenantId}/executive-summary`, {
      params: { timeRange },
    });
  },
  
  /**
   * Export analytics report
   */
  exportReport(tenantId, reportType, format = 'pdf') {
    return apiClient.get(`/analytics/${tenantId}/export/${reportType}`, {
      params: { format },
      responseType: 'blob',
    });
  },
};

export default AnalyticsApi;
