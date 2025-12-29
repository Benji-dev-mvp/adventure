/**
 * VirtualizedList Component
 * High-performance list rendering using @tanstack/react-virtual
 */
import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '../../lib/utils';

interface VirtualizedListProps<T> {
  /** Array of items to render */
  items: T[];
  /** Height of the container */
  height?: number | string;
  /** Estimated size of each item in pixels */
  estimateSize?: number;
  /** Number of items to render above/below the visible area */
  overscan?: number;
  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Key extractor function */
  getItemKey?: (item: T, index: number) => string | number;
  /** Additional class names for the container */
  className?: string;
  /** Empty state content */
  emptyState?: React.ReactNode;
  /** Loading state */
  isLoading?: boolean;
  /** Loading placeholder */
  loadingPlaceholder?: React.ReactNode;
  /** Gap between items in pixels */
  gap?: number;
}

export function VirtualizedList<T>({
  items,
  height = 600,
  estimateSize = 60,
  overscan = 5,
  renderItem,
  getItemKey,
  className,
  emptyState,
  isLoading,
  loadingPlaceholder,
  gap = 0,
}: VirtualizedListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize + gap,
    overscan,
    getItemKey: getItemKey
      ? (index) => getItemKey(items[index], index)
      : undefined,
  });

  const virtualItems = virtualizer.getVirtualItems();

  if (isLoading) {
    return (
      <div
        className={cn('flex items-center justify-center', className)}
        style={{ height }}
      >
        {loadingPlaceholder || (
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        )}
      </div>
    );
  }

  if (items.length === 0 && emptyState) {
    return (
      <div
        className={cn('flex items-center justify-center', className)}
        style={{ height }}
      >
        {emptyState}
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className={cn('overflow-auto', className)}
      style={{ height }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualRow) => (
          <div
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
              paddingBottom: gap,
            }}
          >
            {renderItem(items[virtualRow.index], virtualRow.index)}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * VirtualizedGrid Component
 * High-performance grid rendering
 */
interface VirtualizedGridProps<T> {
  items: T[];
  height?: number | string;
  columns: number;
  rowHeight?: number;
  overscan?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  getItemKey?: (item: T, index: number) => string | number;
  className?: string;
  emptyState?: React.ReactNode;
  gap?: number;
}

export function VirtualizedGrid<T>({
  items,
  height = 600,
  columns,
  rowHeight = 200,
  overscan = 2,
  renderItem,
  getItemKey,
  className,
  emptyState,
  gap = 16,
}: VirtualizedGridProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowCount = Math.ceil(items.length / columns);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight + gap,
    overscan,
  });

  const virtualRows = virtualizer.getVirtualItems();

  if (items.length === 0 && emptyState) {
    return (
      <div
        className={cn('flex items-center justify-center', className)}
        style={{ height }}
      >
        {emptyState}
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className={cn('overflow-auto', className)}
      style={{ height }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualRows.map((virtualRow) => {
          const startIndex = virtualRow.index * columns;
          const endIndex = Math.min(startIndex + columns, items.length);
          const rowItems = items.slice(startIndex, endIndex);

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${rowHeight}px`,
                transform: `translateY(${virtualRow.start}px)`,
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: `${gap}px`,
              }}
            >
              {rowItems.map((item, i) => (
                <div key={getItemKey ? getItemKey(item, startIndex + i) : startIndex + i}>
                  {renderItem(item, startIndex + i)}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Hook for infinite scroll with virtualization
 */
interface UseInfiniteVirtualListOptions<T> {
  items: T[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  estimateSize?: number;
  overscan?: number;
}

export function useInfiniteVirtualList<T>({
  items,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  estimateSize = 60,
  overscan = 5,
}: UseInfiniteVirtualListOptions<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: hasNextPage ? items.length + 1 : items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Check if we need to fetch more
  const lastItem = virtualItems[virtualItems.length - 1];
  const shouldFetch =
    lastItem &&
    lastItem.index >= items.length - 1 &&
    hasNextPage &&
    !isFetchingNextPage;

  // Fetch more when we reach the end
  React.useEffect(() => {
    if (shouldFetch) {
      fetchNextPage();
    }
  }, [shouldFetch, fetchNextPage]);

  return {
    parentRef,
    virtualizer,
    virtualItems,
    isLoadingMore: isFetchingNextPage,
  };
}

export default VirtualizedList;
