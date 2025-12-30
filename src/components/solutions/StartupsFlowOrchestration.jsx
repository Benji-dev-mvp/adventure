import React from 'react';
import {
  Target,
  Database,
  Brain,
  Sparkles,
  Send,
  TrendingUp,
  CheckCircle,
  Zap,
} from 'lucide-react';
import BaseFlowOrchestration from './BaseFlowOrchestration';

const StartupsFlowOrchestration = () => {
  const stages = [
    {
      id: 0,
      title: 'Define Your ICP',
      subtitle: 'Start with basics',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      duration: 'Day 1',
      description: 'Tell us your ideal customer profile - industry, company size, role',
      dataPoints: [
        'Industry: B2B SaaS',
        'Company Size: 10-200 employees',
        'Decision Makers: VP Sales, CROs',
      ],
      metrics: { time: '15 min', effort: 'Low', cost: '$0' },
    },
    {
      id: 1,
      title: 'AI Finds Your Leads',
      subtitle: '300M+ database search',
      icon: Database,
      color: 'from-blue-500 to-cyan-500',
      duration: 'Day 1',
      description: 'Ava searches 300M+ contacts and finds 2,847 perfect matches',
      dataPoints: [
        'Contacts Found: 2,847',
        'Intent Signals: 342 high',
        'Enrichment: 100% complete',
      ],
      metrics: { time: '5 min', effort: 'Zero', cost: '$0' },
    },
    {
      id: 2,
      title: 'Test Your Messaging',
      subtitle: 'A/B test campaigns',
      icon: Sparkles,
      color: 'from-orange-500 to-red-500',
      duration: 'Day 2',
      description: 'Set up 3 campaigns to A/B test different value props and see what resonates',
      dataPoints: [
        'Campaign A: Pain-focused',
        'Campaign B: ROI-focused',
        'Campaign C: Feature-focused',
      ],
      metrics: { time: '30 min', effort: 'Low', cost: '$0' },
    },
    {
      id: 3,
      title: 'AI Writes Emails',
      subtitle: 'Personalized at scale',
      icon: Brain,
      color: 'from-purple-600 to-indigo-600',
      duration: 'Day 2',
      description: 'GPT-4 generates personalized emails using your playbooks and best practices',
      dataPoints: ['Emails Generated: 2,847', 'Personalization: 95%', 'Tone: Professional'],
      metrics: { time: '10 min', effort: 'Review only', cost: '$0' },
    },
    {
      id: 4,
      title: 'Safe Domain Setup',
      subtitle: 'Protection built-in',
      icon: Zap,
      color: 'from-green-500 to-teal-500',
      duration: 'Day 3',
      description:
        'We set up a secondary domain, warm it up, and configure all deliverability settings',
      dataPoints: ['Secondary Domain: Ready', 'Warmup: Complete', 'SPF/DKIM: Configured'],
      metrics: { time: 'Auto', effort: 'Zero', cost: 'Included' },
    },
    {
      id: 5,
      title: 'Campaign Launch',
      subtitle: 'Multi-channel outreach',
      icon: Send,
      color: 'from-blue-600 to-purple-600',
      duration: 'Day 3',
      description: 'Ava sends emails, follows up on LinkedIn, and tracks all engagement',
      dataPoints: ['Emails Sent: 2,847', 'LinkedIn Messages: 342', 'Follow-ups: Automated'],
      metrics: { time: 'Ongoing', effort: 'Zero', cost: '$12/mo' },
    },
    {
      id: 6,
      title: 'Learn & Optimize',
      subtitle: 'Real-time analytics',
      icon: TrendingUp,
      color: 'from-indigo-500 to-purple-500',
      duration: 'Week 1+',
      description: 'See which campaign performs best, Ava learns and optimizes automatically',
      dataPoints: [
        'Campaign B: 18% response',
        'Campaign A: 12% response',
        'Campaign C: 8% response',
      ],
      metrics: { time: 'Auto', effort: 'Review', cost: '$0' },
    },
    {
      id: 7,
      title: 'Meetings Booked',
      subtitle: 'Pipeline generated',
      icon: CheckCircle,
      color: 'from-green-600 to-emerald-600',
      duration: 'Week 2+',
      description: 'Start having conversations with qualified prospects who respond',
      dataPoints: ['Meetings Booked: 47', 'Pipeline: $580K', 'Cost per Meeting: $12'],
      metrics: { time: '2 weeks', effort: 'Close deals', cost: '10x ROI' },
    },
  ];

  return <BaseFlowOrchestration stages={stages} autoPlayInterval={3500} />;
};

export default StartupsFlowOrchestration;

