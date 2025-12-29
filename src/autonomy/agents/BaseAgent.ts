/**
 * Base Agent Class
 *
 * Foundation for all autonomous agents with common capabilities:
 * - Task execution lifecycle
 * - Memory management
 * - Inter-agent communication
 * - Self-assessment and learning
 */

import type {
  Agent,
  AgentRole,
  AgentStatus,
  AgentMemory,
  AgentConfig,
  AgentPerformance,
  Capability,
  Task,
  TaskBid,
  AgentMessage,
  Learning as _Learning,
} from './types';

export interface AgentContext {
  currentTask: Task | null;
  recentMessages: AgentMessage[];
  collaborators: string[];
  environment: Record<string, unknown>;
}

export interface ExecutionResult {
  success: boolean;
  output: unknown;
  artifacts: unknown[];
  learnings: string[];
  nextSuggestion?: string;
}

export abstract class BaseAgent implements Agent {
  id: string;
  role: AgentRole;
  name: string;
  status: AgentStatus = 'idle';
  capabilities: Capability[] = [];
  performance: AgentPerformance;
  currentTask: Task | null = null;
  taskQueue: Task[] = [];
  memory: AgentMemory;
  config: AgentConfig;
  createdAt: Date;
  lastActive: Date;

  // Event emitter for agent communication
  private messageHandlers: Map<string, (msg: AgentMessage) => void> = new Map();
  private messageQueue: AgentMessage[] = [];

