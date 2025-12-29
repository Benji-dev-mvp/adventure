/**
 * Strategy Stress Tester
 *
 * Tests strategies against extreme scenarios to identify
 * weaknesses and build robust go-to-market plans.
 */

import type {
  Strategy,
  StrategyComparison,
  ComparisonAnalysis,
  Tradeoff,
  SimulationScenario,
  StrategyRecommendation,
} from './types';
import { MonteCarloEngine } from './MonteCarloEngine';

// === Stress Test Scenarios ===

export interface StressTestScenario {
  id: string;
  name: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe' | 'catastrophic';
  modifiers: ScenarioModifiers;
}

interface ScenarioModifiers {
  replyRateMultiplier: number;
  meetingRateMultiplier: number;
  dealSizeMultiplier: number;
  cycleTimeMultiplier: number;
  costMultiplier: number;
  churnRateMultiplier: number;
}

const STRESS_SCENARIOS: StressTestScenario[] = [
  {
    id: 'economic-recession',
    name: 'Economic Recession',
    description: 'Severe economic downturn affecting all buying behavior',
    severity: 'severe',
    modifiers: {
      replyRateMultiplier: 0.5,
      meetingRateMultiplier: 0.6,
      dealSizeMultiplier: 0.7,
      cycleTimeMultiplier: 1.8,
      costMultiplier: 1.0,
      churnRateMultiplier: 1.5,
    },
  },
  {
    id: 'competitor-surge',
    name: 'Competitor Surge',
    description: 'Major competitor launches aggressive campaign',
    severity: 'moderate',
    modifiers: {
      replyRateMultiplier: 0.7,
      meetingRateMultiplier: 0.8,
      dealSizeMultiplier: 0.9,
      cycleTimeMultiplier: 1.3,
      costMultiplier: 1.2,
      churnRateMultiplier: 1.3,
    },
  },
  {
    id: 'market-saturation',
    name: 'Market Saturation',
    description: 'TAM exhaustion and prospect fatigue',
    severity: 'moderate',
    modifiers: {
      replyRateMultiplier: 0.6,
      meetingRateMultiplier: 0.7,
      dealSizeMultiplier: 1.0,
      cycleTimeMultiplier: 1.2,
      costMultiplier: 1.3,
      churnRateMultiplier: 1.1,
    },
  },
  {
    id: 'regulatory-change',
    name: 'Regulatory Change',
    description: 'New regulations impact outreach methods',
    severity: 'severe',
    modifiers: {
      replyRateMultiplier: 0.4,
      meetingRateMultiplier: 0.8,
      dealSizeMultiplier: 1.0,
      cycleTimeMultiplier: 1.5,
      costMultiplier: 1.4,
      churnRateMultiplier: 1.0,
    },
  },
  {
    id: 'budget-freeze',
    name: 'Industry Budget Freeze',
    description: 'Widespread budget freezes across target industry',
    severity: 'severe',
    modifiers: {
      replyRateMultiplier: 0.3,
      meetingRateMultiplier: 0.4,
      dealSizeMultiplier: 0.5,
      cycleTimeMultiplier: 2.5,
      costMultiplier: 1.0,
      churnRateMultiplier: 1.8,
    },
  },
  {
    id: 'team-turnover',
    name: 'Sales Team Turnover',
    description: 'High turnover impacts execution quality',
    severity: 'moderate',
    modifiers: {
      replyRateMultiplier: 0.8,
      meetingRateMultiplier: 0.7,
      dealSizeMultiplier: 0.85,
      cycleTimeMultiplier: 1.4,
      costMultiplier: 1.5,
      churnRateMultiplier: 1.2,
    },
  },
  {
    id: 'ai-disruption',
    name: 'AI Disruption',
    description: 'AI tools commoditize traditional outreach',
    severity: 'catastrophic',
    modifiers: {
      replyRateMultiplier: 0.2,
      meetingRateMultiplier: 0.5,
      dealSizeMultiplier: 0.6,
      cycleTimeMultiplier: 1.1,
      costMultiplier: 0.7,
      churnRateMultiplier: 2.0,
    },
  },
  {
    id: 'growth-mode',
    name: 'Growth Mode (Positive)',
    description: 'Market expansion with favorable conditions',
    severity: 'mild',
    modifiers: {
      replyRateMultiplier: 1.5,
      meetingRateMultiplier: 1.4,
      dealSizeMultiplier: 1.2,
      cycleTimeMultiplier: 0.7,
      costMultiplier: 1.1,
      churnRateMultiplier: 0.8,
    },
  },
];

