// Advanced Analytics Components
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  TrendingUp,
  Filter,
  DollarSign,
  Clock,
  Trophy,
  Target,
  Download,
  Code,
} from 'lucide-react';
import { BarChart } from 'recharts/es6/chart/BarChart.js';
import { Bar } from 'recharts/es6/cartesian/Bar.js';
import { XAxis } from 'recharts/es6/cartesian/XAxis.js';
import { YAxis } from 'recharts/es6/cartesian/YAxis.js';
import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid.js';
import { Tooltip } from 'recharts/es6/component/Tooltip.js';
import { Legend } from 'recharts/es6/component/Legend.js';
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer.js';
import { AreaChart } from 'recharts/es6/chart/AreaChart.js';
import { Area } from 'recharts/es6/cartesian/Area.js';

export const ExecutiveDashboard = () => {
  const kpis = [
    { label: 'ARR', value: '$2.4M', change: '+18%', trend: 'up' },
    { label: 'MRR', value: '$205K', change: '+12%', trend: 'up' },
    { label: 'Churn Rate', value: '2.1%', change: '-0.5%', trend: 'down' },
    { label: 'CAC', value: '$450', change: '-8%', trend: 'down' },
    { label: 'LTV', value: '$12.5K', change: '+15%', trend: 'up' },
    { label: 'Win Rate', value: '24%', change: '+3%', trend: 'up' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="text-primary-500" size={20} />
          <CardTitle>Executive Dashboard</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {kpis.map(kpi => (
            <div
              key={kpi.label}
              className="p-4 bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/10 dark:to-transparent rounded-lg border"
            >
              <p className="text-xs text-gray-600 mb-1">{kpi.label}</p>
              <p className="text-lg font-bold mb-1">{kpi.value}</p>
              <Badge variant={kpi.trend === 'up' ? 'success' : 'error'} className="text-xs">
                {kpi.change}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const ConversionFunnelAnalyzer = () => {
  const funnelData = [
    { stage: 'Visitors', count: 10000, conversion: 100 },
    { stage: 'Leads', count: 2500, conversion: 25 },
    { stage: 'MQLs', count: 875, conversion: 8.75 },
    { stage: 'SQLs', count: 350, conversion: 3.5 },
    { stage: 'Opportunities', count: 140, conversion: 1.4 },
    { stage: 'Customers', count: 35, conversion: 0.35 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Filter className="text-primary-500" size={20} />
          <CardTitle>Conversion Funnel Analyzer</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {funnelData.map((stage, idx) => (
            <div key={stage.stage}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{stage.stage}</span>
                <span className="text-gray-600">
                  {stage.count.toLocaleString()} ({stage.conversion}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary-500 to-accent-500 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                  style={{ width: `${stage.conversion * 10}%` }}
                >
                  {stage.count.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-sm">
            <strong>Bottleneck:</strong> MQL → SQL conversion (35% drop)
          </p>
          <Button size="sm" className="mt-2">
            Investigate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const RevenueAttribution = () => {
  const attributionData = [
    { model: 'First Touch', revenue: 245000, deals: 23 },
    { model: 'Last Touch', revenue: 298000, deals: 28 },
    { model: 'Linear', revenue: 267000, deals: 25 },
    { model: 'Time Decay', revenue: 289000, deals: 27 },
    { model: 'Position Based', revenue: 275000, deals: 26 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="text-primary-500" size={20} />
          <CardTitle>Revenue Attribution Models</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={attributionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="model" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4">
          <label htmlFor="attribution-model" className="text-sm font-medium">
            Select Attribution Model
          </label>
          <select id="attribution-model" className="w-full mt-1 px-3 py-2 border rounded-lg">
            {attributionData.map(model => (
              <option key={model.model}>{model.model}</option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  );
};

export const PipelineVelocityTracker = () => {
  const stageData = [
    { stage: 'Lead', avgDays: 3, deals: 245 },
    { stage: 'MQL', avgDays: 7, deals: 89 },
    { stage: 'SQL', avgDays: 5, deals: 67 },
    { stage: 'Opportunity', avgDays: 14, deals: 45 },
    { stage: 'Proposal', avgDays: 12, deals: 28 },
    { stage: 'Negotiation', avgDays: 8, deals: 18 },
    { stage: 'Closed Won', avgDays: 0, deals: 12 },
  ];

  const totalDays = stageData.reduce((sum, s) => sum + s.avgDays, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="text-primary-500" size={20} />
          <CardTitle>Pipeline Velocity Tracker</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Average Deal Cycle</p>
          <p className="text-lg font-bold text-primary-600">{totalDays} days</p>
        </div>

        <div className="space-y-3">
          {stageData.map(stage => (
            <div key={stage.stage} className="flex items-center justify-between p-2 border rounded">
              <div>
                <p className="font-medium text-sm">{stage.stage}</p>
                <p className="text-xs text-gray-600">{stage.deals} deals</p>
              </div>
              <Badge variant="secondary">{stage.avgDays} days</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const WinLossAnalysis = () => {
  const [analysis, setAnalysis] = useState({
    wonReasons: [
      { reason: 'Better pricing', count: 23 },
      { reason: 'Superior features', count: 18 },
      { reason: 'Strong relationship', count: 15 },
      { reason: 'Faster implementation', count: 12 },
    ],
    lostReasons: [
      { reason: 'Too expensive', count: 15 },
      { reason: 'Competitor chosen', count: 12 },
      { reason: 'No budget', count: 10 },
      { reason: 'Timing issues', count: 8 },
    ],
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="text-primary-500" size={20} />
          <CardTitle>Win/Loss Analysis</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <h4 className="font-semibold text-green-600 mb-3">Why We Win</h4>
            <div className="space-y-2">
              {analysis.wonReasons.map(reason => (
                <div
                  key={reason.reason}
                  className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded"
                >
                  <span className="text-sm">{reason.reason}</span>
                  <Badge variant="success">{reason.count}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-red-600 mb-3">Why We Lose</h4>
            <div className="space-y-2">
              {analysis.lostReasons.map(reason => (
                <div
                  key={reason.reason}
                  className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded"
                >
                  <span className="text-sm">{reason.reason}</span>
                  <Badge variant="error">{reason.count}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const CompetitiveIntelligence = () => {
  const competitors = [
    { name: 'Competitor A', mentions: 34, winRate: 32, avgDealSize: '$45K' },
    { name: 'Competitor B', mentions: 28, winRate: 48, avgDealSize: '$38K' },
    { name: 'Competitor C', mentions: 19, winRate: 61, avgDealSize: '$52K' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="text-primary-500" size={20} />
          <CardTitle>Competitive Intelligence</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {competitors.map(comp => (
            <div key={comp.name} className="p-3 border rounded-lg">
              <h4 className="font-semibold mb-3">{comp.name}</h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-gray-600">Mentions</p>
                  <p className="text-lg font-bold">{comp.mentions}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Win Rate</p>
                  <p className="text-lg font-bold text-green-600">{comp.winRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Avg Deal</p>
                  <p className="text-lg font-bold">{comp.avgDealSize}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4">
          View Battlecards
        </Button>
      </CardContent>
    </Card>
  );
};

export const ForecastAccuracy = () => {
  const forecastData = [
    { quarter: 'Q1 2025', forecasted: 850000, actual: 823000, accuracy: 97 },
    { quarter: 'Q2 2025', forecasted: 920000, actual: 945000, accuracy: 97 },
    { quarter: 'Q3 2025', forecasted: 1050000, actual: 1023000, accuracy: 97 },
    { quarter: 'Q4 2025', forecasted: 1200000, actual: null, accuracy: null },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="text-primary-500" size={20} />
          <CardTitle>Forecast Accuracy Tracker</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="quarter" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="forecasted"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Historical Accuracy</span>
            <Badge variant="success">97% avg</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const CustomSQLQueryBuilder = () => {
  const [query, setQuery] = useState('SELECT * FROM leads WHERE score > 70');
  const [savedQueries] = useState([
    'High-value enterprise leads',
    'Recent email opens',
    'Stale opportunities',
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Code className="text-primary-500" size={20} />
          <CardTitle>Custom SQL Query Builder</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <label htmlFor="sql-query" className="text-sm font-medium">
              SQL Query
            </label>
            <textarea
              id="sql-query"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg font-mono text-sm"
              rows={4}
              placeholder="SELECT * FROM..."
            />
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">Run Query</Button>
            <Button variant="outline">Save Query</Button>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Saved Queries</h4>
            <div className="space-y-2">
              {savedQueries.map(sq => (
                <div
                  key={sq}
                  className="flex justify-between items-center p-2 border rounded text-sm"
                >
                  <span>{sq}</span>
                  <Button size="sm" variant="ghost">
                    Load
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const DataExportScheduler = () => {
  const exports = [
    {
      name: 'Daily Leads Export',
      destination: 'S3 Bucket',
      format: 'CSV',
      schedule: 'Daily 2:00 AM',
      status: 'active',
    },
    {
      name: 'Weekly Analytics',
      destination: 'Data Warehouse',
      format: 'JSON',
      schedule: 'Mon 6:00 AM',
      status: 'active',
    },
    {
      name: 'Monthly Report',
      destination: 'Email',
      format: 'Excel',
      schedule: '1st of month',
      status: 'paused',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Download className="text-primary-500" size={20} />
          <CardTitle>Data Export Scheduler</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {exports.map((exp, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{exp.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {exp.destination} • {exp.format}
                  </p>
                </div>
                <Badge variant={exp.status === 'active' ? 'success' : 'secondary'}>
                  {exp.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-600">{exp.schedule}</p>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">+ Schedule Export</Button>
      </CardContent>
    </Card>
  );
};
