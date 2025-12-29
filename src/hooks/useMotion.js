import { useEffect, useState } from 'react';

/**
 * Hook to detect user's reduced motion preference
 * Returns true if user prefers reduced motion
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = event => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

/**
 * Motion configuration that respects reduced motion preferences
 */
export const getMotionConfig = prefersReducedMotion => ({
  // Fade in animation
  fadeIn: prefersReducedMotion
    ? { initial: {}, animate: {}, transition: {} }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5 },
      },

  // Slide up animation
  slideUp: prefersReducedMotion
    ? { initial: {}, animate: {}, transition: {} }
    : {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: 'easeOut' },
      },

  // Slide in from left
  slideInLeft: prefersReducedMotion
    ? { initial: {}, animate: {}, transition: {} }
    : {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.5, ease: 'easeOut' },
      },

  // Slide in from right
  slideInRight: prefersReducedMotion
    ? { initial: {}, animate: {}, transition: {} }
    : {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.5, ease: 'easeOut' },
      },

  // Scale up animation
  scaleUp: prefersReducedMotion
    ? { initial: {}, animate: {}, transition: {} }
    : {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.4, ease: 'easeOut' },
      },

  // Stagger children container
  staggerContainer: prefersReducedMotion
    ? { initial: {}, animate: {} }
    : {
        initial: {},
        animate: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
        },
      },

  // Stagger child item
  staggerItem: prefersReducedMotion
    ? { initial: {}, animate: {} }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
      },

  // Hover scale effect
  hoverScale: prefersReducedMotion
    ? {}
    : {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        transition: { type: 'spring', stiffness: 400, damping: 17 },
      },

  // Hover glow effect (for cards)
  hoverGlow: prefersReducedMotion
    ? {}
    : {
        whileHover: {
          boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)',
        },
        transition: { duration: 0.3 },
      },

  // Parallax effect
  parallax: (offset = 50) =>
    prefersReducedMotion
      ? {}
      : {
          style: {
            y: offset,
          },
        },
});

/**
 * Viewport animation settings for scroll-triggered animations
 */
export const viewportSettings = {
  once: true,
  amount: 0.2,
  margin: '-50px',
};

/**
 * Spring transition presets
 */
export const springPresets = {
  gentle: { type: 'spring', stiffness: 120, damping: 14 },
  snappy: { type: 'spring', stiffness: 400, damping: 25 },
  bouncy: { type: 'spring', stiffness: 300, damping: 10 },
  smooth: { type: 'spring', stiffness: 100, damping: 20 },
};

/**
 * Easing presets
 */
export const easingPresets = {
  easeOut: [0.16, 1, 0.3, 1],
  easeIn: [0.4, 0, 1, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  sharp: [0.4, 0, 0.6, 1],
};

/**
 * Combined hook that returns both preference and motion configs
 */
export const useMotion = () => {
  const prefersReducedMotion = useReducedMotion();
  const motionConfig = getMotionConfig(prefersReducedMotion);

  return {
    prefersReducedMotion,
    motionConfig,
    springPresets,
    easingPresets,
    viewportSettings,
  };
};

export default useReducedMotion;
