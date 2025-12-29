/**
 * Demo Data - Coherent, segment-aware datasets
 *
 * Provides realistic demo data that:
 * - Is coherent across all modules (leads, campaigns, playbooks)
 * - Has deterministic time-series (consistent across page loads)
 * - Reflects segment capabilities (startup vs midmarket vs enterprise)
 * - Includes sample events for activity stream
 */

// ============================================
// SEGMENT-AWARE CONFIGURATION
// ============================================

export const DEMO_CONFIG = {
  startup: {
    name: 'TechStartup Inc',
    domain: 'techstartup.io',
    employees: 12,
    avgLeadsPerCampaign: 500,
    avgReplyRate: 0.15,
    avgMeetingRate: 0.06,
    campaignCount: 3,
    playbookCount: 2,
    teamSize: 2,
    modules: ['campaigns', 'leads', 'analytics', 'ai-assistant'],
  },
  midmarket: {
    name: 'Acme Corp Ventures',
    domain: 'acme-corp.com',
    employees: 250,
    avgLeadsPerCampaign: 3500,
    avgReplyRate: 0.22,
    avgMeetingRate: 0.09,
    campaignCount: 12,
    playbookCount: 8,
    teamSize: 8,
    modules: [
      'campaigns',
      'leads',
      'analytics',
      'ai-assistant',
      'workflows',
      'integrations',
      'team-collaboration',
      'revenue-forecasting',
    ],
  },
  enterprise: {
    name: 'Global Enterprise Solutions',
    domain: 'global-enterprise.com',
    employees: 5000,
    avgLeadsPerCampaign: 15000,
    avgReplyRate: 0.28,
    avgMeetingRate: 0.12,
    campaignCount: 47,
    playbookCount: 23,
    teamSize: 45,
    modules: [
      'campaigns',
      'leads',
      'analytics',
      'ai-assistant',
      'workflows',
      'integrations',
      'team-collaboration',
      'revenue-forecasting',
      'compliance-center',
      'orchestration',
      'autonomy',
      'boardroom',
      'ai-decisions',
      'observability',
      'admin-api-keys',
      'admin-webhooks',
      'admin-audit-log',
      'admin-access-control',
    ],
  },
};

// ============================================
// TIME-SERIES HELPERS (DETERMINISTIC)
// ============================================

/**
 * Generate deterministic time-series data for charts
 * Uses a seeded hash instead of Math.random() so data is consistent
 */
function seededRandom(seed: number, min = 0, max = 1): number {
  const x = Math.sin(seed) * 10000;
  return min + (x - Math.floor(x)) * (max - min);
}

/**
 * Simple date subtraction helper
 */
function getDateString(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}`;
}

/**
 * Generate time-series data for a metric (e.g., daily leads over 30 days)
 */
export function generateTimeSeries(
  metricName: string,
  days = 30,
  baseValue = 100,
  volatility = 0.2
): Array<{ date: string; value: number; label: string }> {
  return Array.from({ length: days }, (_, i) => {
    const daysAgo = days - i - 1;
    const seed = metricName.charCodeAt(0) + daysAgo;
    const noise = seededRandom(seed, 1 - volatility, 1 + volatility);
    const trend = i / days; // Slight upward trend
    const value = Math.round(baseValue * (0.8 + trend * 0.4) * noise);
    const dateStr = getDateString(daysAgo);

    return {
      date: dateStr,
      value,
      label: `${new Date().getFullYear()}-${String(daysAgo).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
    };
  });
}

/**
 * Generate coherent lead data for a campaign
 */
export function generateLeads(
  campaignId: string,
  count: number,
  startDate: Date
): Array<{
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'new' | 'contacted' | 'replied' | 'meeting' | 'qualified' | 'unqualified';
  createdAt: Date;
  lastActivity: Date;
  score: number;
}> {
  const companies = [
    'Tech Solutions',
    'Digital Ventures',
    'Cloud Innovations',
    'Data Systems',
    'AI Collective',
    'Growth Labs',
    'Future Corp',
    'NextGen Inc',
  ];

  return Array.from({ length: count }, (_, i) => {
    const seed = campaignId.charCodeAt(0) + i;
    const companyIdx = Math.floor(seededRandom(seed) * companies.length);
    const statusIdx = Math.floor(seededRandom(seed + 1) * 5);
    const daysAgo = Math.floor(seededRandom(seed + 3) * 30);

    const statuses: Array<
      'new' | 'contacted' | 'replied' | 'meeting' | 'qualified' | 'unqualified'
    > = ['new', 'contacted', 'replied', 'meeting', 'qualified'];

    const createdAt = new Date(startDate);
    createdAt.setDate(createdAt.getDate() - daysAgo);

    const lastActivityDate = new Date();
    lastActivityDate.setDate(lastActivityDate.getDate() - Math.floor(seededRandom(seed + 2) * 3));

    return {
      id: `lead_${campaignId}_${i}`,
      name: `Lead ${i + 1} Contact`,
      email: `contact${i}@${companies[companyIdx].toLowerCase().replace(/\s/g, '')}.com`,
      company: companies[companyIdx],
      status: statuses[Math.min(statusIdx, statuses.length - 1)],
      createdAt,
      lastActivity: lastActivityDate,
      score: Math.round(seededRandom(seed + 4) * 100),
    };
  });
}

