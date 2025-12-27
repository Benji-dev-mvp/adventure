import { cn } from "@/lib/utils"

// Base Skeleton component with multiple variants
function Skeleton({
  className,
  variant = 'default',
  ...props
}) {
  const variantClasses = {
    default: 'h-4 w-full',
    text: 'h-4 w-3/4',
    title: 'h-8 w-1/2',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24',
    card: 'h-32 w-full',
  };

  return (
    <div 
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700", 
        variantClasses[variant],
        className
      )} 
      {...props} 
    />
  );
}

// SkeletonGroup - renders multiple skeletons
function SkeletonGroup({ count = 3, className, children, ...props }) {
  if (children) {
    return (
      <div className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} />
      ))}
    </div>
  );
}

// SkeletonCard - pre-built card skeleton
function SkeletonCard({ className, ...props }) {
  return (
    <div className={cn("p-4 border rounded-lg space-y-3 bg-white dark:bg-gray-800", className)} {...props}>
      <Skeleton variant="title" />
      <Skeleton variant="text" />
      <Skeleton variant="text" className="w-1/2" />
      <div className="flex gap-2 pt-2">
        <Skeleton variant="button" />
        <Skeleton variant="button" />
      </div>
    </div>
  );
}

// SkeletonTable - table skeleton with configurable rows/columns
function SkeletonTable({ rows = 5, columns = 4, className, ...props }) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {/* Header row */}
      <div className="flex gap-4 pb-2 border-b">
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 flex-1" />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4">
          {Array.from({ length: columns }, (_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// SkeletonList - list with avatar and text
function SkeletonList({ items = 5, className, ...props }) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {Array.from({ length: items }, (_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// SkeletonDashboard - complete dashboard skeleton
function SkeletonDashboard({ className, ...props }) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Stats cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={`stat-${i}`} className="p-4 border rounded-lg space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-3/4" />
          </div>
        ))}
      </div>
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
      {/* Table section */}
      <SkeletonTable rows={5} columns={5} />
    </div>
  );
}

export { 
  Skeleton, 
  SkeletonGroup, 
  SkeletonCard, 
  SkeletonTable, 
  SkeletonList, 
  SkeletonDashboard 
}
