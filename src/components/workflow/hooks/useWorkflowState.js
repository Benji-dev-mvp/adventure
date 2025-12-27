import { useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState, addEdge } from 'reactflow';

const defaultNodes = [
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 250, y: 50 },
    data: { 
      label: 'Campaign Start',
      triggerType: 'manual',
      description: 'Manually trigger campaign',
    },
  },
];

const defaultEdges = [];

export const useWorkflowState = (initialWorkflow = null) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialWorkflow?.nodes || defaultNodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialWorkflow?.edges || defaultEdges
  );
  const [history, setHistory] = useState([{ nodes: defaultNodes, edges: defaultEdges }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isDirty, setIsDirty] = useState(false);

  // Track changes for dirty state
  useEffect(() => {
    if (historyIndex > 0) {
      setIsDirty(true);
    }
  }, [nodes, edges, historyIndex]);

  // Add to history
  const addToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: [...nodes], edges: [...edges] });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [nodes, edges, history, historyIndex]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  // Add node
  const addNode = useCallback((type, position, data = {}) => {
    const nodeId = `${type}-${Date.now()}`;
    const newNode = {
      id: nodeId,
      type,
      position: position || { x: 250, y: nodes.length * 150 + 100 },
      data: {
        ...getDefaultNodeData(type),
        ...data,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    addToHistory();
    return nodeId;
  }, [nodes, setNodes, addToHistory]);

  // Remove node
  const removeNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    addToHistory();
  }, [setNodes, setEdges, addToHistory]);

  // Update node data
  const updateNodeData = useCallback((nodeId, data) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    );
  }, [setNodes]);

  // Connect nodes
  const connectNodes = useCallback((params) => {
    setEdges((eds) => addEdge({
      ...params,
      type: 'smoothstep',
      animated: false,
    }, eds));
    addToHistory();
  }, [setEdges, addToHistory]);

  // Get workflow data for saving
  const getWorkflowData = useCallback(() => {
    return {
      nodes: nodes.map(({ id, type, position, data }) => ({
        id,
        type,
        position,
        data: sanitizeNodeData(data),
      })),
      edges: edges.map(({ id, source, target, sourceHandle, targetHandle }) => ({
        id,
        source,
        target,
        sourceHandle,
        targetHandle,
      })),
      metadata: {
        savedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
      },
    };
  }, [nodes, edges]);

  // Load workflow
  const loadWorkflow = useCallback((workflow) => {
    if (workflow?.nodes) {
      setNodes(workflow.nodes);
    }
    if (workflow?.edges) {
      setEdges(workflow.edges);
    }
    setIsDirty(false);
    setHistory([{ nodes: workflow?.nodes || defaultNodes, edges: workflow?.edges || defaultEdges }]);
    setHistoryIndex(0);
  }, [setNodes, setEdges]);

  // Reset workflow
  const resetWorkflow = useCallback(() => {
    setNodes(defaultNodes);
    setEdges(defaultEdges);
    setIsDirty(false);
    setHistory([{ nodes: defaultNodes, edges: defaultEdges }]);
    setHistoryIndex(0);
  }, [setNodes, setEdges]);

  // Auto-layout
  const autoLayout = useCallback(() => {
    // Simple vertical layout
    const layoutedNodes = nodes.map((node, index) => ({
      ...node,
      position: { x: 250, y: index * 150 + 50 },
    }));
    setNodes(layoutedNodes);
    addToHistory();
  }, [nodes, setNodes, addToHistory]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addNode,
    removeNode,
    updateNodeData,
    connectNodes,
    getWorkflowData,
    loadWorkflow,
    resetWorkflow,
    autoLayout,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    isDirty,
    setIsDirty,
  };
};

// Helper functions
const getDefaultNodeData = (type) => {
  const defaults = {
    trigger: { label: 'Campaign Start', triggerType: 'manual' },
    email: { label: 'Send Email', subject: '', content: '', tone: 'professional' },
    linkedin: { label: 'LinkedIn Message', content: '', connectionRequest: false },
    call: { label: 'Phone Call', script: '', duration: 5 },
    sms: { label: 'Send SMS', content: '', maxLength: 160 },
    delay: { label: 'Wait', days: 2, hours: 0 },
    condition: { label: 'Condition', field: 'email_opened', operator: 'equals', value: 'true' },
    abtest: { label: 'A/B Test', variants: ['A', 'B'], splitRatio: 50 },
  };
  return defaults[type] || { label: 'Unknown' };
};

const sanitizeNodeData = (data) => {
  // Remove callback functions before saving
  const { onDelete, onDuplicate, onChange, executionStatus, ...cleanData } = data;
  return cleanData;
};

export default useWorkflowState;
