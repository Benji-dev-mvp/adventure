import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

function Skeleton({ className, variant, ...props }) {
  const variantClasses = {
    default: '',
    text: 'h-4 w-3/4',
    title: 'h-8 w-1/2',
    avatar: 'h-12 w-12 rounded-full',
  };

  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
        variantClasses[variant] || variantClasses.default,
        className
      )}
      {...props}
    />
  );
}

function SkeletonGroup({ count = 1, className, children, ...props }) {
  if (count === 1 && children) {
    return (
      <div className={cn('space-y-2', className)} {...props}>
        {children}
      </div>
    );
  }
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}

function SkeletonCard({ className, ...props }) {
  return (
    <div className={cn('p-4 border rounded-lg space-y-4', className)} {...props}>
      <Skeleton variant="title" />
      <Skeleton variant="text" />
      <Skeleton variant="text" className="w-1/2" />
      <Skeleton variant="text" className="w-2/3" />
    </div>
  );
}

function SkeletonTable({ rows = 5, columns = 4, className, ...props }) {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      {/* Header row */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-6 flex-1" />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`${rowIndex}-${colIndex}`} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

function SkeletonList({ items = 5, className, ...props }) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" />
            <Skeleton variant="text" className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonDashboard({ className, ...props }) {
  return (
    <div className={cn('space-y-6', className)} {...props}>
      {/* Stats cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      {/* Chart placeholder */}
      <Skeleton className="h-64 w-full" />
      {/* Table placeholder */}
      <SkeletonTable rows={5} columns={4} />
    </div>
  );
}

Skeleton.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'text', 'title', 'avatar']),
};

SkeletonGroup.propTypes = {
  count: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node,
};

SkeletonCard.propTypes = {
  className: PropTypes.string,
};

SkeletonTable.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number,
  className: PropTypes.string,
};

SkeletonList.propTypes = {
  items: PropTypes.number,
  className: PropTypes.string,
};

SkeletonDashboard.propTypes = {
  className: PropTypes.string,
};

export { Skeleton, SkeletonGroup, SkeletonCard, SkeletonTable, SkeletonList, SkeletonDashboard };
