import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Activity, Mail, Calendar, MousePointerClick, UserPlus, TrendingUp } from 'lucide-react';

export const LiveActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [isLive, setIsLive] = useState(true);

  const activityTypes = [
    {
      type: 'email_opened',
      icon: Mail,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      type: 'link_clicked',
      icon: MousePointerClick,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      type: 'meeting_booked',
      icon: Calendar,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      type: 'lead_added',
      icon: UserPlus,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      type: 'reply_received',
      icon: TrendingUp,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  useEffect(() => {
    const generateActivity = () => {
      const names = [
        'Sarah Chen',
        'Michael Roberts',
        'Emily Davis',
        'James Wilson',
        'Lisa Anderson',
        'David Martinez',
      ];
      const companies = [
        'TechCorp',
        'CloudScale',
        'DataFlow',
        'InnovateLabs',
        'NexGen Systems',
        'Quantum Dynamics',
      ];
      const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)];

      const actions = {
        email_opened: 'opened your email',
        link_clicked: 'clicked a link in your email',
        meeting_booked: 'booked a meeting with you',
        lead_added: 'was added to your database',
        reply_received: 'replied to your email',
      };

      return {
        id: Date.now(),
        name: names[Math.floor(Math.random() * names.length)],
        company: companies[Math.floor(Math.random() * companies.length)],
        action: actions[randomType.type],
        type: randomType.type,
        timestamp: new Date(),
      };
    };

    // Initial activities
    setActivities([generateActivity(), generateActivity(), generateActivity()]);

    // Add new activity every 5-10 seconds
    const interval = setInterval(
      () => {
        if (isLive) {
          setActivities(prev => [generateActivity(), ...prev.slice(0, 9)]);
        }
      },
      Math.random() * 5000 + 5000
    );

    return () => clearInterval(interval);
  }, [isLive]);

  const getActivityStyle = type => {
    return activityTypes.find(a => a.type === type) || activityTypes[0];
  };

  const getTimeAgo = timestamp => {
    const seconds = Math.floor((new Date() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="text-primary-500" size={20} />
            <CardTitle>Live Activity Feed</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
            ></div>
            <button
              onClick={() => setIsLive(!isLive)}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              {isLive ? 'Live' : 'Paused'}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-72 overflow-y-auto">
          {activities.map(activity => {
            const style = getActivityStyle(activity.type);
            const Icon = style.icon;
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors animate-fadeIn"
              >
                <div className={`p-2 rounded-lg ${style.bg}`}>
                  <Icon className={style.color} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.action} • {activity.company}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {getTimeAgo(activity.timestamp)}
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
