import { useState, useEffect } from 'react';

// Mock decision timeline data
const MOCK_DECISIONS = [
  {
    id: 'dec-1',
    type: 'strategy_update',
    title: 'ICP Refinement',
    description: 'Narrowed midmarket ICP to focus on companies with recent funding rounds. Analysis showed 2.3x higher reply rates from recently funded prospects.',
    timestamp: '2024-12-28T10:30:00Z',
    impact: 'high',
    program: 'Q4 Midmarket Blitz',
    metrics: { replyRateChange: '+15%', pipelineImpact: '+$120K' },
  },
  {
    id: 'dec-2',
    type: 'model_change',
    title: 'Sequence Optimization',
    description: 'ML model recommended adding a 4th email touchpoint with case study. Historical data shows 18% incremental meetings from extended sequences.',
    timestamp: '2024-12-28T08:15:00Z',
    impact: 'medium',
    program: 'Enterprise Expansion Wave',
    metrics: { meetingsProjected: '+8', confidenceLevel: '82%' },
  },
  {
    id: 'dec-3',
    type: 'intervention',
    title: 'Deliverability Protection',
    description: 'Detected bounce rate spike to 4.2%. Automatically reduced daily send volume by 40% and switched to warm-up mode for affected domains.',
    timestamp: '2024-12-27T16:45:00Z',
    impact: 'critical',
    program: 'Startup Land & Expand',
    metrics: { bounceRateReduction: '-3.8%', volumeReduction: '-40%' },
  },
  {
    id: 'dec-4',
    type: 'strategy_update',
    title: 'Channel Rebalancing',
    description: 'Increased LinkedIn allocation for EU midmarket segment. Data shows 35% higher engagement from LinkedIn vs email in EMEA region.',
    timestamp: '2024-12-27T11:00:00Z',
    impact: 'medium',
    program: 'Q4 Midmarket Blitz',
    metrics: { linkedinShare: '+15%', emailShare: '-15%' },
  },
  {
    id: 'dec-5',
    type: 'intervention',
    title: 'Reply Slump Response',
    description: 'Reply rates dropped 22% week-over-week. System ramped email cadence frequency and introduced new subject line variants.',
    timestamp: '2024-12-26T14:20:00Z',
    impact: 'high',
    program: 'Q4 Midmarket Blitz',
    metrics: { replyRateRecovery: '+18%', newVariantsCTR: '4.2%' },
  },
  {
    id: 'dec-6',
    type: 'model_change',
    title: 'Persona Scoring Update',
    description: 'Updated lead scoring model with new intent signals from G2 and TrustRadius. VP-level contacts now weighted 1.4x higher.',
    timestamp: '2024-12-25T09:00:00Z',
    impact: 'medium',
    program: 'All Programs',
    metrics: { scoringAccuracy: '+12%', vpWeight: '1.4x' },
  },
  {
    id: 'dec-7',
    type: 'strategy_update',
    title: 'Holiday Mode Activated',
    description: 'Automatically paused Healthcare program for holiday period. Will resume January 2nd with refreshed messaging.',
    timestamp: '2024-12-24T08:00:00Z',
    impact: 'low',
    program: 'Healthcare Vertical Push',
    metrics: { pauseDuration: '9 days', resumeDate: 'Jan 2' },
  },
];

const DECISION_TYPE_CONFIG = {
  strategy_update: {
    label: 'Strategy Update',
    color: 'cyan',
    icon: 'Compass',
  },
  model_change: {
    label: 'Model Change',
    color: 'purple',
    icon: 'Brain',
  },
  intervention: {
    label: 'Autopilot Intervention',
    color: 'orange',
    icon: 'Zap',
  },
};

export function useAutopilotDecisions() {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setDecisions(MOCK_DECISIONS);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const filteredDecisions = filterType === 'all' 
    ? decisions 
    : decisions.filter(d => d.type === filterType);

  const decisionsByDate = filteredDecisions.reduce((acc, decision) => {
    const date = new Date(decision.timestamp).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(decision);
    return acc;
  }, {});

  return {
    decisions: filteredDecisions,
    decisionsByDate,
    loading,
    selectedDecision,
    setSelectedDecision,
    filterType,
    setFilterType,
    typeConfig: DECISION_TYPE_CONFIG,
  };
}
