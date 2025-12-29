/**
 * Command Bus - Unified Command System
 * 
 * Centralizes all user actions into typed commands that update global state
 * and trigger side effects. This prevents pages from making local mutations
 * and ensures the app stays synchronized.
 * 
 * All commands flow through this bus:
 * 1. Command is dispatched
 * 2. App state is updated (via appStore)
 * 3. Side effects are triggered (API calls, toasts, etc.)
 * 4. Subscribers are notified
 */

import { useAppStore } from '../state/appStore';

// ===== Command Types =====

export type CommandType =
  | 'RUN_AUTOPILOT'
  | 'APPROVE_AI_ACTION'
  | 'BLOCK_AI_ACTION'
  | 'REVERT_AI_ACTION'
  | 'SELECT_ENTITY'
  | 'CLEAR_ENTITY_SELECTION'
  | 'EXECUTE_ORCHESTRATION_STEP'
  | 'PAUSE_ORCHESTRATION'
  | 'RESUME_ORCHESTRATION'
  | 'TRIGGER_LEAD_ACTION'
  | 'SEND_EMAIL'
  | 'RUN_PLAYBOOK'
  | 'START_CAMPAIGN'
  | 'STOP_CAMPAIGN'
  | 'CHANGE_PLAN'
  | 'TOGGLE_ADMIN_MODE'
  | 'UPDATE_SETTINGS';

export interface BaseCommand {
  type: CommandType;
  timestamp: number;
  userId?: string;
}

export interface RunAutopilotCommand extends BaseCommand {
  type: 'RUN_AUTOPILOT';
  payload: {
    mode: 'full' | 'partial';
    target?: string;
  };
}

export interface ApproveAIActionCommand extends BaseCommand {
  type: 'APPROVE_AI_ACTION';
  payload: {
    actionId: string;
    reason?: string;
  };
}

export interface BlockAIActionCommand extends BaseCommand {
  type: 'BLOCK_AI_ACTION';
  payload: {
    actionId: string;
    reason: string;
  };
}

export interface RevertAIActionCommand extends BaseCommand {
  type: 'REVERT_AI_ACTION';
  payload: {
    actionId: string;
    reason: string;
  };
}

export interface SelectEntityCommand extends BaseCommand {
  type: 'SELECT_ENTITY';
  payload: {
    entityType: 'lead' | 'account' | 'campaign' | 'playbook';
    entityId: string;
    entity: any; // TODO: Use proper type from contracts
  };
}

export interface ClearEntitySelectionCommand extends BaseCommand {
  type: 'CLEAR_ENTITY_SELECTION';
  payload: Record<string, never>; // Empty payload
}

export interface ExecuteOrchestrationStepCommand extends BaseCommand {
  type: 'EXECUTE_ORCHESTRATION_STEP';
  payload: {
    stepId: string;
    input?: Record<string, any>;
  };
}

export interface PauseOrchestrationCommand extends BaseCommand {
  type: 'PAUSE_ORCHESTRATION';
  payload: {
    workflowId: string;
  };
}

export interface ResumeOrchestrationCommand extends BaseCommand {
  type: 'RESUME_ORCHESTRATION';
  payload: {
    workflowId: string;
  };
}

export interface TriggerLeadActionCommand extends BaseCommand {
  type: 'TRIGGER_LEAD_ACTION';
  payload: {
    leadId: string;
    actionType: 'email' | 'call' | 'linkedin' | 'enrich';
    params?: Record<string, any>;
  };
}

export interface SendEmailCommand extends BaseCommand {
  type: 'SEND_EMAIL';
  payload: {
    to: string;
    subject: string;
    body: string;
    leadId?: string;
  };
}

export interface RunPlaybookCommand extends BaseCommand {
  type: 'RUN_PLAYBOOK';
  payload: {
    playbookId: string;
    leadIds: string[];
  };
}

export interface StartCampaignCommand extends BaseCommand {
  type: 'START_CAMPAIGN';
  payload: {
    campaignId: string;
  };
}

export interface StopCampaignCommand extends BaseCommand {
  type: 'STOP_CAMPAIGN';
  payload: {
    campaignId: string;
    reason?: string;
  };
}

export interface ChangePlanCommand extends BaseCommand {
  type: 'CHANGE_PLAN';
  payload: {
    plan: 'startup' | 'midmarket' | 'enterprise';
  };
}

export interface ToggleAdminModeCommand extends BaseCommand {
  type: 'TOGGLE_ADMIN_MODE';
  payload: {
    enabled: boolean;
  };
}

export interface UpdateSettingsCommand extends BaseCommand {
  type: 'UPDATE_SETTINGS';
  payload: {
    key: string;
    value: any;
  };
}

export type Command =
  | RunAutopilotCommand
  | ApproveAIActionCommand
  | BlockAIActionCommand
  | RevertAIActionCommand
  | SelectEntityCommand
  | ClearEntitySelectionCommand
  | ExecuteOrchestrationStepCommand
  | PauseOrchestrationCommand
  | ResumeOrchestrationCommand
  | TriggerLeadActionCommand
  | SendEmailCommand
  | RunPlaybookCommand
  | StartCampaignCommand
  | StopCampaignCommand
  | ChangePlanCommand
  | ToggleAdminModeCommand
  | UpdateSettingsCommand;

// ===== Command Result =====

export interface CommandResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

// ===== Command Handler =====

