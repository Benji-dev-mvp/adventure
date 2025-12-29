// @ts-nocheck
/**
 * Hunter Agent
 *
 * Finds accounts & contacts dynamically based on ICP signals.
 * Continuously scans for new opportunities matching target profiles.
 */

import { BaseAgent, AgentContext, ExecutionResult } from './BaseAgent';
import type { Task } from './types';

interface AccountMatch {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: string;
  signals: string[];
  matchScore: number;
  contacts: ContactMatch[];
}

interface ContactMatch {
  id: string;
  name: string;
  title: string;
  email?: string;
  linkedin?: string;
  seniority: string;
  department: string;
  relevanceScore: number;
}

interface HuntingCriteria {
  industries: string[];
  companySizes: string[];
  technologies: string[];
  signals: string[];
  excludeDomains: string[];
  geographies: string[];
  minMatchScore: number;
}

export class HunterAgent extends BaseAgent {
  private huntingPatterns: Map<string, number> = new Map();
  private discoveredAccounts: Set<string> = new Set();

  constructor(name: string = 'Hunter Prime') {
    super('hunter', name, {
      autonomyLevel: 'autonomous',
      riskTolerance: 0.7,
      creativityBias: 0.6,
    });
  }

  protected initializeCapabilities(): void {
    this.capabilities = [
      {
        id: 'account-discovery',
        name: 'Account Discovery',
        skillLevel: 0.85,
        cost: 5,
        latency: 2000,
        successRate: 0.9,
      },
      {
        id: 'contact-identification',
        name: 'Contact Identification',
        skillLevel: 0.8,
        cost: 3,
        latency: 1500,
        successRate: 0.85,
      },
      {
        id: 'signal-detection',
        name: 'Intent Signal Detection',
        skillLevel: 0.75,
        cost: 4,
        latency: 1000,
        successRate: 0.8,
      },
      {
        id: 'icp-matching',
        name: 'ICP Pattern Matching',
        skillLevel: 0.9,
        cost: 2,
        latency: 500,
        successRate: 0.95,
      },
    ];
  }

  protected async executeTask(task: Task, context: AgentContext): Promise<ExecutionResult> {
    switch (task.type) {
      case 'find-accounts':
        return this.findAccounts(task);
      case 'enrich-contact':
        return this.enrichContact(task);
      case 'research-signal':
        return this.detectSignals(task);
      default:
        throw new Error(`Hunter cannot handle task type: ${task.type}`);
    }
  }

  /**
   * Find accounts matching ICP criteria
   */
  private async findAccounts(task: Task): Promise<ExecutionResult> {
    const criteria = task.input.data as HuntingCriteria;
    const accounts: AccountMatch[] = [];

    // Simulate account discovery with intelligent matching
    const potentialAccounts = await this.scanSources(criteria);

    for (const account of potentialAccounts) {
      const matchScore = this.calculateMatchScore(account, criteria);

      if (matchScore >= criteria.minMatchScore && !this.discoveredAccounts.has(account.domain)) {
        // Find relevant contacts
        const contacts = await this.identifyContacts(account);

        accounts.push({
          ...account,
          matchScore,
          contacts,
        });

        this.discoveredAccounts.add(account.domain);
        this.updateHuntingPatterns(account, matchScore);
      }
    }

    // Sort by match score
    accounts.sort((a, b) => b.matchScore - a.matchScore);

    const learnings = this.extractLearnings(accounts, criteria);

    return {
      success: accounts.length > 0,
      output: {
        accounts,
        totalFound: accounts.length,
        averageScore: accounts.reduce((a, b) => a + b.matchScore, 0) / accounts.length || 0,
        signalDistribution: this.analyzeSignalDistribution(accounts),
      },
      artifacts: accounts,
      learnings,
      nextSuggestion: accounts.length < 5 ? 'expand-criteria' : undefined,
    };
  }

  /**
   * Enrich contact with additional data
   */
  private async enrichContact(task: Task): Promise<ExecutionResult> {
    const contactId = task.input.data as { contactId: string; accountId: string };

    // Simulate enrichment process
    const enrichedData = await this.performEnrichment(contactId);

    return {
      success: enrichedData.email !== undefined || enrichedData.linkedin !== undefined,
      output: enrichedData,
      artifacts: [enrichedData],
      learnings: enrichedData.email ? ['Email enrichment successful'] : [],
    };
  }

