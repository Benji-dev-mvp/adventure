/**
 * Futuristic Design Tokens
 * Centralized design system for the landing page
 */

// ============================================
// COLOR TOKENS
// ============================================
export const colors = {
  // Primary palette - deep space blues
  space: {
    900: '#030712',
    800: '#0a0f1a',
    700: '#0f172a',
    600: '#1e293b',
    500: '#334155',
  },

  // Accent colors - neon/cyber
  neon: {
    cyan: '#00f5ff',
    purple: '#a855f7',
    pink: '#ec4899',
    blue: '#3b82f6',
    green: '#10b981',
  },

  // Gradient definitions
  gradients: {
    aurora: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    cyber: 'linear-gradient(135deg, #00f5ff 0%, #a855f7 50%, #ec4899 100%)',
    sunset: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ffd93d 100%)',
    ocean: 'linear-gradient(135deg, #667eea 0%, #00f5ff 100%)',
    midnight: 'linear-gradient(135deg, #0a0f1a 0%, #1e293b 50%, #334155 100%)',
    glow: 'radial-gradient(ellipse at center, rgba(0, 245, 255, 0.15) 0%, transparent 70%)',
  },

  // Glass/overlay colors
  glass: {
    white: 'rgba(255, 255, 255, 0.05)',
    whiteMedium: 'rgba(255, 255, 255, 0.1)',
    whiteStrong: 'rgba(255, 255, 255, 0.15)',
    dark: 'rgba(0, 0, 0, 0.3)',
    border: 'rgba(255, 255, 255, 0.1)',
    borderHover: 'rgba(255, 255, 255, 0.2)',
  },
};

// ============================================
// SPACING TOKENS
// ============================================
export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
  '4xl': '6rem', // 96px
  '5xl': '8rem', // 128px
};

// ============================================
// TYPOGRAPHY TOKENS
// ============================================
export const typography = {
  fonts: {
    display: '"Inter", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
  },
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeights: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

// ============================================
// ANIMATION TOKENS
// ============================================
export const animation = {
  durations: {
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms',
  },
  easings: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
  // Keyframe animation presets
  keyframes: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    fadeUp: {
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    fadeDown: {
      from: { opacity: 0, transform: 'translateY(-20px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    scaleIn: {
      from: { opacity: 0, transform: 'scale(0.95)' },
      to: { opacity: 1, transform: 'scale(1)' },
    },
    slideInLeft: {
      from: { opacity: 0, transform: 'translateX(-30px)' },
      to: { opacity: 1, transform: 'translateX(0)' },
    },
    slideInRight: {
      from: { opacity: 0, transform: 'translateX(30px)' },
      to: { opacity: 1, transform: 'translateX(0)' },
    },
    pulse: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
    glow: {
      '0%, 100%': { boxShadow: '0 0 20px rgba(0, 245, 255, 0.3)' },
      '50%': { boxShadow: '0 0 40px rgba(0, 245, 255, 0.6)' },
    },
    float: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-10px)' },
    },
    shimmer: {
      '0%': { backgroundPosition: '-200% 0' },
      '100%': { backgroundPosition: '200% 0' },
    },
  },
};

// ============================================
// EFFECTS TOKENS
// ============================================
export const effects = {
  blur: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    '2xl': '40px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
    glow: {
      cyan: '0 0 30px rgba(0, 245, 255, 0.4)',
      purple: '0 0 30px rgba(168, 85, 247, 0.4)',
      pink: '0 0 30px rgba(236, 72, 153, 0.4)',
    },
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  borders: {
    thin: '1px',
    normal: '2px',
    thick: '4px',
  },
  radius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px',
  },
};

// ============================================
// BREAKPOINTS
// ============================================
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============================================
// Z-INDEX LAYERS
// ============================================
export const zIndex = {
  background: -10,
  base: 0,
  content: 10,
  overlay: 20,
  modal: 30,
  popover: 40,
  tooltip: 50,
  toast: 60,
  max: 9999,
};

// ============================================
// COMPONENT PRESETS
// ============================================
export const presets = {
  // Glass card preset
  glassCard: {
    background: colors.glass.white,
    backdropFilter: `blur(${effects.blur.lg})`,
    border: `${effects.borders.thin} solid ${colors.glass.border}`,
    borderRadius: effects.radius.xl,
  },

  // Glow button preset
  glowButton: {
    background: colors.gradients.cyber,
    boxShadow: effects.shadows.glow.cyan,
    borderRadius: effects.radius.full,
    transition: `all ${animation.durations.normal} ${animation.easings.easeOut}`,
  },

  // Neon text preset
  neonText: {
    color: colors.neon.cyan,
    textShadow: `0 0 10px ${colors.neon.cyan}, 0 0 20px ${colors.neon.cyan}, 0 0 40px ${colors.neon.cyan}`,
  },
};

// ============================================
// CSS CUSTOM PROPERTIES GENERATOR
// ============================================
export const generateCSSVariables = () => `
  :root {
    /* Colors */
    --color-space-900: ${colors.space[900]};
    --color-space-800: ${colors.space[800]};
    --color-space-700: ${colors.space[700]};
    --color-neon-cyan: ${colors.neon.cyan};
    --color-neon-purple: ${colors.neon.purple};
    --color-neon-pink: ${colors.neon.pink};
    
    /* Gradients */
    --gradient-aurora: ${colors.gradients.aurora};
    --gradient-cyber: ${colors.gradients.cyber};
    --gradient-ocean: ${colors.gradients.ocean};
    
    /* Glass */
    --glass-bg: ${colors.glass.white};
    --glass-border: ${colors.glass.border};
    
    /* Animation */
    --duration-fast: ${animation.durations.fast};
    --duration-normal: ${animation.durations.normal};
    --duration-slow: ${animation.durations.slow};
    --ease-smooth: ${animation.easings.smooth};
    --ease-bounce: ${animation.easings.bounce};
    
    /* Effects */
    --blur-lg: ${effects.blur.lg};
    --shadow-glow-cyan: ${effects.shadows.glow.cyan};
    --radius-xl: ${effects.radius.xl};
  }
`;

export default {
  colors,
  spacing,
  typography,
  animation,
  effects,
  breakpoints,
  zIndex,
  presets,
  generateCSSVariables,
};
