import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Crown,
  AlertTriangle,
  UserCheck,
  UserX,
  Minus,
  ChevronRight,
  Sparkles,
  Building2,
  Mail,
  Linkedin,
  Target,
  TrendingUp,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Local type definitions
interface MockStakeholder {
  id: string;
  name: string;
  title: string;
  role: string;
  influence: number;
  sentiment: string;
  x: number;
  y: number;
  level: number;
}

interface MockRelationship {
  id: string;
  from: string;
  to: string;
  type: 'reports_to' | 'influences' | 'blocks' | 'peers_with';
  strength: 'strong' | 'moderate' | 'weak';
}

/**
 * Influence Map Component
 * Org influence map showing stakeholder relationships within an account
 */

const mockStakeholders = [
  {
    id: 'sh-1',
    name: 'Sarah Chen',
    title: 'CEO',
    role: 'decision_maker',
    influence: 95,
    sentiment: 'neutral',
    x: 400,
    y: 100,
    level: 1,
  },
  {
    id: 'sh-2',
    name: 'Mike Johnson',
    title: 'CRO',
    role: 'champion',
    influence: 88,
    sentiment: 'positive',
    x: 250,
    y: 200,
    level: 2,
  },
  {
    id: 'sh-3',
    name: 'Lisa Wang',
    title: 'CFO',
    role: 'blocker',
    influence: 82,
    sentiment: 'negative',
    x: 550,
    y: 200,
    level: 2,
  },
  {
    id: 'sh-4',
    name: 'James Miller',
    title: 'VP Sales',
    role: 'influencer',
    influence: 75,
    sentiment: 'positive',
    x: 150,
    y: 320,
    level: 3,
  },
  {
    id: 'sh-5',
    name: 'Emily Davis',
    title: 'VP Marketing',
    role: 'influencer',
    influence: 70,
    sentiment: 'neutral',
    x: 350,
    y: 320,
    level: 3,
  },
  {
    id: 'sh-6',
    name: 'Robert Wilson',
    title: 'VP Ops',
    role: 'end_user',
    influence: 65,
    sentiment: 'neutral',
    x: 500,
    y: 320,
    level: 3,
  },
  {
    id: 'sh-7',
    name: 'Amanda Brown',
    title: 'Director BDR',
    role: 'end_user',
    influence: 55,
    sentiment: 'positive',
    x: 100,
    y: 440,
    level: 4,
  },
  {
    id: 'sh-8',
    name: 'David Lee',
    title: 'Sales Manager',
    role: 'end_user',
    influence: 50,
    sentiment: 'positive',
    x: 250,
    y: 440,
    level: 4,
  },
  {
    id: 'sh-9',
    name: 'Jennifer Taylor',
    title: 'Marketing Manager',
    role: 'evaluator',
    influence: 45,
    sentiment: 'neutral',
    x: 400,
    y: 440,
    level: 4,
  },
];

interface MockRelationship {
  id: string;
  from: string;
  to: string;
  type: 'reports_to' | 'influences' | 'blocks' | 'peers_with';
  strength: 'strong' | 'moderate' | 'weak';
}

const mockRelationships: MockRelationship[] = [
  { id: 'r1', from: 'sh-1', to: 'sh-2', type: 'reports_to', strength: 'strong' },
  { id: 'r2', from: 'sh-1', to: 'sh-3', type: 'reports_to', strength: 'strong' },
  { id: 'r3', from: 'sh-2', to: 'sh-4', type: 'reports_to', strength: 'strong' },
  { id: 'r4', from: 'sh-2', to: 'sh-5', type: 'reports_to', strength: 'moderate' },
  { id: 'r5', from: 'sh-3', to: 'sh-6', type: 'reports_to', strength: 'strong' },
  { id: 'r6', from: 'sh-4', to: 'sh-7', type: 'reports_to', strength: 'moderate' },
  { id: 'r7', from: 'sh-4', to: 'sh-8', type: 'reports_to', strength: 'strong' },
  { id: 'r8', from: 'sh-5', to: 'sh-9', type: 'reports_to', strength: 'moderate' },
  { id: 'r9', from: 'sh-2', to: 'sh-3', type: 'influences', strength: 'weak' },
  { id: 'r10', from: 'sh-4', to: 'sh-2', type: 'influences', strength: 'moderate' },
];

