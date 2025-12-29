import { useState, useCallback, useEffect } from 'react';

// Mock activity data generator
const generateMockActivities = () => {
  const now = Date.now();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  
  return [
    {
      id: '1',
      type: 'campaign',
      event: 'launched',
      title: 'Campaign "Q1 Outbound Blitz" launched',
      description: 'Started sending to 2,450 prospects in the Tech Startup segment',
      timestamp: new Date(now - 12 * minute),
      icon: 'Rocket',
      color: 'green',
      read: false,
      entityId: 'camp-001',
      entityType: 'campaign',
    },
    {
      id: '2',
      type: 'lead',
      event: 'high-intent',
      title: 'High-intent lead detected',
      description: 'Sarah Chen (Acme Corp) opened emails 5x and visited pricing page',
      timestamp: new Date(now - 28 * minute),
      icon: 'Target',
      color: 'purple',
      read: false,
      entityId: 'lead-042',
      entityType: 'lead',
    },
    {
      id: '3',
      type: 'lead',
      event: 'reply',
      title: 'Reply received',
      description: 'James Wilson responded positively to the "Re-engagement" sequence',
      timestamp: new Date(now - 45 * minute),
      icon: 'MessageSquare',
      color: 'blue',
      read: false,
      entityId: 'lead-089',
      entityType: 'lead',
    },
    {
      id: '4',
      type: 'ai',
      event: 'optimization',
      title: 'Ava optimized send times',
      description: 'Updated delivery windows for 3 campaigns based on engagement patterns',
      timestamp: new Date(now - 1.5 * hour),
      icon: 'Sparkles',
      color: 'cyan',
      read: true,
      entityId: null,
      entityType: 'ai',
    },
    {
      id: '5',
      type: 'campaign',
      event: 'failing',
      title: 'Campaign performance alert',
      description: '"Enterprise Outreach" has 2.1% open rate - below 5% threshold',
      timestamp: new Date(now - 2 * hour),
      icon: 'AlertTriangle',
      color: 'amber',
      read: true,
      entityId: 'camp-003',
      entityType: 'campaign',
    },
    {
      id: '6',
      type: 'system',
      event: 'integration-error',
      title: 'Salesforce sync issue',
      description: 'Failed to sync 12 leads. API rate limit exceeded.',
      timestamp: new Date(now - 3 * hour),
      icon: 'AlertCircle',
      color: 'red',
      read: true,
      entityId: 'int-salesforce',
      entityType: 'integration',
    },
    {
      id: '7',
      type: 'system',
      event: 'usage-warning',
      title: 'Email quota at 85%',
      description: 'You have used 8,500 of 10,000 monthly emails. Consider upgrading.',
      timestamp: new Date(now - 4 * hour),
      icon: 'TrendingUp',
      color: 'amber',
      read: true,
      entityId: null,
      entityType: 'billing',
    },
    {
      id: '8',
      type: 'ai',
      event: 'leads-scored',
      title: 'Ava scored 156 new leads',
      description: '23 marked as hot, 67 warm, 66 cold. Review recommended.',
      timestamp: new Date(now - 5 * hour),
      icon: 'Brain',
      color: 'purple',
      read: true,
      entityId: null,
      entityType: 'ai',
    },
    {
      id: '9',
      type: 'campaign',
      event: 'paused',
      title: 'Campaign auto-paused',
      description: '"Holiday Promo" paused due to high bounce rate (12%)',
      timestamp: new Date(now - 8 * hour),
      icon: 'PauseCircle',
      color: 'amber',
      read: true,
      entityId: 'camp-004',
      entityType: 'campaign',
    },
    {
      id: '10',
      type: 'lead',
      event: 'meeting-booked',
      title: 'Meeting booked!',
      description: 'Michael Torres (Globex) scheduled a demo for tomorrow at 2pm',
      timestamp: new Date(now - 12 * hour),
      icon: 'Calendar',
      color: 'green',
      read: true,
      entityId: 'lead-112',
      entityType: 'lead',
    },
  ];
};

export const useActivityFeed = (options = {}) => {
  const { autoRefresh = false, refreshInterval = 30000 } = options;
  
  const [activities, setActivities] = useState(() => generateMockActivities());
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, campaign, lead, ai, system
  
  // Derived state
  const unreadCount = activities.filter(a => !a.read).length;
  
  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !activity.read;
    return activity.type === filter;
  });

  // Mark as read
  const markAsRead = useCallback((activityId) => {
    setActivities(prev => 
      prev.map(a => a.id === activityId ? { ...a, read: true } : a)
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setActivities(prev => prev.map(a => ({ ...a, read: true })));
  }, []);

  // Refresh activities
  const refresh = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setActivities(generateMockActivities());
    setIsLoading(false);
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refresh]);

  // Group by time
  const groupedActivities = {
    today: filteredActivities.filter(a => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(a.timestamp) >= today;
    }),
    yesterday: filteredActivities.filter(a => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const activityDate = new Date(a.timestamp);
      return activityDate >= yesterday && activityDate < today;
    }),
    older: filteredActivities.filter(a => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      return new Date(a.timestamp) < yesterday;
    }),
  };

  return {
    activities: filteredActivities,
    groupedActivities,
    unreadCount,
    isLoading,
    filter,
    setFilter,
    markAsRead,
    markAllAsRead,
    refresh,
  };
};

export default useActivityFeed;
