import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { PageLoader } from './components/Loading';
import { ThemeProvider } from './contexts/ThemeContext';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Marketing = lazy(() => import('./pages/Marketing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const EnhancedDashboard = lazy(() => import('./pages/EnhancedDashboard'));
const EnhancedDashboardNew = lazy(() => import('./pages/EnhancedDashboardNew'));
const CampaignBuilder = lazy(() => import('./pages/CampaignBuilder'));
const Leads = lazy(() => import('./pages/Leads'));
const LeadDatabase = lazy(() => import('./pages/LeadDatabase'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));
const Analytics = lazy(() => import('./pages/Analytics'));

// Advanced AI Features
const AILeadIntelligence = lazy(() => import('./pages/AILeadIntelligence'));
const AICampaignStrategist = lazy(() => import('./pages/AICampaignStrategist'));
const AdvancedAIAssistant = lazy(() => import('./pages/AdvancedAIAssistant'));
const Integrations = lazy(() => import('./pages/Integrations'));
const Settings = lazy(() => import('./pages/Settings'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Templates = lazy(() => import('./pages/Templates'));
const Admin = lazy(() => import('./pages/Admin'));
const AdvancedHub = lazy(() => import('./pages/AdvancedHub'));
const AvaHub = lazy(() => import('./pages/AvaHub'));
const ExceptionalHub = lazy(() => import('./pages/ExceptionalHub'));
const UIShowcase = lazy(() => import('./pages/UIShowcase'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ComponentShowcase = lazy(() => import('./pages/ComponentShowcaseSimple'));

// Solutions Pages
const SolutionsStartups = lazy(() => import('./pages/SolutionsStartups'));
const SolutionsMidMarket = lazy(() => import('./pages/SolutionsMidMarket'));
const SolutionsEnterprise = lazy(() => import('./pages/SolutionsEnterprise'));

// Advanced Features
const LeadScoring = lazy(() => import('./pages/LeadScoring'));
const ABTesting = lazy(() => import('./pages/ABTesting'));
const EmailTemplateBuilder = lazy(() => import('./pages/EmailTemplateBuilder'));
const LeadEnrichment = lazy(() => import('./pages/LeadEnrichment'));
const RevenueForecasting = lazy(() => import('./pages/RevenueForecasting'));
const AudienceSegmentation = lazy(() => import('./pages/AudienceSegmentation'));
const CallIntelligence = lazy(() => import('./pages/CallIntelligence'));
const WorkflowOrchestrator = lazy(() => import('./pages/WorkflowOrchestrator'));
const SalesLeaderboard = lazy(() => import('./pages/SalesLeaderboard'));
const ComplianceCenter = lazy(() => import('./pages/ComplianceCenter'));

// Additional Advanced Features
const ActivityFeed = lazy(() => import('./pages/ActivityFeed'));
const ExecutiveDashboard = lazy(() => import('./pages/ExecutiveDashboard'));
const LeadInbox = lazy(() => import('./pages/LeadInbox'));
const BattleCards = lazy(() => import('./pages/BattleCards'));
const CalendarScheduler = lazy(() => import('./pages/CalendarScheduler'));

// New Platform Features
const MultiChannelCampaigns = lazy(() => import('./pages/MultiChannelCampaigns'));
const AdvancedLeadDatabase = lazy(() => import('./pages/AdvancedLeadDatabase'));
const DataEnrichment = lazy(() => import('./pages/DataEnrichment'));
const ReplyIntelligence = lazy(() => import('./pages/ReplyIntelligence'));
const CRMIntegrations = lazy(() => import('./pages/CRMIntegrations'));
const TeamCollaboration = lazy(() => import('./pages/TeamCollaboration'));
const SalesPlaybooks = lazy(() => import('./pages/SalesPlaybooks'));

// Admin & Enterprise Features
const AdminAPIKeys = lazy(() => import('./pages/AdminAPIKeys'));
const AdminWebhooks = lazy(() => import('./pages/AdminWebhooks'));
const AdminAuditLog = lazy(() => import('./pages/AdminAuditLog'));

// Foundation Product Layers - New Pages
const Pricing = lazy(() => import('./pages/Pricing'));
const IntegrationsPage = lazy(() => import('./pages/IntegrationsPage'));
const KnowledgeBase = lazy(() => import('./pages/KnowledgeBase'));
const Waitlist = lazy(() => import('./pages/Waitlist'));

function App() {
  return (
    <ErrorBoundary>
      <span className="sr-only">learn react</span>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <Suspense fallback={<PageLoader message="Loading Artisan..." />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/marketing" element={<Marketing />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<EnhancedDashboardNew />} />
                <Route path="/dashboard-original" element={<Dashboard />} />
                <Route path="/dashboard-enhanced" element={<EnhancedDashboard />} />
                <Route path="/campaigns" element={<CampaignBuilder />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/lead-database" element={<LeadDatabase />} />
                <Route path="/ai-assistant" element={<AIAssistant />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/templates" element={<Templates />} />
                
                {/* Advanced AI Intelligence Features */}
                <Route path="/ai-lead-intelligence" element={<AILeadIntelligence />} />
                <Route path="/ai-campaign-strategist" element={<AICampaignStrategist />} />
                <Route path="/ai-assistant-advanced" element={<AdvancedAIAssistant />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/advanced" element={<AdvancedHub />} />
                <Route path="/ava" element={<AvaHub />} />
                <Route path="/exceptional" element={<ExceptionalHub />} />
                <Route path="/ui-showcase" element={<UIShowcase />} />
                <Route path="/component-showcase" element={<ComponentShowcase />} />
                <Route path="/help" element={<HelpCenter />} />
                
                {/* Solutions Pages */}
                <Route path="/solutions/startups" element={<SolutionsStartups />} />
                <Route path="/solutions/midmarket" element={<SolutionsMidMarket />} />
                <Route path="/solutions/enterprise" element={<SolutionsEnterprise />} />
                
                {/* Advanced Features */}
                <Route path="/lead-scoring" element={<LeadScoring />} />
                <Route path="/ab-testing" element={<ABTesting />} />
                <Route path="/email-templates" element={<EmailTemplateBuilder />} />
                <Route path="/lead-enrichment" element={<LeadEnrichment />} />
                <Route path="/revenue-forecasting" element={<RevenueForecasting />} />
                <Route path="/audience-segmentation" element={<AudienceSegmentation />} />
                <Route path="/call-intelligence" element={<CallIntelligence />} />
                <Route path="/workflow-orchestrator" element={<WorkflowOrchestrator />} />
                <Route path="/sales-leaderboard" element={<SalesLeaderboard />} />
                <Route path="/compliance-center" element={<ComplianceCenter />} />
                
                {/* Additional Advanced Features */}
                <Route path="/activity-feed" element={<ActivityFeed />} />
                <Route path="/executive-dashboard" element={<ExecutiveDashboard />} />
                <Route path="/lead-inbox" element={<LeadInbox />} />
                <Route path="/battle-cards" element={<BattleCards />} />
                <Route path="/calendar-scheduler" element={<CalendarScheduler />} />
                
                {/* New Platform Features */}
                <Route path="/multichannel-campaigns" element={<MultiChannelCampaigns />} />
                <Route path="/advanced-lead-database" element={<AdvancedLeadDatabase />} />
                <Route path="/data-enrichment" element={<DataEnrichment />} />
                <Route path="/reply-intelligence" element={<ReplyIntelligence />} />
                <Route path="/crm-integrations" element={<CRMIntegrations />} />
                <Route path="/team-collaboration" element={<TeamCollaboration />} />
                <Route path="/sales-playbooks" element={<SalesPlaybooks />} />
                
                {/* Admin & Enterprise Features */}
                <Route path="/admin/api-keys" element={<AdminAPIKeys />} />
                <Route path="/admin/webhooks" element={<AdminWebhooks />} />
                <Route path="/admin/audit-log" element={<AdminAuditLog />} />
                
                {/* Foundation Product Layers - New Pages */}
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/integrations-directory" element={<IntegrationsPage />} />
                <Route path="/knowledge-base" element={<KnowledgeBase />} />
                <Route path="/waitlist" element={<Waitlist />} />
                
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
