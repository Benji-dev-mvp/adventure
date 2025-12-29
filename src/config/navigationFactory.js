/**
 * Navigation & Page Configuration Factory
 *
 * Centralized definitions for routes, chrome, and commands.
 * Eliminates duplication across page chrome and command palette.
 */

export const PAGE_ROUTES = {
  dashboard: {
    paths: ['/dashboard'],
    title: 'Dashboard',
    subtitle: 'Executive signal and KPI pulse',
    badge: { label: 'AI', color: 'cyan' },
  },
  campaigns: {
    paths: ['/campaigns'],
    title: 'Campaigns',
    subtitle: 'Campaign builder and orchestration',
    badge: { label: 'Ops', color: 'blue' },
  },
  leads: {
    paths: ['/leads'],
    title: 'Leads',
    subtitle: 'Lead workbench and queues',
    badge: { label: 'Ops', color: 'blue' },
  },
  leadDatabase: {
    paths: ['/lead-database', '/advanced-lead-database'],
    title: 'Lead Database',
    subtitle: 'Unified lead intelligence',
    badge: { label: 'AI', color: 'cyan' },
  },
  templates: {
    paths: ['/templates', '/email-templates'],
    title: 'Templates',
    subtitle: 'Reusable assets and playbooks',
    badge: { label: 'AI', color: 'cyan' },
  },
  analytics: {
    paths: ['/analytics'],
    title: 'Analytics',
    subtitle: 'Full-funnel performance analytics',
    badge: { label: 'AI', color: 'cyan' },
  },
  ai: {
    paths: ['/ai-assistant', '/ai-assistant-advanced'],
    title: 'AI Assistant',
    subtitle: 'Operator copilot and actions',
    badge: { label: 'AI', color: 'cyan' },
  },
  ava: {
    paths: ['/ava'],
    title: 'Ava AI BDR',
    subtitle: 'Autonomous BDR control surface',
    badge: { label: 'Pro', color: 'blue' },
  },
  integrations: {
    paths: ['/integrations'],
    title: 'Integrations',
    subtitle: 'Connected systems and sync status',
    badge: { label: 'Live', color: 'green' },
  },
  settings: {
    paths: ['/settings'],
    title: 'Settings',
    subtitle: 'Workspace configuration',
    badge: { label: 'Admin', color: 'purple' },
  },
  admin: {
    paths: ['/admin'],
    title: 'Enterprise Admin',
    subtitle: 'Access, audit, and controls',
    badge: { label: 'Enterprise', color: 'amber' },
  },
};

export const NAVIGATION_ITEMS = [
  {
    id: 'nav-dashboard',
    label: 'Go to Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    id: 'nav-campaigns',
    label: 'Go to Campaigns',
    path: '/campaigns',
    icon: 'Megaphone',
  },
  {
    id: 'nav-leads',
    label: 'Go to Leads',
    path: '/leads',
    icon: 'Users',
  },
  {
    id: 'nav-lead-database',
    label: 'Go to Lead Database',
    path: '/lead-database',
    icon: 'Database',
  },
  {
    id: 'nav-analytics',
    label: 'Go to Analytics',
    path: '/analytics',
    icon: 'BarChart3',
  },
  {
    id: 'nav-ava',
    label: 'Go to Ava (AI Assistant)',
    path: '/ava',
    icon: 'Bot',
  },
  {
    id: 'nav-playbooks',
    label: 'Go to Ava Playbooks',
    path: '/ava/playbooks',
    icon: 'BookOpen',
  },
  {
    id: 'nav-integrations',
    label: 'Go to Integrations',
    path: '/integrations',
    icon: 'Plug',
  },
  {
    id: 'nav-settings',
    label: 'Go to Settings',
    path: '/settings',
    icon: 'Settings',
  },
  {
    id: 'nav-templates',
    label: 'Go to Templates',
    path: '/templates',
    icon: 'FileText',
  },
  {
    id: 'nav-activity',
    label: 'Go to Activity Feed',
    path: '/activity',
    icon: 'Activity',
  },
  {
    id: 'nav-workflow',
    label: 'Go to Workflow Orchestrator',
    path: '/workflow-orchestrator',
    icon: 'GitBranch',
  },
  {
    id: 'nav-admin',
    label: 'Go to Admin',
    path: '/admin',
    icon: 'Shield',
  },
];

export const QUICK_ACTIONS = [
  {
    id: 'action-create-campaign',
    label: 'Create New Campaign',
    path: '/campaigns?action=create',
    icon: 'Plus',
  },
  {
    id: 'action-add-lead',
    label: 'Add New Lead',
    path: '/leads?action=create',
    icon: 'UserPlus',
  },
  {
    id: 'action-ask-ava',
    label: 'Ask Ava about this week',
    path: '/ava?prompt=summarize-week',
    icon: 'MessageSquare',
  },
  {
    id: 'action-optimize',
    label: 'Run Campaign Optimization',
    path: '/ava?action=optimize',
    icon: 'Zap',
  },
  {
    id: 'action-score-leads',
    label: 'Score All Leads',
    path: '/lead-scoring?action=run',
    icon: 'Target',
  },
  {
    id: 'action-generate-report',
    label: 'Generate Weekly Report',
    path: '/analytics?action=report',
    icon: 'FileBarChart',
  },
];

export const SETTINGS_ITEMS = [
  {
    id: 'settings-notifications',
    label: 'Notification Preferences',
    path: '/settings?tab=notifications',
    icon: 'Bell',
  },
  {
    id: 'settings-integrations',
    label: 'Manage Integrations',
    path: '/integrations',
    icon: 'Link',
  },
  {
    id: 'settings-api-keys',
    label: 'Manage API Keys',
    path: '/admin/api-keys',
    icon: 'Key',
  },
];

// Build categorized commands for command palette
export function buildCommandsList(navigate) {
  return [
    // Navigation commands
    ...NAVIGATION_ITEMS.map(item => ({
      id: item.id,
      label: item.label,
      category: 'Navigation',
      icon: item.icon,
      action: () => navigate(item.path),
    })),
    // Quick actions
    ...QUICK_ACTIONS.map(action => ({
      id: action.id,
      label: action.label,
      category: 'Actions',
      icon: action.icon,
      action: () => navigate(action.path),
    })),
    // Settings
    ...SETTINGS_ITEMS.map(setting => ({
      id: setting.id,
      label: setting.label,
      category: 'Settings',
      icon: setting.icon,
      action: () => navigate(setting.path),
    })),
    // Theme toggle
    {
      id: 'settings-theme',
      label: 'Toggle Dark/Light Mode',
      category: 'Settings',
      icon: 'Moon',
      action: () => {
        /* handled by theme toggle */
      },
    },
  ];
}
