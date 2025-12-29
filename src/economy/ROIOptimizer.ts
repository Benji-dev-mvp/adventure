/**
 * ROI Optimizer
 *
 * Optimizes resource allocation across agents, tasks,
 * and campaigns to maximize return on investment.
 */

import type {
  ROIModel,
  ROIConstraint,
  ROIOptimizationResult,
  ROIRecommendation,
  ResourceAllocation,
  ROITradeoff,
  AllocationRule,
} from './types';

// === Optimization Strategies ===

export type OptimizationStrategy =
  | 'maximize-revenue'
  | 'maximize-efficiency'
  | 'minimize-cost'
  | 'balanced'
  | 'growth-focused'
  | 'risk-averse';

// === ROI Calculator ===

export class ROIOptimizer {
  private models: Map<string, ROIModel> = new Map();
  private currentAllocation: ResourceAllocation;
  private history: ROIOptimizationResult[] = [];

  constructor() {
    this.currentAllocation = this.createDefaultAllocation();
    this.initializeDefaultModels();
  }

  /**
   * Initialize default ROI models
   */
  private initializeDefaultModels(): void {
    // Outbound sequence ROI model
    this.models.set('outbound-sequence', {
      id: 'outbound-sequence',
      name: 'Outbound Sequence ROI',
      inputs: [
        { name: 'credits', type: 'credits', value: 0, unit: 'credits', weight: 0.3 },
        { name: 'time', type: 'time', value: 0, unit: 'hours', weight: 0.2 },
        { name: 'agentCost', type: 'resources', value: 0, unit: 'credits', weight: 0.3 },
        { name: 'contactVolume', type: 'custom', value: 0, unit: 'contacts', weight: 0.2 },
      ],
      outputs: [
        { name: 'meetings', type: 'meetings', projected: 0, confidence: 0.8, unit: 'meetings' },
        { name: 'revenue', type: 'revenue', projected: 0, confidence: 0.6, unit: 'USD' },
        { name: 'engagement', type: 'engagement', projected: 0, confidence: 0.9, unit: 'rate' },
      ],
      formula: 'ROI = (revenue - totalCost) / totalCost',
      constraints: [
        { name: 'budget', type: 'budget', min: 0, max: 10000, current: 5000 },
        { name: 'dailyCapacity', type: 'capacity', min: 0, max: 500, current: 200 },
        { name: 'qualityThreshold', type: 'quality', min: 0.7, max: 1, current: 0.85 },
      ],
      lastUpdated: new Date(),
    });

    // Multi-channel campaign ROI model
    this.models.set('multi-channel', {
      id: 'multi-channel',
      name: 'Multi-Channel Campaign ROI',
      inputs: [
        { name: 'emailCredits', type: 'credits', value: 0, unit: 'credits', weight: 0.25 },
        { name: 'phoneCredits', type: 'credits', value: 0, unit: 'credits', weight: 0.25 },
        { name: 'linkedinCredits', type: 'credits', value: 0, unit: 'credits', weight: 0.25 },
        { name: 'adSpend', type: 'credits', value: 0, unit: 'credits', weight: 0.25 },
      ],
      outputs: [
        {
          name: 'totalMeetings',
          type: 'meetings',
          projected: 0,
          confidence: 0.75,
          unit: 'meetings',
        },
        { name: 'pipelineValue', type: 'revenue', projected: 0, confidence: 0.5, unit: 'USD' },
        { name: 'brandAwareness', type: 'custom', projected: 0, confidence: 0.7, unit: 'score' },
      ],
      formula: 'ROI = (pipelineValue * conversionRate - totalSpend) / totalSpend',
      constraints: [
        { name: 'totalBudget', type: 'budget', min: 0, max: 50000, current: 20000 },
        { name: 'channelBalance', type: 'quality', min: 0.15, max: 0.5, current: 0.25 },
      ],
      lastUpdated: new Date(),
    });

    // Agent efficiency model
    this.models.set('agent-efficiency', {
      id: 'agent-efficiency',
      name: 'Agent Efficiency Model',
      inputs: [
        { name: 'taskVolume', type: 'custom', value: 0, unit: 'tasks', weight: 0.3 },
        { name: 'agentCount', type: 'resources', value: 0, unit: 'agents', weight: 0.3 },
        { name: 'qualityTarget', type: 'custom', value: 0, unit: 'score', weight: 0.4 },
      ],
      outputs: [
        { name: 'throughput', type: 'custom', projected: 0, confidence: 0.85, unit: 'tasks/hour' },
        { name: 'qualityScore', type: 'custom', projected: 0, confidence: 0.8, unit: 'score' },
        { name: 'costPerTask', type: 'custom', projected: 0, confidence: 0.9, unit: 'credits' },
      ],
      formula: 'Efficiency = throughput * qualityScore / costPerTask',
      constraints: [
        { name: 'maxAgents', type: 'capacity', min: 1, max: 50, current: 10 },
        { name: 'minQuality', type: 'quality', min: 0.8, max: 1, current: 0.9 },
      ],
      lastUpdated: new Date(),
    });
  }

