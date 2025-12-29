import React, { useState } from 'react';
import {
  Sparkles,
  Target,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Mail,
  Linkedin,
  Phone,
  Zap,
  CheckCircle2,
  Loader2,
  BarChart3,
} from 'lucide-react';
import { dataService } from '../lib/dataService';
import { useToast } from '../components/Toast';

export default function AICampaignStrategist() {
  const [formData, setFormData] = useState({
    objective: 'Generate qualified leads',
    targetAudience: 'SaaS companies 100-1000 employees',
    budgetRange: '$10,000-$20,000',
  });
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const objectives = [
    'Generate qualified leads',
    'Book demo meetings',
    'Increase brand awareness',
    'Re-engage cold leads',
    'Expand to new market',
    'Upsell existing customers',
  ];

  const budgetRanges = [
    '$5,000-$10,000',
    '$10,000-$20,000',
    '$20,000-$50,000',
    '$50,000-$100,000',
    '$100,000+',
  ];

  const generateStrategy = async () => {
    setLoading(true);
    setStrategy(null);

    try {
      const result = await dataService.post('/ai-advanced/campaign/strategy', formData);
      setStrategy(result);
      toast.success('Strategy generated successfully!');
    } catch (error) {
      console.error('Strategy generation failed:', error);
      toast.error('Failed to generate strategy: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const channelIcons = {
    Email: Mail,
    LinkedIn: Linkedin,
    Calls: Phone,
    Call: Phone,
    SMS: Mail,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">AI Campaign Strategist</h1>
            <p className="text-gray-600 mt-1">
              Data-driven campaign planning with predictive ROI and tactical recommendations
            </p>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            Historical Data Analysis
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            Past Campaign Learnings
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            LangChain Tactical Recs
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Campaign Parameters</h2>

          <div className="space-y-3">
            {/* Objective */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Objective
              </label>
              <select
                value={formData.objective}
                onChange={e => setFormData({ ...formData, objective: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                {objectives.map(obj => (
                  <option key={obj} value={obj}>
                    {obj}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <textarea
                value={formData.targetAudience}
                onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="e.g., SaaS companies 100-1000 employees, tech startups, enterprise..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
              <select
                value={formData.budgetRange}
                onChange={e => setFormData({ ...formData, budgetRange: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                {budgetRanges.map(range => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateStrategy}
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-medium text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Strategy...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate AI Strategy
                </>
              )}
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900 text-sm">How It Works</div>
                <div className="text-xs text-gray-600 mt-1">
                  Our AI analyzes your past campaigns (Mem0), reviews historical performance data
                  (LlamaIndex), generates a type-safe strategy (Pydantic AI), and provides tactical
                  recommendations (LangChain).
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Results */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Generated Strategy</h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-9 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 mb-2">Analyzing historical data...</p>
              <p className="text-xs text-gray-500">
                Processing campaign patterns and industry benchmarks
              </p>
            </div>
          ) : strategy ? (
            <div className="space-y-3">
              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-green-700">
                    {strategy.strategy.estimated_roi.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Estimated ROI</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-blue-700">
                    {strategy.strategy.timeline_days}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Days</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-purple-700">
                    ${(strategy.strategy.budget_estimate / 1000).toFixed(0)}k
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Budget</div>
                </div>
              </div>

              {/* Target Segments */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Target Segments
                </h3>
                <div className="flex flex-wrap gap-2">
                  {strategy.strategy.target_segments.map((segment, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
                    >
                      {segment}
                    </span>
                  ))}
                </div>
              </div>

              {/* Channels */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  Recommended Channels
                </h3>
                <div className="space-y-2">
                  {strategy.strategy.channels.map((channel, idx) => {
                    const Icon = channelIcons[channel] || Mail;
                    return (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-900">{channel}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sequence Steps */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Campaign Sequence</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Multi-touch engagement strategy
                    </div>
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {strategy.strategy.sequence_steps}
                  </div>
                </div>
              </div>

              {/* Context Indicators */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-purple-50 rounded-lg text-center border border-purple-200">
                  <div className="text-lg font-bold text-purple-600">
                    {strategy.past_learnings_incorporated}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Past Learnings</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-center border border-green-200">
                  <div className="text-lg font-bold text-green-600">
                    {strategy.historical_data_analyzed}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Data Points Analyzed</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <BarChart3 className="w-12 h-9 mb-3 text-gray-400" />
              <p>Configure parameters and generate strategy</p>
            </div>
          )}
        </div>
      </div>

      {/* Tactical Recommendations */}
      {strategy && strategy.tactical_recommendations && (
        <div className="max-w-7xl mx-auto mt-6">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              Tactical Recommendations (LangChain Agent)
            </h2>
            <div className="prose prose-sm max-w-none">
              <div className="text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                {strategy.tactical_recommendations}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Strategy Timeline Visualization */}
      {strategy && (
        <div className="max-w-7xl mx-auto mt-6">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Campaign Timeline</h2>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-indigo-500"></div>

              {Array.from({ length: strategy.strategy.sequence_steps }, (_, i) => i + 1).map(
                step => (
                  <div key={step} className="relative flex items-start gap-3 mb-6 last:mb-0">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                      {step}
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="font-medium text-gray-900">
                        {step === 1
                          ? 'Initial Outreach'
                          : step === 2
                            ? 'Value Proposition'
                            : step === 3
                              ? 'Social Proof'
                              : step === 4
                                ? 'Problem Focus'
                                : step === 5
                                  ? 'Solution Demo'
                                  : step === 6
                                    ? 'Pricing Discussion'
                                    : step === 7
                                      ? 'Final Call-to-Action'
                                      : `Touch Point ${step}`}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Day{' '}
                        {Math.round(
                          (strategy.strategy.timeline_days / strategy.strategy.sequence_steps) *
                            step
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
