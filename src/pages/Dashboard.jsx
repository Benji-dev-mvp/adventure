// Dashboard - Advanced Tabbed Component Pattern
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useTenant } from '../contexts/TenantContext';
import { useWorkspaceMetrics, useSegmentCTA } from '../hooks/useWorkspaceMetrics';
import { useReducedMotion } from '../hooks/useMotion';
import { CustomerImpactSparklines } from '../components/analytics';
import {
  Activity,
  TrendingUp,
  Users,
  Target,
  Mail,
  Calendar,
  Sparkles,
  Brain,
  Zap,
  BarChart3,
  Clock,
  Rocket,
  Lightbulb,
  CheckCircle2,
  ArrowUpRight,
  Play,
  Gauge,
  Bot,
  Shield,
  Crown,
  ChevronRight,
} from 'lucide-react';
import { LineChart } from 'recharts/es6/chart/LineChart.js';
import { Line } from 'recharts/es6/cartesian/Line.js';
import { AreaChart } from 'recharts/es6/chart/AreaChart.js';
import { Area } from 'recharts/es6/cartesian/Area.js';
import { XAxis } from 'recharts/es6/cartesian/XAxis.js';
import { YAxis } from 'recharts/es6/cartesian/YAxis.js';
import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid.js';
import { Tooltip } from 'recharts/es6/component/Tooltip.js';
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer.js';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { getDashboardStats } from '../lib/dataService';

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuad = progress * (2 - progress);
      const currentCount = Math.floor(easeOutQuad * end);

      setCount(currentCount);
      countRef.current = currentCount;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return (
    <span>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

// Live Indicator
const LiveIndicator = ({ label = 'LIVE' }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
    </span>
    <span className="text-xs font-bold text-red-500 tracking-wider">{label}</span>
  </div>
);

// Animated Progress
const AnimatedProgress = ({ value, color = 'cyan', label }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const colorClasses = {
    cyan: 'bg-gradient-to-r from-cyan-400 to-cyan-600',
    blue: 'bg-gradient-to-r from-blue-400 to-blue-600',
    green: 'bg-gradient-to-r from-green-400 to-green-600',
    purple: 'bg-gradient-to-r from-purple-400 to-purple-600',
    pink: 'bg-gradient-to-r from-pink-400 to-pink-600',
    yellow: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
  };

  return (
    <div className="space-y-1">
      {label && (
        <div className="text-xs text-gray-600 dark:text-gray-400 flex justify-between">
          <span>{label}</span>
          <span className="font-bold">{value}%</span>
        </div>
      )}
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color] || colorClasses.cyan} transition-all duration-1000 ease-out rounded-full relative`}
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { plan, isStartup, isMidmarket, isEnterprise } = useTenant();
  const {
    metrics,
    kpiFunnel,
    sparklines,
    summary,
    headline,
    cta: segmentCta,
  } = useWorkspaceMetrics();
  const segmentCTA = useSegmentCTA();
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState('overview');
  const [liveStats, setLiveStats] = useState({
    emailsSent: summary?.emailsSent || 12453,
    replyRate: 8.4,
    meetings: summary?.meetingsBooked || 47,
    activeLeads: summary?.qualifiedLeads || 1284,
  });

  // Update live stats when metrics change
  useEffect(() => {
    if (summary) {
      setLiveStats(prev => ({
        ...prev,
        emailsSent: summary.emailsSent || prev.emailsSent,
        meetings: summary.meetingsBooked || prev.meetings,
        activeLeads: summary.qualifiedLeads || prev.activeLeads,
      }));
    }
  }, [summary]);

  // Enhanced sparklines with icons
  const enhancedSparklines = useMemo(() => {
    const iconMap = {
      meetings: Users,
      replies: Mail,
      pipeline: TrendingUp,
      timeSaved: Zap,
      efficiency: BarChart3,
      compliance: Shield,
    };
    return (
      sparklines?.map(s => ({
        ...s,
        icon: iconMap[s.id] || TrendingUp,
        chartType: 'area',
      })) || []
    );
  }, [sparklines]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        emailsSent: prev.emailsSent + Math.floor(Math.random() * 10),
        replyRate: Math.max(0, Math.min(15, prev.replyRate + (Math.random() - 0.5) * 0.5)),
        meetings: prev.meetings + (Math.random() > 0.8 ? 1 : 0),
        activeLeads: prev.activeLeads + Math.floor(Math.random() * 5) - 2,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity, color: 'cyan' },
    { id: 'campaigns', label: 'Campaigns', icon: Rocket, color: 'purple' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'blue' },
    { id: 'ai-insights', label: 'AI Insights', icon: Brain, color: 'pink' },
    { id: 'actions', label: 'Quick Actions', icon: Zap, color: 'yellow' },
  ];

  const performanceData = [
    { name: 'Mon', emails: 320, replies: 25, meetings: 8 },
    { name: 'Tue', emails: 380, replies: 32, meetings: 12 },
    { name: 'Wed', emails: 450, replies: 38, meetings: 15 },
    { name: 'Thu', emails: 510, replies: 42, meetings: 18 },
    { name: 'Fri', emails: 490, replies: 40, meetings: 16 },
    { name: 'Sat', emails: 120, replies: 10, meetings: 3 },
    { name: 'Sun', emails: 80, replies: 7, meetings: 2 },
  ];

  const activeCampaigns = [
    {
      name: 'SaaS Outreach Q4',
      status: 'active',
      leads: 450,
      sent: 320,
      replies: 28,
      replyRate: 8.8,
    },
    {
      name: 'Enterprise Follow-up',
      status: 'active',
      leads: 180,
      sent: 156,
      replies: 15,
      replyRate: 9.6,
    },
    {
      name: 'Product Launch',
      status: 'paused',
      leads: 290,
      sent: 180,
      replies: 12,
      replyRate: 6.7,
    },
  ];

  const aiRecommendations = [
    {
      title: 'Optimize Send Times',
      description: 'Send emails on Tuesdays at 10 AM for 3x higher reply rates',
      impact: 'High Impact',
      confidence: 0.94,
      action: 'Apply Now',
    },
    {
      title: 'Personalize Campaign B',
      description: 'Add dynamic variables to increase engagement by 27%',
      impact: 'Medium Impact',
      confidence: 0.87,
      action: 'Review',
    },
    {
      title: 'Follow Up Hot Leads',
      description: '3 leads with high reply probability need immediate follow-up',
      impact: 'High Impact',
      confidence: 0.91,
      action: 'View Leads',
    },
  ];

  const recentActivity = [
    {
      lead: 'Sarah Chen',
      company: 'TechCorp',
      action: 'replied to email',
      time: '2 min ago',
      type: 'reply',
    },
    {
      lead: 'Michael Torres',
      company: 'InnovateCo',
      action: 'opened email',
      time: '8 min ago',
      type: 'open',
    },
    {
      lead: 'Emily Watson',
      company: 'GrowthLabs',
      action: 'booked a meeting',
      time: '15 min ago',
      type: 'meeting',
    },
    {
      lead: 'David Kim',
      company: 'StartupXYZ',
      action: 'replied to email',
      time: '32 min ago',
      type: 'reply',
    },
  ];

  useEffect(() => {
    getDashboardStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-3">
        {/* Segment-Aware Hero Banner */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-lg p-4 border ${
            isEnterprise
              ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-amber-500/20'
              : isMidmarket
                ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20'
                : 'bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/20'
          }`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-lg ${
                  isEnterprise
                    ? 'bg-amber-500/20'
                    : isMidmarket
                      ? 'bg-purple-500/20'
                      : 'bg-cyan-500/20'
                }`}
              >
                {isEnterprise ? (
                  <Crown className="h-6 w-6 text-amber-400" />
                ) : isMidmarket ? (
                  <Rocket className="h-6 w-6 text-purple-400" />
                ) : (
                  <Bot className="h-6 w-6 text-cyan-400" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{segmentCTA.headline}</h2>
                <p className="text-sm text-slate-400">{segmentCTA.subheadline}</p>
              </div>
            </div>
            <Button
              className={`${
                isEnterprise
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                  : isMidmarket
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'bg-gradient-to-r from-cyan-500 to-purple-500'
              } text-white font-semibold`}
              onClick={() => navigate(segmentCTA.cta.path)}
            >
              {segmentCTA.cta.label}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </motion.div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Dashboard</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <LiveIndicator label="LIVE" />
            <Badge variant="accent" className="gap-2">
              <Sparkles size={14} />
              Ava Active
            </Badge>
          </div>
        </div>

        {/* Customer Impact Sparklines - Plan Specific */}
        {enhancedSparklines.length > 0 && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CustomerImpactSparklines metrics={enhancedSparklines} />
          </motion.div>
        )}

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Live Performance</h2>

        {/* Live Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Mail className="text-blue-600 dark:text-blue-400" size={20} />
                <TrendingUp className="text-green-600" size={16} />
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                <AnimatedCounter end={liveStats.emailsSent} />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Emails Sent</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Activity className="text-green-600 dark:text-green-400" size={20} />
                <TrendingUp className="text-green-600" size={16} />
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                <AnimatedCounter end={liveStats.replyRate} suffix="%" />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Reply Rate</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="text-purple-600 dark:text-purple-400" size={20} />
                <TrendingUp className="text-green-600" size={16} />
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                <AnimatedCounter end={liveStats.meetings} />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Meetings Booked</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Users className="text-orange-600 dark:text-orange-400" size={20} />
                <Activity className="text-blue-600" size={16} />
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                <AnimatedCounter end={liveStats.activeLeads} />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Active Leads</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full mb-4">
            {tabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
                <tab.icon size={16} />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-3">
            <div className="grid lg:grid-cols-2 gap-3">
              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 size={18} />
                    Performance Overview
                  </CardTitle>
                  <CardDescription>Last 7 days activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorReplies" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="emails"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorEmails)"
                      />
                      <Area
                        type="monotone"
                        dataKey="replies"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorReplies)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity size={18} />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest lead interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={`${activity.lead}-${activity.company}-${activity.time}`}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            activity.type === 'meeting'
                              ? 'bg-green-500'
                              : activity.type === 'reply'
                                ? 'bg-blue-500'
                                : 'bg-gray-400'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-white">
                            <span className="font-semibold">{activity.lead}</span> {activity.action}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {activity.company}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Rocket size={18} />
                      Active Campaigns
                    </CardTitle>
                    <CardDescription>Your running outreach campaigns</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => navigate('/campaigns')}>
                    <Play size={14} className="mr-2" />
                    New Campaign
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeCampaigns.map((campaign, index) => (
                    <div
                      key={`${campaign.name}-${campaign.status}-${campaign.leads}`}
                      className="p-4 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-white/5 hover:border-accent-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {campaign.name}
                          </h4>
                          <Badge
                            variant={campaign.status === 'active' ? 'success' : 'default'}
                            className="text-xs"
                          >
                            {campaign.status === 'active' ? (
                              <>
                                <Play size={12} className="mr-1" /> Active
                              </>
                            ) : (
                              <>
                                <Clock size={12} className="mr-1" /> Paused
                              </>
                            )}
                          </Badge>
                        </div>
                        <span
                          className={`text-lg font-bold ${
                            campaign.replyRate > 8 ? 'text-green-600' : 'text-orange-600'
                          }`}
                        >
                          {campaign.replyRate}%
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Leads</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {campaign.leads}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Sent</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {campaign.sent}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Replies</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {campaign.replies}
                          </p>
                        </div>
                      </div>
                      <AnimatedProgress
                        value={Math.round((campaign.sent / campaign.leads) * 100)}
                        color="blue"
                        label="Progress"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-3">
            <div className="grid md:grid-cols-3 gap-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Open Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">
                    34.2%
                  </div>
                  <AnimatedProgress value={34} color="blue" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Above industry avg (28%)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Click Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400 mb-2">
                    12.8%
                  </div>
                  <AnimatedProgress value={13} color="green" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Excellent performance
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-2">
                    6.4%
                  </div>
                  <AnimatedProgress value={6} color="purple" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Meeting to close ratio
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={18} />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="emails" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="replies" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="meetings" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain size={18} className="text-pink-500" />
                  AI-Powered Recommendations
                </CardTitle>
                <CardDescription>Personalized insights from Ava</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiRecommendations.map((rec, index) => (
                    <div
                      key={`${rec.title}-${rec.action}`}
                      className="p-4 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="text-yellow-500" size={18} />
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {rec.title}
                          </h4>
                        </div>
                        <div className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                          <Gauge size={14} />
                          {(rec.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {rec.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="accent" className="text-xs">
                          {rec.impact}
                        </Badge>
                        <Button variant="outline" size="sm" className="gap-2">
                          {rec.action}
                          <ArrowUpRight size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quick Actions Tab */}
          <TabsContent value="actions" className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap size={18} className="text-yellow-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start gap-2"
                      variant="outline"
                      onClick={() => navigate('/campaigns')}
                    >
                      <Rocket size={16} />
                      Create New Campaign
                    </Button>
                    <Button
                      className="w-full justify-start gap-2"
                      variant="outline"
                      onClick={() => navigate('/leads')}
                    >
                      <Users size={16} />
                      Import Leads
                    </Button>
                    <Button
                      className="w-full justify-start gap-2"
                      variant="outline"
                      onClick={() => navigate('/ai-assistant')}
                    >
                      <Sparkles size={16} />
                      Ask Ava AI
                    </Button>
                    <Button
                      className="w-full justify-start gap-2"
                      variant="outline"
                      onClick={() => navigate('/analytics')}
                    >
                      <BarChart3 size={16} />
                      View Full Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target size={18} className="text-blue-500" />
                    Quick Wins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-500/30">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          Follow up with 3 hot leads
                        </p>
                        <Badge variant="default" className="text-xs">
                          High
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                        <CheckCircle2 size={14} />
                        Review Now
                      </Button>
                    </div>

                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-500/30">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          Optimize send times
                        </p>
                        <Badge variant="outline" className="text-xs">
                          Med
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                        <Clock size={14} />
                        Apply Changes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
