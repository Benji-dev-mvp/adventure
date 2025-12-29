import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { GradientText } from '../../components/futuristic';
import { Bot, Phone, Sparkles } from 'lucide-react';

import { AvatarPanel } from './components/AvatarPanel';
import { TranscriptStream } from './components/TranscriptStream';
import { CallControls } from './components/CallControls';
import { useLiveCall } from './hooks/useLiveCall';

export function AvatarPage() {
  const {
    status,
    statusLabel,
    currentPhase,
    phases,
    transcript,
    isPlaying,
    formattedDuration,
    callInfo,
    settings,
    updateSettings,
    startCall,
    endCall,
    pauseCall,
    resumeCall,
    emergencyTakeover,
  } = useLiveCall();

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full p-4 gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-violet-500/20">
              <Bot className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold">
                <GradientText gradient="purple">AI Sales Avatar</GradientText>
              </h1>
              <p className="text-slate-400 mt-1">Live Agent - Autonomous sales conversations</p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-3">
            <div
              className={`
              flex items-center gap-2 px-4 py-2 rounded-lg border
              ${
                status === 'in-call'
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-slate-800/50 border-white/5'
              }
            `}
            >
              <Phone
                className={`w-4 h-4 ${status === 'in-call' ? 'text-emerald-400' : 'text-slate-400'}`}
              />
              <span
                className={`text-sm font-medium ${status === 'in-call' ? 'text-emerald-400' : 'text-slate-400'}`}
              >
                {statusLabel}
              </span>
              {status === 'in-call' && (
                <>
                  <span className="text-slate-500">•</span>
                  <span className="font-mono text-emerald-400">{formattedDuration}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-white/5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-slate-300">AI Powered</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 grid grid-cols-12 gap-3 min-h-0">
          {/* Left: Avatar Panel */}
          <div className="col-span-12 lg:col-span-5">
            <AvatarPanel
              status={status}
              isPlaying={isPlaying}
              formattedDuration={formattedDuration}
              callInfo={callInfo}
              onStart={startCall}
              onEnd={endCall}
              onPause={pauseCall}
              onResume={resumeCall}
            />
          </div>

          {/* Right: Transcript Stream */}
          <div className="col-span-12 lg:col-span-7">
            <TranscriptStream
              transcript={transcript}
              phases={phases}
              currentPhase={currentPhase}
              status={status}
            />
          </div>
        </div>

        {/* Bottom: Call Controls */}
        <div>
          <CallControls
            settings={settings}
            updateSettings={updateSettings}
            onEmergencyTakeover={emergencyTakeover}
            status={status}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AvatarPage;
