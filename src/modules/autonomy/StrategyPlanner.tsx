// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Target,
  TrendingUp,
  Zap,
  Settings2,
  Play,
  Pause,
  RotateCcw,
  Lightbulb,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

/**
 * Strategy Planner Component
 * AI chooses best outbound motion (ICP, persona, channel mix)
 */

interface ICP {
  name: string;
  industry: string[];
  companySize: { min: number; max: number };
  technologies: string[];
}

interface Strategy {
  id: string;
  name: string;
  goalType: string;
  targetMetric: number;
  currentMetric: number;
  confidence: number;
  status: 'active' | 'planning' | 'paused';
  channelMix: string[];
  icp: ICP;
  reasoning: string;
}

interface Recommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
}

interface StrategyPlannerProps {
  onStrategyChange?: (strategy: Strategy | null) => void;
}

const StrategyPlanner: React.FC<StrategyPlannerProps> = ({ onStrategyChange }) => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [activeStrategy, setActiveStrategy] = useState<Strategy | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    const mockStrategies = [
      {
        id: 'strat-1',
        name: 'Enterprise SaaS Expansion',
        goalType: 'meetings',
        targetMetric: 50,
        currentMetric: 23,
        confidence: 87,
        status: 'active',
        channelMix: ['email', 'linkedin'],
        icp: {
          name: 'Enterprise SaaS',
          industry: ['Technology', 'SaaS'],
          companySize: { min: 500, max: 5000 },
          technologies: ['Salesforce', 'HubSpot'],
        },
        reasoning:
          'High intent signals detected in enterprise segment. Email + LinkedIn combo showing 3.2x better response rates.',
      },
      {
        id: 'strat-2',
        name: 'Midmarket Finance Push',
        goalType: 'pipeline',
        targetMetric: 500000,
        currentMetric: 180000,
        confidence: 72,
        status: 'planning',
        channelMix: ['email', 'phone'],
        icp: {
          name: 'Midmarket Finance',
          industry: ['Financial Services', 'Banking'],
          companySize: { min: 100, max: 500 },
          technologies: ['Workday', 'Oracle'],
        },
        reasoning:
          'Q4 budget cycles create opportunity window. Phone follow-ups increase conversion 2.1x.',
      },
    ];

    const mockRecommendations = [
      {
        id: 'rec-1',
        type: 'channel',
        title: 'Add LinkedIn Voice Messages',
        description: 'Voice messages show 40% higher response rate for your ICP',
        impact: 'high',
        confidence: 89,
      },
      {
        id: 'rec-2',
        type: 'timing',
        title: 'Shift Send Times to 7-9 AM',
        description: 'Your audience opens emails 2.3x more in early morning',
        impact: 'medium',
        confidence: 76,
      },
      {
        id: 'rec-3',
        type: 'targeting',
        title: 'Expand to Healthcare Vertical',
        description: 'Similar buying patterns detected with high fit scores',
        impact: 'high',
        confidence: 82,
      },
    ];

    setStrategies(mockStrategies);
    setActiveStrategy(mockStrategies[0]);
    setRecommendations(mockRecommendations);
  }, []);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  const getStatusColor = (status: Strategy['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/10';
      case 'planning':
        return 'text-blue-400 bg-blue-400/10';
      case 'paused':
        return 'text-amber-400 bg-amber-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getImpactColor = (impact: Recommendation['impact']) => {
    switch (impact) {
      case 'high':
        return 'text-green-400';
      case 'medium':
        return 'text-amber-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Strategy Planner</h2>
              <p className="text-sm text-gray-400">AI-powered outbound motion optimization</p>
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.div>
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Re-analyze
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:divide-x divide-gray-800">
        {/* Strategy List */}
        <div className="p-4 space-y-3">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Active Strategies
          </h3>
          {strategies.map(strategy => (
            <motion.button
              key={strategy.id}
              onClick={() => setActiveStrategy(strategy)}
              className={`w-full p-4 rounded-lg border transition-all text-left ${
                activeStrategy?.id === strategy.id
                  ? 'bg-violet-500/10 border-violet-500/50'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-medium text-white">{strategy.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(strategy.status)}`}
                >
                  {strategy.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-gray-400">
                    {strategy.currentMetric}/{strategy.targetMetric}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400">{strategy.confidence}%</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-3 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(strategy.currentMetric / strategy.targetMetric) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Strategy Details */}
        <div className="p-4 lg:col-span-1">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Strategy Details
          </h3>
          {activeStrategy && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStrategy.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* ICP Info */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-violet-400" />
                    ICP Configuration
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Industry</span>
                      <span className="text-white">{activeStrategy.icp.industry.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Company Size</span>
                      <span className="text-white">
                        {activeStrategy.icp.companySize.min}-{activeStrategy.icp.companySize.max}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tech Stack</span>
                      <span className="text-white">
                        {activeStrategy.icp.technologies.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Channel Mix */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Channel Mix
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeStrategy.channelMix.map(channel => (
                      <span
                        key={channel}
                        className="px-3 py-1 bg-gray-700 rounded-full text-sm text-white capitalize"
                      >
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-lg p-4 border border-violet-500/20">
                  <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    AI Reasoning
                  </h4>
                  <p className="text-sm text-gray-300">{activeStrategy.reasoning}</p>
                </div>

                {/* Controls */}
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <Settings2 className="w-4 h-4" />
                    Configure
                  </button>
                  <button className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors">
                    {activeStrategy.status === 'active' ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Activate
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Recommendations */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            AI Recommendations
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      rec.impact === 'high' ? 'bg-green-500/10' : 'bg-amber-500/10'
                    }`}
                  >
                    {rec.type === 'channel' && (
                      <Zap className={`w-4 h-4 ${getImpactColor(rec.impact)}`} />
                    )}
                    {rec.type === 'timing' && (
                      <Clock className={`w-4 h-4 ${getImpactColor(rec.impact)}`} />
                    )}
                    {rec.type === 'targeting' && (
                      <Target className={`w-4 h-4 ${getImpactColor(rec.impact)}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white text-sm">{rec.title}</span>
                      <span className={`text-xs ${getImpactColor(rec.impact)}`}>
                        {rec.impact} impact
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{rec.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-500 rounded-full"
                          style={{ width: `${rec.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{rec.confidence}%</span>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-3 px-3 py-1.5 bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  Apply Recommendation
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { StrategyPlanner };
export default StrategyPlanner;
