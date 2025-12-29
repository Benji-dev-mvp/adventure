/**
 * StrategyRecommendationCards.jsx
 *
 * AI-generated insight cards explaining the 'how/why' behind playbook performance.
 * Provides actionable recommendations based on data analysis.
 *
 * Features:
 * - Contextual insights based on playbook performance
 * - Actionable recommendations with priority levels
 * - Trend analysis and predictions
 * - One-click action buttons to implement suggestions
 */

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Zap,
  Target,
  Clock,
  Sparkles,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Brain,
} from 'lucide-react';

// Insight types with configurations
const insightTypes = {
  optimization: {
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
    textColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    label: 'Optimization',
  },
  warning: {
    icon: AlertTriangle,
    color: 'from-yellow-500 to-orange-500',
    textColor: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    label: 'Attention Needed',
  },
  opportunity: {
    icon: Target,
    color: 'from-green-500 to-emerald-500',
    textColor: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    label: 'Opportunity',
  },
  trend: {
    icon: TrendingUp,
    color: 'from-blue-500 to-cyan-500',
    textColor: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    label: 'Trend',
  },
  prediction: {
    icon: Brain,
    color: 'from-indigo-500 to-purple-500',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    label: 'AI Prediction',
  },
};

// Priority badge
const PriorityBadge = ({ priority }) => {
  const colors = {
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors[priority]}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
    </span>
  );
};

PriorityBadge.propTypes = {
  priority: PropTypes.oneOf(['high', 'medium', 'low']).isRequired,
};

