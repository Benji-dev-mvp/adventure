/**
 * Orchestrator - Multi-Agent Coordination System
 * 
 * The brain that coordinates all agents, manages task distribution,
 * runs the task marketplace, and ensures collaborative execution.
 */

import type {
  Agent,
  AgentRole,
  Task,
  TaskType,
  TaskBid,
  AgentMessage,
  OrchestrationState,
  OrchestrationMetrics,
  OrchestrationConfig,
  AuctionResult,
  Conversation,
} from './types';

import { HunterAgent } from './HunterAgent';
import { ScoutAgent } from './ScoutAgent';
import { WriterAgent } from './WriterAgent';
import { CloserAgent } from './CloserAgent';
import { RevOpsAgent } from './RevOpsAgent';

interface TaskCreationParams {
  type: TaskType;
  priority?: 'critical' | 'high' | 'medium' | 'low' | 'background';
  input: {
    type: string;
    data: unknown;
    context?: Record<string, unknown>;
    constraints?: string[];
  };
  requirements?: {
    capabilities?: string[];
    minSkillLevel?: number;
    estimatedCredits?: number;
    deadline?: Date;
    dependencies?: string[];
  };
  constraints?: {
    maxLatency?: number;
    maxCost?: number;
    qualityThreshold?: number;
    requiredApprovals?: string[];
    blockedAgents?: string[];
  };
}

interface OrchestrationEvent {
  type: 'task-created' | 'task-assigned' | 'task-completed' | 'task-failed' | 'agent-message' | 'auction-complete';
  timestamp: Date;
  data: unknown;
}

type EventHandler = (event: OrchestrationEvent) => void;

class Orchestrator {
  private state: OrchestrationState;
  private eventHandlers: Map<string, EventHandler[]> = new Map();
  private taskCounter = 0;

  constructor(config: Partial<OrchestrationConfig> = {}) {
    this.state = {
      agents: new Map(),
      taskQueue: [],
      activeConversations: new Map(),
      marketplace: {
        openTasks: [],
        activeBids: new Map(),
        completedAuctions: [],
        priceHistory: new Map(),
        supplyDemand: new Map(),
      },
      metrics: {
        totalTasks: 0,
        completedTasks: 0,
        failedTasks: 0,
        averageLatency: 0,
        averageCost: 0,
        agentUtilization: new Map(),
        throughput: 0,
        efficiency: 0,
      },
      config: {
        maxConcurrentTasks: 50,
        biddingTimeout: 5000,
        defaultPriority: 'medium',
        autoScaling: true,
        qualityThreshold: 0.7,
        costOptimization: 'balanced',
        ...config,
      },
    };

    this.initializeAgents();
  }

  /**
   * Initialize the default agent fleet
   */
  private initializeAgents(): void {
    // Create one of each agent type
    const agents = [
      new HunterAgent('Hunter Alpha'),
      new HunterAgent('Hunter Beta'),
      new ScoutAgent('Scout Alpha'),
      new ScoutAgent('Scout Beta'),
      new WriterAgent('Writer Prime'),
      new WriterAgent('Writer Secondary'),
      new CloserAgent('Closer Prime'),
      new CloserAgent('Closer Secondary'),
      new RevOpsAgent('RevOps Prime'),
    ];

    agents.forEach(agent => {
      this.state.agents.set(agent.id, agent);
      this.state.metrics.agentUtilization.set(agent.id, 0);
    });
  }

