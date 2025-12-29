/**
 * Scout Agent
 *
 * Researches signals and intent. Deep-dives into accounts
 * to uncover timing, triggers, and competitive intelligence.
 */

import { BaseAgent, AgentContext, ExecutionResult } from './BaseAgent';
import type { Task } from './types';

interface SignalIntelligence {
  accountId: string;
  signals: DiscoveredSignal[];
  competitorPresence: CompetitorIntel[];
  buyingCommittee: BuyingCommitteeMember[];
  timingIndicators: TimingIndicator[];
  recommendedApproach: string;
  urgencyScore: number;
}

interface DiscoveredSignal {
  type: string;
  source: string;
  confidence: number;
  evidence: string;
  discoveredAt: Date;
  expiresAt?: Date;
}

interface CompetitorIntel {
  competitor: string;
  relationship: 'active-customer' | 'evaluating' | 'churned' | 'unknown';
  contractEnd?: Date;
  satisfactionSignals: string[];
}

interface BuyingCommitteeMember {
  contactId: string;
  role: 'champion' | 'decision-maker' | 'influencer' | 'blocker' | 'user';
  engagement: number;
  sentiment: 'positive' | 'neutral' | 'negative' | 'unknown';
  notes: string[];
}

interface TimingIndicator {
  type: 'budget-cycle' | 'contract-renewal' | 'initiative' | 'pain-event' | 'growth-trigger';
  timing: 'now' | 'soon' | 'future' | 'passed';
  confidence: number;
  details: string;
}

export class ScoutAgent extends BaseAgent {
  private researchCache: Map<string, SignalIntelligence> = new Map();
  private signalPatterns: Map<string, number> = new Map();

  constructor(name: string = 'Scout Alpha') {
    super('scout', name, {
      autonomyLevel: 'semi-autonomous',
      riskTolerance: 0.4,
      creativityBias: 0.8,
    });
  }

  protected initializeCapabilities(): void {
    this.capabilities = [
      {
        id: 'signal-research',
        name: 'Deep Signal Research',
        skillLevel: 0.9,
        cost: 8,
        latency: 3000,
        successRate: 0.85,
      },
      {
        id: 'competitor-analysis',
        name: 'Competitive Intelligence',
        skillLevel: 0.8,
        cost: 6,
        latency: 2500,
        successRate: 0.8,
      },
      {
        id: 'committee-mapping',
        name: 'Buying Committee Mapping',
        skillLevel: 0.85,
        cost: 7,
        latency: 2000,
        successRate: 0.82,
      },
      {
        id: 'timing-analysis',
        name: 'Timing Window Analysis',
        skillLevel: 0.75,
        cost: 5,
        latency: 1500,
        successRate: 0.78,
      },
    ];
  }

  protected async executeTask(task: Task, _context: AgentContext): Promise<ExecutionResult> {
    switch (task.type) {
      case 'research-signal':
        return this.deepResearch(task);
      default:
        throw new Error(`Scout cannot handle task type: ${task.type}`);
    }
  }

  /**
   * Perform deep research on an account
   */
  private async deepResearch(task: Task): Promise<ExecutionResult> {
    const input = task.input.data as { accountId: string; accountName?: string; domain?: string };

    // Check cache first
    if (this.researchCache.has(input.accountId)) {
      const cached = this.researchCache.get(input.accountId)!;
      const age = Date.now() - cached.signals[0]?.discoveredAt.getTime() || 0;
      if (age < 24 * 60 * 60 * 1000) {
        // 24 hour cache
        return {
          success: true,
          output: cached,
          artifacts: [cached],
          learnings: ['Retrieved from cache'],
        };
      }
    }

    // Parallel research operations
    const [signals, competitors, committee, timing] = await Promise.all([
      this.discoverSignals(input.accountId),
      this.analyzeCompetitors(input.accountId),
      this.mapBuyingCommittee(input.accountId),
      this.analyzeTimingWindows(input.accountId),
    ]);

    const urgencyScore = this.calculateUrgencyScore(signals, timing);
    const recommendedApproach = this.synthesizeApproach(signals, competitors, committee, timing);

    const intelligence: SignalIntelligence = {
      accountId: input.accountId,
      signals,
      competitorPresence: competitors,
      buyingCommittee: committee,
      timingIndicators: timing,
      recommendedApproach,
      urgencyScore,
    };

    // Cache the results
    this.researchCache.set(input.accountId, intelligence);

    // Extract learnings
    const learnings = this.extractResearchLearnings(intelligence);

    return {
      success: signals.length > 0 || committee.length > 0,
      output: intelligence,
      artifacts: [intelligence],
      learnings,
      nextSuggestion: urgencyScore > 0.7 ? 'prioritize-outreach' : undefined,
    };
  }

  // === Research Methods ===

