import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, CheckCircle, Info,
  Target, MessageSquare, Radio, Users
} from 'lucide-react';
import { GlassCard, GlassCardContent } from '../../../components/futuristic';

const RISK_ICONS = {
  'market-fit': Target,
  'message-fit': MessageSquare,
  'channel-saturation': Radio,
  'capacity': Users,
};

const RISK_COLORS = {
  high: { bar: 'bg-rose-500', text: 'text-rose-400', bg: 'bg-rose-500/10' },
  medium: { bar: 'bg-amber-500', text: 'text-amber-400', bg: 'bg-amber-500/10' },
  low: { bar: 'bg-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
};

const RiskBar = ({ risk }) => {
  const colors = RISK_COLORS[risk.level];
  const Icon = RISK_ICONS[risk.id] || AlertTriangle;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="group"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${colors.text}`} />
          <span className="text-sm text-slate-300">{risk.label}</span>
        </div>
        <span className={`text-sm font-medium ${colors.text}`}>
          {risk.score}%
        </span>
      </div>
      
      <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${risk.score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`absolute inset-y-0 left-0 rounded-full ${colors.bar}`}
        />
      </div>

      {/* Tooltip on hover */}
      <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-xs text-slate-500">{risk.description}</p>
      </div>
    </motion.div>
  );
};

export function RiskBreakdown({ risks, recommendation, activeStrategyData }) {
  if (!risks || risks.length === 0) {
    return (
      <GlassCard variant="subtle">
        <GlassCardContent className="p-6">
          <div className="text-center py-8 text-slate-400">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Select a strategy to view risk analysis</p>
          </div>
        </GlassCardContent>
      </GlassCard>
    );
  }

  const overallRisk = Math.round(risks.reduce((sum, r) => sum + r.score, 0) / risks.length);
  const overallLevel = overallRisk >= 60 ? 'high' : overallRisk >= 40 ? 'medium' : 'low';
  const overallColors = RISK_COLORS[overallLevel];

  return (
    <GlassCard variant="subtle">
      <GlassCardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-100">Risk Breakdown</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${overallColors.bg} ${overallColors.text}`}>
            {overallLevel.charAt(0).toUpperCase() + overallLevel.slice(1)} Risk ({overallRisk}%)
          </div>
        </div>

        {/* Risk bars */}
        <div className="space-y-4 mb-6">
          {risks.map((risk, index) => (
            <RiskBar key={risk.id} risk={risk} />
          ))}
        </div>

        {/* Recommendation */}
        {recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-500/20"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <Info className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h4 className="font-medium text-slate-100 mb-1">System Recommendation</h4>
                <p className="text-sm text-slate-400">{recommendation.reason}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Summary stats */}
        {activeStrategyData?.summary && (
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
            <div className="text-center p-3 bg-slate-800/50 rounded-lg">
              <p className="text-2xl font-bold text-emerald-400">
                ${(activeStrategyData.summary.projectedPipeline / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-slate-500">Projected Pipeline</p>
            </div>
            <div className="text-center p-3 bg-slate-800/50 rounded-lg">
              <p className="text-2xl font-bold text-cyan-400">
                {activeStrategyData.summary.confidence}%
              </p>
              <p className="text-xs text-slate-500">Confidence</p>
            </div>
          </div>
        )}
      </GlassCardContent>
    </GlassCard>
  );
}

export default RiskBreakdown;
