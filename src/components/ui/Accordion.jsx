import React, { useState, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

const AccordionContext = createContext();

const Accordion = ({ 
  children, 
  type = 'single', // 'single' or 'multiple'
  defaultValue,
  className,
  ...props 
}) => {
  const [openItems, setOpenItems] = useState(
    defaultValue ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : []
  );

  const toggleItem = (value) => {
    if (type === 'single') {
      setOpenItems(openItems.includes(value) ? [] : [value]);
    } else {
      setOpenItems(
        openItems.includes(value)
          ? openItems.filter(item => item !== value)
          : [...openItems, value]
      );
    }
  };

  const isItemOpen = (value) => openItems.includes(value);

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, isItemOpen }}>
      <div className={cn("divide-y divide-gray-200 dark:divide-gray-700", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

const AccordionItem = ({ children, value, className, ...props }) => {
  const { isItemOpen } = useContext(AccordionContext);
  const isOpen = isItemOpen(value);

  return (
    <div 
      className={cn("border-b border-gray-200 dark:border-gray-700 last:border-0", className)} 
      data-state={isOpen ? 'open' : 'closed'}
      {...props}
    >
      {children}
    </div>
  );
};

const AccordionTrigger = ({ children, value, className, icon, ...props }) => {
  const { toggleItem, isItemOpen } = useContext(AccordionContext);
  const isOpen = isItemOpen(value);

  return (
    <button
      onClick={() => toggleItem(value)}
      className={cn(
        "flex w-full items-center justify-between py-4 px-1 text-left",
        "font-medium text-gray-900 dark:text-gray-100",
        "transition-colors hover:text-accent-600 dark:hover:text-accent-400",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2",
        "dark:focus-visible:ring-offset-gray-900",
        className
      )}
      aria-expanded={isOpen}
      {...props}
    >
      <span>{children}</span>
      <div className={cn(
        "flex-shrink-0 ml-4 transition-transform duration-200",
        isOpen && "rotate-180"
      )}>
        {icon || (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>
    </button>
  );
};

const AccordionContent = ({ children, value, className, ...props }) => {
  const { isItemOpen } = useContext(AccordionContext);
  const isOpen = isItemOpen(value);

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300",
        isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      )}
      aria-hidden={!isOpen}
    >
      <div className={cn("pb-4 px-1 text-gray-700 dark:text-gray-300", className)} {...props}>
        {children}
      </div>
    </div>
  );
};

Accordion.displayName = 'Accordion';
AccordionItem.displayName = 'AccordionItem';
AccordionTrigger.displayName = 'AccordionTrigger';
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
export default Accordion;
