/**
 * Closer Agent
 * 
 * Handles back-and-forth email negotiation. Manages replies,
 * objection handling, and meeting scheduling autonomously.
 */

import { BaseAgent, AgentContext, ExecutionResult } from './BaseAgent';
import type { Task } from './types';

interface ReplyContext {
  conversationId: string;
  contactId: string;
  accountId: string;
  incomingMessage: string;
  previousMessages: ConversationMessage[];
  contactContext: {
    persona: string;
    sentiment: number;
    engagement: number;
    objections: string[];
  };
}

interface ConversationMessage {
  id: string;
  direction: 'inbound' | 'outbound';
  content: string;
  timestamp: Date;
  sentiment?: number;
}

interface ReplyDecision {
  action: 'reply' | 'schedule' | 'escalate' | 'nurture' | 'close';
  response?: GeneratedReply;
  schedulingLink?: string;
  escalationReason?: string;
  confidence: number;
  reasoning: string;
}

interface GeneratedReply {
  subject?: string;
  body: string;
  tone: string;
  objectionHandling?: string;
  nextSteps: string[];
}

interface NegotiationState {
  stage: 'initial' | 'engaged' | 'objection' | 'scheduling' | 'closing';
  momentum: number;
  blockers: string[];
  opportunities: string[];
}

export class CloserAgent extends BaseAgent {
  private objectionHandlers: Map<string, string[]> = new Map();
  private closingPatterns: Map<string, number> = new Map();
  private negotiationStates: Map<string, NegotiationState> = new Map();

  constructor(name: string = 'Closer Prime') {
    super('closer', name, {
      autonomyLevel: 'semi-autonomous',
      riskTolerance: 0.5,
      creativityBias: 0.7,
      speedVsQuality: 0.4,
    });
    
    this.initializeObjectionHandlers();
  }

  protected initializeCapabilities(): void {
    this.capabilities = [
      {
        id: 'reply-handling',
        name: 'Reply Analysis & Response',
        skillLevel: 0.88,
        cost: 5,
        latency: 1200,
        successRate: 0.85,
      },
      {
        id: 'objection-handling',
        name: 'Objection Handling',
        skillLevel: 0.85,
        cost: 4,
        latency: 800,
        successRate: 0.8,
      },
      {
        id: 'meeting-scheduling',
        name: 'Meeting Scheduling',
        skillLevel: 0.9,
        cost: 3,
        latency: 500,
        successRate: 0.92,
      },
      {
        id: 'negotiation',
        name: 'Value Negotiation',
        skillLevel: 0.82,
        cost: 6,
        latency: 1500,
        successRate: 0.78,
      },
      {
        id: 'sentiment-analysis',
        name: 'Sentiment Analysis',
        skillLevel: 0.87,
        cost: 2,
        latency: 300,
        successRate: 0.9,
      },
    ];
  }

  protected async executeTask(task: Task, _context: AgentContext): Promise<ExecutionResult> {
    switch (task.type) {
      case 'handle-reply':
        return this.handleReply(task);
      case 'schedule-meeting':
        return this.scheduleMeeting(task);
      case 'negotiate':
        return this.negotiate(task);
      default:
        throw new Error(`Closer cannot handle task type: ${task.type}`);
    }
  }

  /**
   * Handle an incoming reply
   */
  private async handleReply(task: Task): Promise<ExecutionResult> {
    const context = task.input.data as ReplyContext;
    
    // Analyze the incoming message
    const analysis = await this.analyzeIncomingMessage(context);
    
    // Get or create negotiation state
    const state = this.getOrCreateNegotiationState(context.conversationId);
    
    // Determine best action
    const decision = await this.decideAction(context, analysis, state);
    
    // Execute decision - response is already prepared by decideAction
    
    // Update negotiation state
    this.updateNegotiationState(context.conversationId, decision, analysis);
    
    // Track patterns for learning
    this.trackClosingPattern(decision, context);

    return {
      success: true,
      output: decision,
      artifacts: decision.response ? [decision.response] : [],
      learnings: [
        `Handled reply with ${decision.action} action`,
        `Sentiment: ${analysis.sentiment.toFixed(2)}, Intent: ${analysis.intent}`,
        ...analysis.objections.map(o => `Objection detected: ${o}`),
      ],
    };
  }

