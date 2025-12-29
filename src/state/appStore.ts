/**
 * Unified App State Store
 * 
 * Central Zustand store for app-wide state including:
 * - Current plan tier
 * - Demo mode
 * - Navigation exposure/locks
 * - Layout preferences
 * - Selected entities for cross-page continuity
 * - Feature access computed from plan
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlanTier } from '@/demo/demoData';

export interface SelectedEntity {
  type: 'lead' | 'campaign' | 'account' | 'playbook';
  id: string;
  name: string;
  metadata?: Record<string, any>;
}

export interface FeatureAccess {
  visible: boolean;
  locked: boolean;
  badgeText?: string;
  reason?: string;
  minPlan?: PlanTier;
}

interface AppState {
  // Plan & Tenant
  plan: PlanTier;
  isDemo: boolean;
  isAdmin: boolean;

  // Layout
  layoutPreference: 'sidebar-only' | 'sidebar-top';
  sidebarCollapsed: boolean;

  // Selected Entities (for cross-page continuity)
  selectedEntity: SelectedEntity | null;

  // Actions
  setPlan: (plan: PlanTier) => void;
  setIsDemo: (isDemo: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setLayoutPreference: (layout: 'sidebar-only' | 'sidebar-top') => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSelectedEntity: (entity: SelectedEntity | null) => void;
  clearSelectedEntity: () => void;
}

/**
 * Plan hierarchy for access checks
 */
const PLAN_HIERARCHY: Record<PlanTier, number> = {
  startup: 1,
  midmarket: 2,
  enterprise: 3,
};

/**
 * Main app store
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      plan: 'enterprise', // Default to enterprise for dev
      isDemo: true,
      isAdmin: true, // Default to admin for dev
      layoutPreference: 'sidebar-only',
      sidebarCollapsed: false,
      selectedEntity: null,

      // Actions
      setPlan: (plan) => set({ plan }),
      setIsDemo: (isDemo) => set({ isDemo }),
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      setLayoutPreference: (layout) => set({ layoutPreference: layout }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setSelectedEntity: (entity) => set({ selectedEntity: entity }),
      clearSelectedEntity: () => set({ selectedEntity: null }),
    }),
    {
      name: 'artisan-app-state',
      // Only persist user preferences, not runtime state
      partialPersist: (state) => ({
        plan: state.plan,
        isAdmin: state.isAdmin,
        layoutPreference: state.layoutPreference,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    } as any
  )
);

/**
 * Selectors for common access patterns
 */

export const useAppPlan = () => useAppStore((state) => state.plan);
export const useIsDemo = () => useAppStore((state) => state.isDemo);
export const useIsAdmin = () => useAppStore((state) => state.isAdmin);
export const useLayoutPreference = () => useAppStore((state) => state.layoutPreference);
export const useSidebarCollapsed = () => useAppStore((state) => state.sidebarCollapsed);
export const useSelectedEntity = () => useAppStore((state) => state.selectedEntity);

/**
 * Check if user's plan meets minimum requirement
 */
export function meetsMinPlan(userPlan: PlanTier, minPlan?: PlanTier): boolean {
  if (!minPlan) return true;
  return (PLAN_HIERARCHY[userPlan] || 0) >= (PLAN_HIERARCHY[minPlan] || 0);
}

/**
 * Hook to get feature access for a given feature key
 * 
 * @param featureKey - Unique identifier for the feature
 * @param minPlan - Minimum plan required (optional)
 * @param requiresAdmin - Whether admin role is required (optional)
 * @returns FeatureAccess object
 */
export function useFeatureAccess(
  featureKey: string,
  minPlan?: PlanTier,
  requiresAdmin = false
): FeatureAccess {
  const plan = useAppPlan();
  const isAdmin = useIsAdmin();

  // Check admin requirement
  if (requiresAdmin && !isAdmin) {
    return {
      visible: false,
      locked: true,
      badgeText: 'Admin',
      reason: 'Admin access required',
      minPlan,
    };
  }

  // Check plan requirement
  if (minPlan && !meetsMinPlan(plan, minPlan)) {
    const badgeMap: Record<PlanTier, string> = {
      startup: 'Startup',
      midmarket: 'Pro',
      enterprise: 'Enterprise',
    };

    return {
      visible: true, // Show as preview
      locked: true,
      badgeText: badgeMap[minPlan],
      reason: `Requires ${badgeMap[minPlan]} plan or higher`,
      minPlan,
    };
  }

  // Full access
  return {
    visible: true,
    locked: false,
  };
}

