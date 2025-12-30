/**
 * DataFlowVisualization.jsx - DATA-DRIVEN STORYTELLING
 *
 * Premium narrative-driven pipeline visualization with rich data cards,
 * micro-sparklines, and sequential animations that tell the conversion story
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
  Users,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import { GradientText, RevealText, CountUpText } from '../futuristic';

// ============================================================================
// DATA-RICH STAGE DEFINITIONS
// ============================================================================

const FLOW_STAGES = [
  {
    id: 'discover',
    title: 'Lead Discovery',
    subtitle: '300M+ Database',
    icon: Search,
    color: 'cyan',
    iconColor: 'text-cyan-400',
    gradient: 'from-cyan-500 to-blue-500',
    metrics: [
      { label: 'Found Today', value: 12847, unit: '', color: 'cyan' },
      { label: 'Database Size', value: 300, unit: 'M+', color: 'cyan' },
      { label: 'Accuracy', value: 98, unit: '%', color: 'cyan' },
    ],
    sparkline: [2, 4, 3, 6, 5, 8, 7, 9, 8, 10, 12, 11],
    description: 'AI scans 300M+ verified B2B contacts',
    flowPercent: 100,
  },
  {
    id: 'enrich',
    title: 'AI Enrichment',
    subtitle: 'Data Validation',
    icon: Database,
    color: 'blue',
    iconColor: 'text-blue-400',
    gradient: 'from-blue-500 to-indigo-500',
    metrics: [
      { label: 'Enriched', value: 98.7, unit: '%', color: 'blue' },
      { label: 'Datapoints', value: 127, unit: 'avg', color: 'blue' },
      { label: 'Speed', value: 2.3, unit: 's', color: 'blue' },
    ],
    sparkline: [3, 5, 4, 7, 6, 9, 8, 10, 9, 11, 13, 12],
    description: 'Deep research adds 127 data points per lead',
    flowPercent: 98.7,
  },
  {
    id: 'personalize',
    title: 'Personalization',
    subtitle: 'Content Generation',
    icon: Brain,
    color: 'purple',
    iconColor: 'text-purple-400',
    gradient: 'from-purple-500 to-pink-500',
    metrics: [
      { label: 'Generated', value: 847, unit: '/hr', color: 'purple' },
      { label: 'Variants', value: 4.2, unit: 'avg', color: 'purple' },
      { label: 'Uniqueness', value: 99, unit: '%', color: 'purple' },
    ],
    sparkline: [4, 6, 5, 8, 7, 10, 9, 11, 10, 12, 14, 13],
    description: 'AI crafts 4.2 unique variations per lead',
    flowPercent: 95.3,
  },
  {
    id: 'score',
    title: 'Lead Scoring',
    subtitle: 'ML Prediction',
    icon: Target,
    color: 'pink',
    iconColor: 'text-pink-400',
    gradient: 'from-pink-500 to-rose-500',
    metrics: [
      { label: 'Accuracy', value: 94, unit: '%', color: 'pink' },
      { label: 'Hot Leads', value: 342, unit: '', color: 'pink' },
      { label: 'Speed', value: 47, unit: 'ms', color: 'pink' },
    ],
    sparkline: [5, 7, 6, 9, 8, 11, 10, 12, 11, 13, 15, 14],
    description: 'Predictive ML scores leads in real-time',
    flowPercent: 89.2,
  },
  {
    id: 'outreach',
    title: 'Multi-Channel',
    subtitle: 'Campaign Execution',
    icon: Send,
    color: 'orange',
    iconColor: 'text-orange-400',
    gradient: 'from-orange-500 to-amber-500',
    metrics: [
      { label: 'Daily Touches', value: 4200, unit: '', color: 'orange' },
      { label: 'Channels', value: 4, unit: '', color: 'orange' },
      { label: 'Cadence', value: 8, unit: 'steps', color: 'orange' },
    ],
    sparkline: [6, 8, 7, 10, 9, 12, 11, 13, 12, 14, 16, 15],
    description: 'Orchestrates 4,200 touches across 4 channels',
    flowPercent: 76.4,
  },
  {
    id: 'engage',
    title: 'Engagement',
    subtitle: 'Interaction Tracking',
    icon: Eye,
    color: 'emerald',
    iconColor: 'text-emerald-400',
    gradient: 'from-emerald-500 to-teal-500',
    metrics: [
      { label: 'Open Rate', value: 67, unit: '%', color: 'emerald' },
      { label: 'Click Rate', value: 34, unit: '%', color: 'emerald' },
      { label: 'Engaged', value: 1289, unit: '', color: 'emerald' },
    ],
    sparkline: [7, 9, 8, 11, 10, 13, 12, 14, 13, 15, 17, 16],
    description: '67% open rate across all channels',
    flowPercent: 51.2,
  },
  {
    id: 'qualify',
    title: 'Qualification',
    subtitle: 'AI Triage',
    icon: CheckCircle2,
    color: 'teal',
    iconColor: 'text-teal-400',
    gradient: 'from-teal-500 to-cyan-500',
    metrics: [
      { label: 'SQLs Created', value: 23, unit: '', color: 'teal' },
      { label: 'Conversion', value: 18, unit: '%', color: 'teal' },
      { label: 'Quality Score', value: 8.7, unit: '/10', color: 'teal' },
    ],
    sparkline: [8, 10, 9, 12, 11, 14, 13, 15, 14, 16, 18, 17],
    description: 'AI triages and qualifies top prospects',
    flowPercent: 9.2,
  },
  {
    id: 'book',
    title: 'Meeting Booked',
    subtitle: 'Sales Handoff',
    icon: Calendar,
    color: 'green',
    iconColor: 'text-green-400',
    gradient: 'from-green-500 to-emerald-500',
    metrics: [
      { label: 'Meetings Today', value: 8, unit: '', color: 'green' },
      { label: 'Success Rate', value: 34, unit: '%', color: 'green' },
      { label: 'Value Pipeline', value: 2.4, unit: 'M$', color: 'green' },
    ],
    sparkline: [9, 11, 10, 13, 12, 15, 14, 16, 15, 17, 19, 18],
    description: 'Booked 8 qualified meetings with decision makers',
    flowPercent: 1.8,
  },
];

// Micro-sparkline component
const Sparkline = ({ data, color, height = 20 }) => {
  const max = Math.max(...data);
  const width = 60;
  const pointWidth = width / (data.length - 1);

  const points = data.map((value, i) => ({
    x: i * pointWidth,
    y: height - (value / max) * height * 0.8,
  }));

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const colorMap = {
    cyan: '#06b6d4',
    blue: '#3b82f6',
    purple: '#a855f7',
    pink: '#ec4899',
    orange: '#f97316',
    emerald: '#10b981',
    teal: '#14b8a6',
    green: '#22c55e',
  };

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="flex-shrink-0">
      <defs>
        <linearGradient id={`sparkline-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colorMap[color]} stopOpacity="0.4" />
          <stop offset="100%" stopColor={colorMap[color]} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d={pathData} stroke={colorMap[color]} strokeWidth="1.5" fill="none" />
      <path d={`${pathData} L ${points[points.length - 1].x} ${height} L 0 ${height} Z`} fill={`url(#sparkline-${color})`} />
    </svg>
  );
};

// Data-driven stage card
const StageCard = ({ stage, index, isActive, isComplete, totalStages, delay }) => {
  const Icon = stage.icon;
  const isLast = index === totalStages - 1;

  return (
    <div
      className="relative group flex-shrink-0 w-full md:w-80 transition-all duration-500 animate-fadeIn"
      style={{
        opacity: isActive ? 1 : 0.6,
        transform: isActive ? 'scale(1)' : 'scale(0.95)',
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Connection arrow to next */}
      {!isLast && (
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <ArrowRight size={20} className={`text-gray-600 rotate-90 ${isComplete ? 'text-emerald-400' : ''}`} />
          <div className={`w-0.5 h-6 transition-colors ${isComplete ? 'bg-emerald-400' : 'bg-gray-700'}`} />
        </div>
      )}

      {/* Premium card container */}
      <div
        className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-500 h-full ${
          isActive
            ? `bg-gradient-to-br ${stage.gradient} bg-opacity-20 border-white/40 shadow-2xl shadow-current/30`
            : isComplete
              ? 'bg-white/8 border-white/15 hover:bg-white/10'
              : 'bg-white/5 border-white/10 hover:bg-white/8'
        }`}
      >
        {/* Animated background pattern */}
        {isActive && (
          <div
            className="absolute inset-0 opacity-20 animate-pulse"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px,currentColor 1px,transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
        )}

        <div className="relative p-6 lg:p-7 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase">
                Step {index + 1} of {totalStages}
              </div>
              <h3 className={`text-lg lg:text-xl font-bold transition-colors ${isActive ? 'text-white' : 'text-gray-200'}`}>
                {stage.title}
              </h3>
              <p className={`text-xs mt-1 ${isActive ? 'text-white/70' : 'text-gray-400'}`}>{stage.subtitle}</p>
            </div>
            
            <div className={`p-3 rounded-xl ${isActive ? 'bg-white/20' : 'bg-white/10'}`}>
              <Icon size={20} className={isActive ? 'text-white' : stage.iconColor} />
            </div>
          </div>

          {/* Completion badge */}
          {isComplete && !isActive && (
            <div className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-emerald-500/30 border border-emerald-500/50 mb-4">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-300">Complete</span>
            </div>
          )}

          {/* Description */}
          <p className={`text-sm mb-5 leading-relaxed ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
            {stage.description}
          </p>

          {/* Metrics grid - data-rich */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {stage.metrics.map((metric, idx) => {
              const colorMap = {
                cyan: 'text-cyan-300',
                blue: 'text-blue-300',
                purple: 'text-purple-300',
                pink: 'text-pink-300',
                orange: 'text-orange-300',
                emerald: 'text-emerald-300',
                teal: 'text-teal-300',
                green: 'text-green-300',
              };
              
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg transition-all ${isActive ? 'bg-white/10' : 'bg-white/5'}`}
                  style={{
                    animation: isActive ? `slideInUp 0.4s ease-out ${idx * 100}ms backwards` : 'none',
                  }}
                >
                  <div className={`text-xs text-gray-400 mb-1 font-medium`}>{metric.label}</div>
                  <div className={`text-lg font-bold flex items-baseline gap-1`}>
                    <CountUpText
                      end={metric.value}
                      duration={1000}
                      className={colorMap[metric.color]}
                    />
                    <span className="text-xs text-gray-500">{metric.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sparkline chart */}
          {isActive && (
            <div className="mb-5 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-medium">Trend (24h)</span>
                <TrendingUp size={14} className="text-emerald-400" />
              </div>
              <div className="flex items-end h-16 justify-between gap-1">
                {stage.sparkline.map((value, idx) => {
                  const gradientMap = {
                    cyan: 'from-cyan-500 to-cyan-400',
                    blue: 'from-blue-500 to-blue-400',
                    purple: 'from-purple-500 to-purple-400',
                    pink: 'from-pink-500 to-pink-400',
                    orange: 'from-orange-500 to-orange-400',
                    emerald: 'from-emerald-500 to-emerald-400',
                    teal: 'from-teal-500 to-teal-400',
                    green: 'from-green-500 to-green-400',
                  };
                  
                  return (
                    <div
                      key={idx}
                      className={`flex-1 rounded-t-sm bg-gradient-to-t ${gradientMap[stage.color]} opacity-60 hover:opacity-100 transition-opacity`}
                      style={{
                        height: `${(value / Math.max(...stage.sparkline)) * 100}%`,
                        minHeight: '2px',
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Conversion funnel indicator */}
          <div className="mt-auto pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 font-medium">Flow Conversion</span>
              <span className={`text-xs font-bold ${stage.flowPercent > 50 ? 'text-emerald-400' : 'text-orange-400'}`}>
                {stage.flowPercent.toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${stage.gradient} transition-all duration-1000`}
                style={{ width: `${stage.flowPercent}%` }}
              />
            </div>
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
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.2 });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Story-driven autonomous animation
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
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible, isPlaying]);

  return (
    <section
      ref={containerRef}
      className="py-24 lg:py-32 px-4 relative overflow-hidden bg-gradient-to-b from-[#030712] via-[#0a0817] to-[#030712]"
    >
      {/* Enhanced background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-cyan-900/30 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-purple-900/30 to-transparent blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <RevealText>
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold mb-4">
              <GradientText gradient="aurora" animate>
                Your Sales Pipeline—Visualized in Real-Time
              </GradientText>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-2">
              Watch as Ava orchestrates every stage from discovery to closed deal
            </p>
            <p className="text-sm text-gray-500">Data updates in real-time • See exactly what's happening at each stage</p>
          </div>
        </RevealText>

        {/* Timeline view - vertical card stack */}
        <div className="space-y-4 lg:space-y-6">
          {FLOW_STAGES.map((stage, index) => (
            <StageCard
              key={stage.id}
              stage={stage}
              index={index}
              isActive={activeStage === index}
              isComplete={completedStages.includes(index)}
              totalStages={FLOW_STAGES.length}
              delay={index * 50}
            />
          ))}
        </div>

        {/* Control bar */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all backdrop-blur-sm border ${
              isPlaying
                ? 'bg-white/10 border-white/20 text-white hover:bg-white/15'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'animate-pulse bg-emerald-400' : 'bg-gray-600'}`} />
            {isPlaying ? 'Auto-playing (4s per stage)' : 'Paused'}
          </button>
          
          <div className="text-sm text-gray-500">
            Stage <span className="text-white font-bold">{activeStage + 1}</span> of <span className="font-bold">{FLOW_STAGES.length}</span>
          </div>
        </div>
      </div>

      {/* Add animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
};

export default DataFlowVisualization;
