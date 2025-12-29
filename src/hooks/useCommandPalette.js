import { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Context for registering commands from anywhere in the app
const CommandPaletteContext = createContext(null);

export const useCommandPaletteContext = () => {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error('useCommandPaletteContext must be used within CommandPaletteProvider');
  }
  return context;
};

// Default navigation commands
const getDefaultCommands = (navigate) => [
  // Navigation
  { id: 'nav-dashboard', label: 'Go to Dashboard', category: 'Navigation', icon: 'LayoutDashboard', action: () => navigate('/dashboard') },
  { id: 'nav-campaigns', label: 'Go to Campaigns', category: 'Navigation', icon: 'Megaphone', action: () => navigate('/campaigns') },
  { id: 'nav-leads', label: 'Go to Leads', category: 'Navigation', icon: 'Users', action: () => navigate('/leads') },
  { id: 'nav-lead-database', label: 'Go to Lead Database', category: 'Navigation', icon: 'Database', action: () => navigate('/lead-database') },
  { id: 'nav-analytics', label: 'Go to Analytics', category: 'Navigation', icon: 'BarChart3', action: () => navigate('/analytics') },
  { id: 'nav-ava', label: 'Go to Ava (AI Assistant)', category: 'Navigation', icon: 'Bot', action: () => navigate('/ava') },
  { id: 'nav-playbooks', label: 'Go to Ava Playbooks', category: 'Navigation', icon: 'BookOpen', action: () => navigate('/ava/playbooks') },
  { id: 'nav-integrations', label: 'Go to Integrations', category: 'Navigation', icon: 'Plug', action: () => navigate('/integrations') },
  { id: 'nav-settings', label: 'Go to Settings', category: 'Navigation', icon: 'Settings', action: () => navigate('/settings') },
  { id: 'nav-admin', label: 'Go to Admin', category: 'Navigation', icon: 'Shield', action: () => navigate('/admin') },
  { id: 'nav-templates', label: 'Go to Templates', category: 'Navigation', icon: 'FileText', action: () => navigate('/templates') },
  { id: 'nav-activity', label: 'Go to Activity Feed', category: 'Navigation', icon: 'Activity', action: () => navigate('/activity') },
  { id: 'nav-workflow', label: 'Go to Workflow Orchestrator', category: 'Navigation', icon: 'GitBranch', action: () => navigate('/workflow-orchestrator') },
  { id: 'nav-experiments', label: 'Go to A/B Experiments', category: 'Navigation', icon: 'FlaskConical', action: () => navigate('/analytics/experiments') },
  { id: 'nav-feature-flags', label: 'Go to Feature Flags', category: 'Navigation', icon: 'Flag', action: () => navigate('/admin/feature-flags') },
  { id: 'nav-ai-policies', label: 'Go to AI Policies', category: 'Navigation', icon: 'ShieldCheck', action: () => navigate('/settings/ai-policies') },
  { id: 'nav-setup', label: 'Go to Setup Wizard', category: 'Navigation', icon: 'Wand2', action: () => navigate('/setup') },
  { id: 'nav-changelog', label: "View What's New", category: 'Navigation', icon: 'Sparkles', action: () => navigate('/changelog') },
  { id: 'nav-components', label: 'Component Library (Dev)', category: 'Navigation', icon: 'Component', action: () => navigate('/dev/components') },
  
  // Quick Actions
  { id: 'action-create-campaign', label: 'Create New Campaign', category: 'Actions', icon: 'Plus', action: () => navigate('/campaigns?action=create') },
  { id: 'action-add-lead', label: 'Add New Lead', category: 'Actions', icon: 'UserPlus', action: () => navigate('/leads?action=create') },
  { id: 'action-ask-ava', label: 'Ask Ava about this week', category: 'AI Actions', icon: 'MessageSquare', action: () => navigate('/ava?prompt=summarize-week') },
  { id: 'action-optimize', label: 'Run Campaign Optimization', category: 'AI Actions', icon: 'Zap', action: () => navigate('/ava?action=optimize') },
  { id: 'action-score-leads', label: 'Score All Leads', category: 'AI Actions', icon: 'Target', action: () => navigate('/lead-scoring?action=run') },
  { id: 'action-generate-report', label: 'Generate Weekly Report', category: 'Actions', icon: 'FileBarChart', action: () => navigate('/analytics?action=report') },
  
  // Settings
  { id: 'settings-theme', label: 'Toggle Dark/Light Mode', category: 'Settings', icon: 'Moon', action: () => { /* handled by theme toggle */ } },
  { id: 'settings-notifications', label: 'Notification Preferences', category: 'Settings', icon: 'Bell', action: () => navigate('/settings?tab=notifications') },
  { id: 'settings-integrations', label: 'Manage Integrations', category: 'Settings', icon: 'Link', action: () => navigate('/integrations') },
  { id: 'settings-api-keys', label: 'Manage API Keys', category: 'Settings', icon: 'Key', action: () => navigate('/admin/api-keys') },
];

export const useCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [registeredCommands, setRegisteredCommands] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Register a command
  const registerCommand = useCallback((command) => {
    setRegisteredCommands(prev => {
      const exists = prev.find(c => c.id === command.id);
      if (exists) return prev;
      return [...prev, command];
    });
    return () => {
      setRegisteredCommands(prev => prev.filter(c => c.id !== command.id));
    };
  }, []);

  // Unregister a command
  const unregisterCommand = useCallback((commandId) => {
    setRegisteredCommands(prev => prev.filter(c => c.id !== commandId));
  }, []);

  // Open/close handlers
  const openPalette = useCallback(() => {
    setIsOpen(true);
    setSearchQuery('');
    setSelectedIndex(0);
  }, []);

  const closePalette = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
    setSelectedIndex(0);
  }, []);

  const togglePalette = useCallback(() => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Cmd+K or Ctrl+K to open
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        togglePalette();
      }
      
      // Escape to close
      if (event.key === 'Escape' && isOpen) {
        closePalette();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, togglePalette, closePalette]);

  return {
    isOpen,
    searchQuery,
    setSearchQuery,
    selectedIndex,
    setSelectedIndex,
    registeredCommands,
    registerCommand,
    unregisterCommand,
    openPalette,
    closePalette,
    togglePalette,
    getDefaultCommands,
  };
};

export { CommandPaletteContext };
export default useCommandPalette;
