/**
 * GlassCard - Glassmorphism card with blur and border effects
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useTilt, usePrefersReducedMotion } from '../../hooks/useAnimations';

const variants = {
  default: {
    bg: 'bg-white/5',
    border: 'border-white/10',
    hoverBorder: 'hover:border-white/20',
  },
  light: {
    bg: 'bg-white/10',
    border: 'border-white/15',
    hoverBorder: 'hover:border-white/25',
  },
  dark: {
    bg: 'bg-black/30',
    border: 'border-white/5',
    hoverBorder: 'hover:border-white/15',
  },
  gradient: {
    bg: 'bg-gradient-to-br from-white/10 to-white/5',
    border: 'border-white/10',
    hoverBorder: 'hover:border-white/20',
  },
  neon: {
    bg: 'bg-slate-900/80',
    border: 'border-cyan-500/20',
    hoverBorder: 'hover:border-cyan-500/50',
  },
};

const blurLevels = {
  none: '',
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
  '2xl': 'backdrop-blur-2xl',
};

const radiusLevels = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  full: 'rounded-full',
};

export function GlassCard({
  children,
  variant = 'default',
  blur = 'xl',
  radius = 'lg',
  padding = 'p-6',
  className = '',
  hover = true,
  tilt = false,
  glow = false,
  glowColor = 'cyan',
  onClick,
  as: Component = 'div',
  ...props
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { ref, style, glareStyle, handlers } = useTilt({
    maxTilt: 10,
    scale: 1.02,
    glare: !prefersReducedMotion,
    maxGlare: 0.15,
  });

  const variantStyles = variants[variant] || variants.default;
  const blurClass = blurLevels[blur] || blurLevels.xl;
  const radiusClass = radiusLevels[radius] || radiusLevels.lg;

  const glowClasses = {
    cyan: 'hover:shadow-[0_0_30px_rgba(0,245,255,0.15)]',
    purple: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]',
    pink: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]',
  };

  const baseClasses = `
    relative overflow-hidden
    ${variantStyles.bg}
    ${blurClass}
    border ${variantStyles.border}
    ${radiusClass}
    ${padding}
    ${hover ? `${variantStyles.hoverBorder} hover:bg-white/10 transition-all duration-300` : ''}
    ${glow ? glowClasses[glowColor] : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  if (tilt && !prefersReducedMotion) {
    return (
      <Component
        ref={ref}
        className={baseClasses}
        style={style}
        onClick={onClick}
        {...handlers}
        {...props}
      >
        {children}
        {glareStyle && <div style={glareStyle} />}
      </Component>
    );
  }

  return (
    <Component className={baseClasses} onClick={onClick} {...props}>
      {children}
    </Component>
  );
}

GlassCard.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'light', 'dark', 'gradient', 'neon']),
  blur: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', 'full']),
  padding: PropTypes.string,
  className: PropTypes.string,
  hover: PropTypes.bool,
  tilt: PropTypes.bool,
  glow: PropTypes.bool,
  glowColor: PropTypes.oneOf(['cyan', 'purple', 'pink']),
  onClick: PropTypes.func,
  as: PropTypes.elementType,
};

/**
 * GlassCardHeader - Header section for glass cards
 */
export function GlassCardHeader({ children, className = '', ...props }) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

GlassCardHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

/**
 * GlassCardTitle - Title for glass cards
 */
export function GlassCardTitle({ children, className = '', as: Component = 'h3', ...props }) {
  return (
    <Component className={`text-xl font-semibold text-white ${className}`} {...props}>
      {children}
    </Component>
  );
}

GlassCardTitle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  as: PropTypes.elementType,
};

/**
 * GlassCardDescription - Description text for glass cards
 */
export function GlassCardDescription({ children, className = '', ...props }) {
  return (
    <p className={`text-sm text-white/60 mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
}

GlassCardDescription.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

/**
 * GlassCardContent - Main content area
 */
export function GlassCardContent({ children, className = '', ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

GlassCardContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

/**
 * GlassCardFooter - Footer section
 */
export function GlassCardFooter({ children, className = '', ...props }) {
  return (
    <div className={`mt-6 pt-4 border-t border-white/10 ${className}`} {...props}>
      {children}
    </div>
  );
}

GlassCardFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

/**
 * FeatureCard - Pre-styled feature card with icon
 */
export function FeatureCard({
  icon,
  title,
  description,
  className = '',
  variant = 'default',
  ...props
}) {
  return (
    <GlassCard variant={variant} hover glow className={`group ${className}`} {...props}>
      {/* Icon container */}
      {icon && (
        <div className="mb-4 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-white/60 leading-relaxed">{description}</p>
    </GlassCard>
  );
}

FeatureCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'light', 'dark', 'gradient', 'neon']),
};

/**
 * StatCard - Card for displaying statistics
 */
export function StatCard({
  value,
  label,
  icon,
  trend,
  trendDirection = 'up',
  className = '',
  ...props
}) {
  const trendColors = {
    up: 'text-emerald-400',
    down: 'text-rose-400',
    neutral: 'text-white/60',
  };

  return (
    <GlassCard className={`text-center ${className}`} {...props}>
      {icon && (
        <div className="mx-auto mb-3 w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-cyan-400">
          {icon}
        </div>
      )}

      <div className="text-3xl font-bold text-white mb-1">{value}</div>

      <div className="text-sm text-white/60">{label}</div>

      {trend && (
        <div className={`mt-2 text-sm font-medium ${trendColors[trendDirection]}`}>
          {trendDirection === 'up' && '↑'}
          {trendDirection === 'down' && '↓'}
          {trend}
        </div>
      )}
    </GlassCard>
  );
}

StatCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  trend: PropTypes.string,
  trendDirection: PropTypes.oneOf(['up', 'down', 'neutral']),
  className: PropTypes.string,
};

/**
 * GlassModal - Modal with glass effect
 */
export function GlassModal({ isOpen, onClose, children, title, className = '', ...props }) {
  if (!isOpen) return null;

  const handleKeyDown = e => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={-1}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClose();
          }
        }}
        aria-label="Close modal"
      />

      {/* Modal */}
      <GlassCard
        variant="dark"
        blur="2xl"
        className={`relative z-10 w-full max-w-lg animate-[scale-in_0.2s_ease-out] ${className}`}
        {...props}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
            <h2 id="modal-title" className="text-xl font-semibold text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}

        {children}
      </GlassCard>
    </div>
  );
}

GlassModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  title: PropTypes.string,
  className: PropTypes.string,
};

export default GlassCard;
