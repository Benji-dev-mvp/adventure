import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium rounded-[var(--radius-md)] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
  {
    variants: {
      variant: {
        primary:
          'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500 shadow-sm hover:shadow-md',
        secondary:
          'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-sm hover:shadow-md',
        outline:
          'border border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/20 focus:ring-accent-500',
        ghost:
          'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 focus:ring-gray-300',
        danger:
          'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md',
        success:
          'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md',
        gradient:
          'bg-gradient-purple-coral text-white hover:opacity-90 focus:ring-artisan-purple shadow-lg',
      },
      size: {
        sm: 'text-[var(--font-xs)] h-[var(--control-h-sm)] px-[var(--space-3)] gap-[var(--space-2)]',
        md: 'text-[var(--font-sm)] h-[var(--control-h-md)] px-[var(--space-4)] gap-[var(--space-2)]',
        lg: 'text-[var(--font-base)] h-[calc(var(--control-h-md)+4px)] px-[var(--space-5)] gap-[var(--space-2)]',
        xl: 'text-[calc(var(--font-base)+1px)] h-[calc(var(--control-h-md)+8px)] px-[var(--space-6)] gap-[var(--space-2)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'sm',
    },
  }
);

export const Button = React.forwardRef(
  ({ className, variant, size, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