/**
 * Generate campaign data
 */
export function generateCampaigns(
  segment: 'startup' | 'midmarket' | 'enterprise',
  count: number
): Array<{
  id: string;
  name: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  createdAt: Date;
  startDate: Date;
  leadsCount: number;
  repliesCount: number;
  meetingsCount: number;
  replyRate: number;
  meetingRate: number;
}> {
  const config = DEMO_CONFIG[segment];
  const templates = [
    'Q1 Partnership Outreach',
    'Enterprise Solution Discovery',
    'Product Demo Campaign',
    'Case Study Follow-up',
    'Year-End Event Promotion',
    'New Feature Announcement',
    'Referral Program Launch',
    'Executive Briefing Series',
  ];

  return Array.from({ length: Math.min(count, config.campaignCount) }, (_, i) => {
    const seed = segment.charCodeAt(0) + i;
    const templateIdx = Math.floor(seededRandom(seed) * templates.length);
    const statusMap = ['draft', 'running', 'paused', 'completed'] as const;
    const statusIdx = Math.floor(seededRandom(seed + 1) * statusMap.length);

    const leadsCount = Math.round(config.avgLeadsPerCampaign * seededRandom(seed + 2, 0.7, 1.3));
    const repliesCount = Math.round(
      leadsCount * config.avgReplyRate * seededRandom(seed + 3, 0.8, 1.2)
    );
    const meetingsCount = Math.round(
      repliesCount *
        (config.avgMeetingRate / config.avgReplyRate) *
        seededRandom(seed + 4, 0.8, 1.2)
    );

    const daysAgo = Math.floor(seededRandom(seed + 5) * 90);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    const startDate = new Date(createdAt);
    startDate.setDate(startDate.getDate() - Math.floor(seededRandom(seed + 6) * 14));

    return {
      id: `camp_${segment}_${i}`,
      name: `${templates[templateIdx]} - Wave ${i + 1}`,
      status: statusMap[statusIdx],
      createdAt,
      startDate,
      leadsCount,
      repliesCount,
      meetingsCount,
      replyRate: repliesCount / leadsCount,
      meetingRate: meetingsCount / repliesCount || 0,
    };
  });
}

/**
 * Generate activity events
 */
export function generateActivityEvents(count: number = 20): Array<{
  id: string;
  type: string;
  entityType: string;
  entityLabel: string;
  timestamp: Date;
  actor: { id: string; name: string; avatar?: string };
  description: string;
}> {
  const eventTypes = [
    'campaign_launched',
    'email_sent',
    'reply_received',
    'meeting_scheduled',
    'lead_scored',
    'playbook_executed',
  ];

  const actors = [
    { id: 'user_1', name: 'Sarah Chen' },
    { id: 'user_2', name: 'Mike Johnson' },
    { id: 'ai_1', name: 'AI Assistant' },
    { id: 'workflow_1', name: 'Automation' },
  ];

  return Array.from({ length: count }, (_, i) => {
    const seed = i;
    const eventType = eventTypes[Math.floor(seededRandom(seed) * eventTypes.length)];
    const actor = actors[Math.floor(seededRandom(seed + 1) * actors.length)];
    const minutesAgo = Math.floor(seededRandom(seed + 2) * 1440); // Last 24h

    const descriptions: Record<string, string> = {
      campaign_launched: `Launched campaign "${['Q1 Outreach', 'Enterprise Discovery', 'Product Demo'][Math.floor(seededRandom(seed + 3) * 3)]}"`,
      email_sent: `Sent email to ${Math.floor(seededRandom(seed + 3) * 500) + 50} leads`,
      reply_received: `Received reply from ${['Acme Corp', 'Tech Ventures', 'Growth Labs'][Math.floor(seededRandom(seed + 3) * 3)]}`,
      meeting_scheduled: `Meeting scheduled with sales prospect`,
      lead_scored: `${Math.floor(seededRandom(seed + 3) * 20) + 5} leads scored and qualified`,
      playbook_executed: `Playbook "${['Discovery Call', 'Follow-up Sequence', 'Demo Request'][Math.floor(seededRandom(seed + 3) * 3)]}" executed`,
    };

    const timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() - minutesAgo);

    return {
      id: `event_${i}`,
      type: eventType,
      entityType: 'campaign',
      entityLabel: 'Wave 1 - Q1',
      timestamp,
      actor,
      description: descriptions[eventType] || 'Event occurred',
    };
  });
}

