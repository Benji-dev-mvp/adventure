import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(
  ({ className, type = 'text', label, error, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = props.id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-medium text-gray-700 dark:text-gray-300"
            style={{ fontSize: 'var(--font-xs)', marginBottom: 'var(--space-2)' }}
          >
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-[var(--radius-md)] border border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 text-gray-900 dark:text-white',
            'h-[var(--control-h-sm)] px-[var(--space-3)] text-[var(--font-sm)]',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent',
            'disabled:bg-gray-50 dark:disabled:bg-white/5 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p
            className="text-red-600 dark:text-red-400"
            style={{ marginTop: 'var(--space-1)', fontSize: 'var(--font-xs)' }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};

export const Textarea = React.forwardRef(({ className, label, error, rows = 4, ...props }, ref) => {
  const generatedId = React.useId();
  const textareaId = props.id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block font-medium text-gray-700 dark:text-gray-300"
          style={{ fontSize: 'var(--font-xs)', marginBottom: 'var(--space-2)' }}
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={cn(
          'w-full rounded-[var(--radius-md)] border border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 text-gray-900 dark:text-white',
          'px-[var(--space-3)] py-[var(--space-2)] text-[var(--font-sm)]',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent',
          'disabled:bg-gray-50 dark:disabled:bg-white/5 disabled:cursor-not-allowed resize-none',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p
          className="text-red-600 dark:text-red-400"
          style={{ marginTop: 'var(--space-1)', fontSize: 'var(--font-xs)' }}
        >
          {error}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

Textarea.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  rows: PropTypes.number,
};

export const Select = React.forwardRef(({ className, label, error, children, ...props }, ref) => {
  const generatedId = React.useId();
  const selectId = props.id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block font-medium text-gray-700 dark:text-gray-300"
          style={{ fontSize: 'var(--font-sm)', marginBottom: 'var(--space-2)' }}
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          'w-full rounded-[var(--radius-lg)] border border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 text-gray-900 dark:text-white',
          'h-[var(--control-h-sm)] px-[var(--space-4)] text-[var(--font-sm)]',
          'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent',
          'disabled:bg-gray-50 dark:disabled:bg-white/5 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p
          className="text-red-600 dark:text-red-400"
          style={{ marginTop: 'var(--space-1)', fontSize: 'var(--font-xs)' }}
        >
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

Select.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  children: PropTypes.node,
};
