/**
 * useEnterprise - Enterprise Readiness Hooks
 * 
 * Centralized hooks for enterprise features:
 * - RBAC (roles, permissions, access checks)
 * - Feature flags with kill switches
 * - Usage quotas and plan limits
 * - Maintenance mode detection
 * - Workspace/environment management
 */

import { useState, useEffect, useMemo, useCallback, createContext, useContext } from 'react';
import { useTenant } from '../contexts/TenantContext';

// ============================================================================
// MOCK DATA - Replace with API calls
// ============================================================================

const MOCK_ROLES = {
  owner: {
    id: 'owner',
    name: 'Owner',
    description: 'Full access to all resources and settings',
    color: '#f59e0b',
    permissions: ['*'],
  },
  admin: {
    id: 'admin',
    name: 'Admin',
    description: 'Manage users, settings, and most resources',
    color: '#8b5cf6',
    permissions: ['admin.*', 'campaigns.*', 'leads.*', 'playbooks.*', 'analytics.*', 'settings.*'],
  },
  manager: {
    id: 'manager',
    name: 'Manager',
    description: 'Manage campaigns, leads, and view analytics',
    color: '#06b6d4',
    permissions: ['campaigns.*', 'leads.*', 'playbooks.read', 'playbooks.edit', 'analytics.read'],
  },
  contributor: {
    id: 'contributor',
    name: 'Contributor',
    description: 'Create and edit campaigns and leads',
    color: '#10b981',
    permissions: ['campaigns.read', 'campaigns.create', 'campaigns.edit', 'leads.read', 'leads.create', 'leads.edit'],
  },
  readonly: {
    id: 'readonly',
    name: 'Read-only',
    description: 'View-only access to campaigns and analytics',
    color: '#6b7280',
    permissions: ['campaigns.read', 'leads.read', 'analytics.read'],
  },
};

const RESOURCE_SCOPES = [
  { id: 'playbooks', name: 'AI Playbooks', icon: 'BookOpen' },
  { id: 'campaigns', name: 'Campaigns', icon: 'Target' },
  { id: 'leads', name: 'Leads', icon: 'Users' },
  { id: 'analytics', name: 'Analytics', icon: 'BarChart3' },
  { id: 'settings', name: 'Settings', icon: 'Settings' },
  { id: 'admin', name: 'Admin', icon: 'Shield' },
];

const CAPABILITIES = ['read', 'create', 'edit', 'delete', 'export', 'admin'];

const MOCK_FEATURE_FLAGS = {
  'ai-playbooks-v2': {
    key: 'ai-playbooks-v2',
    name: 'AI Playbooks V2',
    description: 'New evolution engine for AI playbooks',
    owner: 'ai-team',
    enabled: true,
    rolloutPercent: 100,
    planOverrides: { startup: false, midmarket: true, enterprise: true },
    environment: { production: true, sandbox: true },
    isKillSwitch: false,
  },
  'autonomous-ava': {
    key: 'autonomous-ava',
    name: 'Autonomous Ava Mode',
    description: 'Full autonomy for Ava AI SDR',
    owner: 'ava-team',
    enabled: true,
    rolloutPercent: 50,
    planOverrides: { startup: true, midmarket: true, enterprise: true },
    environment: { production: false, sandbox: true },
    isKillSwitch: true,
  },
  'autopilot-engine': {
    key: 'autopilot-engine',
    name: 'Autopilot Campaign Engine',
    description: 'Self-optimizing campaign automation',
    owner: 'autopilot-team',
    enabled: true,
    rolloutPercent: 25,
    planOverrides: { startup: false, midmarket: false, enterprise: true },
    environment: { production: true, sandbox: true },
    isKillSwitch: true,
  },
  'advanced-analytics': {
    key: 'advanced-analytics',
    name: 'Advanced Analytics Suite',
    description: 'Enhanced analytics with AI insights',
    owner: 'analytics-team',
    enabled: true,
    rolloutPercent: 100,
    planOverrides: { startup: false, midmarket: true, enterprise: true },
    environment: { production: true, sandbox: true },
    isKillSwitch: false,
  },
};

