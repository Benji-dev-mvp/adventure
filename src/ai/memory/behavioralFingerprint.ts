// @ts-nocheck
// TODO: Complete implementation of behavioral fingerprinting
/**
 * Behavioral Fingerprinting Engine
 * 
 * Detects and adapts to buyer behavior types automatically.
 * Builds rich behavioral profiles from sparse observation signals.
 */

import type {
  BehavioralFingerprint,
  PersonaType,
  BehaviorObservation,
} from './types';

interface FingerprintPrediction {
  fingerprint: BehavioralFingerprint;
  adaptations: ToneAdaptation[];
  nextBestAction: string;
  confidence: number;
}

interface ToneAdaptation {
  dimension: string;
  currentValue: number | string;
  suggestedValue: number | string;
  rationale: string;
}

interface ObservationEvent {
  accountId: string;
  contactId?: string;
  eventType: string;
  eventData: Record<string, unknown>;
  timestamp: Date;
}

class BehavioralFingerprinter {
  private fingerprints: Map<string, BehavioralFingerprint> = new Map();
  private observationBuffer: ObservationEvent[] = [];
  private personaModels: Map<PersonaType, number[]> = new Map();
  
  // Minimum observations needed for confident fingerprinting
  private readonly MIN_OBSERVATIONS = 5;
  private readonly CONFIDENCE_THRESHOLD = 0.6;

  constructor() {
    this.initializePersonaModels();
  }

  /**
   * Initialize persona archetype models for classification
   */
  private initializePersonaModels(): void {
    // Each persona has a characteristic feature vector
    // [formality, dataOrientation, emotionalResonance, riskTolerance, responseSpeed, detailPreference]
    this.personaModels.set('analytical-skeptic', [0.8, 0.95, 0.2, 0.3, 0.4, 0.9]);
    this.personaModels.set('visionary-champion', [0.5, 0.4, 0.85, 0.8, 0.7, 0.6]);
    this.personaModels.set('pragmatic-evaluator', [0.7, 0.75, 0.4, 0.5, 0.5, 0.7]);
    this.personaModels.set('relationship-builder', [0.4, 0.3, 0.9, 0.6, 0.8, 0.4]);
    this.personaModels.set('time-pressed-executive', [0.9, 0.5, 0.3, 0.7, 0.2, 0.1]);
    this.personaModels.set('technical-validator', [0.6, 0.9, 0.3, 0.4, 0.5, 0.95]);
    this.personaModels.set('political-navigator', [0.85, 0.5, 0.6, 0.4, 0.6, 0.5]);
    this.personaModels.set('innovation-seeker', [0.4, 0.6, 0.7, 0.9, 0.6, 0.5]);
  }

  /**
   * Record an observation event for fingerprinting
   */
  observe(event: ObservationEvent): void {
    this.observationBuffer.push(event);
    
    // Process observation into fingerprint update
    this.updateFingerprint(event);
  }

  /**
   * Get or create fingerprint for an account
   */
  getFingerprint(accountId: string): BehavioralFingerprint | null {
    return this.fingerprints.get(accountId) || null;
  }

  /**
   * Predict behavior and suggest adaptations
   */
  predict(accountId: string): FingerprintPrediction | null {
    const fingerprint = this.fingerprints.get(accountId);
    if (!fingerprint || fingerprint.confidence < this.CONFIDENCE_THRESHOLD) {
      return null;
    }

    const adaptations = this.computeAdaptations(fingerprint);
    const nextBestAction = this.computeNextBestAction(fingerprint);

    return {
      fingerprint,
      adaptations,
      nextBestAction,
      confidence: fingerprint.confidence,
    };
  }

  /**
   * Update fingerprint based on new observation
   */
  private updateFingerprint(event: ObservationEvent): void {
    let fingerprint = this.fingerprints.get(event.accountId);
    
    if (!fingerprint) {
      fingerprint = this.createEmptyFingerprint(event.accountId);
    }

    // Add observation
    const observation = this.parseObservation(event);
    fingerprint.observations.push(observation);

    // Re-compute fingerprint features
    fingerprint = this.recomputeFeatures(fingerprint);
    
    // Classify persona type
    fingerprint.personaType = this.classifyPersona(fingerprint);
    
    // Update confidence based on observation count and consistency
    fingerprint.confidence = this.computeConfidence(fingerprint);
    fingerprint.lastUpdated = new Date();

    this.fingerprints.set(event.accountId, fingerprint);
  }

