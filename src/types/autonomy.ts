/**
 * Autonomy System Types
 * Types for the self-driving autonomous revenue engine
 */

// ============================================
// Strategy Planner Types
// ============================================

export type StrategyGoalType = 'meetings' | 'pipeline' | 'revenue' | 'engagement' | 'awareness';
export type StrategyStatus = 'planning' | 'active' | 'paused' | 'completed' | 'failed';
export type ChannelMix = 'email' | 'linkedin' | 'phone' | 'sms' | 'multi-channel';

export interface ICP {
  id: string;
  name: string;
  industry: string[];
  companySize: { min: number; max: number };
  geography: string[];
  technologies: string[];
  signals: string[];
  score: number;
}

export interface Persona {
  id: string;
  name: string;
  titles: string[];
  seniority: 'c-level' | 'vp' | 'director' | 'manager' | 'individual';
  department: string;
  painPoints: string[];
  motivations: string[];
  communicationStyle: 'formal' | 'casual' | 'technical' | 'executive';
}

export interface StrategyPlan {
  id: string;
  name: string;
  goalType: StrategyGoalType;
  targetMetric: number;
  currentMetric: number;
  icp: ICP;
  personas: Persona[];
  channelMix: ChannelMix[];
  status: StrategyStatus;
  confidence: number; // 0-100
  reasoning: string;
  createdAt: Date;
  updatedAt: Date;
  aiRecommendations: AIRecommendation[];
}

export interface AIRecommendation {
  id: string;
  type: 'channel' | 'timing' | 'messaging' | 'targeting' | 'budget';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  action: () => void;
}

// ============================================
// Auto-Experimentation Types
// ============================================

export type ExperimentType =
  | 'subject_line'
  | 'cta'
  | 'send_time'
  | 'persona_angle'
  | 'channel'
  | 'sequence_length';
export type ExperimentStatus = 'draft' | 'running' | 'paused' | 'completed' | 'inconclusive';

export interface ExperimentVariant {
  id: string;
  name: string;
  content: string | Record<string, any>;
  traffic: number; // percentage 0-100
  metrics: VariantMetrics;
  isControl: boolean;
  isWinner: boolean;
}

export interface VariantMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  replied: number;
  meetings: number;
  conversionRate: number;
  statisticalSignificance: number;
}

export interface Experiment {
  id: string;
  name: string;
  type: ExperimentType;
  hypothesis: string;
  status: ExperimentStatus;
  variants: ExperimentVariant[];
  minSampleSize: number;
  currentSampleSize: number;
  confidenceLevel: number; // typically 95
  startDate: Date;
  endDate?: Date;
  winner?: string;
  learnings: string[];
  autoApply: boolean;
}

export interface ExperimentEngine {
  activeExperiments: Experiment[];
  completedExperiments: Experiment[];
  suggestedExperiments: Experiment[];
  totalLearnings: number;
  winRate: number;
}

// ============================================
// Closed-Loop Learning Types
// ============================================

export type OutcomeType =
  | 'positive_reply'
  | 'negative_reply'
  | 'meeting_booked'
  | 'no_response'
  | 'unsubscribe'
  | 'bounce';

export interface OutcomeSignal {
  id: string;
  leadId: string;
  campaignId: string;
  stepId: string;
  outcomeType: OutcomeType;
  sentiment?: number; // -1 to 1
  replyContent?: string;
  timestamp: Date;
  features: Record<string, any>;
}

export interface LearningCycle {
  id: string;
  cycleNumber: number;
  startDate: Date;
  endDate: Date;
  outcomesProcessed: number;
  modelUpdates: ModelUpdate[];
  performanceImprovement: number;
  topInsights: string[];
}

export interface ModelUpdate {
  id: string;
  component: 'messaging' | 'timing' | 'targeting' | 'scoring';
  description: string;
  beforeMetric: number;
  afterMetric: number;
  confidence: number;
  appliedAt: Date;
}

export interface ClosedLoopSystem {
  isActive: boolean;
  currentCycle: LearningCycle;
  historicalCycles: LearningCycle[];
  totalImprovements: number;
  modelVersion: string;
  nextUpdateScheduled: Date;
}

// ============================================
// Autopilot State Types
// ============================================

export type AutopilotMode = 'full_auto' | 'supervised' | 'suggestion_only' | 'manual';

export interface AutopilotState {
  mode: AutopilotMode;
  isActive: boolean;
  currentStrategy: StrategyPlan | null;
  activeExperiments: Experiment[];
  learningSystem: ClosedLoopSystem;
  recentDecisions: AutopilotDecision[];
  interventionsAvailable: Intervention[];
  healthScore: number;
  lastActivityAt: Date;
}

export interface AutopilotDecision {
  id: string;
  type:
    | 'strategy_change'
    | 'experiment_launch'
    | 'experiment_end'
    | 'model_update'
    | 'pacing_adjustment';
  description: string;
  reasoning: string;
  impact: string;
  timestamp: Date;
  wasOverridden: boolean;
  overrideReason?: string;
}

export interface Intervention {
  id: string;
  type: 'pause' | 'resume' | 'adjust' | 'override' | 'rollback';
  target: 'strategy' | 'experiment' | 'model' | 'pacing';
  targetId: string;
  label: string;
  description: string;
  severity: 'safe' | 'caution' | 'risky';
}

// ============================================
// Pipeline Commitment Types
// ============================================

export interface PipelineCommitment {
  id: string;
  name: string;
  targetMeetings: number;
  targetPipeline: number;
  targetRevenue: number;
  timeframe: 'weekly' | 'monthly' | 'quarterly';
  startDate: Date;
  endDate: Date;
  segment: string;
  icp: ICP;
  status: 'on_track' | 'at_risk' | 'behind' | 'ahead';
}

export interface CommitmentProgress {
  commitment: PipelineCommitment;
  currentMeetings: number;
  currentPipeline: number;
  currentRevenue: number;
  burnRate: number; // leads per day
  projectedCompletion: Date;
  pacingStatus: 'ahead' | 'on_track' | 'behind' | 'critical';
  daysRemaining: number;
  adjustmentsNeeded: PacingAdjustment[];
}

export interface PacingAdjustment {
  type: 'increase_volume' | 'expand_icp' | 'add_channel' | 'improve_conversion' | 'extend_timeline';
  description: string;
  impact: number;
  effort: 'low' | 'medium' | 'high';
  autoApplicable: boolean;
}

export interface ForecastModel {
  commitmentId: string;
  projectedMeetings: number;
  projectedPipeline: number;
  confidence: number;
  scenarios: ForecastScenario[];
  riskFactors: RiskFactor[];
}

export interface ForecastScenario {
  name: 'pessimistic' | 'base' | 'optimistic';
  meetings: number;
  pipeline: number;
  probability: number;
}

export interface RiskFactor {
  name: string;
  impact: 'high' | 'medium' | 'low';
  likelihood: number;
  mitigation: string;
}