  /**
   * Schedule a meeting
   */
  private async scheduleMeeting(task: Task): Promise<ExecutionResult> {
    const input = task.input.data as {
      contactId: string;
      preferredTimes?: string[];
      duration: number;
      type: 'discovery' | 'demo' | 'negotiation';
    };

    await this.simulateLatency(300);

    // Generate scheduling options
    const schedulingLink = `https://calendar.app/book/${input.contactId}`;
    const suggestedTimes = this.generateSuggestedTimes(input.duration);

    const response: GeneratedReply = {
      body: this.generateSchedulingMessage(input.type, suggestedTimes),
      tone: 'collaborative',
      nextSteps: ['Await time confirmation', 'Send calendar invite', 'Prepare meeting agenda'],
    };

    return {
      success: true,
      output: {
        schedulingLink,
        suggestedTimes,
        response,
      },
      artifacts: [response],
      learnings: [`Generated ${input.type} scheduling request`],
    };
  }

  /**
   * Handle negotiation scenario
   */
  private async negotiate(task: Task): Promise<ExecutionResult> {
    const input = task.input.data as {
      conversationId: string;
      topic: 'pricing' | 'timeline' | 'scope' | 'terms';
      currentPosition: string;
      constraints: { min: number; max: number; ideal: number };
    };

    const state = this.getOrCreateNegotiationState(input.conversationId);
    
    // Analyze negotiation position
    const analysis = this.analyzeNegotiationPosition(input, state);
    
    // Generate negotiation response
    const response = this.generateNegotiationResponse(input, analysis, state);

    return {
      success: true,
      output: {
        response,
        suggestedPosition: analysis.suggestedPosition,
        tactics: analysis.tactics,
        risks: analysis.risks,
      },
      artifacts: [response],
      learnings: [
        `Negotiation on ${input.topic}: suggested ${analysis.suggestedPosition}`,
        ...analysis.tactics.map(t => `Tactic: ${t}`),
      ],
    };
  }

  // === Analysis Methods ===

  private async analyzeIncomingMessage(context: ReplyContext): Promise<{
    sentiment: number;
    intent: string;
    objections: string[];
    buyingSignals: string[];
    urgency: number;
  }> {
    await this.simulateLatency(200);
    
    const message = context.incomingMessage.toLowerCase();
    
    // Sentiment analysis
    const sentiment = this.calculateSentiment(message);
    
    // Intent detection
    const intent = this.detectIntent(message);
    
    // Objection extraction
    const objections = this.extractObjections(message);
    
    // Buying signal detection
    const buyingSignals = this.extractBuyingSignals(message);
    
    // Urgency assessment
    const urgency = this.assessUrgency(message);

    return {
      sentiment,
      intent,
      objections,
      buyingSignals,
      urgency,
    };
  }

  private calculateSentiment(message: string): number {
    let score = 0;
    
    // Positive indicators
    const positives = ['interested', 'love', 'great', 'yes', 'sure', 'sounds good', 'let\'s', 'excited'];
    positives.forEach(p => { if (message.includes(p)) score += 0.2; });
    
    // Negative indicators
    const negatives = ['no', 'not interested', 'unsubscribe', 'stop', 'busy', 'not now', 'remove'];
    negatives.forEach(n => { if (message.includes(n)) score -= 0.3; });
    
    // Neutral/questioning
    const questions = ['?', 'how', 'what', 'when', 'why'];
    questions.forEach(q => { if (message.includes(q)) score += 0.1; });
    
    return Math.max(-1, Math.min(1, score));
  }

  private detectIntent(message: string): string {
    if (message.includes('unsubscribe') || message.includes('remove')) return 'opt-out';
    if (message.includes('not interested') || message.includes('no thanks')) return 'rejection';
    if (message.includes('call') || message.includes('meet') || message.includes('schedule')) return 'meeting';
    if (message.includes('price') || message.includes('cost') || message.includes('budget')) return 'pricing';
    if (message.includes('later') || message.includes('next quarter') || message.includes('reach out')) return 'timing';
    if (message.includes('?')) return 'question';
    if (message.includes('interested') || message.includes('tell me more')) return 'interest';
    return 'unclear';
  }

