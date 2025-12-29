/**
 * Reusable form field component with built-in validation
 * Reduces duplication of form field logic across the app
 */
import React from 'react';
import { Input, Textarea } from '../ui/Input';
import { cn } from '../../lib/utils';

export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  disabled = false,
  multiline = false,
  rows = 3,
  className,
  helpText,
  ...props
}) => {
  const InputComponent = multiline ? Textarea : Input;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <InputComponent
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={multiline ? rows : undefined}
        className={cn(
          error && 'border-red-500 focus:ring-red-500',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helpText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
    </div>
  );
};

/**
 * Form select field component
 */
export const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  placeholder = 'Select an option',
  disabled = false,
  className,
  helpText,
  ...props
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2',
          'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
          'border-gray-300 dark:border-gray-600',
          'focus:ring-blue-500 focus:border-blue-500',
          error && 'border-red-500 focus:ring-red-500',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helpText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
    </div>
  );
};

/**
 * Form checkbox field component
 */
export const FormCheckbox = ({
  label,
  name,
  checked,
  onChange,
  error,
  disabled = false,
  className,
  helpText,
  ...props
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className={cn(
              'h-4 w-4 rounded border-gray-300 text-blue-600',
              'focus:ring-blue-500 focus:ring-2',
              error && 'border-red-500',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            {...props}
          />
        </div>
        {label && (
          <div className="ml-3 text-sm">
            <label htmlFor={name} className="font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
            {helpText && !error && (
              <p className="text-gray-500 dark:text-gray-400">{helpText}</p>
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 ml-7">{error}</p>
      )}
    </div>
  );
};

/**
 * Form group for organizing related fields
 */
export const FormGroup = ({ title, description, children, className }) => {
  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
          {title && (
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
};

/**
 * Complete form wrapper with submit handling
 */
export const Form = ({
  onSubmit,
  children,
  className,
  ...props
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('space-y-6', className)}
      {...props}
    >
      {children}
    </form>
  );
};
