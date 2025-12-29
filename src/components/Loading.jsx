import React from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <Loader2 className={`animate-spin text-accent-500 ${sizes[size]} ${className}`} />
  );
};

export const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" className="mx-auto mb-4" />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

export const InlineLoader = ({ message }) => {
  return (
    <div className="flex items-center justify-center gap-3 p-8">
      <LoadingSpinner size="md" />
      {message && <span className="text-gray-600">{message}</span>}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
};

PageLoader.propTypes = {
  message: PropTypes.string,
};

InlineLoader.propTypes = {
  message: PropTypes.string,
};
