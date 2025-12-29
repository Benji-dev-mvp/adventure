/**
 * Marketplace & Extensibility Types
 * Types for playbook marketplace, templates, integrations SDK, and AI agent plugins
 */

// ============================================
// Marketplace Core Types
// ============================================

export type ExtensionType =
  | 'playbook'
  | 'template'
  | 'integration'
  | 'ai_agent'
  | 'workflow'
  | 'theme';
export type ExtensionStatus = 'draft' | 'pending_review' | 'published' | 'deprecated' | 'removed';
export type InstallStatus =
  | 'not_installed'
  | 'installing'
  | 'installed'
  | 'update_available'
  | 'uninstalling';

export interface Extension {
  id: string;
  type: ExtensionType;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  version: string;
  author: ExtensionAuthor;
  icon: string;
  screenshots: string[];
  video?: string;
  category: string;
  tags: string[];
  status: ExtensionStatus;
  pricing: ExtensionPricing;
  stats: ExtensionStats;
  compatibility: ExtensionCompatibility;
  permissions: ExtensionPermission[];
  changelog: ChangelogEntry[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface ExtensionAuthor {
  id: string;
  name: string;
  avatar?: string;
  verified: boolean;
  website?: string;
  supportEmail?: string;
  extensions: number;
  totalInstalls: number;
}

export interface ExtensionPricing {
  type: 'free' | 'paid' | 'freemium' | 'subscription';
  price?: number;
  currency?: string;
  billingPeriod?: 'monthly' | 'yearly' | 'one_time';
  trialDays?: number;
  tiers?: PricingTier[];
}

export interface PricingTier {
  name: string;
  price: number;
  features: string[];
  limits?: Record<string, number>;
}

export interface ExtensionStats {
  installs: number;
  activeInstalls: number;
  rating: number;
  reviewCount: number;
  weeklyDownloads: number;
  trendingScore: number;
}

export interface ExtensionCompatibility {
  minVersion: string;
  maxVersion?: string;
  platforms: ('web' | 'desktop' | 'mobile')[];
  integrations: string[];
}

export interface ExtensionPermission {
  scope: 'read' | 'write' | 'execute';
  resource: string;
  description: string;
  required: boolean;
}

export interface ChangelogEntry {
  version: string;
  date: Date;
  changes: string[];
  breaking?: boolean;
}

// ============================================
// Playbook Marketplace Types
// ============================================

export interface Playbook extends Extension {
  type: 'playbook';
  playbookConfig: PlaybookConfig;
}

export interface PlaybookConfig {
  targetAudience: string;
  estimatedResults: PlaybookResults;
  steps: PlaybookStep[];
  customizations: PlaybookCustomization[];
  bestPractices: string[];
  warnings: string[];
}

export interface PlaybookResults {
  meetings: { min: number; max: number };
  responseRate: { min: number; max: number };
  timeToResult: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface PlaybookStep {
  id: string;
  name: string;
  description: string;
  type: 'action' | 'wait' | 'condition' | 'template';
  config: Record<string, any>;
  order: number;
}

export interface PlaybookCustomization {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'number' | 'select' | 'toggle';
  default: any;
  options?: { value: any; label: string }[];
}

// ============================================
// Template Marketplace Types
// ============================================

export interface Template extends Extension {
  type: 'template';
  templateConfig: TemplateConfig;
}

export interface TemplateConfig {
  channel: 'email' | 'linkedin' | 'sms' | 'phone_script';
  industry?: string[];
  persona?: string[];
  useCase: string;
  content: TemplateContent;
  variables: TemplateVariable[];
  variants: TemplateVariant[];
  performance?: TemplatePerformance;
}

export interface TemplateContent {
  subject?: string;
  body: string;
  preheader?: string;
  callToAction?: string;
}

export interface TemplateVariable {
  name: string;
  description: string;
  type: 'text' | 'rich_text' | 'date' | 'number' | 'list';
  required: boolean;
  default?: string;
  examples: string[];
}

export interface TemplateVariant {
  id: string;
  name: string;
  description: string;
  content: TemplateContent;
  performance?: TemplatePerformance;
}

export interface TemplatePerformance {
  openRate: number;
  replyRate: number;
  meetingRate: number;
  sampleSize: number;
  lastUpdated: Date;
}

// ============================================
// Integration SDK Types
// ============================================

export interface Integration extends Extension {
  type: 'integration';
  integrationConfig: IntegrationConfig;
}

export interface IntegrationConfig {
  category: 'crm' | 'enrichment' | 'communication' | 'analytics' | 'automation' | 'other';
  authType: 'oauth2' | 'api_key' | 'basic' | 'custom';
  endpoints: IntegrationEndpoint[];
  webhooks: IntegrationWebhook[];
  sync: IntegrationSync;
  fieldMappings: FieldMapping[];
}

export interface IntegrationEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  parameters: EndpointParameter[];
  response: ResponseSchema;
}

export interface EndpointParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  description: string;
  default?: any;
}

export interface ResponseSchema {
  type: string;
  properties: Record<string, any>;
  example: any;
}

export interface IntegrationWebhook {
  id: string;
  name: string;
  event: string;
  description: string;
  payload: ResponseSchema;
}

export interface IntegrationSync {
  direction: 'inbound' | 'outbound' | 'bidirectional';
  frequency: 'realtime' | 'hourly' | 'daily' | 'manual';
  objects: SyncObject[];
}

export interface SyncObject {
  name: string;
  sourceObject: string;
  targetObject: string;
  fieldMappings: FieldMapping[];
  filters?: Record<string, any>;
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transform?: 'none' | 'uppercase' | 'lowercase' | 'date_format' | 'custom';
  transformConfig?: Record<string, any>;
}

// ============================================
// AI Agent Plugin Types
// ============================================

export interface AIAgentPlugin extends Extension {
  type: 'ai_agent';
  agentConfig: AIAgentConfig;
}

export interface AIAgentConfig {
  baseAgent: 'ava' | 'scout' | 'strategist' | 'analyst' | 'compliance' | 'custom';
  capabilities: PluginCapability[];
  prompts: AgentPrompt[];
  actions: PluginAction[];
  models: ModelConfig[];
  training: TrainingConfig;
}

export interface PluginCapability {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  examples: string[];
}

export interface AgentPrompt {
  id: string;
  name: string;
  template: string;
  variables: string[];
  context: string[];
}

export interface PluginAction {
  id: string;
  name: string;
  description: string;
  handler: string;
  parameters: ActionParameter[];
  returns: ResponseSchema;
}

export interface ActionParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  validation?: Record<string, any>;
}

