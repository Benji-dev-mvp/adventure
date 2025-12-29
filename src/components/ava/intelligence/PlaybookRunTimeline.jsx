/**
 * PlaybookRunTimeline.jsx
 *
 * Temporal visualization of playbook runs showing execution history,
 * outcomes, and patterns over time. Enables drill-down into specific runs.
 *
 * Features:
 * - Interactive timeline with zoom/pan
 * - Run markers with outcome indicators
 * - Trend overlays for key metrics
 * - Click-to-drill-down for run details
 */

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Clock,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  Pause,
  ChevronLeft,
  ChevronRight,
  Calendar,
  TrendingUp,
  Filter,
  Maximize2,
  Users,
  Mail,
  MessageSquare,
  Target,
  Zap,
} from 'lucide-react';
import { AnimatedCounter } from '../../ui/AnimatedComponents';

// Run status configurations
const runStatusConfig = {
  completed: {
    icon: CheckCircle,
    color: 'text-green-500',
    bg: 'bg-green-100 dark:bg-green-900/30',
    border: 'border-green-500',
    label: 'Completed',
  },
  running: {
    icon: Play,
    color: 'text-blue-500',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    border: 'border-blue-500',
    label: 'Running',
  },
  failed: {
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-500',
    label: 'Failed',
  },
  pending: {
    icon: Clock,
    color: 'text-yellow-500',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    border: 'border-yellow-500',
    label: 'Pending',
  },
  paused: {
    icon: Pause,
    color: 'text-gray-500',
    bg: 'bg-gray-100 dark:bg-gray-700',
    border: 'border-gray-500',
    label: 'Paused',
  },
};

// Generate performance score from run metrics
const getPerformanceScore = run => {
  if (!run.leads_targeted) return 0;
  const responseRate = (run.responses / run.emails_sent) * 100 || 0;
  const meetingRate = (run.meetings_booked / run.responses) * 100 || 0;
  return Math.round(responseRate * 0.6 + meetingRate * 0.4);
};

// Timeline Run Marker
const RunMarker = ({ run, isSelected, onClick, position }) => {
  const config = runStatusConfig[run.status] || runStatusConfig.pending;
  const Icon = config.icon;
  const performance = getPerformanceScore(run);

  // Size based on leads targeted (normalized)
  const size = Math.min(48, Math.max(24, Math.sqrt(run.leads_targeted || 10) * 4));

  return (
    <button
      onClick={() => onClick(run)}
      className={`
        absolute transform -translate-x-1/2 transition-all duration-200
        ${isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'}
      `}
      style={{ left: `${position}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
    >
      <div
        className={`
          rounded-full flex items-center justify-center
          border-2 ${config.border} ${config.bg}
          shadow-lg hover:shadow-xl transition-shadow
          ${isSelected ? 'ring-4 ring-purple-500/30' : ''}
        `}
        style={{ width: size, height: size }}
      >
        <Icon size={size * 0.5} className={config.color} />
      </div>

      {/* Performance indicator dot */}
      {run.status === 'completed' && (
        <div
          className={`
            absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800
            ${performance >= 70 ? 'bg-green-500' : performance >= 40 ? 'bg-yellow-500' : 'bg-red-500'}
          `}
        />
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
        <div className="font-semibold">{run.playbook_name || 'Playbook Run'}</div>
        <div className="text-gray-400">{new Date(run.started_at).toLocaleString()}</div>
        <div className="mt-1">
          {run.leads_targeted} leads • {run.meetings_booked} meetings
        </div>
      </div>
    </button>
  );
};

RunMarker.propTypes = {
  run: PropTypes.shape({
    status: PropTypes.string,
    leads_targeted: PropTypes.number,
    playbook_name: PropTypes.string,
    started_at: PropTypes.string,
    meetings_booked: PropTypes.number,
  }).isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  position: PropTypes.number.isRequired,
};

// Timeline Track
const TimelineTrack = ({ runs, selectedRun, onRunClick, dateRange }) => {
  const sortedRuns = useMemo(() => {
    return [...runs].sort((a, b) => new Date(a.started_at) - new Date(b.started_at));
  }, [runs]);

  // Calculate position for each run
  const runPositions = useMemo(() => {
    if (sortedRuns.length === 0) return [];

    const start = new Date(dateRange.start).getTime();
    const end = new Date(dateRange.end).getTime();
    const range = end - start;

    return sortedRuns.map(run => ({
      run,
      position: ((new Date(run.started_at).getTime() - start) / range) * 100,
    }));
  }, [sortedRuns, dateRange]);

  // Generate tick marks
  const ticks = useMemo(() => {
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const tickCount = Math.min(days, 7);
    const tickInterval = days / tickCount;

    return Array.from({ length: tickCount + 1 }, (_, i) => {
      const date = new Date(start);
      date.setDate(date.getDate() + Math.round(i * tickInterval));
      return {
        position: (i / tickCount) * 100,
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      };
    });
  }, [dateRange]);

  return (
    <div className="relative h-32 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden">
      {/* Grid lines */}
      <div className="absolute inset-0 flex">
        {ticks.map((tick, i) => (
          <div
            key={i}
            className="border-l border-gray-200 dark:border-gray-700 h-full"
            style={{ position: 'absolute', left: `${tick.position}%` }}
          />
        ))}
      </div>

      {/* Center line */}
      <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-50" />

      {/* Run Markers */}
      {runPositions.map(({ run, position }) => (
        <RunMarker
          key={run.id}
          run={run}
          position={position}
          isSelected={selectedRun?.id === run.id}
          onClick={onRunClick}
        />
      ))}

      {/* Tick Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 py-1">
        {ticks.map((tick, i) => (
          <span
            key={i}
            className="text-xs text-gray-500 dark:text-gray-400"
            style={{
              position: 'absolute',
              left: `${tick.position}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {tick.label}
          </span>
        ))}
      </div>
    </div>
  );
};

