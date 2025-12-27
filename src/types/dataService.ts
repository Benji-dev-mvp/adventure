export interface Lead {
  id: number;
  name: string;
  title: string;
  company: string;
  industry: string;
  location: string;
  score: number;
  status: 'hot' | 'warm' | 'cold';
  email: string;
  phone?: string;
  linkedin?: string;
  lastContact: string;
  avatar: string;
  verified?: boolean;
  source?: string;
  enrichment?: LeadEnrichment;
  activity?: LeadActivity[];
}

export interface LeadEnrichment {
  companySize?: string;
  revenue?: string;
  techStack?: string[];
  recentNews?: string;
}

export interface LeadActivity {
  type: 'email_opened' | 'email_sent' | 'email_replied' | 'link_clicked' | 'meeting_booked';
  message: string;
  time: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft' | 'completed';
  leads: number;
  sent: number;
  replies: number;
  replyRate: number;
  steps: CampaignStep[];
}

export interface CampaignStep {
  id: string;
  type: 'email' | 'linkedin' | 'call' | 'sms';
  delay: number;
  subject?: string;
  content: string;
}

export interface SavedPrompt {
  id: string;
  title: string;
  prompt: string;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

export interface AIRecommendation {
  title: string;
  impact: string;
  confidence: number;
  reason: string;
  actionLabel: string;
  id: string;
}

export interface AppState {
  activeCRM: string;
  integrationsConnected: string[];
  savedPrompts: SavedPrompt[];
  leads: Lead[];
  campaigns: Campaign[];
  aiMessages: AIMessage[];
}

export interface ImportResult {
  ok: boolean;
  importedCount: number;
}

export interface ActionResult {
  ok: boolean;
  applied?: any;
  updated?: any;
  scheduled?: any;
  sent?: any;
}

export interface AIScoreResult {
  score: number;
  tier: string;
  rationale: string;
}

export interface AIEmailResult {
  subject: string;
  body: string;
  tone: string;
  length: string;
}

export interface SourceSummary {
  source: string;
  total: number;
  verified: number;
}
