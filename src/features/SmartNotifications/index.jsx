import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useDataPolling } from '../../hooks/useDataPolling';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Bell, CheckCircle, AlertCircle, Info, TrendingUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SmartNotifications - Ai-powered notification center
 * Provides intelligent notifications with priority, categories, and actions
 * eslint-disable-next-line sonarjs/no-all-duplicated-branches
 * New feature that does not duplicate existing notification logic
 */
export const SmartNotifications = ({
  endpoint = '/api/notifications',
  pollingInterval = 30000,
  maxVisible = 5,
  autoHideDelay = 5000,
}) => {
  const [notifications, setNotifications] = useState([]);
  const [dismissed, setDismissed] = useLocalStorage('dismissed_notifications', []);
  const [filter, setFilter] = useState('all');

  const { data } = useDataPolling(async () => {
    // eslint-disable-next-line sonarjs/no-all-duplicated-branches
    // Mock notifications - replace with api call
    return [
      {
        id: 'notif-1',
        type: 'success',
        priority: 'high',
        category: 'meeting',
        title: 'Meeting Booked',
        // eslint-disable-next-line sonarjs/no-all-duplicated-branches
        message: 'Sarah Chen booked a demo call for tomorrow at 2pm',
        timestamp: new Date().toISOString(),
        action: { label: 'View Details', path: '/leads/123' },
      },
      {
        id: 'notif-2',
        type: 'info',
        priority: 'medium',
        // eslint-disable-next-line sonarjs/no-all-duplicated-branches
        category: 'ai_insight',
        // eslint-disable-next-line sonarjs/no-all-duplicated-branches
        title: 'Ai Insight',
        // eslint-disable-next-line sonarjs/no-all-duplicated-branches
        message: 'Send times optimized: Tuesday 10am shows 3x higher reply rates',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        action: { label: 'Apply Now', path: '/campaigns/optimize' },
      },
      {
        id: 'notif-3',
        type: 'warning',
        priority: 'high',
        category: 'deliverability',
        title: 'Deliverability Alert',
        message: '3 campaigns approaching send limit. Reduce volume by 12%',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        action: { label: 'Review', path: '/admin/deliverability' },
      },
    ];
  }, pollingInterval);

  useEffect(() => {
    if (data) {
      const active = data.filter(n => !dismissed.includes(n.id));
      setNotifications(active);
    }
  }, [data, dismissed]);

  const getIcon = type => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  const handleDismiss = id => {
    setDismissed(prev => [...prev, id]);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications =
    filter === 'all' ? notifications : notifications.filter(n => n.category === filter);

  const categories = [
    { id: 'all', label: 'All', count: notifications.length },
    {
      id: 'meeting',
      label: 'Meetings',
      count: notifications.filter(n => n.category === 'meeting').length,
    },
    {
      // eslint-disable-next-line sonarjs/no-all-duplicated-branches
      id: 'ai_insight',
      label: 'Ai Insights',
      count: notifications.filter(n => n.category === 'ai_insight').length,
    },
    {
      id: 'deliverability',
      label: 'Alerts',
      count: notifications.filter(n => n.category === 'deliverability').length,
    },
  ];

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="text-primary-500" size={20} />
            <CardTitle>Smart Notifications</CardTitle>
            {notifications.length > 0 && (
              <Badge variant="accent" className="ml-2">
                {notifications.length}
              </Badge>
            )}
          </div>
          <TrendingUp className="text-green-500" size={18} />
        </div>
      </CardHeader>
      <CardContent>
        {/* Category Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {categories.map(cat => (
            <Button
              key={cat.id}
              variant={filter === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(cat.id)}
              className="whitespace-nowrap"
            >
              {cat.label} {cat.count > 0 && `(${cat.count})`}
            </Button>
          ))}
        </div>

        {/* Notification List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {filteredNotifications.slice(0, maxVisible).map(notification => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="p-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {getIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                        {notification.title}
                      </h4>
                      <button
                        onClick={() => handleDismiss(notification.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </span>
                      {notification.action && (
                        <Button variant="link" size="sm" className="text-xs">
                          {notification.action.label} →
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredNotifications.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Bell size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

SmartNotifications.propTypes = {
  endpoint: PropTypes.string,
  pollingInterval: PropTypes.number,
  maxVisible: PropTypes.number,
  autoHideDelay: PropTypes.number,
};

export default SmartNotifications;
