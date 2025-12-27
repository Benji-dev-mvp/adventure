/**
 * Analytics Hook
 * Provides access to analytics data and metrics
 */
import { useApiQuery } from './useSimpleApiQuery';
import { AnalyticsApi } from '../lib/analyticsApi';
import { useTenant } from '../contexts/TenantContext';

export function useAnalytics(timeRange = '30d') {
  const { tenantId } = useTenant();

  // Get dashboard stats
  const { data: dashboardStats, loading: loadingDashboard, error: dashboardError } = useApiQuery(
    () => AnalyticsApi.getDashboardStats(tenantId, timeRange),
    [tenantId, timeRange]
  );

  return {
    dashboardStats: dashboardStats || null,
    loading: loadingDashboard,
    error: dashboardError,
  };
}

export function useCampaignAnalytics(campaignId) {
  const { tenantId } = useTenant();

  const { data, loading, error } = useApiQuery(
    () => AnalyticsApi.getCampaignMetrics(tenantId, campaignId),
    [tenantId, campaignId]
  );

  return {
    metrics: data || null,
    loading,
    error,
  };
}

export function useLeadEngagement(params = {}) {
  const { tenantId } = useTenant();

  const { data, loading, error } = useApiQuery(
    () => AnalyticsApi.getLeadEngagement(tenantId, params),
    [tenantId, JSON.stringify(params)]
  );

  return {
    engagement: data || null,
    loading,
    error,
  };
}

export function useRevenueForecast(months = 6) {
  const { tenantId } = useTenant();

  const { data, loading, error } = useApiQuery(
    () => AnalyticsApi.getRevenueForecast(tenantId, months),
    [tenantId, months]
  );

  return {
    forecast: data || null,
    loading,
    error,
  };
}

export function useExecutiveSummary(timeRange = '30d') {
  const { tenantId } = useTenant();

  const { data, loading, error, refetch } = useApiQuery(
    () => AnalyticsApi.getExecutiveSummary(tenantId, timeRange),
    [tenantId, timeRange]
  );

  return {
    summary: data || null,
    loading,
    error,
    refetch,
  };
}

export default useAnalytics;
