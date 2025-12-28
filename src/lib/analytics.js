/**
 * Analytics Tracking
 * Centralized analytics tracking for user events and page views
 */

/**
 * Analytics configuration
 */
const config = {
  enabled: import.meta.env.PROD, // Only track in production by default
  debug: import.meta.env.DEV,
  providers: {
    mixpanel: false,
    amplitude: false,
    posthog: false,
    custom: true, // Custom backend tracking
  },
};

/**
 * Track event to backend
 */
const trackToBackend = async (eventName, properties = {}) => {
  if (!config.enabled) return;

  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: eventName,
        properties: {
          ...properties,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          referrer: document.referrer,
        },
      }),
    });
  } catch (error) {
    if (config.debug) {
      console.error('Analytics tracking error:', error);
    }
  }
};

/**
 * Analytics class
 */
class Analytics {
  constructor() {
    this.userId = null;
    this.userProperties = {};
    this.sessionId = this.generateSessionId();
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initialize analytics
   */
  init(options = {}) {
    config.enabled = options.enabled ?? config.enabled;
    config.debug = options.debug ?? config.debug;

    if (config.debug) {
      console.log('[Analytics] Initialized', config);
    }

    // Track initial page view
    this.pageView();
  }

  /**
   * Identify user
   */
  identify(userId, properties = {}) {
    this.userId = userId;
    this.userProperties = properties;

    if (config.debug) {
      console.log('[Analytics] Identify:', { userId, properties });
    }

    // Track to backend
    trackToBackend('user_identified', {
      userId,
      ...properties,
    });
  }

  /**
   * Track page view
   */
  pageView(pageName = null) {
    const name = pageName || document.title;
    
    if (config.debug) {
      console.log('[Analytics] Page View:', name);
    }

    this.track('page_view', {
      page_name: name,
      page_path: window.location.pathname,
      page_url: window.location.href,
    });
  }

  /**
   * Track event
   */
  track(eventName, properties = {}) {
    if (config.debug) {
      console.log('[Analytics] Track:', eventName, properties);
    }

    const enrichedProperties = {
      ...properties,
      user_id: this.userId,
      session_id: this.sessionId,
      ...this.userProperties,
    };

    // Track to backend
    trackToBackend(eventName, enrichedProperties);

    // Track to third-party providers if enabled
    if (config.providers.mixpanel && window.mixpanel) {
      window.mixpanel.track(eventName, enrichedProperties);
    }

    if (config.providers.amplitude && window.amplitude) {
      window.amplitude.getInstance().logEvent(eventName, enrichedProperties);
    }

    if (config.providers.posthog && window.posthog) {
      window.posthog.capture(eventName, enrichedProperties);
    }
  }

  /**
   * Track button click
   */
  trackClick(buttonName, properties = {}) {
    this.track('button_click', {
      button_name: buttonName,
      ...properties,
    });
  }

  /**
   * Track form submission
   */
  trackFormSubmit(formName, properties = {}) {
    this.track('form_submit', {
      form_name: formName,
      ...properties,
    });
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(featureName, properties = {}) {
    this.track('feature_used', {
      feature_name: featureName,
      ...properties,
    });
  }

  /**
   * Track error
   */
  trackError(error, context = {}) {
    this.track('error_occurred', {
      error_message: error.message,
      error_stack: error.stack,
      ...context,
    });
  }

  /**
   * Track performance metric
   */
  trackPerformance(metricName, value, properties = {}) {
    this.track('performance_metric', {
      metric_name: metricName,
      metric_value: value,
      ...properties,
    });
  }

  /**
   * Track conversion
   */
  trackConversion(conversionType, properties = {}) {
    this.track('conversion', {
      conversion_type: conversionType,
      ...properties,
    });
  }

  /**
   * Track search
   */
  trackSearch(query, resultsCount, properties = {}) {
    this.track('search_performed', {
      search_query: query,
      results_count: resultsCount,
      ...properties,
    });
  }

  /**
   * Track time on page
   */
  trackTimeOnPage() {
    const startTime = Date.now();

    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      this.track('time_on_page', {
        time_spent_seconds: timeSpent,
        page_path: window.location.pathname,
      });
    };
  }

  /**
   * Track campaign interaction
   */
  trackCampaignInteraction(campaignId, action, properties = {}) {
    this.track('campaign_interaction', {
      campaign_id: campaignId,
      action,
      ...properties,
    });
  }

  /**
   * Track lead interaction
   */
  trackLeadInteraction(leadId, action, properties = {}) {
    this.track('lead_interaction', {
      lead_id: leadId,
      action,
      ...properties,
    });
  }

  /**
   * Reset analytics (e.g., on logout)
   */
  reset() {
    this.userId = null;
    this.userProperties = {};
    this.sessionId = this.generateSessionId();

    if (config.debug) {
      console.log('[Analytics] Reset');
    }
  }
}

// Create singleton instance
const analytics = new Analytics();

// Export convenience functions
export const initAnalytics = (options) => analytics.init(options);
export const identify = (userId, properties) => analytics.identify(userId, properties);
export const track = (eventName, properties) => analytics.track(eventName, properties);
export const pageView = (pageName) => analytics.pageView(pageName);
export const trackClick = (buttonName, properties) => analytics.trackClick(buttonName, properties);
export const trackFormSubmit = (formName, properties) => analytics.trackFormSubmit(formName, properties);
export const trackFeatureUsage = (featureName, properties) => analytics.trackFeatureUsage(featureName, properties);
export const trackError = (error, context) => analytics.trackError(error, context);
export const trackPerformance = (metricName, value, properties) => analytics.trackPerformance(metricName, value, properties);
export const trackConversion = (conversionType, properties) => analytics.trackConversion(conversionType, properties);
export const trackSearch = (query, resultsCount, properties) => analytics.trackSearch(query, resultsCount, properties);
export const trackTimeOnPage = () => analytics.trackTimeOnPage();
export const trackCampaignInteraction = (campaignId, action, properties) => analytics.trackCampaignInteraction(campaignId, action, properties);
export const trackLeadInteraction = (leadId, action, properties) => analytics.trackLeadInteraction(leadId, action, properties);
export const resetAnalytics = () => analytics.reset();

export default analytics;
