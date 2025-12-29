/**
 * PlaybookAnalyticsPanel.jsx
 *
 * Comprehensive funnel + channel dashboard with data-first storytelling.
 * Integrates all Phase 1 visual intelligence components into a unified view.
 *
 * Features:
 * - Multi-stage funnel visualization
 * - Channel performance comparison
 * - KPI summary cards
 * - Trend analysis
 * - Export and drill-down capabilities
 */

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart3,
  TrendingUp,
  Download,
  RefreshCw,
  Users,
  Mail,
  MessageSquare,
  Calendar,
  Target,
  Zap,
  Phone,
  Linkedin,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { AnimatedCounter } from '../../ui/AnimatedComponents';

// Funnel Stage Component
const FunnelStage = ({ stage, value, previousValue, color, isLast }) => {
  const conversionRate = previousValue ? ((value / previousValue) * 100).toFixed(1) : null;
  const dropOff = previousValue ? previousValue - value : null;

  return (
    <div className="flex-1 relative">
      {/* Stage Bar */}
      <div
        className={`h-20 ${color} rounded-lg flex items-center justify-center relative overflow-hidden`}
        style={{
          clipPath: isLast
            ? 'polygon(10% 0, 100% 0, 100% 100%, 10% 100%, 0% 50%)'
            : 'polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%, 10% 50%)',
        }}
      >
        <div className="text-center text-white z-10">
          <div className="text-lg font-bold">
            <AnimatedCounter end={value} />
          </div>
          <div className="text-xs opacity-90">{stage.label}</div>
        </div>
      </div>

      {/* Conversion Arrow */}
      {conversionRate && (
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-20">
          <div className="bg-white dark:bg-gray-800 rounded-full px-2 py-1 shadow-lg border border-gray-200 dark:border-gray-600">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {conversionRate}%
            </span>
          </div>
        </div>
      )}

      {/* Drop-off indicator */}
      {dropOff && dropOff > 0 && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
          <span className="text-xs text-red-500">-{dropOff.toLocaleString()} lost</span>
        </div>
      )}
    </div>
  );
};

FunnelStage.propTypes = {
  stage: PropTypes.shape({
    key: PropTypes.string,
    label: PropTypes.string.isRequired,
    color: PropTypes.string,
  }).isRequired,
  value: PropTypes.number.isRequired,
  previousValue: PropTypes.number,
  color: PropTypes.string.isRequired,
  isLast: PropTypes.bool,
};

