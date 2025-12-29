/**
 * User Types
 * TypeScript type definitions for user-related entities
 */

export type UserRole = 'user' | 'admin' | 'super_admin';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string; // Full name (derived)
  avatar?: string;

  // Role & Permissions
  role: UserRole;
  permissions: string[];

  // Organization
  organizationId: string;
  organizationName?: string;
  teamId?: string;
  teamName?: string;

  // Status
  status: UserStatus;
  emailVerified: boolean;

  // Preferences
  preferences: UserPreferences;

  // Usage Stats
  stats?: UserStats;

  // Metadata
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  lastActivityAt?: string;
}

export interface UserPreferences {
  // Appearance
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
  sidebarCollapsed: boolean;

  // Notifications
  emailNotifications: boolean;
  browserNotifications: boolean;
  digestFrequency: 'daily' | 'weekly' | 'never';

  // Email Settings
  emailSignature?: string;
  defaultFromName?: string;

  // Calendar & Scheduling
  timezone: string;
  workingHoursStart: string;
  workingHoursEnd: string;
  workingDays: number[]; // 0 = Sunday, 1 = Monday, etc.

  // Keyboard Shortcuts
  keyboardShortcutsEnabled: boolean;

  // Dashboard Customization
  dashboardLayout?: DashboardWidgetConfig[];
}

export interface DashboardWidgetConfig {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config?: Record<string, unknown>;
}

export interface UserStats {
  totalLeads: number;
  totalCampaigns: number;
  emailsSent: number;
  emailsOpened: number;
  meetingsBooked: number;
  activeSequences: number;
}

export interface UserSession {
  id: string;
  userId: string;
  device: string;
  browser: string;
  ip: string;
  location?: string;
  createdAt: string;
  lastActiveAt: string;
  isCurrent: boolean;
}

// Permission constants
export const PERMISSIONS = {
  // Lead permissions
  LEADS_VIEW: 'leads:view',
  LEADS_CREATE: 'leads:create',
  LEADS_EDIT: 'leads:edit',
  LEADS_DELETE: 'leads:delete',
  LEADS_EXPORT: 'leads:export',
  LEADS_IMPORT: 'leads:import',

  // Campaign permissions
  CAMPAIGNS_VIEW: 'campaigns:view',
  CAMPAIGNS_CREATE: 'campaigns:create',
  CAMPAIGNS_EDIT: 'campaigns:edit',
  CAMPAIGNS_DELETE: 'campaigns:delete',
  CAMPAIGNS_LAUNCH: 'campaigns:launch',

  // Analytics permissions
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',

  // Integration permissions
  INTEGRATIONS_VIEW: 'integrations:view',
  INTEGRATIONS_MANAGE: 'integrations:manage',

  // Admin permissions
  ADMIN_USERS: 'admin:users',
  ADMIN_BILLING: 'admin:billing',
  ADMIN_SETTINGS: 'admin:settings',
  ADMIN_API_KEYS: 'admin:api-keys',
  ADMIN_AUDIT_LOG: 'admin:audit-log',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Role-permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  user: [
    PERMISSIONS.LEADS_VIEW,
    PERMISSIONS.LEADS_CREATE,
    PERMISSIONS.LEADS_EDIT,
    PERMISSIONS.CAMPAIGNS_VIEW,
    PERMISSIONS.CAMPAIGNS_CREATE,
    PERMISSIONS.CAMPAIGNS_EDIT,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.INTEGRATIONS_VIEW,
  ],
  admin: [
    ...Object.values(PERMISSIONS).filter(
      p => !p.startsWith('admin:') || p === PERMISSIONS.ADMIN_USERS
    ),
  ],
  super_admin: Object.values(PERMISSIONS),
};

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
  inviteCode?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
}

// Organization types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;

  // Plan & Billing
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  billingEmail?: string;

  // Limits
  maxUsers: number;
  maxLeads: number;
  maxEmailsPerMonth: number;

  // Usage
  currentUsers: number;
  currentLeads: number;
  emailsSentThisMonth: number;

  // Settings
  settings: OrganizationSettings;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationSettings {
  // Email Settings
  sendingDomain?: string;
  trackingDomain?: string;
  defaultFromEmail?: string;
  defaultFromName?: string;

  // Compliance
  gdprCompliant: boolean;
  dataRetentionDays: number;

  // Security
  mfaRequired: boolean;
  ssoEnabled: boolean;
  ssoProvider?: 'google' | 'okta' | 'azure';

  // Integrations
  crmIntegration?: 'salesforce' | 'hubspot' | 'pipedrive';
  slackEnabled: boolean;
}

export interface Team {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  leaderId?: string;
  memberCount: number;
  createdAt: string;
}

export interface TeamMember {
  userId: string;
  teamId: string;
  role: 'member' | 'lead' | 'manager';
  joinedAt: string;
}
