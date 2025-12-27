# Artisan Frontend Architecture

## Overview

This document describes the centralized routing, API layer, and context-based architecture implemented for the Artisan platform.

## Architecture Components

### 1. Application Shell (`src/components/layout/AppShell.jsx`)

The `AppShell` component provides a unified layout for the entire application:

```jsx
import { AppShell } from './components/layout/AppShell';

// Automatically wraps all routes with:
// - Sidebar navigation
// - Header with search, notifications, theme toggle
// - Proper layout flex structure
```

**Features:**
- Automatically skips layout for public pages (landing, marketing, onboarding)
- Provides consistent navigation and header across all authenticated routes
- Dark mode support via ThemeContext

### 2. Contexts

#### AuthContext (`src/contexts/AuthContext.jsx`)

Manages authentication state across the application:

```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return <div>Welcome, {user.name}!</div>;
}
```

**API:**
- `user` - Current user object
- `loading` - Authentication check in progress
- `isAuthenticated` - Boolean authentication status
- `login(userData)` - Set authenticated user
- `logout()` - Clear authentication
- `updateUser(updates)` - Update user information

#### TenantContext (`src/contexts/TenantContext.jsx`)

Manages workspace/organization context for multi-tenant features:

```jsx
import { useTenant } from '../contexts/TenantContext';

function AdminPage() {
  const { tenantId, tenantName, switchTenant } = useTenant();
  
  return (
    <div>
      <h1>Admin Dashboard - {tenantName}</h1>
      {/* All API calls will automatically use this tenantId */}
    </div>
  );
}
```

**API:**
- `tenantId` - Current workspace/organization ID
- `tenantName` - Current workspace name
- `switchTenant(id, name)` - Change active workspace
- `clearTenant()` - Clear workspace selection

### 3. Centralized API Layer

#### API Client (`src/lib/apiClient.js`)

Single axios instance with automatic token and tenant management:

```jsx
import { apiClient } from '../lib/apiClient';

// Automatically includes:
// - Authorization header with token
// - X-Tenant-ID header
// - Global error handling
// - 401 redirect to login

const response = await apiClient.get('/campaigns');
```

**Features:**
- Request interceptor adds auth token and tenant ID
- Response interceptor handles common errors (401, 403, 429, 5xx)
- Automatic token refresh and logout on auth failure

#### Feature-Specific API Modules

Instead of scattered fetch calls, use centralized API modules:

**Admin API** (`src/lib/adminApi.js`):
```jsx
import { AdminApi } from '../lib/adminApi';

// API Keys
const keys = await AdminApi.listApiKeys(tenantId);
await AdminApi.createApiKey(tenantId, { name: 'Production', permissions: ['read'] });
await AdminApi.revokeApiKey(tenantId, keyId);

// Webhooks
const webhooks = await AdminApi.listWebhooks(tenantId);
await AdminApi.createWebhook(tenantId, { url: 'https://...', events: [...] });

// Audit Logs
const logs = await AdminApi.getAuditLogs(tenantId, { page: 1, limit: 50 });

// Compliance
const status = await AdminApi.getComplianceStatus(tenantId);
```

**Analytics API** (`src/lib/analyticsApi.js`):
```jsx
import { AnalyticsApi } from '../lib/analyticsApi';

// Dashboard stats
const stats = await AnalyticsApi.getDashboardStats(tenantId, '30d');

// Campaign metrics
const metrics = await AnalyticsApi.getCampaignMetrics(tenantId, campaignId);

// Revenue forecasting
const forecast = await AnalyticsApi.getRevenueForecast(tenantId, 6);
```

**Campaigns API** (`src/lib/campaignsApi.js`):
```jsx
import { CampaignsApi } from '../lib/campaignsApi';

// CRUD operations
const campaigns = await CampaignsApi.listCampaigns(tenantId);
await CampaignsApi.createCampaign(tenantId, campaignData);
await CampaignsApi.updateCampaign(tenantId, id, updates);

// Operations
await CampaignsApi.launchCampaign(tenantId, campaignId);
await CampaignsApi.pauseCampaign(tenantId, campaignId);
```

### 4. Standardized Hooks

Custom hooks provide a clean interface between components and APIs:

