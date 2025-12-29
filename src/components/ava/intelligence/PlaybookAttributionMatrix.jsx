/**
 * PlaybookAttributionMatrix.jsx
 * 
 * Matrix visualization showing what works where across segments, channels, 
 * and outcomes. Enables drill-down into specific combinations to understand
 * attribution and performance drivers.
 * 
 * Features:
 * - Multi-dimensional matrix view (segment × channel × metric)
 * - Color-coded performance cells
 * - Click-to-drill-down for detailed attribution
 * - Comparative analysis mode
 */

import React, { useState, useMemo } from 'react';
import {
  Grid3X3, ArrowUpRight, ArrowDownRight, Minus,
  Filter, Download, Maximize2, ChevronDown, Info,
  Users, Mail, MessageSquare, Calendar, Target, TrendingUp
} from 'lucide-react';
import { AnimatedCounter } from '../../ui/AnimatedComponents';

// Metric configurations
const metricConfig = {
  leads_targeted: { label: 'Leads', icon: Users, format: 'number' },
  emails_sent: { label: 'Emails', icon: Mail, format: 'number' },
  responses: { label: 'Responses', icon: MessageSquare, format: 'number' },
  meetings: { label: 'Meetings', icon: Calendar, format: 'number' },
  response_rate: { label: 'Response %', icon: TrendingUp, format: 'percent' },
  meeting_rate: { label: 'Meeting %', icon: Target, format: 'percent' },
  roi: { label: 'ROI', icon: ArrowUpRight, format: 'currency' }
};

// Performance color scale
const getPerformanceColor = (value, benchmark, inverse = false) => {
  const ratio = value / benchmark;
  const adjusted = inverse ? 1 / ratio : ratio;
  
  if (adjusted >= 1.2) return { bg: 'bg-green-500', text: 'text-white', label: 'Excellent' };
  if (adjusted >= 1.0) return { bg: 'bg-green-400', text: 'text-white', label: 'Good' };
  if (adjusted >= 0.8) return { bg: 'bg-yellow-400', text: 'text-gray-900', label: 'Average' };
  if (adjusted >= 0.6) return { bg: 'bg-orange-400', text: 'text-white', label: 'Below Avg' };
  return { bg: 'bg-red-500', text: 'text-white', label: 'Poor' };
};

// Format value based on type
const formatValue = (value, format) => {
  switch (format) {
    case 'percent':
      return `${value.toFixed(1)}%`;
    case 'currency':
      return `$${(value / 1000).toFixed(1)}k`;
    case 'number':
    default:
      return value.toLocaleString();
  }
};

// Trend indicator
const TrendIndicator = ({ trend }) => {
  if (trend > 0) {
    return (
      <span className="flex items-center text-green-600 text-xs">
        <ArrowUpRight size={12} />
        {trend}%
      </span>
    );
  }
  if (trend < 0) {
    return (
      <span className="flex items-center text-red-600 text-xs">
        <ArrowDownRight size={12} />
        {Math.abs(trend)}%
      </span>
    );
  }
  return (
    <span className="flex items-center text-gray-400 text-xs">
      <Minus size={12} />
    </span>
  );
};

