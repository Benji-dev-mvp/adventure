import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Phone, PhoneOff, Mic, Volume2, Video } from 'lucide-react';
import { GlassCard, GlassCardContent } from '../../../components/futuristic';
import { Button } from '../../../components/ui/Button';

const STATUS_CONFIG = {
  idle: { color: 'text-slate-400', bg: 'bg-slate-500/20', pulse: false },
  connecting: { color: 'text-amber-400', bg: 'bg-amber-500/20', pulse: true },
  'in-call': { color: 'text-emerald-400', bg: 'bg-emerald-500/20', pulse: true },
  scheduling: { color: 'text-cyan-400', bg: 'bg-cyan-500/20', pulse: true },
  ended: { color: 'text-slate-400', bg: 'bg-slate-500/20', pulse: false },
};

// Animated avatar visualization
const AvatarVisualization = ({ status, isPlaying }) => {
  return (
    <div className="relative flex items-center justify-center h-64">
      {/* Background rings */}
      {[1, 2, 3].map(ring => (
        <motion.div
          key={ring}
          className="absolute rounded-full border border-cyan-500/20"
          style={{
            width: `${ring * 60 + 80}px`,
            height: `${ring * 60 + 80}px`,
          }}
          animate={
            isPlaying
              ? {
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.1, 0.3],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: ring * 0.3,
          }}
        />
      ))}

      {/* Avatar circle */}
      <motion.div
        className="relative w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center border border-cyan-500/30"
        animate={
          isPlaying
            ? {
                boxShadow: [
                  '0 0 20px rgba(6, 182, 212, 0.2)',
                  '0 0 40px rgba(6, 182, 212, 0.4)',
                  '0 0 20px rgba(6, 182, 212, 0.2)',
                ],
              }
            : {}
        }
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Bot className="w-16 h-16 text-cyan-400" />

        {/* Speaking indicator */}
        {isPlaying && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-0.5 h-4">
            {[1, 2, 3, 4, 5].map(bar => (
              <motion.div
                key={bar}
                className="w-1 bg-cyan-400 rounded-full"
                animate={{
                  height: [4, 12, 8, 16, 4],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: bar * 0.1,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Status indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div
          className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full
          ${STATUS_CONFIG[status].bg}
        `}
        >
          <div
            className={`
            w-2 h-2 rounded-full ${STATUS_CONFIG[status].color.replace('text-', 'bg-')}
            ${STATUS_CONFIG[status].pulse ? 'animate-pulse' : ''}
          `}
          />
          <span className={`text-sm font-medium ${STATUS_CONFIG[status].color}`}>
            {status === 'idle'
              ? 'Ready'
              : status === 'connecting'
                ? 'Connecting...'
                : status === 'in-call'
                  ? 'In Call'
                  : status === 'scheduling'
                    ? 'Scheduling'
                    : 'Call Ended'}
          </span>
        </div>
      </div>
    </div>
  );
};

// Call controls
const CallControls = ({ status, isPlaying, onStart, onEnd, onPause, onResume }) => {
  return (
    <div className="flex items-center justify-center gap-4">
      {status === 'idle' || status === 'ended' ? (
        <Button onClick={onStart} className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-8">
          <Phone className="w-4 h-4 mr-2" />
          Start Call
        </Button>
      ) : (
        <>
          <Button variant="outline" size="icon" className="w-12 h-12 rounded-full">
            <Mic className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" className="w-12 h-12 rounded-full">
            <Volume2 className="w-5 h-5" />
          </Button>
          <Button onClick={onEnd} className="w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600">
            <PhoneOff className="w-6 h-6" />
          </Button>
          <Button variant="outline" size="icon" className="w-12 h-12 rounded-full">
            <Video className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full"
            onClick={isPlaying ? onPause : onResume}
          >
            {isPlaying ? (
              <div className="w-4 h-4 flex gap-1">
                <div className="w-1 h-full bg-current rounded" />
                <div className="w-1 h-full bg-current rounded" />
              </div>
            ) : (
              <div className="w-0 h-0 border-l-[10px] border-l-current border-y-[6px] border-y-transparent ml-1" />
            )}
          </Button>
        </>
      )}
    </div>
  );
};

export function AvatarPanel({
  status,
  isPlaying,
  formattedDuration,
  callInfo,
  onStart,
  onEnd,
  onPause,
  onResume,
}) {
  return (
    <GlassCard variant="gradient" className="h-full">
      <GlassCardContent className="p-6 h-full flex flex-col">
        {/* Prospect info (when in call) */}
        {status !== 'idle' && callInfo.prospect && (
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
              <span className="text-sm font-medium text-slate-300">
                {callInfo.prospect.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-100">{callInfo.prospect.name}</p>
              <p className="text-xs text-slate-400">
                {callInfo.prospect.title} at {callInfo.prospect.company}
              </p>
            </div>
            {status === 'in-call' && (
              <div className="px-3 py-1 bg-emerald-500/20 rounded-full">
                <span className="text-sm font-mono text-emerald-400">{formattedDuration}</span>
              </div>
            )}
          </div>
        )}

        {/* Avatar visualization */}
        <div className="flex-1 flex items-center justify-center">
          <AvatarVisualization status={status} isPlaying={isPlaying} />
        </div>

        {/* Controls */}
        <div className="pt-6">
          <CallControls
            status={status}
            isPlaying={isPlaying}
            onStart={onStart}
            onEnd={onEnd}
            onPause={onPause}
            onResume={onResume}
          />
        </div>
      </GlassCardContent>
    </GlassCard>
  );
}

export default AvatarPanel;
