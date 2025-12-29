import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Tabs } from '../components/ui/Tabs';
import {
  Brain,
  Zap,
  BarChart3,
  Users,
  Shield,
  MessageSquare,
  Target,
  TrendingUp,
  Image as ImageIcon,
  Search,
  Code,
  FlaskConical,
} from 'lucide-react';

// AI & ML Components
import {
  AILeadScoringTrainer,
  ConversationIntelligence,
  ChurnPrediction,
  NextBestActionEngine,
  EmailReplyCategorizer,
  ABTestOptimizer,
  SentimentTrendAnalysis,
  SmartReplyGenerator,
} from '../components/ai/AIMLComponents';

// Automation Components
import {
  VisualWorkflowBuilder,
  LeadRoutingEngine,
  TriggerBasedActions,
  WebhookAutomationStudio,
  ScheduledReports,
  AutoFollowUpSequences,
  TaskAutomation,
  DataSyncScheduler,
} from '../components/automation/AutomationComponents';

// Advanced Analytics
import {
  ExecutiveDashboard,
  ConversionFunnelAnalyzer,
  RevenueAttribution,
  PipelineVelocityTracker,
  WinLossAnalysis,
  CompetitiveIntelligence,
  ForecastAccuracy,
  CustomSQLQueryBuilder,
  DataExportScheduler,
} from '../components/analytics/AdvancedAnalytics';

// Team Collaboration
import {
  SharedInbox,
  LeadNotesComments,
  LeadHandoffWorkflow,
  TeamCalendar,
  TeamActivityFeed,
  DealRooms,
  VideoCallIntegration,
  SlackTeamsBot,
} from '../components/collaboration/TeamComponents';

// Security & Compliance
import {
  GDPRComplianceCenter,
  SOC2AuditLogs,
  DataRetentionPolicies,
  IPWhitelistManager,
  SessionManagement,
  EncryptionKeyRotation,
  DataPrivacyDashboard,
  ComplianceReporting,
} from '../components/security/SecurityComponents';

// Communication Channels
import {
  LinkedInAutomation,
  SMSCampaigns,
  WhatsAppIntegration,
  DirectMailCampaigns,
  VoicemailDrops,
  VideoMessages,
  ChatbotBuilder,
  SocialMediaMonitor,
} from '../components/communication/CommunicationComponents';

// Sales Intelligence
import {
  TechnographicFilters,
  JobChangeAlerts,
  FundingEventTriggers,
  NewsMonitoring,
  SocialListening,
  CompetitorTracking,
  MarketSegmentation,
  BuyingCommitteeMapper,
} from '../components/sales-intel/SalesIntelComponents';

// ABM Components
import {
  AccountScoring,
  MultiThreadCampaigns,
  AccountPlans,
  BuyingSignalsDashboard,
  StakeholderMapping,
  AccountAdSync,
  TerritoryManagement,
  AccountHealthScore,
} from '../components/abm/ABMComponents';

// Misc Components (Content, Search, Developer, Testing)
import {
  GIFMemeLibrary,
  VideoRecorder,
  ImageEditor,
  DocumentTracking,
  PresentationBuilder,
  GlobalSearch,
  SmartFilters,
  DuplicateDetection,
  GraphQLPlayground,
  WebhookTestConsole,
  APIRateLimitDashboard,
  ZapierIntegration,
  MultivariateTestBuilder,
  SendTimeABTesting,
  EmailHeatmapTracker,
} from '../components/advanced/MiscComponents';

