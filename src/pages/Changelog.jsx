import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Bug,
  Shield,
  ChevronRight,
  Calendar,
  Star,
  MessageSquare,
  Rocket,
  Settings,
  Bot,
  Mail,
  BarChart3,
  Users,
  Link,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock changelog data
const CHANGELOG_ENTRIES = [
  {
    id: 'v2.4.0',
    version: '2.4.0',
    date: '2024-01-22',
    title: 'AI-Powered Lead Scoring & Enhanced Analytics',
    summary: 'Major AI improvements with smarter lead scoring and new analytics dashboards.',
    isNew: true,
    changes: [
      {
        type: 'feature',
        title: 'AI Lead Scoring 2.0',
        description:
          'Completely redesigned lead scoring algorithm using machine learning. Now factors in engagement patterns, company signals, and buying intent.',
        icon: Bot,
      },
      {
        type: 'feature',
        title: 'Revenue Attribution Dashboard',
        description:
          'New analytics view showing full-funnel revenue attribution from first touch to closed deal.',
        icon: BarChart3,
      },
      {
        type: 'improvement',
        title: 'Email Editor Performance',
        description: '3x faster loading times for the email template editor with large templates.',
        icon: Zap,
      },
      {
        type: 'fix',
        title: 'Campaign Scheduling Fix',
        description:
          'Fixed an issue where scheduled campaigns would sometimes send at incorrect times in certain timezones.',
        icon: Bug,
      },
    ],
  },
  {
    id: 'v2.3.2',
    version: '2.3.2',
    date: '2024-01-15',
    title: 'Security Patch & Bug Fixes',
    summary: 'Important security updates and various bug fixes.',
    changes: [
      {
        type: 'security',
        title: 'Enhanced API Authentication',
        description: 'Improved API key rotation and added support for scoped API tokens.',
        icon: Shield,
      },
      {
        type: 'fix',
        title: 'Import CSV Encoding',
        description: 'Fixed issues with importing CSV files containing special characters.',
        icon: Bug,
      },
      {
        type: 'fix',
        title: 'Webhook Retry Logic',
        description: 'Improved webhook delivery reliability with exponential backoff.',
        icon: Bug,
      },
    ],
  },
  {
    id: 'v2.3.0',
    version: '2.3.0',
    date: '2024-01-08',
    title: 'Team Collaboration Features',
    summary: 'New features for team collaboration including shared playbooks and team analytics.',
    changes: [
      {
        type: 'feature',
        title: 'Shared Playbooks',
        description:
          'Create and share email playbooks with your team. Set permissions for view, edit, or admin access.',
        icon: Users,
      },
      {
        type: 'feature',
        title: 'Team Performance Dashboard',
        description:
          'Compare team member performance with side-by-side analytics and leaderboards.',
        icon: BarChart3,
      },
      {
        type: 'feature',
        title: 'Salesforce Enhanced Sync',
        description:
          'Bi-directional sync now includes custom fields and supports more object types.',
        icon: Link,
      },
      {
        type: 'improvement',
        title: 'Notification Preferences',
        description:
          'More granular control over which notifications you receive and through which channels.',
        icon: Settings,
      },
    ],
  },
  {
    id: 'v2.2.0',
    version: '2.2.0',
    date: '2023-12-20',
    title: 'Holiday Release: Email Templates & More',
    summary: 'New holiday email templates, improved scheduling, and performance updates.',
    changes: [
      {
        type: 'feature',
        title: '50+ New Email Templates',
        description:
          'Professional email templates for every use case, including holiday-themed options.',
        icon: Mail,
      },
      {
        type: 'improvement',
        title: 'Smart Send Time Optimization',
        description:
          'AI now predicts the best time to send emails based on recipient engagement history.',
        icon: Sparkles,
      },
      {
        type: 'improvement',
        title: 'Mobile App Updates',
        description:
          'Push notifications for important events and quick actions from the mobile app.',
        icon: Zap,
      },
    ],
  },
];

const changeTypeConfig = {
  feature: {
    label: 'New Feature',
    color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    dotColor: 'bg-green-500',
  },
  improvement: {
    label: 'Improvement',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    dotColor: 'bg-blue-500',
  },
  fix: {
    label: 'Bug Fix',
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    dotColor: 'bg-amber-500',
  },
  security: {
    label: 'Security',
    color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    dotColor: 'bg-red-500',
  },
};

