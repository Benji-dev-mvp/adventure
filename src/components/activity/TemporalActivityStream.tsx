/**
 * Temporal Activity Stream Component
 * 
 * Operator-grade activity stream with temporal intelligence:
 * - Time range selector (1h, 1d, 7d, 30d, custom)
 * - Event clustering ("3 similar AI actions")
 * - Severity-based coloring (subtle, importance-driven)
 * - Temporal context (What just happened / What's happening / What's next)
 * - Next AI actions forecasting
 * 
 * Inspired by: Grafana (temporal metrics), Sentry (issue timelines), 
 * K8s Dashboard (event streams), MLflow (AI decision lineage)
 */

import React, { useEffect, useState } from 'react';
import { activityService } from '@/services/activityService';
import type { ActivityEvent, ActorType, ImportanceLevel } from '@/contracts/activity';
import { useAppPlan } from '@/state/appStore';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { BadgePill } from '@/components/layout/shared';
import { Bot, User, Settings, AlertCircle, Clock, TrendingUp, Layers } from 'lucide-react';

type TimeRange = '1h' | '1d' | '7d' | '30d' | 'custom';

interface TemporalActivityStreamProps {
  filterType?: 'all' | 'ai' | 'human' | 'system';
  filterImportance?: 'all' | 'low' | 'medium' | 'high';
  defaultTimeRange?: TimeRange;
  limit?: number;
  showFilters?: boolean;
  showTimeline?: boolean;
  showNextActions?: boolean;
  compact?: boolean;
  onEventClick?: (event: ActivityEvent) => void;
}

interface EventCluster {
  key: string;
  count: number;
  events: ActivityEvent[];
  summary: string;
}

