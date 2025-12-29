import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Building2,
  Mail,
  Phone,
  Linkedin,
  Globe,
  MapPin,
  Calendar,
  Clock,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
  Send,
  FileText,
  ChevronRight,
  ExternalLink,
  Star,
  Zap,
  Brain,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// Mock lead data
const MOCK_LEAD = {
  id: 'lead-042',
  firstName: 'Sarah',
  lastName: 'Chen',
  email: 'sarah.chen@acmecorp.com',
  phone: '+1 (555) 123-4567',
  title: 'VP of Sales',
  company: {
    name: 'Acme Corporation',
    industry: 'Technology',
    size: '501-1000',
    website: 'https://acmecorp.com',
    location: 'San Francisco, CA',
    revenue: '$50M - $100M',
  },
  linkedin: 'https://linkedin.com/in/sarahchen',
  score: 85,
  status: 'hot',
  source: 'LinkedIn',
  tags: ['Enterprise', 'Decision Maker', 'High Intent'],
  lastActivity: '2 hours ago',
  createdAt: '2024-01-15',
  owner: 'John Smith',
  timeline: [
    {
      id: 1,
      type: 'email_opened',
      title: 'Opened email',
      description: 'Opened "Q1 Product Update" 3 times',
      time: '2 hours ago',
      icon: 'Mail',
    },
    {
      id: 2,
      type: 'page_visit',
      title: 'Visited pricing page',
      description: 'Spent 4 min on pricing page',
      time: '3 hours ago',
      icon: 'Globe',
    },
    {
      id: 3,
      type: 'email_clicked',
      title: 'Clicked email link',
      description: 'Clicked "Schedule Demo" CTA',
      time: '1 day ago',
      icon: 'ExternalLink',
    },
    {
      id: 4,
      type: 'score_change',
      title: 'Score increased',
      description: 'Score went from 72 to 85',
      time: '1 day ago',
      icon: 'TrendingUp',
    },
    {
      id: 5,
      type: 'email_sent',
      title: 'Email sent',
      description: 'Sequence: Enterprise Outreach - Step 2',
      time: '3 days ago',
      icon: 'Send',
    },
    {
      id: 6,
      type: 'added',
      title: 'Lead created',
      description: 'Added from LinkedIn import',
      time: '2 weeks ago',
      icon: 'User',
    },
  ],
  emails: [
    {
      id: 1,
      subject: 'Q1 Product Update - New Features',
      status: 'opened',
      opens: 3,
      clicks: 1,
      sentAt: '2 days ago',
      campaign: 'Enterprise Outreach',
    },
    {
      id: 2,
      subject: 'Quick question about your sales process',
      status: 'clicked',
      opens: 2,
      clicks: 1,
      sentAt: '5 days ago',
      campaign: 'Enterprise Outreach',
    },
    {
      id: 3,
      subject: 'Introduction from Artisan',
      status: 'opened',
      opens: 1,
      clicks: 0,
      sentAt: '1 week ago',
      campaign: 'Enterprise Outreach',
    },
  ],
  aiSummary: {
    intent: 'High',
    buyingStage: 'Evaluation',
    keyInsights: [
      'Actively researching sales automation tools',
      'Visited pricing page multiple times - likely comparing options',
      'Engaged with all emails in the sequence',
      'Similar companies typically close within 30 days',
    ],
    recommendedActions: [
      {
        action: 'Schedule a demo call',
        priority: 'high',
        reason: 'High engagement indicates readiness',
      },
      {
        action: 'Send case study',
        priority: 'medium',
        reason: 'Match with similar company success story',
      },
      { action: 'Connect on LinkedIn', priority: 'low', reason: 'Build personal rapport' },
    ],
    predictedClose: '65%',
    bestTimeToContact: 'Tuesday 9-11 AM PST',
  },
  playbooks: [
    { id: 1, name: 'Enterprise Sales Motion', fit: 92, status: 'active', step: 2, totalSteps: 5 },
    { id: 2, name: 'Product-Led Growth', fit: 45, status: 'not_started', step: 0, totalSteps: 4 },
    {
      id: 3,
      name: 'Re-engagement Sequence',
      fit: 30,
      status: 'not_started',
      step: 0,
      totalSteps: 3,
    },
  ],
};

// Icon mapping
const timelineIcons = {
  Mail,
  Globe,
  ExternalLink,
  TrendingUp,
  Send,
  User,
};

const ScoreBadge = ({ score }) => {
  const getColor = () => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold',
          getColor()
        )}
      >
        {score}
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">Lead Score</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {score >= 80 ? 'Hot' : score >= 60 ? 'Warm' : score >= 40 ? 'Cool' : 'Cold'}
        </p>
      </div>
    </div>
  );
};

