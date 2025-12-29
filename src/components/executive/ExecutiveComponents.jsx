// Executive Command Center - CEO Dashboard, Pipeline Health, Forecast Tracker, What-If Scenarios
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  TrendingUp,
  Activity,
  DollarSign,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Zap,
} from 'lucide-react';
import { LineChart } from 'recharts/es6/chart/LineChart.js';
import { Line } from 'recharts/es6/cartesian/Line.js';
import { BarChart } from 'recharts/es6/chart/BarChart.js';
import { Bar } from 'recharts/es6/cartesian/Bar.js';
import { AreaChart } from 'recharts/es6/chart/AreaChart.js';
import { Area } from 'recharts/es6/cartesian/Area.js';
import { PieChart } from 'recharts/es6/chart/PieChart.js';
import { Pie } from 'recharts/es6/polar/Pie.js';
import { Cell } from 'recharts/es6/component/Cell.js';
import { XAxis } from 'recharts/es6/cartesian/XAxis.js';
import { YAxis } from 'recharts/es6/cartesian/YAxis.js';
import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid.js';
import { Tooltip } from 'recharts/es6/component/Tooltip.js';
import { Legend } from 'recharts/es6/component/Legend.js';
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer.js';

// CEO EXECUTIVE DASHBOARD
export const CEOExecutiveDashboard = () => {
  const [timeframe, setTimeframe] = useState('month');

  const metrics = {
    arr: { value: 2400000, change: 18, trend: 'up' },
    mrr: { value: 205000, change: 12, trend: 'up' },
    pipeline: { value: 5800000, change: 24, trend: 'up' },
    pipelineHealth: 87,
    customers: { value: 248, change: 15, trend: 'up' },
    churn: { value: 2.1, change: -0.4, trend: 'down' },
    cac: { value: 450, change: -12, trend: 'down' },
    ltv: { value: 12500, change: 8, trend: 'up' },
    winRate: { value: 24, change: 3, trend: 'up' },
    avgDealSize: { value: 15000, change: 5, trend: 'up' },
  };

  const revenueData = [
    { month: 'Jul', arr: 1800, mrr: 158 },
    { month: 'Aug', arr: 1950, mrr: 168 },
    { month: 'Sep', arr: 2100, mrr: 182 },
    { month: 'Oct', arr: 2250, mrr: 195 },
    { month: 'Nov', arr: 2350, mrr: 202 },
    { month: 'Dec', arr: 2400, mrr: 205 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="text-primary-500" size={20} />
            <CardTitle>Executive Command Center</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={timeframe === 'week' ? 'default' : 'outline'}
              onClick={() => setTimeframe('week')}
            >
              Week
            </Button>
            <Button
              size="sm"
              variant={timeframe === 'month' ? 'default' : 'outline'}
              onClick={() => setTimeframe('month')}
            >
              Month
            </Button>
            <Button
              size="sm"
              variant={timeframe === 'quarter' ? 'default' : 'outline'}
              onClick={() => setTimeframe('quarter')}
            >
              Quarter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Top KPIs */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg text-white">
            <p className="text-sm opacity-90">Annual Recurring Revenue</p>
            <p className="text-lg font-bold mt-1">${(metrics.arr.value / 1000000).toFixed(1)}M</p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <TrendingUp size={14} />
              <span>+{metrics.arr.change}%</span>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg text-white">
            <p className="text-sm opacity-90">Monthly Recurring Revenue</p>
            <p className="text-lg font-bold mt-1">${(metrics.mrr.value / 1000).toFixed(0)}K</p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <TrendingUp size={14} />
              <span>+{metrics.mrr.change}%</span>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg text-white">
            <p className="text-sm opacity-90">Pipeline Value</p>
            <p className="text-lg font-bold mt-1">
              ${(metrics.pipeline.value / 1000000).toFixed(1)}M
            </p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <TrendingUp size={14} />
              <span>+{metrics.pipeline.change}%</span>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg text-white">
            <p className="text-sm opacity-90">Pipeline Health Score</p>
            <p className="text-lg font-bold mt-1">{metrics.pipelineHealth}/100</p>
            <Badge variant="success" className="mt-2 text-xs">
              Excellent
            </Badge>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">Revenue Growth Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="arr"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                name="ARR ($K)"
              />
              <Area
                type="monotone"
                dataKey="mrr"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
                name="MRR ($K)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-6 gap-3">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <Users className="mx-auto text-blue-600 mb-1" size={20} />
            <p className="text-lg font-bold">{metrics.customers.value}</p>
            <p className="text-xs text-gray-600">Customers</p>
            <p className="text-xs text-green-600">+{metrics.customers.change}%</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <AlertTriangle className="mx-auto text-orange-600 mb-1" size={20} />
            <p className="text-lg font-bold">{metrics.churn.value}%</p>
            <p className="text-xs text-gray-600">Churn Rate</p>
            <p className="text-xs text-green-600">{metrics.churn.change}%</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <DollarSign className="mx-auto text-purple-600 mb-1" size={20} />
            <p className="text-lg font-bold">${metrics.cac.value}</p>
            <p className="text-xs text-gray-600">CAC</p>
            <p className="text-xs text-green-600">{metrics.cac.change}%</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <TrendingUp className="mx-auto text-green-600 mb-1" size={20} />
            <p className="text-lg font-bold">${(metrics.ltv.value / 1000).toFixed(1)}K</p>
            <p className="text-xs text-gray-600">LTV</p>
            <p className="text-xs text-green-600">+{metrics.ltv.change}%</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <Target className="mx-auto text-blue-600 mb-1" size={20} />
            <p className="text-lg font-bold">{metrics.winRate.value}%</p>
            <p className="text-xs text-gray-600">Win Rate</p>
            <p className="text-xs text-green-600">+{metrics.winRate.change}%</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <BarChart3 className="mx-auto text-purple-600 mb-1" size={20} />
            <p className="text-lg font-bold">${(metrics.avgDealSize / 1000).toFixed(0)}K</p>
            <p className="text-xs text-gray-600">Avg Deal</p>
            <p className="text-xs text-green-600">+{metrics.avgDealSize.change}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// PIPELINE HEALTH SCORE
export const PipelineHealthScore = () => {
  const [healthScore] = useState(87);
  const [healthFactors] = useState([
    {
      factor: 'Pipeline Coverage',
      score: 92,
      status: 'excellent',
      description: '4.2x coverage of quarterly quota',
    },
    {
      factor: 'Deal Velocity',
      score: 85,
      status: 'good',
      description: '49 days avg cycle time (target: 45)',
    },
    {
      factor: 'Stage Distribution',
      score: 88,
      status: 'excellent',
      description: 'Balanced across all stages',
    },
    {
      factor: 'Win Rate Trend',
      score: 90,
      status: 'excellent',
      description: '24% win rate, +3% vs last quarter',
    },
    { factor: 'Deal Age', score: 78, status: 'warning', description: '12 deals over 90 days old' },
    {
      factor: 'Activity Level',
      score: 95,
      status: 'excellent',
      description: '847 touches this week',
    },
  ]);

  const getScoreColor = score => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusBadge = status => {
    if (status === 'excellent')
      return (
        <Badge variant="success" className="text-xs">
          Excellent
        </Badge>
      );
    if (status === 'good')
      return (
        <Badge variant="primary" className="text-xs">
          Good
        </Badge>
      );
    if (status === 'warning')
      return (
        <Badge variant="warning" className="text-xs">
          Needs Attention
        </Badge>
      );
    return (
      <Badge variant="danger" className="text-xs">
        Critical
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="text-primary-500" size={20} />
          <CardTitle>Pipeline Health Score</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Real-time pipeline quality assessment
        </p>
      </CardHeader>
      <CardContent>
        {/* Overall Score */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white text-center">
          <p className="text-sm opacity-90 mb-2">Overall Pipeline Health</p>
          <p className="text-7xl font-bold">{healthScore}</p>
          <p className="text-lg mt-2">Excellent Condition</p>
          <div className="w-full bg-white/30 rounded-full h-2 mt-4">
            <div
              className="bg-white h-2 rounded-full transition-all"
              style={{ width: `${healthScore}%` }}
            ></div>
          </div>
        </div>

        {/* Health Factors */}
        <div className="space-y-3">
          {healthFactors.map((item, idx) => (
            <div key={idx} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{item.factor}</p>
                    {getStatusBadge(item.status)}
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <div className={`text-lg font-bold ${getScoreColor(item.score)}`}>
                  {item.score}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    item.score >= 90
                      ? 'bg-green-500'
                      : item.score >= 75
                        ? 'bg-blue-500'
                        : item.score >= 60
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                  }`}
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// FORECAST ACCURACY TRACKER
export const ForecastAccuracyTracker = () => {
  const forecastData = [
    { quarter: 'Q1 2025', forecasted: 580, actual: 565, accuracy: 97 },
    { quarter: 'Q2 2025', forecasted: 620, actual: 610, accuracy: 98 },
    { quarter: 'Q3 2025', forecasted: 680, actual: 695, accuracy: 98 },
    { quarter: 'Q4 2025', forecasted: 750, actual: 735, accuracy: 98 },
  ];

  const avgAccuracy = Math.round(
    forecastData.reduce((sum, q) => sum + q.accuracy, 0) / forecastData.length
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="text-primary-500" size={20} />
          <CardTitle>Forecast Accuracy Tracker</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Predicted vs actual revenue comparison
        </p>
      </CardHeader>
      <CardContent>
        {/* Accuracy Score */}
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white text-center">
          <p className="text-sm opacity-90">Average Forecast Accuracy</p>
          <p className="text-5xl font-bold">{avgAccuracy}%</p>
          <Badge variant="success" className="mt-2">
            Industry Leading
          </Badge>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="quarter" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="forecasted" fill="#8b5cf6" name="Forecasted ($K)" />
            <Bar dataKey="actual" fill="#10b981" name="Actual ($K)" />
          </BarChart>
        </ResponsiveContainer>

        {/* Accuracy Table */}
        <div className="mt-4 space-y-2">
          {forecastData.map((quarter, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              <p className="font-semibold">{quarter.quarter}</p>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-gray-600">Forecast vs Actual</p>
                  <p className="text-sm">
                    ${quarter.forecasted}K vs ${quarter.actual}K
                  </p>
                </div>
                <Badge variant={quarter.accuracy >= 95 ? 'success' : 'primary'} className="text-xs">
                  {quarter.accuracy}% accurate
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// WHAT-IF SCENARIO PLANNER
export const WhatIfScenarioPlanner = () => {
  const [scenario, setScenario] = useState({
    winRateIncrease: 0,
    dealSizeIncrease: 0,
    velocityImprovement: 0,
  });

  const baseMetrics = {
    winRate: 24,
    avgDealSize: 15000,
    avgCycleTime: 49,
    monthlyDeals: 20,
  };

  const calculateImpact = () => {
    const newWinRate = baseMetrics.winRate * (1 + scenario.winRateIncrease / 100);
    const newDealSize = baseMetrics.avgDealSize * (1 + scenario.dealSizeIncrease / 100);
    const newCycleTime = baseMetrics.avgCycleTime * (1 - scenario.velocityImprovement / 100);

    const baseRevenue =
      (baseMetrics.winRate / 100) * baseMetrics.avgDealSize * baseMetrics.monthlyDeals * 12;
    const newRevenue = (newWinRate / 100) * newDealSize * baseMetrics.monthlyDeals * 12;
    const revenueIncrease = newRevenue - baseRevenue;

    return {
      newWinRate: newWinRate.toFixed(1),
      newDealSize: Math.round(newDealSize),
      newCycleTime: Math.round(newCycleTime),
      revenueIncrease: Math.round(revenueIncrease),
      percentIncrease: Math.round((revenueIncrease / baseRevenue) * 100),
    };
  };

  const impact = calculateImpact();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="text-primary-500" size={20} />
          <CardTitle>What-If Scenario Planner</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Model the impact of improvements</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {/* Left: Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold mb-2 flex items-center justify-between">
                <span>Win Rate Increase (%)</span>
                <Badge variant="secondary" className="text-xs">
                  {scenario.winRateIncrease}%
                </Badge>
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={scenario.winRateIncrease}
                onChange={e =>
                  setScenario({ ...scenario, winRateIncrease: Number.parseInt(e.target.value, 10) })
                }
                className="w-full"
              />
              <p className="text-xs text-gray-600 mt-1">
                {baseMetrics.winRate}% → {impact.newWinRate}%
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 flex items-center justify-between">
                <span>Avg Deal Size Increase (%)</span>
                <Badge variant="secondary" className="text-xs">
                  {scenario.dealSizeIncrease}%
                </Badge>
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={scenario.dealSizeIncrease}
                onChange={e =>
                  setScenario({
                    ...scenario,
                    dealSizeIncrease: Number.parseInt(e.target.value, 10),
                  })
                }
                className="w-full"
              />
              <p className="text-xs text-gray-600 mt-1">
                ${baseMetrics.avgDealSize.toLocaleString()} → $
                {Number.parseInt(impact.newDealSize, 10).toLocaleString()}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 flex items-center justify-between">
                <span>Sales Velocity Improvement (%)</span>
                <Badge variant="secondary" className="text-xs">
                  {scenario.velocityImprovement}%
                </Badge>
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={scenario.velocityImprovement}
                onChange={e =>
                  setScenario({
                    ...scenario,
                    velocityImprovement: Number.parseInt(e.target.value, 10),
                  })
                }
                className="w-full"
              />
              <p className="text-xs text-gray-600 mt-1">
                {baseMetrics.avgCycleTime} days → {impact.newCycleTime} days
              </p>
            </div>

            <Button
              className="w-full"
              onClick={() =>
                setScenario({ winRateIncrease: 0, dealSizeIncrease: 0, velocityImprovement: 0 })
              }
            >
              Reset
            </Button>
          </div>

          {/* Right: Impact */}
          <div>
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white mb-4">
              <p className="text-sm opacity-90">Projected Revenue Impact</p>
              <p className="text-5xl font-bold mt-2">
                ${(impact.revenueIncrease / 1000).toFixed(0)}K
              </p>
              <p className="text-lg mt-2">+{impact.percentIncrease}% Increase</p>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">New Win Rate</p>
                <p className="text-lg font-bold text-blue-600">{impact.newWinRate}%</p>
                <p className="text-xs text-green-600 mt-1">
                  +{(impact.newWinRate - baseMetrics.winRate).toFixed(1)}% improvement
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">New Avg Deal Size</p>
                <p className="text-lg font-bold text-purple-600">
                  ${(impact.newDealSize / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +${(impact.newDealSize - baseMetrics.avgDealSize).toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">New Sales Cycle</p>
                <p className="text-lg font-bold text-orange-600">{impact.newCycleTime} days</p>
                <p className="text-xs text-green-600 mt-1">
                  -{baseMetrics.avgCycleTime - impact.newCycleTime} days faster
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
