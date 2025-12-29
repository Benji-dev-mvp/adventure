import { useState, useCallback, useMemo, useEffect } from 'react';

// Local type definitions
interface WorkflowBlock {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  config: Record<string, unknown>;
  inputs: string[];
  outputs: string[];
}

interface WorkflowConnection {
  id: string;
  from: { blockId: string; portId: string };
  to: { blockId: string; portId: string };
}

interface ExecutionEvent {
  id: string;
  blockId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  blocks: number;
}

/**
 * Hook for managing workflow state
 */
export function useWorkflow(workflowId?: string) {
  const [blocks, setBlocks] = useState<WorkflowBlock[]>([]);
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const loadWorkflow = async () => {
      if (!workflowId) {
        setBlocks([]);
        setConnections([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      // Mock data would be loaded here
      setIsLoading(false);
    };

    loadWorkflow();
  }, [workflowId]);

  const addBlock = useCallback((type: string, position: { x: number; y: number }) => {
    const newBlock: WorkflowBlock = {
      id: `block-${Date.now()}`,
      type: type as any,
      name: `New ${type}`,
      position,
      config: {},
      inputs: [],
      outputs: [],
    };
    setBlocks(prev => [...prev, newBlock]);
    setHasUnsavedChanges(true);
    return newBlock;
  }, []);

  const updateBlock = useCallback((blockId: string, updates: Partial<WorkflowBlock>) => {
    setBlocks(prev =>
      prev.map(b => b.id === blockId ? { ...b, ...updates } : b)
    );
    setHasUnsavedChanges(true);
  }, []);

  const deleteBlock = useCallback((blockId: string) => {
    setBlocks(prev => prev.filter(b => b.id !== blockId));
    setConnections(prev => prev.filter(c => c.from.blockId !== blockId && c.to.blockId !== blockId));
    setHasUnsavedChanges(true);
  }, []);

  const addConnection = useCallback((from: { blockId: string; portId: string }, to: { blockId: string; portId: string }) => {
    const newConnection: WorkflowConnection = {
      id: `conn-${Date.now()}`,
      from,
      to,
    };
    setConnections(prev => [...prev, newConnection]);
    setHasUnsavedChanges(true);
    return newConnection;
  }, []);

  const deleteConnection = useCallback((connectionId: string) => {
    setConnections(prev => prev.filter(c => c.id !== connectionId));
    setHasUnsavedChanges(true);
  }, []);

  const saveWorkflow = useCallback(async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
    setHasUnsavedChanges(false);
  }, []);

  const validateWorkflow = useCallback(() => {
    const errors: string[] = [];
    
    // Check for orphaned blocks
    const connectedBlocks = new Set([
      ...connections.map((c: WorkflowConnection) => c.from.blockId),
      ...connections.map((c: WorkflowConnection) => c.to.blockId),
    ]);
    
    blocks.forEach((block: WorkflowBlock) => {
      if (!connectedBlocks.has(block.id) && blocks.length > 1) {
        errors.push(`Block "${block.name}" is not connected`);
      }
    });

    return { isValid: errors.length === 0, errors };
  }, [blocks, connections]);

  return {
    blocks,
    connections,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    addBlock,
    updateBlock,
    deleteBlock,
    addConnection,
    deleteConnection,
    saveWorkflow,
    validateWorkflow,
  };
}

/**
 * Hook for workflow execution
 */
export function useWorkflowExecution(_workflowId: string) {
  const [isRunning, setIsRunning] = useState(false);
  const [events, setEvents] = useState<ExecutionEvent[]>([]);
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(null);
  const [stats] = useState({
    processed: 0,
    succeeded: 0,
    failed: 0,
    avgDuration: 0,
  });

  const startExecution = useCallback(async () => {
    setIsRunning(true);
    setEvents([]);
    // Start execution
  }, []);

  const pauseExecution = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resumeExecution = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stopExecution = useCallback(() => {
    setIsRunning(false);
    setCurrentBlockId(null);
  }, []);

  const retryEvent = useCallback(async (_eventId: string) => {
    // Retry failed event
  }, []);

  return {
    isRunning,
    events,
    currentBlockId,
    stats,
    startExecution,
    pauseExecution,
    resumeExecution,
    stopExecution,
    retryEvent,
  };
}

/**
 * Hook for workflow templates
 */
export function useWorkflowTemplates() {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setTemplates([
        { id: 't1', name: 'Lead Qualification', description: 'Score and route incoming leads', blocks: 5 },
        { id: 't2', name: 'Multi-channel Outreach', description: 'Email + LinkedIn sequence', blocks: 8 },
        { id: 't3', name: 'Nurture Campaign', description: 'Long-term nurture flow', blocks: 12 },
      ]);
      setIsLoading(false);
    };

    loadTemplates();
  }, []);

  const createFromTemplate = useCallback((templateId: string) => {
    // Create workflow from template
    console.log('Creating from template:', templateId);
  }, []);

  const saveAsTemplate = useCallback((name: string, _description: string) => {
    // Save current workflow as template
    console.log('Saving as template:', name);
  }, []);

  return {
    templates,
    isLoading,
    createFromTemplate,
    saveAsTemplate,
  };
}

// === Block Library Hook ===

/**
 * Block template structure
 */
interface BlockTemplate {
  type: string;
  label: string;
  description: string;
}

/**
 * Block category structure
 */
interface BlockCategory {
  id: string;
  label: string;
  blocks: BlockTemplate[];
}

/**
 * Hook for block library and search
 */
export function useBlockLibrary() {
  const categories = useMemo<BlockCategory[]>(() => [
    {
      id: 'data',
      label: 'Data',
      blocks: [
        { type: 'source', label: 'Source', description: 'Import data' },
        { type: 'filter', label: 'Filter', description: 'Filter records' },
        { type: 'enrich', label: 'Enrich', description: 'Enrich data' },
      ],
    },
    {
      id: 'intelligence',
      label: 'Intelligence',
      blocks: [
        { type: 'score', label: 'Score', description: 'Score leads' },
        { type: 'ai_action', label: 'AI Action', description: 'AI decision' },
      ],
    },
    {
      id: 'outreach',
      label: 'Outreach',
      blocks: [
        { type: 'send_email', label: 'Email', description: 'Send email' },
        { type: 'send_linkedin', label: 'LinkedIn', description: 'LinkedIn message' },
        { type: 'send_call', label: 'Call', description: 'Schedule call' },
      ],
    },
    {
      id: 'flow',
      label: 'Flow',
      blocks: [
        { type: 'condition', label: 'Condition', description: 'Branch logic' },
        { type: 'wait', label: 'Wait', description: 'Time delay' },
        { type: 'escalate', label: 'Escalate', description: 'Human handoff' },
        { type: 'convert', label: 'Convert', description: 'Mark converted' },
      ],
    },
  ], []);

  const searchBlocks = useCallback((query: string): BlockCategory[] => {
    if (!query) return categories;
    
    const lowerQuery = query.toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        blocks: cat.blocks.filter((b) =>
          b.label.toLowerCase().includes(lowerQuery) ||
          b.description.toLowerCase().includes(lowerQuery)
        ),
      }))
      .filter((cat) => cat.blocks.length > 0);
  }, [categories]);

  return {
    categories,
    searchBlocks,
  };
}

export default {
  useWorkflow,
  useWorkflowExecution,
  useWorkflowTemplates,
  useBlockLibrary,
};
