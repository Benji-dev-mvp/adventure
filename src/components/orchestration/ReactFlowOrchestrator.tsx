/**
 * ReactFlowOrchestrator - Production-grade orchestration UI
 * 
 * Replaces fragile canvas rendering with React Flow (xyflow) for:
 * - Safe, crash-free node rendering
 * - Interactive node states (running/blocked/paused/completed/failed)
 * - Inspector panel for node details
 * - Minimap, zoom controls, keyboard shortcuts
 * 
 * Inspired by: Flowise, Langflow, n8n
 */

import React, { useCallback, useState, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeTypes,
  BackgroundVariant,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

// === Types ===

export type NodeState = 'pending' | 'running' | 'paused' | 'completed' | 'blocked' | 'failed';

export interface OrchestrationNode {
  id: string;
  type: string;
  label: string;
  state: NodeState;
  config?: Record<string, any>;
  metadata?: {
    duration?: number;
    startTime?: string;
    endTime?: string;
    error?: string;
  };
}

export interface OrchestrationEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: string;
}

interface Props {
  workflowId: string;
  initialNodes?: OrchestrationNode[];
  initialEdges?: OrchestrationEdge[];
  onNodeClick?: (node: OrchestrationNode) => void;
  onSave?: (workflow: { nodes: OrchestrationNode[]; edges: OrchestrationEdge[] }) => void;
  readOnly?: boolean;
}

// === Custom Node Component ===

const CustomNode = ({ data }: { data: any }) => {
  const stateColors: Record<NodeState, string> = {
    pending: 'border-gray-500 bg-gray-900/50',
    running: 'border-cyan-500 bg-cyan-900/20 animate-pulse',
    paused: 'border-amber-500 bg-amber-900/20',
    completed: 'border-green-500 bg-green-900/20',
    blocked: 'border-orange-500 bg-orange-900/20',
    failed: 'border-red-500 bg-red-900/20',
  };

  const stateIcons: Record<NodeState, string> = {
    pending: '○',
    running: '⚡',
    paused: '⏸',
    completed: '✓',
    blocked: '⊘',
    failed: '✗',
  };

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${stateColors[data.state]} min-w-[180px] cursor-pointer hover:shadow-lg transition-all`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-200">{data.label}</span>
        <span className="text-lg">{stateIcons[data.state]}</span>
      </div>
      {data.metadata?.duration && (
        <div className="text-xs text-gray-400">
          {data.metadata.duration}ms
        </div>
      )}
      {data.metadata?.error && (
        <div className="text-xs text-red-400 mt-1 truncate">
          {data.metadata.error}
        </div>
      )}
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

// === Main Component ===

export const ReactFlowOrchestrator: React.FC<Props> = ({
  workflowId,
  initialNodes = [],
  initialEdges = [],
  onNodeClick,
  onSave,
  readOnly = false,
}) => {
  // Convert to React Flow format
  const convertedNodes: Node[] = useMemo(
    () =>
      initialNodes.map((node) => ({
        id: node.id,
        type: 'custom',
        position: { x: Math.random() * 500, y: Math.random() * 300 }, // TODO: Save positions
        data: { ...node },
      })),
    [initialNodes]
  );

  const convertedEdges: Edge[] = useMemo(
    () =>
      initialEdges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label || edge.condition,
        animated: true,
        style: { stroke: '#6B7280', strokeWidth: 2 },
      })),
    [initialEdges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(convertedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(convertedEdges);
  const [selectedNode, setSelectedNode] = useState<OrchestrationNode | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const orchestrationNode = node.data as OrchestrationNode;
      setSelectedNode(orchestrationNode);
      onNodeClick?.(orchestrationNode);
    },
    [onNodeClick]
  );

  const handleSave = useCallback(() => {
    const savedNodes: OrchestrationNode[] = nodes.map((node) => node.data as OrchestrationNode);
    const savedEdges: OrchestrationEdge[] = edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label as string,
    }));
    onSave?.({ nodes: savedNodes, edges: savedEdges });
  }, [nodes, edges, onSave]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Delete selected nodes
      if (event.key === 'Delete' && selectedNode) {
        setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
        setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
        setSelectedNode(null);
      }
      // Deselect
      if (event.key === 'Escape') {
        setSelectedNode(null);
      }
    },
    [selectedNode, setNodes, setEdges]
  );

  return (
    <div className="h-full w-full bg-gray-950" onKeyDown={handleKeyDown} tabIndex={0}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#374151" />
        <Controls className="bg-gray-800 border border-gray-700 rounded-lg" />
        <MiniMap
          className="bg-gray-800 border border-gray-700 rounded-lg"
          nodeColor={(node) => {
            const state = (node.data as OrchestrationNode).state;
            const colors: Record<NodeState, string> = {
              pending: '#6B7280',
              running: '#06B6D4',
              paused: '#F59E0B',
              completed: '#10B981',
              blocked: '#F97316',
              failed: '#EF4444',
            };
            return colors[state] || '#6B7280';
          }}
          maskColor="rgba(0, 0, 0, 0.5)"
        />
        {!readOnly && (
          <Panel position="top-right" className="space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md font-medium transition-colors"
            >
              Save Workflow
            </button>
          </Panel>
        )}
        {selectedNode && (
          <Panel position="bottom-left" className="bg-gray-800 border border-gray-700 rounded-lg p-4 max-w-xs">
            <h3 className="font-semibold text-white mb-2">{selectedNode.label}</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <div>
                <span className="text-gray-400">State:</span> {selectedNode.state}
              </div>
              {selectedNode.metadata?.duration && (
                <div>
                  <span className="text-gray-400">Duration:</span> {selectedNode.metadata.duration}ms
                </div>
              )}
              {selectedNode.metadata?.error && (
                <div className="text-red-400">
                  <span className="text-gray-400">Error:</span> {selectedNode.metadata.error}
                </div>
              )}
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

export default ReactFlowOrchestrator;