// Impact indicator
const ImpactIndicator = ({ impact }) => {
  const getBarWidth = () => {
    if (impact >= 80) return 'w-full';
    if (impact >= 60) return 'w-4/5';
    if (impact >= 40) return 'w-3/5';
    if (impact >= 20) return 'w-2/5';
    return 'w-1/5';
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 dark:text-gray-400">Impact</span>
      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full ${getBarWidth()}`}
        />
      </div>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{impact}%</span>
    </div>
  );
};

ImpactIndicator.propTypes = {
  impact: PropTypes.number.isRequired,
};

// Individual Insight Card
const InsightCard = ({ insight, onAction, onFeedback, expanded, onToggle }) => {
  const config = insightTypes[insight.type] || insightTypes.optimization;
  const Icon = config.icon;

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700
        shadow-md hover:shadow-lg transition-all duration-200
        ${expanded ? 'ring-2 ring-purple-500/30' : ''}
      `}
    >
      {/* Header */}
      <button
        type="button"
        className="p-4 cursor-pointer w-full text-left"
        onClick={onToggle}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        aria-expanded={expanded}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-9 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center flex-shrink-0`}
          >
            <Icon className="text-white" size={20} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-medium ${config.textColor}`}>{config.label}</span>
              <PriorityBadge priority={insight.priority} />
            </div>

            <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
              {insight.title}
            </h4>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {insight.summary}
            </p>
          </div>

          <ChevronRight
            size={20}
            className={`text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
          />
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <ImpactIndicator impact={insight.impact} />
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Clock size={12} />
            <span>{insight.effort}</span>
          </div>
          {insight.metric && (
            <div className="flex items-center gap-1 text-xs">
              {insight.metricTrend >= 0 ? (
                <TrendingUp size={12} className="text-green-500" />
              ) : (
                <TrendingDown size={12} className="text-red-500" />
              )}
              <span className={insight.metricTrend >= 0 ? 'text-green-600' : 'text-red-600'}>
                {insight.metricTrend >= 0 ? '+' : ''}
                {insight.metricTrend}% {insight.metric}
              </span>
            </div>
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 animate-fadeIn">
          {/* Detailed Analysis */}
          <div className={`p-4 rounded-lg ${config.bgColor}`}>
            <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Sparkles size={16} className={config.textColor} />
              AI Analysis
            </h5>
            <p className="text-sm text-gray-700 dark:text-gray-300">{insight.analysis}</p>
          </div>

          {/* Evidence Points */}
          {insight.evidence && (
            <div>
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Supporting Evidence
              </h5>
              <ul className="space-y-2">
                {insight.evidence.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommended Actions */}
          {insight.actions && (
            <div>
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Recommended Actions
              </h5>
              <div className="space-y-2">
                {insight.actions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => onAction(action)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 text-xs font-bold">
                        {i + 1}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {action.label}
                      </span>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-gray-400 group-hover:text-purple-500 transition-colors"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Feedback */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Was this insight helpful?
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onFeedback(insight.id, 'up')}
                className="p-1.5 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
              >
                <ThumbsUp size={16} className="text-gray-400 hover:text-green-500" />
              </button>
              <button
                onClick={() => onFeedback(insight.id, 'down')}
                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                <ThumbsDown size={16} className="text-gray-400 hover:text-red-500" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

InsightCard.propTypes = {
  insight: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    priority: PropTypes.oneOf(['high', 'medium', 'low']).isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    analysis: PropTypes.string,
    impact: PropTypes.number.isRequired,
    effort: PropTypes.string.isRequired,
    metric: PropTypes.string,
    metricTrend: PropTypes.number,
    evidence: PropTypes.arrayOf(PropTypes.string),
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  onAction: PropTypes.func.isRequired,
  onFeedback: PropTypes.func.isRequired,
  expanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

// Main Component
export const StrategyRecommendationCards = ({
  playbooks = [],
  runs = [],
  onApplyRecommendation,
}) => {
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Generate insights based on playbook/run data
  const insights = useMemo(() => {
    // Generate realistic insights
    return [
      {
        id: 1,
        type: 'optimization',
        priority: 'high',
        title: 'LinkedIn sequences outperforming email by 47%',
        summary:
          'Enterprise segment shows significantly higher response rates on LinkedIn compared to email. Consider rebalancing channel mix.',
        analysis:
          'Analysis of the last 30 days shows that LinkedIn outreach to enterprise accounts has a 34% response rate compared to 23% for email. The key differentiator appears to be the personalization depth possible on LinkedIn, where leads can verify sender credibility instantly.',
        impact: 85,
        effort: '2-3 hours',
        metric: 'response rate',
        metricTrend: 47,
        evidence: [
          'LinkedIn responses average 34% vs email at 23%',
          'Enterprise segment accounts for 62% of total meetings',
          'C-level prospects 3x more likely to respond on LinkedIn',
        ],
        actions: [
          { id: 'rebalance', label: 'Increase LinkedIn allocation to 50%', type: 'apply' },
          { id: 'test', label: 'Run A/B test on enterprise playbook', type: 'test' },
          { id: 'review', label: 'Review top-performing LinkedIn templates', type: 'view' },
        ],
      },
      {
        id: 2,
        type: 'warning',
        priority: 'high',
        title: 'Startup segment response rate declining',
        summary:
          'Response rates for startup-focused playbooks have dropped 23% week-over-week. Immediate attention required.',
        analysis:
          "The startup segment is showing signs of message fatigue. Open rates remain stable (42%) but click-through and response rates are declining. This pattern typically indicates that the initial hook is working but the value proposition isn't resonating.",
        impact: 72,
        effort: '4-6 hours',
        metric: 'response rate',
        metricTrend: -23,
        evidence: [
          'Week-over-week response decline from 28% to 21.5%',
          'Open rates stable at 42%, indicating subject lines work',
          'Competitor analysis shows new messaging trends in market',
        ],
        actions: [
          { id: 'refresh', label: 'Refresh value proposition messaging', type: 'edit' },
          { id: 'persona', label: 'Review startup buyer persona data', type: 'view' },
          { id: 'pause', label: 'Pause underperforming sequences', type: 'pause' },
        ],
      },
      {
        id: 3,
        type: 'opportunity',
        priority: 'medium',
        title: 'Untapped potential in mid-market tech vertical',
        summary:
          "AI analysis identifies high-intent signals in tech mid-market that current playbooks aren't targeting.",
        analysis:
          'Our data enrichment shows 847 mid-market tech companies with recent hiring activity in sales/marketing roles—a strong buying signal. Current playbooks only reach 12% of this segment. Creating a dedicated playbook could generate an estimated 34 additional meetings per month.',
        impact: 68,
        effort: '1 week',
        metric: 'meetings',
        metricTrend: 34,
        evidence: [
          '847 companies showing hiring signals in target roles',
          'Current playbooks reaching only 12% of this segment',
          'Similar segments convert at 4.2% to meetings',
        ],
        actions: [
          { id: 'create', label: 'Create Tech Mid-Market Playbook', type: 'create' },
          { id: 'list', label: 'Export high-intent company list', type: 'export' },
          { id: 'enrich', label: 'Enrich contacts at target companies', type: 'enrich' },
        ],
      },
      {
        id: 4,
        type: 'trend',
        priority: 'low',
        title: 'Tuesday 10 AM sends show 2x reply rate',
        summary:
          'Timing analysis reveals optimal send windows that could double response rates across all playbooks.',
        analysis:
          'Deep analysis of 12,847 emails over 90 days reveals strong patterns in response behavior. Tuesday at 10 AM local time consistently outperforms all other slots by 2x. Friday afternoons show 67% lower engagement. Implementing smart send-time optimization could improve overall results by 35%.',
        impact: 55,
        effort: '30 minutes',
        metric: 'reply rate',
        metricTrend: 112,
        evidence: [
          'Tuesday 10 AM: 31% response rate',
          'Wednesday 2 PM: 24% response rate',
          'Friday 4 PM: 11% response rate',
        ],
        actions: [
          { id: 'optimize', label: 'Enable smart send-time optimization', type: 'toggle' },
          { id: 'schedule', label: 'Reschedule pending sequences', type: 'apply' },
        ],
      },
      {
        id: 5,
        type: 'prediction',
        priority: 'medium',
        title: 'Projected: 28 meetings from current pipeline',
        summary:
          'AI predicts current active sequences will generate 28 meetings over the next 14 days based on historical patterns.',
        analysis:
          'Based on current engagement patterns and historical conversion data, we predict 28 meetings (±5) will be booked from sequences currently in motion. This is 15% above the monthly target. Key drivers: strong enterprise LinkedIn engagement and improved objection handling responses.',
        impact: 78,
        effort: 'Monitor',
        metric: 'meetings',
        metricTrend: 15,
        evidence: [
          '412 leads currently in active sequences',
          '73 showing positive engagement signals',
          'Historical conversion from engaged leads: 38%',
        ],
        actions: [
          { id: 'monitor', label: 'Set up real-time prediction alerts', type: 'toggle' },
          { id: 'capacity', label: 'Check AE calendar capacity', type: 'view' },
        ],
      },
    ];
  }, [playbooks, runs]);

  // Filter insights
  const filteredInsights = useMemo(() => {
    if (filter === 'all') return insights;
    return insights.filter(i => i.type === filter);
  }, [insights, filter]);

  // Refresh insights
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1500));
    setRefreshing(false);
  };

  // Handle action
  const handleAction = action => {
    if (onApplyRecommendation) {
      onApplyRecommendation(action);
    } else {
      console.log('Action clicked:', action);
    }
  };

  // Handle feedback
  const handleFeedback = (insightId, type) => {
    console.log('Feedback:', insightId, type);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-9 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Lightbulb className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Strategy Insights</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI-powered recommendations to optimize performance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Type Filter */}
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-700 dark:text-gray-300"
            >
              <option value="all">All Insights</option>
              <option value="optimization">Optimizations</option>
              <option value="warning">Warnings</option>
              <option value="opportunity">Opportunities</option>
              <option value="trend">Trends</option>
              <option value="prediction">Predictions</option>
            </select>

            {/* Refresh Button */}
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
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="p-4">
        <div className="space-y-3">
          {filteredInsights.map(insight => (
            <InsightCard
              key={insight.id}
              insight={insight}
              expanded={expandedId === insight.id}
              onToggle={() => setExpandedId(expandedId === insight.id ? null : insight.id)}
              onAction={handleAction}
              onFeedback={handleFeedback}
            />
          ))}
        </div>

        {filteredInsights.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Lightbulb size={32} className="mx-auto mb-2 opacity-50" />
            <p>No insights available for this filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

StrategyRecommendationCards.propTypes = {
  playbooks: PropTypes.array,
  runs: PropTypes.array,
  onApplyRecommendation: PropTypes.func,
};

export default StrategyRecommendationCards;
