/**
 * Workflow State Visualization Component
 * 
 * Operator-grade workflow visualization inspired by:
 * - Airflow (DAG execution view)
 * - Kubernetes Dashboard (pod states)
 * - AWS Step Functions (state machine execution)
 * - Dagster (asset lineage)
 * 
 * Features:
 * - Node states: pending/running/paused/completed/blocked/failed
 * - Execution pointer (current step indicator)
 * - Edge conditions and dependencies
 * - Click node → EntityDrawer or context panel
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { BadgePill } from '@/components/layout/shared';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Zap
} from 'lucide-react';

export type WorkflowNodeState = 
  | 'pending' 
  | 'running' 
  | 'paused' 
  | 'completed' 
  | 'blocked' 
  | 'failed';

export interface WorkflowNode {
  id: string;
  label: string;
  state: WorkflowNodeState;
  duration?: number; // milliseconds
  startTime?: string;
  endTime?: string;
  entityRefs?: Array<{ type: string; id: string; name: string }>;
  metadata?: Record<string, any>;
}

export interface WorkflowEdge {
  from: string;
  to: string;
  condition?: string;
  label?: string;
}

export interface WorkflowVisualizationData {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  currentNodeId?: string; // Execution pointer
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed';
}

interface WorkflowStateVisualizationProps {
  data: WorkflowVisualizationData;
  onNodeClick?: (node: WorkflowNode) => void;
  compact?: boolean;
}

export const WorkflowStateVisualization: React.FC<WorkflowStateVisualizationProps> = ({
  data,
  onNodeClick,
  compact = false,
}) => {
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);

  const getNodeIcon = (state: WorkflowNodeState) => {
    switch (state) {
      case 'running':
        return Play;
      case 'paused':
        return Pause;
      case 'completed':
        return CheckCircle2;
      case 'failed':
        return XCircle;
      case 'blocked':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getNodeColor = (state: WorkflowNodeState) => {
    switch (state) {
      case 'running':
        return 'border-cyan-500 bg-cyan-500/10 text-cyan-400';
      case 'paused':
        return 'border-amber-500 bg-amber-500/10 text-amber-400';
      case 'completed':
        return 'border-green-500 bg-green-500/10 text-green-400';
      case 'failed':
        return 'border-red-500 bg-red-500/10 text-red-400';
      case 'blocked':
        return 'border-orange-500 bg-orange-500/10 text-orange-400';
      default:
        return 'border-slate-700 bg-slate-800/50 text-slate-400';
    }
  };

  const getNodeBadge = (state: WorkflowNodeState) => {
    switch (state) {
      case 'running':
        return <BadgePill variant="default" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">Running</BadgePill>;
      case 'paused':
        return <BadgePill variant="default" className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">Paused</BadgePill>;
      case 'completed':
        return <BadgePill variant="default" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Completed</BadgePill>;
      case 'failed':
        return <BadgePill variant="default" className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">Failed</BadgePill>;
      case 'blocked':
        return <BadgePill variant="default" className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">Blocked</BadgePill>;
      default:
        return <BadgePill variant="default" className="bg-slate-700/50 text-slate-400 border-slate-600 text-xs">Pending</BadgePill>;
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
    return `${(ms / 3600000).toFixed(1)}h`;
  };

  const handleNodeClick = (node: WorkflowNode) => {
    setSelectedNode(node);
    onNodeClick?.(node);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {data.nodes.map((node, index) => {
          const NodeIcon = getNodeIcon(node.state);
          const isCurrentNode = node.id === data.currentNodeId;
          
          return (
            <React.Fragment key={node.id}>
              <button
                onClick={() => handleNodeClick(node)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md border transition-colors',
                  getNodeColor(node.state),
                  isCurrentNode && 'ring-2 ring-offset-2 ring-offset-slate-950 ring-cyan-500',
                  'hover:opacity-80'
                )}
              >
                <NodeIcon className="w-4 h-4" />
                <span className="text-sm font-medium">{node.label}</span>
                {isCurrentNode && <Zap className="w-3 h-3" />}
              </button>
              
              {index < data.nodes.length - 1 && (
                <ArrowRight className="w-4 h-4 text-slate-600" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Workflow Status */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400 mb-1">Workflow Status</div>
              <div className="flex items-center gap-2">
                {data.status === 'running' && (
                  <>
                    <Play className="w-4 h-4 text-cyan-400" />
                    <span className="text-lg font-semibold text-cyan-400">Running</span>
                  </>
                )}
                {data.status === 'paused' && (
                  <>
                    <Pause className="w-4 h-4 text-amber-400" />
                    <span className="text-lg font-semibold text-amber-400">Paused</span>
                  </>
                )}
                {data.status === 'completed' && (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-lg font-semibold text-green-400">Completed</span>
                  </>
                )}
                {data.status === 'failed' && (
                  <>
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="text-lg font-semibold text-red-400">Failed</span>
                  </>
                )}
                {data.status === 'idle' && (
                  <>
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-lg font-semibold text-slate-400">Idle</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-slate-400 mb-1">Progress</div>
              <div className="text-lg font-semibold text-slate-300">
                {data.nodes.filter(n => n.state === 'completed').length} / {data.nodes.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Nodes */}
      <div className="space-y-3">
        {data.nodes.map((node, index) => {
          const NodeIcon = getNodeIcon(node.state);
          const isCurrentNode = node.id === data.currentNodeId;
          const edge = data.edges.find(e => e.from === node.id);
          
          return (
            <div key={node.id}>
              <Card
                onClick={() => handleNodeClick(node)}
                className={cn(
                  'bg-slate-900/50 border-2 transition-all cursor-pointer hover:bg-slate-800/50',
                  getNodeColor(node.state),
                  isCurrentNode && 'ring-2 ring-offset-2 ring-offset-slate-950 ring-cyan-500',
                  selectedNode?.id === node.id && 'bg-slate-800/70'
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn('p-2 rounded-md', getNodeColor(node.state))}>
                      <NodeIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-slate-200">{node.label}</span>
                        {isCurrentNode && (
                          <BadgePill variant="default" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            Current
                          </BadgePill>
                        )}
                        {getNodeBadge(node.state)}
                      </div>
                      
                      {node.duration && (
                        <div className="text-xs text-slate-400 mb-1">
                          Duration: {formatDuration(node.duration)}
                        </div>
                      )}
                      
                      {node.entityRefs && node.entityRefs.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                          <span>Entities:</span>
                          {node.entityRefs.map(ref => (
                            <BadgePill key={ref.id} variant="default" className="text-xs">
                              {ref.name}
                            </BadgePill>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Edge with condition */}
              {edge && index < data.nodes.length - 1 && (
                <div className="flex items-center justify-center py-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ArrowRight className="w-4 h-4" />
                    {edge.condition && (
                      <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">
                        {edge.condition}
                      </span>
                    )}
                    {edge.label && (
                      <span className="text-slate-400">{edge.label}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
