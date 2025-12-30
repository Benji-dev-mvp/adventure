/**
 * Config module tests
 * Covers: index.js, routeDefinitions.js, metricsFactory.js, navigationFactory.js, navConfig.js
 */

import {
  ROUTE_DEFINITIONS,
  PLAN_HIERARCHY,
  getAllRoutes,
  getRoutesByCategory,
  filterRoutes,
  getRouteByPath,
  meetsMinPlan,
  SPARKLINE_TEMPLATES,
  PLAN_METRICS,
  getMetricsForPlan,
  createFunnel,
  createChannelMix,
  PAGE_ROUTES,
  NAVIGATION_ITEMS,
  QUICK_ACTIONS,
  SETTINGS_ITEMS,
  buildCommandsList,
  navSections,
  flatNavItems,
  getNavModel,
  getFilteredSections,
  getDefaultPath,
  getEmphasizedSections,
} from '../config';

describe('Config Module - Index Exports', () => {
  describe('Route Definitions', () => {
    test('ROUTE_DEFINITIONS should be an object', () => {
      expect(typeof ROUTE_DEFINITIONS).toBe('object');
      expect(ROUTE_DEFINITIONS).not.toBeNull();
    });

    test('PLAN_HIERARCHY should have correct tier ordering', () => {
      expect(PLAN_HIERARCHY.startup).toBe(1);
      expect(PLAN_HIERARCHY.midmarket).toBe(2);
      expect(PLAN_HIERARCHY.enterprise).toBe(3);
    });

    test('getAllRoutes should return array of routes', () => {
      const routes = getAllRoutes();
      expect(Array.isArray(routes)).toBe(true);
      expect(routes.length).toBeGreaterThan(0);
    });

    test('getRoutesByCategory should filter routes', () => {
      const routes = getRoutesByCategory('ai-operator');
      expect(Array.isArray(routes)).toBe(true);
    });

    test('getRouteByPath should find routes by path', () => {
      const route = getRouteByPath('/dashboard');
      expect(route).toBeDefined();
    });

    test('meetsMinPlan should validate plan hierarchy', () => {
      expect(meetsMinPlan('enterprise', 'startup')).toBe(true);
      expect(meetsMinPlan('startup', 'enterprise')).toBe(false);
      expect(meetsMinPlan('midmarket', 'midmarket')).toBe(true);
    });

    test('filterRoutes should filter by plan', () => {
      const routes = filterRoutes({ minPlan: 'midmarket' });
      expect(Array.isArray(routes)).toBe(true);
    });
  });

  describe('Metrics Factory', () => {
    test('SPARKLINE_TEMPLATES should have template functions', () => {
      expect(typeof SPARKLINE_TEMPLATES).toBe('object');
      expect(typeof SPARKLINE_TEMPLATES.meetings).toBe('function');
      expect(typeof SPARKLINE_TEMPLATES.replies).toBe('function');
    });

    test('PLAN_METRICS should have all plan tiers', () => {
      expect(PLAN_METRICS.startup).toBeDefined();
      expect(PLAN_METRICS.midmarket).toBeDefined();
      expect(PLAN_METRICS.enterprise).toBeDefined();
    });

    test('getMetricsForPlan should return plan metrics', () => {
      const metrics = getMetricsForPlan('startup');
      expect(metrics.summary).toBeDefined();
      expect(metrics.sparklines).toBeInstanceOf(Array);
    });

    test('createFunnel should create funnel data', () => {
      const funnel = createFunnel([100, 75, 50, 25, 10]);
      expect(Array.isArray(funnel)).toBe(true);
      expect(funnel[0].stage).toBe('Leads');
    });

    test('createChannelMix should create channel distribution', () => {
      const mix = createChannelMix([55, 30, 10, 5]);
      expect(Array.isArray(mix)).toBe(true);
      expect(mix.length).toBe(4);
      expect(mix[0].name).toBe('Email');
    });
  });

  describe('Navigation Factory', () => {
    test('PAGE_ROUTES should be an object with routes', () => {
      expect(typeof PAGE_ROUTES).toBe('object');
      expect(Object.keys(PAGE_ROUTES).length).toBeGreaterThan(0);
    });

    test('NAVIGATION_ITEMS should be an array', () => {
      expect(Array.isArray(NAVIGATION_ITEMS)).toBe(true);
    });

    test('QUICK_ACTIONS should be an array', () => {
      expect(Array.isArray(QUICK_ACTIONS)).toBe(true);
    });

    test('SETTINGS_ITEMS should be an array', () => {
      expect(Array.isArray(SETTINGS_ITEMS)).toBe(true);
    });

    test('buildCommandsList should return commands with categories', () => {
      const mockNavigate = jest.fn();
      const commands = buildCommandsList(mockNavigate);
      expect(Array.isArray(commands)).toBe(true);
      expect(commands[0]).toHaveProperty('category');
      expect(commands[0]).toHaveProperty('action');
    });
  });

  describe('Navigation Config', () => {
    test('navSections should be an array with proper structure', () => {
      expect(Array.isArray(navSections)).toBe(true);
      expect(navSections[0]).toHaveProperty('id');
      expect(navSections[0]).toHaveProperty('label');
      expect(navSections[0]).toHaveProperty('items');
    });

    test('flatNavItems should flatten navigation structure', () => {
      expect(Array.isArray(flatNavItems)).toBe(true);
      flatNavItems.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('label');
      });
    });

    test('getNavModel should split items into primary and more', () => {
      const model = getNavModel(false, 'startup', 6);
      expect(model).toHaveProperty('primary');
      expect(model).toHaveProperty('more');
      expect(Array.isArray(model.primary)).toBe(true);
      expect(Array.isArray(model.more)).toBe(true);
    });

    test('getFilteredSections should filter by plan and admin', () => {
      const sections = getFilteredSections(false, 'startup');
      expect(Array.isArray(sections)).toBe(true);
      sections.forEach(section => {
        expect(section).toHaveProperty('items');
      });
    });

    test('getDefaultPath should return plan-specific path', () => {
      expect(getDefaultPath('startup')).toBe('/ava');
      expect(getDefaultPath('midmarket')).toBe('/campaigns');
      expect(getDefaultPath('enterprise')).toBe('/dashboard');
    });

    test('getEmphasizedSections should return sections by plan', () => {
      const startup = getEmphasizedSections('startup');
      const enterprise = getEmphasizedSections('enterprise');
      expect(Array.isArray(startup)).toBe(true);
      expect(Array.isArray(enterprise)).toBe(true);
    });
  });
});
