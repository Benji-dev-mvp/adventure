/**
 * Canonical AI Contracts
 * 
 * Frontend-only AI experience contracts that are:
 * - Explainable: Every AI decision has rationale and provenance
 * - Inspectable: Full before/after diffs and input visibility
 * - Reversible: All actions can be reverted with rollback support
 * - Governed: Risk levels, approval policies, and audit trails
 * 
 * Segment-aware: AI capabilities scale from Startup → Midmarket → Enterprise
 */

import { PlanTier } from '../demo/demoData';

// ============================================================================
// ENUMS & TYPES
// ============================================================================

export type AIRiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type AIDecisionStatus = 'proposed' | 'approved' | 'applied' | 'reverted' | 'blocked' | 'expired';
export type AIDecisionType = 
  | 'lead_qualification' 
  | 'campaign_optimization' 
  | 'outreach_timing' 
  | 'message_generation' 
  | 'lead_scoring'
  | 'playbook_execution'
  | 'resource_allocation'
  | 'priority_adjustment'
  | 'workflow_automation';

export type AIScope = 
  | 'single_lead' 
  | 'lead_batch' 
  | 'campaign' 
  | 'playbook' 
  | 'system_wide';

export type AIPriority = 'low' | 'medium' | 'high' | 'urgent';

export type AIActionType = 
  | 'send_email' 
  | 'schedule_meeting' 
  | 'update_status' 
  | 'assign_lead'
  | 'create_task'
  | 'enrich_data'
  | 'trigger_workflow'
  | 'adjust_score'
  | 'pause_campaign'
  | 'escalate';

export type AIAutonomyMode = 'off' | 'assist' | 'autopilot';

// ============================================================================
// AI DECISION CONTRACT
// ============================================================================

export interface AIDecisionInput {
  type: string;
  source: string;
  value: any;
  timestamp: string;
  confidence?: number;
}

export interface AIBeforeAfterDiff {
  field: string;
  before: any;
  after: any;
  impact: string;
}

export interface AIRecommendedAction {
  id: string;
  type: AIActionType;
  label: string;
  requiresApproval: boolean;
  quotaCost: number;
  executesOn: 'lead' | 'account' | 'campaign' | 'playbook';
  previewPayload?: any;
}

export interface AIProvenance {
  modelVersion: string;
  dataSourcesUsed: string[];
  computedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface AIDecision {
  id: string;
  timestamp: string;
  scope: AIScope;
  decisionType: AIDecisionType;
  entityRefs: {
    entityType: 'lead' | 'account' | 'campaign' | 'playbook';
    entityId: string;
    entityName: string;
  }[];
  segment: PlanTier;
  riskLevel: AIRiskLevel;
  confidence: number; // 0-100
  summary: string;
  rationale: string;
  inputs: AIDecisionInput[];
  beforeAfterDiff?: AIBeforeAfterDiff[];
  recommendedActions: AIRecommendedAction[];
  status: AIDecisionStatus;
  provenance: AIProvenance;
  // Governance
  requiresApproval: boolean;
  approvedBy?: string;
  approvedAt?: string;
  revertedBy?: string;
  revertedAt?: string;
  revertReason?: string;
  // Metrics
  expectedImpact?: {
    metric: string;
    value: number;
    unit: string;
  };
  actualImpact?: {
    metric: string;
    value: number;
    unit: string;
  };
}

// ============================================================================
// AI RECOMMENDATION CONTRACT
// ============================================================================

export interface AIRecommendation {
  id: string;
  title: string;
  priority: AIPriority;
  entityRefs: {
    entityType: 'lead' | 'account' | 'campaign' | 'playbook';
    entityId: string;
    entityName: string;
  }[];
  expectedImpact: {
    metric: string;
    improvement: string;
    confidence: number;
  };
  effort: 'low' | 'medium' | 'high';
  rationale: string;
  ctas: {
    label: string;
    action: string;
    primary: boolean;
  }[];
  category: 'optimization' | 'engagement' | 'conversion' | 'efficiency' | 'risk_mitigation';
  timestamp: string;
  expiresAt?: string;
  dismissedAt?: string;
  appliedAt?: string;
}

// ============================================================================
// AI ACTION CONTRACT
// ============================================================================

export interface AIAction {
  id: string;
  type: AIActionType;
  label: string;
  requiresApproval: boolean;
  quotaCost: number;
  executesOn: 'lead' | 'account' | 'campaign' | 'playbook';
  previewPayload: any;
  status: 'pending' | 'approved' | 'executed' | 'failed' | 'cancelled';
  createdAt: string;
  executedAt?: string;
  result?: {
    success: boolean;
    message: string;
    affectedEntityIds: string[];
  };
}

// ============================================================================
// AI INSIGHT CONTRACT (for real-time signals)
// ============================================================================

export interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'anomaly' | 'recommendation';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  entityRefs: {
    entityType: 'lead' | 'account' | 'campaign' | 'playbook';
    entityId: string;
    entityName: string;
  }[];
  timestamp: string;
  actionable: boolean;
  suggestedActions?: AIRecommendedAction[];
  dismissible: boolean;
}

// ============================================================================
// AI EXPLANATION (for Why? drawer)
// ============================================================================

export interface AIExplanation {
  decisionId: string;
  summary: string;
  factors: {
    factor: string;
    weight: number; // 0-100
    contribution: 'positive' | 'negative' | 'neutral';
    explanation: string;
  }[];
  dataUsed: {
    source: string;
    recordCount: number;
    timeRange?: string;
  }[];
  alternatives: {
    alternative: string;
    whyNotChosen: string;
  }[];
  confidenceBreakdown: {
    aspect: string;
    confidence: number;
    reason: string;
  }[];
}

// ============================================================================
// SERVICE RESPONSE TYPES
// ============================================================================

export interface AIDecisionListResponse {
  items: AIDecision[];
  total: number;
  nextCursor?: string;
}

export interface AIRecommendationListResponse {
  items: AIRecommendation[];
  total: number;
  nextCursor?: string;
}

export interface AIInsightListResponse {
  items: AIInsight[];
  total: number;
}

export interface AIDecisionListParams {
  segment?: PlanTier;
  status?: AIDecisionStatus[];
  riskLevel?: AIRiskLevel[];
  decisionType?: AIDecisionType[];
  entityId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  cursor?: string;
}

export interface AIRecommendationListParams {
  segment?: PlanTier;
  priority?: AIPriority[];
  category?: string;
  entityId?: string;
  limit?: number;
  cursor?: string;
}

export interface AIInsightListParams {
  segment?: PlanTier;
  type?: string[];
  severity?: string[];
  entityId?: string;
  limit?: number;
}
