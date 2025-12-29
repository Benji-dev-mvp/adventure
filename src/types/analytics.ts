/**
 * Analytics & Reports Types
 * Types for predictive simulation, board deck generation, and intelligence reports
 */

// ============================================
// Board Deck Generator Types
// ============================================

export type SlideType = 
  | 'title'
  | 'executive_summary'
  | 'pipeline_overview'
  | 'performance_metrics'
  | 'roi_analysis'
  | 'top_campaigns'
  | 'messaging_insights'
  | 'time_savings'
  | 'recommendations'
  | 'appendix';

export interface BoardDeck {
  id: string;
  name: string;
  period: { start: Date; end: Date };
  slides: DeckSlide[];
  theme: DeckTheme;
  generatedAt: Date;
  generatedBy: string;
  status: 'generating' | 'ready' | 'error';
  exportFormats: ('pdf' | 'pptx' | 'google_slides')[];
}

export interface DeckSlide {
  id: string;
  type: SlideType;
  title: string;
  subtitle?: string;
  content: SlideContent;
  notes?: string;
  order: number;
  isIncluded: boolean;
}

export interface SlideContent {
  // Title slide
  headline?: string;
  subheadline?: string;
  date?: string;
  presenter?: string;
  
  // Metric slides
  metrics?: DeckMetric[];
  charts?: DeckChart[];
  
  // Text content
  bullets?: string[];
  highlights?: Highlight[];
  
  // Table content
  table?: DeckTable;
  
  // Comparison
  comparison?: DeckComparison;
  
  // Custom
  customHtml?: string;
}

export interface DeckMetric {
  id: string;
  label: string;
  value: string | number;
  previousValue?: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  format?: 'number' | 'currency' | 'percentage' | 'duration';
  icon?: string;
  color?: string;
}

export interface DeckChart {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'donut' | 'area' | 'funnel';
  title: string;
  data: ChartDataPoint[];
  config: ChartConfig;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  category?: string;
  color?: string;
}

export interface ChartConfig {
  xAxis?: { label: string; format?: string };
  yAxis?: { label: string; format?: string };
  legend?: boolean;
  stacked?: boolean;
  colors?: string[];
}

export interface Highlight {
  value: string;
  label: string;
  color: 'green' | 'blue' | 'amber' | 'red';
  icon?: string;
}

export interface DeckTable {
  headers: string[];
  rows: (string | number)[][];
  highlights?: { row: number; col: number; color: string }[];
}

export interface DeckComparison {
  before: { label: string; value: string | number };
  after: { label: string; value: string | number };
  improvement: string;
  context?: string;
}

export interface DeckTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoUrl?: string;
  backgroundStyle: 'solid' | 'gradient' | 'pattern';
}

// ============================================
// Report Templates Types
// ============================================

export type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom';

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'executive' | 'operational' | 'campaign' | 'team' | 'custom';
  sections: ReportSection[];
  filters: ReportFilter[];
  schedule?: ReportSchedule;
  recipients?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportSection {
  id: string;
  title: string;
  type: 'metrics' | 'chart' | 'table' | 'text' | 'insights';
  config: Record<string, any>;
  order: number;
  isCollapsible: boolean;
}

export interface ReportFilter {
  id: string;
  field: string;
  label: string;
  type: 'date_range' | 'select' | 'multi_select' | 'search';
  options?: { value: string; label: string }[];
  defaultValue?: any;
}

export interface ReportSchedule {
  frequency: ReportFrequency;
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  timezone: string;
  isActive: boolean;
}

// ============================================
// Predictive Simulation Types
// ============================================

export type SimulationType = 'campaign' | 'strategy' | 'resource' | 'market';

export interface Simulation {
  id: string;
  name: string;
  type: SimulationType;
  scenarios: SimulationScenario[];
  variables: SimulationVariable[];
  constraints: SimulationConstraint[];
  results?: SimulationResults;
  status: 'configuring' | 'running' | 'completed' | 'error';
  createdAt: Date;
  completedAt?: Date;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  variables: Record<string, number>;
  isBaseline: boolean;
  color: string;
}

export interface SimulationVariable {
  id: string;
  name: string;
  label: string;
  type: 'continuous' | 'discrete' | 'categorical';
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  defaultValue: number | string;
  unit?: string;
  description?: string;
}

export interface SimulationConstraint {
  id: string;
  variable: string;
  type: 'min' | 'max' | 'equals' | 'range';
  value: number | [number, number];
  description: string;
}

export interface SimulationResults {
  scenarios: ScenarioResult[];
  comparison: ScenarioComparison;
  insights: SimulationInsight[];
  confidence: number;
  methodology: string;
  iterations: number;
}

export interface ScenarioResult {
  scenarioId: string;
  scenarioName: string;
  predictions: PredictionMetric[];
  distribution: DistributionData;
  riskFactors: RiskFactor[];
}

export interface PredictionMetric {
  name: string;
  value: number;
  unit: string;
  confidenceInterval: { low: number; high: number };
  percentile: { p10: number; p50: number; p90: number };
}

export interface DistributionData {
  buckets: { label: string; probability: number }[];
  mean: number;
  median: number;
  stdDev: number;
}

export interface RiskFactor {
  name: string;
  impact: 'high' | 'medium' | 'low';
  probability: number;
  mitigation: string;
  sensitivity: number;
}

export interface ScenarioComparison {
  bestScenario: string;
  worstScenario: string;
  metrics: ComparisonMetric[];
  tradeoffs: Tradeoff[];
  recommendation: string;
}

export interface ComparisonMetric {
  name: string;
  scenarios: { scenarioId: string; value: number; rank: number }[];
  weight: number;
}

export interface Tradeoff {
  description: string;
  scenarios: string[];
  type: 'cost_benefit' | 'risk_reward' | 'speed_quality';
}

export interface SimulationInsight {
  id: string;
  type: 'finding' | 'recommendation' | 'warning';
  title: string;
  description: string;
  evidence: string;
  actionable: boolean;
  suggestedAction?: string;
}

// ============================================
// Monte Carlo Simulation Types
// ============================================

export interface MonteCarloConfig {
  iterations: number;
  confidenceLevel: number;
  randomSeed?: number;
  distributions: VariableDistribution[];
}

export interface VariableDistribution {
  variable: string;
  type: 'normal' | 'uniform' | 'triangular' | 'beta' | 'custom';
  parameters: Record<string, number>;
}

export interface MonteCarloResults {
  iterations: number;
  convergence: boolean;
  outcomes: MonteCarloOutcome[];
  sensitivity: SensitivityAnalysis[];
  correlations: CorrelationMatrix;
}

export interface MonteCarloOutcome {
  metric: string;
  mean: number;
  median: number;
  stdDev: number;
  percentiles: Record<number, number>;
  histogram: { bucket: string; count: number }[];
}

export interface SensitivityAnalysis {
  variable: string;
  tornadoImpact: { low: number; high: number };
  elasticity: number;
  rank: number;
}

export interface CorrelationMatrix {
  variables: string[];
  values: number[][];
}
