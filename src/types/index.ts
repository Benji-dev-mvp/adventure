// Core Application Types

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'viewer';
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  objective: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  targetAudience?: string;
  steps: CampaignStep[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CampaignStep {
  id: string;
  type: 'email' | 'linkedin' | 'call' | 'sms';
  subject?: string;
  content: string;
  delay: number;
  delayUnit: 'minutes' | 'hours' | 'days';
  order: number;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  title?: string;
  phone?: string;
  linkedin?: string;
  score?: number;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalLeads: number;
  activeCampaigns: number;
  emailsSent: number;
  responseRate: number;
  conversionRate: number;
  avgScore: number;
}

export interface AnalyticsData {
  labels: string[];
  datasets: AnalyticsDataset[];
}

export interface AnalyticsDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  tension?: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  category?: string;
}

export interface SearchFilters {
  query?: string;
  industry?: string[];
  location?: string[];
  companySize?: string[];
  jobTitle?: string[];
}

export interface AIGenerationRequest {
  prompt: string;
  tone: 'professional' | 'casual' | 'enthusiastic';
  context?: string;
  maxLength?: number;
}

export interface AIGenerationResponse {
  content: string;
  alternatives?: string[];
  confidence?: number;
}

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface StorageItem<T = any> {
  value: T;
  timestamp: number;
  expiresAt?: number;
}
