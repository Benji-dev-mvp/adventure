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
  Home,
  Brain,
  Zap,
  Target,
  Users,
  Database,
  MessageSquare,
  BarChart3,
  FileCode,
  Settings,
  Shield,
  Network,
  TrendingUp,
  Map,
  Layers,
  Play,
  Presentation,
} from 'lucide-react';

/**
 * Core Route Definitions
 * Each route has: icon, label, path, description, badge, minPlan, adminOnly
 */
export const ROUTE_DEFINITIONS = {
  // Overview
  dashboard: {
    icon: Home,
    label: 'Dashboard',
    path: '/dashboard',
    description: 'Executive signal and KPI pulse',
    badge: { label: 'AI', color: 'cyan' },
    category: 'Overview',
  },

  // AI Operator
  avaBdr: {
    icon: Brain,
    label: 'Ava AI BDR',
    path: '/ava',
    description: 'End-to-end AI execution of outbound workflows',
    badge: { label: 'AI', color: 'cyan' },
    highlight: true,
    category: 'AI Operator',
  },
  aiAssistant: {
    icon: MessageSquare,
    label: 'AI Assistant',
    path: '/ai-assistant',
    description: 'Conversational interface for insights and actions',
    badge: { label: 'AI', color: 'cyan' },
    category: 'AI Operator',
  },

  // Revenue Engine
  campaigns: {
    icon: Target,
    label: 'Campaigns',
    path: '/campaigns',
    description: 'Campaign builder and orchestration',
    badge: { label: 'Ops', color: 'blue' },
    category: 'Revenue Engine',
  },
  leads: {
    icon: Users,
    label: 'Leads',
    path: '/leads',
    description: 'Lead management and state transitions',
    badge: { label: 'Ops', color: 'blue' },
    category: 'Revenue Engine',
  },
  leadDatabase: {
    icon: Database,
    label: 'Lead Database',
    path: '/lead-database',
    altPaths: ['/advanced-lead-database'],
    description: 'Enrichment, scoring, and segmentation',
    badge: { label: 'AI', color: 'cyan' },
    category: 'Revenue Engine',
  },
  templates: {
    icon: FileCode,
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
    label: 'Analytics',
    path: '/analytics',
    description: 'Full-funnel performance analytics',
    badge: { label: 'AI', color: 'cyan' },
    category: 'Ops & Control',
  },
  integrations: {
    icon: Zap,
    label: 'Integrations',
    path: '/integrations',
    description: 'CRM, email, calendar, data provider connectors',
    badge: { label: 'Live', color: 'green' },
    category: 'Ops & Control',
  },
  settings: {
    icon: Settings,
    label: 'Settings',
    path: '/settings',
    description: 'Workspace configuration and guardrails',
    badge: { label: 'Admin', color: 'purple' },
    category: 'Ops & Control',
  },

  // Advanced AI
  autopilot: {
    icon: Play,
    label: 'Autopilot',
    path: '/autopilot',
    description: 'Fully autonomous outbound execution',
    badge: { label: 'AI', color: 'cyan' },
    minPlan: 'midmarket',
    category: 'Autonomous GTM',
  },
  orchestration: {
    icon: Layers,
    label: 'Orchestration',
    path: '/orchestration',
    description: 'Multi-agent workflow orchestration',
    badge: { label: 'Pro', color: 'blue' },
    minPlan: 'midmarket',
    category: 'Autonomous GTM',
  },
  intelligenceGraph: {
    icon: Network,
    label: 'Intelligence Graph',
    path: '/intelligence-graph',
    description: 'Connected knowledge and signal network',
    badge: { label: 'Pro', color: 'blue' },
    minPlan: 'midmarket',
    category: 'Autonomous GTM',
  },
  forecasting: {
    icon: TrendingUp,
    label: 'Forecasting',
    path: '/forecasting',
    description: 'AI-powered revenue predictions',
    badge: { label: 'AI', color: 'cyan' },
    minPlan: 'midmarket',
    category: 'Autonomous GTM',
  },
  influenceMap: {
    icon: Map,
    label: 'Influence Map',
    path: '/influence-map',
    description: 'Stakeholder relationship mapping',
    badge: { label: 'Exec', color: 'blue' },
    minPlan: 'enterprise',
    category: 'Autonomous GTM',
  },
  boardroom: {
    icon: Presentation,
    label: 'Boardroom',
    path: '/boardroom',
    description: 'Executive decision theater',
    badge: { label: 'Exec', color: 'blue' },
    minPlan: 'enterprise',
    category: 'Autonomous GTM',
  },

  // Admin
  admin: {
    icon: Shield,
    label: 'Enterprise Admin',
    path: '/admin',
    description: 'Org settings, audit logs, API keys, compliance',
    badge: { label: 'Enterprise', color: 'amber' },
    adminOnly: true,
    minPlan: 'enterprise',
    category: 'Enterprise Admin',
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
