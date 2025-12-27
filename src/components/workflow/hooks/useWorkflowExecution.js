import { useState, useCallback } from 'react';

export const useWorkflowExecution = (nodes, edges) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStatus, setExecutionStatus] = useState({});
  const [executionResults, setExecutionResults] = useState({});
  const [executionLog, setExecutionLog] = useState([]);

  // Start execution
  const startExecution = useCallback(async (onProgress, onComplete) => {
    if (isExecuting || nodes.length === 0) return;

    setIsExecuting(true);
    setExecutionStatus({});
    setExecutionResults({});
    setExecutionLog([]);

    const logEntry = (message, type = 'info') => {
      const entry = {
        timestamp: new Date().toISOString(),
        message,
        type,
      };
      setExecutionLog(prev => [...prev, entry]);
    };

    logEntry('Starting workflow execution...');

    // Find trigger node
    const triggerNode = nodes.find(n => n.type === 'trigger');
    if (!triggerNode) {
      logEntry('No trigger node found!', 'error');
      setIsExecuting(false);
      return;
    }

    // Build execution order using topological sort
    const executionOrder = buildExecutionOrder(triggerNode.id, nodes, edges);
    logEntry(`Execution order: ${executionOrder.join(' → ')}`);

    // Execute nodes in order
    for (const nodeId of executionOrder) {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) continue;

      // Mark as running
      setExecutionStatus(prev => ({ ...prev, [nodeId]: 'running' }));
      logEntry(`Executing: ${node.data?.label || node.type}`);
      onProgress?.(nodeId, 'running');

      // Simulate execution time based on node type
      const executionTime = getExecutionTime(node.type);
      await delay(executionTime);

      // Simulate results
      const result = simulateNodeExecution(node);
      setExecutionResults(prev => ({ ...prev, [nodeId]: result }));

      // Mark as completed
      setExecutionStatus(prev => ({ ...prev, [nodeId]: 'completed' }));
      logEntry(`Completed: ${node.data?.label || node.type} - ${result.summary}`, 'success');
      onProgress?.(nodeId, 'completed', result);
    }

    logEntry('Workflow execution completed!', 'success');
    setIsExecuting(false);
    
    const summary = {
      nodesExecuted: executionOrder.length,
      totalTime: executionOrder.reduce((acc, id) => {
        const node = nodes.find(n => n.id === id);
        return acc + getExecutionTime(node?.type || 'default');
      }, 0),
      success: true,
    };
    
    onComplete?.(summary);
    return summary;
  }, [nodes, edges, isExecuting]);

  // Stop execution
  const stopExecution = useCallback(() => {
    setIsExecuting(false);
    // Mark running nodes as stopped
    setExecutionStatus(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        if (updated[key] === 'running') {
          updated[key] = 'stopped';
        }
      });
      return updated;
    });
  }, []);

  // Reset execution state
  const resetExecution = useCallback(() => {
    setIsExecuting(false);
    setExecutionStatus({});
    setExecutionResults({});
    setExecutionLog([]);
  }, []);

  // Get node execution status
  const getNodeStatus = useCallback((nodeId) => {
    return executionStatus[nodeId] || 'pending';
  }, [executionStatus]);

  // Get node execution result
  const getNodeResult = useCallback((nodeId) => {
    return executionResults[nodeId] || null;
  }, [executionResults]);

  return {
    isExecuting,
    executionStatus,
    executionResults,
    executionLog,
    startExecution,
    stopExecution,
    resetExecution,
    getNodeStatus,
    getNodeResult,
  };
};

// Helper: Build execution order using DFS
const buildExecutionOrder = (startId, nodes, edges) => {
  const order = [];
  const visited = new Set();

  const dfs = (nodeId) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    order.push(nodeId);

    // Find connected nodes
    const connectedEdges = edges.filter(e => e.source === nodeId);
    connectedEdges.forEach(edge => {
      dfs(edge.target);
    });
  };

  dfs(startId);
  return order;
};

// Helper: Get simulated execution time
const getExecutionTime = (nodeType) => {
  const times = {
    trigger: 500,
    email: 1500,
    linkedin: 2000,
    call: 1000,
    sms: 800,
    delay: 1000,
    condition: 500,
    abtest: 600,
  };
  return times[nodeType] || 1000;
};

// Helper: Simulate node execution results
const simulateNodeExecution = (node) => {
  const type = node.type;
  
  switch (type) {
    case 'trigger':
      return {
        summary: '150 leads loaded',
        leadsProcessed: 150,
      };
    case 'email':
      return {
        summary: 'Sent: 150, Opened: 45 (30%)',
        sent: 150,
        opened: 45,
        openRate: 30,
      };
    case 'linkedin':
      return {
        summary: 'Sent: 120, Accepted: 35 (29%)',
        sent: 120,
        accepted: 35,
        acceptRate: 29,
      };
    case 'call':
      return {
        summary: 'Attempted: 80, Connected: 24 (30%)',
        attempted: 80,
        connected: 24,
        connectRate: 30,
      };
    case 'sms':
      return {
        summary: 'Sent: 100, Delivered: 95 (95%)',
        sent: 100,
        delivered: 95,
        deliveryRate: 95,
      };
    case 'delay':
      const days = node.data?.days || 2;
      return {
        summary: `Waited ${days} day(s)`,
        daysWaited: days,
      };
    case 'condition':
      return {
        summary: 'Split: 65 yes, 85 no',
        yesBranch: 65,
        noBranch: 85,
      };
    case 'abtest':
      const ratio = node.data?.splitRatio || 50;
      return {
        summary: `Split ${ratio}/${100-ratio}`,
        variantA: Math.round(150 * ratio / 100),
        variantB: Math.round(150 * (100 - ratio) / 100),
      };
    default:
      return {
        summary: 'Completed',
      };
  }
};

// Helper: Delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default useWorkflowExecution;
