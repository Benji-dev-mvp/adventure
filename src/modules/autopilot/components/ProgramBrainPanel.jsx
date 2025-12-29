import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Users,
  MessageSquare,
  Zap,
  Mail,
  Linkedin,
  Phone,
  MessageCircle,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { GlassCard, GlassCardContent } from '../../../components/futuristic';

// Mini pie chart for channel mix
const ChannelMixMini = ({ channelMix }) => {
  const channels = [
    { key: 'email', icon: Mail, color: '#06b6d4', label: 'Email' },
    { key: 'linkedin', icon: Linkedin, color: '#8b5cf6', label: 'LinkedIn' },
    { key: 'phone', icon: Phone, color: '#f97316', label: 'Phone' },
    { key: 'sms', icon: MessageCircle, color: '#10b981', label: 'SMS' },
  ];

  const total = Object.values(channelMix).reduce((a, b) => a + b, 0);
  let currentAngle = 0;

  const createArc = (startAngle, endAngle, color) => {
    const start = (startAngle - 90) * (Math.PI / 180);
    const end = (endAngle - 90) * (Math.PI / 180);
    const radius = 40;
    const cx = 50;
    const cy = 50;

    const x1 = cx + radius * Math.cos(start);
    const y1 = cy + radius * Math.sin(start);
    const x2 = cx + radius * Math.cos(end);
    const y2 = cy + radius * Math.sin(end);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="w-20 h-20">
        {channels.map(channel => {
          const value = channelMix[channel.key] || 0;
          const angle = (value / total) * 360;
          const path = createArc(currentAngle, currentAngle + angle, channel.color);
          const result = <path key={channel.key} d={path} fill={channel.color} opacity="0.8" />;
          currentAngle += angle;
          return result;
        })}
        <circle cx="50" cy="50" r="25" fill="#1e293b" />
        <Brain className="w-6 h-6 text-cyan-400" x="38" y="38" />
      </svg>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        {channels.map(channel => {
          const Icon = channel.icon;
          return (
            <div key={channel.key} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: channel.color }} />
              <Icon className="w-3 h-3 text-slate-400" />
              <span className="text-slate-300">{channelMix[channel.key]}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Messaging angle chips
const MessagingChips = ({ angles }) => (
  <div className="flex flex-wrap gap-2">
    {angles.map((angle, index) => (
      <span
        key={index}
        className="px-2.5 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20"
      >
        {angle}
      </span>
    ))}
  </div>
);

// Recent decisions list
const RecentDecisions = ({ decisions }) => (
  <div className="space-y-3">
    {decisions.slice(0, 3).map((decision, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-white/5"
      >
        <div className="p-1.5 rounded bg-cyan-500/10">
          <Zap className="w-3 h-3 text-cyan-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-200 leading-snug">{decision.action}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            {decision.timestamp}
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

export function ProgramBrainPanel({ programs, selectedProgram }) {
  const program = selectedProgram || programs?.[0];

  if (!program) {
    return (
      <GlassCard variant="subtle" className="h-full">
        <GlassCardContent className="p-6 flex items-center justify-center h-full">
          <div className="text-center text-slate-400">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Select a program to view its brain</p>
          </div>
        </GlassCardContent>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="gradient" className="h-full">
      <GlassCardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
            <Brain className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100">Program Brain</h3>
            <p className="text-xs text-slate-400">{program.name}</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={program.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* ICP Description */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-medium text-slate-300">ICP Target</h4>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{program.icpDescription}</p>
            </div>

            {/* Channel Mix */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-medium text-slate-300">Channel Mix</h4>
              </div>
              <ChannelMixMini channelMix={program.channelMix} />
            </div>

            {/* Messaging Angles */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-medium text-slate-300">Messaging Angles</h4>
              </div>
              <MessagingChips angles={program.messagingAngles} />
            </div>

            {/* Recent System Decisions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-medium text-slate-300">Recent Decisions</h4>
                </div>
                <button className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <RecentDecisions decisions={program.recentDecisions} />
            </div>
          </motion.div>
        </AnimatePresence>
      </GlassCardContent>
    </GlassCard>
  );
}

export default ProgramBrainPanel;
