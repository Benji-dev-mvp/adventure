/**
 * Analytics Service
 * Foundation for Mixpanel/Amplitude/PostHog integration
 */

// Analytics event types
export type AnalyticsEvent =
  // Page views
  | 'page_view'
  // User actions
  | 'user_signup'
  | 'user_login'
  | 'user_logout'
  | 'user_profile_updated'
  // Campaign actions
  | 'campaign_created'
  | 'campaign_launched'
  | 'campaign_paused'
  | 'campaign_completed'
  | 'campaign_deleted'
  // Lead actions
  | 'lead_created'
  | 'lead_updated'
  | 'lead_deleted'
  | 'lead_enriched'
  | 'lead_scored'
  // Email actions
  | 'email_sent'
  | 'email_opened'
  | 'email_clicked'
  | 'email_replied'
  | 'email_bounced'
  // AI actions
  | 'ai_content_generated'
  | 'ai_suggestion_accepted'
  | 'ai_suggestion_rejected'
  // Feature usage
  | 'feature_used'
  | 'feature_error'
  // Performance
  | 'performance_metric';

export interface AnalyticsEventData {
  // Common properties
  timestamp?: number;
  sessionId?: string;
  userId?: string;

  // Event-specific properties
  [key: string]: unknown;
}

export interface AnalyticsProvider {
  name: string;
  initialize: (config: Record<string, unknown>) => void;
  identify: (userId: string, traits?: Record<string, unknown>) => void;
  track: (event: string, properties?: Record<string, unknown>) => void;
  page: (name?: string, properties?: Record<string, unknown>) => void;
  reset: () => void;
}

// Analytics configuration
interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  providers: AnalyticsProvider[];
}

let config: AnalyticsConfig = {
  enabled: true,
  debug: import.meta.env.DEV,
  providers: [],
};

// Session tracking
let sessionId: string | null = null;
let currentUserId: string | null = null;

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get or create session ID
 */
function getSessionId(): string {
  if (!sessionId) {
    sessionId = generateSessionId();
  }
  return sessionId;
}

/**
 * Initialize analytics
 */
export function initializeAnalytics(options: Partial<AnalyticsConfig> = {}): void {
  config = { ...config, ...options };

  if (config.debug) {
    console.log('[Analytics] Initialized with config:', config);
  }

  // Initialize all providers
  config.providers.forEach(provider => {
    try {
      provider.initialize({});
    } catch (error) {
      console.error(`[Analytics] Failed to initialize ${provider.name}:`, error);
    }
  });
}

/**
 * Identify a user
 */
export function identify(userId: string, traits?: Record<string, unknown>): void {
  if (!config.enabled) return;

  currentUserId = userId;

  if (config.debug) {
    console.log('[Analytics] Identify:', userId, traits);
  }

  config.providers.forEach(provider => {
    try {
      provider.identify(userId, traits);
    } catch (error) {
      console.error(`[Analytics] ${provider.name} identify failed:`, error);
    }
  });
}

/**
 * Track an event
 */
export function track(event: AnalyticsEvent | string, properties?: AnalyticsEventData): void {
  if (!config.enabled) return;

  const enrichedProperties = {
    ...properties,
    timestamp: Date.now(),
    sessionId: getSessionId(),
    userId: currentUserId,
  };

  if (config.debug) {
    console.log('[Analytics] Track:', event, enrichedProperties);
  }

  config.providers.forEach(provider => {
    try {
      provider.track(event, enrichedProperties);
    } catch (error) {
      console.error(`[Analytics] ${provider.name} track failed:`, error);
    }
  });
}

/**
 * Track page view
 */
export function page(name?: string, properties?: Record<string, unknown>): void {
  if (!config.enabled) return;

  const enrichedProperties = {
    ...properties,
    timestamp: Date.now(),
    sessionId: getSessionId(),
    userId: currentUserId,
    url: window.location.href,
    path: window.location.pathname,
    referrer: document.referrer,
  };

  if (config.debug) {
    console.log('[Analytics] Page:', name || window.location.pathname, enrichedProperties);
  }

  config.providers.forEach(provider => {
    try {
      provider.page(name, enrichedProperties);
    } catch (error) {
      console.error(`[Analytics] ${provider.name} page failed:`, error);
    }
  });
}

/**
 * Reset analytics (on logout)
 */
export function reset(): void {
  currentUserId = null;
  sessionId = generateSessionId();

  if (config.debug) {
    console.log('[Analytics] Reset');
  }

  config.providers.forEach(provider => {
    try {
      provider.reset();
    } catch (error) {
      console.error(`[Analytics] ${provider.name} reset failed:`, error);
    }
  });
}

// ============================================
// Built-in Console Provider (for development)
// ============================================

export const consoleProvider: AnalyticsProvider = {
  name: 'console',
  initialize: () => {
    console.log('[Analytics:Console] Provider initialized');
  },
  identify: (userId, traits) => {
    console.log('[Analytics:Console] Identify:', userId, traits);
  },
  track: (event, properties) => {
    console.log('[Analytics:Console] Track:', event, properties);
  },
  page: (name, properties) => {
    console.log('[Analytics:Console] Page:', name, properties);
  },
  reset: () => {
    console.log('[Analytics:Console] Reset');
  },
};

// ============================================
// React Hooks
// ============================================

import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to track page views automatically
 */
export function usePageTracking(): void {
  const location = useLocation();

  useEffect(() => {
    page(location.pathname, {
      search: location.search,
      hash: location.hash,
    });
  }, [location]);
}

/**
 * Hook to get analytics tracking functions
 */
export function useAnalytics() {
  const trackEvent = useCallback(
    (event: AnalyticsEvent | string, properties?: AnalyticsEventData) => {
      track(event, properties);
    },
    []
  );

  const identifyUser = useCallback((userId: string, traits?: Record<string, unknown>) => {
    identify(userId, traits);
  }, []);

  return {
    track: trackEvent,
    identify: identifyUser,
    page,
    reset,
  };
}

// ============================================
// Convenience tracking functions
// ============================================

export const trackCampaign = {
  created: (campaignId: string, name: string, type: string) =>
    track('campaign_created', { campaignId, name, type }),
  launched: (campaignId: string) => track('campaign_launched', { campaignId }),
  paused: (campaignId: string) => track('campaign_paused', { campaignId }),
  completed: (campaignId: string) => track('campaign_completed', { campaignId }),
};

export const trackLead = {
  created: (leadId: string, source: string) => track('lead_created', { leadId, source }),
  updated: (leadId: string, fields: string[]) => track('lead_updated', { leadId, fields }),
  enriched: (leadId: string, provider: string) => track('lead_enriched', { leadId, provider }),
  scored: (leadId: string, score: number) => track('lead_scored', { leadId, score }),
};

export const trackAI = {
  contentGenerated: (type: string, prompt: string) =>
    track('ai_content_generated', { type, promptLength: prompt.length }),
  suggestionAccepted: (suggestionId: string, type: string) =>
    track('ai_suggestion_accepted', { suggestionId, type }),
  suggestionRejected: (suggestionId: string, type: string, reason?: string) =>
    track('ai_suggestion_rejected', { suggestionId, type, reason }),
};

export default {
  initializeAnalytics,
  identify,
  track,
  page,
  reset,
  usePageTracking,
  useAnalytics,
  trackCampaign,
  trackLead,
  trackAI,
  consoleProvider,
};
