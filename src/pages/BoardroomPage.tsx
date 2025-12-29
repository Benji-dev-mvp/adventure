/**
 * Boardroom Page
 *
 * Executive-level strategic command center.
 * Real-time org health, projections, and strategic recommendations.
 */

import React, { useState } from 'react';

// === Types ===

interface ExecutiveMetric {
  name: string;
  value: string;
  change: number;
  changeLabel: string;
  target: string;
  status: 'on-track' | 'at-risk' | 'behind';
}

interface StrategicRecommendation {
  id: string;
  priority: 'critical' | 'high' | 'medium';
  title: string;
  impact: string;
  effort: string;
  roi: number;
  description: string;
}

interface TeamHealth {
  name: string;
  performance: number;
  capacity: number;
  morale: number;
  trend: 'up' | 'down' | 'stable';
}

interface RevenueProjection {
  month: string;
  projected: number;
  actual?: number;
  lower: number;
  upper: number;
}

// === Mock Data ===

const EXECUTIVE_METRICS: ExecutiveMetric[] = [
  {
    name: 'ARR',
    value: '$4.2M',
    change: 12,
    changeLabel: 'vs last Q',
    target: '$5M',
    status: 'on-track',
  },
  {
    name: 'Pipeline',
    value: '$8.7M',
    change: -5,
    changeLabel: 'vs target',
    target: '$9M',
    status: 'at-risk',
  },
  {
    name: 'Win Rate',
    value: '28%',
    change: 3,
    changeLabel: 'vs last Q',
    target: '30%',
    status: 'on-track',
  },
  {
    name: 'CAC Payback',
    value: '14mo',
    change: -2,
    changeLabel: 'vs last Q',
    target: '12mo',
    status: 'behind',
  },
  {
    name: 'NRR',
    value: '118%',
    change: 5,
    changeLabel: 'vs last Q',
    target: '115%',
    status: 'on-track',
  },
  {
    name: 'Rep Quota Attainment',
    value: '72%',
    change: 8,
    changeLabel: 'vs last Q',
    target: '80%',
    status: 'at-risk',
  },
];

const RECOMMENDATIONS: StrategicRecommendation[] = [
  {
    id: '1',
    priority: 'critical',
    title: 'Activate Dormant Pipeline',
    impact: '+$1.2M pipeline',
    effort: '2 weeks',
    roi: 340,
    description:
      'AI identified 47 stalled deals with recent engagement signals. Re-sequence with personalized outreach.',
  },
  {
    id: '2',
    priority: 'high',
    title: 'Optimize Territory Allocation',
    impact: '+15% rep productivity',
    effort: '1 week',
    roi: 280,
    description:
      'Current territory distribution is suboptimal. Redistribution based on ICP density and rep performance.',
  },
  {
    id: '3',
    priority: 'high',
    title: 'Implement Speed-to-Lead',
    impact: '+22% conversion',
    effort: '3 days',
    roi: 450,
    description: 'Response time averaging 4.2 hours. Enable auto-routing to hit &lt;5 minute SLA.',
  },
  {
    id: '4',
    priority: 'medium',
    title: 'Launch Multi-Threading Campaign',
    impact: '+18% deal velocity',
    effort: '2 weeks',
    roi: 180,
    description: 'Single-threaded deals at 67%. Multi-threading templates ready for deployment.',
  },
];

const TEAM_HEALTH: TeamHealth[] = [
  { name: 'Enterprise', performance: 0.92, capacity: 0.78, morale: 0.85, trend: 'up' },
  { name: 'Mid-Market', performance: 0.75, capacity: 0.95, morale: 0.72, trend: 'stable' },
  { name: 'SMB', performance: 0.68, capacity: 0.88, morale: 0.65, trend: 'down' },
  { name: 'SDR Team', performance: 0.82, capacity: 0.92, morale: 0.78, trend: 'up' },
  { name: 'Customer Success', performance: 0.88, capacity: 0.7, morale: 0.9, trend: 'stable' },
];

const REVENUE_PROJECTIONS: RevenueProjection[] = [
  { month: 'Jan', projected: 320000, actual: 315000, lower: 290000, upper: 350000 },
  { month: 'Feb', projected: 345000, actual: 358000, lower: 310000, upper: 380000 },
  { month: 'Mar', projected: 380000, actual: 375000, lower: 340000, upper: 420000 },
  { month: 'Apr', projected: 420000, actual: 445000, lower: 380000, upper: 460000 },
  { month: 'May', projected: 465000, lower: 420000, upper: 510000 },
  { month: 'Jun', projected: 510000, lower: 460000, upper: 560000 },
];

// === Components ===

