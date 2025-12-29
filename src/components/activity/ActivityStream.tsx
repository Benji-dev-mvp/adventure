/**
 * Activity Stream Component
 * 
 * Shared component for displaying activity/event streams
 * Uses getDemoEvents from demo data contract
 * Supports filtering by type (AI/Human/System) and importance
 */

import React, { useMemo } from 'react';
import { getDemoEvents, type DemoEvent } from '@/demo/demoData';
import { useAppPlan } from '@/state/appStore';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { BadgePill } from '@/components/layout/shared';
import { Bot, User, Settings, AlertCircle } from 'lucide-react';

interface ActivityStreamProps {
  filterType?: 'all' | 'ai' | 'human' | 'system';
  filterImportance?: 'all' | 'low' | 'medium' | 'high';
  limit?: number;
  showFilters?: boolean;
  compact?: boolean;
  onEventClick?: (event: DemoEvent) => void;
}

export const ActivityStream: React.FC<ActivityStreamProps> = ({
  filterType = 'all',
  filterImportance = 'all',
  limit,
  showFilters = false,
  compact = false,
  onEventClick,
}) => {
  const plan = useAppPlan();
  const events = useMemo(() => getDemoEvents(plan), [plan]);

  // Apply filters
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    if (filterType !== 'all') {
      filtered = filtered.filter((e) => e.type === filterType);
    }

    if (filterImportance !== 'all') {
      filtered = filtered.filter((e) => e.importance === filterImportance);
    }

    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [events, filterType, filterImportance, limit]);

  const formatTimeAgo = (timestamp: string): string => {
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
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ai':
        return Bot;
      case 'human':
        return User;
      case 'system':
        return Settings;
      default:
        return AlertCircle;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ai':
        return 'text-cyan-500 bg-cyan-500/10';
      case 'human':
        return 'text-purple-500 bg-purple-500/10';
      case 'system':
        return 'text-slate-500 bg-slate-500/10';
      default:
        return 'text-slate-500 bg-slate-500/10';
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'high':
        return <BadgePill variant="default" className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">High</BadgePill>;
      case 'medium':
        return <BadgePill variant="default" className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">Medium</BadgePill>;
      default:
        return null;
    }
  };

  if (filteredEvents.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-center">
        <div>
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm text-slate-400">No activity to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredEvents.map((event) => {
        const TypeIcon = getTypeIcon(event.type);
        const typeColor = getTypeColor(event.type);

        if (compact) {
          return (
            <div
              key={event.id}
              className={cn(
                'flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors',
                onEventClick && 'cursor-pointer'
              )}
              onClick={() => onEventClick?.(event)}
            >
              <div className={cn('w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0', typeColor)}>
                <TypeIcon className="w-3 h-3" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">
                  <span className="font-medium">{event.actor}</span> {event.action} {event.target}
                </p>
              </div>
              <span className="text-xs text-slate-500 flex-shrink-0">{formatTimeAgo(event.timestamp)}</span>
            </div>
          );
        }

        return (
          <Card
            key={event.id}
            className={cn(
              'hover:border-slate-700 transition-colors',
              onEventClick && 'cursor-pointer'
            )}
            onClick={() => onEventClick?.(event)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', typeColor)}>
                  <TypeIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-white">
                      {event.actor}
                    </p>
                    <BadgePill variant="default" className="text-xs">
                      {event.type.toUpperCase()}
                    </BadgePill>
                    {getImportanceBadge(event.importance)}
                  </div>
                  <p className="text-sm text-slate-300 mb-1">
                    {event.action} <span className="text-white font-medium">{event.target}</span>
                  </p>
                  {event.details && (
                    <p className="text-xs text-slate-400">{event.details}</p>
                  )}
                </div>
                <span className="text-xs text-slate-500 flex-shrink-0">{formatTimeAgo(event.timestamp)}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ActivityStream;