  /**
   * Detect intent signals for an account
   */
  private async detectSignals(task: Task): Promise<ExecutionResult> {
    const accountId = task.input.data as { accountId: string };

    const signals = await this.scanForSignals(accountId);

    return {
      success: signals.length > 0,
      output: {
        signals,
        strongestSignal: signals[0] || null,
        urgency: this.calculateUrgency(signals),
      },
      artifacts: signals,
      learnings: signals.map(s => `Signal detected: ${s.type}`),
    };
  }

  // === Private Helper Methods ===

  private async scanSources(
    criteria: HuntingCriteria
  ): Promise<Omit<AccountMatch, 'matchScore' | 'contacts'>[]> {
    // Simulate scanning multiple data sources
    await this.simulateLatency(1000);

    // Generate synthetic accounts based on criteria
    const accounts: Omit<AccountMatch, 'matchScore' | 'contacts'>[] = [];
    const count = Math.floor(Math.random() * 20) + 5;

    for (let i = 0; i < count; i++) {
      const industry =
        criteria.industries[Math.floor(Math.random() * criteria.industries.length)] || 'Technology';
      const size =
        criteria.companySizes[Math.floor(Math.random() * criteria.companySizes.length)] || '50-200';

      accounts.push({
        id: `acc_${Date.now()}_${i}`,
        name: this.generateCompanyName(),
        domain: this.generateDomain(),
        industry,
        size,
        signals: this.generateSignals(criteria.signals),
      });
    }

    return accounts;
  }

  private calculateMatchScore(
    account: Omit<AccountMatch, 'matchScore' | 'contacts'>,
    criteria: HuntingCriteria
  ): number {
    let score = 0;
    let factors = 0;

    // Industry match
    if (criteria.industries.includes(account.industry)) {
      score += 0.3;
    }
    factors++;

    // Size match
    if (criteria.companySizes.includes(account.size)) {
      score += 0.2;
    }
    factors++;

    // Signal overlap
    const signalOverlap = account.signals.filter(s => criteria.signals.includes(s)).length;
    score += (signalOverlap / Math.max(criteria.signals.length, 1)) * 0.5;
    factors++;

    // Apply learned patterns
    const patternBoost = this.getPatternBoost(account.industry, account.size);
    score += patternBoost * 0.1;

    return Math.min(score, 1);
  }

