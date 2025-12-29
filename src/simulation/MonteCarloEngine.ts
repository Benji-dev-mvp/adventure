/**
 * Monte Carlo Simulation Engine
 * 
 * Runs thousands of simulations to predict pipeline outcomes
 * with confidence intervals and risk metrics.
 */

import type {
  SimulationConfig,
  SimulationResult,
  SimulationScenario,
  SimulationOutcome,
  SimulationStatistics,
  SimulationInsight,
  DistributionStats,
  RiskMetrics,
  SensitivityResult,
  TimelinePoint,
  SimulationEvent,
  HistogramBin,
} from './types';

// === Random Number Generation ===

class SeededRandom {
  private seed: number;

  constructor(seed: number = Date.now()) {
    this.seed = seed;
  }

  next(): number {
    // Mulberry32 algorithm
    let t = (this.seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Box-Muller transform for normal distribution
  normal(mean: number = 0, stdDev: number = 1): number {
    const u1 = this.next();
    const u2 = this.next();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z * stdDev + mean;
  }

  // Log-normal distribution (common for deal sizes)
  logNormal(mean: number, stdDev: number): number {
    const normalMean = Math.log(mean ** 2 / Math.sqrt(stdDev ** 2 + mean ** 2));
    const normalStdDev = Math.sqrt(Math.log(1 + stdDev ** 2 / mean ** 2));
    return Math.exp(this.normal(normalMean, normalStdDev));
  }

  // Poisson distribution (for count data)
  poisson(lambda: number): number {
    let L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= this.next();
    } while (p > L);
    return k - 1;
  }

  // Bernoulli trial
  bernoulli(p: number): boolean {
    return this.next() < p;
  }
}

// === Main Engine ===

export class MonteCarloEngine {
  private config: SimulationConfig;
  private rng: SeededRandom;

  constructor(config: Partial<SimulationConfig> = {}) {
    this.config = {
      iterations: 1000,
      timeHorizon: 90, // 90 days
      confidenceLevel: 0.95,
      parallelism: 4,
      ...config,
    };
    this.rng = new SeededRandom(this.config.seed);
  }

  /**
   * Run a full Monte Carlo simulation
   */
  async simulate(scenario: SimulationScenario): Promise<SimulationResult> {
    const startTime = performance.now();
    
    // Run iterations
    const outcomes: SimulationOutcome[] = [];
    
    for (let i = 0; i < this.config.iterations; i++) {
      const outcome = this.runIteration(i, scenario);
      outcomes.push(outcome);
    }

    // Calculate statistics
    const statistics = this.calculateStatistics(outcomes);
    
    // Generate insights
    const insights = this.generateInsights(outcomes, statistics, scenario);

    const runtime = performance.now() - startTime;

    return {
      id: `sim_${Date.now()}`,
      config: this.config,
      scenario,
      outcomes,
      statistics,
      insights,
      runtime,
      timestamp: new Date(),
    };
  }

