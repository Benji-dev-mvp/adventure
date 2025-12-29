/**
 * ChartFrame - Safe, themeable wrapper for all charts
 *
 * Ensures:
 * - Consistent theming with tokens
 * - Safe color guards (no invalid hex)
 * - Loading/error states
 * - Empty state handling
 * - No uncontrolled renders
 */

import React, { ReactNode, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { colors, shadows, spacing, typography } from '@/theme/tokens';
import { AlertCircle, Loader2 } from 'lucide-react';

export interface ChartFrameProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  height?: 'sm' | 'md' | 'lg' | string;
  className?: string;
  actions?: ReactNode;
  footer?: ReactNode;
}

const heightMap = {
  sm: '200px',
  md: '300px',
  lg: '400px',
};

/**
 * Validates if a color is valid hex
 */
function isValidColor(color: string): boolean {
  if (!color) return false;
  // Check for hex, rgb, rgba, named colors
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const rgbRegex = /^rgb\(/;
  const rgbaRegex = /^rgba\(/;
  const namedColors = ['white', 'black', 'transparent', 'currentColor'];

  return (
    hexRegex.test(color) ||
    rgbRegex.test(color) ||
    rgbaRegex.test(color) ||
    namedColors.includes(color)
  );
}

/**
 * Safely get color - falls back if invalid
 */
export function getSafeColor(
  colorInput: string | undefined,
  fallback: string = colors.text.primary
): string {
  if (!colorInput || !isValidColor(colorInput)) {
    return fallback;
  }
  return colorInput;
}

/**
 * ChartFrame - Main wrapper component
 */
export const ChartFrame: React.FC<ChartFrameProps> = ({
  title,
  subtitle,
  children,
  isLoading = false,
  isEmpty = false,
  isError = false,
  errorMessage = 'Failed to load chart',
  emptyMessage = 'No data available',
  height = 'md',
  className,
  actions,
  footer,
}) => {
  const heightValue = useMemo(
    () => (height in heightMap ? heightMap[height as keyof typeof heightMap] : height),
    [height]
  );

  return (
    <div
      className={cn('rounded-lg overflow-hidden flex flex-col', className)}
      style={{
        backgroundColor: colors.bg.surface,
        border: `1px solid ${colors.border.primary}`,
        boxShadow: shadows.md,
      }}
    >
      {/* Header */}
      {(title || subtitle || actions) && (
        <div
          className="p-4 border-b flex items-start justify-between"
          style={{ borderColor: colors.border.secondary }}
        >
          <div className="flex-1">
            {title && (
              <h3 className="font-semibold text-sm" style={{ color: colors.text.primary }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs mt-1" style={{ color: colors.text.tertiary }}>
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="ml-4">{actions}</div>}
        </div>
      )}

      {/* Content - with safe height */}
      <div
        className="flex-1 flex items-center justify-center overflow-auto p-4 relative"
        style={{ height: heightValue, minHeight: heightValue }}
      >
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState message={errorMessage} />
        ) : isEmpty ? (
          <EmptyState message={emptyMessage} />
        ) : (
          <div className="w-full h-full">{children}</div>
        )}
      </div>

      {/* Footer */}
      {footer && (
        <div
          className="border-t p-4 text-xs"
          style={{
            borderColor: colors.border.secondary,
            backgroundColor: colors.bg.secondary,
            color: colors.text.tertiary,
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

/**
 * LoadingState - Spinner with message
 */
const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-3">
    <Loader2 className="w-6 h-6 animate-spin" style={{ color: colors.accent.cyan }} />
    <p className="text-sm" style={{ color: colors.text.secondary }}>
      Loading chart...
    </p>
  </div>
);

/**
 * ErrorState - Error message with icon
 */
const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center gap-3">
    <AlertCircle className="w-6 h-6" style={{ color: colors.semantic.danger }} />
    <div className="text-center">
      <p className="text-sm font-medium" style={{ color: colors.semantic.danger }}>
        Error
      </p>
      <p className="text-xs mt-1" style={{ color: colors.text.tertiary }}>
        {message}
      </p>
    </div>
  </div>
);

/**
 * EmptyState - No data message
 */
const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center justify-center">
    <p className="text-sm" style={{ color: colors.text.tertiary }}>
      {message}
    </p>
  </div>
);

/**
 * ThemeProvider wrapper for chart libraries
 * Use this to pass theme colors to child chart libraries
 */
export const ChartThemeProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const theme = useMemo(
    () => ({
      colors: {
        background: colors.bg.surface,
        text: colors.text.primary,
        textSecondary: colors.text.secondary,
        textTertiary: colors.text.tertiary,
        border: colors.border.primary,
        accent: colors.accent.cyan,
        accentSecondary: colors.accent.purple,
        success: colors.semantic.success,
        warning: colors.semantic.warning,
        danger: colors.semantic.danger,
        info: colors.semantic.info,
      },
      typography: {
        fontFamily: typography.fontFamily.base,
        fontSize: {
          sm: typography.fontSize.sm,
          md: typography.fontSize.base,
          lg: typography.fontSize.lg,
        },
        fontWeight: {
          normal: typography.fontWeight.normal,
          medium: typography.fontWeight.medium,
          bold: typography.fontWeight.bold,
        },
      },
    }),
    []
  );

  return (
    <div
      data-theme="operator"
      style={
        {
          '--chart-bg': theme.colors.background,
          '--chart-text': theme.colors.text,
          '--chart-border': theme.colors.border,
          '--chart-accent': theme.colors.accent,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

/**
 * Safe chart wrapper - returns null if no data/children
 */
export const SafeChart: React.FC<{
  data?: unknown;
  children?: ReactNode;
  fallback?: ReactNode;
}> = ({ data, children, fallback }) => {
  const hasData = data && Object.keys(data as object).length > 0;
  const hasChildren = React.Children.count(children) > 0;

  if (!hasData && !hasChildren) {
    return fallback || <EmptyState message="No data to display" />;
  }

  return <>{children}</>;
};

export default ChartFrame;
