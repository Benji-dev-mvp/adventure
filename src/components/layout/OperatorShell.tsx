/**
 * OperatorShell - Dify-style operator console layout
 *
 * Provides standardized layout for authenticated pages:
 * - Top header (title, subtitle, badges, actions)
 * - Main content area
 * - Right inspector (entity details, editing)
 */

import React, { ReactNode, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/uiStore';
import { colors, zIndex } from '@/theme/tokens';
import { X } from 'lucide-react';

export interface PageScaffoldConfig {
  title?: string;
  subtitle?: string;
  badges?: Array<{ label: string; color?: string; icon?: React.ReactNode }>;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    icon?: React.ReactNode;
    disabled?: boolean;
  }>;
  showInspector?: boolean;
  inspectorWidth?: 'sm' | 'md' | 'lg';
  showActivityPanel?: boolean;
}

interface OperatorShellProps {
  children: ReactNode;
  scaffold?: PageScaffoldConfig;
  className?: string;
}

/**
 * PageScaffold - Reusable page container with standardized header
 */
export const PageScaffold: React.FC<{
  children: ReactNode;
  config?: PageScaffoldConfig;
  className?: string;
}> = ({ children, config, className }) => {
  const widthClass = config?.inspectorWidth
    ? {
        sm: 'w-72',
        md: 'w-80',
        lg: 'w-96',
      }[config.inspectorWidth]
    : 'w-80';

  return (
    <div
      className={cn('flex flex-col h-full', className)}
      style={{ backgroundColor: colors.bg.tertiary }}
    >
      {/* Header */}
      {(config?.title || config?.subtitle || config?.badges || config?.actions) && (
        <PageHeader
          title={config?.title}
          subtitle={config?.subtitle}
          badges={config?.badges}
          actions={config?.actions}
        />
      )}

      {/* Main content grid */}
      <div className="flex flex-1 overflow-hidden">
        {/* Content area - with padding for breathing room */}
        <div className="flex-1 flex flex-col overflow-auto" style={{ padding: 'var(--space-4)' }}>
          <div className="space-y-[var(--space-4)]">{children}</div>
        </div>

        {/* Right Inspector */}
        {config?.showInspector && <RightInspectorPanel width={widthClass} />}
      </div>
    </div>
  );
};

/**
 * PageHeader - Compact, elegant page header
 */