#### useAdminApiKeys

```jsx
import { useAdminApiKeys } from '../hooks/useAdminApiKeys';

function AdminAPIKeysPage() {
  const { 
    keys,           // Array of API keys
    loading,        // Loading state
    createApiKey,   // Create function
    revokeApiKey,   // Revoke function
    refetch         // Manual refresh
  } = useAdminApiKeys();
  
  const handleCreate = async () => {
    const newKey = await createApiKey({
      name: 'My Key',
      permissions: ['read', 'write']
    });
    // Toast notification shown automatically
  };
  
  return <div>{/* Render keys */}</div>;
}
```

#### useWebhooks

```jsx
import { useWebhooks } from '../hooks/useWebhooks';

function WebhooksPage() {
  const {
    webhooks,
    createWebhook,
    deleteWebhook,
    testWebhook,
    getWebhookLogs
  } = useWebhooks();
  
  // All operations include automatic toast notifications
}
```

#### useAnalytics

```jsx
import { useAnalytics } from '../hooks/useAnalytics';

function AnalyticsDashboard() {
  const { dashboardStats, loading } = useAnalytics('30d');
  
  if (loading) return <PageLoader />;
  
  return <div>{/* Render stats */}</div>;
}
```

#### useCampaigns

```jsx
import { useCampaigns } from '../hooks/useCampaigns';

function CampaignsPage() {
  const {
    campaigns,
    createCampaign,
    launchCampaign,
    pauseCampaign,
    deleteCampaign
  } = useCampaigns({ status: 'active' });
  
  // All operations include loading states and toast notifications
}
```

## Routing Structure

Routes are organized by feature area in `App.jsx`:

```jsx
<AppShell>
  <Routes>
    {/* Public Pages - No AppShell */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/marketing" element={<Marketing />} />
    
    {/* Main App - With AppShell */}
    <Route path="/app" element={<Dashboard />} />
    <Route path="/campaigns" element={<CampaignBuilder />} />
    
    {/* Admin Routes */}
    <Route path="/admin" element={<Admin />} />
    <Route path="/admin/api-keys" element={<AdminAPIKeys />} />
    <Route path="/admin/webhooks" element={<AdminWebhooks />} />
    
    {/* Solutions Pages */}
    <Route path="/solutions/enterprise" element={<SolutionsEnterprise />} />
  </Routes>
</AppShell>
```

## Migration Guide

### Before (Ad-hoc API calls)

```jsx
function MyPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  
  const handleCreate = async () => {
    try {
      await fetch('/api/data', {
        method: 'POST',
        body: JSON.stringify(newData)
      });
      toast.success('Created!');
    } catch (err) {
      toast.error('Failed!');
    }
  };
}
```

### After (Using hooks and API layer)

```jsx
import { useMyData } from '../hooks/useMyData';

function MyPage() {
  const { data, loading, createItem } = useMyData();
  
  const handleCreate = async () => {
    await createItem(newData);
    // Toast shown automatically
  };
  
  if (loading) return <PageLoader />;
  return <div>{/* Render data */}</div>;
}
```

## Benefits

1. **Centralized Error Handling** - All API errors handled consistently
2. **Automatic Auth** - Token and tenant ID added to all requests
3. **Consistent Loading States** - Standardized loading and error patterns
4. **Toast Notifications** - Success/error messages shown automatically
5. **Type Safety** - Clear API contracts through dedicated modules
6. **Testability** - Easy to mock hooks and API modules
7. **Maintainability** - Changes to API structure only need updates in one place

## Testing

Route tests verify all major paths render correctly:

```bash
npm test -- src/__tests__/App.routes.test.jsx
```

## Next Steps

1. **Add React Query** - Consider replacing useSimpleApiQuery with @tanstack/react-query for:
   - Automatic caching
   - Background refetching
   - Optimistic updates
   - Better loading states

2. **Add Protected Routes** - Wrap authenticated routes with auth check:
   ```jsx
   <Route path="/app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
   ```

3. **Add Error Boundaries** - Per-route error boundaries for better error isolation

4. **Add Route Guards** - Role-based access control for admin routes

## Examples

See `src/pages/AdminAPIKeys.example.jsx` for a complete example of using the new architecture.
