/**
 * Simulation Engine Types
 *
 * Predictive modeling for pipeline outcomes, persona resistance,
 * and strategy stress testing.
 */

// === Simulation Core Types ===

export interface SimulationConfig {
  iterations: number;
  timeHorizon: number; // Days
  confidenceLevel: number; // 0.9 = 90% confidence interval
  seed?: number;
  parallelism: number;
}

export interface SimulationResult {
  id: string;
  config: SimulationConfig;
  scenario: SimulationScenario;
  outcomes: SimulationOutcome[];
  statistics: SimulationStatistics;
  insights: SimulationInsight[];
  runtime: number;
  timestamp: Date;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  parameters: ScenarioParameters;
  constraints: ScenarioConstraints;
}

export interface ScenarioParameters {
  pipeline: PipelineParameters;
  sequences: SequenceParameters[];
  agents: AgentParameters[];
  market: MarketParameters;
}

export interface PipelineParameters {
  accounts: number;
  averageDealSize: number;
  stageConversionRates: number[];
  averageCycleDays: number;
  variancePercent: number;
}

export interface SequenceParameters {
  id: string;
  name: string;
  steps: number;
  expectedReplyRate: number;
  expectedMeetingRate: number;
  cadenceDays: number;
  variance: number;
}

export interface AgentParameters {
  role: string;
  count: number;
  skillLevel: number;
  costPerTask: number;
  throughput: number;
}

export interface MarketParameters {
  seasonality: SeasonalityFactor[];
  competitorActivity: number;
  economicCondition: 'growth' | 'stable' | 'contraction';
  industryTrends: TrendFactor[];
}

export interface SeasonalityFactor {
  month: number;
  multiplier: number;
}

export interface TrendFactor {
  name: string;
  impact: number;
  probability: number;
}

export interface ScenarioConstraints {
  maxBudget: number;
  maxAgents: number;
  minQuality: number;
  deadlines: Date[];
}

// === Outcome Types ===

export interface SimulationOutcome {
  iteration: number;
  revenue: number;
  deals: number;
  meetings: number;
  replies: number;
  cost: number;
  velocity: number;
  timeline: TimelinePoint[];
  events: SimulationEvent[];
}

export interface TimelinePoint {
  day: number;
  cumulativeRevenue: number;
  activePipeline: number;
  conversionRate: number;
  agentUtilization: number;
}

export interface SimulationEvent {
  day: number;
  type: 'conversion' | 'loss' | 'stall' | 'revival' | 'anomaly';
  accountId: string;
  details: string;
  impact: number;
}

// === Statistics Types ===

export interface SimulationStatistics {
  revenue: DistributionStats;
  deals: DistributionStats;
  velocity: DistributionStats;
  roi: DistributionStats;
  riskMetrics: RiskMetrics;
  sensitivityAnalysis: SensitivityResult[];
}

export interface DistributionStats {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  percentiles: Record<number, number>; // p5, p25, p50, p75, p95
  confidenceInterval: { lower: number; upper: number };
  distribution: HistogramBin[];
}

export interface HistogramBin {
  min: number;
  max: number;
  count: number;
  frequency: number;
}

export interface RiskMetrics {
  valueAtRisk: number; // 95% VaR
  conditionalVaR: number; // Expected shortfall
  maxDrawdown: number;
  probabilityOfLoss: number;
  downsideDeviation: number;
}

export interface SensitivityResult {
  parameter: string;
  baseValue: number;
  impactPerPercent: number;
  elasticity: number;
  criticalThreshold?: number;
}

// === Insight Types ===

export interface SimulationInsight {
  type: 'opportunity' | 'risk' | 'optimization' | 'warning';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string;
  quantifiedImpact: number;
  confidence: number;
}

// === Persona Resistance Types ===

