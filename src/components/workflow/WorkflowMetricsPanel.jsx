import React from 'react';
import PropTypes from 'prop-types';
import {
  TrendingUp,
  Users,
  Mail,
  MousePointer,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
} from 'lucide-react';

// Real-time workflow metrics display
const WorkflowMetricsPanel = ({
  nodes = [],
  edges = [],
  executionData = null,
  campaignStats = null,
}) => {
  // Calculate workflow complexity
  const complexity = nodes.length + edges.length;
  const complexityLevel = complexity < 5 ? 'Simple' : complexity < 10 ? 'Moderate' : 'Complex';

  // Mock stats if not provided
  const stats = campaignStats || {
    totalLeads: 1250,
    emailsSent: 890,
    openRate: 42.5,
    clickRate: 12.8,
    responseRate: 8.2,
    conversionRate: 3.5,
    avgTimeToResponse: '2.4 hours',
    activeNow: 156,
    completedToday: 78,
    pendingActions: 234,
  };

  // Calculate node type distribution
  const nodeTypes = nodes.reduce((acc, node) => {
    acc[node.type] = (acc[node.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Campaign Metrics</h3>
          </div>
          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            Live
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            label="Open Rate"
            value={`${stats.openRate}%`}
            change={+5.2}
            icon={Mail}
            color="blue"
          />
          <MetricCard
            label="Click Rate"
            value={`${stats.clickRate}%`}
            change={+2.1}
            icon={MousePointer}
            color="green"
          />
          <MetricCard
            label="Response Rate"
            value={`${stats.responseRate}%`}
            change={-0.8}
            icon={Users}
            color="purple"
          />
          <MetricCard
            label="Conversion"
            value={`${stats.conversionRate}%`}
            change={+1.4}
            icon={TrendingUp}
            color="emerald"
          />
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <Zap className="w-4 h-4" />
              <span className="text-lg font-bold">{stats.activeNow}</span>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Active</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-lg font-bold">{stats.completedToday}</span>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Completed</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
              <Clock className="w-4 h-4" />
              <span className="text-lg font-bold">{stats.pendingActions}</span>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Pending</span>
          </div>
        </div>

        {/* Workflow Composition */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Workflow Composition
          </h4>
          <div className="space-y-2">
            {Object.entries(nodeTypes).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <NodeTypeIndicator type={type} />
                  <span className="text-sm capitalize text-gray-700 dark:text-gray-300">
                    {type === 'abtest' ? 'A/B Test' : type}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Complexity Badge */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <span className="text-sm text-gray-600 dark:text-gray-400">Workflow Complexity</span>
          <span
            className={`text-sm font-medium px-2 py-0.5 rounded-full ${
              complexityLevel === 'Simple'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : complexityLevel === 'Moderate'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {complexityLevel}
          </span>
        </div>
      </div>
    </div>
  );
};

WorkflowMetricsPanel.propTypes = {
  nodes: PropTypes.array,
  edges: PropTypes.array,
  executionData: PropTypes.object,
  campaignStats: PropTypes.object,
};

// Individual metric card
const MetricCard = ({ label, value, change, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  };

  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className="flex items-center justify-between mb-1">
        <div className={`p-1.5 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center text-xs ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change >= 0 ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className="text-xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
};

MetricCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.number,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.oneOf(['blue', 'green', 'purple', 'emerald']).isRequired,
};

// Node type color indicator
const NodeTypeIndicator = ({ type }) => {
  const colors = {
    trigger: 'bg-green-500',
    email: 'bg-blue-500',
    linkedin: 'bg-blue-700',
    call: 'bg-emerald-500',
    sms: 'bg-purple-500',
    delay: 'bg-orange-500',
    condition: 'bg-pink-500',
    abtest: 'bg-indigo-500',
  };

  return <div className={`w-3 h-3 rounded-full ${colors[type] || 'bg-gray-500'}`} />;
};

NodeTypeIndicator.propTypes = {
  type: PropTypes.string.isRequired,
};

export default WorkflowMetricsPanel;
