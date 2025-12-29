import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  measurePerformance,
  getPerformanceMetrics,
  clearPerformanceMetrics,
  debounce,
  throttle,
  isRunningSlowly,
  getPerformanceSummary,
} from '../lib/performance';

describe('Performance Utilities', () => {
  beforeEach(() => {
    clearPerformanceMetrics();
    sessionStorage.clear();
  });

  afterEach(() => {
    clearPerformanceMetrics();
  });

  describe('measurePerformance', () => {
    it('should measure function execution time', async () => {
      const testFn = async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'result';
      };

      const result = await measurePerformance('test-operation', testFn);
      expect(result).toBe('result');

      const metrics = getPerformanceMetrics();
      expect(metrics['test-operation']).toBeDefined();
      expect(metrics['test-operation'].count).toBe(1);
      expect(metrics['test-operation'].avg).toBeGreaterThan(0);
    });

    it('should track multiple measurements', async () => {
      const testFn = async () => 'result';

      await measurePerformance('test-op', testFn);
      await measurePerformance('test-op', testFn);
      await measurePerformance('test-op', testFn);

      const metrics = getPerformanceMetrics();
      expect(metrics['test-op'].count).toBe(3);
    });

    it('should handle errors and still track timing', async () => {
      const errorFn = async () => {
        throw new Error('Test error');
      };

      await expect(measurePerformance('error-op', errorFn)).rejects.toThrow('Test error');
    });
  });

  describe('getPerformanceMetrics', () => {
    it('should return empty object when no metrics', () => {
      const metrics = getPerformanceMetrics();
      expect(metrics).toEqual({});
    });

    it('should return tracked metrics', async () => {
      await measurePerformance('test', async () => 'done');
      const metrics = getPerformanceMetrics();
      expect(Object.keys(metrics)).toContain('test');
    });
  });

  describe('clearPerformanceMetrics', () => {
    it('should clear all metrics', async () => {
      await measurePerformance('test', async () => 'done');
      clearPerformanceMetrics();
      const metrics = getPerformanceMetrics();
      expect(metrics).toEqual({});
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(fn).not.toHaveBeenCalled();

      await new Promise(resolve => setTimeout(resolve, 150));
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to debounced function', async () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn('arg1', 'arg2');

      await new Promise(resolve => setTimeout(resolve, 150));
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(fn).toHaveBeenCalledTimes(1);

      await new Promise(resolve => setTimeout(resolve, 150));
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('isRunningSlowly', () => {
    it('should return false when no slow operations', () => {
      expect(isRunningSlowly()).toBe(false);
    });

    it('should return true when multiple slow operations', () => {
      // Create metrics with multiple slow operations directly
      const metrics = {
        'slow-op-1': { count: 1, total: 1200, min: 1200, max: 1200, avg: 1200 },
        'slow-op-2': { count: 1, total: 1300, min: 1300, max: 1300, avg: 1300 },
        'slow-op-3': { count: 1, total: 1400, min: 1400, max: 1400, avg: 1400 },
        'slow-op-4': { count: 1, total: 1500, min: 1500, max: 1500, avg: 1500 },
      };

      sessionStorage.setItem('artisan_perf_metrics', JSON.stringify(metrics));
      expect(isRunningSlowly()).toBe(true);
    });
  });

  describe('getPerformanceSummary', () => {
    it('should return performance summary', async () => {
      const fastFn = async () => 'fast';
      const slowFn = async () => {
        await new Promise(resolve => setTimeout(resolve, 5));
        return 'slow';
      };

      await measurePerformance('fast-op', fastFn);
      await measurePerformance('slow-op', slowFn);

      const summary = getPerformanceSummary();
      expect(summary).toHaveProperty('totalOperations');
      expect(summary).toHaveProperty('slowOperations');
      expect(summary).toHaveProperty('topOperations');
      expect(summary.totalOperations).toBeGreaterThan(0);
    });
  });
});
