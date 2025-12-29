/**
 * Centralized Router Configuration
 * Route definitions with guards, layouts, and metadata
 */
import { Suspense, lazy } from 'react';
import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom';
import { PageLoader } from '../components/Loading';

// Lazy load pages
const LandingPage = lazy(() => import('../pages/LandingPage'));
const Marketing = lazy(() => import('../pages/Marketing'));
const Dashboard = lazy(() => import('../pages/EnhancedDashboardNew'));
const CampaignBuilder = lazy(() => import('../pages/CampaignBuilder'));
const Leads = lazy(() => import('../pages/Leads'));
const LeadDatabase = lazy(() => import('../pages/LeadDatabase'));
const AIAssistant = lazy(() => import('../pages/AIAssistant'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Integrations = lazy(() => import('../pages/Integrations'));
const Settings = lazy(() => import('../pages/Settings'));
const Templates = lazy(() => import('../pages/Templates'));
const Admin = lazy(() => import('../pages/Admin'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Advanced Features
const LeadScoring = lazy(() => import('../pages/LeadScoring'));
const ABTesting = lazy(() => import('../pages/ABTesting'));
const EmailTemplateBuilder = lazy(() => import('../pages/EmailTemplateBuilder'));
const LeadEnrichment = lazy(() => import('../pages/LeadEnrichment'));
const RevenueForecasting = lazy(() => import('../pages/RevenueForecasting'));

// Admin Pages
const AdminAPIKeys = lazy(() => import('../pages/AdminAPIKeys'));
const AdminWebhooks = lazy(() => import('../pages/AdminWebhooks'));
const AdminAuditLog = lazy(() => import('../pages/AdminAuditLog'));

// ============================================
// Route Metadata Types
// ============================================

export interface RouteMetadata {
  title: string;
  description?: string;
  requiresAuth?: boolean;
  requiredRole?: 'user' | 'admin' | 'super_admin';
  icon?: string;
  hideInNav?: boolean;
}

// ============================================
// Layout Components
// ============================================

function PublicLayout() {
  return (
    <Suspense fallback={<PageLoader message="Loading..." />}>
      <Outlet />
    </Suspense>
  );
}

function AppLayout() {
  // This would typically include DashboardLayout wrapper
  return (
    <Suspense fallback={<PageLoader message="Loading..." />}>
      <Outlet />
    </Suspense>
  );
}

function AdminLayout() {
  return (
    <Suspense fallback={<PageLoader message="Loading Admin..." />}>
      <Outlet />
    </Suspense>
  );
}

// ============================================
// Route Definitions
// ============================================

export const routeConfig = {
  // Public routes
  public: [
    { path: '/', element: <LandingPage />, meta: { title: 'Home' } },
    { path: '/marketing', element: <Marketing />, meta: { title: 'Marketing' } },
  ],

  // Protected app routes
  app: [
    { path: 'dashboard', element: <Dashboard />, meta: { title: 'Dashboard', icon: 'home' } },
    {
      path: 'campaigns',
      element: <CampaignBuilder />,
      meta: { title: 'Campaigns', icon: 'megaphone' },
    },
    { path: 'leads', element: <Leads />, meta: { title: 'Leads', icon: 'users' } },
    {
      path: 'lead-database',
      element: <LeadDatabase />,
      meta: { title: 'Lead Database', icon: 'database' },
    },
    {
      path: 'ai-assistant',
      element: <AIAssistant />,
      meta: { title: 'AI Assistant', icon: 'bot' },
    },
    { path: 'analytics', element: <Analytics />, meta: { title: 'Analytics', icon: 'chart' } },
    {
      path: 'integrations',
      element: <Integrations />,
      meta: { title: 'Integrations', icon: 'plug' },
    },
    { path: 'templates', element: <Templates />, meta: { title: 'Templates', icon: 'file-text' } },
    { path: 'settings', element: <Settings />, meta: { title: 'Settings', icon: 'settings' } },
    // Advanced features
    {
      path: 'lead-scoring',
      element: <LeadScoring />,
      meta: { title: 'Lead Scoring', icon: 'target' },
    },
    { path: 'ab-testing', element: <ABTesting />, meta: { title: 'A/B Testing', icon: 'split' } },
    {
      path: 'email-templates',
      element: <EmailTemplateBuilder />,
      meta: { title: 'Email Builder', icon: 'mail' },
    },
    {
      path: 'lead-enrichment',
      element: <LeadEnrichment />,
      meta: { title: 'Enrichment', icon: 'sparkles' },
    },
    {
      path: 'revenue-forecasting',
      element: <RevenueForecasting />,
      meta: { title: 'Revenue Forecast', icon: 'trending-up' },
    },
  ],

  // Admin routes
  admin: [
    { path: '', element: <Admin />, meta: { title: 'Admin Dashboard' } },
    { path: 'api-keys', element: <AdminAPIKeys />, meta: { title: 'API Keys' } },
    { path: 'webhooks', element: <AdminWebhooks />, meta: { title: 'Webhooks' } },
    { path: 'audit-log', element: <AdminAuditLog />, meta: { title: 'Audit Log' } },
  ],
} as const;

// ============================================
// Router Instance
// ============================================

export const router = createBrowserRouter([
  // Public routes
  {
    element: <PublicLayout />,
    children: routeConfig.public.map(({ path, element }) => ({
      path,
      element,
    })),
  },

  // App routes (would normally have auth guard)
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      ...routeConfig.app.map(({ path, element }) => ({
        path,
        element,
      })),
    ],
  },

  // Admin routes
  {
    path: '/admin',
    element: <AdminLayout />,
    children: routeConfig.admin.map(({ path, element }) => ({
      path,
      element,
    })),
  },

  // Catch-all
  { path: '*', element: <NotFound /> },
]);

// ============================================
// Navigation Helpers
// ============================================

export const navigationItems = routeConfig.app
  .filter(route => !(route.meta as { hideInNav?: boolean })?.hideInNav)
  .map(route => ({
    path: `/app/${route.path}`,
    title: route.meta.title,
    icon: route.meta.icon,
  }));

export const adminNavigationItems = routeConfig.admin.map(route => ({
  path: route.path ? `/admin/${route.path}` : '/admin',
  title: route.meta.title,
}));

export default router;
