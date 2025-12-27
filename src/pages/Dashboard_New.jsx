import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
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
  Play,
  BarChart3,
  Wand2,
  Brain,
  Lightbulb,
  Zap,
  Activity,
  Rocket,
  Trophy,
  Star,
  MessageSquare,
  Shield
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuad = progress * (2 - progress);
      const currentCount = Math.floor(easeOutQuad * end);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// Live Status Indicator
const LiveIndicator = ({ label = 'LIVE', color = 'green' }) => (
  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${color}-500/10 border border-${color}-500/30`}>
    <span className="relative flex h-2 w-2">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${color}-400 opacity-75`}></span>
      <span className={`relative inline-flex rounded-full h-2 w-2 bg-${color}-500`}></span>
    </span>
    <span className={`text-xs font-bold text-${color}-500 tracking-wider`}>{label}</span>
  </div>
);

// Animated Progress Bar
const AnimatedProgress = ({ value, color = 'cyan', label }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const colorMap = {
    cyan: 'from-cyan-400 to-cyan-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600',
    orange: 'from-orange-400 to-orange-600'
  };

  return (
    <div className="space-y-1">
      {label && (
        <div className="text-xs text-gray-600 dark:text-gray-400 flex justify-between">
          <span>{label}</span>
          <span className="font-bold">{value}%</span>
        </div>
      )}
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${colorMap[color] || colorMap.cyan} transition-all duration-1000 ease-out rounded-full relative`}
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [liveStats, setLiveStats] = useState({
    emailsSent: 12453,
    replyRate: 8.4,
    meetingsBooked: 47,
    activeLeads: 1284
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        emailsSent: prev.emailsSent + Math.floor(Math.random() * 10),
        replyRate: Math.max(0, Math.min(100, prev.replyRate + (Math.random() * 0.4 - 0.2))),
        meetingsBooked: prev.meetingsBooked + (Math.random() > 0.7 ? 1 : 0),
        activeLeads: prev.activeLeads + Math.floor(Math.random() * 5) - 2
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const performanceData = [
    { day: 'Mon', emails: 320, replies: 28, meetings: 8 },
    { day: 'Tue', emails: 380, replies: 35, meetings: 12 },
    { day: 'Wed', emails: 450, replies: 42, meetings: 15 },
    { day: 'Thu', emails: 510, replies: 48, meetings: 18 },
    { day: 'Fri', emails: 490, replies: 45, meetings: 14 },
    { day: 'Sat', emails: 120, replies: 12, meetings: 3 },
    { day: 'Sun', emails: 80, replies: 8, meetings: 2 }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Activity size={16} /> },
    { id: 'performance', label: 'Performance', icon: <BarChart3 size={16} /> },
    { id: 'ai-insights', label: 'AI Insights', icon: <Brain size={16} /> },
    { id: 'quick-actions', label: 'Quick Actions', icon: <Zap size={16} /> },
    { id: 'team', label: 'Team', icon: <Users size={16} /> }
  ];

  const goto = (path) => () => navigate(path);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Hero Header with Live Stats */}
        <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-primary-600 via-accent-600 to-purple-600 dark:from-primary-800 dark:via-accent-800 dark:to-purple-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <Rocket className="animate-bounce" size={32} />
                  Sales Command Center
                </h1>
                <p className="text-white/80">Real-time intelligence for your sales engine</p>
              </div>
              <LiveIndicator label="LIVE" color="green" />
            </div>

            {/* Live Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-white/70 text-sm mb-1">Emails Sent Today</div>
                <div className="text-3xl font-bold text-white">
                  <AnimatedCounter end={liveStats.emailsSent} />
                </div>
                <div className="flex items-center gap-1 text-green-300 text-xs mt-2">
                  <TrendingUp size={14} />
                  +12.5%
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-white/70 text-sm mb-1">Reply Rate</div>
                <div className="text-3xl font-bold text-white">
                  <AnimatedCounter end={liveStats.replyRate} suffix="%" />
                </div>
                <div className="flex items-center gap-1 text-green-300 text-xs mt-2">
                  <TrendingUp size={14} />
                  +2.3%
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-white/70 text-sm mb-1">Meetings Booked</div>
                <div className="text-3xl font-bold text-white">
                  <AnimatedCounter end={liveStats.meetingsBooked} />
                </div>
                <div className="flex items-center gap-1 text-green-300 text-xs mt-2">
                  <TrendingUp size={14} />
                  +18%
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-white/70 text-sm mb-1">Active Leads</div>
                <div className="text-3xl font-bold text-white">
                  <AnimatedCounter end={liveStats.activeLeads} />
                </div>
                <div className="flex items-center gap-1 text-orange-300 text-xs mt-2">
                  <TrendingDown size={14} />
                  -3.2%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
              >
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* AI Insights Banner */}
            <Card className="border-accent-200 dark:border-accent-500/30 bg-gradient-to-br from-accent-50 to-primary-50 dark:from-accent-900/20 dark:to-primary-900/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-accent-500 text-white">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Ava's Top Recommendation
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        Follow up with 3 hot leads now - they've opened your email 4+ times in the last hour.
                        Reply probability: <span className="font-bold text-green-600">94%</span>
                      </p>
                      <div className="flex items-center gap-3">
                        <Button className="gap-2">
                          <CheckCircle2 size={16} />
                          Review Leads
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <Wand2 size={16} />
                          Auto-personalize
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Badge variant="accent">AI-Powered</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Performance Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 size={20} />
                      Weekly Performance
                    </CardTitle>
                    <Badge variant="outline">Last 7 Days</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="emailsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="day" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Area type="monotone" dataKey="emails" stroke="#3b82f6" fillOpacity={1} fill="url(#emailsGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target size={20} />
                      Goal Progress
                    </CardTitle>
                    <Badge variant="success">On Track</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <AnimatedProgress value={87} color="green" label="Monthly Email Goal" />
                  </div>
                  <div>
                    <AnimatedProgress value={92} color="purple" label="Reply Rate Target" />
                  </div>
                  <div>
                    <AnimatedProgress value={76} color="cyan" label="Meetings Booked" />
                  </div>
                  <div>
                    <AnimatedProgress value={68} color="orange" label="Pipeline Revenue" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Campaigns & Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Campaigns</CardTitle>
                  <CardDescription>Your running outreach campaigns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'Q1 Enterprise Outreach', status: 'active', leads: 450, sent: 1250, replies: 89, replyRate: 7.1 },
                    { name: 'SaaS Decision Makers', status: 'active', leads: 320, sent: 890, replies: 78, replyRate: 8.8 },
                    { name: 'Tech Startup Founders', status: 'paused', leads: 180, sent: 540, replies: 32, replyRate: 5.9 }
                  ].map((campaign, index) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-white/5 hover:border-accent-300 transition-colors">
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
                          campaign.replyRate > 7 ? 'text-green-600' : 'text-orange-600'
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest lead interactions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { lead: 'Sarah Chen', action: 'booked a meeting', company: 'TechCorp Inc', time: '2 min ago', type: 'meeting', avatar: '👩' },
                    { lead: 'Michael Park', action: 'replied to email', company: 'DataFlow Systems', time: '15 min ago', type: 'reply', avatar: '👨' },
                    { lead: 'Emily Rodriguez', action: 'opened email 3x', company: 'CloudScale', time: '1 hour ago', type: 'open', avatar: '👩‍💼' }
                  ].map((activity, index) => (
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
                        {activity.type === 'meeting' && <Calendar size={16} className="text-green-600" />}
                        {activity.type === 'reply' && <Mail size={16} className="text-blue-600" />}
                        {activity.type === 'open' && <Target size={16} className="text-gray-600" />}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="emails" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reply Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="replies" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Meetings Scheduled</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="meetings" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {[
                {
                  title: 'Best Send Times',
                  icon: <Clock className="text-blue-600" />,
                  insight: 'Tuesday 10 AM and Thursday 2 PM show 3x higher reply rates',
                  confidence: 94,
                  action: 'Apply to Campaigns'
                },
                {
                  title: 'Subject Line Optimization',
                  icon: <MessageSquare className="text-purple-600" />,
                  insight: 'Questions in subject lines increase open rates by 27%',
                  confidence: 88,
                  action: 'Generate Examples'
                },
                {
                  title: 'Lead Scoring Update',
                  icon: <Target className="text-green-600" />,
                  insight: '12 leads shifted to "hot" status based on engagement signals',
                  confidence: 91,
                  action: 'Review Leads'
                },
                {
                  title: 'Campaign Performance',
                  icon: <TrendingUp className="text-orange-600" />,
                  insight: 'Enterprise campaign outperforming by 34% - scale recommended',
                  confidence: 96,
                  action: 'Scale Campaign'
                }
              ].map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                          {item.icon}
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                      </div>
                      <Badge variant="accent">AI</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{item.insight}</p>
                    <div className="mb-4">
                      <AnimatedProgress value={item.confidence} color="purple" label="Confidence" />
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Sparkles size={14} />
                      {item.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Quick Actions Tab */}
          <TabsContent value="quick-actions" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={goto('/campaigns')}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Target size={32} className="text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Create Campaign</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Launch a new outreach campaign</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={goto('/leads')}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <Users size={32} className="text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Import Leads</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Add new leads to your database</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={goto('/ai-assistant')}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Sparkles size={32} className="text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Ask Ava AI</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get AI-powered assistance</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={goto('/analytics')}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <BarChart3 size={32} className="text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">View Analytics</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Deep dive into your metrics</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={goto('/templates')}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                    <Mail size={32} className="text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Email Templates</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Browse proven templates</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={goto('/integrations')}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                    <Zap size={32} className="text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Integrations</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Connect your tools</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy size={20} className="text-yellow-500" />
                  Team Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Sarah Johnson', avatar: '👩', emails: 1250, replies: 112, meetings: 24, score: 95 },
                    { name: 'Mike Chen', avatar: '👨', emails: 1180, replies: 98, meetings: 22, score: 89 },
                    { name: 'Emily Davis', avatar: '👩‍💼', emails: 1050, replies: 89, meetings: 19, score: 84 }
                  ].map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-white/5">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl">
                          {member.avatar}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{member.name}</h4>
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>{member.emails} emails</span>
                            <span>{member.replies} replies</span>
                            <span>{member.meetings} meetings</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">{member.score}</div>
                          <div className="text-xs text-gray-500">Score</div>
                        </div>
                        {index === 0 && <Star className="text-yellow-500" size={24} />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
