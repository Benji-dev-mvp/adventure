/**
 * Campaign Type Definitions
 */

export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'archived';

export type CampaignChannel = 'email' | 'linkedin' | 'sms' | 'phone' | 'multichannel';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  channel: CampaignChannel;
  targetAudience?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  owner?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignMetrics {
  id: string;
  campaignId: string;
  totalLeads: number;
  contacted: number;
  opened: number;
  clicked: number;
  replied: number;
  converted: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  conversionRate: number;
  revenue?: number;
  roi?: number;
}

export interface CreateCampaignDTO {
  name: string;
  description?: string;
  channel: CampaignChannel;
  targetAudience?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  settings?: CampaignSettings;
}

export interface UpdateCampaignDTO extends Partial<CreateCampaignDTO> {
  status?: CampaignStatus;
}

export interface CampaignSettings {
  sendingSchedule?: {
    days?: string[];
    timeZone?: string;
    startTime?: string;
    endTime?: string;
  };
  messaging?: {
    subject?: string;
    template?: string;
    variables?: Record<string, any>;
  };
  limits?: {
    maxPerDay?: number;
    maxPerHour?: number;
  };
}

export interface CampaignAnalytics {
  campaignId: string;
  period: string;
  metrics: {
    date: string;
    sent: number;
    opened: number;
    clicked: number;
    replied: number;
    converted: number;
  }[];
  summary: CampaignMetrics;
}