const MetricCard: React.FC<{ metric: ExecutiveMetric }> = ({ metric }) => {
  const statusColors = {
    'on-track': 'border-green-500 bg-green-500/10',
    'at-risk': 'border-yellow-500 bg-yellow-500/10',
    behind: 'border-red-500 bg-red-500/10',
  };

  const statusLabels = {
    'on-track': 'On Track',
    'at-risk': 'At Risk',
    behind: 'Behind',
  };

  return (
    <div className={`rounded-xl p-5 border-2 ${statusColors[metric.status]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm font-medium">{metric.name}</span>
        <span
          className={`text-xs px-2 py-0.5 rounded ${
            metric.status === 'on-track'
              ? 'bg-green-500 text-white'
              : metric.status === 'at-risk'
                ? 'bg-yellow-500 text-black'
                : 'bg-red-500 text-white'
          }`}
        >
          {statusLabels[metric.status]}
        </span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
      <div className="flex items-center justify-between text-sm">
        <span className={metric.change >= 0 ? 'text-green-400' : 'text-red-400'}>
          {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}% {metric.changeLabel}
        </span>
        <span className="text-gray-500">Target: {metric.target}</span>
      </div>
    </div>
  );
};

const RecommendationCard: React.FC<{
  rec: StrategicRecommendation;
  onExecute: () => void;
  isExecuting?: boolean;
}> = ({ rec, onExecute, isExecuting }) => {
  const priorityColors = {
    critical: 'border-red-500 bg-red-500/10',
    high: 'border-orange-500 bg-orange-500/10',
    medium: 'border-blue-500 bg-blue-500/10',
  };

  const priorityBadges = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-blue-500',
  };

  return (
    <div className={`rounded-xl p-5 border ${priorityColors[rec.priority]}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs px-2 py-1 rounded text-white ${priorityBadges[rec.priority]}`}>
          {rec.priority.toUpperCase()}
        </span>
        <div className="text-green-400 font-medium">{rec.roi}% ROI</div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{rec.title}</h3>
      <p className="text-gray-400 text-sm mb-4">{rec.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex gap-4 text-sm">
          <span className="text-gray-500">
            Impact: <span className="text-green-400">{rec.impact}</span>
          </span>
          <span className="text-gray-500">
            Effort: <span className="text-blue-400">{rec.effort}</span>
          </span>
        </div>
        <button
          onClick={onExecute}
          disabled={isExecuting}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isExecuting ? 'bg-gray-600 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isExecuting ? 'Executing...' : 'Execute'}
        </button>
      </div>
    </div>
  );
};

const TeamHealthRow: React.FC<{ team: TeamHealth }> = ({ team }) => {
  const HealthBar: React.FC<{ value: number; color: string }> = ({ value, color }) => (
    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${value * 100}%` }} />
    </div>
  );

  return (
    <tr className="border-b border-gray-700">
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">{team.name}</span>
          {team.trend === 'up' && <span className="text-green-400 text-sm">↑</span>}
          {team.trend === 'down' && <span className="text-red-400 text-sm">↓</span>}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <HealthBar value={team.performance} color="bg-green-500" />
          <span className="text-sm text-gray-400">{(team.performance * 100).toFixed(0)}%</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <HealthBar
            value={team.capacity}
            color={team.capacity > 0.9 ? 'bg-red-500' : 'bg-blue-500'}
          />
          <span className="text-sm text-gray-400">{(team.capacity * 100).toFixed(0)}%</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <HealthBar
            value={team.morale}
            color={team.morale > 0.7 ? 'bg-green-500' : 'bg-yellow-500'}
          />
          <span className="text-sm text-gray-400">{(team.morale * 100).toFixed(0)}%</span>
        </div>
      </td>
    </tr>
  );
};

