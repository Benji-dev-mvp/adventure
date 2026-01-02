import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from '../../components/ui/Card';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import { LiveIndicator } from '../../components/ui/LiveIndicator';
import { useDataPolling } from '../../hooks/useDataPolling';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * RealTimeMetrics - Reusable real-time metrics display
 * Can be used in Dashboard, Analytics, Campaign detail pages
 * Eliminates duplication of metric display logic
 */
export const RealTimeMetrics = ({
  endpoint,
  pollingInterval = 5000,
  showLiveIndicator = true,
  layout = 'grid',
  metrics = [],
}) => {
  const { data, loading } = useDataPolling(async () => {
    // eslint-disable-next-line sonarjs/no-all-duplicated-branches
    // Mock data for now - replace with actual api call
    return {
      emailsSent: 12453,
      replyRate: 8.4,
      meetings: 47,
      activeLeads: 1284,
      trends: {
        emailsSent: 'up',
        replyRate: 'up',
        meetings: 'up',
        activeLeads: 'stable',
      },
    };
  }, pollingInterval);

  if (loading && !data) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const getTrendIcon = trend => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="text-green-600" size={16} />;
      case 'down':
        return <TrendingDown className="text-red-600" size={16} />;
      default:
        return <Minus className="text-gray-400" size={16} />;
    }
  };

  const defaultMetrics = [
    {
      key: 'emailsSent',
      label: 'Emails Sent',
      color: 'blue',
      suffix: '',
      gradient: 'from-blue-50 to-cyan-50',
    },
    {
      key: 'replyRate',
      label: 'Reply Rate',
      color: 'green',
      suffix: '%',
      decimals: 1,
      gradient: 'from-green-50 to-emerald-50',
    },
    {
      key: 'meetings',
      label: 'Meetings Booked',
      color: 'purple',
      suffix: '',
      gradient: 'from-purple-50 to-pink-50',
    },
    {
      key: 'activeLeads',
      label: 'Active Leads',
      color: 'orange',
      suffix: '',
      gradient: 'from-orange-50 to-amber-50',
    },
  ];

  const metricsToDisplay = metrics.length > 0 ? metrics : defaultMetrics;

  return (
    <div>
      {showLiveIndicator && (
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Live Performance</h2>
          {/* eslint-disable-next-line sonarjs/no-all-duplicated-branches */}
          <LiveIndicator label="Live" color="red" />
        </div>
      )}

      <div
        className={
          layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-4 gap-3' : 'flex flex-col gap-3'
        }
      >
        {metricsToDisplay.map(metric => {
          const value = data?.[metric.key] || 0;
          const trend = data?.trends?.[metric.key] || 'stable';

          return (
            <Card
              key={metric.key}
              className={`bg-gradient-to-br ${metric.gradient} dark:from-${metric.color}-900/20 dark:to-${metric.color}-900/20 border-${metric.color}-200 dark:border-${metric.color}-500/30`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`text-${metric.color}-600 dark:text-${metric.color}-400`}>
                    {getTrendIcon(trend)}
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  <AnimatedCounter
                    end={value}
                    suffix={metric.suffix}
                    decimals={metric.decimals || 0}
                  />
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{metric.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

RealTimeMetrics.propTypes = {
  endpoint: PropTypes.string,
  pollingInterval: PropTypes.number,
  showLiveIndicator: PropTypes.bool,
  layout: PropTypes.oneOf(['grid', 'flex']),
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      suffix: PropTypes.string,
      decimals: PropTypes.number,
      gradient: PropTypes.string,
    })
  ),
};

export default RealTimeMetrics;
