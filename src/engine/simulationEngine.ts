/**
 * Simulation Engine - Makes the app feel like a real, stateful system
 * 
 * Continuous execution loops that:
 * - Generate ActivityStream events over time
 * - Simulate AI making decisions
 * - Drive workflow execution
 * - Respond to commands with realistic delays
 * - Make the UI feel alive
 * 
 * Inspired by: Real-time systems, game loops, event sourcing
 */

import type { ActivityEvent } from '../contracts/activity';
import type { AIDecision } from '../contracts/ai';

// === Types ===

export type SimulationEventType =
  | 'ai_decision'
  | 'workflow_step'
  | 'lead_action'
  | 'campaign_execution'
  | 'enrichment'
  | 'qualification';

export interface SimulationEvent {
  id: string;
  type: SimulationEventType;
  timestamp: string;
  entityType: 'lead' | 'account' | 'campaign' | 'playbook';
  entityId: string;
  actorType: 'AI' | 'Human' | 'System';
  summary: string;
  metadata?: Record<string, any>;
}

export interface SimulationConfig {
  tickRate: number; // milliseconds between simulation ticks
  aiDecisionRate: number; // decisions per minute
  workflowExecutionRate: number; // workflow steps per minute
  leadActionRate: number; // lead actions per minute
}

type SimulationObserver = (event: SimulationEvent) => void;

// === Simulation Engine ===

class SimulationEngine {
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private observers: SimulationObserver[] = [];
  private eventQueue: SimulationEvent[] = [];
  private config: SimulationConfig = {
    tickRate: 2000, // 2 seconds
    aiDecisionRate: 30, // 30 decisions/minute
    workflowExecutionRate: 20, // 20 steps/minute
    leadActionRate: 15, // 15 actions/minute
  };

  private eventCounter: number = 0;

  constructor() {
    // Bind methods
    this.tick = this.tick.bind(this);
  }

  // === Public API ===

  start(): void {
    if (this.isRunning) return;

    console.log('[SimulationEngine] Starting execution loop...');
    this.isRunning = true;
    this.intervalId = setInterval(this.tick, this.config.tickRate);
  }

  stop(): void {
    if (!this.isRunning) return;

    console.log('[SimulationEngine] Stopping execution loop...');
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  subscribe(observer: SimulationObserver): () => void {
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.filter((obs) => obs !== observer);
    };
  }

  configure(config: Partial<SimulationConfig>): void {
    this.config = { ...this.config, ...config };
    if (this.isRunning) {
      // Restart with new config
      this.stop();
      this.start();
    }
  }

  // Trigger specific events (for command bus integration)
  triggerAIDecision(entityId: string, decisionType: string): void {
    const event: SimulationEvent = {
      id: `sim-ai-${this.eventCounter++}`,
      type: 'ai_decision',
      timestamp: new Date().toISOString(),
      entityType: 'lead',
      entityId,
      actorType: 'AI',
      summary: `AI made ${decisionType} decision for lead ${entityId}`,
      metadata: { decisionType },
    };
    this.emit(event);
  }

  triggerWorkflowStep(workflowId: string, stepId: string): void {
    const event: SimulationEvent = {
      id: `sim-wf-${this.eventCounter++}`,
      type: 'workflow_step',
      timestamp: new Date().toISOString(),
      entityType: 'playbook',
      entityId: workflowId,
      actorType: 'System',
      summary: `Workflow step ${stepId} executed`,
      metadata: { stepId },
    };
    this.emit(event);
  }

  triggerLeadAction(leadId: string, action: string): void {
    const event: SimulationEvent = {
      id: `sim-lead-${this.eventCounter++}`,
      type: 'lead_action',
      timestamp: new Date().toISOString(),
      entityType: 'lead',
      entityId: leadId,
      actorType: 'AI',
      summary: `${action} performed on lead ${leadId}`,
      metadata: { action },
    };
    this.emit(event);
  }

  // === Private Methods ===

