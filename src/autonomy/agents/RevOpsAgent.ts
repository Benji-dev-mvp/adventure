/**
 * RevOps Agent
 *
 * Optimizes sequences, pacing, and routing. The orchestration brain
 * that ensures the GTM engine runs at peak efficiency.
 */

import { BaseAgent, AgentContext, ExecutionResult } from './BaseAgent';
import type { Task, Pipeline, PipelineMetrics } from './types';

interface SequenceOptimization {
  sequenceId: string;
  currentPerformance: SequenceMetrics;
  recommendations: Recommendation[];
  projectedImprovement: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface SequenceMetrics {
  openRate: number;
  replyRate: number;
  meetingRate: number;
  bounceRate: number;
  unsubscribeRate: number;
  velocity: number;
  cost: number;
}

interface Recommendation {
  type: 'timing' | 'content' | 'targeting' | 'pacing' | 'channel';
  action: string;
  impact: number;
  effort: 'low' | 'medium' | 'high';
  reasoning: string;
  implementation: string;
}

interface PipelineRebalance {
  moves: PipelineMove[];
  projectedImpact: {
    velocityChange: number;
    conversionChange: number;
    revenueImpact: number;
  };
  risks: string[];
}

interface PipelineMove {
  accountId: string;
  fromStage: string;
  toStage: string;
  reason: string;
  action: string;
}

export class RevOpsAgent extends BaseAgent {
  private performanceBaselines: Map<string, SequenceMetrics> = new Map();
  private optimizationHistory: Map<string, Recommendation[]> = new Map();
  private routingRules: RoutingRule[] = [];

  constructor(name: string = 'RevOps Prime') {
    super('revops', name, {
      autonomyLevel: 'autonomous',
      riskTolerance: 0.3, // Conservative with optimizations
      creativityBias: 0.5,
      speedVsQuality: 0.2, // Quality-focused
    });

    this.initializeRoutingRules();
  }

  protected initializeCapabilities(): void {
    this.capabilities = [
      {
        id: 'sequence-optimization',
        name: 'Sequence Optimization',
        skillLevel: 0.9,
        cost: 8,
        latency: 2000,
        successRate: 0.85,
      },
      {
        id: 'pipeline-analysis',
        name: 'Pipeline Analysis',
        skillLevel: 0.88,
        cost: 6,
        latency: 1500,
        successRate: 0.9,
      },
      {
        id: 'routing-optimization',
        name: 'Lead Routing',
        skillLevel: 0.92,
        cost: 4,
        latency: 500,
        successRate: 0.95,
      },
      {
        id: 'pacing-control',
        name: 'Pacing & Throttling',
        skillLevel: 0.87,
        cost: 3,
        latency: 300,
        successRate: 0.92,
      },
      {
        id: 'performance-forecasting',
        name: 'Performance Forecasting',
        skillLevel: 0.82,
        cost: 7,
        latency: 2500,
        successRate: 0.8,
      },
    ];
  }

  protected async executeTask(task: Task, _context: AgentContext): Promise<ExecutionResult> {
    switch (task.type) {
      case 'optimize-sequence':
        return this.optimizeSequence(task);
      case 'analyze-performance':
        return this.analyzePerformance(task);
      case 'rebalance-pipeline':
        return this.rebalancePipeline(task);
      default:
        throw new Error(`RevOps cannot handle task type: ${task.type}`);
    }
  }

  /**
   * Optimize a sequence for better performance
   */
  private async optimizeSequence(task: Task): Promise<ExecutionResult> {
    const input = task.input.data as {
      sequenceId: string;
      metrics: SequenceMetrics;
      constraints?: {
        maxChanges: number;
        preserveElements: string[];
      };
    };

    // Get baseline for comparison
    const baseline = this.performanceBaselines.get(input.sequenceId) || input.metrics;

    // Analyze gaps
    const gaps = this.identifyPerformanceGaps(input.metrics, baseline);

    // Generate recommendations
    const recommendations = await this.generateRecommendations(gaps, input.metrics);

    // Filter by constraints
    const filtered = input.constraints?.maxChanges
      ? recommendations.slice(0, input.constraints.maxChanges)
      : recommendations;

    // Calculate projected improvement
    const projectedImprovement = this.projectImprovement(filtered, input.metrics);

    // Determine priority
    const priority = this.determinePriority(input.metrics, projectedImprovement);

    const optimization: SequenceOptimization = {
      sequenceId: input.sequenceId,
      currentPerformance: input.metrics,
      recommendations: filtered,
      projectedImprovement,
      priority,
    };

    // Store for learning
    this.optimizationHistory.set(input.sequenceId, filtered);
    this.performanceBaselines.set(input.sequenceId, input.metrics);

    return {
      success: recommendations.length > 0,
      output: optimization,
      artifacts: [optimization],
      learnings: [
        `Identified ${recommendations.length} optimization opportunities`,
        `Projected ${(projectedImprovement * 100).toFixed(1)}% improvement`,
        ...gaps.map(g => `Gap: ${g}`),
      ],
    };
  }

