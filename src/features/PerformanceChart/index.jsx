import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../components/ui/Card';
import {
  CHART_CONFIGS,
  generateTimeSeriesData,
  getChartConfig,
} from '../../config/chartDataFactory';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/**
 * PerformanceChart - Reusable chart component with factory-based configs
 * Eliminates chart configuration duplication across Dashboard, Analytics, Reports
 */
export const PerformanceChart = ({
  title = 'Performance Overview',
  description = 'Last 7 days activity',
  type = 'performance',
  data = null,
  days = 7,
  height = 300,
  showLegend = true,
  className = '',
}) => {
  const chartConfig = getChartConfig(type);

  const chartData = useMemo(() => {
    if (data) return data;

    // Generate mock data based on type
    const baseValues =
      type === 'performance'
        ? { emails: 400, replies: 30, meetings: 12 }
        : { leads: 1000, qualified: 600, meetings: 200, closed: 80 };

    return generateTimeSeriesData(days, baseValues);
  }, [data, type, days]);

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    if (chartConfig.type === 'area') {
      return (
        <AreaChart {...commonProps}>
          <defs>
            {chartConfig.dataKeys.map((key, index) => (
              <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.colors[index]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartConfig.colors[index]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid {...CHART_CONFIGS.grid} />
          <XAxis dataKey={chartConfig.xAxisDataKey} {...CHART_CONFIGS.axis} />
          <YAxis {...CHART_CONFIGS.axis} />
          <Tooltip {...CHART_CONFIGS.tooltip} />
          {chartConfig.dataKeys.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={chartConfig.colors[index]}
              fillOpacity={1}
              fill={`url(#color${key})`}
            />
          ))}
        </AreaChart>
      );
    }

    return (
      <LineChart {...commonProps}>
        <CartesianGrid {...CHART_CONFIGS.grid} />
        <XAxis dataKey={chartConfig.xAxisDataKey} {...CHART_CONFIGS.axis} />
        <YAxis {...CHART_CONFIGS.axis} />
        <Tooltip {...CHART_CONFIGS.tooltip} />
        {chartConfig.dataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={chartConfig.colors[index]}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {showLegend && (
          <div className="flex flex-wrap gap-4 mb-4">
            {chartConfig.dataKeys.map((key, index) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: chartConfig.colors[index] }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{key}</span>
              </div>
            ))}
          </div>
        )}
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

PerformanceChart.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  type: PropTypes.string,
  data: PropTypes.array,
  days: PropTypes.number,
  height: PropTypes.number,
  showLegend: PropTypes.bool,
  className: PropTypes.string,
};

export default PerformanceChart;
