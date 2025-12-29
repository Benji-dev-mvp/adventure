import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Tabs } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Bot, Mail, Brain, Sparkles, Target, TrendingUp, Zap, Database, Search, MessageSquare, Calendar, Clock, BookOpen, ChevronRight, Users, DollarSign, Shield, Activity, BarChart3, Lightbulb, Grid3X3 } from 'lucide-react';
import { useToast } from '../components/Toast';
import { AnimatedCounter, LiveIndicator, FuturisticBackground } from '../components/ui/AnimatedComponents';
import { useTenant } from '../contexts/TenantContext';
import { useWorkspaceMetrics } from '../hooks/useWorkspaceMetrics';
import { useReducedMotion, getMotionConfig } from '../hooks/useMotion';
import { RoiProjectionChart, CustomerImpactSparklines } from '../components/analytics';
import { GlassCard, GlassCardContent, GradientText } from '../components/futuristic';

// Import Ava Components
import {
  AvaChatInterface,
  EmailDeliverabilityDashboard,
  DataMinerDashboard,
  PersonalizationWaterfallViewer,
  SentimentAnalysisDashboard,
  LeadQualificationPipeline,
  AvaPerformanceTracker,
  AvaTrainingInterface,
  B2BDatabaseSearch
} from '../components/ava/AvaComponents';

// Import Autonomous Features
import {
  AutonomousProspectResearcher,
  ObjectionHandler,
  AutonomousMeetingBooker,
  AutonomousFollowUpEngine
} from '../components/ava/AutonomousFeatures';

// Import Playbook Intelligence (Phase 1)
import {
  PlaybookHealthHeatmap,
  PlaybookRunTimeline,
  StrategyRecommendationCards,
  PlaybookAttributionMatrix,
  PlaybookAnalyticsPanel
} from '../components/ava/intelligence';

// Import AI Playbooks
import { AIPlaybooksManager } from '../components/ava/AIPlaybooksManager';

