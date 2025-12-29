import React, { useState, useMemo } from 'react';
import { PageScaffold, BadgePill, SectionHeader, EmptyState, LoadingSkeleton } from '@/components/layout/shared';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Mail, Phone, Calendar, User, TrendingUp, Send, MousePointer, MessageCircle, Clock, Filter, Activity as ActivityIcon } from 'lucide-react';
import { useAppPlan } from '@/state/appStore';
import { getDemoEvents } from '@/demo/demoData';
import { cn } from '@/lib/utils';

const ActivityFeed = () => {
  const plan = useAppPlan();
  const [filter, setFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');

  // Get demo events from centralized data contract
  const activities = useMemo(() => getDemoEvents(plan), [plan]);

  // Map demo events to activity format
  const mappedActivities = useMemo(() => {
    return activities.map((event) => ({
      id: event.id,
      type: event.type,
      user: event.actor,
      action: event.action,
      target: event.target,
      details: event.details,
      timestamp: event.timestamp,
      importance: event.importance,
      timeAgo: formatTimeAgo(event.timestamp),
    }));
  }, [activities]);

  // Helper to format timestamp as "time ago"
  function formatTimeAgo(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  }

  const getActivityIcon = (type) => {
    if (type === 'ai') return <MessageCircle className="w-5 h-5 text-cyan-600" />;
    if (type === 'human') return <User className="w-5 h-5 text-purple-600" />;
    if (type === 'system') return <ActivityIcon className="w-5 h-5 text-slate-600" />;
    return <Clock className="w-5 h-5 text-gray-600" />;
  };

  const getActivityColor = (type, importance) => {
    if (importance === 'high') return 'bg-red-100 dark:bg-red-500/20 border-red-500/30';
    if (importance === 'medium') return 'bg-amber-100 dark:bg-amber-500/20 border-amber-500/30';
    
    if (type === 'ai') return 'bg-cyan-100 dark:bg-cyan-500/20 border-cyan-500/30';
    if (type === 'human') return 'bg-purple-100 dark:bg-purple-500/20 border-purple-500/30';
    return 'bg-slate-100 dark:bg-slate-800 border-slate-700';
  };

  const filteredActivities = mappedActivities.filter(activity => {
    if (filter !== 'all' && activity.type !== filter) return false;
    if (userFilter !== 'all' && activity.user !== userFilter) return false;
    return true;
  });

  const users = ['all', ...new Set(mappedActivities.map(a => a.user))];
  const activityTypes = ['all', 'ai', 'human', 'system'];

  const stats = {
    total: mappedActivities.length,
    ai: mappedActivities.filter(a => a.type === 'ai').length,
    human: mappedActivities.filter(a => a.type === 'human').length,
    system: mappedActivities.filter(a => a.type === 'system').length,
  };

  return (
    <PageScaffold
      title="Activity Feed"
      subtitle="Real-time team activity across all channels"
    >
      <div className="space-y-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{stats.total}</p>
                <p className="text-sm text-slate-400">Total Activities</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-500">{stats.ai}</p>
                <p className="text-sm text-slate-400">AI Events</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-500">{stats.human}</p>
                <p className="text-sm text-slate-400">Human Actions</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-slate-400">{stats.system}</p>
                <p className="text-sm text-slate-400">System Events</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Feed */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle>Live Activity Stream</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="ai">AI</SelectItem>
                    <SelectItem value="human">Human</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user} value={user}>
                        {user === 'all' ? 'All Users' : user}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={cn(
                    'p-4 rounded-lg border transition-all hover:shadow-md',
                    getActivityColor(activity.type, activity.importance)
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <BadgePill variant="default" className="text-xs">
                            {activity.type.toUpperCase()}
                          </BadgePill>
                          <span className="text-sm font-semibold text-white">
                            {activity.user}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                          {activity.timeAgo}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 mb-1">
                        {activity.action} <span className="font-medium text-white">{activity.target}</span>
                      </p>
                      <p className="text-xs text-slate-400">
                        {activity.details}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredActivities.length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400">No activities match your filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageScaffold>
  );
};

export default ActivityFeed;
