import React, { useState } from 'react';
import {
  ArrowRight,
  X,
  CheckCircle,
  AlertCircle,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  Zap,
  Shield,
} from 'lucide-react';

const BeforeAfterComparison = () => {
  const [activeTab, setActiveTab] = useState('manual');

  const scenarios = {
    manual: {
      title: 'Manual Outbound (Before Ava)',
      problems: [
        {
          icon: Users,
          title: '10 SDRs',
          description: '$420K/year in salaries + overhead',
          pain: 'High cost, slow ramp time, inconsistent quality',
        },
        {
          icon: Clock,
          title: '14 days',
          description: 'Average time to first meeting',
          pain: 'Leads go cold while team manually researches',
        },
        {
          icon: TrendingUp,
          title: '2.1%',
          description: 'Response rate from cold emails',
          pain: 'Generic messaging, poor personalization',
        },
        {
          icon: AlertCircle,
          title: '14 violations',
          description: 'Compliance issues per quarter',
          pain: 'No governance, manual approval process',
        },
      ],
      screenshot: {
        title: 'Typical SDR Workflow',
        steps: [
          '1. Manual lead research in LinkedIn (30 min/lead)',
          '2. Copy-paste template email',
          '3. Wait for manager approval (24-48 hrs)',
          '4. Manual send via Gmail/Outlook',
          '5. Spreadsheet tracking of responses',
          '6. Hope someone replies...',
        ],
      },
    },
    ava: {
      title: 'AI-Powered Outbound (With Ava)',
      benefits: [
        {
          icon: Zap,
          title: '1 Ava License',
          description: '$12K/year all-in',
          win: '97% cost reduction vs 10 SDRs',
        },
        {
          icon: Clock,
          title: '3.2 days',
          description: 'Average time to first meeting',
          win: '77% faster engagement',
        },
        {
          icon: TrendingUp,
          title: '8.4%',
          description: 'Response rate with AI personalization',
          win: '4x improvement in reply rates',
        },
        {
          icon: Shield,
          title: '0 violations',
          description: '100% policy compliance',
          win: 'Automated DLP, consent checks, audit trails',
        },
      ],
      screenshot: {
        title: "Ava's Automated Workflow",
        steps: [
          '1. AI scans 300M database → finds 2,847 perfect matches (2 min)',
          '2. GPT-4 generates personalized content for each lead (instant)',
          '3. Auto-approval via policy rules (0 sec)',
          '4. Multi-channel orchestration (email → LinkedIn → call)',
          '5. Real-time analytics dashboard',
          '6. Qualified meetings auto-booked in calendar',
        ],
      },
    },
  };

  const currentScenario = scenarios[activeTab];

  return (
    <section className="py-20 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-sm font-semibold mb-4">
            <ArrowRight className="w-4 h-4" />
            Before & After
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-space-grotesk">
            The Old Way vs The Ava Way
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            See exactly what changes when you replace manual SDR workflows with AI-powered
            automation
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl border-2 border-slate-300 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'manual'
                  ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-lg'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <X className="w-5 h-5" />
                Before (Manual)
              </div>
            </button>
            <button
              onClick={() => setActiveTab('ava')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'ava'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                After (With Ava)
              </div>
            </button>
          </div>
        </div>

        {/* Comparison Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left: Problems/Benefits */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              {currentScenario.title}
            </h3>
            <div className="space-y-4">
              {(currentScenario.problems || currentScenario.benefits).map((item, idx) => {
                const Icon = item.icon;
                const isAva = activeTab === 'ava';

                return (
                  <div
                    key={idx}
                    className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                      isAva
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800 hover:border-green-500'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800 hover:border-red-500'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isAva ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                          {item.title}
                        </div>
                        <div className="text-slate-700 dark:text-slate-300 mb-2">
                          {item.description}
                        </div>
                        <div
                          className={`text-sm font-semibold ${
                            isAva
                              ? 'text-green-700 dark:text-green-400'
                              : 'text-red-700 dark:text-red-400'
                          }`}
                        >
                          {item.pain || item.win}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Workflow Screenshot */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              {currentScenario.screenshot.title}
            </h3>
            <div
              className={`rounded-xl border-2 p-8 ${
                activeTab === 'ava'
                  ? 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-300 dark:border-blue-800'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
              }`}
            >
              <div className="space-y-4">
                {currentScenario.screenshot.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  >
                    {activeTab === 'ava' ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <span className="text-slate-700 dark:text-slate-300">{step}</span>
                  </div>
                ))}
              </div>

              {activeTab === 'ava' && (
                <div className="mt-6 p-4 bg-white dark:bg-slate-900 rounded-lg border-2 border-green-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-green-500" />
                    <span className="font-bold text-slate-900 dark:text-white">
                      Result: 3.2x pipeline in 6 months
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Average outcome across 2,847 customers using Ava
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">Quick ROI Breakdown</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">$408K</div>
                <div className="text-sm text-blue-100">Annual Savings</div>
                <div className="text-xs text-blue-200 mt-1">(10 SDRs @ $42K vs 1 Ava @ $12K)</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">3.6M</div>
                <div className="text-sm text-blue-100">Additional Pipeline</div>
                <div className="text-xs text-blue-200 mt-1">(vs manual outbound baseline)</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">34x</div>
                <div className="text-sm text-blue-100">ROI in Year 1</div>
                <div className="text-xs text-blue-200 mt-1">(Savings + pipeline value)</div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors inline-flex items-center gap-2 group">
                Calculate Your ROI
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterComparison;