  /**
   * Create empty fingerprint with neutral priors
   */
  private createEmptyFingerprint(accountId: string): BehavioralFingerprint {
    return {
      id: `fp_${accountId}_${Date.now()}`,
      accountId,
      personaType: 'pragmatic-evaluator', // Default prior
      communicationStyle: {
        preferredLength: 'moderate',
        formalityLevel: 0.5,
        dataOrientation: 0.5,
        emotionalResonance: 0.5,
        responseLatency: 'moderate',
        preferredChannel: 'email',
      },
      decisionPattern: {
        averageCycleLength: 30,
        stakeholderCount: 3,
        requiresConsensus: true,
        riskTolerance: 0.5,
        budgetSensitivity: 0.5,
        timingPreference: 'any',
      },
      engagementRhythm: {
        peakDays: [1, 2, 3, 4, 5], // Weekdays
        peakHours: [9, 10, 11, 14, 15, 16],
        optimalCadence: 3,
        burnoutThreshold: 10,
      },
      resistanceProfile: {
        primaryObjections: [],
        persuasionImmunity: [],
        effectiveTriggers: [],
        trustBarriers: [],
        socialProofWeight: 0.5,
      },
      influenceVector: new Array(8).fill(0.5),
      confidence: 0,
      observations: [],
      lastUpdated: new Date(),
    };
  }

  /**
   * Parse raw event into structured observation
   */
  private parseObservation(event: ObservationEvent): BehaviorObservation {
    const sentiment = this.extractSentiment(event);
    const intent = this.inferIntent(event);

    return {
      timestamp: event.timestamp,
      action: event.eventType,
      context: event.eventData,
      sentiment,
      intent,
    };
  }

  /**
   * Extract sentiment from event data
   */
  private extractSentiment(event: ObservationEvent): number {
    const positiveSignals = ['opened', 'clicked', 'replied', 'scheduled', 'forwarded'];
    const negativeSignals = ['bounced', 'unsubscribed', 'complained', 'ignored'];
    
    if (positiveSignals.includes(event.eventType)) {
      return 0.5 + Math.random() * 0.5; // 0.5 to 1.0
    }
    if (negativeSignals.includes(event.eventType)) {
      return -0.5 - Math.random() * 0.5; // -0.5 to -1.0
    }
    return 0; // Neutral
  }

  /**
   * Infer intent from event type and data
   */
  private inferIntent(event: ObservationEvent): string {
    const intentMap: Record<string, string> = {
      'email.opened': 'awareness',
      'email.clicked': 'interest',
      'email.replied': 'engagement',
      'meeting.scheduled': 'consideration',
      'proposal.viewed': 'evaluation',
      'contract.signed': 'decision',
      'email.bounced': 'unreachable',
      'email.unsubscribed': 'rejection',
    };
    
    return intentMap[event.eventType] || 'unknown';
  }

  /**
   * Recompute fingerprint features from observations
   */
  private recomputeFeatures(fingerprint: BehavioralFingerprint): BehavioralFingerprint {
    const observations = fingerprint.observations;
    if (observations.length === 0) return fingerprint;

    // Analyze response times
    const responseTimes = observations
      .filter(o => o.action === 'email.replied')
      .map(o => o.context.responseTimeMinutes as number || 60);
    
    if (responseTimes.length > 0) {
      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      fingerprint.communicationStyle.responseLatency = 
        avgResponseTime < 60 ? 'fast' :
        avgResponseTime < 240 ? 'moderate' : 'slow';
    }

    // Analyze engagement timing
    const engagementHours = observations.map(o => new Date(o.timestamp).getHours());
    const hourCounts = new Map<number, number>();
    engagementHours.forEach(h => hourCounts.set(h, (hourCounts.get(h) || 0) + 1));
    fingerprint.engagementRhythm.peakHours = Array.from(hourCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([hour]) => hour);

    // Analyze message preferences from replies
    const replies = observations.filter(o => o.action === 'email.replied');
    if (replies.length >= 2) {
      // Infer formality from reply sentiment consistency
      const sentimentVariance = this.computeVariance(replies.map(r => r.sentiment));
      fingerprint.communicationStyle.emotionalResonance = 1 - Math.min(sentimentVariance, 1);
    }

    // Compute influence vector from observation patterns
    fingerprint.influenceVector = this.computeInfluenceVector(observations);

    return fingerprint;
  }

  /**
   * Compute influence susceptibility vector
   */
  private computeInfluenceVector(observations: BehaviorObservation[]): number[] {
    // 8 dimensions corresponding to persuasion techniques
    // [social-proof, scarcity, authority, reciprocity, commitment, liking, unity, contrast]
    const vector = new Array(8).fill(0.5);
    
    // Analyze which message types generated positive responses
    const positiveObs = observations.filter(o => o.sentiment > 0.3);
    
    positiveObs.forEach(obs => {
      const messageType = obs.context.messageType as string || '';
      
      if (messageType.includes('case-study') || messageType.includes('testimonial')) {
        vector[0] = Math.min(vector[0] + 0.1, 1); // Social proof
      }
      if (messageType.includes('limited') || messageType.includes('urgent')) {
        vector[1] = Math.min(vector[1] + 0.1, 1); // Scarcity
      }
      if (messageType.includes('expert') || messageType.includes('research')) {
        vector[2] = Math.min(vector[2] + 0.1, 1); // Authority
      }
    });

    return vector;
  }

