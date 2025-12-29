import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, Brain, Zap, ChevronDown, ChevronUp,
  TrendingUp, TrendingDown, AlertTriangle, Check,
  X, ArrowRight, Calendar
} from 'lucide-react';
import { GlassCard, GlassCardContent, GradientText } from '../../../components/futuristic';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';

const TYPE_CONFIG = {
  strategy_update: {
    label: 'Strategy Update',
    color: 'cyan',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400',
    icon: Compass,
  },
  model_change: {
    label: 'Model Change',
    color: 'purple',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400',
    icon: Brain,
  },
  intervention: {
    label: 'Intervention',
    color: 'orange',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    textColor: 'text-orange-400',
    icon: Zap,
  },
};

const IMPACT_CONFIG = {
  low: { color: 'text-slate-400', bg: 'bg-slate-500/10' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10' },
  critical: { color: 'text-rose-400', bg: 'bg-rose-500/10' },
};

const TimelineNode = ({ decision, isExpanded, onToggle, isLast }) => {
  const typeConfig = TYPE_CONFIG[decision.type];
  const impactConfig = IMPACT_CONFIG[decision.impact];
  const Icon = typeConfig.icon;
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="relative">
      {/* Connecting line */}
      {!isLast && (
        <div className="absolute left-6 top-14 bottom-0 w-px bg-gradient-to-b from-white/20 to-transparent" />
      )}
      
      <motion.div
        layout
        className={`
          relative flex gap-4 p-4 rounded-xl cursor-pointer transition-colors
          ${isExpanded ? 'bg-white/5' : 'hover:bg-white/5'}
        `}
        onClick={onToggle}
      >
        {/* Timeline marker */}
        <div className="flex flex-col items-center">
          <div className={`
            relative z-10 p-2.5 rounded-xl border
            ${typeConfig.bgColor} ${typeConfig.borderColor}
          `}>
            <Icon className={`w-4 h-4 ${typeConfig.textColor}`} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`
                  px-2 py-0.5 rounded text-xs font-medium
                  ${typeConfig.bgColor} ${typeConfig.textColor}
                `}>
                  {typeConfig.label}
                </span>
                <span className={`
                  px-2 py-0.5 rounded text-xs
                  ${impactConfig.bg} ${impactConfig.color}
                `}>
                  {decision.impact.charAt(0).toUpperCase() + decision.impact.slice(1)} Impact
                </span>
              </div>
              <h4 className="font-medium text-slate-100">{decision.title}</h4>
              <p className="text-sm text-slate-400 mt-1">{decision.program}</p>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(decision.timestamp)}
              </div>
              <span>{formatTime(decision.timestamp)}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </div>

          {/* Expanded content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-white/5">
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    {decision.description}
                  </p>
                  
                  {/* Metrics */}
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(decision.metrics).map(([key, value]) => (
                      <div 
                        key={key}
                        className="px-3 py-2 bg-slate-800/50 rounded-lg border border-white/5"
                      >
                        <p className="text-xs text-slate-500 mb-0.5">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className={`text-sm font-medium ${
                          String(value).startsWith('+') ? 'text-emerald-400' :
                          String(value).startsWith('-') ? 'text-rose-400' :
                          'text-slate-200'
                        }`}>
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const TimelineSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex gap-4 p-4">
        <Skeleton className="w-11 h-11 rounded-xl" />
        <div className="flex-1">
          <div className="flex gap-2 mb-2">
            <Skeleton className="w-24 h-5 rounded" />
            <Skeleton className="w-20 h-5 rounded" />
          </div>
          <Skeleton className="w-48 h-5 mb-1" />
          <Skeleton className="w-32 h-4" />
        </div>
      </div>
    ))}
  </div>
);

export function DecisionTimeline({ decisions, loading }) {
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredDecisions = filter === 'all' 
    ? decisions 
    : decisions.filter(d => d.type === filter);

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <GlassCard variant="subtle">
        <GlassCardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-100">Decision Timeline</h3>
          </div>
          <TimelineSkeleton />
        </GlassCardContent>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="subtle">
      <GlassCardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">Decision Timeline</h3>
            <p className="text-sm text-slate-400 mt-1">
              System decisions and autonomous interventions
            </p>
          </div>
          
          {/* Filter buttons */}
          <div className="flex items-center gap-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'intervention', label: 'Interventions' },
              { key: 'strategy_update', label: 'Strategy' },
              { key: 'model_change', label: 'Model' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                  ${filter === key 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                    : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filteredDecisions.map((decision, index) => (
            <TimelineNode
              key={decision.id}
              decision={decision}
              isExpanded={expandedId === decision.id}
              onToggle={() => toggleExpanded(decision.id)}
              isLast={index === filteredDecisions.length - 1}
            />
          ))}
        </div>

        {filteredDecisions.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No decisions found for this filter</p>
          </div>
        )}
      </GlassCardContent>
    </GlassCard>
  );
}

export default DecisionTimeline;
