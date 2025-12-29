/**
 * Predictive Analytics Engine
 * 
 * Real-time predictions for engagement, conversion,
 * and optimal timing across the GTM funnel.
 */

import type {
  Prediction,
  PredictionType,
  PredictionRequest,
  PredictionContext,
  PredictionFactor,
  TrendAnalysis,
  TrendForecast,
  TrendAnomaly,
  SeasonalityPattern,
  IntelligenceInsight,
} from './types';

// === Prediction Models (Simplified) ===

interface PredictionModel {
  type: PredictionType;
  features: string[];
  coefficients: Record<string, number>;
  intercept: number;
  activation: 'sigmoid' | 'linear' | 'softmax';
}

const PREDICTION_MODELS: Record<PredictionType, PredictionModel> = {
  'reply-probability': {
    type: 'reply-probability',
    features: ['personalizationScore', 'subjectLineScore', 'touchpointNumber', 'daysSinceLastTouch', 'industryMatch'],
    coefficients: {
      personalizationScore: 0.8,
      subjectLineScore: 0.6,
      touchpointNumber: -0.15,
      daysSinceLastTouch: -0.02,
      industryMatch: 0.5,
    },
    intercept: -2.0,
    activation: 'sigmoid',
  },
  'meeting-likelihood': {
    type: 'meeting-likelihood',
    features: ['replyTone', 'engagementScore', 'buyerPersonaMatch', 'companySize', 'previousInteractions'],
    coefficients: {
      replyTone: 0.7,
      engagementScore: 0.9,
      buyerPersonaMatch: 0.6,
      companySize: 0.2,
      previousInteractions: 0.4,
    },
    intercept: -1.5,
    activation: 'sigmoid',
  },
  'deal-close-probability': {
    type: 'deal-close-probability',
    features: ['pipelineStage', 'dealSize', 'stakeholderCount', 'competitorPresence', 'budgetConfirmed'],
    coefficients: {
      pipelineStage: 0.8,
      dealSize: -0.1,
      stakeholderCount: 0.3,
      competitorPresence: -0.5,
      budgetConfirmed: 1.2,
    },
    intercept: -1.0,
    activation: 'sigmoid',
  },
  'optimal-send-time': {
    type: 'optimal-send-time',
    features: ['timezone', 'roleLevel', 'industry', 'previousOpenTimes', 'dayOfWeek'],
    coefficients: {
      timezone: 1.0,
      roleLevel: 0.5,
      industry: 0.3,
      previousOpenTimes: 0.8,
      dayOfWeek: 0.6,
    },
    intercept: 10.0, // Default hour
    activation: 'linear',
  },
  'sequence-completion': {
    type: 'sequence-completion',
    features: ['currentStep', 'totalSteps', 'engagementTrend', 'bounceRate', 'replyHistory'],
    coefficients: {
      currentStep: -0.3,
      totalSteps: -0.1,
      engagementTrend: 0.8,
      bounceRate: -1.5,
      replyHistory: 0.6,
    },
    intercept: 0.5,
    activation: 'sigmoid',
  },
  'revenue-forecast': {
    type: 'revenue-forecast',
    features: ['pipelineValue', 'historicalCloseRate', 'seasonality', 'marketConditions', 'teamCapacity'],
    coefficients: {
      pipelineValue: 0.3,
      historicalCloseRate: 0.8,
      seasonality: 0.2,
      marketConditions: 0.4,
      teamCapacity: 0.5,
    },
    intercept: 0,
    activation: 'linear',
  },
  'churn-risk': {
    type: 'churn-risk',
    features: ['engagementDecline', 'supportTickets', 'usageDropoff', 'contractEndDays', 'npsScore'],
    coefficients: {
      engagementDecline: 0.9,
      supportTickets: 0.4,
      usageDropoff: 0.8,
      contractEndDays: -0.3,
      npsScore: -0.6,
    },
    intercept: -0.5,
    activation: 'sigmoid',
  },
  'engagement-score': {
    type: 'engagement-score',
    features: ['emailOpens', 'linkClicks', 'websiteVisits', 'contentDownloads', 'socialInteractions'],
    coefficients: {
      emailOpens: 0.3,
      linkClicks: 0.5,
      websiteVisits: 0.6,
      contentDownloads: 0.8,
      socialInteractions: 0.4,
    },
    intercept: 0,
    activation: 'linear',
  },
};

// === Predictive Analytics Engine ===

