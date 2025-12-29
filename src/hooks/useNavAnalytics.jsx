/**
 * Navigation Analytics Hook
 *
 * Provides instrumentation for navigation events:
 * - app.nav.click - Navigation item clicked
 * - app.page.view - Page viewed
 *
 * Decouples UI from analytics provider for flexibility.
 */

import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { track, page } from '@/lib/analytics';

/**
 * @typedef {Object} NavClickEvent
 * @property {string} itemId - Nav item ID
 * @property {string} section - Section ID (ai-operator, revenue-engine, etc.)
 * @property {string} path - Route path
 * @property {string} [tenantId] - Tenant ID
 * @property {string} [plan] - Tenant plan
 * @property {string} [userId] - User ID
 */

/**
 * @typedef {Object} PageViewEvent
 * @property {string} route - Current route
 * @property {string} [tenantId] - Tenant ID
 * @property {string} [plan] - Tenant plan
 * @property {number} timestamp - Unix timestamp
 */

/**
 * Hook for tracking navigation events
 *
 * @param {Object} options
 * @param {string} [options.tenantId] - Tenant ID for attribution
 * @param {string} [options.plan] - Tenant plan tier
 * @param {string} [options.userId] - User ID
 */
export function useNavAnalytics({ tenantId, plan, userId } = {}) {
  const location = useLocation();
  const previousPath = useRef(null);

  /**
   * Track navigation item click
   */
  const trackNavClick = useCallback(
    (itemId, section, path) => {
      const event = {
        itemId,
        section,
        path,
        tenantId,
        plan,
        userId,
        timestamp: Date.now(),
      };

      // Use the analytics service
      track('app.nav.click', event);

      // Also log in dev for debugging
      if (import.meta.env.DEV) {
        console.debug('[NavAnalytics] nav.click:', event);
      }
    },
    [tenantId, plan, userId]
  );

  /**
   * Track page view - called automatically on route change
   */
  const trackPageView = useCallback(
    (route, properties = {}) => {
      const event = {
        route,
        tenantId,
        plan,
        userId,
        timestamp: Date.now(),
        ...properties,
      };

      // Use the analytics service
      page(route, event);

      // Also log in dev for debugging
      if (import.meta.env.DEV) {
        console.debug('[NavAnalytics] page.view:', event);
      }
    },
    [tenantId, plan, userId]
  );

  // Auto-track page views on route change
  useEffect(() => {
    const currentPath = location.pathname;

    // Only track if path actually changed
    if (currentPath !== previousPath.current) {
      previousPath.current = currentPath;
      trackPageView(currentPath, {
        search: location.search,
        hash: location.hash,
      });
    }
  }, [location.pathname, location.search, location.hash, trackPageView]);

  return {
    trackNavClick,
    trackPageView,
  };
}

/**
 * Hook for tracking feature usage
 *
 * @param {string} featureName - Name of the feature being used
 */
export function useFeatureAnalytics(featureName) {
  const trackUsage = useCallback(
    (action, properties = {}) => {
      track('feature_used', {
        feature: featureName,
        action,
        timestamp: Date.now(),
        ...properties,
      });
    },
    [featureName]
  );

  const trackError = useCallback(
    (error, properties = {}) => {
      track('feature_error', {
        feature: featureName,
        error: error?.message || String(error),
        timestamp: Date.now(),
        ...properties,
      });
    },
    [featureName]
  );

  return {
    trackUsage,
    trackError,
  };
}

/**
 * Create a wrapped NavLink that tracks clicks
 * Use this in Sidebar and DashboardLayout
 */
export function createTrackedNavLink(trackNavClick) {
  return function TrackedNavLink({ item, section, children, ...props }) {
    const handleClick = () => {
      trackNavClick(item.id, section, item.path);
    };

    return <div onClick={handleClick}>{children}</div>;
  };
}

export default useNavAnalytics;