const OverviewTab = ({ lead }) => (
  <div className="space-y-6">
    {/* Contact Info */}
    <div>
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Contact Information
      </h4>
      <div className="space-y-2">
        <a
          href={`mailto:${lead.email}`}
          className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-accent-500"
        >
          <Mail className="h-4 w-4" />
          {lead.email}
        </a>
        <a
          href={`tel:${lead.phone}`}
          className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-accent-500"
        >
          <Phone className="h-4 w-4" />
          {lead.phone}
        </a>
        <a
          href={lead.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-accent-500"
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn Profile
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>

    {/* Company Info */}
    <div>
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Company</h4>
      <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-primary-500 rounded-lg flex items-center justify-center text-white font-bold">
            {lead.company.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{lead.company.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{lead.company.industry}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Size</p>
            <p className="text-gray-900 dark:text-white">{lead.company.size}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Revenue</p>
            <p className="text-gray-900 dark:text-white">{lead.company.revenue}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Location</p>
            <p className="text-gray-900 dark:text-white">{lead.company.location}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Website</p>
            <a
              href={lead.company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-500 hover:underline flex items-center gap-1"
            >
              Visit <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>

    {/* Tags */}
    <div>
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Tags</h4>
      <div className="flex flex-wrap gap-2">
        {lead.tags.map(tag => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  </div>
);

const TimelineTab = ({ lead }) => (
  <div className="space-y-4">
    {lead.timeline.map((event, index) => {
      const Icon = timelineIcons[event.icon] || Clock;
      return (
        <div key={event.id} className="flex gap-4">
          <div className="relative">
            <div className="w-8 h-8 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center">
              <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            {index < lead.timeline.length - 1 && (
              <div className="absolute top-8 left-1/2 w-px h-full -translate-x-1/2 bg-gray-200 dark:bg-white/10" />
            )}
          </div>
          <div className="flex-1 pb-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{event.description}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{event.time}</p>
          </div>
        </div>
      );
    })}
  </div>
);

const EmailsTab = ({ lead }) => (
  <div className="space-y-3">
    {lead.emails.map(email => (
      <div
        key={email.id}
        className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{email.subject}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {email.campaign} • {email.sentAt}
            </p>
          </div>
          <Badge variant={email.status === 'clicked' ? 'success' : 'secondary'}>
            {email.status}
          </Badge>
        </div>
        <div className="flex gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {email.opens} opens
          </span>
          <span className="flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            {email.clicks} clicks
          </span>
        </div>
      </div>
    ))}
  </div>
);

const AISummaryTab = ({ lead }) => (
  <div className="space-y-6">
    {/* Intent & Stage */}
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
        <div className="flex items-center gap-2 text-purple-500 mb-2">
          <Brain className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase">Intent Level</span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{lead.aiSummary.intent}</p>
      </div>
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-500/20">
        <div className="flex items-center gap-2 text-cyan-500 mb-2">
          <Target className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase">Buying Stage</span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {lead.aiSummary.buyingStage}
        </p>
      </div>
    </div>

    {/* Key Insights */}
    <div>
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-accent-500" />
        Key Insights
      </h4>
      <ul className="space-y-2">
        {lead.aiSummary.keyInsights.map((insight, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
            {insight}
          </li>
        ))}
      </ul>
    </div>

    {/* Recommended Actions */}
    <div>
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <Zap className="h-4 w-4 text-amber-500" />
        Recommended Actions
      </h4>
      <div className="space-y-2">
        {lead.aiSummary.recommendedActions.map((action, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  action.priority === 'high'
                    ? 'bg-red-500'
                    : action.priority === 'medium'
                      ? 'bg-amber-500'
                      : 'bg-gray-400'
                )}
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{action.action}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{action.reason}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>

    {/* Predictions */}
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">Close Probability</p>
        <p className="text-2xl font-bold text-green-500">{lead.aiSummary.predictedClose}</p>
      </div>
      <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">Best Time to Contact</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {lead.aiSummary.bestTimeToContact}
        </p>
      </div>
    </div>
  </div>
);

const PlaybookFitTab = ({ lead }) => (
  <div className="space-y-3">
    {lead.playbooks.map(playbook => (
      <div key={playbook.id} className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{playbook.name}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full',
                    playbook.fit >= 80
                      ? 'bg-green-500'
                      : playbook.fit >= 50
                        ? 'bg-amber-500'
                        : 'bg-gray-400'
                  )}
                  style={{ width: `${playbook.fit}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {playbook.fit}%
              </span>
            </div>
            {playbook.status === 'active' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Step {playbook.step} of {playbook.totalSteps}
              </p>
            )}
          </div>
          <Badge variant={playbook.status === 'active' ? 'success' : 'secondary'}>
            {playbook.status === 'active' ? 'Active' : 'Not Started'}
          </Badge>
        </div>
      </div>
    ))}
  </div>
);

const LeadDrawer = ({ isOpen, onClose, leadId }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // In a real app, fetch lead data based on leadId
  const lead = MOCK_LEAD;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-primary-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                    {lead.firstName.charAt(0)}
                    {lead.lastName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {lead.firstName} {lead.lastName}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {lead.title} at {lead.company.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="flex items-center justify-between mt-4">
                <ScoreBadge score={lead.score} />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Meeting
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="px-6 pt-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex gap-1">
                  {[
                    { id: 'overview', label: 'Overview', icon: User },
                    { id: 'timeline', label: 'Timeline', icon: Clock },
                    { id: 'emails', label: 'Emails', icon: Mail },
                    { id: 'ai', label: 'AI Summary', icon: Sparkles },
                    { id: 'playbooks', label: 'Playbooks', icon: Target },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-lg transition-colors',
                        activeTab === tab.id
                          ? 'bg-accent-500/10 text-accent-600 dark:text-accent-400 border-b-2 border-accent-500'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      )}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'overview' && <OverviewTab lead={lead} />}
                {activeTab === 'timeline' && <TimelineTab lead={lead} />}
                {activeTab === 'emails' && <EmailsTab lead={lead} />}
                {activeTab === 'ai' && <AISummaryTab lead={lead} />}
                {activeTab === 'playbooks' && <PlaybookFitTab lead={lead} />}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Last activity: {lead.lastActivity}</span>
                <span>Owner: {lead.owner}</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LeadDrawer;