const AvaHub = () => {
  const { showToast } = useToast();
  const { plan, isStartup, isMidmarket, isEnterprise } = useTenant();
  const { roiConfig, sparklines, summary } = useWorkspaceMetrics();
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState('chat');
  const [stats, setStats] = useState({
    prospects: summary?.qualifiedLeads || 247,
    responseRate: 31,
    meetings: summary?.meetingsBooked || 12,
    insights: 3397
  });

  // Enhanced sparklines for Ava
  const avaSparklines = useMemo(() => {
    return [
      { id: 'meetings', label: 'Meetings Booked', value: String(stats.meetings), change: '+24%', trend: 'up', color: '#10b981', icon: Calendar, chartType: 'area' },
      { id: 'replies', label: 'Response Rate', value: `${stats.responseRate}%`, change: '+8%', trend: 'up', color: '#8b5cf6', icon: Mail, chartType: 'area' },
      { id: 'pipeline', label: 'Pipeline Generated', value: `$${Math.round((summary?.pipelineValue || 155000) / 1000)}K`, change: '+65%', trend: 'up', color: '#06b6d4', icon: DollarSign, chartType: 'area' },
      { id: 'timeSaved', label: 'Hours Saved', value: String(summary?.timeSavedHours || 24), change: 'This week', trend: 'up', color: '#f97316', icon: Clock, chartType: 'bar' },
    ];
  }, [stats, summary]);

  // Segment-specific headline
  const segmentContent = useMemo(() => {
    if (isEnterprise) {
      return {
        headline: 'Enterprise AI Sales Operations',
        subheadline: 'Full control over AI-powered outbound at scale',
        badge: 'Enterprise',
        badgeIcon: Shield,
      };
    }
    if (isMidmarket) {
      return {
        headline: 'Your AI Team is Crushing It',
        subheadline: 'Ava automates 80% of outbound—your team handles high-value conversations',
        badge: '80% Automated',
        badgeIcon: Zap,
      };
    }
    return {
      headline: 'Meet Ava—Your AI SDR',
      subheadline: 'She works 24/7 so you can focus on closing. Ava handles prospecting, outreach, and follow-ups automatically.',
      badge: 'Always On',
      badgeIcon: Sparkles,
    };
  }, [isStartup, isMidmarket, isEnterprise]);

  // Simulate live stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        prospects: prev.prospects + Math.floor(Math.random() * 5),
        responseRate: +(prev.responseRate + (Math.random() - 0.5) * 0.5).toFixed(1),
        meetings: prev.meetings + (Math.random() > 0.8 ? 1 : 0),
        insights: prev.insights + Math.floor(Math.random() * 10)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'chat', label: 'Chat with Ava', icon: <Bot size={16} /> },
    { id: 'playbooks', label: 'AI Playbooks', icon: <BookOpen size={16} />, new: true },
    { id: 'playbook-intelligence', label: 'Playbook Intelligence', icon: <Activity size={16} />, new: true },
    { id: 'autonomous-research', label: 'Auto Research', icon: <Search size={16} />, new: true },
    { id: 'objection-handler', label: 'Objection Handler', icon: <MessageSquare size={16} />, new: true },
    { id: 'meeting-booker', label: 'Meeting Booker', icon: <Calendar size={16} />, new: true },
    { id: 'follow-ups', label: 'Auto Follow-Ups', icon: <Clock size={16} />, new: true },
    { id: 'deliverability', label: 'Deliverability', icon: <Mail size={16} /> },
    { id: 'data-miner', label: 'Data Miner', icon: <Brain size={16} /> },
    { id: 'personalization', label: 'Personalization', icon: <Sparkles size={16} /> },
    { id: 'sentiment', label: 'Sentiment Analysis', icon: <Target size={16} /> },
    { id: 'qualified-leads', label: 'Qualified Leads', icon: <Zap size={16} /> },
    { id: 'performance', label: 'Ava Performance', icon: <TrendingUp size={16} /> },
    { id: 'training', label: 'Train Ava', icon: <Brain size={16} /> },
    { id: 'database', label: 'B2B Database', icon: <Database size={16} /> }
  ];

  return (
    <DashboardLayout>
      <FuturisticBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Marketing-Aligned Hero Header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          className="mb-6"
        >
          <GlassCard variant="gradient" className="overflow-hidden">
            <GlassCardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Bot className="text-white" size={32} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="text-2xl lg:text-3xl font-bold text-white">
                        <GradientText gradient="cyber">{segmentContent.headline}</GradientText>
                      </h1>
                      <Badge variant="outline" className="border-green-400/50 text-green-400">
                        <segmentContent.badgeIcon size={12} className="mr-1" />
                        {segmentContent.badge}
                      </Badge>
                    </div>
                    <p className="text-slate-300 max-w-xl">
                      {segmentContent.subheadline}
                    </p>
                  </div>
                </div>
                
                {isStartup && (
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold"
                    onClick={() => setActiveTab('chat')}
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Chat with Ava
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </Button>
                )}
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* ROI Projection for Startups */}
        {isStartup && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <RoiProjectionChart 
              {...roiConfig}
              title="Your Projected ROI with Ava"
            />
          </motion.div>
        )}

        {/* Impact Sparklines */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <CustomerImpactSparklines 
            metrics={avaSparklines} 
            title={isEnterprise ? "Enterprise Ava Performance" : "Ava's Impact This Month"}
          />
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-5 text-white shadow-lg hover:scale-105 transition-transform cursor-pointer"
               onClick={() => showToast(`${stats.prospects} high-intent prospects identified and ready to contact!`, 'success')}>
            <div className="flex items-center justify-between mb-2">
              <Target size={24} className="opacity-80" />
              <LiveIndicator label="LIVE" />
            </div>
            <p className="text-3xl font-bold mb-1">
              <AnimatedCounter end={stats.prospects} />
            </p>
            <p className="text-sm opacity-90">High-Intent Prospects</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-5 text-white shadow-lg hover:scale-105 transition-transform cursor-pointer"
               onClick={() => showToast(`Your response rate is ${stats.responseRate}% - above industry average!`, 'success')}>
            <div className="flex items-center justify-between mb-2">
              <TrendingUp size={24} className="opacity-80" />
              <LiveIndicator label="LIVE" color="blue" />
            </div>
            <p className="text-3xl font-bold mb-1">
              <AnimatedCounter end={stats.responseRate} decimals={1} />%
            </p>
            <p className="text-sm opacity-90">Response Rate</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-5 text-white shadow-lg hover:scale-105 transition-transform cursor-pointer"
               onClick={() => showToast(`${stats.meetings} meetings booked this week! Keep it up!`, 'success')}>
            <div className="flex items-center justify-between mb-2">
              <Calendar size={24} className="opacity-80" />
              <LiveIndicator label="LIVE" color="green" />
            </div>
            <p className="text-3xl font-bold mb-1">
              <AnimatedCounter end={stats.meetings} />
            </p>
            <p className="text-sm opacity-90">Meetings Booked This Week</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-5 text-white shadow-lg hover:scale-105 transition-transform cursor-pointer"
               onClick={() => showToast(`Ava has mined ${stats.insights} actionable insights from 6 data sources!`, 'info')}>
            <div className="flex items-center justify-between mb-2">
              <Brain size={24} className="opacity-80" />
              <LiveIndicator label="LIVE" color="orange" />
            </div>
            <p className="text-3xl font-bold mb-1">
              <AnimatedCounter end={stats.insights} />
            </p>
            <p className="text-sm opacity-90">Data Insights Mined</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors relative ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.new && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full animate-pulse">
                    NEW
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Chat with Ava Tab */}
          {activeTab === 'chat' && (
            <div className="grid grid-cols-1 gap-6">
              <AvaChatInterface />
            </div>
          )}

          {/* AI Playbooks Tab */}
          {activeTab === 'playbooks' && (
            <div className="grid grid-cols-1 gap-6">
              <AIPlaybooksManager />
            </div>
          )}

          {/* Playbook Intelligence Tab - Phase 1 Visual Intelligence */}
          {activeTab === 'playbook-intelligence' && (
            <div className="space-y-6">
              {/* Analytics Panel - Summary */}
              <PlaybookAnalyticsPanel />

              {/* Health Heatmap + Strategy Cards Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PlaybookHealthHeatmap />
                <StrategyRecommendationCards />
              </div>

              {/* Timeline View */}
              <PlaybookRunTimeline />

              {/* Attribution Matrix */}
              <PlaybookAttributionMatrix />
            </div>
          )}

          {/* Autonomous Research Tab */}
          {activeTab === 'autonomous-research' && (
            <div className="grid grid-cols-1 gap-6">
              <AutonomousProspectResearcher />
            </div>
          )}

          {/* Objection Handler Tab */}
          {activeTab === 'objection-handler' && (
            <div className="grid grid-cols-1 gap-6">
              <ObjectionHandler />
            </div>
          )}

          {/* Meeting Booker Tab */}
          {activeTab === 'meeting-booker' && (
            <div className="grid grid-cols-1 gap-6">
              <AutonomousMeetingBooker />
            </div>
          )}

          {/* Auto Follow-Ups Tab */}
          {activeTab === 'follow-ups' && (
            <div className="grid grid-cols-1 gap-6">
              <AutonomousFollowUpEngine />
            </div>
          )}

          {/* Deliverability Tab */}
          {activeTab === 'deliverability' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EmailDeliverabilityDashboard />
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">🔥 Ava's Deliverability Features</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Automatic Warmup:</strong> Ava warms up mailboxes as soon as you connect them</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Health Monitoring:</strong> Real-time tracking of mailbox reputation and deliverability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Dynamic Sending Limits:</strong> Ava adjusts daily sending limits based on mailbox health</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Spam Folder Prevention:</strong> Ensures messages never end up in spam</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Data Miner Tab */}
          {activeTab === 'data-miner' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DataMinerDashboard />
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4">🧠 Data Sources Ava Uses</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Twitter/X:</strong> Recent posts, engagement, interests</li>
                    <li>• <strong>LinkedIn:</strong> Job changes, company updates, content shared</li>
                    <li>• <strong>Crunchbase:</strong> Funding rounds, investor info, valuation</li>
                    <li>• <strong>Press Releases:</strong> Company announcements, product launches</li>
                    <li>• <strong>Job Postings:</strong> Hiring activity, team growth signals</li>
                    <li>• <strong>Company News:</strong> Media coverage, partnerships, expansions</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-3">🎯 High-Intent Signals</h3>
                  <p className="text-sm mb-3">Ava identifies prospects showing buying intent:</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Recent funding round (Series A/B/C)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Rapid hiring in relevant departments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Executive job changes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Social media engagement with competitors</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Personalization Tab */}
          {activeTab === 'personalization' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PersonalizationWaterfallViewer />
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">✨ How Ava's Waterfall Works</h3>
                <p className="text-sm mb-4">
                  Ava uses a prioritized waterfall to choose the best personalization for each prospect:
                </p>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-600">1.</span>
                    <span><strong>Job Changes:</strong> Most timely and relevant trigger</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-600">2.</span>
                    <span><strong>Funding Events:</strong> Strong buying intent signal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-600">3.</span>
                    <span><strong>Social Activity:</strong> Personal interests and engagement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-600">4.</span>
                    <span><strong>Hiring Activity:</strong> Team growth and expansion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-600">5.</span>
                    <span><strong>Company News:</strong> Recent announcements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-600">6.</span>
                    <span><strong>Generic Template:</strong> Fallback if no specific data available</span>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* Sentiment Analysis Tab */}
          {activeTab === 'sentiment' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SentimentAnalysisDashboard />
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4">🎯 What Ava Does with Sentiment</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span><strong>Positive Responses:</strong> Ava flags as qualified leads and hands them over to your sales team</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">✗</span>
                      <span><strong>Negative Responses:</strong> Ava automatically unsubscribes and stops outreach</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-600 font-bold">○</span>
                      <span><strong>Neutral Responses:</strong> Ava schedules follow-up for later (e.g., "check back next quarter")</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-3">🤖 AI Sentiment Detection</h3>
                  <p className="text-sm">
                    Ava uses advanced NLP to analyze response sentiment with 94% accuracy. She looks for:
                  </p>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li>• Keywords like "interested", "demo", "pricing"</li>
                    <li>• Tone and enthusiasm level</li>
                    <li>• Questions vs rejections</li>
                    <li>• Timeline indicators</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Qualified Leads Tab */}
          {activeTab === 'qualified-leads' && (
            <div className="grid grid-cols-1 gap-6">
              <LeadQualificationPipeline />
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="grid grid-cols-1 gap-6">
              <AvaPerformanceTracker />
            </div>
          )}

          {/* Training Tab */}
          {activeTab === 'training' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AvaTrainingInterface />
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">🧠 How Ava Learns</h3>
                <p className="text-sm mb-4">
                  Ava uses your feedback and campaign results to continuously improve:
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">1.</span>
                    <span><strong>Feedback Loop:</strong> Your coaching points directly update Ava's writing style</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">2.</span>
                    <span><strong>A/B Testing:</strong> Ava tests different approaches and learns from results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">3.</span>
                    <span><strong>Pattern Recognition:</strong> Identifies what works for your industry and persona</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">4.</span>
                    <span><strong>Self-Optimization:</strong> Refines her style over time to maximize positive responses</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Database Tab */}
          {activeTab === 'database' && (
            <div className="grid grid-cols-1 gap-6">
              <B2BDatabaseSearch />
            </div>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AvaHub;
