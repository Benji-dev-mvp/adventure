/**
 * PageScaffold Component
 * 
 * Consistent page structure for all app pages
 * Handles title, badges, subtitle, actions, and content grid
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { BadgePill } from './BadgePill';

export interface PageScaffoldProps {
  title: string;
  subtitle?: string;
  badges?: Array<{ text: string; variant?: 'ai' | 'beta' | 'new' | 'pro' | 'exec' | 'default' }>;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  sidebar?: React.ReactNode;
  loading?: boolean;
}

/**
 * PageScaffold - Standard page layout
 */
export const PageScaffold: React.FC<PageScaffoldProps> = ({
  title,
  subtitle,
  badges,
  actions,
  children,
  className,
  contentClassName,
  sidebar,
  loading,
}) => {
  return (
    <div className={cn('flex flex-col h-full bg-slate-950', className)}>
      {/* Page Header */}
      <div className="flex-shrink-0 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          {/* Title & Badges */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white truncate">{title}</h1>
              {badges && badges.length > 0 && (
                <div className="flex items-center gap-2">
                  {badges.map((badge, idx) => (
                    <BadgePill key={idx} variant={badge.variant || 'default'}>
                      {badge.text}
                    </BadgePill>
                  ))}
                </div>
              )}
            </div>
            {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
          </div>

          {/* Actions */}
          {actions && <div className="flex-shrink-0 flex items-center gap-2">{actions}</div>}
        </div>
      </div>

      {/* Content Area */}
      <div className={cn('flex-1 overflow-auto', contentClassName)}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-400">Loading...</p>
            </div>
          </div>
        ) : sidebar ? (
          <div className="flex h-full">
            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">{children}</div>
            {/* Sidebar */}
            <div className="w-80 flex-shrink-0 border-l border-slate-800 bg-slate-950/50 overflow-auto p-6">
              {sidebar}
            </div>
          </div>
        ) : (
          <div className="p-6">{children}</div>
        )}
      </div>
    </div>
  );
};

export default PageScaffold;
