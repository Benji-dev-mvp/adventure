/**
 * Lead Type Definitions
 */

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost' | 'archived';

export type LeadSource = 'manual' | 'import' | 'api' | 'enrichment' | 'campaign';

export interface Lead {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  status: LeadStatus;
  source: LeadSource;
  score?: number;
  tags?: string[];
  customFields?: Record<string, any>;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
}

export interface LeadScore {
  leadId: string;
  score: number;
  factors: {
    engagement: number;
    demographic: number;
    firmographic: number;
    behavioral: number;
  };
  confidence: number;
  updatedAt: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: 'email_sent' | 'email_opened' | 'email_clicked' | 'email_replied' | 'call' | 'meeting' | 'note' | 'status_change';
  description: string;
  metadata?: Record<string, any>;
  performedBy?: string;
  timestamp: string;
}

export interface CreateLeadDTO {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  source?: LeadSource;
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface UpdateLeadDTO extends Partial<CreateLeadDTO> {
  status?: LeadStatus;
  score?: number;
  assignedTo?: string;
}

export interface LeadEnrichmentData {
  leadId: string;
  enrichedFields: {
    company?: {
      name: string;
      domain: string;
      industry: string;
      size: string;
      revenue?: string;
      location?: string;
    };
    person?: {
      title: string;
      seniority: string;
      department: string;
      skills?: string[];
      socialProfiles?: {
        linkedin?: string;
        twitter?: string;
      };
    };
  };
  confidence: number;
  source: string;
  enrichedAt: string;
}
