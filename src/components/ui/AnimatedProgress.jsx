import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

/**
 * AnimatedProgress - Reusable animated progress bar
 * Eliminates duplication across Dashboard, Analytics, and campaign pages
 */
export const AnimatedProgress = ({
  value,
  color = 'cyan',
  label,
  showPercentage = true,
  height = 'sm',
  animated = true,
  className = '',
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!animated) {
      setProgress(value);
      return;
    }
    const timer = setTimeout(() => setProgress(value), 100);
    return () => clearTimeout(timer);
  }, [value, animated]);

  const colorClasses = {
    cyan: 'from-cyan-400 to-cyan-600',
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600',
    pink: 'from-pink-400 to-pink-600',
    yellow: 'from-yellow-400 to-yellow-600',
    orange: 'from-orange-400 to-orange-600',
    red: 'from-red-400 to-red-600',
  };

  const heightClasses = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <div className="text-xs text-gray-600 dark:text-gray-400 flex justify-between">
          <span>{label}</span>
          {showPercentage && <span className="font-bold">{value}%</span>}
        </div>
      )}
      <div
        className={cn(
          'bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
          heightClasses[height]
        )}
      >
        <div
          className={cn(
            'h-full bg-gradient-to-r rounded-full relative',
            colorClasses[color] || colorClasses.cyan,
            animated && 'transition-all duration-1000 ease-out'
          )}
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedProgress;