  /**
   * Classify persona type using distance to archetypes
   */
  private classifyPersona(fingerprint: BehavioralFingerprint): PersonaType {
    const observedVector = [
      fingerprint.communicationStyle.formalityLevel,
      fingerprint.communicationStyle.dataOrientation,
      fingerprint.communicationStyle.emotionalResonance,
      fingerprint.decisionPattern.riskTolerance,
      fingerprint.communicationStyle.responseLatency === 'fast' ? 0.8 :
        fingerprint.communicationStyle.responseLatency === 'moderate' ? 0.5 : 0.2,
      fingerprint.communicationStyle.preferredLength === 'detailed' ? 0.9 :
        fingerprint.communicationStyle.preferredLength === 'moderate' ? 0.5 : 0.1,
    ];

    let bestMatch: PersonaType = 'pragmatic-evaluator';
    let bestSimilarity = -1;

    for (const [persona, archetypeVector] of this.personaModels) {
      const similarity = this.cosineSimilarity(observedVector, archetypeVector);
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = persona;
      }
    }

    return bestMatch;
  }

  /**
   * Compute confidence score based on observation quality
   */
  private computeConfidence(fingerprint: BehavioralFingerprint): number {
    const obsCount = fingerprint.observations.length;
    if (obsCount < this.MIN_OBSERVATIONS) {
      return obsCount / this.MIN_OBSERVATIONS * 0.5;
    }

    // Base confidence from observation count
    let confidence = Math.min(obsCount / 20, 0.8);

    // Boost from observation diversity
    const actionTypes = new Set(fingerprint.observations.map(o => o.action));
    confidence += actionTypes.size * 0.05;

    // Boost from temporal spread
    const timestamps = fingerprint.observations.map(o => new Date(o.timestamp).getTime());
    const timeSpread = (Math.max(...timestamps) - Math.min(...timestamps)) / (1000 * 60 * 60 * 24);
    if (timeSpread > 7) confidence += 0.1;

    return Math.min(confidence, 1);
  }

  /**
   * Compute tone adaptations for this persona
   */
  private computeAdaptations(fingerprint: BehavioralFingerprint): ToneAdaptation[] {
    const adaptations: ToneAdaptation[] = [];
    const style = fingerprint.communicationStyle;
    const persona = fingerprint.personaType;

    // Length adaptation
    if (persona === 'time-pressed-executive' && style.preferredLength !== 'brief') {
      adaptations.push({
        dimension: 'messageLength',
        currentValue: style.preferredLength,
        suggestedValue: 'brief',
        rationale: 'Executive personas respond better to concise messaging',
      });
    }

    // Formality adaptation
    if (persona === 'relationship-builder' && style.formalityLevel > 0.7) {
      adaptations.push({
        dimension: 'formality',
        currentValue: style.formalityLevel,
        suggestedValue: 0.4,
        rationale: 'Relationship builders prefer warmer, less formal tone',
      });
    }

    // Data orientation adaptation
    if (persona === 'analytical-skeptic' && style.dataOrientation < 0.8) {
      adaptations.push({
        dimension: 'dataIntensity',
        currentValue: style.dataOrientation,
        suggestedValue: 0.9,
        rationale: 'Include more data points and proof for analytical skeptics',
      });
    }

    // Timing adaptation
    if (fingerprint.engagementRhythm.peakHours.length > 0) {
      adaptations.push({
        dimension: 'sendTime',
        currentValue: 'default',
        suggestedValue: `${fingerprint.engagementRhythm.peakHours[0]}:00`,
        rationale: `Highest engagement observed at ${fingerprint.engagementRhythm.peakHours[0]}:00`,
      });
    }

    return adaptations;
  }

  /**
   * Compute next best action based on fingerprint
   */
  private computeNextBestAction(fingerprint: BehavioralFingerprint): string {
    const recentObs = fingerprint.observations.slice(-5);
    const avgSentiment = recentObs.reduce((a, b) => a + b.sentiment, 0) / recentObs.length;

    if (avgSentiment > 0.5) {
      return 'escalate-engagement'; // They're warm, push forward
    }
    if (avgSentiment < -0.2) {
      return 'change-approach'; // Current approach isn't working
    }
    if (fingerprint.resistanceProfile.primaryObjections.length > 0) {
      return 'address-objection'; // Handle known blocker
    }

    return 'continue-sequence'; // Default progression
  }

  // === Utility Methods ===

  private cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private computeVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  }
}

// Singleton export
export const behavioralFingerprinter = new BehavioralFingerprinter();
export default BehavioralFingerprinter;
