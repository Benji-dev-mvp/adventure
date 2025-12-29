/**
 * Orchestration Page
 * 
 * Command center for the autonomous multi-agent system.
 * Visualizes agent activity, task flow, and system health.
 */

import React, { useMemo, useCallback, useState } from 'react';
import { NeuroCanvas } from '@/workflow/NeuroCanvas';
import { useLocalStorage, usePrevious } from '@/hooks/advancedHooks';

// === Types ===

interface AgentStatus {
  id: string;
  name: string;
  type: 'hunter' | 'scout' | 'writer' | 'closer' | 'revops';
  status: 'idle' | 'working' | 'waiting' | 'error';
  currentTask?: string;
  performance: {
    tasksCompleted: number;
    successRate: number;
    avgTime: number;
  };
}

interface SystemMetrics {
  activeAgents: number;
  tasksInQueue: number;
  tasksCompleted: number;
  avgLatency: number;
  errorRate: number;
  throughput: number;
}

type MetricChanges = Partial<Record<keyof SystemMetrics, number | undefined>>;

type TaskPriority = 'low' | 'medium' | 'high';
type TaskStatus = 'queued' | 'in_progress' | 'completed';

interface TaskItem {
  id: string;
  type: string;
  priority: TaskPriority;
  status: TaskStatus;
  latencyMs?: number;
}

const STORAGE_KEYS = {
  agents: 'artisan_orchestration_agents',
  tasks: 'artisan_orchestration_tasks',
};

const AGENT_TYPES: AgentStatus['type'][] = ['hunter', 'scout', 'writer', 'closer', 'revops'];

// === Components ===

