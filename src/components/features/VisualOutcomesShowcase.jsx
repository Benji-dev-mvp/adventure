import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ArrowRight,
  Sparkles,
  BarChart3,
  Target,
  Zap,
  PlayCircle,
} from 'lucide-react';

const VisualOutcomesShowcase = () => {
  const [activeOutcome, setActiveOutcome] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveOutcome(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const outcomes = [
    {
      id: 0,
      company: 'TechCorp Solutions',
      industry: 'Enterprise SaaS',
      challenge: 'Struggling to scale outbound without adding headcount',
      solution: 'Deployed Ava across 15-person SDR team',
      results: [
        { label: 'Pipeline', before: '$1.2M', after: '$4.8M', increase: '+300%' },
        { label: 'SDR Cost', before: '$42K/mo', after: '$17K/mo', increase: '-60%' },
        { label: 'Response Rate', before: '2.1%', after: '8.4%', increase: '+300%' },
        { label: 'Time to First Meeting', before: '14 days', after: '3.2 days', increase: '-77%' },
      ],
      quote:
        'Ava handles what used to take 15 SDRs. Our team now focuses on closing deals, not writing emails.',
      author: 'Sarah Chen, VP of Sales',
      timeline: '6 months',
      screenshot: true,
    },
    {
      id: 1,
      company: 'Growth Industries',
      industry: 'Marketing Tech',
      challenge: 'High CAC and low conversion from MQLs to SQLs',
      solution: 'Integrated Ava with HubSpot for intelligent lead nurturing',
      results: [
        { label: 'CAC', before: '$3,200', after: '$1,840', increase: '-42%' },
        { label: 'MQL→SQL Rate', before: '12%', after: '28%', increase: '+133%' },
        { label: 'Monthly Meetings', before: '48', after: '187', increase: '+290%' },
        { label: 'Win Rate', before: '18%', after: '31%', increase: '+72%' },
      ],
      quote:
        "The AI doesn't just send emails—it understands buyer intent and adjusts messaging in real-time.",
      author: 'Michael Rodriguez, CMO',
      timeline: '4 months',
      screenshot: true,
    },
    {
      id: 2,
      company: 'Enterprise Systems',
      industry: 'Infrastructure Software',
      challenge: 'Needed SOC 2 compliant outbound solution for enterprise buyers',
      solution: 'Rolled out Ava with SSO, approval workflows, and audit trails',
      results: [
        { label: 'Security Review Time', before: '8 weeks', after: '3 days', increase: '-96%' },
        {
          label: 'Compliance Violations',
          before: '14/quarter',
          after: '0/quarter',
          increase: '-100%',
        },
        { label: 'Enterprise Deals', before: '3/quarter', after: '12/quarter', increase: '+300%' },
        { label: 'Approval Latency', before: '48 hours', after: '12 min', increase: '-99%' },
      ],
      quote:
        'Finally, an outbound tool our security team approved in 3 days instead of blocking for months.',
      author: 'Emily Watson, CRO',
      timeline: '3 months',
      screenshot: true,
    },
  ];

  const currentOutcome = outcomes[activeOutcome];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm font-semibold mb-4">
            <Target className="w-4 h-4" />
            Real Customer Outcomes
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-space-grotesk">
            See The Results Your Peers Achieved
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            From struggling with scale to 3x pipeline growth—see the quantified outcomes that
            convinced their boards
          </p>
        </div>

        {/* Main Outcome Card */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
          {/* Company Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{currentOutcome.company}</h3>
                <p className="text-blue-100">
                  {currentOutcome.industry} • {currentOutcome.timeline} implementation
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <PlayCircle className={`w-6 h-6 text-white ${isPlaying ? 'opacity-50' : ''}`} />
                </button>
                {outcomes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveOutcome(idx);
                      setIsPlaying(false);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      activeOutcome === idx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="p-4">
            {/* Challenge & Solution */}
            <div className="grid md:grid-cols-2 gap-3 mb-8">
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-9 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">!</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">The Challenge</h4>
                </div>
                <p className="text-slate-700 dark:text-slate-300">{currentOutcome.challenge}</p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-9 rounded-full bg-green-500 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">The Solution</h4>
                </div>
                <p className="text-slate-700 dark:text-slate-300">{currentOutcome.solution}</p>
              </div>
            </div>

            {/* Results Grid - The Money Shot */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Quantified Results
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {currentOutcome.results.map((result, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-lg p-4 border-2 border-slate-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all hover:shadow-lg hover:scale-105"
                  >
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
                      {result.label}
                    </div>

                    {/* Before/After Comparison */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600 dark:text-slate-400">Before:</span>
                        <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                          {result.before}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600 dark:text-slate-400">After:</span>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          {result.after}
                        </span>
                      </div>
                    </div>

                    {/* Growth Indicator */}
                    <div
                      className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-bold text-sm ${
                        result.increase.startsWith('+')
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      {result.increase}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-3">
                <div className="w-12 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {currentOutcome.author
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </div>
                <div className="flex-1">
                  <p className="text-lg text-slate-700 dark:text-slate-200 italic mb-3">
                    "{currentOutcome.quote}"
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {currentOutcome.author}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {currentOutcome.company}
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 rounded-lg border-2 border-slate-200 dark:border-slate-600 hover:border-blue-500 transition-all font-semibold text-sm text-slate-900 dark:text-white group">
                      Read Full Case Study
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-1">2,847</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Companies Using Ava</div>
          </div>
          <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700">
            <div className="text-lg font-bold text-green-600 dark:text-green-400 mb-1">3.2x</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Avg Pipeline Growth</div>
          </div>
          <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700">
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-1">$48M</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Pipeline Generated (30d)
            </div>
          </div>
          <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700">
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400 mb-1">98.4%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Customer Satisfaction</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <button className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 group">
            <Sparkles className="w-5 h-5" />
            See How Ava Can Transform Your Outbound
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default VisualOutcomesShowcase;
