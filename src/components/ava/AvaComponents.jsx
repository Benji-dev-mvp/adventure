// Ava AI BDR Components - Core Platform Features
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input, Textarea } from '../ui/Input';
import {
  Bot,
  Mail,
  TrendingUp,
  Sparkles,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Brain,
  Target,
  Loader,
} from 'lucide-react';
import { LineChart } from 'recharts/es6/chart/LineChart.js';
import { Line } from 'recharts/es6/cartesian/Line.js';
import { BarChart } from 'recharts/es6/chart/BarChart.js';
import { Bar } from 'recharts/es6/cartesian/Bar.js';
import { AreaChart } from 'recharts/es6/chart/AreaChart.js';
import { Area } from 'recharts/es6/cartesian/Area.js';
import { XAxis } from 'recharts/es6/cartesian/XAxis.js';
import { YAxis } from 'recharts/es6/cartesian/YAxis.js';
import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid.js';
import { Tooltip } from 'recharts/es6/component/Tooltip.js';
import { Legend } from 'recharts/es6/component/Legend.js';
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer.js';
import { useToast } from '../Toast';

// AVA CHAT INTERFACE - Main interaction hub
export const AvaChatInterface = () => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState([
    {
      sender: 'ava',
      text: "👋 Hi! I'm Ava, your AI BDR. I've analyzed your target accounts and found 247 high-intent prospects. Ready to launch a campaign?",
      time: '2 min ago',
    },
    { sender: 'user', text: 'Yes! What do you recommend?', time: '1 min ago' },
    {
      sender: 'ava',
      text: '🎯 I recommend a 5-step email sequence targeting VP of Sales at Series B companies. I found 89 prospects who just raised funding. Want me to set it up?',
      time: '30 sec ago',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input, time: 'Just now' };
    setMessages([...messages, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate Ava thinking and responding
    setTimeout(() => {
      const responses = [
        "✅ Done! I've created a 5-step sequence and queued up 89 prospects. Want to review before I send?",
        "📊 I've analyzed your request. Here's what I found: 127 matching prospects with 31% avg response rate potential.",
        '🎯 Great question! Based on your ICP, I recommend focusing on Series B SaaS companies in fintech. I found 45 perfect matches.',
        "💡 Smart move! I'll set that up right away. Expected completion: 2 minutes.",
      ];
      const avaMsg = {
        sender: 'ava',
        text: responses[Math.floor(Math.random() * responses.length)],
        time: 'Just now',
      };
      setMessages(prev => [...prev, avaMsg]);
      setIsTyping(false);
      showToast('Ava responded!', 'success');
    }, 2000);
  };

  const handleQuickAction = actionText => {
    setInput(actionText);
    showToast('Recommendation added to chat. Click send when ready!', 'info');
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Bot className="text-white" size={24} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <CardTitle className="text-lg">Chat with Ava</CardTitle>
              <p className="text-xs text-gray-600 dark:text-gray-400">Your AI BDR • Online</p>
            </div>
          </div>
          <Badge variant="success" className="gap-1">
            <Sparkles size={12} />
            AI Active
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] ${msg.sender === 'ava' ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-blue-500 text-white'} rounded-lg p-3`}
            >
              <p className="text-sm">{msg.text}</p>
              <p
                className={`text-xs mt-1 ${msg.sender === 'ava' ? 'text-gray-600 dark:text-gray-400' : 'text-blue-100'}`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* AI Recommendations - Click to add to input */}
        <div className="space-y-2 pt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            💡 AI Recommendations (click to use):
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              onClick={() =>
                handleQuickAction('Show me my campaign performance from the last 30 days')
              }
            >
              📊 Show campaign performance
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              onClick={() =>
                handleQuickAction('Find me 50 more high-intent prospects in my target ICP')
              }
            >
              🎯 Find more prospects
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              onClick={() =>
                handleQuickAction(
                  'Write a personalized email for my top prospect with their recent funding news'
                )
              }
            >
              ✍️ Write email for me
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              onClick={() =>
                handleQuickAction('Create a 5-step outbound sequence for Series B SaaS companies')
              }
            >
              🚀 Create sequence
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              onClick={() => handleQuickAction('Analyze sentiment of all replies from this week')}
            >
              💬 Analyze replies
            </Button>
          </div>
        </div>
      </CardContent>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Ask Ava anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!input.trim()}>
            <Send size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

// EMAIL DELIVERABILITY DASHBOARD
export const EmailDeliverabilityDashboard = () => {
  const { showToast } = useToast();
  const [mailboxes] = useState([
    {
      email: 'john@company.com',
      status: 'healthy',
      warmupProgress: 87,
      dailyLimit: 50,
      sent: 42,
      health: 94,
    },
    {
      email: 'sarah@company.com',
      status: 'warming',
      warmupProgress: 34,
      dailyLimit: 20,
      sent: 15,
      health: 78,
    },
    {
      email: 'mike@company.com',
      status: 'healthy',
      warmupProgress: 100,
      dailyLimit: 80,
      sent: 63,
      health: 98,
    },
  ]);

  const handleAddMailbox = () => {
    showToast('Opening mailbox connection wizard...', 'info');
    setTimeout(() => {
      showToast('Mailbox connected successfully! Warmup will begin automatically.', 'success');
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="text-primary-500" size={20} />
          <CardTitle>Email Deliverability</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ava manages your mailbox health automatically
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mailboxes.map((box, idx) => (
            <div key={idx} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-sm">{box.email}</p>
                  <Badge
                    variant={box.status === 'healthy' ? 'success' : 'warning'}
                    className="text-xs mt-1"
                  >
                    {box.status === 'healthy' ? '✓ Healthy' : '⏳ Warming Up'}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Health Score</p>
                  <p className="text-2xl font-bold text-green-600">{box.health}%</p>
                </div>
              </div>

              {/* Warmup Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Warmup Progress</span>
                  <span className="font-semibold">{box.warmupProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    style={{ width: `${box.warmupProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Daily Sending */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 dark:bg-white/5 rounded p-2">
                  <p className="text-xs text-gray-600">Daily Limit</p>
                  <p className="font-bold">{box.dailyLimit}</p>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 rounded p-2">
                  <p className="text-xs text-gray-600">Sent Today</p>
                  <p className="font-bold text-blue-600">{box.sent}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full mt-4" onClick={handleAddMailbox}>
          + Add Mailbox
        </Button>
      </CardContent>
    </Card>
  );
};

// DATA MINER DASHBOARD
export const DataMinerDashboard = () => {
  const { showToast } = useToast();
  const [dataSourcesActivity] = useState([
    { source: 'Twitter/X', icon: '𝕏', insights: 1247, status: 'active', lastUpdate: '2 min ago' },
    { source: 'LinkedIn', icon: '💼', insights: 892, status: 'active', lastUpdate: '5 min ago' },
    { source: 'Crunchbase', icon: '💰', insights: 345, status: 'active', lastUpdate: '10 min ago' },
    {
      source: 'Press Releases',
      icon: '📰',
      insights: 156,
      status: 'active',
      lastUpdate: '15 min ago',
    },
    {
      source: 'Job Postings',
      icon: '👔',
      insights: 523,
      status: 'active',
      lastUpdate: '8 min ago',
    },
    {
      source: 'Company News',
      icon: '📢',
      insights: 234,
      status: 'active',
      lastUpdate: '12 min ago',
    },
  ]);

  const handleSourceClick = source => {
    showToast(`Viewing ${source.insights} insights from ${source.source}...`, 'info');
    setTimeout(() => {
      showToast(
        `Found ${Math.floor(Math.random() * 50)} high-intent signals in ${source.source}!`,
        'success'
      );
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="text-primary-500" size={20} />
          <CardTitle>Ava's Data Miner</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ava is actively mining data from 6 sources
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">3,397</p>
            <p className="text-xs text-gray-600">Total Insights</p>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-3xl font-bold text-green-600">247</p>
            <p className="text-xs text-gray-600">High-Intent Signals</p>
          </div>
        </div>

        <div className="space-y-2">
          {dataSourcesActivity.map((source, idx) => (
            <div
              key={idx}
              role="button"
              tabIndex={0}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-all hover:scale-102 hover:shadow-md"
              onClick={() => handleSourceClick(source)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSourceClick(source);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{source.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{source.source}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{source.lastUpdate}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="success" className="text-xs mb-1">
                  {source.status}
                </Badge>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {source.insights} insights
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// PERSONALIZATION WATERFALL VIEWER
export const PersonalizationWaterfallViewer = () => {
  const [prospect] = useState({
    name: 'John Doe',
    company: 'Acme Corp',
    waterfall: [
      {
        level: '1st Priority',
        type: 'Recent Job Change',
        available: true,
        data: 'Started VP of Sales 2 weeks ago',
      },
      {
        level: '2nd Priority',
        type: 'Funding Round',
        available: true,
        data: 'Series B - $25M raised 3 months ago',
      },
      {
        level: '3rd Priority',
        type: 'Twitter Activity',
        available: true,
        data: 'Posted about sales automation',
      },
      { level: '4th Priority', type: 'Hiring Activity', available: false, data: null },
      {
        level: '5th Priority',
        type: 'Company News',
        available: true,
        data: 'Opened new office in Austin',
      },
      {
        level: 'Fallback',
        type: 'Generic Template',
        available: true,
        data: 'Industry-based template',
      },
    ],
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary-500" size={20} />
          <CardTitle>Personalization Waterfall</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          How Ava chooses the best personalization
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm font-semibold">
            {prospect.name} @ {prospect.company}
          </p>
          <Badge variant="success" className="text-xs mt-1">
            ✓ Best Personalization Found
          </Badge>
        </div>

        <div className="space-y-2">
          {prospect.waterfall.map((level, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border-l-4 ${
                level.available && idx === 0
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : level.available
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 bg-gray-50 dark:bg-gray-800/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-600">{level.level}</p>
                  <p className="font-semibold text-sm">{level.type}</p>
                  {level.available && <p className="text-xs text-gray-600 mt-1">{level.data}</p>}
                </div>
                {level.available ? (
                  idx === 0 ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Available
                    </Badge>
                  )
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Not Available
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">
            ✨ Ava's Choice
          </p>
          <p className="text-sm mt-1">
            "Hi John, congrats on the VP of Sales role! I noticed Acme just raised $25M..."
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// SENTIMENT ANALYSIS DASHBOARD
export const SentimentAnalysisDashboard = () => {
  const [responses] = useState([
    {
      from: 'john@acme.com',
      subject: 'Re: Interested',
      sentiment: 'positive',
      score: 92,
      text: 'This looks great! Can we schedule a demo?',
      time: '5 min ago',
    },
    {
      from: 'sarah@tech.co',
      subject: 'Re: Not now',
      sentiment: 'negative',
      score: 15,
      text: 'Not interested at this time',
      time: '12 min ago',
    },
    {
      from: 'mike@startup.io',
      subject: 'Re: Tell me more',
      sentiment: 'positive',
      score: 78,
      text: 'Interesting! Send me more info',
      time: '18 min ago',
    },
    {
      from: 'lisa@corp.com',
      subject: 'Re: Maybe later',
      sentiment: 'neutral',
      score: 45,
      text: "Let's reconnect next quarter",
      time: '25 min ago',
    },
  ]);

  const stats = {
    positive: responses.filter(r => r.sentiment === 'positive').length,
    negative: responses.filter(r => r.sentiment === 'negative').length,
    neutral: responses.filter(r => r.sentiment === 'neutral').length,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="text-primary-500" size={20} />
          <CardTitle>Sentiment Analysis</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ava automatically detects response sentiment
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <ThumbsUp className="mx-auto text-green-600 mb-1" size={20} />
            <p className="text-2xl font-bold text-green-600">{stats.positive}</p>
            <p className="text-xs text-gray-600">Positive</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="w-5 h-5 mx-auto bg-gray-400 rounded-full mb-1"></div>
            <p className="text-2xl font-bold text-gray-600">{stats.neutral}</p>
            <p className="text-xs text-gray-600">Neutral</p>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <ThumbsDown className="mx-auto text-red-600 mb-1" size={20} />
            <p className="text-2xl font-bold text-red-600">{stats.negative}</p>
            <p className="text-xs text-gray-600">Negative</p>
          </div>
        </div>

        <div className="space-y-2">
          {responses.map((response, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border-l-4 ${
                response.sentiment === 'positive'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : response.sentiment === 'negative'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 bg-gray-50 dark:bg-gray-800/50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-sm">{response.from}</p>
                  <p className="text-xs text-gray-600">{response.subject}</p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      response.sentiment === 'positive'
                        ? 'success'
                        : response.sentiment === 'negative'
                          ? 'danger'
                          : 'secondary'
                    }
                    className="text-xs"
                  >
                    {response.score}% {response.sentiment}
                  </Badge>
                  <p className="text-xs text-gray-600 mt-1">{response.time}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">"{response.text}"</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// LEAD QUALIFICATION PIPELINE
export const LeadQualificationPipeline = () => {
  const [qualifiedLeads] = useState([
    {
      name: 'John Doe',
      company: 'Acme Corp',
      score: 94,
      status: 'hot',
      reason: 'Requested demo, opened 3 emails',
      handedOff: false,
    },
    {
      name: 'Sarah Smith',
      company: 'Tech Co',
      score: 88,
      status: 'warm',
      reason: 'Positive reply, high engagement',
      handedOff: false,
    },
    {
      name: 'Mike Johnson',
      company: 'Startup Inc',
      score: 76,
      status: 'warm',
      reason: 'Downloaded whitepaper, visited pricing',
      handedOff: true,
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="text-primary-500" size={20} />
          <CardTitle>Qualified Leads (Ava → You)</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Hot leads Ava has handed over to your sales team
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {qualifiedLeads.map((lead, idx) => (
            <div
              key={idx}
              className="p-4 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{lead.name}</p>
                  <p className="text-sm text-gray-600">{lead.company}</p>
                </div>
                <div className="text-right">
                  <Badge variant={lead.status === 'hot' ? 'danger' : 'warning'} className="mb-1">
                    🔥 {lead.status.toUpperCase()}
                  </Badge>
                  <p className="text-xs font-bold text-green-600">Score: {lead.score}</p>
                </div>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">📊 {lead.reason}</p>

              <div className="flex gap-2">
                {!lead.handedOff ? (
                  <>
                    <Button size="sm" className="flex-1">
                      📞 Call Now
                    </Button>
                    <Button size="sm" variant="outline">
                      📧 Send Email
                    </Button>
                  </>
                ) : (
                  <Badge variant="secondary" className="w-full justify-center">
                    ✓ Handed Off to Sales Team
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// AVA PERFORMANCE TRACKER
export const AvaPerformanceTracker = () => {
  const performanceData = [
    { week: 'Week 1', responseRate: 12, meetingsBooked: 3 },
    { week: 'Week 2', responseRate: 18, meetingsBooked: 5 },
    { week: 'Week 3', responseRate: 24, meetingsBooked: 8 },
    { week: 'Week 4', responseRate: 31, meetingsBooked: 12 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="text-primary-500" size={20} />
          <CardTitle>Ava's Performance Over Time</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ava is learning and optimizing continuously
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">+158%</p>
            <p className="text-xs text-gray-600">Response Rate ↑</p>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-2xl font-bold text-green-600">+300%</p>
            <p className="text-xs text-gray-600">Meetings Booked ↑</p>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">31%</p>
            <p className="text-xs text-gray-600">Current Rate</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="responseRate"
              stroke="#8b5cf6"
              name="Response Rate %"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="meetingsBooked"
              stroke="#10b981"
              name="Meetings Booked"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
          <p className="text-sm font-semibold">✨ Ava's Latest Optimization</p>
          <p className="text-xs text-gray-600 mt-1">
            Adjusted email tone to be more conversational based on positive feedback patterns.
            Expected +5% boost in response rate.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// AVA TRAINING INTERFACE
export const AvaTrainingInterface = () => {
  const [feedback, setFeedback] = useState('');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="text-primary-500" size={20} />
          <CardTitle>Train Ava</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Provide coaching to improve Ava's performance
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-semibold mb-2 block" role="heading" aria-level="3">
              Writing Style Preferences
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                More Professional
              </Button>
              <Button variant="outline" size="sm">
                More Casual
              </Button>
              <Button variant="outline" size="sm">
                Shorter Emails
              </Button>
              <Button variant="outline" size="sm">
                More Details
              </Button>
            </div>
          </div>

          <div>
            <label htmlFor="ava-feedback" className="text-sm font-semibold mb-2 block">
              Custom Feedback
            </label>
            <Textarea
              id="ava-feedback"
              placeholder="Tell Ava what to improve... (e.g., 'Be more specific about ROI in emails')"
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              rows={4}
            />
          </div>

          <Button className="w-full">
            <Sparkles size={16} className="mr-2" />
            Submit Feedback to Ava
          </Button>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
              Recent Training
            </p>
            <ul className="text-xs text-gray-600 mt-2 space-y-1">
              <li>✓ "Focus on pain points first" - Applied 2 days ago</li>
              <li>✓ "Use more industry-specific examples" - Applied 5 days ago</li>
              <li>✓ "Keep subject lines under 50 characters" - Applied 1 week ago</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// B2B DATABASE SEARCH
export const B2BDatabaseSearch = () => {
  const [results] = useState([
    {
      name: 'John Doe',
      title: 'VP of Sales',
      company: 'Acme Corp',
      employees: '501-1000',
      verified: true,
    },
    {
      name: 'Sarah Smith',
      title: 'Director of Marketing',
      company: 'Tech Co',
      employees: '201-500',
      verified: true,
    },
    {
      name: 'Mike Johnson',
      title: 'CEO',
      company: 'Startup Inc',
      employees: '11-50',
      verified: true,
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="text-primary-500" size={20} />
          <CardTitle>B2B Database (300M+ Contacts)</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          <Input placeholder="Search by name, title, or company..." />
          <div className="grid grid-cols-2 gap-2">
            <select className="p-2 border rounded-lg text-sm">
              <option>Title</option>
              <option>VP of Sales</option>
              <option>Director</option>
              <option>CEO</option>
            </select>
            <select className="p-2 border rounded-lg text-sm">
              <option>Company Size</option>
              <option>1-10</option>
              <option>11-50</option>
              <option>51-200</option>
            </select>
          </div>
        </div>

        <div className="mb-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-center">
          <p className="text-sm font-semibold">Found 12,847 contacts</p>
        </div>

        <div className="space-y-2">
          {results.map((contact, idx) => (
            <div key={idx} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-white/5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{contact.name}</p>
                    {contact.verified && (
                      <Badge variant="success" className="text-xs">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{contact.title}</p>
                  <p className="text-xs text-gray-600">
                    {contact.company} • {contact.employees} employees
                  </p>
                </div>
                <Button size="sm">Add to Campaign</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
