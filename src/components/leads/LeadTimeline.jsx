import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import {
  Mail,
  MessageSquare,
  Calendar,
  Star,
  Eye,
  MousePointerClick,
  UserPlus,
  Clock,
} from 'lucide-react';

export const LeadTimeline = ({ leadId }) => {
  const events = [
    {
      id: 1,
      type: 'email_sent',
      title: 'Email sent: "Quick question about scaling"',
      timestamp: '2024-12-26 10:30 AM',
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      details: 'Campaign: Q1 Enterprise Outreach',
    },
    {
      id: 2,
      type: 'email_opened',
      title: 'Email opened',
      timestamp: '2024-12-26 10:45 AM',
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      details: 'Opened 3 times from San Francisco, CA',
    },
    {
      id: 3,
      type: 'link_clicked',
      title: 'Clicked link in email',
      timestamp: '2024-12-26 10:47 AM',
      icon: MousePointerClick,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      details: 'Visited: Product Demo Page',
    },
    {
      id: 4,
      type: 'linkedin_message',
      title: 'LinkedIn connection accepted',
      timestamp: '2024-12-26 2:15 PM',
      icon: MessageSquare,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    },
    {
      id: 5,
      type: 'email_reply',
      title: 'Replied to email',
      timestamp: '2024-12-26 3:30 PM',
      icon: Mail,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      details: '"Thanks for reaching out! Let\'s schedule a call."',
      important: true,
    },
    {
      id: 6,
      type: 'meeting_scheduled',
      title: 'Meeting scheduled',
      timestamp: '2024-12-26 4:00 PM',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      details: 'Demo call scheduled for Dec 28, 2024 at 2:00 PM',
      important: true,
    },
    {
      id: 7,
      type: 'lead_created',
      title: 'Lead added to database',
      timestamp: '2024-12-25 9:00 AM',
      icon: UserPlus,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100 dark:bg-gray-700',
      details: 'Source: LinkedIn Sales Navigator',
    },
  ].reverse(); // Show most recent first

  const getRelativeTime = timestamp => {
    // Simple relative time calculation
    return timestamp;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="text-primary-500" size={20} />
          <CardTitle>Activity Timeline</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Chronological view of all interactions
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

          <div className="space-y-3">
            {events.map((event, index) => {
              const Icon = event.icon;
              return (
                <div key={event.id} className="relative pl-14">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-0 w-12 h-9 rounded-full ${event.bgColor} flex items-center justify-center`}
                  >
                    <Icon className={event.color} size={20} />
                  </div>

                  {/* Event content */}
                  <div
                    className={`p-4 rounded-lg border transition-all ${
                      event.important
                        ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10'
                        : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        {event.title}
                        {event.important && (
                          <Star className="text-yellow-500" size={14} fill="currentColor" />
                        )}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap ml-2">
                        {event.timestamp}
                      </span>
                    </div>
                    {event.details && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{event.details}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Load more */}
        <div className="text-center mt-6">
          <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
            Load earlier activity
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
