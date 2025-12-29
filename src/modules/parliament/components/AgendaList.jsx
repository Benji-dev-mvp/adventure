import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle, ChevronRight, Flame, TrendingDown } from 'lucide-react';
import { GlassCard, GlassCardContent, GradientText } from '../../../components/futuristic';

const PRIORITY_CONFIG = {
  critical: {
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    icon: Flame,
  },
  high: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: AlertTriangle,
  },
  medium: {
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    icon: TrendingDown,
  },
  low: {
    color: 'text-slate-400',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    icon: Clock,
  },
};

const STATUS_CONFIG = {
  debating: {
    label: 'In Debate',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    pulse: true,
  },
  pending: {
    label: 'Pending',
    color: 'text-slate-400',
    bg: 'bg-slate-500/10',
    pulse: false,
  },
  resolved: {
    label: 'Resolved',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    pulse: false,
  },
};

const AgendaItem = ({ agenda, isSelected, onSelect }) => {
  const priorityConfig = PRIORITY_CONFIG[agenda.priority];
  const statusConfig = STATUS_CONFIG[agenda.status];
  const PriorityIcon = priorityConfig.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        p-4 rounded-xl border cursor-pointer transition-all
        ${
          isSelected
            ? 'bg-white/5 border-cyan-500/30 shadow-lg shadow-cyan-500/10'
            : 'bg-slate-800/30 border-white/5 hover:bg-white/5 hover:border-white/10'
        }
      `}
      onClick={() => onSelect(agenda)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${priorityConfig.bg}`}>
            <PriorityIcon className={`w-3.5 h-3.5 ${priorityConfig.color}`} />
          </div>
          <span
            className={`
            px-2 py-0.5 rounded-full text-xs font-medium
            ${statusConfig.bg} ${statusConfig.color}
            ${statusConfig.pulse ? 'animate-pulse' : ''}
          `}
          >
            {statusConfig.label}
          </span>
        </div>
        <ChevronRight
          className={`w-4 h-4 transition-colors ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`}
        />
      </div>

      <h4 className={`font-medium mb-1 ${isSelected ? 'text-slate-100' : 'text-slate-300'}`}>
        {agenda.title}
      </h4>

      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{agenda.description}</p>

      {/* Metrics */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(agenda.metrics)
          .slice(0, 2)
          .map(([key, value]) => (
            <span key={key} className="px-2 py-1 bg-slate-800/50 rounded text-xs text-slate-400">
              {key.replace(/([A-Z])/g, ' $1').trim()}:
              <span
                className={`ml-1 ${String(value).startsWith('-') ? 'text-rose-400' : String(value).startsWith('+') ? 'text-emerald-400' : 'text-slate-300'}`}
              >
                {value}
              </span>
            </span>
          ))}
      </div>

      {/* Resolution note for resolved items */}
      {agenda.status === 'resolved' && agenda.resolution && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <CheckCircle className="w-3 h-3" />
            {agenda.resolution}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export function AgendaList({ agendas, selected, onSelect, loading }) {
  if (loading) {
    return (
      <GlassCard variant="subtle" className="h-full">
        <GlassCardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-slate-700 rounded w-32" />
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-slate-800/50 rounded-xl" />
            ))}
          </div>
        </GlassCardContent>
      </GlassCard>
    );
  }

  const debating = agendas.filter(a => a.status === 'debating');
  const pending = agendas.filter(a => a.status === 'pending');
  const resolved = agendas.filter(a => a.status === 'resolved');

  return (
    <GlassCard variant="subtle" className="h-full overflow-hidden">
      <GlassCardContent className="p-6 h-full overflow-y-auto">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Debate Agenda</h3>

        {/* In Debate */}
        {debating.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <h4 className="text-sm font-medium text-purple-400">Currently Debating</h4>
            </div>
            <div className="space-y-3">
              {debating.map(agenda => (
                <AgendaItem
                  key={agenda.id}
                  agenda={agenda}
                  isSelected={selected?.id === agenda.id}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pending */}
        {pending.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-slate-500" />
              <h4 className="text-sm font-medium text-slate-400">Pending Review</h4>
            </div>
            <div className="space-y-3">
              {pending.map(agenda => (
                <AgendaItem
                  key={agenda.id}
                  agenda={agenda}
                  isSelected={selected?.id === agenda.id}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        )}

        {/* Resolved */}
        {resolved.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <h4 className="text-sm font-medium text-emerald-400">Resolved</h4>
            </div>
            <div className="space-y-3">
              {resolved.map(agenda => (
                <AgendaItem
                  key={agenda.id}
                  agenda={agenda}
                  isSelected={selected?.id === agenda.id}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        )}
      </GlassCardContent>
    </GlassCard>
  );
}

export default AgendaList;
