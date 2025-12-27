import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(
  ({ className, type = 'text', label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 text-gray-900 dark:text-white text-sm',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent',
            'disabled:bg-gray-50 dark:disabled:bg-white/5 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = React.forwardRef(
  ({ className, label, error, rows = 4, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 text-gray-900 dark:text-white text-sm',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent',
            'disabled:bg-gray-50 dark:disabled:bg-white/5 disabled:cursor-not-allowed resize-none',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export const Select = React.forwardRef(
  ({ className, label, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 text-gray-900 dark:text-white',
            'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent',
            'disabled:bg-gray-50 dark:disabled:bg-white/5 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
