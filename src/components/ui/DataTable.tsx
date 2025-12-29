/**
 * DataTable Component
 * Compound component pattern for flexible, accessible data tables
 */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '../../lib/utils';
import { ChevronUp, ChevronDown, Check, Minus } from 'lucide-react';

// ============================================
// Types
// ============================================

type SortDirection = 'asc' | 'desc' | null;

interface DataTableContextValue<T extends { id: string }> {
  data: T[];
  selectedRows: Set<string>;
  toggleRow: (id: string) => void;
  toggleAll: () => void;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  sortColumn: string | null;
  sortDirection: SortDirection;
  setSort: (column: string) => void;
  getRowById: (id: string) => T | undefined;
}

const DataTableContext = createContext<DataTableContextValue<any> | null>(null);

function useDataTable<T extends { id: string }>() {
  const context = useContext(DataTableContext) as DataTableContextValue<T> | null;
  if (!context) {
    throw new Error('DataTable components must be used within DataTable');
  }
  return context;
}

// ============================================
// Root Component
// ============================================

interface DataTableProps<T extends { id: string }> {
  data: T[];
  children: React.ReactNode;
  className?: string;
  onSelectionChange?: (selectedIds: string[]) => void;
  defaultSortColumn?: string | null;
  defaultSortDirection?: SortDirection;
}

export function DataTable<T extends { id: string }>({
  data,
  children,
  className,
  onSelectionChange,
  defaultSortColumn = null,
  defaultSortDirection = null,
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sortColumn, setSortColumn] = useState<string | null>(defaultSortColumn ?? null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection ?? null);

  const toggleRow = useCallback(
    (id: string) => {
      setSelectedRows(prev => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        onSelectionChange?.(Array.from(next));
        return next;
      });
    },
    [onSelectionChange]
  );

  const toggleAll = useCallback(() => {
    setSelectedRows(prev => {
      const next = prev.size === data.length ? new Set<string>() : new Set(data.map(d => d.id));
      onSelectionChange?.(Array.from(next));
      return next;
    });
  }, [data, onSelectionChange]);

  const setSort = useCallback((column: string) => {
    setSortColumn(prevColumn => {
      if (prevColumn === column) {
        setSortDirection(prevDir => {
          if (prevDir === 'asc') return 'desc';
          if (prevDir === 'desc') return null;
          return 'asc';
        });
        return column;
      }
      setSortDirection('asc');
      return column;
    });
  }, []);

  const getRowById = useCallback((id: string) => data.find(d => d.id === id), [data]);

  const isAllSelected = data.length > 0 && selectedRows.size === data.length;
  const isPartiallySelected = selectedRows.size > 0 && selectedRows.size < data.length;

  const value: DataTableContextValue<T> = {
    data,
    selectedRows,
    toggleRow,
    toggleAll,
    isAllSelected,
    isPartiallySelected,
    sortColumn,
    sortDirection,
    setSort,
    getRowById,
  };

  return (
    <DataTableContext.Provider value={value}>
      <div className={cn('w-full overflow-auto', className)}>
        <table className="w-full caption-bottom text-sm">{children}</table>
      </div>
    </DataTableContext.Provider>
  );
}

// ============================================
// Header Component
// ============================================

interface DataTableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

DataTable.Header = function DataTableHeader({ children, className }: DataTableHeaderProps) {
  return (
    <thead className={cn('[&_tr]:border-b', className)}>
      <tr className="border-b transition-colors hover:bg-muted/50">{children}</tr>
    </thead>
  );
};

// ============================================
// Header Cell Component
// ============================================

interface DataTableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
  sortKey?: string;
  align?: 'left' | 'center' | 'right';
}

DataTable.HeaderCell = function DataTableHeaderCell({
  children,
  className,
  sortKey,
  align = 'left',
}: DataTableHeaderCellProps) {
  const { sortColumn, sortDirection, setSort } = useDataTable();

  const isSorted = sortKey && sortColumn === sortKey;
  const canSort = !!sortKey;

  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  return (
    <th
      className={cn(
        'h-12 px-4 align-middle font-medium text-muted-foreground',
        alignClass,
        canSort && 'cursor-pointer select-none hover:text-foreground',
        className
      )}
      onClick={() => canSort && setSort(sortKey)}
    >
      <div className={cn('flex items-center gap-1', align === 'right' && 'justify-end')}>
        {children}
        {canSort && (
          <span className="ml-1">
            {isSorted ? (
              sortDirection === 'asc' ? (
                <ChevronUp className="h-4 w-4" />
              ) : sortDirection === 'desc' ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <span className="h-4 w-4" />
              )
            ) : (
              <span className="h-4 w-4 opacity-0 group-hover:opacity-50">
                <ChevronUp className="h-4 w-4" />
              </span>
            )}
          </span>
        )}
      </div>
    </th>
  );
};

