import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { 
  Database, 
  Brain, 
  Mail, 
  Linkedin, 
  MessageSquare, 
  Phone,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  Users,
  Target,
  TrendingUp,
  Lock,
  Globe,
  CheckCircle,
  Activity,
  Clock
} from 'lucide-react';

const PlatformArchitecture = () => {
  const [activeNode, setActiveNode] = useState(null);
  const [dataFlow, setDataFlow] = useState(0);
  const [particles, setParticles] = useState([]);
  const [liveMetrics, setLiveMetrics] = useState({
    leadsProcessed: 0,
    aiGenerations: 0,
    emailsSent: 0,
    engagements: 0
  });
  const [activeConnections, setActiveConnections] = useState([]);

  // Animate data flow with 6 stages cycling every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDataFlow(prev => (prev + 1) % 6);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Animate live metrics counting up
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        leadsProcessed: Math.min(prev.leadsProcessed + Math.floor(Math.random() * 50 + 20), 1200000),
        aiGenerations: Math.min(prev.aiGenerations + Math.floor(Math.random() * 30 + 10), 847000),
        emailsSent: Math.min(prev.emailsSent + Math.floor(Math.random() * 20 + 10), 524000),
        engagements: Math.min(prev.engagements + Math.floor(Math.random() * 15 + 5), 125000)
      }));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Generate flowing particles between nodes
  useEffect(() => {
    const interval = setInterval(() => {
      const newParticle = {
        id: Date.now(),
        path: Math.floor(Math.random() * 8), // 8 different paths
        progress: 0
      };
      setParticles(prev => [...prev.slice(-20), newParticle]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({ ...p, progress: p.progress + 2 }))
          .filter(p => p.progress < 100)
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Activate random connections
  useEffect(() => {
    const interval = setInterval(() => {
      const connectionIndex = Math.floor(Math.random() * 8);
      setActiveConnections(prev => {
        const newActive = [...prev, connectionIndex];
        return newActive.slice(-3); // Keep last 3 active
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Add keyframe animation for data points
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateX(-4px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const nodes = {
    database: {
      id: 'database',
      title: 'Lead Intelligence',
      subtitle: '300M+ B2B Contacts',
      icon: Database,
      color: 'from-blue-500 to-blue-600',
      description: 'Real-time access to enriched B2B data with intent signals, technographics, and firmographics',
      metrics: ['300M+ contacts', 'Intent signals', '50+ data points'],
      position: 'top-4 left-4',
      x: 8,
      y: 8,
      connections: ['enrichment', 'ai']
    },
    enrichment: {
      id: 'enrichment',
      title: 'Data Enrichment',
      subtitle: 'Real-time Enhancement',
      icon: Globe,
      color: 'from-cyan-500 to-cyan-600',
      description: 'Enriches leads with company data, social profiles, and verified contact information',
      metrics: ['Email verification', 'Phone validation', 'Social enrichment'],
      position: 'top-4',
      style: { left: 'calc(25% - 130px)' },
      x: 25,
      y: 8,
      connections: ['ai', 'scoring']
    },
    ai: {
      id: 'ai',
      title: 'AI Engine (Ava)',
      subtitle: 'GPT-4 Powered',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      description: 'Advanced AI personalization engine that analyzes leads and contextual, multi-tone outreach',
      metrics: ['Multi-tone generation', 'Context-aware', 'A/B testing'],
      position: 'top-4',
      style: { left: 'calc(50% - 130px)' },
      x: 50,
      y: 8,
      connections: ['channels', 'analytics', 'optimization']
    },
    scoring: {
      id: 'scoring',
      title: 'Lead Scoring',
      subtitle: 'AI-Powered',
      icon: Target,
      color: 'from-pink-500 to-pink-600',
      description: 'Intelligent lead scoring based on engagement, fit, and intent signals',
      metrics: ['Real-time scoring', 'Predictive analytics', 'ICP matching'],
      position: 'top-4',
      style: { left: 'calc(75% - 130px)' },
      x: 75,
      y: 8,
      connections: ['channels', 'analytics']
    },
    channels: {
      id: 'channels',
      title: 'Multi-Channel Engine',
      subtitle: 'Email • LinkedIn • SMS • Calls',
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
      description: 'Orchestrated outreach across all channels with smart timing and deliverability optimization',
      metrics: ['4 channels', 'Smart timing', '99.95% uptime'],
      position: 'top-4 right-4',
      x: 92,
      y: 8,
      connections: ['tracking', 'deliverability'],
      subChannels: [
        { icon: Mail, label: 'Email', color: 'text-blue-400' },
        { icon: Linkedin, label: 'LinkedIn', color: 'text-blue-500' },
        { icon: MessageSquare, label: 'SMS', color: 'text-green-400' },
        { icon: Phone, label: 'Calls', color: 'text-purple-400' }
      ]
    },
    optimization: {
      id: 'optimization',
      title: 'Timing Optimization',
      subtitle: 'ML-Powered',
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
      description: 'AI determines optimal send times based on recipient behavior patterns',
      metrics: ['Timezone detection', 'Engagement patterns', 'Send optimization'],
      position: '',
      style: { top: 'calc(50% - 100px)', left: '1rem' },
      x: 8,
      y: 40,
      connections: ['channels', 'tracking']
    },
    tracking: {
      id: 'tracking',
      title: 'Engagement Tracking',
      subtitle: 'Real-Time Signals',
      icon: Activity,
      color: 'from-blue-500 to-indigo-600',
      description: 'Live tracking of opens, clicks, replies, and meeting bookings',
      metrics: ['Opens', 'Clicks', 'Replies', 'Meetings'],
      position: '',
      style: { top: 'calc(50% - 100px)', left: 'calc(50% - 130px)' },
      x: 50,
      y: 40,
      connections: ['analytics', 'ai']
    },
    deliverability: {
      id: 'deliverability',
      title: 'Deliverability',
      subtitle: 'Domain Health',
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      description: 'Warm-up, domain health monitoring, and IP reputation management',
      metrics: ['99.2% inbox rate', 'Domain warmup', 'DMARC/SPF/DKIM'],
      position: '',
      style: { top: 'calc(50% - 100px)', right: '1rem' },
      x: 92,
      y: 40,
      connections: ['tracking', 'analytics']
    },
    analytics: {
      id: 'analytics',
      title: 'Analytics & Insights',
      subtitle: 'Real-Time Intelligence',
      icon: BarChart3,
      color: 'from-green-500 to-green-600',
      description: 'Executive-ready dashboards with pipeline health, conversion funnels, and ROI tracking',
      metrics: ['Live dashboards', 'Funnel analysis', 'ROI tracking'],
      position: '',
      style: { bottom: '1rem', left: 'calc(50% - 130px)' },
      x: 50,
      y: 82,
      connections: ['security', 'governance']
    },
    security: {
      id: 'security',
      title: 'Enterprise Security',
      subtitle: 'SOC 2 Type II',
      icon: Shield,
      color: 'from-red-500 to-red-600',
      description: 'SOC 2 Type II certified with SSO, SCIM, RBAC, and comprehensive audit trails',
      metrics: ['SOC 2 Type II', 'SSO/SCIM', 'GDPR compliant'],
      position: 'bottom-4 left-4',
      x: 8,
      y: 82,
      connections: ['governance', 'ai', 'database']
    },
    governance: {
      id: 'governance',
      title: 'Governance Layer',
      subtitle: 'Policy & Compliance',
      icon: Lock,
      color: 'from-indigo-500 to-indigo-600',
      description: 'Policy-driven workflows with approval gates, DLP, and PII protection',
      metrics: ['Approval workflows', 'DLP/PII scrubbing', 'Audit logs'],
      position: 'bottom-4 right-4',
      x: 92,
      y: 82,
      connections: ['channels', 'security']
    }
  };

  const connections = [
    { from: 'database', to: 'enrichment', label: 'Raw Lead Data', path: 0 },
    { from: 'enrichment', to: 'ai', label: 'Enriched Profiles', path: 1 },
    { from: 'enrichment', to: 'scoring', label: 'Lead Attributes', path: 2 },
    { from: 'database', to: 'ai', label: 'Intent Signals', path: 3 },
    { from: 'ai', to: 'channels', label: 'Personalized Content', path: 4 },
    { from: 'scoring', to: 'channels', label: 'Priority Leads', path: 5 },
    { from: 'ai', to: 'optimization', label: 'Timing Signals', path: 6 },
    { from: 'optimization', to: 'channels', label: 'Optimal Times', path: 7 },
    { from: 'channels', to: 'deliverability', label: 'Send Requests', path: 8 },
    { from: 'deliverability', to: 'tracking', label: 'Delivered', path: 9 },
    { from: 'channels', to: 'tracking', label: 'Engagement Events', path: 10 },
    { from: 'tracking', to: 'analytics', label: 'Metrics', path: 11 },
    { from: 'tracking', to: 'ai', label: 'Response Data', path: 12 },
    { from: 'ai', to: 'analytics', label: 'AI Insights', path: 13 },
    { from: 'security', to: 'ai', label: 'Auth & Access', path: 14 },
    { from: 'security', to: 'database', label: 'Data Protection', path: 15 },
    { from: 'governance', to: 'channels', label: 'Policy Enforcement', path: 16 },
    { from: 'governance', to: 'security', label: 'Compliance Rules', path: 17 },
    { from: 'analytics', to: 'security', label: 'Audit Events', path: 18 },
    { from: 'analytics', to: 'governance', label: 'Compliance Reports', path: 19 }
  ];

  // Get path coordinates for particle animation
  const getPathCoords = (pathIndex) => {
    const conn = connections[pathIndex];
    if (!conn) return null;
    const from = nodes[conn.from];
    const to = nodes[conn.to];
    if (!from || !to) return null;
    return { x1: from.x, y1: from.y, x2: to.x, y2: to.y };
  };

  const flowStages = [
    { 
      stage: 'Data Ingestion', 
      description: '300M+ contacts with real-time enrichment',
      icon: Database,
      color: 'from-blue-500 to-cyan-500',
      duration: '< 1ms',
      metrics: ['Intent signals', '50+ data points', 'Technographics'],
      dataPoints: ['Firmographics', 'Intent Signals', 'Tech Stack', 'Funding Events'],
      active: dataFlow === 0 
    },
    { 
      stage: 'Data Enrichment', 
      description: 'AI enriches profiles with 50+ data attributes',
      icon: Globe,
      color: 'from-cyan-500 to-blue-600',
      duration: '~2s',
      metrics: ['Company data', 'Contact info', 'Social profiles'],
      dataPoints: ['Email verified', 'Phone validated', 'LinkedIn enriched', 'Job title normalized'],
      active: dataFlow === 0 
    },
    { 
      stage: 'AI Discovery', 
      description: 'AI scans and identifies high-intent prospects',
      icon: Target,
      color: 'from-blue-600 to-indigo-500',
      duration: '~3s',
      metrics: ['ICP matching', 'Buyer signals', 'Lead scoring'],
      dataPoints: ['ICP score: 92/100', 'Intent: High', 'Buying stage: Consideration', 'Propensity: 78%'],
      active: dataFlow === 1 
    },
    { 
      stage: 'Personalization Engine', 
      description: 'GPT-4 generates hyper-personalized messages',
      icon: Brain,
      color: 'from-indigo-500 to-purple-500',
      duration: '~4s',
      metrics: ['Multi-tone', 'A/B testing', 'Context-aware'],
      dataPoints: ['3 variants generated', 'Tone: Professional', 'Pain point addressed', 'CTA optimized'],
      active: dataFlow === 1 
    },
    { 
      stage: 'Governance & Compliance', 
      description: 'Policy checks, DLP, and approval workflows',
      icon: Shield,
      color: 'from-purple-500 to-pink-500',
      duration: '~1s',
      metrics: ['DLP scan', 'Compliance', 'Approval gates'],
      dataPoints: ['PII scrubbed', 'GDPR compliant', 'Policy: Approved', 'DLP: Passed'],
      active: dataFlow === 2 
    },
    { 
      stage: 'Optimal Timing', 
      description: 'AI determines best send time per recipient',
      icon: Clock,
      color: 'from-pink-500 to-rose-500',
      duration: '~500ms',
      metrics: ['Timezone detection', 'Engagement patterns', 'Send optimization'],
      dataPoints: ['Best time: 10:15 AM EST', 'Open probability: 47%', 'Reply window: 2-4 PM', 'Timezone: Detected'],
      active: dataFlow === 2 
    },
    { 
      stage: 'Multi-Channel Execution', 
      description: 'Orchestrated sends across email, LinkedIn, SMS, calls',
      icon: Zap,
      color: 'from-rose-500 to-orange-500',
      duration: 'Real-time',
      metrics: ['4 channels', 'Smart throttling', 'Domain rotation'],
      dataPoints: ['Email queued', 'LinkedIn pending', 'SMS scheduled', 'Call task created'],
      active: dataFlow === 3 
    },
    { 
      stage: 'Deliverability Optimization', 
      description: 'Warm-up, domain health, and IP reputation management',
      icon: CheckCircle,
      color: 'from-orange-500 to-yellow-500',
      duration: 'Ongoing',
      metrics: ['99.2% inbox rate', 'Domain health', 'IP reputation'],
      dataPoints: ['Spam score: 0.1/10', 'Domain warmup: Active', 'DMARC: Passing', 'SPF/DKIM: Valid'],
      active: dataFlow === 3 
    },
    { 
      stage: 'Real-Time Tracking', 
      description: 'Live engagement signals and behavioral tracking',
      icon: Activity,
      color: 'from-yellow-500 to-green-500',
      duration: 'Live',
      metrics: ['Opens', 'Clicks', 'Replies', 'Meeting requests'],
      dataPoints: ['Open: 2m ago', 'Clicked link: Yes', 'Time on page: 45s', 'Reply intent: High'],
      active: dataFlow === 4 
    },
    { 
      stage: 'AI Response Handling', 
      description: 'Ava detects and categorizes all responses',
      icon: MessageSquare,
      color: 'from-green-500 to-emerald-500',
      duration: '< 1s',
      metrics: ['Auto-categorization', 'Sentiment analysis', 'Intent detection'],
      dataPoints: ['Response: Positive', 'Sentiment: Interested', 'Next action: Book meeting', 'Confidence: 94%'],
      active: dataFlow === 4 
    },
    { 
      stage: 'Lead Qualification', 
      description: 'Intelligent scoring, routing, and CRM sync',
      icon: Users,
      color: 'from-emerald-500 to-teal-500',
      duration: '~2s',
      metrics: ['MQL → SQL', 'Auto-scoring', 'CRM sync'],
      dataPoints: ['Score: 87/100', 'Stage: MQL → SQL', 'Owner: Assigned', 'Synced to Salesforce'],
      active: dataFlow === 5 
    },
    { 
      stage: 'Analytics & Insights', 
      description: 'Real-time dashboards and continuous optimization',
      icon: TrendingUp,
      color: 'from-teal-500 to-blue-500',
      duration: 'Real-time',
      metrics: ['ROI tracking', 'Funnel analysis', 'AI learning'],
      dataPoints: ['Pipeline: +$125K', 'ROI: 1,247%', 'Open rate: 68%', 'Reply rate: 12%'],
      active: dataFlow === 5 
    }
  ];

  return (
    <div className="w-full py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Enterprise Platform Architecture
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            See how Artisan connects AI, data, and execution in a governed, enterprise-grade platform
          </p>
        </div>

        {/* Data Flow Timeline */}
        <div className="mb-12 bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Live Data Flow - End-to-End Architecture
          </h3>
          
          {/* Architecture Boxes - Enhanced with more details */}
          <div className="relative overflow-x-auto pb-4">
            <div className="flex items-center gap-3 min-w-max mb-8">
              {flowStages.map((stage, idx) => (
                <React.Fragment key={idx}>
                  {/* Stage Box - Enhanced */}
                  <div 
                    className={`relative flex-shrink-0 w-56 transition-all duration-700 ${
                      stage.active ? 'scale-110 z-10' : 'scale-100 opacity-60 hover:opacity-90'
                    }`}
                  >
                    <div 
                      className={`p-5 rounded-xl border-2 transition-all duration-500 ${
                        stage.active 
                          ? `bg-gradient-to-br ${stage.color} border-white shadow-2xl shadow-blue-500/50 ring-4 ring-white/20` 
                          : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-lg'
                      }`}
                    >
                      {/* Icon & Title */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2.5 rounded-lg ${
                          stage.active 
                            ? 'bg-white/20 backdrop-blur-sm' 
                            : 'bg-slate-200 dark:bg-slate-600'
                        }`}>
                          <stage.icon className={`w-5 h-5 ${
                            stage.active ? 'text-white' : 'text-slate-600 dark:text-slate-300'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-bold text-sm leading-tight ${
                            stage.active ? 'text-white' : 'text-slate-900 dark:text-white'
                          }`}>
                            {stage.stage}
                          </h4>
                          <div className={`text-[10px] font-medium mt-0.5 ${
                            stage.active ? 'text-white/80' : 'text-blue-600 dark:text-blue-400'
                          }`}>
                            {stage.duration}
                          </div>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className={`text-xs mb-3 leading-tight ${
                        stage.active ? 'text-white/90' : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {stage.description}
                      </p>
                      
                      {/* Live Data Points - Shows real processing */}
                      {stage.active && (
                        <div className="mb-3 p-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 animate-in fade-in duration-300">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Activity className="w-3 h-3 text-white animate-pulse" />
                            <span className="text-[10px] font-semibold text-white/90 uppercase tracking-wide">
                              Live Processing
                            </span>
                          </div>
                          <div className="space-y-1">
                            {stage.dataPoints.map((point, pIdx) => (
                              <div 
                                key={pIdx} 
                                className="flex items-center gap-1.5 text-[10px] text-white/80"
                                style={{ 
                                  animation: `fadeIn 0.3s ease-in ${pIdx * 0.1}s both` 
                                }}
                              >
                                <div className="w-1 h-1 rounded-full bg-white/80 animate-pulse" />
                                <span>{point}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Metrics */}
                      <div className="space-y-1">
                        {stage.metrics.map((metric, mIdx) => (
                          <div key={mIdx} className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              stage.active ? 'bg-white' : 'bg-blue-500'
                            }`} />
                            <span className={`text-[10px] ${
                              stage.active ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
                            }`}>
                              {metric}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Stage Number Badge */}
                    <div className={`absolute -top-2 -left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      stage.active 
                        ? 'bg-white text-purple-600 shadow-xl scale-110' 
                        : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {idx + 1}
                    </div>
                    
                    {/* Active Pulse Indicator */}
                    {stage.active && (
                      <>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white animate-pulse shadow-lg shadow-white/50" />
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white/30 animate-ping" />
                      </>
                    )}
                  </div>
                  
                  {/* Connecting Arrow - Animated */}
                  {idx < flowStages.length - 1 && (
                    <div className="flex-shrink-0 flex flex-col items-center justify-center gap-1">
                      <ArrowRight className={`w-7 h-7 transition-all duration-500 ${
                        stage.active 
                          ? 'text-white scale-125 drop-shadow-lg' 
                          : flowStages[idx + 1].active
                            ? 'text-blue-500 scale-110 animate-pulse'
                            : 'text-slate-400 dark:text-slate-600'
                      }`} />
                      {/* Data flow animation line */}
                      {stage.active && (
                        <div className="flex gap-1">
                          <div className="w-1 h-1 rounded-full bg-blue-400 animate-ping" style={{ animationDelay: '0ms' }} />
                          <div className="w-1 h-1 rounded-full bg-blue-400 animate-ping" style={{ animationDelay: '200ms' }} />
                          <div className="w-1 h-1 rounded-full bg-blue-400 animate-ping" style={{ animationDelay: '400ms' }} />
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Progress Indicator - Enhanced */}
          <div className="relative h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4 shadow-inner">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${((dataFlow + 1) / 6) * 100}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent animate-pulse" />
              <div className="absolute right-0 inset-y-0 w-8 bg-gradient-to-r from-transparent to-white/40 animate-pulse" />
            </div>
            {/* Progress percentage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 drop-shadow">
                {Math.round(((dataFlow + 1) / 6) * 100)}% Complete
              </span>
            </div>
          </div>
          
          {/* Real-time Stats Bar */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">DATA INGESTED</span>
              </div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {liveMetrics.leadsProcessed.toLocaleString()}
              </div>
              <div className="text-[9px] text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-2.5 h-2.5" />
                <span>+{Math.floor(Math.random() * 100 + 50)}/min</span>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">AI PERSONALIZED</span>
              </div>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {liveMetrics.aiGenerations.toLocaleString()}
              </div>
              <div className="text-[9px] text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-2.5 h-2.5" />
                <span>+{Math.floor(Math.random() * 80 + 30)}/min</span>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">SENT</span>
              </div>
              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {liveMetrics.emailsSent.toLocaleString()}
              </div>
              <div className="text-[9px] text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-2.5 h-2.5" />
                <span>+{Math.floor(Math.random() * 60 + 20)}/min</span>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">ENGAGEMENTS</span>
              </div>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {liveMetrics.engagements.toLocaleString()}
              </div>
              <div className="text-[9px] text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-2.5 h-2.5" />
                <span>+{Math.floor(Math.random() * 40 + 10)}/min</span>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded border-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700" />
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white shadow-lg" />
              <span>Active Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Completed</span>
            </div>
          </div>
        </div>

        {/* Architecture Diagram */}
        <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border-2 border-slate-300 dark:border-slate-700 shadow-2xl overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, rgba(100,116,139,0.3) 1px, transparent 1px),
                               linear-gradient(to bottom, rgba(100,116,139,0.3) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}/>
          </div>

          {/* Animated Connection Lines with Flowing Data */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="rgba(59, 130, 246, 0.4)" />
              </marker>
              <marker id="arrowhead-active" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="rgba(59, 130, 246, 1)" />
              </marker>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
                <stop offset="50%" stopColor="rgba(168, 85, 247, 0.6)" />
                <stop offset="100%" stopColor="rgba(236, 72, 153, 0.8)" />
              </linearGradient>
            </defs>
            
            {/* Draw all connections */}
            {connections.map((conn, idx) => {
              const from = nodes[conn.from];
              const to = nodes[conn.to];
              if (!from || !to) return null;
              
              const isActive = activeConnections.includes(idx);
              const x1 = `${from.x}%`;
              const y1 = `${from.y}%`;
              const x2 = `${to.x}%`;
              const y2 = `${to.y}%`;
              
              // Calculate control points for curved path
              const dx = to.x - from.x;
              const dy = to.y - from.y;
              const cx1 = from.x + dx * 0.3;
              const cy1 = from.y;
              const cx2 = from.x + dx * 0.7;
              const cy2 = to.y;
              
              const pathData = `M ${from.x} ${from.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${to.x} ${to.y}`;
              
              return (
                <g key={idx}>
                  {/* Base path */}
                  <path
                    d={pathData}
                    stroke={isActive ? "url(#lineGradient)" : "rgba(59, 130, 246, 0.15)"}
                    strokeWidth={isActive ? "3" : "1.5"}
                    fill="none"
                    markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                    className="transition-all duration-500"
                  />
                  
                  {/* Animated overlay for active connections */}
                  {isActive && (
                    <path
                      d={pathData}
                      stroke="rgba(59, 130, 246, 0.8)"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="10,5"
                      className="animate-pulse"
                    >
                      <animate 
                        attributeName="stroke-dashoffset" 
                        from="15" 
                        to="0" 
                        dur="0.8s" 
                        repeatCount="indefinite" 
                      />
                    </path>
                  )}
                </g>
              );
            })}
            
            {/* Animated Particles */}
            {particles.map(particle => {
              const coords = getPathCoords(particle.path);
              if (!coords) return null;
              
              const x = coords.x1 + (coords.x2 - coords.x1) * (particle.progress / 100);
              const y = coords.y1 + (coords.y2 - coords.y1) * (particle.progress / 100);
              
              return (
                <circle
                  key={particle.id}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="4"
                  fill="rgba(59, 130, 246, 0.9)"
                  className="drop-shadow-lg"
                >
                  <animate attributeName="r" values="4;6;4" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;1;0.8" dur="0.6s" repeatCount="indefinite" />
                </circle>
              );
            })}
          </svg>

          {/* Grid Layout for Nodes */}
          <div className="relative z-10 grid gap-4" style={{ 
            gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
            gridTemplateRows: 'auto auto auto',
            minHeight: '800px'
          }}>
            {/* Row 1 - Top 5 boxes */}
            {['database', 'enrichment', 'ai', 'scoring', 'channels'].map((nodeId) => {
              const node = nodes[nodeId];
              const isNodeActive = activeNode === node.id;
              const isConnected = activeNode && node.connections?.includes(activeNode);
              
              return (
                <div
                  key={node.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    isNodeActive ? 'scale-110 z-20' : isConnected ? 'scale-105 z-10' : 'hover:scale-105'
                  }`}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode(null)}
                >
                  {/* Pulsing ring for active node */}
                  {isNodeActive && (
                    <>
                      <div className="absolute inset-0 rounded-2xl bg-blue-500/20 animate-ping" />
                      <div className="absolute inset-0 rounded-2xl bg-purple-500/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
                    </>
                  )}
                  
                  <Card className={`border-2 transition-all duration-300 h-full ${
                    isNodeActive 
                      ? 'border-blue-500 shadow-2xl shadow-blue-500/50' 
                      : isConnected
                        ? 'border-purple-400 shadow-xl shadow-purple-400/30'
                        : 'border-slate-300 dark:border-slate-700 hover:border-slate-400'
                  } bg-white dark:bg-slate-800 relative overflow-hidden`}>
                    {/* Animated gradient background for active node */}
                    {isNodeActive && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${node.color} opacity-5 animate-pulse`} />
                    )}
                    
                    <CardContent className="p-3 relative z-10">
                      <div className="flex items-start gap-2 mb-2">
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${node.color} flex items-center justify-center shadow-lg flex-shrink-0 ${
                          isNodeActive ? 'animate-pulse' : ''
                        }`}>
                          <node.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-xs text-slate-900 dark:text-white mb-0.5 leading-tight">
                            {node.title}
                          </h3>
                          <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight">
                            {node.subtitle}
                          </p>
                        </div>
                        
                        {/* Live indicator */}
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[7px] text-green-600 dark:text-green-400 font-semibold">LIVE</span>
                        </div>
                      </div>
                      
                      {/* Always show brief metrics */}
                      <div className="space-y-0.5 mb-2">
                        {node.metrics.slice(0, 2).map((metric, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <div className={`w-0.5 h-0.5 rounded-full bg-gradient-to-r ${node.color}`} />
                            <span className="text-[8px] text-slate-600 dark:text-slate-400 leading-tight">{metric}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Sub-channels for multi-channel node */}
                      {node.subChannels && !isNodeActive && (
                        <div className="grid grid-cols-2 gap-1">
                          {node.subChannels.map((channel, idx) => (
                            <div key={idx} className="flex items-center gap-1 p-1 rounded bg-slate-50 dark:bg-slate-700/50">
                              <channel.icon className={`w-2.5 h-2.5 ${channel.color} flex-shrink-0`} />
                              <span className="text-[7px] font-medium text-slate-700 dark:text-slate-300 truncate">
                                {channel.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Expanded details on hover */}
                      {isNodeActive && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
                          <p className="text-[9px] text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
                            {node.description}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Processing indicator for active connections */}
                  {activeConnections.some(connIdx => {
                    const conn = connections[connIdx];
                    return conn && (conn.from === node.id || conn.to === node.id);
                  }) && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg animate-bounce">
                      <Activity className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Row 2 - Middle 3 boxes (centered with empty columns on sides) */}
            <div></div> {/* Empty column */}
            {['optimization', 'tracking', 'deliverability'].map((nodeId) => {
              const node = nodes[nodeId];
              const isNodeActive = activeNode === node.id;
              const isConnected = activeNode && node.connections?.includes(activeNode);
              
              return (
                <div
                  key={node.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    isNodeActive ? 'scale-110 z-20' : isConnected ? 'scale-105 z-10' : 'hover:scale-105'
                  }`}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode(null)}
                >
                  {isNodeActive && (
                    <>
                      <div className="absolute inset-0 rounded-2xl bg-blue-500/20 animate-ping" />
                      <div className="absolute inset-0 rounded-2xl bg-purple-500/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
                    </>
                  )}
                  
                  <Card className={`border-2 transition-all duration-300 h-full ${
                    isNodeActive 
                      ? 'border-blue-500 shadow-2xl shadow-blue-500/50' 
                      : isConnected
                        ? 'border-purple-400 shadow-xl shadow-purple-400/30'
                        : 'border-slate-300 dark:border-slate-700 hover:border-slate-400'
                  } bg-white dark:bg-slate-800 relative overflow-hidden`}>
                    {isNodeActive && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${node.color} opacity-5 animate-pulse`} />
                    )}
                    
                    <CardContent className="p-3 relative z-10">
                      <div className="flex items-start gap-2 mb-2">
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${node.color} flex items-center justify-center shadow-lg flex-shrink-0 ${
                          isNodeActive ? 'animate-pulse' : ''
                        }`}>
                          <node.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-xs text-slate-900 dark:text-white mb-0.5 leading-tight">
                            {node.title}
                          </h3>
                          <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight">
                            {node.subtitle}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[7px] text-green-600 dark:text-green-400 font-semibold">LIVE</span>
                        </div>
                      </div>
                      
                      <div className="space-y-0.5 mb-2">
                        {node.metrics.slice(0, 2).map((metric, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <div className={`w-0.5 h-0.5 rounded-full bg-gradient-to-r ${node.color}`} />
                            <span className="text-[8px] text-slate-600 dark:text-slate-400 leading-tight">{metric}</span>
                          </div>
                        ))}
                      </div>
                      
                      {isNodeActive && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
                          <p className="text-[9px] text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
                            {node.description}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {activeConnections.some(connIdx => {
                    const conn = connections[connIdx];
                    return conn && (conn.from === node.id || conn.to === node.id);
                  }) && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg animate-bounce">
                      <Activity className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
            <div></div> {/* Empty column */}
            
            {/* Row 3 - Bottom 3 boxes (security, analytics centered, governance) */}
            {['security', null, 'analytics', null, 'governance'].map((nodeId, idx) => {
              if (!nodeId) return <div key={`empty-${idx}`}></div>;
              
              const node = nodes[nodeId];
              const isNodeActive = activeNode === node.id;
              const isConnected = activeNode && node.connections?.includes(activeNode);
              
              return (
                <div
                  key={node.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    isNodeActive ? 'scale-110 z-20' : isConnected ? 'scale-105 z-10' : 'hover:scale-105'
                  }`}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode(null)}
                >
                  {isNodeActive && (
                    <>
                      <div className="absolute inset-0 rounded-2xl bg-blue-500/20 animate-ping" />
                      <div className="absolute inset-0 rounded-2xl bg-purple-500/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
                    </>
                  )}
                  
                  <Card className={`border-2 transition-all duration-300 h-full ${
                    isNodeActive 
                      ? 'border-blue-500 shadow-2xl shadow-blue-500/50' 
                      : isConnected
                        ? 'border-purple-400 shadow-xl shadow-purple-400/30'
                        : 'border-slate-300 dark:border-slate-700 hover:border-slate-400'
                  } bg-white dark:bg-slate-800 relative overflow-hidden`}>
                    {isNodeActive && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${node.color} opacity-5 animate-pulse`} />
                    )}
                    
                    <CardContent className="p-3 relative z-10">
                      <div className="flex items-start gap-2 mb-2">
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${node.color} flex items-center justify-center shadow-lg flex-shrink-0 ${
                          isNodeActive ? 'animate-pulse' : ''
                        }`}>
                          <node.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-xs text-slate-900 dark:text-white mb-0.5 leading-tight">
                            {node.title}
                          </h3>
                          <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight">
                            {node.subtitle}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[7px] text-green-600 dark:text-green-400 font-semibold">LIVE</span>
                        </div>
                      </div>
                      
                      <div className="space-y-0.5 mb-2">
                        {node.metrics.slice(0, 2).map((metric, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <div className={`w-0.5 h-0.5 rounded-full bg-gradient-to-r ${node.color}`} />
                            <span className="text-[8px] text-slate-600 dark:text-slate-400 leading-tight">{metric}</span>
                          </div>
                        ))}
                      </div>
                      
                      {isNodeActive && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
                          <p className="text-[9px] text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
                            {node.description}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {activeConnections.some(connIdx => {
                    const conn = connections[connIdx];
                    return conn && (conn.from === node.id || conn.to === node.id);
                  }) && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg animate-bounce">
                      <Activity className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Live Stats Overlay */}
          <div className="absolute top-4 right-4 z-20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 border border-slate-300 dark:border-slate-700 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-green-500 animate-pulse" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">System Status</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between gap-4">
                <span className="text-slate-600 dark:text-slate-400">Active Connections:</span>
                <span className="font-bold text-green-600 dark:text-green-400">{connections.length}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-600 dark:text-slate-400">Data Flowing:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{particles.length}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-600 dark:text-slate-400">Processing Stage:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{dataFlow + 1}/6</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold">ALL SYSTEMS OPERATIONAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-500">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">Built for Enterprise</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                SSO, SCIM, RBAC, and audit trails ensure IT stays in control while teams move fast
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-purple-500">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">AI-Powered Automation</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                GPT-4 drives personalization at scale with human-in-the-loop controls and approval workflows
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-green-500">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">Global Scale</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Multi-region infrastructure with 99.95% uptime SLA and US/EU data residency options
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Bar */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-1">300M+</div>
              <div className="text-sm text-blue-100">B2B Contacts</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">99.95%</div>
              <div className="text-sm text-blue-100">Uptime SLA</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">4</div>
              <div className="text-sm text-blue-100">Channels</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">SOC 2</div>
              <div className="text-sm text-blue-100">Type II Certified</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformArchitecture;
