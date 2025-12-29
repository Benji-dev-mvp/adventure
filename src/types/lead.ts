/**
 * Lead Types
 * TypeScript type definitions for lead-related entities
 */

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'engaged'
  | 'qualified'
  | 'hot'
  | 'warm'
  | 'cold'
  | 'converted'
  | 'lost'
  | 'unsubscribed';

export type LeadSource =
  | 'manual'
  | 'import'
  | 'linkedin'
  | 'website'
  | 'referral'
  | 'event'
  | 'apollo'
  | 'zoominfo'
  | 'clearbit'
  | 'enrichment'
  | 'api';

export interface Lead {
  id: string;

  // Basic Info
  firstName: string;
  lastName: string;
  name: string; // Full name (derived)
  email: string;
  phone?: string;
  mobile?: string;

  // Professional Info
  title: string;
  company: string;
  department?: string;
  seniority?: 'entry' | 'mid' | 'senior' | 'director' | 'vp' | 'c-level';

  // Location
  city?: string;
  state?: string;
  country?: string;
  timezone?: string;

  // Social Profiles
  linkedinUrl?: string;
  twitterHandle?: string;
  websiteUrl?: string;

  // Scoring & Status
  score: number;
  status: LeadStatus;

  // Engagement
  lastContactDate?: string;
  lastActivityDate?: string;
  totalEmails?: number;
  emailsOpened?: number;
  emailsClicked?: number;
  emailsReplied?: number;

  // Source & Attribution
  source: LeadSource;
  sourceDetails?: string;
  campaignId?: string;

  // Enrichment Data
  enrichment?: LeadEnrichment;

  // Organization
  tags: string[];
  listIds?: string[];
  ownerId?: string;
  ownerName?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;

  // Custom Fields
  customFields?: Record<string, string | number | boolean>;
}

export interface LeadEnrichment {
  // Company Data
  companySize?: string;
  companyRevenue?: string;
  companyIndustry?: string;
  companyDescription?: string;
  companyFounded?: number;
  companyLinkedinUrl?: string;
  companyWebsite?: string;

  // Tech Stack
  techStack?: string[];

  // Funding & News
  fundingStage?: string;
  fundingTotal?: string;
  recentNews?: LeadNewsItem[];

  // Social Data
  linkedinFollowers?: number;
  twitterFollowers?: number;

  // Contact Details
  directPhone?: string;
  verifiedEmail?: boolean;
  emailConfidence?: number;

  // Additional Data
  bio?: string;
  skills?: string[];
  education?: string;

  // Enrichment Metadata
  enrichedAt?: string;
  enrichmentProvider?: string;
}

export interface LeadNewsItem {
  title: string;
  url: string;
  date: string;
  source: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: LeadActivityType;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  createdBy?: string;
}

export type LeadActivityType =
  | 'email_sent'
  | 'email_opened'
  | 'email_clicked'
  | 'email_replied'
  | 'email_bounced'
  | 'linkedin_connection_sent'
  | 'linkedin_connection_accepted'
  | 'linkedin_message_sent'
  | 'linkedin_message_replied'
  | 'call_made'
  | 'call_connected'
  | 'call_voicemail'
  | 'meeting_scheduled'
  | 'meeting_completed'
  | 'meeting_cancelled'
  | 'note_added'
  | 'status_changed'
  | 'score_updated'
  | 'tag_added'
  | 'tag_removed'
  | 'enriched'
  | 'imported'
  | 'exported';

export interface LeadFilters {
  status?: LeadStatus | LeadStatus[];
  source?: LeadSource | LeadSource[];
  scoreMin?: number;
  scoreMax?: number;
  industry?: string;
  companySize?: string;
  location?: string;
  tags?: string[];
  listId?: string;
  ownerId?: string;
  search?: string;
  hasEmail?: boolean;
  hasPhone?: boolean;
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
}

export interface LeadList {
  id: string;
  name: string;
  description?: string;
  type: 'static' | 'dynamic';
  filters?: LeadFilters; // For dynamic lists
  leadCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CreateLeadDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title: string;
  company: string;
  source?: LeadSource;
  tags?: string[];
  customFields?: Record<string, string | number | boolean>;
}

export interface UpdateLeadDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  title?: string;
  company?: string;
  department?: string;
  city?: string;
  state?: string;
  country?: string;
  linkedinUrl?: string;
  twitterHandle?: string;
  status?: LeadStatus;
  score?: number;
  tags?: string[];
  ownerId?: string;
  customFields?: Record<string, string | number | boolean>;
}

export interface BulkLeadAction {
  action: 'update_status' | 'add_tags' | 'remove_tags' | 'assign' | 'delete' | 'export' | 'enrich';
  leadIds: string[];
  data?: {
    status?: LeadStatus;
    tags?: string[];
    ownerId?: string;
    format?: 'csv' | 'xlsx';
  };
}

export interface LeadImportResult {
  total: number;
  imported: number;
  updated: number;
  skipped: number;
  errors: { row: number; error: string }[];
}
