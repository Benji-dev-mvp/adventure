import { useState, useEffect, useMemo } from 'react';

// Agent definitions
const AGENTS = [
  {
    id: 'strategist',
    name: 'Strategist',
    role: 'Strategic Planning',
    avatar: '🎯',
    color: '#06b6d4',
    description: 'Analyzes market trends and develops long-term growth strategies',
    strengths: ['Market Analysis', 'Competitive Intelligence', 'Growth Planning'],
  },
  {
    id: 'diplomat',
    name: 'Diplomat',
    role: 'Relationship Building',
    avatar: '🤝',
    color: '#8b5cf6',
    description: 'Manages stakeholder relationships and negotiation approaches',
    strengths: ['Account Management', 'Negotiation', 'Partnership Development'],
  },
  {
    id: 'hacker',
    name: 'Hacker',
    role: 'Growth Engineering',
    avatar: '⚡',
    color: '#10b981',
    description: 'Finds unconventional growth opportunities and technical solutions',
    strengths: ['Automation', 'Process Optimization', 'Technical Integration'],
  },
  {
    id: 'psychologist',
    name: 'Psychologist',
    role: 'Behavioral Analysis',
    avatar: '🧠',
    color: '#f97316',
    description: 'Understands buyer psychology and optimizes messaging',
    strengths: ['Buyer Psychology', 'Messaging', 'Personalization'],
  },
  {
    id: 'economist',
    name: 'Economist',
    role: 'Financial Modeling',
    avatar: '📊',
    color: '#ec4899',
    description: 'Evaluates ROI and financial impact of strategies',
    strengths: ['ROI Analysis', 'Pricing Strategy', 'Resource Allocation'],
  },
  {
    id: 'governor',
    name: 'Governor',
    role: 'Risk & Compliance',
    avatar: '🛡️',
    color: '#6366f1',
    description: 'Ensures compliance and manages operational risks',
    strengths: ['Risk Assessment', 'Compliance', 'Policy Enforcement'],
  },
];

// Mock agenda items
const MOCK_AGENDAS = [
  {
    id: 'agenda-1',
    title: 'Q3 Pipeline Shortfall - Midmarket',
    description: 'Pipeline is 35% below target for midmarket segment. Need intervention strategy.',
    priority: 'critical',
    status: 'debating',
    createdAt: '2024-12-28T08:00:00Z',
    metrics: {
      pipelineGap: '-$450K',
      weeksRemaining: 4,
      affectedDeals: 23,
    },
  },
  {
    id: 'agenda-2',
    title: 'Over-saturation in SMB SaaS',
    description: 'Reply rates dropping in SMB SaaS vertical. Market may be oversaturated.',
    priority: 'high',
    status: 'pending',
    createdAt: '2024-12-27T14:30:00Z',
    metrics: {
      replyRateDrop: '-22%',
      affectedCampaigns: 5,
      uniqueContacts: 1240,
    },
  },
  {
    id: 'agenda-3',
    title: 'Enterprise Multi-threading Strategy',
    description: 'Evaluate expanding multi-threading approach across all enterprise accounts.',
    priority: 'medium',
    status: 'resolved',
    createdAt: '2024-12-26T10:00:00Z',
    resolution: 'Approved with 2-week pilot program',
    metrics: {
      targetAccounts: 45,
      projectedUplift: '+18%',
      resourceRequirement: '2 SDRs',
    },
  },
  {
    id: 'agenda-4',
    title: 'LinkedIn Channel Expansion',
    description: 'Proposal to increase LinkedIn allocation from 25% to 40% for EU region.',
    priority: 'medium',
    status: 'pending',
    createdAt: '2024-12-25T16:00:00Z',
    metrics: {
      currentAllocation: '25%',
      proposedAllocation: '40%',
      euAccountsAffected: 180,
    },
  },
];

// Mock debate arguments between agents
const MOCK_ARGUMENTS = {
  'agenda-1': [
    {
      from: 'strategist',
      to: 'economist',
      type: 'opportunity',
      message: 'Increasing outbound volume by 50% could close the gap, but need budget analysis.',
      weight: 0.8,
    },
    {
      from: 'economist',
      to: 'strategist',
      type: 'risk',
      message: 'Volume increase would require $25K additional investment. ROI unclear.',
      weight: 0.6,
    },
    {
      from: 'psychologist',
      to: 'strategist',
      type: 'opportunity',
      message: 'Persona refinement could improve reply rates by 15% without volume increase.',
      weight: 0.7,
    },
    {
      from: 'hacker',
      to: 'diplomat',
      type: 'opportunity',
      message: 'Automated multi-channel sequencing could boost touch efficiency by 40%.',
      weight: 0.9,
    },
    {
      from: 'governor',
      to: 'hacker',
      type: 'risk',
      message: 'High-velocity automation may trigger spam filters. Compliance risk.',
      weight: 0.5,
    },
    {
      from: 'diplomat',
      to: 'psychologist',
      type: 'cost',
      message: 'Relationship-building approach takes 2+ weeks. Timeline risk.',
      weight: 0.4,
    },
  ],
  'agenda-2': [
    {
      from: 'strategist',
      to: 'psychologist',
      type: 'opportunity',
      message: 'Consider pivoting to adjacent verticals with lower saturation.',
      weight: 0.7,
    },
    {
      from: 'economist',
      to: 'strategist',
      type: 'cost',
      message: 'Vertical pivot requires new content and ICP research. 3-week delay.',
      weight: 0.5,
    },
  ],
};

// Mock resolutions
const MOCK_RESOLUTIONS = {
  'agenda-1': {
    strategy: 'Hybrid Approach: Persona refinement + targeted volume increase',
    details: [
      'Refine ICP to focus on recently funded companies (Psychologist recommendation)',
      'Increase volume by 25% on high-performing segments only (Economist compromise)',
      'Deploy multi-channel sequencing with compliance safeguards (Hacker + Governor)',
    ],
    expectedUplift: '+28% pipeline recovery',
    riskLevel: 'medium',
    confidence: 76,
    votingResult: {
      approve: 5,
      modify: 1,
      reject: 0,
    },
  },
};

export function useParliamentState() {
  const [agents, setAgents] = useState([]);
  const [agendas, setAgendas] = useState([]);
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const [arguments_, setArguments] = useState({});
  const [resolutions, setResolutions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setAgents(AGENTS);
      setAgendas(MOCK_AGENDAS);
      setArguments(MOCK_ARGUMENTS);
      setResolutions(MOCK_RESOLUTIONS);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Auto-select first debating agenda
  useEffect(() => {
    if (agendas.length > 0 && !selectedAgenda) {
      const debating = agendas.find(a => a.status === 'debating');
      setSelectedAgenda(debating || agendas[0]);
    }
  }, [agendas, selectedAgenda]);

  const currentArguments = selectedAgenda ? arguments_[selectedAgenda.id] || [] : [];
  const currentResolution = selectedAgenda ? resolutions[selectedAgenda.id] : null;

  const summary = useMemo(() => {
    return {
      totalAgendas: agendas.length,
      debating: agendas.filter(a => a.status === 'debating').length,
      pending: agendas.filter(a => a.status === 'pending').length,
      resolved: agendas.filter(a => a.status === 'resolved').length,
    };
  }, [agendas]);

  return {
    agents,
    agendas,
    selectedAgenda,
    selectAgenda: setSelectedAgenda,
    arguments: currentArguments,
    resolution: currentResolution,
    loading,
    summary,
  };
}
