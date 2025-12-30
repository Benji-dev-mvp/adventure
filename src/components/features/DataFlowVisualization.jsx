/**
 * DataFlowVisualization.jsx - PROFESSIONAL REDESIGN
 *
 * Premium data visualization pipeline inspired by Figma & Webflow design patterns
 * with glassmorphism, real-time metrics, and smooth animations
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
  TrendingUp,
  ArrowRight,
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
    <div className="relative group">
      {/* Connection line to next node - Premium style */}
      {!isLast && (
        <svg
          className="absolute -right-4 lg:-right-8 top-1/2 -translate-y-1/2 w-8 lg:w-16 h-1 z-0"
          viewBox="0 0 64 4"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isComplete || isActive ? 'currentColor' : 'rgba(255,255,255,0.1)'} />
              <stop offset="100%" stopColor={isComplete || isActive ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.05)'} />
            </linearGradient>
          </defs>
          <line
            x1="0" y1="2" x2="64" y2="2"
            stroke={`url(#grad-${index})`}
            strokeWidth="2"
            className="transition-all duration-700"
          />
          {(isComplete || isActive) && (
            <circle cx="60" cy="2" r="2" fill="currentColor" className={isActive ? 'text-cyan-400' : 'text-emerald-400'} />
          )}
        </svg>
      )}

      {/* Glow effect - enhanced for active state */}
      {isActive && (
        <>
          <div
            className={`absolute -inset-3 rounded-xl bg-gradient-to-r ${stage.gradient} blur-2xl opacity-40 transition-opacity duration-500`}
          />
          <div className="absolute -inset-0.5 rounded-xl border border-white/20 opacity-0 animate-pulse" />
        </>
      )}

      {/* Node container - Figma/Webflow style card */}
      <div
        className={`relative w-40 lg:w-48 transition-all duration-500 overflow-hidden rounded-xl border backdrop-blur-md ${
          isActive
            ? `bg-gradient-to-br ${stage.gradient} border-white/40 shadow-2xl shadow-cyan-500/20 scale-110`
            : isComplete
              ? 'bg-white/8 border-white/15 hover:bg-white/12 hover:border-white/20'
              : 'bg-white/5 border-white/10 hover:bg-white/8'
        }`}
      >
        {/* Background pattern overlay for premium feel */}
        {isActive && <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_1px)] bg-[length:16px_16px]" />}

        {/* Content wrapper */}
        <div className="relative p-4 lg:p-5 flex flex-col h-full">
          {/* Completion badge */}
          {isComplete && !isActive && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/30 border border-emerald-500/50">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span className="text-xs font-medium text-emerald-300">Done</span>
            </div>
          )}

          {/* Step counter */}
          <div className={`text-xs font-bold tracking-wider mb-3 transition-colors ${
            isActive ? 'text-white/70' : 'text-gray-500'
          }`}>
            STEP {index + 1}
          </div>

          {/* Icon with enhanced styling */}
          <div
            className={`w-12 h-12 lg:w-14 lg:h-14 rounded-lg flex items-center justify-center mb-3 transition-all ${
              isActive
                ? 'bg-white/20 shadow-lg'
                : 'bg-white/8 group-hover:bg-white/12'
            }`}
          >
            <Icon size={24} className={isActive ? 'text-white' : stage.iconColor} />
          </div>

          {/* Title - improved typography */}
          <h4
            className={`font-bold text-sm lg:text-base mb-1 leading-tight transition-colors ${
              isActive ? 'text-white' : 'text-gray-200'
            }`}
          >
            {stage.title}
          </h4>

          {/* Subtitle */}
          <p className={`text-xs mb-4 transition-colors ${
            isActive ? 'text-white/70' : 'text-gray-400'
          }`}>
            {stage.subtitle}
          </p>

          {/* Metric display - only when active */}
          {isActive && (
            <div className="mt-auto pt-3 border-t border-white/20 animate-fadeIn">
              <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                {stage.metrics.value}
                <span className="text-lg text-white/60">{stage.metrics.unit}</span>
              </div>
              <div className="text-xs text-white/60 font-medium">{stage.metrics.label}</div>
            </div>
          )}

          {/* Idle state info */}
          {!isActive && (
            <div className="mt-auto text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
              {stage.metrics.value} {stage.metrics.label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChannelCard = ({ channel, isActive, delay }) => {
  const Icon = channel.icon;

  return (
    <div
      className={`relative group overflow-hidden rounded-xl border backdrop-blur-md transition-all duration-500 h-full ${
        'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/15'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Premium background gradient for hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br from-white to-transparent transition-opacity duration-500" />

      {/* Content */}
      <div className="relative p-5 lg:p-6 h-full flex flex-col">
        {/* Header with icon and trend */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-3 rounded-lg transition-all ${
              'bg-white/10 group-hover:bg-white/15'
            }`}
          >
            <Icon size={20} className={`${channel.iconColor}`} />
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40">
            <TrendingUp size={12} className="text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400">{channel.trend}</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="mb-4">
          <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
            <CountUpText end={channel.value} duration={2000} />
          </div>
          <p className="text-xs text-gray-400 font-medium tracking-wide">{channel.label.toUpperCase()}</p>
        </div>

        {/* Progress bar */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Daily Volume</span>
            <span className="text-xs font-bold text-gray-300">{Math.round(channel.value / 30)}%</span>
          </div>
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${
                channel.label === 'Emails'
                  ? 'from-cyan-500 to-blue-500'
                  : channel.label === 'LinkedIn'
                    ? 'from-blue-500 to-indigo-500'
                    : channel.label === 'Calls'
                      ? 'from-purple-500 to-pink-500'
                      : 'from-pink-500 to-rose-500'
              } transition-all duration-1000`}
              style={{ width: `${Math.round(channel.value / 30)}%` }}
            />
          </div>
        </div>
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
      className="py-24 lg:py-32 px-4 relative overflow-hidden bg-gradient-to-b from-[#030712] via-[#0a0817] to-[#030712]"
    >
      {/* Enhanced background effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-cyan-900/30 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-purple-900/30 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-gradient-radial from-pink-900/20 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Premium Header Section */}
        <RevealText>
          <div className="max-w-5xl mx-auto mb-16 lg:mb-20 text-center">
            {/* Status badges - Figma style */}
            <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
              <div className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/15 transition-all backdrop-blur-sm cursor-default">
                <div className="relative flex h-2 w-2">
                  <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </div>
                <span className="text-sm text-cyan-300 font-semibold">Live Pipeline</span>
              </div>
              
              <div className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all backdrop-blur-sm">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                <span className="text-sm text-emerald-300 font-semibold">Auto-Syncing</span>
              </div>
              
              <div className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/15 border border-purple-500/30 hover:bg-purple-500/20 transition-all backdrop-blur-sm">
                <Activity size={14} className="text-purple-400 animate-pulse" />
                <span className="text-sm text-purple-300 font-semibold">4.2K/day</span>
              </div>
            </div>

            {/* Main heading */}
            <h2 className="text-4xl lg:text-6xl xl:text-7xl font-bold mb-6 font-space-grotesk leading-tight">
              <GradientText gradient="aurora" animate>
                Your Pipeline,
              </GradientText>
              <br />
              <GradientText gradient="aurora" animate>
                Visualized in Real-Time
              </GradientText>
            </h2>

            <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-2">
              Watch Ava orchestrate your entire sales funnel—from lead discovery to closed deals—with unprecedented visibility and control.
            </p>
            <p className="text-sm text-gray-500">AI-powered automation that works transparently at every stage</p>

            {/* Enhanced stats grid */}
            <div className="grid grid-cols-3 gap-4 mt-10 max-w-2xl mx-auto">
              <div className="group relative rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/8 hover:border-white/15 transition-all backdrop-blur-sm cursor-default overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br from-cyan-500 to-transparent transition-opacity" />
                <div className="relative">
                  <div className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Leads/Hour</div>
                  <div className="text-3xl lg:text-4xl font-bold text-cyan-300 mb-1">
                    <CountUpText end={847} duration={2500} />
                  </div>
                  <div className="inline-block px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 mt-2">
                    <span className="text-xs text-emerald-300 font-semibold">↑ +18% today</span>
                  </div>
                </div>
              </div>

              <div className="group relative rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/8 hover:border-white/15 transition-all backdrop-blur-sm cursor-default overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br from-purple-500 to-transparent transition-opacity" />
                <div className="relative">
                  <div className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">AI Accuracy</div>
                  <div className="text-3xl lg:text-4xl font-bold text-purple-300 mb-1">
                    <CountUpText end={94} suffix="%" duration={2500} />
                  </div>
                  <div className="inline-block px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 mt-2">
                    <span className="text-xs text-emerald-300 font-semibold">↑ Best-in-class</span>
                  </div>
                </div>
              </div>

              <div className="group relative rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/8 hover:border-white/15 transition-all backdrop-blur-sm cursor-default overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br from-emerald-500 to-transparent transition-opacity" />
                <div className="relative">
                  <div className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Open Rate</div>
                  <div className="text-3xl lg:text-4xl font-bold text-emerald-300 mb-1">
                    <CountUpText end={67} suffix="%" duration={2500} />
                  </div>
                  <div className="inline-block px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 mt-2">
                    <span className="text-xs text-emerald-300 font-semibold">↑ +24% MoM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealText>

        {/* Flow Visualization - Premium Section */}
        <div className="mb-16 lg:mb-20">
          {/* Progress indicator */}
          <div className="mb-10 lg:mb-14">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs uppercase tracking-widest text-gray-400 font-bold">Pipeline Progress</div>
              <div className="text-sm text-gray-400">
                <span className="text-white font-bold">{activeStage + 1}</span>
                <span className="text-gray-600"> / {FLOW_STAGES.length}</span>
              </div>
            </div>
            <div className="relative h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out relative shadow-lg shadow-cyan-500/30"
                style={{ width: `${((activeStage + 1) / FLOW_STAGES.length) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Flow nodes - Premium layout */}
          <div className="overflow-hidden pb-6">
            <div className="flex items-center justify-center flex-wrap gap-4 lg:gap-6">
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

          {/* Control bar */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all backdrop-blur-sm border ${
                isPlaying
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/15'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isPlaying ? 'animate-pulse bg-emerald-400' : 'bg-gray-600'}`} />
              {isPlaying ? 'Auto-playing' : 'Paused'}
            </button>
          </div>
        </div>

        {/* Channel Metrics - Premium Grid */}
        <div className="mt-20 lg:mt-24">
          <div className="mb-8">
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">Channel Performance</h3>
            <p className="text-gray-400">Real-time metrics across your outreach channels</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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
      </div>
    </section>
  );
};

export default DataFlowVisualization;
