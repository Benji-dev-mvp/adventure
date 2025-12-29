import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Activity,
  Bell,
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
  Filter,
  RefreshCw,
  CheckCheck,
  ExternalLink,
  Search,
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
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
};

const ActivityCard = ({ activity, onNavigate }) => {
  const Icon = iconMap[activity.icon] || Bell;
  const colorClass = colorMap[activity.color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex gap-4 p-4 bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-white/10 hover:border-accent-500/50 transition-all cursor-pointer group',
        !activity.read && 'ring-2 ring-accent-500/20'
      )}
      onClick={() => onNavigate(activity)}
    >
      <div className={cn('p-3 rounded-xl border shrink-0', colorClass)}>
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className={cn(
                'text-sm font-medium',
                activity.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'
              )}
            >
              {activity.title}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.description}</p>
          </div>
          {!activity.read && (
            <Badge variant="primary" size="sm">
              New
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 mt-3">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {formatTimeAgo(activity.timestamp)}
          </span>
          <Badge variant="secondary" size="sm">
            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
          </Badge>
          {activity.entityId && (
            <button
              className="text-xs text-accent-600 dark:text-accent-400 hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={e => {
                e.stopPropagation();
                onNavigate(activity);
              }}
            >
              View details
              <ExternalLink className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const FilterPill = ({ active, onClick, children, count }) => (
  <button
    onClick={onClick}
    className={cn(
      'px-4 py-2 text-sm font-medium rounded-xl transition-colors whitespace-nowrap',
      active
        ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/25'
        : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20'
    )}
  >
    {children}
    {count > 0 && (
      <span
        className={cn(
          'ml-2 px-2 py-0.5 rounded-full text-xs',
          active ? 'bg-white/20' : 'bg-gray-200 dark:bg-white/10'
        )}
      >
        {count}
      </span>
    )}
  </button>
);

const ActivityCenter = () => {
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
    markAsRead(activity.id);
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
        break;
    }
  };

  const stats = {
    total: activities.length,
    campaigns: activities.filter(a => a.type === 'campaign').length,
    leads: activities.filter(a => a.type === 'lead').length,
    ai: activities.filter(a => a.type === 'ai').length,
    system: activities.filter(a => a.type === 'system').length,
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Activity className="h-8 w-8 text-accent-500" />
              Activity Center
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Track all events across your campaigns, leads, and AI actions
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={refresh} disabled={isLoading}>
              <RefreshCw className={cn('h-4 w-4 mr-2', isLoading && 'animate-spin')} />
              Refresh
            </Button>
            <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Events', value: stats.total, color: 'bg-gray-500' },
            { label: 'Campaigns', value: stats.campaigns, color: 'bg-green-500' },
            { label: 'Leads', value: stats.leads, color: 'bg-purple-500' },
            { label: 'AI Actions', value: stats.ai, color: 'bg-cyan-500' },
            { label: 'System', value: stats.system, color: 'bg-amber-500' },
          ].map(stat => (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn('w-3 h-3 rounded-full', stat.color)} />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <Filter className="h-4 w-4 text-gray-400" />
          <FilterPill active={filter === 'all'} onClick={() => setFilter('all')}>
            All
          </FilterPill>
          <FilterPill
            active={filter === 'unread'}
            onClick={() => setFilter('unread')}
            count={unreadCount}
          >
            Unread
          </FilterPill>
          <FilterPill active={filter === 'campaign'} onClick={() => setFilter('campaign')}>
            Campaigns
          </FilterPill>
          <FilterPill active={filter === 'lead'} onClick={() => setFilter('lead')}>
            Leads
          </FilterPill>
          <FilterPill active={filter === 'ai'} onClick={() => setFilter('ai')}>
            AI
          </FilterPill>
          <FilterPill active={filter === 'system'} onClick={() => setFilter('system')}>
            System
          </FilterPill>
        </div>

        {/* Activity List */}
        <div className="space-y-6">
          {activities.length === 0 ? (
            <Card className="p-12 text-center">
              <Activity className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No activity to show
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Activities will appear here as you use the platform
              </p>
            </Card>
          ) : (
            <>
              {/* Today */}
              {groupedActivities.today.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Today
                  </h2>
                  <div className="space-y-3">
                    {groupedActivities.today.map(activity => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        onNavigate={handleNavigate}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Yesterday */}
              {groupedActivities.yesterday.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Yesterday
                  </h2>
                  <div className="space-y-3">
                    {groupedActivities.yesterday.map(activity => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        onNavigate={handleNavigate}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Older */}
              {groupedActivities.older.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Earlier
                  </h2>
                  <div className="space-y-3">
                    {groupedActivities.older.map(activity => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        onNavigate={handleNavigate}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

ActivityCard.propTypes = {
  activity: PropTypes.shape({
    icon: PropTypes.string,
    color: PropTypes.string,
    read: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    timestamp: PropTypes.string,
    type: PropTypes.string,
    entityId: PropTypes.string,
  }).isRequired,
  onNavigate: PropTypes.func.isRequired,
};

FilterPill.propTypes = {
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  count: PropTypes.number,
};

export default ActivityCenter;
