/**
 * Benchmark Engine
 *
 * Anonymized industry benchmarks that let organizations
 * compare performance without exposing sensitive data.
 */

import type {
  Benchmark,
  BenchmarkCategory,
  BenchmarkSubmission,
  BenchmarkContext,
  BenchmarkComparison,
  BenchmarkInsight,
  BenchmarkRecommendation,
  DistributionData,
} from './types';

// === Default Benchmarks ===

const INDUSTRY_BENCHMARKS: Record<string, Partial<Benchmark>> = {
  'outbound-reply-rates': {
    name: 'Outbound Reply Rates',
    category: 'reply-rates',
    metrics: [
      {
        name: 'coldEmailReplyRate',
        description: 'Reply rate for first cold email',
        aggregation: 'percentile',
        unit: 'percent',
        distribution: {
          min: 0.005,
          max: 0.25,
          mean: 0.045,
          median: 0.035,
          stdDev: 0.03,
          percentiles: { 10: 0.015, 25: 0.025, 50: 0.035, 75: 0.055, 90: 0.08, 95: 0.12 },
          histogram: [
            { bucket: '0-1%', count: 150 },
            { bucket: '1-2%', count: 280 },
            { bucket: '2-3%', count: 320 },
            { bucket: '3-4%', count: 290 },
            { bucket: '4-5%', count: 220 },
            { bucket: '5-7%', count: 180 },
            { bucket: '7-10%', count: 100 },
            { bucket: '10%+', count: 60 },
          ],
          sampleSize: 1600,
        },
      },
      {
        name: 'sequenceReplyRate',
        description: 'Overall sequence reply rate',
        aggregation: 'percentile',
        unit: 'percent',
        distribution: {
          min: 0.02,
          max: 0.4,
          mean: 0.12,
          median: 0.1,
          stdDev: 0.06,
          percentiles: { 10: 0.05, 25: 0.07, 50: 0.1, 75: 0.15, 90: 0.22, 95: 0.28 },
          histogram: [
            { bucket: '0-5%', count: 180 },
            { bucket: '5-8%', count: 320 },
            { bucket: '8-12%', count: 380 },
            { bucket: '12-18%', count: 280 },
            { bucket: '18-25%', count: 160 },
            { bucket: '25%+', count: 80 },
          ],
          sampleSize: 1400,
        },
      },
    ],
    visibility: 'public',
  },

  'meeting-conversion': {
    name: 'Meeting Conversion Rates',
    category: 'meeting-conversion',
    metrics: [
      {
        name: 'replyToMeetingRate',
        description: 'Conversion rate from reply to meeting booked',
        aggregation: 'percentile',
        unit: 'percent',
        distribution: {
          min: 0.1,
          max: 0.6,
          mean: 0.28,
          median: 0.25,
          stdDev: 0.1,
          percentiles: { 10: 0.15, 25: 0.2, 50: 0.25, 75: 0.35, 90: 0.42, 95: 0.5 },
          histogram: [
            { bucket: '10-15%', count: 120 },
            { bucket: '15-20%', count: 200 },
            { bucket: '20-25%', count: 280 },
            { bucket: '25-30%', count: 240 },
            { bucket: '30-40%', count: 180 },
            { bucket: '40%+', count: 80 },
          ],
          sampleSize: 1100,
        },
      },
      {
        name: 'meetingShowRate',
        description: 'Percentage of booked meetings that occur',
        aggregation: 'percentile',
        unit: 'percent',
        distribution: {
          min: 0.5,
          max: 0.95,
          mean: 0.78,
          median: 0.8,
          stdDev: 0.1,
          percentiles: { 10: 0.65, 25: 0.72, 50: 0.8, 75: 0.85, 90: 0.9, 95: 0.92 },
          histogram: [
            { bucket: '50-65%', count: 80 },
            { bucket: '65-75%', count: 180 },
            { bucket: '75-80%', count: 300 },
            { bucket: '80-85%', count: 280 },
            { bucket: '85-90%', count: 160 },
            { bucket: '90%+', count: 100 },
          ],
          sampleSize: 1100,
        },
      },
    ],
    visibility: 'public',
  },

  'pipeline-velocity': {
    name: 'Pipeline Velocity',
    category: 'pipeline-velocity',
    metrics: [
      {
        name: 'averageSalesCycle',
        description: 'Average days from first touch to close',
        aggregation: 'percentile',
        unit: 'days',
        distribution: {
          min: 14,
          max: 180,
          mean: 62,
          median: 55,
          stdDev: 30,
          percentiles: { 10: 28, 25: 38, 50: 55, 75: 75, 90: 100, 95: 130 },
          histogram: [
            { bucket: '14-30', count: 150 },
            { bucket: '30-45', count: 250 },
            { bucket: '45-60', count: 280 },
            { bucket: '60-90', count: 220 },
            { bucket: '90-120', count: 120 },
            { bucket: '120+', count: 80 },
          ],
          sampleSize: 1100,
        },
      },
      {
        name: 'dealsPerRep',
        description: 'Closed deals per SDR/AE per month',
        aggregation: 'percentile',
        unit: 'deals',
        distribution: {
          min: 1,
          max: 25,
          mean: 6.5,
          median: 5,
          stdDev: 4,
          percentiles: { 10: 2, 25: 3, 50: 5, 75: 8, 90: 12, 95: 18 },
          histogram: [
            { bucket: '1-2', count: 100 },
            { bucket: '3-4', count: 220 },
            { bucket: '5-6', count: 280 },
            { bucket: '7-10', count: 200 },
            { bucket: '11-15', count: 120 },
            { bucket: '15+', count: 80 },
          ],
          sampleSize: 1000,
        },
      },
    ],
    visibility: 'public',
  },
};

