import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

const Spinner = ({ size = 'md', variant = 'primary', className, ...props }) => {
  const sizes = {
    xs: 'w-3 h-3 border',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-2',
    xl: 'w-12 h-12 border-4',
  };

  const variants = {
    primary: 'border-accent-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-600 border-t-transparent',
  };

  return (
    <div
      className={cn(
        'inline-block rounded-full animate-spin',
        sizes[size],
        variants[variant],
        className
      )}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

const LoadingOverlay = ({ children, loading, spinnerSize = 'lg', className }) => {
  if (!loading) return children;

  return (
    <div className={cn('relative', className)}>
      <div className="opacity-50 pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50">
        <Spinner size={spinnerSize} />
      </div>
    </div>
  );
};

const LoadingDots = ({ className, ...props }) => {
  return (
    <div className={cn('flex items-center gap-1', className)} {...props}>
      <span
        className="w-2 h-2 bg-accent-600 rounded-full animate-bounce"
        style={{ animationDelay: '0ms' }}
      />
      <span
        className="w-2 h-2 bg-accent-600 rounded-full animate-bounce"
        style={{ animationDelay: '150ms' }}
      />
      <span
        className="w-2 h-2 bg-accent-600 rounded-full animate-bounce"
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
};

LoadingDots.propTypes = {
  className: PropTypes.string,
};

const LoadingBar = ({ progress, className, ...props }) => {
  return (
    <div
      className={cn(
        'w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-accent-600 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};

LoadingBar.propTypes = {
  progress: PropTypes.number.isRequired,
  className: PropTypes.string,
};

Spinner.displayName = 'Spinner';

Spinner.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['primary', 'white', 'gray']),
  className: PropTypes.string,
};

LoadingOverlay.displayName = 'LoadingOverlay';

LoadingOverlay.propTypes = {
  children: PropTypes.node,
  loading: PropTypes.bool,
  spinnerSize: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
};
LoadingDots.displayName = 'LoadingDots';
LoadingBar.displayName = 'LoadingBar';

export { Spinner, LoadingOverlay, LoadingDots, LoadingBar };
export default Spinner;
