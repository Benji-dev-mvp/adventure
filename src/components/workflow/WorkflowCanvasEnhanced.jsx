import React, { useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  MarkerType,
  ConnectionMode,
  getBezierPath,
  EdgeLabelRenderer,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { EmailNode } from './nodes/EmailNode';
import { LinkedInNode } from './nodes/LinkedInNode';
import { CallNode } from './nodes/CallNode';
import { SMSNode } from './nodes/SMSNode';
import { DelayNode } from './nodes/DelayNode';
import { ConditionNode } from './nodes/ConditionNode';
import { TriggerNode } from './nodes/TriggerNode';
import { ABTestNode } from './nodes/ABTestNode';
import NodeCreatorPanel from './NodeCreatorPanel';
import WorkflowToolbar from './WorkflowToolbar';
import ExecutionOverlay from './ExecutionOverlay';
import WorkflowMetricsPanel from './WorkflowMetricsPanel';
import { useToast } from '../Toast';
import { Zap } from 'lucide-react';

// Custom node types
const nodeTypes = {
  trigger: TriggerNode,
  email: EmailNode,
  linkedin: LinkedInNode,
  call: CallNode,
  sms: SMSNode,
  delay: DelayNode,
  condition: ConditionNode,
  abtest: ABTestNode,
};

// Custom animated edge with data flow indicator
const DataFlowEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isAnimated = data?.animated;
  const leadsCount = data?.leadsCount || 0;
  const isActive = data?.isActive;

  return (
    <>
      {/* Background glow for active edges */}
      {isActive && (
        <path
          d={edgePath}
          fill="none"
          stroke="#818cf8"
          strokeWidth={8}
          strokeOpacity={0.3}
          className="animate-pulse"
        />
      )}

      {/* Main path */}
      <path
        id={id}
        style={style}
        className={`react-flow__edge-path ${isAnimated ? 'animate-dash' : ''}`}
        d={edgePath}
        markerEnd={markerEnd}
        fill="none"
      />

      {/* Data flow particles for animated edges */}
      {isAnimated && (
        <circle r="4" fill="#6366f1">
          <animateMotion dur="1.5s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}

      {/* Edge label with leads count */}
      {leadsCount > 0 && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="bg-indigo-600 text-white text-xs font-medium px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1"
          >
            <Zap className="w-3 h-3" />
            {leadsCount}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

DataFlowEdge.propTypes = {
  id: PropTypes.string.isRequired,
  sourceX: PropTypes.number.isRequired,
  sourceY: PropTypes.number.isRequired,
  targetX: PropTypes.number.isRequired,
  targetY: PropTypes.number.isRequired,
  sourcePosition: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  targetPosition: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  style: PropTypes.object,
  markerEnd: PropTypes.any,
  data: PropTypes.shape({
    animated: PropTypes.bool,
    leadsCount: PropTypes.number,
    isActive: PropTypes.bool,
  }),
};

// Edge types
const edgeTypes = {
  dataflow: DataFlowEdge,
};

// Custom edge styles
const defaultEdgeOptions = {
  type: 'dataflow',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 16,
    height: 16,
    color: '#6366f1',
  },
  style: {
    strokeWidth: 2,
    stroke: '#6366f1',
  },
  animated: false,
};

// Initial nodes - start with a trigger
const initialNodes = [
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 400, y: 50 },
    data: {
      label: 'Campaign Start',
      triggerType: 'manual',
      description: 'Manually trigger campaign',
      stats: { leads: 0 },
    },
  },
];

const initialEdges = [];

const WorkflowCanvas = ({
  onSave,
  onExecute,
  campaignName = 'Untitled Campaign',
  readOnly = false,
  initialWorkflow = null,
  executionData = null,
  onAIAssistantOpen,
  showMetrics = true,
}) => {
  const { showToast } = useToast();
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialWorkflow?.nodes || initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialWorkflow?.edges || initialEdges);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStatus, setExecutionStatus] = useState({});
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Handle new connections with visual feedback
  const onConnect = useCallback(
    params => {
      const newEdge = {
        ...params,
        ...defaultEdgeOptions,
        id: `edge-${params.source}-${params.target}-${Date.now()}`,
        data: {
          leadsCount: 0,
          animated: false,
          isActive: true,
        },
      };
      setEdges(eds => addEdge(newEdge, eds));
      showToast('✓ Nodes connected successfully', 'success');
    },
    [setEdges, showToast]
  );

  // Handle drag over
  const onDragOver = useCallback(event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop from node creator
  const onDrop = useCallback(
    event => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      onAddNode(type, position);
    },
    [reactFlowInstance]
  );

  // Add new node from panel
  const onAddNode = useCallback(
    (nodeType, position) => {
      const newNodeId = `${nodeType}-${Date.now()}`;
      const nodeDefaults = getNodeDefaults(nodeType);

      const newNode = {
        id: newNodeId,
        type: nodeType,
        position: position || { x: 400, y: nodes.length * 150 + 100 },
        data: {
          ...nodeDefaults,
          stats: { leads: 0, success: 0, pending: 0 },
          onDelete: () => handleDeleteNode(newNodeId),
          onDuplicate: () => handleDuplicateNode(newNodeId),
          onChange: data => handleNodeDataChange(newNodeId, data),
        },
      };

      setNodes(nds => [...nds, newNode]);
      setIsPanelOpen(false);
      showToast(`✓ ${nodeDefaults.label} added to canvas`, 'success');
    },
    [nodes, setNodes, showToast]
  );

  // Get default data for each node type
  const getNodeDefaults = type => {
    const defaults = {
      trigger: { label: 'Campaign Trigger', triggerType: 'manual', description: 'Start campaign' },
      email: { label: 'Send Email', subject: '', content: '', tone: 'professional' },
      linkedin: { label: 'LinkedIn Message', content: '', connectionRequest: false },
      call: { label: 'Phone Call', script: '', duration: 5 },
      sms: { label: 'Send SMS', content: '', maxLength: 160 },
      delay: { label: 'Wait', days: 2, hours: 0, description: 'Wait before next step' },
      condition: { label: 'Condition', field: 'email_opened', operator: 'equals', value: 'true' },
      abtest: { label: 'A/B Test', variants: ['A', 'B'], splitRatio: 50 },
    };
    return defaults[type] || { label: 'Unknown Node' };
  };

  // Delete node
  const handleDeleteNode = useCallback(
    nodeId => {
      setNodes(nds => nds.filter(node => node.id !== nodeId));
      setEdges(eds => eds.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
      showToast('Node deleted', 'success');
    },
    [setNodes, setEdges, showToast]
  );

  // Duplicate node
  const handleDuplicateNode = useCallback(
    nodeId => {
      const nodeToDuplicate = nodes.find(n => n.id === nodeId);
      if (!nodeToDuplicate) return;

      const newNodeId = `${nodeToDuplicate.type}-${Date.now()}`;
      const newNode = {
        ...nodeToDuplicate,
        id: newNodeId,
        position: {
          x: nodeToDuplicate.position.x + 50,
          y: nodeToDuplicate.position.y + 50,
        },
        data: {
          ...nodeToDuplicate.data,
          onDelete: () => handleDeleteNode(newNodeId),
          onDuplicate: () => handleDuplicateNode(newNodeId),
        },
      };

      setNodes(nds => [...nds, newNode]);
      showToast('Node duplicated', 'success');
    },
    [nodes, setNodes, showToast]
  );

  // Update node data
  const handleNodeDataChange = useCallback(
    (nodeId, newData) => {
      setNodes(nds =>
        nds.map(node =>
          node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
        )
      );
    },
    [setNodes]
  );

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Apply AI-generated workflow
  const applyAIWorkflow = useCallback(
    workflow => {
      if (!workflow?.nodes || !workflow?.edges) return;

      // Enhance nodes with callbacks
      const enhancedNodes = workflow.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          stats: { leads: Math.floor(Math.random() * 100), success: 0, pending: 0 },
          onDelete: () => handleDeleteNode(node.id),
          onDuplicate: () => handleDuplicateNode(node.id),
          onChange: data => handleNodeDataChange(node.id, data),
        },
      }));

      // Enhance edges with styling
      const enhancedEdges = workflow.edges.map(edge => ({
        ...edge,
        ...defaultEdgeOptions,
        data: {
          leadsCount: Math.floor(Math.random() * 50),
          animated: false,
          isActive: true,
        },
      }));

      setNodes(enhancedNodes);
      setEdges(enhancedEdges);
      showToast('✓ AI workflow applied successfully!', 'success');
    },
    [setNodes, setEdges, showToast]
  );

  // Save workflow
  const handleSave = useCallback(() => {
    const workflow = {
      nodes: nodes.map(({ id, type, position, data }) => ({
        id,
        type,
        position,
        data: {
          ...data,
          onDelete: undefined,
          onDuplicate: undefined,
          onChange: undefined,
          stats: undefined,
        },
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
    onSave?.(workflow);
    showToast('✓ Workflow saved', 'success');
  }, [nodes, edges, onSave, showToast]);

  // Execute workflow with visual animation
  const handleExecute = useCallback(async () => {
    if (nodes.length === 0) {
      showToast('Add nodes to your workflow first', 'error');
      return;
    }

    setIsExecuting(true);
    setExecutionStatus({});

    // Simulate execution through nodes
    const executeNodes = async () => {
      const triggerNode = nodes.find(n => n.type === 'trigger');
      if (!triggerNode) {
        showToast('Workflow must start with a trigger', 'error');
        setIsExecuting(false);
        return;
      }

      const visited = new Set();
      const queue = [triggerNode.id];
      let leadsProcessed = 100;

      while (queue.length > 0) {
        const currentId = queue.shift();
        if (visited.has(currentId)) continue;
        visited.add(currentId);

        // Update status to running
        setExecutionStatus(prev => ({ ...prev, [currentId]: 'running' }));

        // Animate incoming edges
        setEdges(eds =>
          eds.map(e => (e.target === currentId ? { ...e, data: { ...e.data, animated: true } } : e))
        );

        // Simulate execution time
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Update node with random stats
        const successRate = 0.6 + Math.random() * 0.3;
        leadsProcessed = Math.floor(leadsProcessed * successRate);

        setNodes(nds =>
          nds.map(n =>
            n.id === currentId
              ? {
                  ...n,
                  data: {
                    ...n.data,
                    stats: {
                      leads: leadsProcessed,
                      success: Math.floor(leadsProcessed * successRate),
                      pending: Math.floor(leadsProcessed * 0.1),
                    },
                  },
                }
              : n
          )
        );

        // Update status to completed
        setExecutionStatus(prev => ({ ...prev, [currentId]: 'completed' }));

        // Update edge with leads count
        setEdges(eds =>
          eds.map(e =>
            e.source === currentId
              ? { ...e, data: { ...e.data, leadsCount: leadsProcessed, animated: false } }
              : e
          )
        );

        // Find connected nodes
        const connectedEdges = edges.filter(e => e.source === currentId);
        connectedEdges.forEach(edge => queue.push(edge.target));
      }

      setIsExecuting(false);
      showToast(`✓ Workflow executed! Processed ${visited.size} steps`, 'success');
      onExecute?.({ nodes: visited.size, success: true, leadsProcessed });
    };

    executeNodes();
  }, [nodes, edges, showToast, onExecute, setNodes, setEdges]);

  // Auto-layout nodes in a tree structure
  const handleAutoLayout = useCallback(() => {
    // Group nodes by their depth in the graph
    const nodeDepths = {};
    const visited = new Set();

    const triggerNode = nodes.find(n => n.type === 'trigger');
    if (!triggerNode) {
      // Simple vertical layout if no trigger
      const layoutedNodes = nodes.map((node, index) => ({
        ...node,
        position: { x: 400, y: index * 180 + 50 },
      }));
      setNodes(layoutedNodes);
      showToast('Layout applied', 'success');
      return;
    }

    // BFS to find depths
    const queue = [{ id: triggerNode.id, depth: 0 }];
    while (queue.length > 0) {
      const { id, depth } = queue.shift();
      if (visited.has(id)) continue;
      visited.add(id);
      nodeDepths[id] = depth;

      edges
        .filter(e => e.source === id)
        .forEach(edge => {
          queue.push({ id: edge.target, depth: depth + 1 });
        });
    }

    // Group by depth
    const levels = {};
    nodes.forEach(node => {
      const depth = nodeDepths[node.id] ?? 0;
      if (!levels[depth]) levels[depth] = [];
      levels[depth].push(node);
    });

    // Position nodes
    const layoutedNodes = nodes.map(node => {
      const depth = nodeDepths[node.id] ?? 0;
      const levelNodes = levels[depth];
      const index = levelNodes.indexOf(node);
      const totalWidth = levelNodes.length * 280;
      const startX = 400 - totalWidth / 2 + 140;

      return {
        ...node,
        position: {
          x: startX + index * 280,
          y: depth * 180 + 50,
        },
      };
    });

    setNodes(layoutedNodes);
    showToast('✓ Auto-layout applied', 'success');
  }, [nodes, edges, setNodes, showToast]);

  // Minimap node color
  const nodeColor = node => {
    const colors = {
      trigger: '#22c55e',
      email: '#3b82f6',
      linkedin: '#1d4ed8',
      call: '#10b981',
      sms: '#8b5cf6',
      delay: '#f59e0b',
      condition: '#ec4899',
      abtest: '#6366f1',
    };
    return colors[node.type] || '#6b7280';
  };

  return (
    <div className="h-full w-full relative bg-gray-50 dark:bg-gray-900 flex">
      {/* Main Canvas */}
      <div className="flex-1" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes.map(node => ({
            ...node,
            data: {
              ...node.data,
              executionStatus: executionStatus[node.id],
              onDelete: () => handleDeleteNode(node.id),
              onDuplicate: () => handleDuplicateNode(node.id),
              onChange: data => handleNodeDataChange(node.id, data),
            },
          }))}
          edges={edges.map(edge => ({
            ...edge,
            data: {
              ...edge.data,
              animated: executionStatus[edge.source] === 'running',
            },
          }))}
          onNodesChange={readOnly ? undefined : onNodesChange}
          onEdgesChange={readOnly ? undefined : onEdgesChange}
          onConnect={readOnly ? undefined : onConnect}
          onNodeClick={onNodeClick}
          onInit={setReactFlowInstance}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          snapToGrid
          snapGrid={[20, 20]}
          defaultEdgeOptions={defaultEdgeOptions}
          className="bg-gray-50 dark:bg-gray-900"
          connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2 }}
          connectionLineType="smoothstep"
        >
          {/* Dotted Grid Background */}
          <Background color="#94a3b8" gap={20} size={1.5} variant="dots" />

          <Controls className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg" />

          <MiniMap
            nodeColor={nodeColor}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
            maskColor="rgba(0, 0, 0, 0.1)"
            pannable
            zoomable
          />

          {/* Toolbar Panel */}
          <Panel position="top-left" className="flex gap-2">
            <WorkflowToolbar
              onAddNode={() => setIsPanelOpen(true)}
              onSave={handleSave}
              onExecute={handleExecute}
              onAutoLayout={handleAutoLayout}
              onAIAssistant={onAIAssistantOpen}
              isExecuting={isExecuting}
              readOnly={readOnly}
              nodeCount={nodes.length}
              edgeCount={edges.length}
            />
          </Panel>

          {/* Campaign Name */}
          <Panel position="top-center">
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {campaignName}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                  {nodes.length} nodes
                </span>
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                  {edges.length} connections
                </span>
              </div>
            </div>
          </Panel>

          {/* Execution Status */}
          {isExecuting && (
            <Panel position="top-right">
              <ExecutionOverlay status={executionStatus} nodes={nodes} />
            </Panel>
          )}

          {/* Quick Help */}
          <Panel position="bottom-left">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-gray-600 dark:text-gray-400 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-[10px]">
                  ⌘
                </span>
                + drag to pan
              </span>
              <span className="flex items-center gap-1">Scroll to zoom</span>
              <span className="flex items-center gap-1">
                Drag from <span className="w-2 h-2 bg-indigo-500 rounded-full"></span> to connect
              </span>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Right Sidebar - Metrics Panel */}
      {showMetrics && nodes.length > 0 && (
        <div className="w-72 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
          <WorkflowMetricsPanel nodes={nodes} edges={edges} executionData={executionData} />
        </div>
      )}

      {/* Node Creator Panel */}
      <NodeCreatorPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onAddNode={onAddNode}
      />
    </div>
  );
};

WorkflowCanvas.propTypes = {
  onSave: PropTypes.func.isRequired,
  onExecute: PropTypes.func.isRequired,
  campaignName: PropTypes.string,
  readOnly: PropTypes.bool,
  initialWorkflow: PropTypes.shape({
    nodes: PropTypes.array,
    edges: PropTypes.array,
  }),
  executionData: PropTypes.object,
  onAIAssistantOpen: PropTypes.func,
  showMetrics: PropTypes.bool,
};

// Add CSS for dash animation
const style = document.createElement('style');
style.textContent = `
  @keyframes dash {
    to {
      stroke-dashoffset: -20;
    }
  }
  .animate-dash {
    stroke-dasharray: 5 5;
    animation: dash 0.5s linear infinite;
  }
`;
document.head.appendChild(style);

export default WorkflowCanvas;
