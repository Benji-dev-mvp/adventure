import React from 'react';
import { cn } from '../../lib/utils';

/**
 * LiveIndicator - Reusable live status indicator
 * Used across Dashboard, real-time features, and monitoring pages
 */
export const LiveIndicator = ({ label = 'LIVE', color = 'red', size = 'sm', className = '' }) => {
  const sizeClasses = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  const colorClasses = {
    red: 'bg-red-500 border-red-500/30',
    green: 'bg-green-500 border-green-500/30',
    blue: 'bg-blue-500 border-blue-500/30',
    yellow: 'bg-yellow-500 border-yellow-500/30',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full border',
        colorClasses[color],
        className
      )}
    >
      <span
        className="relative flex"
        style={{
          height: sizeClasses[size].split(' ')[0].split('-')[1],
          width: sizeClasses[size].split(' ')[1].split('-')[1],
        }}
      >
        <span
          className={cn(
            'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
            `bg-${color}-400`
          )}
        ></span>
        <span
          className={cn('relative inline-flex rounded-full', sizeClasses[size], `bg-${color}-500`)}
        ></span>
      </span>
      <span className={cn('text-xs font-bold tracking-wider', `text-${color}-500`)}>{label}</span>
    </div>
  );
};

export default LiveIndicator;
