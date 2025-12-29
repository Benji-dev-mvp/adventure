/**
 * Navigation Configuration - Single Source of Truth
 * 
 * This is the canonical navigation model for both Sidebar and DashboardLayout.
 * Aligns with marketing site's promised capabilities:
 * - AI Operator: AI-led outbound OS, AI concierge, AI BDR
 * - Revenue Engine: Multi-channel campaigns, leads, data
 * - Ops & Control: Analytics, integrations, security, compliance
 * 
 * Plan tiers: startup | midmarket | enterprise
 * - startup: Core automation, basic AI
 * - midmarket: Full AI Operator, advanced analytics
 * - enterprise: Full platform, admin controls, compliance
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
  Rocket,
  FileCode,
  Settings,
  Shield,
  Activity,
  Flag,
  FileText,
  Key,
  Webhook,
  CheckCircle,
  CreditCard,
  Cpu,
  Network,
  TrendingUp,
  Map,
  Layers,
  Play,
  Grid3X3,
  Presentation,
  Sparkles,
} from "lucide-react";

/**
 * Plan hierarchy for comparison
 */
export const PLAN_HIERARCHY = {
  startup: 1,
  midmarket: 2,
  enterprise: 3,
};

/**
 * Check if user's plan meets minimum requirement
 */
export function meetsMinPlan(userPlan, minPlan) {
  if (!minPlan) return true;
  if (!userPlan) return false;
  return (PLAN_HIERARCHY[userPlan] || 0) >= (PLAN_HIERARCHY[minPlan] || 0);
}

