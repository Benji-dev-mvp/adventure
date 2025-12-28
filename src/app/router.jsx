/**
 * Centralized Router Configuration
 * Defines all routes with lazy loading and route guards
 */
import { lazy } from 'react';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('../pages/LandingPage'));
const Marketing = lazy(() => import('../pages/Marketing'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const CampaignBuilder = lazy(() => import('../pages/CampaignBuilder'));
const Leads = lazy(() => import('../pages/Leads'));
const LeadDatabase = lazy(() => import('../pages/LeadDatabase'));
const AIAssistant = lazy(() => import('../pages/AIAssistant'));
const Analytics = lazy(() => import('../pages/Analytics'));

// Advanced AI Features
const AILeadIntelligence = lazy(() => import('../pages/AILeadIntelligence'));
const AICampaignStrategist = lazy(() => import('../pages/AICampaignStrategist'));
const AdvancedAIAssistant = lazy(() => import('../pages/AdvancedAIAssistant'));
const Integrations = lazy(() => import('../pages/Integrations'));
const Settings = lazy(() => import('../pages/Settings'));
const Onboarding = lazy(() => import('../pages/Onboarding'));
const Templates = lazy(() => import('../pages/Templates'));
const Admin = lazy(() => import('../pages/Admin'));
const AdvancedHub = lazy(() => import('../pages/AdvancedHub'));
const AvaHub = lazy(() => import('../pages/AvaHub'));
const ExceptionalHub = lazy(() => import('../pages/ExceptionalHub'));
const UIShowcase = lazy(() => import('../pages/UIShowcase'));
const HelpCenter = lazy(() => import('../pages/HelpCenter'));
const NotFound = lazy(() => import('../pages/NotFound'));
const ComponentShowcase = lazy(() => import('../pages/ComponentShowcaseSimple'));

// Solutions Pages
const SolutionsStartups = lazy(() => import('../pages/SolutionsStartups'));
const SolutionsMidMarket = lazy(() => import('../pages/SolutionsMidMarket'));
const SolutionsEnterprise = lazy(() => import('../pages/SolutionsEnterprise'));

// Advanced Features
const LeadScoring = lazy(() => import('../pages/LeadScoring'));
const ABTesting = lazy(() => import('../pages/ABTesting'));
const EmailTemplateBuilder = lazy(() => import('../pages/EmailTemplateBuilder'));
const LeadEnrichment = lazy(() => import('../pages/LeadEnrichment'));
const RevenueForecasting = lazy(() => import('../pages/RevenueForecasting'));
const AudienceSegmentation = lazy(() => import('../pages/AudienceSegmentation'));
const CallIntelligence = lazy(() => import('../pages/CallIntelligence'));
const WorkflowOrchestrator = lazy(() => import('../pages/WorkflowOrchestrator'));
const SalesLeaderboard = lazy(() => import('../pages/SalesLeaderboard'));
const ComplianceCenter = lazy(() => import('../pages/ComplianceCenter'));

// Additional Advanced Features
const ActivityFeed = lazy(() => import('../pages/ActivityFeed'));
const ExecutiveDashboard = lazy(() => import('../pages/ExecutiveDashboard'));
const LeadInbox = lazy(() => import('../pages/LeadInbox'));
const BattleCards = lazy(() => import('../pages/BattleCards'));
const CalendarScheduler = lazy(() => import('../pages/CalendarScheduler'));

// New Platform Features
const MultiChannelCampaigns = lazy(() => import('../pages/MultiChannelCampaigns'));
const AdvancedLeadDatabase = lazy(() => import('../pages/AdvancedLeadDatabase'));
const DataEnrichment = lazy(() => import('../pages/DataEnrichment'));
const ReplyIntelligence = lazy(() => import('../pages/ReplyIntelligence'));
const CRMIntegrations = lazy(() => import('../pages/CRMIntegrations'));
const TeamCollaboration = lazy(() => import('../pages/TeamCollaboration'));
const SalesPlaybooks = lazy(() => import('../pages/SalesPlaybooks'));

// Admin & Enterprise Features
const AdminAPIKeys = lazy(() => import('../pages/AdminAPIKeys'));
const AdminWebhooks = lazy(() => import('../pages/AdminWebhooks'));
const AdminAuditLog = lazy(() => import('../pages/AdminAuditLog'));

/**
 * Route configuration object
 */
export const routes = [
  // Public routes
  {
    path: '/',
    element: LandingPage,
    public: true,
  },
  {
    path: '/marketing',
    element: Marketing,
    public: true,
  },
  
  // Auth routes
  {
    path: '/onboarding',
    element: Onboarding,
    public: true,
  },
  
  // Main app routes
  {
    path: '/dashboard',
    element: Dashboard,
    requiresAuth: true,
  },
  {
    path: '/campaigns',
    element: CampaignBuilder,
    requiresAuth: true,
  },
  {
    path: '/leads',
    element: Leads,
    requiresAuth: true,
  },
  {
    path: '/lead-database',
    element: LeadDatabase,
    requiresAuth: true,
  },
  {
    path: '/ai-assistant',
    element: AIAssistant,
    requiresAuth: true,
  },
  {
    path: '/analytics',
    element: Analytics,
    requiresAuth: true,
  },
  {
    path: '/integrations',
    element: Integrations,
    requiresAuth: true,
  },
  {
    path: '/settings',
    element: Settings,
    requiresAuth: true,
  },
  {
    path: '/templates',
    element: Templates,
    requiresAuth: true,
  },
  
  // Advanced AI Intelligence Features
  {
    path: '/ai-lead-intelligence',
    element: AILeadIntelligence,
    requiresAuth: true,
  },
  {
    path: '/ai-campaign-strategist',
    element: AICampaignStrategist,
    requiresAuth: true,
  },
  {
    path: '/ai-assistant-advanced',
    element: AdvancedAIAssistant,
    requiresAuth: true,
  },
  
  // Admin routes
  {
    path: '/admin',
    element: Admin,
    requiresAuth: true,
    requiresRole: 'admin',
  },
  {
    path: '/admin/api-keys',
    element: AdminAPIKeys,
    requiresAuth: true,
    requiresRole: 'admin',
  },
  {
    path: '/admin/webhooks',
    element: AdminWebhooks,
    requiresAuth: true,
    requiresRole: 'admin',
  },
  {
    path: '/admin/audit-log',
    element: AdminAuditLog,
    requiresAuth: true,
    requiresRole: 'admin',
  },
  
  // Hub pages
  {
    path: '/advanced',
    element: AdvancedHub,
    requiresAuth: true,
  },
  {
    path: '/ava',
    element: AvaHub,
    requiresAuth: true,
  },
  {
    path: '/exceptional',
    element: ExceptionalHub,
    requiresAuth: true,
  },
  
  // Showcase pages
  {
    path: '/ui-showcase',
    element: UIShowcase,
    public: true,
  },
  {
    path: '/component-showcase',
    element: ComponentShowcase,
    public: true,
  },
  {
    path: '/help',
    element: HelpCenter,
    public: true,
  },
  
  // Solutions Pages
  {
    path: '/solutions/startups',
    element: SolutionsStartups,
    public: true,
  },
  {
    path: '/solutions/midmarket',
    element: SolutionsMidMarket,
    public: true,
  },
  {
    path: '/solutions/enterprise',
    element: SolutionsEnterprise,
    public: true,
  },
  
  // Advanced Features
  {
    path: '/lead-scoring',
    element: LeadScoring,
    requiresAuth: true,
  },
  {
    path: '/ab-testing',
    element: ABTesting,
    requiresAuth: true,
  },
  {
    path: '/email-templates',
    element: EmailTemplateBuilder,
    requiresAuth: true,
  },
  {
    path: '/lead-enrichment',
    element: LeadEnrichment,
    requiresAuth: true,
  },
  {
    path: '/revenue-forecasting',
    element: RevenueForecasting,
    requiresAuth: true,
  },
  {
    path: '/audience-segmentation',
    element: AudienceSegmentation,
    requiresAuth: true,
  },
  {
    path: '/call-intelligence',
    element: CallIntelligence,
    requiresAuth: true,
  },
  {
    path: '/workflow-orchestrator',
    element: WorkflowOrchestrator,
    requiresAuth: true,
  },
  {
    path: '/sales-leaderboard',
    element: SalesLeaderboard,
    requiresAuth: true,
  },
  {
    path: '/compliance-center',
    element: ComplianceCenter,
    requiresAuth: true,
  },
  
  // Additional Advanced Features
  {
    path: '/activity-feed',
    element: ActivityFeed,
    requiresAuth: true,
  },
  {
    path: '/executive-dashboard',
    element: ExecutiveDashboard,
    requiresAuth: true,
  },
  {
    path: '/lead-inbox',
    element: LeadInbox,
    requiresAuth: true,
  },
  {
    path: '/battle-cards',
    element: BattleCards,
    requiresAuth: true,
  },
  {
    path: '/calendar-scheduler',
    element: CalendarScheduler,
    requiresAuth: true,
  },
  
  // New Platform Features
  {
    path: '/multichannel-campaigns',
    element: MultiChannelCampaigns,
    requiresAuth: true,
  },
  {
    path: '/advanced-lead-database',
    element: AdvancedLeadDatabase,
    requiresAuth: true,
  },
  {
    path: '/data-enrichment',
    element: DataEnrichment,
    requiresAuth: true,
  },
  {
    path: '/reply-intelligence',
    element: ReplyIntelligence,
    requiresAuth: true,
  },
  {
    path: '/crm-integrations',
    element: CRMIntegrations,
    requiresAuth: true,
  },
  {
    path: '/team-collaboration',
    element: TeamCollaboration,
    requiresAuth: true,
  },
  {
    path: '/sales-playbooks',
    element: SalesPlaybooks,
    requiresAuth: true,
  },
  
  // 404 - Must be last
  {
    path: '/404',
    element: NotFound,
    public: true,
  },
  {
    path: '*',
    element: NotFound,
    public: true,
  },
];

export default routes;
