import React from 'react';
import { cn } from '../../lib/utils';

export const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-white/10 dark:backdrop-blur-xl rounded-[var(--radius-lg)] shadow-sm border border-gray-100 dark:border-white/20',
        'p-[var(--card-pad-sm)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }) => {
  return (
    <div className={cn('', className)} style={{ marginBottom: 'var(--space-3)' }} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3
      className={cn('font-semibold text-gray-900 dark:text-white', className)}
      style={{ fontSize: 'var(--font-base)' }}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({ className, children, ...props }) => {
  return (
    <p
      className={cn('text-gray-500 dark:text-gray-300', className)}
      style={{ fontSize: 'var(--font-xs)', marginTop: 'var(--space-1)' }}
      {...props}
    >
      {children}
    </p>
  );
};

export const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('border-t border-gray-100 dark:border-white/20', className)}
      style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)' }}
      {...props}
    >
      {children}
    </div>
  );
};