  private extractObjections(message: string): string[] {
    const objections: string[] = [];
    
    const objectionPatterns = [
      { pattern: /no budget|can't afford|too expensive/i, label: 'budget' },
      { pattern: /not the right time|busy|later/i, label: 'timing' },
      { pattern: /already have|using competitor/i, label: 'existing-solution' },
      { pattern: /need to talk to|check with/i, label: 'authority' },
      { pattern: /not sure|need more info/i, label: 'information' },
      { pattern: /too complex|complicated/i, label: 'complexity' },
    ];
    
    objectionPatterns.forEach(({ pattern, label }) => {
      if (pattern.test(message)) objections.push(label);
    });
    
    return objections;
  }

  private extractBuyingSignals(message: string): string[] {
    const signals: string[] = [];
    
    const signalPatterns = [
      { pattern: /demo|show me/i, label: 'demo-request' },
      { pattern: /pricing|cost|quote/i, label: 'pricing-inquiry' },
      { pattern: /timeline|implement|start/i, label: 'implementation-interest' },
      { pattern: /team|colleagues|share/i, label: 'internal-sharing' },
      { pattern: /compare|vs|versus/i, label: 'evaluation' },
    ];
    
    signalPatterns.forEach(({ pattern, label }) => {
      if (pattern.test(message)) signals.push(label);
    });
    
    return signals;
  }

  private assessUrgency(message: string): number {
    let urgency = 0.5;
    
    if (/asap|urgent|immediately|today|this week/i.test(message)) urgency += 0.3;
    if (/soon|next week|shortly/i.test(message)) urgency += 0.15;
    if (/later|next month|eventually|someday/i.test(message)) urgency -= 0.2;
    if (/next quarter|next year|future/i.test(message)) urgency -= 0.3;
    
    return Math.max(0, Math.min(1, urgency));
  }

  // === Decision Methods ===

  private async decideAction(
    context: ReplyContext,
    analysis: { sentiment: number; intent: string; objections: string[]; buyingSignals: string[]; urgency: number },
    state: NegotiationState
  ): Promise<ReplyDecision> {
    // Opt-out handling
    if (analysis.intent === 'opt-out') {
      return {
        action: 'close',
        confidence: 0.95,
        reasoning: 'Explicit opt-out detected - respecting preference',
      };
    }

    // Rejection handling
    if (analysis.intent === 'rejection' && analysis.sentiment < -0.3) {
      return {
        action: 'nurture',
        confidence: 0.8,
        reasoning: 'Negative response - moving to nurture track',
      };
    }

    // Meeting intent
    if (analysis.intent === 'meeting' || analysis.buyingSignals.includes('demo-request')) {
      return {
        action: 'schedule',
        schedulingLink: 'https://calendar.app/book',
        confidence: 0.9,
        reasoning: 'Clear meeting intent detected - initiating scheduling',
      };
    }

    // Objection handling
    if (analysis.objections.length > 0) {
      const response = await this.generateObjectionResponse(analysis.objections, context);
      return {
        action: 'reply',
        response,
        confidence: 0.75,
        reasoning: `Addressing objection(s): ${analysis.objections.join(', ')}`,
      };
    }

    // Positive engagement
    if (analysis.sentiment > 0.2 || analysis.buyingSignals.length > 0) {
      const response = await this.generateEngagementResponse(analysis, context);
      return {
        action: 'reply',
        response,
        confidence: 0.85,
        reasoning: 'Positive signals - advancing conversation',
      };
    }

    // Question handling
    if (analysis.intent === 'question') {
      const response = await this.generateQuestionResponse(context);
      return {
        action: 'reply',
        response,
        confidence: 0.8,
        reasoning: 'Answering question to maintain engagement',
      };
    }

    // Default: reply to continue conversation
    const response = await this.generateFollowUpResponse(context, state);
    return {
      action: 'reply',
      response,
      confidence: 0.6,
      reasoning: 'Continuing conversation with follow-up',
    };
  }

  // === Response Generation ===

  private async generateObjectionResponse(
    objections: string[],
    context: ReplyContext
  ): Promise<GeneratedReply> {
    await this.simulateLatency(400);
    
    const primaryObjection = objections[0];
    const handlers = this.objectionHandlers.get(primaryObjection) || [];
    const handlerText = handlers[Math.floor(Math.random() * handlers.length)] || 
      'I completely understand. Let me address that...';

    return {
      body: `${handlerText}\n\nWould it help to see how other ${context.contactContext.persona}s in your space have approached this?`,
      tone: 'empathetic',
      objectionHandling: primaryObjection,
      nextSteps: ['Await response', 'Prepare case study', 'Consider escalation if no response'],
    };
  }

  private async generateEngagementResponse(
    analysis: { sentiment: number; buyingSignals: string[] },
    _context: ReplyContext
  ): Promise<GeneratedReply> {
    await this.simulateLatency(300);
    
    let body = 'Great to hear your interest! ';
    
    if (analysis.buyingSignals.includes('pricing-inquiry')) {
      body += 'I\'d be happy to walk through our pricing structure. It\'s typically based on your team size and usage patterns. ';
    }
    if (analysis.buyingSignals.includes('demo-request')) {
      body += 'I can set up a personalized demo that focuses on your specific use cases. ';
    }
    
    body += 'What\'s the best time for a quick call this week?';

    return {
      body,
      tone: 'collaborative',
      nextSteps: ['Offer specific times', 'Prepare demo environment', 'Research account further'],
    };
  }

  private async generateQuestionResponse(_context: ReplyContext): Promise<GeneratedReply> {
    await this.simulateLatency(250);
    
    return {
      body: 'Great question! Let me give you a clear answer...\n\n[Answer would be generated based on question analysis]\n\nDoes that help clarify things? Happy to dive deeper on any aspect.',
      tone: 'helpful',
      nextSteps: ['Provide detailed answer', 'Offer additional resources', 'Bridge to meeting'],
    };
  }

  private async generateFollowUpResponse(
    _context: ReplyContext,
    state: NegotiationState
  ): Promise<GeneratedReply> {
    await this.simulateLatency(200);
    
    const momentum = state.momentum;
    let body: string;
    
    if (momentum > 0.7) {
      body = 'Thanks for your response! Given the momentum here, shall we lock in a time to discuss next steps?';
    } else if (momentum > 0.4) {
      body = 'Appreciate you getting back to me. To make sure I\'m addressing what matters most to you - what\'s your top priority right now?';
    } else {
      body = 'Thanks for the reply. I want to make sure I\'m being helpful - is there a specific challenge you\'re trying to solve that I could speak to?';
    }

    return {
      body,
      tone: momentum > 0.6 ? 'confident' : 'curious',
      nextSteps: ['Await response', 'Adjust approach based on answer'],
    };
  }

  private generateSchedulingMessage(type: string, suggestedTimes: string[]): string {
    const intros: Record<string, string> = {
      discovery: 'Excited to learn more about your goals.',
      demo: 'Looking forward to showing you how this works in practice.',
      negotiation: 'Let\'s find a time to work through the details.',
    };

    return `${intros[type] || 'Great!'} Here are a few times that work on my end:\n\n${suggestedTimes.map(t => `• ${t}`).join('\n')}\n\nAlternatively, feel free to grab any open slot: [calendar link]`;
  }

  private generateSuggestedTimes(duration: number): string[] {
    const times: string[] = [];
    const now = new Date();
    
    for (let i = 1; i <= 3; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i + (date.getDay() === 0 ? 1 : date.getDay() === 6 ? 2 : 0));
      date.setHours(10 + i, 0, 0, 0);
      times.push(`${date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} (${duration} min)`);
    }
    
    return times;
  }