  private async discoverSignals(_accountId: string): Promise<DiscoveredSignal[]> {
    await this.simulateLatency(800);

    const signalTypes = [
      { type: 'hiring-surge', sources: ['linkedin', 'glassdoor'] },
      { type: 'funding-round', sources: ['crunchbase', 'news'] },
      { type: 'tech-adoption', sources: ['builtwith', 'g2'] },
      { type: 'leadership-change', sources: ['linkedin', 'news'] },
      { type: 'expansion-indicator', sources: ['news', 'job-boards'] },
      { type: 'pain-signal', sources: ['g2-reviews', 'social'] },
    ];

    const signals: DiscoveredSignal[] = [];
    const count = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < count; i++) {
      const signalDef = signalTypes[Math.floor(Math.random() * signalTypes.length)];
      signals.push({
        type: signalDef.type,
        source: signalDef.sources[Math.floor(Math.random() * signalDef.sources.length)],
        confidence: Math.random() * 0.4 + 0.6,
        evidence: this.generateEvidence(signalDef.type),
        discoveredAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      // Update signal patterns
      const patternWeight = this.signalPatterns.get(signalDef.type) || 0.5;
      this.signalPatterns.set(signalDef.type, patternWeight * 0.9 + 0.1);
    }

    return signals.sort((a, b) => b.confidence - a.confidence);
  }

  private async analyzeCompetitors(_accountId: string): Promise<CompetitorIntel[]> {
    await this.simulateLatency(600);

    const competitors = ['Competitor A', 'Competitor B', 'Competitor C', 'Legacy System'];
    const intel: CompetitorIntel[] = [];
    const count = Math.floor(Math.random() * 3);

    const relationships: CompetitorIntel['relationship'][] = [
      'active-customer',
      'evaluating',
      'churned',
      'unknown',
    ];

    for (let i = 0; i < count; i++) {
      const relationship = relationships[Math.floor(Math.random() * relationships.length)];
      intel.push({
        competitor: competitors[Math.floor(Math.random() * competitors.length)],
        relationship,
        contractEnd:
          relationship === 'active-customer'
            ? new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000)
            : undefined,
        satisfactionSignals: this.generateSatisfactionSignals(relationship),
      });
    }

    return intel;
  }

  private async mapBuyingCommittee(accountId: string): Promise<BuyingCommitteeMember[]> {
    await this.simulateLatency(700);

    const roles: BuyingCommitteeMember['role'][] = [
      'champion',
      'decision-maker',
      'influencer',
      'blocker',
      'user',
    ];
    const sentiments: BuyingCommitteeMember['sentiment'][] = [
      'positive',
      'neutral',
      'negative',
      'unknown',
    ];

    const committee: BuyingCommitteeMember[] = [];
    const count = Math.floor(Math.random() * 5) + 2;

    for (let i = 0; i < count; i++) {
      committee.push({
        contactId: `contact_${accountId}_${i}`,
        role: roles[Math.floor(Math.random() * roles.length)],
        engagement: Math.random(),
        sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
        notes: [this.generateCommitteeNote()],
      });
    }

    // Ensure at least one decision-maker
    if (!committee.some(c => c.role === 'decision-maker')) {
      committee[0].role = 'decision-maker';
    }

    return committee.sort((a, b) => {
      const roleOrder = { 'decision-maker': 0, champion: 1, influencer: 2, user: 3, blocker: 4 };
      return (roleOrder[a.role] || 5) - (roleOrder[b.role] || 5);
    });
  }

  private async analyzeTimingWindows(_accountId: string): Promise<TimingIndicator[]> {
    await this.simulateLatency(500);

    const types: TimingIndicator['type'][] = [
      'budget-cycle',
      'contract-renewal',
      'initiative',
      'pain-event',
      'growth-trigger',
    ];
    const timings: TimingIndicator['timing'][] = ['now', 'soon', 'future', 'passed'];

    const indicators: TimingIndicator[] = [];
    const count = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      indicators.push({
        type,
        timing: timings[Math.floor(Math.random() * timings.length)],
        confidence: Math.random() * 0.4 + 0.5,
        details: this.generateTimingDetails(type),
      });
    }

