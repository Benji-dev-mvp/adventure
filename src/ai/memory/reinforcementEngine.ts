// TODO: Complete implementation of reinforcement learning
/**
 * Reinforcement Learning Engine for Self-Improving Sequences
 *
 * Routes sequences through reinforcement loops based on outcomes.
 * Implements contextual bandits + policy gradient optimization.
 */

import type {
  ReinforcementState,
  ReinforcementAction,
  ReinforcementReward,
  PolicyState,
} from './types';

interface SequenceStep {
  id: string;
  sequenceId: string;
  position: number;
  action: ReinforcementAction;
  state: ReinforcementState;
  reward?: ReinforcementReward;
  timestamp: Date;
}

interface PolicyDecision {
  action: ReinforcementAction;
  confidence: number;
  alternatives: Array<{ action: ReinforcementAction; probability: number }>;
  reasoning: string;
}

interface LearningMetrics {
  episodeCount: number;
  averageReward: number;
  rewardTrend: number;
  explorationRate: number;
  convergenceScore: number;
}

class ReinforcementEngine {
  private policies: Map<string, PolicyState> = new Map();
  private episodeBuffer: Map<string, SequenceStep[]> = new Map();
  private rewardHistory: number[] = [];

  // Hyperparameters
  private readonly LEARNING_RATE = 0.01;
  private readonly DISCOUNT_FACTOR = 0.95;
  private readonly INITIAL_EXPLORATION = 0.3;
  private readonly EXPLORATION_DECAY = 0.99;
  private readonly BATCH_SIZE = 32;
  private readonly FEATURE_DIM = 64;

  /**
   * Initialize or get policy for a sequence type
   */
  getPolicy(sequenceType: string): PolicyState {
    if (!this.policies.has(sequenceType)) {
      this.policies.set(sequenceType, this.initializePolicy());
    }
    return this.policies.get(sequenceType)!;
  }

  /**
   * Decide next action given current state
   */
  decide(
    _sequenceId: string,
    state: ReinforcementState,
    context: { sequenceType: string; stepHistory: SequenceStep[] }
  ): PolicyDecision {
    const policy = this.getPolicy(context.sequenceType);

    // Exploration vs exploitation
    if (Math.random() < policy.explorationRate) {
      return this.explore(state, policy);
    }

    return this.exploit(state, policy, context.stepHistory);
  }

  /**
   * Record outcome and update policy
   */
  recordOutcome(
    sequenceId: string,
    step: SequenceStep,
    outcome: {
      engagement: number;
      conversion: number;
      velocity: number;
      efficiency: number;
    }
  ): void {
    // Compute composite reward
    const reward: ReinforcementReward = {
      value: this.computeRewardValue(outcome),
      components: outcome,
      timestamp: new Date(),
    };

    step.reward = reward;

    // Add to episode buffer
    if (!this.episodeBuffer.has(sequenceId)) {
      this.episodeBuffer.set(sequenceId, []);
    }
    this.episodeBuffer.get(sequenceId)!.push(step);

    // Track reward history
    this.rewardHistory.push(reward.value);
    if (this.rewardHistory.length > 1000) {
      this.rewardHistory = this.rewardHistory.slice(-1000);
    }

    // Trigger learning if we have enough samples
    if (this.shouldTriggerLearning()) {
      this.updatePolicies();
    }
  }

  /**
   * Complete an episode and trigger final learning
   */
  completeEpisode(sequenceId: string, finalOutcome: 'converted' | 'lost' | 'stalled'): void {
    const episode = this.episodeBuffer.get(sequenceId);
    if (!episode || episode.length === 0) return;

    // Apply terminal reward/penalty
    const terminalReward = finalOutcome === 'converted' ? 1.0 : finalOutcome === 'lost' ? -0.5 : 0;

    // Propagate terminal reward backwards with discount
    for (let i = episode.length - 1; i >= 0; i--) {
      const step = episode[i];
      const discount = Math.pow(this.DISCOUNT_FACTOR, episode.length - 1 - i);

      if (step.reward) {
        step.reward.value += terminalReward * discount;
      }
    }

    // Trigger policy update with complete episode
    this.learnFromEpisode(episode);

    // Clear buffer
    this.episodeBuffer.delete(sequenceId);
  }

  /**
   * Get learning metrics for monitoring
   */
  getMetrics(sequenceType: string): LearningMetrics {
    const policy = this.policies.get(sequenceType);
    const recentRewards = this.rewardHistory.slice(-100);

    return {
      episodeCount: this.episodeBuffer.size,
      averageReward:
        recentRewards.length > 0
          ? recentRewards.reduce((a, b) => a + b, 0) / recentRewards.length
          : 0,
      rewardTrend: this.computeRewardTrend(recentRewards),
      explorationRate: policy?.explorationRate ?? this.INITIAL_EXPLORATION,
      convergenceScore: this.computeConvergence(policy),
    };
  }