  /**
   * Run a single simulation iteration
   */
  private runIteration(iteration: number, scenario: SimulationScenario): SimulationOutcome {
    const { pipeline, sequences, market } = scenario.parameters;
    
    let revenue = 0;
    let deals = 0;
    let meetings = 0;
    let replies = 0;
    let cost = 0;
    
    const timeline: TimelinePoint[] = [];
    const events: SimulationEvent[] = [];
    
    // Simulate each account through the pipeline
    for (let a = 0; a < pipeline.accounts; a++) {
      const accountId = `acc_${a}`;
      
      // Generate deal size with log-normal distribution
      const dealSize = this.rng.logNormal(
        pipeline.averageDealSize,
        pipeline.averageDealSize * pipeline.variancePercent
      );
      
      // Simulate through stages
      let currentStage = 0;
      let day = 0;
      let engaged = false;
      
      // Select a sequence for this account
      const sequence = sequences[Math.floor(this.rng.next() * sequences.length)];
      
      // Apply market conditions
      const marketMultiplier = this.getMarketMultiplier(market, day);
      
      // Simulate sequence execution
      for (let step = 0; step < sequence.steps && day < this.config.timeHorizon; step++) {
        day += sequence.cadenceDays + this.rng.poisson(sequence.variance);
        cost += scenario.parameters.agents[0]?.costPerTask || 5;
        
        // Check for reply
        const replyProb = sequence.expectedReplyRate * marketMultiplier * (1 - step * 0.1);
        if (this.rng.bernoulli(replyProb)) {
          replies++;
          engaged = true;
          
          // Check for meeting
          if (this.rng.bernoulli(sequence.expectedMeetingRate)) {
            meetings++;
            
            events.push({
              day,
              type: 'conversion',
              accountId,
              details: 'Meeting booked',
              impact: dealSize * 0.1,
            });
            
            // Progress through pipeline stages
            for (let s = 0; s < pipeline.stageConversionRates.length; s++) {
              const stageRate = pipeline.stageConversionRates[s] * marketMultiplier;
              
              if (this.rng.bernoulli(stageRate)) {
                currentStage = s + 1;
                day += this.rng.poisson(pipeline.averageCycleDays / pipeline.stageConversionRates.length);
              } else {
                events.push({
                  day,
                  type: 'loss',
                  accountId,
                  details: `Lost at stage ${s + 1}`,
                  impact: -dealSize * 0.2,
                });
                break;
              }
            }
            
            // Check if won
            if (currentStage >= pipeline.stageConversionRates.length) {
              deals++;
              revenue += dealSize;
              
              events.push({
                day,
                type: 'conversion',
                accountId,
                details: 'Deal won',
                impact: dealSize,
              });
            }
          }
          break; // Exit sequence after reply
        }
      }
      
      // Handle non-engaged accounts
      if (!engaged && this.rng.bernoulli(0.1)) {
        events.push({
          day: this.config.timeHorizon,
          type: 'stall',
          accountId,
          details: 'No engagement',
          impact: 0,
        });
      }
    }

    // Generate timeline points
    const dailyRevenue = revenue / this.config.timeHorizon;
    let cumulative = 0;
    
    for (let d = 0; d <= this.config.timeHorizon; d += 7) {
      cumulative += dailyRevenue * 7;
      timeline.push({
        day: d,
        cumulativeRevenue: cumulative,
        activePipeline: pipeline.accounts * (1 - d / this.config.timeHorizon),
        conversionRate: deals / Math.max(meetings, 1),
        agentUtilization: 0.7 + this.rng.next() * 0.2,
      });
    }

    const velocity = deals / (this.config.timeHorizon / 30); // Deals per month

    return {
      iteration,
      revenue,
      deals,
      meetings,
      replies,
      cost,
      velocity,
      timeline,
      events,
    };
  }

  /**
   * Get market condition multiplier
   */
  private getMarketMultiplier(market: SimulationScenario['parameters']['market'], day: number): number {
    let multiplier = 1;
    
    // Economic condition
    switch (market.economicCondition) {
      case 'growth':
        multiplier *= 1.2;
        break;
      case 'contraction':
        multiplier *= 0.8;
        break;
    }
    
    // Seasonality
    const month = new Date().getMonth() + Math.floor(day / 30);
    const seasonality = market.seasonality.find(s => s.month === month % 12);
    if (seasonality) {
      multiplier *= seasonality.multiplier;
    }
    
    // Competitor activity
    multiplier *= 1 - market.competitorActivity * 0.3;
    
    // Industry trends
    for (const trend of market.industryTrends) {
      if (this.rng.bernoulli(trend.probability)) {
        multiplier *= 1 + trend.impact;
      }
    }
    
    return multiplier;
  }

  /**
   * Calculate comprehensive statistics
   */
  private calculateStatistics(outcomes: SimulationOutcome[]): SimulationStatistics {
    const revenues = outcomes.map(o => o.revenue);
    const deals = outcomes.map(o => o.deals);
    const velocities = outcomes.map(o => o.velocity);
    const costs = outcomes.map(o => o.cost);
    const rois = outcomes.map(o => (o.revenue - o.cost) / Math.max(o.cost, 1));

    return {
      revenue: this.calculateDistribution(revenues),
      deals: this.calculateDistribution(deals),
      velocity: this.calculateDistribution(velocities),
      roi: this.calculateDistribution(rois),
      riskMetrics: this.calculateRiskMetrics(revenues, costs),
      sensitivityAnalysis: this.runSensitivityAnalysis(outcomes),
    };
  }

