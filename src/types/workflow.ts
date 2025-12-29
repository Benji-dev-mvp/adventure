/**
 * Workflow OS Types
 * Types for visual orchestration canvas and real-time execution
 */

// ============================================
// Orchestrator Canvas Types
// ============================================

export type BlockType =
  | 'source'
  | 'score'
  | 'qualify'
  | 'research'
  | 'enrich'
  | 'generate_message'
  | 'send_email'
  | 'send_linkedin'
  | 'send_sms'
  | 'call'
  | 'wait'
  | 'condition'
  | 'branch'
  | 'merge'
  | 'escalate_rep'
  | 'escalate_ai'
  | 'convert_crm'
  | 'webhook'
  | 'custom';

export type SourceType = 'database' | 'csv' | 'webhook' | 'api' | 'crm' | 'manual';
export type ConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'greater_than'
  | 'less_than'
  | 'in'
  | 'not_in'
  | 'exists'
  | 'not_exists';

export interface WorkflowBlock {
  id: string;
  type: BlockType;
  label: string;
  description?: string;
  position: { x: number; y: number };
  config: BlockConfig;
  inputs: BlockPort[];
  outputs: BlockPort[];
  status: BlockStatus;
  metrics?: BlockMetrics;
  errors?: BlockError[];
}

export interface BlockPort {
  id: string;
  name: string;
  type: 'default' | 'success' | 'failure' | 'condition_true' | 'condition_false' | 'timeout';
  connected: boolean;
}

export type BlockStatus = 'idle' | 'running' | 'completed' | 'failed' | 'paused' | 'waiting';

export interface BlockMetrics {
  processed: number;
  succeeded: number;
  failed: number;
  avgDuration: number;
  lastRun?: Date;
}

export interface BlockError {
  code: string;
  message: string;
  timestamp: Date;
  recoverable: boolean;
}

// Block-specific configurations
export interface BlockConfig {
  // Source blocks
  sourceType?: SourceType;
  sourceConfig?: SourceConfig;

  // Score/Qualify blocks
  scoringModel?: string;
  qualificationCriteria?: QualificationCriteria[];

  // Research/Enrich blocks
  enrichmentProviders?: string[];
  researchDepth?: 'basic' | 'standard' | 'deep';

  // Message generation
  templateId?: string;
  personalizationLevel?: 'none' | 'basic' | 'advanced' | 'hyper';
  aiModel?: string;

  // Send blocks
  channel?: 'email' | 'linkedin' | 'sms' | 'phone';
  sendConfig?: SendConfig;

  // Wait blocks
  waitDuration?: number;
  waitUnit?: 'minutes' | 'hours' | 'days' | 'business_days';
  waitUntil?: 'specific_time' | 'event' | 'condition';

  // Condition blocks
  conditions?: Condition[];

  // Escalation blocks
  escalationTarget?: 'rep' | 'manager' | 'ai_agent';
  escalationReason?: string;

  // CRM blocks
  crmAction?: 'create_contact' | 'create_deal' | 'update_stage' | 'add_note';
  crmMapping?: Record<string, string>;

  // Custom/Webhook
  webhookUrl?: string;
  customCode?: string;
}

export interface SourceConfig {
  // Database source
  query?: string;
  filters?: Record<string, any>;

  // CSV source
  fileId?: string;
  columnMapping?: Record<string, string>;

  // Webhook source
  webhookSecret?: string;

  // API source
  apiEndpoint?: string;
  apiAuth?: { type: 'bearer' | 'api_key' | 'oauth'; credentials: string };
}

export interface QualificationCriteria {
  field: string;
  operator: ConditionOperator;
  value: any;
  weight: number;
  required: boolean;
}

export interface SendConfig {
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;
  trackOpens?: boolean;
  trackClicks?: boolean;
  scheduleType?: 'immediate' | 'optimal' | 'scheduled';
  scheduledTime?: Date;
  timezone?: string;
}

export interface Condition {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: any;
  logicalOperator?: 'and' | 'or';
}

// ============================================
// Workflow Connection Types
// ============================================

export interface WorkflowConnection {
  id: string;
  sourceBlockId: string;
  sourcePortId: string;
  targetBlockId: string;
  targetPortId: string;
  label?: string;
  animated?: boolean;
  style?: ConnectionStyle;
}

export interface ConnectionStyle {
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

// ============================================
// Complete Workflow Types
// ============================================

export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'archived' | 'error';

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  blocks: WorkflowBlock[];
  connections: WorkflowConnection[];
  status: WorkflowStatus;
  version: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  settings: WorkflowSettings;
  metrics: WorkflowMetrics;
}

export interface WorkflowSettings {
  timezone: string;
  businessHoursOnly: boolean;
  businessHours: { start: string; end: string; days: number[] };
  maxConcurrency: number;
  retryPolicy: RetryPolicy;
  notifications: NotificationSettings;
}

export interface RetryPolicy {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
}

export interface NotificationSettings {
  onFailure: boolean;
  onCompletion: boolean;
  onThreshold: boolean;
  thresholdValue?: number;
  channels: ('email' | 'slack' | 'webhook')[];
}

export interface WorkflowMetrics {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  averageDuration: number;
  leadsProcessed: number;
  conversions: number;
  lastRunAt?: Date;
}

// ============================================
// Real-Time Execution Timeline Types
// ============================================

export type ExecutionEventType =
  | 'workflow_started'
  | 'workflow_completed'
  | 'workflow_failed'
  | 'block_started'
  | 'block_completed'
  | 'block_failed'
  | 'email_sent'
  | 'email_opened'
  | 'email_clicked'
  | 'reply_received'
  | 'meeting_booked'
  | 'ai_decision'
  | 'experiment_started'
  | 'experiment_winner'
  | 'escalation'
  | 'manual_intervention'
  | 'system_error'
  | 'rate_limit'
  | 'anomaly_detected';

export type EventSeverity = 'info' | 'success' | 'warning' | 'error' | 'critical';

export interface ExecutionEvent {
  id: string;
  type: ExecutionEventType;
  severity: EventSeverity;
  timestamp: Date;
  workflowId?: string;
  workflowName?: string;
  blockId?: string;
  blockName?: string;
  leadId?: string;
  leadName?: string;
  campaignId?: string;
  campaignName?: string;
  description: string;
  details?: Record<string, any>;
  duration?: number;
  isAnomaly?: boolean;
  anomalyScore?: number;
}

export interface ExecutionTimeline {
  events: ExecutionEvent[];
  filters: TimelineFilters;
  stats: TimelineStats;
  isLive: boolean;
  lastUpdated: Date;
}

export interface TimelineFilters {
  eventTypes?: ExecutionEventType[];
  severities?: EventSeverity[];
  workflowIds?: string[];
  dateRange?: { start: Date; end: Date };
  searchQuery?: string;
  showAnomaliesOnly?: boolean;
}

export interface TimelineStats {
  totalEvents: number;
  eventsByType: Record<ExecutionEventType, number>;
  eventsBySeverity: Record<EventSeverity, number>;
  anomalyCount: number;
  avgEventsPerHour: number;
}

// ============================================
// Workflow Templates Types
// ============================================

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'outbound' | 'inbound' | 'nurture' | 'reactivation' | 'abm' | 'custom';
  thumbnail?: string;
  blocks: WorkflowBlock[];
  connections: WorkflowConnection[];
  estimatedResults: {
    meetings: number;
    timeToResult: string;
    complexity: 'simple' | 'moderate' | 'advanced';
  };
  author: string;
  downloads: number;
  rating: number;
  tags: string[];
}
