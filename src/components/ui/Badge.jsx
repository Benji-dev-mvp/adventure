import React from 'react';
import { cn } from '../../lib/utils';

export const Badge = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300',
    primary: 'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300',
    accent: 'bg-accent-100 dark:bg-accent-500/20 text-accent-700 dark:text-accent-300',
    success: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300',
    warning: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
    danger: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300',
    score: 'bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
