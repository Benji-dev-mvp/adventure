import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Textarea = forwardRef(({ 
  className, 
  label,
  error,
  helperText,
  required,
  id,
  rows = 4,
  ...props 
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label 
          htmlFor={textareaId}
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={cn(
          "w-full rounded-md border px-3 py-2 text-sm",
          "bg-white dark:bg-gray-800",
          "border-gray-300 dark:border-gray-600",
          "text-gray-900 dark:text-gray-100",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
        {...props}
      />
      {(error || helperText) && (
        <p 
          id={error ? `${textareaId}-error` : `${textareaId}-helper`}
          className={cn(
            "text-xs",
            error ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };
export default Textarea;
