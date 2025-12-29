import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Scale, Shield, Check, Target } from 'lucide-react';

const MODEL_CONFIG = {
  aggressive: {
    icon: Zap,
    color: '#ef4444',
    gradient: 'from-red-500/20 to-orange-500/20',
    border: 'border-red-500/30',
  },
  balanced: {
    icon: Scale,
    color: '#06b6d4',
    gradient: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/30',
  },
  conservative: {
    icon: Shield,
    color: '#10b981',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
  },
};

export function StrategySelector({ strategies, activeStrategy, onSelect, recommendation }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {strategies.map(strategy => {
        const isActive = activeStrategy === strategy.id;
        const isRecommended = recommendation?.strategyId === strategy.id;
        const config = MODEL_CONFIG[strategy.model];
        const Icon = config.icon;

        return (
          <motion.button
            key={strategy.id}
            onClick={() => onSelect(strategy.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative flex-1 p-4 rounded-lg border transition-all text-left
              ${
                isActive
                  ? `bg-gradient-to-br ${config.gradient} ${config.border}`
                  : 'bg-slate-800/50 border-white/5 hover:border-white/10'
              }
            `}
          >
            {/* Recommended badge */}
            {isRecommended && (
              <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-emerald-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                <Target className="w-3 h-3" />
                Recommended
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${config.color}20` }}>
                <Icon className="w-5 h-5" style={{ color: config.color }} />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-100">{strategy.name}</span>
                  {isActive && (
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                  )}
                </div>
                <p className="text-sm text-slate-400 mb-2">{strategy.label}</p>
                <p className="text-xs text-slate-500">{strategy.description}</p>
              </div>
            </div>

            {/* Active check */}
            {isActive && (
              <div
                className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: config.color }}
              >
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

export default StrategySelector;
