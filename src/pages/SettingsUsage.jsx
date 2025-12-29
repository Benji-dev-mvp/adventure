/**
 * Usage & Quotas Page
 * 
 * Settings page for viewing usage metrics and plan limits:
 * - AI tokens usage
 * - Email volume
 * - Contact enrichment
 * - Active campaigns
 * - Seat allocation
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { UsageBar } from '../components/enterprise';
import { useUsageQuotas } from '../hooks/useEnterprise';
import { useTenant } from '../contexts/TenantContext';
import { useReducedMotion } from '../hooks/useMotion';
import { 
  BarChart3, 
  Zap, 
  Mail, 
  Users, 
  Target,
  Database,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  Calendar,
  RefreshCw,
  Download,
  CreditCard,
  Clock
} from 'lucide-react';
import { GlassCard, GlassCardContent, GradientText, GlowButton } from '../components/futuristic';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock usage history
const USAGE_HISTORY = {
  aiTokens: [
    { date: 'Week 1', used: 150000 },
    { date: 'Week 2', used: 220000 },
    { date: 'Week 3', used: 180000 },
    { date: 'Week 4', used: 297000 },
  ],
  emails: [
    { date: 'Week 1', used: 5200 },
    { date: 'Week 2', used: 6800 },
    { date: 'Week 3', used: 5500 },
    { date: 'Week 4', used: 7000 },
  ]
};

const SettingsUsage = () => {
  const prefersReducedMotion = useReducedMotion();
  const { usage, warnings, isNearLimit, getUsagePercent } = useUsageQuotas();
  const { plan, planDisplay } = useTenant();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('aiTokens');

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1000));
    setRefreshing(false);
  };

  // Usage metrics config
  const usageMetrics = [
    {
      key: 'aiTokens',
      label: 'AI Tokens',
      icon: Zap,
      color: 'purple',
      description: 'GPT-4 tokens used for AI operations',
      resetPeriod: 'Monthly'
    },
    {
      key: 'emailsSent',
      label: 'Emails Sent',
      icon: Mail,
      color: 'cyan',
      description: 'Outbound emails sent this billing cycle',
      resetPeriod: 'Monthly'
    },
    {
      key: 'contactsEnriched',
      label: 'Contacts Enriched',
      icon: Database,
      color: 'green',
      description: 'Lead enrichment credits used',
      resetPeriod: 'Monthly'
    },
    {
      key: 'activeCampaigns',
      label: 'Active Campaigns',
      icon: Target,
      color: 'orange',
      description: 'Concurrent active campaigns',
      resetPeriod: 'No reset'
    },
    {
      key: 'seats',
      label: 'Team Seats',
      icon: Users,
      color: 'blue',
      description: 'Active team member seats',
      resetPeriod: 'No reset'
    }
  ];

  const billingInfo = {
    plan: planDisplay,
    nextBilling: 'January 15, 2025',
    amount: plan === 'enterprise' ? 'Custom' : plan === 'midmarket' ? '$999/mo' : '$299/mo'
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <BarChart3 className="h-7 w-7 text-cyan-400" />
              <GradientText gradient="cyber">Usage & Quotas</GradientText>
            </h1>
            <p className="text-slate-400 mt-1">
              Monitor your plan usage and resource consumption
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </motion.div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="space-y-2"
          >
            {warnings.map((warning, i) => {
              const metricLabel = usageMetrics.find(m => m.key === warning.key)?.label || warning.key;
              return (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-4"
                >
                  <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-amber-200">
                      {warning.atLimit 
                        ? `${metricLabel} limit reached (${warning.used.toLocaleString()} / ${warning.limit.toLocaleString()})` 
                        : `${metricLabel} usage at ${warning.percent}% (${warning.used.toLocaleString()} / ${warning.limit.toLocaleString()})`
                      }
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="text-amber-400 border-amber-500/50">
                    Upgrade Plan
                  </Button>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Plan Info */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard variant="gradient">
            <GlassCardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">{billingInfo.plan} Plan</h2>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <p className="text-slate-400 text-sm">
                      Next billing: {billingInfo.nextBilling} • {billingInfo.amount}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Clock className="h-4 w-4" />
                    Billing History
                  </Button>
                  <GlowButton className="gap-2">
                    <ArrowUpRight className="h-4 w-4" />
                    Upgrade Plan
                  </GlowButton>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* Usage Bars */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard>
            <GlassCardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Current Usage</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {usageMetrics.map((metric, i) => {
                  const data = usage[metric.key];
                  if (!data) return null;
                  
                  const Icon = metric.icon;
                  const percent = getUsagePercent(metric.key);
                  const nearLimit = isNearLimit(metric.key);
                  
                  return (
                    <motion.div
                      key={metric.key}
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                      animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className={`p-4 rounded-lg border ${
                        nearLimit 
                          ? 'bg-amber-500/5 border-amber-500/30' 
                          : 'bg-slate-800/30 border-slate-700/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-${metric.color}-500/20`}>
                            <Icon className={`h-5 w-5 text-${metric.color}-400`} />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{metric.label}</h4>
                            <p className="text-xs text-slate-400">{metric.description}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {metric.resetPeriod}
                        </Badge>
                      </div>
                      
                      <UsageBar
                        label=""
                        used={data.used}
                        limit={data.limit}
                        showTrend={true}
                        trend={data.trend}
                      />
                      
                      <div className="flex justify-between mt-2 text-xs">
                        <span className="text-slate-400">
                          {data.used.toLocaleString()} / {data.limit.toLocaleString()}
                        </span>
                        <span className={`font-medium ${
                          percent >= 90 ? 'text-red-400' :
                          percent >= 75 ? 'text-amber-400' : 'text-slate-400'
                        }`}>
                          {percent}% used
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* Usage Trends Chart */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard>
            <GlassCardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Usage Trends</h3>
                <div className="flex items-center gap-2">
                  {['aiTokens', 'emails'].map(key => (
                    <button
                      key={key}
                      onClick={() => setSelectedMetric(key)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedMetric === key
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {key === 'aiTokens' ? 'AI Tokens' : 'Emails'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={USAGE_HISTORY[selectedMetric]}>
                    <defs>
                      <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [value.toLocaleString(), selectedMetric === 'aiTokens' ? 'Tokens' : 'Emails']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="used" 
                      stroke="#06b6d4" 
                      strokeWidth={2}
                      fill="url(#usageGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* Plan Limits Info */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-4">
            <TrendingUp className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-cyan-400 mb-1">Need Higher Limits?</h4>
              <p className="text-sm text-slate-300">
                Upgrade your plan to increase quotas or contact sales for custom enterprise limits. 
                All unused credits roll over to the next billing cycle.{' '}
                <a href="/pricing" className="text-cyan-400 hover:text-cyan-300 underline">
                  View plan comparison
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsUsage;
