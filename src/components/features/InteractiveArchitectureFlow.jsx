import React, { useState, useEffect } from 'react';
import {
  Database,
  Brain,
  Shield,
  Send,
  Eye,
  UserCheck,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Zap,
  AlertTriangle,
  Clock,
  Play,
  Pause,
} from 'lucide-react';

const InteractiveArchitectureFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [dataPacket, setDataPacket] = useState({});

  const steps = [
    {
      id: 0,
      title: 'Lead Discovery',
      subtitle: '300M+ Database Query',
      icon: Database,
      color: 'from-blue-500 to-cyan-500',
      action: 'Scanning for high-intent prospects matching ICP...',
      data: {
        query: 'VP of Sales at Enterprise SaaS companies',
        filters: ['Revenue: $50M-500M', 'Employee Count: 500-5000', 'Tech Stack: Salesforce'],
        found: '2,847 matches',
      },
      screenshot: {
        type: 'search',
        results: [
          { name: 'Sarah Chen', title: 'VP of Sales', company: 'TechCorp', score: 94 },
          { name: 'Michael Rodriguez', title: 'Director Sales', company: 'CloudScale', score: 91 },
          { name: 'Emily Watson', title: 'CRO', company: 'DataFlow', score: 88 },
        ],
      },
    },
    {
      id: 1,
      title: 'AI Analysis',
      subtitle: 'Intent Signal Processing',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      action: 'GPT-4 analyzing intent signals and crafting strategy...',
      data: {
        lead: 'Sarah Chen, VP of Sales at TechCorp',
        signals: ['Visited pricing page 3x', 'Downloaded whitepaper', 'Tech stack match: 95%'],
        buyerPersona: 'Revenue leader seeking scale',
        recommendedChannel: 'Email → LinkedIn → Call',
      },
      screenshot: {
        type: 'analysis',
        insights: [
          'High buying intent detected (score: 94/100)',
          'Active in market - visited competitors',
          'Persona match: Revenue scaling challenges',
          'Best outreach time: Tuesday 10am PST',
        ],
      },
    },
    {
      id: 2,
      title: 'Governance Check',
      subtitle: 'Policy & Compliance',
      icon: Shield,
      color: 'from-orange-500 to-red-500',
      action: 'Running DLP, consent verification, and approval workflows...',
      data: {
        policies: [
          'DLP scan: ✓ Passed',
          'Consent check: ✓ Opt-in verified',
          'Send limits: ✓ Within quota',
        ],
        approvalRequired: false,
        complianceScore: '100%',
      },
      screenshot: {
        type: 'governance',
        checks: [
          { name: 'PII Scrubbing', status: 'passed', detail: 'No sensitive data detected' },
          { name: 'Consent Verification', status: 'passed', detail: 'Opt-in confirmed' },
          { name: 'Geographic Policy', status: 'passed', detail: 'GDPR compliant' },
          { name: 'Send Throttling', status: 'passed', detail: 'Within daily limits' },
        ],
      },
    },
    {
      id: 3,
      title: 'Content Generation',
      subtitle: 'Personalized Messaging',
      icon: Sparkles,
      color: 'from-green-500 to-emerald-500',
      action: 'Generating contextual, persona-specific outreach...',
      data: {
        subject: "Sarah, scaling TechCorp's pipeline without adding headcount?",
        preview: 'I noticed your team is scaling fast. Most VPs in your position struggle with...',
        tone: 'Professional',
        personalization: ['Name', 'Company', 'Recent activity', 'Pain point', 'Social proof'],
      },
      screenshot: {
        type: 'content',
        email: {
          subject: "Sarah, scaling TechCorp's pipeline without adding headcount?",
          body: 'Hi Sarah,\n\nI noticed TechCorp recently expanded to 500+ employees. Congrats on the growth!\n\nMost VPs I talk to at this stage hit the same wall: pipeline demand grows faster than SDR capacity.\n\nAt Artisan, we help teams like yours 3x pipeline without adding headcount...',
          cta: 'Book 15 mins to see how',
        },
      },
    },
    {
      id: 4,
      title: 'Multi-Channel Send',
      subtitle: 'Orchestrated Delivery',
      icon: Send,
      color: 'from-blue-600 to-indigo-600',
      action: 'Sending via optimal channel with deliverability protection...',
      data: {
        channel: 'Email (Warmup IP: 98.8% reputation)',
        timing: 'Tuesday, 10:03 AM PST',
        followup: 'LinkedIn message queued for +48h if no open',
        throttle: 'Adaptive send (respecting domain limits)',
      },
      screenshot: {
        type: 'send',
        delivery: [
          { time: '10:03 AM', channel: 'Email', status: 'Sent ✓' },
          { time: '+24h', channel: 'Email', status: 'Scheduled: Follow-up A/B test' },
          { time: '+48h', channel: 'LinkedIn', status: 'Queued: Connection request' },
          { time: '+72h', channel: 'Call', status: 'Queued: If no engagement' },
        ],
      },
    },
    {
      id: 5,
      title: 'Engagement Tracking',
      subtitle: 'Real-Time Monitoring',
      icon: Eye,
      color: 'from-purple-600 to-pink-600',
      action: 'Tracking opens, clicks, and engagement signals...',
      data: {
        opened: '2 mins after send',
        clicked: "Link: 'See case study'",
        timeOnPage: '3 mins 42 secs',
        intentScore: '+12 points (now 106/100)',
        nextAction: 'High engagement - escalate to AE',
      },
      screenshot: {
        type: 'engagement',
        activity: [
          { time: '10:05 AM', event: 'Email opened', device: 'iPhone', location: 'San Francisco' },
          { time: '10:07 AM', event: 'Clicked CTA', page: 'Case study', duration: '3m 42s' },
          { time: '10:12 AM', event: 'Visited pricing page', interest: 'Enterprise plan' },
          { time: '10:15 AM', event: 'LinkedIn profile view', action: 'Connection pending' },
        ],
      },
    },
    {
      id: 6,
      title: 'Lead Qualification',
      subtitle: 'Intelligent Scoring',
      icon: UserCheck,
      color: 'from-green-600 to-teal-600',
      action: 'Analyzing behavior patterns and qualification criteria...',
      data: {
        score: '106/100 (Hot)',
        qualification: 'MQL → SQL',
        buyingSignals: ['Pricing page visit', 'Case study engagement', 'LinkedIn profile view'],
        recommendation: 'Route to AE: Jennifer Kim',
        expectedValue: '$48,000 ARR',
      },
      screenshot: {
        type: 'qualification',
        profile: {
          name: 'Sarah Chen',
          score: 106,
          stage: 'SQL - Ready for Demo',
          signals: ['High engagement', 'Budget authority', 'Active in buying window'],
          nextSteps: ['Book demo', 'Send contract', 'Executive intro'],
        },
      },
    },
    {
      id: 7,
      title: 'Analytics & Optimization',
      subtitle: 'Continuous Learning',
      icon: BarChart3,
      color: 'from-indigo-600 to-purple-600',
      action: 'Learning from outcome to optimize future campaigns...',
      data: {
        conversion: 'Email → Demo booked',
        campaignPerformance: '18% response rate (vs 12% avg)',
        aiLearning: [
          'Subject line A performed +23% better',
          'Tuesday 10am optimal',
          'Case study CTA effective',
        ],
        applied: 'Insights applied to next 2,847 prospects',
      },
      screenshot: {
        type: 'analytics',
        insights: [
          { metric: 'Open Rate', value: '68%', benchmark: '↑ 23% vs avg' },
          { metric: 'Click Rate', value: '24%', benchmark: '↑ 45% vs avg' },
          { metric: 'Response Rate', value: '18%', benchmark: '↑ 50% vs avg' },
          { metric: 'Meeting Rate', value: '12%', benchmark: '↑ 33% vs avg' },
        ],
      },
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const currentStep = steps[activeStep];

  return (
    <section
      id="how-it-works"
      className="py-20 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-semibold mb-4">
            <Zap className="w-4 h-4" />
            Architecture in Action
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-space-grotesk">
            Watch The Complete Flow: Lead to Conversion
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See exactly how each component works together—from database query to closed deal. This
            is the architecture your security team needs to see.
          </p>
        </div>

        {/* End-to-End Architecture Diagram */}
        <div className="mb-12 bg-slate-800/30 backdrop-blur-xl border-2 border-slate-700 rounded-2xl p-8 overflow-x-auto">
          <div className="flex items-center justify-between min-w-max gap-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;

              return (
                <React.Fragment key={step.id}>
                  {/* Architecture Box */}
                  <div
                    className={`relative flex flex-col items-center transition-all duration-500 ${
                      isActive ? 'scale-110' : 'scale-100 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`w-32 h-32 rounded-xl border-2 flex flex-col items-center justify-center p-3 transition-all ${
                        isActive
                          ? 'bg-gradient-to-br ' +
                            step.color +
                            ' border-white shadow-2xl shadow-purple-500/50'
                          : 'bg-slate-800 border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <Icon
                        className={`w-8 h-8 mb-2 ${isActive ? 'text-white' : 'text-slate-400'}`}
                      />
                      <div
                        className={`text-xs font-bold text-center leading-tight ${
                          isActive ? 'text-white' : 'text-slate-300'
                        }`}
                      >
                        {step.title}
                      </div>
                      <div
                        className={`text-[10px] text-center mt-1 ${
                          isActive ? 'text-white/80' : 'text-slate-500'
                        }`}
                      >
                        {step.subtitle}
                      </div>
                    </div>

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute -bottom-3 w-3 h-3 rounded-full bg-white animate-pulse shadow-lg shadow-white/50" />
                    )}

                    {/* Step Number Badge */}
                    <div
                      className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isActive ? 'bg-white text-purple-600' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </div>
                  </div>

                  {/* Connecting Arrow */}
                  {idx < steps.length - 1 && (
                    <div className="flex items-center justify-center">
                      <ArrowRight
                        className={`w-6 h-6 transition-colors ${
                          activeStep > idx
                            ? 'text-green-400'
                            : activeStep === idx
                              ? 'text-white animate-pulse'
                              : 'text-slate-600'
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-6 relative h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-700 border border-slate-600" />
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border border-white" />
              <span>Active</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span>Completed</span>
            </div>
          </div>
        </div>

        {/* Flow Visualization */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Left: Step Navigation */}
          <div className="lg:col-span-1 space-y-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              const isPast = activeStep > idx;

              return (
                <button
                  key={step.id}
                  onClick={() => {
                    setActiveStep(idx);
                    setIsPlaying(false);
                  }}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r ' + step.color + ' border-white shadow-2xl scale-105'
                      : isPast
                        ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isActive ? 'bg-white/20' : 'bg-slate-700'
                      }`}
                    >
                      {isPast ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-bold text-sm ${isActive ? 'text-white' : 'text-slate-300'}`}
                      >
                        {step.title}
                      </div>
                      <div className={`text-xs ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                        {step.subtitle}
                      </div>
                    </div>
                    {isActive && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Active Step Details */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-xl border-2 border-slate-700 rounded-2xl overflow-hidden">
              {/* Step Header */}
              <div className={`bg-gradient-to-r ${currentStep.color} p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <currentStep.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{currentStep.title}</h3>
                      <p className="text-white/80">{currentStep.subtitle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-white/90">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span className="text-sm font-mono">{currentStep.action}</span>
                </div>
              </div>

              {/* Data Preview */}
              <div className="p-6 space-y-4">
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-400" />
                    Data Processing
                  </h4>
                  <div className="space-y-2 font-mono text-sm">
                    {Object.entries(currentStep.data).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-2">
                        <span className="text-blue-400">{key}:</span>
                        <span className="text-gray-300 flex-1">
                          {Array.isArray(value) ? (
                            <ul className="list-disc list-inside space-y-1">
                              {value.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          ) : (
                            value
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Screenshot/Visual */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-400" />
                    Visual Output
                  </h4>

                  {/* Dynamic Screenshot Component Based on Step Type */}
                  {currentStep.screenshot.type === 'search' && (
                    <div className="space-y-2">
                      {currentStep.screenshot.results.map((result, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-800 border border-slate-600 rounded-lg p-3 hover:border-blue-500 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-white">{result.name}</div>
                              <div className="text-sm text-gray-400">
                                {result.title} at {result.company}
                              </div>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-bold text-sm">
                              {result.score}/100
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentStep.screenshot.type === 'analysis' && (
                    <div className="space-y-2">
                      {currentStep.screenshot.insights.map((insight, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-3 bg-slate-800 border border-slate-600 rounded-lg"
                        >
                          <Sparkles className="w-4 h-4 text-purple-400 mt-0.5" />
                          <span className="text-gray-300 text-sm">{insight}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentStep.screenshot.type === 'governance' && (
                    <div className="space-y-2">
                      {currentStep.screenshot.checks.map((check, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-slate-800 border border-slate-600 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-white text-sm font-semibold">{check.name}</span>
                          </div>
                          <span className="text-gray-400 text-xs">{check.detail}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentStep.screenshot.type === 'content' && (
                    <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
                      <div className="mb-2">
                        <div className="text-xs text-gray-400 mb-1">Subject:</div>
                        <div className="text-white font-semibold">
                          {currentStep.screenshot.email.subject}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mb-1">Body:</div>
                      <div className="text-gray-300 text-sm whitespace-pre-line">
                        {currentStep.screenshot.email.body}
                      </div>
                      <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                        {currentStep.screenshot.email.cta}
                      </button>
                    </div>
                  )}

                  {currentStep.screenshot.type === 'send' && (
                    <div className="space-y-2">
                      {currentStep.screenshot.delivery.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-slate-800 border border-slate-600 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-400 font-mono">{item.time}</div>
                            <div className="text-white text-sm font-semibold">{item.channel}</div>
                          </div>
                          <div
                            className={`text-sm font-semibold ${
                              item.status.includes('Sent') ? 'text-green-400' : 'text-gray-400'
                            }`}
                          >
                            {item.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentStep.screenshot.type === 'engagement' && (
                    <div className="space-y-2">
                      {currentStep.screenshot.activity.map((act, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-slate-800 border border-slate-600 rounded-lg"
                        >
                          <div className="text-xs text-gray-400 font-mono pt-0.5">{act.time}</div>
                          <div className="flex-1">
                            <div className="text-white text-sm font-semibold mb-1">{act.event}</div>
                            <div className="text-gray-400 text-xs">
                              {Object.entries(act)
                                .filter(([key]) => !['time', 'event'].includes(key))
                                .map(([key, value]) => (
                                  <span key={key}>
                                    {key}: {value} •{' '}
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentStep.screenshot.type === 'qualification' && (
                    <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-white font-bold">
                          {currentStep.screenshot.profile.name}
                        </h5>
                        <div className="px-4 py-2 rounded-full bg-green-500 text-white font-bold">
                          {currentStep.screenshot.profile.score}/100
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="text-xs text-gray-400 mb-1">Stage:</div>
                        <div className="text-white font-semibold">
                          {currentStep.screenshot.profile.stage}
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="text-xs text-gray-400 mb-2">Buying Signals:</div>
                        <div className="space-y-1">
                          {currentStep.screenshot.profile.signals.map((signal, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              <span className="text-gray-300 text-sm">{signal}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep.screenshot.type === 'analytics' && (
                    <div className="grid grid-cols-2 gap-3">
                      {currentStep.screenshot.insights.map((insight, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-800 border border-slate-600 rounded-lg p-4"
                        >
                          <div className="text-xs text-gray-400 mb-1">{insight.metric}</div>
                          <div className="text-2xl font-bold text-white mb-1">{insight.value}</div>
                          <div className="text-xs text-green-400 font-semibold">
                            {insight.benchmark}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="bg-slate-800/50 backdrop-blur-xl border-2 border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-white">Flow Progress</h4>
            <div className="text-sm text-gray-400">
              Step {activeStep + 1} of {steps.length}
            </div>
          </div>
          <div className="relative">
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transition-all duration-500 rounded-full"
                style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Key Takeaway */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">
              This entire process takes ~3.2 seconds and runs 24/7 for every lead in your ICP
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveArchitectureFlow;
