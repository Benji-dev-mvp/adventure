/**
 * BadgePill Component
 * 
 * Consistent badge styling across the application
 * Variants: AI, Beta, New, Pro, Exec, Default
 */

import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'ai' | 'beta' | 'new' | 'pro' | 'exec' | 'default';

interface BadgePillProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  ai: 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/20',
  beta: 'bg-purple-500 text-white',
  new: 'bg-emerald-500 text-white',
  pro: 'bg-amber-500 text-slate-900 font-bold',
  exec: 'bg-rose-500 text-white',
  default: 'bg-slate-700 text-slate-300',
};

export const BadgePill: React.FC<BadgePillProps> = ({
  children,
  variant = 'default',
  className,
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default BadgePill;