type CommandHandler = (command: Command) => Promise<CommandResult> | CommandResult;

const commandHandlers: Partial<Record<CommandType, CommandHandler>> = {};

/**
 * Register a command handler
 */
export function registerCommandHandler(type: CommandType, handler: CommandHandler): void {
  commandHandlers[type] = handler;
}

/**
 * Command Bus - Dispatches commands and handles execution
 */
class CommandBus {
  private subscribers: Set<(command: Command, result: CommandResult) => void> = new Set();

  /**
   * Dispatch a command
   */
  async dispatch(command: Command): Promise<CommandResult> {
    try {
      // Execute the command handler
      const handler = commandHandlers[command.type];
      
      if (!handler) {
        console.warn(`No handler registered for command type: ${command.type}`);
        return {
          success: false,
          error: `No handler for command type: ${command.type}`,
        };
      }

      const result = await Promise.resolve(handler(command));

      // Notify subscribers
      this.notifySubscribers(command, result);

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Command execution failed:`, command, error);

      const result: CommandResult = {
        success: false,
        error: errorMessage,
      };

      this.notifySubscribers(command, result);

      return result;
    }
  }

  /**
   * Subscribe to command results
   */
  subscribe(callback: (command: Command, result: CommandResult) => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(command: Command, result: CommandResult): void {
    this.subscribers.forEach(callback => {
      try {
        callback(command, result);
      } catch (error) {
        console.error('Subscriber callback error:', error);
      }
    });
  }
}

// Global command bus instance
export const commandBus = new CommandBus();

// ===== Built-in Command Handlers =====

// SELECT_ENTITY handler
registerCommandHandler('SELECT_ENTITY', (command: Command) => {
  const cmd = command as SelectEntityCommand;
  
  const setSelectedEntity = useAppStore.getState().setSelectedEntity;
  setSelectedEntity({
    type: cmd.payload.entityType,
    id: cmd.payload.entityId,
    data: cmd.payload.entity,
  });

  return {
    success: true,
    message: `Selected ${cmd.payload.entityType} ${cmd.payload.entityId}`,
  };
});

// CLEAR_ENTITY_SELECTION handler
registerCommandHandler('CLEAR_ENTITY_SELECTION', () => {
  const setSelectedEntity = useAppStore.getState().setSelectedEntity;
  setSelectedEntity(null);

  return {
    success: true,
    message: 'Cleared entity selection',
  };
});

// CHANGE_PLAN handler
registerCommandHandler('CHANGE_PLAN', (command: Command) => {
  const cmd = command as ChangePlanCommand;
  
  const setPlan = useAppStore.getState().setPlan;
  setPlan(cmd.payload.plan);

  return {
    success: true,
    message: `Changed plan to ${cmd.payload.plan}`,
    data: { plan: cmd.payload.plan },
  };
});

// TOGGLE_ADMIN_MODE handler
registerCommandHandler('TOGGLE_ADMIN_MODE', (command: Command) => {
  const cmd = command as ToggleAdminModeCommand;
  
  const setIsAdmin = useAppStore.getState().setIsAdmin;
  setIsAdmin(cmd.payload.enabled);

  return {
    success: true,
    message: `Admin mode ${cmd.payload.enabled ? 'enabled' : 'disabled'}`,
    data: { isAdmin: cmd.payload.enabled },
  };
});

// TODO: Add handlers for other command types
// These should:
// 1. Update app state (via appStore)
// 2. Make API calls (via services)
// 3. Show toasts (via toast system)
// 4. Log analytics events

// ===== Helper Functions =====

/**
 * Create a command with timestamp
 */
export function createCommand<T extends Command>(
  type: T['type'],
  payload: T['payload']
): T {
  return {
    type,
    payload,
    timestamp: Date.now(),
  } as T;
}

/**
 * Dispatch helper for common commands
 */
export const commands = {
  selectEntity: (entityType: SelectEntityCommand['payload']['entityType'], entityId: string, entity: any) =>
    commandBus.dispatch(createCommand<SelectEntityCommand>('SELECT_ENTITY', { entityType, entityId, entity })),

  clearSelection: () =>
    commandBus.dispatch(createCommand<ClearEntitySelectionCommand>('CLEAR_ENTITY_SELECTION', {})),

  changePlan: (plan: ChangePlanCommand['payload']['plan']) =>
    commandBus.dispatch(createCommand<ChangePlanCommand>('CHANGE_PLAN', { plan })),

  toggleAdmin: (enabled: boolean) =>
    commandBus.dispatch(createCommand<ToggleAdminModeCommand>('TOGGLE_ADMIN_MODE', { enabled })),

  runAutopilot: (mode: RunAutopilotCommand['payload']['mode'], target?: string) =>
    commandBus.dispatch(createCommand<RunAutopilotCommand>('RUN_AUTOPILOT', { mode, target })),

  approveAIAction: (actionId: string, reason?: string) =>
    commandBus.dispatch(createCommand<ApproveAIActionCommand>('APPROVE_AI_ACTION', { actionId, reason })),

  blockAIAction: (actionId: string, reason: string) =>
    commandBus.dispatch(createCommand<BlockAIActionCommand>('BLOCK_AI_ACTION', { actionId, reason })),

  revertAIAction: (actionId: string, reason: string) =>
    commandBus.dispatch(createCommand<RevertAIActionCommand>('REVERT_AI_ACTION', { actionId, reason })),
};
