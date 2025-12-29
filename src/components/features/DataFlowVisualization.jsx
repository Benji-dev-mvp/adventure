/**
 * DataFlowVisualization.jsx
 *
 * A unified, data-driven visualization component that shows the complete
 * Artisan pipeline with real-time data flow, metrics, and autonomous animations.
 *
 * CTO Architecture Decision:
 * - Single source of truth for flow visualization
 * - Autonomous animation with optional hover interactions
 * - Real-time metric simulation
 * - SVG-based connections for crisp rendering
 * - Intersection Observer for performance
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Search,
  Database,
  Brain,
  Target,
  Mail,
  Linkedin,
  Phone,
  MessageSquare,
  Calendar,
  BarChart3,
  Zap,
  CheckCircle2,
  Activity,
  Send,
  Eye,
} from 'lucide-react';
import { GlassCard, GradientText, GlowText, RevealText, CountUpText } from '../futuristic';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const FLOW_STAGES = [
  {
    id: 'discover',
    title: 'Lead Discovery',
    subtitle: '300M+ Contacts',
    icon: Search,
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-500',
    metrics: { value: 12847, label: 'Leads Found', unit: '' },
    dataPoints: ['Intent signals detected', 'Company data enriched', 'Decision makers identified'],
  },
  {
    id: 'enrich',
    title: 'AI Enrichment',
    subtitle: 'Deep Research',
    icon: Database,
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-500',
    metrics: { value: 98.7, label: 'Data Accuracy', unit: '%' },
    dataPoints: ['Technographics mapped', 'Org charts built', 'Buying signals scored'],
  },
  {
    id: 'personalize',
    title: 'Personalization',
    subtitle: 'AI Engine',
    icon: Brain,
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    metrics: { value: 847, label: 'Emails Crafted', unit: '/hr' },
    dataPoints: ['Tone analysis complete', 'Value props matched', 'Personalization depth: 12 vars'],
  },
  {
    id: 'score',
    title: 'Lead Scoring',
    subtitle: 'Predictive AI',
    icon: Target,
    color: 'pink',
    gradient: 'from-pink-500 to-rose-500',
    metrics: { value: 94, label: 'Accuracy Rate', unit: '%' },
    dataPoints: ['Fit score: 87/100', 'Intent score: 92/100', 'Timing score: 89/100'],
  },
  {
    id: 'outreach',
    title: 'Multi-Channel',
    subtitle: 'Orchestration',
    icon: Send,
    color: 'orange',
    gradient: 'from-orange-500 to-amber-500',
    metrics: { value: 4200, label: 'Touches/Day', unit: '' },
    dataPoints: ['Email: 2,400/day', 'LinkedIn: 1,200/day', 'Calls: 600/day'],
  },
  {
    id: 'engage',
    title: 'Engagement',
    subtitle: 'Tracking',
    icon: Eye,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
    metrics: { value: 67, label: 'Open Rate', unit: '%' },
    dataPoints: ['Opens tracked', 'Clicks analyzed', 'Replies classified'],
  },
  {
    id: 'qualify',
    title: 'Qualification',
    subtitle: 'AI Triage',
    icon: CheckCircle2,
    color: 'teal',
    gradient: 'from-teal-500 to-cyan-500',
    metrics: { value: 23, label: 'SQLs Today', unit: '' },
    dataPoints: ['Interest confirmed', 'Budget qualified', 'Timeline identified'],
  },
  {
    id: 'book',
    title: 'Meeting Booked',
    subtitle: 'Calendar Sync',
    icon: Calendar,
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
    metrics: { value: 8, label: 'Meetings Today', unit: '' },
    dataPoints: ['Calendar synced', 'Invite sent', 'Prep doc generated'],
  },
];

const CHANNEL_METRICS = [
  { icon: Mail, label: 'Emails', value: 2400, color: 'cyan', trend: '+12%' },
  { icon: Linkedin, label: 'LinkedIn', value: 1200, color: 'blue', trend: '+8%' },
  { icon: Phone, label: 'Calls', value: 600, color: 'purple', trend: '+15%' },
  { icon: MessageSquare, label: 'SMS', value: 400, color: 'pink', trend: '+22%' },
];

const AGGREGATE_STATS = [
  { label: 'Pipeline Generated', value: 847000, prefix: '$', suffix: '', format: 'currency' },
  { label: 'Conversion Rate', value: 4.7, prefix: '', suffix: '%', format: 'percent' },
  { label: 'Time to First Meeting', value: 3.2, prefix: '', suffix: ' days', format: 'decimal' },
  { label: 'ROI', value: 34, prefix: '', suffix: 'x', format: 'number' },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// Animated data packet that flows between nodes
const DataPacket = ({ isActive, color, delay = 0 }) => {
  const colors = {
    cyan: 'bg-cyan-400 shadow-cyan-400/60',
    blue: 'bg-blue-400 shadow-blue-400/60',
    purple: 'bg-purple-400 shadow-purple-400/60',
    pink: 'bg-pink-400 shadow-pink-400/60',
    orange: 'bg-orange-400 shadow-orange-400/60',
    emerald: 'bg-emerald-400 shadow-emerald-400/60',
    teal: 'bg-teal-400 shadow-teal-400/60',
    green: 'bg-green-400 shadow-green-400/60',
  };

  if (!isActive) return null;

  return (
    <div
      className={`absolute w-3 h-3 rounded-full ${colors[color]} shadow-lg animate-ping`}
      style={{
        animationDuration: '1s',
        animationDelay: `${delay}ms`,
      }}
    />
  );
};

DataPacket.propTypes = {
  isActive: PropTypes.bool.isRequired,
  color: PropTypes.oneOf(['cyan', 'blue', 'purple', 'pink', 'orange', 'emerald', 'teal', 'green'])
    .isRequired,
  delay: PropTypes.number,
};

// Single flow stage node
const FlowNode = ({
  stage,
  index,
  isActive,
  isComplete,
  isHovered,
  onHover,
  onLeave,
  totalStages,
}) => {
  const Icon = stage.icon;

  return (
    <div
      className="relative group"
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onHover(index);
        }
      }}
      onBlur={onLeave}
      aria-label={`${stage.title} - ${stage.subtitle || ''}`}
    >
      {/* Connection line to next node */}
      {index < totalStages - 1 && (
        <div className="absolute top-1/2 left-full w-8 lg:w-12 h-0.5 -translate-y-1/2 overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ${
              isComplete || isActive ? `bg-gradient-to-r ${stage.gradient}` : 'bg-white/10'
            }`}
            style={{
              transform: isComplete ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: 'left',
            }}
          />
          {/* Animated particle on connection */}
          {isActive && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gradient-to-r ${stage.gradient} shadow-lg animate-flowRight`}
            />
          )}
        </div>
      )}

      {/* Glow effect when active */}
      <div
        className={`absolute -inset-2 rounded-lg bg-gradient-to-r ${stage.gradient} blur-xl transition-opacity duration-500 ${
          isActive || isHovered ? 'opacity-30' : 'opacity-0'
        }`}
      />

      {/* Node container */}
      <div
        className={`relative p-4 lg:p-4 rounded-lg border transition-all duration-500 cursor-pointer ${
          isActive
            ? `bg-gradient-to-br ${stage.gradient} border-transparent shadow-2xl scale-110`
            : isComplete
              ? 'bg-white/10 border-white/20'
              : isHovered
                ? 'bg-white/10 border-white/30 scale-105'
                : 'bg-white/5 border-white/10'
        }`}
      >
        {/* Completion checkmark */}
        {isComplete && !isActive && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <CheckCircle2 size={12} className="text-white" />
          </div>
        )}

        {/* Icon */}
        <div
          className={`w-10 h-9 lg:w-12 lg:h-9 rounded-lg flex items-center justify-center mb-3 ${
            isActive ? 'bg-white/20' : `bg-gradient-to-br ${stage.gradient} bg-opacity-20`
          }`}
        >
          <Icon size={24} className={isActive ? 'text-white' : `text-${stage.color}-400`} />
        </div>

        {/* Title */}
        <h4
          className={`font-semibold text-sm lg:text-base mb-1 ${
            isActive ? 'text-white' : 'text-gray-300'
          }`}
        >
          {stage.title}
        </h4>

        <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
          {stage.subtitle}
        </p>

        {/* Live metric when active or hovered */}
        {(isActive || isHovered) && (
          <div className="mt-3 pt-3 border-t border-white/20 animate-fadeIn">
            <div className="text-lg lg:text-lg font-bold text-white">
              {stage.metrics.value}
              {stage.metrics.unit}
            </div>
            <div className="text-xs text-white/60">{stage.metrics.label}</div>
          </div>
        )}
      </div>

      {/* Data points tooltip on hover */}
      {isHovered && !isActive && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-20 animate-fadeIn">
          <GlassCard className="p-3 min-w-[180px]" variant="default">
            <ul className="space-y-1.5">
              {stage.dataPoints.map((point, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                  <span className={`w-1.5 h-1.5 rounded-full bg-${stage.color}-400`} />
                  {point}
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

FlowNode.propTypes = {
  stage: PropTypes.shape({
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    color: PropTypes.string,
    gradient: PropTypes.string,
    metrics: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        unit: PropTypes.string,
      })
    ),
    dataPoints: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  index: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  isComplete: PropTypes.bool.isRequired,
  isHovered: PropTypes.bool.isRequired,
  onHover: PropTypes.func.isRequired,
  onLeave: PropTypes.func.isRequired,
  totalStages: PropTypes.number.isRequired,
};

// Channel activity card
const ChannelCard = ({ channel, isActive, delay }) => {
  const Icon = channel.icon;

  return (
    <div
      className={`relative p-4 rounded-lg bg-white/5 border border-white/10 transition-all duration-500 ${
        isActive ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10' : ''
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {isActive && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      )}

      <Icon size={20} className={`text-${channel.color}-400 mb-2`} />

      <div className="text-lg lg:text-lg font-bold text-white">
        <CountUpText end={channel.value} duration={1500} />
      </div>

      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-400">{channel.label}/day</span>
        <span className="text-xs text-emerald-400">{channel.trend}</span>
      </div>
    </div>
  );
};

ChannelCard.propTypes = {
  channel: PropTypes.shape({
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    trend: PropTypes.string,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  delay: PropTypes.number.isRequired,
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const DataFlowVisualization = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [completedStages, setCompletedStages] = useState([]);
  const [hoveredStage, setHoveredStage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Autonomous animation
  useEffect(() => {
    if (!isVisible || !isPlaying) return;

    const interval = setInterval(() => {
      setActiveStage(prev => {
        const next = (prev + 1) % FLOW_STAGES.length;
        if (next === 0) {
          setCompletedStages([]);
        } else {
          setCompletedStages(curr => [...new Set([...curr, prev])]);
        }
        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isVisible, isPlaying]);

  // Handle hover - pause auto-play temporarily
  const handleNodeHover = useCallback(index => {
    setHoveredStage(index);
  }, []);

  const handleNodeLeave = useCallback(() => {
    setHoveredStage(null);
  }, []);

  return (
    <section
      ref={containerRef}
      id="data-flow-viz"
      className="py-20 lg:py-28 px-4 lg:px-4 relative overflow-hidden bg-[#030712]"
    >
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-cyan-900/20 to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-purple-900/20 to-transparent blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <RevealText>
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Activity size={16} className="text-cyan-400 animate-pulse" />
              <span className="text-sm text-cyan-400 font-medium">Live Data Flow</span>
            </div>

            <h2 className="text-lg lg:text-5xl xl:text-6xl font-bold mb-4 font-space-grotesk">
              <GradientText gradient="aurora" animate>
                Watch Your Pipeline in Action
              </GradientText>
            </h2>

            <p className="text-lg lg:text-lg text-gray-400 max-w-3xl mx-auto">
              From lead discovery to booked meeting — see how Ava orchestrates every step
            </p>
          </div>
        </RevealText>

        {/* Flow visualization */}
        <div className="mb-12 lg:mb-16">
          {/* Progress bar */}
          <div className="relative h-1 bg-white/5 rounded-full mb-8 lg:mb-12 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700"
              style={{ width: `${((activeStage + 1) / FLOW_STAGES.length) * 100}%` }}
            />
          </div>

          {/* Flow nodes - horizontal scroll on mobile */}
          <div className="overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
            <div className="flex items-center justify-start lg:justify-center gap-3 lg:gap-3 min-w-max lg:min-w-0">
              {FLOW_STAGES.map((stage, index) => (
                <FlowNode
                  key={stage.id}
                  stage={stage}
                  index={index}
                  isActive={activeStage === index}
                  isComplete={completedStages.includes(index)}
                  isHovered={hoveredStage === index}
                  onHover={handleNodeHover}
                  onLeave={handleNodeLeave}
                  totalStages={FLOW_STAGES.length}
                />
              ))}
            </div>
          </div>

          {/* Play/Pause control */}
          <div className="flex justify-center mt-6 lg:mt-8">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-all"
            >
              {isPlaying ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Auto-playing
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-gray-500" />
                  Paused
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live metrics dashboard */}
        <RevealText delay={200}>
          <GlassCard variant="gradient" className="p-4 lg:p-4" glow glowColor="purple">
            <div className="grid lg:grid-cols-2 gap-3">
              {/* Left: Channel activity */}
              <div>
                <h3 className="text-lg font-bold mb-6 font-space-grotesk flex items-center gap-2">
                  <Zap size={20} className="text-cyan-400" />
                  <GradientText gradient="cyber">Channel Activity</GradientText>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {CHANNEL_METRICS.map((channel, index) => (
                    <ChannelCard
                      key={channel.label}
                      channel={channel}
                      isActive={activeStage >= 4}
                      delay={index * 100}
                    />
                  ))}
                </div>
              </div>

              {/* Right: Aggregate stats */}
              <div>
                <h3 className="text-lg font-bold mb-6 font-space-grotesk flex items-center gap-2">
                  <BarChart3 size={20} className="text-purple-400" />
                  <GradientText gradient="aurora">Performance Metrics</GradientText>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {AGGREGATE_STATS.map((stat, index) => (
                    <div
                      key={stat.label}
                      className="p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="text-lg lg:text-lg font-bold mb-1">
                        <GradientText gradient="cyber">
                          {stat.prefix}
                          <CountUpText
                            end={isVisible ? stat.value : 0}
                            duration={2000}
                            delay={index * 200}
                            decimals={
                              stat.format === 'decimal' || stat.format === 'percent' ? 1 : 0
                            }
                          />
                          {stat.suffix}
                        </GradientText>
                      </div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Active stage detail */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-9 rounded-lg bg-gradient-to-br ${FLOW_STAGES[activeStage].gradient} flex items-center justify-center`}
                  >
                    {React.createElement(FLOW_STAGES[activeStage].icon, {
                      size: 20,
                      className: 'text-white',
                    })}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{FLOW_STAGES[activeStage].title}</h4>
                    <p className="text-sm text-gray-400">Currently processing</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    <GlowText color="cyan">
                      {FLOW_STAGES[activeStage].metrics.value}
                      {FLOW_STAGES[activeStage].metrics.unit}
                    </GlowText>
                  </div>
                  <div className="text-xs text-gray-400">
                    {FLOW_STAGES[activeStage].metrics.label}
                  </div>
                </div>
              </div>

              {/* Data points for current stage */}
              <div className="flex flex-wrap gap-3">
                {FLOW_STAGES[activeStage].dataPoints.map((point, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 animate-fadeIn"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2" />
                    {point}
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>
        </RevealText>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes flowRight {
          0% { left: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        .animate-flowRight {
          animation: flowRight 1.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default DataFlowVisualization;