  /**
   * Create default resource allocation
   */
  private createDefaultAllocation(): ResourceAllocation {
    return {
      budget: {
        total: 10000,
        byCategory: {
          'email-sequences': 3000,
          'phone-outreach': 2000,
          linkedin: 2000,
          'data-enrichment': 1500,
          analysis: 1500,
        },
        byAgent: {},
      },
      capacity: {
        total: 100,
        utilized: 0,
        byAgent: {},
      },
      priority: {
        weights: {
          revenue: 0.4,
          efficiency: 0.3,
          quality: 0.2,
          speed: 0.1,
        },
        rules: [],
      },
    };
  }

  /**
   * Calculate ROI for given inputs
   */
  calculateROI(
    modelId: string,
    inputs: Record<string, number>
  ): {
    roi: number;
    outputs: Record<string, number>;
    confidence: number;
  } {
    const model = this.models.get(modelId);
    if (!model) {
      return { roi: 0, outputs: {}, confidence: 0 };
    }

    // Calculate total input cost
    let totalCost = 0;
    for (const input of model.inputs) {
      const value = inputs[input.name] || input.value;
      if (input.type === 'credits' || input.type === 'resources') {
        totalCost += value * input.weight;
      }
    }

    // Project outputs based on inputs (simplified model)
    const outputs: Record<string, number> = {};
    let avgConfidence = 0;

    for (const output of model.outputs) {
      // Simple projection: higher inputs = higher outputs
      const inputSum = Object.values(inputs).reduce((a, b) => a + b, 0);

      switch (output.type) {
        case 'meetings':
          outputs[output.name] = inputSum * 0.02 * output.confidence;
          break;
        case 'revenue':
          outputs[output.name] = inputSum * 50 * output.confidence;
          break;
        case 'engagement':
          outputs[output.name] = Math.min(0.3, inputSum * 0.0001) * output.confidence;
          break;
        default:
          outputs[output.name] = inputSum * 0.1 * output.confidence;
      }

      avgConfidence += output.confidence;
    }

    avgConfidence /= model.outputs.length;

    // Calculate ROI
    const totalOutput =
      outputs['revenue'] || Object.values(outputs).reduce((a, b) => a + b, 0) * 100;
    const roi = totalCost > 0 ? (totalOutput - totalCost) / totalCost : 0;

    return {
      roi,
      outputs,
      confidence: avgConfidence,
    };
  }

  /**
   * Optimize allocation for maximum ROI
   */
  optimize(
    strategy: OptimizationStrategy = 'balanced',
    constraints?: Partial<ROIConstraint>[]
  ): ROIOptimizationResult {
    const currentROI = this.calculateCurrentROI();

    // Get strategy weights
    const weights = this.getStrategyWeights(strategy);

    // Run optimization algorithm (simplified gradient descent)
    const optimizedAllocation = this.runOptimization(weights, constraints);

    // Calculate optimized ROI
    const optimizedROI = this.calculateAllocationROI(optimizedAllocation);

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      this.currentAllocation,
      optimizedAllocation,
      strategy
    );

    // Identify tradeoffs
    const tradeoffs = this.identifyTradeoffs(this.currentAllocation, optimizedAllocation);

    const result: ROIOptimizationResult = {
      modelId: 'composite',
      timestamp: new Date(),
      currentROI,
      optimizedROI,
      improvement: optimizedROI - currentROI,
      recommendations,
      allocation: optimizedAllocation,
      tradeoffs,
    };

