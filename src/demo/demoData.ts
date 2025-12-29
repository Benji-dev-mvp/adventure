/**
 * Demo OS Data Contract
 * 
 * Centralized mock data layer for all demo experiences.
 * Backend-ready: All functions return stable shapes with TODOs for API wiring.
 * 
 * Usage:
 * - Every module draws from these shared sources (not random inline mocks)
 * - Plan-aware: Data changes based on startup/midmarket/enterprise tier
 * - Easy to replace with real API calls when ready
 */

export type PlanTier = 'startup' | 'midmarket' | 'enterprise';

export interface DemoTenant {
  id: string;
  name: string;
  plan: PlanTier;
  isDemo: boolean;
  settings: {
    aiEnabled: boolean;
    autoEnrichment: boolean;
    maxCampaigns: number;
    navigationLayout: 'sidebar-only' | 'sidebar-top';
  };
  limits: {
    maxUsers: number;
    maxLeads: number;
    maxEmailsPerMonth: number;
    maxCampaigns: number;
    maxPlaybooks: number;
  };
  usage: {
    currentUsers: number;
    currentLeads: number;
    emailsSentThisMonth: number;
    activeCampaigns: number;
    activePlaybooks: number;
  };
}

export interface DemoKpis {
  pipeline: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  aiCoverage: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  leadsEngaged: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  conversionRate: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  activeTasks: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  responseTime: {
    value: string;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export interface DemoLead {
  id: string;
  name: string;
  email: string;
  company: string;
  title: string;
  status: 'new' | 'contacted' | 'qualified' | 'nurture' | 'converted' | 'lost';
  score: number;
  source: string;
  createdAt: string;
  lastContact: string | null;
  aiEngaged: boolean;
}

export interface DemoCampaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  type: 'email' | 'linkedin' | 'multi-channel';
  leadsTargeted: number;
  leadsEngaged: number;
  conversionRate: number;
  createdAt: string;
  aiOptimized: boolean;
}

export interface DemoPlaybook {
  id: string;
  name: string;
  description: string;
  type: 'outbound' | 'inbound' | 'nurture';
  stages: number;
  successRate: number;
  aiGenerated: boolean;
}

export interface DemoIntegration {
  id: string;
  name: string;
  type: 'crm' | 'email' | 'calendar' | 'enrichment';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string | null;
  icon: string;
}

export interface DemoEvent {
  id: string;
  timestamp: string;
  type: 'ai' | 'human' | 'system';
  actor: string;
  action: string;
  target: string;
  details: string;
  importance: 'low' | 'medium' | 'high';
}

export interface DemoAIDecision {
  id: string;
  timestamp: string;
  decisionType: 'lead_scoring' | 'sequence_optimization' | 'send_time' | 'content_variation' | 'priority_adjustment';
  confidence: number;
  reasoning: string;
  outcome: 'applied' | 'pending' | 'rejected';
  impact: string;
}

export interface DemoEntities {
  leads: DemoLead[];
  campaigns: DemoCampaign[];
  playbooks: DemoPlaybook[];
  integrations: DemoIntegration[];
  sequences: DemoPlaybook[];
}

export interface DemoUsageQuotas {
  users: {
    current: number;
    limit: number;
    percentage: number;
  };
  leads: {
    current: number;
    limit: number;
    percentage: number;
  };
  emails: {
    current: number;
    limit: number;
    percentage: number;
  };
  campaigns: {
    current: number;
    limit: number;
    percentage: number;
  };
  playbooks: {
    current: number;
    limit: number;
    percentage: number;
  };
}

/**
 * Get demo tenant data based on plan
 * TODO: Replace with GET /api/tenant
 */
export function getDemoTenant(plan: PlanTier = 'enterprise'): DemoTenant {
  const limits = {
    startup: {
      maxUsers: 5,
      maxLeads: 1000,
      maxEmailsPerMonth: 5000,
      maxCampaigns: 5,
      maxPlaybooks: 3,
    },
    midmarket: {
      maxUsers: 25,
      maxLeads: 10000,
      maxEmailsPerMonth: 50000,
      maxCampaigns: 25,
      maxPlaybooks: 15,
    },
    enterprise: {
      maxUsers: 100,
      maxLeads: 100000,
      maxEmailsPerMonth: 100000,
      maxCampaigns: 100,
      maxPlaybooks: 50,
    },
  };

  const usage = {
    startup: {
      currentUsers: 2,
      currentLeads: 342,
      emailsSentThisMonth: 1247,
      activeCampaigns: 3,
      activePlaybooks: 2,
    },
    midmarket: {
      currentUsers: 12,
      currentLeads: 4821,
      emailsSentThisMonth: 18923,
      activeCampaigns: 14,
      activePlaybooks: 8,
    },
    enterprise: {
      currentUsers: 45,
      currentLeads: 28493,
      emailsSentThisMonth: 67234,
      activeCampaigns: 42,
      activePlaybooks: 23,
    },
  };

  return {
    id: `demo-tenant-${plan}`,
    name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Demo Organization`,
    plan,
    isDemo: true,
    settings: {
      aiEnabled: true,
      autoEnrichment: plan !== 'startup',
      maxCampaigns: limits[plan].maxCampaigns,
      navigationLayout: 'sidebar-only',
    },
    limits: limits[plan],
    usage: usage[plan],
  };
}

/**
 * Get demo KPIs based on plan
 * TODO: Replace with GET /api/kpis
 */
export function getDemoKpis(plan: PlanTier = 'enterprise'): DemoKpis {
  const kpisByPlan = {
    startup: {
      pipeline: { value: 125000, change: 12, trend: 'up' as const },
      aiCoverage: { value: 45, change: 8, trend: 'up' as const },
      leadsEngaged: { value: 342, change: 23, trend: 'up' as const },
      conversionRate: { value: 3.2, change: 0.5, trend: 'up' as const },
      activeTasks: { value: 23, change: 5, trend: 'stable' as const },
      responseTime: { value: '2.3h', change: -15, trend: 'up' as const },
    },
    midmarket: {
      pipeline: { value: 2400000, change: 18, trend: 'up' as const },
      aiCoverage: { value: 68, change: 12, trend: 'up' as const },
      leadsEngaged: { value: 4821, change: 156, trend: 'up' as const },
      conversionRate: { value: 5.8, change: 1.2, trend: 'up' as const },
      activeTasks: { value: 87, change: 12, trend: 'up' as const },
      responseTime: { value: '1.5h', change: -22, trend: 'up' as const },
    },
    enterprise: {
      pipeline: { value: 12800000, change: 24, trend: 'up' as const },
      aiCoverage: { value: 82, change: 5, trend: 'up' as const },
      leadsEngaged: { value: 28493, change: 892, trend: 'up' as const },
      conversionRate: { value: 8.4, change: 1.8, trend: 'up' as const },
      activeTasks: { value: 234, change: 28, trend: 'up' as const },
      responseTime: { value: '0.8h', change: -35, trend: 'up' as const },
    },
  };

  return kpisByPlan[plan];
}

/**
 * Get demo entities (leads, campaigns, etc.) based on plan
 * TODO: Replace with respective API endpoints
 */
export function getDemoEntities(plan: PlanTier = 'enterprise'): DemoEntities {
  const leadCount = plan === 'startup' ? 10 : plan === 'midmarket' ? 25 : 50;
  const campaignCount = plan === 'startup' ? 3 : plan === 'midmarket' ? 8 : 15;
  const playbookCount = plan === 'startup' ? 2 : plan === 'midmarket' ? 5 : 10;

  // Generate demo leads
  const leads: DemoLead[] = Array.from({ length: leadCount }, (_, i) => ({
    id: `lead-${i + 1}`,
    name: [
      'Sarah Chen', 'Michael Roberts', 'Emily Parker', 'David Kim',
      'Jessica Wu', 'James Anderson', 'Maria Garcia', 'Robert Taylor',
      'Jennifer Lee', 'Christopher Brown', 'Amanda White', 'Daniel Martinez',
    ][i % 12],
    email: `lead${i + 1}@company.com`,
    company: [
      'TechCorp', 'DataFlow Inc', 'CloudScale', 'InnovateLabs',
      'NextGen Systems', 'Digital Dynamics', 'SmartFlow', 'Quantum Analytics',
    ][i % 8],
    title: [
      'VP of Sales', 'Head of Marketing', 'CTO', 'Director of Operations',
      'CEO', 'VP of Engineering', 'CMO', 'Head of Growth',
    ][i % 8],
    status: ['new', 'contacted', 'qualified', 'nurture', 'converted'][i % 5] as DemoLead['status'],
    score: 60 + (i % 40),
    source: ['Website', 'LinkedIn', 'Referral', 'Event'][i % 4],
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    lastContact: i % 3 === 0 ? new Date(Date.now() - i * 3600000).toISOString() : null,
    aiEngaged: i % 2 === 0,
  }));

  // Generate demo campaigns
  const campaigns: DemoCampaign[] = Array.from({ length: campaignCount }, (_, i) => ({
    id: `campaign-${i + 1}`,
    name: [
      'Q1 Outbound Blitz', 'Product Launch Series', 'Re-engagement Campaign',
      'Enterprise ABM', 'Webinar Follow-up', 'Holiday Promo', 'Customer Success',
      'Trial Conversion', 'Partner Outreach', 'Event Promotion', 'Newsletter',
      'Case Study Showcase', 'Feature Announcement', 'Survey Campaign', 'Referral Program',
    ][i % 15],
    status: ['draft', 'active', 'paused', 'completed'][i % 4] as DemoCampaign['status'],
    type: ['email', 'linkedin', 'multi-channel'][i % 3] as DemoCampaign['type'],
    leadsTargeted: 50 + i * 30,
    leadsEngaged: 20 + i * 12,
    conversionRate: 3.5 + (i % 10) * 0.5,
    createdAt: new Date(Date.now() - i * 172800000).toISOString(),
    aiOptimized: i % 2 === 0,
  }));

  // Generate demo playbooks
  const playbooks: DemoPlaybook[] = Array.from({ length: playbookCount }, (_, i) => ({
    id: `playbook-${i + 1}`,
    name: [
      'Enterprise SDR Playbook', 'Inbound Lead Nurture', 'Cold Outbound Sequence',
      'Product Demo Request', 'Trial to Paid Conversion', 'Upsell Existing Customers',
      'Re-engagement Win-back', 'Event Follow-up', 'Referral Request', 'Case Study Distribution',
    ][i % 10],
    description: 'AI-optimized sequence for maximum engagement',
    type: ['outbound', 'inbound', 'nurture'][i % 3] as DemoPlaybook['type'],
    stages: 3 + (i % 5),
    successRate: 45 + (i % 30),
    aiGenerated: i % 3 === 0,
  }));

  // Generate demo integrations
  const integrations: DemoIntegration[] = [
    {
      id: 'int-1',
      name: 'Salesforce',
      type: 'crm',
      status: 'connected',
      lastSync: new Date(Date.now() - 300000).toISOString(),
      icon: '🔵',
    },
    {
      id: 'int-2',
      name: 'HubSpot',
      type: 'crm',
      status: plan === 'startup' ? 'disconnected' : 'connected',
      lastSync: plan === 'startup' ? null : new Date(Date.now() - 600000).toISOString(),
      icon: '🟠',
    },
    {
      id: 'int-3',
      name: 'Gmail',
      type: 'email',
      status: 'connected',
      lastSync: new Date(Date.now() - 120000).toISOString(),
      icon: '📧',
    },
    {
      id: 'int-4',
      name: 'Outlook',
      type: 'email',
      status: plan !== 'startup' ? 'connected' : 'disconnected',
      lastSync: plan !== 'startup' ? new Date(Date.now() - 180000).toISOString() : null,
      icon: '📨',
    },
    {
      id: 'int-5',
      name: 'Google Calendar',
      type: 'calendar',
      status: 'connected',
      lastSync: new Date(Date.now() - 240000).toISOString(),
      icon: '📅',
    },
    {
      id: 'int-6',
      name: 'Clearbit',
      type: 'enrichment',
      status: plan === 'enterprise' ? 'connected' : 'disconnected',
      lastSync: plan === 'enterprise' ? new Date(Date.now() - 900000).toISOString() : null,
      icon: '🔍',
    },
  ];

  return {
    leads,
    campaigns,
    playbooks,
    integrations,
    sequences: playbooks, // Alias for backwards compatibility
  };
}

/**
 * Get demo events for activity feed
 * TODO: Replace with GET /api/events
 */
export function getDemoEvents(plan: PlanTier = 'enterprise'): DemoEvent[] {
  const eventCount = plan === 'startup' ? 15 : plan === 'midmarket' ? 30 : 50;

  const actors = ['Ava AI', 'Sarah Chen', 'Michael Roberts', 'System', 'Emily Parker'];
  const actions = [
    'sent email to',
    'qualified lead',
    'updated campaign',
    'scheduled meeting with',
    'enriched data for',
    'analyzed reply from',
    'optimized sequence for',
    'scored lead',
    'added to campaign',
    'marked as qualified',
  ];
  const targets = [
    'TechCorp', 'DataFlow Inc', 'CloudScale', 'Q1 Campaign',
    'John Smith', 'Enterprise ABM', 'Sarah at InnovateLabs',
  ];

  return Array.from({ length: eventCount }, (_, i) => ({
    id: `event-${i + 1}`,
    timestamp: new Date(Date.now() - i * 600000).toISOString(), // 10 min intervals
    type: ['ai', 'human', 'system'][i % 3] as DemoEvent['type'],
    actor: actors[i % actors.length],
    action: actions[i % actions.length],
    target: targets[i % targets.length],
    details: 'Action completed successfully',
    importance: ['low', 'medium', 'high'][i % 3] as DemoEvent['importance'],
  }));
}

/**
 * Get demo AI decisions
 * TODO: Replace with GET /api/ai/decisions
 */
export function getDemoAIDecisions(plan: PlanTier = 'enterprise'): DemoAIDecision[] {
  const decisionCount = plan === 'startup' ? 10 : plan === 'midmarket' ? 20 : 35;

  const decisions = [
    {
      type: 'lead_scoring' as const,
      reasoning: 'Increased score based on email engagement and company profile fit',
      impact: '+15 points, moved to high-priority queue',
    },
    {
      type: 'sequence_optimization' as const,
      reasoning: 'Adjusted send cadence based on optimal engagement windows',
      impact: '18% improvement in open rates',
    },
    {
      type: 'send_time' as const,
      reasoning: 'Optimized for recipient timezone and historical engagement patterns',
      impact: 'Predicted 23% higher response rate',
    },
    {
      type: 'content_variation' as const,
      reasoning: 'Selected personalized variant based on industry and role',
      impact: 'A/B test winner from similar segments',
    },
    {
      type: 'priority_adjustment' as const,
      reasoning: 'Detected buying signals from recent website activity',
      impact: 'Escalated to top 10% priority leads',
    },
  ];

  return Array.from({ length: decisionCount }, (_, i) => {
    const decision = decisions[i % decisions.length];
    return {
      id: `decision-${i + 1}`,
      timestamp: new Date(Date.now() - i * 900000).toISOString(), // 15 min intervals
      decisionType: decision.type,
      confidence: 75 + (i % 20),
      reasoning: decision.reasoning,
      outcome: ['applied', 'pending', 'rejected'][i % 10 === 0 ? 2 : i % 5 === 0 ? 1 : 0] as DemoAIDecision['outcome'],
      impact: decision.impact,
    };
  });
}

/**
 * Get usage quotas for current plan
 * TODO: Replace with GET /api/tenant/usage
 */
export function getDemoUsageQuotas(plan: PlanTier = 'enterprise'): DemoUsageQuotas {
  const tenant = getDemoTenant(plan);
  
  return {
    users: {
      current: tenant.usage.currentUsers,
      limit: tenant.limits.maxUsers,
      percentage: (tenant.usage.currentUsers / tenant.limits.maxUsers) * 100,
    },
    leads: {
      current: tenant.usage.currentLeads,
      limit: tenant.limits.maxLeads,
      percentage: (tenant.usage.currentLeads / tenant.limits.maxLeads) * 100,
    },
    emails: {
      current: tenant.usage.emailsSentThisMonth,
      limit: tenant.limits.maxEmailsPerMonth,
      percentage: (tenant.usage.emailsSentThisMonth / tenant.limits.maxEmailsPerMonth) * 100,
    },
    campaigns: {
      current: tenant.usage.activeCampaigns,
      limit: tenant.limits.maxCampaigns,
      percentage: (tenant.usage.activeCampaigns / tenant.limits.maxCampaigns) * 100,
    },
    playbooks: {
      current: tenant.usage.activePlaybooks,
      limit: tenant.limits.maxPlaybooks,
      percentage: (tenant.usage.activePlaybooks / tenant.limits.maxPlaybooks) * 100,
    },
  };
}

export default {
  getDemoTenant,
  getDemoKpis,
  getDemoEntities,
  getDemoEvents,
  getDemoAIDecisions,
  getDemoUsageQuotas,
};
