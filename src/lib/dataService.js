import { storage } from './storage';

// Default API base: use env override if provided, else local backend on 8000
const API_BASE = import.meta?.env?.VITE_API_URL || 'http://localhost:8000/api';

const request = async (path, options = {}) => {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Request failed ${res.status}: ${body}`);
  }
  return res.json();
};

const STORAGE_KEY = 'app_state_v1';
const TRUSTED_SOURCES = [
  'Postgres', 'MySQL', 'MariaDB', 'Oracle', 'SQL Server', 'SQLite', 'CockroachDB',
  'Snowflake', 'BigQuery', 'Redshift', 'Teradata', 'Trino', 'Presto', 'Druid', 'ClickHouse',
  'Databricks', 'Elastic', 'Supabase',
  'MongoDB', 'DynamoDB', 'Firestore',
  'Airbyte', 'Fivetran', 'Hevo', 'Segment', 'RudderStack',
  'Salesforce', 'HubSpot', 'Pipedrive', 'Copper', 'Zoho', 'Close', 'Outreach', 'Apollo',
  'Salesloft', 'Gong', 'ZoomInfo', 'Clearbit', 'Intercom', 'LinkedIn Sales Navigator',
  'Calendly', 'Zoom'
];
const normalizeName = (s) => (s || '').toString().trim().toLowerCase();
export const isTrustedSource = (name) => TRUSTED_SOURCES.map(normalizeName).includes(normalizeName(name));

const SOURCE_ICONS = {
  'Postgres': '🐘',
  'MySQL': '🐬',
  'Snowflake': '❄️',
  'BigQuery': '☁️',
  'Redshift': '🔴',
  'MongoDB': '🍃',
  'Salesforce': '☁️',
  'HubSpot': '🧡',
  'Pipedrive': '🔷',
  'Salesloft': '🧰',
  'Gong': '🎧',
  'LinkedIn Sales Navigator': '💼',
  'ZoomInfo': '📊',
  'Apollo': '🚀',
  'Clearbit': '✨',
  'Intercom': '💬',
  'Zoom': '🎥',
  'Calendly': '📅',
};
export const getSourceIcon = (source) => SOURCE_ICONS[source] || '📦';

const defaultState = {
  activeCRM: 'Salesforce',
  integrationsConnected: [],
  savedPrompts: [
    { id: 'p-1', title: 'Enterprise VP Sales cold email', prompt: 'Write a cold email for a VP of Sales at an enterprise SaaS company' },
    { id: 'p-2', title: 'Campaign analysis summary', prompt: 'Analyze my Q1 Enterprise Outreach campaign and suggest improvements' }
  ],
  leads: [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'VP of Sales',
      company: 'TechCorp Inc.',
      industry: 'SaaS',
      location: 'San Francisco, CA',
      score: 92,
      status: 'hot',
      email: 'sarah.j@techcorp.com',
      phone: '+1 (555) 123-4567',
      linkedin: 'linkedin.com/in/sarahjohnson',
      lastContact: '2 days ago',
      avatar: '👩‍💼',
      enrichment: {
        companySize: '500-1000',
        revenue: '$50M-$100M',
        techStack: ['Salesforce', 'HubSpot', 'Slack'],
        recentNews: 'Just raised Series C funding',
      },
      activity: [
        { type: 'email_opened', message: 'Opened "Quick question about scaling"', time: '2 hours ago' },
        { type: 'link_clicked', message: 'Clicked pricing page link', time: '2 hours ago' },
        { type: 'email_sent', message: 'Sent follow-up email', time: '2 days ago' },
      ],
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'CTO',
      company: 'CloudScale',
      industry: 'Cloud Infrastructure',
      location: 'Austin, TX',
      score: 85,
      status: 'warm',
      email: 'mchen@cloudscale.io',
      phone: '+1 (555) 234-5678',
      linkedin: 'linkedin.com/in/michaelchen',
      lastContact: '5 days ago',
      avatar: '👨‍💼',
      enrichment: {
        companySize: '100-250',
        revenue: '$10M-$50M',
        techStack: ['AWS', 'Kubernetes', 'Datadog'],
        recentNews: 'Expanding to European market',
      },
      activity: [
        { type: 'email_replied', message: 'Replied: "Interested, let\'s chat"', time: '5 days ago' },
        { type: 'email_opened', message: 'Opened initial outreach', time: '1 week ago' },
      ],
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      title: 'Head of Growth',
      company: 'DataFlow Systems',
      industry: 'Data Analytics',
      location: 'New York, NY',
      score: 78,
      status: 'warm',
      email: 'emily.r@dataflow.com',
      phone: '+1 (555) 345-6789',
      linkedin: 'linkedin.com/in/emilyrodriguez',
      lastContact: '1 week ago',
      avatar: '👩',
      enrichment: {
        companySize: '250-500',
        revenue: '$25M-$50M',
        techStack: ['Tableau', 'Snowflake', 'dbt'],
        recentNews: 'New partnership with Microsoft',
      },
      activity: [
        { type: 'email_opened', message: 'Opened "Partnership opportunity"', time: '1 week ago' },
        { type: 'email_sent', message: 'Sent initial outreach', time: '1 week ago' },
      ],
    },
    {
      id: 4,
      name: 'David Park',
      title: 'Founder & CEO',
      company: 'InnovateLabs',
      industry: 'AI/ML',
      location: 'Seattle, WA',
      score: 95,
      status: 'hot',
      email: 'david@innovatelabs.ai',
      phone: '+1 (555) 456-7890',
      linkedin: 'linkedin.com/in/davidpark',
      lastContact: 'Today',
      avatar: '👨',
      enrichment: {
        companySize: '50-100',
        revenue: '$5M-$10M',
        techStack: ['PyTorch', 'TensorFlow', 'OpenAI'],
        recentNews: 'Featured in TechCrunch',
      },
      activity: [
        { type: 'meeting_booked', message: 'Booked demo call for tomorrow', time: '1 hour ago' },
        { type: 'email_replied', message: 'Replied: "Very interested!"', time: '3 hours ago' },
        { type: 'email_opened', message: 'Opened outreach email 3x', time: 'Today' },
      ],
    },
  ],
  campaigns: [
    {
      id: 'campaign-1',
      name: 'Q1 Enterprise Outreach',
      status: 'active',
      leads: 324,
      sent: 1240,
      replies: 94,
      replyRate: 7.6,
      steps: [
        { id: 'step-1', type: 'email', delay: 0, subject: 'Quick question about {{company}}', content: 'Hi {{firstName}}...' },
      ],
    },
    {
      id: 'campaign-2',
      name: 'Product Launch - SaaS',
      status: 'active',
      leads: 256,
      sent: 890,
      replies: 71,
      replyRate: 8.0,
      steps: [],
    },
  ],
  aiMessages: [
    {
      role: 'assistant',
      content:
        "Hi! I'm Ava, your AI BDR assistant. I can help you write personalized outreach, analyze campaigns, find leads, and optimize your sales strategy. What would you like to work on today?",
      suggestions: [
        'Write an email for enterprise prospects',
        'Analyze my campaign performance',
        'Find leads in the SaaS industry',
        'Optimize subject lines',
      ],
    },
  ],
};

const loadState = () => {
  return storage.get(STORAGE_KEY, defaultState);
};

const saveState = (nextState) => {
  storage.set(STORAGE_KEY, nextState);
};

export const getDashboardStats = () => {
  const state = loadState();
  const campaigns = state.campaigns || [];
  const leads = state.leads || [];
  const emailsSent = campaigns.reduce((sum, campaign) => sum + (campaign.sent || 0), 0);
  return {
    totalCampaigns: campaigns.length,
    totalLeads: leads.length,
    emailsSent,
    responseRate: 25,
  };
};

export const getLeads = () => loadState().leads;

export const searchLeads = (query) => {
  const leads = getLeads();
  if (!query) return leads;
  const q = query.toLowerCase();
  return leads.filter((lead) =>
    [lead.name, lead.company, lead.title, lead.industry, lead.location]
      .some((field) => field && field.toLowerCase().includes(q))
  );
};

export const updateLeadStatus = (leadId, status) => {
  const state = loadState();
  state.leads = state.leads.map((lead) =>
    lead.id === leadId ? { ...lead, status } : lead
  );
  saveState(state);
  return state.leads;
};

export const addLeadActivity = (leadId, activity) => {
  const state = loadState();
  state.leads = state.leads.map((lead) =>
    lead.id === leadId
      ? { ...lead, activity: [activity, ...(lead.activity || [])] }
      : lead
  );
  saveState(state);
  return state.leads.find((lead) => lead.id === leadId);
};

export const exportLeads = () => {
  const leads = getLeads();
  const blob = new Blob([JSON.stringify(leads, null, 2)], { type: 'application/json' });
  return URL.createObjectURL(blob);
};

export const getSavedPrompts = () => loadState().savedPrompts || [];
export const addSavedPrompt = (title, prompt) => {
  const state = loadState();
  const id = `p-${Date.now()}`;
  state.savedPrompts = [{ id, title, prompt }, ...(state.savedPrompts || [])];
  saveState(state);
  return state.savedPrompts;
};
export const removeSavedPrompt = (id) => {
  const state = loadState();
  state.savedPrompts = (state.savedPrompts || []).filter((p) => p.id !== id);
  saveState(state);
  return state.savedPrompts;
};

export const updateLeadVerification = (leadId, { verified, source }) => {
  const state = loadState();
  state.leads = state.leads.map((lead) =>
    lead.id === leadId ? { ...lead, verified: Boolean(verified), source: source || lead.source } : lead
  );
  saveState(state);
  return state.leads.find((l) => l.id === leadId);
};

export const getLeadSources = () => {
  const leads = getLeads();
  const summary = new Map();
  for (const l of leads) {
    const key = l.source || 'Unknown';
    const s = summary.get(key) || { source: key, total: 0, verified: 0 };
    s.total += 1;
    if (l.verified) s.verified += 1;
    summary.set(key, s);
  }
  return Array.from(summary.values()).sort((a, b) => b.total - a.total);
};

export const getExampleLead = (source) => {
  const leads = getLeads();
  const match = leads.find((l) => (source ? (l.source === source) : true));
  return match || leads[0] || null;
};

export const estimateTokens = (text) => Math.max(1, Math.ceil((text || '').length / 4));
export const estimateResponseTime = (contentLength) => {
  const base = 200;
  const perToken = 5;
  const tokens = estimateTokens(contentLength);
  return base + (tokens / 50) * perToken;
};

export const getCampaigns = () => loadState().campaigns;

export const saveCampaign = (campaign) => {
  const state = loadState();
  const existing = state.campaigns.find((c) => c.id === campaign.id);
  if (existing) {
    state.campaigns = state.campaigns.map((c) => (c.id === campaign.id ? { ...existing, ...campaign } : c));
  } else {
    state.campaigns.push(campaign);
  }
  saveState(state);
  return campaign;
};

export const getCampaignDraft = (campaignId = 'default') => {
  const state = loadState();
  return state.campaigns.find((c) => c.id === campaignId) || null;
};

export const getAnalytics = async () => ({});

export const getAIMessages = () => loadState().aiMessages;

export const addAIMessage = (message) => {
  const state = loadState();
  state.aiMessages = [...state.aiMessages, message];
  saveState(state);
  return state.aiMessages;
};

export const getActiveCRM = () => loadState().activeCRM || null;
export const setActiveCRM = (name) => {
  const state = loadState();
  state.activeCRM = name;
  saveState(state);
  return state.activeCRM;
};

// --- AI stubs for server-side behavior ---
export const fetchAIRecommendations = async (context = {}) => {
  await new Promise((r) => setTimeout(r, 400));
  return [
    {
      title: 'Reduce send volume by 12% on low-warm domains',
      impact: 'deliverability',
      confidence: 0.82,
      reason: 'Warmup trends and recent soft bounces indicate risk at current pace.',
      actionLabel: 'Apply guardrail',
      id: 'rec-guardrail-1',
    },
    {
      title: 'Swap CTA in sequence 3 to calendar link',
      impact: 'reply-rate',
      confidence: 0.77,
      reason: 'A/B suggests 18% relative lift for similar ICPs last week.',
      actionLabel: 'Update template',
      id: 'rec-template-3',
    },
    {
      title: 'Prioritize Finance ICP on Tuesday 10am',
      impact: 'meetings',
      confidence: 0.73,
      reason: 'Historic reply clusters peak at this slot for finance targets.',
      actionLabel: 'Schedule window',
      id: 'rec-schedule-2',
    },
  ];
};

// Dashboard data stubs (API-ready)
export const fetchDashboardSnapshot = async () => request('/analytics/dashboard');

export const fetchAnalyticsSummary = async () => request('/analytics');

export const fetchLeads = async () => request('/leads');

export const fetchCampaigns = async () => request('/campaigns');

export const fetchSystemStatus = async () => request('/status');

export const applyGuardrail = async (options = {}) => {
  await new Promise((r) => setTimeout(r, 350));
  // Could persist a setting here
  return { ok: true, applied: { type: 'guardrail', ...options } };
};

export const updateTemplateCTA = async (options = {}) => {
  await new Promise((r) => setTimeout(r, 350));
  return { ok: true, updated: { type: 'template-cta', ...options } };
};

export const scheduleOptimalWindow = async (options = {}) => {
  await new Promise((r) => setTimeout(r, 350));
  return { ok: true, scheduled: { type: 'send-window', ...options } };
};

export const askAva = async (prompt) => {
  try {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (res.ok) {
      const data = await res.json();
      const response = {
        role: data.role || 'assistant',
        content: data.content,
        suggestions: data.suggestions || ['Apply guardrail', 'Schedule optimal window', 'Tune subject lines']
      };
      addAIMessage(response);
      return response;
    }
  } catch (e) {
    // fall back to local mock if backend unavailable
  }
  await new Promise((r) => setTimeout(r, 500));
  const response = {
    role: 'assistant',
    content: `Here’s a quick take on: “${prompt}”. Consider reducing volume on warming domains and focusing sends at peak reply windows (Tue 10am for Finance). I can apply those changes for you.`,
    suggestions: ['Apply guardrail', 'Schedule optimal window', 'Tune subject lines'],
  };
  addAIMessage(response);
  return response;
};

export const sendToSlack = async (payload = { text: 'Test message' }) => {
  await new Promise((r) => setTimeout(r, 300));
  // Normally POST to Slack webhook; here we just simulate
  return { ok: true, sent: payload };
};

// --- External Integrations: connect + extract stubs ---
export const connectIntegration = (name) => {
  const state = loadState();
  const set = new Set(state.integrationsConnected || []);
  set.add(name);
  state.integrationsConnected = Array.from(set);
  saveState(state);
  return state.integrationsConnected;
};

export const isIntegrationConnected = (name) => {
  const state = loadState();
  return (state.integrationsConnected || []).includes(name);
};

export const extractIntegrationData = async (name) => {
  await new Promise((r) => setTimeout(r, 500));
  const state = loadState();
  // Simulate different payloads per integration
  let imported = [];
  if (name === 'Salesloft') {
    imported = [
      { id: Date.now(), name: 'Alex Carter', title: 'SDR Manager', company: 'RevOpsCo', industry: 'SaaS', location: 'Remote', score: 72, status: 'warm', email: 'alex.c@revops.co', avatar: '👨', source: 'Salesloft', verified: true, enrichment: { techStack: ['Salesloft', 'Salesforce'] }, activity: [{ type: 'email_opened', message: 'Opened outreach from Salesloft', time: 'Today' }] },
      { id: Date.now() + 1, name: 'Nina Patel', title: 'VP Growth', company: 'ScaleWorks', industry: 'AI', location: 'NYC', score: 88, status: 'hot', email: 'nina@scaleworks.ai', avatar: '👩', source: 'Salesloft', verified: true, enrichment: { techStack: ['Salesloft'] }, activity: [{ type: 'email_replied', message: 'Responded via Salesloft thread', time: 'Today' }] },
    ];
  } else if (name === 'Gong') {
    imported = [
      { id: Date.now() + 2, name: 'Chris Wong', title: 'Director Sales', company: 'DataQuanta', industry: 'Analytics', location: 'SF', score: 81, status: 'warm', email: 'chris.w@dataquanta.com', avatar: '👨', source: 'Gong', verified: true, enrichment: { recentNews: 'New ARR milestone' }, activity: [{ type: 'meeting_booked', message: 'Gong recording: discovery call booked', time: 'Yesterday' }] },
    ];
  }
  // Merge leads (dedupe by email)
  const existingEmails = new Set((state.leads || []).map((l) => l.email));
  const toAdd = imported.filter((l) => l.email && !existingEmails.has(l.email));
  state.leads = [...toAdd, ...(state.leads || [])];
  saveState(state);
  return { ok: true, importedCount: toAdd.length };
};

// --- Universal Database Import (CSV/JSON) ---
const normalizeLeadRecord = (raw = {}, source = 'Database') => {
  const get = (key) => raw[key] ?? raw[key?.toLowerCase?.()] ?? raw[key?.toUpperCase?.()];
  const name = get('name') || `${get('firstName') || ''} ${get('lastName') || ''}`.trim();
  const email = get('email');
  const score = Number(get('score')) || 75;
  const status = get('status') || (score >= 90 ? 'hot' : score >= 75 ? 'warm' : 'cold');
  const verified = Boolean(get('verified')) || isTrustedSource(source);
  return {
    id: Date.now() + Math.floor(Math.random() * 10000),
    name: name || 'Unknown',
    title: get('title') || get('role') || 'Prospect',
    company: get('company') || get('org') || 'Unknown Co.',
    industry: get('industry') || 'General',
    location: get('location') || get('city') || 'Remote',
    score,
    status,
    email,
    phone: get('phone') || '',
    linkedin: get('linkedin') || '',
    lastContact: 'Imported',
    avatar: '👤',
    source,
    verified,
    enrichment: {
      companySize: get('companySize') || get('size') || 'Unknown',
      revenue: get('revenue') || 'Unknown',
      techStack: Array.isArray(get('techStack')) ? get('techStack') : [],
      recentNews: get('recentNews') || '',
    },
    activity: [
      { type: 'email_opened', message: `Imported from ${source}`, time: 'Just now' },
    ],
  };
};

export const importLeads = (records = [], source = 'Database') => {
  const state = loadState();
  const existingEmails = new Set((state.leads || []).map((l) => l.email).filter(Boolean));
  const normalized = records
    .map((r) => normalizeLeadRecord(r, source))
    .filter((l) => l.email); // require email for dedupe
  const toAdd = normalized.filter((l) => !existingEmails.has(l.email));
  state.leads = [...toAdd, ...(state.leads || [])];
  saveState(state);
  return { ok: true, importedCount: toAdd.length };
};

export const parseCSVLeads = (csvText = '', defaultSource = 'Database') => {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim());
  const records = lines.slice(1).map((line) => {
    // naive CSV split; acceptable for simple cases
    const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = cols[i];
    });
    return obj;
  });
  return records.map((r) => normalizeLeadRecord(r, r.source || defaultSource));
};

export const parseJSONLeads = (jsonText = '', defaultSource = 'Database') => {
  let arr = [];
  try {
    const parsed = JSON.parse(jsonText);
    arr = Array.isArray(parsed) ? parsed : (parsed?.rows || []);
  } catch {
    arr = [];
  }
  return arr.map((r) => normalizeLeadRecord(r, r.source || defaultSource));
};

// --- AI endpoint helpers ---
export const scoreLeadWithAI = async (lead) => {
  try {
    const res = await fetch(`${API_BASE}/ai/lead-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: lead.name,
        title: lead.title,
        company: lead.company,
        industry: lead.industry,
        activity: lead.activity || []
      })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('AI lead scoring failed, using fallback', e);
  }
  return { score: 75, tier: 'warm', rationale: 'fallback scoring' };
};

export const generateEmailWithAI = async (lead, prompt, tone = 'professional', length = 'medium') => {
  try {
    const res = await fetch(`${API_BASE}/ai/generate-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        tone,
        length,
        lead: {
          name: lead.name,
          title: lead.title,
          company: lead.company,
          industry: lead.industry,
          activity: lead.activity || []
        }
      })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('AI email generation failed', e);
  }
  return { subject: 'Quick question', body: 'Hi, interested in a quick chat?', tone, length };
};

export const dataService = {
  getDashboardStats,
  getCampaigns,
  getLeads,
  getAnalytics,
  post: (path, payload) => request(path, {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
};
