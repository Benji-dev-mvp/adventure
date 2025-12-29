/**
 * LoadingSkeleton Component
 * 
 * Consistent loading states for content
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  type?: 'card' | 'table' | 'list' | 'chart';
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'card',
  count = 1,
  className,
}) => {
  const skeletons = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
        {skeletons.map((_, idx) => (
          <div
            key={idx}
            className="h-32 bg-slate-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={cn('space-y-2', className)}>
        {skeletons.map((_, idx) => (
          <div
            key={idx}
            className="h-12 bg-slate-800 rounded animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className={cn('space-y-3', className)}>
        {skeletons.map((_, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-800 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-800 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-slate-800 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={cn('h-64 bg-slate-800 rounded-lg animate-pulse', className)} />
    );
  }

  return null;
};

export default LoadingSkeleton;
