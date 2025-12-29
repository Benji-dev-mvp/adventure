/**
 * Writer Agent
 * 
 * Crafts messaging personalizations. Generates hyper-personalized
 * copy that adapts to persona, signal, and context.
 */

import { BaseAgent, AgentContext, ExecutionResult } from './BaseAgent';
import type { Task } from './types';
import type { PersonaType, EmotionalTone } from '../../ai/memory/types';

interface MessageRequest {
  contactId: string;
  accountId: string;
  persona: PersonaType;
  context: {
    signals: string[];
    previousMessages: number;
    lastResponse?: string;
    industry: string;
    companySize: string;
    painPoints: string[];
  };
  constraints: {
    maxLength: number;
    tone: EmotionalTone;
    channel: 'email' | 'linkedin' | 'phone-script';
    sequencePosition: number;
  };
}

interface GeneratedMessage {
  id: string;
  subject?: string;
  body: string;
  variables: MessageVariable[];
  alternates: string[];
  confidence: number;
  reasoning: string;
  suggestedSendTime?: Date;
}

interface MessageVariable {
  name: string;
  value: string;
  type: 'personalization' | 'dynamic' | 'conditional';
}

export class WriterAgent extends BaseAgent {
  private tonePatterns: Map<EmotionalTone, string[]> = new Map();
  private personaTemplates: Map<PersonaType, MessageTemplate[]> = new Map();
  private successfulPhrases: Map<string, number> = new Map();

  constructor(name: string = 'Writer Prime') {
    super('writer', name, {
      autonomyLevel: 'autonomous',
      riskTolerance: 0.6,
      creativityBias: 0.9,
      speedVsQuality: 0.3, // Quality-focused
    });
    
    this.initializeTonePatterns();
    this.initializePersonaTemplates();
  }

  protected initializeCapabilities(): void {
    this.capabilities = [
      {
        id: 'message-generation',
        name: 'Message Generation',
        skillLevel: 0.9,
        cost: 4,
        latency: 1500,
        successRate: 0.88,
      },
      {
        id: 'personalization',
        name: 'Hyper-Personalization',
        skillLevel: 0.85,
        cost: 3,
        latency: 1000,
        successRate: 0.85,
      },
      {
        id: 'tone-adaptation',
        name: 'Tone Adaptation',
        skillLevel: 0.88,
        cost: 2,
        latency: 500,
        successRate: 0.9,
      },
      {
        id: 'subject-optimization',
        name: 'Subject Line Optimization',
        skillLevel: 0.82,
        cost: 2,
        latency: 400,
        successRate: 0.8,
      },
      {
        id: 'ab-generation',
        name: 'A/B Variant Generation',
        skillLevel: 0.8,
        cost: 5,
        latency: 2000,
        successRate: 0.85,
      },
    ];
  }

  protected async executeTask(task: Task, _context: AgentContext): Promise<ExecutionResult> {
    switch (task.type) {
      case 'craft-message':
        return this.craftMessage(task);
      case 'personalize':
        return this.personalizeMessage(task);
      default:
        throw new Error(`Writer cannot handle task type: ${task.type}`);
    }
  }

  /**
   * Craft a new message from scratch
   */
  private async craftMessage(task: Task): Promise<ExecutionResult> {
    const request = task.input.data as MessageRequest;
    
    // Get persona template
    const templates = this.personaTemplates.get(request.persona) || [];
    const baseTemplate = this.selectBestTemplate(templates, request);
    
    // Generate personalized content
    const personalized = await this.generatePersonalizedContent(baseTemplate, request);
    
    // Apply tone
    const toned = this.applyTone(personalized, request.constraints.tone);
    
    // Generate subject line if email
    const subject = request.constraints.channel === 'email' 
      ? await this.generateSubject(toned, request)
      : undefined;
    
    // Generate alternates for A/B testing
    const alternates = await this.generateAlternates(toned, request);
    
    // Calculate optimal send time
    const suggestedSendTime = this.calculateSendTime(request);

    const message: GeneratedMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      subject,
      body: toned,
      variables: this.extractVariables(toned),
      alternates,
      confidence: this.calculateConfidence(request),
      reasoning: this.explainReasoning(request),
      suggestedSendTime,
    };

    // Track successful patterns
    this.learnFromGeneration(message, request);

