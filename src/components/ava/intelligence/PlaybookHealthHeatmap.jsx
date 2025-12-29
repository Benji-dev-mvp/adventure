/**
 * PlaybookHealthHeatmap.jsx
 * 
 * Macro performance awareness through a visual heatmap showing playbook health
 * across multiple dimensions: segments, channels, time periods, and goals.
 * 
 * Color intensity represents performance relative to targets:
 * - Green: Exceeding targets
 * - Yellow: Meeting targets
 * - Orange: Below targets
 * - Red: Critical attention needed
 */

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  Activity, TrendingUp, TrendingDown, AlertTriangle, 
  ChevronDown, Filter, Maximize2, Info, Zap
} from 'lucide-react';
import { AnimatedCounter } from '../../ui/AnimatedComponents';

// Health score to color mapping
const getHealthColor = (score, isDark = false) => {
  if (score >= 80) return isDark ? 'bg-green-600' : 'bg-green-500';
  if (score >= 60) return isDark ? 'bg-emerald-600' : 'bg-emerald-400';
  if (score >= 40) return isDark ? 'bg-yellow-600' : 'bg-yellow-400';
  if (score >= 20) return isDark ? 'bg-orange-600' : 'bg-orange-500';
  return isDark ? 'bg-red-700' : 'bg-red-500';
};

const getHealthTextColor = (score) => {
  if (score >= 60) return 'text-white';
  if (score >= 40) return 'text-gray-900';
  return 'text-white';
};

const getHealthLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  if (score >= 20) return 'Poor';
  return 'Critical';
};

