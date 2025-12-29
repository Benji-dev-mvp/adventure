/**
 * Federated Learning Manager
 *
 * Coordinates privacy-preserving collaborative model training
 * across organizations without sharing raw data.
 */

import type {
  FederatedModel,
  FederatedRound,
  FederatedParticipant,
  RoundConfig,
  AggregationResult,
  ModelPerformance,
  ModelType,
  TrainingConfig,
  DifferentialPrivacyConfig,
} from './types';

// === Default Configurations ===

const DEFAULT_TRAINING_CONFIG: TrainingConfig = {
  batchSize: 32,
  epochs: 5,
  learningRate: 0.01,
  momentum: 0.9,
  clipNorm: 1.0,
  differentialPrivacy: {
    enabled: true,
    epsilon: 1.0,
    delta: 1e-5,
    noiseMultiplier: 1.1,
    maxGradNorm: 1.0,
  },
};

const DEFAULT_ROUND_CONFIG: RoundConfig = {
  minParticipants: 3,
  maxParticipants: 100,
  trainingDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  selectionStrategy: 'weighted',
  aggregationMethod: 'fedavg',
};

// === Federated Learning Manager ===

export class FederatedLearningManager {
  private models: Map<string, FederatedModel> = new Map();
  private rounds: Map<string, FederatedRound> = new Map();
  private participants: Map<string, Set<string>> = new Map(); // modelId -> participant IDs
  private eventHandlers: Set<(event: FederatedEvent) => void> = new Set();

  constructor() {
    this.initializeDefaultModels();
  }

  /**
   * Initialize default federated models
   */
  private initializeDefaultModels(): void {
    // Reply Prediction Model
    this.createModel({
      name: 'Reply Prediction Model',
      type: 'reply-prediction',
      architecture: {
        layers: 4,
        neurons: [128, 64, 32, 1],
        activations: ['relu', 'relu', 'relu', 'sigmoid'],
        regularization: 'l2',
        optimizer: 'adam',
      },
    });

    // Meeting Conversion Model
    this.createModel({
      name: 'Meeting Conversion Model',
      type: 'meeting-conversion',
      architecture: {
        layers: 5,
        neurons: [256, 128, 64, 32, 1],
        activations: ['relu', 'relu', 'relu', 'relu', 'sigmoid'],
        regularization: 'dropout',
        optimizer: 'adamw',
      },
    });

    // Persona Classification Model
    this.createModel({
      name: 'Persona Classifier',
      type: 'persona-classification',
      architecture: {
        layers: 4,
        neurons: [512, 256, 128, 10],
        activations: ['relu', 'relu', 'relu', 'softmax'],
        regularization: 'l2',
        optimizer: 'adam',
      },
    });

    // Timing Prediction Model
    this.createModel({
      name: 'Optimal Timing Predictor',
      type: 'timing-prediction',
      architecture: {
        layers: 3,
        neurons: [64, 32, 168], // 24*7 hours in a week
        activations: ['relu', 'relu', 'softmax'],
        regularization: 'l1',
        optimizer: 'sgd',
      },
    });
  }

  /**
   * Create a new federated model
   */
  createModel(params: {
    name: string;
    type: ModelType;
    architecture: FederatedModel['architecture'];
    trainingConfig?: Partial<TrainingConfig>;
  }): FederatedModel {
    const id = `model_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const model: FederatedModel = {
      id,
      name: params.name,
      type: params.type,
      version: '0.1.0',
      architecture: params.architecture,
      weights: {
        format: 'dense',
        size: this.calculateModelSize(params.architecture),
        checksum: '',
        compressed: false,
      },
      performance: {
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0,
        auc: 0,
        latencyMs: 0,
        lastEvaluated: new Date(),
        evaluationSet: 'initial',
      },
      trainingConfig: {
        ...DEFAULT_TRAINING_CONFIG,
        ...params.trainingConfig,
      },
      lastUpdated: new Date(),
      contributors: 0,
    };

    this.models.set(id, model);
    this.participants.set(id, new Set());
    this.emit({ type: 'model-created', model });

    return model;
  }

  /**
   * Calculate model size in bytes
   */
  private calculateModelSize(architecture: FederatedModel['architecture']): number {
    let params = 0;
    for (let i = 1; i < architecture.neurons.length; i++) {
      params += architecture.neurons[i - 1] * architecture.neurons[i];
      params += architecture.neurons[i]; // bias
    }
    return params * 4; // 4 bytes per float32
  }

  /**
   * Start a new training round
   */
  startRound(modelId: string, config: Partial<RoundConfig> = {}): FederatedRound | null {
    const model = this.models.get(modelId);
    if (!model) return null;

    const existingRounds = Array.from(this.rounds.values()).filter(r => r.modelId === modelId);
    const roundNumber = existingRounds.length + 1;

    const round: FederatedRound = {
      id: `round_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      modelId,
      roundNumber,
      status: 'recruiting',
      participants: [],
      config: {
        ...DEFAULT_ROUND_CONFIG,
        ...config,
        trainingDeadline: config.trainingDeadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      startedAt: new Date(),
    };

    this.rounds.set(round.id, round);
    this.emit({ type: 'round-started', round });

    return round;
  }

