import React, { useState } from 'react';
import {
  Brain,
  TrendingUp,
  Target,
  Zap,
  Clock,
  Star,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { dataService } from '../lib/dataService';
import { useToast } from '../components/Toast';

export default function AILeadIntelligence() {
  const [selectedLead, setSelectedLead] = useState(null);
  const [scoreResult, setScoreResult] = useState(null);
  const [batchLeads, setBatchLeads] = useState([]);
  const [batchResults, setBatchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('single'); // single, batch, insights
  const toast = useToast();

  // Sample leads for demo
  const demoLeads = [
    {
      id: 1,
      name: 'John Smith',
      company: 'TechCorp Solutions',
      industry: 'SaaS',
      title: 'VP of Sales',
      email: 'john.smith@techcorp.com',
      engagement: 'high',
      size: 500,
      notes: 'Interested in enterprise plan, wants Q1 2026 implementation',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      company: 'DataFlow Analytics',
      industry: 'Analytics',
      title: 'CTO',
      email: 'sarah@dataflow.com',
      engagement: 'medium',
      size: 250,
      notes: 'Evaluating competitors, price sensitive, needs API integration',
    },
    {
      id: 3,
      name: 'Michael Chen',
      company: 'CloudScale Inc',
      industry: 'Cloud Infrastructure',
      title: 'CEO',
      email: 'mchen@cloudscale.io',
      engagement: 'high',
      size: 1000,
      notes: 'Expanding globally, high budget, decision maker',
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      company: 'FinTech Innovations',
      industry: 'Financial Services',
      title: 'Head of Operations',
      email: 'emily.r@fintech-inn.com',
      engagement: 'low',
      size: 150,
      notes: 'Referred by partner, exploring options',
    },
  ];

  const scoreSingleLead = async lead => {
    setLoading(true);
    setSelectedLead(lead);
    setScoreResult(null);

    try {
      const result = await dataService.post('/ai-advanced/lead/score', {
        lead_data: lead,
      });
      setScoreResult(result);
      toast.success('Lead scored successfully!');
    } catch (error) {
      console.error('Lead scoring failed:', error);
      toast.error('Failed to score lead: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const scoreBatchLeads = async () => {
    setLoading(true);
    setBatchResults([]);

    try {
      const result = await dataService.post('/ai-advanced/lead/batch-analyze', {
        leads: batchLeads.length > 0 ? batchLeads : demoLeads,
      });
      setBatchResults(result.results);
      toast.success(`Analyzed ${result.analyzed_count} leads successfully!`);
    } catch (error) {
      console.error('Batch analysis failed:', error);
      toast.error('Failed to analyze leads: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = score => {
    if (score >= 86) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 61) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 31) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getScoreBadge = score => {
    if (score >= 86) return 'Urgent Priority';
    if (score >= 61) return 'High Priority';
    if (score >= 31) return 'Medium Priority';
    return 'Low Priority';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">AI Lead Intelligence</h1>
            <p className="text-gray-600 mt-1">
              Advanced lead scoring with memory, RAG, and predictive insights
            </p>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-1">
            <Zap className="w-3 h-3" /> Mem0 Context Aware
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
            <Target className="w-3 h-3" /> LlamaIndex RAG
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Pydantic Type-Safe
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-4 py-3 font-medium transition-all ${
              activeTab === 'single'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Single Lead Scoring
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-4 py-3 font-medium transition-all ${
              activeTab === 'batch'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Batch Analysis
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-3 font-medium transition-all ${
              activeTab === 'insights'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Insights & Patterns
          </button>
        </div>
      </div>

      {/* Single Lead Scoring */}
      {activeTab === 'single' && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Lead Selection */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Select Lead to Score</h2>
            <div className="space-y-3">
              {demoLeads.map(lead => (
                <button
                  key={lead.id}
                  onClick={() => scoreSingleLead(lead)}
                  disabled={loading}
                  className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all disabled:opacity-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{lead.name}</div>
                      <div className="text-sm text-gray-600">
                        {lead.title} at {lead.company}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {lead.industry} • {lead.size} employees
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        lead.engagement === 'high'
                          ? 'bg-green-100 text-green-700'
                          : lead.engagement === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {lead.engagement} engagement
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Score Results */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">AI Score Results</h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-9 text-purple-600 animate-spin mb-4" />
                <p className="text-gray-600">Analyzing lead with AI...</p>
                <p className="text-xs text-gray-500 mt-2">
                  Using Mem0 memory + LlamaIndex RAG + Pydantic AI
                </p>
              </div>
            ) : scoreResult ? (
              <div className="space-y-3">
                {/* Score Display */}
                <div
                  className={`p-4 rounded-lg border-2 ${getScoreColor(scoreResult.lead_score.score)}`}
                >
                  <div className="text-center">
                    <div className="text-5xl font-bold mb-2">{scoreResult.lead_score.score}</div>
                    <div className="text-sm font-medium mb-1">out of 100</div>
                    <div className="inline-block px-3 py-1 bg-white rounded-full text-xs font-medium">
                      {getScoreBadge(scoreResult.lead_score.score)}
                    </div>
                  </div>
                </div>

                {/* Confidence & Context */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">
                      {(scoreResult.lead_score.confidence * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Confidence</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      {scoreResult.past_interactions}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Past Interactions</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      {scoreResult.similar_leads_found}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Similar Leads</div>
                  </div>
                </div>

                {/* Factors */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Key Factors
                  </h3>
                  <ul className="space-y-2">
                    {scoreResult.lead_score.factors.map((factor, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendation */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    AI Recommendation
                  </h3>
                  <p className="text-sm text-gray-700">{scoreResult.lead_score.recommendation}</p>
                </div>

                {/* Context Indicator */}
                {scoreResult.context_used && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 bg-purple-50 p-3 rounded-lg">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <span>Score enhanced with historical context and similar lead patterns</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <AlertCircle className="w-12 h-9 mb-3 text-gray-400" />
                <p>Select a lead to see AI-powered scoring</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Batch Analysis */}
      {activeTab === 'batch' && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Batch Lead Analysis</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Analyze multiple leads simultaneously with intelligent prioritization
                </p>
              </div>
              <button
                onClick={scoreBatchLeads}
                disabled={loading}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Analyze All Leads
                  </>
                )}
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-9 text-purple-600 animate-spin mb-4" />
                <p className="text-gray-600 mb-2">Processing {demoLeads.length} leads...</p>
                <p className="text-xs text-gray-500">This may take a moment</p>
              </div>
            ) : batchResults.length > 0 ? (
              <div className="space-y-3">
                {batchResults.map((result, idx) => (
                  <div
                    key={idx}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`w-16 h-16 rounded-lg flex items-center justify-center border-2 ${getScoreColor(result.score)}`}
                        >
                          <div className="text-center">
                            <div className="text-lg font-bold">{result.score}</div>
                            <div className="text-[10px]">score</div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{result.lead.name}</div>
                          <div className="text-sm text-gray-600">
                            {result.lead.title} at {result.lead.company}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{result.recommendation}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${getScoreColor(result.score)}`}
                        >
                          {getScoreBadge(result.score)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {(result.confidence * 100).toFixed(0)}% confidence
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Target className="w-12 h-9 mb-3 text-gray-400" />
                <p>Click "Analyze All Leads" to score all leads at once</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Insights & Patterns */}
      {activeTab === 'insights' && (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-4 text-white">
              <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
              <div className="text-lg font-bold mb-1">
                {batchResults.length > 0
                  ? Math.round(
                      batchResults.reduce((acc, r) => acc + r.score, 0) / batchResults.length
                    )
                  : '--'}
              </div>
              <div className="text-sm opacity-90">Average Lead Score</div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-4 text-white">
              <Star className="w-8 h-8 mb-3 opacity-80" />
              <div className="text-lg font-bold mb-1">
                {batchResults.filter(r => r.score >= 86).length}
              </div>
              <div className="text-sm opacity-90">Urgent Priority Leads</div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-4 text-white">
              <Clock className="w-8 h-8 mb-3 opacity-80" />
              <div className="text-lg font-bold mb-1">
                {batchResults.filter(r => r.score >= 61).length}
              </div>
              <div className="text-sm opacity-90">High Priority Leads</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">AI-Powered Insights</h2>
            <div className="space-y-3">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Context-Aware Scoring</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Uses Mem0 to recall past interactions and LlamaIndex to find similar
                      high-value leads, providing context-rich scoring.
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Predictive Intelligence</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Pydantic AI ensures type-safe, validated outputs while analyzing engagement
                      patterns and decision-making authority.
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Actionable Recommendations</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Every score includes specific, actionable recommendations based on historical
                      success patterns and best practices.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
