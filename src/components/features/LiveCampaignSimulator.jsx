import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import {
  User,
  Mail,
  MessageSquare,
  Phone,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  Brain,
  Target,
  BarChart3,
  Linkedin,
  Send,
  Eye,
  MousePointer,
  UserCheck,
  Calendar,
  Activity,
} from 'lucide-react';

const LiveCampaignSimulator = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [leadData, setLeadData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [metrics, setMetrics] = useState({
    sent: 0,
    opened: 0,
    clicked: 0,
    replied: 0,
  });

  // Simulate real lead data
  useEffect(() => {
    const leads = [
      {
        name: 'Sarah Chen',
        title: 'VP of Sales',
        company: 'TechCorp Solutions',
        signals: ['Visited pricing page', 'Downloaded whitepaper', 'High intent'],
        avatar: 'SC',
      },
      {
        name: 'Michael Rodriguez',
        title: 'Director of Marketing',
        company: 'Growth Industries',
        signals: ['Job change alert', 'Budget season', 'Active buyer'],
        avatar: 'MR',
      },
      {
        name: 'Emily Watson',
        title: 'Chief Revenue Officer',
        company: 'Enterprise Systems',
        signals: ['Tech stack match', 'Expansion mode', 'Warm lead'],
        avatar: 'EW',
      },
    ];

    const interval = setInterval(() => {
      setActiveStep(prev => {
        const next = (prev + 1) % 8;
        if (next === 0) {
          setLeadData(leads[Math.floor(Math.random() * leads.length)]);
          setMessages([]);
          setMetrics({ sent: 0, opened: 0, clicked: 0, replied: 0 });
        }
        return next;
      });
    }, 2500);

    setLeadData(leads[0]);
    return () => clearInterval(interval);
  }, []);

  // Simulate campaign progression
  useEffect(() => {
    if (activeStep === 3) {
      setMessages([{ channel: 'email', time: 'Just now', status: 'sent' }]);
      setMetrics(prev => ({ ...prev, sent: prev.sent + 1 }));
    } else if (activeStep === 4) {
      setMessages(prev => [...prev, { channel: 'email', time: '2 mins ago', status: 'opened' }]);
      setMetrics(prev => ({ ...prev, opened: prev.opened + 1 }));
    } else if (activeStep === 5) {
      setMessages(prev => [...prev, { channel: 'linkedin', time: '1 hour ago', status: 'sent' }]);
      setMetrics(prev => ({ ...prev, sent: prev.sent + 1 }));
    } else if (activeStep === 6) {
      setMessages(prev => [...prev, { channel: 'email', time: '2 hours ago', status: 'clicked' }]);
      setMetrics(prev => ({ ...prev, clicked: prev.clicked + 1 }));
    } else if (activeStep === 7) {
      setMessages(prev => [...prev, { channel: 'email', time: '1 day ago', status: 'replied' }]);
      setMetrics(prev => ({ ...prev, replied: prev.replied + 1 }));
    }
  }, [activeStep]);

  const steps = [
    {
      id: 0,
      title: 'Lead Discovered',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      description: 'AI identifies high-intent prospect from 300M+ database',
    },
    {
      id: 1,
      title: 'Intent Analysis',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      description: 'GPT-4 analyzes signals and buying context',
    },
    {
      id: 2,
      title: 'Content Generated',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      description: 'Personalized message crafted based on lead data',
    },
    {
      id: 3,
      title: 'Email Sent',
      icon: Mail,
      color: 'from-green-500 to-emerald-500',
      description: 'First touchpoint delivered at optimal time',
    },
    {
      id: 4,
      title: 'Opened',
      icon: Eye,
      color: 'from-blue-500 to-indigo-500',
      description: 'Lead engages with content',
    },
    {
      id: 5,
      title: 'LinkedIn Follow-up',
      icon: Linkedin,
      color: 'from-blue-600 to-blue-700',
      description: 'Multi-channel sequence continues',
    },
    {
      id: 6,
      title: 'Link Clicked',
      icon: MousePointer,
      color: 'from-purple-500 to-purple-600',
      description: 'High engagement signal detected',
    },
    {
      id: 7,
      title: 'Reply Received',
      icon: UserCheck,
      color: 'from-green-600 to-green-700',
      description: 'Conversation started - lead qualified',
    },
  ];

  const channelIcons = {
    email: Mail,
    linkedin: Linkedin,
    sms: MessageSquare,
    call: Phone,
  };

  return (
    <div
      id="flow"
      className="w-full py-20 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden"
    >
      <div className="absolute inset-0 grid-background opacity-10" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600/20 blur-3xl animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/20 text-purple-300 text-sm font-semibold mb-4">
            <Activity className="w-4 h-4 animate-pulse" />
            Live Campaign Simulation
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-space-grotesk">
            See Ava in Action - Real-Time
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Watch a live simulation of how Ava discovers leads, personalizes outreach, and drives
            conversations across multiple channels
          </p>
        </div>

        {/* Main Simulator Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Lead Profile Card */}
          <Card className="lg:col-span-1 bg-slate-900/50 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                Current Lead
              </h3>

              {leadData && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {leadData.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{leadData.name}</div>
                      <div className="text-sm text-gray-400">{leadData.title}</div>
                      <div className="text-sm text-gray-500">{leadData.company}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-400">Intent Signals</div>
                    {leadData.signals.map((signal, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-gray-300">{signal}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-center">
                    <div className="glass-dark border border-white/10 rounded-lg p-2">
                      <div className="text-xs text-gray-400">Lead Score</div>
                      <div className="text-lg font-bold text-green-400">94/100</div>
                    </div>
                    <div className="glass-dark border border-white/10 rounded-lg p-2">
                      <div className="text-xs text-gray-400">Engagement</div>
                      <div className="text-lg font-bold text-blue-400">Hot</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Campaign Flow */}
          <Card className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Campaign Sequence
              </h3>

              <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = activeStep === step.id;
                  const isPast = activeStep > step.id;

                  return (
                    <div
                      key={step.id}
                      className={`relative flex items-start gap-4 p-4 rounded-lg border transition-all duration-500 ${
                        isActive
                          ? 'bg-gradient-to-r ' +
                            step.color +
                            ' bg-opacity-10 border-white/30 shadow-lg scale-105'
                          : isPast
                            ? 'bg-slate-800/50 border-white/10'
                            : 'bg-slate-900/30 border-white/5'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 ${isActive ? 'animate-pulse' : ''}`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-white">{step.title}</h4>
                          {isActive && (
                            <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white font-semibold">
                              Processing...
                            </span>
                          )}
                          {isPast && <CheckCircle className="w-4 h-4 text-green-400" />}
                        </div>
                        <p className="text-sm text-gray-400">{step.description}</p>
                      </div>

                      {idx < steps.length - 1 && (
                        <div className="absolute left-[1.15rem] top-14 w-0.5 h-8 bg-gradient-to-b from-white/20 to-transparent" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-Time Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10 hover-lift">
            <CardContent className="p-6 text-center">
              <Send className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{metrics.sent}</div>
              <div className="text-sm text-gray-400">Sent</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10 hover-lift">
            <CardContent className="p-6 text-center">
              <Eye className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{metrics.opened}</div>
              <div className="text-sm text-gray-400">Opened</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10 hover-lift">
            <CardContent className="p-6 text-center">
              <MousePointer className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{metrics.clicked}</div>
              <div className="text-sm text-gray-400">Clicked</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10 hover-lift">
            <CardContent className="p-6 text-center">
              <UserCheck className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{metrics.replied}</div>
              <div className="text-sm text-gray-400">Replied</div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Progress */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-white">Campaign Timeline</h4>
              <div className="text-sm text-gray-400">
                Step {activeStep + 1} of {steps.length}
              </div>
            </div>
            <div className="relative">
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transition-all duration-500 rounded-full"
                  style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`text-xs ${activeStep >= idx ? 'text-white font-semibold' : 'text-gray-600'}`}
                  >
                    {idx === 0 && 'Start'}
                    {idx === steps.length - 1 && 'Qualified'}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Insight */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-dark border border-white/20">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-white font-semibold">
              Average conversion time: 3.2 days | Response rate: 23% | Meeting rate: 12%
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </div>
  );
};

export default LiveCampaignSimulator;
