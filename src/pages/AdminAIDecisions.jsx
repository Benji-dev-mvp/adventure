/**
 * AI Decisions Console
 *
 * Enterprise admin page for AI governance and explainability:
 * - View all autonomous AI decisions with explanations
 * - Risk ratings and confidence scores
 * - Override capabilities for human-in-the-loop
 * - Audit trail for compliance
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AIDecisionCard } from '../components/enterprise';
import { useReducedMotion } from '../hooks/useMotion';
import {
  Brain,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  RotateCcw,
  Shield,
  TrendingUp,
  Bot,
  Zap,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
} from 'lucide-react';
import { GlassCard, GlassCardContent, GradientText } from '../components/futuristic';

// Mock AI decisions data
const MOCK_AI_DECISIONS = [
  {
    id: 'dec-001',
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    model: 'Ava GPT-4',
    action: 'lead.auto_qualify',
    resource: { type: 'lead', id: 'lead-8842', name: 'TechCorp - James Wilson' },
    decision: 'Qualified',
    confidence: 0.94,
    risk: 'low',
    explanation:
      'Lead matches ICP criteria: Enterprise company (5000+ employees), correct industry (SaaS), budget signals detected in recent 10-K filing, and engagement score of 85%.',
    factors: [
      { name: 'Company Size', score: 0.95, positive: true },
      { name: 'Industry Match', score: 0.92, positive: true },
      { name: 'Budget Signals', score: 0.88, positive: true },
      { name: 'Engagement', score: 0.85, positive: true },
    ],
    overridden: false,
    approvedBy: null,
  },
  {
    id: 'dec-002',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    model: 'Ava GPT-4',
    action: 'email.auto_send',
    resource: { type: 'sequence', id: 'seq-102', name: 'Enterprise Outreach - Step 3' },
    decision: 'Sent',
    confidence: 0.89,
    risk: 'medium',
    explanation:
      'Follow-up email automatically sent based on optimal timing prediction (Tuesday 10:15 AM recipient timezone) and positive engagement signals from previous touchpoint.',
    factors: [
      { name: 'Timing Optimization', score: 0.91, positive: true },
      { name: 'Previous Engagement', score: 0.87, positive: true },
      { name: 'Subject Line A/B', score: 0.84, positive: true },
    ],
    overridden: false,
    approvedBy: null,
  },
  {
    id: 'dec-003',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    model: 'Ava GPT-4',
    action: 'lead.auto_disqualify',
    resource: { type: 'lead', id: 'lead-9931', name: 'SmallBiz Inc - Mike Chen' },
    decision: 'Disqualified',
    confidence: 0.87,
    risk: 'high',
    explanation:
      'Lead disqualified due to company size (under 50 employees), recent layoff signals, and email bounced after enrichment attempt.',
    factors: [
      { name: 'Company Size', score: 0.12, positive: false },
      { name: 'Financial Signals', score: 0.25, positive: false },
      { name: 'Email Validity', score: 0.0, positive: false },
    ],
    overridden: true,
    approvedBy: 'Sarah Chen',
  },
  {
    id: 'dec-004',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    model: 'Ava GPT-4',
    action: 'reply.auto_categorize',
    resource: { type: 'email', id: 'email-4421', name: 'RE: Partnership Opportunity' },
    decision: 'Interested - Schedule Meeting',
    confidence: 0.96,
    risk: 'low',
    explanation:
      'Reply sentiment analysis indicates strong positive intent. Keywords detected: "interested", "schedule a call", "next week". Auto-tagged for SDR follow-up.',
    factors: [
      { name: 'Sentiment Score', score: 0.98, positive: true },
      { name: 'Intent Keywords', score: 0.95, positive: true },
      { name: 'Response Time', score: 0.92, positive: true },
    ],
    overridden: false,
    approvedBy: null,
  },
  {
    id: 'dec-005',
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
    model: 'Ava GPT-4',
    action: 'campaign.auto_pause',
    resource: { type: 'campaign', id: 'camp-55', name: 'APAC Expansion Q1' },
    decision: 'Paused',
    confidence: 0.78,
    risk: 'high',
    explanation:
      'Campaign auto-paused due to bounce rate exceeding 5% threshold (current: 7.2%). Recommended action: Review email list quality before resuming.',
    factors: [
      { name: 'Bounce Rate', score: 0.28, positive: false },
      { name: 'Spam Reports', score: 0.65, positive: true },
      { name: 'Domain Health', score: 0.72, positive: true },
    ],
    overridden: false,
    approvedBy: null,
  },
];

const RISK_COLORS = {
  low: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
  medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  high: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
};

const ACTION_TYPES = [
  { value: 'all', label: 'All Actions' },
  { value: 'lead.auto_qualify', label: 'Lead Qualification' },
  { value: 'lead.auto_disqualify', label: 'Lead Disqualification' },
  { value: 'email.auto_send', label: 'Auto-Send Email' },
  { value: 'reply.auto_categorize', label: 'Reply Categorization' },
  { value: 'campaign.auto_pause', label: 'Campaign Pause' },
];

const AdminAIDecisions = () => {
  const prefersReducedMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [showOverriddenOnly, setShowOverriddenOnly] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState(null);

  // Filter decisions
  const filteredDecisions = useMemo(() => {
    return MOCK_AI_DECISIONS.filter(d => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matches =
          d.resource.name.toLowerCase().includes(query) ||
          d.decision.toLowerCase().includes(query) ||
          d.explanation.toLowerCase().includes(query);
        if (!matches) return false;
      }

      if (selectedAction !== 'all' && d.action !== selectedAction) return false;
      if (selectedRisk !== 'all' && d.risk !== selectedRisk) return false;
      if (showOverriddenOnly && !d.overridden) return false;

      return true;
    });
  }, [searchQuery, selectedAction, selectedRisk, showOverriddenOnly]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: MOCK_AI_DECISIONS.length,
      lowRisk: MOCK_AI_DECISIONS.filter(d => d.risk === 'low').length,
      mediumRisk: MOCK_AI_DECISIONS.filter(d => d.risk === 'medium').length,
      highRisk: MOCK_AI_DECISIONS.filter(d => d.risk === 'high').length,
      overridden: MOCK_AI_DECISIONS.filter(d => d.overridden).length,
      avgConfidence: Math.round(
        (MOCK_AI_DECISIONS.reduce((acc, d) => acc + d.confidence, 0) / MOCK_AI_DECISIONS.length) *
          100
      ),
    };
  }, []);

  const handleOverride = decision => {
    console.log('Override decision:', decision.id);
    // Would open override modal
  };

  const handleExport = () => {
    console.log('Exporting AI decisions');
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
              <Brain className="h-7 w-7 text-purple-400" />
              <GradientText gradient="aurora">AI Decisions Console</GradientText>
            </h1>
            <p className="text-slate-400 mt-1">
              Monitor, explain, and override autonomous AI decisions
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Shield className="h-4 w-4" />
              AI Policies
            </Button>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-6 gap-4"
        >
          <GlassCard>
            <GlassCardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-white">{stats.total}</div>
              <div className="text-xs text-slate-400">Total Decisions</div>
            </GlassCardContent>
          </GlassCard>
          <GlassCard>
            <GlassCardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-400">{stats.lowRisk}</div>
              <div className="text-xs text-slate-400">Low Risk</div>
            </GlassCardContent>
          </GlassCard>
          <GlassCard>
            <GlassCardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-amber-400">{stats.mediumRisk}</div>
              <div className="text-xs text-slate-400">Medium Risk</div>
            </GlassCardContent>
          </GlassCard>
          <GlassCard>
            <GlassCardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-red-400">{stats.highRisk}</div>
              <div className="text-xs text-slate-400">High Risk</div>
            </GlassCardContent>
          </GlassCard>
          <GlassCard>
            <GlassCardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-400">{stats.overridden}</div>
              <div className="text-xs text-slate-400">Overridden</div>
            </GlassCardContent>
          </GlassCard>
          <GlassCard>
            <GlassCardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-cyan-400">{stats.avgConfidence}%</div>
              <div className="text-xs text-slate-400">Avg Confidence</div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard>
            <GlassCardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search decisions..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    value={selectedAction}
                    onChange={e => setSelectedAction(e.target.value)}
                    className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                  >
                    {ACTION_TYPES.map(a => (
                      <option key={a.value} value={a.value}>
                        {a.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedRisk}
                    onChange={e => setSelectedRisk(e.target.value)}
                    className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">All Risks</option>
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                  </select>

                  <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showOverriddenOnly}
                      onChange={e => setShowOverriddenOnly(e.target.checked)}
                      className="rounded border-slate-600 bg-slate-800 text-purple-500 focus:ring-purple-500"
                    />
                    Overridden Only
                  </label>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* Decisions List */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredDecisions.map((decision, index) => (
            <motion.div
              key={decision.id}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <AIDecisionCard
                decision={decision}
                onOverride={() => handleOverride(decision)}
                onViewDetails={() => setSelectedDecision(decision)}
              />
            </motion.div>
          ))}

          {filteredDecisions.length === 0 && (
            <GlassCard>
              <GlassCardContent className="p-12 text-center">
                <Brain className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                <h3 className="text-lg font-semibold text-white mb-2">No Decisions Found</h3>
                <p className="text-slate-400">No AI decisions match your current filters.</p>
              </GlassCardContent>
            </GlassCard>
          )}
        </motion.div>

        {/* AI Governance Notice */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-start gap-4">
            <Bot className="h-6 w-6 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-purple-400 mb-1">AI Governance</h4>
              <p className="text-sm text-slate-300">
                All AI decisions are logged for compliance. High-risk decisions trigger human review
                alerts. Configure AI autonomy levels and approval workflows in{' '}
                <a
                  href="/admin/ai-policies"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  AI Policies
                </a>
                .
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAIDecisions;
