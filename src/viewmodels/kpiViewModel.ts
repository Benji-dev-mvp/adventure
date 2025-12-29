/**
 * KPI ViewModel
 * 
 * Transforms KPI domain data into render-safe presentation primitives.
 * Handles formatting, trend calculation, and display logic.
 */

export interface KpiData {
  label: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  format?: 'number' | 'currency' | 'percent';
  target?: number;
}

export interface KpiViewModel {
  // Display values (pre-formatted)
  label: string;
  valueFormatted: string;
  changeFormatted: string;
  changeLabelFormatted: string;
  targetFormatted: string;
  
  // Numeric values (safe)
  valueNumeric: number;
  changeNumeric: number;
  targetNumeric: number;
  progressPercent: number;
  
  // Status flags (safe booleans)
  hasChange: boolean;
  hasPositiveChange: boolean;
  hasNegativeChange: boolean;
  hasTarget: boolean;
  isOnTarget: boolean;
  isAboveTarget: boolean;
  
  // Style helpers (safe strings)
  changeColor: string;
  changeIcon: string;
  statusColor: string;
}

/**
 * Format a number based on type
 */
function formatValue(value: number, format: KpiData['format'] = 'number'): string {
  switch (format) {
    case 'currency':
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `$${(value / 1000).toFixed(0)}K`;
      }
      return `$${value.toLocaleString()}`;
      
    case 'percent':
      return `${value.toFixed(1)}%`;
      
    case 'number':
    default:
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K`;
      }
      return value.toLocaleString();
  }
}

/**
 * Transforms KPI domain data into view model
 */
export function createKpiViewModel(
  data: KpiData | null | undefined
): KpiViewModel {
  // Safe defaults
  if (!data) {
    return {
      label: '',
      valueFormatted: '—',
      changeFormatted: '',
      changeLabelFormatted: '',
      targetFormatted: '',
      valueNumeric: 0,
      changeNumeric: 0,
      targetNumeric: 0,
      progressPercent: 0,
      hasChange: false,
      hasPositiveChange: false,
      hasNegativeChange: false,
      hasTarget: false,
      isOnTarget: false,
      isAboveTarget: false,
      changeColor: 'text-slate-400',
      changeIcon: '',
      statusColor: 'text-slate-400',
    };
  }

  // Extract and validate values
  const label = typeof data.label === 'string' ? data.label : '';
  const valueNumeric = typeof data.value === 'number' ? data.value : 0;
  const changeNumeric = typeof data.change === 'number' ? data.change : 0;
  const targetNumeric = typeof data.target === 'number' ? data.target : 0;
  const format = data.format || 'number';

  // Format display values
  const valueFormatted = typeof data.value === 'string' 
    ? data.value 
    : formatValue(valueNumeric, format);

  const hasChange = changeNumeric !== 0;
  const hasPositiveChange = changeNumeric > 0;
  const hasNegativeChange = changeNumeric < 0;

  const changeFormatted = hasChange 
    ? `${hasPositiveChange ? '+' : ''}${changeNumeric.toFixed(1)}%`
    : '';

  const changeLabelFormatted = typeof data.changeLabel === 'string' 
    ? data.changeLabel 
    : hasChange ? 'vs. last period' : '';

  const hasTarget = targetNumeric > 0;
  const targetFormatted = hasTarget ? formatValue(targetNumeric, format) : '';
  
  // Calculate progress toward target
  const progressPercent = hasTarget && valueNumeric > 0
    ? Math.min(100, Math.round((valueNumeric / targetNumeric) * 100))
    : 0;

  const isOnTarget = progressPercent >= 90 && progressPercent <= 110;
  const isAboveTarget = progressPercent > 110;

  // Determine colors and icons
  let changeColor: string;
  let changeIcon: string;

  if (hasPositiveChange) {
    changeColor = 'text-green-400';
    changeIcon = '↑';
  } else if (hasNegativeChange) {
    changeColor = 'text-red-400';
    changeIcon = '↓';
  } else {
    changeColor = 'text-slate-400';
    changeIcon = '→';
  }

  let statusColor: string;
  if (isAboveTarget) {
    statusColor = 'text-green-400';
  } else if (isOnTarget) {
    statusColor = 'text-cyan-400';
  } else if (hasTarget) {
    statusColor = 'text-amber-400';
  } else {
    statusColor = 'text-slate-400';
  }

  return {
    label,
    valueFormatted,
    changeFormatted,
    changeLabelFormatted,
    targetFormatted,
    valueNumeric,
    changeNumeric,
    targetNumeric,
    progressPercent,
    hasChange,
    hasPositiveChange,
    hasNegativeChange,
    hasTarget,
    isOnTarget,
    isAboveTarget,
    changeColor,
    changeIcon,
    statusColor,
  };
}

/**
 * Creates multiple KPI view models from an array
 */
export function createKpiViewModels(
  dataList: KpiData[] | null | undefined
): KpiViewModel[] {
  if (!Array.isArray(dataList)) {
    return [];
  }

  return dataList.map(data => createKpiViewModel(data));
}
