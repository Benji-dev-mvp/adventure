/**
 * Optimized API request utility with caching, deduplication, and batching.
 * Reduces redundant API calls and improves performance.
 */

// Request cache with TTL
const requestCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Track in-flight requests to prevent duplicates
const inflightRequests = new Map();

/**
 * Create a cache key from request parameters
 */
const getCacheKey = (path, options = {}) => {
  const method = options.method || 'GET';
  const body = options.body ? JSON.stringify(options.body) : '';
  return `${method}:${path}:${body}`;
};

/**
 * Check if cache entry is still valid
 */
const isCacheValid = (entry) => {
  return entry && (Date.now() - entry.timestamp < CACHE_TTL);
};

/**
 * Optimized request function with caching and deduplication
 * 
 * @param {string} path - API endpoint path
 * @param {Object} options - Fetch options
 * @param {boolean} useCache - Whether to use cache (default: true for GET)
 * @returns {Promise} Response data
 */
export const optimizedRequest = async (path, options = {}, useCache = null) => {
  const method = options.method || 'GET';
  const shouldCache = useCache !== null ? useCache : method === 'GET';
  const cacheKey = getCacheKey(path, options);

  // Check cache first
  if (shouldCache) {
    const cached = requestCache.get(cacheKey);
    if (isCacheValid(cached)) {
      return cached.data;
    }
  }

  // Check if request is already in flight
  if (inflightRequests.has(cacheKey)) {
    return inflightRequests.get(cacheKey);
  }

  // Make the request
  const API_BASE = import.meta?.env?.VITE_API_URL || 'http://localhost:8000/api';
  const url = `${API_BASE}${path}`;
  
  const requestPromise = fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
    .then(async (res) => {
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Request failed ${res.status}: ${body}`);
      }
      return res.json();
    })
    .then((data) => {
      // Cache successful response
      if (shouldCache) {
        requestCache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
      }
      return data;
    })
    .finally(() => {
      // Remove from in-flight requests
      inflightRequests.delete(cacheKey);
    });

  // Track in-flight request
  inflightRequests.set(cacheKey, requestPromise);

  return requestPromise;
};

/**
 * Clear cache for specific path or all cache
 */
export const clearCache = (path = null) => {
  if (path) {
    // Clear cache entries matching the path
    for (const key of requestCache.keys()) {
      if (key.includes(path)) {
        requestCache.delete(key);
      }
    }
  } else {
    // Clear all cache
    requestCache.clear();
  }
};

/**
 * Batch multiple requests into a single operation
 * Useful for loading multiple resources at once
 */
export const batchRequests = async (requests) => {
  const promises = requests.map(({ path, options, useCache }) =>
    optimizedRequest(path, options, useCache)
  );
  return Promise.all(promises);
};

/**
 * Request with retry logic for failed requests
 */
export const requestWithRetry = async (
  path,
  options = {},
  maxRetries = 3,
  retryDelay = 1000
) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await optimizedRequest(path, options, false);
    } catch (error) {
      lastError = error;
      
      // Don't retry on 4xx errors (client errors)
      if (error.message && error.message.includes('4')) {
        throw error;
      }
      
      // Wait before retrying
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
  }
  
  throw lastError;
};

/**
 * Debounced request - useful for search/autocomplete
 */
const debounceTimers = new Map();

export const debouncedRequest = (path, options = {}, delay = 300) => {
  const key = getCacheKey(path, options);
  
  return new Promise((resolve, reject) => {
    // Clear existing timer
    if (debounceTimers.has(key)) {
      clearTimeout(debounceTimers.get(key));
    }
    
    // Set new timer
    const timer = setTimeout(async () => {
      try {
        const result = await optimizedRequest(path, options);
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        debounceTimers.delete(key);
      }
    }, delay);
    
    debounceTimers.set(key, timer);
  });
};

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
  let validEntries = 0;
  let expiredEntries = 0;
  
  for (const entry of requestCache.values()) {
    if (isCacheValid(entry)) {
      validEntries++;
    } else {
      expiredEntries++;
    }
  }
  
  return {
    totalEntries: requestCache.size,
    validEntries,
    expiredEntries,
    inflightRequests: inflightRequests.size,
  };
};
