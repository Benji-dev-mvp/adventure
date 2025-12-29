/**
 * useSegmentExperience - Centralized segment-specific experience configuration
 *
 * Provides segment-aware configurations for:
 * - Dashboard cards and modules to display
 * - KPIs to emphasize
 * - Feature visibility and emphasis
 * - Demo data variations
 */

import { useMemo } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import {
  Brain,
  Target,
  BarChart3,
  Users,
  Zap,
  Cpu,
  TrendingUp,
  Shield,
  Activity,
  Sparkles,
  Play,
  Network,
  Presentation,
  FileText,
  Database,
  Clock,
  Mail,
  Calendar,
  CheckCircle,
} from 'lucide-react';

/**
 * Segment-specific dashboard configurations
 */
const SEGMENT_CONFIGS = {
  startup: {
    title: 'Startup Workspace',
    subtitle: 'Lean, focused automation for growing teams',
    heroMessage: 'Let AI handle your outbound so you can focus on closing deals.',

    // Primary KPIs to show prominently
    primaryKpis: [
      { id: 'meetings', label: 'Meetings Booked', icon: Calendar, color: 'cyan' },
      { id: 'replies', label: 'Replies Received', icon: Mail, color: 'green' },
      { id: 'timeSaved', label: 'Hours Saved', icon: Clock, color: 'purple' },
    ],

    // Modules/cards to display on dashboard
    modules: [
      { id: 'ava-status', title: 'Ava AI BDR Status', priority: 1, size: 'large' },
      { id: 'active-campaigns', title: 'Active Campaigns', priority: 2, size: 'medium' },
      { id: 'quick-analytics', title: 'Quick Analytics', priority: 3, size: 'medium' },
      { id: 'recent-activity', title: 'Recent Activity', priority: 4, size: 'small' },
    ],

    // Features to emphasize in nav/UI
    emphasizedFeatures: ['ava-bdr', 'campaigns', 'analytics'],

    // Features to de-emphasize (show as locked/upgrade)
    lockedFeatures: ['enterprise-admin', 'boardroom', 'observability', 'ai-decisions'],

    // Chart types to use
    charts: ['funnel', 'sparklines'],

    // Color theme accent
    accentColor: 'cyan',
  },

  midmarket: {
    title: 'Revenue Operations Hub',
    subtitle: 'Scale your pipeline with intelligent automation',
    heroMessage: 'Full-funnel visibility with AI-powered execution.',

    primaryKpis: [
      { id: 'pipeline', label: 'Pipeline Value', icon: TrendingUp, color: 'purple' },
      { id: 'coverage', label: 'AI Coverage', icon: Cpu, color: 'blue' },
      { id: 'efficiency', label: 'Automation Rate', icon: Zap, color: 'amber' },
      { id: 'conversions', label: 'Conversion Rate', icon: Target, color: 'green' },
    ],

    modules: [
      { id: 'pipeline-overview', title: 'Pipeline Overview', priority: 1, size: 'large' },
      { id: 'campaign-performance', title: 'Campaign Performance', priority: 2, size: 'medium' },
      { id: 'lead-scoring', title: 'Lead Scoring Insights', priority: 3, size: 'medium' },
      { id: 'playbook-status', title: 'Sales Playbooks', priority: 4, size: 'medium' },
      { id: 'enrichment-queue', title: 'Data Enrichment Queue', priority: 5, size: 'small' },
      { id: 'team-activity', title: 'Team Activity', priority: 6, size: 'small' },
    ],

    emphasizedFeatures: [
      'campaigns',
      'lead-scoring',
      'sales-playbooks',
      'data-enrichment',
      'analytics',
    ],
    lockedFeatures: ['boardroom', 'ai-decisions', 'enterprise-readiness'],
    charts: ['funnel', 'channelMix', 'sparklines', 'roi'],
    accentColor: 'purple',
  },

  enterprise: {
    title: 'Autonomous GTM Command Center',
    subtitle: 'Enterprise-grade AI orchestration and governance',
    heroMessage: 'Full platform control with autonomous execution and complete observability.',

    primaryKpis: [
      { id: 'aiDecisions', label: 'AI Decisions Today', icon: Brain, color: 'amber' },
      { id: 'systemHealth', label: 'System Health', icon: Activity, color: 'green' },
      { id: 'coverage', label: 'AI Coverage', icon: Cpu, color: 'cyan' },
      { id: 'pipeline', label: 'Pipeline Value', icon: TrendingUp, color: 'purple' },
      { id: 'compliance', label: 'Compliance Score', icon: Shield, color: 'blue' },
    ],

    modules: [
      { id: 'executive-summary', title: 'Executive Summary', priority: 1, size: 'full' },
      { id: 'autonomous-status', title: 'Autonomous System Status', priority: 2, size: 'large' },
      { id: 'ai-decisions', title: 'AI Decision Log', priority: 3, size: 'medium' },
      { id: 'pipeline-analytics', title: 'Pipeline Analytics', priority: 4, size: 'medium' },
      { id: 'orchestration-view', title: 'Orchestration Overview', priority: 5, size: 'medium' },
      { id: 'compliance-health', title: 'Compliance & Governance', priority: 6, size: 'medium' },
      { id: 'usage-quotas', title: 'Usage & Quotas', priority: 7, size: 'small' },
      { id: 'audit-recent', title: 'Recent Audit Events', priority: 8, size: 'small' },
    ],

    emphasizedFeatures: [
      'autonomy',
      'autopilot',
      'orchestration',
      'intelligence-graph',
      'boardroom',
      'ai-decisions',
      'observability',
    ],
    lockedFeatures: [], // Enterprise has access to everything
    charts: ['funnel', 'channelMix', 'sparklines', 'roi', 'aiVsHuman', 'systemHealth'],
    accentColor: 'amber',
  },
};

