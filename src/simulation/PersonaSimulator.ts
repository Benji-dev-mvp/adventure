/**
 * Persona Resistance Simulator
 * 
 * Models buyer persona behavior patterns and resistance factors
 * to predict engagement and conversion probabilities.
 */

import type {
  PersonaModel,
  ResponseCurveExtended,
  Strategy,
  ResistanceFactors,
} from './types';

// === Persona Templates ===

export const PERSONA_ARCHETYPES: Record<string, Partial<PersonaModel>> = {
  skepticalCFO: {
    id: 'skeptical-cfo',
    name: 'Skeptical CFO',
    decisionStyle: 'analytical',
    buyingPower: 'decision-maker',
    baseResistance: {
      priceObjection: 0.85,
      timingObjection: 0.4,
      competitorLoyalty: 0.5,
      changeAversion: 0.7,
      authorityBarrier: 0.1,
      informationNeed: 0.9,
    },
  },
  
  busyVPSales: {
    id: 'busy-vp-sales',
    name: 'Busy VP Sales',
    decisionStyle: 'driver',
    buyingPower: 'decision-maker',
    baseResistance: {
      priceObjection: 0.5,
      timingObjection: 0.8,
      competitorLoyalty: 0.6,
      changeAversion: 0.3,
      authorityBarrier: 0.2,
      informationNeed: 0.4,
    },
  },
  
  curiousSDRManager: {
    id: 'curious-sdr-manager',
    name: 'Curious SDR Manager',
    decisionStyle: 'expressive',
    buyingPower: 'influencer',
    baseResistance: {
      priceObjection: 0.3,
      timingObjection: 0.5,
      competitorLoyalty: 0.4,
      changeAversion: 0.2,
      authorityBarrier: 0.9,
      informationNeed: 0.6,
    },
  },
  
  technicalCTO: {
    id: 'technical-cto',
    name: 'Technical CTO',
    decisionStyle: 'analytical',
    buyingPower: 'influencer',
    baseResistance: {
      priceObjection: 0.4,
      timingObjection: 0.5,
      competitorLoyalty: 0.7,
      changeAversion: 0.6,
      authorityBarrier: 0.3,
      informationNeed: 0.95,
    },
  },
  
  enthusiasticChampion: {
    id: 'enthusiastic-champion',
    name: 'Enthusiastic Champion',
    decisionStyle: 'amiable',
    buyingPower: 'influencer',
    baseResistance: {
      priceObjection: 0.2,
      timingObjection: 0.3,
      competitorLoyalty: 0.2,
      changeAversion: 0.1,
      authorityBarrier: 0.8,
      informationNeed: 0.5,
    },
  },
};

// === Response Curve Generators ===

function generateColdOutreachCurve(resistance: number): ResponseCurveExtended {
  return {
    touchpoint: 1,
    method: 'email',
    baseResponseRate: 0.05 * (1 - resistance),
    degradationRate: 0.15,
    saturationPoint: 8,
    recoveryDays: 14,
  };
}

function generateFollowUpCurve(resistance: number, touchpoint: number): ResponseCurveExtended {
  const decay = Math.pow(0.85, touchpoint - 1);
  return {
    touchpoint,
    method: 'email',
    baseResponseRate: 0.08 * (1 - resistance) * decay,
    degradationRate: 0.12,
    saturationPoint: 8 - touchpoint,
    recoveryDays: 21,
  };
}

function generatePhoneCurve(resistance: number): ResponseCurveExtended {
  return {
    touchpoint: 1,
    method: 'phone',
    baseResponseRate: 0.03 * (1 - resistance * 0.5),
    degradationRate: 0.25,
    saturationPoint: 3,
    recoveryDays: 30,
  };
}

function generateLinkedInCurve(resistance: number): ResponseCurveExtended {
  return {
    touchpoint: 1,
    method: 'linkedin',
    baseResponseRate: 0.12 * (1 - resistance * 0.7),
    degradationRate: 0.1,
    saturationPoint: 4,
    recoveryDays: 7,
  };
}

// === Persona Simulator ===

export class PersonaSimulator {
  private personas: Map<string, PersonaModel> = new Map();

  constructor() {
    // Initialize with archetype personas
    for (const [, archetype] of Object.entries(PERSONA_ARCHETYPES)) {
      const persona = this.buildFullPersona(archetype);
      this.personas.set(persona.id, persona);
    }
  }

