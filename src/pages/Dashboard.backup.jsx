import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LiveActivityFeed } from '../components/dashboard/LiveActivityFeed';
import { TeamLeaderboard } from '../components/dashboard/TeamLeaderboard';
import { GoalTracking } from '../components/dashboard/GoalTracking';
import { QuickWins } from '../components/dashboard/QuickWins';
import { RevenuePipeline } from '../components/dashboard/RevenuePipeline';
import { PerformanceHeatmap } from '../components/dashboard/PerformanceHeatmap';
import { 
  AnimatedCounter, 
  LiveIndicator, 
  AnimatedProgress, 
  FuturisticBackground,
  PulsingDot 
} from '../components/ui/AnimatedComponents';
import { 
  TrendingUp, 
  TrendingDown,
  Mail, 
  Users, 
  Calendar,
  Target,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  BarChart3,
  Wand2,
  Brain,
  Lightbulb,
  Gauge,
  AlertTriangle,
  Download,
  Grid3x3,
  Zap,
  Activity,
  Rocket
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { askAva, applyGuardrail, updateTemplateCTA, scheduleOptimalWindow, fetchAIRecommendations, getActiveCRM, sendToSlack, fetchDashboardSnapshot, fetchSystemStatus } from '../lib/dataService';

const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const activeCRM = getActiveCRM();

  // Mock data
  const initialKpis = [
    {
      title: 'Emails Sent',
      value: '12,453',
      change: '+12.5%',
      trend: 'up',
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Reply Rate',
      value: '8.4%',
      change: '+2.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Meetings Booked',
      value: '47',
      change: '+18%',
      trend: 'up',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Active Leads',
      value: '1,284',
      change: '-3.2%',
      trend: 'down',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const initialKpiTrends = {
    'Emails Sent': [320, 380, 450, 510, 490, 120, 80],
    'Reply Rate': [6.2, 6.8, 7.3, 8.1, 8.4, 3.0, 2.5],
    'Meetings Booked': [22, 28, 31, 39, 47, 12, 8],
    'Active Leads': [1180, 1214, 1288, 1320, 1284, 980, 840],
  };

  const initialEmailData = [
    { date: 'Mon', sent: 420, opened: 180, replied: 32 },
    { date: 'Tue', sent: 380, opened: 165, replied: 28 },
    { date: 'Wed', sent: 450, opened: 198, replied: 38 },
    { date: 'Thu', sent: 510, opened: 225, replied: 45 },
    { date: 'Fri', sent: 490, opened: 215, replied: 41 },
    { date: 'Sat', sent: 120, opened: 45, replied: 8 },
    { date: 'Sun', sent: 80, opened: 28, replied: 5 },
  ];

  const activeCampaigns = [
    {
      name: 'Q1 Enterprise Outreach',
      status: 'active',
      leads: 324,
      sent: 1240,
      replies: 94,
      replyRate: 7.6,
    },
    {
      name: 'Product Launch - SaaS',
      status: 'active',
      leads: 256,
      sent: 890,
      replies: 71,
      replyRate: 8.0,
    },
    {
      name: 'Re-engagement Campaign',
      status: 'paused',
      leads: 412,
      sent: 1850,
      replies: 48,
      replyRate: 2.6,
    },
  ];

  const recentActivity = [
    {
      type: 'meeting',
      lead: 'Sarah Johnson',
      company: 'TechCorp Inc.',
      action: 'booked a meeting',
      time: '5 minutes ago',
      avatar: '👩‍💼',
    },
    {
      type: 'reply',
      lead: 'Michael Chen',
      company: 'CloudScale',
      action: 'replied to your email',
      time: '23 minutes ago',
      avatar: '👨‍💼',
    },
    {
      type: 'open',
      lead: 'Emily Rodriguez',
      company: 'DataFlow Systems',
      action: 'opened your email',
      time: '1 hour ago',
      avatar: '👩',
    },
    {
      type: 'meeting',
      lead: 'David Park',
      company: 'InnovateLabs',
      action: 'booked a meeting',
      time: '2 hours ago',
      avatar: '👨',
    },
  ];

  const aiInsights = [
    {
      type: 'success',
      title: 'Best Performing Subject Line',
      description: '"Quick question about [Company] scaling" has 12% higher open rate',
      action: 'Apply to all campaigns',
    },
    {
      type: 'warning',
      title: 'Deliverability Alert',
      description: 'Your domain warmup is at 78%. Consider reducing send volume by 15%',
      action: 'Adjust settings',
    },
    {
      type: 'info',
      title: 'Optimal Send Time',
      description: 'Tuesday 10 AM generates 3x more replies than other times',
      action: 'Schedule campaigns',
    },
  ];

  const initialAiRecommendations = [
    {
      title: 'Reduce send volume by 12% on low-warm domains',
      impact: 'deliverability',
      confidence: 0.82,
      reason: 'Warmup trends and recent soft bounces indicate risk at current pace.',
      actionLabel: 'Apply guardrail',
    },
    {
      title: 'Swap CTA in sequence 3 to calendar link',
      impact: 'reply-rate',
      confidence: 0.77,
      reason: 'A/B suggests 18% relative lift for similar ICPs last week.',
      actionLabel: 'Update template',
    },
    {
      title: 'Prioritize Finance ICP on Tuesday 10am',
      impact: 'meetings',
      confidence: 0.73,
      reason: 'Historic reply clusters peak at this slot for finance targets.',
      actionLabel: 'Schedule window',
    },
  ];

  const [kpiData, setKpiData] = useState(initialKpis);
  const [kpiTrendsData, setKpiTrendsData] = useState(initialKpiTrends);
  const [emailSeries, setEmailSeries] = useState(initialEmailData);
  const [aiRecs, setAiRecs] = useState(initialAiRecommendations);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [systemStatus, setSystemStatus] = useState(null);

  const iconMap = { Mail, TrendingUp, TrendingDown, Users, Calendar, Target, Sparkles };

  useEffect(() => {
    const hydrateMetrics = async () => {
      setIsLoadingMetrics(true);
      // Use static data directly instead of failing API call
      setKpiData(initialKpis);
      setKpiTrendsData(initialKpiTrends);
      setEmailSeries(initialEmailData);
      setIsLoadingMetrics(false);
    };

    const hydrateRecs = async () => {
      setIsLoadingRecs(true);
      try {
        const recs = await fetchAIRecommendations();
        setAiRecs(recs || initialAiRecommendations);
      } catch (err) {
        // Silent fallback to default recommendations
        setAiRecs(initialAiRecommendations);
      } finally {
        setIsLoadingRecs(false);
      }
    };

    const hydrateStatus = async () => {
      try {
        const status = await fetchSystemStatus();
        setSystemStatus(status);
      } catch (err) {
        setSystemStatus(null);
      }
    };

    hydrateMetrics();
    hydrateRecs();
    hydrateStatus();
  }, []);

  const avaPlanToday = [
    { time: '09:00', task: 'Warm 6 inboxes', status: 'in-progress' },
    { time: '10:00', task: 'Send sequence 2 to 420 Finance leads', status: 'queued' },
    { time: '13:00', task: 'QA personalization for Enterprise campaign', status: 'queued' },
    { time: '15:00', task: 'Deliverability sweep + auto-throttle', status: 'scheduled' },
  ];

  const [avaLearningStats, setAvaLearningStats] = useState({
    campaigns: 3,
    leads: 11,
    insights: 1,
    progress: 2
  });

  const [avaChatOpen, setAvaChatOpen] = useState(false);
  const [avaChatMessages, setAvaChatMessages] = useState([
    { sender: 'ava', text: '👋 Hi! I\'m ready to help. What would you like to do today?', time: 'Just now' }
  ]);
  const [avaChatInput, setAvaChatInput] = useState('');

  const handleAvaChatSend = () => {
    if (!avaChatInput.trim()) return;
    
    const userMsg = { sender: 'user', text: avaChatInput, time: 'Just now' };
    setAvaChatMessages([...avaChatMessages, userMsg]);
    setAvaChatInput('');
    
    setTimeout(() => {
      const responses = [
        '✅ I\'ve analyzed that and here\'s what I found...',
        '🎯 Great question! Based on your data, I recommend...',
        '📊 Let me pull that information for you...',
        '💡 Here\'s my suggestion based on your performance...'
      ];
      const avaMsg = { sender: 'ava', text: responses[Math.floor(Math.random() * responses.length)], time: 'Just now' };
      setAvaChatMessages(prev => [...prev, avaMsg]);
      toast.success('Ava responded!');
    }, 1500);
  };

  const handleAskAva = async (e) => {
    e?.preventDefault?.();
    const input = document.getElementById('ava-command-input');
    const prompt = input?.value?.trim() || 'Optimize reply rate for SaaS ICP';
    try {
      const res = await askAva(prompt);
      toast.success('Ava provided insights. Opening AI Assistant.');
      navigate('/ai-assistant');
    } catch (err) {
      toast.error('Failed to ask Ava');
    }
  };

  const handleRecommendation = async (rec) => {
    try {
      if (rec.actionLabel.includes('guardrail')) {
        await applyGuardrail({ policy: 'auto-throttle', amount: 0.12 });
        toast.success('Guardrail applied: auto-throttle set');
      } else if (rec.actionLabel.includes('template')) {
        await updateTemplateCTA({ sequence: 3, cta: 'calendar-link' });
        toast.success('Template CTA updated to calendar link');
      } else if (rec.actionLabel.includes('Schedule')) {
        await scheduleOptimalWindow({ day: 'Tuesday', time: '10:00' });
        toast.success('Send window scheduled: Tue 10:00');
      } else {
        toast.info('Action queued');
      }
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const goto = (path) => () => navigate(path);

  return (
    <DashboardLayout 
      title="Welcome back, Alex 👋" 
      subtitle="Here's what's happening with your outbound today"
    >
      {/* Futuristic Background */}
      <FuturisticBackground />

      {/* AI Command Bar - Enhanced */}
      <div className="relative mb-4 group">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
        <Card className="relative backdrop-blur-xl border-2 border-white/20 dark:border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-white/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="relative p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl blur-lg opacity-75 animate-pulse" />
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 grid place-items-center shadow-2xl border-2 border-white/30">
                    <Wand2 className="text-white animate-pulse" size={24} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
                      Ask Ava AI
                    </p>
                    <LiveIndicator label="ONLINE" color="green" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Try: "Where are we losing deliverability?"</p>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-3">
                <input 
                  id="ava-command-input" 
                  className="flex-1 rounded-xl border-2 border-purple-300/50 dark:border-purple-500/30 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                  placeholder="Ask anything… e.g., Optimize reply rate for SaaS ICP" 
                />
                <Button className="gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all" onClick={handleAskAva}>
                  <Sparkles size={16} className="animate-pulse" />
                  Ask
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">CRM:</span>
                <Button variant="ghost" size="sm" className="gap-2 hover:scale-105 transition-transform" onClick={goto('/integrations')}>
                  <span className="text-lg">
                    {activeCRM === 'Salesforce' ? '☁️' : activeCRM === 'HubSpot' ? '🧡' : activeCRM === 'Pipedrive' ? '🔷' : '🗂️'}
                  </span>
                  {activeCRM || 'Select CRM'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Live Status Bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <PulsingDot color={isLoadingMetrics ? 'amber' : 'green'} size="md" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {isLoadingMetrics ? 'Syncing live metrics…' : 'Live metrics ready'}
          </span>
          <LiveIndicator label="LIVE" color={isLoadingMetrics ? 'amber' : 'green'} />
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock size={14} />
          <span>Last updated: just now</span>
        </div>
      </div>

      {/* KPI Cards - Futuristic Redesign */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiData.map((kpi, index) => {
          const IconComponent = typeof kpi.icon === 'function' ? kpi.icon : iconMap[kpi.icon] || Mail;
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;
          const spark = kpiTrendsData[kpi.title] || [];
          const numericValue = parseInt(kpi.value.replace(/,/g, '').replace('%', ''));
          
          const gradients = [
            'from-cyan-500 to-blue-600',
            'from-emerald-500 to-teal-600',
            'from-purple-500 to-pink-600',
            'from-amber-500 to-orange-600'
          ];
          
          return (
            <div key={index} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-20 blur-xl rounded-2xl transition-opacity duration-300`} />
              <Card className="relative hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 backdrop-blur-sm border-2 border-white/20 dark:border-white/10 overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradients[index]} opacity-10 rounded-full blur-2xl -z-10`} />
                <CardContent className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">{kpi.title}</p>
                      <p className={`text-4xl font-black bg-gradient-to-r ${gradients[index]} bg-clip-text text-transparent mb-2`}>
                        {kpi.value.includes('%') ? (
                          <><AnimatedCounter end={numericValue} decimals={1} duration={2000} />%</>
                        ) : (
                          <AnimatedCounter end={numericValue} duration={2000} />
                        )}
                      </p>
                      <div className={`flex items-center gap-1.5 text-sm font-bold ${kpi.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        <TrendIcon size={16} className="animate-pulse" />
                        <span>{kpi.change}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">vs last week</span>
                      </div>
                    </div>
                    <div className={`relative p-3 rounded-xl bg-gradient-to-br ${gradients[index]} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      <IconComponent className="text-white" size={24} />
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-50 blur rounded-xl animate-pulse`} />
                    </div>
                  </div>
                  <AnimatedProgress 
                    value={Math.min(100, (numericValue / 15000) * 100)} 
                    color={['cyan', 'emerald', 'purple', 'amber'][index]}
                  />
                  <div className="mt-3 h-12">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={spark.map((v, i) => ({ i, v }))} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={['#06b6d4', '#10b981', '#a855f7', '#f59e0b'][index]} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={['#06b6d4', '#10b981', '#a855f7', '#f59e0b'][index]} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke={['#06b6d4', '#10b981', '#a855f7', '#f59e0b'][index]} fill={`url(#gradient-${index})`} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Ava AI Learning & Quick Chat Section */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {/* Ava Learning Stats */}
        <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-purple-900/20 border-2 border-purple-200 dark:border-purple-500/30 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Brain className="text-white" size={28} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ava AI Learning</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Continuously improving</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-purple-200/50 dark:border-purple-500/30">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  <AnimatedCounter end={avaLearningStats.campaigns} />
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Campaigns</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-pink-200/50 dark:border-pink-500/30">
                <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-1">
                  <AnimatedCounter end={avaLearningStats.leads} />
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Leads</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-blue-200/50 dark:border-blue-500/30">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  <AnimatedCounter end={avaLearningStats.insights} />
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Insights</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-green-200/50 dark:border-green-500/30">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  <AnimatedCounter end={avaLearningStats.progress} />%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Progress</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                <span>Learning Progress</span>
                <span className="font-semibold">{avaLearningStats.progress}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 h-2 rounded-full transition-all duration-1000 relative"
                  style={{ width: `${avaLearningStats.progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all"
              onClick={() => setAvaChatOpen(!avaChatOpen)}
            >
              <Sparkles size={16} className="mr-2" />
              {avaChatOpen ? 'Close Chat' : 'Chat with Ava'}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Chat Window - Expanded when open */}
        {avaChatOpen && (
          <Card className="lg:col-span-2 border-2 border-purple-200 dark:border-purple-500/30 shadow-xl">
            <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Brain className="text-white" size={20} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Quick Chat with Ava</CardTitle>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Get instant AI assistance</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setAvaChatOpen(false)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[240px] overflow-y-auto p-4 space-y-3">
                {avaChatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${msg.sender === 'ava' ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-500/30' : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'} rounded-xl p-3 shadow-sm`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'ava' ? 'text-gray-500' : 'text-blue-100'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t bg-gray-50 dark:bg-gray-800/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask Ava anything..."
                    value={avaChatInput}
                    onChange={(e) => setAvaChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAvaChatSend()}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Button 
                    onClick={handleAvaChatSend}
                    disabled={!avaChatInput.trim()}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Sparkles size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show AI Insights when chat is closed */}
        {!avaChatOpen && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="text-accent-500" size={24} />
                    AI Insights & Recommendations
                  </CardTitle>
                  <CardDescription>Ava analyzed your campaigns and found opportunities</CardDescription>
                </div>
                <Badge variant="accent">{isLoadingRecs ? 'Syncing' : `${aiRecs.length} Live`}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiRecs.map((rec, idx) => (
                  <div key={idx} className="p-4 rounded-lg border hover:border-accent-300 hover:shadow-md transition-all">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${rec.impact === 'deliverability' ? 'bg-orange-100 text-orange-600' : rec.impact === 'reply-rate' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                        {rec.impact === 'deliverability' ? <AlertTriangle size={20} /> : rec.impact === 'reply-rate' ? <TrendingUp size={20} /> : <Calendar size={20} />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{rec.reason}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {(rec.confidence * 100).toFixed(0)}% confidence
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRecommendation(rec)}
                          >
                            {rec.actionLabel}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {/* AI Insights (moved down when chat is open) */}
        {avaChatOpen && (
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="text-accent-500" size={24} />
                    AI Insights & Recommendations
                  </CardTitle>
                  <CardDescription>Ava analyzed your campaigns and found opportunities</CardDescription>
                </div>
                <Badge variant="accent">{isLoadingRecs ? 'Syncing' : `${aiRecs.length} Live`}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-3 gap-4">
                {aiRecs.map((rec, idx) => (
                  <div key={idx} className="p-3 rounded-lg border hover:border-accent-300 hover:shadow-md transition-all">
                    <div className="flex items-start gap-2">
                      <div className={`p-1.5 rounded-lg ${rec.impact === 'deliverability' ? 'bg-orange-100 text-orange-600' : rec.impact === 'reply-rate' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                        {rec.impact === 'deliverability' ? <AlertTriangle size={16} /> : rec.impact === 'reply-rate' ? <TrendingUp size={16} /> : <Calendar size={16} />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-xs mb-1">{rec.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1.5">{rec.reason}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {(rec.confidence * 100).toFixed(0)}% confidence
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRecommendation(rec)}
                          >
                            {rec.actionLabel}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {/* Original AI Insights position removed */}
        <Card className="lg:col-span-2 hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="text-accent-500" size={24} />
                  AI Insights & Recommendations
                </CardTitle>
                <CardDescription>Ava analyzed your campaigns and found opportunities</CardDescription>
              </div>
              <Badge variant="accent">{isLoadingRecs ? 'Syncing' : `${aiRecs.length} Live`}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="p-4 rounded-xl border border-gray-200 hover:border-accent-300 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      insight.type === 'success' ? 'bg-green-100' :
                      insight.type === 'warning' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      {insight.type === 'success' && <CheckCircle2 className="text-green-600" size={20} />}
                      {insight.type === 'warning' && <AlertCircle className="text-yellow-600" size={20} />}
                      {insight.type === 'info' && <Sparkles className="text-blue-600" size={20} />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                      <Button variant="ghost" size="sm" className="gap-2" onClick={async () => {
                        try { await sendToSlack({ text: `${insight.title}: ${insight.description}` }); toast.success('Sent to Slack'); } catch { toast.error('Slack send failed'); }
                      }}>
                        {insight.action}
                        <ArrowUpRight size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2" onClick={async () => {
                        try { await sendToSlack({ text: `Action requested: ${insight.action}` }); toast.success('Action sent to Slack'); } catch { toast.error('Slack send failed'); }
                      }}>
                        Send to Slack
                        <ArrowUpRight size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {/* Advanced AI Recommendations */}
              <div className="grid md:grid-cols-2 gap-4">
                {aiRecs.map((rec) => (
                  <div key={rec.title} className="p-4 rounded-xl border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Brain className="text-artisan-purple" size={18} />
                        <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                      </div>
                      <div className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-primary-50 text-primary-700">
                        <Gauge size={14} />
                        Confidence {(rec.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{rec.reason}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="accent" className="text-xs">{rec.impact}</Badge>
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => handleRecommendation(rec)}>
                        {rec.actionLabel}
                        <ArrowUpRight size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 
          ═══════════════════════════════════════════════════════════════════════════════════
          REFACTOR DIRECTIVE FOR COPILOT
          ═══════════════════════════════════════════════════════════════════════════════════

          TARGET:
          - The "Quick Wins / Quick Actions / Best Time to Send" section immediately below this comment.

          REFERENCE LAYOUT:
          - The "Active Campaigns / Recent Activity" block rendered further down in this file (around line 1047),
            which already uses an enterprise-ready two-column grid with consistent card widths, padding, and gaps.
          - Look for: <div className="grid lg:grid-cols-2 gap-4">
          - That section contains two equal-width columns with properly aligned Card components.

          OBJECTIVE:
          - Replace the current layout with a full-width, two-column dashboard row that visually
            matches the "Active Campaigns / Recent Activity" section in:
            • container width
            • grid structure (grid lg:grid-cols-2 gap-4)
            • spacing (gap-4)
            • card sizing and alignment
            • responsive behavior

          IMPLEMENTATION REQUIREMENTS:
          1. Reuse the same grid classes as the reference block.
             - Example structure from Active Campaigns / Recent Activity:
               <div className="grid lg:grid-cols-2 gap-4">
                 <Card>...</Card>
                 <Card>...</Card>
               </div>
             - Copy that exact grid wrapper and apply it around this section.

          2. Desktop layout (lg breakpoint and up):
             - Left column: Quick Wins card (single card with all quick win items inside).
             - Right column: Stack two cards vertically - Quick Actions card + Best Time to Send card.
             - Use a wrapper div with space-y-4 to stack the right column cards.

          3. Mobile layout (below lg breakpoint):
             - Single-column stack, same breakpoints and behavior as the Active Campaigns grid.
             - All three cards stack vertically.

          4. Scope of changes:
             - Only refactor wrapper <div>/<section> structure and Tailwind classNames.
             - Do NOT change card content, text, data, hooks, or business logic.
             - Do NOT introduce new custom spacing values; reuse gap-4 and space-y-4.

          5. End state:
             - This section should visually read as a single dashboard row with two equal-width columns,
               aligned with the Active Campaigns / Recent Activity row below.
             - No large empty space on the right.
             - Professional enterprise dashboard appearance.

          ═══════════════════════════════════════════════════════════════════════════════════
        */}

        {/* Dashboard row: Quick Wins + Actions - matches Active Campaigns / Recent Activity layout */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Left column: Quick Wins */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles size={18} className="text-yellow-500" />
                  Quick Wins
                </CardTitle>
                <Badge variant="accent" className="text-xs">AI</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-500/30">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Follow up with 3 hot leads</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">High reply probability</p>
                    </div>
                    <Badge variant="default" className="ml-2 text-xs">High</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2 text-xs mt-2">
                    <CheckCircle2 size={14} />
                    Review Leads
                  </Button>
                </div>

                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-500/30">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Personalize Campaign B</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">27% more engagement</p>
                    </div>
                    <Badge variant="outline" className="ml-2 text-xs">Med</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2 text-xs mt-2">
                    <Wand2 size={14} />
                    Optimize Now
                  </Button>
                </div>

                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-500/30">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Send at optimal time</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">3x higher open rate</p>
                    </div>
                    <Badge variant="outline" className="ml-2 text-xs">Med</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2 text-xs mt-2">
                    <Clock size={14} />
                    Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right column: Quick Actions + Best Time to Send stacked */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Zap size={18} className="text-primary-600" />
                    Quick Actions
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full justify-start gap-2 text-sm" variant="outline" size="sm" onClick={goto('/campaigns')}>
                    <Target size={16} />
                    Create Campaign
                  </Button>
                  <Button className="w-full justify-start gap-2 text-sm" variant="outline" size="sm" onClick={goto('/leads')}>
                    <Users size={16} />
                    Import Leads
                  </Button>
                  <Button className="w-full justify-start gap-2 text-sm" variant="outline" size="sm" onClick={goto('/ai-assistant')}>
                    <Sparkles size={16} />
                    Ask Ava AI
                  </Button>
                  <Button className="w-full justify-start gap-2 text-sm" variant="outline" size="sm" onClick={goto('/analytics')}>
                    <BarChart3 size={16} />
                    View Report
                  </Button>
                </div>

                <div className="mt-4 p-3 bg-gradient-to-br from-accent-50 to-primary-50 dark:from-accent-900/20 dark:to-primary-900/20 rounded-xl border border-accent-200 dark:border-accent-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="text-accent-600 dark:text-accent-400" size={16} />
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">Ava is Active</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Processing 127 leads
                  </p>
                  <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Working in background</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Best Time to Send */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock size={18} className="text-blue-600" />
                    Best Time to Send
                  </CardTitle>
                  <Badge variant="accent" className="text-xs">Live</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-500/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-green-700 dark:text-green-400">Tuesday</span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">10 AM</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">3x more replies</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-500/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">Thursday</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">2 PM</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">2x open rate</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-500/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-orange-700 dark:text-orange-400">Friday</span>
                      <span className="text-lg font-bold text-orange-600 dark:text-orange-400">11 AM</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Good engagement</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full gap-2 text-xs"
                    onClick={() => {
                      toast.success('Send times scheduled');
                    }}
                  >
                    <Clock size={14} />
                    Apply to Campaigns
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Ava's Plan Today */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Lightbulb size={20} className="text-yellow-500" /> Ava’s Plan Today</CardTitle>
              <CardDescription>What Ava will execute automatically</CardDescription>
            </div>
            <Badge variant="accent">Auto</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {avaPlanToday.map((item) => (
              <div key={item.task} className="p-4 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.time}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.task}</p>
                <div className={`mt-2 inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full ${
                  item.status === 'in-progress' ? 'bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-200' :
                  item.status === 'queued' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200' :
                  'bg-gray-50 text-gray-700 dark:bg-white/10 dark:text-gray-200'
                }`}>
                  {item.status === 'in-progress' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Email Performance</CardTitle>
              <CardDescription>Last 7 days activity</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">Day</Button>
              <Button variant="outline" size="sm">Week</Button>
              <Button variant="ghost" size="sm">Month</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={emailSeries}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReplied" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Area type="monotone" dataKey="sent" stroke="#3B82F6" fillOpacity={1} fill="url(#colorSent)" />
                <Area type="monotone" dataKey="opened" stroke="#10B981" fillOpacity={1} fill="url(#colorOpened)" />
                <Area type="monotone" dataKey="replied" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorReplied)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Sent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Opened</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Replied</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Active Campaigns */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Campaigns</CardTitle>
                <CardDescription>Your running outreach campaigns</CardDescription>
              </div>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeCampaigns.map((campaign, index) => (
                <div key={index} className="p-4 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-white/5 hover:border-accent-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{campaign.name}</h4>
                      <Badge variant={campaign.status === 'active' ? 'success' : 'default'}>
                        {campaign.status === 'active' ? (
                          <><Play size={12} className="mr-1" /> Active</>
                        ) : (
                          <><Clock size={12} className="mr-1" /> Paused</>
                        )}
                      </Badge>
                    </div>
                    <span className={`text-lg font-bold ${
                      campaign.replyRate > 5 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {campaign.replyRate}%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Leads</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{campaign.leads}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Sent</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{campaign.sent}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Replies</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{campaign.replies}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest lead interactions</CardDescription>
              </div>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                    {activity.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-semibold">{activity.lead}</span> {activity.action}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.company}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <div className={`p-1.5 rounded-lg ${
                    activity.type === 'meeting' ? 'bg-green-100 dark:bg-green-900/40' :
                    activity.type === 'reply' ? 'bg-blue-100 dark:bg-blue-900/40' :
                    'bg-gray-100 dark:bg-white/10'
                  }`}>
                    {activity.type === 'meeting' && <Calendar size={16} className="text-green-300" />}
                    {activity.type === 'reply' && <Mail size={16} className="text-blue-300" />}
                    {activity.type === 'open' && <Target size={16} className="text-gray-200" />}
                  </div>
                  <Button variant="ghost" size="sm" className="gap-2" onClick={async () => {
                    try { await sendToSlack({ text: `${activity.lead} (${activity.company}) ${activity.action}` }); toast.success('Activity sent to Slack'); } catch { toast.error('Slack send failed'); }
                  }}>
                    Send to Slack
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* New Enhanced Sections */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <LiveActivityFeed />
        </div>
        <div>
          <GoalTracking />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <TeamLeaderboard />
        <RevenuePipeline />
      </div>

      <div className="mb-6">
        <PerformanceHeatmap />
      </div>

      {/* Export Dashboard Button */}
      <div className="flex justify-center">
        <Button variant="outline" className="gap-2">
          <Download size={16} />
          Export Dashboard Report (PDF)
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
