import { useState, useEffect, useMemo } from 'react';

// Mock cluster data for the Lead Hive visualization
const MOCK_CLUSTERS = [
  {
    id: 'cluster-1',
    name: 'High-Intent SaaS Buyers',
    segment: 'Midmarket',
    accounts: 47,
    potentialMeetings: 12,
    avgIntentScore: 87,
    recommendedStrategy: 'Direct outreach with case study attachment',
    topAccounts: [
      { id: 'acc-1', name: 'TechFlow Inc', role: 'VP Sales', intent: 92, predictedOpenDate: '2 days', recommended: 'LinkedIn + Email' },
      { id: 'acc-2', name: 'DataPulse', role: 'CRO', intent: 89, predictedOpenDate: '3 days', recommended: 'Phone call' },
      { id: 'acc-3', name: 'CloudSync Pro', role: 'Head of Growth', intent: 85, predictedOpenDate: '1 day', recommended: 'Email sequence' },
    ],
    color: '#06b6d4',
    position: { x: 25, y: 30 },
    size: 120,
  },
  {
    id: 'cluster-2',
    name: 'Enterprise Expansion Ready',
    segment: 'Enterprise',
    accounts: 23,
    potentialMeetings: 8,
    avgIntentScore: 78,
    recommendedStrategy: 'Multi-threading with executive sponsorship',
    topAccounts: [
      { id: 'acc-4', name: 'GlobalCorp', role: 'CTO', intent: 82, predictedOpenDate: '5 days', recommended: 'Executive email' },
      { id: 'acc-5', name: 'Mega Industries', role: 'VP Engineering', intent: 76, predictedOpenDate: '4 days', recommended: 'LinkedIn InMail' },
    ],
    color: '#8b5cf6',
    position: { x: 65, y: 45 },
    size: 95,
  },
  {
    id: 'cluster-3',
    name: 'Startup Fast Movers',
    segment: 'Startups',
    accounts: 89,
    potentialMeetings: 22,
    avgIntentScore: 72,
    recommendedStrategy: 'High-velocity email with quick demo offer',
    topAccounts: [
      { id: 'acc-6', name: 'LaunchPad AI', role: 'Founder', intent: 79, predictedOpenDate: '1 day', recommended: 'Direct email' },
      { id: 'acc-7', name: 'RocketScale', role: 'CEO', intent: 74, predictedOpenDate: '2 days', recommended: 'LinkedIn' },
      { id: 'acc-8', name: 'NimbleOps', role: 'Head of Sales', intent: 71, predictedOpenDate: '3 days', recommended: 'Email' },
    ],
    color: '#10b981',
    position: { x: 40, y: 70 },
    size: 140,
  },
  {
    id: 'cluster-4',
    name: 'Warming Up Prospects',
    segment: 'Midmarket',
    accounts: 156,
    potentialMeetings: 18,
    avgIntentScore: 45,
    recommendedStrategy: 'Nurture sequence with educational content',
    topAccounts: [
      { id: 'acc-9', name: 'MidScale Solutions', role: 'Director Sales', intent: 52, predictedOpenDate: '14 days', recommended: 'Content nurture' },
      { id: 'acc-10', name: 'GrowthFirst', role: 'VP Marketing', intent: 48, predictedOpenDate: '10 days', recommended: 'Newsletter' },
    ],
    color: '#f97316',
    position: { x: 75, y: 25 },
    size: 80,
  },
  {
    id: 'cluster-5',
    name: 'Cold but Qualified',
    segment: 'Enterprise',
    accounts: 234,
    potentialMeetings: 15,
    avgIntentScore: 28,
    recommendedStrategy: 'Long-term ABM with account research',
    topAccounts: [
      { id: 'acc-11', name: 'Enterprise Systems', role: 'IT Director', intent: 35, predictedOpenDate: '30 days', recommended: 'ABM campaign' },
    ],
    color: '#6366f1',
    position: { x: 20, y: 60 },
    size: 70,
  },
];

// Generate individual lead points for visualization
const generateLeadPoints = (clusters) => {
  const points = [];
  
  clusters.forEach(cluster => {
    const numPoints = Math.min(cluster.accounts, 50); // Cap at 50 for performance
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const radius = (Math.random() * 0.4 + 0.1) * cluster.size;
      const x = cluster.position.x + Math.cos(angle) * radius * 0.5;
      const y = cluster.position.y + Math.sin(angle) * radius * 0.3;
      
      points.push({
        id: `point-${cluster.id}-${i}`,
        clusterId: cluster.id,
        x: Math.max(5, Math.min(95, x + (Math.random() - 0.5) * 10)),
        y: Math.max(5, Math.min(95, y + (Math.random() - 0.5) * 10)),
        intent: cluster.avgIntentScore + (Math.random() - 0.5) * 30,
        pulsing: Math.random() > 0.7 && cluster.avgIntentScore > 60,
        size: 3 + Math.random() * 4,
      });
    }
  });
  
  return points;
};

export function useLeadHive() {
  const [clusters, setClusters] = useState([]);
  const [leadPoints, setLeadPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  const [filters, setFilters] = useState({
    segment: 'all',
    timeHorizon: 14,
    showSynthetic: true,
  });

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setClusters(MOCK_CLUSTERS);
      setLeadPoints(generateLeadPoints(MOCK_CLUSTERS));
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter clusters based on segment
  const filteredClusters = useMemo(() => {
    if (filters.segment === 'all') return clusters;
    return clusters.filter(c => c.segment.toLowerCase() === filters.segment.toLowerCase());
  }, [clusters, filters.segment]);

  // Filter lead points based on filtered clusters
  const filteredPoints = useMemo(() => {
    const clusterIds = new Set(filteredClusters.map(c => c.id));
    return leadPoints.filter(p => clusterIds.has(p.clusterId));
  }, [leadPoints, filteredClusters]);

  // Calculate summary stats
  const summary = useMemo(() => {
    return {
      totalAccounts: filteredClusters.reduce((acc, c) => acc + c.accounts, 0),
      totalPotentialMeetings: filteredClusters.reduce((acc, c) => acc + c.potentialMeetings, 0),
      avgIntent: filteredClusters.length > 0 
        ? Math.round(filteredClusters.reduce((acc, c) => acc + c.avgIntentScore, 0) / filteredClusters.length)
        : 0,
      highIntentClusters: filteredClusters.filter(c => c.avgIntentScore >= 70).length,
    };
  }, [filteredClusters]);

  // Top 3 active clusters
  const topClusters = useMemo(() => {
    return [...filteredClusters]
      .sort((a, b) => b.avgIntentScore - a.avgIntentScore)
      .slice(0, 3);
  }, [filteredClusters]);

  return {
    clusters: filteredClusters,
    leadPoints: filteredPoints,
    loading,
    filters,
    setFilters,
    selectedCluster,
    setSelectedCluster,
    hoveredPoint,
    setHoveredPoint,
    summary,
    topClusters,
  };
}
