import React, { useState, useEffect } from 'react';
import { PageScaffold } from '../components/layout/OperatorShell';
import { Card, CardContent } from '../components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Activity,
  Users,
  Mail,
  Calendar,
  Sparkles,
  Brain,
  Zap,
  BarChart3,
  Rocket,
  Target,
  DollarSign,
  RefreshCw,
  Shield,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { useSegmentExperience, useSegmentKpis } from '../hooks/useSegmentExperience';
import { useTenant } from '../contexts/TenantContext';
import { cn } from '../lib/utils';
import {
  AdvancedMetricCard,
  RealTimeActivityStream,
  AdvancedPerformanceChart,
  ConversionFunnel,
  AIInsightsCard,
  RevenuePipelineChart,
} from '../components/dashboard/AdvancedVisualizations';
import CampaignsTab from '../components/dashboard/CampaignsTab';
import AnalyticsTab from '../components/dashboard/AnalyticsTab';
import QuickActionsTab from '../components/dashboard/QuickActionsTab';

// Segment Badge Component
const SegmentBadge = ({ plan }) => {
  const styles = {
    startup: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    midmarket: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    enterprise: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };

  const labels = {
    startup: 'Startup',
    midmarket: 'Midmarket',
    enterprise: 'Enterprise',
  };

  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded-full text-xs font-medium border',
        styles[plan] || styles.startup
      )}
    >
      {labels[plan] || 'Startup'}
    </span>
  );
};

// Live Indicator Component
const LiveIndicator = ({ label = 'LIVE' }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
    </span>
    <span className="text-xs font-bold text-red-500 tracking-wider">{label}</span>
  </div>
);

const EnhancedDashboardPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Segment-aware configuration
  const { plan, isDemo, isAdmin, tenant } = useTenant();
  const segmentExperience = useSegmentExperience();
  const segmentKpis = useSegmentKpis();

  // Live metrics with real-time updates
  const [liveMetrics, setLiveMetrics] = useState({
    emailsSent: 12453,
    replyRate: 8.4,
    meetings: 47,
    activeLeads: 1284,
    revenue: 284500,
    conversionRate: 3.2,
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        emailsSent: prev.emailsSent + Math.floor(Math.random() * 15),
        replyRate: Math.max(5, Math.min(12, prev.replyRate + (Math.random() - 0.5) * 0.3)),
        meetings: prev.meetings + (Math.random() > 0.85 ? 1 : 0),
        activeLeads: prev.activeLeads + Math.floor(Math.random() * 8) - 3,
        revenue: prev.revenue + Math.floor(Math.random() * 5000),
        conversionRate: Math.max(2, Math.min(5, prev.conversionRate + (Math.random() - 0.5) * 0.2)),
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Sparkline data for metric cards
  const emailSparkline = [
    { value: 320 },
    { value: 380 },
    { value: 450 },
    { value: 510 },
    { value: 490 },
    { value: 520 },
    { value: 580 },
  ];

  const replySparkline = [
    { value: 7.2 },
    { value: 7.8 },
    { value: 8.1 },
    { value: 8.4 },
    { value: 8.2 },
    { value: 8.6 },
    { value: 8.9 },
  ];

  const meetingSparkline = [
    { value: 8 },
    { value: 12 },
    { value: 15 },
    { value: 18 },
    { value: 16 },
    { value: 19 },
    { value: 22 },
  ];

  const leadSparkline = [
    { value: 1100 },
    { value: 1150 },
    { value: 1180 },
    { value: 1220 },
    { value: 1240 },
    { value: 1260 },
    { value: 1284 },
  ];

  const revenueSparkline = [
    { value: 220000 },
    { value: 235000 },
    { value: 248000 },
    { value: 256000 },
    { value: 265000 },
    { value: 275000 },
    { value: 284500 },
  ];

  const conversionSparkline = [
    { value: 2.8 },
    { value: 2.9 },
    { value: 3.0 },
    { value: 3.1 },
    { value: 3.0 },
    { value: 3.2 },
    { value: 3.4 },
  ];

  // Performance data for charts
  const performanceData = [
    { name: 'Mon', emails: 320, replies: 25, meetings: 8, revenue: 12000 },
    { name: 'Tue', emails: 380, replies: 32, meetings: 12, revenue: 18000 },
    { name: 'Wed', emails: 450, replies: 38, meetings: 15, revenue: 22000 },
    { name: 'Thu', emails: 510, replies: 42, meetings: 18, revenue: 28000 },
    { name: 'Fri', emails: 490, replies: 40, meetings: 16, revenue: 24000 },
    { name: 'Sat', emails: 120, replies: 10, meetings: 3, revenue: 6000 },
    { name: 'Sun', emails: 80, replies: 7, meetings: 2, revenue: 4000 },
  ];

  // Conversion funnel data
  const funnelData = [
    { stage: 'Total Leads', count: 5420, percentage: 100 },
    { stage: 'Email Opened', count: 3250, percentage: 60 },
    { stage: 'Replied', count: 892, percentage: 16.5 },
    { stage: 'Meeting Booked', count: 247, percentage: 4.6 },
    { stage: 'Qualified', count: 156, percentage: 2.9 },
    { stage: 'Closed Won', count: 47, percentage: 0.9 },
  ];

  // Revenue pipeline data
  const pipelineData = [
    { name: 'Discovery', value: 125000 },
    { name: 'Qualification', value: 98000 },
    { name: 'Proposal', value: 156000 },
    { name: 'Negotiation', value: 84500 },
    { name: 'Closed Won', value: 235000 },
  ];

  // Recent activity stream
  const recentActivities = [
    {
      lead: 'Sarah Chen',
      company: 'TechCorp',
      action: 'replied to email',
      time: '2 min ago',
      type: 'reply',
      isHot: true,
    },
    {
      lead: 'Michael Torres',
      company: 'InnovateCo',
      action: 'opened email',
      time: '8 min ago',
      type: 'email',
    },
    {
      lead: 'Emily Watson',
      company: 'GrowthLabs',
      action: 'booked a meeting',
      time: '15 min ago',
      type: 'meeting',
      isHot: true,
    },
    {
      lead: 'David Kim',
      company: 'StartupXYZ',
      action: 'replied to email',
      time: '32 min ago',
      type: 'reply',
    },
    {
      lead: 'Jessica Lee',
      company: 'DataFlow Inc',
      action: 'clicked link',
      time: '45 min ago',
      type: 'email',
    },
    {
      lead: 'Robert Martinez',
      company: 'CloudScale',
      action: 'scheduled call',
      time: '1 hour ago',
      type: 'call',
      isHot: true,
    },
    {
      lead: 'Amanda Foster',
      company: 'AI Solutions',
      action: 'viewed proposal',
      time: '1 hour ago',
      type: 'linkedin',
    },
    {
      lead: 'James Wilson',
      company: 'FinTech Pro',
      action: 'replied to LinkedIn',
      time: '2 hours ago',
      type: 'linkedin',
    },
  ];

  // AI insights
  const aiInsights = [
    {
      title: 'Optimize Send Times',
      description:
        'Send emails on Tuesdays at 10 AM for 3x higher reply rates based on your audience behavior',
      impact: 'High Impact',
      confidence: 0.94,
      action: 'Apply Now',
    },
    {
      title: 'Personalize Subject Lines',
      description: 'Add {company_name} variable to increase open rates by 27% across all campaigns',
      impact: 'High Impact',
      confidence: 0.89,
      action: 'Review',
    },
    {
      title: 'Follow Up Hot Leads',
      description:
        '8 leads with high reply probability need immediate follow-up within next 24 hours',
      impact: 'High Impact',
      confidence: 0.91,
      action: 'View Leads',
    },
    {
      title: 'A/B Test Email Templates',
      description: 'Template B shows 15% better performance - consider switching for Campaign X',
      impact: 'Medium Impact',
      confidence: 0.82,
      action: 'View Details',
    },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.info('Refreshing dashboard data...');

    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Dashboard updated!');
    }, 1500);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'campaigns', label: 'Campaigns', icon: Rocket },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai-insights', label: 'AI Insights', icon: Brain },
    { id: 'actions', label: 'Quick Actions', icon: Zap },
  ];

  return (
    <PageScaffold
      config={{
        title: 'Sales Dashboard',
        subtitle: 'Real-time performance metrics and insights',
        badges: [{ label: segmentExperience.label, color: plan }],
        showInspector: true,
      }}
    >
      <div className="space-y-3">
        {/* Segment-aware Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1
                className={cn(
                  'text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent',
                  plan === 'enterprise'
                    ? 'from-amber-500 to-orange-500'
                    : plan === 'midmarket'
                      ? 'from-purple-500 to-pink-500'
                      : 'from-cyan-600 to-purple-600'
                )}
              >
                {segmentExperience.title}
              </h1>
              <SegmentBadge plan={plan} />
              {isDemo && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Demo Organization
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{segmentExperience.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              Refresh
            </Button>
            <LiveIndicator label="LIVE" />
            <Badge variant="accent" className="gap-2">
              <Sparkles size={14} />
              Ava Active
            </Badge>
          </div>
        </div>

        {/* Segment Hero Message */}
        {plan === 'enterprise' && (
          <div className="rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-400">Enterprise Control Active</p>
                <p className="text-xs text-slate-400">{segmentExperience.heroMessage}</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-slate-500">System Health:</span>
                <span className="text-sm font-bold text-green-400">99.2%</span>
              </div>
            </div>
          </div>
        )}

        {plan === 'startup' && (
          <div className="rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Zap className="h-5 w-5 text-cyan-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-cyan-400">Automation Active</p>
                <p className="text-xs text-slate-400">{segmentExperience.heroMessage}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/ava')}
                className="gap-2"
              >
                <Brain size={14} />
                Open Ava BDR
              </Button>
            </div>
          </div>
        )}

        {/* Live Performance Metrics - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <AdvancedMetricCard
            title="Emails Sent"
            value={liveMetrics.emailsSent.toLocaleString()}
            change="+12.5%"
            changeType="increase"
            icon={Mail}
            gradient="blue"
            sparklineData={emailSparkline}
            subtitle="vs. last week"
            target={15000}
            targetLabel="Weekly Goal"
          />

          <AdvancedMetricCard
            title="Reply Rate"
            value={`${liveMetrics.replyRate.toFixed(1)}%`}
            change="+2.3%"
            changeType="increase"
            icon={Activity}
            gradient="green"
            sparklineData={replySparkline}
            subtitle="Industry avg: 6.2%"
          />

          <AdvancedMetricCard
            title="Meetings Booked"
            value={liveMetrics.meetings}
            change="+8"
            changeType="increase"
            icon={Calendar}
            gradient="purple"
            sparklineData={meetingSparkline}
            subtitle="This week"
            target={60}
            targetLabel="Monthly Goal"
          />

          <AdvancedMetricCard
            title="Active Leads"
            value={liveMetrics.activeLeads.toLocaleString()}
            change="+156"
            changeType="increase"
            icon={Users}
            gradient="orange"
            sparklineData={leadSparkline}
            subtitle="Engaged in last 7 days"
          />

          <AdvancedMetricCard
            title="Pipeline Revenue"
            value={`$${(liveMetrics.revenue / 1000).toFixed(1)}K`}
            change="+18.2%"
            changeType="increase"
            icon={DollarSign}
            gradient="pink"
            sparklineData={revenueSparkline}
            subtitle="Q4 2025"
            target={500000}
            targetLabel="Quarterly Target"
          />

          <AdvancedMetricCard
            title="Conversion Rate"
            value={`${liveMetrics.conversionRate.toFixed(1)}%`}
            change="+0.4%"
            changeType="increase"
            icon={Target}
            gradient="cyan"
            sparklineData={conversionSparkline}
            subtitle="Lead to customer"
          />
        </div>

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full mb-6">
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
              {/* Advanced Performance Chart */}
              <AdvancedPerformanceChart
                data={performanceData}
                title="Performance Overview - Last 7 Days"
              />

              {/* Real-time Activity Stream */}
              <RealTimeActivityStream activities={recentActivities} />
            </div>

            <div className="grid lg:grid-cols-2 gap-3">
              {/* Conversion Funnel */}
              <ConversionFunnel data={funnelData} />

              {/* Revenue Pipeline */}
              <RevenuePipelineChart data={pipelineData} />
            </div>

            {/* AI Insights Section */}
            <AIInsightsCard insights={aiInsights} />

            {/* Quick Actions */}
            <div className="grid md:grid-cols-4 gap-3">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-200 dark:border-cyan-500/30">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-9 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Rocket size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">New Campaign</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Launch outreach</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-500/30">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-9 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Find Leads</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Search 300M+ contacts</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-500/30">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-9 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Brain size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Ask Ava</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">AI assistant</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-500/30">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-9 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BarChart3 size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Analytics</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Detailed reports</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs - now functional */}
          <TabsContent value="campaigns" className="space-y-3">
            <CampaignsTab onNavigateToCampaign={id => navigate(`/campaigns/${id}`)} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-3">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-3">
            <AIInsightsCard insights={aiInsights} />
          </TabsContent>

          <TabsContent value="actions" className="space-y-3">
            <QuickActionsTab aiInsights={aiInsights} />
          </TabsContent>
        </Tabs>
      </div>
    </PageScaffold>
  );
};

export default EnhancedDashboardPage;
