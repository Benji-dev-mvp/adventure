// Exceptional Features - Real-Time Activity, Sequence Builder, Research Assistant, Predictive Analytics
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input, Textarea } from '../ui/Input';
import {
  Activity,
  Zap,
  Send,
  Mail,
  Linkedin,
  Phone,
  Clock,
  TrendingUp,
  Search,
  Brain,
  Calendar,
  Target,
  ArrowRight,
  Play,
  Pause,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

// REAL-TIME ACTIVITY FEED
export const RealTimeActivityFeed = () => {
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'email_sent',
      icon: '📧',
      text: 'Ava sent email to John Doe @ Acme Corp',
      time: 'Just now',
      status: 'success',
    },
    {
      id: 2,
      type: 'email_opened',
      icon: '👀',
      text: 'Sarah Smith opened "Partnership Opportunity"',
      time: '12 sec ago',
      status: 'hot',
    },
    {
      id: 3,
      type: 'response',
      icon: '💬',
      text: 'Positive response from Mike Johnson (92% confidence)',
      time: '1 min ago',
      status: 'qualified',
    },
    {
      id: 4,
      type: 'linkedin',
      icon: '💼',
      text: 'Ava sent LinkedIn connection to Jane Wilson',
      time: '2 min ago',
      status: 'success',
    },
  ]);

  const [isLive, setIsLive] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        type: ['email_sent', 'email_opened', 'response', 'linkedin'][Math.floor(Math.random() * 4)],
        icon: ['📧', '👀', '💬', '💼'][Math.floor(Math.random() * 4)],
        text: [
          'Ava sent email to prospect #' + Math.floor(Math.random() * 1000),
          'Email opened by prospect #' + Math.floor(Math.random() * 1000),
          'Positive response detected (AI confidence: ' +
            (85 + Math.floor(Math.random() * 15)) +
            '%)',
          'Ava sent LinkedIn message to prospect #' + Math.floor(Math.random() * 1000),
        ][Math.floor(Math.random() * 4)],
        time: 'Just now',
        status: ['success', 'hot', 'qualified'][Math.floor(Math.random() * 3)],
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="text-primary-500" size={20} />
            <CardTitle>Live Activity Feed</CardTitle>
            {isLive && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-semibold">LIVE</span>
              </div>
            )}
          </div>
          <Button size="sm" variant="outline" onClick={() => setIsLive(!isLive)}>
            {isLive ? <Pause size={14} /> : <Play size={14} />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {activities.map(activity => (
            <div
              key={activity.id}
              className={`p-3 rounded-lg border-l-4 transition-all ${
                activity.status === 'hot'
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 animate-pulse'
                  : activity.status === 'qualified'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{activity.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.text}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{activity.time}</p>
                </div>
                {activity.status === 'hot' && (
                  <Badge variant="danger" className="text-xs">
                    🔥 HOT
                  </Badge>
                )}
                {activity.status === 'qualified' && (
                  <Badge variant="success" className="text-xs">
                    ✓ Qualified
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

// ADVANCED SEQUENCE BUILDER
export const AdvancedSequenceBuilder = () => {
  const [steps, setSteps] = useState([
    {
      id: 1,
      type: 'email',
      channel: 'Email',
      subject: 'Partnership Opportunity',
      delay: 0,
      condition: null,
    },
    { id: 2, type: 'wait', channel: 'Wait', duration: '2 days', delay: 2, condition: null },
    {
      id: 3,
      type: 'condition',
      channel: 'If/Then',
      rule: 'If email opened',
      delay: 0,
      condition: 'opened',
    },
    {
      id: 4,
      type: 'linkedin',
      channel: 'LinkedIn',
      message: 'Connect request',
      delay: 0,
      condition: 'yes',
    },
    { id: 5, type: 'email', channel: 'Email', subject: 'Follow-up', delay: 0, condition: 'no' },
  ]);

  const [selectedStep, setSelectedStep] = useState(null);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-primary-500" size={20} />
            <CardTitle>Visual Sequence Builder</CardTitle>
          </div>
          <Button size="sm">
            <Plus size={14} className="mr-1" />
            Add Step
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Canvas */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 mb-4">
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={step.id} className="relative">
                {/* Indentation for conditional branches */}
                <div className={step.condition === 'yes' || step.condition === 'no' ? 'ml-8' : ''}>
                  <button
                    onClick={() => setSelectedStep(step.id)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedStep(step.id);
                      }
                    }}
                    className={`w-full p-4 rounded-lg border-2 cursor-pointer transition-all text-left ${
                      selectedStep === step.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-purple-300'
                    }`}
                    aria-label={`Select ${step.type} step`}
                    aria-pressed={selectedStep === step.id}
                  >
                    <div className="flex items-center gap-3">
                      {step.type === 'email' && <Mail size={20} className="text-blue-500" />}
                      {step.type === 'linkedin' && <Linkedin size={20} className="text-blue-600" />}
                      {step.type === 'wait' && <Clock size={20} className="text-gray-500" />}
                      {step.type === 'condition' && (
                        <Target size={20} className="text-purple-500" />
                      )}
                      {step.type === 'phone' && <Phone size={20} className="text-green-500" />}

                      <div className="flex-1">
                        <p className="font-semibold text-sm">{step.channel}</p>
                        {step.subject && <p className="text-xs text-gray-600">{step.subject}</p>}
                        {step.duration && (
                          <p className="text-xs text-gray-600">Wait {step.duration}</p>
                        )}
                        {step.rule && <p className="text-xs text-gray-600">{step.rule}</p>}
                      </div>

                      {step.condition === 'yes' && (
                        <Badge variant="success" className="text-xs">
                          YES
                        </Badge>
                      )}
                      {step.condition === 'no' && (
                        <Badge variant="secondary" className="text-xs">
                          NO
                        </Badge>
                      )}
                    </div>
                  </button>
                </div>

                {/* Arrow connector */}
                {idx < steps.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ArrowRight className="text-gray-400 rotate-90" size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{steps.length}</p>
            <p className="text-xs text-gray-600">Total Steps</p>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-2xl font-bold text-green-600">42%</p>
            <p className="text-xs text-gray-600">Completion Rate</p>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">8.5</p>
            <p className="text-xs text-gray-600">Avg Days to Reply</p>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">28%</p>
            <p className="text-xs text-gray-600">Meeting Booked</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// AVA RESEARCH ASSISTANT
export const AvaResearchAssistant = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [prospectData, setProspectData] = useState({
    name: 'John Doe',
    title: 'VP of Sales',
    company: 'Acme Corp',
    email: 'john@acme.com',
    linkedin: 'linkedin.com/in/johndoe',
    insights: [
      {
        category: 'Recent Activity',
        icon: '🔥',
        data: 'Started VP role 2 weeks ago at Acme Corp',
        relevance: 'high',
      },
      {
        category: 'Funding',
        icon: '💰',
        data: 'Acme raised $25M Series B 3 months ago (Tiger Global)',
        relevance: 'high',
      },
      {
        category: 'Social',
        icon: '𝕏',
        data: 'Posted about sales automation challenges on Twitter',
        relevance: 'medium',
      },
      {
        category: 'Company News',
        icon: '📰',
        data: 'Acme opened new office in Austin, TX',
        relevance: 'medium',
      },
      {
        category: 'Tech Stack',
        icon: '⚙️',
        data: 'Uses Salesforce, Outreach, ZoomInfo',
        relevance: 'high',
      },
      {
        category: 'Hiring',
        icon: '👔',
        data: 'Posted 3 SDR job openings last week',
        relevance: 'high',
      },
    ],
    score: 94,
    recommendation:
      'High-priority prospect. Reference new VP role and Series B funding in outreach.',
  });

  const handleResearch = () => {
    setIsResearching(true);
    setTimeout(() => {
      setIsResearching(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="text-primary-500" size={20} />
          <CardTitle>Ava Research Assistant</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Get instant prospect intelligence in 2 seconds
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter prospect name, email, or company..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleResearch} disabled={isResearching}>
              {isResearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Researching...
                </>
              ) : (
                <>
                  <Search size={16} className="mr-1" />
                  Research
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Prospect Card */}
        <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-bold">{prospectData.name}</h3>
              <p className="text-sm text-gray-600">
                {prospectData.title} @ {prospectData.company}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {prospectData.email}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  LinkedIn ↗
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{prospectData.score}</div>
              <p className="text-xs text-gray-600">Lead Score</p>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="space-y-2 mb-4">
          {prospectData.insights.map((insight, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border-l-4 ${
                insight.relevance === 'high'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-xl">{insight.icon}</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-600">{insight.category}</p>
                  <p className="text-sm">{insight.data}</p>
                </div>
                {insight.relevance === 'high' && (
                  <Badge variant="success" className="text-xs">
                    HIGH
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* AI Recommendation */}
        <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
          <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-2">
            🤖 Ava's Recommendation
          </p>
          <p className="text-sm">{prospectData.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// PREDICTIVE ANALYTICS
export const PredictiveAnalytics = () => {
  const [emailContent, setEmailContent] = useState(
    'Hi {{firstName}},\n\nCongrats on the new VP role! I noticed Acme just raised $25M...'
  );
  const [predictions] = useState({
    openRate: 78,
    replyRate: 24,
    spamScore: 12,
    sentiment: 'Positive',
    bestSendTime: '10:00 AM',
    improvements: [
      { text: 'Add a clear CTA', impact: '+8% reply rate' },
      { text: 'Shorten subject line', impact: '+5% open rate' },
      { text: 'Reference specific pain point', impact: '+12% engagement' },
    ],
  });

  const radarData = [
    { metric: 'Personalization', value: 85 },
    { metric: 'Clarity', value: 72 },
    { metric: 'CTA Strength', value: 65 },
    { metric: 'Length', value: 90 },
    { metric: 'Tone', value: 88 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="text-primary-500" size={20} />
          <CardTitle>Email Performance Predictor</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          AI predicts email performance before you send
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Left: Email Input */}
          <div>
            <label htmlFor="email-content-input" className="text-sm font-semibold mb-2 block">
              Email Content
            </label>
            <Textarea
              id="email-content-input"
              value={emailContent}
              onChange={e => setEmailContent(e.target.value)}
              rows={10}
              className="font-mono text-xs"
            />
          </div>

          {/* Right: Predictions */}
          <div>
            <label className="text-sm font-semibold mb-2 block" aria-label="Predicted Performance">
              Predicted Performance
            </label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Eye className="mx-auto text-green-600 mb-1" size={20} />
                <p className="text-2xl font-bold text-green-600">{predictions.openRate}%</p>
                <p className="text-xs text-gray-600">Open Rate</p>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Send className="mx-auto text-blue-600 mb-1" size={20} />
                <p className="text-2xl font-bold text-blue-600">{predictions.replyRate}%</p>
                <p className="text-xs text-gray-600">Reply Rate</p>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <AlertTriangle className="mx-auto text-orange-600 mb-1" size={20} />
                <p className="text-2xl font-bold text-orange-600">{predictions.spamScore}%</p>
                <p className="text-xs text-gray-600">Spam Risk</p>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Clock className="mx-auto text-purple-600 mb-1" size={20} />
                <p className="text-sm font-bold text-purple-600">{predictions.bestSendTime}</p>
                <p className="text-xs text-gray-600">Best Send Time</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Improvements */}
        <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
          <p className="text-sm font-semibold mb-3">💡 AI Suggestions to Improve Performance</p>
          <div className="space-y-2">
            {predictions.improvements.map((improvement, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span>• {improvement.text}</span>
                <Badge variant="success" className="text-xs">
                  {improvement.impact}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// SMART MEETING SCHEDULER
export const SmartMeetingScheduler = () => {
  const [suggestedTimes] = useState([
    {
      date: 'Tomorrow',
      time: '10:00 AM',
      score: 95,
      reason: 'High response rate at this time',
      both: true,
    },
    {
      date: 'Tomorrow',
      time: '2:00 PM',
      score: 88,
      reason: 'Both calendars available',
      both: true,
    },
    {
      date: 'Dec 29',
      time: '11:00 AM',
      score: 82,
      reason: 'End of week typically good',
      both: false,
    },
    { date: 'Dec 29', time: '3:00 PM', score: 75, reason: 'Available slot', both: true },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="text-primary-500" size={20} />
          <CardTitle>AI Meeting Scheduler</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Smart time suggestions based on both calendars
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm font-semibold">Scheduling with: John Doe @ Acme Corp</p>
          <p className="text-xs text-gray-600 mt-1">Meeting type: Product Demo (30 min)</p>
        </div>

        <div className="space-y-2">
          {suggestedTimes.map((slot, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                idx === 0
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-purple-500" />
                  <div>
                    <p className="font-semibold text-sm">
                      {slot.date} at {slot.time}
                    </p>
                    <p className="text-xs text-gray-600">{slot.reason}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{slot.score}</div>
                    <p className="text-xs text-gray-600">AI Score</p>
                  </div>
                  {idx === 0 && (
                    <Badge variant="success" className="text-xs">
                      BEST
                    </Badge>
                  )}
                </div>
              </div>
              {slot.both && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle size={12} />
                  <span>Both calendars available</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <Button className="w-full mt-4">Send Scheduling Link</Button>
      </CardContent>
    </Card>
  );
};
