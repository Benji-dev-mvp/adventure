/**
 * Command Palette Component
 * Provides ⌘+K quick access to navigation, actions, and search
 */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './ui/command';
import {
  LayoutDashboard,
  Users,
  Target,
  BarChart3,
  Settings,
  Plug,
  HelpCircle,
  Plus,
  FileText,
  Mail,
  Sparkles,
  Zap,
  Brain,
  Calendar,
  TrendingUp,
  Shield,
  Keyboard,
  Moon,
  Sun,
  Search,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getShortcutGroups } from '../hooks/useKeyboardShortcuts';

// Navigation items
const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    keywords: ['home', 'overview'],
  },
  { id: 'leads', label: 'Leads', path: '/leads', icon: Users, keywords: ['contacts', 'prospects'] },
  {
    id: 'campaigns',
    label: 'Campaigns',
    path: '/campaigns',
    icon: Target,
    keywords: ['outreach', 'email'],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: BarChart3,
    keywords: ['reports', 'metrics', 'stats'],
  },
  {
    id: 'templates',
    label: 'Templates',
    path: '/templates',
    icon: FileText,
    keywords: ['email templates'],
  },
  {
    id: 'integrations',
    label: 'Integrations',
    path: '/integrations',
    icon: Plug,
    keywords: ['connect', 'crm', 'api'],
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: Settings,
    keywords: ['preferences', 'config'],
  },
  {
    id: 'help',
    label: 'Help Center',
    path: '/help',
    icon: HelpCircle,
    keywords: ['support', 'docs'],
  },
];

// Advanced features
const advancedItems = [
  {
    id: 'ai-assistant',
    label: 'AI Assistant',
    path: '/ai-assistant',
    icon: Brain,
    keywords: ['ava', 'ai', 'chat'],
  },
  {
    id: 'ai-lead',
    label: 'AI Lead Intelligence',
    path: '/ai-lead-intelligence',
    icon: Sparkles,
    keywords: ['scoring', 'enrichment'],
  },
  {
    id: 'workflow',
    label: 'Workflow Orchestrator',
    path: '/workflow-orchestrator',
    icon: Zap,
    keywords: ['automation', 'flows'],
  },
  {
    id: 'visual-builder',
    label: 'Visual Campaign Builder',
    path: '/campaigns/visual',
    icon: Target,
    keywords: ['drag drop', 'n8n'],
  },
  {
    id: 'executive',
    label: 'Executive Dashboard',
    path: '/executive-dashboard',
    icon: TrendingUp,
    keywords: ['ceo', 'overview'],
  },
  {
    id: 'calendar',
    label: 'Calendar Scheduler',
    path: '/calendar-scheduler',
    icon: Calendar,
    keywords: ['meetings', 'schedule'],
  },
  {
    id: 'compliance',
    label: 'Compliance Center',
    path: '/compliance-center',
    icon: Shield,
    keywords: ['gdpr', 'security'],
  },
];

// Quick actions
const actionItems = [
  {
    id: 'new-campaign',
    label: 'Create New Campaign',
    action: 'newCampaign',
    icon: Plus,
    keywords: ['add'],
  },
  {
    id: 'new-lead',
    label: 'Add New Lead',
    action: 'newLead',
    icon: Plus,
    keywords: ['add contact'],
  },
  {
    id: 'new-template',
    label: 'Create Template',
    action: 'newTemplate',
    icon: Mail,
    keywords: ['add email'],
  },
  {
    id: 'search-leads',
    label: 'Search Leads...',
    action: 'searchLeads',
    icon: Search,
    keywords: ['find'],
  },
];

