import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '../components/ui/Dialog';
import { useNavigate } from 'react-router-dom';
import { Search, Command, Mail, Users, BarChart3, Settings, Zap, Calendar, Target, FileText, TrendingUp, Clock } from 'lucide-react';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // All searchable items
  const allItems = [
    // Navigation
    { id: 'nav-dashboard', type: 'navigation', title: 'Go to Dashboard', icon: BarChart3, action: () => navigate('/dashboard'), keywords: ['home', 'overview'] },
    { id: 'nav-campaigns', type: 'navigation', title: 'Go to Campaign Builder', icon: Mail, action: () => navigate('/campaigns'), keywords: ['email', 'sequence', 'outreach'] },
    { id: 'nav-leads', type: 'navigation', title: 'Go to Leads', icon: Users, action: () => navigate('/leads'), keywords: ['contacts', 'prospects'] },
    { id: 'nav-analytics', type: 'navigation', title: 'Go to Analytics', icon: TrendingUp, action: () => navigate('/analytics'), keywords: ['reports', 'metrics', 'performance'] },
    { id: 'nav-ai', type: 'navigation', title: 'Go to AI Assistant', icon: Zap, action: () => navigate('/ai-assistant'), keywords: ['ava', 'chat', 'help'] },
    { id: 'nav-settings', type: 'navigation', title: 'Go to Settings', icon: Settings, action: () => navigate('/settings'), keywords: ['preferences', 'config'] },
    { id: 'nav-scoring', type: 'navigation', title: 'Go to Lead Scoring', icon: Target, action: () => navigate('/lead-scoring'), keywords: ['score', 'qualification'] },
    { id: 'nav-abtesting', type: 'navigation', title: 'Go to A/B Testing', icon: Target, action: () => navigate('/ab-testing'), keywords: ['experiment', 'variant', 'test'] },
    
    // Actions
    { id: 'action-new-campaign', type: 'action', title: 'Create New Campaign', icon: Mail, action: () => navigate('/campaigns'), keywords: ['new', 'create'] },
    { id: 'action-add-lead', type: 'action', title: 'Add New Lead', icon: Users, action: () => alert('Add lead modal'), keywords: ['new', 'create', 'contact'] },
    { id: 'action-export-data', type: 'action', title: 'Export Data', icon: FileText, action: () => alert('Export started'), keywords: ['download', 'csv', 'report'] },
    { id: 'action-schedule-meeting', type: 'action', title: 'Schedule Meeting', icon: Calendar, action: () => alert('Meeting scheduler'), keywords: ['book', 'calendar', 'appointment'] },
    
    // Mock Leads
    { id: 'lead-1', type: 'lead', title: 'Sarah Chen - VP Sales at TechCorp', icon: Users, action: () => navigate('/leads'), keywords: ['sarah', 'chen', 'techcorp', 'vp'] },
    { id: 'lead-2', type: 'lead', title: 'Michael Rodriguez - Director Marketing', icon: Users, action: () => navigate('/leads'), keywords: ['michael', 'rodriguez', 'director'] },
    { id: 'lead-3', type: 'lead', title: 'Emily Watson - CRO at Enterprise Systems', icon: Users, action: () => navigate('/leads'), keywords: ['emily', 'watson', 'cro', 'enterprise'] },
    
    // Mock Campaigns
    { id: 'campaign-1', type: 'campaign', title: 'Q1 Enterprise Outreach', icon: Mail, action: () => navigate('/campaigns'), keywords: ['q1', 'enterprise', 'outreach'] },
    { id: 'campaign-2', type: 'campaign', title: 'LinkedIn Sequence Test', icon: Mail, action: () => navigate('/campaigns'), keywords: ['linkedin', 'sequence', 'test'] },
    { id: 'campaign-3', type: 'campaign', title: 'Cold Call Script A/B', icon: Mail, action: () => navigate('/campaigns'), keywords: ['cold', 'call', 'script'] },
    
    // Recent Items
    { id: 'recent-1', type: 'recent', title: 'Recently Viewed: Dashboard', icon: Clock, action: () => navigate('/dashboard'), keywords: [] },
    { id: 'recent-2', type: 'recent', title: 'Recently Viewed: Campaign Builder', icon: Clock, action: () => navigate('/campaigns'), keywords: [] },
  ];

  const [recentItems, setRecentItems] = useState([]);

  // Filter items based on search
  const filteredItems = search.trim() === '' 
    ? recentItems.slice(0, 5).concat(allItems.filter(item => item.type === 'navigation').slice(0, 8))
    : allItems.filter(item => {
        const searchLower = search.toLowerCase();
        return (
          item.title.toLowerCase().includes(searchLower) ||
          item.keywords.some(keyword => keyword.includes(searchLower))
        );
      }).slice(0, 10);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
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
  }, [isOpen, filteredItems, selectedIndex]);

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

  const handleSelect = (item) => {
    // Save to recent items
    const newRecent = [
      { ...item, type: 'recent', id: `recent-${item.id}` },
      ...recentItems.filter(r => r.id !== item.id)
    ].slice(0, 5);
    setRecentItems(newRecent);
    localStorage.setItem('artisan_recent_items', JSON.stringify(newRecent));

    // Execute action
    item.action();
    setIsOpen(false);
    setSearch('');
  };

  const getTypeBadge = (type) => {
    switch(type) {
      case 'navigation': return { text: 'Go to', color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300' };
      case 'action': return { text: 'Action', color: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300' };
      case 'lead': return { text: 'Lead', color: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300' };
      case 'campaign': return { text: 'Campaign', color: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300' };
      case 'recent': return { text: 'Recent', color: 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300' };
      default: return { text: 'Item', color: 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300' };
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
            onChange={(e) => setSearch(e.target.value)}
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
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
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
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-accent-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.title}
                      </p>
                    </div>

                    <span className={`text-xs px-2 py-1 rounded ${badge.color}`}>
                      {badge.text}
                    </span>

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
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">↵</kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">Esc</kbd>
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
