import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Mail,
  MousePointerClick,
  UserCheck,
  Target,
  DollarSign,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { BarChart } from 'recharts/es6/chart/BarChart.js';
import { Bar } from 'recharts/es6/cartesian/Bar.js';
import { LineChart } from 'recharts/es6/chart/LineChart.js';
import { Line } from 'recharts/es6/cartesian/Line.js';
import { AreaChart } from 'recharts/es6/chart/AreaChart.js';
import { Area } from 'recharts/es6/cartesian/Area.js';
import { ComposedChart } from 'recharts/es6/chart/ComposedChart.js';
import { XAxis } from 'recharts/es6/cartesian/XAxis.js';
import { YAxis } from 'recharts/es6/cartesian/YAxis.js';
import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid.js';
import { Tooltip } from 'recharts/es6/component/Tooltip.js';
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer.js';
import { Legend } from 'recharts/es6/component/Legend.js';

export const AnalyticsTab = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Detailed performance data
  const performanceData = [
    {
      date: 'Dec 20',
      emails: 520,
      opened: 416,
      clicked: 125,
      replied: 46,
      meetings: 8,
      revenue: 12000,
    },
    {
      date: 'Dec 21',
      emails: 580,
      opened: 464,
      clicked: 139,
      replied: 52,
      meetings: 12,
      revenue: 18000,
    },
    {
      date: 'Dec 22',
      emails: 650,
      opened: 520,
      clicked: 156,
      replied: 58,
      meetings: 15,
      revenue: 22000,
    },
    {
      date: 'Dec 23',
      emails: 710,
      opened: 568,
      clicked: 170,
      replied: 64,
      meetings: 18,
      revenue: 28000,
    },
    {
      date: 'Dec 24',
      emails: 690,
      opened: 552,
      clicked: 166,
      replied: 62,
      meetings: 16,
      revenue: 24000,
    },
    {
      date: 'Dec 25',
      emails: 320,
      opened: 256,
      clicked: 77,
      replied: 29,
      meetings: 6,
      revenue: 9000,
    },
    {
      date: 'Dec 26',
      emails: 280,
      opened: 224,
      clicked: 67,
      replied: 25,
      meetings: 5,
      revenue: 8000,
    },
  ];

  // Engagement breakdown
  const engagementData = [
    { channel: 'Email', sent: 12453, opened: 9962, clicked: 2989, replied: 1046 },
    { channel: 'LinkedIn', sent: 3420, opened: 2736, clicked: 821, replied: 287 },
    { channel: 'SMS', sent: 1580, opened: 1422, clicked: 427, replied: 149 },
    { channel: 'Calls', sent: 456, opened: 365, clicked: 0, replied: 127 },
  ];

  // Time analysis
  const timeAnalysisData = [
    { hour: '8 AM', opens: 45, replies: 8 },
    { hour: '9 AM', opens: 82, replies: 15 },
    { hour: '10 AM', opens: 124, replies: 28 },
    { hour: '11 AM', opens: 96, replies: 19 },
    { hour: '12 PM', opens: 68, replies: 12 },
    { hour: '1 PM', opens: 54, replies: 9 },
    { hour: '2 PM', opens: 78, replies: 14 },
    { hour: '3 PM', opens: 92, replies: 18 },
    { hour: '4 PM', opens: 86, replies: 16 },
    { hour: '5 PM', opens: 62, replies: 11 },
  ];

  // Key metrics
  const metrics = [
    {
      label: 'Total Emails Sent',
      value: '12,453',
      change: '+12.5%',
      trend: 'up',
      icon: Mail,
      color: 'blue',
    },
    {
      label: 'Open Rate',
      value: '80.0%',
      change: '+3.2%',
      trend: 'up',
      icon: MousePointerClick,
      color: 'green',
    },
    {
      label: 'Reply Rate',
      value: '8.4%',
      change: '+1.8%',
      trend: 'up',
      icon: UserCheck,
      color: 'purple',
    },
    {
      label: 'Conversion Rate',
      value: '3.2%',
      change: '+0.4%',
      trend: 'up',
      icon: Target,
      color: 'orange',
    },
  ];

  const getColorByName = color => {
    const colors = {
      blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
      green: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
      purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
      orange: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Analytics Overview
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Deep dive into your performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
            {['7d', '30d', '90d'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <Card key={idx} className="dark:bg-slate-900/50 dark:backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${getColorByName(metric.color)}`}>
                  <metric.icon size={20} />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    metric.trend === 'up'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {metric.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {metric.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {metric.value}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Over Time Chart */}
      <Card className="dark:bg-slate-900/50 dark:backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp size={18} className="text-cyan-500" />
            Performance Trend - Last 7 Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={performanceData}>
              <defs>
                <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tick={{ fill: '#9ca3af' }} />
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
              <Line
                type="monotone"
                dataKey="replied"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Replies"
                dot={{ fill: '#8b5cf6', r: 4 }}
              />
              <Bar dataKey="meetings" fill="#ec4899" name="Meetings" radius={[8, 8, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Channel Performance */}
        <Card className="dark:bg-slate-900/50 dark:backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Channel Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={engagementData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                <YAxis
                  dataKey="channel"
                  type="category"
                  stroke="#9ca3af"
                  fontSize={12}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Bar dataKey="sent" fill="#06b6d4" name="Sent" radius={[0, 4, 4, 0]} />
                <Bar dataKey="opened" fill="#10b981" name="Opened" radius={[0, 4, 4, 0]} />
                <Bar dataKey="replied" fill="#8b5cf6" name="Replied" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Best Time to Send */}
        <Card className="dark:bg-slate-900/50 dark:backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Best Time to Send</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={timeAnalysisData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="hour" stroke="#9ca3af" fontSize={12} tick={{ fill: '#9ca3af' }} />
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
                <Line
                  type="monotone"
                  dataKey="opens"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  name="Opens"
                  dot={{ fill: '#06b6d4', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="replies"
                  stroke="#ec4899"
                  strokeWidth={2}
                  name="Replies"
                  dot={{ fill: '#ec4899', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights Summary */}
      <Card className="dark:bg-slate-900/50 dark:backdrop-blur-xl border-blue-200 dark:border-blue-500/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Target size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Insights</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <ArrowUpRight size={16} className="text-green-600 dark:text-green-400 mt-0.5" />
                  <span>
                    <strong>Peak Performance:</strong> Tuesday at 10 AM shows 3x higher reply rates
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <ArrowUpRight size={16} className="text-green-600 dark:text-green-400 mt-0.5" />
                  <span>
                    <strong>Best Channel:</strong> Email maintains 80% open rate, outperforming
                    other channels
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <ArrowUpRight size={16} className="text-green-600 dark:text-green-400 mt-0.5" />
                  <span>
                    <strong>Conversion Trend:</strong> Reply-to-meeting conversion improved by 15%
                    this week
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
