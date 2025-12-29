import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Flag,
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Users,
  Building2,
  Zap,
  Bot,
  BarChart3,
  Shield,
  AlertCircle,
  Check,
  X,
  ChevronDown,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock feature flags data
const MOCK_FLAGS = [
  {
    id: 'flag-001',
    key: 'ai_lead_scoring_v2',
    name: 'AI Lead Scoring V2',
    description: 'New ML model for lead scoring with improved accuracy',
    category: 'AI Operator',
    enabled: true,
    environment: 'production',
    rolloutPercentage: 100,
    createdAt: '2024-01-15',
    updatedBy: 'Sarah Johnson',
    overrides: [{ type: 'user', value: 'john@example.com', enabled: true }],
  },
  {
    id: 'flag-002',
    key: 'multi_channel_sequences',
    name: 'Multi-Channel Sequences',
    description: 'Enable LinkedIn and phone steps in campaign sequences',
    category: 'Revenue',
    enabled: true,
    environment: 'production',
    rolloutPercentage: 75,
    createdAt: '2024-01-10',
    updatedBy: 'Mike Chen',
    overrides: [],
  },
  {
    id: 'flag-003',
    key: 'ava_auto_replies',
    name: 'Ava Auto-Replies',
    description: 'Allow Ava to automatically respond to common lead questions',
    category: 'AI Operator',
    enabled: false,
    environment: 'staging',
    rolloutPercentage: 0,
    createdAt: '2024-01-20',
    updatedBy: 'Emily Davis',
    overrides: [],
  },
  {
    id: 'flag-004',
    key: 'advanced_analytics_dashboard',
    name: 'Advanced Analytics Dashboard',
    description: 'New analytics UI with custom charts and export',
    category: 'Ops & Control',
    enabled: true,
    environment: 'production',
    rolloutPercentage: 50,
    createdAt: '2024-01-05',
    updatedBy: 'Sarah Johnson',
    overrides: [{ type: 'workspace', value: 'enterprise-tier', enabled: true }],
  },
  {
    id: 'flag-005',
    key: 'email_warmup_service',
    name: 'Email Warmup Service',
    description: 'Gradual email sending increase for new domains',
    category: 'Revenue',
    enabled: true,
    environment: 'production',
    rolloutPercentage: 100,
    createdAt: '2024-01-01',
    updatedBy: 'Mike Chen',
    overrides: [],
  },
  {
    id: 'flag-006',
    key: 'playbook_ai_suggestions',
    name: 'Playbook AI Suggestions',
    description: 'Ava suggests playbook improvements based on performance',
    category: 'AI Operator',
    enabled: false,
    environment: 'development',
    rolloutPercentage: 0,
    createdAt: '2024-01-22',
    updatedBy: 'Emily Davis',
    overrides: [],
  },
  {
    id: 'flag-007',
    key: 'real_time_collaboration',
    name: 'Real-time Collaboration',
    description: 'Live cursors and editing for team collaboration',
    category: 'Ops & Control',
    enabled: false,
    environment: 'staging',
    rolloutPercentage: 10,
    createdAt: '2024-01-18',
    updatedBy: 'Sarah Johnson',
    overrides: [],
  },
];

const CATEGORIES = ['All', 'AI Operator', 'Revenue', 'Ops & Control'];
const ENVIRONMENTS = ['All', 'production', 'staging', 'development'];

const categoryIcons = {
  'AI Operator': Bot,
  Revenue: BarChart3,
  'Ops & Control': Shield,
};