// Matrix Cell
const MatrixCell = ({ value, benchmark, format, trend, isSelected, onClick, size = 'md' }) => {
  const perf = getPerformanceColor(value, benchmark);
  const sizeClasses = {
    sm: 'w-16 h-12 text-xs',
    md: 'w-24 h-16 text-sm',
    lg: 'w-32 h-20 text-base'
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        ${perf.bg} ${perf.text}
        ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-105' : ''}
        rounded-lg flex flex-col items-center justify-center
        transition-all duration-200 hover:scale-105 hover:shadow-lg
        relative group
      `}
    >
      <span className="font-bold">{formatValue(value, format)}</span>
      {trend !== undefined && <TrendIndicator trend={trend} />}
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
        <div>{perf.label} Performance</div>
        <div className="text-gray-400">Benchmark: {formatValue(benchmark, format)}</div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
      </div>
    </button>
  );
};

// Row Header
const RowHeader = ({ label, sublabel, icon: Icon }) => (
  <div className="flex items-center gap-2 pr-4 min-w-32">
    {Icon && (
      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        <Icon size={16} className="text-gray-600 dark:text-gray-400" />
      </div>
    )}
    <div>
      <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">{label}</div>
      {sublabel && <div className="text-xs text-gray-500">{sublabel}</div>}
    </div>
  </div>
);

// Column Header
const ColumnHeader = ({ label, icon: Icon }) => (
  <div className="flex flex-col items-center gap-1 px-2 min-w-24">
    {Icon && <Icon size={16} className="text-gray-500 dark:text-gray-400" />}
    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 capitalize">{label}</span>
  </div>
);

// Attribution Detail Panel
const AttributionDetail = ({ segment, channel, metric, data, onClose }) => {
  if (!data) return null;

  const metricInfo = metricConfig[metric] || metricConfig.leads_targeted;
  const Icon = metricInfo.icon;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700 mt-4 animate-fadeIn">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white capitalize flex items-center gap-2">
            <Icon size={18} className="text-purple-500" />
            {segment} × {channel} × {metricInfo.label}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Detailed attribution analysis
          </p>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      {/* Attribution Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Value</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatValue(data.value, metricInfo.format)}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Benchmark</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatValue(data.benchmark, metricInfo.format)}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">vs. Benchmark</div>
          <div className={`text-2xl font-bold ${data.value >= data.benchmark ? 'text-green-600' : 'text-red-600'}`}>
            {((data.value / data.benchmark - 1) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Week-over-Week</div>
          <div className={`text-2xl font-bold flex items-center gap-1 ${data.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {data.trend >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
            {Math.abs(data.trend)}%
          </div>
        </div>
      </div>

      {/* Contributing Factors */}
      <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
        <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Key Attribution Factors
        </h5>
        <div className="space-y-3">
          {(data.factors || [
            { label: 'Personalization quality', contribution: 35 },
            { label: 'Send time optimization', contribution: 25 },
            { label: 'ICP targeting accuracy', contribution: 22 },
            { label: 'Subject line relevance', contribution: 18 }
          ]).map((factor, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">{factor.label}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{factor.contribution}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: `${factor.contribution}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Legend
const MatrixLegend = () => (
  <div className="flex items-center gap-4 text-xs">
    <span className="text-gray-600 dark:text-gray-400">Performance:</span>
    {[
      { color: 'bg-green-500', label: 'Excellent' },
      { color: 'bg-green-400', label: 'Good' },
      { color: 'bg-yellow-400', label: 'Average' },
      { color: 'bg-orange-400', label: 'Below Avg' },
      { color: 'bg-red-500', label: 'Poor' },
    ].map(({ color, label }) => (
      <div key={label} className="flex items-center gap-1">
        <div className={`w-4 h-4 rounded ${color}`} />
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
      </div>
    ))}
  </div>
);

// Main Component
export const PlaybookAttributionMatrix = ({ playbooks = [], onDrillDown }) => {
  const [selectedMetric, setSelectedMetric] = useState('response_rate');
  const [selectedCell, setSelectedCell] = useState(null);
  const [viewMode, setViewMode] = useState('standard'); // 'standard' | 'comparison'

  const segments = ['startup', 'midmarket', 'enterprise'];
  const channels = ['email', 'linkedin', 'phone'];

  // Generate matrix data
  const matrixData = useMemo(() => {
    const data = {};
    
    segments.forEach(segment => {
      data[segment] = {};
      channels.forEach(channel => {
        // Generate realistic data with some variation
        const baseRates = {
          startup: { email: 22, linkedin: 28, phone: 15 },
          midmarket: { email: 26, linkedin: 32, phone: 18 },
          enterprise: { email: 24, linkedin: 38, phone: 14 }
        };
        
        const baseMeetingRates = {
          startup: { email: 3.2, linkedin: 4.1, phone: 2.8 },
          midmarket: { email: 4.5, linkedin: 5.8, phone: 3.5 },
          enterprise: { email: 5.1, linkedin: 7.2, phone: 4.2 }
        };

        const variance = (Math.random() - 0.5) * 10;
        
        data[segment][channel] = {
          leads_targeted: Math.floor(Math.random() * 500 + 200),
          emails_sent: Math.floor(Math.random() * 400 + 150),
          responses: Math.floor(Math.random() * 100 + 30),
          meetings: Math.floor(Math.random() * 30 + 5),
          response_rate: baseRates[segment][channel] + variance,
          meeting_rate: baseMeetingRates[segment][channel] + variance / 5,
          roi: Math.floor(Math.random() * 50000 + 10000),
          trend: Math.floor(Math.random() * 40 - 15)
        };
      });
    });
    
    return data;
  }, [playbooks]);

  // Calculate benchmarks for the selected metric
  const benchmark = useMemo(() => {
    const allValues = segments.flatMap(s => 
      channels.map(c => matrixData[s]?.[c]?.[selectedMetric] || 0)
    );
    return allValues.reduce((a, b) => a + b, 0) / allValues.length;
  }, [matrixData, selectedMetric]);

  // Handle cell click
  const handleCellClick = (segment, channel) => {
    const data = matrixData[segment]?.[channel];
    if (data) {
      setSelectedCell({
        segment,
        channel,
        data: {
          value: data[selectedMetric],
          benchmark,
          trend: data.trend
        }
      });
    }
  };

  const metricInfo = metricConfig[selectedMetric];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Grid3X3 className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Attribution Matrix</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                See what works where across segments & channels
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Metric Selector */}
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-700 dark:text-gray-300"
            >
              {Object.entries(metricConfig).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {['standard', 'comparison'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors capitalize ${
                    viewMode === mode
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Export */}
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Download size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Matrix Content */}
      <div className="p-5 overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Column Headers */}
          <div className="flex items-end mb-3">
            <div className="min-w-32" /> {/* Spacer for row headers */}
            {channels.map(channel => (
              <ColumnHeader 
                key={channel} 
                label={channel}
                icon={channel === 'email' ? Mail : channel === 'linkedin' ? MessageSquare : Calendar}
              />
            ))}
            <div className="min-w-24 text-center">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Avg</span>
            </div>
          </div>

          {/* Matrix Rows */}
          <div className="space-y-2">
            {segments.map(segment => {
              const rowData = matrixData[segment];
              const rowAvg = channels.reduce((sum, ch) => 
                sum + (rowData?.[ch]?.[selectedMetric] || 0), 0
              ) / channels.length;

              return (
                <div key={segment} className="flex items-center gap-2">
                  <RowHeader 
                    label={segment}
                    sublabel={
                      segment === 'startup' ? '1-50 emp' :
                      segment === 'midmarket' ? '51-500 emp' : '500+ emp'
                    }
                    icon={Users}
                  />
                  
                  {channels.map(channel => (
                    <MatrixCell
                      key={channel}
                      value={rowData?.[channel]?.[selectedMetric] || 0}
                      benchmark={benchmark}
                      format={metricInfo.format}
                      trend={rowData?.[channel]?.trend}
                      isSelected={selectedCell?.segment === segment && selectedCell?.channel === channel}
                      onClick={() => handleCellClick(segment, channel)}
                    />
                  ))}
                  
                  {/* Row Average */}
                  <div className="min-w-24 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {formatValue(rowAvg, metricInfo.format)}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Column Averages */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="min-w-32 text-right pr-4">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Column Avg</span>
              </div>
              {channels.map(channel => {
                const colAvg = segments.reduce((sum, seg) => 
                  sum + (matrixData[seg]?.[channel]?.[selectedMetric] || 0), 0
                ) / segments.length;

                return (
                  <div 
                    key={channel}
                    className="w-24 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {formatValue(colAvg, metricInfo.format)}
                    </span>
                  </div>
                );
              })}
              <div className="min-w-24 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                  {formatValue(benchmark, metricInfo.format)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <MatrixLegend />
        </div>
      </div>

      {/* Selected Cell Detail */}
      {selectedCell && (
        <div className="px-5 pb-5">
          <AttributionDetail 
            segment={selectedCell.segment}
            channel={selectedCell.channel}
            metric={selectedMetric}
            data={selectedCell.data}
            onClose={() => setSelectedCell(null)}
          />
        </div>
      )}
    </div>
  );
};

export default PlaybookAttributionMatrix;