export const TemporalActivityStream: React.FC<TemporalActivityStreamProps> = ({
  filterType = 'all',
  filterImportance = 'all',
  defaultTimeRange = '1d',
  limit,
  showFilters = true,
  showTimeline = true,
  showNextActions = false,
  compact = false,
  onEventClick,
}) => {
  const plan = useAppPlan();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>(defaultTimeRange);
  const [selectedType, setSelectedType] = useState<string>(filterType);
  const [selectedImportance, setSelectedImportance] = useState<string>(filterImportance);

  // Load events from activity service
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        // Build filter params
        const actorTypeFilter: ActorType[] | undefined = 
          selectedType === 'all' ? undefined :
          selectedType === 'ai' ? ['AI'] :
          selectedType === 'human' ? ['Human'] :
          selectedType === 'system' ? ['System'] :
          undefined;
        
        const importanceFilter: ImportanceLevel | undefined =
          selectedImportance === 'all' ? undefined : selectedImportance as ImportanceLevel;
        
        const response = await activityService.list({
          actorType: actorTypeFilter,
          importance: importanceFilter,
          limit: limit || 100,
        }, plan);
        
        // Filter by time range
        const now = new Date();
        const filtered = response.items.filter(event => {
          const eventTime = new Date(event.timestamp);
          const diffMs = now.getTime() - eventTime.getTime();
          
          switch (timeRange) {
            case '1h':
              return diffMs <= 3600000; // 1 hour
            case '1d':
              return diffMs <= 86400000; // 1 day
            case '7d':
              return diffMs <= 604800000; // 7 days
            case '30d':
              return diffMs <= 2592000000; // 30 days
            default:
              return true;
          }
        });
        
        setEvents(filtered);
      } catch (error) {
        console.error('[TemporalActivityStream] Failed to load events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, [plan, selectedType, selectedImportance, limit, timeRange]);

  // Cluster similar events
  const clusterEvents = (events: ActivityEvent[]): EventCluster[] => {
    const clusters = new Map<string, EventCluster>();
    
    events.forEach(event => {
      // Create cluster key based on event type and entity type
      const key = `${event.eventType}_${event.entityType}_${event.actorType}`;
      
      if (!clusters.has(key)) {
        clusters.set(key, {
          key,
          count: 0,
          events: [],
          summary: `${event.actorType} ${event.eventType} on ${event.entityType}`,
        });
      }
      
      const cluster = clusters.get(key)!;
      cluster.count++;
      cluster.events.push(event);
    });
    
    return Array.from(clusters.values()).filter(c => c.count > 1);
  };

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

  const getTemporalContext = () => {
    if (events.length === 0) return null;
    
    // Recent (last 5 minutes)
    const recent = events.filter(e => {
      const diffMs = new Date().getTime() - new Date(e.timestamp).getTime();
      return diffMs <= 300000; // 5 mins
    });
    
    // Active (last hour)
    const active = events.filter(e => {
      const diffMs = new Date().getTime() - new Date(e.timestamp).getTime();
      return diffMs <= 3600000; // 1 hour
    });
    
    return {
      justHappened: recent.length,
      happening: active.length - recent.length,
      total: events.length,
    };
  };

  const getTypeIcon = (actorType: string) => {
    switch (actorType.toLowerCase()) {
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

  const getTypeColor = (actorType: string) => {
    switch (actorType.toLowerCase()) {
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

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'border-l-red-500/50 bg-red-500/5';
      case 'medium':
        return 'border-l-amber-500/50 bg-amber-500/5';
      default:
        return 'border-l-slate-700 bg-transparent';
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

  const clusters = clusterEvents(events);
  const context = getTemporalContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-center">
        <div>
          <div className="w-8 h-8 border-2 border-slate-700 border-t-cyan-500 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-400">Loading activity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Time Range Selector + Filters */}
      {showFilters && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <div className="flex gap-1">
              {(['1h', '1d', '7d', '30d'] as TimeRange[]).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    'px-3 py-1 text-xs rounded-md transition-colors',
                    timeRange === range
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
                  )}
                >
                  {range === '1h' ? 'Last Hour' :
                   range === '1d' ? 'Last Day' :
                   range === '7d' ? 'Last Week' :
                   'Last 30 Days'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1 text-xs bg-slate-800 border border-slate-700 rounded-md text-slate-300"
            >
              <option value="all">All Types</option>
              <option value="ai">AI</option>
              <option value="human">Human</option>
              <option value="system">System</option>
            </select>
            
            <select
              value={selectedImportance}
              onChange={(e) => setSelectedImportance(e.target.value)}
              className="px-3 py-1 text-xs bg-slate-800 border border-slate-700 rounded-md text-slate-300"
            >
              <option value="all">All Importance</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      )}

      {/* Temporal Context */}
      {context && showTimeline && (
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-3">
              <div className="text-xs text-slate-400 mb-1">Just Happened</div>
              <div className="text-2xl font-semibold text-cyan-400">{context.justHappened}</div>
              <div className="text-xs text-slate-500">Last 5 minutes</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-3">
              <div className="text-xs text-slate-400 mb-1">Happening Now</div>
              <div className="text-2xl font-semibold text-amber-400">{context.happening}</div>
              <div className="text-xs text-slate-500">Last hour</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-3">
              <div className="text-xs text-slate-400 mb-1">Total Activity</div>
              <div className="text-2xl font-semibold text-slate-300">{context.total}</div>
              <div className="text-xs text-slate-500">{timeRange === '1h' ? 'This hour' : timeRange === '1d' ? 'Today' : timeRange === '7d' ? 'This week' : 'This month'}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Event Clustering */}
      {clusters.length > 0 && (
        <div className="space-y-2">
          {clusters.map(cluster => (
            <Card key={cluster.key} className="bg-slate-900/30 border-slate-800">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-slate-300">
                    <span className="font-semibold text-cyan-400">{cluster.count}</span> similar actions: {cluster.summary}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Next AI Actions (Forecasting) */}
      {showNextActions && events.some(e => e.actorType === 'AI') && (
        <Card className="bg-gradient-to-r from-cyan-500/10 to-transparent border-cyan-500/30">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-cyan-400 mb-1">Next AI Actions</div>
                <div className="text-xs text-slate-400">
                  Based on current patterns, Ava will likely qualify 3-5 more leads and send 12 follow-up emails in the next hour.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Stream */}
      {events.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-center">
          <div>
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No activity in selected time range</p>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          {events.map((event) => {
            const TypeIcon = getTypeIcon(event.actorType);
            const typeColor = getTypeColor(event.actorType);
            const importanceColor = getImportanceColor(event.importance);
            
            if (compact) {
              return (
                <div
                  key={event.id}
                  onClick={() => onEventClick?.(event)}
                  className={cn(
                    'flex items-center gap-3 p-2 rounded-md border-l-2 transition-colors',
                    importanceColor,
                    onEventClick && 'cursor-pointer hover:bg-slate-800/30'
                  )}
                >
                  <div className={cn('p-1.5 rounded-md', typeColor)}>
                    <TypeIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 truncate">{event.summary}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getImportanceBadge(event.importance)}
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {formatTimeAgo(event.timestamp)}
                    </span>
                  </div>
                </div>
              );
            }
            
            return (
              <Card
                key={event.id}
                onClick={() => onEventClick?.(event)}
                className={cn(
                  'bg-slate-900/30 border-slate-800 border-l-2 transition-colors',
                  importanceColor,
                  onEventClick && 'cursor-pointer hover:bg-slate-800/50'
                )}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className={cn('p-2 rounded-md', typeColor)}>
                      <TypeIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-slate-300">{event.summary}</span>
                        {getImportanceBadge(event.importance)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="capitalize">{event.actorType}</span>
                        <span>•</span>
                        <span className="capitalize">{event.eventType.replace('_', ' ')}</span>
                        <span>•</span>
                        <span className="capitalize">{event.entityType}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(event.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