const categoryColors = {
  'AI Operator': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  Revenue: 'bg-green-500/10 text-green-500 border-green-500/20',
  'Ops & Control': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

const envColors = {
  production: 'bg-green-500',
  staging: 'bg-amber-500',
  development: 'bg-blue-500',
};

const FeatureFlags = () => {
  const [flags, setFlags] = useState(MOCK_FLAGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [envFilter, setEnvFilter] = useState('All');
  const [expandedFlag, setExpandedFlag] = useState(null);

  const toggleFlag = flagId => {
    setFlags(prev =>
      prev.map(flag => (flag.id === flagId ? { ...flag, enabled: !flag.enabled } : flag))
    );
  };

  const filteredFlags = flags.filter(flag => {
    const matchesSearch =
      flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.key.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || flag.category === categoryFilter;
    const matchesEnv = envFilter === 'All' || flag.environment === envFilter;
    return matchesSearch && matchesCategory && matchesEnv;
  });

  return (
    <DashboardLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Flag className="h-8 w-8 text-accent-500" />
              Feature Flags
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Control feature rollouts and experiments
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Flag
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search flags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Category:</span>
            <div className="flex gap-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-lg transition-colors',
                    categoryFilter === cat
                      ? 'bg-accent-500 text-white'
                      : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Environment:</span>
            <select
              value={envFilter}
              onChange={e => setEnvFilter(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white"
            >
              {ENVIRONMENTS.map(env => (
                <option key={env} value={env}>
                  {env}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-white/10 rounded-lg">
                <Flag className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{flags.length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Flags</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {flags.filter(f => f.enabled).length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Enabled</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {flags.filter(f => f.rolloutPercentage > 0 && f.rolloutPercentage < 100).length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Partial Rollout</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {flags.reduce((acc, f) => acc + f.overrides.length, 0)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Overrides</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Flags Table */}
        <Card>
          <div className="divide-y divide-gray-200 dark:divide-white/10">
            {filteredFlags.length === 0 ? (
              <div className="p-12 text-center">
                <Flag className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No flags match your filters</p>
              </div>
            ) : (
              filteredFlags.map(flag => {
                const CategoryIcon = categoryIcons[flag.category] || Flag;
                const isExpanded = expandedFlag === flag.id;

                return (
                  <div key={flag.id} className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Toggle */}
                      <button
                        onClick={() => toggleFlag(flag.id)}
                        className={cn(
                          'shrink-0 transition-colors',
                          flag.enabled ? 'text-green-500' : 'text-gray-400'
                        )}
                      >
                        {flag.enabled ? (
                          <ToggleRight className="h-8 w-8" />
                        ) : (
                          <ToggleLeft className="h-8 w-8" />
                        )}
                      </button>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 dark:text-white">{flag.name}</p>
                          <code className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-white/10 rounded text-gray-600 dark:text-gray-400">
                            {flag.key}
                          </code>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                          {flag.description}
                        </p>
                      </div>

                      {/* Category */}
                      <Badge className={categoryColors[flag.category]}>
                        <CategoryIcon className="h-3 w-3 mr-1" />
                        {flag.category}
                      </Badge>

                      {/* Environment */}
                      <div className="flex items-center gap-2">
                        <span className={cn('w-2 h-2 rounded-full', envColors[flag.environment])} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {flag.environment}
                        </span>
                      </div>

                      {/* Rollout */}
                      <div className="w-32">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Rollout</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {flag.rolloutPercentage}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent-500 rounded-full"
                            style={{ width: `${flag.rolloutPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setExpandedFlag(isExpanded ? null : flag.id)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <ChevronDown
                            className={cn(
                              'h-4 w-4 text-gray-400 transition-transform',
                              isExpanded && 'rotate-180'
                            )}
                          />
                        </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                          <Edit className="h-4 w-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 ml-12 p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Created</p>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {flag.createdAt}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Updated By</p>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {flag.updatedBy}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Overrides</p>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {flag.overrides.length || 'None'}
                            </p>
                          </div>
                        </div>
                        {flag.overrides.length > 0 && (
                          <div className="mt-4">
                            <p className="text-xs text-gray-500 mb-2">Active Overrides:</p>
                            <div className="space-y-1">
                              {flag.overrides.map((override, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                  <Badge variant="secondary" size="sm">
                                    {override.type}
                                  </Badge>
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {override.value}
                                  </span>
                                  <span
                                    className={cn(
                                      'text-xs',
                                      override.enabled ? 'text-green-500' : 'text-red-500'
                                    )}
                                  >
                                    {override.enabled ? 'Enabled' : 'Disabled'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FeatureFlags;
