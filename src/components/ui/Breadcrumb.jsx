import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Breadcrumb = ({ children, className, separator, ...props }) => {
  const defaultSeparator = (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  );

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center", className)} {...props}>
      <ol className="flex items-center space-x-2 text-sm">
        {React.Children.map(children, (child, index) => {
          const isLast = index === React.Children.count(children) - 1;
          return (
            <li className="flex items-center gap-2">
              {child}
              {!isLast && (
                <span className="text-gray-400 dark:text-gray-600" aria-hidden="true">
                  {separator || defaultSeparator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

const BreadcrumbItem = ({ children, href, active, className, ...props }) => {
  const baseClasses = cn(
    "transition-colors",
    active 
      ? "text-gray-900 dark:text-gray-100 font-medium" 
      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100",
    className
  );

  if (href && !active) {
    return (
      <Link to={href} className={baseClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <span 
      className={baseClasses} 
      aria-current={active ? 'page' : undefined}
      {...props}
    >
      {children}
    </span>
  );
};

Breadcrumb.displayName = 'Breadcrumb';
BreadcrumbItem.displayName = 'BreadcrumbItem';

export { Breadcrumb, BreadcrumbItem };
export default Breadcrumb;
