import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '../ui/Dialog';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Command,
  Mail,
  Users,
  BarChart3,
  Settings,
  Zap,
  Calendar,
  Target,
  FileText,
  TrendingUp,
  Clock,
  LayoutDashboard,
  Bot,
  BookOpen,
  Plug,
  Shield,
  Activity,
  GitBranch,
  FlaskConical,
  Flag,
  ShieldCheck,
  Wand2,
  Sparkles,
  Plus,
  UserPlus,
  MessageSquare,
  Key,
  Database,
  Megaphone,
  Moon,
  Bell,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { toggleTheme, theme } = useTheme();

  // All searchable items - expanded with new routes
  const allItems = [
    // Navigation - Core
    {
      id: 'nav-dashboard',
      type: 'navigation',
      title: 'Go to Dashboard',
      icon: LayoutDashboard,
      action: () => navigate('/dashboard'),
      keywords: ['home', 'overview', 'main'],
    },
    {
      id: 'nav-campaigns',
      type: 'navigation',
      title: 'Go to Campaigns',
      icon: Megaphone,
      action: () => navigate('/campaigns'),
      keywords: ['email', 'sequence', 'outreach'],
    },
    {
      id: 'nav-leads',
      type: 'navigation',
      title: 'Go to Leads',
      icon: Users,
      action: () => navigate('/leads'),
      keywords: ['contacts', 'prospects'],
    },
    {
      id: 'nav-lead-database',
      type: 'navigation',
      title: 'Go to Lead Database',
      icon: Database,
      action: () => navigate('/lead-database'),
      keywords: ['contacts', 'crm', 'database'],
    },
    {
      id: 'nav-analytics',
      type: 'navigation',
      title: 'Go to Analytics',
      icon: BarChart3,
      action: () => navigate('/analytics'),
      keywords: ['reports', 'metrics', 'performance'],
    },

    // Navigation - AI & Ava
    {
      id: 'nav-ava',
      type: 'navigation',
      title: 'Go to Ava (AI Assistant)',
      icon: Bot,
      action: () => navigate('/ava'),
      keywords: ['ai', 'assistant', 'chat', 'ava'],
    },
    {
      id: 'nav-playbooks',
      type: 'navigation',
      title: 'Go to Ava Playbooks',
      icon: BookOpen,
      action: () => navigate('/ava/playbooks'),
      keywords: ['templates', 'automation', 'sequences'],
    },
    {
      id: 'nav-ai-assistant',
      type: 'navigation',
      title: 'Go to AI Assistant',
      icon: Zap,
      action: () => navigate('/ai-assistant'),
      keywords: ['ava', 'chat', 'help'],
    },

    // Navigation - Settings & Admin
    {
      id: 'nav-settings',
      type: 'navigation',
      title: 'Go to Settings',
      icon: Settings,
      action: () => navigate('/settings'),
      keywords: ['preferences', 'config'],
    },
    {
      id: 'nav-integrations',
      type: 'navigation',
      title: 'Go to Integrations',
      icon: Plug,
      action: () => navigate('/integrations'),
      keywords: ['connect', 'crm', 'salesforce'],
    },
    {
      id: 'nav-admin',
      type: 'navigation',
      title: 'Go to Admin',
      icon: Shield,
      action: () => navigate('/admin'),
      keywords: ['admin', 'manage'],
    },
    {
      id: 'nav-api-keys',
      type: 'navigation',
      title: 'Go to API Keys',
      icon: Key,
      action: () => navigate('/admin/api-keys'),
      keywords: ['tokens', 'access', 'keys'],
    },
    {
      id: 'nav-feature-flags',
      type: 'navigation',
      title: 'Go to Feature Flags',
      icon: Flag,
      action: () => navigate('/admin/feature-flags'),
      keywords: ['toggle', 'feature', 'flags'],
    },
    {
      id: 'nav-ai-policies',
      type: 'navigation',
      title: 'Go to AI Policies',
      icon: ShieldCheck,
      action: () => navigate('/settings/ai-policies'),
      keywords: ['guardrails', 'rules', 'policies'],
    },

    // Navigation - Advanced Features
    {
      id: 'nav-scoring',
      type: 'navigation',
      title: 'Go to Lead Scoring',
      icon: Target,
      action: () => navigate('/lead-scoring'),
      keywords: ['score', 'qualification'],
    },
    {
      id: 'nav-abtesting',
      type: 'navigation',
      title: 'Go to A/B Testing',
      icon: FlaskConical,
      action: () => navigate('/ab-testing'),
      keywords: ['experiment', 'variant', 'test'],
    },
    {
      id: 'nav-experiments',
      type: 'navigation',
      title: 'Go to Experiments Lab',
      icon: FlaskConical,
      action: () => navigate('/analytics/experiments'),
      keywords: ['ab', 'test', 'variant'],
    },
    {
      id: 'nav-workflow',
      type: 'navigation',
      title: 'Go to Workflow Orchestrator',
      icon: GitBranch,
      action: () => navigate('/workflow-orchestrator'),
      keywords: ['automation', 'flow'],
    },
    {
      id: 'nav-activity',
      type: 'navigation',
      title: 'Go to Activity Feed',
      icon: Activity,
      action: () => navigate('/activity'),
      keywords: ['events', 'log', 'feed'],
    },
    {
      id: 'nav-templates',
      type: 'navigation',
      title: 'Go to Templates',
      icon: FileText,
      action: () => navigate('/templates'),
      keywords: ['email', 'copy'],
    },

    // Navigation - Onboarding & Help
    {
      id: 'nav-setup',
      type: 'navigation',
      title: 'Go to Setup Wizard',
      icon: Wand2,
      action: () => navigate('/setup'),
      keywords: ['onboarding', 'start', 'wizard'],
    },
    {
      id: 'nav-changelog',
      type: 'navigation',
      title: "View What's New",
      icon: Sparkles,
      action: () => navigate('/changelog'),
      keywords: ['updates', 'releases', 'new'],
    },
    {
      id: 'nav-components',
      type: 'navigation',
      title: 'Component Library (Dev)',
      icon: FileText,
      action: () => navigate('/dev/components'),
      keywords: ['ui', 'design', 'dev'],
    },

    // Actions
    {
      id: 'action-new-campaign',
      type: 'action',
      title: 'Create New Campaign',
      icon: Plus,
      action: () => navigate('/campaigns?action=create'),
      keywords: ['new', 'create'],
    },
    {
      id: 'action-add-lead',
      type: 'action',
      title: 'Add New Lead',
      icon: UserPlus,
      action: () => navigate('/leads?action=create'),
      keywords: ['new', 'create', 'contact'],
    },
    {
      id: 'action-export-data',
      type: 'action',
      title: 'Export Data',
      icon: FileText,
      action: () => alert('Export started'),
      keywords: ['download', 'csv', 'report'],
    },
    {
      id: 'action-schedule-meeting',
      type: 'action',
      title: 'Schedule Meeting',
      icon: Calendar,
      action: () => alert('Meeting scheduler'),
      keywords: ['book', 'calendar', 'appointment'],
    },

    // AI Actions
    {
      id: 'action-ask-ava',
      type: 'ai',
      title: 'Ask Ava about this week',
      icon: MessageSquare,
      action: () => navigate('/ava?prompt=summarize-week'),
      keywords: ['ai', 'summary', 'help'],
    },
    {
      id: 'action-optimize',
      type: 'ai',
      title: 'Run Campaign Optimization',
      icon: Zap,
      action: () => navigate('/ava?action=optimize'),
      keywords: ['improve', 'ai', 'optimize'],
    },
    {
      id: 'action-score-leads',
      type: 'ai',
      title: 'Score All Leads',
      icon: Target,
      action: () => navigate('/lead-scoring?action=run'),
      keywords: ['rank', 'prioritize', 'ai'],
    },

    // Settings Actions
    {
      id: 'action-toggle-theme',
      type: 'setting',
      title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      icon: Moon,
      action: toggleTheme,
      keywords: ['theme', 'dark', 'light', 'mode'],
    },
    {
      id: 'action-notifications',
      type: 'setting',
      title: 'Notification Preferences',
      icon: Bell,
      action: () => navigate('/settings?tab=notifications'),
      keywords: ['alerts', 'notifications'],
    },

    // Mock Leads
    {
      id: 'lead-1',
      type: 'lead',
      title: 'Sarah Chen - VP Sales at TechCorp',
      icon: Users,
      action: () => navigate('/leads?id=lead-1'),
      keywords: ['sarah', 'chen', 'techcorp', 'vp'],
    },
    {
      id: 'lead-2',
      type: 'lead',
      title: 'Michael Rodriguez - Director Marketing',
      icon: Users,
      action: () => navigate('/leads?id=lead-2'),
      keywords: ['michael', 'rodriguez', 'director'],
    },
    {
      id: 'lead-3',
      type: 'lead',
      title: 'Emily Watson - CRO at Enterprise Systems',
      icon: Users,
      action: () => navigate('/leads?id=lead-3'),
      keywords: ['emily', 'watson', 'cro', 'enterprise'],
    },

    // Mock Campaigns
    {
      id: 'campaign-1',
      type: 'campaign',
      title: 'Q1 Enterprise Outreach',
      icon: Mail,
      action: () => navigate('/campaigns/camp-001'),
      keywords: ['q1', 'enterprise', 'outreach'],
    },
    {
      id: 'campaign-2',
      type: 'campaign',
      title: 'LinkedIn Sequence Test',
      icon: Mail,
      action: () => navigate('/campaigns/camp-002'),
      keywords: ['linkedin', 'sequence', 'test'],
    },
    {
      id: 'campaign-3',
      type: 'campaign',
      title: 'Cold Call Script A/B',
      icon: Mail,
      action: () => navigate('/campaigns/camp-003'),
      keywords: ['cold', 'call', 'script'],
    },

    // Recent Items
    {
      id: 'recent-1',
      type: 'recent',
      title: 'Recently Viewed: Dashboard',
      icon: Clock,
      action: () => navigate('/dashboard'),
      keywords: [],
    },
    {
      id: 'recent-2',
      type: 'recent',
      title: 'Recently Viewed: Campaign Builder',
      icon: Clock,
      action: () => navigate('/campaigns'),
      keywords: [],
    },
  ];

  const [recentItems, setRecentItems] = useState([]);

  // Filter items based on search
  const filteredItems =
    search.trim() === ''
      ? recentItems
          .slice(0, 5)
          .concat(allItems.filter(item => item.type === 'navigation').slice(0, 8))
      : allItems
          .filter(item => {
            const searchLower = search.toLowerCase();
            return (
              item.title.toLowerCase().includes(searchLower) ||
              item.keywords.some(keyword => keyword.includes(searchLower))
            );
          })
          .slice(0, 10);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        setSearch('');
        setSelectedIndex(0);
      }

      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    },
    [isOpen, filteredItems, selectedIndex]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Load recent items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('artisan_recent_items');
    if (saved) {
      setRecentItems(JSON.parse(saved));
    }
  }, []);

  const handleSelect = item => {
    // Save to recent items
    const newRecent = [
      { ...item, type: 'recent', id: `recent-${item.id}` },
      ...recentItems.filter(r => r.id !== item.id),
    ].slice(0, 5);
    setRecentItems(newRecent);
    localStorage.setItem('artisan_recent_items', JSON.stringify(newRecent));

    // Execute action
    item.action();
    setIsOpen(false);
    setSearch('');
  };

  const getTypeBadge = type => {
    switch (type) {
      case 'navigation':
        return {
          text: 'Go to',
          color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
        };
      case 'action':
        return {
          text: 'Action',
          color: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300',
        };
      case 'ai':
        return {
          text: 'AI',
          color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300',
        };
      case 'setting':
        return {
          text: 'Setting',
          color: 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
        };
      case 'lead':
        return {
          text: 'Lead',
          color: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
        };
      case 'campaign':
        return {
          text: 'Campaign',
          color: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
        };
      case 'recent':
        return {
          text: 'Recent',
          color: 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300',
        };
      default:
        return {
          text: 'Item',
          color: 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300',
        };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-white/10">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search commands, leads, campaigns..."
            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500"
            autoFocus
          />
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center">
              <Search className="w-12 h-9 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No results found</p>
              <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="py-2">
              {search === '' && recentItems.length > 0 && (
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Recent
                </div>
              )}
              {filteredItems.map((item, index) => {
                const Icon = item.icon;
                const badge = getTypeBadge(item.type);
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      isSelected
                        ? 'bg-accent-50 dark:bg-accent-500/10'
                        : 'hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? 'bg-accent-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.title}
                      </p>
                    </div>

                    <span className={`text-xs px-2 py-1 rounded ${badge.color}`}>{badge.text}</span>

                    {isSelected && (
                      <kbd className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                        ↵
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                ↓
              </kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                ↵
              </kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                Esc
              </kbd>
              <span>Close</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Command className="w-3 h-3" />
            <span>Powered by Cmd+K</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;
