/**
 * AI Memory Layer - Unified Export
 *
 * Long-term memory for pattern recognition, behavioral analysis,
 * and self-improving sequences through reinforcement learning.
 */

export * from './types';
export { patternIndex, default as PatternIndex } from './patternIndex';
export {
  behavioralFingerprinter,
  default as BehavioralFingerprinter,
} from './behavioralFingerprint';
export { reinforcementEngine, default as ReinforcementEngine } from './reinforcementEngine';

// Re-export key types for convenience
export type {
  MessagePattern,
  BehavioralFingerprint,
  PersonaType,
  ICPSignal,
  PolicyState,
} from './types';