  private analyzeNegotiationPosition(
    input: { topic: string; constraints: { min: number; max: number; ideal: number } },
    _state: NegotiationState
  ): { suggestedPosition: number; tactics: string[]; risks: string[] } {
    const { min, max: _max, ideal } = input.constraints;
    const momentum = _state.momentum;
    
    // Position based on momentum
    let suggestedPosition: number;
    if (momentum > 0.7) {
      suggestedPosition = ideal; // Strong position - aim high
    } else if (momentum > 0.4) {
      suggestedPosition = (ideal + min) / 2; // Moderate - meet in middle
    } else {
      suggestedPosition = min * 1.1; // Weak position - near floor
    }

    const tactics: string[] = [];
    const risks: string[] = [];

    if (input.topic === 'pricing') {
      tactics.push('Anchor high, offer value-based justification');
      tactics.push('Bundle additional value rather than discounting');
      risks.push('May lose deal if price sensitivity is high');
    }

    if (input.topic === 'timeline') {
      tactics.push('Tie timeline to resource availability');
      tactics.push('Create urgency with capacity constraints');
      risks.push('May need to escalate for expedited delivery');
    }

    return { suggestedPosition, tactics, risks };
  }

  private generateNegotiationResponse(
    input: { topic: string; currentPosition: string },
    analysis: { suggestedPosition: number; tactics: string[] },
    _state: NegotiationState
  ): GeneratedReply {
    return {
      body: `I appreciate you bringing up ${input.topic}. Based on what we've discussed and the value you'll see, I'd suggest ${analysis.suggestedPosition}. This reflects [value justification].\n\nWould this work for your team?`,
      tone: 'confident',
      nextSteps: analysis.tactics,
    };
  }

