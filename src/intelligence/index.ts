/**
 * Intelligence Grid Module
 * 
 * Federated learning, anonymized benchmarks,
 * and predictive analytics for collective intelligence.
 */

// Types
export * from './types';

// Core Systems
export { 
  FederatedLearningManager, 
  federatedLearning,
  type FederatedEvent,
} from './FederatedLearning';

export { 
  BenchmarkEngine, 
  benchmarkEngine,
} from './BenchmarkEngine';

export { 
  PredictiveEngine, 
  predictiveEngine,
} from './PredictiveEngine';

// Convenience re-exports
export type {
  FederatedModel,
  FederatedRound,
  FederatedParticipant,
  ModelType,
  ModelPerformance,
  Benchmark,
  BenchmarkCategory,
  BenchmarkMetric,
  BenchmarkSubmission,
  BenchmarkComparison,
  Prediction,
  PredictionType,
  PredictionRequest,
  TrendAnalysis,
  IntelligenceInsight,
  CollectivePattern,
} from './types';
