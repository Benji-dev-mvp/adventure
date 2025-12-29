import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, GlassCardContent } from '../../../components/futuristic';

const ARGUMENT_COLORS = {
  opportunity: '#10b981',
  risk: '#ef4444',
  cost: '#f59e0b',
};

// Position agents in a hexagonal layout
const getAgentPosition = (index, total, radius = 120) => {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: 150 + Math.cos(angle) * radius,
    y: 150 + Math.sin(angle) * radius,
  };
};

// Calculate curved path between two points
const getCurvedPath = (from, to) => {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  // Offset control point toward center for curved effect
  const offsetX = (150 - midX) * 0.3;
  const offsetY = (150 - midY) * 0.3;

  return `M ${from.x} ${from.y} Q ${midX + offsetX} ${midY + offsetY} ${to.x} ${to.y}`;
};

export function DebateRing({ agents, arguments_, selectedAgenda }) {
  const agentPositions = useMemo(() => {
    const positions = {};
    agents.forEach((agent, index) => {
      positions[agent.id] = getAgentPosition(index, agents.length);
    });
    return positions;
  }, [agents]);

  const agentMap = useMemo(() => {
    return agents.reduce((acc, agent) => {
      acc[agent.id] = agent;
      return acc;
    }, {});
  }, [agents]);

  // Get active agents (those involved in current arguments)
  const activeAgentIds = useMemo(() => {
    if (!arguments_ || arguments_.length === 0) return new Set();
    const ids = new Set();
    arguments_.forEach(arg => {
      ids.add(arg.from);
      ids.add(arg.to);
    });
    return ids;
  }, [arguments_]);

  if (!selectedAgenda) {
    return (
      <GlassCard variant="subtle" className="h-full flex items-center justify-center">
        <GlassCardContent className="text-center text-slate-400">
          <p>Select an agenda item to view the debate</p>
        </GlassCardContent>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="subtle" className="h-full">
      <GlassCardContent className="p-6 h-full flex flex-col">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Debate Ring</h3>

        <div className="flex-1 relative">
          <svg viewBox="0 0 300 300" className="w-full h-full max-h-80">
            {/* Center circle */}
            <circle
              cx="150"
              cy="150"
              r="30"
              fill="rgba(6, 182, 212, 0.1)"
              stroke="rgba(6, 182, 212, 0.3)"
              strokeWidth="1"
            />
            <text x="150" y="145" textAnchor="middle" className="text-[10px] fill-slate-400">
              Agenda
            </text>
            <text x="150" y="158" textAnchor="middle" className="text-[8px] fill-slate-500">
              #{selectedAgenda?.id.split('-')[1]}
            </text>

            {/* Argument lines */}
            {arguments_.map((arg, index) => {
              const fromPos = agentPositions[arg.from];
              const toPos = agentPositions[arg.to];
              if (!fromPos || !toPos) return null;

              return (
                <motion.g key={index}>
                  <motion.path
                    d={getCurvedPath(fromPos, toPos)}
                    fill="none"
                    stroke={ARGUMENT_COLORS[arg.type]}
                    strokeWidth={arg.weight * 3}
                    strokeOpacity={0.6}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                  />
                  {/* Arrow indicator */}
                  <motion.circle
                    cx={toPos.x}
                    cy={toPos.y}
                    r="4"
                    fill={ARGUMENT_COLORS[arg.type]}
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                  />
                </motion.g>
              );
            })}

            {/* Agent nodes */}
            {agents.map(agent => {
              const pos = agentPositions[agent.id];
              const isActive = activeAgentIds.has(agent.id);

              return (
                <motion.g
                  key={agent.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Glow effect for active agents */}
                  {isActive && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="28"
                      fill={`${agent.color}20`}
                      className="animate-pulse"
                    />
                  )}

                  {/* Agent circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="22"
                    fill={isActive ? `${agent.color}30` : 'rgba(30, 41, 59, 0.8)'}
                    stroke={isActive ? agent.color : 'rgba(255,255,255,0.1)'}
                    strokeWidth={isActive ? 2 : 1}
                  />

                  {/* Agent emoji */}
                  <text
                    x={pos.x}
                    y={pos.y + 5}
                    textAnchor="middle"
                    className="text-lg"
                    style={{ filter: isActive ? 'none' : 'grayscale(0.5)' }}
                  >
                    {agent.avatar}
                  </text>

                  {/* Agent name */}
                  <text
                    x={pos.x}
                    y={pos.y + 38}
                    textAnchor="middle"
                    className="text-[9px] fill-slate-400"
                  >
                    {agent.name}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/5">
          {Object.entries(ARGUMENT_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div className="w-3 h-1 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-slate-400 capitalize">{type}</span>
            </div>
          ))}
        </div>
      </GlassCardContent>
    </GlassCard>
  );
}

export default DebateRing;
