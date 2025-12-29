import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Download } from 'lucide-react';
import { LineChart } from 'recharts/es6/chart/LineChart.js';
import { Line } from 'recharts/es6/cartesian/Line.js';
import { XAxis } from 'recharts/es6/cartesian/XAxis.js';
import { YAxis } from 'recharts/es6/cartesian/YAxis.js';
import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid.js';
import { Tooltip } from 'recharts/es6/component/Tooltip.js';
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer.js';

const RevenueForecasting = () => {
  const [dealSize, setDealSize] = useState(45000);
  const [closeRate, setCloseRate] = useState(25);
  const [pipeline, setPipeline] = useState(150);
  const [scenario, setScenario] = useState('realistic');

  const calculateRevenue = (deals, size, rate) => {
    return Math.round(deals * size * (rate / 100));
  };

  const scenarios = {
    best: { dealMultiplier: 1.2, rateMultiplier: 1.3 },
    realistic: { dealMultiplier: 1, rateMultiplier: 1 },
    worst: { dealMultiplier: 0.8, rateMultiplier: 0.7 },
  };

  const forecastData = Array.from({ length: 12 }, (_, i) => {
    const month = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ][i];
    const growth = 1 + i * 0.05;
    return {
      month,
      best: calculateRevenue(
        pipeline * growth * scenarios.best.dealMultiplier,
        dealSize,
        closeRate * scenarios.best.rateMultiplier
      ),
      realistic: calculateRevenue(pipeline * growth, dealSize, closeRate),
      worst: calculateRevenue(
        pipeline * growth * scenarios.worst.dealMultiplier,
        dealSize,
        closeRate * scenarios.worst.rateMultiplier
      ),
    };
  });

  const currentRevenue = forecastData[0][scenario];
  const yearEndRevenue = forecastData[11][scenario];

  return (
    <DashboardLayout title="Revenue Forecasting" subtitle="Model your pipeline and predict revenue">
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Month</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${(currentRevenue / 1000000).toFixed(2)}M
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Year End</p>
                <p className="text-3xl font-bold text-green-600">
                  ${(yearEndRevenue / 1000000).toFixed(2)}M
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Annual Total</p>
                <p className="text-3xl font-bold text-purple-600">
                  ${(forecastData.reduce((sum, d) => sum + d[scenario], 0) / 1000000).toFixed(2)}M
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Growth Rate</p>
                <p className="text-3xl font-bold text-blue-600">+60%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Model Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Average Deal Size: ${dealSize.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="10000"
                  max="100000"
                  step="5000"
                  value={dealSize}
                  onChange={e => setDealSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Close Rate: {closeRate}%</label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={closeRate}
                  onChange={e => setCloseRate(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Pipeline Deals: {pipeline}</label>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="10"
                  value={pipeline}
                  onChange={e => setPipeline(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Scenario</label>
                <div className="flex gap-2">
                  {['best', 'realistic', 'worst'].map(s => (
                    <Button
                      key={s}
                      variant={scenario === s ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setScenario(s)}
                      className="flex-1 capitalize"
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
              <Button variant="gradient" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export Forecast
              </Button>
            </CardContent>
          </Card>

          {/* Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>12-Month Revenue Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis
                    stroke="#9CA3AF"
                    tickFormatter={value => `$${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    formatter={value => `$${(value / 1000000).toFixed(2)}M`}
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="best"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                    name="Best Case"
                  />
                  <Line
                    type="monotone"
                    dataKey="realistic"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={false}
                    name="Realistic"
                  />
                  <Line
                    type="monotone"
                    dataKey="worst"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={false}
                    name="Worst Case"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RevenueForecasting;
