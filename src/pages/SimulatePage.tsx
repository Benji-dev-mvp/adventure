/**
 * Simulate Page
 * 
 * Monte Carlo simulation interface for predictive
 * pipeline modeling and strategy stress testing.
 */

import React, { useState, useCallback } from 'react';

// === Types ===

interface SimulationConfig {
  iterations: number;
  timeHorizon: number;
  confidenceLevel: number;
  accounts: number;
  avgDealSize: number;
  replyRate: number;
  meetingRate: number;
}

interface SimulationResult {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  metrics?: {
    expectedRevenue: { mean: number; low: number; high: number };
    expectedDeals: { mean: number; low: number; high: number };
    roi: { mean: number; low: number; high: number };
    probabilityOfSuccess: number;
  };
  insights?: Array<{
    type: 'warning' | 'opportunity' | 'risk';
    title: string;
    description: string;
  }>;
  runTime?: number;
}

// === Components ===

const ConfigSlider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}> = ({ label, value, min, max, step = 1, unit, onChange }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-medium">
        {value.toLocaleString()}{unit && ` ${unit}`}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
    />
    <div className="flex justify-between text-xs text-gray-500 mt-1">
      <span>{min.toLocaleString()}</span>
      <span>{max.toLocaleString()}</span>
    </div>
  </div>
);

const MetricDisplay: React.FC<{
  label: string;
  value: { mean: number; low: number; high: number };
  format?: 'currency' | 'number' | 'percent';
}> = ({ label, value, format = 'number' }) => {
  const formatValue = (v: number) => {
    switch (format) {
      case 'currency':
        return `$${v.toLocaleString()}`;
      case 'percent':
        return `${(v * 100).toFixed(1)}%`;
      default:
        return v.toLocaleString();
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <div className="text-gray-400 text-sm mb-2">{label}</div>
      <div className="text-3xl font-bold text-white mb-2">
        {formatValue(value.mean)}
      </div>
      <div className="text-sm text-gray-400">
        95% CI: {formatValue(value.low)} - {formatValue(value.high)}
      </div>
    </div>
  );
};

const DistributionChart: React.FC<{ data: number[] }> = ({ data }) => {
  const max = Math.max(...data);
  
  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((value, i) => (
        <div
          key={i}
          className="flex-1 bg-blue-500 rounded-t opacity-70 hover:opacity-100 transition-opacity"
          style={{ height: `${(value / max) * 100}%` }}
          title={`${value.toFixed(0)}`}
        />
      ))}
    </div>
  );
};