const AdvancedHub = () => {
  const [activeTab, setActiveTab] = useState('ai');

  const tabs = [
    { id: 'ai', label: 'AI & ML', icon: <Brain size={16} /> },
    { id: 'automation', label: 'Automation', icon: <Zap size={16} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
    { id: 'team', label: 'Team', icon: <Users size={16} /> },
    { id: 'security', label: 'Security', icon: <Shield size={16} /> },
    { id: 'communication', label: 'Communication', icon: <MessageSquare size={16} /> },
    { id: 'sales-intel', label: 'Sales Intel', icon: <TrendingUp size={16} /> },
    { id: 'abm', label: 'ABM', icon: <Target size={16} /> },
    { id: 'content', label: 'Content', icon: <ImageIcon size={16} /> },
    { id: 'search', label: 'Search', icon: <Search size={16} /> },
    { id: 'developer', label: 'Developer', icon: <Code size={16} /> },
    { id: 'testing', label: 'Testing', icon: <FlaskConical size={16} /> },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Advanced Features Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Explore 100+ advanced features across AI, automation, analytics, and more
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* AI & ML Tab */}
          {activeTab === 'ai' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <AILeadScoringTrainer />
              <ConversationIntelligence />
              <ChurnPrediction />
              <NextBestActionEngine />
              <EmailReplyCategorizer />
              <ABTestOptimizer />
              <SentimentTrendAnalysis />
              <SmartReplyGenerator />
            </div>
          )}

          {/* Automation Tab */}
          {activeTab === 'automation' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <VisualWorkflowBuilder />
              <LeadRoutingEngine />
              <TriggerBasedActions />
              <WebhookAutomationStudio />
              <ScheduledReports />
              <AutoFollowUpSequences />
              <TaskAutomation />
              <DataSyncScheduler />
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ExecutiveDashboard />
              <ConversionFunnelAnalyzer />
              <RevenueAttribution />
              <PipelineVelocityTracker />
              <WinLossAnalysis />
              <CompetitiveIntelligence />
              <ForecastAccuracy />
              <CustomSQLQueryBuilder />
              <DataExportScheduler />
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <SharedInbox />
              <LeadNotesComments />
              <LeadHandoffWorkflow />
              <TeamCalendar />
              <TeamActivityFeed />
              <DealRooms />
              <VideoCallIntegration />
              <SlackTeamsBot />
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <GDPRComplianceCenter />
              <SOC2AuditLogs />
              <DataRetentionPolicies />
              <IPWhitelistManager />
              <SessionManagement />
              <EncryptionKeyRotation />
              <DataPrivacyDashboard />
              <ComplianceReporting />
            </div>
          )}

          {/* Communication Tab */}
          {activeTab === 'communication' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <LinkedInAutomation />
              <SMSCampaigns />
              <WhatsAppIntegration />
              <DirectMailCampaigns />
              <VoicemailDrops />
              <VideoMessages />
              <ChatbotBuilder />
              <SocialMediaMonitor />
            </div>
          )}

          {/* Sales Intelligence Tab */}
          {activeTab === 'sales-intel' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <TechnographicFilters />
              <JobChangeAlerts />
              <FundingEventTriggers />
              <NewsMonitoring />
              <SocialListening />
              <CompetitorTracking />
              <MarketSegmentation />
              <BuyingCommitteeMapper />
            </div>
          )}

          {/* ABM Tab */}
          {activeTab === 'abm' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <AccountScoring />
              <MultiThreadCampaigns />
              <AccountPlans />
              <BuyingSignalsDashboard />
              <StakeholderMapping />
              <AccountAdSync />
              <TerritoryManagement />
              <AccountHealthScore />
            </div>
          )}

          {/* Content & Media Tab */}
          {activeTab === 'content' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <GIFMemeLibrary />
              <VideoRecorder />
              <ImageEditor />
              <DocumentTracking />
              <PresentationBuilder />
            </div>
          )}

          {/* Search & Discovery Tab */}
          {activeTab === 'search' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <GlobalSearch />
              <SmartFilters />
              <DuplicateDetection />
            </div>
          )}

          {/* Developer Tools Tab */}
          {activeTab === 'developer' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <GraphQLPlayground />
              <WebhookTestConsole />
              <APIRateLimitDashboard />
              <ZapierIntegration />
            </div>
          )}

          {/* Testing & Optimization Tab */}
          {activeTab === 'testing' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <MultivariateTestBuilder />
              <SendTimeABTesting />
              <EmailHeatmapTracker />
            </div>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdvancedHub;