const MOCK_USAGE = {
  aiTokens: { used: 847000, limit: 1000000, trend: [65, 72, 78, 82, 85] },
  emailsSent: { used: 24500, limit: 50000, trend: [40, 45, 48, 49, 49] },
  contactsEnriched: { used: 3200, limit: 5000, trend: [50, 55, 60, 62, 64] },
  activeCampaigns: { used: 12, limit: 25, trend: [8, 9, 10, 11, 12] },
  seats: { used: 8, limit: 10, trend: [6, 7, 7, 8, 8] },
};

const MOCK_WORKSPACES = [
  { id: 'ws-1', name: 'NAMER', region: 'us-east-1', environment: 'production', isActive: true },
  { id: 'ws-2', name: 'EMEA', region: 'eu-west-1', environment: 'production', isActive: false },
  { id: 'ws-3', name: 'APAC', region: 'ap-southeast-1', environment: 'production', isActive: false },
  { id: 'ws-sandbox', name: 'Sandbox', region: 'us-east-1', environment: 'sandbox', isActive: false },
];

const MOCK_SECURITY_STATUS = {
  sso: { enabled: true, provider: 'Okta' },
  mfa: { enabled: true, adoptionPercent: 87 },
  scim: { enabled: true, lastSync: '2025-12-28T10:00:00Z' },
  dataResidency: { region: 'EU', compliant: true },
};

const MOCK_SYSTEM_STATUS = {
  maintenance: false,
  maintenanceMessage: null,
  services: {
    api: { status: 'healthy', latencyMs: 45, errorRate: 0.02 },
    ai: { status: 'healthy', latencyMs: 320, errorRate: 0.5 },
    email: { status: 'degraded', latencyMs: 150, errorRate: 2.1 },
    crm: { status: 'healthy', latencyMs: 89, errorRate: 0.1 },
    webhooks: { status: 'healthy', latencyMs: 23, errorRate: 0.05 },
  },
};

// ============================================================================
// RBAC HOOK
// ============================================================================

export function useRBAC() {
  const { plan, isAdmin } = useTenant();
  const [currentRole, setCurrentRole] = useState('admin'); // Mock - would come from auth
  const [loading, setLoading] = useState(false);

  const role = useMemo(() => MOCK_ROLES[currentRole] || MOCK_ROLES.readonly, [currentRole]);
  const roles = useMemo(() => Object.values(MOCK_ROLES), []);
  const scopes = RESOURCE_SCOPES;
  const capabilities = CAPABILITIES;

  // Check if user has permission
  const hasPermission = useCallback((resource, capability) => {
    if (!role) return false;
    if (role.permissions.includes('*')) return true;
    
    const fullPerm = `${resource}.${capability}`;
    const wildcardPerm = `${resource}.*`;
    
    return role.permissions.includes(fullPerm) || role.permissions.includes(wildcardPerm);
  }, [role]);

  // Check if user can access a resource
  const canAccess = useCallback((resource) => {
    return hasPermission(resource, 'read');
  }, [hasPermission]);

  // Get permission matrix for a role
  const getPermissionMatrix = useCallback((roleId) => {
    const targetRole = MOCK_ROLES[roleId];
    if (!targetRole) return {};

    const matrix = {};
    scopes.forEach(scope => {
      matrix[scope.id] = {};
      capabilities.forEach(cap => {
        if (targetRole.permissions.includes('*')) {
          matrix[scope.id][cap] = true;
        } else {
          const fullPerm = `${scope.id}.${cap}`;
          const wildcardPerm = `${scope.id}.*`;
          matrix[scope.id][cap] = targetRole.permissions.includes(fullPerm) || 
                                   targetRole.permissions.includes(wildcardPerm);
        }
      });
    });
    return matrix;
  }, [scopes, capabilities]);

  return {
    role,
    roles,
    scopes,
    capabilities,
    currentRole,
    setCurrentRole,
    hasPermission,
    canAccess,
    getPermissionMatrix,
    loading,
  };
}