// ============================================
// KPI DATA (SEGMENT-AWARE)
// ============================================

export function generateKpiData(segment: 'startup' | 'midmarket' | 'enterprise') {
  const config = DEMO_CONFIG[segment];

  const baseKpis = {
    startup: {
      meetings: { value: 47, change: 23, trend: 'up', unit: '' },
      replies: { value: 156, change: 18, trend: 'up', unit: '' },
      timeSaved: { value: 32, change: 12, trend: 'up', unit: 'hrs' },
      activeCampaigns: config.campaignCount,
      activePlaybooks: config.playbookCount,
      leadsProcessed: 234,
    },
    midmarket: {
      pipeline: {
        value: 2450000,
        change: 15,
        trend: 'up' as const,
        format: 'currency' as const,
      },
      coverage: { value: 78, change: 8, trend: 'up' as const, unit: '%' },
      efficiency: { value: 65, change: 12, trend: 'up' as const, unit: '%' },
      conversions: { value: 4.2, change: 0.8, trend: 'up' as const, unit: '%' },
      activeCampaigns: config.campaignCount,
      activePlaybooks: config.playbookCount,
      leadsInPipeline: 1847,
      enrichmentQueue: 156,
    },
    enterprise: {
      aiDecisions: { value: 1247, change: 34, trend: 'up' as const },
      systemHealth: { value: 99.2, change: 0.1, trend: 'stable' as const, unit: '%' },
      coverage: { value: 94, change: 3, trend: 'up' as const, unit: '%' },
      pipeline: {
        value: 18500000,
        change: 22,
        trend: 'up' as const,
        format: 'currency' as const,
      },
      compliance: { value: 98, change: 2, trend: 'up' as const, unit: '%' },
      activeCampaigns: config.campaignCount,
      activePlaybooks: config.playbookCount,
      activeOrchestrations: 12,
      auditEventsToday: 892,
      featureFlags: { enabled: 34, total: 41 },
    },
  };

  return baseKpis[segment];
}

// ============================================
// CHART DATA (SEGMENT-AWARE)
// ============================================

export function generateChannelMixData(segment: 'startup' | 'midmarket' | 'enterprise') {
  const config = DEMO_CONFIG[segment];

  if (segment === 'startup') {
    return [
      { name: 'Email', value: 65 },
      { name: 'LinkedIn', value: 25 },
      { name: 'Direct', value: 10 },
    ];
  }

  if (segment === 'midmarket') {
    return [
      { name: 'Email', value: 45 },
      { name: 'LinkedIn', value: 30 },
      { name: 'Phone', value: 15 },
      { name: 'Events', value: 10 },
    ];
  }

  return [
    { name: 'Email', value: 35 },
    { name: 'LinkedIn', value: 25 },
    { name: 'Phone', value: 20 },
    { name: 'Events', value: 12 },
    { name: 'Direct', value: 5 },
    { name: 'Partnerships', value: 3 },
  ];
}

export function generateFunnelData(segment: 'startup' | 'midmarket' | 'enterprise') {
  const config = DEMO_CONFIG[segment];

  const baseFunnel = [
    { name: 'Leads', value: config.avgLeadsPerCampaign * 3 },
    { name: 'Engaged', value: Math.round(config.avgLeadsPerCampaign * 3 * 0.5) },
    { name: 'Qualified', value: Math.round(config.avgLeadsPerCampaign * 3 * 0.25) },
    { name: 'Meetings', value: Math.round(config.avgLeadsPerCampaign * 3 * 0.1) },
    { name: 'Deals', value: Math.round(config.avgLeadsPerCampaign * 3 * 0.04) },
  ];

  return baseFunnel;
}

export function generateRoiData(segment: 'startup' | 'midmarket' | 'enterprise') {
  const config = DEMO_CONFIG[segment];

  return {
    spent: segment === 'startup' ? 5000 : segment === 'midmarket' ? 50000 : 500000,
    revenue: segment === 'startup' ? 45000 : segment === 'midmarket' ? 1250000 : 18500000,
    deals: segment === 'startup' ? 8 : segment === 'midmarket' ? 47 : 234,
    avgDealSize: segment === 'startup' ? 5625 : segment === 'midmarket' ? 26595 : 79059,
  };
}

/**
 * Export all demo data generators as a bundle
 */
export const demoData = {
  config: DEMO_CONFIG,
  generateTimeSeries,
  generateLeads,
  generateCampaigns,
  generateActivityEvents,
  generateKpiData,
  generateChannelMixData,
  generateFunnelData,
  generateRoiData,
};

export default demoData;
