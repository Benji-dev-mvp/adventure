/**
 * AI Collaboration Types
 * Types for copilot editor, compliance gates, and human-AI collaboration
 */

// ============================================
// AI Copilot Editor Types
// ============================================

export type EditorMode = 'compose' | 'edit' | 'review' | 'collaborate';
export type SuggestionType = 'rewrite' | 'expand' | 'shorten' | 'personalize' | 'tone_adjust' | 'cta' | 'subject_line';
export type ToneType = 'professional' | 'casual' | 'friendly' | 'urgent' | 'empathetic' | 'confident' | 'curious';

export interface EditorState {
  mode: EditorMode;
  content: EditorContent;
  suggestions: InlineSuggestion[];
  personalizationOverlays: PersonalizationOverlay[];
  toneSettings: ToneSettings;
  aiAssistant: AIAssistantState;
  history: EditorHistoryEntry[];
}

export interface EditorContent {
  subject: string;
  body: string;
  preheader?: string;
  signature?: string;
  variables: TemplateVariable[];
  selectedRange?: { start: number; end: number };
}

export interface TemplateVariable {
  id: string;
  name: string;
  placeholder: string;
  type: 'text' | 'date' | 'number' | 'url' | 'custom';
  fallback?: string;
  source: 'lead' | 'account' | 'campaign' | 'user' | 'custom';
  field?: string;
  transform?: 'uppercase' | 'lowercase' | 'titlecase' | 'truncate';
}

export interface InlineSuggestion {
  id: string;
  type: SuggestionType;
  originalText: string;
  suggestedText: string;
  range: { start: number; end: number };
  reasoning: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  isApplied: boolean;
  isDismissed: boolean;
}

export interface PersonalizationOverlay {
  id: string;
  variableId: string;
  range: { start: number; end: number };
  previewValue: string;
  alternatives: string[];
  dataSource: string;
  confidence: number;
}

export interface ToneSettings {
  primary: ToneType;
  intensity: number; // 0-100
  formality: number; // 0-100 (casual to formal)
  urgency: number; // 0-100
  personalization: number; // 0-100
  customAttributes: Record<string, number>;
}

export interface AIAssistantState {
  isActive: boolean;
  isTyping: boolean;
  lastQuery?: string;
  lastResponse?: string;
  suggestions: AISuggestion[];
  context: AIContext;
}

export interface AISuggestion {
  id: string;
  type: 'action' | 'content' | 'insight' | 'warning';
  title: string;
  description: string;
  action?: () => void;
  preview?: string;
}

export interface AIContext {
  leadData?: Record<string, any>;
  accountData?: Record<string, any>;
  campaignData?: Record<string, any>;
  previousEmails?: EmailHistoryItem[];
  industryContext?: string;
  competitorMentions?: string[];
}

export interface EmailHistoryItem {
  subject: string;
  snippet: string;
  sentAt: Date;
  outcome: 'opened' | 'clicked' | 'replied' | 'no_response';
}

export interface EditorHistoryEntry {
  id: string;
  timestamp: Date;
  action: 'edit' | 'ai_suggestion_applied' | 'tone_change' | 'variable_added' | 'undo' | 'redo';
  beforeContent: string;
  afterContent: string;
  description: string;
}

// ============================================
// Smart Rewrite Block Types
// ============================================

export interface RewriteBlock {
  id: string;
  range: { start: number; end: number };
  originalText: string;
  options: RewriteOption[];
  selectedOption?: string;
  isExpanded: boolean;
}

export interface RewriteOption {
  id: string;
  text: string;
  label: string;
  description: string;
  tone: ToneType;
  metrics: {
    readabilityScore: number;
    personalizationScore: number;
    predictedEngagement: number;
  };
}

// ============================================
// Compliance Gate Types
// ============================================

export type ComplianceStatus = 'passed' | 'warning' | 'failed' | 'pending';
export type RiskLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';
export type ComplianceCategory = 'legal' | 'brand' | 'accuracy' | 'tone' | 'privacy' | 'spam';

export interface ComplianceGate {
  id: string;
  campaignId: string;
  status: ComplianceStatus;
  overallRiskLevel: RiskLevel;
  checks: ComplianceCheck[];
  summary: ComplianceSummary;
  reviewedBy?: string;
  reviewedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
}

export interface ComplianceCheck {
  id: string;
  category: ComplianceCategory;
  name: string;
  description: string;
  status: ComplianceStatus;
  riskLevel: RiskLevel;
  findings: ComplianceFinding[];
  autoFixAvailable: boolean;
  autoFix?: () => void;
}

export interface ComplianceFinding {
  id: string;
  type: 'issue' | 'warning' | 'suggestion';
  severity: RiskLevel;
  title: string;
  description: string;
  location?: { start: number; end: number };
  originalText?: string;
  suggestedText?: string;
  regulation?: string;
  isResolved: boolean;
  resolvedBy?: 'auto' | 'manual';
}

export interface ComplianceSummary {
  totalChecks: number;
  passed: number;
  warnings: number;
  failed: number;
  criticalIssues: number;
  estimatedRisk: RiskLevel;
  recommendation: 'approve' | 'review' | 'reject';
  confidenceScore: number;
}

// ============================================
// Brand Voice Types
// ============================================

export interface BrandVoice {
  id: string;
  name: string;
  description: string;
  guidelines: BrandGuideline[];
  vocabulary: BrandVocabulary;
  examples: BrandExample[];
  isDefault: boolean;
}

export interface BrandGuideline {
  id: string;
  category: 'tone' | 'language' | 'formatting' | 'messaging';
  rule: string;
  examples: { good: string; bad: string }[];
  severity: 'required' | 'recommended' | 'optional';
}

export interface BrandVocabulary {
  preferredTerms: { term: string; instead: string[] }[];
  bannedWords: string[];
  industryTerms: string[];
  competitorMentions: { allowed: boolean; alternatives: string[] };
}

export interface BrandExample {
  id: string;
  type: 'email' | 'linkedin' | 'sms';
  context: string;
  content: string;
  annotations: string[];
}

// ============================================
// Review Workflow Types
// ============================================

export type ReviewStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'changes_requested';

export interface ReviewRequest {
  id: string;
  campaignId: string;
  requestedBy: string;
  requestedAt: Date;
  status: ReviewStatus;
  reviewers: Reviewer[];
  complianceGate: ComplianceGate;
  comments: ReviewComment[];
  deadline?: Date;
}

export interface Reviewer {
  id: string;
  userId: string;
  name: string;
  role: 'compliance' | 'legal' | 'brand' | 'manager' | 'peer';
  status: 'pending' | 'approved' | 'rejected' | 'abstained';
  reviewedAt?: Date;
  comments?: string;
}

export interface ReviewComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: Date;
  location?: { start: number; end: number };
  isResolved: boolean;
  replies: ReviewComment[];
}
