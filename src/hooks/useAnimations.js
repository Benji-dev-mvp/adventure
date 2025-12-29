/**
 * Animation Hooks
 * Custom React hooks for futuristic animations and effects
 */
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ============================================
// useIntersectionAnimation - Animate on scroll into view
// ============================================
export function useIntersectionAnimation(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    delay = 0,
  } = options;

  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasAnimated)) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              setHasAnimated(true);
            }, delay);
          } else {
            setIsVisible(true);
            setHasAnimated(true);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, delay, hasAnimated]);

  return { ref, isVisible, hasAnimated };
}

// ============================================
// useParallax - Parallax scrolling effect
// ============================================
export function useParallax(speed = 0.5, direction = 'vertical') {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const elementTop = rect.top + scrollY;
      const viewportCenter = scrollY + window.innerHeight / 2;
      const distanceFromCenter = viewportCenter - elementTop - rect.height / 2;

      if (direction === 'vertical') {
        setOffset({ x: 0, y: distanceFromCenter * speed });
      } else if (direction === 'horizontal') {
        setOffset({ x: distanceFromCenter * speed, y: 0 });
      } else {
        setOffset({
          x: distanceFromCenter * speed * 0.5,
          y: distanceFromCenter * speed,
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction]);

  const style = useMemo(
    () => ({
      transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      willChange: 'transform',
    }),
    [offset.x, offset.y]
  );

  return { ref, offset, style };
}

// ============================================
// useMousePosition - Track mouse for effects
// ============================================
export function useMousePosition(elementRef = null) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [relativePosition, setRelativePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      if (elementRef?.current) {
        const rect = elementRef.current.getBoundingClientRect();
        setRelativePosition({
          x: (e.clientX - rect.left - rect.width / 2) / (rect.width / 2),
          y: (e.clientY - rect.top - rect.height / 2) / (rect.height / 2),
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [elementRef]);

  return { position, relativePosition };
}

// ============================================
// useTilt - 3D tilt effect on hover
// ============================================
export function useTilt(options = {}) {
  const { maxTilt = 15, scale = 1.02, speed = 400, glare = false, maxGlare = 0.3 } = options;

  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback(
    (e) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const tiltX = (y - 0.5) * maxTilt * 2;
      const tiltY = (0.5 - x) * maxTilt * 2;

      setTilt({ x: tiltX, y: tiltY, scale });

      if (glare) {
        setGlarePosition({ x: x * 100, y: y * 100 });
      }
    },
    [maxTilt, scale, glare]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0, scale: 1 });
    setGlarePosition({ x: 50, y: 50 });
  }, []);

  const style = useMemo(
    () => ({
      transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.scale})`,
      transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`,
      willChange: 'transform',
    }),
    [tilt, speed]
  );

  const glareStyle = useMemo(
    () =>
      glare
        ? {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,${maxGlare}), transparent 60%)`,
            opacity: tilt.scale > 1 ? 1 : 0,
            transition: `opacity ${speed}ms ease`,
          }
        : null,
    [glare, glarePosition, maxGlare, tilt.scale, speed]
  );

  return {
    ref,
    style,
    glareStyle,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
}

// ============================================
// useTypewriter - Typing animation effect
// ============================================
export function useTypewriter(text, options = {}) {
  const { speed = 50, delay = 0, loop = false, pauseDuration = 2000 } = options;

  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeout;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      if (!isDeleting) {
        if (charIndex <= text.length) {
          setDisplayText(text.slice(0, charIndex));
          charIndex++;
          setIsTyping(true);
          timeout = setTimeout(type, speed);
        } else {
          setIsTyping(false);
          setIsComplete(true);
          if (loop) {
            timeout = setTimeout(() => {
              isDeleting = true;
              type();
            }, pauseDuration);
          }
        }
      } else {
        if (charIndex > 0) {
          charIndex--;
          setDisplayText(text.slice(0, charIndex));
          setIsTyping(true);
          timeout = setTimeout(type, speed / 2);
        } else {
          isDeleting = false;
          setIsComplete(false);
          timeout = setTimeout(type, delay);
        }
      }
    };

    timeout = setTimeout(type, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay, loop, pauseDuration]);

  return { displayText, isTyping, isComplete };
}

// ============================================
// useCountUp - Animated number counter
// ============================================
export function useCountUp(end, options = {}) {
  const { start = 0, duration = 2000, delay = 0, decimals = 0, easing = 'easeOut' } = options;

  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);

  const easingFunctions = {
    linear: (t) => t,
    easeIn: (t) => t * t,
    easeOut: (t) => t * (2 - t),
    easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  };

  useEffect(() => {
    let animationFrame;
    let startTime;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFunctions[easing](progress);
      const currentValue = start + (end - start) * easedProgress;

      setCount(Number(currentValue.toFixed(decimals)));
      setIsAnimating(progress < 1);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const timeout = setTimeout(() => {
      setIsAnimating(true);
      animationFrame = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
    };
  }, [end, start, duration, delay, decimals, easing]);

  return { count, isAnimating };
}

// ============================================
// useStaggeredAnimation - Stagger children animations
// ============================================
export function useStaggeredAnimation(itemCount, options = {}) {
  const { staggerDelay = 100, initialDelay = 0 } = options;

  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    const timeouts = [];

    for (let i = 0; i < itemCount; i++) {
      const timeout = setTimeout(() => {
        setVisibleItems((prev) => [...prev, i]);
      }, initialDelay + i * staggerDelay);
      timeouts.push(timeout);
    }

    return () => timeouts.forEach(clearTimeout);
  }, [itemCount, staggerDelay, initialDelay]);

  const isVisible = useCallback((index) => visibleItems.includes(index), [visibleItems]);

  const getDelay = useCallback(
    (index) => initialDelay + index * staggerDelay,
    [initialDelay, staggerDelay]
  );

  return { visibleItems, isVisible, getDelay };
}

// ============================================
// useScrollProgress - Track scroll progress
// ============================================
export function useScrollProgress(elementRef = null) {
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState('down');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      let scrollProgress;

      if (elementRef?.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const elementHeight = rect.height;
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY;

        const start = elementTop - viewportHeight;
        const end = elementTop + elementHeight;
        scrollProgress = Math.max(0, Math.min(1, (scrollY - start) / (end - start)));
      } else {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress = window.scrollY / scrollHeight;
      }

      setProgress(scrollProgress);
      setDirection(window.scrollY > lastScrollY.current ? 'down' : 'up');
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [elementRef]);

  return { progress, direction };
}

// ============================================
// useSpring - Spring physics animation
// ============================================
export function useSpring(targetValue, options = {}) {
  const { stiffness = 100, damping = 10, mass = 1 } = options;

  const [value, setValue] = useState(targetValue);
  const velocity = useRef(0);
  const prevTarget = useRef(targetValue);

  useEffect(() => {
    let animationFrame;
    const target = targetValue;

    const animate = () => {
      const displacement = target - value;
      const springForce = stiffness * displacement;
      const dampingForce = damping * velocity.current;
      const acceleration = (springForce - dampingForce) / mass;

      velocity.current += acceleration * 0.016; // ~60fps
      const newValue = value + velocity.current * 0.016;

      if (Math.abs(displacement) < 0.001 && Math.abs(velocity.current) < 0.001) {
        setValue(target);
        velocity.current = 0;
        return;
      }

      setValue(newValue);
      animationFrame = requestAnimationFrame(animate);
    };

    if (prevTarget.current !== target) {
      prevTarget.current = target;
      animationFrame = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [targetValue, value, stiffness, damping, mass]);

  return value;
}

// ============================================
// usePrefersReducedMotion - Accessibility check
// ============================================
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

export default {
  useIntersectionAnimation,
  useParallax,
  useMousePosition,
  useTilt,
  useTypewriter,
  useCountUp,
  useStaggeredAnimation,
  useScrollProgress,
  useSpring,
  usePrefersReducedMotion,
};
