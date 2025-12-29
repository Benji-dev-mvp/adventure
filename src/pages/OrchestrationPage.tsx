/**
 * Orchestration Page
 *
 * Command center for the autonomous multi-agent system.
 * Visualizes agent activity, task flow, and system health.
 */

import React, { useState, useEffect } from 'react';
import { NeuroCanvas } from '@/workflow/NeuroCanvas';

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

// === Mock Data ===

const MOCK_AGENTS: AgentStatus[] = [
  {
    id: 'agent-1',
    name: 'Hunter Alpha',
    type: 'hunter',
    status: 'working',
    currentTask: 'Discovering accounts in FinTech vertical',
    performance: { tasksCompleted: 145, successRate: 0.92, avgTime: 2.3 },
  },
  {
    id: 'agent-2',
    name: 'Scout Prime',
    type: 'scout',
    status: 'working',
    currentTask: 'Researching Stripe decision makers',
    performance: { tasksCompleted: 312, successRate: 0.88, avgTime: 4.1 },
  },
  {
    id: 'agent-3',
    name: 'Writer One',
    type: 'writer',
    status: 'idle',
    performance: { tasksCompleted: 890, successRate: 0.85, avgTime: 1.2 },
  },
  {
    id: 'agent-4',
    name: 'Closer Beta',
    type: 'closer',
    status: 'working',
    currentTask: 'Handling objection from Acme Corp',
    performance: { tasksCompleted: 67, successRate: 0.78, avgTime: 8.5 },
  },
  {
    id: 'agent-5',
    name: 'RevOps Core',
    type: 'revops',
    status: 'waiting',
    currentTask: 'Awaiting pipeline data refresh',
    performance: { tasksCompleted: 23, successRate: 0.95, avgTime: 12.3 },
  },
];

const INITIAL_METRICS: SystemMetrics = {
  activeAgents: 4,
  tasksInQueue: 127,
  tasksCompleted: 1437,
  avgLatency: 245,
  errorRate: 0.02,
  throughput: 42,
};

// === Components ===

const MetricCard: React.FC<{
  label: string;
  value: string | number;
  change?: number;
  unit?: string;
}> = ({ label, value, change, unit }) => (
  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
    <div className="text-gray-400 text-sm mb-1">{label}</div>
    <div className="text-lg font-bold text-white">
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
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-lg">{typeIcons[agent.type]}</span>
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

const TaskQueue: React.FC<{ tasks: Array<{ id: string; type: string; priority: string }> }> = ({
  tasks,
}) => (
  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
    <h3 className="text-lg font-semibold text-white mb-3">Task Queue</h3>
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {tasks.map(task => (
        <div
          key={task.id}
          className="flex items-center justify-between p-2 bg-gray-700 rounded text-sm"
        >
          <span className="text-gray-300">{task.type}</span>
          <span
            className={`px-2 py-0.5 rounded text-xs ${
              task.priority === 'high'
                ? 'bg-red-500/20 text-red-400'
                : task.priority === 'medium'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-gray-600 text-gray-400'
            }`}
          >
            {task.priority}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// === Main Page ===

export const OrchestrationPage: React.FC = () => {
  const [agents, setAgents] = useState<AgentStatus[]>(MOCK_AGENTS || []);
  const [metrics, setMetrics] = useState<SystemMetrics>(
    INITIAL_METRICS || {
      activeAgents: 0,
      tasksInQueue: 0,
      tasksCompleted: 0,
      avgLatency: 0,
      errorRate: 0,
      throughput: 0,
    }
  );
  const [showCanvas, setShowCanvas] = useState(true);

  // Validate state
  const safeAgents = Array.isArray(agents) ? agents : [];
  const safeMetrics = metrics || {
    activeAgents: 0,
    tasksInQueue: 0,
    tasksCompleted: 0,
    avgLatency: 0,
    errorRate: 0,
    throughput: 0,
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const safePrev = prev || INITIAL_METRICS;
        return {
          ...safePrev,
          tasksCompleted: (safePrev.tasksCompleted || 0) + Math.floor(Math.random() * 3),
          tasksInQueue: Math.max(
            0,
            (safePrev.tasksInQueue || 0) + Math.floor(Math.random() * 5) - 2
          ),
          throughput: (safePrev.throughput || 0) + (Math.random() - 0.5) * 5,
        };
      });

      // Update agent statuses
      setAgents(prev => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return safePrev.map(agent => ({
          ...agent,
          status: Math.random() > 0.7 ? 'working' : agent.status || 'idle',
        }));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const mockTasks = [
    { id: '1', type: 'Prospect Research', priority: 'high' },
    { id: '2', type: 'Email Generation', priority: 'high' },
    { id: '3', type: 'Data Enrichment', priority: 'medium' },
    { id: '4', type: 'Sequence Optimization', priority: 'medium' },
    { id: '5', type: 'Reply Analysis', priority: 'low' },
    { id: '6', type: 'Meeting Scheduling', priority: 'high' },
    { id: '7', type: 'ICP Scoring', priority: 'medium' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold">Agent Orchestration</h1>
          <p className="text-gray-400">Autonomous multi-agent command center</p>
        </div>
        <div className="flex items-center gap-3">
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
      <div className="grid grid-cols-6 gap-3 mb-6">
        <MetricCard label="Active Agents" value={safeMetrics.activeAgents || 0} change={5} />
        <MetricCard label="Tasks in Queue" value={safeMetrics.tasksInQueue || 0} />
        <MetricCard label="Tasks Completed" value={safeMetrics.tasksCompleted || 0} change={12} />
        <MetricCard label="Avg Latency" value={safeMetrics.avgLatency || 0} unit="ms" />
        <MetricCard
          label="Error Rate"
          value={`${((safeMetrics.errorRate || 0) * 100).toFixed(1)}%`}
          change={-15}
        />
        <MetricCard
          label="Throughput"
          value={(safeMetrics.throughput || 0).toFixed(1)}
          unit="/min"
          change={8}
        />
      </div>

      {/* Neural Canvas */}
      {showCanvas && (
        <div className="mb-6 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="p-3 border-b border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold">Neural Activity Graph</h3>
            <div className="flex items-center gap-3 text-sm text-gray-400">
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
          {typeof NeuroCanvas !== 'undefined' && <NeuroCanvas width={1200} height={400} />}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-4 gap-3">
        {/* Agent Cards */}
        <div className="col-span-3">
          <h3 className="text-lg font-semibold mb-4">Agent Fleet</h3>
          <div className="grid grid-cols-3 gap-3">
            {safeAgents.length > 0 ? (
              safeAgents.map(agent => {
                if (!agent || !agent.id) return null;
                return <AgentCard key={agent.id} agent={agent} />;
              })
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-400">No agents available</div>
            )}
          </div>
        </div>

        {/* Task Queue */}
        <div>
          <TaskQueue tasks={mockTasks || []} />

          {/* Quick Actions */}
          <div className="mt-4 bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm">
                + Add New Agent
              </button>
              <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm">
                Pause All Tasks
              </button>
              <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm">
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
