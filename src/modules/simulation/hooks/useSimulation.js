import { useState, useEffect, useMemo } from 'react';

// Strategy templates
const STRATEGIES = [
  {
    id: 'strategy-a',
    name: 'Strategy A',
    label: 'Aggressive Growth',
    description: 'High-volume outreach with aggressive messaging',
    model: 'aggressive',
    config: {
      volumeMultiplier: 2.5,
      replyRateBase: 3.5,
      conversionRates: { demo: 0.25, proposal: 0.45, close: 0.35 },
      channelMix: { email: 60, linkedin: 25, phone: 12, sms: 3 },
    },
  },
  {
    id: 'strategy-b',
    name: 'Strategy B',
    label: 'Balanced Approach',
    description: 'Moderate volume with personalized messaging',
    model: 'balanced',
    config: {
      volumeMultiplier: 1.5,
      replyRateBase: 5.5,
      conversionRates: { demo: 0.32, proposal: 0.52, close: 0.38 },
      channelMix: { email: 45, linkedin: 35, phone: 15, sms: 5 },
    },
  },
  {
    id: 'strategy-c',
    name: 'Strategy C',
    label: 'Conservative Quality',
    description: 'Low volume, high-touch account-based approach',
    model: 'conservative',
    config: {
      volumeMultiplier: 0.8,
      replyRateBase: 8.0,
      conversionRates: { demo: 0.42, proposal: 0.62, close: 0.45 },
      channelMix: { email: 30, linkedin: 40, phone: 25, sms: 5 },
    },
  },
];

// Risk categories
const RISK_CATEGORIES = [
  { id: 'market-fit', label: 'Market Fit', description: 'Risk of messaging not resonating with target market' },
  { id: 'message-fit', label: 'Message Fit', description: 'Risk of value proposition misalignment' },
  { id: 'channel-saturation', label: 'Channel Saturation', description: 'Risk of diminishing returns from channel overuse' },
  { id: 'capacity', label: 'Capacity', description: 'Risk of team capacity constraints' },
];

// Generate projection data for a strategy
const generateProjectionData = (strategy, params) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const { acv, monthlyVolume, seats } = params;
  const { volumeMultiplier, replyRateBase, conversionRates } = strategy.config;
  
  let cumulative = 0;
  const data = months.map((month, index) => {
    // Ramp up effect
    const rampFactor = Math.min(1, (index + 1) / 2);
    
    // Calculate funnel
    const contacts = monthlyVolume * volumeMultiplier * rampFactor;
    const replies = contacts * (replyRateBase / 100);
    const demos = replies * conversionRates.demo;
    const proposals = demos * conversionRates.proposal;
    const closed = proposals * conversionRates.close;
    
    // Pipeline value
    const monthlyPipeline = closed * acv;
    cumulative += monthlyPipeline;
    
    // Confidence bands (narrower as model is more conservative)
    const confidenceWidth = strategy.model === 'aggressive' ? 0.4 : 
                           strategy.model === 'balanced' ? 0.25 : 0.15;
    
    return {
      month,
      pipeline: Math.round(cumulative),
      low: Math.round(cumulative * (1 - confidenceWidth)),
      high: Math.round(cumulative * (1 + confidenceWidth)),
      meetings: Math.round(demos * (index + 1)),
    };
  });
  
  return data;
};

// Calculate risk scores for a strategy
const calculateRisks = (strategy, params) => {
  const { model, config } = strategy;
  
  const risks = {
    'market-fit': model === 'aggressive' ? 65 : model === 'balanced' ? 35 : 20,
    'message-fit': model === 'aggressive' ? 55 : model === 'balanced' ? 30 : 15,
    'channel-saturation': config.channelMix.email > 50 ? 70 : config.channelMix.email > 40 ? 45 : 25,
    'capacity': params.seats < 3 && config.volumeMultiplier > 1.5 ? 75 : 
                params.seats < 5 && config.volumeMultiplier > 2 ? 60 : 30,
  };
  
  return RISK_CATEGORIES.map(cat => ({
    ...cat,
    score: risks[cat.id],
    level: risks[cat.id] >= 60 ? 'high' : risks[cat.id] >= 40 ? 'medium' : 'low',
  }));
};

export function useSimulation() {
  const [loading, setLoading] = useState(true);
  const [selectedStrategies, setSelectedStrategies] = useState(['strategy-a', 'strategy-b', 'strategy-c']);
  const [activeStrategy, setActiveStrategy] = useState('strategy-b');
  
  // Simulation parameters
  const [params, setParams] = useState({
    acv: 50000,
    monthlyVolume: 2000,
    seats: 5,
    replyRateAssumption: 5,
    demoConversion: 30,
    proposalConversion: 50,
    closeRate: 35,
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Generate projections for each strategy
  const projections = useMemo(() => {
    return STRATEGIES.reduce((acc, strategy) => {
      acc[strategy.id] = generateProjectionData(strategy, params);
      return acc;
    }, {});
  }, [params]);

  // Calculate risks for active strategy
  const activeStrategyData = useMemo(() => {
    const strategy = STRATEGIES.find(s => s.id === activeStrategy);
    if (!strategy) return null;
    
    const projection = projections[activeStrategy];
    const risks = calculateRisks(strategy, params);
    const finalPipeline = projection[projection.length - 1]?.pipeline || 0;
    const totalMeetings = projection[projection.length - 1]?.meetings || 0;
    
    // Calculate overall confidence
    const avgRisk = risks.reduce((sum, r) => sum + r.score, 0) / risks.length;
    const confidence = Math.round(100 - avgRisk);
    
    return {
      ...strategy,
      projection,
      risks,
      summary: {
        projectedPipeline: finalPipeline,
        projectedMeetings: totalMeetings,
        confidence,
        roi: Math.round((finalPipeline / (params.seats * 3588 * 6)) * 100), // 6 month ROI
      },
    };
  }, [activeStrategy, projections, params]);

  // Get recommendation
  const recommendation = useMemo(() => {
    // Simple recommendation logic - prefer balanced unless specific conditions
    if (params.seats >= 5 && params.acv >= 75000) {
      return {
        strategyId: 'strategy-c',
        reason: 'With your team size and high ACV, a conservative ABM approach will maximize deal quality.',
      };
    }
    if (params.seats >= 3 && params.acv >= 30000) {
      return {
        strategyId: 'strategy-b',
        reason: 'A balanced approach optimizes for both volume and conversion with your current resources.',
      };
    }
    return {
      strategyId: 'strategy-a',
      reason: 'Aggressive outreach is recommended to quickly build pipeline with your lean team.',
    };
  }, [params]);

  return {
    strategies: STRATEGIES,
    selectedStrategies,
    setSelectedStrategies,
    activeStrategy,
    setActiveStrategy,
    params,
    setParams,
    updateParam: (key, value) => setParams(prev => ({ ...prev, [key]: value })),
    projections,
    activeStrategyData,
    recommendation,
    loading,
    riskCategories: RISK_CATEGORIES,
  };
}
