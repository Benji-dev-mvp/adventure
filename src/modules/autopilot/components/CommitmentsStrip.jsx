import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Users, Briefcase, Sparkles } from 'lucide-react';
import { GlassCard, GlassCardContent, GradientText } from '../../../components/futuristic';
import { Skeleton } from '../../../components/ui/Skeleton';

// Mini sparkline component
const MiniSparkline = ({ data, color = '#06b6d4', height = 32 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`sparkline-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,100 ${points} 100,100`} fill={`url(#sparkline-${color})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

// Progress bar with projected vs actual
const ProgressBar = ({ projected, actual, max }) => {
  const projectedPercent = (projected / max) * 100;
  const actualPercent = (actual / max) * 100;

  return (
    <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
      {/* Projected (lighter background) */}
      <div
        className="absolute inset-y-0 left-0 bg-cyan-900/50 rounded-full"
        style={{ width: `${projectedPercent}%` }}
      />
      {/* Actual */}
      <div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
        style={{ width: `${actualPercent}%` }}
      />
      {/* Target marker */}
      <div
        className="absolute inset-y-0 w-0.5 bg-white/60"
        style={{ left: '100%', transform: 'translateX(-100%)' }}
      />
    </div>
  );
};

const CommitmentCard = ({ commitment, index }) => {
  const icons = [Target, Briefcase, Users];
  const Icon = icons[index % icons.length];
  const isPositive = commitment.forecastMeetings >= commitment.targetMeetings * 0.8;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <GlassCard variant="subtle" className="h-full">
        <GlassCardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                <Icon className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">{commitment.title}</h3>
                <p className="text-xs text-slate-400">
                  {commitment.type === 'quarterly' ? 'Quarter Target' : 'Segment Target'}
                </p>
              </div>
            </div>
            <div
              className={`flex items-center gap-1 text-sm ${isPositive ? 'text-emerald-400' : 'text-amber-400'}`}
            >
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{commitment.confidence}%</span>
            </div>
          </div>

          {/* Sparkline */}
          <div className="mb-4">
            <MiniSparkline data={commitment.trend} color={isPositive ? '#10b981' : '#f59e0b'} />
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Meetings</span>
              <span className="text-slate-200">
                <span className="text-cyan-400">{commitment.forecastMeetings}</span>
                <span className="text-slate-500"> / {commitment.targetMeetings}</span>
              </span>
            </div>
            <ProgressBar
              projected={commitment.forecastMeetings}
              actual={
                commitment.actualValue / (commitment.projectedValue / commitment.forecastMeetings)
              }
              max={commitment.targetMeetings}
            />
          </div>

          {/* Additional metrics */}
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs">
            <div>
              <span className="text-slate-500">Pipeline</span>
              <p className="text-slate-200 font-medium">
                ${(commitment.actualValue / 1000000).toFixed(1)}M
                <span className="text-slate-500">
                  {' '}
                  / ${(commitment.projectedValue / 1000000).toFixed(1)}M
                </span>
              </p>
            </div>
            {commitment.highIntentAccounts && (
              <div className="text-right">
                <span className="text-slate-500">High Intent</span>
                <p className="text-purple-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {commitment.highIntentAccounts} accounts
                </p>
              </div>
            )}
          </div>
        </GlassCardContent>
      </GlassCard>
    </motion.div>
  );
};

const CommitmentsStripSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div>
              <Skeleton className="w-24 h-4 mb-1" />
              <Skeleton className="w-16 h-3" />
            </div>
          </div>
          <Skeleton className="w-12 h-5" />
        </div>
        <Skeleton className="w-full h-8 mb-4" />
        <Skeleton className="w-full h-3 rounded-full" />
      </div>
    ))}
  </div>
);

export function CommitmentsStrip({ commitments, loading }) {
  if (loading) {
    return <CommitmentsStripSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {commitments.map((commitment, index) => (
        <CommitmentCard key={commitment.id} commitment={commitment} index={index} />
      ))}
    </div>
  );
}

export default CommitmentsStrip;
