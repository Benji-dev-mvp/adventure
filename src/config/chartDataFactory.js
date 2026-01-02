/**
 * Chart Data Factory
 *
 * Centralized chart configurations and data generators
 * Eliminates duplication of chart setups across Dashboard, Analytics, Reports
 */

// Chart Color Palettes
export const CHART_COLORS = {
  primary: ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'],
  gradient: {
    blue: { start: '#3b82f6', end: '#06b6d4', opacity: 0.8 },
    green: { start: '#10b981', end: '#34d399', opacity: 0.8 },
    purple: { start: '#8b5cf6', end: '#c084fc', opacity: 0.8 },
    orange: { start: '#f59e0b', end: '#fb923c', opacity: 0.8 },
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
  },
};

// Chart Type Templates
export const CHART_TEMPLATES = {
  performance: {
    type: 'area',
    dataKeys: ['emails', 'replies', 'meetings'],
    colors: ['#3b82f6', '#10b981', '#8b5cf6'],
    yAxisLabel: 'Count',
    xAxisDataKey: 'name',
  },
  conversion: {
    type: 'line',
    dataKeys: ['leads', 'qualified', 'meetings', 'closed'],
    colors: ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'],
    yAxisLabel: 'Count',
    xAxisDataKey: 'stage',
  },
  trends: {
    type: 'area',
    dataKeys: ['value', 'target'],
    colors: ['#3b82f6', '#94a3b8'],
    yAxisLabel: 'Value',
    xAxisDataKey: 'date',
  },
};

/**
 * Generate time-series data for charts
 */
export const generateTimeSeriesData = (days = 7, baseValues = {}) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (days - 1 - i));

    return {
      name: dayNames[date.getDay()],
      date: date.toISOString().split('T')[0],
      ...Object.entries(baseValues).reduce(
        (acc, [key, baseValue]) => ({
          ...acc,
          [key]: Math.floor(baseValue * (0.8 + Math.random() * 0.4)),
        }),
        {}
      ),
    };
  });
};

/**
 * Generate funnel data
 */
export const generateFunnelData = (stages, startValue = 1000) => {
  return stages.map((stage, index) => ({
    stage,
    value: Math.floor(startValue * Math.pow(0.6, index)),
    color: CHART_COLORS.primary[index % CHART_COLORS.primary.length],
  }));
};

/**
 * Common chart configurations
 */
export const CHART_CONFIGS = {
  responsive: {
    width: '100%',
    height: 300,
  },
  grid: {
    strokeDasharray: '3 3',
    opacity: 0.1,
  },
  axis: {
    tick: { fontSize: 12 },
    stroke: '#94a3b8',
  },
  tooltip: {
    contentStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      border: 'none',
      borderRadius: '8px',
      color: '#fff',
    },
  },
};

/**
 * Get chart config by type
 */
export const getChartConfig = type => {
  return CHART_TEMPLATES[type] || CHART_TEMPLATES.performance;
};

export default {
  CHART_COLORS,
  CHART_TEMPLATES,
  CHART_CONFIGS,
  generateTimeSeriesData,
  generateFunnelData,
  getChartConfig,
};
