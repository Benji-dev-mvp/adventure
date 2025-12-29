/**
 * Hooks Index
 * Central export for all custom hooks
 */

// Core hooks from advancedHooks (consolidated - removed duplicate from src/lib/hooks.js)
export {
  useDebounce,
  useLocalStorage,
  useAsync,
  useClickOutside,
  useMediaQuery,
  useIntersectionObserver,
  usePrevious,
  useEventListener,
  useOnlineStatus,
  useWindowSize,
  useCopyToClipboard,
  useToggle,
  useInterval,
  useTimeout,
  useMount,
  useUnmount,
  useUpdateEffect,
  useDeepCompareEffect,
  useThrottle,
  useLockBodyScroll,
  useHover,
  useFocus,
  useScrollPosition,
  useDocumentTitle,
  useKeyPress,
  useNetworkState,
  useGeolocation,
  useBattery,
  useIdle,
} from './advancedHooks';

// NOTE: useToast is exported from src/components/Toast.jsx
// Import it as: import { useToast } from '../components/Toast';
// DO NOT use the shadcn use-toast.js - it's kept for reference only

// Scroll animation
export { useScrollAnimation } from './useScrollAnimation';

// Keyboard shortcuts
export { useKeyboardShortcuts, formatShortcut, getShortcutGroups } from './useKeyboardShortcuts';

// Motion and reduced motion
export { useReducedMotion, getMotionConfig, useMotion } from './useMotion';

// Workspace metrics (segment-aware data hook)
export { useWorkspaceMetrics, useSegmentCTA, useQuickStats } from './useWorkspaceMetrics';

// Navigation analytics
export { useNavAnalytics, useFeatureAnalytics } from './useNavAnalytics.jsx';

// API Query hooks (React Query)
export {
  useDashboardStats,
  useDashboardActivities,
  useLeads,
  useLead,
  useLeadStats,
  useCreateLead,
  useUpdateLead,
  useDeleteLead,
  useCampaigns,
  useCampaign,
  useCampaignStats,
  useCreateCampaign,
  useUpdateCampaign,
  useTemplates,
  useCreateTemplate,
  useIntegrations,
  useIntegrationStatus,
  useCurrentUser,
  useUserPreferences,
  useUpdatePreferences,
  usePrefetchDashboard,
  usePrefetchLeads,
} from './useApiQuery';
