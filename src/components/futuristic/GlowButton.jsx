/**
 * GlowButton - Futuristic button with glow effects
 */
import React from 'react';
import PropTypes from 'prop-types';
import { usePrefersReducedMotion } from '../../hooks/useAnimations';

const variants = {
  primary: {
    gradient: 'from-cyan-500 via-blue-500 to-purple-500',
    glow: 'shadow-cyan-500/30 hover:shadow-cyan-500/50',
    hoverGlow: 'group-hover:shadow-[0_0_40px_rgba(0,245,255,0.6)]',
  },
  secondary: {
    gradient: 'from-purple-500 via-pink-500 to-rose-500',
    glow: 'shadow-purple-500/30 hover:shadow-purple-500/50',
    hoverGlow: 'group-hover:shadow-[0_0_40px_rgba(168,85,247,0.6)]',
  },
  success: {
    gradient: 'from-emerald-500 via-green-500 to-teal-500',
    glow: 'shadow-emerald-500/30 hover:shadow-emerald-500/50',
    hoverGlow: 'group-hover:shadow-[0_0_40px_rgba(16,185,129,0.6)]',
  },
  ghost: {
    gradient: '',
    glow: '',
    hoverGlow: '',
  },
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl',
};

export function GlowButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  ...props
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const variantStyles = variants[variant] || variants.primary;
  const sizeStyles = sizes[size] || sizes.md;

  const baseClasses = `
    group relative inline-flex items-center justify-center gap-2
    font-semibold rounded-full overflow-hidden
    transition-all duration-300 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
    ${sizeStyles}
  `;

  const renderContent = () => (
    <>
      {loading ? (
        <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
          <span className="relative z-10">{children}</span>
          {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </>
      )}
    </>
  );

  // Ghost variant - minimal styling
  if (variant === 'ghost') {
    return (
      <button
        className={`
          ${baseClasses}
          bg-white/5 border border-white/10
          hover:bg-white/10 hover:border-white/20
          text-white backdrop-blur-sm
          ${className}
        `}
        disabled={disabled || loading}
        onClick={onClick}
        {...props}
      >
        {renderContent()}
      </button>
    );
  }

  return (
    <button
      className={`
        ${baseClasses}
        bg-gradient-to-r ${variantStyles.gradient}
        text-white shadow-lg ${variantStyles.glow}
        hover:scale-105 hover:shadow-xl
        active:scale-95
        ${className}
      `}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {/* Animated gradient overlay */}
      {!prefersReducedMotion && (
        <span
          className={`
            absolute inset-0 bg-gradient-to-r ${variantStyles.gradient}
            opacity-0 group-hover:opacity-100
            blur-xl transition-opacity duration-500
            -z-10
          `}
        />
      )}

      {/* Shimmer effect on hover */}
      {!prefersReducedMotion && (
        <span
          className="
            absolute inset-0 -translate-x-full
            bg-gradient-to-r from-transparent via-white/20 to-transparent
            group-hover:translate-x-full transition-transform duration-1000
            skew-x-12
          "
        />
      )}

      {renderContent()}
    </button>
  );
}

GlowButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
};

/**
 * GlowButtonOutline - Outlined variant with gradient border
 */
export function GlowButtonOutline({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  ...props
}) {
  const variantStyles = variants[variant] || variants.primary;
  const sizeStyles = sizes[size] || sizes.md;

  return (
    <button
      className={`
        group relative inline-flex items-center justify-center gap-2
        font-semibold rounded-full overflow-hidden
        transition-all duration-300 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        bg-transparent text-white
        hover:scale-105 active:scale-95
        ${sizeStyles}
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {/* Gradient border using pseudo-element */}
      <span
        className={`
          absolute inset-0 rounded-full
          bg-gradient-to-r ${variantStyles.gradient}
          p-[2px]
        `}
      >
        <span className="absolute inset-[2px] rounded-full bg-slate-900/90 backdrop-blur-sm" />
      </span>

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>

      {/* Hover glow */}
      <span
        className={`
          absolute inset-0 rounded-full opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          bg-gradient-to-r ${variantStyles.gradient}
          blur-xl -z-10
        `}
      />
    </button>
  );
}

GlowButtonOutline.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

/**
 * IconButton - Circular icon button with glow
 */
export function IconButton({
  icon,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  ariaLabel,
  ...props
}) {
  const variantStyles = variants[variant] || variants.primary;

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  };

  return (
    <button
      className={`
        group relative inline-flex items-center justify-center
        rounded-full overflow-hidden
        transition-all duration-300 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        bg-gradient-to-r ${variantStyles.gradient}
        text-white shadow-lg ${variantStyles.glow}
        hover:scale-110 hover:shadow-xl
        active:scale-95
        ${iconSizes[size]}
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      {...props}
    >
      <span className="relative z-10">{icon}</span>

      {/* Pulse ring on hover */}
      <span
        className={`
          absolute inset-0 rounded-full
          bg-gradient-to-r ${variantStyles.gradient}
          opacity-0 group-hover:opacity-50
          group-hover:animate-ping
        `}
      />
    </button>
  );
}

IconButton.propTypes = {
  icon: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  ariaLabel: PropTypes.string,
};

export default GlowButton;
