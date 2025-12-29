import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../lib/utils';

/**
 * DashboardLayout - Content wrapper for dashboard pages
 *
 * Provides a consistent content area layout with optional title/subtitle.
 * Navigation is now handled by PostLoginShell.
 *
 * This component focuses on:
 * - Consistent padding and max-width
 * - Page title and subtitle header
 * - Dark/light theme support
 */
const DashboardLayout = ({ children, title, subtitle }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={cn(
        'min-h-full',
        isDark ? 'bg-slate-950 text-gray-100' : 'bg-gray-50 text-gray-900'
      )}
    >
      {/* Page Header */}
      {(title || subtitle) && (
        <div
          className={cn(
            'border-b px-6 py-4',
            isDark ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-white'
          )}
        >
          <div className="max-w-[1920px] mx-auto">
            {title && (
              <h1 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p className={cn('mt-1 text-sm', isDark ? 'text-slate-400' : 'text-gray-600')}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-4 py-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
