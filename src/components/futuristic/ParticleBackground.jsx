/**
 * ParticleBackground - Animated particle/orb background effects
 */
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { usePrefersReducedMotion, useMousePosition } from '../../hooks/useAnimations';

/**
 * Orb - Single animated orb/blob
 */
function Orb({
  size = 400,
  color = 'cyan',
  x = 50,
  y = 50,
  blur = 100,
  opacity = 0.3,
  animate = true,
  duration = 20,
  className = '',
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const colors = {
    cyan: 'bg-cyan-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    orange: 'bg-orange-500',
    gradient: 'bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500',
  };

  const colorClass = colors[color] || colors.cyan;

  return (
    <div
      className={`
        absolute rounded-full
        ${colorClass}
        ${animate && !prefersReducedMotion ? 'animate-[blob_25s_ease-in-out_infinite]' : ''}
        ${className}
      `}
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        filter: `blur(${blur}px)`,
        opacity,
        animationDuration: `${duration}s`,
        animationDelay: `${Math.random() * -duration}s`,
      }}
    />
  );
}

/**
 * ParticleBackground - Container with multiple animated orbs
 */
export function ParticleBackground({
  variant = 'default',
  children,
  className = '',
  overlay = true,
  noise = true,
  ...props
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const variants = {
    default: [
      { size: 600, color: 'purple', x: 20, y: 20, blur: 150, opacity: 0.3, duration: 25 },
      { size: 500, color: 'cyan', x: 80, y: 30, blur: 120, opacity: 0.25, duration: 30 },
      { size: 400, color: 'pink', x: 50, y: 80, blur: 100, opacity: 0.2, duration: 20 },
    ],
    aurora: [
      { size: 800, color: 'gradient', x: 30, y: 20, blur: 200, opacity: 0.4, duration: 30 },
      { size: 600, color: 'purple', x: 70, y: 50, blur: 150, opacity: 0.3, duration: 25 },
      { size: 500, color: 'cyan', x: 20, y: 70, blur: 120, opacity: 0.25, duration: 20 },
    ],
    minimal: [
      { size: 500, color: 'purple', x: 80, y: 20, blur: 150, opacity: 0.15, duration: 30 },
      { size: 400, color: 'cyan', x: 20, y: 80, blur: 120, opacity: 0.1, duration: 25 },
    ],
    intense: [
      { size: 700, color: 'cyan', x: 10, y: 10, blur: 100, opacity: 0.4, duration: 20 },
      { size: 600, color: 'purple', x: 90, y: 20, blur: 120, opacity: 0.35, duration: 25 },
      { size: 500, color: 'pink', x: 50, y: 50, blur: 100, opacity: 0.3, duration: 15 },
      { size: 400, color: 'blue', x: 30, y: 80, blur: 80, opacity: 0.25, duration: 30 },
      { size: 350, color: 'green', x: 70, y: 90, blur: 70, opacity: 0.2, duration: 22 },
    ],
  };

  const orbs = variants[variant] || variants.default;

  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      {/* Background base */}
      <div className="absolute inset-0 bg-[#030712]" />

      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {orbs.map((orb, index) => (
          <Orb key={index} {...orb} animate={!prefersReducedMotion} />
        ))}
      </div>

      {/* Grid overlay */}
      {overlay && (
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      )}

      {/* Noise texture */}
      {noise && (
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* Radial gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(3,7,18,0.5) 70%, rgba(3,7,18,0.8) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * FloatingParticles - Small floating particle dots
 */
export function FloatingParticles({
  count = 50,
  color = 'white',
  minSize = 1,
  maxSize = 3,
  className = '',
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: minSize + Math.random() * (maxSize - minSize),
      duration: 10 + Math.random() * 20,
      delay: Math.random() * -30,
    }));
  }, [count, minSize, maxSize]);

  const colorClasses = {
    white: 'bg-white',
    cyan: 'bg-cyan-400',
    purple: 'bg-purple-400',
    mixed: '', // Will use random colors
  };

  const mixedColors = ['bg-cyan-400', 'bg-purple-400', 'bg-pink-400', 'bg-blue-400'];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`
            absolute rounded-full
            ${color === 'mixed' ? mixedColors[particle.id % mixedColors.length] : colorClasses[color]}
            ${!prefersReducedMotion ? 'animate-[float_ease-in-out_infinite]' : ''}
          `}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: 0.3 + Math.random() * 0.4,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * MouseFollowGlow - Glow effect that follows mouse
 */
export function MouseFollowGlow({
  size = 400,
  color = 'cyan',
  opacity = 0.15,
  blur = 100,
  className = '',
}) {
  const containerRef = useRef(null);
  const { position } = useMousePosition();
  const [localPosition, setLocalPosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) return;

    const rect = containerRef.current.getBoundingClientRect();
    setLocalPosition({
      x: position.x - rect.left,
      y: position.y - rect.top,
    });
  }, [position, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  const colors = {
    cyan: 'bg-cyan-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    gradient: 'bg-gradient-to-br from-cyan-500 to-purple-500',
  };

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div
        className={`absolute rounded-full ${colors[color]} transition-transform duration-300 ease-out`}
        style={{
          width: size,
          height: size,
          left: localPosition.x,
          top: localPosition.y,
          transform: 'translate(-50%, -50%)',
          filter: `blur(${blur}px)`,
          opacity,
        }}
      />
    </div>
  );
}

/**
 * GradientMesh - Animated mesh gradient background
 */
export function GradientMesh({ className = '' }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div
        className={`
          absolute inset-0
          ${!prefersReducedMotion ? 'animate-[gradient-shift_15s_ease_infinite]' : ''}
        `}
        style={{
          background: `
            radial-gradient(at 40% 20%, rgba(168, 85, 247, 0.3) 0px, transparent 50%),
            radial-gradient(at 80% 0%, rgba(0, 245, 255, 0.2) 0px, transparent 50%),
            radial-gradient(at 0% 50%, rgba(236, 72, 153, 0.2) 0px, transparent 50%),
            radial-gradient(at 80% 50%, rgba(59, 130, 246, 0.2) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(16, 185, 129, 0.2) 0px, transparent 50%),
            radial-gradient(at 80% 100%, rgba(168, 85, 247, 0.2) 0px, transparent 50%)
          `,
          backgroundSize: '200% 200%',
        }}
      />
    </div>
  );
}

/**
 * StarField - Animated star background
 */
export function StarField({ count = 100, className = '' }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.7,
      twinkle: Math.random() > 0.7,
      duration: 2 + Math.random() * 3,
    }));
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {stars.map((star) => (
        <div
          key={star.id}
          className={`
            absolute rounded-full bg-white
            ${star.twinkle && !prefersReducedMotion ? 'animate-[pulse_ease-in-out_infinite]' : ''}
          `}
          style={{
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default ParticleBackground;
