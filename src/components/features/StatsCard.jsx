import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from '../ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export const StatsCard = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color = 'text-blue-600',
  bgColor = 'bg-blue-100',
}) => {
  const numericTrend = typeof trend === 'number' ? trend : Number.parseFloat(trend);
  const hasNumericTrend = Number.isFinite(numericTrend);
  const isPositive = hasNumericTrend ? numericTrend >= 0 : trend === 'up';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendLabel = hasNumericTrend ? `${numericTrend}%` : change || trend;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
            {trend !== undefined && (
              <div className="flex items-center gap-1">
                <TrendIcon
                  size={16}
                  className={cn('flex-shrink-0', isPositive ? 'text-green-600' : 'text-red-600')}
                />
                <span
                  className={cn(
                    'text-sm font-medium',
                    isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {trendLabel}
                </span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            )}
          </div>
          {Icon && (
            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                bgColor
              )}
            >
              <Icon size={24} className={color} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.string,
  trend: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.elementType,
  color: PropTypes.string,
  bgColor: PropTypes.string,
};

export default StatsCard;
