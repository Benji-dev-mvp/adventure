/**
 * useWorkspaceMetrics Hook
 *
 * Centralized data hook for workspace charts and metrics.
 * Returns plan-specific metrics for dashboards and analytics.
 * Mock data now, ready for backend wiring.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { getMetricsForPlan } from '../config/metricsFactory';

// Simulate API latency for realistic loading states
const simulateApiCall = (data, delay = 500) =>
  new Promise(resolve => setTimeout(() => resolve(data), delay));

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export function useWorkspaceMetrics(options = {}) {
  const { plan, isLoading: tenantLoading } = useTenant();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(null);

  // Fetch metrics (simulated for now, ready for real API)
  const fetchMetrics = useCallback(async () => {
    if (tenantLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // API call with fallback to simulated data
      let data;
      try {
        const response = await fetch(`/api/workspace/metrics?plan=${plan}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });
        if (response.ok) {
          data = await response.json();
        } else {
          throw new Error('API unavailable');
        }
      } catch (apiError) {
        // Fallback to simulated data if API is not available
        console.warn('API unavailable, using simulated metrics:', apiError.message);
        data = await simulateApiCall(getMetricsForPlan(plan), 300);
      }
      setMetrics(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch metrics');
      // Fallback to startup metrics on error
      setMetrics(getMetricsForPlan('startup'));
    } finally {
      setIsLoading(false);
    }
  }, [plan, tenantLoading]);

  // Initial fetch and refetch on plan change
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Computed values
  const computed = useMemo(() => {
    if (!metrics) return null;

    const { summary, roiConfig } = metrics;

    return {
      conversionRate: summary.qualifiedLeads / summary.totalLeads,
      meetingToRevenueRate: summary.pipelineValue / summary.meetingsBooked,
      automationRate: summary.avaAutomatedTasks / (summary.avaAutomatedTasks + summary.emailsSent),
      projectedAnnualROI: roiConfig
        ? roiConfig.seats * roiConfig.avgAcv * 0.3 * 12 - roiConfig.seats * 299 * 12
        : 0,
    };
  }, [metrics]);

  // Refresh function for manual refetching
  const refresh = useCallback(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    isLoading: isLoading || tenantLoading,
    error,
    plan,
    computed,
    refresh,
    // Convenience accessors
    kpiFunnel: metrics?.kpiFunnel || [],
    channelMix: metrics?.channelMix || [],
    roiConfig: metrics?.roiConfig || {},
    sparklines: metrics?.sparklines || [],
    summary: metrics?.summary || {},
    headline: metrics?.headline || '',
    cta: metrics?.cta || { label: 'Get Started', path: '/dashboard' },
    securityBadges: metrics?.securityBadges || [],
  };
}

// ============================================================================
// ADDITIONAL UTILITY HOOKS
// ============================================================================

/**
 * Hook for segment-specific headline and CTA
 */
export function useSegmentCTA() {
  const { plan, isStartup, isMidmarket, isEnterprise } = useTenant();

  const segmentContent = useMemo(() => {
    if (isEnterprise) {
      return {
        headline: 'Full control over AI-powered revenue operations',
        subheadline: 'Enterprise-grade security, compliance, and scale',
        cta: { label: 'Open control plane', path: '/analytics' },
        secondaryCta: { label: 'Admin settings', path: '/admin' },
        emphasis: 'control',
      };
    }
    if (isMidmarket) {
      return {
        headline: 'Automate 80% of your outbound workflow',
        subheadline: 'Let your team focus on high-value conversations',
        cta: { label: 'Manage campaigns', path: '/campaigns' },
        secondaryCta: { label: 'View analytics', path: '/analytics' },
        emphasis: 'efficiency',
      };
    }
    // Startup default
    return {
      headline: 'Let Ava run your outbound',
      subheadline: 'AI-powered SDR that books meetings while you sleep',
      cta: { label: 'Talk to Ava', path: '/ava' },
      secondaryCta: { label: 'See results', path: '/dashboard' },
      emphasis: 'automation',
    };
  }, [plan, isStartup, isMidmarket, isEnterprise]);

  return segmentContent;
}

/**
 * Hook for quick stats display (header/sidebar)
 */
export function useQuickStats() {
  const { metrics, isLoading } = useWorkspaceMetrics();

  const quickStats = useMemo(() => {
    if (!metrics?.summary) return [];

    const { summary } = metrics;
    return [
      { label: 'Pipeline', value: `$${(summary.pipelineValue / 1000).toFixed(0)}K`, trend: '+12%' },
      { label: 'Meetings', value: summary.meetingsBooked.toLocaleString(), trend: '+24%' },
      { label: 'Time Saved', value: `${summary.timeSavedHours}hrs`, trend: 'This week' },
    ];
  }, [metrics]);

  return { quickStats, isLoading };
}

export default useWorkspaceMetrics;
