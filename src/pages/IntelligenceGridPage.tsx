/**
 * Intelligence Grid Page
 * 
 * Federated learning dashboard, industry benchmarks,
 * and predictive analytics visualization.
 */

import React, { useState } from 'react';

// === Types ===

interface BenchmarkMetric {
  name: string;
  yourValue: number;
  benchmarkMedian: number;
  percentile: number;
  trend: 'up' | 'down' | 'stable';
}

interface ModelInfo {
  id: string;
  name: string;
  type: string;
  accuracy: number;
  contributors: number;
  lastUpdated: string;
  status: 'training' | 'ready' | 'outdated';
}

interface Prediction {
  target: string;
  probability: number;
  confidence: number;
  factors: Array<{ name: string; impact: number }>;
}

// === Mock Data ===

const BENCHMARK_METRICS: BenchmarkMetric[] = [
  { name: 'Cold Email Reply Rate', yourValue: 0.052, benchmarkMedian: 0.045, percentile: 68, trend: 'up' },
  { name: 'Sequence Reply Rate', yourValue: 0.11, benchmarkMedian: 0.12, percentile: 45, trend: 'stable' },
  { name: 'Reply to Meeting Rate', yourValue: 0.28, benchmarkMedian: 0.25, percentile: 62, trend: 'up' },
  { name: 'Meeting Show Rate', yourValue: 0.75, benchmarkMedian: 0.80, percentile: 35, trend: 'down' },
  { name: 'Sales Cycle (days)', yourValue: 48, benchmarkMedian: 55, percentile: 72, trend: 'up' },
  { name: 'Deals per Rep/Month', yourValue: 4.5, benchmarkMedian: 5, percentile: 42, trend: 'stable' },
];

const MODELS: ModelInfo[] = [
  { id: '1', name: 'Reply Predictor', type: 'reply-prediction', accuracy: 0.78, contributors: 234, lastUpdated: '2h ago', status: 'ready' },
  { id: '2', name: 'Meeting Converter', type: 'meeting-conversion', accuracy: 0.72, contributors: 189, lastUpdated: '4h ago', status: 'ready' },
  { id: '3', name: 'Persona Classifier', type: 'persona-classification', accuracy: 0.85, contributors: 312, lastUpdated: '1h ago', status: 'training' },
  { id: '4', name: 'Timing Optimizer', type: 'timing-prediction', accuracy: 0.68, contributors: 156, lastUpdated: '12h ago', status: 'outdated' },
];

const PREDICTIONS: Prediction[] = [
  {
    target: 'Acme Corp - John Smith',
    probability: 0.78,
    confidence: 0.85,
    factors: [
      { name: 'Recent website visit', impact: 0.25 },
      { name: 'Email opened 3x', impact: 0.2 },
      { name: 'Company hiring signals', impact: 0.15 },
    ],
  },
  {
    target: 'TechStart Inc - Sarah Lee',
    probability: 0.45,
    confidence: 0.72,
    factors: [
      { name: 'Low engagement score', impact: -0.2 },
      { name: 'Industry match', impact: 0.15 },
      { name: 'Small company size', impact: -0.1 },
    ],
  },
  {
    target: 'Global Corp - Mike Johnson',
    probability: 0.92,
    confidence: 0.91,
    factors: [
      { name: 'Requested demo', impact: 0.35 },
      { name: 'Decision maker role', impact: 0.25 },
      { name: 'Budget confirmed', impact: 0.2 },
    ],
  },
];

// === Components ===

const BenchmarkCard: React.FC<{ metric: BenchmarkMetric }> = ({ metric }) => {
  const isPercentage = metric.name.includes('Rate');
  const formatValue = (v: number) => isPercentage ? `${(v * 100).toFixed(1)}%` : v.toString();
  
  const status = metric.percentile >= 60 ? 'outperforming' : metric.percentile >= 40 ? 'average' : 'underperforming';
  const statusColors = {
    outperforming: 'text-green-400 bg-green-500/10',
    average: 'text-yellow-400 bg-yellow-500/10',
    underperforming: 'text-red-400 bg-red-500/10',
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm">{metric.name}</span>
        <span className={`px-2 py-0.5 rounded text-xs ${statusColors[status]}`}>
          {metric.percentile}th percentile
        </span>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold text-white">{formatValue(metric.yourValue)}</span>
        <span className="text-gray-500 text-sm">vs {formatValue(metric.benchmarkMedian)} median</span>
      </div>
      <div className="mt-2 flex items-center gap-1">
        {metric.trend === 'up' && <span className="text-green-400">↑</span>}
        {metric.trend === 'down' && <span className="text-red-400">↓</span>}
        {metric.trend === 'stable' && <span className="text-gray-400">→</span>}
        <span className="text-xs text-gray-500">vs last month</span>
      </div>
    </div>
  );
};