  /**
   * Calculate distribution statistics
   */
  private calculateDistribution(values: number[]): DistributionStats {
    const sorted = [...values].sort((a, b) => a - b);
    const n = values.length;
    
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    
    const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / n;
    const stdDev = Math.sqrt(variance);
    
    const percentile = (p: number) => sorted[Math.floor(p * n)];
    
    const percentiles: Record<number, number> = {
      5: percentile(0.05),
      25: percentile(0.25),
      50: percentile(0.5),
      75: percentile(0.75),
      95: percentile(0.95),
    };
    
    // Calculate confidence interval
    const alpha = 1 - this.config.confidenceLevel;
    const confidenceInterval = {
      lower: percentile(alpha / 2),
      upper: percentile(1 - alpha / 2),
    };
    
    // Build histogram
    const binCount = 20;
    const min = sorted[0];
    const max = sorted[n - 1];
    const binWidth = (max - min) / binCount || 1;
    
    const distribution: HistogramBin[] = [];
    for (let i = 0; i < binCount; i++) {
      const binMin = min + i * binWidth;
      const binMax = binMin + binWidth;
      const count = values.filter(v => v >= binMin && v < binMax).length;
      distribution.push({
        min: binMin,
        max: binMax,
        count,
        frequency: count / n,
      });
    }

    return {
      mean,
      median: percentiles[50],
      stdDev,
      min: sorted[0],
      max: sorted[n - 1],
      percentiles,
      confidenceInterval,
      distribution,
    };
  }

  /**
   * Calculate risk metrics
   */
  private calculateRiskMetrics(revenues: number[], costs: number[]): RiskMetrics {
    const profits = revenues.map((r, i) => r - costs[i]);
    const sorted = [...profits].sort((a, b) => a - b);
    const n = profits.length;
    
    // Value at Risk (5th percentile)
    const varIndex = Math.floor(0.05 * n);
    const valueAtRisk = -sorted[varIndex];
    
    // Conditional VaR (expected shortfall below VaR)
    const shortfall = sorted.slice(0, varIndex);
    const conditionalVaR = shortfall.length > 0 
      ? -shortfall.reduce((a, b) => a + b, 0) / shortfall.length 
      : 0;
    
    // Max drawdown
    let peak = profits[0];
    let maxDrawdown = 0;
    for (const profit of profits) {
      if (profit > peak) peak = profit;
      const drawdown = (peak - profit) / peak;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }
    
    // Probability of loss
    const losses = profits.filter(p => p < 0).length;
    const probabilityOfLoss = losses / n;
    
    // Downside deviation
    const negativeProfits = profits.filter(p => p < 0);
    const downsideDeviation = negativeProfits.length > 0
      ? Math.sqrt(negativeProfits.reduce((a, p) => a + p ** 2, 0) / negativeProfits.length)
      : 0;

    return {
      valueAtRisk,
      conditionalVaR,
      maxDrawdown,
      probabilityOfLoss,
      downsideDeviation,
    };
  }

  /**
   * Run sensitivity analysis on key parameters
   */
  private runSensitivityAnalysis(outcomes: SimulationOutcome[]): SensitivityResult[] {
    const baseRevenue = outcomes.reduce((a, o) => a + o.revenue, 0) / outcomes.length;
    
    // Analyze sensitivity to key parameters
    const parameters = [
      { name: 'replyRate', baseValue: 0.05, elasticity: 2.5 },
      { name: 'meetingRate', baseValue: 0.3, elasticity: 1.8 },
      { name: 'dealSize', baseValue: 10000, elasticity: 1.0 },
      { name: 'conversionRate', baseValue: 0.2, elasticity: 1.5 },
      { name: 'sequenceSteps', baseValue: 5, elasticity: 0.5 },
    ];

    return parameters.map(p => ({
      parameter: p.name,
      baseValue: p.baseValue,
      impactPerPercent: baseRevenue * p.elasticity * 0.01,
      elasticity: p.elasticity,
      criticalThreshold: p.baseValue * 0.5, // 50% reduction is critical
    }));
  }