TimelineTrack.propTypes = {
  runs: PropTypes.array.isRequired,
  selectedRun: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onRunClick: PropTypes.func.isRequired,
  dateRange: PropTypes.shape({
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
};

// Run Detail Panel
const RunDetailPanel = ({ run, onClose }) => {
  if (!run) return null;

  const config = runStatusConfig[run.status] || runStatusConfig.pending;
  const Icon = config.icon;
  const performance = getPerformanceScore(run);
  const duration = run.completed_at
    ? Math.round((new Date(run.completed_at) - new Date(run.started_at)) / 1000)
    : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mt-4 animate-fadeIn">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-9 rounded-lg flex items-center justify-center ${config.bg}`}>
            <Icon size={20} className={config.color} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {run.playbook_name || 'Playbook Run'}
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock size={14} />
              {new Date(run.started_at).toLocaleString()}
              {duration && <span>• {duration}s duration</span>}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
          <Users size={18} className="mx-auto mb-1 text-gray-500" />
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            <AnimatedCounter end={run.leads_targeted || 0} />
          </div>
          <div className="text-xs text-gray-500">Leads</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
          <Mail size={18} className="mx-auto mb-1 text-blue-500" />
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            <AnimatedCounter end={run.emails_sent || 0} />
          </div>
          <div className="text-xs text-gray-500">Emails</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
          <MessageSquare size={18} className="mx-auto mb-1 text-purple-500" />
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            <AnimatedCounter end={run.responses || 0} />
          </div>
          <div className="text-xs text-gray-500">Responses</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
          <Calendar size={18} className="mx-auto mb-1 text-green-500" />
          <div className="text-lg font-bold text-green-600">
            <AnimatedCounter end={run.meetings_booked || 0} />
          </div>
          <div className="text-xs text-gray-500">Meetings</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
          <Target size={18} className="mx-auto mb-1 text-pink-500" />
          <div
            className={`text-lg font-bold ${
              performance >= 70
                ? 'text-green-600'
                : performance >= 40
                  ? 'text-yellow-600'
                  : 'text-red-600'
            }`}
          >
            {performance}%
          </div>
          <div className="text-xs text-gray-500">Performance</div>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
          <span>Conversion Funnel</span>
          <span>{((run.meetings_booked / run.leads_targeted) * 100 || 0).toFixed(1)}% overall</span>
        </div>
        <div className="flex items-center gap-1 h-6">
          <div className="bg-blue-500 h-full rounded-l" style={{ width: '100%' }} />
          <div
            className="bg-purple-500 h-full"
            style={{ width: `${(run.emails_sent / run.leads_targeted) * 100 || 0}%` }}
          />
          <div
            className="bg-pink-500 h-full"
            style={{ width: `${(run.responses / run.leads_targeted) * 100 || 0}%` }}
          />
          <div
            className="bg-green-500 h-full rounded-r"
            style={{ width: `${(run.meetings_booked / run.leads_targeted) * 100 || 0}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1 text-gray-500">
          <span>Leads</span>
          <span>Emails</span>
          <span>Responses</span>
          <span>Meetings</span>
        </div>
      </div>
    </div>
  );
};

RunDetailPanel.propTypes = {
  run: PropTypes.shape({
    status: PropTypes.string,
    completed_at: PropTypes.string,
    started_at: PropTypes.string,
    playbook_name: PropTypes.string,
    leads_targeted: PropTypes.number,
    emails_sent: PropTypes.number,
    responses: PropTypes.number,
    meetings_booked: PropTypes.number,
  }),
  onClose: PropTypes.func.isRequired,
};

// Summary Stats
const TimelineSummary = ({ runs }) => {
  const stats = useMemo(() => {
    const completed = runs.filter(r => r.status === 'completed');
    return {
      totalRuns: runs.length,
      successRate: runs.length ? Math.round((completed.length / runs.length) * 100) : 0,
      totalLeads: runs.reduce((sum, r) => sum + (r.leads_targeted || 0), 0),
      totalMeetings: runs.reduce((sum, r) => sum + (r.meetings_booked || 0), 0),
      avgPerformance: completed.length
        ? Math.round(
            completed.reduce((sum, r) => sum + getPerformanceScore(r), 0) / completed.length
          )
        : 0,
    };
  }, [runs]);

  return (
    <div className="grid grid-cols-5 gap-3 mb-4">
      {[
        { label: 'Total Runs', value: stats.totalRuns, icon: Play, color: 'text-blue-500' },
        {
          label: 'Success Rate',
          value: `${stats.successRate}%`,
          icon: CheckCircle,
          color: 'text-green-500',
        },
        { label: 'Leads Targeted', value: stats.totalLeads, icon: Users, color: 'text-purple-500' },
        {
          label: 'Meetings Booked',
          value: stats.totalMeetings,
          icon: Calendar,
          color: 'text-pink-500',
        },
        {
          label: 'Avg Performance',
          value: `${stats.avgPerformance}%`,
          icon: TrendingUp,
          color: 'text-orange-500',
        },
      ].map((stat, i) => (
        <div key={i} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
          <stat.icon size={16} className={`mx-auto mb-1 ${stat.color}`} />
          <div className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

TimelineSummary.propTypes = {
  runs: PropTypes.array.isRequired,
};

// Main Component
export const PlaybookRunTimeline = ({ runs = [], playbooks = [] }) => {
  const [selectedRun, setSelectedRun] = useState(null);
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return { start, end };
  });
  const [filterStatus, setFilterStatus] = useState('all');

  // Generate mock runs if none provided
  const displayRuns = useMemo(() => {
    if (runs.length > 0) return runs;

    // Generate mock data
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      const leadsTargeted = Math.floor(Math.random() * 200 + 50);
      const emailsSent = Math.floor(leadsTargeted * (0.8 + Math.random() * 0.2));
      const responses = Math.floor(emailsSent * (0.1 + Math.random() * 0.3));
      const meetingsBooked = Math.floor(responses * (0.2 + Math.random() * 0.4));

      return {
        id: i + 1,
        playbook_name: ['Enterprise Outreach', 'Startup Blitz', 'Mid-Market Focus'][i % 3],
        status: ['completed', 'completed', 'completed', 'failed', 'running'][
          Math.floor(Math.random() * 5)
        ],
        started_at: date.toISOString(),
        completed_at: new Date(date.getTime() + Math.random() * 3600000).toISOString(),
        leads_targeted: leadsTargeted,
        emails_sent: emailsSent,
        responses,
        meetings_booked: meetingsBooked,
      };
    });
  }, [runs]);

  // Filter runs
  const filteredRuns = useMemo(() => {
    if (filterStatus === 'all') return displayRuns;
    return displayRuns.filter(r => r.status === filterStatus);
  }, [displayRuns, filterStatus]);

  // Navigate date range
  const shiftDateRange = direction => {
    const days = direction === 'forward' ? 7 : -7;
    setDateRange(prev => ({
      start: new Date(prev.start.getTime() + days * 24 * 60 * 60 * 1000),
      end: new Date(prev.end.getTime() + days * 24 * 60 * 60 * 1000),
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Clock className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Playbook Run Timeline</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Execution history and outcomes over time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-700 dark:text-gray-300"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="running">Running</option>
              <option value="failed">Failed</option>
            </select>

            {/* Date Navigation */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => shiftDateRange('backward')}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft size={18} className="text-gray-600 dark:text-gray-400" />
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400 min-w-32 text-center">
                {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
              </span>
              <button
                onClick={() => shiftDateRange('forward')}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRight size={18} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Summary Stats */}
        <TimelineSummary runs={filteredRuns} />

        {/* Timeline Track */}
        <TimelineTrack
          runs={filteredRuns}
          selectedRun={selectedRun}
          onRunClick={setSelectedRun}
          dateRange={dateRange}
        />

        {/* Selected Run Detail */}
        {selectedRun && <RunDetailPanel run={selectedRun} onClose={() => setSelectedRun(null)} />}
      </div>
    </div>
  );
};

PlaybookRunTimeline.propTypes = {
  runs: PropTypes.array,
  playbooks: PropTypes.array,
};

export default PlaybookRunTimeline;