  constructor(role: AgentRole, name: string, config: Partial<AgentConfig> = {}) {
    this.id = `agent_${role}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.role = role;
    this.name = name;
    this.createdAt = new Date();
    this.lastActive = new Date();

    this.config = {
      autonomyLevel: 'semi-autonomous',
      riskTolerance: 0.5,
      creativityBias: 0.5,
      speedVsQuality: 0.5,
      budgetLimit: 1000,
      collaborationPreference: 0.7,
      ...config,
    };

    this.performance = {
      tasksCompleted: 0,
      successRate: 0.5,
      averageLatency: 0,
      totalCreditsEarned: 0,
      reputationScore: 0.5,
      streak: 0,
      lastEvaluation: new Date(),
    };

    this.memory = {
      shortTerm: [],
      workingContext: {},
      learnings: [],
      collaboratorProfiles: new Map(),
    };

    this.initializeCapabilities();
  }

  /**
   * Initialize agent-specific capabilities (override in subclasses)
   */
  protected abstract initializeCapabilities(): void;

  /**
   * Execute the core task logic (override in subclasses)
   */
  protected abstract executeTask(task: Task, context: AgentContext): Promise<ExecutionResult>;

  /**
   * Evaluate if this agent can handle a task
   */
  canHandle(task: Task): boolean {
    const requiredCaps = task.requirements.capabilities;
    return requiredCaps.every(cap =>
      this.capabilities.some(c => c.id === cap && c.skillLevel >= task.requirements.minSkillLevel)
    );
  }

  /**
   * Generate a bid for a task
   */
  generateBid(task: Task): TaskBid | null {
    if (!this.canHandle(task)) return null;

    const relevantCaps = this.capabilities.filter(c =>
      task.requirements.capabilities.includes(c.id)
    );

    // Calculate bid based on capabilities and current load
    const avgSkill = relevantCaps.reduce((a, b) => a + b.skillLevel, 0) / relevantCaps.length;
    const loadFactor = this.taskQueue.length > 0 ? 1 + this.taskQueue.length * 0.1 : 1;

    const baseCost = relevantCaps.reduce((a, b) => a + b.cost, 0);
    const proposedCost = baseCost * loadFactor * (1 - avgSkill * 0.2);

    const baseLatency = relevantCaps.reduce((a, b) => Math.max(a, b.latency), 0);
    const estimatedLatency = baseLatency * loadFactor;

    return {
      agentId: this.id,
      proposedCost,
      estimatedLatency,
      confidence: avgSkill * this.performance.successRate,
      strategy: this.describeStrategy(task),
      timestamp: new Date(),
    };
  }

  /**
   * Accept and queue a task
   */
  acceptTask(task: Task): void {
    task.status = 'assigned';
    task.assignedAgent = this.id;
    task.timeline.assigned = new Date();

    this.taskQueue.push(task);
    this.remember('decision', { action: 'accepted-task', taskId: task.id, taskType: task.type });

    this.processNextTask();
  }

  /**
   * Process the next task in queue
   */
  async processNextTask(): Promise<void> {
    if (this.status === 'working' || this.taskQueue.length === 0) return;

    const task = this.taskQueue.shift()!;
    this.currentTask = task;
    this.status = 'working';
    task.status = 'in-progress';
    task.timeline.started = new Date();

    const context = this.buildContext();
    const startTime = Date.now();

    try {
      const result = await this.executeTask(task, context);

      const latency = Date.now() - startTime;
      this.updatePerformance(true, latency);

      task.status = 'completed';
      task.timeline.completed = new Date();
      task.output = {
        type: task.type,
        data: result.output,
        confidence: result.success ? 0.9 : 0.5,
        artifacts: result.artifacts.map((a, i) => ({
          id: `art_${task.id}_${i}`,
          type: 'message' as const,
          data: a,
          quality: 0.8,
        })),
        sideEffects: [],
      };

      // Learn from success
      result.learnings.forEach(l => this.addLearning(l));

      this.remember('outcome', {
        taskId: task.id,
        success: true,
        latency,
        result: result.output,
      });
    } catch (error) {
      this.updatePerformance(false, Date.now() - startTime);
      task.status = 'failed';

      this.remember('outcome', {
        taskId: task.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    this.currentTask = null;
    this.status = 'idle';
    this.lastActive = new Date();

    // Process next task if available
    if (this.taskQueue.length > 0) {
      setTimeout(() => this.processNextTask(), 100);
    }
  }

  /**
   * Send a message to another agent
   */
  send(to: string, type: AgentMessage['type'], payload: unknown): AgentMessage {
    const message: AgentMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      from: this.id,
      to,
      type,
      payload,
      priority: 1,
      timestamp: new Date(),
      requiresResponse: false,
    };

    this.remember('decision', { action: 'sent-message', to, type });
    return message;
  }

  /**
   * Receive and process a message
   */
  receive(message: AgentMessage): void {
    this.messageQueue.push(message);
    this.remember('observation', {
      from: message.from,
      type: message.type,
      payload: message.payload,
    });

    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message);
    }
  }

  /**
   * Register a message handler
   */
  onMessage(type: string, handler: (msg: AgentMessage) => void): void {
    this.messageHandlers.set(type, handler);
  }

  /**
   * Request collaboration from another agent
   */
  requestCollaboration(
    targetAgentId: string,
    topic: string,
    context: Record<string, unknown>
  ): AgentMessage {
    return this.send(targetAgentId, 'consultation', {
      topic,
      context,
      requestorCapabilities: this.capabilities.map(c => c.id),
    });
  }

  /**
   * Handoff a task to another agent
   */
  handoff(task: Task, targetAgentId: string, reason: string): AgentMessage {
    task.status = 'pending';
    task.assignedAgent = undefined;

    return this.send(targetAgentId, 'handoff', {
      task,
      reason,
      context: this.memory.workingContext,
      learnings: this.memory.learnings.slice(-5),
    });
  }

  // === Memory Management ===

  /**
   * Add an entry to short-term memory
   */
  protected remember(
    type: 'observation' | 'decision' | 'outcome' | 'insight',
    content: unknown,
    importance: number = 0.5
  ): void {
    this.memory.shortTerm.push({
      id: `mem_${Date.now()}`,
      type,
      content,
      timestamp: new Date(),
      importance,
      decayRate: 0.95,
    });

    // Prune old memories
    if (this.memory.shortTerm.length > 100) {
      this.memory.shortTerm = this.memory.shortTerm
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 50);
    }
  }

  /**
   * Add a learning to long-term memory
   */
  protected addLearning(pattern: string): void {
    const existing = this.memory.learnings.find(l => l.pattern === pattern);

    if (existing) {
      existing.applications += 1;
      existing.confidence = Math.min(existing.confidence + 0.1, 1);
      existing.lastApplied = new Date();
    } else {
      this.memory.learnings.push({
        id: `learn_${Date.now()}`,
        pattern,
        confidence: 0.5,
        applications: 1,
        lastApplied: new Date(),
      });
    }
  }

  /**
   * Recall relevant memories for context
   */
  protected recall(query: string): unknown[] {
    // Simple keyword matching - would use embeddings in production
    const keywords = query.toLowerCase().split(' ');

    return this.memory.shortTerm
      .filter(m => {
        const content = JSON.stringify(m.content).toLowerCase();
        return keywords.some(k => content.includes(k));
      })
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 10)
      .map(m => m.content);
  }

  // === Performance Management ===

  /**
   * Update performance metrics after task completion
   */
  private updatePerformance(success: boolean, latency: number): void {
    const p = this.performance;

    p.tasksCompleted += 1;
    p.averageLatency = (p.averageLatency * (p.tasksCompleted - 1) + latency) / p.tasksCompleted;

    // Exponential moving average for success rate
    const alpha = 0.1;
    p.successRate = p.successRate * (1 - alpha) + (success ? 1 : 0) * alpha;

    // Update streak
    if (success) {
      p.streak += 1;
    } else {
      p.streak = 0;
    }

    // Update reputation
    p.reputationScore = p.successRate * 0.6 + Math.min(p.streak / 10, 0.4);

    p.lastEvaluation = new Date();
  }

  /**
   * Build execution context
   */
  private buildContext(): AgentContext {
    return {
      currentTask: this.currentTask,
      recentMessages: this.messageQueue.slice(-10),
      collaborators: Array.from(this.memory.collaboratorProfiles.keys()),
      environment: {
        timestamp: new Date(),
        queueDepth: this.taskQueue.length,
        status: this.status,
        performance: this.performance,
      },
    };
  }

  /**
   * Describe the strategy for a task (for bidding transparency)
   */
  protected describeStrategy(task: Task): string {
    return `${this.name} will handle ${task.type} using ${this.capabilities.length} capabilities`;
  }

  /**
   * Self-assessment for orchestrator
   */
  assess(): {
    health: number;
    capacity: number;
    readiness: number;
    recommendations: string[];
  } {
    const health =
      this.performance.successRate * 0.6 + (1 - Math.min(this.taskQueue.length / 10, 1)) * 0.4;

    const capacity = Math.max(0, 1 - this.taskQueue.length / 10);

    const readiness =
      this.status === 'idle'
        ? 1
        : this.status === 'working'
          ? 0.5
          : this.status === 'waiting'
            ? 0.7
            : 0;

    const recommendations: string[] = [];

    if (this.performance.successRate < 0.7) {
      recommendations.push('Consider reducing task complexity or providing more context');
    }
    if (this.taskQueue.length > 5) {
      recommendations.push('Queue is deep - consider load balancing');
    }
    if (this.performance.streak > 10) {
      recommendations.push('Strong performance - eligible for harder tasks');
    }

    return { health, capacity, readiness, recommendations };
  }
}

export default BaseAgent;