  private tick(): void {
    // Simulate random events based on configured rates
    const now = Date.now();

    // AI Decisions (probabilistic based on rate)
    if (Math.random() < this.config.aiDecisionRate / 60) {
      this.generateAIDecisionEvent();
    }

    // Workflow Execution (probabilistic based on rate)
    if (Math.random() < this.config.workflowExecutionRate / 60) {
      this.generateWorkflowExecutionEvent();
    }

    // Lead Actions (probabilistic based on rate)
    if (Math.random() < this.config.leadActionRate / 60) {
      this.generateLeadActionEvent();
    }

    // Process event queue
    this.processEventQueue();
  }

  private generateAIDecisionEvent(): void {
    const decisionTypes = ['qualification', 'prioritization', 'email_personalization', 'next_best_action'];
    const decisionType = decisionTypes[Math.floor(Math.random() * decisionTypes.length)];

    const event: SimulationEvent = {
      id: `sim-ai-${this.eventCounter++}`,
      type: 'ai_decision',
      timestamp: new Date().toISOString(),
      entityType: 'lead',
      entityId: `lead-${Math.floor(Math.random() * 1000)}`,
      actorType: 'AI',
      summary: `Ava AI made ${decisionType} decision`,
      metadata: {
        decisionType,
        confidence: 0.75 + Math.random() * 0.25,
        riskLevel: Math.random() > 0.7 ? 'medium' : 'low',
      },
    };

    this.emit(event);
  }

  private generateWorkflowExecutionEvent(): void {
    const steps = ['enrichment', 'qualification', 'email_sequence', 'scoring', 'notification'];
    const step = steps[Math.floor(Math.random() * steps.length)];

    const event: SimulationEvent = {
      id: `sim-wf-${this.eventCounter++}`,
      type: 'workflow_step',
      timestamp: new Date().toISOString(),
      entityType: 'playbook',
      entityId: `playbook-${Math.floor(Math.random() * 10)}`,
      actorType: 'System',
      summary: `Executed ${step} step in workflow`,
      metadata: {
        step,
        duration: Math.floor(Math.random() * 5000) + 1000,
        success: Math.random() > 0.1,
      },
    };

    this.emit(event);
  }

  private generateLeadActionEvent(): void {
    const actions = ['email_opened', 'link_clicked', 'form_submitted', 'meeting_booked', 'replied'];
    const action = actions[Math.floor(Math.random() * actions.length)];

    const event: SimulationEvent = {
      id: `sim-lead-${this.eventCounter++}`,
      type: 'lead_action',
      timestamp: new Date().toISOString(),
      entityType: 'lead',
      entityId: `lead-${Math.floor(Math.random() * 1000)}`,
      actorType: 'Human',
      summary: `Lead ${action}`,
      metadata: { action },
    };

    this.emit(event);
  }

  private processEventQueue(): void {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) {
        this.emit(event);
      }
    }
  }

  private emit(event: SimulationEvent): void {
    console.log('[SimulationEngine] Event:', event.type, event.summary);
    this.observers.forEach((observer) => {
      try {
        observer(event);
      } catch (error) {
        console.error('[SimulationEngine] Observer error:', error);
      }
    });
  }

  // === Conversion to ActivityEvent (for integration) ===

  convertToActivityEvent(simEvent: SimulationEvent): ActivityEvent {
    const eventTypeMap: Record<SimulationEventType, string> = {
      ai_decision: 'recommendation',
      workflow_step: 'execution',
      lead_action: 'status_change',
      campaign_execution: 'execution',
      enrichment: 'enrichment',
      qualification: 'qualification',
    };

    return {
      id: simEvent.id,
      tenantId: 'demo-tenant',
      timestamp: simEvent.timestamp,
      sourceSystem: 'internal',
      sourceObjectType: simEvent.entityType,
      sourceObjectId: simEvent.entityId,
      entityType: simEvent.entityType,
      entityId: simEvent.entityId,
      eventType: eventTypeMap[simEvent.type] as any,
      actorType: simEvent.actorType,
      importance: simEvent.metadata?.riskLevel === 'high' ? 'high' : 'medium',
      summary: simEvent.summary,
      details: simEvent.metadata,
      provenance: {
        refs: [simEvent.entityId],
        dataSource: 'simulation_engine',
      },
    };
  }
}

// === Singleton Export ===

export const simulationEngine = new SimulationEngine();

// Auto-start in development mode
if (import.meta.env.DEV) {
  console.log('[SimulationEngine] Auto-starting in dev mode...');
  simulationEngine.start();
}

export default simulationEngine;