  /**
   * Build a complete persona from partial definition
   */
  private buildFullPersona(partial: Partial<PersonaModel>): PersonaModel {
    const baseResistance: Record<string, number> = partial.baseResistance || {
      priceObjection: 0.5,
      timingObjection: 0.5,
      competitorLoyalty: 0.5,
      changeAversion: 0.5,
      authorityBarrier: 0.5,
      informationNeed: 0.5,
    };

    const resistanceValues = Object.values(baseResistance) as number[];
    const avgResistance = resistanceValues.reduce((a, b) => a + b, 0) / 6;

    const responseCurves: ResponseCurveExtended[] = [
      generateColdOutreachCurve(avgResistance),
      generateFollowUpCurve(avgResistance, 2),
      generateFollowUpCurve(avgResistance, 3),
      generateFollowUpCurve(avgResistance, 4),
      generatePhoneCurve(avgResistance),
      generateLinkedInCurve(avgResistance),
    ];

    return {
      id: partial.id || `persona_${Date.now()}`,
      name: partial.name || 'Unknown Persona',
      decisionStyle: partial.decisionStyle || 'analytical',
      buyingPower: partial.buyingPower || 'influencer',
      baseResistance,
      responseCurves,
      contextualModifiers: partial.contextualModifiers || [
        { context: 'end-of-quarter', resistanceMultiplier: 0.7 },
        { context: 'budget-freeze', resistanceMultiplier: 1.5 },
        { context: 'new-in-role', resistanceMultiplier: 0.6 },
        { context: 'competitor-evaluation', resistanceMultiplier: 0.4 },
      ],
    };
  }

  /**
   * Get persona by ID
   */
  getPersona(id: string): PersonaModel | undefined {
    return this.personas.get(id);
  }

  /**
   * Create custom persona
   */
  createPersona(partial: Partial<PersonaModel>): PersonaModel {
    const persona = this.buildFullPersona(partial);
    this.personas.set(persona.id, persona);
    return persona;
  }

  /**
   * Simulate engagement probability
   */
  simulateEngagement(
    personaId: string,
    strategy: Strategy,
    context: {
      touchpoint: number;
      method: 'email' | 'phone' | 'linkedin' | 'ad';
      daysSinceLastTouch: number;
      contexts: string[];
    }
  ): {
    responseProb: number;
    meetingProb: number;
    resistanceBreakdown: Record<string, number>;
    recommendations: string[];
  } {
    const persona = this.personas.get(personaId);
    if (!persona) {
      return {
        responseProb: 0,
        meetingProb: 0,
        resistanceBreakdown: {},
        recommendations: ['Unknown persona - cannot simulate'],
      };
    }

    // Find matching response curve
    const responseCurves = persona.responseCurves || [];
    const curve = responseCurves.find(
      (c: ResponseCurveExtended) => c.method === context.method
    ) || responseCurves[0];

    if (!curve) {
      return {
        responseProb: 0,
        meetingProb: 0,
        resistanceBreakdown: {},
        recommendations: ['No response curve available'],
      };
    }

    // Base response probability from curve
    let responseProb = curve.baseResponseRate;

    // Apply touchpoint degradation
    const touchpointPenalty = Math.pow(
      1 - curve.degradationRate,
      context.touchpoint - 1
    );
    responseProb *= touchpointPenalty;

    // Check saturation
    if (context.touchpoint > curve.saturationPoint) {
      responseProb *= 0.1; // Heavily penalize over-saturation
    }

    // Apply recovery boost
    if (context.daysSinceLastTouch >= curve.recoveryDays) {
      responseProb *= 1.3;
    }

    // Apply contextual modifiers
    for (const ctxName of context.contexts) {
      const modifier = persona.contextualModifiers?.find(
        m => m.context === ctxName
      );
      if (modifier) {
        responseProb *= 1 / modifier.resistanceMultiplier;
      }
    }

    // Apply strategy effectiveness
    const strategyBoost = this.calculateStrategyFit(persona, strategy);
    responseProb *= strategyBoost;

    // Calculate meeting probability (conditional on response)
    let meetingProb = responseProb * 0.3;
    
    // Decision makers more likely to book meetings
    if (persona.buyingPower === 'decision-maker') {
      meetingProb *= 1.4;
    }

    // Build resistance breakdown
    const resistanceBreakdown: Record<string, number> = {};
    const baseResistance = persona.baseResistance || {};
    for (const [key, value] of Object.entries(baseResistance)) {
      resistanceBreakdown[key] = (value as number) * (1 - responseProb);
    }

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      persona,
      context,
      responseProb
    );

