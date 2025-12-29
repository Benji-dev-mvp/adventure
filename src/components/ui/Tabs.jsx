import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';

export const Tabs = ({ children, defaultValue, value, onValueChange, className }) => {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue);

  // Sync with controlled value
  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value);
    }
  }, [value]);

  const handleTabChange = newValue => {
    setActiveTab(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div className={cn('w-full', className)}>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, { activeTab, onTabChange: handleTabChange });
      })}
    </div>
  );
};

Tabs.propTypes = {
  children: PropTypes.node,
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  onValueChange: PropTypes.func,
  className: PropTypes.string,
};

export const TabsList = ({ children, activeTab, onTabChange, className }) => {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-start rounded-[var(--radius-md)] border',
        'gap-[var(--space-1)] px-[var(--space-2)] py-[var(--space-1)]',
        'bg-gray-100 border-gray-200',
        'dark:bg-white/10 dark:border-white/15',
        className
      )}
    >
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, { activeTab, onTabChange });
      })}
    </div>
  );
};

TabsList.propTypes = {
  children: PropTypes.node,
  activeTab: PropTypes.string,
  onTabChange: PropTypes.func,
  className: PropTypes.string,
};

export const TabsTrigger = ({ children, value, activeTab, onTabChange, className }) => {
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => onTabChange(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-sm)] font-medium',
        'px-[var(--space-3)] py-[var(--space-1)] text-[var(--font-sm)]',
        'transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
        'focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900',
        'disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-white text-primary-600 shadow-sm border border-gray-200 dark:bg-slate-900/60 dark:text-white dark:border-white/20'
          : 'text-gray-700 hover:text-gray-900 bg-transparent dark:text-gray-200 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/10 border border-transparent',
        className
      )}
    >
      {children}
    </button>
  );
};

TabsTrigger.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string.isRequired,
  activeTab: PropTypes.string,
  onTabChange: PropTypes.func,
  className: PropTypes.string,
};

export const TabsContent = ({ children, value, activeTab, className }) => {
  if (activeTab !== value) return null;

  return (
    <div
      className={cn(
        'ring-offset-white focus-visible:outline-none focus-visible:ring-2',
        'mt-[var(--space-2)]',
        'focus-visible:ring-accent-500 focus-visible:ring-offset-2',
        className
      )}
    >
      {children}
    </div>
  );
};

TabsContent.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string.isRequired,
  activeTab: PropTypes.string,
  className: PropTypes.string,
};
