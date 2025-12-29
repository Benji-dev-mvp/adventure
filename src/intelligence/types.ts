/**
 * Intelligence Grid Types
 * 
 * Federated learning, anonymized benchmarks,
 * and predictive analytics for collective intelligence.
 */

// === Federated Learning ===

export interface FederatedModel {
  id: string;
  name: string;
  type: ModelType;
  version: string;
  architecture: ModelArchitecture;
  weights: ModelWeights;
  performance: ModelPerformance;
  trainingConfig: TrainingConfig;
  lastUpdated: Date;
  contributors: number;
}

export type ModelType = 
  | 'reply-prediction'
  | 'meeting-conversion'
  | 'persona-classification'
  | 'sequence-optimization'
  | 'timing-prediction'
  | 'content-scoring'
  | 'intent-detection'
  | 'custom';

export interface ModelArchitecture {
  layers: number;
  neurons: number[];
  activations: string[];
  regularization: string;
  optimizer: string;
}

export interface ModelWeights {
  format: 'dense' | 'sparse' | 'quantized';
  size: number;
  checksum: string;
  compressed: boolean;
  data?: Float32Array | number[];
}

export interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  latencyMs: number;
  lastEvaluated: Date;
  evaluationSet: string;
}

export interface TrainingConfig {
  batchSize: number;
  epochs: number;
  learningRate: number;
  momentum: number;
  clipNorm: number;
  differentialPrivacy: DifferentialPrivacyConfig;
}

export interface DifferentialPrivacyConfig {
  enabled: boolean;
  epsilon: number;
  delta: number;
  noiseMultiplier: number;
  maxGradNorm: number;
}

// === Federated Learning Protocol ===

export interface FederatedRound {
  id: string;
  modelId: string;
  roundNumber: number;
  status: 'recruiting' | 'training' | 'aggregating' | 'completed' | 'failed';
  participants: FederatedParticipant[];
  config: RoundConfig;
  results?: AggregationResult;
  startedAt: Date;
  completedAt?: Date;
}

export interface FederatedParticipant {
  id: string;
  organizationId: string;
  status: 'invited' | 'accepted' | 'training' | 'submitted' | 'rejected';
  dataSize: number;
  contribution: number;
  localMetrics?: ModelPerformance;
  submittedAt?: Date;
}

export interface RoundConfig {
  minParticipants: number;
  maxParticipants: number;
  trainingDeadline: Date;
  selectionStrategy: 'random' | 'weighted' | 'representative';
  aggregationMethod: 'fedavg' | 'fedprox' | 'scaffold' | 'secure-aggregation';
}

export interface AggregationResult {
  participantCount: number;
  totalDataSize: number;
  globalMetrics: ModelPerformance;
  improvement: number;
  convergenceRate: number;
  privacyBudgetUsed: number;
}

// === Anonymized Benchmarks ===

export interface Benchmark {
  id: string;
  name: string;
  category: BenchmarkCategory;
  metrics: BenchmarkMetric[];
  participants: number;
  lastUpdated: Date;
  visibility: 'public' | 'industry' | 'private';
}

export type BenchmarkCategory = 
  | 'outbound-performance'
  | 'sequence-effectiveness'
  | 'reply-rates'
  | 'meeting-conversion'
  | 'pipeline-velocity'
  | 'agent-efficiency'
  | 'roi-metrics';

export interface BenchmarkMetric {
  name: string;
  description: string;
  aggregation: 'mean' | 'median' | 'percentile' | 'distribution';
  unit: string;
  distribution: DistributionData;
}

export interface DistributionData {
  min: number;
  max: number;
  mean: number;
  median: number;
  stdDev: number;
  percentiles: Record<number, number>;
  histogram: Array<{ bucket: string; count: number }>;
  sampleSize: number;
}

export interface BenchmarkSubmission {
  benchmarkId: string;
  organizationId: string;
  metrics: Record<string, number>;
  context: BenchmarkContext;
  submittedAt: Date;
  verified: boolean;
}

export interface BenchmarkContext {
  industry: string;
  companySize: 'startup' | 'smb' | 'mid-market' | 'enterprise';
  region: string;
  salesMotion: 'plg' | 'inbound' | 'outbound' | 'hybrid';
  averageDealSize: number;
  salesCycleLength: number;
}

