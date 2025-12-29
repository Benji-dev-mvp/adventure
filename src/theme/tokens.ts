/**
 * Theme Tokens - Design system for operator console
 *
 * Centralized token definitions for:
 * - Colors (primary, secondary, semantic)
 * - Spacing
 * - Typography
 * - Shadows
 * - Borders
 * - Z-indexes
 */

// ============================================
// COLOR PALETTE
// ============================================
export const colors = {
  // Backgrounds
  bg: {
    primary: 'var(--bg-primary)',
    secondary: 'var(--bg-secondary)',
    tertiary: 'var(--bg-tertiary)',
    surface: 'var(--bg-surface)',
    surfaceHover: 'var(--bg-surface-hover)',
    surfaceActive: 'var(--bg-surface-active)',
    overlay: 'var(--bg-overlay)',
  },

  // Text
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    tertiary: 'var(--text-tertiary)',
    muted: 'var(--text-muted)',
    danger: 'var(--semantic-danger)',
    success: 'var(--semantic-success)',
    warning: 'var(--semantic-warning)',
    info: 'var(--semantic-info)',
  },

  // Semantic
  semantic: {
    success: 'var(--semantic-success)',
    successLight: 'var(--semantic-success-light)',
    successDark: 'var(--semantic-success-dark)',
    warning: 'var(--semantic-warning)',
    warningLight: 'var(--semantic-warning-light)',
    warningDark: 'var(--semantic-warning-dark)',
    danger: 'var(--semantic-danger)',
    dangerLight: 'var(--semantic-danger-light)',
    dangerDark: 'var(--semantic-danger-dark)',
    info: 'var(--semantic-info)',
    infoLight: 'var(--semantic-info-light)',
    infoDark: 'var(--semantic-info-dark)',
  },

  // Accent
  accent: {
    cyan: 'var(--accent-cyan)',
    purple: 'var(--accent-purple)',
    pink: 'var(--accent-pink)',
    blue: 'var(--accent-blue)',
    green: 'var(--accent-green)',
    amber: 'var(--accent-amber)',
    red: 'var(--accent-red)',
  },

  // Borders
  border: {
    primary: 'var(--border-primary)',
    secondary: 'var(--border-secondary)',
    tertiary: 'var(--border-tertiary)',
    hover: 'var(--border-hover)',
    focus: 'var(--border-focus)',
  },

  // Interactive
  interactive: {
    hover: 'var(--interactive-hover)',
    active: 'var(--interactive-active)',
    disabled: 'var(--interactive-disabled)',
    focusRing: 'var(--interactive-focus-ring)',
  },
};

// ============================================
// SPACING
// ============================================
export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '2.5rem', // 40px
  '3xl': '3rem', // 48px
  '4xl': '4rem', // 64px
};

// ============================================
// TYPOGRAPHY
// ============================================
export const typography = {
  // Font families
  fontFamily: {
    base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
    mono: '"JetBrains Mono", "Courier New", monospace',
  },

  // Font sizes
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },

  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0em',
    wide: '0.05em',
  },
};

// ============================================
// SHADOWS
// ============================================
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  glow: '0 0 20px rgba(0, 245, 255, 0.3)',
  glowPurple: '0 0 20px rgba(168, 85, 247, 0.3)',
};

// ============================================
// BORDERS
// ============================================
export const border = {
  radius: {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  width: {
    none: '0',
    thin: '1px',
    base: '2px',
    thick: '3px',
  },
};

// ============================================
// Z-INDEXES
// ============================================
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  offcanvas: 1050,
  modal: 1060,
  popover: 1070,
  tooltip: 1080,
  notification: 1090,
};

// ============================================
// TRANSITIONS
// ============================================
export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
};

// ============================================
// DENSITY TOKENS
// ============================================
export const density = {
  fontScale: {
    base: 'var(--font-base)',
    sm: 'var(--font-sm)',
    xs: 'var(--font-xs)',
  },
  space: {
    1: 'var(--space-1)',
    2: 'var(--space-2)',
    3: 'var(--space-3)',
    4: 'var(--space-4)',
    5: 'var(--space-5)',
    6: 'var(--space-6)',
    7: 'var(--space-7)',
    8: 'var(--space-8)',
  },
  controlHeights: {
    sm: 'var(--control-h-sm)',
    md: 'var(--control-h-md)',
  },
  cardPadding: {
    sm: 'var(--card-pad-sm)',
    md: 'var(--card-pad-md)',
  },
  radius: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
  },
};

// ============================================
// SEMANTIC TOKEN HELPERS
// ============================================

/**
 * Get color tokens for a semantic status
 */
export function getSemanticColor(status: 'success' | 'warning' | 'danger' | 'info') {
  return {
    success: colors.semantic.success,
    warning: colors.semantic.warning,
    danger: colors.semantic.danger,
    info: colors.semantic.info,
  }[status];
}

/**
 * Get text and background for a badge
 */
export function getBadgeColors(variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral') {
  const variants = {
    success: { bg: colors.semantic.successLight, text: colors.semantic.successDark },
    warning: { bg: colors.semantic.warningLight, text: colors.semantic.warningDark },
    danger: { bg: colors.semantic.dangerLight, text: colors.semantic.dangerDark },
    info: { bg: colors.semantic.infoLight, text: colors.semantic.infoDark },
    neutral: { bg: colors.bg.surface, text: colors.text.secondary },
  };
  return variants[variant];
}

/**
 * Get hover color - returns appropriate hover shade
 */
export function getHoverColor(baseColor: string): string {
  // For dark backgrounds, lighten; for light, darken
  // This is a simple implementation; expand as needed
  if (baseColor === colors.bg.surface) return colors.bg.surfaceHover;
  if (baseColor === colors.bg.secondary) return colors.bg.tertiary;
  return colors.interactive.hover;
}
