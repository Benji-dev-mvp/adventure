import React from 'react';
import { cn } from '@/lib/utils';

const Stat = ({ 
  label,
  value,
  change,
  trend,
  icon,
  variant = 'default',
  className,
  ...props 
}) => {
  const variants = {
    default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  };

  const getTrendIcon = () => {
    if (trend === 'up') {
      return (
        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    if (trend === 'down') {
      return (
        <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div 
      className={cn(
        "rounded-xl border p-6 transition-shadow hover:shadow-md",
        variants[variant],
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              {getTrendIcon()}
              <span className={cn(
                "text-sm font-medium",
                trend === 'up' && "text-green-600 dark:text-green-400",
                trend === 'down' && "text-red-600 dark:text-red-400",
                !trend && "text-gray-600 dark:text-gray-400"
              )}>
                {change}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-gray-400 dark:text-gray-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

const StatGroup = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Stat.displayName = 'Stat';
StatGroup.displayName = 'StatGroup';

export { Stat, StatGroup };
export default Stat;