    return indicators.sort((a, b) => {
      const timingOrder = { now: 0, soon: 1, future: 2, passed: 3 };
      return (timingOrder[a.timing] || 4) - (timingOrder[b.timing] || 4);
    });
  }

  // === Synthesis Methods ===

  private calculateUrgencyScore(signals: DiscoveredSignal[], timing: TimingIndicator[]): number {
    let score = 0;
    let factors = 0;

    // Signal strength
    const avgSignalConfidence =
      signals.reduce((a, b) => a + b.confidence, 0) / Math.max(signals.length, 1);
    score += avgSignalConfidence * 0.4;
    factors++;

    // Timing urgency
    const urgentTiming = timing.filter(t => t.timing === 'now' || t.timing === 'soon');
    if (urgentTiming.length > 0) {
      score += (urgentTiming.length / timing.length) * 0.4;
    }
    factors++;

    // High-value signals boost
    const highValueSignals = ['funding-round', 'expansion-indicator', 'pain-signal'];
    const hasHighValue = signals.some(s => highValueSignals.includes(s.type));
    if (hasHighValue) {
      score += 0.2;
    }
    factors++;

    return Math.min(score, 1);
  }

  private synthesizeApproach(
    signals: DiscoveredSignal[],
    competitors: CompetitorIntel[],
    committee: BuyingCommitteeMember[],
    timing: TimingIndicator[]
  ): string {
    const approaches: string[] = [];

    // Signal-based approach
    if (signals.some(s => s.type === 'pain-signal')) {
      approaches.push('Lead with pain acknowledgment and solution');
    }
    if (signals.some(s => s.type === 'funding-round')) {
      approaches.push('Position as growth enabler');
    }
    if (signals.some(s => s.type === 'hiring-surge')) {
      approaches.push('Emphasize scalability and team efficiency');
    }

    // Competitor-based approach
    const churned = competitors.find(c => c.relationship === 'churned');
    if (churned) {
      approaches.push(`Reference ${churned.competitor} limitations`);
    }
    const active = competitors.find(c => c.relationship === 'active-customer');
    if (active && active.contractEnd) {
      const daysToRenewal = (active.contractEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      if (daysToRenewal < 90) {
        approaches.push('Target upcoming renewal window');
      }
    }

    // Committee-based approach
    const champion = committee.find(c => c.role === 'champion' && c.sentiment === 'positive');
    if (champion) {
      approaches.push('Leverage internal champion');
    }
    const blocker = committee.find(c => c.role === 'blocker');
    if (blocker) {
      approaches.push('Prepare blocker mitigation strategy');
    }

    // Timing-based approach
    if (timing.some(t => t.timing === 'now')) {
      approaches.push('Execute immediately - window is open');
    }

    return approaches.length > 0
      ? approaches.join('. ')
      : 'Standard multi-touch sequence with personalization';
  }

  private extractResearchLearnings(intel: SignalIntelligence): string[] {
    const learnings: string[] = [];

    if (intel.urgencyScore > 0.7) {
      learnings.push('High-urgency account identified - prioritize for immediate action');
    }

    if (intel.buyingCommittee.some(c => c.role === 'champion')) {
      learnings.push('Champion identified - multi-threading opportunity');
    }

    if (intel.competitorPresence.some(c => c.relationship === 'churned')) {
      learnings.push('Competitor churn detected - displacement opportunity');
    }

    const strongSignals = intel.signals.filter(s => s.confidence > 0.8);
    if (strongSignals.length > 2) {
      learnings.push(`Strong signal cluster: ${strongSignals.map(s => s.type).join(', ')}`);
    }

    return learnings;
  }

  // === Helper Methods ===

  private generateEvidence(signalType: string): string {
    const evidenceMap: Record<string, string[]> = {
      'hiring-surge': ['Posted 15 new roles in engineering', '3x hiring velocity vs last quarter'],
      'funding-round': ['Announced Series B of $25M', 'Added 3 new board members'],
      'tech-adoption': ['Migrating to cloud infrastructure', 'Adopted new CRM system'],
      'leadership-change': ['New VP of Sales appointed', 'CTO transition announced'],
      'expansion-indicator': ['Opening new office in EU', 'Launched in 5 new markets'],
      'pain-signal': ['G2 review mentions scaling issues', 'LinkedIn post about tool frustration'],
    };
    const options = evidenceMap[signalType] || ['General activity detected'];
    return options[Math.floor(Math.random() * options.length)];
  }

  private generateSatisfactionSignals(relationship: CompetitorIntel['relationship']): string[] {
    if (relationship === 'churned') {
      return ['Left negative review', 'Mentioned limitations on LinkedIn'];
    }
    if (relationship === 'active-customer') {
      return Math.random() > 0.5
        ? ['Appears satisfied', 'Renewed last year']
        : ['Mixed reviews', 'Exploring alternatives'];
    }
    return [];
  }

  private generateCommitteeNote(): string {
    const notes = [
      'Engaged with content on LinkedIn',
      'Attended competitor webinar',
      'Active in industry Slack community',
      'Published thought leadership on pain points',
      'Connected with our customers',
      'Mentioned evaluation in social post',
    ];
    return notes[Math.floor(Math.random() * notes.length)];
  }

  private generateTimingDetails(type: TimingIndicator['type']): string {
    const details: Record<string, string[]> = {
      'budget-cycle': ['Q1 budget planning', 'Fiscal year starts in March'],
      'contract-renewal': ['Current vendor contract ends Q2', 'Annual renewal coming up'],
      initiative: ['Digital transformation project', 'GTM optimization initiative'],
      'pain-event': ['Recent outage with current tool', 'Missed targets last quarter'],
      'growth-trigger': ['Just raised funding', 'Expanding sales team'],
    };
    const options = details[type] || ['General timing signal'];
    return options[Math.floor(Math.random() * options.length)];
  }

  private simulateLatency(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms * 0.1));
  }

  protected describeStrategy(_task: Task): string {
    return `Scout will perform deep research across ${this.capabilities.length} intelligence dimensions`;
  }
}

export default ScoutAgent;
