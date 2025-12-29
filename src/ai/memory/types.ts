/**
 * AI Memory Layer - Type Definitions
 * Long-term memory for pattern recognition, behavioral analysis, and adaptive learning
 */

// Pattern Recognition Types
export interface MessagePattern {
  id: string;
  signature: string;
  tokens: string[];
  emotionalTone: EmotionalTone;
  persuasionTechnique: PersuasionTechnique;
  successRate: number;
  usageCount: number;
  contextTags: string[];
  createdAt: Date;
  lastUsed: Date;
  decayFactor: number;
}

export type EmotionalTone =
  | 'authoritative'
  | 'empathetic'
  | 'urgent'
  | 'curious'
  | 'collaborative'
  | 'provocative'
  | 'analytical'
  | 'visionary';

export type PersuasionTechnique =
  | 'social-proof'
  | 'scarcity'
  | 'authority'
  | 'reciprocity'
  | 'commitment'
  | 'liking'
  | 'unity'
  | 'contrast'
  | 'storytelling';

// Behavioral Fingerprinting
export interface BehavioralFingerprint {
  id: string;
  accountId: string;
  personaType: PersonaType;
  communicationStyle: CommunicationStyle;
  decisionPattern: DecisionPattern;
  engagementRhythm: EngagementRhythm;
  resistanceProfile: ResistanceProfile;
  influenceVector: number[];
  confidence: number;
  observations: BehaviorObservation[];
  lastUpdated: Date;
}

export type PersonaType =
  | 'analytical-skeptic'
  | 'visionary-champion'
  | 'pragmatic-evaluator'
  | 'relationship-builder'
  | 'time-pressed-executive'
  | 'technical-validator'
  | 'political-navigator'
  | 'innovation-seeker';

export interface CommunicationStyle {
  preferredLength: 'brief' | 'moderate' | 'detailed';
  formalityLevel: number; // 0-1
  dataOrientation: number; // 0-1, how much they value data/proof
  emotionalResonance: number; // 0-1
  responseLatency: 'fast' | 'moderate' | 'slow';
  preferredChannel: 'email' | 'linkedin' | 'phone' | 'video';
}

export interface DecisionPattern {
  averageCycleLength: number; // days
  stakeholderCount: number;
  requiresConsensus: boolean;
  riskTolerance: number; // 0-1
  budgetSensitivity: number; // 0-1
  timingPreference: 'beginning-quarter' | 'mid-quarter' | 'end-quarter' | 'any';
}

export interface EngagementRhythm {
  peakDays: number[]; // 0-6, Sunday = 0
  peakHours: number[]; // 0-23
  optimalCadence: number; // days between touches
  burnoutThreshold: number; // max touches before fatigue
}

export interface ResistanceProfile {
  primaryObjections: string[];
  persuasionImmunity: PersuasionTechnique[];
  effectiveTriggers: string[];
  trustBarriers: string[];
  socialProofWeight: number; // 0-1
}

export interface BehaviorObservation {
  timestamp: Date;
  action: string;
  context: Record<string, unknown>;
  sentiment: number; // -1 to 1
  intent: string;
}

// ICP Signal Detection
export interface ICPSignal {
  id: string;
  signalType: SignalType;
  strength: number; // 0-1
  source: string;
  rawData: Record<string, unknown>;
  extractedInsights: string[];
  timestamp: Date;
  decayRate: number;
  accountId?: string;
}

export type SignalType =
  | 'hiring-surge'
  | 'funding-round'
  | 'tech-adoption'
  | 'leadership-change'
  | 'expansion-indicator'
  | 'pain-signal'
  | 'competitor-mention'
  | 'buying-committee-forming'
  | 'budget-cycle'
  | 'strategic-initiative';

// Memory Index Structure
export interface MemoryIndex {
  patterns: Map<string, MessagePattern>;
  fingerprints: Map<string, BehavioralFingerprint>;
  signals: Map<string, ICPSignal>;
  embeddings: VectorStore;
  temporalGraph: TemporalKnowledgeGraph;
}

export interface VectorStore {
  dimensions: number;
  entries: VectorEntry[];
  index: unknown; // HNSW or similar ANN index
}

export interface VectorEntry {
  id: string;
  vector: number[];
  metadata: Record<string, unknown>;
  timestamp: Date;
}

export interface TemporalKnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  temporalSlices: Map<string, string[]>; // time period -> node IDs
}

export interface KnowledgeNode {
  id: string;
  type: 'account' | 'contact' | 'pattern' | 'outcome' | 'event';
  properties: Record<string, unknown>;
  embedding?: number[];
  validFrom: Date;
  validTo?: Date;
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  weight: number;
  properties: Record<string, unknown>;
  timestamp: Date;
}

// Reinforcement Learning Types
export interface ReinforcementState {
  sequenceId: string;
  step: number;
  features: number[];
  context: Record<string, unknown>;
}

export interface ReinforcementAction {
  type: 'send' | 'wait' | 'modify' | 'escalate' | 'branch' | 'terminate';
  parameters: Record<string, unknown>;
}

export interface ReinforcementReward {
  value: number;
  components: {
    engagement: number;
    conversion: number;
    velocity: number;
    efficiency: number;
  };
  timestamp: Date;
}

export interface PolicyState {
  weights: number[];
  explorationRate: number;
  learningRate: number;
  discountFactor: number;
  version: number;
  lastUpdated: Date;
}
