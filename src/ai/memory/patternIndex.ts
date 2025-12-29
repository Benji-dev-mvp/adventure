// @ts-nocheck
// TODO: Complete implementation of pattern indexing
/**
 * Pattern Index - Self-Improving Message Pattern Recognition
 *
 * Stores, retrieves, and evolves successful messaging patterns
 * based on real-world outcomes and reinforcement signals.
 */

import type { MessagePattern, EmotionalTone, PersuasionTechnique, VectorEntry } from './types';

interface PatternMatch {
  pattern: MessagePattern;
  similarity: number;
  contextRelevance: number;
  predictedSuccess: number;
}

interface PatternEvolution {
  parentId: string;
  mutation: string;
  performanceDelta: number;
}

class PatternIndex {
  private patterns: Map<string, MessagePattern> = new Map();
  private embeddings: Map<string, number[]> = new Map();
  private evolutionHistory: PatternEvolution[] = [];
  private readonly DECAY_RATE = 0.995; // Daily decay
  private readonly MIN_CONFIDENCE = 0.3;

  /**
   * Index a new message pattern with semantic embedding
   */
  async indexPattern(
    content: string,
    context: {
      tone: EmotionalTone;
      technique: PersuasionTechnique;
      tags: string[];
    }
  ): Promise<MessagePattern> {
    const id = this.generatePatternId();
    const signature = await this.computeSignature(content);
    const tokens = this.tokenize(content);
    const embedding = await this.computeEmbedding(content);

    const pattern: MessagePattern = {
      id,
      signature,
      tokens,
      emotionalTone: context.tone,
      persuasionTechnique: context.technique,
      successRate: 0.5, // Prior neutral belief
      usageCount: 0,
      contextTags: context.tags,
      createdAt: new Date(),
      lastUsed: new Date(),
      decayFactor: 1.0,
    };

    this.patterns.set(id, pattern);
    this.embeddings.set(id, embedding);

    return pattern;
  }

  /**
   * Find similar patterns using semantic similarity + context matching
   */
  async findSimilar(
    query: string,
    context: {
      personaType?: string;
      industry?: string;
      stage?: string;
      limit?: number;
    }
  ): Promise<PatternMatch[]> {
    const queryEmbedding = await this.computeEmbedding(query);
    const limit = context.limit ?? 10;
    const matches: PatternMatch[] = [];

    for (const [id, pattern] of this.patterns) {
      const embedding = this.embeddings.get(id);
      if (!embedding) continue;

      // Compute cosine similarity
      const similarity = this.cosineSimilarity(queryEmbedding, embedding);

      // Context relevance scoring
      const contextRelevance = this.scoreContextRelevance(pattern, context);

      // Predicted success weighted by recency and confidence
      const predictedSuccess = this.predictSuccess(pattern, similarity, contextRelevance);

      if (predictedSuccess >= this.MIN_CONFIDENCE) {
        matches.push({
          pattern,
          similarity,
          contextRelevance,
          predictedSuccess,
        });
      }
    }

    // Sort by predicted success, return top N
    return matches.sort((a, b) => b.predictedSuccess - a.predictedSuccess).slice(0, limit);
  }

  /**
   * Reinforce pattern based on outcome signal
   */
  reinforcePattern(
    patternId: string,
    outcome: {
      type: 'positive' | 'negative' | 'neutral';
      strength: number; // 0-1
      context: Record<string, unknown>;
    }
  ): void {
    const pattern = this.patterns.get(patternId);
    if (!pattern) return;

    // Bayesian update of success rate
    const priorSuccess = pattern.successRate;
    const priorWeight = Math.min(pattern.usageCount, 100);

    const outcomeValue = outcome.type === 'positive' ? 1 : outcome.type === 'negative' ? 0 : 0.5;

    const newSuccessRate =
      (priorSuccess * priorWeight + outcomeValue * outcome.strength) /
      (priorWeight + outcome.strength);

    pattern.successRate = newSuccessRate;
    pattern.usageCount += 1;
    pattern.lastUsed = new Date();
    pattern.decayFactor = 1.0; // Reset decay on use

    this.patterns.set(patternId, pattern);

    // Trigger evolution if significant learning
    if (Math.abs(newSuccessRate - priorSuccess) > 0.1) {
      this.triggerEvolution(pattern, outcome);
    }
  }

  /**
   * Evolve patterns through mutation and recombination
   */
  private async triggerEvolution(
    pattern: MessagePattern,
    context: { type: string; strength: number }
  ): Promise<void> {
    // Find complementary successful patterns
    const complementary = Array.from(this.patterns.values())
      .filter(p => p.id !== pattern.id && p.successRate > 0.7)
      .slice(0, 5);

    if (complementary.length === 0) return;

    // Create hybrid patterns (conceptual - would use LLM in production)
    for (const partner of complementary) {
      const evolution: PatternEvolution = {
        parentId: pattern.id,
        mutation: `hybrid-${partner.id}`,
        performanceDelta: 0,
      };
      this.evolutionHistory.push(evolution);
    }
  }

