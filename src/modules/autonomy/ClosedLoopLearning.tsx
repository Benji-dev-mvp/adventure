import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  RefreshCw,
  TrendingUp,
  Database,
  Cpu,
  Zap,
  ArrowRight,
  CheckCircle2,
  Clock,
  BarChart3,
  Lightbulb,
} from 'lucide-react';

// Type definitions
interface ModelUpdate {
  component: string;
  description: string;
  beforeMetric: number;
  afterMetric: number;
  confidence: number;
}

interface LearningCycle {
  id: string;
  cycleNumber: number;
  startDate: Date;
  endDate: Date;
  outcomesProcessed: number;
  performanceImprovement: number;
  status: string;
  modelUpdates: ModelUpdate[];
  topInsights: string[];
}

/**
 * Closed-Loop Learning Component
 * Feed reply outcomes into model → rewrite sequences next cycle
 */

const ClosedLoopLearning = () => {
  const [learningCycles, setLearningCycles] = useState<LearningCycle[]>([]);
  const [currentCycle, setCurrentCycle] = useState<LearningCycle | null>(null);
  const [modelMetrics] = useState({
    version: 'v2.4.1',
    lastUpdated: new Date(),
    improvements: 23,
    accuracy: 87,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const mockCycles = [
      {
        id: 'cycle-5',
        cycleNumber: 5,
        startDate: new Date('2024-01-20'),
        endDate: new Date('2024-01-27'),
        outcomesProcessed: 1847,
        performanceImprovement: 12.4,
        status: 'active',
        modelUpdates: [
          {
            component: 'messaging',
            description: 'Updated opening line patterns for VP personas',
            beforeMetric: 2.1,
            afterMetric: 2.8,
            confidence: 91,
          },
          {
            component: 'timing',
            description: 'Refined send time optimization for tech industry',
            beforeMetric: 24.5,
            afterMetric: 31.2,
            confidence: 88,
          },
        ],
        topInsights: [
          'Questions in subject lines increase open rates by 18% for C-level',
          'Follow-ups within 3 days have 2.4x higher response rates',
          'Pain-point messaging outperforms benefit-focused by 34%',
        ],
      },
      {
        id: 'cycle-4',
        cycleNumber: 4,
        startDate: new Date('2024-01-13'),
        endDate: new Date('2024-01-20'),
        outcomesProcessed: 2103,
        performanceImprovement: 8.7,
        status: 'completed',
        modelUpdates: [
          {
            component: 'targeting',
            description: 'Improved ICP scoring for fintech segment',
            beforeMetric: 67,
            afterMetric: 78,
            confidence: 94,
          },
          {
            component: 'scoring',
            description: 'Enhanced lead scoring with engagement signals',
            beforeMetric: 72,
            afterMetric: 81,
            confidence: 89,
          },
        ],
        topInsights: [
          'LinkedIn engagement correlates 0.72 with email response',
          'Morning sends (7-9 AM) optimal for enterprise segment',
        ],
      },
      {
        id: 'cycle-3',
        cycleNumber: 3,
        startDate: new Date('2024-01-06'),
        endDate: new Date('2024-01-13'),
        outcomesProcessed: 1956,
        performanceImprovement: 15.2,
        status: 'completed',
        modelUpdates: [
          {
            component: 'messaging',
            description: 'New personalization patterns identified',
            beforeMetric: 1.8,
            afterMetric: 2.4,
            confidence: 92,
          },
        ],
        topInsights: [
          'Mentioning recent company news increases reply rate by 45%',
          'Shorter emails (< 100 words) perform better for first touch',
        ],
      },
    ];

    setLearningCycles(mockCycles);
    setCurrentCycle(mockCycles[0]);
  }, []);

  const triggerLearningCycle = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  const getComponentIcon = (component: string) => {
    switch (component) {
      case 'messaging':
        return '💬';
      case 'timing':
        return '⏰';
      case 'targeting':
        return '🎯';
      case 'scoring':
        return '📊';
      default:
        return '🔄';
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Closed-Loop Learning</h2>
              <p className="text-sm text-gray-400">Continuous model improvement from outcomes</p>
            </div>
          </div>
          <button
            onClick={triggerLearningCycle}
            disabled={isProcessing}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Trigger Cycle
              </>
            )}
          </button>
        </div>

        {/* Learning Pipeline Visualization */}
        <div className="mt-6 flex items-center justify-between bg-gray-800/50 rounded-lg p-4">
          {[
            { icon: Database, label: 'Collect Outcomes', status: 'active' },
            { icon: BarChart3, label: 'Analyze Patterns', status: 'active' },
            { icon: Cpu, label: 'Update Model', status: isProcessing ? 'processing' : 'waiting' },
            { icon: Lightbulb, label: 'Apply Learnings', status: 'waiting' },
          ].map((step, idx) => (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step.status === 'active'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : step.status === 'processing'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-gray-700 text-gray-500'
                  }`}
                >
                  {step.status === 'processing' ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    >
                      <step.icon className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className="text-xs text-gray-400">{step.label}</span>
              </div>
              {idx < 3 && <ArrowRight className="w-5 h-5 text-gray-600" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-800">
        {/* Model Status */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Model Status
          </h3>
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Current Version</span>
                <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-sm font-mono rounded">
                  {modelMetrics.version}
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Last Updated</span>
                <span className="text-sm text-white">
                  {modelMetrics.lastUpdated.toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Total Improvements</span>
                <span className="text-sm text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {modelMetrics.improvements}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Accuracy Score</span>
                <span className="text-sm text-white">{modelMetrics.accuracy}%</span>
              </div>
            </div>

            {/* Performance Trend */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-3">Performance Trend</h4>
              <div className="h-24 flex items-end gap-1">
                {[65, 68, 72, 75, 78, 82, 85, 87].map((val, idx) => (
                  <motion.div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ delay: idx * 0.1 }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>8 weeks ago</span>
                <span>Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Cycles */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Learning Cycles
          </h3>
          <div className="space-y-3">
            {learningCycles.map(cycle => (
              <motion.button
                key={cycle.id}
                onClick={() => setCurrentCycle(cycle)}
                className={`w-full p-4 rounded-lg border transition-all text-left ${
                  currentCycle?.id === cycle.id
                    ? 'bg-cyan-500/10 border-cyan-500/50'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">Cycle #{cycle.cycleNumber}</span>
                    {cycle.status === 'active' && (
                      <span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 text-xs rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <span className="text-green-400 text-sm flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />+{cycle.performanceImprovement}%
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    {cycle.outcomesProcessed.toLocaleString()} outcomes
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {cycle.startDate.toLocaleDateString()}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Cycle Details */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Cycle Details
          </h3>
          {currentCycle && (
            <div className="space-y-4">
              {/* Model Updates */}
              <div>
                <h4 className="text-sm font-medium text-white mb-3">Model Updates</h4>
                <div className="space-y-2">
                  {currentCycle.modelUpdates.map((update, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-gray-800/50 rounded-lg p-3"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-lg">{getComponentIcon(update.component)}</span>
                        <div>
                          <span className="text-sm font-medium text-white capitalize">
                            {update.component}
                          </span>
                          <p className="text-xs text-gray-400">{update.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500">{update.beforeMetric}</span>
                        <ArrowRight className="w-3 h-3 text-gray-600" />
                        <span className="text-green-400">{update.afterMetric}</span>
                        <span className="text-gray-500 ml-auto">
                          {update.confidence}% confidence
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Top Insights */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-500/20">
                <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  Key Insights
                </h4>
                <ul className="space-y-2">
                  {currentCycle.topInsights.map((insight, idx) => (
                    <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { ClosedLoopLearning };
export default ClosedLoopLearning;
