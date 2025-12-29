import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Target,
  Mail,
  TrendingUp,
  Users,
  Zap,
  Brain,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer,
} from 'recharts';

// Mock data for Ava's daily activity
const MOCK_AVA_SUMMARY = {
  date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
  highlights: [
    { id: 1, metric: 'Leads Scored', value: 156, change: '+23', trend: 'up', icon: Target },
    { id: 2, metric: 'Emails Drafted', value: 89, change: '+12', trend: 'up', icon: Mail },
    { id: 3, metric: 'Sequences Optimized', value: 3, change: '0', trend: 'neutral', icon: TrendingUp },
    { id: 4, metric: 'Insights Generated', value: 12, change: '+4', trend: 'up', icon: Brain },
  ],
  actions: [
    {
      id: 1,
      type: 'scoring',
      title: 'Scored 156 leads',
      description: '23 marked as hot (score 80+), ready for outreach',
      time: '2 hours ago',
      actionable: true,
      actionLabel: 'View Hot Leads',
      actionRoute: '/leads?filter=hot',
    },
    {
      id: 2,
      type: 'optimization',
      title: 'Optimized send times',
      description: 'Updated delivery windows for 3 campaigns based on engagement',
      time: '4 hours ago',
      actionable: false,
    },
    {
      id: 3,
      type: 'drafting',
      title: 'Drafted 89 personalized emails',
      description: 'Used company news and recent activity for personalization',
      time: '5 hours ago',
      actionable: true,
      actionLabel: 'Review Drafts',
      actionRoute: '/templates?filter=drafts',
    },
    {
      id: 4,
      type: 'insight',
      title: 'Identified high-intent signals',
      description: '7 leads visited pricing page multiple times this week',
      time: '6 hours ago',
      actionable: true,
      actionLabel: 'View Leads',
      actionRoute: '/leads?filter=high-intent',
    },
    {
      id: 5,
      type: 'suggestion',
      title: 'A/B test recommendation',
      description: 'Subject line variant showing 23% higher open rate',
      time: '8 hours ago',
      actionable: true,
      actionLabel: 'Apply Change',
      actionRoute: '/ab-testing',
    },
  ],
  sparklineData: [
    { value: 45 }, { value: 52 }, { value: 48 }, { value: 61 },
    { value: 55 }, { value: 67 }, { value: 72 }, { value: 68 },
    { value: 82 }, { value: 78 }, { value: 91 }, { value: 89 },
  ],
  weeklyStats: {
    leadsScored: 847,
    emailsDrafted: 412,
    meetingsInfluenced: 28,
    revenueInfluenced: '$142,500',
  },
};

const MiniSparkline = ({ data, color = '#06b6d4' }) => (
  <div className="w-20 h-8">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill="url(#sparklineGradient)"
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const ActionItem = ({ action, onAction }) => {
  const typeColors = {
    scoring: 'bg-purple-500/20 text-purple-500',
    optimization: 'bg-cyan-500/20 text-cyan-500',
    drafting: 'bg-blue-500/20 text-blue-500',
    insight: 'bg-amber-500/20 text-amber-500',
    suggestion: 'bg-green-500/20 text-green-500',
  };

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-white/5 last:border-0">
      <div className={cn("p-2 rounded-lg shrink-0", typeColors[action.type])}>
        <CheckCircle2 className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{action.title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{action.description}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-gray-400">{action.time}</span>
          {action.actionable && (
            <button
              onClick={() => onAction(action.actionRoute)}
              className="text-xs text-accent-500 hover:text-accent-600 font-medium flex items-center gap-1"
            >
              {action.actionLabel}
              <ArrowUpRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const AvaDailySummary = ({ className, variant = 'full' }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const summary = MOCK_AVA_SUMMARY;

  const handleAction = (route) => {
    navigate(route);
  };

  if (variant === 'compact') {
    return (
      <div className={cn("bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-cyan-500/10 rounded-2xl border border-purple-500/20 p-4", className)}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Ava's Daily Summary</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{summary.date}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {summary.highlights.slice(0, 4).map((highlight) => (
            <div key={highlight.id} className="bg-white/50 dark:bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <highlight.icon className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">{highlight.metric}</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold text-gray-900 dark:text-white">{highlight.value}</span>
                {highlight.change !== '0' && (
                  <span className={cn(
                    "text-xs font-medium",
                    highlight.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  )}>
                    {highlight.change}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-3"
          onClick={() => navigate('/ava')}
        >
          View Full Summary
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-cyan-500/10 rounded-2xl border border-purple-500/20",
        className
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-purple-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/25">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                What Ava Did For You Today
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{summary.date}</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {summary.highlights.map((highlight) => (
            <div key={highlight.id} className="bg-white/50 dark:bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <highlight.icon className="h-5 w-5 text-gray-400" />
                <MiniSparkline data={summary.sparklineData} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{highlight.value}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">{highlight.metric}</span>
                {highlight.change !== '0' && (
                  <span className={cn(
                    "text-xs font-medium",
                    highlight.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  )}>
                    {highlight.change} today
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Actions List */}
            <div className="p-6 border-b border-purple-500/10">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                Today's Actions
              </h3>
              <div className="max-h-64 overflow-y-auto">
                {summary.actions.map((action) => (
                  <ActionItem key={action.id} action={action} onAction={handleAction} />
                ))}
              </div>
            </div>

            {/* Weekly Stats */}
            <div className="p-6 bg-white/30 dark:bg-white/5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-cyan-500" />
                This Week's Impact
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.weeklyStats.leadsScored}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Leads Scored</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.weeklyStats.emailsDrafted}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Emails Drafted</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.weeklyStats.meetingsInfluenced}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Meetings Influenced</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-500">{summary.weeklyStats.revenueInfluenced}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Revenue Influenced</p>
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="p-4 flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Want Ava to do more? <button onClick={() => navigate('/ava/playbooks')} className="text-accent-500 hover:underline">Configure playbooks →</button>
              </p>
              <Button onClick={() => navigate('/ava')}>
                <Sparkles className="h-4 w-4 mr-2" />
                Open Ava
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AvaDailySummary;