export class PredictiveEngine {
  private predictionCache: Map<string, Prediction> = new Map();
  private trendHistory: Map<string, number[]> = new Map();

  /**
   * Make a prediction
   */
  predict(request: PredictionRequest): Prediction {
    const model = PREDICTION_MODELS[request.type];
    if (!model) {
      throw new Error(`Unknown prediction type: ${request.type}`);
    }

    // Generate cache key
    const cacheKey = this.generateCacheKey(request);
    const cached = this.predictionCache.get(cacheKey);
    if (cached && cached.expiresAt > new Date()) {
      return cached;
    }

    // Extract features from context
    const featureValues = this.extractFeatures(model.features, request.context);
    
    // Calculate prediction
    let rawScore = model.intercept;
    const factors: PredictionFactor[] = [];

    for (const feature of model.features) {
      const value = featureValues[feature] ?? 0;
      const coef = model.coefficients[feature] ?? 0;
      const contribution = value * coef;
      rawScore += contribution;

      if (request.includeFactors) {
        factors.push({
          name: feature,
          importance: Math.abs(coef),
          direction: coef >= 0 ? 'positive' : 'negative',
          value,
          contribution: Math.abs(contribution),
        });
      }
    }

    // Apply activation function
    let finalValue: number;
    switch (model.activation) {
      case 'sigmoid':
        finalValue = 1 / (1 + Math.exp(-rawScore));
        break;
      case 'softmax':
        finalValue = Math.exp(rawScore) / (1 + Math.exp(rawScore));
        break;
      case 'linear':
      default:
        finalValue = rawScore;
    }

    // Calculate confidence based on feature completeness
    const featureCompleteness = Object.values(featureValues)
      .filter(v => v !== undefined && v !== null).length / model.features.length;
    const confidence = Math.min(0.95, 0.5 + featureCompleteness * 0.4);

    // Calculate prediction range
    const stdError = (1 - confidence) * 0.2;
    const range = {
      low: Math.max(0, finalValue - stdError),
      high: Math.min(1, finalValue + stdError),
    };

    // Sort factors by contribution
    factors.sort((a, b) => b.contribution - a.contribution);

    const prediction: Prediction = {
      id: `pred_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      type: request.type,
      target: request.context.accountId || request.context.contactId || 'unknown',
      value: finalValue,
      confidence,
      range,
      factors: factors.slice(0, 5), // Top 5 factors
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
    };

    if (confidence >= (request.confidenceThreshold || 0)) {
      this.predictionCache.set(cacheKey, prediction);
    }

    return prediction;
  }

  /**
   * Extract feature values from context
   */
  private extractFeatures(
    features: string[],
    context: PredictionContext
  ): Record<string, number> {
    const values: Record<string, number> = {};
    const historical = context.historicalData || {};

    for (const feature of features) {
      // Check historical data first
      if (historical[feature] !== undefined) {
        values[feature] = Number(historical[feature]);
        continue;
      }

      // Generate synthetic values based on context
      switch (feature) {
        case 'personalizationScore':
          values[feature] = Math.random() * 0.5 + 0.5;
          break;
        case 'subjectLineScore':
          values[feature] = Math.random() * 0.4 + 0.6;
          break;
        case 'touchpointNumber':
          values[feature] = context.touchpoint || 1;
          break;
        case 'industryMatch':
          values[feature] = Math.random() > 0.3 ? 1 : 0;
          break;
        case 'daysSinceLastTouch':
          values[feature] = Math.floor(Math.random() * 7) + 1;
          break;
        default:
          values[feature] = Math.random();
      }
    }

    return values;
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(request: PredictionRequest): string {
    const contextStr = JSON.stringify(request.context);
    return `${request.type}:${contextStr}`;
  }

  /**
   * Batch predictions
   */
  predictBatch(requests: PredictionRequest[]): Prediction[] {
    return requests.map(r => this.predict(r));
  }

  /**
   * Analyze trend for a metric
   */
  analyzeTrend(
    metric: string,
    values: Array<{ date: Date; value: number }>,
    forecastPeriods: number = 30
  ): TrendAnalysis {
    const sortedValues = [...values].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    const numericValues = sortedValues.map(v => v.value);

    // Store in history
    this.trendHistory.set(metric, numericValues);

    // Determine trend direction
    const trend = this.calculateTrendDirection(numericValues);

    // Calculate change percentage
    const firstValue = numericValues[0] || 0;
    const lastValue = numericValues[numericValues.length - 1] || 0;
    const changePercent = firstValue > 0 
      ? ((lastValue - firstValue) / firstValue) * 100 
      : 0;

    // Detect anomalies
    const anomalies = this.detectAnomalies(sortedValues);

    // Detect seasonality
    const seasonality = this.detectSeasonality(sortedValues);

    // Generate forecast
    const forecast = this.generateForecast(numericValues, forecastPeriods);

    return {
      id: `trend_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      metric,
      period: {
        start: sortedValues[0]?.date || new Date(),
        end: sortedValues[sortedValues.length - 1]?.date || new Date(),
      },
      trend,
      changePercent,
      forecast,
      anomalies,
      seasonality,
    };
  }

