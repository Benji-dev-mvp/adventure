import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { TrendingUp, TrendingDown, Activity, DollarSign, Target, Zap } from 'lucide-react';
import { AreaChart } from 'recharts/es6/chart/AreaChart.js';
import { Area } from 'recharts/es6/cartesian/Area.js';
import { BarChart } from 'recharts/es6/chart/BarChart.js';
import { Bar } from 'recharts/es6/cartesian/Bar.js';
import { ComposedChart } from 'recharts/es6/chart/ComposedChart.js';
import { XAxis } from 'recharts/es6/cartesian/XAxis.js';
import { YAxis } from 'recharts/es6/cartesian/YAxis.js';
import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid.js';
import { Tooltip } from 'recharts/es6/component/Tooltip.js';
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer.js';
import { Legend } from 'recharts/es6/component/Legend.js';
import { PieChart } from 'recharts/es6/chart/PieChart.js';
import { Pie } from 'recharts/es6/polar/Pie.js';
import { Cell } from 'recharts/es6/component/Cell.js';

// Advanced Metric Card with Trend Analysis
export const AdvancedMetricCard = ({
  title,
  value,
  change,
  changeType = 'increase',
  icon: Icon,
  gradient,
  sparklineData = [],
  subtitle,
  target,
  targetLabel = 'Target',
}) => {
  const gradients = {
    blue: 'from-blue-500 via-blue-600 to-indigo-700',
    green: 'from-emerald-500 via-green-600 to-teal-700',
    purple: 'from-purple-500 via-purple-600 to-fuchsia-700',
    orange: 'from-orange-500 via-amber-600 to-yellow-700',
    pink: 'from-pink-500 via-rose-600 to-red-700',
    cyan: 'from-cyan-500 via-sky-600 to-blue-700',
  };

  const bgGradient = gradients[gradient] || gradients.blue;
  const isPositive = changeType === 'increase';

  return (
    <Card
      className={`relative overflow-hidden bg-gradient-to-br ${bgGradient} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {Icon && <Icon size={20} className="opacity-90" />}
              <p className="text-sm font-medium opacity-90">{title}</p>
            </div>
            <div className="flex items-baseline gap-3">
              <h3 className="text-4xl font-bold tracking-tight">{value}</h3>
              {change && (
                <span
                  className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full ${
                    isPositive ? 'bg-white/20 text-white' : 'bg-black/20 text-white'
                  }`}
                >
                  {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {change}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs opacity-75 mt-2">{subtitle}</p>}
          </div>
        </div>

        {/* Sparkline */}
        {sparklineData.length > 0 && (
          <div className="h-9 -mx-2 -mb-2 opacity-40 group-hover:opacity-60 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id={`sparkline-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#ffffff"
                  strokeWidth={2}
                  fill={`url(#sparkline-${title})`}
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Target Progress */}
        {target && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="flex items-center justify-between text-xs opacity-90 mb-1">
              <span>{targetLabel}</span>
              <span className="font-semibold">
                {Math.round(
                  (Number.parseFloat(value.toString().replace(/[^0-9.]/g, '')) / target) * 100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-1.5">
              <div
                className="bg-white rounded-full h-1.5 transition-all duration-500"
                style={{
                  width: `${Math.min((Number.parseFloat(value.toString().replace(/[^0-9.]/g, '')) / target) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </CardContent>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12"></div>
    </Card>
  );
};

AdvancedMetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.string,
  changeType: PropTypes.oneOf(['increase', 'decrease']),
  icon: PropTypes.elementType,
  gradient: PropTypes.oneOf(['blue', 'green', 'purple', 'orange', 'pink', 'cyan']),
  sparklineData: PropTypes.array,
  subtitle: PropTypes.string,
  target: PropTypes.number,
  targetLabel: PropTypes.string,
};

// Real-time Activity Stream
export const RealTimeActivityStream = ({ activities = [] }) => {
  const getActivityIcon = type => {
    switch (type) {
      case 'email':
        return '📧';
      case 'meeting':
        return '📅';
      case 'call':
        return '📞';
      case 'linkedin':
        return '💼';
      case 'reply':
        return '💬';
      default:
        return '✨';
    }
  };

  const getActivityColor = type => {
    switch (type) {
      case 'email':
        return 'blue';
      case 'meeting':
        return 'green';
      case 'call':
        return 'purple';
      case 'linkedin':
        return 'cyan';
      case 'reply':
        return 'pink';
      default:
        return 'gray';
    }
  };

  return (
    <Card className="dark:bg-slate-900/50 dark:backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity size={18} className="text-cyan-500" />
          Recent Activity
          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
            Latest lead interactions
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.slice(0, 8).map((activity, idx) => {
            const color = getActivityColor(activity.type);
            return (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group"
              >
                <div className="flex-shrink-0">
                  <div
                    className={`w-10 h-9 rounded-full bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center text-lg`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      {activity.lead}
                    </p>
                    {activity.isHot && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                        🔥 Hot
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {activity.action} {activity.company && `• ${activity.company}`}
                  </p>
                </div>
                <div className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {activity.time}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

RealTimeActivityStream.propTypes = {
  activities: PropTypes.array,
};

// Advanced Performance Chart with Multiple Metrics
export const AdvancedPerformanceChart = ({ data = [], title = 'Performance Overview' }) => {
  const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b'];

  return (
    <Card className="dark:bg-slate-900/50 dark:backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart size={18} className="text-cyan-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorReplies" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tick={{ fill: '#9ca3af' }} />
            <YAxis stroke="#9ca3af" fontSize={12} tick={{ fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="emails"
              fill="url(#colorEmails)"
              stroke="#06b6d4"
              strokeWidth={2}
              name="Emails Sent"
            />
            <Area
              type="monotone"
              dataKey="replies"
              fill="url(#colorReplies)"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Replies"
            />
            <Bar dataKey="meetings" fill="#ec4899" name="Meetings" radius={[8, 8, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

AdvancedPerformanceChart.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string,
};

// Conversion Funnel Visualization
export const ConversionFunnel = ({ data = [] }) => {
  return (
    <Card className="dark:bg-slate-900/50 dark:backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target size={18} className="text-cyan-500" />
          Conversion Funnel
          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">This week</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((stage, idx) => {
            const widthPercent = (stage.count / data[0].count) * 100;
            const conversionRate =
              idx > 0 ? ((stage.count / data[idx - 1].count) * 100).toFixed(1) : 100;

            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">{stage.stage}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 dark:text-gray-400">
                      {stage.count.toLocaleString()}
                    </span>
                    {idx > 0 && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                        {conversionRate}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative h-9 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-purple-600 transition-all duration-500 flex items-center justify-center"
                    style={{ width: `${widthPercent}%` }}
                  >
                    <span className="text-white font-semibold text-sm">{stage.percentage}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

ConversionFunnel.propTypes = {
  data: PropTypes.array,
};

// AI Insights Card with Recommendations
export const AIInsightsCard = ({ insights = [] }) => {
  const impactColors = {
    'High Impact': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    'Medium Impact': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    'Low Impact': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  };

  return (
    <Card className="dark:bg-slate-900/50 dark:backdrop-blur-xl border-purple-200 dark:border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap size={18} className="text-purple-500" />
          AI-Powered Insights
          <span className="ml-auto">
            <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-full font-semibold">
              Powered by GPT-4
            </span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-200 dark:border-purple-500/20 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">{insight.title}</h4>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-semibold ${impactColors[insight.impact]}`}
                >
                  {insight.impact}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{insight.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    Confidence:{' '}
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      {Math.round(insight.confidence * 100)}%
                    </span>
                  </div>
                </div>
                <button className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                  {insight.action} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

AIInsightsCard.propTypes = {
  insights: PropTypes.array,
};

// Revenue Pipeline Visualization
export const RevenuePipelineChart = ({ data = [] }) => {
  const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <Card className="dark:bg-slate-900/50 dark:backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign size={18} className="text-green-500" />
          Revenue Pipeline
          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">Q4 2025</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {data.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  ${item.value.toLocaleString()}
                </span>
              </div>
            ))}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Total Pipeline
                </span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  ${data.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

RevenuePipelineChart.propTypes = {
  data: PropTypes.array,
};

export default {
  AdvancedMetricCard,
  RealTimeActivityStream,
  AdvancedPerformanceChart,
  ConversionFunnel,
  AIInsightsCard,
  RevenuePipelineChart,
};
