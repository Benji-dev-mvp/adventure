/**
 * Tenant Context - Segment-aware application behavior
 *
 * Provides tenant/organization context including:
 * - Plan tier (startup, midmarket, enterprise)
 * - Admin status
 * - Org-level settings
 *
 * Used by navigation, feature gating, and segment-specific UX
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

/**
 * @typedef {'startup' | 'midmarket' | 'enterprise'} PlanTier
 */

/**
 * @typedef {Object} Tenant
 * @property {string} id - Tenant/org ID
 * @property {string} name - Organization name
 * @property {PlanTier} plan - Plan tier
 * @property {Object} settings - Org settings
 * @property {Object} limits - Plan limits
 * @property {Object} usage - Current usage
 */

/**
 * @typedef {Object} TenantContextValue
 * @property {Tenant | null} tenant
 * @property {boolean} isAdmin
 * @property {PlanTier} plan
 * @property {boolean} isLoading
 * @property {boolean} isEnterprise
 * @property {boolean} isMidmarket
 * @property {boolean} isStartup
 * @property {(minPlan: PlanTier) => boolean} hasAccess
 * @property {() => void} refreshTenant
 */

const PLAN_HIERARCHY = {
  startup: 1,
  midmarket: 2,
  enterprise: 3,
};

const defaultTenant = {
  id: 'demo-tenant',
  name: 'Demo Organization',
  plan: 'enterprise', // Default to enterprise for dev to show all features
  isDemo: true, // Demo mode enabled by default for development
  settings: {
    aiEnabled: true,
    autoEnrichment: true,
    maxCampaigns: 100,
    navigationLayout: 'sidebar-only', // 'sidebar-only' | 'sidebar-top'
  },
  limits: {
    maxUsers: 100,
    maxLeads: 100000,
    maxEmailsPerMonth: 100000,
  },
  usage: {
    currentUsers: 2,
    currentLeads: 342,
    emailsSentThisMonth: 1247,
  },
};

const TenantContext = createContext(undefined);

export function TenantProvider({ children, initialTenant = null }) {
  const [tenant, setTenant] = useState(initialTenant || defaultTenant);
  const [isAdmin, setIsAdmin] = useState(true); // Default to admin for dev to show all features
  const [isLoading, setIsLoading] = useState(false);

  // Fetch tenant data on mount
  useEffect(() => {
    async function fetchTenant() {
      setIsLoading(true);
      try {
        // In production, fetch from API
        // const response = await fetch('/api/tenant');
        // const data = await response.json();
        // setTenant(data.tenant);
        // setIsAdmin(data.isAdmin);

        // For now, use demo data with simulated delay
        await new Promise(resolve => setTimeout(resolve, 100));

        // Check for admin status from localStorage (demo purposes)
        const storedAdmin = localStorage.getItem('artisan_is_admin');
        setIsAdmin(storedAdmin === 'true');

        // Check for plan override (demo purposes)
        const storedPlan = localStorage.getItem('artisan_plan');
        if (storedPlan && ['startup', 'midmarket', 'enterprise'].includes(storedPlan)) {
          setTenant(prev => ({ ...prev, plan: storedPlan }));
        }

        // Check for navigation layout preference
        const storedLayout = localStorage.getItem('artisan_nav_layout');
        if (storedLayout && ['sidebar-only', 'sidebar-top'].includes(storedLayout)) {
          setTenant(prev => ({
            ...prev,
            settings: { ...prev.settings, navigationLayout: storedLayout },
          }));
        }
      } catch (error) {
        console.error('[TenantContext] Failed to fetch tenant:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTenant();
  }, []);

  const refreshTenant = async () => {
    setIsLoading(true);
    try {
      // In production, refetch from API
      await new Promise(resolve => setTimeout(resolve, 100));
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(() => {
    const plan = tenant?.plan || 'startup';

    return {
      tenant,
      isAdmin,
      plan,
      isLoading,
      isDemo: tenant?.isDemo ?? true,
      isEnterprise: plan === 'enterprise',
      isMidmarket: plan === 'midmarket',
      isStartup: plan === 'startup',
      navigationLayout: tenant?.settings?.navigationLayout || 'sidebar-only',

      /**
       * Check if user's plan meets minimum requirement
       * @param {PlanTier} minPlan
       */
      hasAccess: minPlan => {
        if (!minPlan) return true;
        return (PLAN_HIERARCHY[plan] || 0) >= (PLAN_HIERARCHY[minPlan] || 0);
      },

      refreshTenant,

      // Setters for demo/testing
      setIsAdmin: val => {
        setIsAdmin(val);
        localStorage.setItem('artisan_is_admin', String(val));
      },
      setPlan: newPlan => {
        setTenant(prev => ({ ...prev, plan: newPlan }));
        localStorage.setItem('artisan_plan', newPlan);
      },
      setNavigationLayout: layout => {
        setTenant(prev => ({
          ...prev,
          settings: { ...prev.settings, navigationLayout: layout },
        }));
        localStorage.setItem('artisan_nav_layout', layout);
      },
      setIsDemo: isDemo => {
        setTenant(prev => ({ ...prev, isDemo }));
      },
    };
  }, [tenant, isAdmin, isLoading]);

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

/**
 * Hook to access tenant context
 */
export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

/**
 * Hook to check feature access based on plan
 */
export function useFeatureAccess(minPlan) {
  const { hasAccess } = useTenant();
  return hasAccess(minPlan);
}

/**
 * HOC to gate components by plan
 */
export function withPlanGate(Component, minPlan, FallbackComponent = null) {
  return function GatedComponent(props) {
    const { hasAccess } = useTenant();

    if (!hasAccess(minPlan)) {
      if (FallbackComponent) {
        return <FallbackComponent {...props} requiredPlan={minPlan} />;
      }
      return null;
    }

    return <Component {...props} />;
  };
}

export default TenantContext;
