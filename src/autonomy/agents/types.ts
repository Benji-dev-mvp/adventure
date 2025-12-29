/**
 * Multi-Agent Autonomy System - Type Definitions
 *
 * Defines the agent architecture, communication protocols,
 * task marketplace, and orchestration primitives.
 */

// === Agent Core Types ===

export type AgentRole = 'hunter' | 'scout' | 'writer' | 'closer' | 'revops' | 'orchestrator';

export interface Agent {
  id: string;
  role: AgentRole;
  name: string;
  status: AgentStatus;
  capabilities: Capability[];
  performance: AgentPerformance;
  currentTask: Task | null;
  taskQueue: Task[];
  memory: AgentMemory;
  config: AgentConfig;
  createdAt: Date;
  lastActive: Date;

  // Methods required for orchestration
  generateBid(task: Task): TaskBid | null;
  canHandle(task: Task): boolean;
  acceptTask(task: Task): void;
  receive(message: AgentMessage): void;
}

export type AgentStatus = 'idle' | 'working' | 'waiting' | 'blocked' | 'learning' | 'offline';

export interface Capability {
  id: string;
  name: string;
  skillLevel: number; // 0-1
  cost: number; // Execution credits
  latency: number; // Expected ms
  successRate: number;
}

export interface AgentPerformance {
  tasksCompleted: number;
  successRate: number;
  averageLatency: number;
  totalCreditsEarned: number;
  reputationScore: number;
  streak: number;
  lastEvaluation: Date;
}

export interface AgentMemory {
  shortTerm: MemoryEntry[];
  workingContext: Record<string, unknown>;
  learnings: Learning[];
  collaboratorProfiles: Map<string, CollaboratorProfile>;
}

export interface MemoryEntry {
  id: string;
  type: 'observation' | 'decision' | 'outcome' | 'insight';
  content: unknown;
  timestamp: Date;
  importance: number;
  decayRate: number;
}

export interface Learning {
  id: string;
  pattern: string;
  confidence: number;
  applications: number;
  lastApplied: Date;
}

export interface CollaboratorProfile {
  agentId: string;
  collaborationCount: number;
  successRate: number;
  trustScore: number;
  complementaryStrengths: string[];
}

export interface AgentConfig {
  autonomyLevel: 'supervised' | 'semi-autonomous' | 'autonomous';
  riskTolerance: number;
  creativityBias: number;
  speedVsQuality: number;
  budgetLimit: number;
  collaborationPreference: number;
}

// === Task Types ===

export interface Task {
  id: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  input: TaskInput;
  output?: TaskOutput;
  requirements: TaskRequirements;
  constraints: TaskConstraints;
  assignedAgent?: string;
  bids: TaskBid[];
  parentTask?: string;
  childTasks: string[];
  timeline: TaskTimeline;
  metadata: Record<string, unknown>;
}

export type TaskType =
  | 'find-accounts'
  | 'research-signal'
  | 'enrich-contact'
  | 'craft-message'
  | 'personalize'
  | 'send-sequence'
  | 'handle-reply'
  | 'schedule-meeting'
  | 'negotiate'
  | 'optimize-sequence'
  | 'analyze-performance'
  | 'rebalance-pipeline';

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low' | 'background';

export type TaskStatus =
  | 'pending'
  | 'bidding'
  | 'assigned'
  | 'in-progress'
  | 'blocked'
  | 'review'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface TaskInput {
  type: string;
  data: unknown;
  context: Record<string, unknown>;
  constraints: string[];
}

export interface TaskOutput {
  type: string;
  data: unknown;
  confidence: number;
  artifacts: Artifact[];
  sideEffects: string[];
}

export interface Artifact {
  id: string;
  type: 'account' | 'contact' | 'message' | 'sequence' | 'meeting' | 'report';
  data: unknown;
  quality: number;
}

export interface TaskRequirements {
  capabilities: string[];
  minSkillLevel: number;
  estimatedCredits: number;
  deadline?: Date;
  dependencies: string[];
}

export interface TaskConstraints {
  maxLatency: number;
  maxCost: number;
  qualityThreshold: number;
  requiredApprovals: string[];
  blockedAgents: string[];
}

export interface TaskBid {
  agentId: string;
  proposedCost: number;
  estimatedLatency: number;
  confidence: number;
  strategy: string;
  timestamp: Date;
}