// === Benchmark Engine ===

export class BenchmarkEngine {
  private benchmarks: Map<string, Benchmark> = new Map();
  private submissions: Map<string, BenchmarkSubmission[]> = new Map();

  constructor() {
    this.initializeBenchmarks();
  }

  /**
   * Initialize default benchmarks
   */
  private initializeBenchmarks(): void {
    for (const [key, partial] of Object.entries(INDUSTRY_BENCHMARKS)) {
      const benchmark: Benchmark = {
        id: key,
        name: partial.name!,
        category: partial.category!,
        metrics: partial.metrics!,
        participants: partial.metrics![0].distribution.sampleSize || 1000,
        lastUpdated: new Date(),
        visibility: partial.visibility || 'public',
      };
      this.benchmarks.set(key, benchmark);
      this.submissions.set(key, []);
    }
  }

  /**
   * Get benchmark by ID
   */
  getBenchmark(id: string): Benchmark | undefined {
    return this.benchmarks.get(id);
  }

  /**
   * Get all benchmarks
   */
  getAllBenchmarks(): Benchmark[] {
    return Array.from(this.benchmarks.values());
  }

  /**
   * Get benchmarks by category
   */
  getBenchmarksByCategory(category: BenchmarkCategory): Benchmark[] {
    return Array.from(this.benchmarks.values()).filter(b => b.category === category);
  }

  /**
   * Submit metrics for a benchmark
   */
  submitMetrics(
    benchmarkId: string,
    organizationId: string,
    metrics: Record<string, number>,
    context: BenchmarkContext
  ): BenchmarkSubmission | null {
    const benchmark = this.benchmarks.get(benchmarkId);
    if (!benchmark) return null;

    // Validate metrics
    for (const metricDef of benchmark.metrics) {
      if (metrics[metricDef.name] === undefined) {
        console.warn(`Missing metric: ${metricDef.name}`);
      }
    }

    const submission: BenchmarkSubmission = {
      benchmarkId,
      organizationId,
      metrics,
      context,
      submittedAt: new Date(),
      verified: false,
    };

    const submissions = this.submissions.get(benchmarkId) || [];
    submissions.push(submission);
    this.submissions.set(benchmarkId, submissions);

    // Update benchmark with new data
    this.updateBenchmarkDistribution(benchmarkId);

    return submission;
  }

  /**
   * Update benchmark distribution with new submission
   */
  private updateBenchmarkDistribution(benchmarkId: string): void {
    const benchmark = this.benchmarks.get(benchmarkId);
    const submissions = this.submissions.get(benchmarkId);
    if (!benchmark || !submissions || submissions.length === 0) return;

    for (const metricDef of benchmark.metrics) {
      const values = submissions
        .map(s => s.metrics[metricDef.name])
        .filter(v => v !== undefined)
        .sort((a, b) => a - b);

      if (values.length < 5) continue;

      // Recalculate distribution statistics
      const n = values.length;
      const sum = values.reduce((a, b) => a + b, 0);
      const mean = sum / n;
      const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / n;

      metricDef.distribution = {
        min: values[0],
        max: values[n - 1],
        mean,
        median: values[Math.floor(n / 2)],
        stdDev: Math.sqrt(variance),
        percentiles: {
          10: values[Math.floor(n * 0.1)],
          25: values[Math.floor(n * 0.25)],
          50: values[Math.floor(n * 0.5)],
          75: values[Math.floor(n * 0.75)],
          90: values[Math.floor(n * 0.9)],
          95: values[Math.floor(n * 0.95)],
        },
        histogram: this.calculateHistogram(values, 8),
        sampleSize: n,
      };
    }

    benchmark.participants = submissions.length;
    benchmark.lastUpdated = new Date();
  }

