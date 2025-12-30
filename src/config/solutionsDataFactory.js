/**
 * Solutions Page Data Factory
 * Centralized definitions for Startup/Midmarket/Enterprise solution pages
 * Eliminates repetition of FEATURES, BENEFITS, STATS across pages
 */

import {
  Target,
  Zap,
  Clock,
  DollarSign,
  Brain,
  Sparkles,
  Database,
  BarChart3,
  Rocket,
} from 'lucide-react';

// Gradient presets for consistent styling
const GRADIENTS = {
  blue: 'from-blue-500 to-cyan-500',
  purple: 'from-purple-500 to-pink-500',
  orange: 'from-orange-500 to-red-500',
  green: 'from-green-500 to-teal-500',
  pink: 'from-pink-400 to-rose-500',
  emerald: 'from-green-400 to-emerald-500',
  cyan: 'from-cyan-400 to-blue-500',
  yellow: 'from-yellow-400 to-orange-500',
  rose: 'from-orange-400 to-red-500',
};

// Factory function to create feature objects
const createFeature = (icon, title, description, gradient) => ({
  icon,
  title,
  description,
  gradient: GRADIENTS[gradient] || gradient,
});

// Common language sets
const BASE_LANGUAGES = [
  { flag: '🇺🇸', name: 'English' },
  { flag: '🇪🇸', name: 'Spanish' },
  { flag: '🇫🇷', name: 'French' },
  { flag: '🇩🇪', name: 'German' },
  { flag: '🇮🇹', name: 'Italian' },
];