// ============================================================================
// FEATURE FLAGS HOOK
// ============================================================================

export function useFeatureFlags() {
  const { plan } = useTenant();
  const [flags, setFlags] = useState(MOCK_FEATURE_FLAGS);
  const [environment, setEnvironment] = useState('production');

  // Check if a feature is enabled
  const isEnabled = useCallback((flagKey) => {
    const flag = flags[flagKey];
    if (!flag) return false;
    if (!flag.enabled) return false;
    
    // Check plan override
    if (flag.planOverrides && flag.planOverrides[plan] === false) return false;
    
    // Check environment
    if (flag.environment && flag.environment[environment] === false) return false;
    
    // Check rollout (simplified - would use user ID hash in real impl)
    if (flag.rolloutPercent < 100) {
      const hash = flagKey.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      if (hash % 100 >= flag.rolloutPercent) return false;
    }
    
    return true;
  }, [flags, plan, environment]);

  // Toggle a flag (for admin UI)
  const toggleFlag = useCallback((flagKey, enabled) => {
    setFlags(prev => ({
      ...prev,
      [flagKey]: { ...prev[flagKey], enabled },
    }));
  }, []);

  // Update rollout percentage
  const setRollout = useCallback((flagKey, percent) => {
    setFlags(prev => ({
      ...prev,
      [flagKey]: { ...prev[flagKey], rolloutPercent: percent },
    }));
  }, []);

  // Kill switch
  const killSwitch = useCallback((flagKey) => {
    setFlags(prev => ({
      ...prev,
      [flagKey]: { ...prev[flagKey], enabled: false, rolloutPercent: 0 },
    }));
  }, []);

  const flagList = useMemo(() => Object.values(flags), [flags]);
  const killSwitchFlags = useMemo(() => flagList.filter(f => f.isKillSwitch), [flagList]);

  return {
    flags,
    flagList,
    killSwitchFlags,
    isEnabled,
    toggleFlag,
    setRollout,
    killSwitch,
    environment,
    setEnvironment,
  };
}

// ============================================================================
// USAGE & QUOTAS HOOK
// ============================================================================

export function useUsageQuotas() {
  const { plan } = useTenant();
  const [usage, setUsage] = useState(MOCK_USAGE);
  const [loading, setLoading] = useState(false);

  // Calculate percentage used
  const getUsagePercent = useCallback((key) => {
    const item = usage[key];
    if (!item) return 0;
    return Math.round((item.used / item.limit) * 100);
  }, [usage]);

  // Check if near limit (80%+)
  const isNearLimit = useCallback((key) => {
    return getUsagePercent(key) >= 80;
  }, [getUsagePercent]);

  // Check if at limit
  const isAtLimit = useCallback((key) => {
    const item = usage[key];
    if (!item) return false;
    return item.used >= item.limit;
  }, [usage]);

  // Get all items near or at limit
  const warnings = useMemo(() => {
    return Object.entries(usage)
      .filter(([key]) => isNearLimit(key))
      .map(([key, value]) => ({
        key,
        ...value,
        percent: getUsagePercent(key),
        atLimit: isAtLimit(key),
      }));
  }, [usage, isNearLimit, getUsagePercent, isAtLimit]);

  // Refresh usage data
  const refresh = useCallback(async () => {
    setLoading(true);
    // TODO: API call
    await new Promise(r => setTimeout(r, 500));
    setLoading(false);
  }, []);

  return {
    usage,
    getUsagePercent,
    isNearLimit,
    isAtLimit,
    warnings,
    loading,
    refresh,
  };
}

