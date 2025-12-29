import { useState, useCallback, useEffect } from 'react';

// Mock workspace data
const MOCK_WORKSPACES = [
  {
    id: 'ws-001',
    name: 'Artisan HQ',
    slug: 'artisan-hq',
    logo: null,
    role: 'owner',
    plan: 'enterprise',
    members: 24,
    isActive: true,
    settings: {
      segment: 'enterprise',
      industry: 'Technology',
      teamSize: '100-500',
    },
  },
  {
    id: 'ws-002',
    name: 'Sales Team - West',
    slug: 'sales-west',
    logo: null,
    role: 'admin',
    plan: 'professional',
    members: 8,
    isActive: false,
    settings: {
      segment: 'midmarket',
      industry: 'Technology',
      teamSize: '50-100',
    },
  },
  {
    id: 'ws-003',
    name: 'Startup Pilot',
    slug: 'startup-pilot',
    logo: null,
    role: 'member',
    plan: 'starter',
    members: 3,
    isActive: false,
    settings: {
      segment: 'startup',
      industry: 'SaaS',
      teamSize: '1-10',
    },
  },
];

const STORAGE_KEY = 'artisan_active_workspace';

export const useWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState(MOCK_WORKSPACES);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  // Get active workspace from localStorage or default to first
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && MOCK_WORKSPACES.find(w => w.id === stored)) {
      return stored;
    }
    return MOCK_WORKSPACES[0]?.id;
  });

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];

  // Persist active workspace
  useEffect(() => {
    if (activeWorkspaceId) {
      localStorage.setItem(STORAGE_KEY, activeWorkspaceId);
    }
  }, [activeWorkspaceId]);

  // Switch workspace
  const switchWorkspace = useCallback(async (workspaceId) => {
    if (workspaceId === activeWorkspaceId) return;
    
    setIsSwitching(true);
    // Simulate API call to switch workspace context
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setWorkspaces(prev => prev.map(w => ({
      ...w,
      isActive: w.id === workspaceId,
    })));
    setActiveWorkspaceId(workspaceId);
    setIsSwitching(false);
    
    // In a real app, this would trigger a context refresh
    return workspaceId;
  }, [activeWorkspaceId]);

  // Create workspace (mock)
  const createWorkspace = useCallback(async (data) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newWorkspace = {
      id: `ws-${Date.now()}`,
      name: data.name,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      logo: null,
      role: 'owner',
      plan: 'starter',
      members: 1,
      isActive: false,
      settings: {
        segment: data.segment || 'startup',
        industry: data.industry || 'Technology',
        teamSize: data.teamSize || '1-10',
      },
    };
    
    setWorkspaces(prev => [...prev, newWorkspace]);
    setIsLoading(false);
    return newWorkspace;
  }, []);

  // Get workspace by ID
  const getWorkspace = useCallback((id) => {
    return workspaces.find(w => w.id === id);
  }, [workspaces]);

  return {
    workspaces,
    activeWorkspace,
    activeWorkspaceId,
    isLoading,
    isSwitching,
    switchWorkspace,
    createWorkspace,
    getWorkspace,
  };
};

export default useWorkspaces;
