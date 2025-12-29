/**
 * Metrics Data Factory
 *
 * Centralized metrics definitions for all plan tiers.
 * Eliminates duplication of sparklines, funnels, and summaries.
 */

export const SPARKLINE_TEMPLATES = {
  meetings: (value, change, color = '#06b6d4') => ({
    id: 'meetings',
    label: 'Meetings/Week',
    value,
    change,
    trend: 'up',
    color,
  }),
  replies: (value, change, color = '#8b5cf6') => ({
    id: 'replies',
    label: 'Reply Rate',
    value,
    change,
    trend: 'up',
    color,
  }),
  pipeline: (value, change, color = '#10b981') => ({
    id: 'pipeline',
    label: 'Pipeline',
    value,
    change,
    trend: 'up',
    color,
  }),
  timeSaved: (value, change, color = '#f97316') => ({
    id: 'timeSaved',
    label: 'Hours Saved',
    value,
    change,
    trend: 'up',
    color,
  }),
  efficiency: (value, change, color = '#f97316') => ({
    id: 'efficiency',
    label: 'Rep Efficiency',
    value,
    change,
    trend: 'up',
    color,
  }),
  compliance: (value, change, color = '#f97316') => ({
    id: 'compliance',
    label: 'Compliance Score',
    value,
    change,
    trend: 'up',
    color,
  }),
};

const FUNNEL_STAGES = [
  'Leads',
  'Qualified',
  'Contacted',
  'Replied',
  'Meetings',
  'Pipeline',
  'Revenue',
];
const FUNNEL_COLORS = ['#06b6d4', '#8b5cf6', '#a855f7', '#d946ef', '#f43f5e', '#f97316', '#10b981'];

export const createFunnel = values =>
  FUNNEL_STAGES.map((stage, idx) => ({
    stage,
    value: values[idx],
    color: FUNNEL_COLORS[idx],
  }));

export const createChannelMix = distribution =>
  ['Email', 'LinkedIn', 'Phone', 'SMS'].map((name, idx) => ({
    name,
    value: distribution[idx],
    color: FUNNEL_COLORS[idx],
  }));

export const PLAN_METRICS = {
  startup: {
    funnel: [1200, 540, 380, 210, 95, 62, 28],
    channelMix: [55, 30, 10, 5],
    roiConfig: { seats: 2, avgAcv: 25000, currentMeetingsPerRep: 8, currentReplyRate: 4 },
    sparklines: [
      SPARKLINE_TEMPLATES.meetings('12', '+140%'),
      SPARKLINE_TEMPLATES.replies('18%', '+8%'),
      SPARKLINE_TEMPLATES.pipeline('$45K', '+65%'),
      SPARKLINE_TEMPLATES.timeSaved('24', '+12hrs'),
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
  },
  midmarket: {
    funnel: [8500, 3800, 2700, 1500, 720, 480, 220],
    channelMix: [42, 32, 18, 8],
    roiConfig: { seats: 10, avgAcv: 45000, currentMeetingsPerRep: 12, currentReplyRate: 6 },
    sparklines: [
      SPARKLINE_TEMPLATES.meetings('72', '+180%'),
      SPARKLINE_TEMPLATES.replies('22%', '+12%'),
      SPARKLINE_TEMPLATES.pipeline('$1.2M', '+85%'),
      SPARKLINE_TEMPLATES.efficiency('3.2x', '+1.8x'),
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
  },
  enterprise: {
    funnel: [45000, 20000, 14500, 8200, 3800, 2400, 1100],
    channelMix: [38, 28, 22, 12],
    roiConfig: { seats: 50, avgAcv: 85000, currentMeetingsPerRep: 15, currentReplyRate: 8 },
    sparklines: [
      SPARKLINE_TEMPLATES.meetings('380', '+220%'),
      SPARKLINE_TEMPLATES.replies('28%', '+16%'),
      SPARKLINE_TEMPLATES.pipeline('$8.5M', '+125%'),
      SPARKLINE_TEMPLATES.compliance('99.2%', '+2.1%'),
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
  },
};

export function getMetricsForPlan(plan) {
  const planData = PLAN_METRICS[plan] || PLAN_METRICS.startup;
  return {
    kpiFunnel: createFunnel(planData.funnel),
    channelMix: createChannelMix(planData.channelMix),
    roiConfig: planData.roiConfig,
    sparklines: planData.sparklines,
    summary: planData.summary,
    headline: planData.headline,
    cta: planData.cta,
    securityBadges: planData.securityBadges || [],
  };
}