const InsightCard: React.FC<{
  type: 'warning' | 'opportunity' | 'risk';
  title: string;
  description: string;
}> = ({ type, title, description }) => {
  const colors = {
    warning: 'border-yellow-500 bg-yellow-500/10',
    opportunity: 'border-green-500 bg-green-500/10',
    risk: 'border-red-500 bg-red-500/10',
  };

  const icons = {
    warning: '⚠️',
    opportunity: '💡',
    risk: '🚨',
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 ${colors[type]}`}>
      <div className="flex items-center gap-2 mb-1">
        <span>{icons[type]}</span>
        <span className="font-semibold text-white">{title}</span>
      </div>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
};

// === Main Page ===

export const SimulatePage: React.FC = () => {
  const [config, setConfig] = useState<SimulationConfig>({
    iterations: 1000,
    timeHorizon: 90,
    confidenceLevel: 0.95,
    accounts: 500,
    avgDealSize: 15000,
    replyRate: 0.05,
    meetingRate: 0.25,
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const updateConfig = useCallback((key: keyof SimulationConfig, value: number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const runSimulation = useCallback(() => {
    setIsRunning(true);
    setResult({
      id: `sim_${Date.now()}`,
      status: 'running',
      progress: 0,
    });

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Generate mock results
        const expectedRevenue = config.accounts * config.avgDealSize * config.replyRate * config.meetingRate * 0.2;
        const variance = expectedRevenue * 0.3;
        
        setResult({
          id: `sim_${Date.now()}`,
          status: 'completed',
          progress: 100,
          metrics: {
            expectedRevenue: {
              mean: expectedRevenue,
              low: expectedRevenue - variance,
              high: expectedRevenue + variance,
            },
            expectedDeals: {
              mean: Math.floor(config.accounts * config.replyRate * config.meetingRate * 0.2),
              low: Math.floor(config.accounts * config.replyRate * config.meetingRate * 0.15),
              high: Math.floor(config.accounts * config.replyRate * config.meetingRate * 0.25),
            },
            roi: {
              mean: 3.5,
              low: 2.1,
              high: 5.2,
            },
            probabilityOfSuccess: 0.72,
          },
          insights: [
            {
              type: 'opportunity',
              title: 'High Upside Potential',
              description: 'Top 5% scenarios show 2.5x revenue above baseline. Focus on high-intent accounts.',
            },
            {
              type: 'warning',
              title: 'Reply Rate Sensitivity',
              description: 'A 10% improvement in reply rate could add $45K in expected revenue.',
            },
            {
              type: 'risk',
              title: 'Market Volatility',
              description: '15% chance of negative ROI in pessimistic scenarios. Consider hedging.',
            },
          ],
          runTime: 2.3,
        });
        setIsRunning(false);
      } else {
        setResult(prev => prev ? { ...prev, progress } : null);
      }
    }, 200);
  }, [config]);

  // Mock distribution data
  const distributionData = Array(30).fill(0).map(() => Math.random() * 100);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Simulation Engine</h1>
        <p className="text-gray-400">Monte Carlo pipeline predictions and strategy stress testing</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6">Simulation Parameters</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-4">Engine Settings</h3>
              <ConfigSlider
                label="Iterations"
                value={config.iterations}
                min={100}
                max={10000}
                step={100}
                onChange={(v) => updateConfig('iterations', v)}
              />
              <ConfigSlider
                label="Time Horizon"
                value={config.timeHorizon}
                min={30}
                max={365}
                unit="days"
                onChange={(v) => updateConfig('timeHorizon', v)}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-4">Pipeline Parameters</h3>
              <ConfigSlider
                label="Target Accounts"
                value={config.accounts}
                min={100}
                max={5000}
                step={50}
                onChange={(v) => updateConfig('accounts', v)}
              />
              <ConfigSlider
                label="Average Deal Size"
                value={config.avgDealSize}
                min={1000}
                max={100000}
                step={1000}
                unit="$"
                onChange={(v) => updateConfig('avgDealSize', v)}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-4">Conversion Rates</h3>
              <ConfigSlider
                label="Expected Reply Rate"
                value={config.replyRate * 100}
                min={1}
                max={20}
                step={0.5}
                unit="%"
                onChange={(v) => updateConfig('replyRate', v / 100)}
              />
              <ConfigSlider
                label="Reply to Meeting Rate"
                value={config.meetingRate * 100}
                min={10}
                max={50}
                step={1}
                unit="%"
                onChange={(v) => updateConfig('meetingRate', v / 100)}
              />
            </div>
          </div>

          <button
            onClick={runSimulation}
            disabled={isRunning}
            className={`w-full mt-6 py-3 rounded-lg font-semibold transition-colors ${
              isRunning
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isRunning ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Running... {result?.progress.toFixed(0)}%
              </span>
            ) : (
              '▶ Run Simulation'
            )}
          </button>
        </div>

        {/* Results Panel */}
        <div className="col-span-2">
          {result?.status === 'completed' && result.metrics ? (
            <>
              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <MetricDisplay
                  label="Expected Revenue"
                  value={result.metrics.expectedRevenue}
                  format="currency"
                />
                <MetricDisplay
                  label="Expected Deals"
                  value={result.metrics.expectedDeals}
                />
                <MetricDisplay
                  label="Expected ROI"
                  value={result.metrics.roi}
                />
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="text-gray-400 text-sm mb-2">Success Probability</div>
                  <div className="text-3xl font-bold text-green-400">
                    {(result.metrics.probabilityOfSuccess * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-400">
                    Based on {config.iterations.toLocaleString()} simulations
                  </div>
                </div>
              </div>

              {/* Distribution Chart */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                <h3 className="text-lg font-semibold mb-4">Revenue Distribution</h3>
                <DistributionChart data={distributionData} />
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>$0</span>
                  <span>← 95% Confidence Interval →</span>
                  <span>${(result.metrics.expectedRevenue.high * 1.5).toLocaleString()}</span>
                </div>
              </div>

              {/* Insights */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Simulation Insights</h3>
                <div className="space-y-4">
                  {result.insights?.map((insight, i) => (
                    <InsightCard key={i} {...insight} />
                  ))}
                </div>
              </div>

              {/* Run Info */}
              <div className="mt-4 text-sm text-gray-500 text-right">
                Simulation completed in {result.runTime}s
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">🎲</div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  Configure and Run Simulation
                </h3>
                <p className="text-gray-500 max-w-md">
                  Adjust the parameters on the left and run a Monte Carlo simulation
                  to see predicted outcomes with confidence intervals.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scenario Comparison */}
      <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Scenario Comparison</h3>
        <div className="grid grid-cols-4 gap-4">
          {['Conservative', 'Baseline', 'Optimistic', 'Aggressive'].map((scenario, i) => (
            <button
              key={scenario}
              className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left"
            >
              <div className="font-medium text-white">{scenario}</div>
              <div className="text-sm text-gray-400 mt-1">
                {['5% reply rate', '8% reply rate', '12% reply rate', '15% reply rate'][i]}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimulatePage;
