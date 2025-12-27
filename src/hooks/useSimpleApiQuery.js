/**
 * Simple API Query Hook
 * A lightweight wrapper for data fetching without external dependencies
 * Can be used as a starting point before adopting React Query
 */
import { useEffect, useState } from 'react';

export function useApiQuery(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchFn();
        
        if (!cancelled) {
          // Handle axios response structure
          setData(response.data ?? response);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
          console.error('API query error:', err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const refetch = () => {
    setLoading(true);
    setError(null);
    fetchFn()
      .then((response) => setData(response.data ?? response))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  return { data, loading, error, refetch };
}

export default useApiQuery;
