import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Checkbox = forwardRef(({ 
  className, 
  label, 
  error,
  helperText,
  id,
  disabled,
  ...props 
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          ref={ref}
          id={checkboxId}
          disabled={disabled}
          className={cn(
            "h-4 w-4 rounded border-gray-300 text-accent-600 transition-colors",
            "focus:ring-2 focus:ring-accent-500 focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-offset-gray-900",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={checkboxId}
            className={cn(
              "text-sm font-medium leading-none cursor-pointer select-none",
              "text-gray-700 dark:text-gray-300",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {label}
          </label>
        )}
      </div>
      {(error || helperText) && (
        <p className={cn(
          "text-xs ml-6",
          error ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };
export default Checkbox;
