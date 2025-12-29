import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  ThumbsUp,
  ThumbsDown,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  TrendingUp,
  Target,
  Zap,
} from 'lucide-react';
import { AreaChart } from 'recharts/es6/chart/AreaChart.js';
import { Area } from 'recharts/es6/cartesian/Area.js';
import { BarChart } from 'recharts/es6/chart/BarChart.js';
import { Bar } from 'recharts/es6/cartesian/Bar.js';
import { XAxis } from 'recharts/es6/cartesian/XAxis.js';
import { YAxis } from 'recharts/es6/cartesian/YAxis.js';
import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid.js';
import { Tooltip } from 'recharts/es6/component/Tooltip.js';
import { Legend } from 'recharts/es6/component/Legend.js';
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer.js';
import { PieChart } from 'recharts/es6/chart/PieChart.js';
import { Pie } from 'recharts/es6/polar/Pie.js';
import { Cell } from 'recharts/es6/component/Cell.js';

const ReplyIntelligence = () => {
  const [replies] = useState([
    {
      id: 1,
      from: 'john@acme.com',
      fromName: 'John Doe',
      company: 'Acme Corp',
      subject: 'Re: Sales automation solution',
      preview: 'This looks interesting! Can we schedule a demo next week?',
      sentiment: 'positive',
      sentimentScore: 94,
      category: 'meeting_request',
      extractedInfo: {
        meetingRequested: true,
        proposedTimes: ['next week'],
        urgency: 'medium',
      },
      received: '2 hours ago',
      handled: false,
    },
    {
      id: 2,
      from: 'sarah@tech.co',
      fromName: 'Sarah Chen',
      company: 'Tech Co',
      subject: 'Re: Partnership opportunity',
      preview: "Thanks but we're all set with our current provider.",
      sentiment: 'negative',
      sentimentScore: 12,
      category: 'not_interested',
      extractedInfo: {
        objection: 'status_quo',
        tone: 'polite',
      },
      received: '5 hours ago',
      handled: true,
    },
    {
      id: 3,
      from: 'mike@startup.io',
      fromName: 'Mike Johnson',
      company: 'Startup Inc',
      subject: 'Re: Scaling your outbound',
      preview:
        'Interesting timing. We just raised Series A and are looking to scale SDR team. What pricing do you offer?',
      sentiment: 'very_positive',
      sentimentScore: 96,
      category: 'qualified_lead',
      extractedInfo: {
        buyingSignals: ['raised funding', 'scaling team'],
        questions: ['pricing'],
        urgency: 'high',
      },
      received: '30 minutes ago',
      handled: false,
    },
    {
      id: 4,
      from: 'lisa@enterprise.com',
      fromName: 'Lisa Anderson',
      company: 'Enterprise Corp',
      subject: 'Out of Office',
      preview: 'I will be out of office until January 15th...',
      sentiment: 'neutral',
      sentimentScore: 50,
      category: 'out_of_office',
      extractedInfo: {
        returnDate: '2024-01-15',
        autoReply: true,
      },
      received: '1 day ago',
      handled: true,
    },
  ]);

  const sentimentData = [
    { name: 'Very Positive', value: 24, color: '#10b981' },
    { name: 'Positive', value: 38, color: '#6ee7b7' },
    { name: 'Neutral', value: 18, color: '#9ca3af' },
    { name: 'Negative', value: 15, color: '#fca5a5' },
    { name: 'Very Negative', value: 5, color: '#ef4444' },
  ];

  const categoryStats = [
    { category: 'Meeting Requests', count: 47, percentage: 23, trend: '+12%' },
    { category: 'Qualified Leads', count: 89, percentage: 44, trend: '+28%' },
    { category: 'Objections', count: 34, percentage: 17, trend: '-5%' },
    { category: 'Out of Office', count: 23, percentage: 11, trend: '+3%' },
    { category: 'Not Interested', count: 10, percentage: 5, trend: '-15%' },
  ];

  const weeklyTrend = [
    { week: 'Week 1', positive: 45, negative: 12, neutral: 8 },
    { week: 'Week 2', positive: 52, negative: 10, neutral: 12 },
    { week: 'Week 3', positive: 61, negative: 8, neutral: 10 },
    { week: 'Week 4', positive: 74, negative: 7, neutral: 11 },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Reply Intelligence & Sentiment Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            AI-powered reply classification and sentiment scoring
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Replies</p>
                  <p className="text-lg font-bold">203</p>
                  <p className="text-xs text-green-600 mt-1">+18% vs last week</p>
                </div>
                <div className="w-12 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Mail className="text-white" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Positive Rate</p>
                  <p className="text-lg font-bold">62%</p>
                  <p className="text-xs text-green-600 mt-1">+5% improvement</p>
                </div>
                <div className="w-12 h-9 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <ThumbsUp className="text-white" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Meetings Booked</p>
                  <p className="text-lg font-bold">47</p>
                  <p className="text-xs text-green-600 mt-1">From AI detection</p>
                </div>
                <div className="w-12 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Calendar className="text-white" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Auto-Handled</p>
                  <p className="text-lg font-bold">156</p>
                  <p className="text-xs text-blue-600 mt-1">77% of total</p>
                </div>
                <div className="w-12 h-9 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Zap className="text-white" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-12 gap-3">
          {/* Recent Replies */}
          <div className="col-span-8 space-y-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Replies</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      All
                    </Button>
                    <Button size="sm" variant="outline">
                      Unhandled
                    </Button>
                    <Button size="sm" variant="outline">
                      Positive
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {replies.map(reply => (
                    <div
                      key={reply.id}
                      className={`p-4 border rounded-lg ${
                        reply.sentiment === 'very_positive' || reply.sentiment === 'positive'
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200'
                          : reply.sentiment === 'negative' || reply.sentiment === 'very_negative'
                            ? 'bg-red-50 dark:bg-red-900/20 border-red-200'
                            : 'bg-gray-50 dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{reply.fromName}</p>
                            <span className="text-xs text-gray-600">• {reply.company}</span>
                            {!reply.handled && (
                              <Badge variant="warning" className="text-xs">
                                Needs Action
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {reply.subject}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{reply.received}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge
                            variant={
                              reply.sentiment.includes('positive')
                                ? 'success'
                                : reply.sentiment.includes('negative')
                                  ? 'danger'
                                  : 'secondary'
                            }
                            className="text-xs"
                          >
                            {reply.sentimentScore}% {reply.sentiment.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {reply.category.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm mb-3 p-3 bg-white dark:bg-gray-900 rounded">
                        "{reply.preview}"
                      </p>

                      {/* Extracted Info */}
                      {reply.extractedInfo && (
                        <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">
                            AI Extracted Information:
                          </p>
                          <div className="space-y-1 text-xs">
                            {reply.extractedInfo.meetingRequested && (
                              <div className="flex items-center gap-2">
                                <CheckCircle size={12} className="text-green-500" />
                                <span>
                                  Meeting requested - Proposed times:{' '}
                                  {reply.extractedInfo.proposedTimes.join(', ')}
                                </span>
                              </div>
                            )}
                            {reply.extractedInfo.buyingSignals && (
                              <div className="flex items-center gap-2">
                                <Target size={12} className="text-purple-500" />
                                <span>
                                  Buying signals: {reply.extractedInfo.buyingSignals.join(', ')}
                                </span>
                              </div>
                            )}
                            {reply.extractedInfo.objection && (
                              <div className="flex items-center gap-2">
                                <AlertCircle size={12} className="text-orange-500" />
                                <span>Objection detected: {reply.extractedInfo.objection}</span>
                              </div>
                            )}
                            {reply.extractedInfo.urgency && (
                              <div className="flex items-center gap-2">
                                <Clock size={12} className="text-blue-500" />
                                <span>Urgency: {reply.extractedInfo.urgency}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        {reply.category === 'meeting_request' && !reply.handled && (
                          <>
                            <Button size="sm" variant="success">
                              Book Meeting
                            </Button>
                            <Button size="sm" variant="outline">
                              Propose Times
                            </Button>
                          </>
                        )}
                        {reply.category === 'qualified_lead' && !reply.handled && (
                          <>
                            <Button size="sm" variant="success">
                              Assign to AE
                            </Button>
                            <Button size="sm" variant="outline">
                              Send Pricing
                            </Button>
                          </>
                        )}
                        {reply.category === 'not_interested' && !reply.handled && (
                          <>
                            <Button size="sm" variant="outline">
                              Send Objection Response
                            </Button>
                            <Button size="sm" variant="outline">
                              Archive
                            </Button>
                          </>
                        )}
                        {reply.handled && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle size={12} className="mr-1" />
                            Handled
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Sidebar */}
          <div className="col-span-4 space-y-3">
            {/* Sentiment Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sentiment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {sentimentData.map(item => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-semibold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Reply Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryStats.map(stat => (
                    <div key={stat.category} className="border-b pb-3 last:border-b-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold">{stat.category}</span>
                        <span className="text-sm font-bold">{stat.count}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{stat.percentage}% of total</span>
                        <span
                          className={stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}
                        >
                          {stat.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sentiment Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="positive"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="neutral"
                      stackId="1"
                      stroke="#9ca3af"
                      fill="#9ca3af"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="negative"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReplyIntelligence;
