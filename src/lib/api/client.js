/**
 * API Client
 * Centralized HTTP client with interceptors, error handling, and retry logic
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Get authentication token from storage
 */
const getAuthToken = () => {
  try {
    const userStorage = localStorage.getItem('user-storage');
    if (userStorage) {
      const parsed = JSON.parse(userStorage);
      return parsed.state?.user?.token;
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  return null;
};

/**
 * API Error class for structured error handling
 */
export class APIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Retry logic with exponential backoff
 */
const retry = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry client errors (4xx) except 429 (rate limit)
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error;
      }
      
      if (i < maxRetries - 1) {
        const waitTime = delay * Math.pow(2, i);
        if (import.meta.env.DEV) {
          console.log(`Retry attempt ${i + 1} after ${waitTime}ms`);
        }
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw lastError;
};

/**
 * Core request function
 */
const request = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    headers = {},
    retries = 3,
    ...customOptions
  } = options;
  
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...customOptions,
  };
  
  // Add auth token if available
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Add body if present
  if (body) {
    config.body = JSON.stringify(body);
  }
  
  // Log request in development
  if (import.meta.env.DEV) {
    console.log(`[API] ${method} ${endpoint}`, { body, headers: config.headers });
  }
  
  // Execute request with retry logic
  return retry(async () => {
    const response = await fetch(url, config);
    
    // Parse response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`[API] ${method} ${endpoint} - ${response.status}`, data);
    }
    
    // Handle errors
    if (!response.ok) {
      throw new APIError(
        data?.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        data
      );
    }
    
    return data;
  }, retries);
};

/**
 * API Client methods
 */
export const apiClient = {
  get: (endpoint, options = {}) =>
    request(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: 'POST', body }),
  
  put: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: 'PUT', body }),
  
  patch: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: 'PATCH', body }),
  
  delete: (endpoint, options = {}) =>
    request(endpoint, { ...options, method: 'DELETE' }),
};

export default apiClient;