export interface ModelConfig {
  provider: 'openai' | 'anthropic' | 'custom';
  model: string;
  temperature: number;
  maxTokens: number;
  customEndpoint?: string;
}

export interface TrainingConfig {
  dataRequired: string[];
  finetuning: boolean;
  rlhf: boolean;
  evaluationMetrics: string[];
}

// ============================================
// Installation & Management Types
// ============================================

export interface InstalledExtension {
  extensionId: string;
  extension: Extension;
  installStatus: InstallStatus;
  installedAt: Date;
  installedBy: string;
  version: string;
  config: Record<string, any>;
  enabled: boolean;
  usage: ExtensionUsage;
}

export interface ExtensionUsage {
  lastUsed: Date;
  usageCount: number;
  successRate: number;
  errors: ExtensionError[];
}

export interface ExtensionError {
  id: string;
  timestamp: Date;
  type: string;
  message: string;
  stack?: string;
  resolved: boolean;
}

export interface ExtensionReview {
  id: string;
  extensionId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  helpful: number;
  version: string;
  createdAt: Date;
  updatedAt?: Date;
  response?: {
    authorId: string;
    body: string;
    createdAt: Date;
  };
}

// ============================================
// Marketplace Discovery Types
// ============================================

export interface MarketplaceFilters {
  type?: ExtensionType[];
  category?: string[];
  pricing?: ('free' | 'paid')[];
  rating?: number;
  sortBy?: 'popular' | 'recent' | 'rating' | 'trending';
  search?: string;
}

export interface MarketplaceFeatured {
  spotlight: Extension;
  trending: Extension[];
  new: Extension[];
  topRated: Extension[];
  recommended: Extension[];
  collections: MarketplaceCollection[];
}

export interface MarketplaceCollection {
  id: string;
  name: string;
  description: string;
  image: string;
  extensions: Extension[];
  curator: string;
}
