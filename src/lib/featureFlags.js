/**
 * Feature Flags System
 * Allows enabling/disabling features at runtime
 */

/**
 * Default feature flags configuration
 */
const DEFAULT_FLAGS = {
  // Core features
  campaigns: true,
  leads: true,
  analytics: true,
  
  // AI features
  aiAssistant: true,
  aiLeadIntelligence: false,
  aiCampaignStrategist: false,
  
  // Advanced features
  multiChannel: false,
  abTesting: false,
  leadScoring: true,
  enrichment: true,
  
  // Real-time features
  realTimeUpdates: false,
  websocket: false,
  
  // Integrations
  salesforce: true,
  hubspot: true,
  customIntegrations: false,
  
  // Admin features
  auditLog: true,
  webhooks: false,
  apiKeys: true,
  
  // UI features
  darkMode: true,
  commandPalette: true,
  virtualScroll: true,
  
  // Beta features
  voiceAssistant: false,
  predictiveAnalytics: false,
  advancedWorkflows: false,
};

/**
 * Feature flags storage key
 */
const STORAGE_KEY = 'artisan_feature_flags';

/**
 * Get feature flags from storage or use defaults
 */
const getFlags = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_FLAGS, ...parsed };
    }
  } catch (error) {
    console.error('Error loading feature flags:', error);
  }
  return DEFAULT_FLAGS;
};

/**
 * Save feature flags to storage
 */
const saveFlags = (flags) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
  } catch (error) {
    console.error('Error saving feature flags:', error);
  }
};

/**
 * Feature flag manager class
 */
class FeatureFlagManager {
  constructor() {
    this.flags = getFlags();
    this.listeners = new Set();
  }

  /**
   * Check if a feature is enabled
   */
  isEnabled(featureName) {
    return this.flags[featureName] === true;
  }

  /**
   * Check if a feature is disabled
   */
  isDisabled(featureName) {
    return !this.isEnabled(featureName);
  }

  /**
   * Enable a feature
   */
  enable(featureName) {
    this.flags[featureName] = true;
    saveFlags(this.flags);
    this.notifyListeners();
  }

  /**
   * Disable a feature
   */
  disable(featureName) {
    this.flags[featureName] = false;
    saveFlags(this.flags);
    this.notifyListeners();
  }

  /**
   * Toggle a feature
   */
  toggle(featureName) {
    this.flags[featureName] = !this.flags[featureName];
    saveFlags(this.flags);
    this.notifyListeners();
  }

  /**
   * Set multiple flags at once
   */
  setFlags(newFlags) {
    this.flags = { ...this.flags, ...newFlags };
    saveFlags(this.flags);
    this.notifyListeners();
  }

  /**
   * Get all flags
   */
  getAllFlags() {
    return { ...this.flags };
  }

  /**
   * Reset to defaults
   */
  reset() {
    this.flags = { ...DEFAULT_FLAGS };
    saveFlags(this.flags);
    this.notifyListeners();
  }

  /**
   * Subscribe to flag changes
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of changes
   */
  notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.flags);
      } catch (error) {
        console.error('Error in feature flag listener:', error);
      }
    });
  }

  /**
   * Load flags from backend (placeholder for future implementation)
   */
  async loadFromBackend() {
    try {
      // TODO: Implement API call to fetch feature flags from backend
      // const response = await fetch('/api/feature-flags');
      // const data = await response.json();
      // this.setFlags(data);
      console.log('Loading feature flags from backend (not implemented)');
    } catch (error) {
      console.error('Error loading feature flags from backend:', error);
    }
  }
}

// Create singleton instance
const featureFlagManager = new FeatureFlagManager();

/**
 * Check if a feature is enabled
 */
export const isFeatureEnabled = (featureName) => {
  return featureFlagManager.isEnabled(featureName);
};

/**
 * Check if a feature is disabled
 */
export const isFeatureDisabled = (featureName) => {
  return featureFlagManager.isDisabled(featureName);
};

/**
 * Enable a feature
 */
export const enableFeature = (featureName) => {
  featureFlagManager.enable(featureName);
};

/**
 * Disable a feature
 */
export const disableFeature = (featureName) => {
  featureFlagManager.disable(featureName);
};

/**
 * Toggle a feature
 */
export const toggleFeature = (featureName) => {
  featureFlagManager.toggle(featureName);
};

/**
 * Get all feature flags
 */
export const getAllFeatureFlags = () => {
  return featureFlagManager.getAllFlags();
};

/**
 * Set multiple feature flags
 */
export const setFeatureFlags = (flags) => {
  featureFlagManager.setFlags(flags);
};

/**
 * Reset feature flags to defaults
 */
export const resetFeatureFlags = () => {
  featureFlagManager.reset();
};

/**
 * Subscribe to feature flag changes
 */
export const subscribeToFeatureFlags = (listener) => {
  return featureFlagManager.subscribe(listener);
};

export default featureFlagManager;
