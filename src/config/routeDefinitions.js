/**
 * Route Definitions - Single Source of Truth
 *
 * Centralized definitions for all routes, avoiding duplication across:
 * - navigationFactory.js
 * - navConfig.js
 * - pageChrome.ts
 * - marketingContent.js
 *
 * This is the authoritative definition. All other files should reference this.
 */

import {
  Activity,
  BarChart3,
  BookOpen,
  Brain,
  Database,
  FileCode,
  FileText,
  GitBranch,
  Home,
  Layers,
  Map,
  MessageSquare,
  Network,
  Play,
  Presentation,
  Settings,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

/**
 * Core Route Definitions
 * Each route has: icon, label, path, description, badge, minPlan, adminOnly
 */
export const ROUTE_DEFINITIONS = {
  // Overview
  dashboard: {
    icon: Home,
    iconName: 'LayoutDashboard',
    label: 'Dashboard',
    path: '/dashboard',
    description: 'Executive signal and KPI pulse',
    badge: { label: 'AI', color: 'cyan' },
    category: 'Overview',
  },
  home: {
    icon: Home,
    iconName: 'Home',
    label: 'Home',
    path: '/home',
    altPaths: ['/'],
    description: 'Unified workspace home',
    badge: { label: 'Live', color: 'green' },
    category: 'Overview',
    chrome: {
      title: 'Overview',
      subtitle: 'Unified workspace home',
      badges: [{ label: 'Live', color: 'green' }],
    },
  },

  // AI Operator
  avaBdr: {
    icon: Brain,
    iconName: 'Bot',
    label: 'Ava AI BDR',
    path: '/ava',
    description: 'End-to-end AI execution of outbound workflows',
    badge: { label: 'AI', color: 'cyan' },
    highlight: true,
    category: 'AI Operator',
  },
  aiAssistant: {
    icon: MessageSquare,
    iconName: 'MessageSquare',
    label: 'AI Assistant',
    path: '/ai-assistant',
    description: 'Conversational interface for insights and actions',
    badge: { label: 'AI', color: 'cyan' },
    category: 'AI Operator',
  },

  // Revenue Engine
  campaigns: {
    icon: Target,
    iconName: 'Megaphone',
    label: 'Campaigns',
    path: '/campaigns',
    description: 'Campaign builder and orchestration',
    badge: { label: 'Ops', color: 'blue' },
    category: 'Revenue Engine',
  },
  leads: {
    icon: Users,
    iconName: 'Users',
    label: 'Leads',
    path: '/leads',
    description: 'Lead management and state transitions',
    badge: { label: 'Ops', color: 'blue' },
    category: 'Revenue Engine',
  },
  leadDatabase: {
    icon: Database,
    iconName: 'Database',
    label: 'Lead Database',
    path: '/lead-database',
    altPaths: ['/advanced-lead-database'],
    description: 'Enrichment, scoring, and segmentation',
    badge: { label: 'AI', color: 'cyan' },
    category: 'Revenue Engine',
  },
  templates: {
    icon: FileCode,
    iconName: 'FileCode',
    label: 'Templates',
    path: '/templates',
    altPaths: ['/email-templates'],
    description: 'Reusable assets for campaigns and AI',
    badge: { label: 'AI', color: 'cyan' },
    category: 'Revenue Engine',
  },

  // Analytics & Ops
  analytics: {
    icon: BarChart3,
    iconName: 'BarChart3',
    label: 'Analytics',
    path: '/analytics',
    description: 'Full-funnel performance analytics',
    badge: { label: 'AI', color: 'cyan' },
    category: 'Ops & Control',
  },
  integrations: {
    icon: Zap,
    iconName: 'Plug',
    label: 'Integrations',
    path: '/integrations',
    description: 'CRM, email, calendar, data provider connectors',
    badge: { label: 'Live', color: 'green' },
    category: 'Ops & Control',
  },
  settings: {
    icon: Settings,
    iconName: 'Settings',
    label: 'Settings',
    path: '/settings',
    description: 'Workspace configuration and guardrails',
    badge: { label: 'Admin', color: 'purple' },
    category: 'Ops & Control',
  },
  activityFeed: {
    icon: Activity,
    iconName: 'Activity',
    label: 'Activity Feed',
    path: '/activity-feed',
    description: 'System and AI activity stream',
    badge: { label: 'Live', color: 'green' },
    category: 'Ops & Control',
    chrome: {
      title: 'Activity Feed',
      subtitle: 'System and AI activity stream',
      badges: [{ label: 'Live', color: 'green' }],
    },
  },

  // Advanced AI
  autopilot: {
    icon: Play,
    iconName: 'Play',
    label: 'Autopilot',
    path: '/autopilot',
    description: 'Fully autonomous outbound execution',
    badge: { label: 'AI', color: 'cyan' },
    minPlan: 'midmarket',
    category: 'Autonomous GTM',
    chrome: {
      title: 'Autopilot',
      subtitle: 'Self-driving revenue engine',
      badges: [
        { label: 'AI', color: 'cyan' },
        { label: 'Pro', color: 'blue' },
      ],
    },
  },
  orchestration: {
    icon: Layers,
    iconName: 'Layers',
    label: 'Orchestration',
    path: '/orchestration',
    description: 'Multi-agent workflow orchestration',
    badge: { label: 'Pro', color: 'blue' },
    minPlan: 'midmarket',
    category: 'Autonomous GTM',
    chrome: {
      title: 'AI Operator',
      subtitle: 'Multi-agent orchestration and control',
      badges: [{ label: 'Autonomous GTM', color: 'blue' }],
    },
  },
  intelligenceGraph: {
    icon: Network,
    iconName: 'Network',
    label: 'Intelligence Graph',
    path: '/intelligence-graph',
    description: 'Connected knowledge and signal network',
    badge: { label: 'Pro', color: 'blue' },
    minPlan: 'midmarket',
    category: 'Autonomous GTM',
    chrome: {
      title: 'Intelligence Graph',
      subtitle: 'Signals, intent, and influence graph',
      badges: [{ label: 'Graph', color: 'purple' }],
    },
  },
  forecasting: {
    icon: TrendingUp,
    iconName: 'TrendingUp',
    label: 'Forecasting',
    path: '/forecasting',
    description: 'AI-powered revenue predictions',
    badge: { label: 'AI', color: 'cyan' },
    minPlan: 'midmarket',
    category: 'Autonomous GTM',
    chrome: {
      title: 'Forecasting',
      subtitle: 'Predictive revenue forecasting',
      badges: [{ label: 'AI', color: 'cyan' }],
    },
  },
  influenceMap: {
    icon: Map,
    iconName: 'Map',
    label: 'Influence Map',
    path: '/influence-map',
    description: 'Stakeholder relationship mapping',
    badge: { label: 'Exec', color: 'blue' },
    minPlan: 'enterprise',
    category: 'Autonomous GTM',
    chrome: {
      title: 'Influence Map',
      subtitle: 'Account power-map and paths to value',
      badges: [{ label: 'Exec', color: 'blue' }],
    },
  },
  boardroom: {
    icon: Presentation,
    iconName: 'Presentation',
    label: 'Boardroom',
    path: '/boardroom',
    description: 'Executive decision theater',
    badge: { label: 'Exec', color: 'blue' },
    minPlan: 'enterprise',
    category: 'Autonomous GTM',
    chrome: {
      title: 'Boardroom',
      subtitle: 'Executive view for autonomous GTM',
      badges: [{ label: 'Exec', color: 'blue' }],
    },
  },
  leadHive: {
    icon: Network,
    iconName: 'Network',
    label: 'Lead Hive',
    path: '/lead-hive',
    description: 'Autonomous prospect research hive',
    badge: { label: 'AI', color: 'cyan' },
    category: 'Autonomous GTM',
    chrome: {
      title: 'Lead Hive',
      subtitle: 'Autonomous prospect research hive',
      badges: [{ label: 'AI', color: 'cyan' }],
    },
  },
  parliament: {
    icon: Users,
    iconName: 'Users',
    label: 'AI Parliament',
    path: '/parliament',
    description: 'Debate-driven decisioning layer',
    badge: { label: 'Pro', color: 'blue' },
    minPlan: 'midmarket',
    category: 'Autonomous GTM',
    chrome: {
      title: 'AI Parliament',
      subtitle: 'Debate-driven decisioning layer',
      badges: [{ label: 'AI', color: 'purple' }],
    },
  },
  avatar: {
    icon: Sparkles,
    iconName: 'Sparkles',
    label: 'AI Avatar',
    path: '/avatar',
    description: 'Persona-grade conversation control',
    badge: { label: 'Immersive', color: 'blue' },
    minPlan: 'enterprise',
    category: 'Autonomous GTM',
    chrome: {
      title: 'AI Avatar',
      subtitle: 'Persona-grade conversation control',
      badges: [{ label: 'Immersive', color: 'blue' }],
    },
  },
  immersive: {
    icon: Sparkles,
    iconName: 'Sparkles',
    label: 'Immersive View',
    path: '/immersive',
    description: 'Spatial command center',
    badge: { label: 'New', color: 'green' },
    minPlan: 'enterprise',
    category: 'Autonomous GTM',
    chrome: {
      title: 'Immersive View',
      subtitle: 'Spatial command center',
      badges: [{ label: 'New', color: 'green' }],
    },
  },
  simulate: {
    icon: Sparkles,
    iconName: 'Sparkles',
    label: 'Simulate',
    path: '/simulate',
    altPaths: ['/simulate-next'],
    description: 'Scenario simulation and sandboxes',
    badge: { label: 'Beta', color: 'purple' },
    minPlan: 'enterprise',
    category: 'Autonomous GTM',
    chrome: {
      title: 'Simulate',
      subtitle: 'Scenario simulation and sandboxes',
      badges: [{ label: 'Beta', color: 'purple' }],
    },
  },
  exceptional: {
    icon: Sparkles,
    iconName: 'Sparkles',
    label: 'Exceptional Hub',
    path: '/exceptional',
    description: 'Exceptional experiences command center',
    badge: { label: 'Pro', color: 'blue' },
    category: 'Autonomous GTM',
    chrome: {
      title: 'Exceptional Hub',
      subtitle: 'Exceptional experiences command center',
      badges: [{ label: 'Pro', color: 'blue' }],
    },
  },
  advanced: {
    icon: Sparkles,
    iconName: 'Sparkles',
    label: 'Advanced Hub',
    path: '/advanced',
    description: 'Advanced capabilities and labs',
    badge: { label: 'New', color: 'green' },
    category: 'Autonomous GTM',
    chrome: {
      title: 'Advanced Hub',
      subtitle: 'Advanced capabilities and labs',
      badges: [{ label: 'New', color: 'green' }],
    },
  },
  executiveDashboard: {
    icon: Presentation,
    iconName: 'Presentation',
    label: 'Executive Dashboard',
    path: '/executive-dashboard',
    description: 'Executive health and readiness',
    badge: { label: 'Exec', color: 'blue' },
    minPlan: 'midmarket',
    category: 'Autonomous GTM',
    chrome: {
      title: 'Executive Dashboard',
      subtitle: 'Executive health and readiness',
      badges: [{ label: 'Exec', color: 'blue' }],
    },
  },
  salesPlaybooks: {
    icon: BookOpen,
    iconName: 'BookOpen',
    label: 'Sales Playbooks',
    path: '/sales-playbooks',
    description: 'Operational playbooks and runbooks',
    badge: { label: 'Pro', color: 'blue' },
    category: 'Revenue Engine',
    chrome: {
      title: 'Sales Playbooks',
      subtitle: 'Operational playbooks and runbooks',
      badges: [{ label: 'Pro', color: 'blue' }],
    },
  },
  leadScoring: {
    icon: Target,
    iconName: 'Target',
    label: 'Lead Scoring',
    path: '/lead-scoring',
    description: 'AI-scored intent and fit',
    badge: { label: 'AI', color: 'cyan' },
    category: 'Revenue Engine',
    chrome: {
      title: 'Lead Scoring',
      subtitle: 'AI-scored intent and fit',
      badges: [{ label: 'AI', color: 'cyan' }],
    },
  },
  dataEnrichment: {
    icon: Database,
    iconName: 'Database',
    label: 'Data Enrichment',
    path: '/data-enrichment',
    description: 'Signals, firmographics, and enrichment',
    badge: { label: 'AI', color: 'cyan' },
    minPlan: 'midmarket',
    category: 'Revenue Engine',
    chrome: {
      title: 'Data Enrichment',
      subtitle: 'Signals, firmographics, and enrichment',
      badges: [{ label: 'AI', color: 'cyan' }],
    },
  },
  workflowOrchestrator: {
    icon: GitBranch,
    iconName: 'GitBranch',
    label: 'Workflow Orchestrator',
    path: '/workflow-orchestrator',
    description: 'Workflow orchestration and guardrails',
    badge: { label: 'Control', color: 'purple' },
    category: 'Ops & Control',
    chrome: {
      title: 'Ops & Control',
      subtitle: 'Workflow orchestration and guardrails',
      badges: [{ label: 'Control', color: 'purple' }],
    },
  },
  settingsUsage: {
    icon: FileText,
    iconName: 'FileText',
    label: 'Usage & Quotas',
    path: '/settings/usage',
    description: 'Consumption by seats, agents, and tokens',
    badge: { label: 'Usage', color: 'orange' },
    category: 'Ops & Control',
    chrome: {
      title: 'Usage & Quotas',
      subtitle: 'Consumption by seats, agents, and tokens',
      badges: [{ label: 'Usage', color: 'orange' }],
    },
  },

  // Admin
  admin: {
    icon: Shield,
    iconName: 'Shield',
    label: 'Enterprise Admin',
    path: '/admin',
    description: 'Org settings, audit logs, API keys, compliance',
    badge: { label: 'Enterprise', color: 'amber' },
    adminOnly: true,
    minPlan: 'enterprise',
    category: 'Enterprise Admin',
    chrome: {
      title: 'Enterprise Admin',
      subtitle: 'Org settings, audit logs, API keys, compliance',
      badges: [{ label: 'Enterprise', color: 'amber' }],
    },
  },
};

/**
 * Helper: Get all routes as array
 */
export function getAllRoutes() {
  return Object.values(ROUTE_DEFINITIONS);
}

/**
 * Helper: Get routes by category
 */
export function getRoutesByCategory(category) {
  return Object.values(ROUTE_DEFINITIONS).filter(route => route.category === category);
}

/**
 * Helper: Filter routes by plan and admin status
 */
export function filterRoutes(routes, { plan = 'startup', isAdmin = false } = {}) {
  const PLAN_HIERARCHY = { startup: 1, midmarket: 2, enterprise: 3 };
  const userLevel = PLAN_HIERARCHY[plan] || 0;

  return routes.filter(route => {
    // Check plan requirement
    if (route.minPlan) {
      const minLevel = PLAN_HIERARCHY[route.minPlan] || 0;
      if (userLevel < minLevel) return false;
    }

    // Check admin requirement
    if (route.adminOnly && !isAdmin) return false;

    return true;
  });
}

/**
 * Helper: Get route by path
 */
export function getRouteByPath(path) {
  return Object.values(ROUTE_DEFINITIONS).find(
    route => route.path === path || (route.altPaths && route.altPaths.includes(path))
  );
}

/**
 * Plan Hierarchy
 */
export const PLAN_HIERARCHY = {
  startup: 1,
  midmarket: 2,
  enterprise: 3,
};

/**
 * Helper: Check if plan meets minimum requirement
 */
export function meetsMinPlan(userPlan, minPlan) {
  if (!minPlan) return true;
  if (!userPlan) return false;
  return (PLAN_HIERARCHY[userPlan] || 0) >= (PLAN_HIERARCHY[minPlan] || 0);
}
