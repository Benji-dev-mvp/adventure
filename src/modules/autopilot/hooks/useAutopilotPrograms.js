import { useState, useEffect, useMemo } from 'react';

// Mock data for autonomous programs
const MOCK_PROGRAMS = [
  {
    id: 'prog-1',
    name: 'Q4 Midmarket Blitz',
    segment: 'Midmarket SaaS',
    goal: '120 meetings',
    status: 'running',
    nextActionEta: '2h 15m',
    currentRisk: 'low',
    progress: 67,
    icpDescription: 'VP Sales / CRO at B2B SaaS companies, 50-200 employees, Series A-B',
    channelMix: { email: 45, linkedin: 35, phone: 15, sms: 5 },
    messagingAngles: ['Cost Reduction', 'Time to Value', 'Competitive Displacement'],
    recentDecisions: [
      { action: 'Increased LinkedIn for EU midmarket', timestamp: '2h ago' },
      { action: 'Reduced email frequency after bounce spike', timestamp: '6h ago' },
      { action: 'Added phone touchpoint for high-intent signals', timestamp: '1d ago' },
    ],
  },
  {
    id: 'prog-2',
    name: 'Enterprise Expansion Wave',
    segment: 'Enterprise',
    goal: '25 meetings',
    status: 'running',
    nextActionEta: '45m',
    currentRisk: 'medium',
    progress: 42,
    icpDescription: 'C-Suite at Fortune 1000, Digital Transformation initiatives',
    channelMix: { email: 30, linkedin: 40, phone: 25, sms: 5 },
    messagingAngles: ['Enterprise Security', 'Scalability', 'Integration Ecosystem'],
    recentDecisions: [
      { action: 'Switched to multi-threading approach', timestamp: '4h ago' },
      { action: 'Added case study attachment to sequences', timestamp: '1d ago' },
      { action: 'Expanded target list with intent signals', timestamp: '2d ago' },
    ],
  },
  {
    id: 'prog-3',
    name: 'Startup Land & Expand',
    segment: 'Startups',
    goal: '200 meetings',
    status: 'at-risk',
    nextActionEta: '15m',
    currentRisk: 'high',
    progress: 28,
    icpDescription: 'Founders & Head of Sales at Seed-Series A startups',
    channelMix: { email: 55, linkedin: 25, phone: 10, sms: 10 },
    messagingAngles: ['Speed to Revenue', 'Founder-Friendly', 'Pay as You Grow'],
    recentDecisions: [
      { action: 'Paused cold outreach pending deliverability fix', timestamp: '30m ago' },
      { action: 'A/B testing new subject lines', timestamp: '3h ago' },
      { action: 'Reduced daily volume by 40%', timestamp: '1d ago' },
    ],
  },
  {
    id: 'prog-4',
    name: 'Healthcare Vertical Push',
    segment: 'Healthcare',
    goal: '50 meetings',
    status: 'paused',
    nextActionEta: 'Paused',
    currentRisk: 'low',
    progress: 15,
    icpDescription: 'IT Directors at regional hospital networks',
    channelMix: { email: 40, linkedin: 20, phone: 35, sms: 5 },
    messagingAngles: ['HIPAA Compliance', 'Patient Outcomes', 'Operational Efficiency'],
    recentDecisions: [
      { action: 'Paused for holiday period', timestamp: '2d ago' },
      { action: 'Updated compliance messaging', timestamp: '5d ago' },
    ],
  },
];

const MOCK_COMMITMENTS = [
  {
    id: 'commit-1',
    title: 'This Quarter',
    type: 'quarterly',
    targetMeetings: 395,
    forecastMeetings: 342,
    confidence: 78,
    trend: [65, 72, 68, 75, 82, 78, 85, 88, 82, 78],
    projectedValue: 2850000,
    actualValue: 2150000,
  },
  {
    id: 'commit-2',
    title: 'Midmarket SaaS',
    type: 'segment',
    targetMeetings: 180,
    forecastMeetings: 165,
    confidence: 85,
    trend: [42, 48, 55, 52, 60, 65, 68, 72, 75, 78],
    projectedValue: 1200000,
    actualValue: 980000,
  },
  {
    id: 'commit-3',
    title: 'Enterprise Expansion',
    type: 'segment',
    targetMeetings: 45,
    forecastMeetings: 38,
    confidence: 72,
    trend: [15, 18, 22, 25, 28, 30, 32, 35, 38, 42],
    projectedValue: 850000,
    actualValue: 620000,
    highIntentAccounts: 12,
  },
];

export function useAutopilotPrograms() {
  const [programs, setPrograms] = useState([]);
  const [commitments, setCommitments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setPrograms(MOCK_PROGRAMS);
      setCommitments(MOCK_COMMITMENTS);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Auto-select first program
  useEffect(() => {
    if (programs.length > 0 && !selectedProgram) {
      setSelectedProgram(programs[0]);
    }
  }, [programs, selectedProgram]);

  const summary = useMemo(() => {
    return {
      totalPrograms: programs.length,
      runningPrograms: programs.filter(p => p.status === 'running').length,
      atRiskPrograms: programs.filter(p => p.status === 'at-risk').length,
      pausedPrograms: programs.filter(p => p.status === 'paused').length,
      averageProgress: programs.reduce((acc, p) => acc + p.progress, 0) / (programs.length || 1),
    };
  }, [programs]);

  return {
    programs,
    commitments,
    loading,
    selectedProgram,
    setSelectedProgram,
    summary,
  };
}
