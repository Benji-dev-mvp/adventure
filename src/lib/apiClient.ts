/**
 * Typed API Client
 * HTTP client with interceptors, auth handling, and type safety
 */
import ky, { type Options, type KyResponse } from 'ky';
import { useUserStore } from '../stores/userStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Create the base ky instance with interceptors
export const apiClient = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 30000,
  retry: {
    limit: 2,
    methods: ['get', 'head', 'options'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      (request) => {
        // Add auth token to requests
        const token = useUserStore.getState().token;
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }

        // Add request ID for tracing
        request.headers.set('X-Request-ID', crypto.randomUUID());
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        // Handle 401 Unauthorized - logout user
        if (response.status === 401) {
          useUserStore.getState().logout();
          // Redirect to login if in browser
          if (typeof window !== 'undefined') {
            window.location.href = '/login?session_expired=true';
          }
        }
        return response;
      },
    ],
    beforeError: [
      async (error) => {
        const { response } = error;
        if (response) {
          try {
            const body = await response.json() as { message?: string; code?: string; details?: unknown };
            error.message = body.message || error.message;
            // Attach additional error info
          (error as unknown as ApiError).code = body.code;
          (error as unknown as ApiError).details = body.details;
          } catch {
            // Response is not JSON, use default message
          }
        }
        return error;
      },
    ],
  },
});

// Type-safe API methods
export const api = {
  /**
   * GET request
   */
  get: <T>(url: string, options?: Options): Promise<T> =>
    apiClient.get(url, options).json<T>(),

  /**
   * POST request with JSON body
   */
  post: <T>(url: string, json?: unknown, options?: Options): Promise<T> =>
    apiClient.post(url, { json, ...options }).json<T>(),

  /**
   * PUT request with JSON body
   */
  put: <T>(url: string, json?: unknown, options?: Options): Promise<T> =>
    apiClient.put(url, { json, ...options }).json<T>(),

  /**
   * PATCH request with JSON body
   */
  patch: <T>(url: string, json?: unknown, options?: Options): Promise<T> =>
    apiClient.patch(url, { json, ...options }).json<T>(),

  /**
   * DELETE request
   */
  delete: <T>(url: string, options?: Options): Promise<T> =>
    apiClient.delete(url, options).json<T>(),

  /**
   * Upload file with multipart/form-data
   */
  upload: <T>(url: string, formData: FormData, options?: Options): Promise<T> =>
    apiClient.post(url, { body: formData, ...options }).json<T>(),

  /**
   * Download file as blob
   */
  download: (url: string, options?: Options): Promise<Blob> =>
    apiClient.get(url, options).blob(),

  /**
   * Stream response (for SSE or streaming APIs)
   */
  stream: (url: string, options?: Options): Promise<KyResponse> =>
    apiClient.get(url, options),
};

// Convenience functions for common patterns
export const apiHelpers = {
  /**
   * Paginated GET request
   */
  getPaginated: <T>(
    url: string,
    params: { page?: number; limit?: number; [key: string]: unknown }
  ) =>
    api.get<{
      data: T[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(url, { searchParams: params as Record<string, string | number | boolean> }),

  /**
   * Search with debounce-friendly API
   */
  search: <T>(url: string, query: string, filters?: Record<string, unknown>) =>
    api.get<{ results: T[]; total: number }>(url, {
      searchParams: { q: query, ...filters } as Record<string, string | number | boolean>,
    }),
};

export default api;
