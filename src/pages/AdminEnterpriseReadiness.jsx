/**
 * Enterprise Readiness Dashboard
 *
 * Self-diagnostic meta page showing enterprise deployment readiness:
 * - Security & Compliance readiness
 * - Data Governance status
 * - Reliability & DR readiness
 * - Observability coverage
 * - Team & Process maturity
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SecurityStatusCard } from '../components/enterprise';
import { useSecurityStatus } from '../hooks/useEnterprise';
import { useReducedMotion } from '../hooks/useMotion';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Lock,
  Database,
  Activity,
  Users,
  FileCheck,
  Server,
  Zap,
  RefreshCw,
  Download,
  ExternalLink,
} from 'lucide-react';
import { GlassCard, GlassCardContent, GradientText, GlowButton } from '../components/futuristic';

// Readiness categories with items
const READINESS_CATEGORIES = [
  {
    id: 'security',
    name: 'Security & Access',
    icon: Lock,
    color: 'from-red-500 to-orange-500',
    items: [
      { id: 'sso', name: 'SSO Enabled', status: 'complete', link: '/settings/security' },
      { id: 'mfa', name: 'MFA Enforced', status: 'complete', link: '/settings/security' },
      { id: 'scim', name: 'SCIM Provisioning', status: 'complete', link: '/settings/security' },
      { id: 'rbac', name: 'RBAC Configured', status: 'complete', link: '/admin/access-control' },
      { id: 'audit', name: 'Audit Logging', status: 'complete', link: '/admin/audit-log' },
      {
        id: 'ip_allowlist',
        name: 'IP Allowlisting',
        status: 'incomplete',
        link: '/settings/security',
      },
    ],
  },
  {
    id: 'data',
    name: 'Data Governance',
    icon: Database,
    color: 'from-blue-500 to-cyan-500',
    items: [
      { id: 'residency', name: 'Data Residency', status: 'complete', link: '/settings/data' },
      { id: 'encryption', name: 'Encryption at Rest', status: 'complete', link: '/settings/data' },
      { id: 'dlp', name: 'DLP Policies', status: 'incomplete', link: '/settings/data' },
      { id: 'retention', name: 'Retention Policies', status: 'complete', link: '/settings/data' },
      { id: 'export', name: 'Data Export', status: 'complete', link: '/settings/data' },
    ],
  },
  {
    id: 'reliability',
    name: 'Reliability & DR',
    icon: Server,
    color: 'from-green-500 to-emerald-500',
    items: [
      { id: 'sla', name: 'SLA Agreement', status: 'complete', link: '/settings/plan' },
      { id: 'backup', name: 'Automated Backups', status: 'complete', link: '/admin/observability' },
      { id: 'dr', name: 'Disaster Recovery', status: 'complete', link: '/admin/observability' },
      { id: 'failover', name: 'Auto-Failover', status: 'incomplete', link: '/admin/observability' },
      { id: 'status_page', name: 'Status Page', status: 'complete', link: '/admin/observability' },
    ],
  },
  {
    id: 'observability',
    name: 'Observability',
    icon: Activity,
    color: 'from-purple-500 to-pink-500',
    items: [
      { id: 'metrics', name: 'System Metrics', status: 'complete', link: '/admin/observability' },
      {
        id: 'ai_decisions',
        name: 'AI Decision Logs',
        status: 'complete',
        link: '/admin/ai-decisions',
      },
      { id: 'slo', name: 'SLO Monitoring', status: 'complete', link: '/admin/observability' },
      { id: 'alerts', name: 'Alert Rules', status: 'incomplete', link: '/admin/observability' },
      {
        id: 'tracing',
        name: 'Distributed Tracing',
        status: 'incomplete',
        link: '/admin/observability',
      },
    ],
  },
  {
    id: 'team',
    name: 'Team & Process',
    icon: Users,
    color: 'from-amber-500 to-yellow-500',
    items: [
      { id: 'onboarding', name: 'Team Onboarding', status: 'complete', link: '/settings/team' },
      { id: 'roles', name: 'Role Definitions', status: 'complete', link: '/admin/access-control' },
      { id: 'training', name: 'Security Training', status: 'incomplete', link: '/help' },
      { id: 'incident', name: 'Incident Playbook', status: 'incomplete', link: '/help' },
      { id: 'review', name: 'Access Reviews', status: 'incomplete', link: '/admin/access-control' },
    ],
  },
];

const AdminEnterpriseReadiness = () => {
  const prefersReducedMotion = useReducedMotion();
  const { securityScore } = useSecurityStatus();
  const [refreshing, setRefreshing] = useState(false);

  // Calculate scores
  const calculateCategoryScore = items => {
    const complete = items.filter(i => i.status === 'complete').length;
    return Math.round((complete / items.length) * 100);
  };

  const overallScore = Math.round(
    READINESS_CATEGORIES.reduce((acc, cat) => acc + calculateCategoryScore(cat.items), 0) /
      READINESS_CATEGORIES.length
  );

  const totalItems = READINESS_CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0);
  const completeItems = READINESS_CATEGORIES.reduce(
    (acc, cat) => acc + cat.items.filter(i => i.status === 'complete').length,
    0
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1500));
    setRefreshing(false);
  };

  const getScoreColor = score => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreLabel = score => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 60) return 'Needs Work';
    return 'Critical';
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3"
        >
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-3">
              <Shield className="h-7 w-7 text-emerald-400" />
              <GradientText gradient="nature">Enterprise Readiness</GradientText>
            </h1>
            <p className="text-slate-400 mt-1">
              Self-diagnostic checklist for enterprise deployment readiness
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

        {/* Overall Score Card */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard variant="gradient">
            <GlassCardContent className="p-4">
              <div className="flex flex-col lg:flex-row items-center gap-3">
                {/* Score Circle */}
                <div className="relative">
                  <svg className="w-40 h-40 -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-slate-700"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="url(#readinessGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${overallScore * 4.4} 440`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="readinessGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                      {overallScore}%
                    </span>
                    <span className="text-sm text-slate-400">{getScoreLabel(overallScore)}</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-lg font-bold text-white mb-2">Enterprise Readiness Score</h2>
                  <p className="text-slate-400 mb-4">
                    {completeItems} of {totalItems} items configured across{' '}
                    {READINESS_CATEGORIES.length} categories
                  </p>

                  <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                      <span className="text-white">{completeItems} Complete</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                      <span className="text-white">{totalItems - completeItems} Pending</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col gap-2">
                  <GlowButton className="gap-2">
                    <FileCheck className="h-4 w-4" />
                    Run Full Audit
                  </GlowButton>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View Documentation
                  </Button>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* Category Cards */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {READINESS_CATEGORIES.map((category, i) => {
            const score = calculateCategoryScore(category.items);
            const Icon = category.icon;
            const complete = category.items.filter(item => item.status === 'complete').length;

            return (
              <motion.div
                key={category.id}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <GlassCard className="h-full">
                  <GlassCardContent className="p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-white">{category.name}</h3>
                      </div>
                      <Badge
                        variant={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'destructive'}
                      >
                        {score}%
                      </Badge>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${category.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {complete} of {category.items.length} items complete
                      </p>
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                      {category.items.map(item => (
                        <a
                          key={item.id}
                          href={item.link}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            {item.status === 'complete' ? (
                              <CheckCircle2 className="h-4 w-4 text-green-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-slate-500" />
                            )}
                            <span
                              className={`text-sm ${item.status === 'complete' ? 'text-slate-300' : 'text-slate-500'}`}
                            >
                              {item.name}
                            </span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                        </a>
                      ))}
                    </div>
                  </GlassCardContent>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Security Status */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SecurityStatusCard />
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-3">
            <Zap className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-cyan-400 mb-1">Need Help?</h4>
              <p className="text-sm text-slate-300">
                Our enterprise success team can help you achieve 100% readiness. Contact your
                dedicated CSM or{' '}
                <a href="/help" className="text-cyan-400 hover:text-cyan-300 underline">
                  schedule a readiness review
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

export default AdminEnterpriseReadiness;
