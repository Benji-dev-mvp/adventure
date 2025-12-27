import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Target, TrendingUp, Users, Zap, AlertCircle, Settings, Download, RefreshCw, Sparkles } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const LeadScoring = () => {
  // Scoring weights (totals 100%)
  const [weights, setWeights] = useState({
    demographic: 40,
    intent: 35,
    engagement: 25
  });

  const [selectedModel, setSelectedModel] = useState('default');
  const [isRescoring, setIsRescoring] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Sample leads with scores
  const [leads, setLeads] = useState([
    { id: 1, name: 'Sarah Chen', company: 'TechCorp', title: 'VP Sales', score: 94, demographic: 95, intent: 92, engagement: 95, status: 'hot' },
    { id: 2, name: 'Michael Rodriguez', company: 'Growth Industries', title: 'Director Marketing', score: 87, demographic: 85, intent: 88, engagement: 89, status: 'hot' },
    { id: 3, name: 'Emily Watson', company: 'Enterprise Systems', title: 'CRO', score: 82, demographic: 90, intent: 75, engagement: 82, status: 'warm' },
    { id: 4, name: 'James Park', company: 'StartupXYZ', title: 'CEO', score: 78, demographic: 70, intent: 85, engagement: 80, status: 'warm' },
    { id: 5, name: 'Lisa Anderson', company: 'SmallCo', title: 'Sales Manager', score: 65, demographic: 60, intent: 70, engagement: 65, status: 'warm' },
    { id: 6, name: 'Robert Kim', company: 'LocalBiz', title: 'Owner', score: 45, demographic: 40, intent: 50, engagement: 45, status: 'cold' },
  ]);

  // Score distribution data
  const [scoreDistribution, setScoreDistribution] = useState([
    { range: '0-20', count: 45, color: '#EF4444' },
    { range: '21-40', count: 128, color: '#F59E0B' },
    { range: '41-60', count: 234, color: '#FBBF24' },
    { range: '61-80', count: 456, color: '#10B981' },
    { range: '81-100', count: 187, color: '#059669' },
  ]);

  // Calculate weighted score
  const calculateScore = (lead) => {
    return Math.round(
      (lead.demographic * weights.demographic / 100) +
      (lead.intent * weights.intent / 100) +
      (lead.engagement * weights.engagement / 100)
    );
  };

  // Update lead scores when weights change
  useEffect(() => {
    setLeads(prevLeads => prevLeads.map(lead => ({
      ...lead,
      score: calculateScore(lead),
      status: calculateScore(lead) >= 80 ? 'hot' : calculateScore(lead) >= 60 ? 'warm' : 'cold'
    })));
  }, [weights]);

  const handleWeightChange = (category, value) => {
    const newValue = parseInt(value);
    const currentTotal = Object.values(weights).reduce((a, b) => a + b, 0);
    const difference = newValue - weights[category];
    
    // Adjust other weights proportionally
    if (currentTotal - weights[category] > 0) {
      const factor = (100 - newValue) / (currentTotal - weights[category]);
      const newWeights = { ...weights, [category]: newValue };
      
      Object.keys(newWeights).forEach(key => {
        if (key !== category) {
          newWeights[key] = Math.round(newWeights[key] * factor);
        }
      });
      
      // Ensure total is exactly 100
      const total = Object.values(newWeights).reduce((a, b) => a + b, 0);
      if (total !== 100) {
        const adjustment = 100 - total;
        const keys = Object.keys(newWeights).filter(k => k !== category);
        newWeights[keys[0]] += adjustment;
      }
      
      setWeights(newWeights);
    }
  };

  const handleBulkRescore = () => {
    setIsRescoring(true);
    setTimeout(() => {
      setIsRescoring(false);
      setDialogOpen(false);
    }, 2000);
  };

  const getStatusBadgeVariant = (status) => {
    switch(status) {
      case 'hot': return 'success';
      case 'warm': return 'warning';
      case 'cold': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout
      title="Advanced Lead Scoring"
      subtitle="Customize scoring models and analyze lead quality"
    >
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Leads</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">1,050</p>
                  <p className="text-sm text-green-600 mt-1">+12.5% this week</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Hot Leads</p>
                  <p className="text-3xl font-bold text-green-600">187</p>
                  <p className="text-sm text-gray-600 mt-1">Score 80+</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-500/20 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Score</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">67.2</p>
                  <p className="text-sm text-green-600 mt-1">+4.3 pts</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-500/20 rounded-xl">
                  <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">23.8%</p>
                  <p className="text-sm text-green-600 mt-1">Hot leads → Customers</p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-500/20 rounded-xl">
                  <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scoring Model Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-accent-500" />
                      Scoring Model Configuration
                    </CardTitle>
                    <CardDescription>Adjust weights to customize lead scoring (total must equal 100%)</CardDescription>
                  </div>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Model</SelectItem>
                      <SelectItem value="enterprise">Enterprise Focus</SelectItem>
                      <SelectItem value="velocity">Velocity Model</SelectItem>
                      <SelectItem value="custom">Custom Model</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Demographic Weight */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-900 dark:text-white">
                      Demographic Fit
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-accent-600">{weights.demographic}%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={weights.demographic}
                    onChange={(e) => handleWeightChange('demographic', e.target.value)}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-accent-500"
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Company size, industry, title, revenue match
                  </p>
                </div>

                {/* Intent Signals Weight */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-900 dark:text-white">
                      Intent Signals
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-purple-600">{weights.intent}%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={weights.intent}
                    onChange={(e) => handleWeightChange('intent', e.target.value)}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-purple-500"
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Content downloads, page visits, search behavior, buying signals
                  </p>
                </div>

                {/* Engagement Weight */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-900 dark:text-white">
                      Engagement Level
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-600">{weights.engagement}%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={weights.engagement}
                    onChange={(e) => handleWeightChange('engagement', e.target.value)}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-green-500"
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Email opens, clicks, replies, meeting bookings
                  </p>
                </div>

                {/* Total Verification */}
                <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Total Weight:</span>
                    <Badge variant={
                      (weights.demographic + weights.intent + weights.engagement) === 100 
                        ? 'success' 
                        : 'danger'
                    } className="text-lg px-4 py-1">
                      {weights.demographic + weights.intent + weights.engagement}%
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="gradient" className="flex-1 gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Bulk Re-score All Leads
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Bulk Re-score All Leads</DialogTitle>
                        <DialogDescription>
                          This will recalculate scores for all 1,050 leads using your new weights. This may take a few moments.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-200 dark:border-amber-500/20">
                          <div className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                              <p className="font-semibold mb-1">Before you proceed:</p>
                              <ul className="list-disc list-inside space-y-1 text-xs">
                                <li>Existing scores will be overwritten</li>
                                <li>This action cannot be undone</li>
                                <li>Campaigns using score-based triggers may be affected</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          variant="gradient" 
                          onClick={handleBulkRescore}
                          disabled={isRescoring}
                        >
                          {isRescoring ? (
                            <>Processing...</>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Re-score Now
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export Model
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Score Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>Distribution of leads across score ranges</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis dataKey="range" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]}>
                      {scoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Sample Leads Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Score Preview</CardTitle>
                <CardDescription>See how scores update in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leads.slice(0, 6).map(lead => (
                    <div 
                      key={lead.id}
                      className="p-3 border border-gray-200 dark:border-white/10 rounded-lg hover:border-accent-500 dark:hover:border-accent-500 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                            {lead.name}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {lead.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{lead.company}</p>
                        </div>
                        <div className="text-right ml-2">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {lead.score}
                          </div>
                          <Badge variant={getStatusBadgeVariant(lead.status)} className="text-xs mt-1">
                            {lead.status}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Score Breakdown */}
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">Demographic</span>
                          <span className="font-semibold text-accent-600">{lead.demographic}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">Intent</span>
                          <span className="font-semibold text-purple-600">{lead.intent}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">Engagement</span>
                          <span className="font-semibold text-green-600">{lead.engagement}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scoring Tips */}
            <Card className="bg-gradient-to-br from-accent-500/10 to-purple-500/10 border-accent-500/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent-500" />
                  Scoring Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Balance is key:</strong> Don't weight any single factor above 50%
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Test & iterate:</strong> Monitor conversion rates after model changes
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Intent matters:</strong> Recent behavior is often the strongest predictor
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeadScoring;