export const navSections = [
  {
    id: "overview",
    label: "Overview",
    items: [
      {
        id: "dashboard",
        icon: Home,
        label: "Dashboard",
        path: "/dashboard",
        primary: true,
        description: "Unified pipeline, AI coverage, and performance metrics",
      },
    ],
  },
  {
    id: "ai-operator",
    label: "AI Operator",
    description: "AI-led outbound execution",
    items: [
      {
        id: "ava-bdr",
        icon: Brain,
        label: "Ava AI BDR",
        path: "/ava",
        highlight: true,
        badge: "AI",
        description: "End-to-end AI execution of outbound workflows",
        // Available to all plans, but with different capabilities
      },
      {
        id: "ai-assistant",
        icon: MessageSquare,
        label: "AI Assistant",
        path: "/ai-assistant",
        description: "Conversational interface for insights and actions",
      },
      {
        id: "exceptional-hub",
        icon: Rocket,
        label: "Exceptional Hub",
        path: "/exceptional",
        highlight: true,
        badge: "Pro",
        minPlan: "midmarket",
        description: "Advanced workflows and batch analyses",
      },
      {
        id: "advanced-hub",
        icon: Rocket,
        label: "Advanced Hub",
        path: "/advanced",
        badge: "New",
        minPlan: "enterprise",
        description: "Experimentation, A/B tests, play variants",
      },
    ],
  },
  {
    id: "autonomous-gtm",
    label: "Autonomous GTM",
    description: "Next-gen autonomous sales execution",
    items: [
      {
        id: "autonomy",
        icon: Cpu,
        label: "Autonomy Dashboard",
        path: "/autonomy",
        highlight: true,
        badge: "Beta",
        description: "Autonomous operating system overview",
      },
      {
        id: "autopilot",
        icon: Play,
        label: "Autopilot",
        path: "/autopilot",
        badge: "AI",
        description: "Fully autonomous outbound execution",
      },
      {
        id: "orchestration",
        icon: Layers,
        label: "Orchestration",
        path: "/orchestration",
        description: "Multi-agent workflow orchestration",
      },
      {
        id: "intelligence-graph",
        icon: Network,
        label: "Intelligence Graph",
        path: "/intelligence-graph",
        minPlan: "midmarket",
        description: "Connected knowledge and signal network",
      },
      {
        id: "forecasting",
        icon: TrendingUp,
        label: "Forecasting",
        path: "/forecasting",
        minPlan: "midmarket",
        description: "AI-powered revenue predictions",
      },
      {
        id: "influence-map",
        icon: Map,
        label: "Influence Map",
        path: "/influence-map",
        minPlan: "enterprise",
        description: "Stakeholder relationship mapping",
      },
      {
        id: "boardroom",
        icon: Presentation,
        label: "Boardroom",
        path: "/boardroom",
        minPlan: "enterprise",
        badge: "Exec",
        description: "Executive decision theater",
      },
      {
        id: "simulate",
        icon: Sparkles,
        label: "Simulate",
        path: "/simulate",
        minPlan: "enterprise",
        description: "GTM scenario simulation engine",
      },
      {
        id: "lead-hive",
        icon: Network,
        label: "Lead Hive",
        path: "/lead-hive",
        badge: "AI",
        description: "Collective intelligence lead processing",
      },
      {
        id: "parliament",
        icon: Users,
        label: "AI Parliament",
        path: "/parliament",
        minPlan: "midmarket",
        badge: "Pro",
        description: "Multi-agent decision making",
      },
      {
        id: "avatar",
        icon: Brain,
        label: "AI Avatar",
        path: "/avatar",
        minPlan: "enterprise",
        description: "Personalized AI representative",
      },
      {
        id: "immersive",
        icon: Grid3X3,
        label: "Immersive View",
        path: "/immersive",
        minPlan: "enterprise",
        badge: "New",
        description: "Full-screen immersive analytics",
      },
    ],
  },
  {
    id: "revenue-engine",
    label: "Revenue Engine",
    description: "Campaign and lead management",
    items: [
      {
        id: "campaigns",
        icon: Target,
        label: "Campaigns",
        path: "/campaigns",
        description: "Multi-step, multi-channel campaign builder",
      },
      {
        id: "leads",
        icon: Users,
        label: "Leads",
        path: "/leads",
        description: "Lead management and state transitions",
      },
      {
        id: "lead-database",
        icon: Database,
        label: "Lead Database",
        path: "/lead-database",
        description: "Enrichment, scoring, and segmentation",
      },
      {
        id: "templates",
        icon: FileCode,
        label: "Templates",
        path: "/templates",
        description: "Reusable assets for campaigns and AI",
      },
      {
        id: "sales-playbooks",
        icon: FileText,
        label: "Sales Playbooks",
        path: "/sales-playbooks",
        minPlan: "midmarket",
        description: "Guided selling strategies and battle cards",
      },
      {
        id: "lead-scoring",
        icon: Target,
        label: "Lead Scoring",
        path: "/lead-scoring",
        description: "AI-powered lead prioritization",
      },
      {
        id: "data-enrichment",
        icon: Database,
        label: "Data Enrichment",
        path: "/data-enrichment",
        minPlan: "midmarket",
        description: "Automated contact and company enrichment",
      },
    ],
  },
  {
    id: "ops-control",
    label: "Ops & Control",
    description: "Analytics, integrations, and administration",
    items: [
      {
        id: "analytics",
        icon: BarChart3,
        label: "Analytics",
        path: "/analytics",
        description: "Funnel performance, AI vs human contribution",
      },
      {
        id: "executive-dashboard",
        icon: Presentation,
        label: "Executive Dashboard",
        path: "/executive-dashboard",
        minPlan: "midmarket",
        description: "High-level KPIs and business metrics",
      },
      {
        id: "activity-feed",
        icon: Activity,
        label: "Activity Feed",
        path: "/activity-feed",
        description: "Real-time team and system activity",
      },
      {
        id: "integrations",
        icon: Zap,
        label: "Integrations",
        path: "/integrations",
        description: "CRM, email, calendar, data provider connectors",
      },
      {
        id: "settings",
        icon: Settings,
        label: "Settings",
        path: "/settings",
        description: "Workspace configuration and guardrails",
      },
      {
        id: "admin",
        icon: Shield,
        label: "Admin",
        path: "/admin",
        adminOnly: true,
        minPlan: "enterprise",
        description: "Org settings, audit logs, API keys, compliance",
      },
    ],
  },
  {
    id: "enterprise-admin",
    label: "Enterprise Admin",
    description: "Enterprise controls and governance",
    minPlan: "enterprise",
    adminOnly: true,
    items: [
      {
        id: "access-control",
        icon: Key,
        label: "Access Control",
        path: "/admin/access-control",
        adminOnly: true,
        minPlan: "enterprise",
        description: "RBAC, team roles, and permissions",
      },
      {
        id: "audit-log",
        icon: FileText,
        label: "Audit Log",
        path: "/admin/audit-log",
        adminOnly: true,
        minPlan: "enterprise",
        description: "Immutable audit trail for compliance",
      },
      {
        id: "ai-decisions",
        icon: Brain,
        label: "AI Decisions",
        path: "/admin/ai-decisions",
        adminOnly: true,
        minPlan: "enterprise",
        description: "AI governance and decision explainability",
      },
      {
        id: "observability",
        icon: Activity,
        label: "Observability",
        path: "/admin/observability",
        adminOnly: true,
        minPlan: "enterprise",
        description: "System health, SLOs, and monitoring",
      },
      {
        id: "feature-flags",
        icon: Flag,
        label: "Feature Flags",
        path: "/admin/feature-flags",
        adminOnly: true,
        minPlan: "enterprise",
        description: "Rollout controls and kill switches",
      },
      {
        id: "enterprise-readiness",
        icon: CheckCircle,
        label: "Enterprise Readiness",
        path: "/admin/enterprise-readiness",
        adminOnly: true,
        minPlan: "enterprise",
        highlight: true,
        description: "Self-diagnostic readiness dashboard",
      },
      {
        id: "usage",
        icon: CreditCard,
        label: "Usage & Quotas",
        path: "/settings/usage",
        minPlan: "midmarket",
        description: "Plan usage and resource consumption",
      },
    ],
  },
];

