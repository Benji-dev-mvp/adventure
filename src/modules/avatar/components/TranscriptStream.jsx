import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { GlassCard, GlassCardContent } from '../../../components/futuristic';

// Phase timeline indicator
const PhaseTimeline = ({ phases, currentPhase }) => {
  const currentIndex = phases.findIndex(p => p.id === currentPhase);

  return (
    <div className="flex items-center gap-2 p-4 bg-slate-800/50 rounded-lg mb-4">
      {phases.map((phase, index) => {
        const isActive = index === currentIndex;
        const isPast = index < currentIndex;

        return (
          <React.Fragment key={phase.id}>
            <div className="flex flex-col items-center">
              <div
                className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                ${
                  isActive
                    ? 'bg-cyan-500 text-white'
                    : isPast
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-700 text-slate-400'
                }
              `}
              >
                {isPast ? '✓' : index + 1}
              </div>
              <span className={`text-xs mt-1 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                {phase.label}
              </span>
            </div>
            {index < phases.length - 1 && (
              <div className={`flex-1 h-0.5 ${isPast ? 'bg-emerald-500/50' : 'bg-slate-700'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Individual message
const TranscriptMessage = ({ message, isLatest }) => {
  const isAva = message.speaker === 'ava';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isAva ? '' : 'flex-row-reverse'}`}
    >
      <div
        className={`
        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
        ${isAva ? 'bg-cyan-500/20' : 'bg-purple-500/20'}
      `}
      >
        {isAva ? (
          <Bot className="w-4 h-4 text-cyan-400" />
        ) : (
          <User className="w-4 h-4 text-purple-400" />
        )}
      </div>

      <div className={`flex-1 max-w-[80%] ${isAva ? '' : 'text-right'}`}>
        <div
          className={`
          inline-block p-3 rounded-lg
          ${isAva ? 'bg-slate-800 rounded-tl-sm' : 'bg-purple-500/20 rounded-tr-sm'}
          ${isLatest ? 'ring-2 ring-cyan-500/30' : ''}
        `}
        >
          <p className="text-sm text-slate-200">{message.text}</p>
        </div>
        <p className="text-xs text-slate-500 mt-1 px-2">{message.timestamp}</p>
      </div>
    </motion.div>
  );
};

export function TranscriptStream({ transcript, phases, currentPhase, status }) {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <GlassCard variant="subtle" className="h-full flex flex-col">
      <GlassCardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Live Transcript</h3>
          {status === 'in-call' && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400">Recording</span>
            </div>
          )}
        </div>

        {/* Phase timeline */}
        <PhaseTimeline phases={phases} currentPhase={currentPhase} />

        {/* Transcript messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-2">
          {transcript.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-center">
              <div>
                <Bot className="w-12 h-9 mx-auto mb-3 opacity-30" />
                <p>Transcript will appear here when the call starts</p>
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {transcript.map((message, index) => (
                <TranscriptMessage
                  key={message.id}
                  message={message}
                  isLatest={index === transcript.length - 1}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Typing indicator when waiting for response */}
        {status === 'in-call' && transcript.length > 0 && (
          <div className="pt-4 border-t border-white/5 mt-4">
            <div className="flex items-center gap-2 text-slate-500">
              <div className="flex gap-1">
                {[1, 2, 3].map(dot => (
                  <motion.div
                    key={dot}
                    className="w-2 h-2 rounded-full bg-slate-500"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: dot * 0.2 }}
                  />
                ))}
              </div>
              <span className="text-xs">Ava is listening...</span>
            </div>
          </div>
        )}
      </GlassCardContent>
    </GlassCard>
  );
}

export default TranscriptStream;
