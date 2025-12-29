import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { X, Bell, Check, AlertCircle, Info, AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * Interactive UI Components - Modals, Notifications, Alerts, Drawers
 */

// Responsive Modal/Dialog
export const ResponsiveModal = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
  closeOnOverlay = true,
  className,
}) => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeOnOverlay ? onClose : undefined}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn(
            'relative w-full',
            sizes[size],
            'bg-white dark:bg-gray-800',
            'rounded-xl shadow-2xl',
            'transform transition-all',
            className
          )}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-4 sm:p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
              {description && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-4 max-h-[60vh] overflow-y-auto">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 p-4 sm:p-4 border-t border-gray-200 dark:border-gray-700 sm:justify-end">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Drawer / Side Panel
export const Drawer = ({
  isOpen,
  onClose,
  position = 'right',
  size = 'md',
  title,
  children,
  footer,
  className,
}) => {
  const positions = {
    left: 'left-0 top-0 bottom-0',
    right: 'right-0 top-0 bottom-0',
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0',
  };

  const transforms = {
    left: isOpen ? 'translate-x-0' : '-translate-x-full',
    right: isOpen ? 'translate-x-0' : 'translate-x-full',
    top: isOpen ? 'translate-y-0' : '-translate-y-full',
    bottom: isOpen ? 'translate-y-0' : 'translate-y-full',
  };

  const sizes = {
    sm: position === 'left' || position === 'right' ? 'w-80' : 'h-80',
    md: position === 'left' || position === 'right' ? 'w-96' : 'h-96',
    lg: position === 'left' || position === 'right' ? 'w-[32rem]' : 'h-[32rem]',
    full:
      position === 'left' || position === 'right' ? 'w-full sm:w-[600px]' : 'h-full sm:h-[600px]',
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed z-50',
          'bg-white dark:bg-gray-800',
          'shadow-2xl',
          'transition-transform duration-300',
          positions[position],
          transforms[position],
          sizes[size],
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-4 overflow-y-auto h-[calc(100%-140px)]">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            {footer}
          </div>
        )}
      </div>
    </>
  );
};

// Notification Toast
export const NotificationToast = ({
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  action,
  position = 'top-right',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const types = {
    info: {
      icon: Info,
      color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    success: {
      icon: CheckCircle,
      color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    warning: {
      icon: AlertTriangle,
      color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
    },
    error: {
      icon: AlertCircle,
      color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      iconColor: 'text-red-600 dark:text-red-400',
    },
  };

  const positions = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  const Icon = types[type].icon;

  return (
    <div
      className={cn(
        'fixed z-50 w-full max-w-sm',
        'transform transition-all duration-300',
        positions[position],
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
      )}
    >
      <div className={cn('flex gap-3 p-4 rounded-xl border shadow-lg', types[type].color)}>
        <div className="flex-shrink-0">
          <Icon size={20} className={types[type].iconColor} />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h4>
          {message && <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{message}</p>}
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              {action.label}
            </button>
          )}
        </div>

        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Alert Banner
export const AlertBanner = ({
  type = 'info',
  title,
  message,
  dismissible = true,
  onDismiss,
  action,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const types = {
    info: {
      icon: Info,
      color:
        'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
    },
    success: {
      icon: CheckCircle,
      color:
        'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
    },
    warning: {
      icon: AlertTriangle,
      color:
        'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
    },
    error: {
      icon: AlertCircle,
      color:
        'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
    },
  };

  const Icon = types[type].icon;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div
      className={cn('flex items-start gap-3 p-4 rounded-lg border', types[type].color, className)}
    >
      <div className="flex-shrink-0 mt-0.5">
        <Icon size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold">{title}</h4>
        {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
        {action && (
          <button
            onClick={action.onClick}
            className="mt-2 text-sm font-medium underline hover:no-underline"
          >
            {action.label}
          </button>
        )}
      </div>

      {dismissible && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

// Notification Center
export const NotificationCenter = ({ notifications = [], onMarkAsRead, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 max-h-[80vh] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl z-20 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={onClear}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-96">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No notifications
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <div
                    key={index}
                    className={cn(
                      'p-4 border-b border-gray-200 dark:border-gray-700',
                      'hover:bg-gray-50 dark:hover:bg-gray-700',
                      !notification.read && 'bg-blue-50/50 dark:bg-blue-900/10'
                    )}
                  >
                    <div className="flex gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => onMarkAsRead(index)}
                          className="flex-shrink-0 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          title="Mark as read"
                        >
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
