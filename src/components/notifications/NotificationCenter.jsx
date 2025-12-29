import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { TabsRadix, TabsListRadix, TabsTriggerRadix } from '../ui/TabsRadix';
import {
  Bell,
  Mail,
  Calendar,
  AlertTriangle,
  Sparkles,
  Check,
  X,
  Trash2,
  Settings,
} from 'lucide-react';

export const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'reply',
      title: 'New reply from Sarah Chen',
      message: 'Interested in learning more. Can we schedule a demo?',
      time: '2 min ago',
      read: false,
      category: 'replies',
    },
    {
      id: 2,
      type: 'meeting',
      title: 'Meeting booked: TechCorp Demo',
      message: 'Michael Rodriguez booked a 30-min demo for tomorrow at 2:00 PM',
      time: '15 min ago',
      read: false,
      category: 'meetings',
    },
    {
      id: 3,
      type: 'alert',
      title: 'Campaign performance alert',
      message: 'Email open rate dropped 15% in Q1 Outreach campaign',
      time: '1 hour ago',
      read: false,
      category: 'alerts',
    },
    {
      id: 4,
      type: 'insight',
      title: 'AI Insight: Best time to send',
      message: 'Your leads are most responsive on Tuesday mornings at 9:30 AM',
      time: '2 hours ago',
      read: true,
      category: 'insights',
    },
    {
      id: 5,
      type: 'reply',
      title: 'Reply from Emily Watson',
      message: "Thanks for reaching out. Let's connect next week.",
      time: '3 hours ago',
      read: true,
      category: 'replies',
    },
    {
      id: 6,
      type: 'meeting',
      title: 'Meeting reminder',
      message: 'Demo with Enterprise Systems in 1 hour',
      time: '4 hours ago',
      read: true,
      category: 'meetings',
    },
    {
      id: 7,
      type: 'alert',
      title: 'Lead score threshold reached',
      message: '3 leads crossed the hot lead threshold (score 80+)',
      time: '5 hours ago',
      read: true,
      category: 'alerts',
    },
    {
      id: 8,
      type: 'insight',
      title: 'Weekly performance summary',
      message: 'Your reply rate increased by 12% this week. Great job!',
      time: '1 day ago',
      read: true,
      category: 'insights',
    },
  ]);

  const [activeCategory, setActiveCategory] = useState('all');
  const [unreadCount, setUnreadCount] = useState(notifications.filter(n => !n.read).length);

  // Update unread count when notifications change
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('artisan_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('artisan_notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, []);

  const handleMarkAsRead = id => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDelete = id => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
    }
  };

  const getIcon = type => {
    switch (type) {
      case 'reply':
        return Mail;
      case 'meeting':
        return Calendar;
      case 'alert':
        return AlertTriangle;
      case 'insight':
        return Sparkles;
      default:
        return Bell;
    }
  };

  const getIconColor = type => {
    switch (type) {
      case 'reply':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-500/20';
      case 'meeting':
        return 'text-green-600 bg-green-100 dark:bg-green-500/20';
      case 'alert':
        return 'text-red-600 bg-red-100 dark:bg-red-500/20';
      case 'insight':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-500/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-500/20';
    }
  };

  const filteredNotifications =
    activeCategory === 'all'
      ? notifications
      : notifications.filter(n => n.category === activeCategory);

  const categoryCount = category => {
    return notifications.filter(n => n.category === category && !n.read).length;
  };

  return (
    <>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
                {unreadCount > 0 && <Badge variant="danger">{unreadCount} new</Badge>}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Mark all read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={notifications.length === 0}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear all
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Category Tabs */}
          <TabsRadix value={activeCategory} onValueChange={setActiveCategory} className="mt-4">
            <TabsListRadix>
              <TabsTriggerRadix value="all">
                All {unreadCount > 0 && `(${unreadCount})`}
              </TabsTriggerRadix>
              <TabsTriggerRadix value="replies">
                Replies {categoryCount('replies') > 0 && `(${categoryCount('replies')})`}
              </TabsTriggerRadix>
              <TabsTriggerRadix value="meetings">
                Meetings {categoryCount('meetings') > 0 && `(${categoryCount('meetings')})`}
              </TabsTriggerRadix>
              <TabsTriggerRadix value="alerts">
                Alerts {categoryCount('alerts') > 0 && `(${categoryCount('alerts')})`}
              </TabsTriggerRadix>
              <TabsTriggerRadix value="insights">
                Insights {categoryCount('insights') > 0 && `(${categoryCount('insights')})`}
              </TabsTriggerRadix>
            </TabsListRadix>

            {/* Notifications List */}
            <div className="mt-4 space-y-2 overflow-y-auto max-h-[500px] pr-2">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">No notifications</p>
                  <p className="text-sm text-gray-500 mt-1">You're all caught up!</p>
                </div>
              ) : (
                filteredNotifications.map(notification => {
                  const Icon = getIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-all ${
                        notification.read
                          ? 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-white/10'
                          : 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getIconColor(notification.type)}`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4
                              className={`text-sm font-semibold ${
                                notification.read
                                  ? 'text-gray-900 dark:text-white'
                                  : 'text-gray-900 dark:text-white'
                              }`}
                            >
                              {notification.title}
                            </h4>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {notification.message}
                          </p>

                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-xs h-7"
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Mark read
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(notification.id)}
                              className="text-xs h-7 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsRadix>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
            <Button variant="outline" className="w-full" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Notification Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationCenter;
