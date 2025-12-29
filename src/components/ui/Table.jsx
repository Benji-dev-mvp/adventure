import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

const Table = ({ children, className, ...props }) => {
  return (
    <div className="w-full overflow-auto rounded-[var(--radius-lg)] border border-gray-200 dark:border-gray-700">
      <table className={cn('w-full text-[var(--font-sm)]', className)} {...props}>
        {children}
      </table>
    </div>
  );
};

const TableHeader = ({ children, className, ...props }) => {
  return (
    <thead
      className={cn(
        'bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
};

const TableBody = ({ children, className, ...props }) => {
  return (
    <tbody
      className={cn(
        'divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900',
        className
      )}
      {...props}
    >
      {children}
    </tbody>
  );
};

const TableRow = ({ children, className, clickable, ...props }) => {
  return (
    <tr
      className={cn(
        'transition-colors h-[var(--row-h)]',
        clickable && 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

const TableHead = ({ children, className, ...props }) => {
  return (
    <th
      className={cn(
        'px-[var(--space-4)] py-[var(--space-3)] text-left text-[var(--font-xs)] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
};

const TableCell = ({ children, className, ...props }) => {
  return (
    <td
      className={cn(
        'px-[var(--space-4)] py-[var(--space-3)] text-gray-900 dark:text-gray-100',
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
};

const TableFooter = ({ children, className, ...props }) => {
  return (
    <tfoot
      className={cn(
        'bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700',
        className
      )}
      {...props}
    >
      {children}
    </tfoot>
  );
};

const TableCaption = ({ children, className, ...props }) => {
  return (
    <caption className={cn('mt-4 text-sm text-gray-500 dark:text-gray-400', className)} {...props}>
      {children}
    </caption>
  );
};

Table.displayName = 'Table';
TableHeader.displayName = 'TableHeader';
TableBody.displayName = 'TableBody';
TableRow.displayName = 'TableRow';
TableHead.displayName = 'TableHead';
TableCell.displayName = 'TableCell';
TableFooter.displayName = 'TableFooter';
TableCaption.displayName = 'TableCaption';

Table.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

TableHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

TableBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

TableRow.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  clickable: PropTypes.bool,
};

TableHead.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

TableCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

TableFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

TableCaption.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter, TableCaption };

export default Table;
