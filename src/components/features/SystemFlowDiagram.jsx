import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import {
  Database,
  Brain,
  Zap,
  TrendingUp,
  Shield,
  CheckCircle2,
  ArrowRight,
  Activity,
  Users,
  Mail,
  MessageSquare,
  Phone,
  Linkedin,
} from 'lucide-react';

const SystemFlowDiagram = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const flowSteps = [
    {
      id: 0,
      title: 'Data Intelligence',
      icon: Database,
      color: 'from-blue-500 to-cyan-500',
      description: 'Access 300M+ B2B contacts with real-time intent signals',
      details: [
        'Technographic & firmographic data',
        'Real-time intent signals',
        'Contact-level enrichment',
        'Job change alerts',
      ],
      position: { top: '50%', left: '5%' },
    },
    {
      id: 1,
      title: 'AI Processing',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      description: 'GPT-4 analyzes leads and generates personalized content',
      details: [
        'Context-aware messaging',
        'Multi-tone generation',
        'A/B test variants',
        'Sentiment optimization',
      ],
      position: { top: '50%', left: '25%' },
    },
    {
      id: 2,
      title: 'Governance',
      icon: Shield,
      color: 'from-orange-500 to-red-500',
      description: 'Policy enforcement & approval workflows',
      details: [
        'Content approval gates',
        'DLP & PII scrubbing',
        'Compliance checks',
        'Send limits & throttling',
      ],
      position: { top: '20%', left: '50%' },
    },
    {
      id: 3,
      title: 'Multi-Channel Execution',
      icon: Zap,
      color: 'from-green-500 to-emerald-500',
      description: 'Orchestrated outreach across all channels',
      details: ['Email campaigns', 'LinkedIn sequences', 'SMS messaging', 'Call scripts'],
      position: { top: '50%', left: '50%' },
      channels: [
        { icon: Mail, label: 'Email', color: 'text-blue-400' },
        { icon: Linkedin, label: 'LinkedIn', color: 'text-blue-600' },
        { icon: MessageSquare, label: 'SMS', color: 'text-green-400' },
        { icon: Phone, label: 'Calls', color: 'text-purple-400' },
      ],
    },
    {
      id: 4,
      title: 'Analytics & Optimization',
      icon: TrendingUp,
      color: 'from-indigo-500 to-purple-500',
      description: 'Real-time insights drive continuous improvement',
      details: [
        'Engagement tracking',
        'Conversion analytics',
        'ROI measurement',
        'Predictive insights',
      ],
      position: { top: '50%', left: '75%' },
    },
  ];

  const connections = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 1 }, // Feedback loop
  ];

  return (
    <div className="w-full py-16 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-4">
            <Activity className="w-4 h-4" />
            Live System Flow
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
            From Lead to Conversion in One Platform
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Watch how data flows through AI-powered personalization, governance, and multi-channel
            execution
          </p>
        </div>

        {/* Flow Diagram */}
        <div className="relative bg-white dark:bg-slate-800 rounded-lg p-4 md:p-12 shadow-xl border border-slate-200 dark:border-slate-700 min-h-[500px] overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(100, 116, 139, 0.4) 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          {/* Animated connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
                <stop offset="50%" stopColor="rgba(139, 92, 246, 0.6)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0.2)" />
              </linearGradient>
            </defs>
            {connections.map((conn, idx) => {
              const fromNode = flowSteps[conn.from];
              const toNode = flowSteps[conn.to];
              const isActive = activeStep === conn.to || activeStep === conn.from;

              return (
                <line
                  key={idx}
                  x1={`calc(${fromNode.position.left} + 5%)`}
                  y1={fromNode.position.top}
                  x2={`calc(${toNode.position.left} + 5%)`}
                  y2={toNode.position.top}
                  stroke={isActive ? 'url(#lineGradient)' : 'rgba(100, 116, 139, 0.2)'}
                  strokeWidth={isActive ? '3' : '2'}
                  strokeDasharray={isActive ? '5,5' : 'none'}
                  className="transition-all duration-500"
                >
                  {isActive && (
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="10"
                      dur="0.5s"
                      repeatCount="indefinite"
                    />
                  )}
                </line>
              );
            })}
          </svg>

          {/* Flow nodes */}
          {flowSteps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            const isHovered = hoveredNode === step.id;

            return (
              <div
                key={step.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-500"
                style={{
                  top: step.position.top,
                  left: step.position.left,
                  width: isHovered ? '320px' : '280px',
                }}
                onMouseEnter={() => setHoveredNode(step.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <Card
                  className={`relative cursor-pointer transition-all duration-300 ${
                    isActive
                      ? 'ring-4 ring-blue-500 shadow-2xl scale-105'
                      : isHovered
                        ? 'shadow-xl scale-105'
                        : 'shadow-md'
                  } bg-white dark:bg-slate-700 border-2 ${
                    isActive ? 'border-blue-500' : 'border-slate-200 dark:border-slate-600'
                  }`}
                >
                  <div className="p-4">
                    {/* Icon and Title */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-12 h-9 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg ${isActive ? 'animate-pulse' : ''}`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          {step.title}
                        </h3>
                        {isActive && (
                          <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold">
                            <Activity className="w-3 h-3 animate-pulse" />
                            Processing...
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                      {step.description}
                    </p>

                    {/* Details - shown on hover or active */}
                    {(isHovered || isActive) && (
                      <div className="space-y-2 animate-in fade-in duration-200">
                        {step.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-slate-700 dark:text-slate-300">
                              {detail}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Channels (for execution node) */}
                    {step.channels && (isHovered || isActive) && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                        <div className="grid grid-cols-2 gap-2">
                          {step.channels.map((channel, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-600"
                            >
                              <channel.icon className={`w-3 h-3 ${channel.color}`} />
                              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                {channel.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step indicator */}
                    <div className="absolute top-3 right-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isActive
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {idx + 1}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Progress indicator */}
        <div className="mt-8 flex justify-center items-center gap-2">
          {flowSteps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <button
                onClick={() => setActiveStep(step.id)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeStep === step.id
                    ? 'bg-blue-500 w-8'
                    : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                }`}
              />
              {idx < flowSteps.length - 1 && (
                <div className="w-8 h-0.5 bg-slate-200 dark:bg-slate-700" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
            <span>Active Process</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span>Data Flow</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-500" />
            <span>Human-in-the-Loop</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemFlowDiagram;
