import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/Select';
import {
  Mail,
  Phone,
  Calendar,
  User,
  TrendingUp,
  Send,
  MousePointer,
  MessageCircle,
  Clock,
  Filter,
} from 'lucide-react';

const ActivityFeed = () => {
  const [filter, setFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');

  const activities = [
    {
      id: 1,
      type: 'email_sent',
      user: 'Sarah Chen',
      lead: 'John Doe',
      campaign: 'Q1 Outreach',
      time: '2 min ago',
      details: 'Subject: Partnership Opportunity',
    },
    {
      id: 2,
      type: 'email_opened',
      user: 'Michael Rodriguez',
      lead: 'Jane Smith',
      campaign: 'Product Launch',
      time: '5 min ago',
      details: 'Opened 3 times',
    },
    {
      id: 3,
      type: 'email_replied',
      user: 'Emily Watson',
      lead: 'Bob Johnson',
      campaign: 'Re-engagement',
      time: '12 min ago',
      details: 'Positive response - interested in demo',
    },
    {
      id: 4,
      type: 'meeting_booked',
      user: 'James Kim',
      lead: 'Alice Williams',
      campaign: 'Enterprise Sales',
      time: '18 min ago',
      details: 'Demo scheduled for Jan 15',
    },
    {
      id: 5,
      type: 'call_completed',
      user: 'Lisa Anderson',
      lead: 'Charlie Brown',
      campaign: 'Cold Calling',
      time: '25 min ago',
      details: 'Duration: 18:42, Sentiment: Positive',
    },
    {
      id: 6,
      type: 'lead_scored',
      user: 'System',
      lead: 'Diana Prince',
      campaign: 'Auto-scoring',
      time: '32 min ago',
      details: 'Score increased: 45 → 82 (Hot)',
    },
    {
      id: 7,
      type: 'email_clicked',
      user: 'Michael Rodriguez',
      lead: 'Eve Adams',
      campaign: 'Product Launch',
      time: '45 min ago',
      details: 'Clicked: Pricing page',
    },
    {
      id: 8,
      type: 'email_sent',
      user: 'Sarah Chen',
      lead: 'Frank Miller',
      campaign: 'Q1 Outreach',
      time: '1 hour ago',
      details: 'Follow-up #2',
    },
    {
      id: 9,
      type: 'meeting_booked',
      user: 'Emily Watson',
      lead: 'Grace Lee',
      campaign: 'Demo Requests',
      time: '1 hour ago',
      details: 'Discovery call scheduled',
    },
    {
      id: 10,
      type: 'email_replied',
      user: 'James Kim',
      lead: 'Henry Ford',
      campaign: 'Enterprise Sales',
      time: '2 hours ago',
      details: 'Requested pricing information',
    },
    {
      id: 11,
      type: 'lead_assigned',
      user: 'System',
      lead: 'Ivy Chen',
      campaign: 'Auto-routing',
      time: '2 hours ago',
      details: 'Assigned to: Michael Rodriguez',
    },
    {
      id: 12,
      type: 'call_completed',
      user: 'Lisa Anderson',
      lead: 'Jack Wilson',
      campaign: 'Follow-up Calls',
      time: '3 hours ago',
      details: 'Duration: 12:15, Left voicemail',
    },
  ];

  const getActivityIcon = type => {
    const icons = {
      email_sent: <Send className="w-5 h-5 text-blue-600" />,
      email_opened: <Mail className="w-5 h-5 text-green-600" />,
      email_replied: <MessageCircle className="w-5 h-5 text-purple-600" />,
      email_clicked: <MousePointer className="w-5 h-5 text-orange-600" />,
      meeting_booked: <Calendar className="w-5 h-5 text-pink-600" />,
      call_completed: <Phone className="w-5 h-5 text-indigo-600" />,
      lead_scored: <TrendingUp className="w-5 h-5 text-yellow-600" />,
      lead_assigned: <User className="w-5 h-5 text-teal-600" />,
    };
    return icons[type] || <Clock className="w-5 h-5 text-gray-600" />;
  };

  const getActivityLabel = type => {
    const labels = {
      email_sent: 'Email Sent',
      email_opened: 'Email Opened',
      email_replied: 'Email Replied',
      email_clicked: 'Link Clicked',
      meeting_booked: 'Meeting Booked',
      call_completed: 'Call Completed',
      lead_scored: 'Lead Scored',
      lead_assigned: 'Lead Assigned',
    };
    return labels[type] || type;
  };

  const getActivityColor = type => {
    const colors = {
      email_sent: 'bg-blue-100 dark:bg-blue-500/20',
      email_opened: 'bg-green-100 dark:bg-green-500/20',
      email_replied: 'bg-purple-100 dark:bg-purple-500/20',
      email_clicked: 'bg-orange-100 dark:bg-orange-500/20',
      meeting_booked: 'bg-pink-100 dark:bg-pink-500/20',
      call_completed: 'bg-indigo-100 dark:bg-indigo-500/20',
      lead_scored: 'bg-yellow-100 dark:bg-yellow-500/20',
      lead_assigned: 'bg-teal-100 dark:bg-teal-500/20',
    };
    return colors[type] || 'bg-gray-100 dark:bg-gray-800';
  };

  const filteredActivities = activities.filter(activity => {
    if (filter !== 'all' && activity.type !== filter) return false;
    if (userFilter !== 'all' && activity.user !== userFilter) return false;
    return true;
  });

  const users = ['all', ...new Set(activities.map(a => a.user))];
  const activityTypes = [
    'all',
    'email_sent',
    'email_opened',
    'email_replied',
    'email_clicked',
    'meeting_booked',
    'call_completed',
    'lead_scored',
  ];

  const stats = {
    total: activities.length,
    emails: activities.filter(a => a.type.startsWith('email')).length,
    meetings: activities.filter(a => a.type === 'meeting_booked').length,
    calls: activities.filter(a => a.type === 'call_completed').length,
  };

  return (
    <DashboardLayout title="Activity Feed" subtitle="Real-time team activity across all channels">
      <div className="space-y-3">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Activities</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">{stats.emails}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email Events</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-lg font-bold text-pink-600">{stats.meetings}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Meetings Booked</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-lg font-bold text-indigo-600">{stats.calls}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Calls Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Feed */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
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
              {filteredActivities.map(activity => (
                <div
                  key={activity.id}
                  className={`p-4 rounded-lg ${getActivityColor(activity.type)} border border-gray-200 dark:border-white/10 transition-all hover:shadow-md`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
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
                      <p className="text-xs text-gray-600 dark:text-gray-400">{activity.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredActivities.length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-12 h-9 text-gray-400 mx-auto mb-3" />
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
                const intensity =
                  count > 30
                    ? 'bg-green-500'
                    : count > 15
                      ? 'bg-green-400'
                      : count > 5
                        ? 'bg-green-300'
                        : 'bg-gray-200 dark:bg-gray-700';
                return (
                  <div key={i} className="text-center">
                    <div
                      className={`h-16 ${intensity} rounded transition-colors hover:opacity-80 cursor-pointer flex items-center justify-center`}
                    >
                      <span className="text-xs font-semibold">{count}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{hour}:00</p>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center items-center gap-3 mt-4">
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