const MetricCard: React.FC<{
  label: string;
  value: string | number;
  change?: number;
  unit?: string;
}> = ({ label, value, change, unit }) => (
  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
    <div className="text-gray-400 text-sm mb-1">{label}</div>
    <div className="text-2xl font-bold text-white">
      {value}
      {unit && <span className="text-sm text-gray-400 ml-1">{unit}</span>}
    </div>
    {change !== undefined && (
      <div className={`text-sm mt-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
      </div>
    )}
  </div>
);

const AgentCard: React.FC<{ agent: AgentStatus }> = ({ agent }) => {
  const statusColors = {
    idle: 'bg-gray-500',
    working: 'bg-green-500',
    waiting: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  const typeIcons = {
    hunter: '🎯',
    scout: '🔍',
    writer: '✍️',
    closer: '🤝',
    revops: '📊',
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-blue-500 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{typeIcons[agent.type]}</span>
          <div>
            <div className="font-semibold text-white">{agent.name}</div>
            <div className="text-sm text-gray-400 capitalize">{agent.type}</div>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${statusColors[agent.status]} animate-pulse`} />
      </div>
      
      {agent.currentTask && (
        <div className="text-sm text-gray-300 mb-3 p-2 bg-gray-700 rounded">
          {agent.currentTask}
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-lg font-bold text-white">{agent.performance.tasksCompleted}</div>
          <div className="text-xs text-gray-400">Tasks</div>
        </div>
        <div>
          <div className="text-lg font-bold text-green-400">
            {(agent.performance.successRate * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-400">Success</div>
        </div>
        <div>
          <div className="text-lg font-bold text-blue-400">{agent.performance.avgTime}s</div>
          <div className="text-xs text-gray-400">Avg Time</div>
        </div>
      </div>
    </div>
  );
};

const TaskQueue: React.FC<{ tasks: TaskItem[] }> = ({ tasks }) => (
  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
    <h3 className="text-lg font-semibold text-white mb-3">Task Queue</h3>
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {tasks.length === 0 ? (
        <div className="text-sm text-gray-400 bg-gray-900/40 rounded-lg p-3">
          No queued work. Add agents or ingest tasks to begin execution.
        </div>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-2 bg-gray-700 rounded text-sm"
          >
            <span className="text-gray-300">{task.type}</span>
            <span className={`px-2 py-0.5 rounded text-xs ${
              task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
              task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-gray-600 text-gray-400'
            }`}>
              {task.priority}
            </span>
          </div>
        ))
      )}
    </div>
  </div>
);

// === Main Page ===

export const OrchestrationPage: React.FC = () => {
  const [agents, setAgents] = useLocalStorage(STORAGE_KEYS.agents, [] as AgentStatus[]);
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.tasks, [] as TaskItem[]);
  const [showCanvas, setShowCanvas] = useState(true);
  const normalizedAgents = useMemo(
    () =>
      agents.map((agent) => ({
        ...agent,
        performance: agent.performance ?? {
          tasksCompleted: 0,
          successRate: 0,
          avgTime: 0,
        },
      })),
    [agents]
  );
  const normalizedTasks = useMemo(
    () =>
      tasks.map((task) => ({
        ...task,
        priority: task.priority ?? 'medium',
        status: task.status ?? 'queued',
      })),
    [tasks]
  );
  const metrics = useMemo<SystemMetrics>(() => {
    const activeAgents = normalizedAgents.filter((agent) => agent.status === 'working').length;
    const tasksCompleted = normalizedTasks.filter((task) => task.status === 'completed').length;
    const queuedTasks = normalizedTasks.filter((task) => task.status !== 'completed');
    const avgLatency = tasksCompleted
      ? Math.round(
          normalizedTasks.reduce((sum, task) => sum + (task.latencyMs ?? 0), 0) / tasksCompleted
        )
      : 0;
    const errorRate = normalizedAgents.length
      ? normalizedAgents.filter((agent) => agent.status === 'error').length / normalizedAgents.length
      : 0;
    const throughput = activeAgents ? tasksCompleted / activeAgents : 0;

    return {
      activeAgents,
      tasksInQueue: queuedTasks.length,
      tasksCompleted,
      avgLatency,
      errorRate,
      throughput,
    };
  }, [normalizedAgents, normalizedTasks]);

  const previousMetrics = usePrevious(metrics);
  const metricChange = useMemo<MetricChanges>(() => {
    if (!previousMetrics) return {};
    const delta = (current: number, previous: number) => {
      if (previous === 0) return undefined;
      return Math.round(((current - previous) / previous) * 100);
    };

    return {
      activeAgents: delta(metrics.activeAgents, previousMetrics.activeAgents),
      tasksInQueue: delta(metrics.tasksInQueue, previousMetrics.tasksInQueue),
      tasksCompleted: delta(metrics.tasksCompleted, previousMetrics.tasksCompleted),
      avgLatency: delta(metrics.avgLatency, previousMetrics.avgLatency),
      errorRate: delta(metrics.errorRate, previousMetrics.errorRate),
      throughput: delta(metrics.throughput, previousMetrics.throughput),
    };
  }, [metrics, previousMetrics]);

  const handleAddAgent = useCallback(() => {
    setAgents((prev) => {
      const nextType = AGENT_TYPES[prev.length % AGENT_TYPES.length];
      const nextAgent: AgentStatus = {
        id: `agent-${Date.now()}`,
        name: `Agent ${prev.length + 1}`,
        type: nextType,
        status: 'idle',
        performance: {
          tasksCompleted: 0,
          successRate: 0,
          avgTime: 0,
        },
      };

      return [...prev, nextAgent];
    });
  }, [setAgents]);

  const handlePauseAll = useCallback(() => {
    setAgents((prev) =>
      prev.map((agent) => ({
        ...agent,
        status: agent.status === 'error' ? agent.status : 'waiting',
      }))
    );
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        status: task.status === 'in_progress' ? 'queued' : task.status,
      }))
    );
  }, [setAgents, setTasks]);

  const handleRebalance = useCallback(() => {
    let activeSlots = 0;
    setAgents((prev) => {
      const hasQueuedTasks = normalizedTasks.some((task) => task.status === 'queued');
      const nextAgents = prev.map((agent, index) => ({
        ...agent,
        status: hasQueuedTasks && index % 2 === 0 ? 'working' : 'idle',
      }));
      activeSlots = nextAgents.filter((agent) => agent.status === 'working').length;
      return nextAgents;
    });
    setTasks((prev) => {
      return prev.map((task) => {
        if (task.status !== 'queued') return task;
        if (activeSlots <= 0) return task;
        activeSlots -= 1;
        return { ...task, status: 'in_progress' };
      });
    });
  }, [setAgents, setTasks, normalizedTasks]);

  const queuedTasks = useMemo(
    () => normalizedTasks.filter((task) => task.status !== 'completed'),
    [normalizedTasks]
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Agent Orchestration</h1>
          <p className="text-gray-400">Autonomous multi-agent command center</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowCanvas(!showCanvas)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {showCanvas ? 'Hide' : 'Show'} Neural Canvas
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-600/20 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400">System Online</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <MetricCard label="Active Agents" value={metrics.activeAgents} change={metricChange.activeAgents} />
        <MetricCard label="Tasks in Queue" value={metrics.tasksInQueue} change={metricChange.tasksInQueue} />
        <MetricCard label="Tasks Completed" value={metrics.tasksCompleted} change={metricChange.tasksCompleted} />
        <MetricCard label="Avg Latency" value={metrics.avgLatency} unit="ms" />
        <MetricCard
          label="Error Rate"
          value={`${(metrics.errorRate * 100).toFixed(1)}%`}
          change={metricChange.errorRate}
        />
        <MetricCard
          label="Throughput"
          value={metrics.throughput.toFixed(1)}
          unit="/min"
          change={metricChange.throughput}
        />
      </div>

      {/* Neural Canvas */}
      {showCanvas && (
        <div className="mb-6 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-3 border-b border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold">Neural Activity Graph</h3>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" /> Active
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" /> Waiting
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full" /> Completed
              </span>
            </div>
          </div>
          <NeuroCanvas width={1200} height={400} />
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-4 gap-6">
        {/* Agent Cards */}
        <div className="col-span-3">
          <h3 className="text-lg font-semibold mb-4">Agent Fleet</h3>
          <div className="grid grid-cols-3 gap-4">
            {normalizedAgents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        {/* Task Queue */}
        <div>
          <TaskQueue tasks={queuedTasks} />
          
          {/* Quick Actions */}
          <div className="mt-4 bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={handleAddAgent}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
              >
                + Add New Agent
              </button>
              <button
                onClick={handlePauseAll}
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
              >
                Pause All Tasks
              </button>
              <button
                onClick={handleRebalance}
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
              >
                Rebalance Workload
              </button>
              <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm">
                View Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrchestrationPage;
