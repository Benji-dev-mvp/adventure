import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';

export const Progress = ({ value = 0, max = 100, className, indicatorClassName }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('relative h-2 w-full overflow-hidden rounded-full bg-gray-200', className)}>
      <div
        className={cn(
          'h-full w-full flex-1 bg-gradient-to-r from-accent-500 to-primary-500 transition-all duration-300',
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
};

Progress.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  className: PropTypes.string,
  indicatorClassName: PropTypes.string,
};