// ============================================
// Select All Checkbox
// ============================================

DataTable.SelectAll = function DataTableSelectAll({ className }: { className?: string }) {
  const { isAllSelected, isPartiallySelected, toggleAll } = useDataTable();

  return (
    <th className={cn('h-12 w-12 px-4 align-middle', className)}>
      <button
        type="button"
        role="checkbox"
        aria-checked={isPartiallySelected ? 'mixed' : isAllSelected}
        onClick={toggleAll}
        className={cn(
          'flex h-4 w-4 items-center justify-center rounded border',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          isAllSelected || isPartiallySelected
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-input'
        )}
      >
        {isAllSelected && <Check className="h-3 w-3" />}
        {isPartiallySelected && <Minus className="h-3 w-3" />}
      </button>
    </th>
  );
};

// ============================================
// Body Component
// ============================================

interface DataTableBodyProps<T extends { id: string }> {
  children: (item: T, index: number) => React.ReactNode;
  className?: string;
  emptyState?: React.ReactNode;
}

DataTable.Body = function DataTableBody<T extends { id: string }>({
  children,
  className,
  emptyState,
}: DataTableBodyProps<T>) {
  const { data } = useDataTable<T>();

  if (data.length === 0 && emptyState) {
    return (
      <tbody className={className}>
        <tr>
          <td colSpan={100} className="h-24 text-center">
            {emptyState}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className={cn('[&_tr:last-child]:border-0', className)}>{data.map(children)}</tbody>
  );
};

// ============================================
// Row Component
// ============================================

interface DataTableRowProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

DataTable.Row = function DataTableRow({ id, children, className, onClick }: DataTableRowProps) {
  const { selectedRows } = useDataTable();
  const isSelected = selectedRows.has(id);

  return (
    <tr
      className={cn(
        'border-b transition-colors hover:bg-muted/50',
        isSelected && 'bg-muted',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      data-state={isSelected ? 'selected' : undefined}
    >
      {children}
    </tr>
  );
};

// ============================================
// Cell Component
// ============================================

interface DataTableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

DataTable.Cell = function DataTableCell({
  children,
  className,
  align = 'left',
}: DataTableCellProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  return <td className={cn('p-4 align-middle', alignClass, className)}>{children}</td>;
};

// ============================================
// Row Checkbox
// ============================================

DataTable.RowCheckbox = function DataTableRowCheckbox({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const { selectedRows, toggleRow } = useDataTable();
  const isSelected = selectedRows.has(id);

  return (
    <td className={cn('w-12 px-4 align-middle', className)}>
      <button
        type="button"
        role="checkbox"
        aria-checked={isSelected}
        onClick={e => {
          e.stopPropagation();
          toggleRow(id);
        }}
        className={cn(
          'flex h-4 w-4 items-center justify-center rounded border',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-input'
        )}
      >
        {isSelected && <Check className="h-3 w-3" />}
      </button>
    </td>
  );
};

// ============================================
// Pagination Component
// ============================================

interface DataTablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

DataTable.Pagination = function DataTablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className,
}: DataTablePaginationProps) {
  const { selectedRows } = useDataTable();
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className={cn('flex items-center justify-between px-2 py-4', className)}>
      <div className="flex-1 text-sm text-muted-foreground">
        {selectedRows.size > 0 ? (
          <span>
            {selectedRows.size} of {total} row(s) selected
          </span>
        ) : (
          <span>
            Showing {start} to {end} of {total} results
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <select
              value={pageSize}
              onChange={e => onPageSizeChange(Number(e.target.value))}
              className="h-8 rounded-md border border-input bg-background px-2 text-sm"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            className="h-8 w-8 rounded border border-input disabled:opacity-50"
          >
            ⟨⟨
          </button>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="h-8 w-8 rounded border border-input disabled:opacity-50"
          >
            ⟨
          </button>
          <span className="px-3 text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="h-8 w-8 rounded border border-input disabled:opacity-50"
          >
            ⟩
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
            className="h-8 w-8 rounded border border-input disabled:opacity-50"
          >
            ⟩⟩
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
