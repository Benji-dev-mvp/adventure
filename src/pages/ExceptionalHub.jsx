// Exceptional Hub - Futuristic Showcase of Industry-Leading Features
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Zap, Activity, Brain, Trophy, BookOpen, BarChart3, Link, Sparkles, Rocket, Star, TrendingUp, Users, Target } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuad = progress * (2 - progress); // Easing function
      const currentCount = Math.floor(easeOutQuad * end);
      
      setCount(currentCount);
      countRef.current = currentCount;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{prefix}{count}{suffix}</span>;
};

// Live Status Indicator
const LiveIndicator = ({ label = 'LIVE' }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
    </span>
    <span className="text-xs font-bold text-red-500 tracking-wider">{label}</span>
  </div>
);

// Animated Progress Bar
const AnimatedProgress = ({ value, color = 'cyan', label }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="space-y-1">
      {label && <div className="text-xs text-slate-600 dark:text-slate-400 flex justify-between">
        <span>{label}</span>
        <span className="font-bold">{value}%</span>
      </div>}
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r from-${color}-400 to-${color}-600 transition-all duration-1000 ease-out rounded-full relative`}
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

// Import all exceptional components
import { 
  RealTimeActivityFeed, 
  AdvancedSequenceBuilder, 
  AvaResearchAssistant, 
  PredictiveAnalytics, 
  SmartMeetingScheduler 
} from '../components/exceptional/ExceptionalComponents';

import { 
  TeamLeaderboard, 
  AchievementBadges, 
  TeamCompetitions, 
  PointsRewardsSystem 
} from '../components/gamification/GamificationComponents';

import { 
  SalesPlaybooks, 
  BattleCards, 
  ObjectionHandlers, 
  ROICalculator 
} from '../components/playbooks/PlaybookComponents';

import { 
  CEOExecutiveDashboard, 
  PipelineHealthScore, 
  ForecastAccuracyTracker, 
  WhatIfScenarioPlanner 
} from '../components/executive/ExecutiveComponents';

import { 
  TwoWaySalesforceSync, 
  SlackTeamsDeepIntegration, 
  CalendarAutoScheduler, 
  ZapierActionBuilder 
} from '../components/integrations/IntegrationComponents';

const ExceptionalHub = () => {
  const [activeTab, setActiveTab] = useState('real-time');
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [liveStats, setLiveStats] = useState({
    activeUsers: 847,
    campaignsRunning: 23,
    leadsProcessed: 15420
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        campaignsRunning: Math.max(15, prev.campaignsRunning + Math.floor(Math.random() * 3) - 1),
        leadsProcessed: prev.leadsProcessed + Math.floor(Math.random() * 10)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    { 
      id: 'real-time', 
      label: 'Real-Time', 
      icon: Activity, 
      count: 5,
      gradient: 'from-cyan-500 to-blue-600',
      color: 'cyan'
    },
    { 
      id: 'gamification', 
      label: 'Gamification', 
      icon: Trophy, 
      count: 4,
      gradient: 'from-amber-500 to-orange-600',
      color: 'amber'
    },
    { 
      id: 'playbooks', 
      label: 'Playbooks', 
      icon: BookOpen, 
      count: 4,
      gradient: 'from-purple-500 to-pink-600',
      color: 'purple'
    },
    { 
      id: 'executive', 
      label: 'Executive', 
      icon: BarChart3, 
      count: 4,
      gradient: 'from-emerald-500 to-teal-600',
      color: 'emerald'
    },
    { 
      id: 'integrations', 
      label: 'Integrations', 
      icon: Link, 
      count: 4,
      gradient: 'from-indigo-500 to-purple-600',
      color: 'indigo'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/20" />
        
        {/* Animated Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 dark:from-cyan-500/10 dark:to-blue-600/10 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-600/10 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-amber-400/10 to-orange-500/10 dark:from-amber-500/5 dark:to-orange-600/5 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '12s', animationDelay: '4s' }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative">
        {/* Hero Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6 backdrop-blur-sm">
            <Sparkles className="text-purple-500 animate-pulse" size={16} />
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
              Powered by Advanced AI
            </span>
            <LiveIndicator label="LIVE" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
              Exceptional
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Features
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-6 leading-relaxed">
            Industry-leading AI-powered sales automation tools designed to <span className="font-semibold text-purple-600 dark:text-purple-400">revolutionize</span> your workflow
          </p>
          
          {/* Live Stats Bar */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <div className="group relative px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center gap-3">
                <Users className="text-cyan-500" size={20} />
                <div className="text-left">
                  <div className="font-black text-2xl bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                    <AnimatedCounter end={liveStats.activeUsers} />
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Active Users Now</div>
                </div>
              </div>
            </div>

            <div className="group relative px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center gap-3">
                <Activity className="text-purple-500 animate-pulse" size={20} />
                <div className="text-left">
                  <div className="font-black text-2xl bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                    <AnimatedCounter end={liveStats.campaignsRunning} />
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Campaigns Running</div>
                </div>
              </div>
            </div>

            <div className="group relative px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center gap-3">
                <TrendingUp className="text-emerald-500" size={20} />
                <div className="text-left">
                  <div className="font-black text-2xl bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                    <AnimatedCounter end={liveStats.leadsProcessed} />
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Leads Processed Today</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <div className="px-6 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-sm">
              <span className="font-bold text-2xl bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                <AnimatedCounter end={21} duration={1500} />
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">Advanced Features</span>
            </div>
            <div className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-sm">
              <Zap className="inline w-4 h-4 text-cyan-500 mr-2 animate-pulse" />
              <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Real-time Updates</span>
            </div>
            <div className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm">
              <Brain className="inline w-4 h-4 text-purple-500 mr-2" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">AI-Powered Intelligence</span>
            </div>
          </div>
        </div>

        {/* Feature Navigation Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isActive = activeTab === feature.id;
            const isHovered = hoveredFeature === feature.id;
            
            return (
              <div
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`
                  group relative p-4 rounded-2xl cursor-pointer transition-all duration-500 
                  ${isActive 
                    ? 'bg-white dark:bg-slate-800 shadow-2xl shadow-purple-500/20 scale-105 -translate-y-2' 
                    : 'bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 shadow-lg hover:shadow-xl'
                  }
                  border border-slate-200 dark:border-slate-700 backdrop-blur-sm
                  hover:scale-105 hover:-translate-y-1
                `}
              >
                {/* Gradient Border on Active */}
                {isActive && (
                  <>
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-20 blur-sm -z-10`} />
                    <div className={`absolute -top-1 -right-1`}>
                      <LiveIndicator label="ACTIVE" />
                    </div>
                  </>
                )}
                
                {/* Icon with Gradient Background */}
                <div className={`
                  relative w-12 h-12 rounded-xl mb-4 flex items-center justify-center
                  transition-all duration-500
                  ${isActive 
                    ? `bg-gradient-to-br ${feature.gradient} shadow-lg` 
                    : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-gradient-to-br group-hover:' + feature.gradient
                  }
                `}>
                  <Icon 
                    className={`transition-all duration-300 ${
                      isActive 
                        ? 'text-white animate-pulse' 
                        : 'text-slate-600 dark:text-slate-400 group-hover:text-white'
                    }`} 
                    size={24} 
                  />
                  
                  {/* Animated Ring */}
                  {(isActive || isHovered) && (
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-30 animate-ping`} />
                  )}
                </div>
                
                {/* Label */}
                <h3 className={`font-bold text-base mb-1 transition-all ${
                  isActive 
                    ? `bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent` 
                    : 'text-slate-900 dark:text-white'
                }`}>
                  {feature.label}
                </h3>
                
                {/* Count Badge with Animation */}
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-black transition-all ${
                    isActive 
                      ? 'text-slate-900 dark:text-white' 
                      : 'text-slate-300 dark:text-slate-700'
                  }`}>
                    {isActive ? <AnimatedCounter end={feature.count} duration={800} /> : feature.count}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">tools</span>
                </div>
                
                {/* Progress Bar */}
                {isActive && (
                  <div className="mt-3">
                    <AnimatedProgress value={feature.count * 20} color={feature.color} />
                  </div>
                )}
                
                {/* Hover Indicator */}
                {isActive && (
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient} animate-pulse`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Tabs Content with Glassmorphism */}
        <div className="relative">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Hidden TabsList - Navigation handled by cards above */}
          <TabsList className="hidden">
            <TabsTrigger value="real-time">Real-Time</TabsTrigger>
            <TabsTrigger value="gamification">Gamification</TabsTrigger>
            <TabsTrigger value="playbooks">Playbooks</TabsTrigger>
            <TabsTrigger value="executive">Executive</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          {/* Real-Time Tab */}
          <TabsContent value="real-time" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            {/* Section Header with Gradient */}
            <div className="relative p-6 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/5 border border-cyan-500/20 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl -z-10" />
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Activity className="text-white" size={24} />
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Real-Time Sales Experience
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-lg ml-16">
                Live activity feeds, intelligent automation, and predictive insights at your fingertips
              </p>
            </div>
            
            <div className="space-y-6">
              <RealTimeActivityFeed />
              
              <div className="grid lg:grid-cols-2 gap-6">
                <AvaResearchAssistant />
                <PredictiveAnalytics />
              </div>
              
              <div className="grid lg:grid-cols-2 gap-6">
                <SmartMeetingScheduler />
                <AdvancedSequenceBuilder />
              </div>
            </div>
          </TabsContent>

          {/* Gamification Tab */}
          <TabsContent value="gamification" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <div className="relative p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/5 border border-amber-500/20 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl -z-10" />
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <Trophy className="text-white" size={24} />
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                  Sales Gamification
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-lg ml-16">
                Drive performance through competition, achievements, and reward systems
              </p>
            </div>
            
            <div className="space-y-6">
              <TeamLeaderboard />
              
              <div className="grid lg:grid-cols-2 gap-6">
                <AchievementBadges />
                <PointsRewardsSystem />
              </div>
              
              <TeamCompetitions />
            </div>
          </TabsContent>

          {/* Playbooks Tab */}
          <TabsContent value="playbooks" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-rose-500/5 border border-purple-500/20 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl -z-10" />
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <BookOpen className="text-white" size={24} />
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Sales Enablement Playbooks
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-lg ml-16">
                Battle-tested strategies, objection handling frameworks, and ROI calculators
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <SalesPlaybooks />
                <BattleCards />
              </div>
              
              <div className="grid lg:grid-cols-2 gap-6">
                <ObjectionHandlers />
                <ROICalculator />
              </div>
            </div>
          </TabsContent>

          {/* Executive Tab */}
          <TabsContent value="executive" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/5 border border-emerald-500/20 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-3xl -z-10" />
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <BarChart3 className="text-white" size={24} />
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  Executive Command Center
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-lg ml-16">
                Real-time KPIs, pipeline health monitoring, forecasting, and scenario planning
              </p>
            </div>
            
            <div className="space-y-6">
              <CEOExecutiveDashboard />
              
              <div className="grid lg:grid-cols-2 gap-6">
                <PipelineHealthScore />
                <ForecastAccuracyTracker />
              </div>
              
              <WhatIfScenarioPlanner />
            </div>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/5 border border-indigo-500/20 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl -z-10" />
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Link className="text-white" size={24} />
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Deep Integrations
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-lg ml-16">
                2-way sync with Salesforce, Slack control, calendar automation, and Zapier workflows
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <TwoWaySalesforceSync />
                <SlackTeamsDeepIntegration />
              </div>
              
              <div className="grid lg:grid-cols-2 gap-6">
                <CalendarAutoScheduler />
                <ZapierActionBuilder />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        </div>

        {/* Futuristic Footer CTA */}
        <div className="mt-20 relative">
        {/* Glow Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl -z-10 rounded-3xl" />
        
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-800 dark:via-purple-900 dark:to-slate-800 border border-purple-500/20">
          {/* Animated Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          {/* Content */}
          <div className="relative p-12 text-center">
            {/* Floating Icons */}
            <div className="flex justify-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
                <Rocket className="text-white" size={20} />
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>
                <Star className="text-white" size={20} />
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>
                <Sparkles className="text-white" size={20} />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
              Industry-Leading AI Sales Platform
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              21 exceptional features engineered to make your sales team <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-bold">unstoppable</span>
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <div 
                  key={feature.id}
                  className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative">
                    <p className="text-4xl font-black text-white mb-2">
                      <AnimatedCounter end={feature.count} duration={1500 + index * 200} />
                    </p>
                    <p className="text-sm text-slate-300 font-medium">{feature.label}</p>
                    <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${feature.gradient} transition-all duration-1000`}
                        style={{ width: `${feature.count * 20}%` }}
                      />
                    </div>
                  </div>
                  {/* Hover glow effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300 -z-10`} />
                </div>
              ))}
            </div>
            
            {/* CTA Button */}
            <div className="mt-10 flex justify-center gap-4">
              <button className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  <Rocket className="animate-bounce" size={20} />
                  Explore All Features
                  <Sparkles className="animate-pulse" size={20} />
                </span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
              </button>
              
              <button className="group relative px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <span className="relative z-10 flex items-center gap-2">
                  <Target size={20} />
                  View Demo
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ExceptionalHub;