  /**
   * Calculate histogram buckets
   */
  private calculateHistogram(
    values: number[],
    bucketCount: number
  ): Array<{ bucket: string; count: number }> {
    if (values.length === 0) return [];

    const min = values[0];
    const max = values[values.length - 1];
    const bucketSize = (max - min) / bucketCount;

    const buckets: Array<{ bucket: string; count: number }> = [];

    for (let i = 0; i < bucketCount; i++) {
      const bucketMin = min + i * bucketSize;
      const bucketMax = bucketMin + bucketSize;
      const count = values.filter(
        v => v >= bucketMin && (i === bucketCount - 1 ? v <= bucketMax : v < bucketMax)
      ).length;

      const formatNum = (n: number) => (n >= 1 ? n.toFixed(0) : (n * 100).toFixed(0) + '%');

      buckets.push({
        bucket: `${formatNum(bucketMin)}-${formatNum(bucketMax)}`,
        count,
      });
    }

    return buckets;
  }

  /**
   * Compare organization metrics to benchmark
   */
  compareTooBenchmark(
    benchmarkId: string,
    yourMetrics: Record<string, number>
  ): BenchmarkComparison | null {
    const benchmark = this.benchmarks.get(benchmarkId);
    if (!benchmark) return null;

    const benchmarkMetrics: Record<string, DistributionData> = {};
    const percentileRanks: Record<string, number> = {};
    const insights: BenchmarkInsight[] = [];
    const recommendations: BenchmarkRecommendation[] = [];

    for (const metricDef of benchmark.metrics) {
      benchmarkMetrics[metricDef.name] = metricDef.distribution;

      const yourValue = yourMetrics[metricDef.name];
      if (yourValue === undefined) continue;

      // Calculate percentile rank
      const percentile = this.calculatePercentile(yourValue, metricDef.distribution);
      percentileRanks[metricDef.name] = percentile;

      // Generate insight
      const insight = this.generateInsight(
        metricDef.name,
        yourValue,
        percentile,
        metricDef.distribution
      );
      insights.push(insight);

      // Generate recommendation if underperforming
      if (insight.type === 'underperforming') {
        recommendations.push(
          this.generateRecommendation(metricDef.name, yourValue, metricDef.distribution)
        );
      }
    }

    return {
      benchmarkId,
      yourMetrics,
      benchmarkMetrics,
      percentileRanks,
      insights: insights.sort((a, b) => b.gap - a.gap),
      recommendations: recommendations.sort((a, b) => {
        const order = { high: 3, medium: 2, low: 1 };
        return order[b.priority] - order[a.priority];
      }),
    };
  }

  /**
   * Calculate percentile rank
   */
  private calculatePercentile(value: number, distribution: DistributionData): number {
    const percentiles = distribution.percentiles;
    const sortedPercentiles = Object.entries(percentiles)
      .map(([p, v]) => ({ percentile: Number(p), value: v }))
      .sort((a, b) => a.value - b.value);

    // Find where value fits
    for (let i = 0; i < sortedPercentiles.length; i++) {
      if (value < sortedPercentiles[i].value) {
        if (i === 0) return sortedPercentiles[i].percentile / 2;

        // Interpolate
        const prev = sortedPercentiles[i - 1];
        const curr = sortedPercentiles[i];
        const ratio = (value - prev.value) / (curr.value - prev.value);
        return prev.percentile + ratio * (curr.percentile - prev.percentile);
      }
    }

    return 99;
  }

  /**
   * Generate insight from comparison
   */
  private generateInsight(
    metric: string,
    yourValue: number,
    percentile: number,
    distribution: DistributionData
  ): BenchmarkInsight {
    const gap = yourValue - distribution.median;
    const gapPercent = gap / distribution.median;

    let type: BenchmarkInsight['type'];
    if (percentile >= 75) {
      type = 'outperforming';
    } else if (percentile >= 25) {
      type = 'average';
    } else {
      type = 'underperforming';
    }

    const formatValue = (v: number) => (v >= 1 ? v.toFixed(1) : (v * 100).toFixed(1) + '%');

    const descriptions: Record<BenchmarkInsight['type'], string> = {
      outperforming: `Your ${metric} (${formatValue(yourValue)}) is in the top ${(100 - percentile).toFixed(0)}% - ${formatValue(Math.abs(gap))} above median`,
      average: `Your ${metric} (${formatValue(yourValue)}) is near the median (${formatValue(distribution.median)})`,
      underperforming: `Your ${metric} (${formatValue(yourValue)}) is below ${percentile.toFixed(0)}% of peers - ${formatValue(Math.abs(gap))} below median`,
    };

    return {
      metric,
      type,
      percentile,
      gap: Math.abs(gapPercent),
      description: descriptions[type],
    };
  }

