// TODO: Add proper TypeScript types for this experimental module
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical,
  Play,
  Pause,
  Trophy,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Percent,
  Users,
  Mail,
  MousePointer,
  Calendar,
  Sparkles,
  Plus,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

/**
 * Experiment Engine Component
 * A/B subject lines, CTAs, send times, persona angles
 */

const ExperimentEngine = () => {
  const [experiments, setExperiments] = useState([]);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [suggestedExperiments, setSuggestedExperiments] = useState([]);
  const [stats, setStats] = useState({
    active: 3,
    completed: 24,
    winRate: 68,
    totalLearnings: 156,
  });

  useEffect(() => {
    const mockExperiments = [
      {
        id: 'exp-1',
        name: 'Subject Line: Question vs Statement',
        type: 'subject_line',
        hypothesis: 'Question-based subject lines will increase open rates by 15%',
        status: 'running',
        variants: [
          {
            id: 'v1',
            name: 'Control (Statement)',
            content: 'Increase your sales pipeline by 3x',
            traffic: 50,
            isControl: true,
            isWinner: false,
            metrics: {
              sent: 1250,
              opened: 312,
              clicked: 89,
              replied: 23,
              conversionRate: 1.84,
              statisticalSignificance: 0,
            },
          },
          {
            id: 'v2',
            name: 'Variant (Question)',
            content: 'What if you could 3x your pipeline?',
            traffic: 50,
            isControl: false,
            isWinner: false,
            metrics: {
              sent: 1248,
              opened: 387,
              clicked: 112,
              replied: 34,
              conversionRate: 2.72,
              statisticalSignificance: 94,
            },
          },
        ],
        minSampleSize: 3000,
        currentSampleSize: 2498,
        confidenceLevel: 95,
        startDate: new Date('2024-01-15'),
        autoApply: true,
        learnings: [],
      },
      {
        id: 'exp-2',
        name: 'CTA: Book a Demo vs Start Free Trial',
        type: 'cta',
        hypothesis: 'Start Free Trial will convert 20% more than Book a Demo',
        status: 'completed',
        winner: 'v2',
        variants: [
          {
            id: 'v1',
            name: 'Book a Demo',
            content: 'Book a Demo →',
            traffic: 50,
            isControl: true,
            isWinner: false,
            metrics: {
              sent: 5000,
              opened: 1250,
              clicked: 187,
              replied: 45,
              conversionRate: 0.9,
              statisticalSignificance: 0,
            },
          },
          {
            id: 'v2',
            name: 'Start Free Trial',
            content: 'Start Free Trial →',
            traffic: 50,
            isControl: false,
            isWinner: true,
            metrics: {
              sent: 5000,
              opened: 1275,
              clicked: 268,
              replied: 72,
              conversionRate: 1.44,
              statisticalSignificance: 99,
            },
          },
        ],
        minSampleSize: 10000,
        currentSampleSize: 10000,
        confidenceLevel: 95,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-14'),
        autoApply: true,
        learnings: [
          'Trial CTAs outperform demo CTAs by 60% for SMB segment',
          'Effect diminishes for enterprise prospects',
        ],
      },
      {
        id: 'exp-3',
        name: 'Send Time: Morning vs Afternoon',
        type: 'send_time',
        hypothesis: 'Morning sends (7-9 AM) will have higher engagement than afternoon (1-3 PM)',
        status: 'running',
        variants: [
          {
            id: 'v1',
            name: 'Morning (7-9 AM)',
            content: { start: '07:00', end: '09:00' },
            traffic: 50,
            isControl: false,
            isWinner: false,
            metrics: {
              sent: 890,
              opened: 267,
              clicked: 78,
              replied: 19,
              conversionRate: 2.13,
              statisticalSignificance: 87,
            },
          },
          {
            id: 'v2',
            name: 'Afternoon (1-3 PM)',
            content: { start: '13:00', end: '15:00' },
            traffic: 50,
            isControl: true,
            isWinner: false,
            metrics: {
              sent: 892,
              opened: 214,
              clicked: 56,
              replied: 12,
              conversionRate: 1.34,
              statisticalSignificance: 0,
            },
          },
        ],
        minSampleSize: 2000,
        currentSampleSize: 1782,
        confidenceLevel: 95,
        startDate: new Date('2024-01-18'),
        autoApply: false,
        learnings: [],
      },
    ];

    const mockSuggested = [
      {
        id: 'sug-1',
        type: 'persona_angle',
        name: 'Persona Angle: Pain Point vs Opportunity',
        hypothesis: 'Leading with opportunity messaging will resonate better with VPs',
        potentialImpact: 25,
        confidence: 78,
      },
      {
        id: 'sug-2',
        type: 'subject_line',
        name: 'Subject Line: Personalization Level',
        hypothesis: 'Adding company name to subject will increase opens by 10%',
        potentialImpact: 18,
        confidence: 85,
      },
    ];

    setExperiments(mockExperiments);
    setSelectedExperiment(mockExperiments[0]);
    setSuggestedExperiments(mockSuggested);
  }, []);

  const getStatusColor = status => {
    switch (status) {
      case 'running':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'completed':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'paused':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'inconclusive':
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getTypeIcon = type => {
    switch (type) {
      case 'subject_line':
        return Mail;
      case 'cta':
        return MousePointer;
      case 'send_time':
        return Calendar;
      case 'persona_angle':
        return Users;
      default:
        return FlaskConical;
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Auto-Experimentation Engine</h2>
              <p className="text-sm text-gray-400">
                Continuous A/B testing with automatic optimization
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            New Experiment
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3 mt-6">
          {[
            { label: 'Active', value: stats.active, icon: Play, color: 'text-blue-400' },
            {
              label: 'Completed',
              value: stats.completed,
              icon: CheckCircle2,
              color: 'text-green-400',
            },
            {
              label: 'Win Rate',
              value: `${stats.winRate}%`,
              icon: Trophy,
              color: 'text-amber-400',
            },
            {
              label: 'Learnings',
              value: stats.totalLearnings,
              icon: Sparkles,
              color: 'text-violet-400',
            },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-sm text-gray-400">{stat.label}</span>
              </div>
              <span className="text-lg font-bold text-white">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-800">
        {/* Experiments List */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Active & Recent Experiments
          </h3>
          <div className="space-y-3">
            {experiments.map(exp => {
              const TypeIcon = getTypeIcon(exp.type);
              return (
                <motion.button
                  key={exp.id}
                  onClick={() => setSelectedExperiment(exp)}
                  className={`w-full p-4 rounded-lg border transition-all text-left ${
                    selectedExperiment?.id === exp.id
                      ? 'bg-emerald-500/10 border-emerald-500/50'
                      : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TypeIcon className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-white text-sm">{exp.name}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(exp.status)}`}
                    >
                      {exp.status}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Sample Progress</span>
                      <span>
                        {exp.currentSampleSize}/{exp.minSampleSize}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(exp.currentSampleSize / exp.minSampleSize) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Winner indicator */}
                  {exp.winner && (
                    <div className="flex items-center gap-1.5 text-green-400 text-xs">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>Winner: {exp.variants.find(v => v.id === exp.winner)?.name}</span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Suggested Experiments */}
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mt-6 mb-4">
            AI Suggested Experiments
          </h3>
          <div className="space-y-2">
            {suggestedExperiments.map(sug => (
              <div
                key={sug.id}
                className="p-3 bg-gray-800/30 rounded-lg border border-dashed border-gray-700 hover:border-emerald-500/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-sm text-white">{sug.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      +{sug.potentialImpact}% potential impact
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experiment Details */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Experiment Details
          </h3>
          {selectedExperiment && (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedExperiment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {/* Hypothesis */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-white mb-2">Hypothesis</h4>
                  <p className="text-sm text-gray-300">{selectedExperiment.hypothesis}</p>
                </div>

                {/* Variants Comparison */}
                <div className="space-y-3">
                  {selectedExperiment.variants.map((variant, idx) => (
                    <motion.div
                      key={variant.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`rounded-lg p-4 border ${
                        variant.isWinner
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-gray-800/50 border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-medium ${variant.isWinner ? 'text-green-400' : 'text-white'}`}
                          >
                            {variant.name}
                          </span>
                          {variant.isControl && (
                            <span className="px-1.5 py-0.5 bg-gray-700 text-gray-400 text-xs rounded">
                              Control
                            </span>
                          )}
                          {variant.isWinner && <Trophy className="w-4 h-4 text-green-400" />}
                        </div>
                        <span className="text-sm text-gray-400">{variant.traffic}% traffic</span>
                      </div>

                      {/* Variant Content */}
                      <div className="bg-gray-900/50 rounded p-2 mb-3">
                        <code className="text-xs text-gray-300">
                          {typeof variant.content === 'string'
                            ? variant.content
                            : JSON.stringify(variant.content)}
                        </code>
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: 'Sent', value: variant.metrics.sent },
                          {
                            label: 'Opened',
                            value: variant.metrics.opened,
                            rate: ((variant.metrics.opened / variant.metrics.sent) * 100).toFixed(
                              1
                            ),
                          },
                          {
                            label: 'Clicked',
                            value: variant.metrics.clicked,
                            rate: ((variant.metrics.clicked / variant.metrics.sent) * 100).toFixed(
                              1
                            ),
                          },
                          {
                            label: 'Replied',
                            value: variant.metrics.replied,
                            rate: ((variant.metrics.replied / variant.metrics.sent) * 100).toFixed(
                              1
                            ),
                          },
                        ].map(metric => (
                          <div key={metric.label} className="text-center">
                            <div className="text-lg font-semibold text-white">{metric.value}</div>
                            <div className="text-xs text-gray-500">
                              {metric.label}
                              {metric.rate && (
                                <span className="ml-1 text-gray-400">({metric.rate}%)</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Statistical Significance */}
                      {variant.metrics.statisticalSignificance > 0 && (
                        <div className="mt-3 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">Statistical significance:</span>
                          <span
                            className={`text-sm font-medium ${
                              variant.metrics.statisticalSignificance >= 95
                                ? 'text-green-400'
                                : 'text-amber-400'
                            }`}
                          >
                            {variant.metrics.statisticalSignificance}%
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Learnings */}
                {selectedExperiment.learnings.length > 0 && (
                  <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg p-4 border border-emerald-500/20">
                    <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Key Learnings
                    </h4>
                    <ul className="space-y-1.5">
                      {selectedExperiment.learnings.map((learning, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          {learning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Controls */}
                <div className="flex gap-2">
                  {selectedExperiment.status === 'running' ? (
                    <>
                      <button className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <Pause className="w-4 h-4" />
                        Pause
                      </button>
                      <button className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <Trophy className="w-4 h-4" />
                        Declare Winner
                      </button>
                    </>
                  ) : (
                    <button className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors">
                      <Play className="w-4 h-4" />
                      Restart Experiment
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export { ExperimentEngine };
export default ExperimentEngine;
