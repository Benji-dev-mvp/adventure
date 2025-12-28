/**
 * VirtualList Component
 * Virtualized list for rendering large datasets efficiently
 * Uses @tanstack/react-virtual for windowing
 */
import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

/**
 * VirtualList - Renders only visible items for performance
 * 
 * @param {Object} props
 * @param {Array} props.items - Array of items to render
 * @param {Function} props.renderItem - Function to render each item (item, index) => ReactNode
 * @param {number} props.estimateSize - Estimated size of each item in pixels (default: 50)
 * @param {number} props.overscan - Number of items to render outside visible area (default: 5)
 * @param {string} props.className - Additional CSS classes
 * @param {React.RefObject} props.parentRef - Ref to the scrollable parent element
 */
export const VirtualList = ({
  items = [],
  renderItem,
  estimateSize = 50,
  overscan = 5,
  className = '',
  parentRef,
}) => {
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef?.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      style={{
        height: `${virtualizer.getTotalSize()}px`,
        width: '100%',
        position: 'relative',
      }}
    >
      {virtualItems.map((virtualItem) => (
        <div
          key={virtualItem.key}
          data-index={virtualItem.index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${virtualItem.size}px`,
            transform: `translateY(${virtualItem.start}px)`,
          }}
        >
          {renderItem(items[virtualItem.index], virtualItem.index)}
        </div>
      ))}
    </div>
  );
};

/**
 * VirtualGrid Component
 * Virtualized grid for rendering large datasets in a grid layout
 */
export const VirtualGrid = ({
  items = [],
  renderItem,
  columns = 3,
  rowHeight = 200,
  gap = 16,
  overscan = 3,
  className = '',
  parentRef,
}) => {
  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(items.length / columns),
    getScrollElement: () => parentRef?.current,
    estimateSize: () => rowHeight,
    overscan,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <div
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
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
            data-index={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: `${gap}px`,
            }}
          >
            {rowItems.map((item, colIndex) =>
              renderItem(item, startIndex + colIndex)
            )}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Hook for using virtual scrolling with a ref
 */
export const useVirtualScroll = ({
  count,
  estimateSize = 50,
  overscan = 5,
  parentRef,
}) => {
  return useVirtualizer({
    count,
    getScrollElement: () => parentRef?.current,
    estimateSize: () => estimateSize,
    overscan,
  });
};

export default VirtualList;