export interface PersonaModel {
  id: string;
  name: string;
  characteristics?: PersonaCharacteristics;
  resistanceProfile?: ResistanceFactors;
  responseCurve?: ResponseCurve;
  // Extended properties used by PersonaSimulator
  decisionStyle?: 'analytical' | 'driver' | 'expressive' | 'amiable';
  buyingPower?: 'decision-maker' | 'influencer' | 'end-user';
  baseResistance?: Record<string, number>;
  responseCurves?: ResponseCurveExtended[];
  contextualModifiers?: ContextualModifier[];
}

export interface PersonaCharacteristics {
  decisionSpeed: number; // 0-1, higher = faster
  dataOrientation: number;
  riskAversion: number;
  socialProofSensitivity: number;
  urgencySensitivity: number;
  priceElasticity: number;
}

export interface ResistanceFactors {
  initialSkepticism: number;
  objectionProbabilities: Record<string, number>;
  fatigueRate: number;
  recoveryRate: number;
  channelPreferences: Record<string, number>;
}

export interface ResponseCurve {
  touchpoints: number[];
  probabilities: number[];
  diminishingReturns: number;
  optimalCadence: number;
}

export interface ResponseCurveExtended {
  touchpoint: number;
  method: 'email' | 'phone' | 'linkedin' | 'ad' | 'content';
  baseResponseRate: number;
  degradationRate: number;
  saturationPoint: number;
  recoveryDays: number;
}

export interface ContextualModifier {
  context: string;
  resistanceMultiplier: number;
}

// === Strategy Types ===

export interface Strategy {
  id: string;
  name: string;
  description: string;
  tactics: Tactic[];
  resourceAllocation: ResourceAllocation;
  expectedOutcomes: ExpectedOutcome;
}

export interface Tactic {
  id: string;
  type: 'sequence' | 'targeting' | 'messaging' | 'channel' | 'timing';
  parameters: Record<string, unknown>;
  cost: number;
  expectedLift: number;
  approach?: string;
}

export interface ResourceAllocation {
  budget: number;
  agentHours: number;
  sequenceSlots: number;
  channelDistribution: Record<string, number>;
}

export interface ExpectedOutcome {
  revenue: { min: number; expected: number; max: number };
  roi: { min: number; expected: number; max: number };
  timeline: number;
  confidence: number;
}

// === Comparison Types ===

export interface StrategyComparison {
  strategies: Strategy[] | StrategyWithScore[];
  results: Map<string, SimulationResult>;
  winner: string | StrategyWinner;
  analysis: ComparisonAnalysis;
  tradeoffs?: Tradeoff[];
  recommendations?: StrategyRecommendation[];
}

export interface StrategyWithScore {
  strategy: Strategy;
  score: number;
  strengths: string[];
  weaknesses: string[];
  riskProfile: { level: 'low' | 'medium' | 'high'; factors: string[] };
}

export interface StrategyWinner {
  strategyId: string;
  reason: string;
  margin: number;
}

export interface StrategyRecommendation {
  action: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  impact?: string;
  effort: 'low' | 'medium' | 'high' | string;
  expectedImprovement?: number;
  timeline?: string;
}

export interface ComparisonAnalysis {
  revenueComparison: Array<{ strategyId: string; revenue: number; rank: number }>;
  riskComparison: Array<{ strategyId: string; risk: number; rank: number }>;
  efficiencyComparison: Array<{ strategyId: string; efficiency: number; rank: number }>;
  tradeoffs: Tradeoff[];
  recommendation: string;
  // Extended properties for stress tester
  summary?: string;
  keyDifferences?: string[];
  contextualAdvice?: string;
}

export interface Tradeoff {
  strategy1: string;
  strategy2: string;
  dimension: string;
  difference: number;
  significance: 'high' | 'medium' | 'low';
  // Extended properties for stress tester
  dimension1?: string;
  dimension2?: string;
  strategy1Impact?: string;
  strategy2Impact?: string;
  recommendation?: string;
}
