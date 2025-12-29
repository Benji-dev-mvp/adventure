import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, TrendingUp, Target, Zap, Bot } from 'lucide-react';
import { GlassCard, GlassCardContent } from '../../../components/futuristic';
import { Button } from '../../../components/ui/Button';

const ClusterCard = ({ cluster, index }) => {
  const intentColor =
    cluster.avgIntentScore >= 70
      ? 'text-emerald-400'
      : cluster.avgIntentScore >= 50
        ? 'text-cyan-400'
        : 'text-amber-400';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-4 bg-slate-800/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-slate-100 text-sm">{cluster.name}</h4>
          <p className="text-xs text-slate-500">{cluster.segment}</p>
        </div>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cluster.color }} />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-2 bg-slate-900/50 rounded-lg">
          <p className="text-lg font-bold text-slate-100">{cluster.accounts}</p>
          <p className="text-[10px] text-slate-500">Accounts</p>
        </div>
        <div className="text-center p-2 bg-slate-900/50 rounded-lg">
          <p className="text-lg font-bold text-cyan-400">{cluster.potentialMeetings}</p>
          <p className="text-[10px] text-slate-500">Meetings</p>
        </div>
        <div className="text-center p-2 bg-slate-900/50 rounded-lg">
          <p className={`text-lg font-bold ${intentColor}`}>{cluster.avgIntentScore}%</p>
          <p className="text-[10px] text-slate-500">Intent</p>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-3 line-clamp-2">{cluster.recommendedStrategy}</p>

      <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-cyan-500/10 text-cyan-400 text-xs font-medium rounded-lg hover:bg-cyan-500/20 transition-colors">
        <Target className="w-3 h-3" />
        Launch Play
        <ArrowRight className="w-3 h-3" />
      </button>
    </motion.div>
  );
};

const AvaRecommendation = ({ clusters }) => {
  const topCluster = clusters[0];
  if (!topCluster) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="p-4 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-xl border border-purple-500/20"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-purple-500/20">
          <Bot className="w-4 h-4 text-purple-400" />
        </div>
        <h4 className="font-medium text-slate-100 text-sm">Ava's Recommendation</h4>
      </div>

      <p className="text-sm text-slate-300 mb-4 leading-relaxed">
        I've identified{' '}
        <span className="text-cyan-400 font-medium">
          {topCluster.accounts} high-intent accounts
        </span>{' '}
        in the "{topCluster.name}" cluster. Based on current signals, I recommend launching a{' '}
        <span className="text-purple-400 font-medium">multi-touch sequence</span> focusing on{' '}
        {topCluster.segment.toLowerCase()} prospects.
      </p>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center"
            >
              <span className="text-xs text-slate-400">
                {topCluster.topAccounts?.[i - 1]?.name?.charAt(0) || '?'}
              </span>
            </div>
          ))}
        </div>
        <span className="text-xs text-slate-500">+{topCluster.accounts - 3} more</span>
      </div>

      <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium">
        <Zap className="w-4 h-4 mr-2" />
        Launch Play into this Hive
      </Button>
    </motion.div>
  );
};

export function ClusterSummaryPanel({ topClusters, summary, loading }) {
  if (loading) {
    return (
      <GlassCard variant="subtle" className="h-full">
        <GlassCardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-slate-700 rounded w-32" />
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-slate-800/50 rounded-xl" />
              ))}
            </div>
          </div>
        </GlassCardContent>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="subtle" className="h-full">
      <GlassCardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-slate-100">Cluster Summary</h3>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Sparkles className="w-3 h-3 text-purple-400" />
            AI-analyzed
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 bg-slate-800/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-cyan-400">{summary.totalAccounts}</p>
            <p className="text-xs text-slate-500">Total Accounts</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-emerald-400">{summary.totalPotentialMeetings}</p>
            <p className="text-xs text-slate-500">Potential Meetings</p>
          </div>
        </div>

        {/* Top clusters */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Top Active Clusters
          </h4>
          <div className="space-y-3">
            {topClusters.map((cluster, index) => (
              <ClusterCard key={cluster.id} cluster={cluster} index={index} />
            ))}
          </div>
        </div>

        {/* Ava's recommendation */}
        <AvaRecommendation clusters={topClusters} />
      </GlassCardContent>
    </GlassCard>
  );
}

export default ClusterSummaryPanel;
