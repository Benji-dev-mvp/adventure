import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { GradientText } from '../../components/futuristic';
import { Zap, Power, TrendingUp, AlertTriangle, Play } from 'lucide-react';
import { useToast } from '../../components/Toast';

import { CommitmentsStrip } from './components/CommitmentsStrip';
import { ProgramTable } from './components/ProgramTable';
import { ProgramBrainPanel } from './components/ProgramBrainPanel';
import { DecisionTimeline } from './components/DecisionTimeline';
import { useAutopilotPrograms } from './hooks/useAutopilotPrograms';
import { useAutopilotDecisions } from './hooks/useAutopilotDecisions';

export function AutopilotPage() {
  const { showToast } = useToast();
  const [autopilotEnabled, setAutopilotEnabled] = useState(true);

  const {
    programs,
    commitments,
    loading: loadingPrograms,
    selectedProgram,
    setSelectedProgram,
    summary,
  } = useAutopilotPrograms();

  const { decisions, loading: loadingDecisions } = useAutopilotDecisions();

  const handleToggleAutopilot = () => {
    setAutopilotEnabled(!autopilotEnabled);
    showToast(
      autopilotEnabled ? 'Autopilot paused' : 'Autopilot activated',
      autopilotEnabled ? 'warning' : 'success'
    );
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                <GradientText gradient="cyber">Autonomous Growth Autopilot</GradientText>
              </h1>
              <p className="text-slate-400 mt-1">
                System-managed outbound programs and commitments
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Summary stats */}
            <div className="flex items-center gap-6 px-4 py-2 bg-slate-800/50 rounded-xl border border-white/5">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-300">
                  <span className="font-semibold text-emerald-400">{summary.runningPrograms}</span>{' '}
                  running
                </span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-slate-300">
                  <span className="font-semibold text-amber-400">{summary.atRiskPrograms}</span> at
                  risk
                </span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-slate-300">
                  <span className="font-semibold text-cyan-400">
                    {Math.round(summary.averageProgress)}%
                  </span>{' '}
                  avg
                </span>
              </div>
            </div>

            {/* Autopilot toggle */}
            <button
              onClick={handleToggleAutopilot}
              className={`
                relative flex items-center gap-3 px-5 py-2.5 rounded-xl font-medium transition-all
                ${
                  autopilotEnabled
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-800 text-slate-400 border border-white/10 hover:border-white/20'
                }
              `}
            >
              <Power className={`w-4 h-4 ${autopilotEnabled ? 'animate-pulse' : ''}`} />
              <span>Autopilot: {autopilotEnabled ? 'On' : 'Off'}</span>
              {autopilotEnabled && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
              )}
            </button>
          </div>
        </div>

        {/* Row 1: Commitments Strip */}
        <CommitmentsStrip commitments={commitments} loading={loadingPrograms} />

        {/* Row 2: Programs Table + Brain Panel */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7">
            <ProgramTable
              programs={programs}
              loading={loadingPrograms}
              selectedProgram={selectedProgram}
              onSelectProgram={setSelectedProgram}
            />
          </div>
          <div className="col-span-12 lg:col-span-5">
            <ProgramBrainPanel programs={programs} selectedProgram={selectedProgram} />
          </div>
        </div>

        {/* Row 3: Decision Timeline */}
        <DecisionTimeline decisions={decisions} loading={loadingDecisions} />
      </div>
    </DashboardLayout>
  );
}

export default AutopilotPage;
