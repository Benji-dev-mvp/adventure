/**
 * Configuration Index - Single Import Point
 *
 * Consolidates all configuration exports in one place.
 * This eliminates the need to track multiple config files.
 */

// Route definitions (authoritative source)
export {
  ROUTE_DEFINITIONS,
  PLAN_HIERARCHY,
  getAllRoutes,
  getRoutesByCategory,
  filterRoutes,
  getRouteByPath,
  meetsMinPlan,
} from './routeDefinitions';

// Metrics (plan-specific metrics and sparklines)
export {
  SPARKLINE_TEMPLATES,
  PLAN_METRICS,
  getMetricsForPlan,
  createFunnel,
  createChannelMix,
} from './metricsFactory';

// Navigation (navigation-specific structure)
export {
  PAGE_ROUTES,
  NAVIGATION_ITEMS,
  QUICK_ACTIONS,
  SETTINGS_ITEMS,
  buildCommandsList,
} from './navigationFactory';

// Navigation configuration (plan-aware navigation structure)
export {
  navSections,
  flatNavItems,
  getNavModel,
  getFilteredSections,
  getDefaultPath,
  getEmphasizedSections,
} from './navConfig';

// Page chrome (page-specific chrome definitions)
export { resolvePageChrome } from './pageChrome';

// Marketing content (marketing copy and content)
export { marketingContent } from './marketingContent';

/**
 * Quick helpers for common operations
 * Import functions directly instead of using require
 */

/**
 * Get complete route with all metadata
 */
export function getRouteMetadata(path, config = {}) {
  const allRoutes = Object.values(ROUTE_DEFINITIONS);

  const route = allRoutes.find(
    r => r.path === path || (r.altPaths && r.altPaths.includes(path))
  );

  const chrome = resolvePageChrome(path);

  return {
    ...route,
    ...chrome.scaffold,
    title: route?.label || chrome.scaffold.title,
    subtitle: route?.description || chrome.scaffold.subtitle,
  };
}

/**
 * Get all navigation items filtered by plan and admin status
 */
export function getNavigationForUser(plan = 'startup', isAdmin = false) {
  return filterRoutes(getAllRoutes(), { plan, isAdmin });
}

/**
 * Get metrics for specific plan
 */
export function getPlanMetrics(plan = 'startup') {
  return getMetricsForPlan(plan);
}