export interface BenchmarkComparison {
  benchmarkId: string;
  yourMetrics: Record<string, number>;
  benchmarkMetrics: Record<string, DistributionData>;
  percentileRanks: Record<string, number>;
  insights: BenchmarkInsight[];
  recommendations: BenchmarkRecommendation[];
}

export interface BenchmarkInsight {
  metric: string;
  type: 'outperforming' | 'average' | 'underperforming';
  percentile: number;
  gap: number;
  description: string;
}

export interface BenchmarkRecommendation {
  priority: 'high' | 'medium' | 'low';
  metric: string;
  action: string;
  expectedImprovement: number;
  benchmarkTarget: number;
}

// === Predictive Analytics ===

export interface Prediction {
  id: string;
  type: PredictionType;
  target: string;
  value: number;
  confidence: number;
  range: { low: number; high: number };
  factors: PredictionFactor[];
  timestamp: Date;
  expiresAt: Date;
}

export type PredictionType = 
  | 'reply-probability'
  | 'meeting-likelihood'
  | 'deal-close-probability'
  | 'optimal-send-time'
  | 'sequence-completion'
  | 'revenue-forecast'
  | 'churn-risk'
  | 'engagement-score';

export interface PredictionFactor {
  name: string;
  importance: number;
  direction: 'positive' | 'negative';
  value: any;
  contribution: number;
}

export interface PredictionRequest {
  type: PredictionType;
  context: PredictionContext;
  includeFactors: boolean;
  confidenceThreshold?: number;
}

export interface PredictionContext {
  accountId?: string;
  contactId?: string;
  sequenceId?: string;
  touchpoint?: number;
  channel?: string;
  historicalData?: Record<string, any>;
}

// === Trend Analysis ===

export interface TrendAnalysis {
  id: string;
  metric: string;
  period: { start: Date; end: Date };
  trend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  changePercent: number;
  forecast: TrendForecast;
  anomalies: TrendAnomaly[];
  seasonality: SeasonalityPattern[];
}

export interface TrendForecast {
  nextPeriod: number;
  nextMonth: number;
  nextQuarter: number;
  confidence: number;
  methodology: string;
}

export interface TrendAnomaly {
  date: Date;
  value: number;
  expected: number;
  deviation: number;
  type: 'spike' | 'drop' | 'shift';
  explanation?: string;
}

export interface SeasonalityPattern {
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  strength: number;
  peaks: number[];
  troughs: number[];
}

// === Intelligence Insights ===

export interface IntelligenceInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  dataPoints: number;
  evidence: InsightEvidence[];
  recommendations: InsightRecommendation[];
  createdAt: Date;
  expiresAt: Date;
}

export type InsightType = 
  | 'market-shift'
  | 'competitor-activity'
  | 'persona-evolution'
  | 'channel-performance'
  | 'timing-optimization'
  | 'content-effectiveness'
  | 'risk-warning'
  | 'opportunity';

export interface InsightEvidence {
  source: string;
  metric: string;
  value: any;
  significance: number;
}

export interface InsightRecommendation {
  action: string;
  impact: number;
  effort: 'low' | 'medium' | 'high';
  deadline?: Date;
}

// === Collective Intelligence ===

export interface CollectivePattern {
  id: string;
  pattern: string;
  category: string;
  frequency: number;
  effectiveness: number;
  confidence: number;
  variants: PatternVariant[];
  context: PatternContext;
  discoveredAt: Date;
}

export interface PatternVariant {
  id: string;
  description: string;
  effectiveness: number;
  usageCount: number;
}

export interface PatternContext {
  industries: string[];
  companySizes: string[];
  personas: string[];
  channels: string[];
}

export interface IntelligenceQuery {
  type: 'pattern' | 'benchmark' | 'prediction' | 'insight';
  filters: Record<string, any>;
  includeConfidenceIntervals: boolean;
  limit?: number;
}

export interface IntelligenceResponse {
  query: IntelligenceQuery;
  results: Array<CollectivePattern | Benchmark | Prediction | IntelligenceInsight>;
  totalCount: number;
  processingTime: number;
  timestamp: Date;
}
