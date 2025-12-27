import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Skeleton component for loading states
 * Provides shimmer animation for better perceived performance
 */
export const Skeleton = ({ className, variant = 'default', ...props }) => {
  const variants = {
    default: 'h-4 w-full',
    text: 'h-4 w-3/4',
    title: 'h-8 w-1/2',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24',
    card: 'h-32 w-full',
    circle: 'rounded-full',
    rect: 'rounded-lg',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

/**
 * Skeleton group for multiple skeletons
 */
export const SkeletonGroup = ({ children, className, count = 1 }) => {
  if (count > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  return <div className={cn('space-y-2', className)}>{children}</div>;
};

/**
 * Pre-built skeleton layouts for common use cases
 */
export const SkeletonCard = ({ className }) => (
  <div className={cn('p-4 border rounded-lg space-y-3', className)}>
    <Skeleton variant="title" />
    <Skeleton variant="text" />
    <Skeleton variant="text" className="w-1/2" />
    <div className="flex gap-2 mt-4">
      <Skeleton variant="button" />
      <Skeleton variant="button" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4, className }) => (
  <div className={cn('space-y-3', className)}>
    <div className="flex gap-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-6 flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        {Array.from({ length: columns }).map((_, j) => (
          <Skeleton key={j} className="h-8 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonList = ({ items = 5, className }) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonDashboard = ({ className }) => (
  <div className={cn('space-y-6', className)}>
    {/* Stats cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-4 border rounded-lg space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </div>

    {/* Chart */}
    <div className="border rounded-lg p-4">
      <Skeleton variant="title" className="mb-4" />
      <Skeleton className="h-64 w-full" />
    </div>

    {/* Table */}
    <div className="border rounded-lg p-4">
      <Skeleton variant="title" className="mb-4" />
      <SkeletonTable rows={5} columns={4} />
    </div>
  </div>
);

export default Skeleton;
