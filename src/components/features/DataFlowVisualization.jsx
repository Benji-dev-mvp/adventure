/**
 * DataFlowVisualization.jsx - REBUILT
 * 
 * Clean, working implementation of the data flow pipeline visualization
 * with auto-syncing animation and real-time metrics
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Database,
  Brain,
  Target,
  Send,
  Eye,
  CheckCircle2,
  Calendar,
  Zap,
  Activity,
  Mail,
  Linkedin,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { GradientText, RevealText, CountUpText } from '../futuristic';

// ============================================================================
// CONSTANTS
// ============================================================================

const FLOW_STAGES = [
  {
    id: 'discover',
    title: 'Lead Discovery',
    subtitle: '300M+ Contacts',
    icon: Search,
    color: 'cyan',
    iconColor: 'text-cyan-400',
    dotColor: 'bg-cyan-400',
    gradient: 'from-cyan-500 to-blue-500',
    metrics: { value: 12847, label: 'Leads Found', unit: '' },
  },
  {
    id: 'enrich',
    title: 'AI Enrichment',
    subtitle: 'Deep Research',
    icon: Database,
    color: 'blue',
    iconColor: 'text-blue-400',
    dotColor: 'bg-blue-400',
    gradient: 'from-blue-500 to-indigo-500',
    metrics: { value: 98.7, label: 'Data Accuracy', unit: '%' },
  },
  {
    id: 'personalize',
    title: 'Personalization',
    subtitle: 'AI Engine',
    icon: Brain,
    color: 'purple',
    iconColor: 'text-purple-400',
    dotColor: 'bg-purple-400',
    gradient: 'from-purple-500 to-pink-500',
    metrics: { value: 847, label: 'Emails Crafted', unit: '/hr' },
  },
  {
    id: 'score',
    title: 'Lead Scoring',
    subtitle: 'Predictive AI',
    icon: Target,
    color: 'pink',
    iconColor: 'text-pink-400',
    dotColor: 'bg-pink-400',
    gradient: 'from-pink-500 to-rose-500',
    metrics: { value: 94, label: 'Accuracy Rate', unit: '%' },
  },
  {
    id: 'outreach',
    title: 'Multi-Channel',
    subtitle: 'Orchestration',
    icon: Send,
    color: 'orange',
    iconColor: 'text-orange-400',
    dotColor: 'bg-orange-400',
    gradient: 'from-orange-500 to-amber-500',
    metrics: { value: 4200, label: 'Touches/Day', unit: '' },
  },
  {
    id: 'engage',
    title: 'Engagement',
    subtitle: 'Tracking',
    icon: Eye,
    color: 'emerald',
    iconColor: 'text-emerald-400',
    dotColor: 'bg-emerald-400',
    gradient: 'from-emerald-500 to-teal-500',
    metrics: { value: 67, label: 'Open Rate', unit: '%' },
  },
  {
    id: 'qualify',
    title: 'Qualification',
    subtitle: 'AI Triage',
    icon: CheckCircle2,
    color: 'teal',
    iconColor: 'text-teal-400',
    dotColor: 'bg-teal-400',
    gradient: 'from-teal-500 to-cyan-500',
    metrics: { value: 23, label: 'SQLs Today', unit: '' },
  },
  {
    id: 'book',
    title: 'Meeting Booked',
    subtitle: 'Calendar Sync',
    icon: Calendar,
    color: 'green',
    iconColor: 'text-green-400',
    dotColor: 'bg-green-400',
    gradient: 'from-green-500 to-emerald-500',
    metrics: { value: 8, label: 'Meetings Today', unit: '' },
  },
];

const CHANNEL_METRICS = [
  { icon: Mail, label: 'Emails', value: 2400, iconColor: 'text-cyan-400', trend: '+12%' },
  { icon: Linkedin, label: 'LinkedIn', value: 1200, iconColor: 'text-blue-400', trend: '+8%' },
  { icon: Phone, label: 'Calls', value: 600, iconColor: 'text-purple-400', trend: '+15%' },
  { icon: MessageSquare, label: 'SMS', value: 400, iconColor: 'text-pink-400', trend: '+22%' },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const FlowNode = ({ stage, index, isActive, isComplete, totalStages }) => {
  const Icon = stage.icon;
  const isLast = index === totalStages - 1;

  return (
    <div className="relative group flex-shrink-0">
      {/* Connection line to next node */}
      {!isLast && (
        <div className="absolute top-1/2 left-full w-8 lg:w-12 h-0.5 -translate-y-1/2 overflow-hidden z-0">
          <div
            className={`h-full transition-all duration-700 ${
              isComplete || isActive ? `bg-gradient-to-r ${stage.gradient}` : 'bg-white/10'
            }`}
          />
        </div>
      )}

      {/* Glow effect when active */}
      {(isActive) && (
        <div
          className={`absolute -inset-2 rounded-lg bg-gradient-to-r ${stage.gradient} blur-xl opacity-30 transition-opacity duration-500`}
        />
      )}

      {/* Node container */}
      <div
        className={`relative w-32 lg:w-40 p-3 lg:p-4 rounded-lg border transition-all duration-500 ${
          isActive
            ? `bg-gradient-to-br ${stage.gradient} border-transparent shadow-2xl scale-105`
            : isComplete
              ? 'bg-white/10 border-white/20'
              : 'bg-white/5 border-white/10'
        }`}
      >
        {/* Completion checkmark */}
        {isComplete && !isActive && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center z-10">
            <CheckCircle2 size={12} className="text-white" />
          </div>
        )}

        {/* Icon */}
        <div
          className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center mb-2 ${
            isActive ? 'bg-white/20' : 'bg-white/10'
          }`}
        >
          <Icon size={20} className={isActive ? 'text-white' : stage.iconColor} />
        </div>

        {/* Title */}
        <h4
          className={`font-semibold text-xs lg:text-sm mb-1 line-clamp-2 ${
            isActive ? 'text-white' : 'text-gray-300'
          }`}
        >
          {stage.title}
        </h4>

        <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
          {stage.subtitle}
        </p>

        {/* Metric when active */}
        {isActive && (
          <div className="mt-2 pt-2 border-t border-white/20 animate-fadeIn">
            <div className="text-base lg:text-lg font-bold text-white">
              {stage.metrics.value}
              {stage.metrics.unit}
            </div>
            <div className="text-xs text-white/60">{stage.metrics.label}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const ChannelCard = ({ channel, isActive, delay }) => {
  const Icon = channel.icon;

  return (
    <div
      className={`relative p-4 rounded-lg bg-white/5 border transition-all duration-500 ${
        isActive ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10' : 'border-white/10'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {isActive && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      )}

      <Icon size={20} className={`${channel.iconColor} mb-2`} />

      <div className="text-xl font-bold text-white">
        <CountUpText end={channel.value} duration={1500} />
      </div>

      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-400">{channel.label}/day</span>
        <span className="text-xs text-emerald-400">{channel.trend}</span>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const DataFlowVisualization = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [completedStages, setCompletedStages] = useState([]);
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
          setTimeout(() => setCompletedStages([]), 300);
        } else {
          setCompletedStages(curr => [...new Set([...curr, prev])]);
        }
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible, isPlaying]);

  return (
    <section
      ref={containerRef}
      id="data-flow-viz"
      className="py-20 lg:py-28 px-4 relative overflow-hidden bg-[#030712]"
    >
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-cyan-900/20 to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-purple-900/20 to-transparent blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <RevealText>
          <div className="max-w-5xl mx-auto mb-12 lg:mb-16">
            {/* Status badges */}
            <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <Activity size={16} className="text-cyan-400 animate-pulse" />
                <span className="text-sm text-cyan-400 font-medium">Live Data Flow</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                <span className="text-sm text-emerald-400 font-medium">Auto-Syncing</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30">
                <Zap size={14} className="text-purple-400" />
                <span className="text-xs text-purple-400 font-semibold">4.2K/day</span>
              </div>
            </div>

            <h2 className="text-3xl lg:text-5xl xl:text-6xl font-bold mb-4 font-space-grotesk text-center">
              <GradientText gradient="aurora" animate>
                Watch Your Pipeline in Action
              </GradientText>
            </h2>

            <p className="text-base lg:text-xl text-gray-400 max-w-3xl mx-auto text-center leading-relaxed">
              From lead discovery to booked meeting — see how Ava autonomously orchestrates every
              step in real-time
            </p>

            {/* Real-time stats */}
            <div className="grid grid-cols-3 gap-3 mt-8 max-w-2xl mx-auto">
              <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-cyan-400 mb-1">
                  <CountUpText end={847} duration={2000} />
                </div>
                <div className="text-xs text-gray-400">Leads/Hour</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  <CountUpText end={94} suffix="%" duration={2000} />
                </div>
                <div className="text-xs text-gray-400">AI Accuracy</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-emerald-400 mb-1">
                  <CountUpText end={67} suffix="%" duration={2000} />
                </div>
                <div className="text-xs text-gray-400">Open Rate</div>
              </div>
            </div>
          </div>
        </RevealText>

        {/* Flow visualization */}
        <div className="mb-12 lg:mb-16">
          {/* Progress bar */}
          <div className="relative h-1.5 bg-white/5 rounded-full mb-8 lg:mb-12 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${((activeStage + 1) / FLOW_STAGES.length) * 100}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Flow nodes */}
          <div className="overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
            <div className="flex items-center justify-start lg:justify-center gap-3 lg:gap-4 min-w-max lg:min-w-0">
              {FLOW_STAGES.map((stage, index) => (
                <FlowNode
                  key={stage.id}
                  stage={stage}
                  index={index}
                  isActive={activeStage === index}
                  isComplete={completedStages.includes(index)}
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

        {/* Channel metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CHANNEL_METRICS.map((channel, index) => (
            <ChannelCard
              key={channel.label}
              channel={channel}
              isActive={true}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DataFlowVisualization;
