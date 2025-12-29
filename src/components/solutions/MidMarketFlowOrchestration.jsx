import React, { useState, useEffect } from 'react';
import {
  Database,
  Users,
  Brain,
  GitBranch,
  Send,
  BarChart3,
  RefreshCw,
  CheckCircle,
  ArrowRight,
  Zap,
  TrendingUp,
  Target,
  Shield,
} from 'lucide-react';

const MidMarketFlowOrchestration = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const stages = [
    {
      id: 0,
      title: 'Consolidate Data Sources',
      subtitle: 'Unify your tech stack',
      icon: Database,
      color: 'from-blue-500 to-cyan-500',
      phase: 'Integration',
      description:
        'Connect Salesforce, LinkedIn Sales Nav, ZoomInfo, and 8+ tools into one platform',
      dataPoints: [
        'CRM: Salesforce synced',
        'Enrichment: ZoomInfo connected',
        '10,000 contacts imported',
      ],
      metrics: { stackBefore: '12 tools', stackAfter: '1 platform', savings: '$3,200/mo' },
    },
    {
      id: 1,
      title: 'Territory Assignment',
      subtitle: 'Organize your team',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      phase: 'Setup',
      description: 'Assign 15 reps to territories, accounts, and industries with RBAC controls',
      dataPoints: [
        'Reps: 15 assigned',
        'Territories: North, South, West',
        'Accounts: 450 distributed',
      ],
      metrics: { teams: '15 reps', territories: '3 regions', accounts: '450' },
    },
    {
      id: 2,
      title: 'Replicate Top Performer',
      subtitle: 'AI Playbooks from your best',
      icon: Brain,
      color: 'from-orange-500 to-red-500',
      phase: 'Optimization',
      description:
        "Analyze your #1 rep's emails, extract patterns, create playbook for entire team",
      dataPoints: [
        'Top Rep: Sarah Chen analyzed',
        'Winning Patterns: 12 identified',
        'Playbook: Created & deployed',
      ],
      metrics: { analyzed: '847 emails', patterns: '12', deployed: '15 reps' },
    },
    {
      id: 3,
      title: 'Multi-Campaign Orchestration',
      subtitle: 'Parallel campaigns at scale',
      icon: GitBranch,
      color: 'from-green-500 to-teal-500',
      phase: 'Execution',
      description: 'Launch 15 simultaneous campaigns across territories with different messaging',
      dataPoints: [
        'Campaigns: 15 active',
        'Sequences: 3-5 touches each',
        'Total Prospects: 10,000',
      ],
      metrics: { campaigns: '15', prospects: '10,000', channels: 'Email + LinkedIn' },
    },
    {
      id: 4,
      title: 'Governance & Approval',
      subtitle: 'Policy enforcement',
      icon: Shield,
      color: 'from-indigo-500 to-purple-500',
      phase: 'Compliance',
      description:
        'Auto-check every message for compliance, send high-value accounts through approval',
      dataPoints: ['DLP Scan: 100% passed', 'Approvals: 47 pending', 'Compliance Score: 100%'],
      metrics: { scanned: '10,000', flagged: '0', approved: '47' },
    },
    {
      id: 5,
      title: 'Intelligent Send Timing',
      subtitle: 'Deliverability optimization',
      icon: Send,
      color: 'from-blue-600 to-purple-600',
      phase: 'Execution',
      description:
        'Send across multiple domains with smart timing based on timezone and engagement data',
      dataPoints: ['Domains: 5 active', 'Sending: Timezone optimized', 'Daily Volume: 2,000/day'],
      metrics: { domains: '5', volume: '2,000/day', deliverability: '98.4%' },
    },
    {
      id: 6,
      title: 'Real-Time Performance',
      subtitle: 'Team analytics dashboard',
      icon: BarChart3,
      color: 'from-green-600 to-emerald-600',
      phase: 'Analytics',
      description: 'Track team performance, identify top performers, see pipeline by territory',
      dataPoints: ['Open Rate: 68% avg', 'Reply Rate: 12% avg', 'Pipeline: $2.4M generated'],
      metrics: { opens: '68%', replies: '12%', pipeline: '$2.4M' },
    },
    {
      id: 7,
      title: 'Continuous Optimization',
      subtitle: 'AI learns and improves',
      icon: RefreshCw,
      color: 'from-purple-600 to-indigo-600',
      phase: 'Optimization',
      description:
        'Ava analyzes what works, automatically improves campaigns, shares insights across team',
      dataPoints: ['A/B Tests: 23 running', 'Winners: Auto-scaled', 'Team Learning: Shared'],
      metrics: { tests: '23', improvement: '+34%', shared: '15 reps' },
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900/50 to-blue-900/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-4">
            <Zap className="w-4 h-4" />
            Mid-Market Scale Architecture
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            From Fragmented Stack to Unified Platform
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Watch how a 15-person sales team consolidates 12 tools and scales output by 3x
          </p>
        </div>

        {/* Phase Timeline */}
        <div className="mb-12 overflow-x-auto pb-4">
          <div className="flex items-center gap-2 min-w-max">
            {stages.map((stage, idx) => (
              <React.Fragment key={stage.id}>
                <div
                  className={`relative flex-shrink-0 w-44 transition-all duration-500 cursor-pointer ${
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
                          {stage.phase}
                        </div>
                        <div
                          className={`text-xs font-semibold leading-tight ${activeStage === idx ? 'text-white' : 'text-slate-300'}`}
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
                      activeStage >= idx ? 'text-blue-400' : 'text-slate-600'
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
                  <div className="text-sm font-semibold text-white/80">{currentStage.phase}</div>
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

          {/* Metrics & Scale */}
          <div className="space-y-4">
            <div className="bg-slate-800 border-2 border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Stage Metrics
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(currentStage.metrics).map(([key, value], idx) => (
                  <div key={idx} className="bg-slate-900 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400 mb-1">{value}</div>
                    <div className="text-xs text-gray-400 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-2 border-green-500/30 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Mid-Market Impact
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Stack Consolidation</span>
                    <span className="text-white font-bold">12 → 1</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                      style={{ width: '92%' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Monthly Savings</span>
                    <span className="text-green-400 font-bold">$3,200</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                      style={{ width: '78%' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Output Increase</span>
                    <span className="text-blue-400 font-bold">+287%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: '95%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border-2 border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Team Performance
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">15</div>
                  <div className="text-xs text-gray-400 mt-1">Active Reps</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">$2.4M</div>
                  <div className="text-xs text-gray-400 mt-1">Pipeline</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">68%</div>
                  <div className="text-xs text-gray-400 mt-1">Open Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">12%</div>
                  <div className="text-xs text-gray-400 mt-1">Reply Rate</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-2 border-blue-500/30 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-3">Before Artisan vs After</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between pb-2 border-b border-blue-500/30">
                  <span className="text-gray-400">Tools in Stack:</span>
                  <span className="text-white">
                    <span className="line-through text-red-400">12</span> →{' '}
                    <span className="text-green-400">1</span>
                  </span>
                </div>
                <div className="flex justify-between pb-2 border-b border-blue-500/30">
                  <span className="text-gray-400">Monthly Software Cost:</span>
                  <span className="text-white">
                    <span className="line-through text-red-400">$4,800</span> →{' '}
                    <span className="text-green-400">$1,600</span>
                  </span>
                </div>
                <div className="flex justify-between pb-2 border-b border-blue-500/30">
                  <span className="text-gray-400">Meetings per Rep/mo:</span>
                  <span className="text-white">
                    <span className="line-through text-red-400">8</span> →{' '}
                    <span className="text-green-400">23</span>
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-400">Context Switches:</span>
                  <span className="text-white">
                    <span className="line-through text-red-400">47/day</span> →{' '}
                    <span className="text-green-400">0</span>
                  </span>
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
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${((activeStage + 1) / stages.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MidMarketFlowOrchestration;