// === Stress Test Results ===

export interface StressTestResult {
  strategyId: string;
  strategyName: string;
  baselineMetrics: StrategyMetrics;
  stressedMetrics: Map<string, StrategyMetrics>;
  resilience: ResilienceScore;
  vulnerabilities: Vulnerability[];
  recommendations: StrategyRecommendation[];
}

interface StrategyMetrics {
  expectedRevenue: number;
  expectedROI: number;
  winRate: number;
  velocity: number;
  cost: number;
  riskScore: number;
}

interface ResilienceScore {
  overall: number;
  economic: number;
  competitive: number;
  operational: number;
  regulatory: number;
  breakdown: Record<string, number>;
}

interface Vulnerability {
  scenario: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  impactDescription: string;
  metricDrop: number;
  mitigation: string;
}

// === Strategy Stress Tester ===

export class StrategyStressTester {
  private engine: MonteCarloEngine;
  private scenarios: StressTestScenario[];

  constructor(customScenarios?: StressTestScenario[]) {
    this.engine = new MonteCarloEngine({ iterations: 500 });
    this.scenarios = customScenarios || STRESS_SCENARIOS;
  }

  /**
   * Run stress test on a single strategy
   */
  async stressTestStrategy(
    strategy: Strategy,
    baseScenario: SimulationScenario
  ): Promise<StressTestResult> {
    // Run baseline simulation
    const baselineResult = await this.engine.simulate(baseScenario);
    const baselineMetrics = this.extractMetrics(baselineResult);

    // Run stressed simulations
    const stressedMetrics = new Map<string, StrategyMetrics>();

    for (const stressScenario of this.scenarios) {
      const stressedSimScenario = this.applyStressModifiers(baseScenario, stressScenario.modifiers);
      const result = await this.engine.simulate(stressedSimScenario);
      stressedMetrics.set(stressScenario.id, this.extractMetrics(result));
    }

    // Calculate resilience
    const resilience = this.calculateResilience(baselineMetrics, stressedMetrics);

    // Identify vulnerabilities
    const vulnerabilities = this.identifyVulnerabilities(baselineMetrics, stressedMetrics);

    // Generate recommendations
    const recommendations = this.generateRecommendations(strategy, vulnerabilities, resilience);

    return {
      strategyId: strategy.id,
      strategyName: strategy.name,
      baselineMetrics,
      stressedMetrics,
      resilience,
      vulnerabilities,
      recommendations,
    };
  }

