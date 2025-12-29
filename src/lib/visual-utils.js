/**
 * Visual Utilities
 * CSS-in-JS utilities for futuristic visual effects
 */
import { colors, effects, animation } from './design-tokens';

// ============================================
// GLASSMORPHISM UTILITIES
// ============================================
export const glass = {
  // Light glass effect
  light: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },

  // Medium glass effect
  medium: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  },

  // Dark glass effect
  dark: {
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },

  // Frosted glass
  frosted: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(40px) saturate(180%)',
    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
  },
};

// ============================================
// GLOW EFFECTS
// ============================================
export const glow = {
  // Cyan glow
  cyan: {
    boxShadow:
      '0 0 20px rgba(0, 245, 255, 0.3), 0 0 40px rgba(0, 245, 255, 0.2), 0 0 60px rgba(0, 245, 255, 0.1)',
  },

  // Purple glow
  purple: {
    boxShadow:
      '0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(168, 85, 247, 0.2), 0 0 60px rgba(168, 85, 247, 0.1)',
  },

  // Pink glow
  pink: {
    boxShadow:
      '0 0 20px rgba(236, 72, 153, 0.3), 0 0 40px rgba(236, 72, 153, 0.2), 0 0 60px rgba(236, 72, 153, 0.1)',
  },

  // Multi-color glow
  rainbow: {
    boxShadow:
      '0 0 20px rgba(0, 245, 255, 0.2), 0 0 40px rgba(168, 85, 247, 0.2), 0 0 60px rgba(236, 72, 153, 0.2)',
  },

  // Text glow
  text: {
    cyan: {
      textShadow:
        '0 0 10px rgba(0, 245, 255, 0.8), 0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(0, 245, 255, 0.3)',
    },
    purple: {
      textShadow:
        '0 0 10px rgba(168, 85, 247, 0.8), 0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)',
    },
    white: {
      textShadow: '0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(255, 255, 255, 0.4)',
    },
  },
};

// ============================================
// GRADIENT UTILITIES
// ============================================
export const gradients = {
  // Background gradients
  background: {
    aurora: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    cyber: 'linear-gradient(135deg, #00f5ff 0%, #a855f7 50%, #ec4899 100%)',
    sunset: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ffd93d 100%)',
    ocean: 'linear-gradient(135deg, #667eea 0%, #00f5ff 100%)',
    midnight: 'linear-gradient(180deg, #030712 0%, #0a0f1a 50%, #1e293b 100%)',
    space: 'radial-gradient(ellipse at top, #1e293b 0%, #030712 50%, #000000 100%)',
  },

  // Text gradients (for use with background-clip: text)
  text: {
    aurora: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      color: 'transparent',
    },
    cyber: {
      background: 'linear-gradient(135deg, #00f5ff 0%, #a855f7 50%, #ec4899 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      color: 'transparent',
    },
    gold: {
      background: 'linear-gradient(135deg, #ffd93d 0%, #ff6b6b 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      color: 'transparent',
    },
  },

  // Border gradients (for pseudo-element borders)
  border: {
    cyber: 'linear-gradient(135deg, #00f5ff, #a855f7, #ec4899)',
    aurora: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
    rainbow: 'linear-gradient(90deg, #ff0080, #ff8c00, #40e0d0, #9400d3)',
  },
};

// ============================================
// SHIMMER/LOADING EFFECTS
// ============================================
export const shimmer = {
  // Basic shimmer
  basic: {
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s infinite',
  },

  // Gradient shimmer
  gradient: {
    background:
      'linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.15), rgba(168, 85, 247, 0.15), transparent)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 2.5s infinite',
  },

  // Skeleton loading
  skeleton: {
    background:
      'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  },
};

// ============================================
// ANIMATION KEYFRAMES (as CSS string)
// ============================================
export const keyframesCSS = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes pulse-glow {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(0, 245, 255, 0.3);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 40px rgba(0, 245, 255, 0.5);
    transform: scale(1.02);
  }
}

@keyframes rotate-gradient {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-down {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes blob {
  0%, 100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
  50% {
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
  }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes typewriter-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
`;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate a gradient border using pseudo-elements
 */
export function createGradientBorder(gradient, borderWidth = 2, borderRadius = 16) {
  return {
    position: 'relative',
    borderRadius: `${borderRadius}px`,
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      padding: `${borderWidth}px`,
      borderRadius: `${borderRadius}px`,
      background: gradient,
      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      maskComposite: 'xor',
      WebkitMaskComposite: 'xor',
      pointerEvents: 'none',
    },
  };
}

/**
 * Generate animated gradient background
 */
export function createAnimatedGradient(colors, duration = 10) {
  return {
    background: `linear-gradient(-45deg, ${colors.join(', ')})`,
    backgroundSize: '400% 400%',
    animation: `gradient-shift ${duration}s ease infinite`,
  };
}

/**
 * Generate noise/grain overlay
 */
export function createNoiseOverlay(opacity = 0.03) {
  return {
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      opacity,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      pointerEvents: 'none',
      mixBlendMode: 'overlay',
    },
  };
}

/**
 * Create a pulsing glow animation
 */
export function createPulsingGlow(color, intensity = 1) {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  return {
    animation: 'pulse-glow 2s ease-in-out infinite',
    '--glow-color': `rgba(${r}, ${g}, ${b}, ${0.3 * intensity})`,
    '--glow-color-strong': `rgba(${r}, ${g}, ${b}, ${0.5 * intensity})`,
  };
}

// ============================================
// TAILWIND CLASS UTILITIES
// ============================================
export const tw = {
  // Glass card classes
  glassCard: 'bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl',
  glassCardHover: 'hover:bg-white/10 hover:border-white/20 transition-all duration-300',

  // Glow button classes
  glowButton:
    'relative overflow-hidden bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 transition-all duration-300',

  // Text gradient classes
  textGradient:
    'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent',

  // Neon text
  neonCyan: 'text-cyan-400 drop-shadow-[0_0_10px_rgba(0,245,255,0.8)]',
  neonPurple: 'text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]',

  // Animation classes
  animateFadeUp: 'animate-[fade-up_0.5s_ease-out_forwards]',
  animateFloat: 'animate-[float_6s_ease-in-out_infinite]',
  animatePulseGlow: 'animate-[pulse-glow_2s_ease-in-out_infinite]',
  animateShimmer: 'animate-[shimmer_2s_infinite]',

  // Background classes
  bgSpace: 'bg-gradient-to-b from-gray-900 via-slate-900 to-black',
  bgMidnight: 'bg-[#030712]',
};

export default {
  glass,
  glow,
  gradients,
  shimmer,
  keyframesCSS,
  createGradientBorder,
  createAnimatedGradient,
  createNoiseOverlay,
  createPulsingGlow,
  tw,
};
