/**
 * Interaction Contract - Operator console interaction patterns
 *
 * Provides a unified interface for:
 * - Emitting events (activity stream)
 * - Selecting entities (inspector)
 * - Running commands (workflows/automations)
 */

export type EventType =
  | 'entity_selected'
  | 'entity_created'
  | 'entity_updated'
  | 'entity_deleted'
  | 'command_executed'
  | 'campaign_launched'
  | 'lead_scored'
  | 'email_sent'
  | 'reply_received'
  | 'workflow_triggered'
  | 'custom';

export interface EntityRef {
  id: string;
  type: 'campaign' | 'lead' | 'playbook' | 'workflow' | 'email' | 'custom';
  label?: string;
  metadata?: Record<string, unknown>;
}

export interface ActivityEvent {
  id: string;
  type: EventType;
  timestamp: Date;
  entityRefs: EntityRef[];
  metadata?: Record<string, unknown>;
  actor?: {
    id: string;
    name: string;
    avatar?: string;
  };
  summary?: string;
}

export interface CommandPayload {
  name: string;
  params?: Record<string, unknown>;
  context?: Record<string, unknown>;
}

/**
 * Interaction service - stateless utility for console interactions
 */
class InteractionService {
  private eventListeners: Map<EventType, Array<(event: ActivityEvent) => void>> = new Map();
  private selectedEntity: EntityRef | null = null;
  private activityHistory: ActivityEvent[] = [];

  /**
   * Emit an activity event
   */
  emitEvent(
    type: EventType,
    entityRefs: EntityRef[],
    metadata?: Record<string, unknown>,
    summary?: string
  ): ActivityEvent {
    const event: ActivityEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: new Date(),
      entityRefs,
      metadata,
      summary: summary || this.getDefaultSummary(type, entityRefs),
    };

    // Store in history (last 100 events)
    this.activityHistory.push(event);
    if (this.activityHistory.length > 100) {
      this.activityHistory.shift();
    }

    // Notify listeners
    const listeners = this.eventListeners.get(type) || [];
    listeners.forEach(listener => listener(event));

    return event;
  }

  /**
   * Select an entity - updates inspector
   */
  selectEntity(entity: EntityRef): void {
    this.selectedEntity = entity;

    // Emit selection event
    this.emitEvent(
      'entity_selected',
      [entity],
      {},
      `Selected ${entity.type}: ${entity.label || entity.id}`
    );
  }

  /**
   * Get currently selected entity
   */
  getSelectedEntity(): EntityRef | null {
    return this.selectedEntity;
  }

  /**
   * Run a command/action
   */
  runCommand(command: CommandPayload): { success: boolean; result?: unknown; error?: string } {
    try {
      // Log command execution
      this.emitEvent(
        'command_executed',
        [],
        { command: command.name, params: command.params },
        `Executed command: ${command.name}`
      );

      // In a real system, this would dispatch to backend/services
      return { success: true, result: { executed: true, command: command.name } };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Subscribe to event type
   */
  subscribe(type: EventType, listener: (event: ActivityEvent) => void): () => void {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, []);
    }

    this.eventListeners.get(type)!.push(listener);

    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(type);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index > -1) listeners.splice(index, 1);
      }
    };
  }

  /**
   * Get activity history
   */
  getHistory(): ActivityEvent[] {
    return [...this.activityHistory];
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.activityHistory = [];
  }

  /**
   * Generate default summary for event
   */
  private getDefaultSummary(type: EventType, entityRefs: EntityRef[]): string {
    const entityList = entityRefs.map(e => e.label || e.id).join(', ');

    const summaries: Record<EventType, string> = {
      entity_selected: `Selected: ${entityList}`,
      entity_created: `Created: ${entityList}`,
      entity_updated: `Updated: ${entityList}`,
      entity_deleted: `Deleted: ${entityList}`,
      command_executed: `Executed command`,
      campaign_launched: `Campaign launched: ${entityList}`,
      lead_scored: `Lead scored: ${entityList}`,
      email_sent: `Email sent: ${entityList}`,
      reply_received: `Reply received from ${entityList}`,
      workflow_triggered: `Workflow triggered: ${entityList}`,
      custom: `Event occurred`,
    };

    return summaries[type] || 'Action completed';
  }
}

// Singleton instance
let interactionService: InteractionService | null = null;

/**
 * Get global interaction service
 */
export function getInteractionService(): InteractionService {
  if (!interactionService) {
    interactionService = new InteractionService();
  }
  return interactionService;
}

/**
 * React hook for interactions
 */
export function useInteraction() {
  const service = getInteractionService();

  return {
    /**
     * Emit an event and show visual feedback
     */
    emitEvent: (type: EventType, entityRefs: EntityRef[], metadata?: Record<string, unknown>) => {
      const event = service.emitEvent(type, entityRefs, metadata);
      return event;
    },

    /**
     * Select entity and open inspector
     */
    selectEntity: (entity: EntityRef) => {
      service.selectEntity(entity);
      // Dispatch custom event that can be listened to by components
      const event = new CustomEvent('inspector:select', { detail: entity });
      window.dispatchEvent(event);
    },

    /**
     * Run a command with feedback
     */
    runCommand: (command: CommandPayload) => {
      const result = service.runCommand(command);

      return result;
    },

    /**
     * Subscribe to events
     */
    subscribe: service.subscribe.bind(service),

    /**
     * Get activity history
     */
    getHistory: service.getHistory.bind(service),

    /**
     * Get selected entity
     */
    getSelectedEntity: service.getSelectedEntity.bind(service),
  };
}

/**
 * Create a CTA handler factory - use inside React components
 *
 * Example:
 * const handleSelectEntity = useEntityCtaHandler('campaign', campaignId, 'My Campaign');
 */
export function useEntityCtaHandler(
  entityType: EntityRef['type'],
  entityId: string,
  label: string,
  onSuccess?: () => void
) {
  const { selectEntity, emitEvent } = useInteraction();

  return () => {
    const entity: EntityRef = {
      id: entityId,
      type: entityType,
      label,
    };

    selectEntity(entity);
    emitEvent('entity_selected', [entity]);

    onSuccess?.();
  };
}
