import React, { useMemo } from 'react';
import { PerformanceChart } from '../features/PerformanceChart';
import { motion } from 'framer-motion';
import { PageScaffold } from '../components/layout/OperatorShell';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useTenant } from '../contexts/TenantContext';
import { useWorkspaceMetrics } from '../hooks/useWorkspaceMetrics';
import { useReducedMotion } from '../hooks/useMotion';
import {
  KpiFunnelChart,
  ChannelMixChart,
  RoiProjectionChart,
  CustomerImpactSparklines,
} from '../components/analytics';
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
  ArrowDownRight,
  Users,
  Zap,
  Shield,
  BarChart3,
  RefreshCw,
  Activity,
  Layers,
} from 'lucide-react';

const Analytics = () => {
  const { isEnterprise, isStartup } = useTenant();
  const { kpiFunnel, channelMix, roiConfig, sparklines, refresh } = useWorkspaceMetrics();
  const prefersReducedMotion = useReducedMotion();

  // Transform sparklines to include icons
  const enhancedSparklines = useMemo(() => {
    const iconMap = {
      meetings: Users,
      replies: Mail,
      pipeline: TrendingUp,
      timeSaved: Zap,
      efficiency: BarChart3,
      compliance: Shield,
    };
    return sparklines.map(s => ({
      ...s,
      icon: iconMap[s.id] || TrendingUp,
      chartType: 'area',
    }));
  }, [sparklines]);
  // Performance data now handled by PerformanceChart component

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
      // eslint-disable-next-line sonarjs/no-all-duplicated-branches
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
    <PageScaffold
      config={{
        title: 'Analytics & Insights',
        subtitle: isEnterprise
          ? 'Enterprise analytics and compliance reporting'
          : 'Track performance and get AI-powered recommendations',
        badges: [{ label: 'Analytics', color: 'purple' }],
        showInspector: true,
      }}
    >
      {/* Actions Bar - Ops-grade styling */}
      <div className="flex items-center justify-between mb-6 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-slate-900 border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <Calendar size={16} />
            Last 30 Days
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            Compare Period
          </Button>
          {isEnterprise && (
            <Badge
              variant="secondary"
              className="bg-amber-500/10 text-amber-400 border-amber-500/20"
            >
              <Shield size={14} className="mr-1" />
              {/* eslint-disable-next-line sonarjs/no-all-duplicated-branches */}
              SOC 2 Compliant
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={refresh}
            className="gap-2 text-slate-400 hover:text-white"
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-slate-900 border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* Customer Impact Sparklines - Marketing Component */}
      {enhancedSparklines.length > 0 && (
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white uppercase tracking-wider">
                Real-Time Metrics
              </h3>
              <p className="text-xs text-slate-500">Live performance indicators</p>
            </div>
          </div>
          <CustomerImpactSparklines metrics={enhancedSparklines} />
        </motion.div>
      )}

      {/* Key Metrics - Ops-grade layout */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-white uppercase tracking-wider">Core KPIs</h3>
          <p className="text-xs text-slate-500">
            Key performance indicators for the selected period
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          {
            label: 'Total Sent',
            value: '12,453',
            change: '+12.5%',
            trend: 'up',
            icon: Mail,
            color: 'text-cyan-400',
            bgColor: 'bg-cyan-500/10',
            borderColor: 'border-cyan-500/20',
          },
          {
            label: 'Open Rate',
            value: '43.5%',
            change: '+5.2%',
            trend: 'up',
            icon: MousePointerClick,
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20',
          },
          {
            label: 'Reply Rate',
            value: '8.4%',
            change: '+2.3%',
            trend: 'up',
            icon: Target,
            color: 'text-violet-400',
            bgColor: 'bg-violet-500/10',
            borderColor: 'border-violet-500/20',
          },
          {
            label: 'Meetings',
            value: '247',
            change: '+18.0%',
            trend: 'up',
            icon: UserCheck,
            color: 'text-amber-400',
            bgColor: 'bg-amber-500/10',
            borderColor: 'border-amber-500/20',
          },
        ].map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          return (
            <motion.div
              key={metric.id || `metric-${index}`}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-lg border ${metric.bgColor} ${metric.borderColor}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    {metric.label}
                  </p>
                  <p className="text-lg font-bold text-white mb-1">{metric.value}</p>
                  <div
                    className={`flex items-center gap-1 text-xs ${metric.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}
                  >
                    <TrendIcon size={14} />
                    <span className="font-medium">{metric.change}</span>
                  </div>
                </div>
                <div className={`${metric.bgColor} ${metric.color} p-2 rounded-lg`}>
                  <Icon size={20} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Optimization Cards - Enhanced */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            {/* eslint-disable-next-line sonarjs/no-all-duplicated-branches */}
            <h3 className="text-sm font-medium text-white uppercase tracking-wider">
              AI Recommendations
            </h3>
            <p className="text-xs text-slate-500">Data-driven optimization insights</p>
          </div>
        </div>
        <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20">3 New</Badge>
      </div>
      <div className="grid md:grid-cols-3 gap-3 mb-8">
        {aiOptimizations.map((opt, index) => (
          <motion.div
            key={opt.title || `opt-${index}`}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-violet-500/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold text-sm text-white">{opt.title}</h4>
              <span className="text-lg font-bold text-emerald-400">{opt.impact}</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">{opt.description}</p>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-violet-400 hover:text-violet-300 p-0"
            >
              Apply Now
              <ArrowUpRight size={14} />
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Charts Section - Consistent sizing */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
          <Layers className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-white uppercase tracking-wider">
            Pipeline Analysis
          </h3>
          <p className="text-xs text-slate-500">Funnel performance and channel distribution</p>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-3 mb-8">
        {/* KPI Funnel Chart - Marketing Component */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="min-h-[350px]"
        >
          <KpiFunnelChart
            data={kpiFunnel}
            title={isEnterprise ? 'Enterprise Pipeline Funnel' : 'Conversion Funnel'}
          />
        </motion.div>

        {/* Channel Mix Chart - Marketing Component */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="min-h-[350px]"
        >
          <ChannelMixChart data={channelMix} title="Channel Distribution" showLegend={true} />
        </motion.div>
      </div>

      {/* ROI Projection for Startups */}
      {isStartup && (
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              {/* eslint-disable-next-line sonarjs/no-all-duplicated-branches */}
              <h3 className="text-sm font-medium text-white uppercase tracking-wider">
                ROI Projection
              </h3>
              <p className="text-xs text-slate-500">Projected return on investment with Ava</p>
            </div>
          </div>
          <RoiProjectionChart {...roiConfig} title="Your Projected ROI with Ava" />
        </motion.div>
      )}

      {/* Performance Over Time - Using PerformanceChart Component */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <PerformanceChart
          title="Performance Trends"
          description="Weekly activity over the last 6 weeks"
          type="performance"
          days={42}
          height={320}
          showLegend={true}
          className="bg-slate-800/50 border border-slate-700"
        />
      </motion.div>

      {/* Best Performers - Ops-grade styling */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
          <Target className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-white uppercase tracking-wider">
            Top Performers
          </h3>
          <p className="text-xs text-slate-500">Highest performing subject lines by engagement</p>
        </div>
      </div>
      <div className="space-y-3">
        {bestPerformers.map((performer, index) => (
          <motion.div
            key={performer.name || `performer-${index}`}
            initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-slate-600 transition-all"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <p className="font-medium text-white">{performer.subject}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 ml-9">
                <span>
                  Sent: <span className="text-white">{performer.sent}</span>
                </span>
                <span>
                  Open: <span className="text-emerald-400">{performer.openRate}%</span>
                </span>
                <span>
                  Reply: <span className="text-cyan-400">{performer.replyRate}%</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="text-emerald-400" size={18} />
              <Button variant="ghost" size="sm" className="text-violet-400 hover:text-violet-300">
                Use Template
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </PageScaffold>
  );
};

export default Analytics;