/**
 * Segment-specific demo data for KPIs
 */
const SEGMENT_DEMO_DATA = {
  startup: {
    meetings: { value: 47, change: 23, trend: 'up' },
    replies: { value: 156, change: 18, trend: 'up' },
    timeSaved: { value: 32, change: 12, trend: 'up', unit: 'hrs' },
    activeCampaigns: 3,
    activePlaybooks: 2,
    leadsProcessed: 234,
  },
  midmarket: {
    pipeline: { value: 2450000, change: 15, trend: 'up', format: 'currency' },
    coverage: { value: 78, change: 8, trend: 'up', unit: '%' },
    efficiency: { value: 65, change: 12, trend: 'up', unit: '%' },
    conversions: { value: 4.2, change: 0.8, trend: 'up', unit: '%' },
    activeCampaigns: 12,
    activePlaybooks: 8,
    leadsInPipeline: 1847,
    enrichmentQueue: 156,
  },
  enterprise: {
    aiDecisions: { value: 1247, change: 34, trend: 'up' },
    systemHealth: { value: 99.2, change: 0.1, trend: 'stable', unit: '%' },
    coverage: { value: 94, change: 3, trend: 'up', unit: '%' },
    pipeline: { value: 18500000, change: 22, trend: 'up', format: 'currency' },
    compliance: { value: 98, change: 2, trend: 'up', unit: '%' },
    activeCampaigns: 47,
    activePlaybooks: 23,
    activeOrchestrations: 12,
    auditEventsToday: 892,
    featureFlags: { enabled: 34, total: 41 },
  },
};

/**
 * Hook to get segment-specific experience configuration
 */
export function useSegmentExperience() {
  const { plan, isDemo, isAdmin, tenant } = useTenant();

  const config = useMemo(() => {
    const segmentConfig = SEGMENT_CONFIGS[plan] || SEGMENT_CONFIGS.startup;
    const demoData = SEGMENT_DEMO_DATA[plan] || SEGMENT_DEMO_DATA.startup;

    return {
      ...segmentConfig,
      demoData,
      plan,
      isDemo,
      isAdmin,
      tenantName: tenant?.name || 'Demo Organization',

      // Helper to check if a feature should be emphasized
      isEmphasized: featureId => segmentConfig.emphasizedFeatures.includes(featureId),

      // Helper to check if a feature is locked for this plan
      isLocked: featureId => segmentConfig.lockedFeatures.includes(featureId),

      // Helper to get module by ID
      getModule: moduleId => segmentConfig.modules.find(m => m.id === moduleId),

      // Get modules sorted by priority
      getSortedModules: () => [...segmentConfig.modules].sort((a, b) => a.priority - b.priority),
    };
  }, [plan, isDemo, isAdmin, tenant]);

  return config;
}

/**
 * Hook to get segment-specific KPI data
 */
export function useSegmentKpis() {
  const { plan } = useTenant();

  return useMemo(() => {
    const config = SEGMENT_CONFIGS[plan] || SEGMENT_CONFIGS.startup;
    const demoData = SEGMENT_DEMO_DATA[plan] || SEGMENT_DEMO_DATA.startup;

    return config.primaryKpis.map(kpi => ({
      ...kpi,
      data: demoData[kpi.id] || { value: 0, change: 0, trend: 'stable' },
    }));
  }, [plan]);
}

/**
 * Format a KPI value for display
 */
export function formatKpiValue(data) {
  if (!data) return '–';

  const { value, format, unit } = data;

  if (format === 'currency') {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  }

  if (unit === '%') {
    return `${value}%`;
  }

  if (unit === 'hrs') {
    return `${value} hrs`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return String(value);
}

export default useSegmentExperience;