const InfluenceMap = () => {
  const [stakeholders] = useState<MockStakeholder[]>(mockStakeholders);
  const [relationships] = useState<MockRelationship[]>(mockRelationships);
  const [selectedStakeholder, setSelectedStakeholder] = useState<MockStakeholder | null>(null);
  const [highlightedRole, setHighlightedRole] = useState<string | null>(null);
  // showPanel is available for future panel toggle functionality
  const [showPanel] = useState(true);

  const buyingCenter = useMemo(() => {
    return {
      economicBuyer: stakeholders.find(s => s.role === 'decision_maker'),
      champion: stakeholders.find(s => s.role === 'champion'),
      blockers: stakeholders.filter(s => s.role === 'blocker'),
      influencers: stakeholders.filter(s => s.role === 'influencer'),
      endUsers: stakeholders.filter(s => s.role === 'end_user'),
    };
  }, [stakeholders]);

  const getRoleIcon = (role: string): LucideIcon => {
    switch (role) {
      case 'decision_maker':
        return Crown;
      case 'champion':
        return UserCheck;
      case 'blocker':
        return UserX;
      case 'influencer':
        return TrendingUp;
      case 'end_user':
        return Users;
      case 'evaluator':
        return Target;
      default:
        return Users;
    }
  };

  const getRoleColor = (role: string): { bg: string; border: string; text: string } => {
    switch (role) {
      case 'decision_maker':
        return { bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-400' };
      case 'champion':
        return { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400' };
      case 'blocker':
        return { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400' };
      case 'influencer':
        return { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400' };
      case 'end_user':
        return { bg: 'bg-violet-500/20', border: 'border-violet-500', text: 'text-violet-400' };
      case 'evaluator':
        return { bg: 'bg-cyan-500/20', border: 'border-cyan-500', text: 'text-cyan-400' };
      default:
        return { bg: 'bg-gray-500/20', border: 'border-gray-500', text: 'text-gray-400' };
    }
  };

  const getSentimentIcon = (sentiment: string): { icon: LucideIcon; color: string } => {
    switch (sentiment) {
      case 'positive':
        return { icon: UserCheck, color: 'text-green-400' };
      case 'negative':
        return { icon: AlertTriangle, color: 'text-red-400' };
      default:
        return { icon: Minus, color: 'text-gray-400' };
    }
  };

  const getRelationshipStyle = (
    rel: MockRelationship
  ): { strokeWidth: number; dash: string; color: string } => {
    const strengthWidth: Record<string, number> = {
      strong: 3,
      moderate: 2,
      weak: 1,
    };
    const typeStyle: Record<string, { dash: string; color: string }> = {
      reports_to: { dash: '', color: 'rgba(139, 92, 246, 0.5)' },
      influences: { dash: '5,5', color: 'rgba(34, 197, 94, 0.5)' },
      blocks: { dash: '3,3', color: 'rgba(239, 68, 68, 0.5)' },
      peers_with: { dash: '8,4', color: 'rgba(59, 130, 246, 0.5)' },
    };
    return {
      strokeWidth: strengthWidth[rel.strength] || 1,
      ...(typeStyle[rel.type] || typeStyle.reports_to),
    };
  };

  return (
    <div className="h-full flex bg-gray-950">
      {/* Main Map Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Header */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-violet-400" />
              <div>
                <h2 className="font-semibold text-white">Acme Corporation</h2>
                <p className="text-xs text-gray-400">Influence Map • 9 stakeholders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Role Legend */}
        <div className="absolute top-4 right-4 z-10 bg-gray-900 border border-gray-700 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-2">Filter by Role</div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'decision_maker', label: 'Decision Maker' },
              { id: 'champion', label: 'Champion' },
              { id: 'blocker', label: 'Blocker' },
              { id: 'influencer', label: 'Influencer' },
              { id: 'end_user', label: 'End User' },
            ].map(role => {
              const colors = getRoleColor(role.id);
              return (
                <button
                  key={role.id}
                  onClick={() => setHighlightedRole(highlightedRole === role.id ? null : role.id)}
                  className={`px-2 py-1 rounded text-xs flex items-center gap-1.5 transition-all ${
                    highlightedRole === role.id || !highlightedRole
                      ? `${colors.bg} ${colors.text} border ${colors.border}`
                      : 'bg-gray-800/50 text-gray-500 border border-gray-700'
                  }`}
                >
                  {React.createElement(getRoleIcon(role.id), { className: 'w-3 h-3' })}
                  {role.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Influence Map Canvas */}
        <svg
          className="w-full h-full"
          style={{ background: 'radial-gradient(circle at center, #1a1a2e 0%, #0f0f1a 100%)' }}
        >
          {/* Grid */}
          <defs>
            <pattern id="influence-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="rgba(255,255,255,0.02)"
                strokeWidth="1"
              />
            </pattern>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="rgba(139, 92, 246, 0.5)" />
            </marker>
          </defs>
          <rect width="100%" height="100%" fill="url(#influence-grid)" />

          {/* Level indicators */}
          {[1, 2, 3, 4].map(level => (
            <g key={level}>
              <line
                x1="50"
                y1={level * 120}
                x2="750"
                y2={level * 120}
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
              <text x="30" y={level * 120} className="text-[10px] fill-gray-600">
                L{level}
              </text>
            </g>
          ))}

          {/* Relationships */}
          {relationships.map(rel => {
            const from = stakeholders.find(s => s.id === rel.from);
            const to = stakeholders.find(s => s.id === rel.to);
            if (!from || !to) return null;

            const style = getRelationshipStyle(rel);
            const isHighlighted =
              !highlightedRole || from.role === highlightedRole || to.role === highlightedRole;

            // Calculate control point for curved lines
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            const dy = to.y - from.y;
            const curve = rel.type === 'influences' ? 30 : 0;
            const ctrlX = midX + (dy > 0 ? curve : -curve);
            const ctrlY = midY;

            return (
              <motion.g
                key={rel.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHighlighted ? 1 : 0.2 }}
              >
                <path
                  d={`M ${from.x} ${from.y} Q ${ctrlX} ${ctrlY} ${to.x} ${to.y}`}
                  fill="none"
                  stroke={style.color}
                  strokeWidth={style.strokeWidth}
                  strokeDasharray={style.dash}
                  markerEnd={rel.type === 'influences' ? 'url(#arrowhead)' : undefined}
                />
                {/* Animated pulse for strong relationships */}
                {rel.strength === 'strong' && (
                  <motion.circle
                    r="4"
                    fill={style.color}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 0.8, 0],
                      offsetDistance: ['0%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <animateMotion
                      dur="2s"
                      repeatCount="indefinite"
                      path={`M ${from.x} ${from.y} Q ${ctrlX} ${ctrlY} ${to.x} ${to.y}`}
                    />
                  </motion.circle>
                )}
              </motion.g>
            );
          })}

          {/* Stakeholder Nodes */}
          {stakeholders.map(stakeholder => {
            const RoleIcon = getRoleIcon(stakeholder.role);
            const colors = getRoleColor(stakeholder.role);
            const sentiment = getSentimentIcon(stakeholder.sentiment);
            const isHighlighted = !highlightedRole || stakeholder.role === highlightedRole;
            const isSelected = selectedStakeholder?.id === stakeholder.id;
            const nodeSize = 30 + stakeholder.influence / 10;

            return (
              <motion.g
                key={stakeholder.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: isHighlighted ? 1 : 0.3,
                }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setSelectedStakeholder(stakeholder)}
                style={{ cursor: 'pointer' }}
              >
                {/* Selection ring */}
                {isSelected && (
                  <motion.circle
                    cx={stakeholder.x}
                    cy={stakeholder.y}
                    r={nodeSize + 8}
                    fill="none"
                    stroke="rgba(139, 92, 246, 0.8)"
                    strokeWidth="2"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: [0.8, 0.2] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}

                {/* Node background */}
                <circle
                  cx={stakeholder.x}
                  cy={stakeholder.y}
                  r={nodeSize}
                  className={colors.bg}
                  stroke={colors.border.replace('border-', '')}
                  strokeWidth="2"
                  style={{
                    fill: colors.bg.includes('amber')
                      ? 'rgba(245, 158, 11, 0.2)'
                      : colors.bg.includes('green')
                        ? 'rgba(34, 197, 94, 0.2)'
                        : colors.bg.includes('red')
                          ? 'rgba(239, 68, 68, 0.2)'
                          : colors.bg.includes('blue')
                            ? 'rgba(59, 130, 246, 0.2)'
                            : colors.bg.includes('violet')
                              ? 'rgba(139, 92, 246, 0.2)'
                              : 'rgba(6, 182, 212, 0.2)',
                  }}
                />

                {/* Role icon */}
                <foreignObject x={stakeholder.x - 10} y={stakeholder.y - 10} width={20} height={20}>
                  <RoleIcon className={`w-5 h-5 ${colors.text}`} />
                </foreignObject>

                {/* Sentiment indicator */}
                <g
                  transform={`translate(${stakeholder.x + nodeSize - 8}, ${stakeholder.y - nodeSize + 8})`}
                >
                  <circle r="8" fill="#1f2937" />
                  <foreignObject x="-6" y="-6" width={12} height={12}>
                    {React.createElement(sentiment.icon, {
                      className: `w-3 h-3 ${sentiment.color}`,
                    })}
                  </foreignObject>
                </g>

                {/* Influence score */}
                <g
                  transform={`translate(${stakeholder.x - nodeSize + 8}, ${stakeholder.y - nodeSize + 8})`}
                >
                  <circle r="10" fill="#1f2937" stroke="rgba(255,255,255,0.1)" />
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[9px] fill-white font-bold"
                  >
                    {stakeholder.influence}
                  </text>
                </g>

                {/* Name label */}
                <text
                  x={stakeholder.x}
                  y={stakeholder.y + nodeSize + 14}
                  textAnchor="middle"
                  className="text-xs fill-white font-medium"
                >
                  {stakeholder.name}
                </text>
                <text
                  x={stakeholder.x}
                  y={stakeholder.y + nodeSize + 26}
                  textAnchor="middle"
                  className="text-[10px] fill-gray-500"
                >
                  {stakeholder.title}
                </text>
              </motion.g>
            );
          })}
        </svg>

        {/* Relationship Legend */}
        <div className="absolute bottom-4 left-4 bg-gray-900/90 border border-gray-700 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-2">Relationships</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-violet-500/50" />
              <span className="text-gray-300">Reports to</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-0.5 bg-green-500/50"
                style={{ borderTop: '2px dashed rgba(34, 197, 94, 0.5)' }}
              />
              <span className="text-gray-300">Influences</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="w-96 bg-gray-900 border-l border-gray-800 overflow-y-auto"
          >
            {/* Stakeholder Detail or Summary */}
            {selectedStakeholder ? (
              <>
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {React.createElement(getRoleIcon(selectedStakeholder.role), {
                      className: `w-5 h-5 ${getRoleColor(selectedStakeholder.role).text}`,
                    })}
                    <div>
                      <h3 className="font-semibold text-white">{selectedStakeholder.name}</h3>
                      <p className="text-xs text-gray-400">{selectedStakeholder.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStakeholder(null)}
                    className="p-1 text-gray-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  {/* Role & Influence */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`rounded-lg p-3 ${getRoleColor(selectedStakeholder.role).bg}`}>
                      <div className="text-xs text-gray-400">Role</div>
                      <div
                        className={`text-sm font-medium capitalize ${getRoleColor(selectedStakeholder.role).text}`}
                      >
                        {selectedStakeholder.role.replace('_', ' ')}
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400">Influence</div>
                      <div className="text-sm font-medium text-white">
                        {selectedStakeholder.influence}/100
                      </div>
                    </div>
                  </div>

                  {/* Sentiment */}
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Sentiment</span>
                      <div
                        className={`flex items-center gap-1 ${getSentimentIcon(selectedStakeholder.sentiment).color}`}
                      >
                        {React.createElement(getSentimentIcon(selectedStakeholder.sentiment).icon, {
                          className: 'w-4 h-4',
                        })}
                        <span className="text-sm capitalize">{selectedStakeholder.sentiment}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors">
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                    <button className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </button>
                  </div>

                  {/* AI Engagement Strategy */}
                  <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-lg p-4 border border-violet-500/20">
                    <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      AI Engagement Strategy
                    </h4>
                    <p className="text-sm text-gray-300 mb-3">
                      {selectedStakeholder.role === 'champion'
                        ? 'Leverage this champion to introduce you to decision makers. Focus on providing value and enabling their internal advocacy.'
                        : selectedStakeholder.role === 'blocker'
                          ? 'Address concerns directly. Understand their objections and provide evidence to neutralize resistance.'
                          : selectedStakeholder.role === 'decision_maker'
                            ? 'Build executive relationship. Focus on business outcomes and ROI. Keep communication concise and strategic.'
                            : 'Build rapport through value-add content. Position as a trusted advisor for their specific challenges.'}
                    </p>
                    <button className="w-full py-2 bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 text-sm font-medium rounded-lg transition-colors">
                      Generate Outreach Sequence
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 border-b border-gray-800">
                  <h3 className="font-semibold text-white">Political Map Summary</h3>
                  <p className="text-xs text-gray-400 mt-1">AI-analyzed stakeholder dynamics</p>
                </div>

                <div className="p-4 space-y-3">
                  {/* Buying Center */}
                  <div>
                    <h4 className="text-sm font-medium text-white mb-3">Buying Center</h4>
                    <div className="space-y-2">
                      {buyingCenter.economicBuyer && (
                        <div className="flex items-center justify-between bg-amber-500/10 rounded-lg p-2">
                          <div className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-amber-400" />
                            <span className="text-sm text-white">
                              {buyingCenter.economicBuyer.name}
                            </span>
                          </div>
                          <span className="text-xs text-amber-400">Economic Buyer</span>
                        </div>
                      )}
                      {buyingCenter.champion && (
                        <div className="flex items-center justify-between bg-green-500/10 rounded-lg p-2">
                          <div className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-white">{buyingCenter.champion.name}</span>
                          </div>
                          <span className="text-xs text-green-400">Champion</span>
                        </div>
                      )}
                      {buyingCenter.blockers.length > 0 && (
                        <div className="bg-red-500/10 rounded-lg p-2">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span className="text-xs text-red-400">
                              Blockers ({buyingCenter.blockers.length})
                            </span>
                          </div>
                          {buyingCenter.blockers.map(b => (
                            <div key={b.id} className="text-sm text-white ml-6">
                              {b.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Deal Risk */}
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Deal Risk Score</span>
                      <span className="text-lg font-bold text-amber-400">Medium</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-gradient-to-r from-green-500 via-amber-500 to-red-500 rounded-full" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      1 blocker identified. Champion influence may not be sufficient.
                    </p>
                  </div>

                  {/* AI Recommended Path */}
                  <div>
                    <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Recommended Engagement Path
                    </h4>
                    <div className="space-y-2">
                      {[
                        {
                          step: 1,
                          action: 'Strengthen champion relationship',
                          target: 'Mike Johnson',
                        },
                        { step: 2, action: 'Address CFO concerns directly', target: 'Lisa Wang' },
                        { step: 3, action: 'Build coalition with end users', target: 'Multiple' },
                        { step: 4, action: 'Request executive introduction', target: 'Sarah Chen' },
                      ].map((item, idx) => (
                        <motion.div
                          key={item.step}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-3"
                        >
                          <div className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold flex items-center justify-center">
                            {item.step}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-white">{item.action}</div>
                            <div className="text-xs text-gray-500">{item.target}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-600" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { InfluenceMap };
export default InfluenceMap;