export interface TaskTimeline {
  created: Date;
  biddingStarted?: Date;
  assigned?: Date;
  started?: Date;
  completed?: Date;
  deadline?: Date;
}

// === Communication Types ===

export interface AgentMessage {
  id: string;
  from: string;
  to: string | 'broadcast';
  type: MessageType;
  payload: unknown;
  priority: number;
  timestamp: Date;
  requiresResponse: boolean;
  responseDeadline?: Date;
  conversationId?: string;
}

export type MessageType =
  | 'task-request'
  | 'task-bid'
  | 'task-assignment'
  | 'task-update'
  | 'task-complete'
  | 'handoff'
  | 'consultation'
  | 'insight-share'
  | 'resource-request'
  | 'status-update'
  | 'alert'
  | 'negotiation';

export interface Conversation {
  id: string;
  participants: string[];
  topic: string;
  messages: AgentMessage[];
  status: 'active' | 'resolved' | 'stalled';
  outcome?: string;
  startedAt: Date;
  resolvedAt?: Date;
}

// === Orchestration Types ===

export interface OrchestrationState {
  agents: Map<string, Agent>;
  taskQueue: Task[];
  activeConversations: Map<string, Conversation>;
  marketplace: TaskMarketplace;
  metrics: OrchestrationMetrics;
  config: OrchestrationConfig;
}

export interface TaskMarketplace {
  openTasks: Task[];
  activeBids: Map<string, TaskBid[]>;
  completedAuctions: AuctionResult[];
  priceHistory: Map<TaskType, number[]>;
  supplyDemand: Map<TaskType, { supply: number; demand: number }>;
}

export interface AuctionResult {
  taskId: string;
  winnerId: string;
  winningBid: number;
  competingBids: number;
  timestamp: Date;
}

export interface OrchestrationMetrics {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageLatency: number;
  averageCost: number;
  agentUtilization: Map<string, number>;
  throughput: number;
  efficiency: number;
}

export interface OrchestrationConfig {
  maxConcurrentTasks: number;
  biddingTimeout: number;
  defaultPriority: TaskPriority;
  autoScaling: boolean;
  qualityThreshold: number;
  costOptimization: 'aggressive' | 'balanced' | 'quality-first';
}

// === Pipeline & Campaign Types ===

export interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
  accounts: PipelineAccount[];
  metrics: PipelineMetrics;
  automationLevel: number;
  lastOptimized: Date;
}

export interface PipelineStage {
  id: string;
  name: string;
  position: number;
  criteria: StageCriteria;
  automatedActions: AutomatedAction[];
  conversionRate: number;
}

export interface StageCriteria {
  signals: string[];
  minEngagement: number;
  requiredActions: string[];
}

export interface AutomatedAction {
  trigger: string;
  agentRole: AgentRole;
  taskType: TaskType;
  parameters: Record<string, unknown>;
}

export interface PipelineAccount {
  id: string;
  stageId: string;
  score: number;
  signals: string[];
  assignedAgents: string[];
  lastTouch: Date;
  nextAction?: string;
}

export interface PipelineMetrics {
  totalAccounts: number;
  stageDistribution: Map<string, number>;
  velocity: number;
  conversionRate: number;
  projectedRevenue: number;
}

// === Visualization Types ===

export interface AgentVisualization {
  id: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  state: AgentStatus;
  connections: AgentConnection[];
  activity: ActivityPulse[];
}

export interface AgentConnection {
  targetId: string;
  strength: number;
  type: 'collaboration' | 'handoff' | 'supervision';
  active: boolean;
}

export interface ActivityPulse {
  timestamp: Date;
  intensity: number;
  type: string;
}

export interface OrchestrationVisualization {
  agents: AgentVisualization[];
  taskFlows: TaskFlow[];
  heatmap: HeatmapCell[];
  timeline: TimelineEvent[];
}

export interface TaskFlow {
  id: string;
  from: string;
  to: string;
  taskType: TaskType;
  progress: number;
  particles: number;
}

export interface HeatmapCell {
  x: number;
  y: number;
  intensity: number;
  label: string;
}

export interface TimelineEvent {
  timestamp: Date;
  type: string;
  agentId?: string;
  taskId?: string;
  description: string;
}
