/**
 * Render Safety Utilities
 * 
 * Functions to validate inputs before rendering to prevent crashes.
 * Use these when dealing with:
 * - Canvas drawing
 * - Chart libraries
 * - Dynamic colors
 * - User-provided data
 */

/**
 * Validate and sanitize a color value
 * Returns a safe color or fallback
 */
export function safeColor(color: string | undefined | null, fallback = '#6B7280'): string {
  if (!color) return fallback;
  
  // Check for valid hex color (3 or 6 digits)
  if (/^#[0-9A-Fa-f]{3}$/.test(color) || /^#[0-9A-Fa-f]{6}$/.test(color)) {
    return color;
  }
  
  // Check for valid rgb/rgba
  if (/^rgba?\(/.test(color)) {
    return color;
  }
  
  // Check for valid hsl/hsla
  if (/^hsla?\(/.test(color)) {
    return color;
  }
  
  // Check for named colors (basic validation)
  if (/^[a-z]+$/i.test(color)) {
    return color;
  }
  
  return fallback;
}

/**
 * Safely add opacity to a hex color
 * Converts 3-digit hex to 6-digit, then adds opacity
 * Returns rgba() format for reliable opacity support
 */
export function addColorOpacity(color: string | undefined | null, opacity: number, fallback = '#6B7280'): string {
  const safeCol = safeColor(color, fallback);
  const safeOp = safeOpacity(opacity);
  
  // Handle hex colors
  if (safeCol.startsWith('#')) {
    let hex = safeCol.slice(1);
    
    // Convert 3-digit to 6-digit
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    
    // Parse RGB values
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${safeOp})`;
    }
  }
  
  // Handle rgb/rgba - replace alpha or add it
  if (safeCol.startsWith('rgb')) {
    const match = safeCol.match(/rgba?\(([^)]+)\)/);
    if (match) {
      const parts = match[1].split(',').map(p => p.trim());
      if (parts.length >= 3) {
        return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${safeOp})`;
      }
    }
  }
  
  // Handle hsl/hsla - replace alpha or add it
  if (safeCol.startsWith('hsl')) {
    const match = safeCol.match(/hsla?\(([^)]+)\)/);
    if (match) {
      const parts = match[1].split(',').map(p => p.trim());
      if (parts.length >= 3) {
        return `hsla(${parts[0]}, ${parts[1]}, ${parts[2]}, ${safeOp})`;
      }
    }
  }
  
  // Fallback - return color as-is (might not support opacity but won't crash)
  return safeCol;
}

/**
 * Validate and sanitize a number value
 * Returns a safe number or fallback
 */
export function safeNumber(value: any, fallback = 0, min?: number, max?: number): number {
  const num = typeof value === 'number' ? value : parseFloat(value);
  
  if (isNaN(num) || !isFinite(num)) {
    return fallback;
  }
  
  if (min !== undefined && num < min) {
    return min;
  }
  
  if (max !== undefined && num > max) {
    return max;
  }
  
  return num;
}

/**
 * Validate and sanitize an array
 * Returns a safe array or empty array
 */
export function safeArray<T>(value: any, minLength = 0): T[] {
  if (!Array.isArray(value)) {
    return [];
  }
  
  if (value.length < minLength) {
    return [];
  }
  
  return value;
}

/**
 * Validate canvas context
 * Returns true if context is valid and ready to draw
 */
export function isCanvasReady(canvas: HTMLCanvasElement | null): boolean {
  if (!canvas) return false;
  if (canvas.width === 0 || canvas.height === 0) return false;
  
  try {
    const ctx = canvas.getContext('2d');
    return ctx !== null;
  } catch {
    return false;
  }
}

/**
 * Safely get canvas context with validation
 */
export function getSafeCanvasContext(
  canvas: HTMLCanvasElement | null
): CanvasRenderingContext2D | null {
  if (!isCanvasReady(canvas)) return null;
  
  try {
    return canvas!.getContext('2d');
  } catch (error) {
    console.error('Failed to get canvas context:', error);
    return null;
  }
}

/**
 * Validate coordinate bounds
 * Ensures x,y coordinates are within canvas bounds
 */
export function safeCoords(
  x: number,
  y: number,
  width: number,
  height: number,
  margin = 0
): { x: number; y: number } {
  return {
    x: safeNumber(x, 0, margin, width - margin),
    y: safeNumber(y, 0, margin, height - margin),
  };
}

/**
 * Validate and clamp opacity value
 */
export function safeOpacity(value: any): number {
  return safeNumber(value, 1, 0, 1);
}

/**
 * Validate and clamp confidence/percentage value (0-100)
 */
export function safePercentage(value: any): number {
  return safeNumber(value, 0, 0, 100);
}

/**
 * Validate string value
 */
export function safeString(value: any, fallback = ''): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
}

/**
 * Create a safe error boundary wrapper for render functions
 */
export function safeRender<T>(
  renderFn: () => T,
  fallback: T,
  errorLabel = 'Render'
): T {
  try {
    return renderFn();
  } catch (error) {
    console.error(`${errorLabel} error:`, error);
    return fallback;
  }
}

/**
 * Validate chart data point
 */
export interface ChartDataPoint {
  [key: string]: any;
}

export function safeChartData(data: any[]): ChartDataPoint[] {
  if (!Array.isArray(data)) return [];
  
  return data.map(point => {
    if (typeof point !== 'object' || point === null) {
      return {};
    }
    
    // Sanitize numeric values in data points
    const sanitized: ChartDataPoint = {};
    for (const [key, value] of Object.entries(point)) {
      if (typeof value === 'number') {
        sanitized[key] = safeNumber(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  });
}

/**
 * Valid time window values
 */
export const VALID_TIME_WINDOWS = ['1d', '7d', '14d', '30d', '60d', '90d', '180d', '365d', 'all'] as const;
export type TimeWindow = typeof VALID_TIME_WINDOWS[number];

/**
 * Validate and normalize time window value
 */
export function safeTimeWindow(value: any, fallback: TimeWindow = '30d'): TimeWindow {
  if (VALID_TIME_WINDOWS.includes(value)) return value as TimeWindow;
  return fallback;
}

/**
 * Validate and clamp risk/confidence score (0-1)
 */
export function safeScore(value: any): number {
  return safeNumber(value, 0.5, 0, 1);
}

/**
 * Create safe gradient colors for canvas
 */
export function createSafeGradient(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  colors: Array<{ stop: number; color: string }>,
  fallbackColor = '#6B7280'
): CanvasGradient | string {
  try {
    const gradient = ctx.createLinearGradient(
      safeNumber(x0),
      safeNumber(y0),
      safeNumber(x1),
      safeNumber(y1)
    );
    
    colors.forEach(({ stop, color }) => {
      gradient.addColorStop(
        safeNumber(stop, 0, 0, 1),
        safeColor(color, fallbackColor)
      );
    });
    
    return gradient;
  } catch (error) {
    console.error('Failed to create gradient:', error);
    return fallbackColor;
  }
}

export default {
  safeColor,
  addColorOpacity,
  safeNumber,
  safeArray,
  isCanvasReady,
  getSafeCanvasContext,
  safeCoords,
  safeOpacity,
  safePercentage,
  safeString,
  safeRender,
  safeChartData,
  safeTimeWindow,
  safeScore,
  createSafeGradient,
};
