import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/Toast';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Zap,
  Lightbulb,
  Award,
  Activity,
  RefreshCw
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AISalesboard = () => {
  const { showToast } = useToast();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchSalesboardData();
  }, []);

  const fetchSalesboardData = async () => {
    try {
      const response = await fetch('/api/strategic/salesboard?days=7');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      showToast('Failed to load salesboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetch('/api/strategic/salesboard/sync', { method: 'POST' });
      showToast('Metrics synced successfully', 'success');
      await fetchSalesboardData();
    } catch (error) {
      showToast('Sync failed', 'error');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="AI Salesboard" subtitle="Live insights and rep coaching powered by AI">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  const { summary, daily_metrics, ai_insights, coaching_recommendations, overall_score } = metrics || {};

  return (
    <DashboardLayout 
      title="AI Salesboard" 
      subtitle="Live insights and rep coaching powered by AI"
      action={
        <Button onClick={handleSync} disabled={syncing}>
          <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Syncing...' : 'Sync Now'}
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Performance Score */}
        <Card className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 mb-2">Overall Performance Score</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-bold">{overall_score || 75}</span>
                  <span className="text-2xl text-purple-100">/100</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <TrendingUp size={20} />
                  <span className="text-sm">+12% from last week</span>
                </div>
              </div>
              <div className="text-right">
                <Award size={64} className="text-purple-200 mb-2" />
                <Badge className="bg-white/20 text-white border-white/30">
                  Top Performer
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          <MetricCard
            icon={<DollarSign />}
            label="Pipeline Value"
            value={`$${(summary?.pipeline_value || 0).toLocaleString()}`}
            change="+15%"
            positive
          />
          <MetricCard
            icon={<Target />}
            label="Deals in Pipeline"
            value={summary?.total_deals || 0}
            change="+3"
            positive
          />
          <MetricCard
            icon={<Activity />}
            label="Conversion Rate"
            value={`${((summary?.avg_conversion_rate || 0) * 100).toFixed(1)}%`}
            change="+2.3%"
            positive
          />
          <MetricCard
            icon={<Calendar />}
            label="Meetings Booked"
            value={summary?.total_meetings || 0}
            change="-1"
            positive={false}
          />
        </div>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="text-yellow-500" />
              <CardTitle>AI-Powered Insights</CardTitle>
            </div>
            <CardDescription>Real-time analysis of your sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {ai_insights?.map((insight, index) => (
                <InsightCard key={index} type={insight.type} message={insight.message} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Metrics */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity This Week</CardTitle>
              <CardDescription>Your outreach efforts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ActivityItem
                  icon={<Phone className="text-blue-500" />}
                  label="Calls Made"
                  value={summary?.total_calls || 0}
                  target={50}
                />
                <ActivityItem
                  icon={<Mail className="text-purple-500" />}
                  label="Emails Sent"
                  value={summary?.total_emails || 0}
                  target={100}
                />
                <ActivityItem
                  icon={<Calendar className="text-green-500" />}
                  label="Meetings"
                  value={summary?.total_meetings || 0}
                  target={10}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pipeline Trend</CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={daily_metrics?.slice(0, 7).reverse() || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="metric_date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => `$${value.toLocaleString()}`}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pipeline_value" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Coaching Recommendations */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="text-amber-500" />
              <CardTitle>AI Coaching Recommendations</CardTitle>
            </div>
            <CardDescription>Personalized tips to improve your performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {coaching_recommendations?.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-semibold text-amber-700">{index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>This week's performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={[
                  { stage: 'Leads', count: 150 },
                  { stage: 'Contacted', count: 120 },
                  { stage: 'Qualified', count: 45 },
                  { stage: 'Proposal', count: 25 },
                  { stage: 'Closed Won', count: 8 }
                ]}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

const MetricCard = ({ icon, label, value, change, positive }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{change}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </CardContent>
  </Card>
);

const InsightCard = ({ type, message }) => {
  const config = {
    strength: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: '✓' },
    opportunity: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: '→' },
    trend: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: '↗' }
  };

  const style = config[type] || config.strength;

  return (
    <div className={`p-4 ${style.bg} border ${style.border} rounded-lg`}>
      <div className="flex items-start gap-2">
        <span className="text-xl">{style.icon}</span>
        <p className={`text-sm ${style.text}`}>{message}</p>
      </div>
    </div>
  );
};

const ActivityItem = ({ icon, label, value, target }) => {
  const percentage = (value / target) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">
          {value} / {target}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default AISalesboard;
