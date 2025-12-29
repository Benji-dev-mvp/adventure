/**
 * Performance monitoring utilities for Artisan
 * Tracks key performance metrics and user experience
 */

/**
 * Measure and log performance metrics for a function
 * @param {string} label - Name of the operation being measured
 * @param {Function} fn - Function to measure
 * @returns {*} Result of the function
 */
export const measurePerformance = async (label, fn) => {
  const startTime = performance.now();

  try {
    const result = await fn();
    const endTime = performance.now();
    const duration = endTime - startTime;

    // Log slow operations (>1000ms)
    if (duration > 1000) {
      console.warn(`[Performance] Slow operation: ${label} took ${duration.toFixed(2)}ms`);
    } else if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${label} took ${duration.toFixed(2)}ms`);
    }

    // Store performance metrics
    trackPerformanceMetric(label, duration);

    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.error(`[Performance] ${label} failed after ${duration.toFixed(2)}ms`, error);
    throw error;
  }
};

/**
 * Track performance metric in session storage
 */
const trackPerformanceMetric = (label, duration) => {
  try {
    const metrics = JSON.parse(sessionStorage.getItem('artisan_perf_metrics') || '{}');

    if (!metrics[label]) {
      metrics[label] = {
        count: 0,
        total: 0,
        min: Infinity,
        max: 0,
        avg: 0,
      };
    }

    const metric = metrics[label];
    metric.count++;
    metric.total += duration;
    metric.min = Math.min(metric.min, duration);
    metric.max = Math.max(metric.max, duration);
    metric.avg = metric.total / metric.count;

    // Keep only last 100 unique metrics
    const keys = Object.keys(metrics);
    if (keys.length > 100) {
      delete metrics[keys[0]];
    }

    sessionStorage.setItem('artisan_perf_metrics', JSON.stringify(metrics));
  } catch (e) {
    // Fail silently - don't break app for perf tracking
  }
};

/**
 * Get performance metrics summary
 * @returns {Object} Performance metrics
 */
export const getPerformanceMetrics = () => {
  try {
    return JSON.parse(sessionStorage.getItem('artisan_perf_metrics') || '{}');
  } catch {
    return {};
  }
};

/**
 * Clear performance metrics
 */
export const clearPerformanceMetrics = () => {
  try {
    sessionStorage.removeItem('artisan_perf_metrics');
  } catch {
    // Fail silently
  }
};

/**
 * Log Web Vitals (Core Web Vitals)
 */
export const reportWebVitals = metric => {
  const { name, value, id } = metric;

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vital] ${name}:`, value, 'id:', id);
  }

  // Store for analytics
  try {
    const vitals = JSON.parse(sessionStorage.getItem('artisan_web_vitals') || '[]');
    vitals.push({
      name,
      value,
      id,
      timestamp: Date.now(),
    });

    // Keep only last 50 vitals
    sessionStorage.setItem('artisan_web_vitals', JSON.stringify(vitals.slice(-50)));
  } catch {
    // Fail silently
  }

  // Send to analytics endpoint (future)
  // fetch('/api/analytics/vitals', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(metric),
  // }).catch(() => {});
};

/**
 * Custom hook for measuring component render time
 */
export const usePerformance = componentName => {
  if (process.env.NODE_ENV === 'development') {
    const renderStart = performance.now();

    return () => {
      const renderEnd = performance.now();
      const duration = renderEnd - renderStart;

      if (duration > 100) {
        console.warn(`[Performance] ${componentName} render took ${duration.toFixed(2)}ms`);
      }
    };
  }

  return () => {}; // No-op in production
};

/**
 * Debounce function for performance optimization
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Check if the app is running slow
 * Returns true if performance metrics indicate slowness
 */
export const isRunningSlowly = () => {
  const metrics = getPerformanceMetrics();
  const slowOperations = Object.values(metrics).filter(m => m.avg > 1000);
  return slowOperations.length > 3;
};

/**
 * Get performance summary for debugging
 */
export const getPerformanceSummary = () => {
  const metrics = getPerformanceMetrics();

  return {
    totalOperations: Object.values(metrics).reduce((sum, m) => sum + m.count, 0),
    slowOperations: Object.entries(metrics)
      .filter(([, m]) => m.avg > 1000)
      .map(([label, m]) => ({ label, avg: m.avg.toFixed(2) })),
    topOperations: Object.entries(metrics)
      .sort(([, a], [, b]) => b.avg - a.avg)
      .slice(0, 5)
      .map(([label, m]) => ({
        label,
        avg: m.avg.toFixed(2),
        count: m.count,
      })),
  };
};

export default {
  measurePerformance,
  getPerformanceMetrics,
  clearPerformanceMetrics,
  reportWebVitals,
  usePerformance,
  debounce,
  throttle,
  isRunningSlowly,
  getPerformanceSummary,
};
