import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useScrollAnimation Hook
 * Provides scroll-driven animations with GPU optimization
 * Respects prefers-reduced-motion
 */

export const useScrollAnimation = (options = {}) => {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = false, enableMotion = true } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const elementRef = useRef(null);
  const observerRef = useRef(null);

  // Check for reduced motion preference
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enableMotion || prefersReducedMotion.current) {
      setIsVisible(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && observerRef.current) {
            observerRef.current.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, triggerOnce, enableMotion]);

  return { ref: elementRef, isVisible, scrollProgress };
};

/**
 * useScrollProgress Hook
 * Tracks scroll progress through an element
 */
export const useScrollProgress = (options = {}) => {
  const { start = 0, end = 1 } = options;
  const [progress, setProgress] = useState(0);
  const elementRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;

      const element = elementRef.current;
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate progress based on element position
      const elementTop = rect.top;
      const elementHeight = rect.height;

      // Progress from 0 (element enters viewport) to 1 (element leaves viewport)
      const rawProgress = (viewportHeight - elementTop) / (viewportHeight + elementHeight);
      const clampedProgress = Math.max(start, Math.min(end, rawProgress));

      setProgress(clampedProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [start, end]);

  return { ref: elementRef, progress };
};

/**
 * useParallax Hook
 * Creates parallax scroll effects with GPU optimization
 */
export const useParallax = (speed = 0.5) => {
  const [offset, setOffset] = useState(0);
  const elementRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const parallaxOffset = scrolled * speed;

      setOffset(parallaxOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return {
    ref: elementRef,
    style: {
      transform: `translate3d(0, ${offset}px, 0)`,
      willChange: 'transform',
    },
  };
};

/**
 * useStepProgress Hook
 * For multi-step progress tracking with Intersection Observer
 */
export const useStepProgress = (steps = []) => {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef([]);
  const observersRef = useRef([]);

  useEffect(() => {
    // Clean up previous observers
    observersRef.current.forEach(observer => observer?.disconnect());
    observersRef.current = [];

    stepRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveStep(index);
          }
        },
        {
          threshold: 0.5,
          rootMargin: '-40% 0px -40% 0px',
        }
      );

      observer.observe(ref);
      observersRef.current.push(observer);
    });

    return () => {
      observersRef.current.forEach(observer => observer?.disconnect());
    };
  }, [steps.length]);

  const setStepRef = useCallback(
    index => el => {
      stepRefs.current[index] = el;
    },
    []
  );

  return { activeStep, setStepRef, stepRefs: stepRefs.current };
};

/**
 * Animation Utility Functions
 */

export const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

export const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4, delay },
});

export const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, delay, ease: [0.34, 1.56, 0.64, 1] },
});

export const slideInFromLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

export const slideInFromRight = (delay = 0) => ({
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

/**
 * GPU-Optimized Transform Builder
 */
export const buildTransform = ({ x = 0, y = 0, scale = 1, rotate = 0 }) => {
  return `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`;
};

/**
 * Smooth Counter Animation
 */
export const useCountUp = (end, duration = 2000, options = {}) => {
  const { start = 0, decimals = 0, prefix = '', suffix = '' } = options;
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const frameRef = useRef();

  const animate = useCallback(() => {
    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = start;
    const change = end - start;

    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

    const updateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentCount = startValue + change * easedProgress;

      setCount(currentCount);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(updateCount);
      } else {
        setIsAnimating(false);
      }
    };

    frameRef.current = requestAnimationFrame(updateCount);
  }, [start, end, duration]);

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const formattedCount = `${prefix}${count.toFixed(decimals)}${suffix}`;

  return { count: formattedCount, animate, isAnimating };
};

export default {
  useScrollAnimation,
  useScrollProgress,
  useParallax,
  useStepProgress,
  useCountUp,
  fadeInUp,
  fadeIn,
  scaleIn,
  slideInFromLeft,
  slideInFromRight,
  buildTransform,
};
