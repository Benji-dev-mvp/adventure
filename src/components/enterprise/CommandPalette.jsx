// Command Palette - Universal search and command execution (Cmd+K)
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Search,
  Command,
  ArrowRight,
  User,
  Settings,
  BarChart,
  Database,
  Zap,
  Mail,
  Calendar,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // All available commands
  const commands = useMemo(
    () => [
      // Navigation
      {
        id: 'nav-dashboard',
        label: 'Go to Dashboard',
        icon: BarChart,
        action: () => navigate('/dashboard'),
        category: 'Navigation',
        keywords: ['home', 'overview'],
      },
      {
        id: 'nav-campaigns',
        label: 'Go to Campaigns',
        icon: Zap,
        action: () => navigate('/campaigns'),
        category: 'Navigation',
        keywords: ['email', 'outreach'],
      },
      {
        id: 'nav-leads',
        label: 'Go to Leads',
        icon: User,
        action: () => navigate('/leads'),
        category: 'Navigation',
        keywords: ['contacts', 'prospects'],
      },
      {
        id: 'nav-analytics',
        label: 'Go to Analytics',
        icon: BarChart,
        action: () => navigate('/analytics'),
        category: 'Navigation',
        keywords: ['reports', 'data'],
      },
      {
        id: 'nav-database',
        label: 'Go to Lead Database',
        icon: Database,
        action: () => navigate('/lead-database'),
        category: 'Navigation',
        keywords: ['search', 'find'],
      },
      {
        id: 'nav-ava',
        label: 'Go to Ava AI',
        icon: Zap,
        action: () => navigate('/ava'),
        category: 'Navigation',
        keywords: ['assistant', 'ai', 'chat'],
      },
      {
        id: 'nav-settings',
        label: 'Go to Settings',
        icon: Settings,
        action: () => navigate('/settings'),
        category: 'Navigation',
        keywords: ['preferences', 'config'],
      },
      {
        id: 'nav-integrations',
        label: 'Go to Integrations',
        icon: Zap,
        action: () => navigate('/integrations'),
        category: 'Navigation',
        keywords: ['connect', 'apps'],
      },
      {
        id: 'nav-templates',
        label: 'Go to Templates',
        icon: Mail,
        action: () => navigate('/templates'),
        category: 'Navigation',
        keywords: ['email', 'messages'],
      },
      {
        id: 'nav-admin',
        label: 'Go to Admin',
        icon: Settings,
        action: () => navigate('/admin'),
        category: 'Navigation',
        keywords: ['management', 'users'],
      },

      // Actions
      {
        id: 'action-new-campaign',
        label: 'Create New Campaign',
        icon: Zap,
        action: () => {
          navigate('/campaigns');
          onClose();
        },
        category: 'Actions',
        keywords: ['new', 'start'],
      },
      {
        id: 'action-import-leads',
        label: 'Import Leads',
        icon: Database,
        action: () => alert('Import functionality'),
        category: 'Actions',
        keywords: ['csv', 'upload'],
      },
      {
        id: 'action-export-data',
        label: 'Export Data',
        icon: ArrowRight,
        action: () => alert('Export functionality'),
        category: 'Actions',
        keywords: ['download', 'csv'],
      },
      {
        id: 'action-schedule-meeting',
        label: 'Schedule Meeting',
        icon: Calendar,
        action: () => alert('Calendar functionality'),
        category: 'Actions',
        keywords: ['book', 'appointment'],
      },

      // Quick Actions
      {
        id: 'quick-theme',
        label: 'Toggle Dark Mode',
        icon: Settings,
        action: () => document.documentElement.classList.toggle('dark'),
        category: 'Quick Actions',
        keywords: ['theme', 'appearance'],
      },
    ],
    [navigate, onClose]
  );

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;

    const lowerQuery = query.toLowerCase();
    return commands.filter(
      cmd =>
        cmd.label.toLowerCase().includes(lowerQuery) ||
        cmd.category.toLowerCase().includes(lowerQuery) ||
        cmd.keywords?.some(k => k.includes(lowerQuery))
    );
  }, [query, commands]);

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups = {};
    filteredCommands.forEach(cmd => {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = e => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(i => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
            autoFocus
          />
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-[60vh] overflow-y-auto">
          {Object.keys(groupedCommands).length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-500">
              No commands found for "{query}"
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, cmds]) => (
              <div key={category} className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {category}
                </div>
                {cmds.map((cmd, idx) => {
                  const globalIndex = filteredCommands.indexOf(cmd);
                  const isSelected = globalIndex === selectedIndex;
                  const Icon = cmd.icon;

                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="flex-1 text-left text-sm font-medium">{cmd.label}</span>
                      <ArrowRight size={16} className="opacity-50" />
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  ↑↓
                </kbd>{' '}
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  ↵
                </kbd>{' '}
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  esc
                </kbd>{' '}
                Close
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Command size={12} />
              <span>Command Palette</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CommandPalette.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CommandPalette;