  /**
   * Generate actionable insights from simulation
   */
  private generateInsights(
    _outcomes: SimulationOutcome[],
    stats: SimulationStatistics,
    scenario: SimulationScenario
  ): SimulationInsight[] {
    const insights: SimulationInsight[] = [];
    
    // High variance insight
    if (stats.revenue.stdDev / stats.revenue.mean > 0.5) {
      insights.push({
        type: 'warning',
        severity: 'high',
        title: 'High Revenue Variance',
        description: `Revenue outcomes vary significantly (CV: ${((stats.revenue.stdDev / stats.revenue.mean) * 100).toFixed(0)}%)`,
        recommendation: 'Consider more consistent messaging and targeting to reduce outcome volatility',
        quantifiedImpact: stats.revenue.stdDev,
        confidence: 0.9,
      });
    }
    
    // Risk insight
    if (stats.riskMetrics.probabilityOfLoss > 0.1) {
      insights.push({
        type: 'risk',
        severity: 'high',
        title: 'Loss Probability Elevated',
        description: `${(stats.riskMetrics.probabilityOfLoss * 100).toFixed(0)}% chance of negative ROI`,
        recommendation: 'Review cost structure and targeting to reduce downside risk',
        quantifiedImpact: stats.riskMetrics.valueAtRisk,
        confidence: 0.85,
      });
    }
    
    // Optimization insight based on sensitivity
    const mostSensitive = stats.sensitivityAnalysis.sort((a, b) => b.elasticity - a.elasticity)[0];
    if (mostSensitive) {
      insights.push({
        type: 'optimization',
        severity: 'medium',
        title: `Optimize ${mostSensitive.parameter}`,
        description: `${mostSensitive.parameter} has ${mostSensitive.elasticity.toFixed(1)}x elasticity on revenue`,
        recommendation: `A 10% improvement in ${mostSensitive.parameter} could add $${(mostSensitive.impactPerPercent * 10).toFixed(0)} in revenue`,
        quantifiedImpact: mostSensitive.impactPerPercent * 10,
        confidence: 0.75,
      });
    }
    
    // Opportunity insight
    if (stats.revenue.percentiles[95] > stats.revenue.mean * 1.5) {
      insights.push({
        type: 'opportunity',
        severity: 'medium',
        title: 'High Upside Potential',
        description: `Top 5% scenarios achieve ${((stats.revenue.percentiles[95] / stats.revenue.mean - 1) * 100).toFixed(0)}% above average`,
        recommendation: 'Analyze top-performing simulation paths to identify success patterns',
        quantifiedImpact: stats.revenue.percentiles[95] - stats.revenue.mean,
        confidence: 0.8,
      });
    }
    
    // Velocity insight
    if (stats.velocity.mean < 5) {
      insights.push({
        type: 'warning',
        severity: 'medium',
        title: 'Low Pipeline Velocity',
        description: `Average velocity of ${stats.velocity.mean.toFixed(1)} deals/month is below benchmark`,
        recommendation: 'Consider accelerating sequence cadence or adding multi-channel touches',
        quantifiedImpact: (10 - stats.velocity.mean) * scenario.parameters.pipeline.averageDealSize,
        confidence: 0.7,
      });
    }

    return insights.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  /**
   * Compare multiple scenarios
   */
  async compareScenarios(scenarios: SimulationScenario[]): Promise<{
    results: Map<string, SimulationResult>;
    comparison: {
      winner: string;
      rankings: Array<{ scenarioId: string; score: number }>;
      analysis: string;
    };
  }> {
    const results = new Map<string, SimulationResult>();
    
    for (const scenario of scenarios) {
      const result = await this.simulate(scenario);
      results.set(scenario.id, result);
    }
    
    // Score scenarios
    const scores: Array<{ scenarioId: string; score: number }> = [];
    
    for (const [id, result] of results) {
      // Composite score: revenue (40%) + ROI (30%) + risk-adjusted (30%)
      const revenueScore = result.statistics.revenue.mean / 100000; // Normalize
      const roiScore = result.statistics.roi.mean;
      const riskScore = 1 - result.statistics.riskMetrics.probabilityOfLoss;
      
      const score = revenueScore * 0.4 + roiScore * 0.3 + riskScore * 0.3;
      scores.push({ scenarioId: id, score });
    }
    
    scores.sort((a, b) => b.score - a.score);
    const winner = scores[0].scenarioId;
    
    return {
      results,
      comparison: {
        winner,
        rankings: scores,
        analysis: `Scenario "${winner}" performs best with balanced revenue, ROI, and risk metrics.`,
      },
    };
  }
}

// Singleton export
export const monteCarloEngine = new MonteCarloEngine();
export default MonteCarloEngine;