  // === State Management ===

  private getOrCreateNegotiationState(conversationId: string): NegotiationState {
    if (!this.negotiationStates.has(conversationId)) {
      this.negotiationStates.set(conversationId, {
        stage: 'initial',
        momentum: 0.5,
        blockers: [],
        opportunities: [],
      });
    }
    return this.negotiationStates.get(conversationId)!;
  }

  private updateNegotiationState(
    conversationId: string,
    decision: ReplyDecision,
    analysis: { sentiment: number; objections: string[]; buyingSignals: string[] }
  ): void {
    const state = this.negotiationStates.get(conversationId);
    if (!state) return;

    // Update momentum
    state.momentum = state.momentum * 0.7 + (analysis.sentiment + 1) / 2 * 0.3;
    
    // Update stage
    if (decision.action === 'schedule') {
      state.stage = 'scheduling';
    } else if (analysis.objections.length > 0) {
      state.stage = 'objection';
    } else if (analysis.buyingSignals.length > 0) {
      state.stage = 'engaged';
    }

    // Track blockers and opportunities
    state.blockers = [...new Set([...state.blockers, ...analysis.objections])];
    state.opportunities = [...new Set([...state.opportunities, ...analysis.buyingSignals])];
  }

  private initializeObjectionHandlers(): void {
    this.objectionHandlers.set('budget', [
      'I hear you on budget constraints. Many of our customers found the ROI paid for itself within 3 months.',
      'Budget is always a consideration. Would it help to see a cost-benefit analysis specific to your situation?',
    ]);
    this.objectionHandlers.set('timing', [
      'Totally understand the timing piece. When would be a better time to revisit this?',
      'Makes sense. Just so I can be helpful when the time is right - what would need to change for this to become a priority?',
    ]);
    this.objectionHandlers.set('existing-solution', [
      'Good to know you have something in place. Out of curiosity, how well is it working for [specific use case]?',
      'That\'s fair. Many of our customers came from similar solutions. Would it be valuable to see how we compare?',
    ]);
    this.objectionHandlers.set('authority', [
      'Makes sense to loop in the team. Would it be helpful if I sent over some materials you could share?',
      'Absolutely. Would it make sense to include them in a quick call so we can answer everyone\'s questions at once?',
    ]);
  }

  private trackClosingPattern(decision: ReplyDecision, context: ReplyContext): void {
    const key = `${decision.action}:${context.contactContext.persona}`;
    const count = this.closingPatterns.get(key) || 0;
    this.closingPatterns.set(key, count + 1);
  }

  private simulateLatency(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms * 0.1));
  }

  protected describeStrategy(_task: Task): string {
    return `Closer will analyze and respond using ${this.objectionHandlers.size} objection handlers`;
  }
}

export default CloserAgent;
