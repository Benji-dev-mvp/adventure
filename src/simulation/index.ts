/**
 * Simulation Engine Module
 * 
 * Monte Carlo simulations, persona resistance modeling,
 * and strategy stress testing for predictive GTM planning.
 */

// Types
export * from './types';

// Core Engines
export { MonteCarloEngine, monteCarloEngine } from './MonteCarloEngine';
export { PersonaSimulator, personaSimulator, PERSONA_ARCHETYPES } from './PersonaSimulator';
export { 
  StrategyStressTester, 
  strategyStressTester,
  type StressTestScenario,
  type StressTestResult,
} from './StrategyStressTester';

// Convenience re-exports
export type {
  SimulationConfig,
  SimulationResult,
  SimulationScenario,
  SimulationOutcome,
  SimulationStatistics,
  SimulationInsight,
  DistributionStats,
  RiskMetrics,
  SensitivityResult,
  PersonaModel,
  ResistanceFactors,
  ResponseCurve,
  Strategy,
  Tactic,
  StrategyComparison,
} from './types';
