/**
 * Activity Event Contract
 * 
 * Canonical event model for the entire platform.
 * All activity streams, feeds, and tickers consume this contract.
 */

// Source system enums
export type SourceSystem = 
  | 'salesforce' 
  | 'hubspot' 
  | 'slack' 
  | 'jira' 
  | 'internal'
  | 'gmail'
  | 'calendar'
  | 'linkedin'
  | 'clearbit';

export type EntityType = 
  | 'lead' 
  | 'account' 
  | 'campaign' 
  | 'playbook'
  | 'sequence'
  | 'template';

export type EventType = 
  | 'status_change' 
  | 'message' 
  | 'meeting' 
  | 'alert' 
  | 'enrichment' 
  | 'recommendation'
  | 'execution'
  | 'qualification'
  | 'optimization';

export type ActorType = 'AI' | 'Human' | 'System';

export type ImportanceLevel = 'low' | 'medium' | 'high';

/**
 * Provenance: References to source data without embedding raw payloads
 */
export interface EventProvenance {
  /** Reference IDs to original source objects (e.g. Salesforce opportunity ID) */
  refs: string[];
  /** Optional: Link to view source in external system */
  externalUrl?: string;
}

/**
 * Canonical Activity Event
 * 
 * Stable contract for all activity across the platform.
 * Backend-ready: matches expected API response shape.
 */
export interface ActivityEvent {
  /** Unique event ID */
  id: string;
  
  /** Tenant/organization ID */
  tenantId: string;
  
  /** Source system that generated this event */
  sourceSystem: SourceSystem;
  
  /** Type of object in the source system */
  sourceObjectType: string;
  
  /** ID of the object in the source system */
  sourceObjectId: string;
  
  /** Primary entity this event relates to */
  entityType: EntityType;
  
  /** ID of the primary entity */
  entityId: string;
  
  /** Type of event */
  eventType: EventType;
  
  /** Who/what performed this action */
  actorType: ActorType;
  
  /** Name/identifier of the actor */
  actorName: string;
  
  /** Importance/priority level */
  importance: ImportanceLevel;
  
  /** ISO 8601 timestamp */
  timestamp: string;
  
  /** Short human-readable summary (max 200 chars) */
  summary: string;
  
  /** Optional: Longer description */
  description?: string;
  
  /** Provenance: references without raw payload */
  provenance: EventProvenance;
  
  /** Optional: Additional structured metadata */
  metadata?: Record<string, any>;
}

/**
 * Paginated response for activity list
 */
export interface ActivityListResponse {
  items: ActivityEvent[];
  nextCursor?: string;
  totalCount?: number;
}

/**
 * Query parameters for listing activities
 */
export interface ActivityListParams {
  /** Filter by tenant */
  tenantId?: string;
  
  /** Filter by entity type */
  entityType?: EntityType | EntityType[];
  
  /** Filter by entity ID */
  entityId?: string;
  
  /** Filter by event type */
  eventType?: EventType | EventType[];
  
  /** Filter by actor type */
  actorType?: ActorType | ActorType[];
  
  /** Filter by importance */
  importance?: ImportanceLevel | ImportanceLevel[];
  
  /** Filter events after this timestamp (ISO 8601) */
  after?: string;
  
  /** Filter events before this timestamp (ISO 8601) */
  before?: string;
  
  /** Pagination cursor */
  cursor?: string;
  
  /** Limit number of results (default: 50, max: 100) */
  limit?: number;
}

/**
 * SSE subscription parameters
 */
export interface ActivitySubscriptionParams {
  /** Filter by tenant */
  tenantId?: string;
  
  /** Filter by entity type */
  entityType?: EntityType | EntityType[];
  
  /** Filter by entity ID */
  entityId?: string;
  
  /** Filter by actor type */
  actorType?: ActorType | ActorType[];
  
  /** Filter by importance */
  importance?: ImportanceLevel | ImportanceLevel[];
}

/**
 * SSE event callback
 */
export type ActivityEventCallback = (event: ActivityEvent) => void;