// Heatmap Cell Component
const HeatmapCell = ({ value, label, sublabel, onClick, isSelected, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses[size]} 
        ${getHealthColor(value)} 
        ${getHealthTextColor(value)}
        ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-105' : ''}
        rounded-lg flex flex-col items-center justify-center
        transition-all duration-200 hover:scale-105 hover:shadow-lg
        relative group
      `}
    >
      <span className="text-lg font-bold">{value}%</span>
      {label && <span className="text-xs opacity-90 truncate max-w-full px-1">{label}</span>}
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        <div className="font-semibold">{label}</div>
        {sublabel && <div className="text-gray-400">{sublabel}</div>}
        <div className="mt-1">{getHealthLabel(value)} Health</div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
      </div>
    </button>
  );
};

HeatmapCell.propTypes = {
  value: PropTypes.number.isRequired,
  label: PropTypes.string,
  sublabel: PropTypes.string,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

// Segment Row in Heatmap
const SegmentRow = ({ segment, channels, onCellClick, selectedCell }) => {
  const avgHealth = Math.round(
    Object.values(channels).reduce((sum, ch) => sum + ch.health, 0) / Object.keys(channels).length
  );

  return (
    <div className="flex items-center gap-2">
      {/* Segment Label */}
      <div className="w-28 flex-shrink-0">
        <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">{segment}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">Avg: {avgHealth}%</div>
      </div>

      {/* Channel Cells */}
      <div className="flex gap-2">
        {Object.entries(channels).map(([channel, data]) => (
          <HeatmapCell
            key={channel}
            value={data.health}
            label={channel}
            sublabel={`${data.leads} leads • ${data.meetings} meetings`}
            onClick={() => onCellClick({ segment, channel, ...data })}
            isSelected={selectedCell?.segment === segment && selectedCell?.channel === channel}
          />
        ))}
      </div>
    </div>
  );
};

SegmentRow.propTypes = {
  segment: PropTypes.string.isRequired,
  channels: PropTypes.object.isRequired,
  onCellClick: PropTypes.func.isRequired,
  selectedCell: PropTypes.shape({
    segment: PropTypes.string,
    channel: PropTypes.string,
  }),
};

// Time Period Heatmap
const TimeHeatmap = ({ data, onCellClick, selectedCell }) => {
  const periods = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const metrics = ['Response Rate', 'Meeting Rate', 'Pipeline Value', 'Conversion'];

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2 ml-28">
        {periods.map((period) => (
          <div key={period} className="w-20 text-center text-xs font-medium text-gray-600 dark:text-gray-400">
            {period}
          </div>
        ))}
      </div>

      {/* Rows */}
      {metrics.map((metric) => (
        <div key={metric} className="flex items-center gap-2">
          <div className="w-28 flex-shrink-0 text-sm text-gray-700 dark:text-gray-300">{metric}</div>
          <div className="flex gap-2">
            {periods.map((period, idx) => {
              const value = data[metric]?.[idx] || Math.floor(Math.random() * 60 + 40);
              return (
                <HeatmapCell
                  key={period}
                  value={value}
                  label={period}
                  sublabel={metric}
                  onClick={() => onCellClick({ metric, period, value })}
                  isSelected={selectedCell?.metric === metric && selectedCell?.period === period}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

TimeHeatmap.propTypes = {
  data: PropTypes.object.isRequired,
  onCellClick: PropTypes.func.isRequired,
  selectedCell: PropTypes.shape({
    metric: PropTypes.string,
    period: PropTypes.string,
  }),
};

// Health Legend
const HealthLegend = () => (
  <div className="flex items-center gap-4 text-xs">
    <span className="text-gray-600 dark:text-gray-400">Health:</span>
    <div className="flex items-center gap-1">
      <div className="w-4 h-4 rounded bg-green-500" />
      <span className="text-gray-600 dark:text-gray-400">Excellent</span>
    </div>
    <div className="flex items-center gap-1">
      <div className="w-4 h-4 rounded bg-emerald-400" />
      <span className="text-gray-600 dark:text-gray-400">Good</span>
    </div>
    <div className="flex items-center gap-1">
      <div className="w-4 h-4 rounded bg-yellow-400" />
      <span className="text-gray-600 dark:text-gray-400">Fair</span>
    </div>
    <div className="flex items-center gap-1">
      <div className="w-4 h-4 rounded bg-orange-500" />
      <span className="text-gray-600 dark:text-gray-400">Poor</span>
    </div>
    <div className="flex items-center gap-1">
      <div className="w-4 h-4 rounded bg-red-500" />
      <span className="text-gray-600 dark:text-gray-400">Critical</span>
    </div>
  </div>
);

// Detail Panel for selected cell
const CellDetailPanel = ({ cell, onClose }) => {
  if (!cell) return null;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
            {cell.segment} × {cell.channel}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getHealthColor(cell.health)} ${getHealthTextColor(cell.health)}`}>
              {getHealthLabel(cell.health)}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {cell.health}% health score
            </span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400">Leads Targeted</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            <AnimatedCounter end={cell.leads || 0} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400">Responses</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            <AnimatedCounter end={cell.responses || 0} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400">Meetings</div>
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            <AnimatedCounter end={cell.meetings || 0} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400">Trend</div>
          <div className="flex items-center gap-1">
            {cell.trend >= 0 ? (
              <TrendingUp className="text-green-500" size={18} />
            ) : (
              <TrendingDown className="text-red-500" size={18} />
            )}
            <span className={`text-xl font-bold ${cell.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {cell.trend >= 0 ? '+' : ''}{cell.trend || 0}%
            </span>
          </div>
        </div>
      </div>

      {cell.health < 60 && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-2">
            <AlertTriangle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" size={16} />
            <div>
              <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Performance Alert
              </div>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                This segment-channel combination is underperforming. Consider adjusting messaging, 
                timing, or targeting parameters. AI suggests increasing personalization depth.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CellDetailPanel.propTypes = {
  cell: PropTypes.shape({
    segment: PropTypes.string,
    channel: PropTypes.string,
    health: PropTypes.number,
    leads: PropTypes.number,
    responses: PropTypes.number,
    meetings: PropTypes.number,
    trend: PropTypes.number,
  }),
  onClose: PropTypes.func.isRequired,
};

// Main Component
export const PlaybookHealthHeatmap = ({ playbooks = [], onDrillDown }) => {
  const [view, setView] = useState('segment'); // 'segment' | 'time' | 'goal'
  const [selectedCell, setSelectedCell] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');

  // Generate mock heatmap data based on playbooks
  const heatmapData = useMemo(() => {
    const segments = ['startup', 'midmarket', 'enterprise'];
    const channels = ['email', 'linkedin', 'phone'];

    return segments.reduce((acc, segment) => {
      acc[segment] = channels.reduce((chAcc, channel) => {
        // Generate realistic data based on segment/channel
        const baseHealth = segment === 'enterprise' ? 70 : segment === 'midmarket' ? 60 : 50;
        const channelModifier = channel === 'email' ? 10 : channel === 'linkedin' ? 5 : -5;
        const variance = Math.floor(Math.random() * 20 - 10);
        
        chAcc[channel] = {
          health: Math.min(100, Math.max(0, baseHealth + channelModifier + variance)),
          leads: Math.floor(Math.random() * 500 + 100),
          responses: Math.floor(Math.random() * 100 + 20),
          meetings: Math.floor(Math.random() * 30 + 5),
          trend: Math.floor(Math.random() * 30 - 10),
        };
        return chAcc;
      }, {});
      return acc;
    }, {});
  }, [playbooks]);

  // Calculate overall health
  const overallHealth = useMemo(() => {
    const allHealthValues = Object.values(heatmapData).flatMap(segment =>
      Object.values(segment).map(ch => ch.health)
    );
    return Math.round(allHealthValues.reduce((a, b) => a + b, 0) / allHealthValues.length);
  }, [heatmapData]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Activity className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Playbook Health Heatmap</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Macro performance across segments & channels
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Overall Health Badge */}
            <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 ${getHealthColor(overallHealth)} ${getHealthTextColor(overallHealth)}`}>
              <Zap size={16} />
              <span className="font-bold">{overallHealth}%</span>
              <span className="text-sm opacity-90">Overall</span>
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {['segment', 'time', 'goal'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors capitalize ${
                    view === v
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Time Range */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-700 dark:text-gray-300"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Heatmap Content */}
      <div className="p-5">
        {view === 'segment' ? (
          <div className="space-y-3">
            {/* Column Headers */}
            <div className="flex items-center gap-2 ml-28">
              {['email', 'linkedin', 'phone'].map((channel) => (
                <div key={channel} className="w-20 text-center text-xs font-medium text-gray-600 dark:text-gray-400 capitalize">
                  {channel}
                </div>
              ))}
            </div>

            {/* Segment Rows */}
            {Object.entries(heatmapData).map(([segment, channels]) => (
              <SegmentRow
                key={segment}
                segment={segment}
                channels={channels}
                onCellClick={setSelectedCell}
                selectedCell={selectedCell}
              />
            ))}
          </div>
        ) : view === 'time' ? (
          <TimeHeatmap
            data={{}}
            onCellClick={setSelectedCell}
            selectedCell={selectedCell}
          />
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Goal-based heatmap coming soon...
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <HealthLegend />
        </div>
      </div>

      {/* Selected Cell Detail */}
      {selectedCell && (
        <div className="px-5 pb-5">
          <CellDetailPanel cell={selectedCell} onClose={() => setSelectedCell(null)} />
        </div>
      )}
    </div>
  );
};

PlaybookHealthHeatmap.propTypes = {
  playbooks: PropTypes.array,
  onDrillDown: PropTypes.func,
};

export default PlaybookHealthHeatmap;
