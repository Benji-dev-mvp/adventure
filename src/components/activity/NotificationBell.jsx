import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Filter,
  Rocket,
  Target,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Brain,
  PauseCircle,
  Calendar,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useActivityFeed } from '@/hooks/useActivityFeed';

// Icon mapping
const iconMap = {
  Rocket,
  Target,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Brain,
  PauseCircle,
  Calendar,
};

// Color mapping
const colorMap = {
  green: 'bg-green-500/20 text-green-500 border-green-500/30',
  purple: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
  blue: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  cyan: 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30',
  amber: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
  red: 'bg-red-500/20 text-red-500 border-red-500/30',
};

const formatTimeAgo = date => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
};

const ActivityItem = ({ activity, onMarkAsRead, onNavigate }) => {
  const Icon = iconMap[activity.icon] || Bell;
  const colorClass = colorMap[activity.color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        'flex gap-3 p-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer',
        !activity.read && 'bg-accent-50/30 dark:bg-accent-500/5'
      )}
      onClick={() => {
        onMarkAsRead(activity.id);
        if (activity.entityId) {
          onNavigate(activity);
        }
      }}
    >
      <div className={cn('p-2 rounded-lg border shrink-0', colorClass)}>
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-sm',
              activity.read
                ? 'text-gray-600 dark:text-gray-400'
                : 'text-gray-900 dark:text-white font-medium'
            )}
          >
            {activity.title}
          </p>
          {!activity.read && (
            <span className="w-2 h-2 rounded-full bg-accent-500 shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5 truncate">
          {activity.description}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
          {formatTimeAgo(activity.timestamp)}
        </p>
      </div>

      {activity.entityId && (
        <button
          className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded shrink-0 self-center"
          onClick={e => {
            e.stopPropagation();
            onNavigate(activity);
          }}
        >
          <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
        </button>
      )}
    </motion.div>
  );
};

const FilterButton = ({ active, onClick, children, count }) => (
  <button
    onClick={onClick}
    className={cn(
      'px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap',
      active
        ? 'bg-accent-500 text-white'
        : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20'
    )}
  >
    {children}
    {count > 0 && (
      <span
        className={cn(
          'ml-1.5 px-1.5 py-0.5 rounded-full text-xs',
          active ? 'bg-white/20' : 'bg-gray-200 dark:bg-white/10'
        )}
      >
        {count}
      </span>
    )}
  </button>
);

export const NotificationBell = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const {
    activities,
    groupedActivities,
    unreadCount,
    isLoading,
    filter,
    setFilter,
    markAsRead,
    markAllAsRead,
    refresh,
  } = useActivityFeed();

  const handleNavigate = activity => {
    setIsOpen(false);
    switch (activity.entityType) {
      case 'campaign':
        navigate(`/campaigns/${activity.entityId}`);
        break;
      case 'lead':
        navigate(`/leads?id=${activity.entityId}`);
        break;
      case 'integration':
        navigate('/integrations');
        break;
      default:
        navigate('/activity');
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              role="button"
              tabIndex={0}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
                  e.preventDefault();
                  setIsOpen(false);
                }
              }}
              aria-label="Close notifications"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-[400px] max-h-[70vh] bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-white/10 z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-100 dark:border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={refresh}
                      disabled={isLoading}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                      title="Refresh"
                    >
                      <RefreshCw
                        className={cn('h-4 w-4 text-gray-500', isLoading && 'animate-spin')}
                      />
                    </button>
                    <button
                      onClick={markAllAsRead}
                      disabled={unreadCount === 0}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                      title="Mark all as read"
                    >
                      <CheckCheck className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-1 -mb-1">
                  <FilterButton
                    active={filter === 'all'}
                    onClick={() => setFilter('all')}
                    count={0}
                  >
                    All
                  </FilterButton>
                  <FilterButton
                    active={filter === 'unread'}
                    onClick={() => setFilter('unread')}
                    count={unreadCount}
                  >
                    Unread
                  </FilterButton>
                  <FilterButton
                    active={filter === 'campaign'}
                    onClick={() => setFilter('campaign')}
                    count={0}
                  >
                    Campaigns
                  </FilterButton>
                  <FilterButton
                    active={filter === 'lead'}
                    onClick={() => setFilter('lead')}
                    count={0}
                  >
                    Leads
                  </FilterButton>
                  <FilterButton active={filter === 'ai'} onClick={() => setFilter('ai')} count={0}>
                    AI
                  </FilterButton>
                </div>
              </div>

              {/* Activity List */}
              <div className="flex-1 overflow-y-auto">
                {activities.length === 0 ? (
                  <div className="py-12 text-center">
                    <Bell className="h-9 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No activity yet</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {/* Today */}
                    {groupedActivities.today.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-white/5">
                          Today
                        </div>
                        {groupedActivities.today.map(activity => (
                          <ActivityItem
                            key={activity.id}
                            activity={activity}
                            onMarkAsRead={markAsRead}
                            onNavigate={handleNavigate}
                          />
                        ))}
                      </div>
                    )}

                    {/* Yesterday */}
                    {groupedActivities.yesterday.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-white/5">
                          Yesterday
                        </div>
                        {groupedActivities.yesterday.map(activity => (
                          <ActivityItem
                            key={activity.id}
                            activity={activity}
                            onMarkAsRead={markAsRead}
                            onNavigate={handleNavigate}
                          />
                        ))}
                      </div>
                    )}

                    {/* Older */}
                    {groupedActivities.older.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-white/5">
                          Earlier
                        </div>
                        {groupedActivities.older.map(activity => (
                          <ActivityItem
                            key={activity.id}
                            activity={activity}
                            onMarkAsRead={markAsRead}
                            onNavigate={handleNavigate}
                          />
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/activity');
                  }}
                  className="w-full text-center text-sm text-accent-600 dark:text-accent-400 font-medium hover:underline"
                >
                  View all activity →
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

ActivityItem.propTypes = {
  activity: PropTypes.shape({
    id: PropTypes.string,
    icon: PropTypes.string,
    color: PropTypes.string,
    read: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    timestamp: PropTypes.string,
    entityId: PropTypes.string,
  }).isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

FilterButton.propTypes = {
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  count: PropTypes.number,
};

NotificationBell.propTypes = {
  className: PropTypes.string,
};

export default NotificationBell;
