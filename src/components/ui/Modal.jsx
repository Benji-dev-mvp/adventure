import React from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, children, className, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative bg-white dark:bg-slate-900 dark:border dark:border-white/20 rounded-xl shadow-2xl w-full mx-4 max-h-[90vh] overflow-y-auto',
          sizes[size],
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export const ModalHeader = ({ children, onClose, className }) => {
  return (
    <div className={cn('flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10', className)}>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export const ModalTitle = ({ children, className }) => {
  return (
    <h2 className={cn('text-xl font-semibold text-gray-900 dark:text-white', className)}>
      {children}
    </h2>
  );
};

export const ModalContent = ({ children, className }) => {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  );
};

export const ModalFooter = ({ children, className }) => {
  return (
    <div className={cn('flex items-center justify-end gap-3 p-6 border-t border-gray-100 dark:border-white/10', className)}>
      {children}
    </div>
  );
};
