import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  TrendingUp,
  Download,
  Calendar,
  Mail,
  MousePointerClick,
  UserCheck,
  Target,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  FunnelChart,
  Funnel
} from 'recharts';

const Analytics = () => {
  const funnelData = [
    { name: 'Emails Sent', value: 12453, fill: '#3B82F6' },
    { name: 'Opened', value: 5420, fill: '#10B981' },
    { name: 'Clicked', value: 1847, fill: '#8B5CF6' },
    { name: 'Replied', value: 1046, fill: '#F59E0B' },
    { name: 'Meetings', value: 247, fill: '#EF4444' },
  ];

  const performanceData = [
    { week: 'Week 1', sent: 1200, opened: 480, replied: 96 },
    { week: 'Week 2', sent: 1450, opened: 595, replied: 119 },
    { week: 'Week 3', sent: 1680, opened: 689, replied: 138 },
    { week: 'Week 4', sent: 1890, opened: 775, replied: 155 },
    { week: 'Week 5', sent: 2100, opened: 861, replied: 172 },
    { week: 'Week 6', sent: 2340, opened: 960, replied: 192 },
  ];

  const channelData = [
    { name: 'Email', value: 68, color: '#3B82F6' },
    { name: 'LinkedIn', value: 22, color: '#0077B5' },
    { name: 'Phone', value: 7, color: '#10B981' },
    { name: 'SMS', value: 3, color: '#8B5CF6' },
  ];

  const bestPerformers = [
    {
      subject: 'Quick question about {{company}}',
      sent: 847,
      openRate: 42.3,
      replyRate: 9.2,
      trend: 'up',
    },
    {
      subject: '{{firstName}}, thoughts on this?',
      sent: 623,
      openRate: 38.1,
      replyRate: 7.8,
      trend: 'up',
    },
    {
      subject: 'Saw your post about {{topic}}',
      sent: 512,
      openRate: 35.7,
      replyRate: 6.4,
      trend: 'up',
    },
  ];

  const aiOptimizations = [
    {
      title: 'Send Time Optimization',
      impact: '+24%',
      description: 'Tuesday 10 AM generates highest reply rates',
      type: 'success',
    },
    {
      title: 'Subject Line A/B Test',
      impact: '+18%',
      description: 'Questions outperform statements by 18%',
      type: 'success',
    },
    {
      title: 'Personalization Depth',
      impact: '+32%',
      description: 'Emails with 3+ variables get more replies',
      type: 'success',
    },
  ];

  return (
    <DashboardLayout 
      title="Analytics & Insights" 
      subtitle="Track performance and get AI-powered recommendations"
    >
      {/* Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar size={16} />
            Date Range: Last 30 Days
          </Button>
          <Button variant="ghost" size="sm">Compare Period</Button>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download size={16} />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { 
            label: 'Total Sent', 
            value: '12,453', 
            change: '+12.5%', 
            trend: 'up', 
            icon: Mail, 
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
          },
          { 
            label: 'Open Rate', 
            value: '43.5%', 
            change: '+5.2%', 
            trend: 'up', 
            icon: MousePointerClick, 
            color: 'text-green-600',
            bgColor: 'bg-green-100'
          },
          { 
            label: 'Reply Rate', 
            value: '8.4%', 
            change: '+2.3%', 
            trend: 'up', 
            icon: Target, 
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
          },
          { 
            label: 'Meetings', 
            value: '247', 
            change: '+18.0%', 
            trend: 'up', 
            icon: UserCheck, 
            color: 'text-orange-600',
            bgColor: 'bg-orange-100'
          },
        ].map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          return (
            <Card key={index}>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                    <div className={`flex items-center gap-1 text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      <TrendIcon size={14} />
                      <span className="font-medium">{metric.change}</span>
                    </div>
                  </div>
                  <div className={`${metric.bgColor} ${metric.color} p-2 rounded-lg`}>
                    <Icon size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Optimization Cards */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-accent-500" />
                AI Optimization Insights
              </CardTitle>
              <CardDescription>Data-driven recommendations to improve performance</CardDescription>
            </div>
            <Badge variant="accent">3 New</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3">
            {aiOptimizations.map((opt, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg hover:border-accent-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm text-gray-900">{opt.title}</h4>
                  <span className="text-lg font-bold text-green-600">{opt.impact}</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{opt.description}</p>
                <Button variant="ghost" size="sm" className="gap-2">
                  Apply Now
                  <ArrowUpRight size={14} />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        {/* Funnel Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>From send to booked meeting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2 text-center text-xs">
              {funnelData.map((stage, index) => (
                <div key={index}>
                  <div className="font-semibold text-gray-900">{stage.value}</div>
                  <div className="text-gray-500 text-xs">{stage.name}</div>
                  {index > 0 && (
                    <div className="text-xs text-gray-400 mt-1">
                      {((stage.value / funnelData[index-1].value) * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Channel Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Channel Distribution</CardTitle>
            <CardDescription>Meetings booked by channel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {channelData.map((channel, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: channel.color }}></div>
                  <span className="text-xs text-gray-700">{channel.name}</span>
                  <span className="text-xs font-semibold text-gray-900 ml-auto">{channel.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Over Time */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Weekly activity over the last 6 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sent" stroke="#3B82F6" strokeWidth={2} name="Sent" />
                <Line type="monotone" dataKey="opened" stroke="#10B981" strokeWidth={2} name="Opened" />
                <Line type="monotone" dataKey="replied" stroke="#8B5CF6" strokeWidth={2} name="Replied" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Best Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Subject Lines</CardTitle>
          <CardDescription>Based on open and reply rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bestPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="primary">{index + 1}</Badge>
                    <p className="font-medium text-gray-900">{performer.subject}</p>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span>Sent: {performer.sent}</span>
                    <span>Open: {performer.openRate}%</span>
                    <span>Reply: {performer.replyRate}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-green-600" size={20} />
                  <Button variant="ghost" size="sm">Use Template</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Analytics;
