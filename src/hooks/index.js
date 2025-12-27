/**
 * Hooks Index
 * Central export for all custom hooks
 */

// Core hooks
export { useDebounce, useLocalStorage, useAsync, useClickOutside, useMediaQuery, useIntersectionObserver, usePrevious, useEventListener, useOnlineStatus, useWindowSize, useCopyToClipboard, useToggle, useInterval, useTimeout, useMount, useUnmount, useUpdateEffect, useDeepCompareEffect, useThrottle, useLockBodyScroll, useHover, useFocus, useScrollPosition, useDocumentTitle, useKeyPress, useNetworkState, useGeolocation, useBattery, useIdle } from './advancedHooks';

// Toast hook
export { useToast } from './use-toast';

// Scroll animation
export { useScrollAnimation } from './useScrollAnimation';

// Keyboard shortcuts
export { useKeyboardShortcuts, formatShortcut, getShortcutGroups } from './useKeyboardShortcuts';

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
