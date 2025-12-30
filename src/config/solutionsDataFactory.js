/**
 * Solutions Page Data Factory
 * Centralized definitions for Startup/Midmarket/Enterprise solution pages
 * Eliminates repetition of FEATURES, BENEFITS, STATS across pages
 */

import {
  Target,
  Zap,
  Globe,
  Clock,
  DollarSign,
  Brain,
  Sparkles,
  CheckCircle,
  Database,
  BarChart3,
  Rocket,
  Phone,
  Play,
} from 'lucide-react';

export const SOLUTIONS_DATA = {
  startup: {
    features: [
      {
        icon: Database,
        title: '300M+ B2B Contacts Across 200+ Countries',
        description:
          "Finding the right people to reach out to as a startup can be daunting. Once you've defined your ICP, Ava will automatically prospect, research and enrich leads for you.",
        gradient: 'from-blue-500 to-cyan-500',
      },
      {
        icon: BarChart3,
        title: 'A/B Test Your ICP and Messaging',
        description:
          'Our platform provides a robust testing ground to hone in on your ICP and messaging. Set up multiple campaigns to A/B test different strategies and analyze results.',
        gradient: 'from-purple-500 to-pink-500',
      },
      {
        icon: Brain,
        title: 'AI Playbooks — Instant Outbound Expertise',
        description:
          'Replicate and automate top-performing outbound strategies without any expertise or industry knowledge. Save yourself countless hours of research.',
        gradient: 'from-orange-500 to-red-500',
      },
      {
        icon: Clock,
        title: '80% of Outbound Tasks — Automated',
        description:
          'Concentrate on growth and customer relationships. Ava handles everything from finding leads and researching them to writing emails and following up.',
        gradient: 'from-green-500 to-teal-500',
      },
    ],
    benefits: [
      {
        icon: DollarSign,
        title: '$450K Saved vs. Hiring',
        description:
          "Skip hiring your first BDR. With Ava, 80% of your outbound team's tasks are automated — reach more people without growing headcount.",
        gradient: 'from-green-400 to-emerald-500',
      },
      {
        icon: Brain,
        title: 'Self-Optimizing AI',
        description:
          "Ava isn't your average AI. She learns from your feedback over time, continuously improving results like a top-performing rep would.",
        gradient: 'from-purple-400 to-pink-500',
      },
      {
        icon: Rocket,
        title: 'Live in 3 Days',
        description:
          "Learning Artisan takes minutes. With our dedicated support team, you'll be onboarded and live within days — not weeks.",
        gradient: 'from-cyan-400 to-blue-500',
      },
      {
        icon: Sparkles,
        title: 'Replicate Your Top Performers',
        description:
          'Using AI Playbooks, automate your top-performing outbound research and writing workflows across your entire team.',
        gradient: 'from-orange-400 to-red-500',
      },
      {
        icon: Target,
        title: 'Intent-Driven Outbound',
        description:
          'Harness behavioral, firmographic, technographic, and social intent signals to reach prospects at the perfect moment.',
        gradient: 'from-pink-400 to-rose-500',
      },
      {
        icon: Zap,
        title: 'All-In-One Platform',
        description:
          'From email deliverability to B2B data — everything you need for outbound success, consolidated into one subscription.',
        gradient: 'from-yellow-400 to-orange-500',
      },
    ],
    stats: [
      { value: '3', suffix: ' days', label: 'To go live' },
      { value: '$450K', label: 'Saved vs. hiring' },
      { value: '80%', label: 'Tasks automated' },
      { value: '10x', label: 'More meetings/month' },
    ],
    languages: [
      { flag: '🇺🇸', name: 'English' },
      { flag: '🇪🇸', name: 'Spanish' },
      { flag: '🇫🇷', name: 'French' },
      { flag: '🇩🇪', name: 'German' },
      { flag: '🇮🇹', name: 'Italian' },
      { flag: '🌍', name: '+35 more' },
    ],
  },
  midmarket: {
    features: [
      {
        icon: Database,
        title: '300M+ B2B Contacts with Advanced Filtering',
        description:
          'Built-in ICP matching with ML-powered firmographic and technographic filters. Match 3x more accurately to your target accounts.',
        gradient: 'from-blue-500 to-cyan-500',
      },
      {
        icon: Brain,
        title: 'AI-Powered Account Strategy',
        description:
          'Ava analyzes every target account and creates a custom go-to-market strategy. Multi-threading, intent signals, and stakeholder mapping included.',
        gradient: 'from-purple-500 to-pink-500',
      },
      {
        icon: BarChart3,
        title: 'Real-Time Analytics & Insights',
        description:
          'Get instant feedback on every campaign. Understand what works with drill-down analytics by channel, segment, and rep.',
        gradient: 'from-orange-500 to-red-500',
      },
      {
        icon: Zap,
        title: 'Enterprise Integrations',
        description:
          'Seamless integration with Salesforce, HubSpot, Outreach, and 50+ other platforms. Bi-directional sync of all activity.',
        gradient: 'from-green-500 to-teal-500',
      },
    ],
    benefits: [
      {
        icon: Rocket,
        title: '2-3x Pipeline Acceleration',
        description:
          'Automated account research and multi-threading reduce sales cycles by 40%. Your team closes deals faster.',
        gradient: 'from-pink-400 to-rose-500',
      },
      {
        icon: Brain,
        title: 'Full Team Enablement',
        description:
          'Equip every rep with AI-assisted prospecting, calling, and follow-up. No more bottlenecks on top performers.',
        gradient: 'from-purple-400 to-pink-500',
      },
      {
        icon: BarChart3,
        title: 'Predictive Forecasting',
        description:
          'AI forecasts pipeline based on activity patterns. Make data-driven hiring and investment decisions.',
        gradient: 'from-cyan-400 to-blue-500',
      },
      {
        icon: DollarSign,
        title: 'ROI in 30 Days',
        description:
          'See measurable pipeline growth within weeks. Most customers hit 3-5x ROI within 6 months.',
        gradient: 'from-green-400 to-emerald-500',
      },
      {
        icon: Target,
        title: 'Real-Time Territory Optimization',
        description:
          'Ava auto-assigns leads and balances territories to maximize coverage and prevent leakage.',
        gradient: 'from-orange-400 to-red-500',
      },
      {
        icon: Sparkles,
        title: 'Rep Coaching & Insights',
        description:
          'Call intelligence and activity analysis identify top performers so you can replicate their success at scale.',
        gradient: 'from-yellow-400 to-orange-500',
      },
    ],
    stats: [
      { value: '2-3x', label: 'Pipeline acceleration' },
      { value: '40%', label: 'Faster sales cycles' },
      { value: '3-5x', label: 'ROI in 6 months' },
      { value: '100%', label: 'Team enablement' },
    ],
    languages: [
      { flag: '🇺🇸', name: 'English' },
      { flag: '🇬🇧', name: 'British English' },
      { flag: '🇩🇪', name: 'German' },
      { flag: '🇫🇷', name: 'French' },
      { flag: '🇪🇸', name: 'Spanish' },
      { flag: '🇮🇹', name: 'Italian' },
      { flag: '🇯🇵', name: 'Japanese' },
      { flag: '🌍', name: '+40 more' },
    ],
  },
  enterprise: {
    features: [
      {
        icon: Database,
        title: 'Global Coverage with Custom Data Blending',
        description:
          'Access 300M+ B2B contacts + your proprietary data. Seamless blending with Clearbit, ZoomInfo, Apollo, and custom data sources.',
        gradient: 'from-blue-500 to-cyan-500',
      },
      {
        icon: Brain,
        title: 'Enterprise-Grade AI Governance',
        description:
          'Full audit logs, explainability dashboards, and governance controls. Comply with GDPR, CCPA, HIPAA with AI-specific compliance.',
        gradient: 'from-purple-500 to-pink-500',
      },
      {
        icon: BarChart3,
        title: 'Custom Analytics & Reporting',
        description:
          'Build unlimited custom dashboards. Role-based views for reps, managers, and executives. White-label for partners.',
        gradient: 'from-orange-500 to-red-500',
      },
      {
        icon: Zap,
        title: 'Full API Access & Custom Workflows',
        description:
          'Full REST/GraphQL API + webhooks. Build custom AI workflows using Zapier, Make, or your internal system.',
        gradient: 'from-green-500 to-teal-500',
      },
    ],
    benefits: [
      {
        icon: Rocket,
        title: '10x Scale with Consistency',
        description:
          'Maintain quality as you scale to 100+ reps. Enforce standards, reduce variance, ensure repeatable success.',
        gradient: 'from-pink-400 to-rose-500',
      },
      {
        icon: Brain,
        title: 'Autonomous Revenue Operations',
        description:
          'Full autonomous GTM: prospecting, research, outreach, calling, closing follow-up. Remove human bottlenecks.',
        gradient: 'from-purple-400 to-pink-500',
      },
      {
        icon: BarChart3,
        title: 'Predictive Revenue Intelligence',
        description:
          'AI-powered deal intelligence. Forecast revenue with 95%+ accuracy. Predict churn and expansion.',
        gradient: 'from-cyan-400 to-blue-500',
      },
      {
        icon: DollarSign,
        title: '$5M+ Annual Savings',
        description:
          'Save on hiring, tools, and time. Typical enterprise customer generates $5M+ ARR impact annually.',
        gradient: 'from-green-400 to-emerald-500',
      },
      {
        icon: Target,
        title: 'Board-Level Reporting',
        description:
          'Executive dashboards with AR trends, pipeline forecasting, and AI performance metrics. Ready for board presentations.',
        gradient: 'from-orange-400 to-red-500',
      },
      {
        icon: Sparkles,
        title: 'Dedicated AI Operations Team',
        description:
          'White-glove onboarding, custom training, and ongoing AI optimization. Your dedicated AI CRO.',
        gradient: 'from-yellow-400 to-orange-500',
      },
    ],
    stats: [
      { value: '10x', label: 'Scale without variance' },
      { value: '$5M+', label: 'Annual savings' },
      { value: '95%', label: 'Forecast accuracy' },
      { value: '24/7', label: 'Autonomous operation' },
    ],
    languages: [
      { flag: '🇺🇸', name: 'English' },
      { flag: '🇬🇧', name: 'British English' },
      { flag: '🇩🇪', name: 'German' },
      { flag: '🇫🇷', name: 'French' },
      { flag: '🇯🇵', name: 'Japanese' },
      { flag: '🇨🇳', name: 'Mandarin' },
      { flag: '🇸🇬', name: 'Singapore English' },
      { flag: '🌍', name: '+60 more' },
    ],
  },
};
