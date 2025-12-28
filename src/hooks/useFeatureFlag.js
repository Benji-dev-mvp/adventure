/**
 * Feature Flag Hook
 * React hook for checking feature flags
 */
import { useState, useEffect } from 'react';
import featureFlagManager from '../lib/featureFlags';

/**
 * Hook to check if a feature is enabled
 * Updates automatically when flags change
 */
export const useFeatureFlag = (featureName) => {
  const [isEnabled, setIsEnabled] = useState(
    featureFlagManager.isEnabled(featureName)
  );

  useEffect(() => {
    // Subscribe to flag changes
    const unsubscribe = featureFlagManager.subscribe((flags) => {
      setIsEnabled(flags[featureName] === true);
    });

    return unsubscribe;
  }, [featureName]);

  return isEnabled;
};

/**
 * Hook to get all feature flags
 */
export const useFeatureFlags = () => {
  const [flags, setFlags] = useState(featureFlagManager.getAllFlags());

  useEffect(() => {
    const unsubscribe = featureFlagManager.subscribe((newFlags) => {
      setFlags({ ...newFlags });
    });

    return unsubscribe;
  }, []);

  return flags;
};

export default useFeatureFlag;