    return {
      success: true,
      output: message,
      artifacts: [message],
      learnings: [
        `Generated ${request.constraints.channel} message for ${request.persona}`,
        `Applied ${request.constraints.tone} tone with ${request.context.signals.length} signal references`,
      ],
    };
  }

  /**
   * Personalize an existing message template
   */
  private async personalizeMessage(task: Task): Promise<ExecutionResult> {
    const input = task.input.data as {
      template: string;
      contact: { name: string; title: string; company: string };
      signals: string[];
      customFields: Record<string, string>;
    };

    let personalized = input.template;
    
    // Replace standard variables
    personalized = personalized.replace(/\{\{name\}\}/g, input.contact.name);
    personalized = personalized.replace(/\{\{firstName\}\}/g, input.contact.name.split(' ')[0]);
    personalized = personalized.replace(/\{\{title\}\}/g, input.contact.title);
    personalized = personalized.replace(/\{\{company\}\}/g, input.contact.company);
    
    // Replace custom fields
    for (const [key, value] of Object.entries(input.customFields)) {
      personalized = personalized.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }
    
    // Add signal-based personalization
    if (input.signals.length > 0) {
      personalized = this.addSignalContext(personalized, input.signals);
    }

    return {
      success: true,
      output: { personalized, original: input.template },
      artifacts: [{ type: 'message', content: personalized }],
      learnings: [`Personalized message with ${Object.keys(input.customFields).length} custom fields`],
    };
  }

  // === Generation Methods ===

  private async generatePersonalizedContent(template: MessageTemplate, request: MessageRequest): Promise<string> {
    await this.simulateLatency(500);
    
    let content = template.body;
    
    // Insert signal references
    if (request.context.signals.length > 0) {
      const signalPhrase = this.buildSignalPhrase(request.context.signals[0]);
      content = content.replace('{{signal_hook}}', signalPhrase);
    }
    
    // Insert pain point reference
    if (request.context.painPoints.length > 0) {
      const painPhrase = this.buildPainPhrase(request.context.painPoints[0]);
      content = content.replace('{{pain_hook}}', painPhrase);
    }
    
    // Adjust for sequence position
    content = this.adjustForSequencePosition(content, request.constraints.sequencePosition);
    
    // Apply length constraint
    content = this.enforceLength(content, request.constraints.maxLength);
    
    return content;
  }

  private applyTone(content: string, tone: EmotionalTone): string {
    // Apply tone-specific transformations
    switch (tone) {
      case 'urgent':
        content = content.replace(/I wanted to reach out/g, 'Quick note');
        content = content.replace(/When you have a moment/g, 'This week');
        break;
      case 'empathetic':
        content = content.replace(/I noticed/g, 'I understand');
        content = content.replace(/you should/g, 'you might consider');
        break;
      case 'authoritative':
        content = content.replace(/I think/g, 'Research shows');
        content = content.replace(/maybe/g, 'specifically');
        break;
      case 'collaborative':
        content = content.replace(/I can help/g, 'We can work together');
        content = content.replace(/Let me know/g, 'Would love to explore');
        break;
    }
    
    return content;
  }

  private async generateSubject(_body: string, request: MessageRequest): Promise<string> {
    await this.simulateLatency(200);
    
    const subjectPatterns = {
      'analytical-skeptic': [
        'Data: {{metric}} improvement for {{company}}',
        'Quick question about {{company}}\'s {{pain}}',
      ],
      'visionary-champion': [
        'The future of {{industry}} at {{company}}',
        'Bold idea for {{company}}',
      ],
      'time-pressed-executive': [
        '{{firstName}}, 2 min read',
        'Re: {{company}} efficiency',
      ],
      'pragmatic-evaluator': [
        '{{company}}: ROI analysis',
        'Benchmarks for {{industry}}',
      ],
    };
    
    const patterns = subjectPatterns[request.persona as keyof typeof subjectPatterns] || [
      'Thoughts on {{company}}\'s {{pain}}',
    ];
    
    let subject = patterns[Math.floor(Math.random() * patterns.length)];
    
    // Fill in variables
    subject = subject.replace('{{company}}', '{{company}}'); // Keep for later resolution
    subject = subject.replace('{{industry}}', request.context.industry);
    subject = subject.replace('{{pain}}', request.context.painPoints[0] || 'growth');
    subject = subject.replace('{{metric}}', Math.floor(Math.random() * 30 + 20) + '%');
    
    return subject;
  }

  private async generateAlternates(primary: string, request: MessageRequest): Promise<string[]> {
    await this.simulateLatency(400);
    
    const alternates: string[] = [];
    
    // Variation 1: Different opening
    const openingVariation = primary.replace(
      /^[^.!?]+[.!?]/,
      this.generateAlternateOpening(request)
    );
    alternates.push(openingVariation);
    
    // Variation 2: Different CTA
    const ctaVariation = this.replaceCallToAction(primary, request);
    alternates.push(ctaVariation);
    
    return alternates;
  }

  private calculateSendTime(request: MessageRequest): Date {
    const now = new Date();
    
    // Persona-based timing
    const timingPrefs: Record<string, { hour: number; day: number }> = {
      'time-pressed-executive': { hour: 7, day: 2 }, // Early Tuesday
      'analytical-skeptic': { hour: 10, day: 3 }, // Mid-morning Wednesday
      'visionary-champion': { hour: 14, day: 4 }, // Afternoon Thursday
      'relationship-builder': { hour: 11, day: 1 }, // Late morning Monday
    };
    
    const pref = timingPrefs[request.persona] || { hour: 9, day: 2 };
    
    // Calculate next occurrence
    const sendTime = new Date(now);
    sendTime.setHours(pref.hour, 0, 0, 0);
    
    // Move to preferred day
    const currentDay = now.getDay();
    const daysUntil = (pref.day - currentDay + 7) % 7 || 7;
    sendTime.setDate(sendTime.getDate() + daysUntil);
    
    return sendTime;
  }

  // === Helper Methods ===

  private initializeTonePatterns(): void {
    this.tonePatterns.set('authoritative', ['research shows', 'data indicates', 'proven to']);
    this.tonePatterns.set('empathetic', ['I understand', 'you might feel', 'it can be challenging']);
    this.tonePatterns.set('urgent', ['time-sensitive', 'this week', 'limited window']);
    this.tonePatterns.set('curious', ['I wonder', 'how do you', 'what if']);
    this.tonePatterns.set('collaborative', ['together', 'partnership', 'let\'s explore']);
  }

  private initializePersonaTemplates(): void {
    const templates: [PersonaType, MessageTemplate[]][] = [
      ['analytical-skeptic', [
        {
          id: 't1',
          body: 'I noticed {{signal_hook}}. Companies in {{industry}} typically see challenges around {{pain_hook}}. Would a 15-minute data review be valuable?',
          successRate: 0.15,
        },
      ]],
      ['visionary-champion', [
        {
          id: 't2',
          body: '{{signal_hook}} caught my attention. I see an opportunity to transform how {{company}} approaches {{pain_hook}}. Open to a quick brainstorm?',
          successRate: 0.18,
        },
      ]],
      ['time-pressed-executive', [
        {
          id: 't3',
          body: '{{signal_hook}}. 2 ideas for {{company}}:\n1. {{pain_hook}} optimization\n2. Revenue acceleration\n\n15 mins this week?',
          successRate: 0.12,
        },
      ]],
      ['pragmatic-evaluator', [
        {
          id: 't4',
          body: 'Given {{signal_hook}}, I wanted to share how similar {{industry}} companies addressed {{pain_hook}}. Happy to share the analysis if useful.',
          successRate: 0.14,
        },
      ]],
    ];
    
    templates.forEach(([persona, temps]) => this.personaTemplates.set(persona, temps));
  }

  private selectBestTemplate(templates: MessageTemplate[], _request: MessageRequest): MessageTemplate {
    if (templates.length === 0) {
      return {
        id: 'default',
        body: 'I noticed {{signal_hook}} and thought of {{company}}. Would love to share how we help with {{pain_hook}}.',
        successRate: 0.1,
      };
    }
    
    // Weight by success rate and context match
    return templates.reduce((best, current) => 
      current.successRate > best.successRate ? current : best
    );
  }

  private buildSignalPhrase(signal: string): string {
    const phrases: Record<string, string> = {
      'hiring-surge': 'your team is growing rapidly',
      'funding-round': 'the recent funding milestone',
      'tech-adoption': 'the technology transformation',
      'leadership-change': 'the new leadership direction',
      'expansion-indicator': 'the market expansion',
      'pain-signal': 'the challenges you\'re navigating',
    };
    return phrases[signal] || 'the recent developments';
  }

  private buildPainPhrase(pain: string): string {
    return pain.toLowerCase().replace(/_/g, ' ');
  }

  private adjustForSequencePosition(content: string, position: number): string {
    if (position === 1) {
      return content; // First touch - full intro
    }
    if (position === 2) {
      return `Following up on my last note. ${content.replace(/^I noticed [^.]+\. /, '')}`;
    }
    if (position >= 3) {
      return `Quick bump — ${content.split('.').slice(1).join('.')}`;
    }
    return content;
  }

  private enforceLength(content: string, maxLength: number): string {
    if (content.length <= maxLength) return content;
    
    // Truncate at sentence boundary
    const sentences = content.split(/[.!?]+/);
    let result = '';
    
    for (const sentence of sentences) {
      if ((result + sentence).length > maxLength - 20) break;
      result += sentence + '. ';
    }
    
    return result.trim();
  }

  private addSignalContext(content: string, signals: string[]): string {
    // Add signal-specific sentences
    const signalSentence = `I noticed ${this.buildSignalPhrase(signals[0])}.`;
    if (!content.includes(signalSentence)) {
      content = signalSentence + ' ' + content;
    }
    return content;
  }

  private generateAlternateOpening(request: MessageRequest): string {
    const openings = [
      `Quick thought for {{firstName}} —`,
      `Noticed something interesting about {{company}} —`,
      `Given the ${this.buildSignalPhrase(request.context.signals[0] || '')} —`,
      `{{firstName}}, curious if you're seeing this too —`,
    ];
    return openings[Math.floor(Math.random() * openings.length)];
  }

  private replaceCallToAction(content: string, _request: MessageRequest): string {
    const ctas = [
      'Worth a quick chat?',
      'Open to a 15-min call?',
      'Happy to share more — interested?',
      'Would a demo be useful?',
      'Let me know your thoughts.',
    ];
    
    // Replace last sentence with new CTA
    const sentences = content.split(/[.!?]+/).filter(s => s.trim());
    sentences[sentences.length - 1] = ' ' + ctas[Math.floor(Math.random() * ctas.length)];
    
    return sentences.join('.').trim();
  }

  private extractVariables(content: string): MessageVariable[] {
    const variables: MessageVariable[] = [];
    const regex = /\{\{(\w+)\}\}/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      variables.push({
        name: match[1],
        value: `{{${match[1]}}}`,
        type: 'personalization',
      });
    }
    
    return variables;
  }

  private calculateConfidence(request: MessageRequest): number {
    let confidence = 0.7;
    
    // Boost for more context
    confidence += request.context.signals.length * 0.05;
    confidence += request.context.painPoints.length * 0.05;
    
    // Reduce for later sequence positions (harder to convert)
    confidence -= request.constraints.sequencePosition * 0.02;
    
    return Math.min(Math.max(confidence, 0.3), 0.95);
  }

  private explainReasoning(request: MessageRequest): string {
    const reasons = [
      `Targeting ${request.persona} persona with ${request.constraints.tone} tone`,
      `Incorporating ${request.context.signals.length} signal(s): ${request.context.signals.join(', ')}`,
      `Sequence position ${request.constraints.sequencePosition} adjustments applied`,
      `Optimized for ${request.constraints.channel} channel`,
    ];
    return reasons.join('. ');
  }

  private learnFromGeneration(message: GeneratedMessage, _request: MessageRequest): void {
    // Track phrases that are used in high-confidence messages
    if (message.confidence > 0.8) {
      const phrases = message.body.split(/[.!?]+/).slice(0, 2);
      phrases.forEach(phrase => {
        const clean = phrase.trim();
        if (clean.length > 10) {
          const count = this.successfulPhrases.get(clean) || 0;
          this.successfulPhrases.set(clean, count + 1);
        }
      });
    }
  }

  private simulateLatency(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms * 0.1));
  }

  protected describeStrategy(_task: Task): string {
    return `Writer will craft personalized message using ${this.personaTemplates.size} persona templates`;
  }
}

interface MessageTemplate {
  id: string;
  body: string;
  successRate: number;
}

export default WriterAgent;