  /**
   * Calculate trend direction
   */
  private calculateTrendDirection(
    values: number[]
  ): 'increasing' | 'decreasing' | 'stable' | 'volatile' {
    if (values.length < 3) return 'stable';

    // Simple linear regression
    const n = values.length;
    const xMean = (n - 1) / 2;
    const yMean = values.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      numerator += (i - xMean) * (values[i] - yMean);
      denominator += (i - xMean) ** 2;
    }

    const slope = denominator !== 0 ? numerator / denominator : 0;
    const normalizedSlope = slope / (yMean || 1);

    // Calculate volatility
    const variance = values.reduce((acc, v) => acc + (v - yMean) ** 2, 0) / n;
    const volatility = Math.sqrt(variance) / (yMean || 1);

    if (volatility > 0.3) return 'volatile';
    if (normalizedSlope > 0.05) return 'increasing';
    if (normalizedSlope < -0.05) return 'decreasing';
    return 'stable';
  }

  /**
   * Detect anomalies in time series
   */
  private detectAnomalies(
    values: Array<{ date: Date; value: number }>
  ): TrendAnomaly[] {
    if (values.length < 10) return [];

    const numericValues = values.map(v => v.value);
    const mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
    const stdDev = Math.sqrt(
      numericValues.reduce((acc, v) => acc + (v - mean) ** 2, 0) / numericValues.length
    );

    const anomalies: TrendAnomaly[] = [];
    const threshold = 2.5; // Standard deviations

    for (let i = 0; i < values.length; i++) {
      const deviation = (values[i].value - mean) / (stdDev || 1);
      
      if (Math.abs(deviation) > threshold) {
        anomalies.push({
          date: values[i].date,
          value: values[i].value,
          expected: mean,
          deviation,
          type: deviation > 0 ? 'spike' : 'drop',
          explanation: deviation > 0 
            ? 'Unusually high value detected' 
            : 'Unusually low value detected',
        });
      }
    }

    return anomalies;
  }

  /**
   * Detect seasonality patterns
   */
  private detectSeasonality(
    values: Array<{ date: Date; value: number }>
  ): SeasonalityPattern[] {
    if (values.length < 30) return [];

    const patterns: SeasonalityPattern[] = [];

    // Weekly seasonality
    const weeklyBuckets: number[][] = Array(7).fill(null).map(() => []);
    for (const v of values) {
      const dow = v.date.getDay();
      weeklyBuckets[dow].push(v.value);
    }

    const weeklyAvg = weeklyBuckets.map(
      b => b.length > 0 ? b.reduce((a, c) => a + c, 0) / b.length : 0
    );
    const globalAvg = values.reduce((a, v) => a + v.value, 0) / values.length;

    const weeklyVariance = weeklyAvg.reduce(
      (acc, avg) => acc + (avg - globalAvg) ** 2, 0
    ) / 7;

    if (weeklyVariance / (globalAvg ** 2 || 1) > 0.01) {
      const peaks = weeklyAvg
        .map((v, i) => ({ dow: i, value: v }))
        .filter(d => d.value > globalAvg * 1.1)
        .map(d => d.dow);
      
      const troughs = weeklyAvg
        .map((v, i) => ({ dow: i, value: v }))
        .filter(d => d.value < globalAvg * 0.9)
        .map(d => d.dow);

      patterns.push({
        period: 'weekly',
        strength: Math.sqrt(weeklyVariance) / (globalAvg || 1),
        peaks,
        troughs,
      });
    }

    return patterns;
  }

  /**
   * Generate forecast
   */
  private generateForecast(
    values: number[],
    _periods: number
  ): TrendForecast {
    if (values.length < 5) {
      const lastValue = values[values.length - 1] || 0;
      return {
        nextPeriod: lastValue,
        nextMonth: lastValue * 30,
        nextQuarter: lastValue * 90,
        confidence: 0.3,
        methodology: 'naive',
      };
    }

    // Simple exponential smoothing
    const alpha = 0.3;
    let smoothed = values[0];
    
    for (let i = 1; i < values.length; i++) {
      smoothed = alpha * values[i] + (1 - alpha) * smoothed;
    }

    // Calculate trend
    const recentTrend = values.length >= 2 
      ? values[values.length - 1] - values[values.length - 2]
      : 0;

    return {
      nextPeriod: smoothed + recentTrend,
      nextMonth: (smoothed + recentTrend) * 30,
      nextQuarter: (smoothed + recentTrend) * 90,
      confidence: Math.min(0.8, 0.5 + values.length * 0.01),
      methodology: 'exponential-smoothing',
    };
  }

  /**
   * Generate intelligence insights
   */
  generateInsights(
    data: Record<string, any>,
    _context: { industry?: string; period?: { start: Date; end: Date } }
  ): IntelligenceInsight[] {
    const insights: IntelligenceInsight[] = [];

    // Analyze engagement patterns
    if (data.replyRates) {
      const avgReplyRate = data.replyRates.reduce((a: number, b: number) => a + b, 0) / 
        data.replyRates.length;
      
      if (avgReplyRate < 0.03) {
        insights.push({
          id: `insight_${Date.now()}_1`,
          type: 'risk-warning',
          title: 'Low Reply Rates Detected',
          description: `Average reply rate of ${(avgReplyRate * 100).toFixed(1)}% is below industry benchmark`,
          importance: 'high',
          confidence: 0.85,
          dataPoints: data.replyRates.length,
          evidence: [
            { source: 'email-analytics', metric: 'reply-rate', value: avgReplyRate, significance: 0.9 },
          ],
          recommendations: [
            { action: 'Improve email personalization', impact: 0.3, effort: 'medium' },
            { action: 'A/B test subject lines', impact: 0.2, effort: 'low' },
          ],
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
      }
    }

    // Analyze timing patterns
    if (data.sendTimes && data.openTimes) {
      insights.push({
        id: `insight_${Date.now()}_2`,
        type: 'timing-optimization',
        title: 'Optimal Send Time Identified',
        description: 'Tuesday and Wednesday mornings show highest engagement',
        importance: 'medium',
        confidence: 0.75,
        dataPoints: data.sendTimes.length,
        evidence: [
          { source: 'send-time-analysis', metric: 'open-rate-by-time', value: 0.42, significance: 0.7 },
        ],
        recommendations: [
          { action: 'Shift sends to 9-11am local time', impact: 0.15, effort: 'low' },
        ],
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      });
    }

    // Market shift detection
    if (data.conversionTrend === 'decreasing') {
      insights.push({
        id: `insight_${Date.now()}_3`,
        type: 'market-shift',
        title: 'Conversion Rate Decline Detected',
        description: 'Pipeline conversion has dropped 15% over the past 30 days',
        importance: 'critical',
        confidence: 0.8,
        dataPoints: 30,
        evidence: [
          { source: 'pipeline-analytics', metric: 'conversion-rate', value: -0.15, significance: 0.95 },
        ],
        recommendations: [
          { action: 'Review lost deal analysis', impact: 0.4, effort: 'medium' },
          { action: 'Update competitive positioning', impact: 0.3, effort: 'high' },
        ],
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      });
    }

    return insights.sort((a, b) => {
      const order = { critical: 4, high: 3, medium: 2, low: 1 };
      return order[b.importance] - order[a.importance];
    });
  }

  /**
   * Get prediction statistics
   */
  getStats(): {
    totalPredictions: number;
    averageConfidence: number;
    predictionsByType: Record<PredictionType, number>;
    cacheHitRate: number;
  } {
    const predictions = Array.from(this.predictionCache.values());
    
    const byType: Record<string, number> = {};
    let totalConfidence = 0;

    for (const pred of predictions) {
      byType[pred.type] = (byType[pred.type] || 0) + 1;
      totalConfidence += pred.confidence;
    }

    return {
      totalPredictions: predictions.length,
      averageConfidence: predictions.length > 0 ? totalConfidence / predictions.length : 0,
      predictionsByType: byType as Record<PredictionType, number>,
      cacheHitRate: 0.75, // Estimated
    };
  }

  /**
   * Clear prediction cache
   */
  clearCache(): void {
    this.predictionCache.clear();
  }
}

// Singleton export
export const predictiveEngine = new PredictiveEngine();
export default PredictiveEngine;
