/**
 * Enterprise Control Plane Types
 * Types for RBAC, audit replay, and enterprise governance
 */

// ============================================
// Zero-Trust Access Control Types
// ============================================

export type ResourceType = 
  | 'campaign'
  | 'lead'
  | 'template'
  | 'workflow'
  | 'integration'
  | 'report'
  | 'settings'
  | 'team'
  | 'billing'
  | 'api_key'
  | 'audit_log'
  | 'ai_agent';

export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'execute' | 'approve' | 'export';
export type PermissionScope = 'own' | 'team' | 'organization' | 'global';

export interface Permission {
  id: string;
  resource: ResourceType;
  action: PermissionAction;
  scope: PermissionScope;
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'in' | 'not_in' | 'contains';
  value: any;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  userCount: number;
}

export interface AccessControlMatrix {
  roles: Role[];
  resources: ResourceType[];
  actions: PermissionAction[];
  matrix: AccessMatrixCell[][];
}

export interface AccessMatrixCell {
  roleId: string;
  resource: ResourceType;
  action: PermissionAction;
  allowed: boolean;
  scope: PermissionScope;
  conditions?: PermissionCondition[];
  isInherited: boolean;
  inheritedFrom?: string;
}

// ============================================
// User & Team Access Types
// ============================================

export interface UserAccess {
  userId: string;
  userName: string;
  email: string;
  roles: string[];
  directPermissions: Permission[];
  effectivePermissions: Permission[];
  teamMemberships: TeamMembership[];
  lastAccess: Date;
  accessHistory: AccessHistoryEntry[];
}

export interface TeamMembership {
  teamId: string;
  teamName: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: Date;
}

export interface AccessHistoryEntry {
  id: string;
  timestamp: Date;
  action: PermissionAction;
  resource: ResourceType;
  resourceId: string;
  result: 'allowed' | 'denied';
  ipAddress: string;
  userAgent: string;
}

// ============================================
// Resource Scope Types
// ============================================

export interface ResourceScope {
  id: string;
  name: string;
  type: 'team' | 'project' | 'campaign' | 'custom';
  resources: ScopedResource[];
  members: ScopeMember[];
  parentScope?: string;
  createdAt: Date;
}

export interface ScopedResource {
  resourceType: ResourceType;
  resourceId: string;
  resourceName: string;
  addedAt: Date;
  addedBy: string;
}

export interface ScopeMember {
  userId: string;
  userName: string;
  roleInScope: string;
  addedAt: Date;
}

// ============================================
// Audit Replay Types
// ============================================

export type AuditEventType = 
  | 'create'
  | 'update'
  | 'delete'
  | 'access'
  | 'execute'
  | 'login'
  | 'logout'
  | 'permission_change'
  | 'export'
  | 'import'
  | 'ai_action'
  | 'system_event';

export interface AuditEvent {
  id: string;
  timestamp: Date;
  eventType: AuditEventType;
  actorId: string;
  actorName: string;
  actorType: 'user' | 'system' | 'ai_agent' | 'integration';
  resourceType: ResourceType;
  resourceId: string;
  resourceName: string;
  action: string;
  description: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  metadata: AuditMetadata;
  isReplayable: boolean;
}

export interface AuditMetadata {
  ipAddress?: string;
  userAgent?: string;
  location?: { city: string; country: string };
  sessionId?: string;
  requestId?: string;
  correlationId?: string;
  duration?: number;
  tags?: string[];
}

export interface AuditReplaySession {
  id: string;
  name: string;
  events: AuditEvent[];
  startTime: Date;
  endTime: Date;
  playbackSpeed: number;
  currentEventIndex: number;
  isPlaying: boolean;
  isPaused: boolean;
  filters: AuditReplayFilters;
}

export interface AuditReplayFilters {
  eventTypes?: AuditEventType[];
  actors?: string[];
  resources?: ResourceType[];
  dateRange?: { start: Date; end: Date };
  searchQuery?: string;
}

export interface ReplayVisualization {
  type: 'timeline' | 'sequence' | 'graph' | 'diff';
  events: AuditEvent[];
  annotations: ReplayAnnotation[];
  highlights: ReplayHighlight[];
}

export interface ReplayAnnotation {
  eventId: string;
  text: string;
  type: 'info' | 'warning' | 'insight';
  position: { x: number; y: number };
}

export interface ReplayHighlight {
  eventId: string;
  color: string;
  label: string;
  reason: string;
}

// ============================================
// Security & Governance Types
// ============================================

export interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  type: 'access' | 'data' | 'compliance' | 'operational';
  rules: PolicyRule[];
  isActive: boolean;
  enforcement: 'block' | 'warn' | 'log';
  createdAt: Date;
  updatedAt: Date;
}

export interface PolicyRule {
  id: string;
  condition: string;
  action: 'allow' | 'deny' | 'require_approval' | 'notify';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface GovernanceReport {
  id: string;
  period: { start: Date; end: Date };
  accessSummary: AccessSummary;
  policyViolations: PolicyViolation[];
  riskAssessment: RiskAssessment;
  recommendations: GovernanceRecommendation[];
  generatedAt: Date;
}

export interface AccessSummary {
  totalUsers: number;
  activeUsers: number;
  totalAccesses: number;
  deniedAccesses: number;
  unusualPatterns: number;
  topResources: { resource: string; count: number }[];
}

export interface PolicyViolation {
  id: string;
  policyId: string;
  policyName: string;
  timestamp: Date;
  actor: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  resolution?: string;
}

export interface RiskAssessment {
  overallScore: number; // 0-100
  categories: {
    accessControl: number;
    dataProtection: number;
    compliance: number;
    operational: number;
  };
  trends: { date: Date; score: number }[];
  topRisks: { description: string; score: number; mitigation: string }[];
}

export interface GovernanceRecommendation {
  id: string;
  category: 'access' | 'policy' | 'monitoring' | 'training';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}
