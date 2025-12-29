import React, { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Download,
  MoreVertical,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';

/**
 * Responsive Data Table with mobile card view
 */

export const DataTable = ({
  columns = [],
  data = [],
  searchable = true,
  filterable = false,
  exportable = false,
  pagination = true,
  pageSize = 10,
  mobileCardView = true,
  onRowClick,
  actions,
  className,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState([]);

  // Filter and search data
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(row =>
      columns.some(col =>
        String(row[col.accessor]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  const handleSort = key => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleExport = () => {
    const csv = [
      columns.map(col => col.label).join(','),
      ...sortedData.map(row => columns.map(col => row[col.accessor]).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-export.csv';
    a.click();
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Search */}
        {searchable && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={cn(
                'w-full pl-10 pr-4 py-2',
                'border border-gray-300 dark:border-gray-600',
                'rounded-lg',
                'bg-white dark:bg-gray-800',
                'text-gray-900 dark:text-white',
                'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'placeholder:text-gray-400'
              )}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {filterable && (
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
              <Filter size={18} />
              <span className="hidden sm:inline">Filter</span>
            </button>
          )}
          {exportable && (
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  onClick={() => column.sortable && handleSort(column.accessor)}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                    column.sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <ArrowUpDown
                        size={14}
                        className={cn(sortConfig.key === column.accessor && 'text-blue-500')}
                      />
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="px-6 py-3"></th>}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                  >
                    {column.render
                      ? column.render(row[column.accessor], row)
                      : row[column.accessor]}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end gap-2">{actions(row)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      {mobileCardView && (
        <div className="md:hidden space-y-4">
          {paginatedData.map((row, index) => (
            <div
              key={index}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'bg-white dark:bg-gray-800',
                'border border-gray-200 dark:border-gray-700',
                'rounded-lg p-4',
                'space-y-3',
                onRowClick && 'cursor-pointer active:scale-98'
              )}
            >
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="flex justify-between items-start">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {column.label}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white text-right">
                    {column.render
                      ? column.render(row[column.accessor], row)
                      : row[column.accessor]}
                  </span>
                </div>
              ))}
              {actions && (
                <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  {actions(row)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={cn(
                'p-2 rounded-lg border',
                currentPage === 1
                  ? 'border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              )}
            >
              <ChevronLeft size={18} />
            </button>

            {/* Page Numbers */}
            <div className="hidden sm:flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  if (totalPages <= 7) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                  return false;
                })
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 py-1">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        'px-3 py-1 rounded-lg',
                        page === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      )}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
            </div>

            {/* Mobile page indicator */}
            <div className="sm:hidden text-sm text-gray-600 dark:text-gray-400">
              {currentPage} / {totalPages}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={cn(
                'p-2 rounded-lg border',
                currentPage === totalPages
                  ? 'border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              )}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Quick Action Buttons for Table Rows
export const TableActions = ({ onView, onEdit, onDelete }) => {
  return (
    <div className="flex items-center gap-1">
      {onView && (
        <button
          onClick={e => {
            e.stopPropagation();
            onView();
          }}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          title="View"
        >
          <Eye size={16} className="text-gray-600 dark:text-gray-400" />
        </button>
      )}
      {onEdit && (
        <button
          onClick={e => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          title="Edit"
        >
          <Edit size={16} className="text-blue-600 dark:text-blue-400" />
        </button>
      )}
      {onDelete && (
        <button
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          title="Delete"
        >
          <Trash2 size={16} className="text-red-600 dark:text-red-400" />
        </button>
      )}
    </div>
  );
};
