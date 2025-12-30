/**
 * Navigation & Page Configuration Factory
 *
 * Consolidated with routeDefinitions.js to eliminate duplication.
 * This file now focuses on command palette and navigation-specific structures.
 * All route metadata comes from routeDefinitions.js
 */

import { ROUTE_DEFINITIONS } from './routeDefinitions';

const ROUTE_LOOKUP = ROUTE_DEFINITIONS;

/**
 * PAGE_ROUTES - Auto-generated from ROUTE_DEFINITIONS
 * Maintains backward compatibility with existing imports
 */
export const PAGE_ROUTES = Object.entries(ROUTE_DEFINITIONS).reduce((acc, [key, route]) => {
  acc[key] = {
    paths: [route.path, ...(route.altPaths || [])],
    title: route.label,
    subtitle: route.description,
    badge: route.badge,
  };
  return acc;
}, {});
const NAV_KEYS = [
  'dashboard',
  'campaigns',
  'leads',
  'leadDatabase',
  'analytics',
  'avaBdr',
  'integrations',
  'settings',
  'templates',
  'activityFeed',
  'workflowOrchestrator',
  'admin',
];

export const NAVIGATION_ITEMS = NAV_KEYS.map(key => {
  const route = ROUTE_LOOKUP[key];
  if (!route) return null;
  return {
    id: `nav-${key}`,
    label: `Go to ${route.label}`,
    path: route.path,
    icon: route.iconName || 'Circle',
  };
}).filter(Boolean);

const QUICK_ACTION_CONFIG = [
  { id: 'create-campaign', routeKey: 'campaigns', label: 'Create New Campaign', icon: 'Plus', suffix: '?action=create' },
  { id: 'add-lead', routeKey: 'leads', label: 'Add New Lead', icon: 'UserPlus', suffix: '?action=create' },
  { id: 'ask-ava', routeKey: 'avaBdr', label: 'Ask Ava about this week', icon: 'MessageSquare', suffix: '?prompt=summarize-week' },
  { id: 'optimize', routeKey: 'avaBdr', label: 'Run Campaign Optimization', icon: 'Zap', suffix: '?action=optimize' },
  { id: 'score-leads', routeKey: 'leadScoring', label: 'Score All Leads', icon: 'Target', suffix: '?action=run' },
  { id: 'generate-report', routeKey: 'analytics', label: 'Generate Weekly Report', icon: 'FileBarChart', suffix: '?action=report' },
];

export const QUICK_ACTIONS = QUICK_ACTION_CONFIG.map(action => {
  const route = ROUTE_LOOKUP[action.routeKey];
  if (!route) return null;
  return {
    id: `action-${action.id}`,
    label: action.label,
    path: `${route.path}${action.suffix || ''}`,
    icon: action.icon,
  };
}).filter(Boolean);

const SETTINGS_CONFIG = [
  { id: 'notifications', label: 'Notification Preferences', routeKey: 'settings', suffix: '?tab=notifications', icon: 'Bell' },
  { id: 'integrations', label: 'Manage Integrations', routeKey: 'integrations', icon: 'Link' },
  { id: 'api-keys', label: 'Manage API Keys', routeKey: 'admin', suffix: '/api-keys', icon: 'Key' },
];

export const SETTINGS_ITEMS = SETTINGS_CONFIG.map(setting => {
  const route = ROUTE_LOOKUP[setting.routeKey];
  if (!route) return null;
  const path = setting.suffix?.startsWith('/')
    ? `${route.path}${setting.suffix}`
    : `${route.path}${setting.suffix || ''}`;
  return {
    id: `settings-${setting.id}`,
    label: setting.label,
    path,
    icon: setting.icon,
  };
}).filter(Boolean);

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
