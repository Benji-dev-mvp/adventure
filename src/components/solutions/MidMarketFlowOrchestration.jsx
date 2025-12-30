import React from 'react';
import {
  Database,
  Users,
  Brain,
  GitBranch,
  Send,
  BarChart3,
  RefreshCw,
  Shield,
} from 'lucide-react';
import BaseFlowOrchestration from './BaseFlowOrchestration';

const MidMarketFlowOrchestration = () => {
  const stages = [
    {
      id: 0,
      title: 'Consolidate Data Sources',
      subtitle: 'Unify your tech stack',
      icon: Database,
      color: 'from-blue-500 to-cyan-500',
      phase: 'Integration',
      description:
        'Connect Salesforce, LinkedIn Sales Nav, ZoomInfo, and 8+ tools into one platform',
      dataPoints: [
        'CRM: Salesforce synced',
        'Enrichment: ZoomInfo connected',
        '10,000 contacts imported',
      ],
      metrics: { stackBefore: '12 tools', stackAfter: '1 platform', savings: '$3,200/mo' },
    },
    {
      id: 1,
      title: 'Territory Assignment',
      subtitle: 'Organize your team',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      phase: 'Setup',
      description: 'Assign 15 reps to territories, accounts, and industries with RBAC controls',
      dataPoints: [
        'Reps: 15 assigned',
        'Territories: North, South, West',
        'Accounts: 450 distributed',
      ],
      metrics: { teams: '15 reps', territories: '3 regions', accounts: '450' },
    },
    {
      id: 2,
      title: 'Replicate Top Performer',
      subtitle: 'AI Playbooks from your best',
      icon: Brain,
      color: 'from-orange-500 to-red-500',
      phase: 'Optimization',
      description:
        "Analyze your #1 rep's emails, extract patterns, create playbook for entire team",
      dataPoints: [
        'Top Rep: Sarah Chen analyzed',
        'Winning Patterns: 12 identified',
        'Playbook: Created & deployed',
      ],
      metrics: { analyzed: '847 emails', patterns: '12', deployed: '15 reps' },
    },
    {
      id: 3,
      title: 'Multi-Campaign Orchestration',
      subtitle: 'Parallel campaigns at scale',
      icon: GitBranch,
      color: 'from-green-500 to-teal-500',
      phase: 'Execution',
      description: 'Launch 15 simultaneous campaigns across territories with different messaging',
      dataPoints: [
        'Campaigns: 15 active',
        'Sequences: 3-5 touches each',
        'Total Prospects: 10,000',
      ],
      metrics: { campaigns: '15', prospects: '10,000', channels: 'Email + LinkedIn' },
    },
    {
      id: 4,
      title: 'Governance & Approval',
      subtitle: 'Policy enforcement',
      icon: Shield,
      color: 'from-indigo-500 to-purple-500',
      phase: 'Compliance',
      description:
        'Auto-check every message for compliance, send high-value accounts through approval',
      dataPoints: ['DLP Scan: 100% passed', 'Approvals: 47 pending', 'Compliance Score: 100%'],
      metrics: { scanned: '10,000', flagged: '0', approved: '47' },
    },
    {
      id: 5,
      title: 'Intelligent Send Timing',
      subtitle: 'Deliverability optimization',
      icon: Send,
      color: 'from-blue-600 to-purple-600',
      phase: 'Execution',
      description:
        'Send across multiple domains with smart timing based on timezone and engagement data',
      dataPoints: ['Domains: 5 active', 'Sending: Timezone optimized', 'Daily Volume: 2,000/day'],
      metrics: { domains: '5', volume: '2,000/day', deliverability: '98.4%' },
    },
    {
      id: 6,
      title: 'Real-Time Performance',
      subtitle: 'Team analytics dashboard',
      icon: BarChart3,
      color: 'from-green-600 to-emerald-600',
      phase: 'Analytics',
      description: 'Track team performance, identify top performers, see pipeline by territory',
      dataPoints: ['Open Rate: 68% avg', 'Reply Rate: 12% avg', 'Pipeline: $2.4M generated'],
      metrics: { opens: '68%', replies: '12%', pipeline: '$2.4M' },
    },
    {
      id: 7,
      title: 'Continuous Optimization',
      subtitle: 'AI learns and improves',
      icon: RefreshCw,
      color: 'from-purple-600 to-indigo-600',
      phase: 'Optimization',
      description:
        'Ava analyzes what works, automatically improves campaigns, shares insights across team',
      dataPoints: ['A/B Tests: 23 running', 'Winners: Auto-scaled', 'Team Learning: Shared'],
      metrics: { tests: '23', improvement: '+34%', shared: '15 reps' },
    },
  ];

  return <BaseFlowOrchestration stages={stages} autoPlayInterval={3500} />;
};

export default MidMarketFlowOrchestration;

