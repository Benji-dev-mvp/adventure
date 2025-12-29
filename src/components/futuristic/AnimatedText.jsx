/**
 * AnimatedText - Text components with typing, gradient, and reveal animations
 */
import React, { useMemo } from 'react';
import {
  useTypewriter,
  useIntersectionAnimation,
  useCountUp,
  usePrefersReducedMotion,
} from '../../hooks/useAnimations';

/**
 * TypewriterText - Text with typing animation
 */
export function TypewriterText({
  text,
  speed = 50,
  delay = 0,
  loop = false,
  cursor = true,
  cursorChar = '|',
  className = '',
  as: Component = 'span',
  ...props
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { displayText, isTyping, isComplete } = useTypewriter(text, {
    speed: prefersReducedMotion ? 0 : speed,
    delay,
    loop,
  });

  if (prefersReducedMotion) {
    return (
      <Component className={className} {...props}>
        {text}
      </Component>
    );
  }

  return (
    <Component className={className} {...props}>
      {displayText}
      {cursor && (
        <span
          className={`
            inline-block ml-0.5
            ${isComplete && !loop ? 'opacity-0' : 'animate-[typewriter-cursor_0.8s_ease-in-out_infinite]'}
          `}
        >
          {cursorChar}
        </span>
      )}
    </Component>
  );
}

/**
 * GradientText - Text with animated gradient
 */
export function GradientText({
  children,
  gradient = 'cyber',
  animate = true,
  className = '',
  as: Component = 'span',
  ...props
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const gradients = {
    cyber: 'from-cyan-400 via-purple-400 to-pink-400',
    aurora: 'from-violet-400 via-purple-400 to-fuchsia-400',
    sunset: 'from-orange-400 via-pink-400 to-purple-400',
    ocean: 'from-blue-400 via-cyan-400 to-teal-400',
    gold: 'from-yellow-400 via-amber-400 to-orange-400',
    neon: 'from-green-400 via-cyan-400 to-blue-400',
  };

  const gradientClass = gradients[gradient] || gradients.cyber;

  return (
    <Component
      className={`
        bg-gradient-to-r ${gradientClass}
        bg-clip-text text-transparent
        ${animate && !prefersReducedMotion ? 'bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * GlowText - Text with neon glow effect
 */
export function GlowText({
  children,
  color = 'cyan',
  intensity = 1,
  pulse = false,
  className = '',
  as: Component = 'span',
  ...props
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const glowColors = {
    cyan: {
      text: 'text-cyan-400',
      glow: `drop-shadow-[0_0_${10 * intensity}px_rgba(0,245,255,0.8)]`,
    },
    purple: {
      text: 'text-purple-400',
      glow: `drop-shadow-[0_0_${10 * intensity}px_rgba(168,85,247,0.8)]`,
    },
    pink: {
      text: 'text-pink-400',
      glow: `drop-shadow-[0_0_${10 * intensity}px_rgba(236,72,153,0.8)]`,
    },
    green: {
      text: 'text-emerald-400',
      glow: `drop-shadow-[0_0_${10 * intensity}px_rgba(16,185,129,0.8)]`,
    },
    white: {
      text: 'text-white',
      glow: `drop-shadow-[0_0_${10 * intensity}px_rgba(255,255,255,0.6)]`,
    },
  };

  const colorStyle = glowColors[color] || glowColors.cyan;

  return (
    <Component
      className={`
        ${colorStyle.text} ${colorStyle.glow}
        ${pulse && !prefersReducedMotion ? 'animate-pulse' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * RevealText - Text that reveals on scroll
 */
export function RevealText({
  children,
  direction = 'up',
  delay = 0,
  duration = 500,
  className = '',
  as: Component = 'div',
  ...props
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { ref, isVisible } = useIntersectionAnimation({
    threshold: 0.1,
    delay,
    triggerOnce: true,
  });

  const animations = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8',
    scale: 'scale-95',
  };

  const initialTransform = animations[direction] || animations.up;

  if (prefersReducedMotion) {
    return (
      <Component className={className} {...props}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      ref={ref}
      className={`
        transition-all
        ${className}
      `}
      style={{
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0) scale(1)' : undefined,
      }}
      {...props}
    >
      <span
        className={`
          inline-block
          transition-transform
          ${isVisible ? '' : initialTransform}
        `}
        style={{ transitionDuration: `${duration}ms` }}
      >
        {children}
      </span>
    </Component>
  );
}

/**
 * SplitText - Text that animates word by word
 */
export function SplitText({
  text,
  staggerDelay = 50,
  delay = 0,
  className = '',
  wordClassName = '',
  as: Component = 'div',
  ...props
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { ref, isVisible } = useIntersectionAnimation({
    threshold: 0.1,
    triggerOnce: true,
  });

  const words = useMemo(() => text.split(' '), [text]);

  if (prefersReducedMotion) {
    return (
      <Component className={className} {...props}>
        {text}
      </Component>
    );
  }

  return (
    <Component ref={ref} className={className} {...props}>
      {words.map((word, index) => (
        <span
          key={index}
          className={`
            inline-block mr-[0.25em]
            transition-all duration-500 ease-out
            ${wordClassName}
          `}
          style={{
            transitionDelay: isVisible ? `${delay + index * staggerDelay}ms` : '0ms',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          {word}
        </span>
      ))}
    </Component>
  );
}

/**
 * CountUpText - Animated number counter
 */
export function CountUpText({
  end,
  start = 0,
  duration = 2000,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  as: Component = 'span',
  ...props
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { ref, isVisible } = useIntersectionAnimation({
    threshold: 0.5,
    triggerOnce: true,
  });

  const { count } = useCountUp(isVisible ? end : start, {
    start,
    duration: prefersReducedMotion ? 0 : duration,
    delay,
    decimals,
  });

  return (
    <Component ref={ref} className={className} {...props}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </Component>
  );
}

/**
 * HighlightText - Text with animated highlight background
 */
export function HighlightText({
  children,
  color = 'cyan',
  active = true,
  className = '',
  as: Component = 'span',
  ...props
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const colors = {
    cyan: 'from-cyan-500/20 to-cyan-500/0',
    purple: 'from-purple-500/20 to-purple-500/0',
    pink: 'from-pink-500/20 to-pink-500/0',
    yellow: 'from-yellow-500/30 to-yellow-500/0',
  };

  const colorClass = colors[color] || colors.cyan;

  return (
    <Component
      className={`
        relative inline-block
        ${className}
      `}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <span
        className={`
          absolute inset-0 -inset-x-1
          bg-gradient-to-r ${colorClass}
          rounded
          transition-transform duration-500 origin-left
          ${active ? 'scale-x-100' : 'scale-x-0'}
          ${!prefersReducedMotion && active ? '' : ''}
        `}
      />
    </Component>
  );
}

/**
 * HeadingWithLine - Heading with animated underline
 */
export function HeadingWithLine({
  children,
  lineColor = 'gradient',
  className = '',
  as: Component = 'h2',
  ...props
}) {
  const { ref, isVisible } = useIntersectionAnimation({
    threshold: 0.5,
    triggerOnce: true,
  });

  const lineColors = {
    gradient: 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500',
    cyan: 'bg-cyan-500',
    purple: 'bg-purple-500',
    white: 'bg-white',
  };

  const lineClass = lineColors[lineColor] || lineColors.gradient;

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <Component className="text-white" {...props}>
        {children}
      </Component>
      <div
        className={`
          h-1 mt-2 rounded-full
          ${lineClass}
          transition-all duration-700 ease-out
          ${isVisible ? 'w-full opacity-100' : 'w-0 opacity-0'}
        `}
      />
    </div>
  );
}

export default {
  TypewriterText,
  GradientText,
  GlowText,
  RevealText,
  SplitText,
  CountUpText,
  HighlightText,
  HeadingWithLine,
};