/**
 * Hook to get all feature badges for a feature
 * Combines plan requirements with other badges (AI, Beta, New, etc.)
 */
export function useFeatureBadges(
  minPlan?: PlanTier,
  additionalBadges?: Array<'AI' | 'Beta' | 'New' | 'Exec' | 'Pro'>
): Array<{ text: string; color: string }> {
  const plan = useAppPlan();
  const badges: Array<{ text: string; color: string }> = [];

  // Add plan badge if locked
  if (minPlan && !meetsMinPlan(plan, minPlan)) {
    const planBadgeMap: Record<PlanTier, { text: string; color: string }> = {
      startup: { text: 'Startup', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
      midmarket: { text: 'Pro', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
      enterprise: { text: 'Enterprise', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    };
    badges.push(planBadgeMap[minPlan]);
  }

  // Add additional badges
  if (additionalBadges) {
    const badgeColorMap = {
      AI: { text: 'AI', color: 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white' },
      Beta: { text: 'Beta', color: 'bg-purple-500 text-white' },
      New: { text: 'New', color: 'bg-emerald-500 text-white' },
      Exec: { text: 'Exec', color: 'bg-rose-500 text-white' },
      Pro: { text: 'Pro', color: 'bg-amber-500 text-slate-900' },
    };
    additionalBadges.forEach((badge) => {
      badges.push(badgeColorMap[badge]);
    });
  }

  return badges;
}

/**
 * Feature map: featureKey → configuration
 * Centralized feature access control
 */
export const FEATURE_MAP: Record<
  string,
  {
    minPlan?: PlanTier;
    requiresAdmin?: boolean;
    badges?: Array<'AI' | 'Beta' | 'New' | 'Exec' | 'Pro'>;
  }
> = {
  // AI Operator
  'ava-bdr': { badges: ['AI'] },
  'ai-assistant': {},
  'exceptional-hub': { minPlan: 'midmarket', badges: ['Pro'] },
  'advanced-hub': { minPlan: 'enterprise', badges: ['New'] },

  // Autonomous GTM
  'autonomy-dashboard': { badges: ['Beta'] },
  'autopilot': { badges: ['AI'] },
  'orchestration': {},
  'intelligence-graph': { minPlan: 'midmarket' },
  'forecasting': { minPlan: 'midmarket' },
  'influence-map': { minPlan: 'enterprise' },
  'boardroom': { minPlan: 'enterprise', badges: ['Exec'] },
  'simulate': { minPlan: 'enterprise' },
  'lead-hive': { badges: ['AI'] },
  'parliament': { minPlan: 'midmarket', badges: ['Pro'] },
  'avatar': { minPlan: 'enterprise' },
  'immersive': { minPlan: 'enterprise', badges: ['New'] },

  // Revenue Engine
  'campaigns': {},
  'leads': {},
  'lead-database': {},
  'templates': {},
  'sales-playbooks': { minPlan: 'midmarket' },
  'lead-scoring': {},
  'data-enrichment': { minPlan: 'midmarket' },

  // Ops & Control
  'analytics': {},
  'executive-dashboard': { minPlan: 'midmarket' },
  'activity-feed': {},
  'integrations': {},
  'settings': {},
  'admin': { minPlan: 'enterprise', requiresAdmin: true },

  // Enterprise Admin
  'access-control': { minPlan: 'enterprise', requiresAdmin: true },
  'audit-log': { minPlan: 'enterprise', requiresAdmin: true },
  'ai-decisions': { minPlan: 'enterprise', requiresAdmin: true },
  'observability': { minPlan: 'enterprise', requiresAdmin: true },
  'feature-flags': { minPlan: 'enterprise', requiresAdmin: true },
  'enterprise-readiness': { minPlan: 'enterprise', requiresAdmin: true },
  'usage-quotas': { minPlan: 'midmarket' },
};

/**
 * Get feature config by key
 */
export function getFeatureConfig(featureKey: string) {
  return FEATURE_MAP[featureKey] || {};
}