// ============================================================================
// WORKSPACES HOOK
// ============================================================================

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState(MOCK_WORKSPACES);
  const [activeWorkspace, setActiveWorkspace] = useState(MOCK_WORKSPACES[0]);
  const [loading, setLoading] = useState(false);

  const switchWorkspace = useCallback((workspaceId) => {
    const ws = workspaces.find(w => w.id === workspaceId);
    if (ws) {
      setWorkspaces(prev => prev.map(w => ({ ...w, isActive: w.id === workspaceId })));
      setActiveWorkspace(ws);
    }
  }, [workspaces]);

  const productionWorkspaces = useMemo(
    () => workspaces.filter(w => w.environment === 'production'),
    [workspaces]
  );

  const sandboxWorkspaces = useMemo(
    () => workspaces.filter(w => w.environment === 'sandbox'),
    [workspaces]
  );

  return {
    workspaces,
    activeWorkspace,
    switchWorkspace,
    productionWorkspaces,
    sandboxWorkspaces,
    loading,
  };
}

// ============================================================================
// SECURITY STATUS HOOK
// ============================================================================

export function useSecurityStatus() {
  const [status, setStatus] = useState(MOCK_SECURITY_STATUS);
  const [loading, setLoading] = useState(false);

  const securityScore = useMemo(() => {
    let score = 0;
    if (status.sso.enabled) score += 30;
    if (status.mfa.enabled) score += 25;
    if (status.mfa.adoptionPercent >= 80) score += 15;
    if (status.scim.enabled) score += 15;
    if (status.dataResidency.compliant) score += 15;
    return score;
  }, [status]);

  const issues = useMemo(() => {
    const list = [];
    if (!status.sso.enabled) list.push({ type: 'warning', message: 'SSO not configured' });
    if (!status.mfa.enabled) list.push({ type: 'critical', message: 'MFA not enforced' });
    if (status.mfa.adoptionPercent < 80) list.push({ type: 'warning', message: `MFA adoption at ${status.mfa.adoptionPercent}%` });
    if (!status.scim.enabled) list.push({ type: 'info', message: 'SCIM provisioning not enabled' });
    return list;
  }, [status]);

  return {
    status,
    securityScore,
    issues,
    loading,
  };
}

// ============================================================================
// SYSTEM STATUS & MAINTENANCE HOOK
// ============================================================================

export function useSystemStatus() {
  const [status, setStatus] = useState(MOCK_SYSTEM_STATUS);
  const [loading, setLoading] = useState(false);

  const isMaintenanceMode = status.maintenance;
  const maintenanceMessage = status.maintenanceMessage;

  const overallHealth = useMemo(() => {
    const services = Object.values(status.services);
    const healthyCount = services.filter(s => s.status === 'healthy').length;
    if (healthyCount === services.length) return 'healthy';
    if (healthyCount >= services.length * 0.7) return 'degraded';
    return 'unhealthy';
  }, [status.services]);

  const serviceList = useMemo(() => {
    return Object.entries(status.services).map(([key, value]) => ({
      id: key,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      ...value,
    }));
  }, [status.services]);

  return {
    status,
    isMaintenanceMode,
    maintenanceMessage,
    overallHealth,
    serviceList,
    loading,
  };
}

// ============================================================================
// ENTERPRISE READINESS HOOK
// ============================================================================