const PageHeader: React.FC<Partial<PageScaffoldConfig>> = ({
  title,
  subtitle,
  badges,
  actions,
}) => {
  return (
    <div
      className="border-b flex items-center justify-between"
      style={{
        borderColor: colors.border.primary,
        backgroundColor: colors.bg.secondary,
        padding: 'var(--space-4) var(--space-4)',
        gap: 'var(--space-4)',
      }}
    >
      {/* Title and metadata */}
      <div className="flex-1 min-w-0">
        <div
          className="flex items-center"
          style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}
        >
          {title && (
            <h1
              className="font-bold truncate"
              style={{ color: colors.text.primary, fontSize: 'var(--font-lg)' }}
            >
              {title}
            </h1>
          )}
        </div>

        <div className="flex items-center flex-wrap" style={{ gap: 'var(--space-3)' }}>
          {subtitle && (
            <p
              className="text-xs"
              style={{ color: colors.text.tertiary, fontSize: 'var(--font-sm)' }}
            >
              {subtitle}
            </p>
          )}

          {/* Badges - inline */}
          {badges && badges.length > 0 && (
            <div className="flex" style={{ gap: 'var(--space-2)' }}>
              {badges.map((badge, idx) => {
                const colorMap: Record<string, string> = {
                  cyan: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25',
                  blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/25',
                  green: 'bg-green-500/15 text-green-400 border border-green-500/25',
                  purple: 'bg-purple-500/15 text-purple-400 border border-purple-500/25',
                  orange: 'bg-orange-500/15 text-orange-400 border border-orange-500/25',
                  startup: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25',
                  midmarket: 'bg-purple-500/15 text-purple-400 border border-purple-500/25',
                  enterprise: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
                };
                return (
                  <div
                    key={idx}
                    className={cn(
                      'inline-flex items-center whitespace-nowrap text-xs font-medium border rounded-[var(--radius-sm)]',
                      'px-[var(--space-2)] py-[calc(var(--space-1)/1.5)] gap-[var(--space-1)]',
                      colorMap[badge.color as string] ||
                        'bg-slate-500/15 text-slate-400 border border-slate-500/25'
                    )}
                  >
                    {badge.icon && <span className="text-xs">{badge.icon}</span>}
                    <span>{badge.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div className="flex flex-shrink-0" style={{ gap: 'var(--space-2)' }}>
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              disabled={action.disabled}
              className={cn(
                'px-3 py-1.5 rounded text-xs font-medium transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap',
                action.variant === 'primary'
                  ? 'bg-cyan-500 text-white hover:bg-cyan-600 active:scale-95'
                  : action.variant === 'danger'
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                    : 'bg-slate-600 text-slate-200 hover:bg-slate-700 border border-slate-500',
                action.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {action.icon && <span>{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * RightInspectorPanel - Entity inspector on the right side
 */
const RightInspectorPanel: React.FC<{ width?: string }> = ({ width = 'w-80' }) => {
  const { modals } = useUIStore();
  const isOpen = modals['entity-inspector']?.isOpen || false;
  const entity = (modals['entity-inspector']?.data as any)?.entity;

  if (!isOpen || !entity) return null;

  return (
    <div
      className={cn('border-l flex flex-col overflow-hidden', width)}
      style={{
        borderColor: colors.border.primary,
        backgroundColor: colors.bg.secondary,
        zIndex: zIndex.fixed,
      }}
    >
      {/* Inspector header */}
      <div
        className="border-b px-4 py-3 flex items-start justify-between flex-shrink-0"
        style={{ borderColor: colors.border.primary }}
      >
        <div className="min-w-0 flex-1">
          <p
            className="text-xs uppercase tracking-wider font-semibold"
            style={{ color: colors.text.tertiary }}
          >
            {entity.type}
          </p>
          <h2 className="text-sm font-bold mt-0.5 truncate" style={{ color: colors.text.primary }}>
            {entity.label || entity.id}
          </h2>
        </div>
        <button
          onClick={() => {
            const { closeModal } = useUIStore.getState();
            closeModal('entity-inspector');
          }}
          className="p-1 hover:bg-slate-700/50 rounded transition-colors flex-shrink-0 ml-2"
        >
          <X className="w-4 h-4" style={{ color: colors.text.secondary }} />
        </button>
      </div>

      {/* Inspector content */}
      <InspectorContent entity={entity} />

      {/* Inspector footer */}
      <div
        className="border-t px-4 py-2 flex gap-2 flex-shrink-0"
        style={{ borderColor: colors.border.primary }}
      >
        <button
          className="flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors"
          onClick={() => {
            const { closeModal } = useUIStore.getState();
            closeModal('entity-inspector');
          }}
          style={{
            backgroundColor: colors.bg.surface,
            color: colors.text.primary,
            borderColor: colors.border.primary,
            border: `1px solid ${colors.border.primary}`,
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = colors.interactive.hover)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = colors.bg.surface)}
        >
          Close
        </button>
        <button
          className="flex-1 px-3 py-1.5 rounded text-xs font-medium text-white transition-colors"
          style={{ backgroundColor: '#0891b2' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0e7490')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0891b2')}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

/**
 * InspectorContent - Displays entity details
 */
const InspectorContent: React.FC<{ entity: any }> = ({ entity }) => {
  const fields = useMemo(() => {
    if (!entity || !entity.metadata) return [];
    return Object.entries(entity.metadata).map(([key, value]) => ({
      key,
      value: typeof value === 'object' ? JSON.stringify(value) : String(value),
    }));
  }, [entity]);

  return (
    <div className="flex-1 overflow-auto px-4 py-3 space-y-3">
      {fields.length > 0 ? (
        <>
          <p
            className="text-xs uppercase tracking-wider font-semibold sticky top-0"
            style={{ color: colors.text.tertiary }}
          >
            Details
          </p>
          {fields.map(field => (
            <div key={field.key} className="space-y-0.5">
              <p className="text-xs font-medium" style={{ color: colors.text.secondary }}>
                {field.key}
              </p>
              <p className="text-xs break-all" style={{ color: colors.text.tertiary }}>
                {field.value}
              </p>
            </div>
          ))}
        </>
      ) : (
        <p style={{ color: colors.text.tertiary }} className="text-xs text-center py-3">
          No additional details available
        </p>
      )}
    </div>
  );
};

/**
 * OperatorShell - Main shell component
 */
export const OperatorShell: React.FC<OperatorShellProps> = ({ children, scaffold, className }) => {
  return (
    <PageScaffold config={scaffold} className={className}>
      {children}
    </PageScaffold>
  );
};

export default OperatorShell;