const RevenueChart: React.FC<{ data: RevenueProjection[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.upper));
  const height = 200;
  const width = 600;
  const padding = 40;
  const barWidth = (width - padding * 2) / data.length - 10;

  return (
    <svg width={width} height={height + 40} className="mx-auto">
      {/* Y-axis grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
        const y = height - tick * height;
        return (
          <g key={i}>
            <line
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#374151"
              strokeWidth="1"
            />
            <text x={padding - 5} y={y + 4} fontSize="10" fill="#6B7280" textAnchor="end">
              ${Math.round((tick * maxValue) / 1000)}k
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const x = padding + i * (barWidth + 10);
        const projectedHeight = (d.projected / maxValue) * height;
        const actualHeight = d.actual ? (d.actual / maxValue) * height : 0;

        return (
          <g key={i}>
            {/* Projection bar */}
            <rect
              x={x}
              y={height - projectedHeight}
              width={barWidth}
              height={projectedHeight}
              fill="#3B82F6"
              opacity={0.5}
              rx={4}
            />

            {/* Actual bar (if exists) */}
            {d.actual && (
              <rect
                x={x + 5}
                y={height - actualHeight}
                width={barWidth - 10}
                height={actualHeight}
                fill="#10B981"
                rx={4}
              />
            )}

            {/* Month label */}
            <text
              x={x + barWidth / 2}
              y={height + 20}
              fontSize="12"
              fill="#9CA3AF"
              textAnchor="middle"
            >
              {d.month}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform={`translate(${width - 120}, 10)`}>
        <rect x="0" y="0" width="12" height="12" fill="#3B82F6" opacity="0.5" rx="2" />
        <text x="18" y="10" fontSize="10" fill="#9CA3AF">
          Projected
        </text>
        <rect x="0" y="18" width="12" height="12" fill="#10B981" rx="2" />
        <text x="18" y="28" fontSize="10" fill="#9CA3AF">
          Actual
        </text>
      </g>
    </svg>
  );
};

// === Main Page ===

export const BoardroomPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState('quarter');
  const [executing, setExecuting] = useState<string | null>(null);

  const handleExecute = (recId: string) => {
    setExecuting(recId);
    // Simulate execution
    setTimeout(() => setExecuting(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Boardroom</h1>
          <p className="text-gray-400">Executive Command Center • Q2 2024</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-800 rounded-lg p-1">
            {['week', 'month', 'quarter', 'year'].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeframe === tf ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tf.charAt(0).toUpperCase() + tf.slice(1)}
              </button>
            ))}
          </div>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm">
            Export Report
          </button>
        </div>
      </div>

      {/* Executive Metrics */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {EXECUTIVE_METRICS.map((metric, i) => (
          <MetricCard key={i} metric={metric} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Revenue Projection */}
        <div className="col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Revenue Trajectory</h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Confidence:</span>
              <span className="text-green-400">85%</span>
            </div>
          </div>
          <RevenueChart data={REVENUE_PROJECTIONS} />
          <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">$2.8M</div>
              <div className="text-sm text-gray-400">Projected Q2</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">$1.49M</div>
              <div className="text-sm text-gray-400">Closed YTD</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">94%</div>
              <div className="text-sm text-gray-400">vs Target</div>
            </div>
          </div>
        </div>

        {/* Org Pulse */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Org Pulse</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
              <span className="text-gray-300">Overall Health</span>
              <span className="text-2xl font-bold text-green-400">82%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <span className="text-gray-300">Team Morale</span>
              <span className="text-xl font-bold text-white">76%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <span className="text-gray-300">Capacity Utilization</span>
              <span className="text-xl font-bold text-yellow-400">87%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <span className="text-gray-300">Predicted Churn Risk</span>
              <span className="text-xl font-bold text-green-400">Low</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Strategic Recommendations</h2>
          <span className="text-sm text-gray-400">AI-generated based on current data</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {RECOMMENDATIONS.map(rec => (
            <RecommendationCard
              key={rec.id}
              rec={rec}
              onExecute={() => handleExecute(rec.id)}
              isExecuting={executing === rec.id}
            />
          ))}
        </div>
      </div>

      {/* Team Health Table */}
      <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Team Health Matrix</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 text-left text-sm text-gray-400">
              <th className="py-3 px-4">Team</th>
              <th className="py-3 px-4">Performance</th>
              <th className="py-3 px-4">Capacity</th>
              <th className="py-3 px-4">Morale</th>
            </tr>
          </thead>
          <tbody>
            {TEAM_HEALTH.map((team, i) => (
              <TeamHealthRow key={i} team={team} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Live Feed */}
      <div className="mt-6 bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Live Activity Feed</h3>
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {[
            { event: 'Deal closed', value: '$45K', time: '2m ago', type: 'success' },
            { event: 'Meeting booked', value: 'Enterprise', time: '5m ago', type: 'info' },
            { event: 'Quota hit', value: 'Sarah M.', time: '12m ago', type: 'success' },
            { event: 'Pipeline risk', value: 'TechCorp', time: '18m ago', type: 'warning' },
            { event: 'New lead', value: 'ICP Match', time: '22m ago', type: 'info' },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex-shrink-0 px-4 py-2 rounded-lg ${
                item.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/30'
                  : item.type === 'warning'
                    ? 'bg-yellow-500/10 border border-yellow-500/30'
                    : 'bg-blue-500/10 border border-blue-500/30'
              }`}
            >
              <div className="text-sm font-medium text-white">{item.event}</div>
              <div className="text-xs text-gray-400">
                {item.value} • {item.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardroomPage;
