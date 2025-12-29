import React from 'react';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * Dashboard Widgets - Responsive KPIs, Stats, Charts, Gauges
 */

// KPI Card - Key Performance Indicator
export const KPICard = ({
  title,
  value,
  change,
  trend = 'up',
  icon: Icon,
  format = 'number',
  className,
  ...props
}) => {
  const formatValue = val => {
    if (format === 'currency') return `$${val.toLocaleString()}`;
    if (format === 'percentage') return `${val}%`;
    return val.toLocaleString();
  };

  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'bg-white dark:bg-gray-800',
        'rounded-xl border border-gray-200 dark:border-gray-700',
        'p-4 sm:p-6',
        'shadow-sm hover:shadow-md',
        'transition-all duration-200',
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{title}</p>
          <div className="mt-2 flex items-baseline gap-2 flex-wrap">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              {formatValue(value)}
            </p>
            {change !== undefined && (
              <div
                className={cn('flex items-center gap-1 text-sm font-medium', trendColors[trend])}
              >
                <TrendIcon size={16} className="flex-shrink-0" />
                <span>{Math.abs(change)}%</span>
              </div>
            )}
          </div>
        </div>
        {Icon && (
          <div className="flex-shrink-0 ml-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Icon className="text-white" size={20} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Stats Widget with multiple metrics
export const StatsWidget = ({ title, stats = [], className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800',
        'rounded-xl border border-gray-200 dark:border-gray-700',
        'p-4 sm:p-6',
        'shadow-sm',
        className
      )}
      {...props}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">{stat.label}</span>
            <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </span>
            {stat.subtext && (
              <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">{stat.subtext}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Progress Ring / Circular Progress
export const ProgressRing = ({
  value,
  max = 100,
  size = 'md',
  strokeWidth = 8,
  label,
  showValue = true,
  color = 'blue',
  className,
}) => {
  const sizes = {
    sm: { diameter: 80, fontSize: 'text-lg' },
    md: { diameter: 120, fontSize: 'text-2xl' },
    lg: { diameter: 160, fontSize: 'text-3xl' },
    xl: { diameter: 200, fontSize: 'text-4xl' },
  };

  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
  };

  const { diameter, fontSize } = sizes[size];
  const radius = (diameter - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (value / max) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative inline-flex items-center justify-center">
        <svg width={diameter} height={diameter} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn('transition-all duration-1000 ease-out', colors[color])}
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('font-bold', fontSize, colors[color])}>
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
      {label && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">{label}</p>
      )}
    </div>
  );
};

// Gauge / Speedometer
export const Gauge = ({
  value,
  min = 0,
  max = 100,
  label,
  unit = '',
  thresholds = { low: 33, medium: 66 },
  size = 'md',
  className,
}) => {
  const sizes = {
    sm: { width: 150, height: 100, fontSize: 'text-xl' },
    md: { width: 200, height: 120, fontSize: 'text-2xl' },
    lg: { width: 250, height: 150, fontSize: 'text-3xl' },
  };

  const { width, height, fontSize } = sizes[size];
  const percentage = ((value - min) / (max - min)) * 100;
  const angle = (percentage / 100) * 180 - 90;

  const getColor = () => {
    if (percentage < thresholds.low) return 'text-red-500';
    if (percentage < thresholds.medium) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative" style={{ width, height }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Background arc */}
          <path
            d={`M ${width * 0.1},${height * 0.9} A ${width * 0.4},${width * 0.4} 0 0,1 ${width * 0.9},${height * 0.9}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress arc */}
          <path
            d={`M ${width * 0.1},${height * 0.9} A ${width * 0.4},${width * 0.4} 0 0,1 ${width * 0.9},${height * 0.9}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray={`${(percentage / 100) * 188.5} 188.5`}
            className={cn('transition-all duration-1000', getColor())}
            strokeLinecap="round"
          />
          {/* Needle */}
          <line
            x1={width / 2}
            y1={height * 0.9}
            x2={width / 2}
            y2={height * 0.3}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className={cn('transition-all duration-700 origin-bottom', getColor())}
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: `${width / 2}px ${height * 0.9}px`,
            }}
          />
          {/* Center dot */}
          <circle
            cx={width / 2}
            cy={height * 0.9}
            r="6"
            fill="currentColor"
            className="text-gray-800 dark:text-gray-200"
          />
        </svg>
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <div className={cn('font-bold', fontSize, getColor())}>
            {value}
            {unit}
          </div>
        </div>
      </div>
      {label && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{label}</p>}
    </div>
  );
};

// Metric Card with Arrow
export const MetricCard = ({ label, value, change, icon: Icon, trend, className }) => {
  const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight;
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800',
        'rounded-lg border border-gray-200 dark:border-gray-700',
        'p-4',
        'hover:shadow-lg transition-shadow',
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{label}</span>
        {Icon && <Icon className="text-gray-400 dark:text-gray-600" size={18} />}
      </div>
      <div className="flex items-end justify-between">
        <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
        {change && (
          <div className={cn('flex items-center gap-1 text-sm font-medium', trendColor)}>
            <TrendIcon size={16} />
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Activity Timeline
export const ActivityTimeline = ({ activities = [], className }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800',
        'rounded-xl border border-gray-200 dark:border-gray-700',
        'p-4 sm:p-6',
        className
      )}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <div
                className={cn(
                  'w-8 h-8 sm:w-10 sm:h-10 rounded-full',
                  'flex items-center justify-center',
                  activity.color || 'bg-blue-100 dark:bg-blue-900'
                )}
              >
                {activity.icon && (
                  <activity.icon size={16} className="text-blue-600 dark:text-blue-400" />
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                {activity.title}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
