/**
 * Activity Event Contracts
 * 
 * Canonical types for the Activity Event Spine architecture.
 * These types define the contract between frontend, backend, and external systems.
 */

/**
 * Event Types - Categories of activity events
 */
export enum EventType {
  // Campaign Events
  CAMPAIGN_LAUNCHED = 'campaign_launched',
  CAMPAIGN_PAUSED = 'campaign_paused',
  CAMPAIGN_COMPLETED = 'campaign_completed',
  CAMPAIGN_FAILING = 'campaign_failing',
  
  // Lead Events
  LEAD_CREATED = 'lead_created',
  LEAD_UPDATED = 'lead_updated',
  LEAD_SCORED = 'lead_scored',
  LEAD_HIGH_INTENT = 'lead_high_intent',
  LEAD_REPLIED = 'lead_replied',
  LEAD_MEETING_BOOKED = 'lead_meeting_booked',
  LEAD_ASSIGNED = 'lead_assigned',
  
  // Email Events
  EMAIL_SENT = 'email_sent',
  EMAIL_OPENED = 'email_opened',
  EMAIL_CLICKED = 'email_clicked',
  EMAIL_REPLIED = 'email_replied',
  EMAIL_BOUNCED = 'email_bounced',
  EMAIL_UNSUBSCRIBED = 'email_unsubscribed',
  
  // Call Events
  CALL_SCHEDULED = 'call_scheduled',
  CALL_COMPLETED = 'call_completed',
  CALL_MISSED = 'call_missed',
  
  // AI Events
  AI_OPTIMIZATION = 'ai_optimization',
  AI_SCORING = 'ai_scoring',
  AI_RECOMMENDATION = 'ai_recommendation',
  
  // System Events
  SYSTEM_INTEGRATION_ERROR = 'system_integration_error',
  SYSTEM_USAGE_WARNING = 'system_usage_warning',
  SYSTEM_SYNC_COMPLETED = 'system_sync_completed',
}

/**
 * Source Systems - Where events originate
 */
export enum EventSource {
  INTERNAL = 'internal',
  SALESFORCE = 'salesforce',
  HUBSPOT = 'hubspot',
  OUTREACH = 'outreach',
  SALESLOFT = 'salesloft',
  APOLLO = 'apollo',
  GONG = 'gong',
  ZOOM = 'zoom',
  CALENDLY = 'calendly',
  LINKEDIN = 'linkedin',
  GMAIL = 'gmail',
  SENDGRID = 'sendgrid',
  TWILIO = 'twilio',
  WEBHOOK = 'webhook',
  AI_ENGINE = 'ai_engine',
}

/**
 * Event Status
 */
export enum EventStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/**
 * Event Priority/Severity
 */
export enum EventPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Canonical Activity Event
 * 
 * This is the immutable event structure stored in the event spine.
 */
export interface ActivityEvent {
  // Unique event identifier
  id: string;
  
  // Multi-tenancy
  tenantId: string;
  
  // Event classification
  type: EventType;
  source: EventSource;
  status: EventStatus;
  priority: EventPriority;
  
  // Source tracking (for idempotency and tracing)
  sourceSystem: string;        // e.g., "salesforce", "internal"
  sourceObjectId: string;       // External ID for deduplication
  sourceObjectType?: string;    // e.g., "opportunity", "contact"
  
  // Event payload
  title: string;
  description: string;
  metadata: Record<string, any>;  // Flexible JSON for event-specific data
  
  // Entity relationships
  entityId?: string;            // Related entity in our system
  entityType?: string;          // e.g., "lead", "campaign", "user"
  
  // User context
  userId?: string;              // User who triggered (if applicable)
  userName?: string;
  
  // Temporal data
  timestamp: Date;              // When event occurred
  createdAt: Date;              // When ingested into our system
  expiresAt?: Date;             // Optional TTL for event
  
  // Idempotency
  idempotencyKey: string;       // Hash of sourceSystem + sourceObjectId + timestamp
  
  // Read tracking (for notifications)
  read?: boolean;
  readAt?: Date;
  
  // Additional context
  tags?: string[];
  correlationId?: string;       // For tracing related events
}

/**
 * Activity Event Create - Input for creating new events
 */
export interface ActivityEventCreate {
  tenantId: string;
  type: EventType;
  source: EventSource;
  sourceSystem: string;
  sourceObjectId: string;
  sourceObjectType?: string;
  title: string;
  description: string;
  metadata?: Record<string, any>;
  entityId?: string;
  entityType?: string;
  userId?: string;
  userName?: string;
  timestamp?: Date;
  priority?: EventPriority;
  tags?: string[];
  correlationId?: string;
}

/**
 * Activity Event Filters - Query parameters
 */
export interface ActivityEventFilters {
  tenantId: string;              // Required for multi-tenancy
  types?: EventType[];
  sources?: EventSource[];
  statuses?: EventStatus[];
  priorities?: EventPriority[];
  entityId?: string;
  entityType?: string;
  userId?: string;
  read?: boolean;
  tags?: string[];
  startDate?: Date;
  endDate?: Date;
  search?: string;               // Full-text search on title/description
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * SSE Event Delta - Real-time update payload
 */
export interface ActivityEventDelta {
  action: 'created' | 'updated' | 'deleted';
  event: ActivityEvent;
  timestamp: Date;
}

/**
 * Grouped Activities - For UI display
 */
export interface GroupedActivities {
  today: ActivityEvent[];
  yesterday: ActivityEvent[];
  older: ActivityEvent[];
}

/**
 * Activity Stats - Summary metrics
 */
export interface ActivityStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
  bySource: Record<string, number>;
  byPriority: Record<string, number>;
}