export function CommandPalette({ open, onOpenChange, onAction }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Handle keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const handleSelect = useCallback(
    item => {
      onOpenChange(false);

      if (item.path) {
        navigate(item.path);
      } else if (item.action && onAction) {
        onAction(item.action);
      }
    },
    [navigate, onOpenChange, onAction]
  );

  const handleThemeToggle = useCallback(() => {
    toggleTheme();
    onOpenChange(false);
  }, [toggleTheme, onOpenChange]);

  const handleShowShortcuts = useCallback(() => {
    setShowShortcuts(true);
  }, []);

  if (showShortcuts) {
    return (
      <CommandDialog
        open={open}
        onOpenChange={open => {
          if (!open) setShowShortcuts(false);
          onOpenChange(open);
        }}
      >
        <Command className="bg-white dark:bg-gray-900 border dark:border-gray-700">
          <CommandInput placeholder="Keyboard shortcuts..." />
          <CommandList className="max-h-[400px]">
            <CommandEmpty>No shortcuts found.</CommandEmpty>
            {Object.entries(getShortcutGroups()).map(([group, shortcuts]) => (
              <CommandGroup key={group} heading={group}>
                {shortcuts.map(shortcut => (
                  <CommandItem
                    key={shortcut.keys}
                    className="flex items-center justify-between"
                    disabled
                  >
                    <span className="text-gray-700 dark:text-gray-300">{shortcut.description}</span>
                    <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-800 rounded border dark:border-gray-600">
                      {shortcut.keys}
                    </kbd>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
            <CommandSeparator />
            <CommandGroup>
              <CommandItem onSelect={() => setShowShortcuts(false)}>
                <span>← Back to Command Palette</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    );
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command className="bg-white dark:bg-gray-900 border dark:border-gray-700">
        <CommandInput placeholder="Type a command or search..." className="dark:text-white" />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Quick Actions */}
          <CommandGroup heading="Quick Actions">
            {actionItems.map(item => (
              <CommandItem
                key={item.id}
                onSelect={() => handleSelect(item)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <item.icon className="h-4 w-4 text-cyan-500" />
                <span className="dark:text-gray-200">{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          {/* Navigation */}
          <CommandGroup heading="Navigation">
            {navigationItems.map(item => (
              <CommandItem
                key={item.id}
                onSelect={() => handleSelect(item)}
                className="flex items-center gap-3 cursor-pointer"
                keywords={item.keywords}
              >
                <item.icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="dark:text-gray-200">{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          {/* Advanced Features */}
          <CommandGroup heading="Advanced Features">
            {advancedItems.map(item => (
              <CommandItem
                key={item.id}
                onSelect={() => handleSelect(item)}
                className="flex items-center gap-3 cursor-pointer"
                keywords={item.keywords}
              >
                <item.icon className="h-4 w-4 text-purple-500" />
                <span className="dark:text-gray-200">{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          {/* Settings & Preferences */}
          <CommandGroup heading="Preferences">
            <CommandItem
              onSelect={handleThemeToggle}
              className="flex items-center gap-3 cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 text-blue-500" />
              )}
              <span className="dark:text-gray-200">
                Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
              </span>
            </CommandItem>
            <CommandItem
              onSelect={handleShowShortcuts}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Keyboard className="h-4 w-4 text-gray-500" />
              <span className="dark:text-gray-200">Keyboard Shortcuts</span>
              <kbd className="ml-auto px-2 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-800 rounded">
                ?
              </kbd>
            </CommandItem>
          </CommandGroup>
        </CommandList>

        {/* Footer hint */}
        <div className="border-t dark:border-gray-700 px-3 py-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
          <span>↑↓ Navigate • Enter Select • Esc Close</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px]">⌘</kbd>
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px]">K</kbd>
          </span>
        </div>
      </Command>
    </CommandDialog>
  );
}

// Hook to use command palette state
export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen(prev => !prev), []);
  const close = useCallback(() => setOpen(false), []);
  const openPalette = useCallback(() => setOpen(true), []);

  return {
    open,
    setOpen,
    toggle,
    close,
    openPalette,
  };
}

CommandPalette.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onAction: PropTypes.func,
};

export default CommandPalette;
