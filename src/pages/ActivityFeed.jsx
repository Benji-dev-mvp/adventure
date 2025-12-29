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
  function formatTimeAgo(timestamp: string): string {
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

  const getActivityIcon = (type: string) => {
    if (type === 'ai') return <MessageCircle className="w-5 h-5 text-cyan-600" />;
    if (type === 'human') return <User className="w-5 h-5 text-purple-600" />;
    if (type === 'system') return <ActivityIcon className="w-5 h-5 text-slate-600" />;
    return <Clock className="w-5 h-5 text-gray-600" />;
  };

  const getActivityColor = (type: string, importance: string) => {
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
    meetings: activities.filter(a => a.type === 'meeting_booked').length,
    calls: activities.filter(a => a.type === 'call_completed').length
  };

  return (
    <DashboardLayout title="Activity Feed" subtitle="Real-time team activity across all channels">
      <div className="space-y-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Activities</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{stats.emails}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email Events</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-pink-600">{stats.meetings}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Meetings Booked</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600">{stats.calls}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Calls Completed</p>
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
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="email_sent">Email Sent</SelectItem>
                    <SelectItem value="email_opened">Email Opened</SelectItem>
                    <SelectItem value="email_replied">Email Replied</SelectItem>
                    <SelectItem value="email_clicked">Link Clicked</SelectItem>
                    <SelectItem value="meeting_booked">Meeting Booked</SelectItem>
                    <SelectItem value="call_completed">Call Completed</SelectItem>
                    <SelectItem value="lead_scored">Lead Scored</SelectItem>
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
                  className={`p-4 rounded-lg ${getActivityColor(activity.type)} border border-gray-200 dark:border-white/10 transition-all hover:shadow-md`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" size="sm">
                            {getActivityLabel(activity.type)}
                          </Badge>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {activity.user}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {activity.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                        <span className="font-medium">{activity.lead}</span> • {activity.campaign}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {activity.details}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredActivities.length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No activities match your filters</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Heatmap - Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-12 gap-2">
              {Array.from({ length: 24 }, (_, i) => {
                const hour = i;
                const count = Math.floor(Math.random() * 50);
                const intensity = count > 30 ? 'bg-green-500' : count > 15 ? 'bg-green-400' : count > 5 ? 'bg-green-300' : 'bg-gray-200 dark:bg-gray-700';
                return (
                  <div key={i} className="text-center">
                    <div className={`h-16 ${intensity} rounded transition-colors hover:opacity-80 cursor-pointer flex items-center justify-center`}>
                      <span className="text-xs font-semibold">{count}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {hour}:00
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center items-center gap-4 mt-4">
              <span className="text-xs text-gray-600">Less</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="w-4 h-4 bg-green-300 rounded"></div>
                <div className="w-4 h-4 bg-green-400 rounded"></div>
                <div className="w-4 h-4 bg-green-500 rounded"></div>
              </div>
              <span className="text-xs text-gray-600">More</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ActivityFeed;
