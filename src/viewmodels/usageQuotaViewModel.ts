/**
 * Usage Quota ViewModel
 * 
 * Transforms domain usage data into render-safe presentation primitives.
 * React components receive only view models, never raw domain objects.
 */

export interface UsageQuotaData {
  used: number;
  limit: number;
  trend?: number;
}

export interface UsageQuotaViewModel {
  // Display values (pre-formatted strings)
  usedFormatted: string;
  limitFormatted: string;
  percentFormatted: string;
  trendFormatted: string;
  
  // Numeric values (safe numbers)
  usedValue: number;
  limitValue: number;
  percentValue: number;
  trendValue: number;
  
  // Status flags (safe booleans)
  isNearLimit: boolean;
  isOverLimit: boolean;
  hasPositiveTrend: boolean;
  hasNegativeTrend: boolean;
  
  // Style helpers (safe strings for CSS)
  statusColor: string;
  statusLabel: string;
  progressBarColor: string;
}

/**
 * Transforms usage quota domain data into view model
 */
export function createUsageQuotaViewModel(
  data: UsageQuotaData | null | undefined
): UsageQuotaViewModel {
  // Safe defaults if data is null/undefined
  if (!data) {
    return {
      usedFormatted: '0',
      limitFormatted: '0',
      percentFormatted: '0%',
      trendFormatted: '0%',
      usedValue: 0,
      limitValue: 0,
      percentValue: 0,
      trendValue: 0,
      isNearLimit: false,
      isOverLimit: false,
      hasPositiveTrend: false,
      hasNegativeTrend: false,
      statusColor: 'text-slate-400',
      statusLabel: 'Unknown',
      progressBarColor: 'bg-slate-500',
    };
  }

  // Safely extract values with fallbacks
  const used = typeof data.used === 'number' ? data.used : 0;
  const limit = typeof data.limit === 'number' && data.limit > 0 ? data.limit : 1;
  const trend = typeof data.trend === 'number' ? data.trend : 0;

  // Calculate percentage
  const percent = Math.min(100, Math.round((used / limit) * 100));

  // Determine status thresholds
  const isOverLimit = percent > 100;
  const isNearLimit = percent >= 75 && !isOverLimit;

  // Determine trend direction
  const hasPositiveTrend = trend > 0;
  const hasNegativeTrend = trend < 0;

  // Format values for display
  const usedFormatted = used.toLocaleString();
  const limitFormatted = limit.toLocaleString();
  const percentFormatted = `${percent}%`;
  const trendFormatted = trend !== 0 ? `${trend > 0 ? '+' : ''}${trend}%` : '—';

  // Determine status color
  let statusColor: string;
  let statusLabel: string;
  let progressBarColor: string;

  if (isOverLimit) {
    statusColor = 'text-red-400';
    statusLabel = 'Over Limit';
    progressBarColor = 'bg-red-500';
  } else if (isNearLimit) {
    statusColor = 'text-amber-400';
    statusLabel = 'Near Limit';
    progressBarColor = 'bg-amber-500';
  } else if (percent >= 50) {
    statusColor = 'text-cyan-400';
    statusLabel = 'Moderate';
    progressBarColor = 'bg-cyan-500';
  } else {
    statusColor = 'text-green-400';
    statusLabel = 'Healthy';
    progressBarColor = 'bg-green-500';
  }

  return {
    usedFormatted,
    limitFormatted,
    percentFormatted,
    trendFormatted,
    usedValue: used,
    limitValue: limit,
    percentValue: percent,
    trendValue: trend,
    isNearLimit,
    isOverLimit,
    hasPositiveTrend,
    hasNegativeTrend,
    statusColor,
    statusLabel,
    progressBarColor,
  };
}

/**
 * Creates multiple usage quota view models from a record
 */
export function createUsageQuotaViewModels(
  dataMap: Record<string, UsageQuotaData> | null | undefined
): Record<string, UsageQuotaViewModel> {
  if (!dataMap || typeof dataMap !== 'object') {
    return {};
  }

  const viewModels: Record<string, UsageQuotaViewModel> = {};

  for (const [key, data] of Object.entries(dataMap)) {
    viewModels[key] = createUsageQuotaViewModel(data);
  }

  return viewModels;
}