  /**
   * Create and submit a new task
   */
  async createTask(params: TaskCreationParams): Promise<Task> {
    const task: Task = {
      id: `task_${++this.taskCounter}_${Date.now()}`,
      type: params.type,
      priority: params.priority || this.state.config.defaultPriority,
      status: 'pending',
      input: {
        type: params.input.type,
        data: params.input.data,
        context: params.input.context || {},
        constraints: params.input.constraints || [],
      },
      requirements: {
        capabilities: params.requirements?.capabilities || this.inferCapabilities(params.type),
        minSkillLevel: params.requirements?.minSkillLevel || 0.5,
        estimatedCredits: params.requirements?.estimatedCredits || 10,
        deadline: params.requirements?.deadline,
        dependencies: params.requirements?.dependencies || [],
      },
      constraints: {
        maxLatency: params.constraints?.maxLatency || 30000,
        maxCost: params.constraints?.maxCost || 100,
        qualityThreshold: params.constraints?.qualityThreshold || this.state.config.qualityThreshold,
        requiredApprovals: params.constraints?.requiredApprovals || [],
        blockedAgents: params.constraints?.blockedAgents || [],
      },
      bids: [],
      childTasks: [],
      timeline: {
        created: new Date(),
      },
      metadata: {},
    };

    this.state.taskQueue.push(task);
    this.state.metrics.totalTasks++;

    this.emit('task-created', { task });

    // Start the bidding process
    await this.runAuction(task);

    return task;
  }

  /**
   * Run an auction for a task
   */
  private async runAuction(task: Task): Promise<void> {
    task.status = 'bidding';
    task.timeline.biddingStarted = new Date();

    // Collect bids from eligible agents
    const eligibleAgents = this.findEligibleAgents(task);
    
    if (eligibleAgents.length === 0) {
      console.warn(`No eligible agents for task ${task.id}`);
      task.status = 'pending';
      return;
    }

    // Request bids
    for (const agent of eligibleAgents) {
      const bid = agent.generateBid(task);
      if (bid) {
        task.bids.push(bid);
        
        // Track in marketplace
        const existing = this.state.marketplace.activeBids.get(task.id) || [];
        existing.push(bid);
        this.state.marketplace.activeBids.set(task.id, existing);
      }
    }

    // Wait for bidding period or all bids received
    await this.waitForBids(task);

    // Select winner
    if (task.bids.length > 0) {
      const winner = this.selectWinner(task);
      await this.assignTask(task, winner);
    } else {
      task.status = 'pending';
    }
  }

  /**
   * Find agents eligible to bid on a task
   */
  private findEligibleAgents(task: Task): Agent[] {
    const eligible: Agent[] = [];
    
    for (const agent of this.state.agents.values()) {
      // Check if agent is blocked
      if (task.constraints.blockedAgents.includes(agent.id)) continue;
      
      // Check if agent can handle the task
      if (agent.canHandle(task)) {
        eligible.push(agent);
      }
    }

    return eligible;
  }