  /**
   * Apply time-based decay to patterns
   */
  applyDecay(): void {
    const now = new Date();

    for (const [id, pattern] of this.patterns) {
      const daysSinceUse = (now.getTime() - pattern.lastUsed.getTime()) / (1000 * 60 * 60 * 24);
      pattern.decayFactor *= Math.pow(this.DECAY_RATE, daysSinceUse);

      // Remove patterns that have decayed below threshold
      if (pattern.decayFactor < 0.1 && pattern.usageCount < 5) {
        this.patterns.delete(id);
        this.embeddings.delete(id);
      }
    }
  }

  /**
   * Export patterns for analysis or transfer
   */
  exportPatterns(filter?: {
    minSuccess?: number;
    minUsage?: number;
    tags?: string[];
  }): MessagePattern[] {
    let patterns = Array.from(this.patterns.values());

    if (filter) {
      if (filter.minSuccess !== undefined) {
        patterns = patterns.filter(p => p.successRate >= filter.minSuccess!);
      }
      if (filter.minUsage !== undefined) {
        patterns = patterns.filter(p => p.usageCount >= filter.minUsage!);
      }
      if (filter.tags?.length) {
        patterns = patterns.filter(p => filter.tags!.some(tag => p.contextTags.includes(tag)));
      }
    }

    return patterns;
  }

  /**
   * Import patterns from another index (federated learning)
   */
  async importPatterns(patterns: MessagePattern[], trustWeight: number = 0.5): Promise<void> {
    for (const imported of patterns) {
      const existing = this.patterns.get(imported.id);

      if (existing) {
        // Merge with existing - weighted average
        existing.successRate =
          existing.successRate * (1 - trustWeight) + imported.successRate * trustWeight;
        existing.usageCount += Math.floor(imported.usageCount * trustWeight);
      } else {
        // Add new pattern with reduced initial confidence
        const adapted = {
          ...imported,
          successRate: imported.successRate * trustWeight,
          usageCount: Math.floor(imported.usageCount * trustWeight),
        };
        this.patterns.set(imported.id, adapted);

        // Compute embedding for imported pattern
        const embedding = await this.computeEmbedding(imported.tokens.join(' '));
        this.embeddings.set(imported.id, embedding);
      }
    }
  }

  // === Private Helper Methods ===

  private generatePatternId(): string {
    return `pat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async computeSignature(content: string): Promise<string> {
    // Semantic fingerprint - would use actual hashing in production
    const normalized = content.toLowerCase().trim();
    return btoa(normalized.slice(0, 100)).slice(0, 32);
  }

  private tokenize(content: string): string[] {
    return content
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(t => t.length > 2);
  }

  private async computeEmbedding(content: string): Promise<number[]> {
    // Placeholder - would use actual embedding model (OpenAI, Cohere, etc.)
    // Returns 384-dimensional mock embedding based on content hash
    const hash = this.simpleHash(content);
    return Array.from(
      { length: 384 },
      (_, i) => Math.sin(hash * (i + 1)) * 0.5 + Math.cos(hash * (i + 2)) * 0.5
    );
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private scoreContextRelevance(pattern: MessagePattern, context: Record<string, unknown>): number {
    let score = 0;
    let factors = 0;

    // Tag overlap
    if (context.industry && pattern.contextTags.includes(context.industry as string)) {
      score += 1;
    }
    factors++;

    if (context.stage && pattern.contextTags.includes(context.stage as string)) {
      score += 1;
    }
    factors++;

    // Persona alignment (simplified)
    if (context.personaType) {
      const personaToneMap: Record<string, EmotionalTone[]> = {
        'analytical-skeptic': ['analytical', 'authoritative'],
        'visionary-champion': ['visionary', 'collaborative'],
        'pragmatic-evaluator': ['analytical', 'authoritative'],
        'time-pressed-executive': ['urgent', 'authoritative'],
      };

      const preferredTones = personaToneMap[context.personaType as string] || [];
      if (preferredTones.includes(pattern.emotionalTone)) {
        score += 1;
      }
    }
    factors++;

    return factors > 0 ? score / factors : 0;
  }

  private predictSuccess(
    pattern: MessagePattern,
    similarity: number,
    contextRelevance: number
  ): number {
    // Weighted combination of factors
    const baseSuccess = pattern.successRate * pattern.decayFactor;
    const confidenceBoost = Math.min(pattern.usageCount / 50, 1) * 0.2;

    return baseSuccess * 0.4 + similarity * 0.3 + contextRelevance * 0.2 + confidenceBoost * 0.1;
  }
}

// Singleton export
export const patternIndex = new PatternIndex();
export default PatternIndex;
