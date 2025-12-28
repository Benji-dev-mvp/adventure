/**
 * API Endpoints Index
 * Centralized export for all API endpoints
 */

export * as campaigns from './campaigns';
export * as leads from './leads';
export * as analytics from './analytics';
export * as auth from './auth';

// Re-export the client for convenience
export { apiClient } from '../client';
