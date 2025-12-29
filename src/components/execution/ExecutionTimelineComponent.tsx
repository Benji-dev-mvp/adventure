/**
 * ExecutionTimelineComponent - n8n-inspired execution history
 * 
 * Used by:
 * - Autopilot (show recent runs)
 * - Orchestration (show workflow executions)
 * - Activity Feed (filtered view)
 * 
 * Features:
 * - Groups executions by status (running/completed/failed)
 * - Click execution → detailed view
 * - Duration tracking, timestamp display
 * - Status indicators with colors
 * 
 * Inspired by: n8n, Airflow, GitHub Actions
 */

import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, PlayCircle, Loader } from 'lucide-react';

// === Types ===

export type ExecutionStatus = 'running' | 'completed' | 'failed' | 'pending';

export interface Execution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: ExecutionStatus;
  startTime: string;
  endTime?: string;
  duration?: number; // milliseconds
  trigger: 'manual' | 'schedule' | 'webhook' | 'command';
  error?: string;
  metadata?: Record<string, any>;
}

interface Props {
  executions: Execution[];
  onExecutionClick?: (execution: Execution) => void;
  groupBy?: 'status' | 'workflow' | 'none';
  maxHeight?: number;
}

// === Helper Functions ===

const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
};

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString();
};

// === Execution Item Component ===

const ExecutionItem: React.FC<{ execution: Execution; onClick?: () => void }> = ({
  execution,
  onClick,
}) => {
  const statusConfig: Record<
    ExecutionStatus,
    { icon: React.FC<any>; color: string; bgColor: string }
  > = {
    running: {
      icon: Loader,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-900/20',
    },
    completed: {
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20',
    },
    failed: {
      icon: XCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-900/20',
    },
    pending: {
      icon: PlayCircle,
      color: 'text-gray-400',
      bgColor: 'bg-gray-900/20',
    },
  };

  const config = statusConfig[execution.status];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={`w-full p-3 rounded-lg border border-gray-800 ${config.bgColor} hover:bg-gray-800/50 transition-colors text-left`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className={`w-4 h-4 ${config.color} ${execution.status === 'running' ? 'animate-spin' : ''}`} />
          <span className="font-medium text-gray-200 text-sm">{execution.workflowName}</span>
        </div>
        {execution.duration && (
          <span className="text-xs text-gray-400 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {formatDuration(execution.duration)}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{formatTimestamp(execution.startTime)}</span>
        <span className="capitalize">{execution.trigger}</span>
      </div>

      {execution.error && (
        <div className="mt-2 text-xs text-red-400 truncate">{execution.error}</div>
      )}
    </button>
  );
};

// === Main Component ===

export const ExecutionTimelineComponent: React.FC<Props> = ({
  executions,
  onExecutionClick,
  groupBy = 'status',
  maxHeight,
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['running', 'completed']));

  const toggleGroup = (group: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(group)) {
      newExpanded.delete(group);
    } else {
      newExpanded.add(group);
    }
    setExpandedGroups(newExpanded);
  };

  // Group executions
  const grouped: Record<string, Execution[]> = {};

  if (groupBy === 'status') {
    executions.forEach((exec) => {
      if (!grouped[exec.status]) grouped[exec.status] = [];
      grouped[exec.status].push(exec);
    });
  } else if (groupBy === 'workflow') {
    executions.forEach((exec) => {
      if (!grouped[exec.workflowId]) grouped[exec.workflowId] = [];
      grouped[exec.workflowId].push(exec);
    });
  } else {
    grouped['all'] = executions;
  }

  const statusOrder: ExecutionStatus[] = ['running', 'pending', 'completed', 'failed'];
  const sortedGroups =
    groupBy === 'status' ? statusOrder.filter((status) => grouped[status]) : Object.keys(grouped);

  return (
    <div
      className="space-y-3"
      style={maxHeight ? { maxHeight: `${maxHeight}px`, overflowY: 'auto' } : undefined}
    >
      {sortedGroups.map((group) => {
        const groupExecutions = grouped[group] || [];
        const isExpanded = expandedGroups.has(group);

        return (
          <div key={group} className="space-y-2">
            {/* Group Header */}
            {groupBy !== 'none' && (
              <button
                onClick={() => toggleGroup(group)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <h3 className="text-sm font-semibold text-gray-200 capitalize">
                  {group} ({groupExecutions.length})
                </h3>
                <span className="text-gray-400">{isExpanded ? '−' : '+'}</span>
              </button>
            )}

            {/* Executions */}
            {isExpanded && (
              <div className="space-y-2">
                {groupExecutions.length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-4">No executions</div>
                )}
                {groupExecutions.map((execution) => (
                  <ExecutionItem
                    key={execution.id}
                    execution={execution}
                    onClick={() => onExecutionClick?.(execution)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {sortedGroups.length === 0 && (
        <div className="text-sm text-gray-500 text-center py-8">No executions found</div>
      )}
    </div>
  );
};

export default ExecutionTimelineComponent;
