/**
 * Multi-Agent System Types
 * Types for AI agent personas, agent switching, and multi-agent orchestration
 */

// ============================================
// Agent Persona Types
// ============================================

export type AgentId = 'ava' | 'scout' | 'strategist' | 'analyst' | 'compliance';
export type AgentStatus = 'active' | 'idle' | 'busy' | 'unavailable' | 'learning';

export interface AgentPersona {
  id: AgentId;
  name: string;
  role: string;
  description: string;
  avatar: string;
  color: string;
  capabilities: AgentCapability[];
  personality: AgentPersonality;
  status: AgentStatus;
  currentTask?: string;
  metrics: AgentMetrics;
  settings: AgentSettings;
}

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  category: 'research' | 'execution' | 'analysis' | 'strategy' | 'compliance';
  isEnabled: boolean;
  confidence: number;
  examples: string[];
}

export interface AgentPersonality {
  communicationStyle: 'formal' | 'casual' | 'technical' | 'friendly';
  proactivity: number; // 0-100
  detailLevel: 'concise' | 'balanced' | 'detailed';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  responseSpeed: 'fast' | 'balanced' | 'thorough';
}

export interface AgentMetrics {
  tasksCompleted: number;
  successRate: number;
  averageResponseTime: number;
  userSatisfaction: number;
  learningProgress: number;
}

export interface AgentSettings {
  isAutonomous: boolean;
  requiresApproval: string[];
  workingHours?: { start: string; end: string; timezone: string };
  maxConcurrentTasks: number;
  notificationPreferences: ('in_app' | 'email' | 'slack')[];
}

// ============================================
// Agent Definitions
// ============================================

export interface AvaAgent extends AgentPersona {
  id: 'ava';
  outboundConfig: {
    channels: ('email' | 'linkedin' | 'phone' | 'sms')[];
    dailyLimit: number;
    followUpCadence: number[];
    personalizationLevel: 'basic' | 'advanced' | 'hyper';
  };
}

export interface ScoutAgent extends AgentPersona {
  id: 'scout';
  researchConfig: {
    dataSources: string[];
    enrichmentProviders: string[];
    maxResearchDepth: 'basic' | 'standard' | 'deep';
    autoEnrich: boolean;
  };
}

export interface StrategistAgent extends AgentPersona {
  id: 'strategist';
  strategyConfig: {
    planningHorizon: 'weekly' | 'monthly' | 'quarterly';
    experimentTypes: string[];
    optimizationGoals: string[];
    riskAppetite: 'conservative' | 'moderate' | 'aggressive';
  };
}

export interface AnalystAgent extends AgentPersona {
  id: 'analyst';
  analysisConfig: {
    reportTypes: string[];
    alertThresholds: Record<string, number>;
    dashboardPreferences: string[];
    forecastModels: string[];
  };
}

export interface ComplianceAgent extends AgentPersona {
  id: 'compliance';
  complianceConfig: {
    policies: string[];
    regulations: string[];
    brandGuidelines: string[];
    riskThresholds: Record<string, number>;
  };
}

// ============================================
// Agent Communication Types
// ============================================

export type MessageType = 'text' | 'action' | 'question' | 'alert' | 'handoff' | 'status';

export interface AgentMessage {
  id: string;
  fromAgent: AgentId | 'user';
  toAgent: AgentId | 'user' | 'all';
  type: MessageType;
  content: string;
  metadata?: AgentMessageMetadata;
  timestamp: Date;
  threadId?: string;
  parentMessageId?: string;
  reactions?: AgentReaction[];
}

export interface AgentMessageMetadata {
  action?: AgentAction;
  question?: AgentQuestion;
  alert?: AgentAlert;
  handoff?: AgentHandoff;
  attachments?: AgentAttachment[];
  context?: Record<string, any>;
}

export interface AgentAction {
  id: string;
  type: string;
  description: string;
  params: Record<string, any>;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: any;
}

export interface AgentQuestion {
  id: string;
  question: string;
  options?: { value: string; label: string }[];
  required: boolean;
  answered: boolean;
  answer?: any;
}

export interface AgentAlert {
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  description: string;
  actionRequired: boolean;
  suggestedActions?: string[];
}

export interface AgentHandoff {
  fromAgent: AgentId;
  toAgent: AgentId;
  reason: string;
  context: Record<string, any>;
  continuity: 'full' | 'partial' | 'new';
}

export interface AgentAttachment {
  id: string;
  type: 'lead' | 'campaign' | 'report' | 'file' | 'link';
  name: string;
  url?: string;
  data?: Record<string, any>;
}

export interface AgentReaction {
  userId: string;
  type: 'like' | 'helpful' | 'question' | 'concern';
  timestamp: Date;
}

// ============================================
// Agent Collaboration Types
// ============================================

export interface AgentCollaboration {
  id: string;
  participants: AgentId[];
  task: string;
  status: 'planning' | 'executing' | 'reviewing' | 'completed';
  lead: AgentId;
  timeline: CollaborationEvent[];
  output?: any;
}

export interface CollaborationEvent {
  id: string;
  agent: AgentId;
  action: string;
  timestamp: Date;
  duration?: number;
  input?: any;
  output?: any;
}

export interface AgentWorkload {
  agentId: AgentId;
  activeTasks: AgentTask[];
  queuedTasks: AgentTask[];
  completedToday: number;
  capacityUsed: number; // percentage
  estimatedAvailability: Date;
}

export interface AgentTask {
  id: string;
  type: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'queued' | 'in_progress' | 'blocked' | 'completed' | 'failed';
  assignedTo: AgentId;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  estimatedDuration: number;
  context: Record<string, any>;
}

// ============================================
// Agent Switching Types
// ============================================

export interface AgentSwitcher {
  currentAgent: AgentId;
  agents: AgentPersona[];
  recentAgents: AgentId[];
  suggestions: AgentSuggestion[];
}

export interface AgentSuggestion {
  agentId: AgentId;
  reason: string;
  confidence: number;
  context: string;
}

export interface AgentContext {
  user: {
    id: string;
    name: string;
    role: string;
    preferences: Record<string, any>;
  };
  session: {
    id: string;
    startedAt: Date;
    messages: AgentMessage[];
    currentView: string;
  };
  workspace: {
    activeCampaigns: number;
    pendingLeads: number;
    recentActions: string[];
  };
}
