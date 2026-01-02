import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useDataPolling - Reusable hook for polling data at intervals
 * Eliminates duplication of polling logic across Dashboard, Analytics, LiveFeed
 *
 * @param {Function} fetchFn - Function to fetch data
 * @param {number} interval - Polling interval in ms (default: 5000)
 * @param {boolean} enabled - Whether polling is enabled (default: true)
 * @returns {Object} { data, loading, error, refetch }
 */
export const useDataPolling = (fetchFn, interval = 5000, enabled = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchFn();
      if (mountedRef.current) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err);
        console.error('Polling error:', err);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetchFn]);

  useEffect(() => {
    mountedRef.current = true;

    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    // Initial fetch
    fetchData();

    // Set up polling
    intervalRef.current = setInterval(fetchData, interval);

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, interval, enabled]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export default useDataPolling;