  private async identifyContacts(
    account: Omit<AccountMatch, 'matchScore' | 'contacts'>
  ): Promise<ContactMatch[]> {
    await this.simulateLatency(500);

    const contacts: ContactMatch[] = [];
    const count = Math.floor(Math.random() * 5) + 1;

    const titles = [
      'VP of Sales',
      'Head of Marketing',
      'Director of Operations',
      'CTO',
      'CEO',
      'VP of Engineering',
      'Director of Business Development',
    ];

    const departments = ['Sales', 'Marketing', 'Engineering', 'Operations', 'Executive'];
    const seniorities = ['VP', 'Director', 'Manager', 'C-Level'];

    for (let i = 0; i < count; i++) {
      contacts.push({
        id: `contact_${Date.now()}_${i}`,
        name: this.generatePersonName(),
        title: titles[Math.floor(Math.random() * titles.length)],
        email: Math.random() > 0.3 ? `contact${i}@${account.domain}` : undefined,
        linkedin: Math.random() > 0.2 ? `linkedin.com/in/contact-${i}` : undefined,
        seniority: seniorities[Math.floor(Math.random() * seniorities.length)],
        department: departments[Math.floor(Math.random() * departments.length)],
        relevanceScore: Math.random() * 0.5 + 0.5,
      });
    }

    return contacts.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  private async performEnrichment(contactId: {
    contactId: string;
    accountId: string;
  }): Promise<Record<string, unknown>> {
    await this.simulateLatency(800);

    return {
      contactId: contactId.contactId,
      email: Math.random() > 0.2 ? `enriched@example.com` : undefined,
      linkedin: `linkedin.com/in/enriched-${contactId.contactId}`,
      phone: Math.random() > 0.5 ? '+1-555-0100' : undefined,
      verified: Math.random() > 0.3,
      enrichedAt: new Date(),
    };
  }

  private async scanForSignals(accountId: {
    accountId: string;
  }): Promise<Array<{ type: string; strength: number; source: string }>> {
    await this.simulateLatency(600);

    const signalTypes = [
      'hiring-surge',
      'funding-round',
      'tech-adoption',
      'leadership-change',
      'expansion-indicator',
      'competitor-mention',
    ];

    const signals: Array<{ type: string; strength: number; source: string }> = [];
    const count = Math.floor(Math.random() * 4);

    for (let i = 0; i < count; i++) {
      signals.push({
        type: signalTypes[Math.floor(Math.random() * signalTypes.length)],
        strength: Math.random() * 0.5 + 0.5,
        source: ['linkedin', 'news', 'job-boards', 'g2'][Math.floor(Math.random() * 4)],
      });
    }

    return signals.sort((a, b) => b.strength - a.strength);
  }

  private updateHuntingPatterns(
    account: Omit<AccountMatch, 'matchScore' | 'contacts'>,
    score: number
  ): void {
    const key = `${account.industry}:${account.size}`;
    const currentWeight = this.huntingPatterns.get(key) || 0.5;
    this.huntingPatterns.set(key, currentWeight * 0.9 + score * 0.1);
  }

  private getPatternBoost(industry: string, size: string): number {
    const key = `${industry}:${size}`;
    return this.huntingPatterns.get(key) || 0;
  }

  private extractLearnings(accounts: AccountMatch[], criteria: HuntingCriteria): string[] {
    const learnings: string[] = [];

    if (accounts.length > 10) {
      learnings.push('High-yield criteria combination identified');
    }

    const avgScore = accounts.reduce((a, b) => a + b.matchScore, 0) / accounts.length;
    if (avgScore > 0.8) {
      learnings.push(`Strong ICP alignment in ${criteria.industries.join(', ')}`);
    }

    const signalCounts = new Map<string, number>();
    accounts.forEach(a =>
      a.signals.forEach(s => signalCounts.set(s, (signalCounts.get(s) || 0) + 1))
    );
    const topSignal = Array.from(signalCounts.entries()).sort((a, b) => b[1] - a[1])[0];
    if (topSignal && topSignal[1] > accounts.length * 0.5) {
      learnings.push(`Signal "${topSignal[0]}" is strong indicator for this ICP`);
    }

    return learnings;
  }

  private analyzeSignalDistribution(accounts: AccountMatch[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    accounts.forEach(a => {
      a.signals.forEach(s => {
        distribution[s] = (distribution[s] || 0) + 1;
      });
    });
    return distribution;
  }

  private calculateUrgency(
    signals: Array<{ type: string; strength: number }>
  ): 'high' | 'medium' | 'low' {
    const urgentSignals = ['funding-round', 'hiring-surge', 'expansion-indicator'];
    const hasUrgent = signals.some(s => urgentSignals.includes(s.type) && s.strength > 0.7);
    if (hasUrgent) return 'high';
    if (signals.length > 2) return 'medium';
    return 'low';
  }

  private generateCompanyName(): string {
    const prefixes = ['Nova', 'Apex', 'Summit', 'Vertex', 'Prime', 'Core', 'Nexus', 'Atlas'];
    const suffixes = ['Tech', 'Labs', 'Systems', 'Solutions', 'AI', 'Cloud', 'Data', 'Ops'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  }

  private generateDomain(): string {
    return `${this.generateCompanyName().toLowerCase().replace(/\s/g, '')}.com`;
  }

  private generatePersonName(): string {
    const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery'];
    const lastNames = [
      'Smith',
      'Johnson',
      'Williams',
      'Brown',
      'Jones',
      'Garcia',
      'Miller',
      'Davis',
    ];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  }

  private generateSignals(preferredSignals: string[]): string[] {
    const count = Math.floor(Math.random() * 3) + 1;
    const signals: string[] = [];
    for (let i = 0; i < count; i++) {
      if (preferredSignals.length > 0 && Math.random() > 0.3) {
        signals.push(preferredSignals[Math.floor(Math.random() * preferredSignals.length)]);
      } else {
        signals.push(
          ['hiring-surge', 'funding-round', 'tech-adoption'][Math.floor(Math.random() * 3)]
        );
      }
    }
    return [...new Set(signals)];
  }

  private simulateLatency(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms * 0.1)); // Speed up for development
  }

  protected describeStrategy(task: Task): string {
    return `Hunter will scan ${this.huntingPatterns.size} learned patterns to find high-match accounts`;
  }
}

export default HunterAgent;
