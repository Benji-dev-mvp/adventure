import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard, GlassCardContent } from '../../../components/futuristic';
import { Badge } from '../../../components/ui/Badge';

export function AgentRow({ agents, activeAgents = [] }) {
  return (
    <div className="flex items-center justify-center gap-4 py-4">
      {agents.map((agent, index) => {
        const isActive = activeAgents.includes(agent.id);

        return (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
          >
            <div
              className={`
                relative p-4 rounded-2xl border transition-all cursor-pointer
                ${
                  isActive
                    ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 shadow-lg'
                    : 'bg-slate-800/50 border-white/5 hover:border-white/10'
                }
              `}
              style={{
                boxShadow: isActive ? `0 0 30px ${agent.color}30` : 'none',
              }}
            >
              {/* Avatar */}
              <div
                className="text-3xl mb-2 text-center"
                style={{ filter: isActive ? 'none' : 'grayscale(0.5)' }}
              >
                {agent.avatar}
              </div>

              {/* Name */}
              <p
                className={`text-sm font-medium text-center ${isActive ? 'text-slate-100' : 'text-slate-400'}`}
              >
                {agent.name}
              </p>

              {/* Role */}
              <p className="text-xs text-slate-500 text-center mt-0.5">{agent.role}</p>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                  style={{ backgroundColor: agent.color }}
                />
              )}
            </div>

            {/* Tooltip on hover */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
              <div className="bg-slate-900 border border-white/10 rounded-lg p-3 shadow-xl min-w-48">
                <p className="text-sm text-slate-300 mb-2">{agent.description}</p>
                <div className="flex flex-wrap gap-1">
                  {agent.strengths.map((strength, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-xs rounded-full"
                      style={{
                        backgroundColor: `${agent.color}20`,
                        color: agent.color,
                      }}
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default AgentRow;