  /**
   * Wait for bidding to complete
   */
  private async waitForBids(task: Task): Promise<void> {
    const timeout = this.state.config.biddingTimeout;
    const expectedBids = this.findEligibleAgents(task).length;
    
    const start = Date.now();
    while (Date.now() - start < timeout && task.bids.length < expectedBids) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Select the winning bid based on cost optimization strategy
   */
  private selectWinner(task: Task): TaskBid {
    const bids = task.bids;
    const strategy = this.state.config.costOptimization;

    switch (strategy) {
      case 'aggressive':
        // Lowest cost
        return bids.reduce((a, b) => a.proposedCost < b.proposedCost ? a : b, bids[0]);
      
      case 'quality-first':
        // Highest confidence
        return bids.reduce((a, b) => a.confidence > b.confidence ? a : b, bids[0]);
      
      case 'balanced':
      default:
        // Best value (confidence / cost ratio)
        return bids.reduce((a, b) => {
          const valueA = a.confidence / a.proposedCost;
          const valueB = b.confidence / b.proposedCost;
          return valueA > valueB ? a : b;
        });
    }
  }

  /**
   * Assign task to winning agent
   */
  private async assignTask(task: Task, winningBid: TaskBid): Promise<void> {
    const agent = this.state.agents.get(winningBid.agentId);
    if (!agent) return;

    // Record auction result
    const result: AuctionResult = {
      taskId: task.id,
      winnerId: winningBid.agentId,
      winningBid: winningBid.proposedCost,
      competingBids: task.bids.length,
      timestamp: new Date(),
    };
    this.state.marketplace.completedAuctions.push(result);

    // Update price history
    const history = this.state.marketplace.priceHistory.get(task.type) || [];
    history.push(winningBid.proposedCost);
    this.state.marketplace.priceHistory.set(task.type, history.slice(-100));

    // Clear active bids
    this.state.marketplace.activeBids.delete(task.id);

    // Assign to agent
    agent.acceptTask(task);

    this.emit('task-assigned', { task, agent: agent.id, bid: winningBid });
    this.emit('auction-complete', { result });

    // Update utilization
    this.updateAgentUtilization(agent.id);
  }

  /**
   * Handle task completion
   */
  onTaskComplete(task: Task): void {
    this.state.metrics.completedTasks++;
    
    // Update average latency
    if (task.timeline.started && task.timeline.completed) {
      const latency = task.timeline.completed.getTime() - task.timeline.started.getTime();
      const n = this.state.metrics.completedTasks;
      this.state.metrics.averageLatency = 
        (this.state.metrics.averageLatency * (n - 1) + latency) / n;
    }

    // Update average cost
    const winningBid = task.bids.find(b => b.agentId === task.assignedAgent);
    if (winningBid) {
      const n = this.state.metrics.completedTasks;
      this.state.metrics.averageCost = 
        (this.state.metrics.averageCost * (n - 1) + winningBid.proposedCost) / n;
    }

    // Update throughput
    this.updateThroughput();

    // Update agent utilization
    if (task.assignedAgent) {
      this.updateAgentUtilization(task.assignedAgent);
    }

    this.emit('task-completed', { task });

    // Check for child tasks
    this.processChildTasks(task);
  }

  /**
   * Handle task failure
   */
  onTaskFailed(task: Task, error: Error): void {
    this.state.metrics.failedTasks++;
    
    this.emit('task-failed', { task, error: error.message });

    // Retry logic
    const retryCount = (task.metadata.retryCount as number | undefined) ?? 0;

    if (retryCount < 3) {
      task.metadata.retryCount = retryCount + 1;
      task.status = 'pending';
      task.bids = [];
      
      // Block the failed agent for this task
      if (task.assignedAgent) {
        task.constraints.blockedAgents.push(task.assignedAgent);
      }
      
      // Re-run auction
      this.runAuction(task);
    }
  }

  /**
   * Send a message between agents
   */
  sendMessage(message: AgentMessage): void {
    if (message.to === 'broadcast') {
      // Broadcast to all agents
      for (const agent of this.state.agents.values()) {
        if (agent.id !== message.from) {
          agent.receive(message);
        }
      }
    } else {
      // Direct message
      const recipient = this.state.agents.get(message.to);
      if (recipient) {
        recipient.receive(message);
      }
    }

    this.emit('agent-message', { message });

    // Track conversation if applicable
    if (message.conversationId) {
      this.trackConversation(message);
    }
  }

  /**
   * Create a collaboration between agents
   */
  async createCollaboration(
    topic: string,
    participantRoles: AgentRole[],
    context: Record<string, unknown>
  ): Promise<Conversation> {
    // Find agents for each role
    const participants: string[] = [];
    
    for (const role of participantRoles) {
      const agent = Array.from(this.state.agents.values())
        .find(a => a.role === role && !participants.includes(a.id));
      
      if (agent) {
        participants.push(agent.id);
      }
    }

    const conversation: Conversation = {
      id: `conv_${Date.now()}`,
      participants,
      topic,
      messages: [],
      status: 'active',
      startedAt: new Date(),
    };

    this.state.activeConversations.set(conversation.id, conversation);

    // Notify participants
    for (const participantId of participants) {
      const agent = this.state.agents.get(participantId);
      if (agent) {
        agent.receive({
          id: `msg_${Date.now()}`,
          from: 'orchestrator',
          to: participantId,
          type: 'task-request',
          payload: { conversation, context },
          priority: 1,
          timestamp: new Date(),
          requiresResponse: true,
          conversationId: conversation.id,
        });
      }
    }

    return conversation;
  }

  /**
   * Get orchestration state summary
   */
  getState(): {
    agents: Array<{ id: string; role: AgentRole; status: string; queueDepth: number }>;
    metrics: OrchestrationMetrics;
    marketplace: {
      openTasks: number;
      activeBids: number;
      averagePrice: Record<string, number>;
    };
    activeConversations: number;
  } {
    const agents = Array.from(this.state.agents.values()).map(a => ({
      id: a.id,
      role: a.role,
      status: a.status,
      queueDepth: a.taskQueue.length,
    }));

    const averagePrice: Record<string, number> = {};
    for (const [type, history] of this.state.marketplace.priceHistory) {
      averagePrice[type] = history.reduce((a, b) => a + b, 0) / history.length;
    }

    return {
      agents,
      metrics: this.state.metrics,
      marketplace: {
        openTasks: this.state.marketplace.openTasks.length,
        activeBids: this.state.marketplace.activeBids.size,
        averagePrice,
      },
      activeConversations: this.state.activeConversations.size,
    };
  }

  /**
   * Get visualization data for the orchestration canvas
   */
  getVisualizationData(): {
    agents: Array<{
      id: string;
      role: AgentRole;
      name: string;
      status: string;
      position: { x: number; y: number };
      connections: Array<{ targetId: string; strength: number }>;
    }>;
    taskFlows: Array<{
      id: string;
      from: string;
      to: string;
      taskType: string;
      progress: number;
    }>;
    metrics: {
      throughput: number;
      efficiency: number;
      agentUtilization: Record<string, number>;
    };
  } {
    const agents = Array.from(this.state.agents.values()).map((a, i) => {
      // Arrange agents in a circle
      const angle = (i / this.state.agents.size) * 2 * Math.PI;
      const radius = 200;
      
      return {
        id: a.id,
        role: a.role,
        name: a.name,
        status: a.status,
        position: {
          x: Math.cos(angle) * radius + 250,
          y: Math.sin(angle) * radius + 250,
        },
        connections: Array.from(a.memory.collaboratorProfiles.entries()).map(([targetId, profile]) => ({
          targetId,
          strength: profile.trustScore,
        })),
      };
    });

    // Create task flows from active tasks
    const taskFlows = this.state.taskQueue
      .filter(t => t.status === 'in-progress' && t.assignedAgent)
      .map(t => ({
        id: t.id,
        from: 'queue',
        to: t.assignedAgent!,
        taskType: t.type,
        progress: 0.5, // Would be calculated from actual progress
      }));

    return {
      agents,
      taskFlows,
      metrics: {
        throughput: this.state.metrics.throughput,
        efficiency: this.state.metrics.efficiency,
        agentUtilization: Object.fromEntries(this.state.metrics.agentUtilization),
      },
    };
  }

  /**
   * Scale agents up or down based on demand
   */
  async autoScale(): Promise<void> {
    if (!this.state.config.autoScaling) return;

    // Check supply/demand for each task type
    for (const [taskType, { supply, demand }] of this.state.marketplace.supplyDemand) {
      if (demand > supply * 1.5) {
        // Need more agents for this task type
        const role = this.taskTypeToRole(taskType);
        await this.spawnAgent(role);
      } else if (supply > demand * 2 && supply > 2) {
        // Can reduce agents
        const role = this.taskTypeToRole(taskType);
        await this.retireAgent(role);
      }
    }
  }

  /**
   * Spawn a new agent of the given role
   */
  private async spawnAgent(role: AgentRole): Promise<Agent | null> {
    const count = Array.from(this.state.agents.values()).filter(a => a.role === role).length;
    
    let agent: Agent;
    switch (role) {
      case 'hunter':
        agent = new HunterAgent(`Hunter ${String.fromCharCode(65 + count)}`);
        break;
      case 'scout':
        agent = new ScoutAgent(`Scout ${String.fromCharCode(65 + count)}`);
        break;
      case 'writer':
        agent = new WriterAgent(`Writer ${String.fromCharCode(65 + count)}`);
        break;
      case 'closer':
        agent = new CloserAgent(`Closer ${String.fromCharCode(65 + count)}`);
        break;
      case 'revops':
        agent = new RevOpsAgent(`RevOps ${String.fromCharCode(65 + count)}`);
        break;
      default:
        return null;
    }

    this.state.agents.set(agent.id, agent);
    this.state.metrics.agentUtilization.set(agent.id, 0);
    
    console.log(`Spawned new agent: ${agent.name}`);
    return agent;
  }

  /**
   * Retire an idle agent of the given role
   */
  private async retireAgent(role: AgentRole): Promise<boolean> {
    const candidate = Array.from(this.state.agents.values())
      .find(a => a.role === role && a.status === 'idle' && a.taskQueue.length === 0);
    
    if (candidate) {
      this.state.agents.delete(candidate.id);
      this.state.metrics.agentUtilization.delete(candidate.id);
      console.log(`Retired agent: ${candidate.name}`);
      return true;
    }
    
    return false;
  }

  // === Event System ===

  on(event: string, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.push(handler);
    this.eventHandlers.set(event, handlers);
  }

  off(event: string, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(event) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  private emit(type: OrchestrationEvent['type'], data: unknown): void {
    const event: OrchestrationEvent = { type, timestamp: new Date(), data };
    const handlers = this.eventHandlers.get(type) || [];
    handlers.forEach(handler => handler(event));
  }

  // === Private Helpers ===

  private inferCapabilities(taskType: TaskType): string[] {
    const mapping: Record<TaskType, string[]> = {
      'find-accounts': ['account-discovery', 'icp-matching'],
      'research-signal': ['signal-research', 'signal-detection'],
      'enrich-contact': ['contact-identification'],
      'craft-message': ['message-generation', 'personalization'],
      'personalize': ['personalization', 'tone-adaptation'],
      'send-sequence': ['sequence-optimization'],
      'handle-reply': ['reply-handling', 'objection-handling'],
      'schedule-meeting': ['meeting-scheduling'],
      'negotiate': ['negotiation'],
      'optimize-sequence': ['sequence-optimization'],
      'analyze-performance': ['pipeline-analysis', 'performance-forecasting'],
      'rebalance-pipeline': ['pipeline-analysis', 'routing-optimization'],
    };
    return mapping[taskType] || [];
  }

  private taskTypeToRole(taskType: TaskType): AgentRole {
    const mapping: Record<TaskType, AgentRole> = {
      'find-accounts': 'hunter',
      'research-signal': 'scout',
      'enrich-contact': 'hunter',
      'craft-message': 'writer',
      'personalize': 'writer',
      'send-sequence': 'revops',
      'handle-reply': 'closer',
      'schedule-meeting': 'closer',
      'negotiate': 'closer',
      'optimize-sequence': 'revops',
      'analyze-performance': 'revops',
      'rebalance-pipeline': 'revops',
    };
    return mapping[taskType] || 'revops';
  }

  private updateAgentUtilization(agentId: string): void {
    const agent = this.state.agents.get(agentId);
    if (!agent) return;

    const utilization = agent.status === 'working' ? 1 :
                       agent.taskQueue.length > 0 ? 0.5 + agent.taskQueue.length * 0.1 : 0;
    
    this.state.metrics.agentUtilization.set(agentId, Math.min(utilization, 1));
  }

  private updateThroughput(): void {
    // Calculate throughput as tasks completed per minute (rolling 5-minute window)
    const now = Date.now();
    const recentAuctions = this.state.marketplace.completedAuctions
      .filter(a => now - a.timestamp.getTime() < 5 * 60 * 1000);
    
    this.state.metrics.throughput = recentAuctions.length / 5;
  }

  private trackConversation(message: AgentMessage): void {
    if (!message.conversationId) return;
    
    const conversation = this.state.activeConversations.get(message.conversationId);
    if (conversation) {
      conversation.messages.push(message);
    }
  }

  private processChildTasks(parentTask: Task): void {
    // If task output suggests follow-up tasks, create them
    if (parentTask.output?.sideEffects) {
      for (const effect of parentTask.output.sideEffects) {
        if (effect.startsWith('create-task:')) {
          const taskType = effect.replace('create-task:', '') as TaskType;
          this.createTask({
            type: taskType,
            input: {
              type: 'follow-up',
              data: parentTask.output.data,
              context: { parentTaskId: parentTask.id },
            },
          });
        }
      }
    }
  }
}

// Singleton export
export const orchestrator = new Orchestrator();
export { Orchestrator };
export default Orchestrator;
