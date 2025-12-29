import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  DollarSign, 
  Users, 
  Calendar, 
  Mail, 
  Award, 
  ArrowUp, 
  ArrowDown,
  Brain,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  Zap
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

/**
 * Boardroom-style Executive Dashboard
 * Top: Key metrics hero + 2-3 charts
 * Bottom: AI insights + key events
 */
const ExecutiveDashboard = () => {
  const [timeRange, setTimeRange] = useState('month');

  // AI Insights for executive awareness
  const aiInsights = useMemo(() => [
    { 
      id: 1, 
      type: 'success', 
      icon: TrendingUp,
      title: 'Pipeline Velocity Up 23%',
      description: 'Deals are moving 23% faster through stages compared to last quarter. AI attribution: improved lead scoring.',
      time: '2h ago'
    },
    { 
      id: 2, 
      type: 'warning', 
      icon: AlertTriangle,
      title: 'Q1 Target at Risk',
      description: 'Current trajectory shows 87% target completion. Recommend increasing outbound by 15%.',
      time: '4h ago'
    },
    { 
      id: 3, 
      type: 'info', 
      icon: Brain,
      title: 'Model Retrained',
      description: 'Lead scoring model updated with latest conversion data. Precision improved by 12%.',
      time: '6h ago'
    },
  ], []);

  // Key Events/Milestones
  const keyEvents = useMemo(() => [
    { id: 1, event: 'Enterprise deal closed', company: 'TechCorp Inc', value: '$145K', time: '1h ago', icon: CheckCircle2, color: 'text-emerald-400' },
    { id: 2, event: 'New prospect meeting', company: 'Global Finance Ltd', value: '$80K potential', time: '3h ago', icon: Calendar, color: 'text-violet-400' },
    { id: 3, event: 'Campaign milestone', company: 'Q1 Outbound', value: '10K emails sent', time: '5h ago', icon: Zap, color: 'text-cyan-400' },
    { id: 4, event: 'Demo scheduled', company: 'InnovateTech', value: '$60K potential', time: '8h ago', icon: Clock, color: 'text-amber-400' },
  ], []);

  // KPI Data - Condensed for hero strip
  const heroKpis = [
    { label: 'Pipeline Value', value: '$2.4M', change: '+18.2%', trend: 'up', icon: DollarSign },
    { label: 'Active Leads', value: '1,245', change: '+12.5%', trend: 'up', icon: Users },
    { label: 'Meetings Booked', value: '187', change: '+23.4%', trend: 'up', icon: Calendar },
    { label: 'Win Rate', value: '42.8%', change: '+8.1%', trend: 'up', icon: Award },
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
    { name: 'Prospecting', value: 450, fill: '#06b6d4' },
    { name: 'Qualified', value: 320, fill: '#8b5cf6' },
    { name: 'Demo', value: 180, fill: '#ec4899' },
    { name: 'Proposal', value: 95, fill: '#f59e0b' },
    { name: 'Negotiation', value: 45, fill: '#10b981' },
  ];

  // Team Performance
  const teamPerformance = [
    { name: 'Sarah Chen', deals: 28, revenue: 420000, meetings: 145 },
    { name: 'Michael Rodriguez', deals: 24, revenue: 380000, meetings: 132 },
    { name: 'Emily Watson', deals: 22, revenue: 350000, meetings: 118 },
  ];

  // Activity Volume
  const activityData = [
    { day: 'Mon', emails: 450, calls: 120, meetings: 35 },
    { day: 'Tue', emails: 520, calls: 140, meetings: 42 },
    { day: 'Wed', emails: 480, calls: 130, meetings: 38 },
    { day: 'Thu', emails: 550, calls: 150, meetings: 45 },
    { day: 'Fri', emails: 490, calls: 125, meetings: 40 },
  ];

  const getInsightColor = (type) => {
    switch (type) {
      case 'success': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'warning': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'info': return 'bg-violet-500/10 border-violet-500/20 text-violet-400';
      default: return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
    }
  };

  return (
    <DashboardLayout title="Executive Dashboard" subtitle="Boardroom view • Real-time KPIs and AI insights">
      <div className="space-y-6">
        
        {/* ========== HERO SECTION: Key Metrics Strip ========== */}
        <div className="bg-gradient-to-r from-slate-800 via-violet-900/20 to-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Business Performance</h2>
                <p className="text-sm text-slate-500">Live metrics • Updated just now</p>
              </div>
            </div>
            <div className="flex gap-2">
              {['week', 'month', 'quarter'].map(range => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className={`capitalize ${timeRange === range ? 'bg-violet-600 hover:bg-violet-700' : 'text-slate-400 hover:text-white'}`}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Hero KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {heroKpis.map((kpi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900/50 rounded-lg border border-slate-700 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className="w-5 h-5 text-slate-500" />
                  <span className={`text-xs font-medium flex items-center gap-1 ${kpi.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {kpi.trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    {kpi.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">{kpi.value}</p>
                <p className="text-xs text-slate-500 mt-1">{kpi.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ========== CHARTS SECTION: 2-3 Key Charts ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Trend - Takes 2 columns */}
          <div className="lg:col-span-2 bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-white uppercase tracking-wider">Revenue vs Target</h3>
                <p className="text-xs text-slate-500">6-month trend</p>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">On Track</Badge>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value) => `$${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Actual" />
                <Area type="monotone" dataKey="target" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} name="Target" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pipeline Distribution */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-white uppercase tracking-wider">Pipeline Mix</h3>
              <p className="text-xs text-slate-500">By stage</p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pipelineStages}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pipelineStages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {pipelineStages.slice(0, 3).map((stage, i) => (
                <span key={i} className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.fill }} />
                  {stage.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ========== BOTTOM SECTION: AI Insights + Key Events ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* AI Insights Panel */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white uppercase tracking-wider">AI Insights</h3>
                <p className="text-xs text-slate-500">Autonomous analysis & recommendations</p>
              </div>
            </div>
            <div className="space-y-3">
              {aiInsights.map((insight, i) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <insight.icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-white">{insight.title}</h4>
                        <span className="text-xs text-slate-500">{insight.time}</span>
                      </div>
                      <p className="text-xs text-slate-400">{insight.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Key Events Timeline */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white uppercase tracking-wider">Key Events</h3>
                <p className="text-xs text-slate-500">Today's notable activities</p>
              </div>
            </div>
            <div className="space-y-3">
              {keyEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-slate-900/50 border border-slate-700"
                >
                  <event.icon className={`w-5 h-5 ${event.color} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{event.event}</p>
                    <p className="text-xs text-slate-500">{event.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{event.value}</p>
                    <p className="text-xs text-slate-600">{event.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ========== SECONDARY SECTION: Team + Activity ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers - Compact */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <h3 className="text-sm font-medium text-white uppercase tracking-wider mb-4">Top Performers</h3>
            <div className="space-y-3">
              {teamPerformance.map((member, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-white">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.deals} deals • {member.meetings} meetings</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-emerald-400">${(member.revenue / 1000).toFixed(0)}k</p>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Volume */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <h3 className="text-sm font-medium text-white uppercase tracking-wider mb-4">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} />
                <Bar dataKey="emails" fill="#06b6d4" name="Emails" radius={[2, 2, 0, 0]} />
                <Bar dataKey="meetings" fill="#10b981" name="Meetings" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExecutiveDashboard;
