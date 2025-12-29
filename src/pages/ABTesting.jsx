import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/Select';
import {
  TabsRadix,
  TabsListRadix,
  TabsTriggerRadix,
  TabsContentRadix,
} from '../components/ui/TabsRadix';
import { LineChart } from 'recharts/es6/chart/LineChart.js';
import { Line } from 'recharts/es6/cartesian/Line.js';
import { XAxis } from 'recharts/es6/cartesian/XAxis.js';
import { YAxis } from 'recharts/es6/cartesian/YAxis.js';
import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid.js';
import { Tooltip } from 'recharts/es6/component/Tooltip.js';
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer.js';
import { Legend } from 'recharts/es6/component/Legend.js';
import {
  Trophy,
  TrendingUp,
  Mail,
  Calendar,
  Target,
  Crown,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';

const ABTesting = () => {
  const [selectedCampaign, setSelectedCampaign] = useState('email-outreach-q1');
  const [trafficSplit, setTrafficSplit] = useState('50-50');
  const [testStatus, setTestStatus] = useState('running');

  // Mock A/B test data
  const tests = [
    {
      id: 'email-outreach-q1',
      name: 'Email Outreach Q1',
      status: 'running',
      startDate: '2025-01-01',
      variants: {
        a: {
          name: 'Variant A (Control)',
          sent: 5000,
          opened: 1850,
          clicked: 425,
          replied: 180,
          meetings: 45,
          openRate: 37.0,
          clickRate: 8.5,
          replyRate: 3.6,
          conversionRate: 0.9,
        },
        b: {
          name: 'Variant B (Test)',
          sent: 5000,
          opened: 2250,
          clicked: 580,
          replied: 245,
          meetings: 67,
          openRate: 45.0,
          clickRate: 11.6,
          replyRate: 4.9,
          conversionRate: 1.34,
        },
      },
      subject: {
        a: 'Quick question about {{company}}',
        b: '{{firstName}}, saw your post about {{topic}}',
      },
      confidence: 95,
      winner: 'b',
      improvement: 48.9,
    },
  ];

  const currentTest = tests.find(t => t.id === selectedCampaign);

  // Performance over time data
  const performanceData = [
    { day: 'Day 1', variantA: 2.1, variantB: 2.5 },
    { day: 'Day 2', variantA: 2.8, variantB: 3.4 },
    { day: 'Day 3', variantA: 3.2, variantB: 4.1 },
    { day: 'Day 4', variantA: 3.5, variantB: 4.5 },
    { day: 'Day 5', variantA: 3.6, variantB: 4.9 },
    { day: 'Day 6', variantA: 3.6, variantB: 4.9 },
    { day: 'Day 7', variantA: 3.6, variantB: 4.9 },
  ];

  const handleDeclareWinner = () => {
    alert('Winner declared! Variant B will be used for all future sends.');
  };

  const getComparisonColor = (variantA, variantB) => {
    if (variantB > variantA) return 'text-green-600';
    if (variantB < variantA) return 'text-red-600';
    return 'text-gray-600';
  };

  const getComparisonArrow = (variantA, variantB) => {
    if (variantB > variantA) return '↑';
    if (variantB < variantA) return '↓';
    return '→';
  };

  const calculateImprovement = (variantA, variantB) => {
    const improvement = (((variantB - variantA) / variantA) * 100).toFixed(1);
    return improvement > 0 ? `+${improvement}%` : `${improvement}%`;
  };

  return (
    <DashboardLayout
      title="Campaign A/B Testing"
      subtitle="Compare variants and optimize performance"
    >
      <div className="space-y-6">
        {/* Header Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Campaign Test
                </label>
                <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                  <SelectTrigger className="w-full md:w-[300px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email-outreach-q1">Email Outreach Q1</SelectItem>
                    <SelectItem value="linkedin-sequence">LinkedIn Sequence Test</SelectItem>
                    <SelectItem value="cold-call-script">Cold Call Script</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Traffic Split
                </label>
                <Select value={trafficSplit} onValueChange={setTrafficSplit}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50-50">50% / 50%</SelectItem>
                    <SelectItem value="70-30">70% / 30%</SelectItem>
                    <SelectItem value="80-20">80% / 20%</SelectItem>
                    <SelectItem value="90-10">90% / 10%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">Pause Test</Button>
                <Button variant="gradient" onClick={handleDeclareWinner}>
                  <Trophy className="w-4 h-4 mr-2" />
                  Declare Winner
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Status Banner */}
        {currentTest && currentTest.winner && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border-green-500">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-500 rounded-xl">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-green-900 dark:text-green-300 mb-1">
                    Statistical Significance Achieved!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400 mb-3">
                    Variant B is performing {currentTest.improvement}% better with{' '}
                    {currentTest.confidence}% confidence. Ready to declare winner and apply to all
                    future sends.
                  </p>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-800 dark:text-green-300">
                      Sample size: 10,000 sends • 7 days running
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Variant Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Variant A */}
          <Card className="border-2 border-gray-300 dark:border-gray-600">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{currentTest?.variants.a.name}</CardTitle>
                <Badge variant="secondary">Control</Badge>
              </div>
              <CardDescription className="mt-2">
                <strong>Subject:</strong> {currentTest?.subject.a}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Sent</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentTest?.variants.a.sent.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Opened</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {currentTest?.variants.a.opened.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{currentTest?.variants.a.openRate}%</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Clicked</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {currentTest?.variants.a.clicked.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{currentTest?.variants.a.clickRate}%</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-500/10 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Replied</p>
                  <p className="text-2xl font-bold text-green-600">
                    {currentTest?.variants.a.replied.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{currentTest?.variants.a.replyRate}%</p>
                </div>
              </div>

              {/* Conversion */}
              <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Meetings Booked</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {currentTest?.variants.a.meetings}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Conversion Rate</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {currentTest?.variants.a.conversionRate}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variant B */}
          <Card className="border-2 border-green-500 dark:border-green-600 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{currentTest?.variants.b.name}</CardTitle>
                <Badge variant="success" className="gap-1">
                  <Trophy className="w-3 h-3" />
                  Leading
                </Badge>
              </div>
              <CardDescription className="mt-2">
                <strong>Subject:</strong> {currentTest?.subject.b}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Sent</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentTest?.variants.b.sent.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Opened</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {currentTest?.variants.b.opened.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-600">{currentTest?.variants.b.openRate}%</p>
                    <span
                      className={`text-xs font-semibold ${getComparisonColor(currentTest?.variants.a.openRate, currentTest?.variants.b.openRate)}`}
                    >
                      {getComparisonArrow(
                        currentTest?.variants.a.openRate,
                        currentTest?.variants.b.openRate
                      )}{' '}
                      {calculateImprovement(
                        currentTest?.variants.a.openRate,
                        currentTest?.variants.b.openRate
                      )}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Clicked</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {currentTest?.variants.b.clicked.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-600">{currentTest?.variants.b.clickRate}%</p>
                    <span
                      className={`text-xs font-semibold ${getComparisonColor(currentTest?.variants.a.clickRate, currentTest?.variants.b.clickRate)}`}
                    >
                      {getComparisonArrow(
                        currentTest?.variants.a.clickRate,
                        currentTest?.variants.b.clickRate
                      )}{' '}
                      {calculateImprovement(
                        currentTest?.variants.a.clickRate,
                        currentTest?.variants.b.clickRate
                      )}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-500/10 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Replied</p>
                  <p className="text-2xl font-bold text-green-600">
                    {currentTest?.variants.b.replied.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-600">{currentTest?.variants.b.replyRate}%</p>
                    <span
                      className={`text-xs font-semibold ${getComparisonColor(currentTest?.variants.a.replyRate, currentTest?.variants.b.replyRate)}`}
                    >
                      {getComparisonArrow(
                        currentTest?.variants.a.replyRate,
                        currentTest?.variants.b.replyRate
                      )}{' '}
                      {calculateImprovement(
                        currentTest?.variants.a.replyRate,
                        currentTest?.variants.b.replyRate
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Conversion */}
              <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-50 dark:from-green-500/20 dark:to-emerald-500/10 rounded-xl border border-green-300 dark:border-green-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Meetings Booked</p>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                      {currentTest?.variants.b.meetings}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Conversion Rate</p>
                    <p className="text-2xl font-bold text-green-600">
                      {currentTest?.variants.b.conversionRate}%
                    </p>
                    <span className="text-xs font-semibold text-green-600">
                      ↑{' '}
                      {calculateImprovement(
                        currentTest?.variants.a.conversionRate,
                        currentTest?.variants.b.conversionRate
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Over Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Reply Rate Trend</CardTitle>
            <CardDescription>Performance comparison over the test period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis
                  stroke="#9CA3AF"
                  label={{ value: 'Reply Rate (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="variantA"
                  stroke="#9CA3AF"
                  strokeWidth={2}
                  name="Variant A (Control)"
                  dot={{ fill: '#9CA3AF', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="variantB"
                  stroke="#10B981"
                  strokeWidth={3}
                  name="Variant B (Test)"
                  dot={{ fill: '#10B981', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Statistical Significance */}
        <Card>
          <CardHeader>
            <CardTitle>Statistical Analysis</CardTitle>
            <CardDescription>Confidence intervals and significance testing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-200 dark:border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Confidence Level</h4>
                </div>
                <p className="text-3xl font-bold text-blue-600">{currentTest?.confidence}%</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  High confidence in results
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-200 dark:border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Performance Lift</h4>
                </div>
                <p className="text-3xl font-bold text-green-600">+{currentTest?.improvement}%</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Variant B vs Control
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-500/10 rounded-xl border border-purple-200 dark:border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Sample Size</h4>
                </div>
                <p className="text-3xl font-bold text-purple-600">10,000</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total emails sent</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-200 dark:border-amber-500/20">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">
                    Recommendation:
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Variant B has achieved statistical significance with {currentTest?.confidence}%
                    confidence. The {currentTest?.improvement}% improvement in conversion rate
                    represents approximately{' '}
                    {currentTest &&
                      Math.round(
                        currentTest.variants.b.meetings - currentTest.variants.a.meetings
                      )}{' '}
                    additional meetings per month. We recommend declaring Variant B as the winner
                    and applying it to all future sends.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ABTesting;
