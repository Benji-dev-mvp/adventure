import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { GlassCard, GlassCardContent } from '../../../components/futuristic';

const MODEL_COLORS = {
  aggressive: { primary: '#ef4444', secondary: '#f97316' },
  balanced: { primary: '#06b6d4', secondary: '#8b5cf6' },
  conservative: { primary: '#10b981', secondary: '#14b8a6' },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 shadow-xl">
        <p className="text-white font-semibold mb-2">{label}</p>
        <p className="text-sm text-cyan-400">Pipeline: ${(payload[0]?.value / 1000).toFixed(0)}K</p>
        <p className="text-xs text-slate-400 mt-1">
          Range: ${(payload[0]?.payload?.low / 1000).toFixed(0)}K - $
          {(payload[0]?.payload?.high / 1000).toFixed(0)}K
        </p>
      </div>
    );
  }
  return null;
};

const SimulationPanel = ({ strategy, projection, isActive }) => {
  const colors = MODEL_COLORS[strategy.model];
  const finalData = projection[projection.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        flex-1 rounded-xl border overflow-hidden transition-all
        ${
          isActive
            ? 'bg-slate-800/50 border-white/20 ring-2 ring-cyan-500/30'
            : 'bg-slate-800/30 border-white/5'
        }
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-slate-100">{strategy.name}</h4>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
            style={{
              backgroundColor: `${colors.primary}20`,
              color: colors.primary,
            }}
          >
            {strategy.model}
          </span>
        </div>
        <p className="text-xs text-slate-500">{strategy.label}</p>
      </div>

      {/* Chart */}
      <div className="h-48 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={projection}>
            <defs>
              <linearGradient id={`gradient-${strategy.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id={`band-${strategy.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.secondary} stopOpacity={0.1} />
                <stop offset="100%" stopColor={colors.secondary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickFormatter={v => `${(v / 1000).toFixed(0)}K`}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Confidence band */}
            <Area
              type="monotone"
              dataKey="high"
              stroke="transparent"
              fill={`url(#band-${strategy.id})`}
            />
            <Area type="monotone" dataKey="low" stroke="transparent" fill="transparent" />

            {/* Main line */}
            <Area
              type="monotone"
              dataKey="pipeline"
              stroke={colors.primary}
              strokeWidth={2}
              fill={`url(#gradient-${strategy.id})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer stats */}
      <div className="p-4 border-t border-white/5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">Projected Pipeline</p>
          <p className="font-bold text-lg" style={{ color: colors.primary }}>
            ${(finalData?.pipeline / 1000).toFixed(0)}K
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Meetings</p>
          <p className="font-bold text-lg text-slate-100">{finalData?.meetings}</p>
        </div>
      </div>
    </motion.div>
  );
};

export function SimulationPanels({ strategies, projections, activeStrategy }) {
  return (
    <GlassCard variant="subtle">
      <GlassCardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">Simulation Field</h3>
            <p className="text-sm text-slate-400 mt-1">6-month pipeline projection by strategy</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-8 h-2 bg-gradient-to-r from-purple-500/50 to-transparent rounded" />
            <span>Confidence band</span>
          </div>
        </div>

        <div className="flex gap-4">
          {strategies.map(strategy => (
            <SimulationPanel
              key={strategy.id}
              strategy={strategy}
              projection={projections[strategy.id] || []}
              isActive={activeStrategy === strategy.id}
            />
          ))}
        </div>
      </GlassCardContent>
    </GlassCard>
  );
}

export default SimulationPanels;
