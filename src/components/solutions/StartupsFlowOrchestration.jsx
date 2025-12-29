import React, { useState, useEffect } from 'react';
import {
  Target,
  Database,
  Brain,
  Sparkles,
  Send,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Zap,
  DollarSign,
  Clock,
  Users,
} from 'lucide-react';

const StartupsFlowOrchestration = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const stages = [
    {
      id: 0,
      title: 'Define Your ICP',
      subtitle: 'Start with basics',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      duration: 'Day 1',
      description: 'Tell us your ideal customer profile - industry, company size, role',
      dataPoints: [
        'Industry: B2B SaaS',
        'Company Size: 10-200 employees',
        'Decision Makers: VP Sales, CROs',
      ],
      metrics: { time: '15 min', effort: 'Low', cost: '$0' },
    },
    {
      id: 1,
      title: 'AI Finds Your Leads',
      subtitle: '300M+ database search',
      icon: Database,
      color: 'from-blue-500 to-cyan-500',
      duration: 'Day 1',
      description: 'Ava searches 300M+ contacts and finds 2,847 perfect matches',
      dataPoints: [
        'Contacts Found: 2,847',
        'Intent Signals: 342 high',
        'Enrichment: 100% complete',
      ],
      metrics: { time: '5 min', effort: 'Zero', cost: '$0' },
    },
    {
      id: 2,
      title: 'Test Your Messaging',
      subtitle: 'A/B test campaigns',
      icon: Sparkles,
      color: 'from-orange-500 to-red-500',
      duration: 'Day 2',
      description: 'Set up 3 campaigns to A/B test different value props and see what resonates',
      dataPoints: [
        'Campaign A: Pain-focused',
        'Campaign B: ROI-focused',
        'Campaign C: Feature-focused',
      ],
      metrics: { time: '30 min', effort: 'Low', cost: '$0' },
    },
    {
      id: 3,
      title: 'AI Writes Emails',
      subtitle: 'Personalized at scale',
      icon: Brain,
      color: 'from-purple-600 to-indigo-600',
      duration: 'Day 2',
      description: 'GPT-4 generates personalized emails using your playbooks and best practices',
      dataPoints: ['Emails Generated: 2,847', 'Personalization: 95%', 'Tone: Professional'],
      metrics: { time: '10 min', effort: 'Review only', cost: '$0' },
    },
    {
      id: 4,
      title: 'Safe Domain Setup',
      subtitle: 'Protection built-in',
      icon: Zap,
      color: 'from-green-500 to-teal-500',
      duration: 'Day 3',
      description:
        'We set up a secondary domain, warm it up, and configure all deliverability settings',
      dataPoints: ['Secondary Domain: Ready', 'Warmup: Complete', 'SPF/DKIM: Configured'],
      metrics: { time: 'Auto', effort: 'Zero', cost: 'Included' },
    },
    {
      id: 5,
      title: 'Campaign Launch',
      subtitle: 'Multi-channel outreach',
      icon: Send,
      color: 'from-blue-600 to-purple-600',
      duration: 'Day 3',
      description: 'Ava sends emails, follows up on LinkedIn, and tracks all engagement',
      dataPoints: ['Emails Sent: 2,847', 'LinkedIn Messages: 342', 'Follow-ups: Automated'],
      metrics: { time: 'Ongoing', effort: 'Zero', cost: '$12/mo' },
    },
    {
      id: 6,
      title: 'Learn & Optimize',
      subtitle: 'Real-time analytics',
      icon: TrendingUp,
      color: 'from-indigo-500 to-purple-500',
      duration: 'Week 1+',
      description: 'See which campaign performs best, Ava learns and optimizes automatically',
      dataPoints: [
        'Campaign B: 18% response',
        'Campaign A: 12% response',
        'Campaign C: 8% response',
      ],
      metrics: { time: 'Auto', effort: 'Review', cost: '$0' },
    },
    {
      id: 7,
      title: 'Meetings Booked',
      subtitle: 'Pipeline generated',
      icon: CheckCircle,
      color: 'from-green-600 to-emerald-600',
      duration: 'Week 2+',
      description: 'Start having conversations with qualified prospects who respond',
      dataPoints: ['Meetings Booked: 47', 'Pipeline: $580K', 'Cost per Meeting: $12'],
      metrics: { time: '2 weeks', effort: 'Close deals', cost: '10x ROI' },
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStage(prev => (prev + 1) % stages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPlaying, stages.length]);

  const currentStage = stages[activeStage];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900/50 to-purple-900/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-semibold mb-4">
            <Zap className="w-4 h-4" />
            How It Works for Startups
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            From Zero to Pipeline in 3 Days
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Watch how a startup goes from "no outbound" to qualified meetings in 72 hours
          </p>
        </div>

        {/* Timeline Flow */}
        <div className="mb-12 overflow-x-auto pb-4">
          <div className="flex items-center gap-2 min-w-max">
            {stages.map((stage, idx) => (
              <React.Fragment key={stage.id}>
                <div
                  className={`relative flex-shrink-0 w-40 transition-all duration-500 cursor-pointer ${
                    activeStage === idx ? 'scale-110 z-10' : 'scale-95 opacity-60 hover:opacity-100'
                  }`}
                  onClick={() => {
                    setActiveStage(idx);
                    setIsPlaying(false);
                  }}
                >
                  <div
                    className={`p-4 rounded-xl border-2 transition-all ${
                      activeStage === idx
                        ? `bg-gradient-to-br ${stage.color} border-white shadow-2xl`
                        : 'bg-slate-800 border-slate-600'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          activeStage === idx ? 'bg-white/20' : 'bg-slate-700'
                        }`}
                      >
                        <stage.icon
                          className={`w-6 h-6 ${activeStage === idx ? 'text-white' : 'text-slate-400'}`}
                        />
                      </div>
                      <div className="text-center">
                        <div
                          className={`text-xs font-bold mb-1 ${activeStage === idx ? 'text-white' : 'text-slate-400'}`}
                        >
                          {stage.duration}
                        </div>
                        <div
                          className={`text-xs font-semibold ${activeStage === idx ? 'text-white' : 'text-slate-300'}`}
                        >
                          {stage.title}
                        </div>
                      </div>
                    </div>
                  </div>

                  {activeStage === idx && (
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white animate-pulse shadow-lg" />
                  )}
                </div>

                {idx < stages.length - 1 && (
                  <ArrowRight
                    className={`w-5 h-5 flex-shrink-0 transition-colors ${
                      activeStage >= idx ? 'text-purple-400' : 'text-slate-600'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Active Stage Details */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Stage Info */}
          <div
            className={`bg-gradient-to-br ${currentStage.color} p-8 rounded-2xl border-2 border-white/20`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
                  <currentStage.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white/80">{currentStage.duration}</div>
                  <h3 className="text-2xl font-bold text-white">{currentStage.title}</h3>
                  <p className="text-white/80">{currentStage.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-semibold transition-colors"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>

            <p className="text-white text-lg mb-6">{currentStage.description}</p>

            <div className="space-y-3">
              {currentStage.dataPoints.map((point, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                  <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="text-white font-medium">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics & ROI */}
          <div className="space-y-4">
            <div className="bg-slate-800 border-2 border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Startup Efficiency Metrics
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {currentStage.metrics.time}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Time Required</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {currentStage.metrics.effort}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Your Effort</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    {currentStage.metrics.cost}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Cost</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-2 border-green-500/30 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Startup ROI Calculator
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Monthly Cost:</span>
                  <span className="text-white font-bold">$12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Meetings Booked:</span>
                  <span className="text-white font-bold">47 / month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Cost per Meeting:</span>
                  <span className="text-white font-bold">$0.26</span>
                </div>
                <div className="border-t border-green-500/30 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Pipeline Generated:</span>
                    <span className="text-green-400 font-bold text-xl">$580K</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-300">ROI:</span>
                    <span className="text-green-400 font-bold text-xl">48,333x</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border-2 border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                vs. Hiring SDRs
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">1 SDR Cost:</span>
                  <span className="text-white">$5,000/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">SDR Meetings/mo:</span>
                  <span className="text-white">~8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ava Meetings/mo:</span>
                  <span className="text-green-400 font-bold">47</span>
                </div>
                <div className="border-t border-slate-700 pt-3 mt-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">$4,988</div>
                    <div className="text-xs text-gray-400">saved per month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Stage {activeStage + 1} of {stages.length}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(((activeStage + 1) / stages.length) * 100)}% Complete
            </span>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${((activeStage + 1) / stages.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartupsFlowOrchestration;
