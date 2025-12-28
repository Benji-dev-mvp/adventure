/**
 * Analytics API Endpoints
 */
import { apiClient } from '../client';

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  return apiClient.get('/analytics/dashboard');
};

/**
 * Get dashboard activities
 */
export const getDashboardActivities = async (limit = 10) => {
  return apiClient.get(`/analytics/activities?limit=${limit}`);
};

/**
 * Get analytics for a specific period
 */
export const getAnalytics = async (period = '7d', metrics = []) => {
  const params = new URLSearchParams({ period });
  metrics.forEach((metric) => params.append('metrics', metric));
  return apiClient.get(`/analytics?${params.toString()}`);
};

/**
 * Get performance metrics
 */
export const getPerformanceMetrics = async (startDate, endDate) => {
  const params = new URLSearchParams({ startDate, endDate });
  return apiClient.get(`/analytics/performance?${params.toString()}`);
};

/**
 * Get conversion funnel data
 */
export const getConversionFunnel = async (campaignId = null) => {
  const url = campaignId
    ? `/analytics/funnel?campaignId=${campaignId}`
    : '/analytics/funnel';
  return apiClient.get(url);
};

/**
 * Get engagement metrics
 */
export const getEngagementMetrics = async (type = 'all') => {
  return apiClient.get(`/analytics/engagement?type=${type}`);
};

/**
 * Export analytics data
 */
export const exportAnalytics = async (format = 'csv', filters = {}) => {
  const params = new URLSearchParams({ format, ...filters });
  return apiClient.get(`/analytics/export?${params.toString()}`);
};

export default {
  getDashboardStats,
  getDashboardActivities,
  getAnalytics,
  getPerformanceMetrics,
  getConversionFunnel,
  getEngagementMetrics,
  exportAnalytics,
};
