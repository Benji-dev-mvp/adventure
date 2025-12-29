/**
 * Activity Service
 * Handles activity feed data operations with low cognitive complexity
 */

export interface Activity {
  id: string;
  type: 'campaign' | 'lead' | 'ai' | 'system';
  event: string;
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  color: string;
  read: boolean;
  entityId: string | null;
  entityType: string;
}

export interface ActivityFilter {
  type?: 'all' | 'unread' | 'campaign' | 'lead' | 'ai' | 'system';
  startDate?: Date;
  endDate?: Date;
  read?: boolean;
}

export interface GroupedActivities {
  today: Activity[];
  yesterday: Activity[];
  older: Activity[];
}

// Helper functions to reduce cognitive complexity
const matchesTypeFilter = (activity: Activity, type: string): boolean => {
  if (type === 'all') return true;
  if (type === 'unread') return !activity.read;
  return activity.type === type;
};

const matchesDateRange = (activity: Activity, start?: Date, end?: Date): boolean => {
  const timestamp = new Date(activity.timestamp).getTime();

  if (start && timestamp < start.getTime()) return false;
  if (end && timestamp > end.getTime()) return false;

  return true;
};

const matchesReadStatus = (activity: Activity, readFilter?: boolean): boolean => {
  return readFilter === undefined || activity.read === readFilter;
};

/**
 * Filter activities based on provided criteria
 * Cognitive Complexity: 4 (reduced from potential 17)
 */
export const filterActivities = (
  activities: Activity[],
  filter: ActivityFilter = {}
): Activity[] => {
  const { type = 'all', startDate, endDate, read } = filter;

  return activities.filter(activity => {
    // Early return pattern reduces complexity
    if (!matchesTypeFilter(activity, type)) return false;
    if (!matchesDateRange(activity, startDate, endDate)) return false;
    if (!matchesReadStatus(activity, read)) return false;

    return true;
  });
};

/**
 * Group activities by time period
 */
export const groupActivitiesByTime = (activities: Activity[]): GroupedActivities => {
  const today = getTodayMidnight();
  const yesterday = getYesterdayMidnight();

  return {
    today: activities.filter(a => isFromToday(a.timestamp, today)),
    yesterday: activities.filter(a => isFromYesterday(a.timestamp, today, yesterday)),
    older: activities.filter(a => isOlderThanYesterday(a.timestamp, yesterday)),
  };
};

/**
 * Mark activity as read
 */
export const markActivityAsRead = (activities: Activity[], activityId: string): Activity[] => {
  return activities.map(activity =>
    activity.id === activityId ? { ...activity, read: true } : activity
  );
};

/**
 * Mark all activities as read
 */
export const markAllActivitiesAsRead = (activities: Activity[]): Activity[] => {
  return activities.map(activity => ({ ...activity, read: true }));
};

/**
 * Get unread activity count
 */
export const getUnreadCount = (activities: Activity[]): number => {
  return activities.filter(a => !a.read).length;
};

/**
 * Sort activities by timestamp (newest first)
 */
export const sortActivitiesByDate = (activities: Activity[]): Activity[] => {
  return [...activities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Date helper functions (extracted to reduce complexity)
const getTodayMidnight = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const getYesterdayMidnight = (): Date => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  return yesterday;
};

const isFromToday = (timestamp: Date, todayMidnight: Date): boolean => {
  return new Date(timestamp).getTime() >= todayMidnight.getTime();
};

const isFromYesterday = (
  timestamp: Date,
  todayMidnight: Date,
  yesterdayMidnight: Date
): boolean => {
  const time = new Date(timestamp).getTime();
  return time >= yesterdayMidnight.getTime() && time < todayMidnight.getTime();
};

const isOlderThanYesterday = (timestamp: Date, yesterdayMidnight: Date): boolean => {
  return new Date(timestamp).getTime() < yesterdayMidnight.getTime();
};

/**
 * Generate mock activities for development
 */
type ActivitySeed = Omit<Activity, 'timestamp'> & { offsetMs: number };

const createActivity = (now: number, seed: ActivitySeed): Activity => ({
  ...seed,
  timestamp: new Date(now - seed.offsetMs),
});

export const generateMockActivities = (): Activity[] => {
  const now = Date.now();
  const minute = 60 * 1000;
  const hour = 60 * minute;

  const mockActivitySeeds: ActivitySeed[] = [
    {
      id: '1',
      type: 'campaign',
      event: 'launched',
      title: 'Campaign "Q1 Outbound Blitz" launched',
      description: 'Started sending to 2,450 prospects in the Tech Startup segment',
      offsetMs: 12 * minute,
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
      offsetMs: 28 * minute,
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
      offsetMs: 45 * minute,
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
      offsetMs: 1.5 * hour,
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
      offsetMs: 2 * hour,
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
      offsetMs: 3 * hour,
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
      offsetMs: 4 * hour,
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
      offsetMs: 5 * hour,
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
      offsetMs: 8 * hour,
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
      offsetMs: 12 * hour,
      icon: 'Calendar',
      color: 'green',
      read: true,
      entityId: 'lead-112',
      entityType: 'lead',
    },
  ];

  return mockActivitySeeds.map(seed => createActivity(now, seed));
};

export default {
  filterActivities,
  groupActivitiesByTime,
  markActivityAsRead,
  markAllActivitiesAsRead,
  getUnreadCount,
  sortActivitiesByDate,
  generateMockActivities,
};