export const SOLUTIONS_DATA = {
  startup: {
    features: [
      createFeature(
        Database,
        '300M+ B2B Contacts Across 200+ Countries',
        "Finding the right people to reach out to as a startup can be daunting. Once you've defined your ICP, Ava will automatically prospect, research and enrich leads for you.",
        'blue'
      ),
      createFeature(
        BarChart3,
        'A/B Test Your ICP and Messaging',
        'Our platform provides a robust testing ground to hone in on your ICP and messaging. Set up multiple campaigns to A/B test different strategies and analyze results.',
        'purple'
      ),
      createFeature(
        Brain,
        'AI Playbooks — Instant Outbound Expertise',
        'Replicate and automate top-performing outbound strategies without any expertise or industry knowledge. Save yourself countless hours of research.',
        'orange'
      ),
      createFeature(
        Clock,
        '80% of Outbound Tasks — Automated',
        'Concentrate on growth and customer relationships. Ava handles everything from finding leads and researching them to writing emails and following up.',
        'green'
      ),
    ],
    benefits: [
      createFeature(DollarSign, '$450K Saved vs. Hiring', "Skip hiring your first BDR. With Ava, 80% of your outbound team's tasks are automated — reach more people without growing headcount.", 'emerald'),
      createFeature(Brain, 'Self-Optimizing AI', "Ava isn't your average AI. She learns from your feedback over time, continuously improving results like a top-performing rep would.", 'purple'),
      createFeature(Rocket, 'Live in 3 Days', "Learning Artisan takes minutes. With our dedicated support team, you'll be onboarded and live within days — not weeks.", 'cyan'),
      createFeature(Sparkles, 'Replicate Your Top Performers', 'Using AI Playbooks, automate your top-performing outbound research and writing workflows across your entire team.', 'orange'),
      createFeature(Target, 'Intent-Driven Outbound', 'Harness behavioral, firmographic, technographic, and social intent signals to reach prospects at the perfect moment.', 'pink'),
      createFeature(Zap, 'All-In-One Platform', 'From email deliverability to B2B data — everything you need for outbound success, consolidated into one subscription.', 'yellow'),
    ],
    stats: [
      { value: '3', suffix: ' days', label: 'To go live' },
      { value: '$450K', label: 'Saved vs. hiring' },
      { value: '80%', label: 'Tasks automated' },
      { value: '10x', label: 'More meetings/month' },
    ],
    languages: [...BASE_LANGUAGES, { flag: '🌍', name: '+35 more' }],
  },
  midmarket: {
    features: [
      createFeature(Database, '300M+ B2B Contacts with Advanced Filtering', 'Built-in ICP matching with ML-powered firmographic and technographic filters. Match 3x more accurately to your target accounts.', 'blue'),
      createFeature(Brain, 'AI-Powered Account Strategy', 'Ava analyzes every target account and creates a custom go-to-market strategy. Multi-threading, intent signals, and stakeholder mapping included.', 'purple'),
      createFeature(BarChart3, 'Real-Time Analytics & Insights', 'Get instant feedback on every campaign. Understand what works with drill-down analytics by channel, segment, and rep.', 'orange'),
      createFeature(Zap, 'Enterprise Integrations', 'Seamless integration with Salesforce, HubSpot, Outreach, and 50+ other platforms. Bi-directional sync of all activity.', 'green'),
    ],
    benefits: [
      createFeature(Rocket, '2-3x Pipeline Acceleration', 'Automated account research and multi-threading reduce sales cycles by 40%. Your team closes deals faster.', 'pink'),
      createFeature(Brain, 'Full Team Enablement', 'Equip every rep with AI-assisted prospecting, calling, and follow-up. No more bottlenecks on top performers.', 'purple'),
      createFeature(BarChart3, 'Predictive Forecasting', 'AI forecasts pipeline based on activity patterns. Make data-driven hiring and investment decisions.', 'cyan'),
      createFeature(DollarSign, 'ROI in 30 Days', 'See measurable pipeline growth within weeks. Most customers hit 3-5x ROI within 6 months.', 'emerald'),
      createFeature(Target, 'Real-Time Territory Optimization', 'Ava auto-assigns leads and balances territories to maximize coverage and prevent leakage.', 'rose'),
      createFeature(Sparkles, 'Rep Coaching & Insights', 'Call intelligence and activity analysis identify top performers so you can replicate their success at scale.', 'yellow'),
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
      createFeature(Database, 'Global Coverage with Custom Data Blending', 'Access 300M+ B2B contacts + your proprietary data. Seamless blending with Clearbit, ZoomInfo, Apollo, and custom data sources.', 'blue'),
      createFeature(Brain, 'Enterprise-Grade AI Governance', 'Full audit logs, explainability dashboards, and governance controls. Comply with GDPR, CCPA, HIPAA with AI-specific compliance.', 'purple'),
      createFeature(BarChart3, 'Custom Analytics & Reporting', 'Build unlimited custom dashboards. Role-based views for reps, managers, and executives. White-label for partners.', 'orange'),
      createFeature(Zap, 'Full API Access & Custom Workflows', 'Full REST/GraphQL API + webhooks. Build custom AI workflows using Zapier, Make, or your internal system.', 'green'),
    ],
    benefits: [
      createFeature(Rocket, '10x Scale with Consistency', 'Maintain quality as you scale to 100+ reps. Enforce standards, reduce variance, ensure repeatable success.', 'pink'),
      createFeature(Brain, 'Autonomous Revenue Operations', 'Full autonomous GTM: prospecting, research, outreach, calling, closing follow-up. Remove human bottlenecks.', 'purple'),
      createFeature(BarChart3, 'Predictive Revenue Intelligence', 'AI-powered deal intelligence. Forecast revenue with 95%+ accuracy. Predict churn and expansion.', 'cyan'),
      createFeature(DollarSign, '$5M+ Annual Savings', 'Save on hiring, tools, and time. Typical enterprise customer generates $5M+ ARR impact annually.', 'emerald'),
      createFeature(Target, 'Board-Level Reporting', 'Executive dashboards with AR trends, pipeline forecasting, and AI performance metrics. Ready for board presentations.', 'rose'),
      createFeature(Sparkles, 'Dedicated AI Operations Team', 'White-glove onboarding, custom training, and ongoing AI optimization. Your dedicated AI CRO.', 'yellow'),
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
