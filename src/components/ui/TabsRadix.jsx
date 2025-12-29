import React from 'react';
import PropTypes from 'prop-types';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../../lib/utils';

const TabsRadix = TabsPrimitive.Root;

const TabsListRadix = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-11 items-center justify-center rounded-xl',
      'bg-gray-100 dark:bg-white/10 p-1 text-gray-700 dark:text-gray-200',
      'border border-gray-200 dark:border-white/20',
      className
    )}
    {...props}
  />
));
TabsListRadix.displayName = TabsPrimitive.List.displayName;
TabsListRadix.propTypes = {
  className: PropTypes.string,
};

const TabsTriggerRadix = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2',
      'text-sm font-medium ring-offset-white transition-all',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
      'focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-white data-[state=active]:text-gray-900',
      'data-[state=active]:dark:bg-gray-800 data-[state=active]:dark:text-white',
      'data-[state=active]:shadow-sm',
      'hover:bg-white/50 dark:hover:bg-white/5',
      className
    )}
    {...props}
  />
));
TabsTriggerRadix.displayName = TabsPrimitive.Trigger.displayName;
TabsTriggerRadix.propTypes = {
  className: PropTypes.string,
};

const TabsContentRadix = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 ring-offset-white focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-accent-500 focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContentRadix.displayName = TabsPrimitive.Content.displayName;
TabsContentRadix.propTypes = {
  className: PropTypes.string,
};

export { TabsRadix, TabsListRadix, TabsTriggerRadix, TabsContentRadix };
