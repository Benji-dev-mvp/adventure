import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Clock, CheckCircle2, AlertCircle, Mail, MousePointerClick } from 'lucide-react';

export const ActivityFeed = ({ activities = [] }) => {
  const defaultActivities = [
    {
      id: 1,
      type: 'email_sent',
      message: 'Sent 127 emails in Q1 Enterprise Outreach',
      time: '5 minutes ago',
      icon: Mail,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 2,
      type: 'link_clicked',
      message: 'John Smith clicked pricing page link',
      time: '12 minutes ago',
      icon: MousePointerClick,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 3,
      type: 'email_replied',
      message: 'Sarah Chen replied to your follow-up',
      time: '1 hour ago',
      icon: CheckCircle2,
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 4,
      type: 'campaign_paused',
      message: 'Re-engagement Campaign was paused',
      time: '2 hours ago',
      icon: AlertCircle,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  const getIcon = (activity) => {
    const Icon = activity.icon || Clock;
    return Icon;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity) => {
            const Icon = getIcon(activity);
            return (
              <div key={activity.id} className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
