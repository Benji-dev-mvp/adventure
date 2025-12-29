import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { GlassCard, GlassCardContent, GradientText } from '../../components/futuristic';
import { 
  Hexagon, Filter, Clock, Eye, EyeOff,
  ChevronDown, Sparkles 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';

import { HiveCanvas } from './components/HiveCanvas';
import { ClusterSummaryPanel } from './components/ClusterSummaryPanel';
import { useLeadHive } from './hooks/useLeadHive';

export function LeadHivePage() {
  const {
    clusters,
    leadPoints,
    loading,
    filters,
    setFilters,
    selectedCluster,
    setSelectedCluster,
    hoveredPoint,
    setHoveredPoint,
    summary,
    topClusters,
  } = useLeadHive();

  const handleSegmentChange = (value) => {
    setFilters(prev => ({ ...prev, segment: value }));
  };

  const handleTimeHorizonChange = (value) => {
    setFilters(prev => ({ ...prev, timeHorizon: parseInt(value) }));
  };

  const handleToggleSynthetic = () => {
    setFilters(prev => ({ ...prev, showSynthetic: !prev.showSynthetic }));
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full p-6 gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20">
              <Hexagon className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                <GradientText gradient="cyber">Lead Hive</GradientText>
              </h1>
              <p className="text-slate-400 mt-1">
                Future intent visualization and cluster analysis
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Segment dropdown */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-xl border border-white/5">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filters.segment}
                onChange={(e) => handleSegmentChange(e.target.value)}
                className="bg-transparent text-sm text-slate-300 outline-none cursor-pointer"
              >
                <option value="all">All Segments</option>
                <option value="startups">Startups</option>
                <option value="midmarket">Midmarket</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            {/* Time horizon */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-xl border border-white/5">
              <Clock className="w-4 h-4 text-slate-400" />
              <select
                value={filters.timeHorizon}
                onChange={(e) => handleTimeHorizonChange(e.target.value)}
                className="bg-transparent text-sm text-slate-300 outline-none cursor-pointer"
              >
                <option value="7">Next 7 days</option>
                <option value="14">Next 14 days</option>
                <option value="30">Next 30 days</option>
              </select>
            </div>

            {/* Synthetic toggle */}
            <button
              onClick={handleToggleSynthetic}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors
                ${filters.showSynthetic 
                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                  : 'bg-slate-800/50 border-white/5 text-slate-400'
                }
              `}
            >
              {filters.showSynthetic ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
              <span className="text-sm">Synthetic Predictions</span>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 gap-6 min-h-0">
          {/* Canvas area */}
          <div className="flex-1">
            <HiveCanvas
              clusters={clusters}
              leadPoints={leadPoints}
              selectedCluster={selectedCluster}
              onSelectCluster={setSelectedCluster}
              hoveredPoint={hoveredPoint}
              onHoverPoint={setHoveredPoint}
              onLeavePoint={() => setHoveredPoint(null)}
              loading={loading}
            />
          </div>

          {/* Right panel */}
          <div className="w-80 flex-shrink-0">
            <ClusterSummaryPanel
              topClusters={topClusters}
              summary={summary}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default LeadHivePage;
