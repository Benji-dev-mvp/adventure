/**
 * Feature Flags Service
 * Enable/disable features dynamically for A/B testing and gradual rollouts
 */

export interface FeatureFlags {
  // Core Features
  enableRealTimeUpdates: boolean;
  enableAIAssistant: boolean;
  enableMultiChannelCampaigns: boolean;
  
  // Beta Features
  enableAdvancedAnalytics: boolean;
  enableLeadScoring: boolean;
  enableABTesting: boolean;
  enableWorkflowAutomation: boolean;
  
  // Experimental Features
  enableVoiceCommands: boolean;
  enablePredictiveLeadGen: boolean;
  enableAutoSequencing: boolean;
  
  // UI/UX
  enableNewDashboard: boolean;
  enableDarkMode: boolean;
  enableCompactMode: boolean;
  enableKeyboardShortcuts: boolean;
}

// Default feature flags
const defaultFlags: FeatureFlags = {
  // Core - enabled by default
  enableRealTimeUpdates: true,
  enableAIAssistant: true,
  enableMultiChannelCampaigns: true,
  
  // Beta - enabled for early adopters
  enableAdvancedAnalytics: true,
  enableLeadScoring: true,
  enableABTesting: false,
  enableWorkflowAutomation: false,
  
  // Experimental - disabled by default
  enableVoiceCommands: false,
  enablePredictiveLeadGen: false,
  enableAutoSequencing: false,
  
  // UI/UX - enabled by default
  enableNewDashboard: true,
  enableDarkMode: true,
  enableCompactMode: false,
  enableKeyboardShortcuts: true,
};

// Storage key for persisted flags
const STORAGE_KEY = 'artisan_feature_flags';

// In-memory cache
let cachedFlags: FeatureFlags | null = null;

/**
 * Load feature flags from localStorage or remote config
 */
export function loadFeatureFlags(): FeatureFlags {
  if (cachedFlags !== null) return cachedFlags;

  try {
    // Try to load from localStorage first (for overrides)
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      cachedFlags = { ...defaultFlags, ...JSON.parse(stored) };
      return cachedFlags as FeatureFlags;
    }
  } catch (error) {
    console.warn('Failed to load feature flags from storage:', error);
  }

  cachedFlags = { ...defaultFlags };
  return cachedFlags as FeatureFlags;
}

/**
 * Check if a specific feature is enabled
 */
export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  const flags = loadFeatureFlags();
  return flags[flag] ?? false;
}

/**
 * Update feature flags (for admin use or remote config)
 */
export function updateFeatureFlags(updates: Partial<FeatureFlags>): void {
  const current = loadFeatureFlags();
  cachedFlags = { ...current, ...updates };
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedFlags));
  } catch (error) {
    console.warn('Failed to persist feature flags:', error);
  }
}

/**
 * Reset feature flags to defaults
 */
export function resetFeatureFlags(): void {
  cachedFlags = { ...defaultFlags };
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear feature flags:', error);
  }
}

/**
 * Get all feature flags (for admin panel)
 */
export function getAllFeatureFlags(): FeatureFlags {
  return loadFeatureFlags();
}

/**
 * React hook for feature flags
 */
import { useState, useEffect } from 'react';

export function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  const [enabled, setEnabled] = useState(() => isFeatureEnabled(flag));

  useEffect(() => {
    // Re-check on mount in case flags changed
    setEnabled(isFeatureEnabled(flag));
  }, [flag]);

  return enabled;
}

export function useFeatureFlags(): FeatureFlags {
  const [flags, setFlags] = useState<FeatureFlags>(() => loadFeatureFlags());

  useEffect(() => {
    setFlags(loadFeatureFlags());
  }, []);

  return flags;
}

/**
 * Feature Flag Gate Component
 */
import React from 'react';

interface FeatureGateProps {
  flag: keyof FeatureFlags;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({ flag, children, fallback = null }: FeatureGateProps): React.ReactNode {
  const isEnabled = useFeatureFlag(flag);
  return isEnabled ? children : fallback;
}

export default {
  isFeatureEnabled,
  updateFeatureFlags,
  resetFeatureFlags,
  getAllFeatureFlags,
  useFeatureFlag,
  useFeatureFlags,
  FeatureGate,
};
