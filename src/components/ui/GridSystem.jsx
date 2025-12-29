import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Responsive Grid System - 100% responsive across all devices
 * Breakpoints: xs (0px), sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
 */

export const GridContainer = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'w-full mx-auto',
        'px-4 sm:px-6 lg:px-8',
        'max-w-7xl 2xl:max-w-[1920px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const GridRow = ({ className, gap = 'md', children, ...props }) => {
  const gapSizes = {
    none: 'gap-0',
    sm: 'gap-2 sm:gap-3',
    md: 'gap-4 md:gap-6',
    lg: 'gap-6 lg:gap-8',
    xl: 'gap-8 xl:gap-12',
  };

  return (
    <div className={cn('grid grid-cols-1', 'md:grid-cols-12', gapSizes[gap], className)} {...props}>
      {children}
    </div>
  );
};

export const GridCol = ({ xs = 12, sm, md, lg, xl, className, children, ...props }) => {
  const colSpans = [];

  // Base (xs)
  colSpans.push(`col-span-${xs}`);

  // Responsive breakpoints
  if (sm !== undefined) colSpans.push(`sm:col-span-${sm}`);
  if (md !== undefined) colSpans.push(`md:col-span-${md}`);
  if (lg !== undefined) colSpans.push(`lg:col-span-${lg}`);
  if (xl !== undefined) colSpans.push(`xl:col-span-${xl}`);

  return (
    <div className={cn(...colSpans, className)} {...props}>
      {children}
    </div>
  );
};

export const FlexContainer = ({
  direction = 'row',
  justify = 'start',
  align = 'start',
  wrap = false,
  gap = 'md',
  className,
  children,
  ...props
}) => {
  const directions = {
    row: 'flex-row',
    'row-reverse': 'flex-row-reverse',
    col: 'flex-col',
    'col-reverse': 'flex-col-reverse',
  };

  const justifications = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const alignments = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch',
  };

  const gapSizes = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  return (
    <div
      className={cn(
        'flex',
        directions[direction],
        justifications[justify],
        alignments[align],
        wrap && 'flex-wrap',
        gapSizes[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const ResponsiveStack = ({
  spacing = 'md',
  divider = false,
  className,
  children,
  ...props
}) => {
  const spacings = {
    none: 'space-y-0',
    xs: 'space-y-1',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
  };

  return (
    <div
      className={cn(
        'flex flex-col',
        spacings[spacing],
        divider && 'divide-y divide-gray-200 dark:divide-gray-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const ResponsiveGrid = ({
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 'md',
  className,
  children,
  ...props
}) => {
  const gapSizes = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const gridCols = [
    `grid-cols-${cols.xs || 1}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    cols['2xl'] && `2xl:grid-cols-${cols['2xl']}`,
  ].filter(Boolean);

  return (
    <div className={cn('grid', ...gridCols, gapSizes[gap], className)} {...props}>
      {children}
    </div>
  );
};

// Responsive Section Component
export const Section = ({ className, padding = 'md', children, ...props }) => {
  const paddings = {
    none: 'py-0',
    sm: 'py-4 sm:py-6',
    md: 'py-6 sm:py-8 lg:py-12',
    lg: 'py-8 sm:py-12 lg:py-16',
    xl: 'py-12 sm:py-16 lg:py-24',
  };

  return (
    <section className={cn('w-full', paddings[padding], className)} {...props}>
      {children}
    </section>
  );
};

// Mobile-first Show/Hide utilities
export const ShowAt = ({ breakpoint = 'md', children }) => {
  const breakpoints = {
    sm: 'hidden sm:block',
    md: 'hidden md:block',
    lg: 'hidden lg:block',
    xl: 'hidden xl:block',
  };

  return <div className={breakpoints[breakpoint]}>{children}</div>;
};

export const HideAt = ({ breakpoint = 'md', children }) => {
  const breakpoints = {
    sm: 'sm:hidden',
    md: 'md:hidden',
    lg: 'lg:hidden',
    xl: 'xl:hidden',
  };

  return <div className={breakpoints[breakpoint]}>{children}</div>;
};

// Responsive Spacer
export const Spacer = ({ size = 'md', responsive = true, className }) => {
  if (responsive) {
    const sizes = {
      sm: 'h-4 sm:h-6',
      md: 'h-6 sm:h-8 lg:h-12',
      lg: 'h-8 sm:h-12 lg:h-16',
      xl: 'h-12 sm:h-16 lg:h-24',
    };
    return <div className={cn(sizes[size], className)} />;
  }

  const fixedSizes = {
    sm: 'h-4',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16',
  };

  return <div className={cn(fixedSizes[size], className)} />;
};
