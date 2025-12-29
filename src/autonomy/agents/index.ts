/**
 * Multi-Agent Autonomy System - Unified Export
 */

// Types
export * from './types';

// Base Agent
export { BaseAgent } from './BaseAgent';
export type { AgentContext, ExecutionResult } from './BaseAgent';

// Specialized Agents
export { HunterAgent } from './HunterAgent';
export { ScoutAgent } from './ScoutAgent';
export { WriterAgent } from './WriterAgent';
export { CloserAgent } from './CloserAgent';
export { RevOpsAgent } from './RevOpsAgent';

// Orchestrator
export { Orchestrator, orchestrator } from './Orchestrator';

// Convenience re-exports
export type { Agent, AgentRole, Task, TaskType, TaskBid, AgentMessage, Pipeline } from './types';