  /**
   * Compare multiple strategies under stress
   */
  async compareStrategiesUnderStress(
    strategies: Strategy[],
    baseScenario: SimulationScenario
  ): Promise<StrategyComparison> {
    const results: StressTestResult[] = [];

    for (const strategy of strategies) {
      const result = await this.stressTestStrategy(strategy, baseScenario);
      results.push(result);
    }

    // Rank strategies
    const ranked = results.sort((a, b) => b.resilience.overall - a.resilience.overall);

    // Identify tradeoffs
    const tradeoffs = this.identifyTradeoffs(results);

    // Generate analysis
    const analysis = this.generateComparisonAnalysis(results);

    // Determine winner
    const winner = ranked[0];

    // Build results map for compatibility
    const resultsMap = new Map<string, any>();
    results.forEach(r => resultsMap.set(r.strategyId, r));

    return {
      strategies: strategies.map(s => ({
        strategy: s,
        score: results.find(r => r.strategyId === s.id)?.resilience.overall || 0,
        strengths: this.identifyStrengths(results.find(r => r.strategyId === s.id)!),
        weaknesses: this.identifyWeaknesses(results.find(r => r.strategyId === s.id)!),
        riskProfile: this.buildRiskProfile(results.find(r => r.strategyId === s.id)!),
      })),
      results: resultsMap,
      winner: {
        strategyId: winner.strategyId,
        reason: `Highest resilience score (${(winner.resilience.overall * 100).toFixed(0)}%) with balanced performance under stress`,
        margin: ranked.length > 1 ? winner.resilience.overall - ranked[1].resilience.overall : 0,
      },
      tradeoffs,
      analysis,
      recommendations: this.synthesizeRecommendations(results),
    };
  }

  /**
   * Extract key metrics from simulation result
   */
  private extractMetrics(result: any): StrategyMetrics {
    return {
      expectedRevenue: result.statistics.revenue.mean,
      expectedROI: result.statistics.roi.mean,
      winRate: result.statistics.deals.mean / Math.max(result.outcomes[0]?.meetings || 1, 1),
      velocity: result.statistics.velocity.mean,
      cost: result.outcomes.reduce((a: number, o: any) => a + o.cost, 0) / result.outcomes.length,
      riskScore: result.statistics.riskMetrics.probabilityOfLoss,
    };
  }

  /**
   * Apply stress modifiers to scenario
   */
  private applyStressModifiers(
    scenario: SimulationScenario,
    modifiers: ScenarioModifiers
  ): SimulationScenario {
    return {
      ...scenario,
      parameters: {
        ...scenario.parameters,
        pipeline: {
          ...scenario.parameters.pipeline,
          stageConversionRates: scenario.parameters.pipeline.stageConversionRates.map(
            r => r * modifiers.meetingRateMultiplier
          ),
          averageDealSize:
            scenario.parameters.pipeline.averageDealSize * modifiers.dealSizeMultiplier,
          averageCycleDays:
            scenario.parameters.pipeline.averageCycleDays * modifiers.cycleTimeMultiplier,
        },
        sequences: scenario.parameters.sequences.map(seq => ({
          ...seq,
          expectedReplyRate: seq.expectedReplyRate * modifiers.replyRateMultiplier,
          expectedMeetingRate: seq.expectedMeetingRate * modifiers.meetingRateMultiplier,
        })),
        agents: scenario.parameters.agents.map(agent => ({
          ...agent,
          costPerTask: agent.costPerTask * modifiers.costMultiplier,
        })),
      },
    };
  }

  /**
   * Calculate resilience scores
   */
  private calculateResilience(
    baseline: StrategyMetrics,
    stressed: Map<string, StrategyMetrics>
  ): ResilienceScore {
    const breakdown: Record<string, number> = {};

    for (const [scenarioId, metrics] of stressed) {
      // Resilience = how much performance is retained under stress
      const revenueRetention = metrics.expectedRevenue / Math.max(baseline.expectedRevenue, 1);
      const roiRetention = (metrics.expectedROI + 1) / Math.max(baseline.expectedROI + 1, 0.1);

      breakdown[scenarioId] = (revenueRetention + roiRetention) / 2;
    }

    // Category scores
    const economicScenarios = ['economic-recession', 'budget-freeze'];
    const competitiveScenarios = ['competitor-surge', 'ai-disruption'];
    const operationalScenarios = ['team-turnover', 'market-saturation'];
    const regulatoryScenarios = ['regulatory-change'];

    const categoryScore = (scenarios: string[]) => {
      const scores = scenarios.map(s => breakdown[s]).filter(s => s !== undefined);
      return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 1;
    };

    const economic = categoryScore(economicScenarios);
    const competitive = categoryScore(competitiveScenarios);
    const operational = categoryScore(operationalScenarios);
    const regulatory = categoryScore(regulatoryScenarios);

    const overall = (economic + competitive + operational + regulatory) / 4;

    return {
      overall: Math.min(overall, 1),
      economic: Math.min(economic, 1),
      competitive: Math.min(competitive, 1),
      operational: Math.min(operational, 1),
      regulatory: Math.min(regulatory, 1),
      breakdown,
    };
  }

