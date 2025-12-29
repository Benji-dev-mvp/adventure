/**
 * API Routes Configuration
 * 
 * Defines all backend API endpoints for the platform.
 * This file serves as a contract between frontend and backend.
 */

/**
 * Base API URL
 * TODO: Configure per environment (dev/staging/prod)
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Activity/Event Endpoints
 */
export const ACTIVITY_ROUTES = {
  /**
   * List activities with filtering and pagination
   * GET /api/activity
   * Query params: tenantId, entityType, entityId, eventType, actorType, importance, after, before, cursor, limit
   * Response: { items: ActivityEvent[], nextCursor?: string, totalCount?: number }
   */
  LIST: `${API_BASE_URL}/activity`,
  
  /**
   * Get a single activity event by ID
   * GET /api/activity/:id
   * Response: ActivityEvent
   */
  GET: (id: string) => `${API_BASE_URL}/activity/${id}`,
  
  /**
   * Server-Sent Events stream for real-time activity updates
   * GET /api/activity/stream
   * Query params: tenantId, entityType, entityId, actorType, importance
   * Returns: EventSource stream
   */
  STREAM: `${API_BASE_URL}/activity/stream`,
};

/**
 * Tenant/Organization Endpoints
 */
export const TENANT_ROUTES = {
  /**
   * Get current tenant info
   * GET /api/tenant
   */
  GET_CURRENT: `${API_BASE_URL}/tenant`,
  
  /**
   * Get tenant usage and quotas
   * GET /api/tenant/usage
   */
  GET_USAGE: `${API_BASE_URL}/tenant/usage`,
};

/**
 * Lead Endpoints
 */
export const LEAD_ROUTES = {
  /**
   * List leads
   * GET /api/leads
   */
  LIST: `${API_BASE_URL}/leads`,
  
  /**
   * Get lead by ID
   * GET /api/leads/:id
   */
  GET: (id: string) => `${API_BASE_URL}/leads/${id}`,
};

/**
 * Campaign Endpoints
 */
export const CAMPAIGN_ROUTES = {
  /**
   * List campaigns
   * GET /api/campaigns
   */
  LIST: `${API_BASE_URL}/campaigns`,
  
  /**
   * Get campaign by ID
   * GET /api/campaigns/:id
   */
  GET: (id: string) => `${API_BASE_URL}/campaigns/${id}`,
};

/**
 * Playbook Endpoints
 */
export const PLAYBOOK_ROUTES = {
  /**
   * List playbooks
   * GET /api/playbooks
   */
  LIST: `${API_BASE_URL}/playbooks`,
  
  /**
   * Get playbook by ID
   * GET /api/playbooks/:id
   */
  GET: (id: string) => `${API_BASE_URL}/playbooks/${id}`,
};

/**
 * Integration Endpoints
 */
export const INTEGRATION_ROUTES = {
  /**
   * List integrations
   * GET /api/integrations
   */
  LIST: `${API_BASE_URL}/integrations`,
  
  /**
   * Get integration status
   * GET /api/integrations/:id
   */
  GET: (id: string) => `${API_BASE_URL}/integrations/${id}`,
};

/**
 * AI Decision Endpoints
 */
export const AI_DECISION_ROUTES = {
  /**
   * List AI decisions
   * GET /api/ai/decisions
   */
  LIST: `${API_BASE_URL}/ai/decisions`,
  
  /**
   * Get AI decision by ID
   * GET /api/ai/decisions/:id
   */
  GET: (id: string) => `${API_BASE_URL}/ai/decisions/${id}`,
};
