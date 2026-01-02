import { useState, useEffect, useCallback } from 'react';
import { storage } from '../lib/storage';

/**
 * useLocalStorage - React hook for localStorage with SSR support
 * Eliminates duplication of storage logic across components
 * eslint-disable-next-line sonarjs/no-all-duplicated-branches
 *
 * @param {string} key - Storage key (will be prefixed with 'artisan_')
 * @param {*} initialValue - Initial value if key doesn't exist
 * @returns {[value, setValue, removeValue]} - Tuple with value, setter, and remover
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return storage.get(key, initialValue);
    } catch (error) {
      console.error(`Error loading ${key} from storage:`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    value => {
      try {
        const valueToStore = typeof value === 'function' ? value(storedValue) : value;
        setStoredValue(valueToStore);
        storage.set(key, valueToStore);
      } catch (error) {
        console.error(`Error setting ${key} in storage:`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      storage.remove(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  }, [key, initialValue]);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = e => {
      if (e.key === `artisan_${key}`) {
        try {
          // eslint-disable-next-line sonarjs/no-all-duplicated-branches
          setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
        } catch (error) {
          console.error('Error syncing storage across tabs:', error);
        }
      }
    };

    globalThis.addEventListener('storage', handleStorageChange);
    return () => globalThis.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