  /**
   * Analyze overall performance across sequences and campaigns
   */
  private async analyzePerformance(task: Task): Promise<ExecutionResult> {
    const input = task.input.data as {
      timeRange: { start: Date; end: Date };
      granularity: 'daily' | 'weekly' | 'monthly';
      segments?: string[];
    };

    await this.simulateLatency(1000);

    // Generate performance analysis
    const analysis = {
      summary: this.generatePerformanceSummary(),
      trends: this.analyzeTrends(input.granularity),
      anomalies: this.detectAnomalies(),
      opportunities: this.identifyOpportunities(),
      risks: this.identifyRisks(),
      recommendations: this.generateStrategicRecommendations(),
    };

    return {
      success: true,
      output: analysis,
      artifacts: [analysis],
      learnings: [
        `Analyzed performance over ${input.granularity} granularity`,
        `Found ${analysis.anomalies.length} anomalies`,
        `Identified ${analysis.opportunities.length} opportunities`,
      ],
    };
  }

  /**
   * Rebalance pipeline stages and routing
   */
  private async rebalancePipeline(task: Task): Promise<ExecutionResult> {
    const input = task.input.data as {
      pipeline: Pipeline;
      targetMetrics?: Partial<PipelineMetrics>;
    };

    // Analyze current distribution
    this.analyzePipelineDistribution(input.pipeline);

    // Identify bottlenecks
    const bottlenecks = this.identifyBottlenecks(input.pipeline);

    // Generate moves
    const moves = this.generatePipelineMoves(input.pipeline, bottlenecks);

    // Project impact
    const projectedImpact = this.projectPipelineImpact(moves, input.pipeline);

    // Identify risks
    const risks = this.assessRebalanceRisks(moves);

    const rebalance: PipelineRebalance = {
      moves,
      projectedImpact,
      risks,
    };

    return {
      success: moves.length > 0,
      output: rebalance,
      artifacts: [rebalance],
      learnings: [
        `Proposed ${moves.length} pipeline moves`,
        `Projected velocity change: ${(projectedImpact.velocityChange * 100).toFixed(1)}%`,
        `Identified ${bottlenecks.length} bottlenecks`,
      ],
    };
  }

  // === Analysis Methods ===

  private identifyPerformanceGaps(_current: SequenceMetrics, baseline: SequenceMetrics): string[] {
    const gaps: string[] = [];

    if (_current.openRate < baseline.openRate * 0.9) {
      gaps.push(
        `Open rate down ${((1 - _current.openRate / baseline.openRate) * 100).toFixed(1)}%`
      );
    }
    if (_current.replyRate < baseline.replyRate * 0.9) {
      gaps.push(
        `Reply rate down ${((1 - _current.replyRate / baseline.replyRate) * 100).toFixed(1)}%`
      );
    }
    if (_current.bounceRate > baseline.bounceRate * 1.1) {
      gaps.push(
        `Bounce rate up ${((_current.bounceRate / baseline.bounceRate - 1) * 100).toFixed(1)}%`
      );
    }
    if (_current.unsubscribeRate > 0.02) {
      gaps.push('Unsubscribe rate exceeds threshold');
    }
    if (_current.velocity < baseline.velocity * 0.8) {
      gaps.push('Pipeline velocity declining');
    }

    return gaps;
  }

