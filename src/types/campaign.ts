/**
 * Campaign Types
 * TypeScript type definitions for campaign-related entities
 */

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';
export type CampaignType = 'email' | 'linkedin' | 'sms' | 'call' | 'multichannel';
export type ChannelType = 'email' | 'linkedin' | 'sms' | 'call';

export interface CampaignStep {
  id: string;
  type: ChannelType | 'delay';
  order: number;
  subject?: string;
  content: string;
  delay?: number;
  delayUnit?: 'hours' | 'days';
  aiGenerated?: boolean;
  variants?: CampaignStepVariant[];
}

export interface CampaignStepVariant {
  id: string;
  name: string;
  subject?: string;
  content: string;
  weight: number; // A/B testing weight (0-100)
}

export interface CampaignMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  replied: number;
  meetings: number;
  bounced: number;
  unsubscribed: number;
  // Calculated rates
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  meetingRate: number;
}

export interface CampaignSchedule {
  timezone: string;
  sendDays: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  sendTimeStart: string; // HH:mm format
  sendTimeEnd: string;
  maxPerDay?: number;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  type: CampaignType;
  objective: string;
  
  // Steps & Content
  steps: CampaignStep[];
  
  // Targeting
  leadListId?: string;
  leadListName?: string;
  leadCount?: number;
  
  // Scheduling
  schedule?: CampaignSchedule;
  startDate?: string;
  endDate?: string;
  
  // Metrics
  metrics: CampaignMetrics;
  
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  launchedAt?: string;
  completedAt?: string;
  
  // Tags & Organization
  tags?: string[];
  folderId?: string;
}

export interface CampaignFilters {
  status?: CampaignStatus | CampaignStatus[];
  type?: CampaignType | CampaignType[];
  search?: string;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  createdBy?: string;
}

export interface CreateCampaignDTO {
  name: string;
  description?: string;
  type: CampaignType;
  objective: string;
  steps?: Omit<CampaignStep, 'id'>[];
  leadListId?: string;
  schedule?: CampaignSchedule;
  tags?: string[];
}

export interface UpdateCampaignDTO {
  name?: string;
  description?: string;
  type?: CampaignType;
  objective?: string;
  status?: CampaignStatus;
  steps?: CampaignStep[];
  leadListId?: string;
  schedule?: CampaignSchedule;
  tags?: string[];
}

export interface CampaignAnalytics {
  campaignId: string;
  period: 'day' | 'week' | 'month' | 'all';
  
  // Aggregate metrics
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalReplied: number;
  totalMeetings: number;
  
  // Time series data
  timeline: CampaignTimelinePoint[];
  
  // Step performance
  stepPerformance: CampaignStepPerformance[];
  
  // Top performing content
  topSubjectLines: { subject: string; openRate: number }[];
  topContentVariants: { variantId: string; replyRate: number }[];
}

export interface CampaignTimelinePoint {
  date: string;
  sent: number;
  opened: number;
  clicked: number;
  replied: number;
  meetings: number;
}

export interface CampaignStepPerformance {
  stepId: string;
  stepOrder: number;
  type: ChannelType | 'delay';
  sent: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  dropoffRate: number;
}

// Campaign template (for quick starts)
export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  type: CampaignType;
  category: string;
  steps: Omit<CampaignStep, 'id'>[];
  thumbnail?: string;
  usageCount: number;
  rating: number;
}
