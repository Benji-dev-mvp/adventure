import React from 'react';
import { cn } from '@/lib/utils';

const EmptyState = ({ icon, title, description, action, className, ...props }) => {
  const defaultIcon = (
    <svg className="w-12 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  );

  return (
    <div
      className={cn('flex flex-col items-center justify-center text-center py-12 px-6', className)}
      {...props}
    >
      <div className="text-gray-400 dark:text-gray-600 mb-4">{icon || defaultIcon}</div>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';

export { EmptyState };
export default EmptyState;