  /**
   * Export policy for transfer or backup
   */
  exportPolicy(sequenceType: string): PolicyState | null {
    return this.policies.get(sequenceType) || null;
  }

  /**
   * Import policy from another system
   */
  importPolicy(sequenceType: string, policy: PolicyState, mergeWeight: number = 0.5): void {
    const existing = this.policies.get(sequenceType);

    if (existing) {
      // Merge policies with weighted average
      const merged: PolicyState = {
        weights: existing.weights.map(
          (w, i) => w * (1 - mergeWeight) + policy.weights[i] * mergeWeight
        ),
        explorationRate: existing.explorationRate * 0.5 + policy.explorationRate * 0.5,
        learningRate: this.LEARNING_RATE,
        discountFactor: this.DISCOUNT_FACTOR,
        version: existing.version + 1,
        lastUpdated: new Date(),
      };
      this.policies.set(sequenceType, merged);
    } else {
      this.policies.set(sequenceType, {
        ...policy,
        version: 1,
        lastUpdated: new Date(),
      });
    }
  }

  // === Private Methods ===

  private initializePolicy(): PolicyState {
    // Xavier initialization for weights
    const scale = Math.sqrt(2.0 / this.FEATURE_DIM);
    return {
      weights: Array.from(
        { length: this.FEATURE_DIM * 6 },
        () => (Math.random() - 0.5) * 2 * scale
      ),
      explorationRate: this.INITIAL_EXPLORATION,
      learningRate: this.LEARNING_RATE,
      discountFactor: this.DISCOUNT_FACTOR,
      version: 1,
      lastUpdated: new Date(),
    };
  }

  private explore(_state: ReinforcementState, policy: PolicyState): PolicyDecision {
    const actions: ReinforcementAction['type'][] = [
      'send',
      'wait',
      'modify',
      'escalate',
      'branch',
      'terminate',
    ];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];

