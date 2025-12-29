import React from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  AlertTriangle,
  ChevronRight,
  Target,
  Clock,
  MoreVertical,
} from 'lucide-react';
import { GlassCard, GlassCardContent } from '../../../components/futuristic';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';

const STATUS_CONFIG = {
  running: {
    label: 'Running',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: Play,
    pulse: true,
  },
  paused: {
    label: 'Paused',
    color: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    icon: Pause,
    pulse: false,
  },
  'at-risk': {
    label: 'At Risk',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    icon: AlertTriangle,
    pulse: true,
  },
};

const RISK_CONFIG = {
  low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10' },
  high: { color: 'text-rose-400', bg: 'bg-rose-500/10' },
};

const ProgramRow = ({ program, isSelected, onSelect }) => {
  const statusConfig = STATUS_CONFIG[program.status];
  const riskConfig = RISK_CONFIG[program.currentRisk];
  const StatusIcon = statusConfig.icon;

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`
        cursor-pointer transition-colors border-b border-white/5 last:border-b-0
        ${isSelected ? 'bg-cyan-500/10' : 'hover:bg-white/5'}
      `}
      onClick={() => onSelect(program)}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-2 h-2 rounded-full ${statusConfig.pulse ? 'animate-pulse' : ''} ${
              program.status === 'running'
                ? 'bg-emerald-400'
                : program.status === 'at-risk'
                  ? 'bg-amber-400'
                  : 'bg-slate-400'
            }`}
          />
          <div>
            <p className="font-medium text-slate-100">{program.name}</p>
            <p className="text-xs text-slate-400">{program.segment}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Target className="w-4 h-4 text-cyan-400" />
          {program.goal}
        </div>
      </td>
      <td className="py-3 px-4">
        <span
          className={`
          inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
          border ${statusConfig.color}
        `}
        >
          <StatusIcon className="w-3 h-3" />
          {statusConfig.label}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock className="w-4 h-4" />
          {program.nextActionEta}
        </div>
      </td>
      <td className="py-3 px-4">
        <span
          className={`
          inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
          ${riskConfig.bg} ${riskConfig.color}
        `}
        >
          {program.currentRisk.charAt(0).toUpperCase() + program.currentRisk.slice(1)}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
              style={{ width: `${program.progress}%` }}
            />
          </div>
          <span className="text-xs text-slate-400">{program.progress}%</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <ChevronRight
          className={`w-4 h-4 transition-colors ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`}
        />
      </td>
    </motion.tr>
  );
};

const ProgramTableSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-lg">
        <Skeleton className="w-2 h-2 rounded-full" />
        <div className="flex-1">
          <Skeleton className="w-32 h-4 mb-1" />
          <Skeleton className="w-20 h-3" />
        </div>
        <Skeleton className="w-16 h-5" />
        <Skeleton className="w-20 h-5" />
        <Skeleton className="w-24 h-3" />
      </div>
    ))}
  </div>
);

export function ProgramTable({ programs, loading, selectedProgram, onSelectProgram }) {
  if (loading) {
    return (
      <GlassCard variant="subtle">
        <GlassCardContent className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-100">Autonomous Programs</h3>
          </div>
          <ProgramTableSkeleton />
        </GlassCardContent>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="subtle">
      <GlassCardContent className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">Autonomous Programs</h3>
            <p className="text-sm text-slate-400 mt-1">
              {programs.filter(p => p.status === 'running').length} running •
              {programs.filter(p => p.status === 'at-risk').length} at risk
            </p>
          </div>
          <Button variant="ghost" size="sm" className="text-slate-400">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <th className="pb-3 px-4">Program</th>
                <th className="pb-3 px-4">Goal</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4">Next Action</th>
                <th className="pb-3 px-4">Risk</th>
                <th className="pb-3 px-4">Progress</th>
                <th className="pb-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {programs.map(program => (
                <ProgramRow
                  key={program.id}
                  program={program}
                  isSelected={selectedProgram?.id === program.id}
                  onSelect={onSelectProgram}
                />
              ))}
            </tbody>
          </table>
        </div>
      </GlassCardContent>
    </GlassCard>
  );
}

export default ProgramTable;