const ModelCard: React.FC<{ model: ModelInfo }> = ({ model }) => {
  const statusColors = {
    training: 'bg-blue-500 animate-pulse',
    ready: 'bg-green-500',
    outdated: 'bg-yellow-500',
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-white">{model.name}</span>
        <div className={`w-2 h-2 rounded-full ${statusColors[model.status]}`} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500">Accuracy</span>
          <div className="text-white font-medium">{(model.accuracy * 100).toFixed(0)}%</div>
        </div>
        <div>
          <span className="text-gray-500">Contributors</span>
          <div className="text-white font-medium">{model.contributors}</div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between text-xs">
        <span className="text-gray-500">Updated {model.lastUpdated}</span>
        <button className="text-blue-400 hover:text-blue-300">Join Training →</button>
      </div>
    </div>
  );
};

const PredictionCard: React.FC<{ prediction: Prediction }> = ({ prediction }) => {
  const probColor = prediction.probability >= 0.7 ? 'text-green-400' : 
                    prediction.probability >= 0.4 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-white">{prediction.target}</span>
        <div className={`text-xl font-bold ${probColor}`}>
          {(prediction.probability * 100).toFixed(0)}%
        </div>
      </div>
      
      {/* Probability Bar */}
      <div className="h-2 bg-gray-700 rounded-full mb-3 overflow-hidden">
        <div 
          className={`h-full ${probColor.replace('text-', 'bg-')}`}
          style={{ width: `${prediction.probability * 100}%` }}
        />
      </div>

      {/* Factors */}
      <div className="space-y-2">
        {prediction.factors.slice(0, 3).map((factor, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{factor.name}</span>
            <span className={factor.impact >= 0 ? 'text-green-400' : 'text-red-400'}>
              {factor.impact >= 0 ? '+' : ''}{(factor.impact * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs text-gray-500">
        Confidence: {(prediction.confidence * 100).toFixed(0)}%
      </div>
    </div>
  );
};

const RadarChart: React.FC<{ data: BenchmarkMetric[] }> = ({ data }) => {
  // Simplified radar chart using SVG
  const size = 200;
  const center = size / 2;
  const maxRadius = (size / 2) - 20;
  
  const points = data.map((m, i) => {
    const angle = (i / data.length) * Math.PI * 2 - Math.PI / 2;
    const radius = (m.percentile / 100) * maxRadius;
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
      labelX: center + Math.cos(angle) * (maxRadius + 15),
      labelY: center + Math.sin(angle) * (maxRadius + 15),
    };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Grid circles */}
      {[0.25, 0.5, 0.75, 1].map(r => (
        <circle
          key={r}
          cx={center}
          cy={center}
          r={maxRadius * r}
          fill="none"
          stroke="#374151"
          strokeWidth="1"
        />
      ))}
      
      {/* Grid lines */}
      {data.map((_, i) => {
        const angle = (i / data.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + Math.cos(angle) * maxRadius}
            y2={center + Math.sin(angle) * maxRadius}
            stroke="#374151"
            strokeWidth="1"
          />
        );
      })}
      
      {/* Data polygon */}
      <path d={pathD} fill="rgba(59, 130, 246, 0.3)" stroke="#3B82F6" strokeWidth="2" />
      
      {/* Data points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#3B82F6" />
      ))}
    </svg>
  );
};

// === Main Page ===

export const IntelligenceGridPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'benchmarks' | 'models' | 'predictions'>('benchmarks');
  const [industry, setIndustry] = useState('all');

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Intelligence Grid</h1>
          <p className="text-gray-400">Federated learning & collective intelligence</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="all">All Industries</option>
            <option value="saas">SaaS</option>
            <option value="fintech">FinTech</option>
            <option value="healthcare">Healthcare</option>
            <option value="ecommerce">E-Commerce</option>
          </select>
          <div className="px-4 py-2 bg-blue-600/20 rounded-lg text-blue-400 text-sm">
            🔒 Privacy Preserved
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['benchmarks', 'models', 'predictions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Benchmarks Tab */}
      {activeTab === 'benchmarks' && (
        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-3">
            <div className="grid grid-cols-3 gap-4">
              {BENCHMARK_METRICS.map((metric, i) => (
                <BenchmarkCard key={i} metric={metric} />
              ))}
            </div>
            
            {/* Recommendations */}
            <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Benchmark Insights</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                  <span className="text-green-400 text-xl">✓</span>
                  <div>
                    <div className="font-medium text-green-400">Sales Cycle Efficiency</div>
                    <div className="text-sm text-gray-400">
                      Your 48-day cycle is 13% faster than median. Share your process.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                  <span className="text-yellow-400 text-xl">!</span>
                  <div>
                    <div className="font-medium text-yellow-400">Meeting Show Rate</div>
                    <div className="text-sm text-gray-400">
                      At 75%, you're below median. Top performers use reminder sequences.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-center">Performance Radar</h3>
            <RadarChart data={BENCHMARK_METRICS} />
            <div className="mt-4 text-center">
              <div className="text-2xl font-bold text-blue-400">52nd</div>
              <div className="text-sm text-gray-400">Overall Percentile</div>
            </div>
          </div>
        </div>
      )}

      {/* Models Tab */}
      {activeTab === 'models' && (
        <div>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="text-gray-400 text-sm">Active Models</div>
              <div className="text-2xl font-bold text-white">4</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="text-gray-400 text-sm">Total Contributors</div>
              <div className="text-2xl font-bold text-white">891</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="text-gray-400 text-sm">Avg Accuracy</div>
              <div className="text-2xl font-bold text-green-400">76%</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="text-gray-400 text-sm">Privacy Budget</div>
              <div className="text-2xl font-bold text-blue-400">ε = 1.2</div>
            </div>
          </div>

          {/* Model Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {MODELS.map(model => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>

          {/* How It Works */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">How Federated Learning Works</h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: '🔒', title: 'Data Stays Local', desc: 'Your data never leaves your environment' },
                { icon: '🧠', title: 'Train Locally', desc: 'Models train on your private data' },
                { icon: '📤', title: 'Share Gradients', desc: 'Only encrypted gradients are shared' },
                { icon: '🌐', title: 'Global Model', desc: 'Aggregated model benefits everyone' },
              ].map((step, i) => (
                <div key={i} className="text-center p-4">
                  <div className="text-3xl mb-2">{step.icon}</div>
                  <div className="font-medium text-white">{step.title}</div>
                  <div className="text-sm text-gray-400">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Predictions Tab */}
      {activeTab === 'predictions' && (
        <div>
          {/* Prediction Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="text-gray-400 text-sm">Predictions Today</div>
              <div className="text-2xl font-bold text-white">1,234</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="text-gray-400 text-sm">Avg Confidence</div>
              <div className="text-2xl font-bold text-green-400">82%</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="text-gray-400 text-sm">High Probability Leads</div>
              <div className="text-2xl font-bold text-blue-400">47</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="text-gray-400 text-sm">Prediction Accuracy</div>
              <div className="text-2xl font-bold text-white">74%</div>
            </div>
          </div>

          {/* Predictions */}
          <div className="grid grid-cols-3 gap-4">
            {PREDICTIONS.map((pred, i) => (
              <PredictionCard key={i} prediction={pred} />
            ))}
          </div>

          {/* Trends */}
          <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Trend Insights</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Best Send Time</div>
                <div className="text-xl font-bold text-white">Tuesday 9-11am</div>
                <div className="text-sm text-green-400">+23% open rate</div>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Top Persona</div>
                <div className="text-xl font-bold text-white">VP Sales</div>
                <div className="text-sm text-green-400">3.2x reply rate</div>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Market Signal</div>
                <div className="text-xl font-bold text-white">Hiring Surge</div>
                <div className="text-sm text-green-400">+45% conversion</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntelligenceGridPage;