  /**
   * Generate recommendation for underperforming metric
   */
  private generateRecommendation(
    metric: string,
    yourValue: number,
    distribution: DistributionData
  ): BenchmarkRecommendation {
    const target = distribution.percentiles[50]; // Aim for median
    const improvement = target - yourValue;
    const improvementPercent = improvement / yourValue;

    const actions: Record<string, string> = {
      coldEmailReplyRate: 'Improve subject lines and personalization in first email',
      sequenceReplyRate: 'Optimize sequence length and add more touchpoints',
      replyToMeetingRate: 'Train on objection handling and improve CTA clarity',
      meetingShowRate: 'Add reminder emails and calendar integration',
      averageSalesCycle: 'Qualify leads better and streamline proposal process',
      dealsPerRep: 'Increase activity volume or improve targeting',
    };

    return {
      priority: improvementPercent > 0.5 ? 'high' : improvementPercent > 0.2 ? 'medium' : 'low',
      metric,
      action: actions[metric] || `Improve ${metric} to reach median performance`,
      expectedImprovement: improvementPercent,
      benchmarkTarget: target,
    };
  }

  /**
   * Get industry-filtered benchmark
   */
  getIndustryBenchmark(benchmarkId: string, industry: string): Benchmark | null {
    const benchmark = this.benchmarks.get(benchmarkId);
    const submissions = this.submissions.get(benchmarkId);

    if (!benchmark || !submissions) return null;

    // Filter submissions by industry
    const industrySubmissions = submissions.filter(
      s => s.context.industry.toLowerCase() === industry.toLowerCase()
    );

    if (industrySubmissions.length < 10) {
      return null; // Not enough data for industry-specific benchmark
    }

    // Create industry-specific benchmark
    const industryBenchmark: Benchmark = {
      ...benchmark,
      id: `${benchmarkId}-${industry}`,
      name: `${benchmark.name} (${industry})`,
      participants: industrySubmissions.length,
      metrics: benchmark.metrics.map(m => ({
        ...m,
        distribution: this.calculateDistribution(
          industrySubmissions.map(s => s.metrics[m.name]).filter(v => v !== undefined)
        ),
      })),
    };

    return industryBenchmark;
  }

  /**
   * Calculate distribution from values
   */
  private calculateDistribution(values: number[]): DistributionData {
    if (values.length === 0) {
      return {
        min: 0,
        max: 0,
        mean: 0,
        median: 0,
        stdDev: 0,
        percentiles: {},
        histogram: [],
        sampleSize: 0,
      };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    const sum = sorted.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const variance = sorted.reduce((acc, v) => acc + (v - mean) ** 2, 0) / n;

    return {
      min: sorted[0],
      max: sorted[n - 1],
      mean,
      median: sorted[Math.floor(n / 2)],
      stdDev: Math.sqrt(variance),
      percentiles: {
        10: sorted[Math.floor(n * 0.1)],
        25: sorted[Math.floor(n * 0.25)],
        50: sorted[Math.floor(n * 0.5)],
        75: sorted[Math.floor(n * 0.75)],
        90: sorted[Math.floor(n * 0.9)],
        95: sorted[Math.floor(n * 0.95)],
      },
      histogram: this.calculateHistogram(sorted, 6),
      sampleSize: n,
    };
  }

  /**
   * Get benchmark statistics
   */
  getStats(): {
    totalBenchmarks: number;
    totalSubmissions: number;
    categoryCoverage: Record<BenchmarkCategory, number>;
    averageParticipants: number;
  } {
    const benchmarks = Array.from(this.benchmarks.values());
    const allSubmissions = Array.from(this.submissions.values()).flat();

    const categoryCoverage: Record<string, number> = {};
    for (const b of benchmarks) {
      categoryCoverage[b.category] = (categoryCoverage[b.category] || 0) + 1;
    }

    return {
      totalBenchmarks: benchmarks.length,
      totalSubmissions: allSubmissions.length,
      categoryCoverage: categoryCoverage as Record<BenchmarkCategory, number>,
      averageParticipants:
        benchmarks.length > 0
          ? benchmarks.reduce((sum, b) => sum + b.participants, 0) / benchmarks.length
          : 0,
    };
  }
}

// Singleton export
export const benchmarkEngine = new BenchmarkEngine();
export default BenchmarkEngine;
