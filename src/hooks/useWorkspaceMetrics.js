/**
 * useWorkspaceMetrics Hook
 * 
 * Centralized data hook for workspace charts and metrics.
 * Returns plan-specific metrics for dashboards and analytics.
 * Mock data now, ready for backend wiring.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTenant } from '../contexts/TenantContext';

// Simulate API latency for realistic loading states
const simulateApiCall = (data, delay = 500) => 
  new Promise(resolve => setTimeout(() => resolve(data), delay));

// ============================================================================
// MOCK DATA BY SEGMENT
// ============================================================================

const STARTUP_METRICS = {
  kpiFunnel: [
    { stage: 'Leads', value: 1200, color: '#06b6d4' },
    { stage: 'Qualified', value: 540, color: '#8b5cf6' },
    { stage: 'Contacted', value: 380, color: '#a855f7' },
    { stage: 'Replied', value: 210, color: '#d946ef' },
    { stage: 'Meetings', value: 95, color: '#f43f5e' },
    { stage: 'Pipeline', value: 62, color: '#f97316' },
    { stage: 'Revenue', value: 28, color: '#10b981' },
  ],
  channelMix: [
    { name: 'Email', value: 55, color: '#06b6d4' },
    { name: 'LinkedIn', value: 30, color: '#8b5cf6' },
    { name: 'Phone', value: 10, color: '#f97316' },
    { name: 'SMS', value: 5, color: '#10b981' },
  ],
  roiConfig: {
    seats: 2,
    avgAcv: 25000,
    currentMeetingsPerRep: 8,
    currentReplyRate: 4,
  },
  sparklines: [
    { id: 'meetings', label: 'Meetings/Week', value: '12', change: '+140%', trend: 'up', color: '#06b6d4' },
    { id: 'replies', label: 'Reply Rate', value: '18%', change: '+8%', trend: 'up', color: '#8b5cf6' },
    { id: 'pipeline', label: 'Pipeline', value: '$45K', change: '+65%', trend: 'up', color: '#10b981' },
    { id: 'timeSaved', label: 'Hours Saved', value: '24', change: '+12hrs', trend: 'up', color: '#f97316' },
  ],
  summary: {
    totalLeads: 1200,
    qualifiedLeads: 540,
    activeCampaigns: 3,
    meetingsBooked: 95,
    pipelineValue: 155000,
    avaAutomatedTasks: 847,
    timeSavedHours: 24,
    emailsSent: 2340,
  },
  headline: 'Let Ava run your outbound while you focus on closing',
  cta: { label: 'Let Ava run your outbound', path: '/ava' },
};

const MIDMARKET_METRICS = {
  kpiFunnel: [
    { stage: 'Leads', value: 8500, color: '#06b6d4' },
    { stage: 'Qualified', value: 3800, color: '#8b5cf6' },
    { stage: 'Contacted', value: 2700, color: '#a855f7' },
    { stage: 'Replied', value: 1500, color: '#d946ef' },
    { stage: 'Meetings', value: 720, color: '#f43f5e' },
    { stage: 'Pipeline', value: 480, color: '#f97316' },
    { stage: 'Revenue', value: 220, color: '#10b981' },
  ],
  channelMix: [
    { name: 'Email', value: 42, color: '#06b6d4' },
    { name: 'LinkedIn', value: 32, color: '#8b5cf6' },
    { name: 'Phone', value: 18, color: '#f97316' },
    { name: 'SMS', value: 8, color: '#10b981' },
  ],
  roiConfig: {
    seats: 10,
    avgAcv: 45000,
    currentMeetingsPerRep: 12,
    currentReplyRate: 6,
  },
  sparklines: [
    { id: 'meetings', label: 'Meetings/Week', value: '72', change: '+180%', trend: 'up', color: '#06b6d4' },
    { id: 'replies', label: 'Reply Rate', value: '22%', change: '+12%', trend: 'up', color: '#8b5cf6' },
    { id: 'pipeline', label: 'Pipeline', value: '$1.2M', change: '+85%', trend: 'up', color: '#10b981' },
    { id: 'efficiency', label: 'Rep Efficiency', value: '3.2x', change: '+1.8x', trend: 'up', color: '#f97316' },
  ],
  summary: {
    totalLeads: 8500,
    qualifiedLeads: 3800,
    activeCampaigns: 12,
    meetingsBooked: 720,
    pipelineValue: 1200000,
    avaAutomatedTasks: 12400,
    timeSavedHours: 380,
    emailsSent: 24500,
  },
  headline: 'Automate 80% of outbound—your team handles the rest',
  cta: { label: 'Automate 80% of outbound', path: '/campaigns' },
};

const ENTERPRISE_METRICS = {
  kpiFunnel: [
    { stage: 'Leads', value: 45000, color: '#06b6d4' },
    { stage: 'Qualified', value: 20000, color: '#8b5cf6' },
    { stage: 'Contacted', value: 14500, color: '#a855f7' },
    { stage: 'Replied', value: 8200, color: '#d946ef' },
    { stage: 'Meetings', value: 3800, color: '#f43f5e' },
    { stage: 'Pipeline', value: 2400, color: '#f97316' },
    { stage: 'Revenue', value: 1100, color: '#10b981' },
  ],
  channelMix: [
    { name: 'Email', value: 38, color: '#06b6d4' },
    { name: 'LinkedIn', value: 28, color: '#8b5cf6' },
    { name: 'Phone', value: 22, color: '#f97316' },
    { name: 'SMS', value: 12, color: '#10b981' },
  ],
  roiConfig: {
    seats: 50,
    avgAcv: 85000,
    currentMeetingsPerRep: 15,
    currentReplyRate: 8,
  },
  sparklines: [
    { id: 'meetings', label: 'Meetings/Week', value: '380', change: '+220%', trend: 'up', color: '#06b6d4' },
    { id: 'replies', label: 'Reply Rate', value: '28%', change: '+16%', trend: 'up', color: '#8b5cf6' },
    { id: 'pipeline', label: 'Pipeline', value: '$8.5M', change: '+125%', trend: 'up', color: '#10b981' },
    { id: 'compliance', label: 'Compliance Score', value: '99.2%', change: '+2.1%', trend: 'up', color: '#f97316' },
  ],
  summary: {
    totalLeads: 45000,
    qualifiedLeads: 20000,
    activeCampaigns: 48,
    meetingsBooked: 3800,
    pipelineValue: 8500000,
    avaAutomatedTasks: 89000,
    timeSavedHours: 4200,
    emailsSent: 156000,
  },
  headline: 'Full control over AI-powered revenue operations at scale',
  cta: { label: 'Open control plane', path: '/analytics' },
  securityBadges: ['SOC 2 Type II', 'GDPR', 'HIPAA Ready', 'SSO/SAML'],
};

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export function useWorkspaceMetrics(options = {}) {
  const { plan, isLoading: tenantLoading } = useTenant();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(null);

  // Determine which metrics set to use based on plan
  const getMetricsByPlan = useCallback((planType) => {
    switch (planType) {
      case 'enterprise':
        return ENTERPRISE_METRICS;
      case 'midmarket':
        return MIDMARKET_METRICS;
      case 'startup':
      default:
        return STARTUP_METRICS;
    }
  }, []);

  // Fetch metrics (simulated for now, ready for real API)
  const fetchMetrics = useCallback(async () => {
    if (tenantLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/workspace/metrics?plan=${plan}`);
      // const data = await response.json();
      
      const data = await simulateApiCall(getMetricsByPlan(plan), 300);
      setMetrics(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch metrics');
      // Fallback to startup metrics on error
      setMetrics(STARTUP_METRICS);
    } finally {
      setIsLoading(false);
    }
  }, [plan, tenantLoading, getMetricsByPlan]);

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
      projectedAnnualROI: roiConfig ? 
        (roiConfig.seats * roiConfig.avgAcv * 0.3 * 12) - (roiConfig.seats * 299 * 12) : 0,
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
