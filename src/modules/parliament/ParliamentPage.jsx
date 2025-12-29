import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { GlassCard, GlassCardContent, GradientText } from '../../components/futuristic';
import { 
  Users, MessageSquare, Gavel, 
  AlertTriangle, CheckCircle, Clock
} from 'lucide-react';

import { AgentRow } from './components/AgentRow';
import { DebateRing } from './components/DebateRing';
import { AgendaList } from './components/AgendaList';
import { ResolutionPanel } from './components/ResolutionPanel';
import { useParliamentState } from './hooks/useParliamentState';

export function ParliamentPage() {
  const {
    agents,
    agendas,
    selectedAgenda,
    selectAgenda,
    arguments: currentArguments,
    resolution,
    loading,
    summary,
  } = useParliamentState();

  // Get active agent IDs from current arguments
  const activeAgents = currentArguments.reduce((acc, arg) => {
    if (!acc.includes(arg.from)) acc.push(arg.from);
    if (!acc.includes(arg.to)) acc.push(arg.to);
    return acc;
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full p-6 gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/20">
              <Gavel className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                <GradientText gradient="purple">Multi-Agent Parliament</GradientText>
              </h1>
              <p className="text-slate-400 mt-1">
                HoloChamber - AI agents debate and resolve growth challenges
              </p>
            </div>
          </div>

          {/* Summary stats */}
          <div className="flex items-center gap-4 px-4 py-2 bg-slate-800/50 rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-slate-300">
                <span className="font-semibold text-purple-400">{summary.debating}</span> debating
              </span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">
                <span className="font-semibold text-slate-400">{summary.pending}</span> pending
              </span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-slate-300">
                <span className="font-semibold text-emerald-400">{summary.resolved}</span> resolved
              </span>
            </div>
          </div>
        </div>

        {/* Agent Row */}
        <div className="bg-slate-800/30 rounded-xl border border-white/5 py-2">
          <AgentRow agents={agents} activeAgents={activeAgents} />
        </div>

        {/* Main content grid */}
        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          {/* Left: Agenda List */}
          <div className="col-span-12 lg:col-span-3 overflow-hidden">
            <AgendaList
              agendas={agendas}
              selected={selectedAgenda}
              onSelect={selectAgenda}
              loading={loading}
            />
          </div>

          {/* Center: Debate Ring */}
          <div className="col-span-12 lg:col-span-5">
            <DebateRing
              agents={agents}
              arguments_={currentArguments}
              selectedAgenda={selectedAgenda}
            />
          </div>

          {/* Right: Resolution Panel */}
          <div className="col-span-12 lg:col-span-4 overflow-hidden">
            <ResolutionPanel
              resolution={resolution}
              selectedAgenda={selectedAgenda}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ParliamentPage;