export function useEnterpriseReadiness() {
  const { status: security, securityScore } = useSecurityStatus();
  const { usage, warnings } = useUsageQuotas();
  const { flagList } = useFeatureFlags();
  const { overallHealth } = useSystemStatus();

  const categories = useMemo(() => [
    {
      id: 'identity',
      name: 'Identity & Access',
      items: [
        { key: 'sso', label: 'SSO Configured', done: security.sso.enabled, link: '/settings/security' },
        { key: 'mfa', label: 'MFA Enforced', done: security.mfa.enabled && security.mfa.adoptionPercent >= 80, link: '/settings/security' },
        { key: 'scim', label: 'SCIM Provisioning', done: security.scim.enabled, link: '/settings/security' },
        { key: 'rbac', label: 'RBAC Configured', done: true, link: '/admin/access-control' },
      ],
    },
    {
      id: 'data',
      name: 'Data & Compliance',
      items: [
        { key: 'residency', label: 'Data Residency Set', done: security.dataResidency.compliant, link: '/settings/compliance' },
        { key: 'retention', label: 'Retention Policies', done: true, link: '/settings/compliance' },
        { key: 'export', label: 'Export Tested', done: false, link: '/settings/data-export' },
        { key: 'dlp', label: 'DLP Policies Defined', done: false, link: '/settings/ai-policies' },
      ],
    },
    {
      id: 'observability',
      name: 'Observability',
      items: [
        { key: 'alerting', label: 'Alerting Configured', done: true, link: '/admin/observability' },
        { key: 'health', label: 'Health Checks Enabled', done: overallHealth === 'healthy', link: '/admin/observability' },
        { key: 'logging', label: 'Audit Logging Active', done: true, link: '/admin/audit-log' },
        { key: 'slos', label: 'SLOs Defined', done: false, link: '/analytics' },
      ],
    },
    {
      id: 'usage',
      name: 'Usage & Plan',
      items: [
        { key: 'limits', label: 'Usage Limits Set', done: true, link: '/settings/usage' },
        { key: 'overages', label: 'Overage Handling', done: warnings.length === 0, link: '/settings/usage' },
        { key: 'billing', label: 'Billing Configured', done: true, link: '/settings/billing' },
      ],
    },
    {
      id: 'ai',
      name: 'AI Governance',
      items: [
        { key: 'policies', label: 'AI Policies Defined', done: false, link: '/settings/ai-policies' },
        { key: 'decisions', label: 'AI Decision Logging', done: true, link: '/admin/ai-decisions' },
        { key: 'killswitch', label: 'Kill Switches Ready', done: flagList.some(f => f.isKillSwitch), link: '/admin/feature-flags' },
      ],
    },
  ], [security, warnings, flagList, overallHealth]);

  const overallScore = useMemo(() => {
    const allItems = categories.flatMap(c => c.items);
    const doneCount = allItems.filter(i => i.done).length;
    return Math.round((doneCount / allItems.length) * 100);
  }, [categories]);

  const categoryScores = useMemo(() => {
    return categories.map(cat => ({
      ...cat,
      score: Math.round((cat.items.filter(i => i.done).length / cat.items.length) * 100),
    }));
  }, [categories]);

  return {
    categories: categoryScores,
    overallScore,
    securityScore,
  };
}

// ============================================================================
// COMBINED ENTERPRISE CONTEXT
// ============================================================================

const EnterpriseContext = createContext(null);

export function EnterpriseProvider({ children }) {
  const rbac = useRBAC();
  const featureFlags = useFeatureFlags();
  const usageQuotas = useUsageQuotas();
  const workspaces = useWorkspaces();
  const securityStatus = useSecurityStatus();
  const systemStatus = useSystemStatus();
  const readiness = useEnterpriseReadiness();

  const value = useMemo(() => ({
    ...rbac,
    ...featureFlags,
    ...usageQuotas,
    ...workspaces,
    security: securityStatus,
    system: systemStatus,
    readiness,
  }), [rbac, featureFlags, usageQuotas, workspaces, securityStatus, systemStatus, readiness]);

  return (
    <EnterpriseContext.Provider value={value}>
      {children}
    </EnterpriseContext.Provider>
  );
}

export function useEnterprise() {
  const context = useContext(EnterpriseContext);
  if (!context) {
    throw new Error('useEnterprise must be used within EnterpriseProvider');
  }
  return context;
}

export default useEnterprise;
