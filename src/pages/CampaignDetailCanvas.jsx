import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  Play,
  Pause,
  Settings,
  Mail,
  Linkedin,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  GitBranch,
  ArrowRight,
  MessageSquare,
  Edit,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock campaign data
const MOCK_CAMPAIGN = {
  id: 'camp-001',
  name: 'Q1 Enterprise Outreach',
  status: 'active',
  segment: 'Enterprise Tech (500+ employees)',
  owner: 'Sarah Johnson',
  startDate: '2024-01-15',
  endDate: '2024-03-15',
  stats: {
    totalLeads: 2450,
    contacted: 1823,
    opened: 956,
    replied: 234,
    meetings: 47,
    openRate: 52.4,
    replyRate: 12.8,
    meetingRate: 2.6,
  },
  steps: [
    {
      id: 1,
      type: 'email',
      name: 'Initial Outreach',
      delay: '0 days',
      status: 'completed',
      sent: 2450,
      opened: 1234,
      clicked: 456,
      template: 'enterprise_intro_v2',
    },
    {
      id: 2,
      type: 'email',
      name: 'Value Proposition',
      delay: '3 days',
      status: 'completed',
      sent: 1823,
      opened: 789,
      clicked: 234,
      template: 'value_prop_case_study',
    },
    {
      id: 3,
      type: 'linkedin',
      name: 'LinkedIn Connection',
      delay: '5 days',
      status: 'active',
      sent: 956,
      opened: null,
      clicked: null,
      template: 'linkedin_connect_v1',
    },
    {
      id: 4,
      type: 'email',
      name: 'Case Study Share',
      delay: '7 days',
      status: 'pending',
      sent: 0,
      opened: 0,
      clicked: 0,
      template: 'case_study_enterprise',
    },
    {
      id: 5,
      type: 'call',
      name: 'Follow-up Call',
      delay: '10 days',
      status: 'pending',
      sent: 0,
      opened: null,
      clicked: null,
      template: 'call_script_demo',
    },
  ],
  branches: [
    {
      id: 'branch-1',
      condition: 'If opened but no reply after 3 days',
      nextStep: 'Gentle Nudge Email',
    },
    {
      id: 'branch-2',
      condition: 'If clicked pricing link',
      nextStep: 'Fast-track to Demo Request',
    },
  ],
  aiSuggestions: [
    {
      id: 1,
      type: 'optimization',
      title: 'Optimize send times',
      description:
        'Your audience is most responsive on Tuesdays at 10am. Consider shifting Step 3.',
      impact: '+15% open rate',
      priority: 'high',
    },
    {
      id: 2,
      type: 'content',
      title: 'Subject line A/B test',
      description: '"Quick question about {company}" outperforms current by 23%.',
      impact: '+23% open rate',
      priority: 'high',
    },
    {
      id: 3,
      type: 'personalization',
      title: 'Add company news hook',
      description: '34 leads have recent funding news. Add personalized opener.',
      impact: '+18% reply rate',
      priority: 'medium',
    },
    {
      id: 4,
      type: 'channel',
      title: 'Add LinkedIn touchpoint',
      description: 'Leads with LinkedIn connection have 2x reply rate.',
      impact: '+2x engagement',
      priority: 'medium',
    },
  ],
};

const stepIcons = {
  email: Mail,
  linkedin: Linkedin,
  call: Phone,
};

const stepColors = {
  email: 'bg-blue-500',
  linkedin: 'bg-sky-500',
  call: 'bg-green-500',
};

const statusColors = {
  completed: 'text-green-500',
  active: 'text-blue-500',
  pending: 'text-gray-400',
};

