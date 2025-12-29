import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Mail, Clock, ArrowUp } from 'lucide-react';
import { useReducedMotion, viewportSettings } from '../../hooks/useMotion';
import { GlassCard, GlassCardContent, GradientText } from '../futuristic/index';

// Generate sparkline data
const generateSparklineData = (trend = 'up', points = 12, variance = 20) => {
  let baseValue = 50;
  return Array.from({ length: points }, (_, i) => {
    const trendFactor = trend === 'up' ? i * 3 : trend === 'down' ? -i * 2 : 0;
    const randomVariance = (Math.random() - 0.5) * variance;
    baseValue = Math.max(10, Math.min(100, baseValue + trendFactor / points + randomVariance));
    return { value: baseValue };
  });
};

const MiniSparkline = ({ data, color, height = 40, trend = 'up' }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${color})`}
            animationDuration={prefersReducedMotion ? 0 : 1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const MiniBarChart = ({ data, color, height = 40 }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Bar
            dataKey="value"
            fill={color}
            radius={[2, 2, 0, 0]}
            animationDuration={prefersReducedMotion ? 0 : 1000}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const DEFAULT_METRICS = [
  {
    id: 'meetings',
    label: 'Meetings per Rep',
    value: '24',
    change: '+156%',
    trend: 'up',
    icon: Users,
    color: '#06b6d4',
    chartType: 'area',
    data: generateSparklineData('up'),
  },
  {
    id: 'replyRate',
    label: 'Reply Rate',
    value: '18.4%',
    change: '+8.2%',
    trend: 'up',
    icon: Mail,
    color: '#8b5cf6',
    chartType: 'bar',
    data: generateSparklineData('up', 8, 15),
  },
  {
    id: 'pipeline',
    label: 'Pipeline Increase',
    value: '312%',
    change: '+89%',
    trend: 'up',
    icon: TrendingUp,
    color: '#10b981',
    chartType: 'area',
    data: generateSparklineData('up'),
  },
  {
    id: 'timeToMeeting',
    label: 'Time to Meeting',
    value: '4.2 days',
    change: '-73%',
    trend: 'down',
    icon: Clock,
    color: '#f97316',
    chartType: 'area',
    data: generateSparklineData('down'),
  },
];

const CustomerImpactSparklines = ({
  metrics = DEFAULT_METRICS,
  title = 'Results at a Glance',
  columns = 4,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={viewportSettings}
      onViewportEnter={() => setIsVisible(true)}
      transition={{ duration: 0.6 }}
    >
      {title && (
        <div className="text-center mb-8">
          <h3 className="text-lg font-bold font-space-grotesk">
            <GradientText gradient="aurora">{title}</GradientText>
          </h3>
        </div>
      )}

      <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-3`}>
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.change.startsWith('+');

          return (
            <motion.div
              key={metric.id}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={isVisible && !prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard variant="default" hover className="h-full overflow-hidden group">
                <GlassCardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${metric.color}20` }}
                    >
                      <Icon size={16} style={{ color: metric.color }} />
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs font-medium ${
                        isPositive ? 'text-emerald-400' : 'text-orange-400'
                      }`}
                    >
                      <ArrowUp size={12} className={isPositive ? '' : 'rotate-180'} />
                      {metric.change}
                    </div>
                  </div>

                  {/* Value */}
                  <div className="mb-2">
                    <div className="text-lg font-bold text-white font-space-grotesk">
                      {metric.value}
                    </div>
                    <div className="text-xs text-gray-400">{metric.label}</div>
                  </div>

                  {/* Sparkline */}
                  <div className="mt-3 opacity-80 group-hover:opacity-100 transition-opacity">
                    {metric.chartType === 'bar' ? (
                      <MiniBarChart data={metric.data} color={metric.color} />
                    ) : (
                      <MiniSparkline data={metric.data} color={metric.color} trend={metric.trend} />
                    )}
                  </div>
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

MiniSparkline.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
    })
  ).isRequired,
  color: PropTypes.string.isRequired,
  height: PropTypes.number,
  trend: PropTypes.oneOf(['up', 'down', 'neutral']),
};

MiniBarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
    })
  ).isRequired,
  color: PropTypes.string.isRequired,
  height: PropTypes.number,
};

CustomerImpactSparklines.propTypes = {
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      value: PropTypes.string,
      change: PropTypes.string,
      trend: PropTypes.string,
      icon: PropTypes.elementType,
      color: PropTypes.string,
      chartType: PropTypes.oneOf(['area', 'bar']),
      data: PropTypes.array,
    })
  ),
  title: PropTypes.string,
  columns: PropTypes.number,
};

export default CustomerImpactSparklines;
