import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Settings,
  Play,
  ThumbsUp,
  ThumbsDown,
  Edit3,
} from 'lucide-react';
import { GlassCard, GlassCardContent } from '../../../components/futuristic';
import { Button } from '../../../components/ui/Button';

const RISK_CONFIG = {
  low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Low Risk' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Medium Risk' },
  high: { color: 'text-rose-400', bg: 'bg-rose-500/10', label: 'High Risk' },
};

export function ResolutionPanel({ resolution, selectedAgenda, loading }) {
  if (loading) {
    return (
      <GlassCard variant="subtle" className="h-full">
        <GlassCardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-slate-700 rounded w-24" />
            <div className="h-20 bg-slate-800/50 rounded-lg" />
            <div className="h-32 bg-slate-800/50 rounded-lg" />
          </div>
        </GlassCardContent>
      </GlassCard>
    );
  }

  if (!selectedAgenda) {
    return (
      <GlassCard variant="subtle" className="h-full">
        <GlassCardContent className="p-4 h-full flex items-center justify-center text-slate-400 text-center">
          <div>
            <CheckCircle className="w-12 h-9 mx-auto mb-3 opacity-30" />
            <p>Select an agenda to view resolution</p>
          </div>
        </GlassCardContent>
      </GlassCard>
    );
  }

  if (!resolution) {
    return (
      <GlassCard variant="subtle" className="h-full">
        <GlassCardContent className="p-4">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Resolution</h3>

          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
            <p className="text-slate-300 font-medium mb-2">Debate in Progress</p>
            <p className="text-sm text-slate-500">
              The agents are analyzing the agenda and formulating recommendations.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-xs text-slate-500 mb-3">Quick Actions</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Settings className="w-4 h-4 mr-2" />
                Modify Constraints
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Play className="w-4 h-4 mr-2" />
                Fast-track
              </Button>
            </div>
          </div>
        </GlassCardContent>
      </GlassCard>
    );
  }

  const riskConfig = RISK_CONFIG[resolution.riskLevel];

  return (
    <GlassCard variant="gradient" className="h-full">
      <GlassCardContent className="p-4 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-100">Resolution</h3>
          <div
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${riskConfig.bg} ${riskConfig.color}`}
          >
            {riskConfig.label}
          </div>
        </div>

        {/* Recommended Strategy */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/20 mb-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-medium text-slate-200">Recommended Strategy</h4>
          </div>
          <p className="text-slate-100 font-medium">{resolution.strategy}</p>
        </motion.div>

        {/* Strategy Details */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Implementation Details</h4>
          <div className="space-y-2">
            {resolution.details.map((detail, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 p-3 bg-slate-800/50 rounded-lg"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">{detail}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-4 bg-slate-800/50 rounded-lg text-center">
            <p className="text-lg font-bold text-emerald-400">{resolution.expectedUplift}</p>
            <p className="text-xs text-slate-500 mt-1">Expected Uplift</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg text-center">
            <p className="text-lg font-bold text-cyan-400">{resolution.confidence}%</p>
            <p className="text-xs text-slate-500 mt-1">Confidence</p>
          </div>
        </div>

        {/* Voting Result */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Agent Voting</h4>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-slate-300">
                {resolution.votingResult.approve} Approve
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-slate-300">
                {resolution.votingResult.modify} Modify
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsDown className="w-4 h-4 text-rose-400" />
              <span className="text-sm text-slate-300">
                {resolution.votingResult.reject} Reject
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500">
            <Play className="w-4 h-4 mr-2" />
            Approve & Execute
          </Button>
          <Button variant="outline" className="flex-1">
            <Settings className="w-4 h-4 mr-2" />
            Modify
          </Button>
        </div>
      </GlassCardContent>
    </GlassCard>
  );
}

export default ResolutionPanel;
