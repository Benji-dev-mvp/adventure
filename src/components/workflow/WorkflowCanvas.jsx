import React, { useCallback, useState } from 'react';
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
import { useToast } from '../Toast';

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

// Custom edge styles
const edgeOptions = {
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
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
    position: { x: 250, y: 50 },
    data: {
      label: 'Campaign Start',
      triggerType: 'manual',
      description: 'Manually trigger campaign',
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
}) => {
  const { showToast } = useToast();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialWorkflow?.nodes || initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialWorkflow?.edges || initialEdges);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStatus, setExecutionStatus] = useState({});

  // Handle new connections
  const onConnect = useCallback(
    params => {
      const newEdge = {
        ...params,
        ...edgeOptions,
        id: `edge-${params.source}-${params.target}`,
      };
      setEdges(eds => addEdge(newEdge, eds));
      showToast('Nodes connected', 'success');
    },
    [setEdges, showToast]
  );

  // Add new node from panel
  const onAddNode = useCallback(
    (nodeType, position) => {
      const newNodeId = `${nodeType}-${Date.now()}`;
      const nodeDefaults = getNodeDefaults(nodeType);

      const newNode = {
        id: newNodeId,
        type: nodeType,
        position: position || { x: 250, y: nodes.length * 150 + 100 },
        data: {
          ...nodeDefaults,
          onDelete: () => handleDeleteNode(newNodeId),
          onDuplicate: () => handleDuplicateNode(newNodeId),
          onChange: data => handleNodeDataChange(newNodeId, data),
        },
      };

      setNodes(nds => [...nds, newNode]);
      setIsPanelOpen(false);
      showToast(`${nodeDefaults.label} added`, 'success');
    },
    [nodes, setNodes, showToast]
  );

  // Get default data for each node type
  const getNodeDefaults = type => {
    const nodeConfig = {
      trigger: ['Campaign Trigger', { triggerType: 'manual', description: 'Start campaign' }],
      email: ['Send Email', { subject: '', content: '', tone: 'professional' }],
      linkedin: ['LinkedIn Message', { content: '', connectionRequest: false }],
      call: ['Phone Call', { script: '', duration: 5 }],
      sms: ['Send SMS', { content: '', maxLength: 160 }],
      delay: ['Wait', { days: 2, hours: 0, description: 'Wait before next step' }],
      condition: ['Condition', { field: 'email_opened', operator: 'equals', value: 'true' }],
      abtest: ['A/B Test', { variants: ['A', 'B'], splitRatio: 50 }],
    };

    const [label, props] = nodeConfig[type] || ['Unknown Node', {}];
    return { label, ...props };
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

  // Save workflow
  const handleSave = useCallback(() => {
    const workflow = {
      nodes: nodes.map(({ id, type, position, data }) => ({
        id,
        type,
        position,
        data: { ...data, onDelete: undefined, onDuplicate: undefined, onChange: undefined },
      })),
      edges,
      metadata: {
        savedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
      },
    };
    onSave?.(workflow);
    showToast('Workflow saved', 'success');
  }, [nodes, edges, onSave, showToast]);

  // Execute workflow
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

      while (queue.length > 0) {
        const currentId = queue.shift();
        if (visited.has(currentId)) continue;
        visited.add(currentId);

        // Update status to running
        setExecutionStatus(prev => ({ ...prev, [currentId]: 'running' }));

        // Simulate execution time
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update status to completed
        setExecutionStatus(prev => ({ ...prev, [currentId]: 'completed' }));

        // Find connected nodes
        const connectedEdges = edges.filter(e => e.source === currentId);
        connectedEdges.forEach(edge => queue.push(edge.target));
      }

      setIsExecuting(false);
      showToast('Workflow executed successfully', 'success');
      onExecute?.({ nodes: visited.size, success: true });
    };

    executeNodes();
  }, [nodes, edges, showToast, onExecute]);

  // Auto-layout nodes
  const handleAutoLayout = useCallback(() => {
    const layoutedNodes = nodes.map((node, index) => ({
      ...node,
      position: {
        x: 250,
        y: index * 150 + 50,
      },
    }));
    setNodes(layoutedNodes);
    showToast('Layout applied', 'success');
  }, [nodes, setNodes, showToast]);

  // Minimap node color configuration
  const nodeColorMap = {
    trigger: '#22c55e',
    email: '#3b82f6',
    linkedin: '#1d4ed8',
    call: '#10b981',
    sms: '#8b5cf6',
    delay: '#f59e0b',
    condition: '#ec4899',
    abtest: '#6366f1',
  };

  const nodeColor = node => nodeColorMap[node.type] || '#6b7280';

  return (
    <div className="h-full w-full relative bg-gray-50 dark:bg-gray-900">
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
          animated: executionStatus[edge.source] === 'running',
        }))}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={readOnly ? undefined : onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        snapToGrid
        snapGrid={[16, 16]}
        defaultEdgeOptions={edgeOptions}
        className="bg-gray-50 dark:bg-gray-900"
      >
        <Background color="#94a3b8" gap={16} size={1} />
        <Controls className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg" />
        <MiniMap
          nodeColor={nodeColor}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
          maskColor="rgba(0, 0, 0, 0.1)"
        />

        {/* Toolbar Panel */}
        <Panel position="top-left" className="flex gap-2">
          <WorkflowToolbar
            onAddNode={() => setIsPanelOpen(true)}
            onSave={handleSave}
            onExecute={handleExecute}
            onAutoLayout={handleAutoLayout}
            isExecuting={isExecuting}
            readOnly={readOnly}
            nodeCount={nodes.length}
          />
        </Panel>

        {/* Campaign Name */}
        <Panel position="top-center">
          <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{campaignName}</h2>
          </div>
        </Panel>

        {/* Execution Status */}
        {isExecuting && (
          <Panel position="top-right">
            <ExecutionOverlay status={executionStatus} nodes={nodes} />
          </Panel>
        )}
      </ReactFlow>

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
};

export default WorkflowCanvas;
