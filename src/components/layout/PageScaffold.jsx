import React from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * PageScaffold - Standardized page wrapper for all authenticated pages
 * 
 * Provides consistent:
 * - Page header with title, subtitle, and actions
 * - Content area with proper padding and max-width
 * - Dark/light theme support
 * - Spacing tokens
 * 
 * This is the single source of truth for page-level layout.
 */
export const PageScaffold = ({ 
  children, 
  title, 
  subtitle, 
  actions,
  className,
  contentClassName 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className={cn(
      "min-h-full",
      isDark ? 'bg-slate-950 text-gray-100' : 'bg-gray-50 text-gray-900',
      className
    )}>
      {/* Page Header */}
      {(title || subtitle || actions) && (
        <div className={cn(
          "border-b px-6 py-4 sticky top-0 z-10 backdrop-blur-xl",
          isDark ? 'border-slate-800 bg-slate-900/80' : 'border-gray-200 bg-white/80'
        )}>
          <div className="max-w-[1920px] mx-auto flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {title && (
                <h1 className={cn(
                  "text-2xl font-bold",
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className={cn(
                  "mt-1 text-sm",
                  isDark ? 'text-slate-400' : 'text-gray-600'
                )}>
                  {subtitle}
                </p>
              )}
            </div>
            
            {actions && (
              <div className="flex items-center gap-2 flex-shrink-0">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={cn(
        "max-w-[1920px] mx-auto px-6 py-6",
        contentClassName
      )}>
        {children}
      </main>
    </div>
  );
};

/**
 * SectionHeader - Standardized section header for organizing content within pages
 * 
 * Provides consistent:
 * - Icon + title layout
 * - Optional subtitle
 * - Optional actions
 * - Proper spacing
 * 
 * Use this to divide pages into logical sections.
 */
export const SectionHeader = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  action,
  className 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className={cn(
      "flex items-center justify-between mb-4",
      className
    )}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            isDark ? 'bg-violet-500/10' : 'bg-violet-100'
          )}>
            <Icon className={cn(
              "w-4 h-4",
              isDark ? 'text-violet-400' : 'text-violet-600'
            )} />
          </div>
        )}
        <div>
          <h3 className={cn(
            "text-sm font-medium uppercase tracking-wider",
            isDark ? 'text-white' : 'text-gray-900'
          )}>
            {title}
          </h3>
          {subtitle && (
            <p className={cn(
              "text-xs mt-0.5",
              isDark ? 'text-slate-500' : 'text-gray-500'
            )}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

export default PageScaffold;