/**
 * Flatten all nav items for use in DashboardLayout
 */
export const flatNavItems = navSections.flatMap((section) => section.items);

/**
 * Get nav model split into primary (top bar) and more (dropdown) items
 * @param {boolean} isAdmin - Whether user has admin privileges
 * @param {string} plan - User's plan tier (startup, midmarket, enterprise)
 * @param {number} primaryLimit - Max items to show in primary nav (default: 6)
 */
export function getNavModel(isAdmin = false, plan = 'startup', primaryLimit = 6) {
  const visibleItems = flatNavItems.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    if (!meetsMinPlan(plan, item.minPlan)) return false;
    return true;
  });
  const primary = visibleItems.slice(0, primaryLimit);
  const more = visibleItems.slice(primaryLimit);

  return { primary, more };
}

/**
 * Filter nav sections based on user role/plan
 * @param {boolean} isAdmin - Whether user has admin privileges
 * @param {string} plan - User's plan tier (startup, midmarket, enterprise)
 */
export function getFilteredSections(isAdmin = false, plan = 'startup') {
  return navSections.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      if (item.adminOnly && !isAdmin) return false;
      if (!meetsMinPlan(plan, item.minPlan)) return false;
      return true;
    }),
  })).filter((section) => section.items.length > 0);
}

/**
 * Get default landing path based on plan
 * Startups → Ava AI BDR (automation focus)
 * Midmarket → Campaigns (scale focus)
 * Enterprise → Dashboard (control focus)
 */
export function getDefaultPath(plan = 'startup') {
  switch (plan) {
    case 'enterprise':
      return '/dashboard';
    case 'midmarket':
      return '/campaigns';
    case 'startup':
    default:
      return '/ava';
  }
}

/**
 * Get emphasized sections based on plan
 * Used to highlight different areas of the app per segment
 */
export function getEmphasizedSections(plan = 'startup') {
  switch (plan) {
    case 'enterprise':
      return ['ai-operator', 'ops-control'];
    case 'midmarket':
      return ['revenue-engine', 'ai-operator'];
    case 'startup':
    default:
      return ['ai-operator', 'overview'];
  }
}