  /**
   * Identify strategy vulnerabilities
   */
  private identifyVulnerabilities(
    baseline: StrategyMetrics,
    stressed: Map<string, StrategyMetrics>
  ): Vulnerability[] {
    const vulnerabilities: Vulnerability[] = [];

    for (const [scenarioId, metrics] of stressed) {
      const scenario = this.scenarios.find(s => s.id === scenarioId);
      if (!scenario) continue;

      const revenueDropPercent =
        ((baseline.expectedRevenue - metrics.expectedRevenue) /
          Math.max(baseline.expectedRevenue, 1)) *
        100;

      // Critical: >50% drop
      // High: >30% drop
      // Medium: >15% drop
      // Low: >5% drop

      if (revenueDropPercent > 5) {
        let severity: Vulnerability['severity'];
        if (revenueDropPercent > 50) severity = 'critical';
        else if (revenueDropPercent > 30) severity = 'high';
        else if (revenueDropPercent > 15) severity = 'medium';
        else severity = 'low';

        vulnerabilities.push({
          scenario: scenario.name,
          severity,
          impactDescription: `Revenue drops ${revenueDropPercent.toFixed(0)}% under ${scenario.name.toLowerCase()}`,
          metricDrop: revenueDropPercent,
          mitigation: this.suggestMitigation(scenarioId, revenueDropPercent),
        });
      }
    }

    return vulnerabilities.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  /**
   * Suggest mitigation for vulnerability
   */
  private suggestMitigation(scenarioId: string, _dropPercent: number): string {
    const mitigations: Record<string, string> = {
      'economic-recession':
        'Diversify into recession-resistant verticals, emphasize cost-savings messaging',
      'competitor-surge':
        'Strengthen differentiation, increase speed-to-value, build switching costs',
      'market-saturation':
        'Expand TAM with adjacent segments, invest in retention over acquisition',
      'regulatory-change':
        'Build compliance automation, diversify outreach channels, strengthen partnerships',
      'budget-freeze':
        'Offer flexible pricing, focus on existing customer expansion, reduce sales cycle',
      'team-turnover':
        'Automate more touchpoints, improve onboarding, build institutional knowledge',
      'ai-disruption': 'Emphasize human-AI collaboration, focus on relationship-driven deals',
      'growth-mode': 'Scale capacity, maintain quality at volume',
    };

    return mitigations[scenarioId] || 'Review strategy fundamentals and stress test regularly';
  }

  /**
   * Generate strategy recommendations
   */
  private generateRecommendations(
    _strategy: Strategy,
    vulnerabilities: Vulnerability[],
    resilience: ResilienceScore
  ): StrategyRecommendation[] {
    const recommendations: StrategyRecommendation[] = [];

    // Address critical vulnerabilities
    for (const vuln of vulnerabilities.filter(v => v.severity === 'critical')) {
      recommendations.push({
        priority: 'critical',
        action: vuln.mitigation,
        expectedImprovement: vuln.metricDrop * 0.3,
        effort: 'high',
        timeline: '1-3 months',
      });
    }

    // Low resilience areas
    if (resilience.economic < 0.5) {
      recommendations.push({
        priority: 'high',
        action: 'Develop recession playbook with adjusted messaging and pricing',
        expectedImprovement: 15,
        effort: 'medium',
        timeline: '2-4 weeks',
      });
    }

    if (resilience.competitive < 0.5) {
      recommendations.push({
        priority: 'high',
        action: 'Conduct competitive win/loss analysis and sharpen positioning',
        expectedImprovement: 10,
        effort: 'medium',
        timeline: '3-6 weeks',
      });
    }

    if (resilience.operational < 0.5) {
      recommendations.push({
        priority: 'medium',
        action: 'Increase automation and document tribal knowledge',
        expectedImprovement: 12,
        effort: 'high',
        timeline: '2-3 months',
      });
    }

    // General improvements
    recommendations.push({
      priority: 'medium',
      action: 'Implement quarterly stress testing as standard practice',
      expectedImprovement: 5,
      effort: 'low',
      timeline: 'Ongoing',
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Identify strategy strengths
   */
  private identifyStrengths(result: StressTestResult): string[] {
    const strengths: string[] = [];

    if (result.resilience.overall > 0.7) {
      strengths.push('Highly resilient under stress');
    }

    if (result.resilience.economic > 0.6) {
      strengths.push('Robust against economic downturns');
    }

    if (result.resilience.competitive > 0.6) {
      strengths.push('Strong competitive positioning');
    }

    if (result.baselineMetrics.expectedROI > 3) {
      strengths.push('Excellent baseline ROI');
    }

    if (result.baselineMetrics.velocity > 10) {
      strengths.push('High deal velocity');
    }

    return strengths;
  }

  /**
   * Identify strategy weaknesses
   */
  private identifyWeaknesses(result: StressTestResult): string[] {
    const weaknesses: string[] = [];

    for (const vuln of result.vulnerabilities.filter(
      v => v.severity === 'critical' || v.severity === 'high'
    )) {
      weaknesses.push(`Vulnerable to ${vuln.scenario}`);
    }

    if (result.resilience.economic < 0.4) {
      weaknesses.push('Fragile in economic stress');
    }

    if (result.baselineMetrics.riskScore > 0.2) {
      weaknesses.push('Elevated baseline risk');
    }

    return weaknesses;
  }

  /**
   * Build risk profile
   */
  private buildRiskProfile(result: StressTestResult): {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  } {
    const criticalVulns = result.vulnerabilities.filter(v => v.severity === 'critical').length;
    const highVulns = result.vulnerabilities.filter(v => v.severity === 'high').length;

    let level: 'low' | 'medium' | 'high';
    if (criticalVulns > 0 || highVulns > 2) {
      level = 'high';
    } else if (highVulns > 0 || result.resilience.overall < 0.5) {
      level = 'medium';
    } else {
      level = 'low';
    }

    const factors = result.vulnerabilities.slice(0, 3).map(v => v.scenario);

    return { level, factors };
  }

  /**
   * Identify tradeoffs between strategies
   */
  private identifyTradeoffs(results: StressTestResult[]): Tradeoff[] {
    const tradeoffs: Tradeoff[] = [];

    if (results.length < 2) return tradeoffs;

    // Compare pairs
    for (let i = 0; i < results.length; i++) {
      for (let j = i + 1; j < results.length; j++) {
        const a = results[i];
        const b = results[j];

        // Revenue vs Risk tradeoff
        if (
          a.baselineMetrics.expectedRevenue > b.baselineMetrics.expectedRevenue &&
          a.resilience.overall < b.resilience.overall
        ) {
          tradeoffs.push({
            strategy1: a.strategyId,
            strategy2: b.strategyId,
            dimension: 'Revenue vs Resilience',
            difference: a.baselineMetrics.expectedRevenue - b.baselineMetrics.expectedRevenue,
            significance: 'high',
            dimension1: 'Revenue',
            dimension2: 'Resilience',
            strategy1Impact: `${a.strategyName}: Higher revenue, lower resilience`,
            strategy2Impact: `${b.strategyName}: Lower revenue, higher resilience`,
            recommendation: 'Choose based on risk tolerance and market conditions',
          });
        }

        // Velocity vs Cost tradeoff
        if (
          a.baselineMetrics.velocity > b.baselineMetrics.velocity &&
          a.baselineMetrics.cost > b.baselineMetrics.cost
        ) {
          tradeoffs.push({
            strategy1: a.strategyId,
            strategy2: b.strategyId,
            dimension: 'Velocity vs Cost',
            difference: a.baselineMetrics.velocity - b.baselineMetrics.velocity,
            significance: 'medium',
            dimension1: 'Velocity',
            dimension2: 'Cost',
            strategy1Impact: `${a.strategyName}: Faster but more expensive`,
            strategy2Impact: `${b.strategyName}: Slower but cheaper`,
            recommendation: 'Consider runway and growth targets',
          });
        }
      }
    }

    return tradeoffs;
  }

  /**
   * Generate comparison analysis
   */
  private generateComparisonAnalysis(results: StressTestResult[]): ComparisonAnalysis {
    const sorted = [...results].sort((a, b) => b.resilience.overall - a.resilience.overall);

    const summary =
      sorted.length > 0
        ? `${sorted[0].strategyName} shows strongest overall resilience at ${(sorted[0].resilience.overall * 100).toFixed(0)}%.`
        : 'No strategies compared.';

    const keyDifferences = [];
    if (sorted.length >= 2) {
      const margin = sorted[0].resilience.overall - sorted[1].resilience.overall;
      keyDifferences.push(`Resilience gap between top strategies: ${(margin * 100).toFixed(1)}%`);

      const revenueDiff =
        sorted[0].baselineMetrics.expectedRevenue - sorted[1].baselineMetrics.expectedRevenue;
      keyDifferences.push(
        `Revenue difference: $${Math.abs(revenueDiff).toLocaleString()} (${revenueDiff > 0 ? 'first' : 'second'} strategy leads)`
      );
    }

    const contextualAdvice =
      sorted[0]?.resilience.economic < 0.5
        ? 'In uncertain economic conditions, consider diversifying approaches.'
        : 'Current market conditions favor the leading strategy.';

    // Build comparison arrays for required properties
    const revenueComparison = sorted.map((r, i) => ({
      strategyId: r.strategyId,
      revenue: r.baselineMetrics.expectedRevenue,
      rank: i + 1,
    }));

    const riskComparison = sorted.map((r, i) => ({
      strategyId: r.strategyId,
      risk: r.baselineMetrics.riskScore,
      rank: i + 1,
    }));

    const efficiencyComparison = sorted.map((r, i) => ({
      strategyId: r.strategyId,
      efficiency: r.baselineMetrics.expectedROI,
      rank: i + 1,
    }));

    return {
      revenueComparison,
      riskComparison,
      efficiencyComparison,
      tradeoffs: [],
      recommendation: contextualAdvice,
      summary,
      keyDifferences,
      contextualAdvice,
    };
  }

  /**
   * Synthesize recommendations across all strategies
   */
  private synthesizeRecommendations(results: StressTestResult[]): StrategyRecommendation[] {
    const allRecs = results.flatMap(r => r.recommendations);

    // Deduplicate by action
    const seen = new Set<string>();
    const unique = allRecs.filter(r => {
      if (seen.has(r.action)) return false;
      seen.add(r.action);
      return true;
    });

    // Sort by priority and return top 5
    return unique
      .sort((a, b) => {
        const order = { critical: 4, high: 3, medium: 2, low: 1 };
        return order[b.priority] - order[a.priority];
      })
      .slice(0, 5);
  }

  /**
   * Get available stress scenarios
   */
  getScenarios(): StressTestScenario[] {
    return this.scenarios;
  }

  /**
   * Add custom stress scenario
   */
  addScenario(scenario: StressTestScenario): void {
    this.scenarios.push(scenario);
  }
}

// Singleton export
export const strategyStressTester = new StrategyStressTester();
export default StrategyStressTester;