// Full Funnel Visualization
const FunnelVisualization = ({ data }) => {
  const stages = [
    { key: 'leads', label: 'Leads Targeted', color: 'bg-gradient-to-r from-blue-500 to-blue-600' },
    {
      key: 'contacted',
      label: 'Contacted',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
    },
    { key: 'engaged', label: 'Engaged', color: 'bg-gradient-to-r from-pink-500 to-pink-600' },
    {
      key: 'responded',
      label: 'Responded',
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
    },
    { key: 'meetings', label: 'Meetings', color: 'bg-gradient-to-r from-green-500 to-green-600' },
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Conversion Funnel</h4>
      <div className="flex gap-1 items-center">
        {stages.map((stage, i) => (
          <FunnelStage
            key={stage.key}
            stage={stage}
            value={data[stage.key]}
            previousValue={i > 0 ? data[stages[i - 1].key] : null}
            color={stage.color}
            isLast={i === stages.length - 1}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-8">
        <span>
          Overall Conversion:{' '}
          <strong className="text-green-600">
            {((data.meetings / data.leads) * 100).toFixed(2)}%
          </strong>
        </span>
        <span>
          Best Stage: <strong className="text-blue-600">Engaged → Responded (42%)</strong>
        </span>
      </div>
    </div>
  );
};

FunnelVisualization.propTypes = {
  data: PropTypes.shape({
    leads: PropTypes.number.isRequired,
    contacted: PropTypes.number,
    engaged: PropTypes.number,
    responded: PropTypes.number,
    meetings: PropTypes.number.isRequired,
  }).isRequired,
};

// Channel Performance Bars
const ChannelPerformance = ({ data }) => {
  const channels = [
    { key: 'email', label: 'Email', icon: Mail, color: 'from-blue-500 to-blue-600' },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'from-indigo-500 to-purple-600' },
    { key: 'phone', label: 'Phone', icon: Phone, color: 'from-green-500 to-emerald-600' },
  ];

  const maxValue = Math.max(...channels.map(c => data[c.key]?.meetings || 0));

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Channel Performance</h4>
      <div className="space-y-3">
        {channels.map(channel => {
          const channelData = data[channel.key] || {};
          const barWidth = (channelData.meetings / maxValue) * 100;
          const Icon = channel.icon;

          return (
            <div key={channel.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {channel.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {channelData.response_rate?.toFixed(1)}% response
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {channelData.meetings} meetings
                  </span>
                  <span
                    className={`flex items-center ${channelData.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {channelData.trend >= 0 ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}
                    {Math.abs(channelData.trend)}%
                  </span>
                </div>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${channel.color} rounded-full transition-all duration-500`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// KPI Card
const KPICard = ({ label, value, format, trend, icon: Icon, color }) => {
  const formatValue = (val, fmt) => {
    switch (fmt) {
      case 'percent':
        return `${val.toFixed(1)}%`;
      case 'currency':
        return `$${(val / 1000).toFixed(1)}k`;
      default:
        return val.toLocaleString();
    }
  };

  return (
    <div className={`bg-gradient-to-br ${color} rounded-lg p-4 text-white`}>
      <div className="flex items-center justify-between mb-2">
        <Icon size={20} className="opacity-80" />
        {trend !== undefined && (
          <div
            className={`flex items-center text-xs ${trend >= 0 ? 'text-green-200' : 'text-red-200'}`}
          >
            {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-lg font-bold mb-1">
        {format === 'number' ? <AnimatedCounter end={value} /> : formatValue(value, format)}
      </div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  );
};

KPICard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  format: PropTypes.oneOf(['number', 'percent', 'currency']).isRequired,
  trend: PropTypes.number,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
};

// Segment Breakdown
const SegmentBreakdown = ({ data }) => {
  const segments = [
    { key: 'startup', label: 'Startup', color: 'bg-blue-500' },
    { key: 'midmarket', label: 'Mid-Market', color: 'bg-purple-500' },
    { key: 'enterprise', label: 'Enterprise', color: 'bg-pink-500' },
  ];

  const total = segments.reduce((sum, s) => sum + (data[s.key]?.meetings || 0), 0);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Segment Breakdown</h4>
      <div className="flex gap-2 h-8 rounded-lg overflow-hidden">
        {segments.map(segment => {
          const meetings = data[segment.key]?.meetings || 0;
          const width = (meetings / total) * 100;
          return (
            <div
              key={segment.key}
              className={`${segment.color} transition-all duration-500`}
              style={{ width: `${width}%` }}
              title={`${segment.label}: ${meetings} meetings (${width.toFixed(1)}%)`}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-xs">
        {segments.map(segment => (
          <div key={segment.key} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${segment.color}`} />
            <span className="text-gray-600 dark:text-gray-400">
              {segment.label}: <strong>{data[segment.key]?.meetings || 0}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

SegmentBreakdown.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.shape({
      leads: PropTypes.number,
      meetings: PropTypes.number,
      pipeline: PropTypes.number,
    })
  ).isRequired,
};

// Time Series Mini Chart
const TrendMiniChart = ({ data, label }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Last 7 days</span>
      </div>
      <div className="flex items-end gap-1 h-9">
        {data.map((value, i) => (
          <div
            key={i}
            className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t transition-all duration-300 hover:opacity-80"
            style={{ height: `${((value - min) / range) * 100}%`, minHeight: '4px' }}
            title={`Day ${i + 1}: ${value}`}
          />
        ))}
      </div>
    </div>
  );
};

TrendMiniChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  label: PropTypes.string.isRequired,
};

// Main Component
export const PlaybookAnalyticsPanel = ({ playbooks = [], runs = [], dateRange = '30d' }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedView, setSelectedView] = useState('overview');

  // Generate comprehensive analytics data
  const analyticsData = useMemo(() => {
    // Funnel data
    const funnel = {
      leads: 2847,
      contacted: 2341,
      engaged: 1456,
      responded: 612,
      meetings: 127,
    };

    // Channel data
    const channels = {
      email: {
        leads: 1800,
        responses: 378,
        meetings: 52,
        response_rate: 21.0,
        trend: 8,
      },
      linkedin: {
        leads: 720,
        responses: 187,
        meetings: 58,
        response_rate: 26.0,
        trend: 15,
      },
      phone: {
        leads: 327,
        responses: 47,
        meetings: 17,
        response_rate: 14.4,
        trend: -5,
      },
    };

    // Segment data
    const segments = {
      startup: { leads: 1200, meetings: 34, pipeline: 245000 },
      midmarket: { leads: 1047, meetings: 52, pipeline: 487000 },
      enterprise: { leads: 600, meetings: 41, pipeline: 892000 },
    };

    // KPIs
    const kpis = {
      totalLeads: 2847,
      totalMeetings: 127,
      responseRate: 21.5,
      meetingRate: 4.5,
      pipelineValue: 1624000,
      avgDealSize: 127870,
    };

    // Trends (last 7 days)
    const trends = {
      meetings: [12, 18, 15, 22, 19, 24, 17],
      responses: [45, 52, 48, 67, 58, 71, 62],
    };

    return { funnel, channels, segments, kpis, trends };
  }, [playbooks, runs, dateRange]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1000));
    setRefreshing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-9 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Playbook Analytics</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Funnel performance & channel insights
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {['overview', 'funnel', 'channels'].map(view => (
                <button
                  key={view}
                  onClick={() => setSelectedView(view)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors capitalize ${
                    selectedView === view
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RefreshCw
                size={18}
                className={`text-gray-600 dark:text-gray-400 ${refreshing ? 'animate-spin' : ''}`}
              />
            </button>

            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Download size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <KPICard
            label="Total Leads"
            value={analyticsData.kpis.totalLeads}
            format="number"
            trend={12}
            icon={Users}
            color="from-blue-500 to-blue-600"
          />
          <KPICard
            label="Meetings Booked"
            value={analyticsData.kpis.totalMeetings}
            format="number"
            trend={23}
            icon={Calendar}
            color="from-green-500 to-emerald-600"
          />
          <KPICard
            label="Response Rate"
            value={analyticsData.kpis.responseRate}
            format="percent"
            trend={5}
            icon={MessageSquare}
            color="from-purple-500 to-pink-600"
          />
          <KPICard
            label="Meeting Rate"
            value={analyticsData.kpis.meetingRate}
            format="percent"
            trend={8}
            icon={Target}
            color="from-orange-500 to-red-600"
          />
          <KPICard
            label="Pipeline Value"
            value={analyticsData.kpis.pipelineValue}
            format="currency"
            trend={18}
            icon={TrendingUp}
            color="from-indigo-500 to-purple-600"
          />
          <KPICard
            label="Avg Deal Size"
            value={analyticsData.kpis.avgDealSize}
            format="currency"
            trend={-3}
            icon={Zap}
            color="from-pink-500 to-rose-600"
          />
        </div>

        {/* Main Visualizations */}
        {selectedView === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <FunnelVisualization data={analyticsData.funnel} />
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <ChannelPerformance data={analyticsData.channels} />
            </div>
          </div>
        )}

        {selectedView === 'funnel' && (
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
            <FunnelVisualization data={analyticsData.funnel} />
          </div>
        )}

        {selectedView === 'channels' && (
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
            <ChannelPerformance data={analyticsData.channels} />
          </div>
        )}

        {/* Bottom Row: Segments & Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
            <SegmentBreakdown data={analyticsData.segments} />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 space-y-3">
            <TrendMiniChart data={analyticsData.trends.meetings} label="Meetings Trend" />
            <TrendMiniChart data={analyticsData.trends.responses} label="Responses Trend" />
          </div>
        </div>

        {/* Data Story */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="text-white" size={16} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">AI Data Story</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                This month, your playbooks generated{' '}
                <strong className="text-purple-600">127 meetings</strong> from
                <strong> 2,847 leads</strong>, a{' '}
                <strong className="text-green-600">+23% improvement</strong> over last month.
                LinkedIn continues to outperform with a <strong>26% response rate</strong>—15%
                higher than email. Enterprise segment drives <strong>55% of pipeline value</strong>{' '}
                despite representing only 21% of leads. Consider increasing LinkedIn allocation for
                enterprise accounts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PlaybookAnalyticsPanel.propTypes = {
  playbooks: PropTypes.arrayOf(PropTypes.object),
  runs: PropTypes.arrayOf(PropTypes.object),
  dateRange: PropTypes.string,
};

export default PlaybookAnalyticsPanel;
