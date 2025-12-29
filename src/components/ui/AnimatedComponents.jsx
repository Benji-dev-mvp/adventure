import React, { useState, useEffect, useRef } from 'react';

// Animated Counter Component
export const AnimatedCounter = ({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  decimals = 0,
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuad = progress * (2 - progress);
      const currentCount =
        decimals > 0 ? (easeOutQuad * end).toFixed(decimals) : Math.floor(easeOutQuad * end);

      setCount(currentCount);
      countRef.current = currentCount;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(decimals > 0 ? end.toFixed(decimals) : end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, decimals]);

  return (
    <span>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

// Live Status Indicator
export const LiveIndicator = ({ label = 'LIVE', color = 'red' }) => {
  const colors = {
    red: 'bg-red-500/10 border-red-500/30 text-red-500 bg-red-400',
    green: 'bg-green-500/10 border-green-500/30 text-green-500 bg-green-400',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-500 bg-blue-400',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-500 bg-purple-400',
    orange: 'bg-orange-500/10 border-orange-500/30 text-orange-500 bg-orange-400',
  };

  const colorClasses = colors[color] || colors.red;
  const [bg, border, text, ping] = colorClasses.split(' ');

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${bg} border ${border}`}>
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${ping} opacity-75`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${text.replace('text-', 'bg-')}`}
        ></span>
      </span>
      <span className={`text-xs font-bold ${text} tracking-wider`}>{label}</span>
    </div>
  );
};

// Animated Progress Bar
export const AnimatedProgress = ({ value, color = 'cyan', label, className = '' }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const colorMap = {
    cyan: 'from-cyan-400 to-cyan-600',
    purple: 'from-purple-400 to-purple-600',
    pink: 'from-pink-400 to-pink-600',
    emerald: 'from-emerald-400 to-emerald-600',
    amber: 'from-amber-400 to-amber-600',
    blue: 'from-blue-400 to-blue-600',
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <div className="text-xs text-slate-600 dark:text-slate-400 flex justify-between">
          <span>{label}</span>
          <span className="font-bold">{value}%</span>
        </div>
      )}
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colorMap[color] || colorMap.cyan} transition-all duration-1000 ease-out rounded-full relative`}
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

// Pulsing Dot
export const PulsingDot = ({ color = 'green', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
  };

  const colorClasses = {
    green: 'bg-green-500 bg-green-400',
    red: 'bg-red-500 bg-red-400',
    blue: 'bg-blue-500 bg-blue-400',
    amber: 'bg-amber-500 bg-amber-400',
    purple: 'bg-purple-500 bg-purple-400',
  };

  const [bg, ping] = (colorClasses[color] || colorClasses.green).split(' ');

  return (
    <span className="relative flex">
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full ${ping} opacity-75`}
      ></span>
      <span className={`relative inline-flex rounded-full ${sizeClasses[size]} ${bg}`}></span>
    </span>
  );
};

// Futuristic Background
export const FuturisticBackground = () => (
  <div className="fixed inset-0 -z-10 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/20" />

    {/* Animated Orbs */}
    <div
      className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 dark:from-cyan-500/10 dark:to-blue-600/10 rounded-full blur-3xl animate-pulse"
      style={{ animationDuration: '8s' }}
    />
    <div
      className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-600/10 rounded-full blur-3xl animate-pulse"
      style={{ animationDuration: '10s', animationDelay: '2s' }}
    />
    <div
      className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-amber-400/10 to-orange-500/10 dark:from-amber-500/5 dark:to-orange-600/5 rounded-full blur-3xl animate-pulse"
      style={{ animationDuration: '12s', animationDelay: '4s' }}
    />

    {/* Grid Pattern */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:64px_64px]" />
  </div>
);

// Typing Indicator
export const TypingIndicator = () => (
  <div className="flex items-center gap-2 p-4">
    <div className="flex gap-1">
      <span
        className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
        style={{ animationDelay: '0ms' }}
      ></span>
      <span
        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
        style={{ animationDelay: '150ms' }}
      ></span>
      <span
        className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
        style={{ animationDelay: '300ms' }}
      ></span>
    </div>
    <span className="text-sm text-slate-400">Processing...</span>
  </div>
);

// Stat Card with Animation
export const AnimatedStatCard = ({
  icon: Icon,
  label,
  value,
  trend,
  gradient = 'from-cyan-500 to-blue-600',
  className = '',
}) => {
  return (
    <div
      className={`group relative p-4 rounded-lg backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${className}`}
    >
      <div
        className={`absolute inset-0 rounded-lg bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />
      <div className="relative">
        {Icon && (
          <Icon
            className="mb-3 text-slate-400 group-hover:text-white transition-colors"
            size={24}
          />
        )}
        <p className="text-sm text-slate-400 mb-1">{label}</p>
        <p
          className={`text-lg font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
        >
          {typeof value === 'number' ? <AnimatedCounter end={value} /> : value}
        </p>
        {trend && <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">{trend}</p>}
      </div>
    </div>
  );
};

export default {
  AnimatedCounter,
  LiveIndicator,
  AnimatedProgress,
  PulsingDot,
  FuturisticBackground,
  TypingIndicator,
  AnimatedStatCard,
};
