import React, { useMemo } from 'react';
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
import { BarChart } from 'recharts/es6/chart/BarChart.js';
import { Bar } from 'recharts/es6/cartesian/Bar.js';
import { LineChart } from 'recharts/es6/chart/LineChart.js';
import { Line } from 'recharts/es6/cartesian/Line.js';
import { PieChart } from 'recharts/es6/chart/PieChart.js';
import { Pie } from 'recharts/es6/polar/Pie.js';
import { Cell } from 'recharts/es6/component/Cell.js';
import { AreaChart } from 'recharts/es6/chart/AreaChart.js';
import { Area } from 'recharts/es6/cartesian/Area.js';
import { XAxis } from 'recharts/es6/cartesian/XAxis.js';
import { YAxis } from 'recharts/es6/cartesian/YAxis.js';
import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid.js';
import { Tooltip } from 'recharts/es6/component/Tooltip.js';
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer.js';
import { Legend } from 'recharts/es6/component/Legend.js';
import { FunnelChart } from 'recharts/es6/chart/FunnelChart.js';
import { Funnel } from 'recharts/es6/cartesian/Funnel.js';

/**
 * Section Header Component for ops-grade organization
 */
const SectionHeader = ({ icon: Icon, title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-violet-400" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-white uppercase tracking-wider">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
    </div>
    {action}
  </div>
);

const Analytics = () => {
  const { plan, isEnterprise, isMidmarket, isStartup } = useTenant();
  const { metrics, isLoading, kpiFunnel, channelMix, roiConfig, sparklines, summary, refresh } =
    useWorkspaceMetrics();
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
  const performanceData = [
    { week: 'Week 1', sent: 1200, opened: 480, replied: 96 },
    { week: 'Week 2', sent: 1450, opened: 595, replied: 119 },
    { week: 'Week 3', sent: 1680, opened: 689, replied: 138 },
    { week: 'Week 4', sent: 1890, opened: 775, replied: 155 },
    { week: 'Week 5', sent: 2100, opened: 861, replied: 172 },
    { week: 'Week 6', sent: 2340, opened: 960, replied: 192 },
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
          <SectionHeader
            icon={Activity}
            title="Real-Time Metrics"
            subtitle="Live performance indicators"
          />
          <CustomerImpactSparklines metrics={enhancedSparklines} />
        </motion.div>
      )}

      {/* Key Metrics - Ops-grade layout */}
      <SectionHeader
        icon={BarChart3}
        title="Core KPIs"
        subtitle="Key performance indicators for the selected period"
      />
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
              key={index}
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
      <SectionHeader
        icon={Sparkles}
        title="AI Recommendations"
        subtitle="Data-driven optimization insights"
        action={
          <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20">3 New</Badge>
        }
      />
      <div className="grid md:grid-cols-3 gap-3 mb-8">
        {aiOptimizations.map((opt, index) => (
          <motion.div
            key={index}
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
      <SectionHeader
        icon={Layers}
        title="Pipeline Analysis"
        subtitle="Funnel performance and channel distribution"
      />
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
          <SectionHeader
            icon={TrendingUp}
            title="ROI Projection"
            subtitle="Projected return on investment with Ava"
          />
          <RoiProjectionChart {...roiConfig} title="Your Projected ROI with Ava" />
        </motion.div>
      )}

      {/* Performance Over Time - Ops-grade styling */}
      <SectionHeader
        icon={TrendingUp}
        title="Performance Trends"
        subtitle="Weekly activity over the last 6 weeks"
      />
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-8">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sent"
                stroke="#06b6d4"
                strokeWidth={2}
                name="Sent"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="opened"
                stroke="#10b981"
                strokeWidth={2}
                name="Opened"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="replied"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Replied"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Best Performers - Ops-grade styling */}
      <SectionHeader
        icon={Target}
        title="Top Performers"
        subtitle="Highest performing subject lines by engagement"
      />
      <div className="space-y-3">
        {bestPerformers.map((performer, index) => (
          <motion.div
            key={index}
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
