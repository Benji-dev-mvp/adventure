/**
 * API Response Type Definitions
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  filters?: Record<string, any>;
  dateFrom?: string;
  dateTo?: string;
}

export interface ListParams extends PaginationParams, FilterParams {}

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestConfig {
  method?: ApiMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
  retries?: number;
  timeout?: number;
}

export interface ApiEndpoint {
  path: string;
  method: ApiMethod;
  requiresAuth?: boolean;
}

/**
 * WebSocket Message Types
 */
export interface WebSocketMessage<T = any> {
  event: string;
  payload: T;
  timestamp?: string;
}

export interface WebSocketResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

/**
 * Batch Operation Types
 */
export interface BatchOperation<T = any> {
  operation: 'create' | 'update' | 'delete';
  data: T;
}

export interface BatchResponse<T = any> {
  successful: T[];
  failed: Array<{
    data: T;
    error: ApiError;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}