  /**
   * Join a training round
   */
  joinRound(
    roundId: string,
    participant: {
      organizationId: string;
      dataSize: number;
    }
  ): FederatedParticipant | null {
    const round = this.rounds.get(roundId);
    if (!round || round.status !== 'recruiting') return null;

    if (round.participants.length >= round.config.maxParticipants) {
      return null;
    }

    // Check if already participating
    if (round.participants.some(p => p.organizationId === participant.organizationId)) {
      return null;
    }

    const newParticipant: FederatedParticipant = {
      id: `participant_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      organizationId: participant.organizationId,
      status: 'accepted',
      dataSize: participant.dataSize,
      contribution: 0,
    };

    round.participants.push(newParticipant);

    // Add to model participants
    const modelParticipants = this.participants.get(round.modelId);
    if (modelParticipants) {
      modelParticipants.add(participant.organizationId);
    }

    // Check if we have enough participants
    if (round.participants.length >= round.config.minParticipants) {
      round.status = 'training';
      this.emit({
        type: 'round-training-started',
        roundId,
        participants: round.participants.length,
      });
    }

    this.emit({ type: 'participant-joined', roundId, participant: newParticipant });
    return newParticipant;
  }

  /**
   * Submit local training results
   */
  submitLocalUpdate(
    roundId: string,
    participantId: string,
    update: {
      gradients: number[];
      metrics: ModelPerformance;
      dataSize: number;
    }
  ): boolean {
    const round = this.rounds.get(roundId);
    if (!round || round.status !== 'training') return false;

    const participant = round.participants.find(p => p.id === participantId);
    if (!participant || participant.status !== 'accepted') return false;

    // Apply differential privacy noise if enabled
    const model = this.models.get(round.modelId);
    if (model?.trainingConfig.differentialPrivacy.enabled) {
      this.applyDifferentialPrivacy(update.gradients, model.trainingConfig.differentialPrivacy);
    }

    participant.status = 'submitted';
    participant.localMetrics = update.metrics;
    participant.submittedAt = new Date();
    participant.contribution =
      update.dataSize / round.participants.reduce((sum, p) => sum + p.dataSize, 0);

    this.emit({ type: 'update-submitted', roundId, participantId });

    // Check if all participants have submitted
    const allSubmitted = round.participants.every(
      p => p.status === 'submitted' || p.status === 'rejected'
    );

    if (allSubmitted) {
      this.aggregateRound(roundId);
    }

    return true;
  }

  /**
   * Apply differential privacy to gradients
   */
  private applyDifferentialPrivacy(gradients: number[], config: DifferentialPrivacyConfig): void {
    // Clip gradients
    const norm = Math.sqrt(gradients.reduce((sum, g) => sum + g * g, 0));
    if (norm > config.maxGradNorm) {
      const scale = config.maxGradNorm / norm;
      for (let i = 0; i < gradients.length; i++) {
        gradients[i] *= scale;
      }
    }

    // Add Gaussian noise
    const sigma = config.noiseMultiplier * config.maxGradNorm;
    for (let i = 0; i < gradients.length; i++) {
      // Box-Muller transform for Gaussian noise
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      gradients[i] += z * sigma;
    }
  }

  /**
   * Aggregate round results
   */
  private aggregateRound(roundId: string): void {
    const round = this.rounds.get(roundId);
    if (!round) return;

    round.status = 'aggregating';

    const submittedParticipants = round.participants.filter(p => p.status === 'submitted');

    if (submittedParticipants.length < round.config.minParticipants) {
      round.status = 'failed';
      this.emit({ type: 'round-failed', roundId, reason: 'Insufficient participants' });
      return;
    }

    // Perform federated averaging
    const totalDataSize = submittedParticipants.reduce((sum, p) => sum + p.dataSize, 0);

    // Weighted average of metrics
    const aggregatedMetrics: ModelPerformance = {
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
      auc: 0,
      latencyMs: 0,
      lastEvaluated: new Date(),
      evaluationSet: `round_${round.roundNumber}`,
    };

    for (const participant of submittedParticipants) {
      if (!participant.localMetrics) continue;
      const weight = participant.dataSize / totalDataSize;

      aggregatedMetrics.accuracy += participant.localMetrics.accuracy * weight;
      aggregatedMetrics.precision += participant.localMetrics.precision * weight;
      aggregatedMetrics.recall += participant.localMetrics.recall * weight;
      aggregatedMetrics.f1Score += participant.localMetrics.f1Score * weight;
      aggregatedMetrics.auc += participant.localMetrics.auc * weight;
      aggregatedMetrics.latencyMs += participant.localMetrics.latencyMs * weight;
    }

    // Update model
    const model = this.models.get(round.modelId);
    if (model) {
      const improvement = aggregatedMetrics.accuracy - model.performance.accuracy;

      model.performance = aggregatedMetrics;
      model.contributors = this.participants.get(round.modelId)?.size || 0;
      model.lastUpdated = new Date();
      model.version = this.incrementVersion(model.version);

      round.results = {
        participantCount: submittedParticipants.length,
        totalDataSize,
        globalMetrics: aggregatedMetrics,
        improvement,
        convergenceRate: this.calculateConvergenceRate(round.modelId),
        privacyBudgetUsed: model.trainingConfig.differentialPrivacy.epsilon,
      };
    }

    round.status = 'completed';
    round.completedAt = new Date();

    this.emit({ type: 'round-completed', round, results: round.results! });
  }

  /**
   * Increment semantic version
   */
  private incrementVersion(version: string): string {
    const parts = version.split('.').map(Number);
    parts[2]++; // Increment patch version
    if (parts[2] >= 100) {
      parts[2] = 0;
      parts[1]++;
    }
    if (parts[1] >= 100) {
      parts[1] = 0;
      parts[0]++;
    }
    return parts.join('.');
  }

  /**
   * Calculate convergence rate
   */
  private calculateConvergenceRate(modelId: string): number {
    const modelRounds = Array.from(this.rounds.values())
      .filter(r => r.modelId === modelId && r.status === 'completed')
      .sort((a, b) => a.roundNumber - b.roundNumber);

    if (modelRounds.length < 2) return 0;

    const improvements = [];
    for (let i = 1; i < modelRounds.length; i++) {
      const prev = modelRounds[i - 1].results?.globalMetrics.accuracy || 0;
      const curr = modelRounds[i].results?.globalMetrics.accuracy || 0;
      improvements.push(curr - prev);
    }

    const recentImprovements = improvements.slice(-5);
    return recentImprovements.reduce((a, b) => a + b, 0) / recentImprovements.length;
  }

  /**
   * Get model by ID
   */
  getModel(modelId: string): FederatedModel | undefined {
    return this.models.get(modelId);
  }

  /**
   * Get all models
   */
  getAllModels(): FederatedModel[] {
    return Array.from(this.models.values());
  }

  /**
   * Get models by type
   */
  getModelsByType(type: ModelType): FederatedModel[] {
    return Array.from(this.models.values()).filter(m => m.type === type);
  }

  /**
   * Get round by ID
   */
  getRound(roundId: string): FederatedRound | undefined {
    return this.rounds.get(roundId);
  }

  /**
   * Get rounds for model
   */
  getModelRounds(modelId: string): FederatedRound[] {
    return Array.from(this.rounds.values())
      .filter(r => r.modelId === modelId)
      .sort((a, b) => b.roundNumber - a.roundNumber);
  }

  /**
   * Get active rounds
   */
  getActiveRounds(): FederatedRound[] {
    return Array.from(this.rounds.values()).filter(
      r => r.status === 'recruiting' || r.status === 'training'
    );
  }

  /**
   * Subscribe to events
   */
  subscribe(handler: (event: FederatedEvent) => void): () => void {
    this.eventHandlers.add(handler);
    return () => this.eventHandlers.delete(handler);
  }

  /**
   * Emit event
   */
  private emit(event: FederatedEvent): void {
    for (const handler of this.eventHandlers) {
      try {
        handler(event);
      } catch (error) {
        console.error('Federated event handler error:', error);
      }
    }
  }

  /**
   * Get federated learning statistics
   */
  getStats(): {
    totalModels: number;
    totalRounds: number;
    completedRounds: number;
    activeParticipants: number;
    averageAccuracy: number;
    totalPrivacyBudget: number;
  } {
    const models = Array.from(this.models.values());
    const rounds = Array.from(this.rounds.values());
    const completed = rounds.filter(r => r.status === 'completed');

    const allParticipants = new Set<string>();
    for (const participantSet of this.participants.values()) {
      for (const p of participantSet) {
        allParticipants.add(p);
      }
    }

    const avgAccuracy =
      models.length > 0
        ? models.reduce((sum, m) => sum + m.performance.accuracy, 0) / models.length
        : 0;

    const totalPrivacyBudget = completed.reduce(
      (sum, r) => sum + (r.results?.privacyBudgetUsed || 0),
      0
    );

    return {
      totalModels: models.length,
      totalRounds: rounds.length,
      completedRounds: completed.length,
      activeParticipants: allParticipants.size,
      averageAccuracy: avgAccuracy,
      totalPrivacyBudget,
    };
  }
}

// Event types
export type FederatedEvent =
  | { type: 'model-created'; model: FederatedModel }
  | { type: 'round-started'; round: FederatedRound }
  | { type: 'participant-joined'; roundId: string; participant: FederatedParticipant }
  | { type: 'round-training-started'; roundId: string; participants: number }
  | { type: 'update-submitted'; roundId: string; participantId: string }
  | { type: 'round-completed'; round: FederatedRound; results: AggregationResult }
  | { type: 'round-failed'; roundId: string; reason: string };

// Singleton export
export const federatedLearning = new FederatedLearningManager();
export default FederatedLearningManager;