  private async generateRecommendations(
    _gaps: string[],
    metrics: SequenceMetrics
  ): Promise<Recommendation[]> {
    await this.simulateLatency(500);

    const recommendations: Recommendation[] = [];

    // Open rate recommendations
    if (metrics.openRate < 0.25) {
      recommendations.push({
        type: 'content',
        action: 'Revise subject lines with curiosity triggers',
        impact: 0.15,
        effort: 'low',
        reasoning: 'Low open rate indicates subject line fatigue or poor relevance',
        implementation: 'A/B test 3 new subject line variants with personalization',
      });
      recommendations.push({
        type: 'timing',
        action: 'Shift send times to morning slots',
        impact: 0.08,
        effort: 'low',
        reasoning: 'Morning sends typically see 15-20% higher open rates',
        implementation: 'Update sequence timing to 7-9 AM local time',
      });
    }

    // Reply rate recommendations
    if (metrics.replyRate < 0.05) {
      recommendations.push({
        type: 'content',
        action: 'Increase personalization depth',
        impact: 0.2,
        effort: 'medium',
        reasoning: 'Generic messaging yields low engagement',
        implementation: 'Add signal-based personalization to first two touches',
      });
      recommendations.push({
        type: 'pacing',
        action: 'Adjust follow-up cadence',
        impact: 0.1,
        effort: 'low',
        reasoning: 'Current pacing may be too aggressive or too slow',
        implementation: 'Test 3-day vs 5-day follow-up intervals',
      });
    }

    // Bounce rate recommendations
    if (metrics.bounceRate > 0.05) {
      recommendations.push({
        type: 'targeting',
        action: 'Improve email verification process',
        impact: 0.12,
        effort: 'medium',
        reasoning: 'High bounces hurt deliverability reputation',
        implementation: 'Add real-time email verification before enrollment',
      });
    }

    // Channel recommendations
    if (metrics.meetingRate < 0.02) {
      recommendations.push({
        type: 'channel',
        action: 'Add multi-channel touches',
        impact: 0.25,
        effort: 'high',
        reasoning: 'Single-channel sequences plateau quickly',
        implementation: 'Insert LinkedIn touch after email 2, call after email 4',
      });
    }

    // Sort by impact/effort ratio
    recommendations.sort((a, b) => {
      const effortWeight = { low: 1, medium: 2, high: 3 };
      return b.impact / effortWeight[b.effort] - a.impact / effortWeight[a.effort];
    });

    return recommendations;
  }

  private projectImprovement(recommendations: Recommendation[], _current: SequenceMetrics): number {
    // Calculate combined improvement (with diminishing returns)
    let totalImprovement = 0;
    let diminishingFactor = 1;

    for (const rec of recommendations) {
      totalImprovement += rec.impact * diminishingFactor;
      diminishingFactor *= 0.8; // Each subsequent improvement is less impactful
    }

    return Math.min(totalImprovement, 0.5); // Cap at 50% improvement
  }

  private determinePriority(
    metrics: SequenceMetrics,
    projectedImprovement: number
  ): 'critical' | 'high' | 'medium' | 'low' {
    // Critical: Very poor performance
    if (metrics.replyRate < 0.01 || metrics.bounceRate > 0.1) return 'critical';

    // High: Significant improvement potential
    if (projectedImprovement > 0.25) return 'high';

    // Medium: Moderate improvement potential
    if (projectedImprovement > 0.1) return 'medium';

    return 'low';
  }

  private generatePerformanceSummary(): Record<string, unknown> {
    return {
      overallHealth: 0.72,
      activeCampaigns: 12,
      accountsInPipeline: 847,
      weekOverWeekChange: 0.08,
      topPerformingSequence: 'Enterprise Outbound Q1',
      underperformingSequences: ['SMB Cold Outreach', 'Re-engagement Flow'],
    };
  }

  private analyzeTrends(
    _granularity: string
  ): Array<{ period: string; metric: string; value: number; trend: number }> {
    return [
      { period: 'current', metric: 'reply_rate', value: 0.045, trend: 0.12 },
      { period: 'current', metric: 'meeting_rate', value: 0.018, trend: -0.05 },
      { period: 'current', metric: 'velocity', value: 15.3, trend: 0.08 },
      { period: 'previous', metric: 'reply_rate', value: 0.04, trend: 0.05 },
    ];
  }

  private detectAnomalies(): Array<{ type: string; severity: string; description: string }> {
    return [
      { type: 'spike', severity: 'warning', description: 'Unusual bounce rate spike on Tuesday' },
      { type: 'drop', severity: 'info', description: 'Reply rate dip during holiday period' },
    ];
  }

  private identifyOpportunities(): string[] {
    return [
      'High-intent accounts in Stage 2 showing delayed response - consider phone touch',
      'Subject line A outperforming B by 35% - expand winning variant',
      'Tech industry segment responding well to data-driven messaging',
    ];
  }

  private identifyRisks(): string[] {
    return [
      'Sender reputation declining - reduce daily send volume',
      'Approaching deliverability threshold with current bounce rate',
      'Pipeline velocity slowing in Enterprise segment',
    ];
  }

