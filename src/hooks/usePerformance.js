/**
 * Performance optimization utilities for React components
 * Provides reusable memoization and optimization patterns
 */
import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';

/**
 * Custom hook for debouncing values
 * Useful for search inputs and other frequently changing values
 * 
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for throttling function calls
 * Limits how often a function can be called
 * 
 * @param {Function} callback - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled function
 */
export const useThrottle = (callback, delay = 500) => {
  const lastRun = useRef(Date.now());

  return useCallback(
    (...args) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    },
    [callback, delay]
  );
};

/**
 * Custom hook to track previous value
 * Useful for comparing current vs previous values
 * 
 * @param {any} value - Value to track
 * @returns {any} Previous value
 */
export const usePrevious = (value) => {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
};

/**
 * Custom hook for efficient array filtering with memoization
 * 
 * @param {Array} array - Array to filter
 * @param {Function} filterFn - Filter function
 * @param {Array} deps - Dependencies for memoization
 * @returns {Array} Filtered array
 */
export const useFilteredArray = (array, filterFn, deps = []) => {
  return useMemo(() => {
    if (!Array.isArray(array)) return [];
    return array.filter(filterFn);
  }, [array, ...deps]);
};

/**
 * Custom hook for efficient array sorting with memoization
 * 
 * @param {Array} array - Array to sort
 * @param {Function} compareFn - Compare function
 * @param {Array} deps - Dependencies for memoization
 * @returns {Array} Sorted array
 */
export const useSortedArray = (array, compareFn, deps = []) => {
  return useMemo(() => {
    if (!Array.isArray(array)) return [];
    return [...array].sort(compareFn);
  }, [array, ...deps]);
};

/**
 * Custom hook for efficiently paginating arrays
 * 
 * @param {Array} array - Array to paginate
 * @param {number} pageSize - Items per page
 * @param {number} currentPage - Current page (1-indexed)
 * @returns {Object} Paginated data and helpers
 */
export const usePagination = (array, pageSize = 10, initialPage = 1) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const paginatedData = useMemo(() => {
    if (!Array.isArray(array)) return [];
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return array.slice(startIndex, endIndex);
  }, [array, currentPage, pageSize]);

  const totalPages = useMemo(() => {
    return Math.ceil((array?.length || 0) / pageSize);
  }, [array, pageSize]);

  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  return {
    data: paginatedData,
    currentPage,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    goToPage,
    nextPage,
    prevPage,
  };
};

/**
 * Custom hook for memoizing expensive computations
 * Similar to useMemo but with named caching
 * 
 * @param {Function} fn - Function to memoize
 * @param {Array} deps - Dependencies
 * @param {string} key - Cache key (optional)
 * @returns {any} Memoized result
 */
export const useMemoizedComputation = (fn, deps, key = null) => {
  const cache = useRef(new Map());
  const cacheKey = key || JSON.stringify(deps);

  return useMemo(() => {
    if (cache.current.has(cacheKey)) {
      return cache.current.get(cacheKey);
    }
    
    const result = fn();
    cache.current.set(cacheKey, result);
    
    // Limit cache size
    if (cache.current.size > 50) {
      const firstKey = cache.current.keys().next().value;
      cache.current.delete(firstKey);
    }
    
    return result;
  }, deps);
};

/**
 * Custom hook for intersection observer (lazy loading)
 * 
 * @param {Object} options - Intersection observer options
 * @returns {Array} [ref, isIntersecting]
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [options.threshold, options.root, options.rootMargin]);

  return [targetRef, isIntersecting];
};

/**
 * Custom hook for window size tracking (responsive design)
 * 
 * @returns {Object} Window width and height
 */
export const useWindowSize = () => {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Throttle resize events
    let timeoutId;
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', throttledResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', throttledResize);
    };
  }, []);

  return size;
};

/**
 * Custom hook for local storage with sync across tabs
 * 
 * @param {string} key - Storage key
 * @param {any} initialValue - Initial value
 * @returns {Array} [value, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};