    return {
      action: { type: randomAction, parameters: {} },
      confidence: policy.explorationRate,
      alternatives: actions.map(a => ({
        action: { type: a, parameters: {} },
        probability: 1 / actions.length,
      })),
      reasoning: 'Exploration: randomly sampling action space',
    };
  }

  private exploit(
    state: ReinforcementState,
    policy: PolicyState,
    history: SequenceStep[]
  ): PolicyDecision {
    // Compute action probabilities using softmax over Q-values
    const actions: ReinforcementAction['type'][] = [
      'send',
      'wait',
      'modify',
      'escalate',
      'branch',
      'terminate',
    ];
    const qValues = actions.map(action => this.computeQValue(state, action, policy));

    // Softmax normalization
    const maxQ = Math.max(...qValues);
    const expQ = qValues.map(q => Math.exp((q - maxQ) / 0.1)); // Temperature = 0.1
    const sumExpQ = expQ.reduce((a, b) => a + b, 0);
    const probabilities = expQ.map(e => e / sumExpQ);

    // Select action with highest probability
    const bestIdx = probabilities.indexOf(Math.max(...probabilities));

    return {
      action: {
        type: actions[bestIdx],
        parameters: this.computeActionParams(actions[bestIdx], state),
      },
      confidence: probabilities[bestIdx],
      alternatives: actions.map((a, i) => ({
        action: { type: a, parameters: {} },
        probability: probabilities[i],
      })),
      reasoning: this.generateReasoning(actions[bestIdx], state, history),
    };
  }

  private computeQValue(
    state: ReinforcementState,
    action: ReinforcementAction['type'],
    policy: PolicyState
  ): number {
    // Neural network-like Q-value computation using policy weights
    const actionIdx = ['send', 'wait', 'modify', 'escalate', 'branch', 'terminate'].indexOf(action);
    const stateVector = this.stateToVector(state);

    // Simple linear combination with action-specific weights
    const actionOffset = actionIdx * this.FEATURE_DIM;
    let qValue = 0;

    for (let i = 0; i < Math.min(stateVector.length, this.FEATURE_DIM); i++) {
      qValue += stateVector[i] * policy.weights[actionOffset + i];
    }

    return qValue;
  }

  private stateToVector(state: ReinforcementState): number[] {
    // Convert state to fixed-size feature vector
    const vector: number[] = [];

    // Position features
    vector.push(state.step / 10); // Normalized step position

    // Add state features
    vector.push(...state.features.slice(0, this.FEATURE_DIM - 1));

    // Pad to fixed dimension
    while (vector.length < this.FEATURE_DIM) {
      vector.push(0);
    }

    return vector.slice(0, this.FEATURE_DIM);
  }

  private computeActionParams(
    action: ReinforcementAction['type'],
    state: ReinforcementState
  ): Record<string, unknown> {
    switch (action) {
      case 'wait':
        return { durationHours: Math.max(24, 72 - state.step * 12) };
      case 'modify':
        return { aspect: 'tone', intensity: 0.3 };
      case 'escalate':
        return { channel: 'linkedin', urgency: 'low' };
      case 'branch':
        return { condition: 'no-response', targetSequence: 'nurture' };
      default:
        return {};
    }
  }

  private generateReasoning(
    action: ReinforcementAction['type'],
    _state: ReinforcementState,
    history: SequenceStep[]
  ): string {
    const recentPositive = history.slice(-3).filter(s => s.reward && s.reward.value > 0).length;
    const stepCount = history.length;

    switch (action) {
      case 'send':
        return recentPositive > 1
          ? 'Positive momentum detected, continuing engagement'
          : 'Standard progression in sequence';
      case 'wait':
        return stepCount > 3 ? 'Slowing cadence to avoid fatigue' : 'Allowing time for response';
      case 'modify':
        return 'Current approach showing low engagement, adapting tone';
      case 'escalate':
        return 'Email channel saturated, escalating to new touchpoint';
      case 'branch':
        return 'Engagement pattern suggests alternative sequence needed';
      case 'terminate':
        return 'Negative signals exceed threshold, ending sequence';
      default:
        return 'Policy-driven decision';
    }
  }

  private computeRewardValue(outcome: {
    engagement: number;
    conversion: number;
    velocity: number;
    efficiency: number;
  }): number {
    // Weighted combination of outcome dimensions
    return (
      outcome.engagement * 0.2 +
      outcome.conversion * 0.5 +
      outcome.velocity * 0.15 +
      outcome.efficiency * 0.15
    );
  }

  private shouldTriggerLearning(): boolean {
    // Trigger learning every BATCH_SIZE outcomes
    return this.rewardHistory.length % this.BATCH_SIZE === 0;
  }

  private updatePolicies(): void {
    // Collect samples from all episode buffers
    const samples: Array<{
      state: ReinforcementState;
      action: ReinforcementAction;
      reward: number;
    }> = [];

    for (const [, episode] of this.episodeBuffer) {
      for (const step of episode) {
        if (step.reward) {
          samples.push({
            state: step.state,
            action: step.action,
            reward: step.reward.value,
          });
        }
      }
    }

    if (samples.length < this.BATCH_SIZE) return;

    // Update each policy with relevant samples
    for (const [_sequenceType, policy] of this.policies) {
      this.updatePolicy(policy, samples);

      // Decay exploration rate
      policy.explorationRate *= this.EXPLORATION_DECAY;
      policy.explorationRate = Math.max(policy.explorationRate, 0.05);
      policy.version += 1;
      policy.lastUpdated = new Date();
    }
  }

  private updatePolicy(
    policy: PolicyState,
    samples: Array<{ state: ReinforcementState; action: ReinforcementAction; reward: number }>
  ): void {
    // Stochastic gradient descent on policy weights
    for (const sample of samples) {
      const stateVector = this.stateToVector(sample.state);
      const actionIdx = ['send', 'wait', 'modify', 'escalate', 'branch', 'terminate'].indexOf(
        sample.action.type
      );

      if (actionIdx === -1) continue;

      const actionOffset = actionIdx * this.FEATURE_DIM;

      // Compute gradient and update weights
      for (let i = 0; i < stateVector.length; i++) {
        const gradient = sample.reward * stateVector[i];
        policy.weights[actionOffset + i] += policy.learningRate * gradient;

        // Weight clipping for stability
        policy.weights[actionOffset + i] = Math.max(
          -5,
          Math.min(5, policy.weights[actionOffset + i])
        );
      }
    }
  }

  private learnFromEpisode(episode: SequenceStep[]): void {
    // Monte Carlo return calculation
    let G = 0;

    for (let t = episode.length - 1; t >= 0; t--) {
      const step = episode[t];
      G = (step.reward?.value ?? 0) + this.DISCOUNT_FACTOR * G;

      // Update policy for this state-action pair
      // This is a simplified policy gradient update
      if (step.state.context.sequenceType) {
        const sequenceType = step.state.context.sequenceType as string;
        const policy = this.policies.get(sequenceType);
        if (policy) {
          this.updatePolicy(policy, [
            {
              state: step.state,
              action: step.action,
              reward: G,
            },
          ]);
        }
      }
    }
  }

  private computeRewardTrend(rewards: number[]): number {
    if (rewards.length < 10) return 0;

    const firstHalf = rewards.slice(0, rewards.length / 2);
    const secondHalf = rewards.slice(rewards.length / 2);

    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    return avgSecond - avgFirst; // Positive = improving
  }

  private computeConvergence(policy: PolicyState | undefined): number {
    if (!policy) return 0;

    // Lower exploration rate = more converged
    const explorationScore = 1 - policy.explorationRate / this.INITIAL_EXPLORATION;

    // Weight magnitude indicates learned patterns
    const avgWeight = policy.weights.reduce((a, b) => a + Math.abs(b), 0) / policy.weights.length;
    const weightScore = Math.min(avgWeight / 2, 1);

    return (explorationScore + weightScore) / 2;
  }
}

// Singleton export
export const reinforcementEngine = new ReinforcementEngine();
export default ReinforcementEngine;