const StepNode = ({ step, index, totalSteps, onSelect }) => {
  const Icon = stepIcons[step.type] || Mail;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col items-center"
    >
      {/* Delay indicator */}
      {index > 0 && (
        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500 dark:text-gray-400">
          <Clock className="h-3 w-3" />
          {step.delay}
        </div>
      )}

      {/* Step card */}
      <div
        onClick={() => onSelect(step)}
        className={cn(
          'relative w-48 p-4 rounded-xl border-2 cursor-pointer transition-all group',
          step.status === 'active'
            ? 'border-accent-500 bg-accent-500/10 shadow-lg shadow-accent-500/20'
            : step.status === 'completed'
              ? 'border-green-500/50 bg-green-500/5'
              : 'border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50 hover:border-accent-500/50'
        )}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={cn('p-2 rounded-lg text-white', stepColors[step.type])}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {step.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{step.type}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Sent</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {step.sent.toLocaleString()}
            </p>
          </div>
          {step.opened !== null && (
            <div>
              <p className="text-gray-500 dark:text-gray-400">Opened</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {step.opened.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Status indicator */}
        <div className={cn('absolute -top-2 -right-2', statusColors[step.status])}>
          {step.status === 'completed' && <CheckCircle2 className="h-5 w-5" />}
          {step.status === 'active' && (
            <div className="relative">
              <div className="absolute inset-0 animate-ping h-5 w-5 rounded-full bg-blue-400 opacity-75" />
              <div className="relative h-5 w-5 rounded-full bg-blue-500" />
            </div>
          )}
          {step.status === 'pending' && <Clock className="h-5 w-5" />}
        </div>

        {/* Hover actions */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Connector */}
      {index < totalSteps - 1 && (
        <div className="flex flex-col items-center my-2">
          <div className="w-0.5 h-4 bg-gray-200 dark:bg-white/10" />
          <ArrowRight className="h-4 w-4 text-gray-300 dark:text-gray-600 rotate-90" />
          <div className="w-0.5 h-4 bg-gray-200 dark:bg-white/10" />
        </div>
      )}
    </motion.div>
  );
};

const AISuggestionCard = ({ suggestion, onApply }) => {
  const priorityColors = {
    high: 'border-red-500/50 bg-red-500/5',
    medium: 'border-amber-500/50 bg-amber-500/5',
    low: 'border-gray-500/50 bg-gray-500/5',
  };

  return (
    <div className={cn('p-4 rounded-xl border', priorityColors[suggestion.priority])}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-accent-500/10 rounded-lg shrink-0">
          <Sparkles className="h-4 w-4 text-accent-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{suggestion.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{suggestion.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="success" size="sm">
              {suggestion.impact}
            </Badge>
            <Badge variant={suggestion.priority === 'high' ? 'danger' : 'secondary'} size="sm">
              {suggestion.priority} priority
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <Button variant="primary" size="sm" className="flex-1" onClick={() => onApply(suggestion)}>
          <Zap className="h-3 w-3 mr-1" />
          Apply
        </Button>
        <Button variant="ghost" size="sm">
          Dismiss
        </Button>
      </div>
    </div>
  );
};

const CampaignDetailCanvas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedStep, setSelectedStep] = useState(null);

  const campaign = MOCK_CAMPAIGN;

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - Campaign Meta */}
        <div className="w-72 border-r border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50 p-4 overflow-y-auto shrink-0">
          <button
            onClick={() => navigate('/campaigns')}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-accent-500 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </button>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={campaign.status === 'active' ? 'success' : 'secondary'}>
                {campaign.status}
              </Badge>
            </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">{campaign.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{campaign.segment}</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Owner</span>
              <span className="text-gray-900 dark:text-white">{campaign.owner}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Start Date</span>
              <span className="text-gray-900 dark:text-white">{campaign.startDate}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">End Date</span>
              <span className="text-gray-900 dark:text-white">{campaign.endDate}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Performance</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-3">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {campaign.stats.totalLeads.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Leads</p>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-3">
                <p className="text-lg font-bold text-green-500">{campaign.stats.meetings}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Meetings</p>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-3">
                <p className="text-lg font-bold text-blue-500">{campaign.stats.openRate}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Open Rate</p>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-3">
                <p className="text-lg font-bold text-purple-500">{campaign.stats.replyRate}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Reply Rate</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button variant="outline" className="flex-1">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Middle - Visual Flow Canvas */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-accent-500" />
                Campaign Flow
              </h2>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Flow
              </Button>
            </div>

            {/* Start Node */}
            <div className="flex flex-col items-center mb-4">
              <div className="w-12 h-9 bg-green-500 rounded-full flex items-center justify-center text-white mb-2">
                <Play className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Start</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {campaign.stats.totalLeads.toLocaleString()} leads
              </p>
              <div className="w-0.5 h-6 bg-gray-200 dark:bg-white/10 mt-2" />
            </div>

            {/* Steps */}
            {campaign.steps.map((step, index) => (
              <StepNode
                key={step.id}
                step={step}
                index={index}
                totalSteps={campaign.steps.length}
                onSelect={setSelectedStep}
              />
            ))}

            {/* End Node */}
            <div className="flex flex-col items-center mt-4">
              <div className="w-0.5 h-6 bg-gray-200 dark:bg-white/10 mb-2" />
              <div className="w-12 h-9 bg-gray-500 rounded-full flex items-center justify-center text-white">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">End</p>
            </div>

            {/* Branches */}
            {campaign.branches.length > 0 && (
              <div className="mt-8 p-4 bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-white/10">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-amber-500" />
                  Conditional Branches
                </h3>
                <div className="space-y-2">
                  {campaign.branches.map(branch => (
                    <div key={branch.id} className="flex items-center gap-3 text-sm">
                      <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">{branch.condition}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white font-medium">
                        {branch.nextStep}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - AI Suggestions */}
        <div className="w-80 border-l border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50 p-4 overflow-y-auto shrink-0">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
              <Sparkles className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">AI Suggestions</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Ava</p>
            </div>
          </div>

          <div className="space-y-3">
            {campaign.aiSuggestions.map(suggestion => (
              <AISuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onApply={s => console.log('Apply suggestion:', s)}
              />
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-br from-accent-500/10 to-primary-500/10 rounded-lg border border-accent-500/20">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-accent-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Ask Ava</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Get custom recommendations for this campaign
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Open Ava Chat
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CampaignDetailCanvas;
