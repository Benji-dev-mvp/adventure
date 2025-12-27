import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { TrendingUp, TrendingDown, Target, DollarSign, Users, Calendar, Mail, Award, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ExecutiveDashboard = () => {
  const [timeRange, setTimeRange] = useState('month');

  // KPI Data
  const kpis = [
    { 
      label: 'Pipeline Value', 
      value: '$2.4M', 
      change: '+18.2%', 
      trend: 'up', 
      icon: DollarSign, 
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-500/20',
      target: '$3M',
      progress: 80
    },
    { 
      label: 'Active Leads', 
      value: '1,245', 
      change: '+12.5%', 
      trend: 'up', 
      icon: Users, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-500/20',
      target: '1,500',
      progress: 83
    },
    { 
      label: 'Meetings Booked', 
      value: '187', 
      change: '+23.4%', 
      trend: 'up', 
      icon: Calendar, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-500/20',
      target: '200',
      progress: 93.5
    },
    { 
      label: 'Email Reply Rate', 
      value: '34.2%', 
      change: '-2.1%', 
      trend: 'down', 
      icon: Mail, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-500/20',
      target: '40%',
      progress: 85.5
    },
    { 
      label: 'Conversion Rate', 
      value: '18.5%', 
      change: '+5.3%', 
      trend: 'up', 
      icon: Target, 
      color: 'text-pink-600',
      bgColor: 'bg-pink-100 dark:bg-pink-500/20',
      target: '25%',
      progress: 74
    },
    { 
      label: 'Win Rate', 
      value: '42.8%', 
      change: '+8.1%', 
      trend: 'up', 
      icon: Award, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-500/20',
      target: '50%',
      progress: 85.6
    },
  ];

  // Revenue Trend
  const revenueTrend = [
    { month: 'Jan', revenue: 180000, target: 200000 },
    { month: 'Feb', revenue: 210000, target: 220000 },
    { month: 'Mar', revenue: 245000, target: 240000 },
    { month: 'Apr', revenue: 280000, target: 260000 },
    { month: 'May', revenue: 310000, target: 280000 },
    { month: 'Jun', revenue: 340000, target: 300000 },
  ];

  // Pipeline by Stage
  const pipelineStages = [
    { name: 'Prospecting', value: 450, fill: '#3B82F6' },
    { name: 'Qualified', value: 320, fill: '#8B5CF6' },
    { name: 'Demo', value: 180, fill: '#EC4899' },
    { name: 'Proposal', value: 95, fill: '#F59E0B' },
    { name: 'Negotiation', value: 45, fill: '#10B981' },
  ];

  // Team Performance
  const teamPerformance = [
    { name: 'Sarah Chen', deals: 28, revenue: 420000, meetings: 145 },
    { name: 'Michael Rodriguez', deals: 24, revenue: 380000, meetings: 132 },
    { name: 'Emily Watson', deals: 22, revenue: 350000, meetings: 118 },
    { name: 'James Kim', deals: 19, revenue: 290000, meetings: 98 },
    { name: 'Lisa Anderson', deals: 16, revenue: 245000, meetings: 87 },
  ];

  // Activity Volume
  const activityData = [
    { day: 'Mon', emails: 450, calls: 120, meetings: 35 },
    { day: 'Tue', emails: 520, calls: 140, meetings: 42 },
    { day: 'Wed', emails: 480, calls: 130, meetings: 38 },
    { day: 'Thu', emails: 550, calls: 150, meetings: 45 },
    { day: 'Fri', emails: 490, calls: 125, meetings: 40 },
  ];

  return (
    <DashboardLayout title="Executive Dashboard" subtitle="Real-time KPIs and performance insights">
      <div className="space-y-6">
        {/* Time Range Selector */}
        <div className="flex gap-2">
          {['week', 'month', 'quarter', 'year'].map(range => (
            <Button
              key={range}
              variant={timeRange === range ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="capitalize"
            >
              {range}
            </Button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{kpi.label}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                  </div>
                  <div className={`p-3 ${kpi.bgColor} rounded-lg`}>
                    <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {kpi.trend === 'up' ? (
                      <ArrowUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-semibold ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    Target: {kpi.target}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${kpi.trend === 'up' ? 'bg-green-500' : 'bg-orange-500'}`}
                      style={{ width: `${kpi.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{kpi.progress}% of target</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Target</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value) => `$${value.toLocaleString()}`}
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Actual Revenue" />
                  <Area type="monotone" dataKey="target" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} name="Target" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pipeline by Stage */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pipelineStages}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pipelineStages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Team Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamPerformance.map((member, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{member.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {member.deals} deals • {member.meetings} meetings
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ${(member.revenue / 1000).toFixed(0)}k
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Volume */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Volume - This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="day" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="emails" fill="#3B82F6" name="Emails" />
                  <Bar dataKey="calls" fill="#8B5CF6" name="Calls" />
                  <Bar dataKey="meetings" fill="#10B981" name="Meetings" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExecutiveDashboard;