    this.history.push(result);
    return result;
  }

  /**
   * Get strategy weights
   */
  private getStrategyWeights(strategy: OptimizationStrategy): Record<string, number> {
    const weights: Record<OptimizationStrategy, Record<string, number>> = {
      'maximize-revenue': { revenue: 0.7, efficiency: 0.15, quality: 0.1, speed: 0.05 },
      'maximize-efficiency': { revenue: 0.2, efficiency: 0.5, quality: 0.2, speed: 0.1 },
      'minimize-cost': { revenue: 0.1, efficiency: 0.6, quality: 0.1, speed: 0.2 },
      balanced: { revenue: 0.35, efficiency: 0.25, quality: 0.25, speed: 0.15 },
      'growth-focused': { revenue: 0.5, efficiency: 0.1, quality: 0.2, speed: 0.2 },
      'risk-averse': { revenue: 0.2, efficiency: 0.3, quality: 0.4, speed: 0.1 },
    };

    return weights[strategy];
  }

  /**
   * Run optimization algorithm
   */
  private runOptimization(
    weights: Record<string, number>,
    constraints?: Partial<ROIConstraint>[]
  ): ResourceAllocation {
    const allocation = JSON.parse(JSON.stringify(this.currentAllocation));

    // Simplified optimization: redistribute based on weights
    const totalBudget = allocation.budget.total;
    const categories = Object.keys(allocation.budget.byCategory);

    // Score each category
    const scores: Record<string, number> = {};
    for (const category of categories) {
      // Assign scores based on category type and weights
      if (category.includes('email') || category.includes('sequence')) {
        scores[category] = weights.efficiency * 0.8 + weights.revenue * 0.6;
      } else if (category.includes('phone')) {
        scores[category] = weights.quality * 0.9 + weights.revenue * 0.5;
      } else if (category.includes('linkedin')) {
        scores[category] = weights.efficiency * 0.7 + weights.quality * 0.6;
      } else if (category.includes('data')) {
        scores[category] = weights.quality * 0.8 + weights.efficiency * 0.5;
      } else {
        scores[category] = weights.efficiency * 0.5 + weights.quality * 0.5;
      }
    }

    // Normalize scores and allocate
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    for (const category of categories) {
      allocation.budget.byCategory[category] = Math.round(
        (scores[category] / totalScore) * totalBudget
      );
    }

    // Apply constraints
    if (constraints) {
      for (const constraint of constraints) {
        if (constraint.type === 'budget' && constraint.max !== undefined) {
          const budgetRatio = constraint.max / totalBudget;
          for (const category of categories) {
            allocation.budget.byCategory[category] *= budgetRatio;
          }
        }
      }
    }

    // Add optimization rules
    allocation.priority.rules = this.generateAllocationRules(weights);

    return allocation;
  }

  /**
   * Generate allocation rules based on weights
   */
  private generateAllocationRules(weights: Record<string, number>): AllocationRule[] {
    const rules: AllocationRule[] = [];

    if (weights.revenue > 0.5) {
      rules.push({
        condition: 'high-value-prospect',
        action: 'boost',
        target: 'engagement-agents',
        magnitude: 1.5,
      });
    }

    if (weights.efficiency > 0.4) {
      rules.push({
        condition: 'low-engagement-rate',
        action: 'throttle',
        target: 'low-performing-sequences',
        magnitude: 0.5,
      });
    }

    if (weights.quality > 0.3) {
      rules.push({
        condition: 'quality-below-threshold',
        action: 'redirect',
        target: 'quality-assurance',
        magnitude: 1.2,
      });
    }

    if (weights.speed > 0.2) {
      rules.push({
        condition: 'deadline-approaching',
        action: 'boost',
        target: 'all-agents',
        magnitude: 1.3,
      });
    }

    return rules;
  }

  /**
   * Calculate current ROI
   */
  private calculateCurrentROI(): number {
    // Aggregate ROI across all models
    let totalROI = 0;
    let count = 0;

    for (const model of this.models.values()) {
      const inputs: Record<string, number> = {};
      for (const input of model.inputs) {
        inputs[input.name] = input.value;
      }
      const result = this.calculateROI(model.id, inputs);
      totalROI += result.roi;
      count++;
    }

    return count > 0 ? totalROI / count : 0;
  }

  /**
   * Calculate ROI for specific allocation
   */
  private calculateAllocationROI(allocation: ResourceAllocation): number {
    const totalBudget = allocation.budget.total;
    const utilization = allocation.capacity.utilized / Math.max(allocation.capacity.total, 1);

    // Simplified ROI calculation based on allocation efficiency
    const allocationEfficiency =
      Object.values(allocation.budget.byCategory).reduce((sum, val) => sum + val, 0) / totalBudget;

    // Expected output (simplified model)
    const expectedRevenue = totalBudget * 3 * allocationEfficiency * (0.5 + utilization * 0.5);

    return (expectedRevenue - totalBudget) / totalBudget;
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(
    current: ResourceAllocation,
    optimized: ResourceAllocation,
    strategy: OptimizationStrategy
  ): ROIRecommendation[] {
    const recommendations: ROIRecommendation[] = [];

    // Compare allocations
    for (const [category, currentAmount] of Object.entries(current.budget.byCategory)) {
      const optimizedAmount = optimized.budget.byCategory[category] || 0;
      const change = optimizedAmount - currentAmount;
      const changePercent = (Math.abs(change) / Math.max(currentAmount, 1)) * 100;

      if (changePercent > 10) {
        recommendations.push({
          priority: changePercent > 30 ? 'high' : 'medium',
          action:
            change > 0
              ? `Increase ${category} budget by ${changePercent.toFixed(0)}%`
              : `Reduce ${category} budget by ${changePercent.toFixed(0)}%`,
          expectedImpact: Math.abs(change) * 0.5,
          confidence: 0.7,
          effort: changePercent > 30 ? 'medium' : 'low',
          resources: [category],
        });
      }
    }

    // Strategy-specific recommendations
    switch (strategy) {
      case 'maximize-revenue':
        recommendations.push({
          priority: 'high',
          action: 'Focus on high-value prospect engagement',
          expectedImpact: current.budget.total * 0.2,
          confidence: 0.65,
          effort: 'medium',
          resources: ['sales-agents', 'engagement-sequences'],
        });
        break;

      case 'maximize-efficiency':
        recommendations.push({
          priority: 'high',
          action: 'Automate low-value repetitive tasks',
          expectedImpact: current.budget.total * 0.15,
          confidence: 0.8,
          effort: 'high',
          resources: ['automation', 'agent-training'],
        });
        break;

      case 'risk-averse':
        recommendations.push({
          priority: 'medium',
          action: 'Diversify across multiple channels to reduce concentration risk',
          expectedImpact: current.budget.total * 0.1,
          confidence: 0.75,
          effort: 'medium',
          resources: ['multi-channel', 'diversification'],
        });
        break;
    }

    return recommendations.sort((a, b) => {
      const order = { critical: 4, high: 3, medium: 2, low: 1 };
      return order[b.priority] - order[a.priority];
    });
  }

  /**
   * Identify tradeoffs
   */
  private identifyTradeoffs(
    current: ResourceAllocation,
    optimized: ResourceAllocation
  ): ROITradeoff[] {
    const tradeoffs: ROITradeoff[] = [];

    // Speed vs Quality tradeoff
    const currentQualityWeight = current.priority.weights['quality'] || 0.25;
    const optimizedQualityWeight = optimized.priority.weights['quality'] || 0.25;

    if (Math.abs(currentQualityWeight - optimizedQualityWeight) > 0.1) {
      tradeoffs.push({
        dimension1: 'Speed',
        dimension2: 'Quality',
        currentBalance: currentQualityWeight,
        optimalBalance: optimizedQualityWeight,
        recommendation:
          optimizedQualityWeight > currentQualityWeight
            ? 'Increase quality focus at cost of speed'
            : 'Prioritize speed over quality',
      });
    }

    // Volume vs Personalization tradeoff
    const emailBudget = optimized.budget.byCategory['email-sequences'] || 0;
    const totalBudget = optimized.budget.total;
    const emailRatio = emailBudget / Math.max(totalBudget, 1);

    if (emailRatio > 0.4) {
      tradeoffs.push({
        dimension1: 'Volume',
        dimension2: 'Personalization',
        currentBalance: emailRatio,
        optimalBalance: 0.35,
        recommendation: 'Consider reducing email volume for higher personalization',
      });
    }

    return tradeoffs;
  }

  /**
   * Get current allocation
   */
  getAllocation(): ResourceAllocation {
    return { ...this.currentAllocation };
  }

  /**
   * Update allocation
   */
  updateAllocation(allocation: Partial<ResourceAllocation>): void {
    this.currentAllocation = {
      ...this.currentAllocation,
      ...allocation,
      budget: {
        ...this.currentAllocation.budget,
        ...(allocation.budget || {}),
      },
      capacity: {
        ...this.currentAllocation.capacity,
        ...(allocation.capacity || {}),
      },
      priority: {
        ...this.currentAllocation.priority,
        ...(allocation.priority || {}),
      },
    };
  }

  /**
   * Get optimization history
   */
  getHistory(): ROIOptimizationResult[] {
    return [...this.history];
  }

  /**
   * Get model by ID
   */
  getModel(modelId: string): ROIModel | undefined {
    return this.models.get(modelId);
  }

  /**
   * Update model
   */
  updateModel(modelId: string, updates: Partial<ROIModel>): void {
    const model = this.models.get(modelId);
    if (model) {
      Object.assign(model, updates, { lastUpdated: new Date() });
    }
  }

  /**
   * Create custom model
   */
  createModel(model: Omit<ROIModel, 'lastUpdated'>): ROIModel {
    const fullModel: ROIModel = {
      ...model,
      lastUpdated: new Date(),
    };
    this.models.set(model.id, fullModel);
    return fullModel;
  }
}

// Singleton export
export const roiOptimizer = new ROIOptimizer();
export default ROIOptimizer;
