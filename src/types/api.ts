/**
 * API Types
 * TypeScript type definitions for API requests and responses
 */

// ============================================
// Common API Types
// ============================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  q?: string;
  filters?: Record<string, unknown>;
}

// ============================================
// Auth API Types
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

// ============================================
// Lead API Types
// ============================================

export interface GetLeadsRequest extends PaginationParams {
  status?: string | string[];
  source?: string;
  tags?: string[];
  search?: string;
  scoreMin?: number;
  scoreMax?: number;
}

export interface CreateLeadRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title: string;
  company: string;
  source?: string;
  tags?: string[];
}

export interface UpdateLeadRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  title?: string;
  company?: string;
  status?: string;
  score?: number;
  tags?: string[];
}

export interface BulkLeadRequest {
  action: 'update_status' | 'add_tags' | 'remove_tags' | 'delete' | 'enrich';
  leadIds: string[];
  data?: Record<string, unknown>;
}

export interface EnrichLeadRequest {
  email?: string;
  linkedinUrl?: string;
  domain?: string;
}

export interface EnrichLeadResponse {
  success: boolean;
  lead: Record<string, unknown>;
  enrichment: Record<string, unknown>;
  provider: string;
}

// ============================================
// Campaign API Types
// ============================================

export interface GetCampaignsRequest extends PaginationParams {
  status?: string | string[];
  type?: string;
  search?: string;
}

export interface CreateCampaignRequest {
  name: string;
  type: 'email' | 'linkedin' | 'multichannel';
  objective: string;
  steps?: CampaignStepRequest[];
  leadListId?: string;
}

export interface CampaignStepRequest {
  type: 'email' | 'linkedin' | 'call' | 'sms' | 'delay';
  subject?: string;
  content: string;
  delay?: number;
  delayUnit?: 'hours' | 'days';
}

export interface UpdateCampaignRequest {
  name?: string;
  type?: string;
  objective?: string;
  status?: string;
  steps?: CampaignStepRequest[];
}

export interface LaunchCampaignRequest {
  scheduleAt?: string; // ISO date string for scheduled launch
}

// ============================================
// AI API Types
// ============================================

export interface GenerateEmailRequest {
  prompt: string;
  tone?: 'professional' | 'casual' | 'enthusiastic';
  leadContext?: {
    name?: string;
    company?: string;
    title?: string;
  };
  previousEmails?: string[];
}

export interface GenerateEmailResponse {
  subject: string;
  body: string;
  alternatives?: {
    subject: string;
    body: string;
  }[];
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

export interface AIChatRequest {
  message: string;
  conversationId?: string;
  context?: Record<string, unknown>;
}

export interface AIChatResponse {
  message: string;
  conversationId: string;
  suggestions?: string[];
  actions?: AIAction[];
}

export interface AIAction {
  type: 'create_campaign' | 'add_lead' | 'schedule_meeting' | 'send_email';
  label: string;
  data: Record<string, unknown>;
}

// ============================================
// Analytics API Types
// ============================================

export interface GetAnalyticsRequest {
  startDate: string;
  endDate: string;
  granularity?: 'hour' | 'day' | 'week' | 'month';
  campaignId?: string;
}

export interface AnalyticsResponse {
  summary: {
    totalSent: number;
    totalOpened: number;
    totalClicked: number;
    totalReplied: number;
    totalMeetings: number;
    openRate: number;
    clickRate: number;
    replyRate: number;
  };
  timeline: {
    date: string;
    sent: number;
    opened: number;
    clicked: number;
    replied: number;
  }[];
  topCampaigns: {
    id: string;
    name: string;
    sent: number;
    replyRate: number;
  }[];
}

// ============================================
// Integration API Types
// ============================================

export interface GetIntegrationsResponse {
  integrations: IntegrationStatus[];
}

export interface IntegrationStatus {
  id: string;
  name: string;
  type: 'crm' | 'email' | 'calendar' | 'enrichment' | 'communication';
  connected: boolean;
  lastSyncAt?: string;
  status: 'active' | 'error' | 'disconnected';
  config?: Record<string, unknown>;
}

export interface ConnectIntegrationRequest {
  integrationId: string;
  authCode?: string;
  credentials?: Record<string, string>;
}

export interface DisconnectIntegrationRequest {
  integrationId: string;
}

// ============================================
// Webhook Types
// ============================================

export interface WebhookEvent {
  id: string;
  event: WebhookEventType;
  data: Record<string, unknown>;
  timestamp: string;
  signature: string;
}

export type WebhookEventType =
  | 'lead.created'
  | 'lead.updated'
  | 'lead.deleted'
  | 'campaign.launched'
  | 'campaign.completed'
  | 'email.sent'
  | 'email.opened'
  | 'email.clicked'
  | 'email.replied'
  | 'email.bounced'
  | 'meeting.scheduled';

export interface CreateWebhookRequest {
  url: string;
  events: WebhookEventType[];
  secret?: string;
  active?: boolean;
}

export interface WebhookResponse {
  id: string;
  url: string;
  events: WebhookEventType[];
  active: boolean;
  createdAt: string;
  lastTriggeredAt?: string;
  failureCount: number;
}