const ChangeItem = ({ change, index }) => {
  const Icon = change.icon;
  const config = changeTypeConfig[change.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex gap-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
    >
      <div
        className={cn(
          'p-3 rounded-xl h-fit',
          change.type === 'feature' && 'bg-green-500/10',
          change.type === 'improvement' && 'bg-blue-500/10',
          change.type === 'fix' && 'bg-amber-500/10',
          change.type === 'security' && 'bg-red-500/10'
        )}
      >
        <Icon
          className={cn(
            'h-5 w-5',
            change.type === 'feature' && 'text-green-500',
            change.type === 'improvement' && 'text-blue-500',
            change.type === 'fix' && 'text-amber-500',
            change.type === 'security' && 'text-red-500'
          )}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-gray-900 dark:text-white">{change.title}</h4>
          <Badge className={config.color} size="sm">
            {config.label}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{change.description}</p>
      </div>
    </motion.div>
  );
};

const ChangelogEntry = ({ entry }) => {
  const [isExpanded, setIsExpanded] = useState(entry.isNew);

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="relative">
              <div
                className={cn(
                  'p-3 rounded-xl',
                  entry.isNew ? 'bg-accent-500/10' : 'bg-gray-100 dark:bg-white/10'
                )}
              >
                <Rocket
                  className={cn('h-6 w-6', entry.isNew ? 'text-accent-500' : 'text-gray-500')}
                />
              </div>
              {entry.isNew && (
                <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-accent-400 opacity-75" />
                  <span className="relative rounded-full h-2 w-2 bg-accent-500" />
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Version {entry.version}
                </h3>
                {entry.isNew && (
                  <Badge variant="primary" size="sm">
                    Latest
                  </Badge>
                )}
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {entry.title}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                {new Date(entry.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          <ChevronRight
            className={cn('h-5 w-5 text-gray-400 transition-transform', isExpanded && 'rotate-90')}
          />
        </div>
      </button>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="border-t border-gray-200 dark:border-white/10"
        >
          <div className="p-4 space-y-1">
            {entry.changes.map((change, index) => (
              <ChangeItem key={index} change={change} index={index} />
            ))}
          </div>
        </motion.div>
      )}
    </Card>
  );
};

// Header badge for "What's New"
export const WhatsNewBadge = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 bg-accent-500/10 hover:bg-accent-500/20 text-accent-600 dark:text-accent-400 rounded-full transition-colors"
    >
      <Sparkles className="h-3.5 w-3.5" />
      <span className="text-xs font-semibold">What's New</span>
    </button>
  );
};

const Changelog = () => {
  const [filter, setFilter] = useState('all');

  const filteredEntries = CHANGELOG_ENTRIES.filter(entry => {
    if (filter === 'all') return true;
    return entry.changes.some(c => c.type === filter);
  });

  return (
    <DashboardLayout>
      <div className="p-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500/10 text-accent-600 dark:text-accent-400 rounded-full mb-4"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">Changelog</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            What's New in Artisan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            We're constantly improving Artisan with new features, improvements, and bug fixes.
            Here's what we've been working on.
          </motion.p>
        </div>

        {/* Subscribe / Feedback Row */}
        <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4 mr-2" />
              Subscribe to Updates
            </Button>
            <Button variant="ghost" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Feedback
            </Button>
          </div>
          <a
            href="https://github.com/artisan/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            View on GitHub
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          {[
            { id: 'all', label: 'All Updates' },
            { id: 'feature', label: 'Features', color: 'text-green-500' },
            { id: 'improvement', label: 'Improvements', color: 'text-blue-500' },
            { id: 'fix', label: 'Bug Fixes', color: 'text-amber-500' },
            { id: 'security', label: 'Security', color: 'text-red-500' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                filter === f.id
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
              )}
            >
              {f.id !== 'all' && (
                <span
                  className={cn(
                    'inline-block w-2 h-2 rounded-full mr-2',
                    f.id === 'feature' && 'bg-green-500',
                    f.id === 'improvement' && 'bg-blue-500',
                    f.id === 'fix' && 'bg-amber-500',
                    f.id === 'security' && 'bg-red-500'
                  )}
                />
              )}
              {f.label}
            </button>
          ))}
        </div>

        {/* Changelog Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200 dark:bg-white/10" />

          <div className="space-y-3">
            {filteredEntries.map(entry => (
              <ChangelogEntry key={entry.id} entry={entry} />
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline">Load Earlier Updates</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Changelog;