    return {
      responseProb: Math.min(responseProb, 1),
      meetingProb: Math.min(meetingProb, 1),
      resistanceBreakdown,
      recommendations,
    };
  }

  /**
   * Calculate how well a strategy fits a persona
   */
  private calculateStrategyFit(persona: PersonaModel, strategy: Strategy): number {
    let fit = 1.0;

    // Match decision style to strategy approach
    const styleMatches: Record<string, string[]> = {
      analytical: ['data-driven', 'roi-focused', 'detailed'],
      driver: ['concise', 'results-focused', 'direct'],
      expressive: ['story-driven', 'vision-focused', 'innovative'],
      amiable: ['relationship-focused', 'trust-building', 'supportive'],
    };

    const preferredApproaches = styleMatches[persona.decisionStyle || 'analytical'] || [];
    
    for (const tactic of strategy.tactics) {
      if (tactic.approach && preferredApproaches.some(a => tactic.approach!.includes(a))) {
        fit *= 1.2;
      }
    }

    // Buying power considerations
    if (persona.buyingPower === 'decision-maker') {
      // Decision makers respond better to ROI-focused tactics
      if (strategy.tactics.some(t => t.approach?.includes('roi'))) {
        fit *= 1.15;
      }
    }

    return Math.min(fit, 2.0); // Cap at 2x
  }

  /**
   * Generate engagement recommendations
   */
  private generateRecommendations(
    persona: PersonaModel,
    context: { touchpoint: number; method: string; contexts: string[] },
    currentProb: number
  ): string[] {
    const recommendations: string[] = [];
    const resistance = persona.baseResistance || {};

    // Low response probability recommendations
    if (currentProb < 0.02) {
      recommendations.push(
        'Response probability is very low. Consider changing approach.'
      );
    }

    // Resistance-specific recommendations
    if ((resistance.priceObjection ?? 0) > 0.7) {
      recommendations.push(
        'Lead with ROI and cost-savings, not product features.'
      );
    }

    if ((resistance.timingObjection ?? 0) > 0.7) {
      recommendations.push(
        'Emphasize quick time-to-value and low implementation effort.'
      );
    }

    if ((resistance.informationNeed ?? 0) > 0.8) {
      recommendations.push(
        'Provide detailed case studies and technical documentation.'
      );
    }

    if ((resistance.authorityBarrier ?? 0) > 0.7) {
      recommendations.push(
        'Focus on building internal champion, offer executive summary for sharing.'
      );
    }

    // Channel recommendations
    if (context.touchpoint > 3 && context.method === 'email') {
      recommendations.push(
        'Email fatigue likely. Try switching to LinkedIn or phone.'
      );
    }

    // Context-aware recommendations
    if (context.contexts.includes('end-of-quarter')) {
      recommendations.push(
        'End of quarter: emphasize quick wins and budget utilization.'
      );
    }

    if (context.contexts.includes('budget-freeze')) {
      recommendations.push(
        'Budget freeze: pivot to nurture mode, provide value-add content.'
      );
    }

    return recommendations.slice(0, 5); // Return top 5 recommendations
  }

  /**
   * Run resistance evolution simulation
   */
  simulateResistanceEvolution(
    personaId: string,
    interactions: Array<{
      day: number;
      type: 'email' | 'call' | 'meeting' | 'content';
      outcome: 'positive' | 'neutral' | 'negative';
    }>
  ): Array<{
    day: number;
    resistance: ResistanceFactors;
    engagementScore: number;
  }> {
    const persona = this.personas.get(personaId);
    if (!persona) return [];

    const evolution: Array<{
      day: number;
      resistance: ResistanceFactors;
      engagementScore: number;
    }> = [];

    // Start with base resistance
    let currentResistance: Record<string, number> = { ...(persona.baseResistance || {}) };
    let engagementScore = 0.5;

    for (const interaction of interactions) {
      // Modify resistance based on interaction outcome
      const modifier = 
        interaction.outcome === 'positive' ? -0.1 :
        interaction.outcome === 'negative' ? 0.15 : 0;

      // Different interactions affect different resistance factors
      switch (interaction.type) {
        case 'email':
          currentResistance.informationNeed = Math.max(
            0,
            Math.min(1, (currentResistance.informationNeed ?? 0.5) + modifier)
          );
          break;
        case 'call':
          currentResistance.timingObjection = Math.max(
            0,
            Math.min(1, (currentResistance.timingObjection ?? 0.5) + modifier * 0.5)
          );
          break;
        case 'meeting':
          currentResistance.priceObjection = Math.max(
            0,
            Math.min(1, (currentResistance.priceObjection ?? 0.5) + modifier)
          );
          currentResistance.changeAversion = Math.max(
            0,
            Math.min(1, (currentResistance.changeAversion ?? 0.5) + modifier)
          );
          break;
        case 'content':
          currentResistance.informationNeed = Math.max(
            0,
            Math.min(1, (currentResistance.informationNeed ?? 0.5) + modifier * 1.5)
          );
          break;
      }

      // Update engagement score
      engagementScore = Math.max(
        0,
        Math.min(
          1,
          engagementScore + (interaction.outcome === 'positive' ? 0.15 : -0.1)
        )
      );

      evolution.push({
        day: interaction.day,
        resistance: { ...currentResistance } as unknown as ResistanceFactors,
        engagementScore,
      });
    }

    return evolution;
  }

  /**
   * Predict best next action for a persona
   */
  predictBestAction(
    personaId: string,
    history: Array<{ method: string; day: number; responded: boolean }>,
    strategies: Strategy[]
  ): {
    recommendedMethod: 'email' | 'phone' | 'linkedin' | 'content';
    recommendedStrategy: Strategy | null;
    expectedResponseRate: number;
    reasoning: string[];
  } {
    const persona = this.personas.get(personaId);
    if (!persona) {
      return {
        recommendedMethod: 'email',
        recommendedStrategy: null,
        expectedResponseRate: 0,
        reasoning: ['Unknown persona'],
      };
    }

    // Analyze history
    const emailCount = history.filter(h => h.method === 'email').length;
    const phoneCount = history.filter(h => h.method === 'phone').length;
    const linkedinCount = history.filter(h => h.method === 'linkedin').length;
    const lastTouch = history.length > 0 
      ? history[history.length - 1] 
      : null;
    const daysSinceLastTouch = lastTouch 
      ? (Date.now() / 86400000) - lastTouch.day 
      : 30;

    // Score each method
    const methods = ['email', 'phone', 'linkedin', 'content'] as const;
    const scores: Record<string, number> = {};
    const responseCurves = persona.responseCurves || [];

    for (const method of methods) {
      const curve = responseCurves.find((c: ResponseCurveExtended) => c.method === method);
      if (!curve) {
        scores[method] = 0.01;
        continue;
      }

      let score = curve.baseResponseRate;

      // Penalize over-used channels
      const usageCount = 
        method === 'email' ? emailCount :
        method === 'phone' ? phoneCount :
        method === 'linkedin' ? linkedinCount : 0;
      
      score *= Math.pow(0.9, usageCount);

      // Boost under-used channels
      if (usageCount < 2 && history.length > 3) {
        score *= 1.5;
      }

      // Recovery bonus
      if (daysSinceLastTouch > curve.recoveryDays) {
        score *= 1.3;
      }

      scores[method] = score;
    }

    // Find best method
    const recommendedMethod = (Object.entries(scores)
      .sort(([, a], [, b]) => b - a)[0][0]) as 'email' | 'phone' | 'linkedin' | 'content';

    // Find best strategy
    let bestStrategy: Strategy | null = null;
    let bestStrategyScore = 0;

    for (const strategy of strategies) {
      const fit = this.calculateStrategyFit(persona, strategy);
      if (fit > bestStrategyScore) {
        bestStrategyScore = fit;
        bestStrategy = strategy;
      }
    }

    // Build reasoning
    const reasoning: string[] = [];
    reasoning.push(
      `${recommendedMethod} has highest expected response rate (${(scores[recommendedMethod] * 100).toFixed(1)}%)`
    );

    if (emailCount > 4) {
      reasoning.push('Email fatigue detected - consider alternative channels');
    }

    if (daysSinceLastTouch > 14) {
      reasoning.push('Account has cooled off - re-engage with fresh approach');
    }

    if (bestStrategy) {
      reasoning.push(
        `"${bestStrategy.name}" strategy best matches ${persona.decisionStyle} decision style`
      );
    }

    return {
      recommendedMethod,
      recommendedStrategy: bestStrategy,
      expectedResponseRate: scores[recommendedMethod],
      reasoning,
    };
  }
}

// Singleton export
export const personaSimulator = new PersonaSimulator();
export default PersonaSimulator;