  private generateStrategicRecommendations(): Recommendation[] {
    return [
      {
        type: 'targeting',
        action: 'Narrow ICP focus to high-performing segments',
        impact: 0.18,
        effort: 'medium',
        reasoning: 'Analysis shows 80% of conversions from 3 segments',
        implementation: 'Reallocate budget to Tech, Healthcare, Finance verticals',
      },
    ];
  }

  private analyzePipelineDistribution(pipeline: Pipeline): Record<string, number> {
    const distribution: Record<string, number> = {};
    for (const stage of pipeline.stages) {
      const count = pipeline.accounts.filter(a => a.stageId === stage.id).length;
      distribution[stage.name] = count;
    }
    return distribution;
  }

  private identifyBottlenecks(
    pipeline: Pipeline
  ): Array<{ stageId: string; severity: number; cause: string }> {
    const bottlenecks: Array<{ stageId: string; severity: number; cause: string }> = [];

    for (const stage of pipeline.stages) {
      const accountsInStage = pipeline.accounts.filter(a => a.stageId === stage.id).length;
      const nextStage = pipeline.stages[stage.position + 1];

      if (nextStage) {
        const accountsInNext = pipeline.accounts.filter(a => a.stageId === nextStage.id).length;
        const ratio = accountsInStage / Math.max(accountsInNext, 1);

        if (ratio > 3) {
          bottlenecks.push({
            stageId: stage.id,
            severity: Math.min(ratio / 5, 1),
            cause: `${ratio.toFixed(1)}x accumulation vs next stage`,
          });
        }
      }
    }

    return bottlenecks;
  }

  private generatePipelineMoves(
    pipeline: Pipeline,
    bottlenecks: Array<{ stageId: string; severity: number }>
  ): PipelineMove[] {
    const moves: PipelineMove[] = [];

    for (const bottleneck of bottlenecks) {
      const stuckAccounts = pipeline.accounts
        .filter(a => a.stageId === bottleneck.stageId)
        .sort((a, b) => a.lastTouch.getTime() - b.lastTouch.getTime())
        .slice(0, 5);

      for (const account of stuckAccounts) {
        if (account.score < 30) {
          moves.push({
            accountId: account.id,
            fromStage: bottleneck.stageId,
            toStage: 'disqualified',
            reason: 'Low score and no recent engagement',
            action: 'Move to nurture track',
          });
        } else if (account.signals.includes('competitor-mention')) {
          moves.push({
            accountId: account.id,
            fromStage: bottleneck.stageId,
            toStage: 'competitive',
            reason: 'Active competitor evaluation',
            action: 'Escalate to competitive play',
          });
        }
      }
    }

    return moves;
  }

  private projectPipelineImpact(
    moves: PipelineMove[],
    _pipeline: Pipeline
  ): {
    velocityChange: number;
    conversionChange: number;
    revenueImpact: number;
  } {
    const disqualifiedMoves = moves.filter(m => m.toStage === 'disqualified').length;
    const escalatedMoves = moves.filter(m => m.toStage === 'competitive').length;

    return {
      velocityChange: 0.15 + disqualifiedMoves * 0.02,
      conversionChange: escalatedMoves * 0.03 - disqualifiedMoves * 0.01,
      revenueImpact: escalatedMoves * 5000 - disqualifiedMoves * 1000,
    };
  }

  private assessRebalanceRisks(moves: PipelineMove[]): string[] {
    const risks: string[] = [];

    const disqualifiedCount = moves.filter(m => m.toStage === 'disqualified').length;
    if (disqualifiedCount > 10) {
      risks.push('Large number of disqualifications may indicate targeting issues');
    }

    if (moves.length > 20) {
      risks.push('Many simultaneous moves may disrupt rep workflows');
    }

    return risks;
  }

  private initializeRoutingRules(): void {
    this.routingRules = [
      { condition: 'score > 80', action: 'route-to-ae', priority: 1 },
      { condition: 'signal = funding-round', action: 'route-to-enterprise', priority: 2 },
      { condition: 'industry = healthcare', action: 'route-to-vertical-specialist', priority: 3 },
    ];
  }

  private simulateLatency(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms * 0.1));
  }

  protected describeStrategy(_task: Task): string {
    return `RevOps will analyze and optimize using ${this.routingRules.length} routing rules`;
  }
}

interface RoutingRule {
  condition: string;
  action: string;
  priority: number;
}

export default RevOpsAgent;
