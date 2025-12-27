// AI & Machine Learning Components
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Brain, TrendingUp, AlertTriangle, Target, Mail, Zap, BarChart3, MessageSquare } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

export const AILeadScoringTrainer = () => {
  const [trainingData, setTrainingData] = useState({ closedWon: 245, closedLost: 189 });
  const [accuracy, setAccuracy] = useState(87.4);
  
  const features = [
    { name: 'Email Engagement', weight: 28, impact: 'High' },
    { name: 'Company Size', weight: 22, impact: 'High' },
    { name: 'Industry Match', weight: 18, impact: 'Medium' },
    { name: 'Job Title', weight: 15, impact: 'Medium' },
    { name: 'Website Visits', weight: 12, impact: 'Medium' },
    { name: 'Content Downloads', weight: 5, impact: 'Low' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="text-primary-500" size={20} />
          <CardTitle>AI Lead Scoring Model Trainer</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Model Accuracy</span>
              <Badge variant="success">{accuracy}%</Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${accuracy}%` }}></div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Trained on {trainingData.closedWon + trainingData.closedLost} historical deals
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Feature Importance</h4>
            <div className="space-y-2">
              {features.map(feature => (
                <div key={feature.name} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{feature.name}</span>
                      <span className="text-gray-600">{feature.weight}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${feature.weight}%` }}></div>
                    </div>
                  </div>
                  <Badge variant={feature.impact === 'High' ? 'success' : feature.impact === 'Medium' ? 'warning' : 'secondary'} className="text-xs">
                    {feature.impact}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full" onClick={() => setAccuracy(accuracy + Math.random() * 2)}>
            Retrain Model with Latest Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const ConversationIntelligence = () => {
  const [selectedConv, setSelectedConv] = useState(null);
  
  const conversations = [
    { id: 1, contact: 'John Doe - Acme Corp', sentiment: 'positive', score: 8.5, keywords: ['budget', 'timeline', 'demo'] },
    { id: 2, contact: 'Jane Smith - TechCo', sentiment: 'neutral', score: 6.2, keywords: ['pricing', 'features'] },
    { id: 3, contact: 'Bob Johnson - StartupXYZ', sentiment: 'negative', score: 3.8, keywords: ['expensive', 'competitor'] }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="text-primary-500" size={20} />
          <CardTitle>Conversation Intelligence</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {conversations.map(conv => (
            <div key={conv.id} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer"
                 onClick={() => setSelectedConv(conv)}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-sm">{conv.contact}</h4>
                <Badge variant={conv.sentiment === 'positive' ? 'success' : conv.sentiment === 'neutral' ? 'warning' : 'error'}>
                  {conv.sentiment}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-600">Engagement Score:</span>
                <span className="text-sm font-bold text-primary-600">{conv.score}/10</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {conv.keywords.map(kw => (
                  <Badge key={kw} variant="secondary" className="text-xs">{kw}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4">Analyze All Conversations</Button>
      </CardContent>
    </Card>
  );
};

export const ChurnPrediction = () => {
  const [churnRisk, setChurnRisk] = useState([
    { company: 'Acme Corp', risk: 85, indicators: ['No login 30+ days', 'Support tickets up 40%'] },
    { company: 'TechCo', risk: 62, indicators: ['Usage down 25%'] },
    { company: 'StartupXYZ', risk: 28, indicators: ['Active user growth'] }
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-primary-500" size={20} />
          <CardTitle>Churn Prediction Engine</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {churnRisk.map((account, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">{account.company}</h4>
                <Badge variant={account.risk > 70 ? 'error' : account.risk > 40 ? 'warning' : 'success'}>
                  {account.risk}% risk
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full ${account.risk > 70 ? 'bg-red-500' : account.risk > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${account.risk}%` }}
                ></div>
              </div>
              <ul className="text-xs text-gray-600 space-y-1">
                {account.indicators.map((ind, i) => (
                  <li key={i}>• {ind}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">View All At-Risk Accounts</Button>
      </CardContent>
    </Card>
  );
};

export const NextBestActionEngine = () => {
  const recommendations = [
    { lead: 'Sarah Johnson', action: 'Send case study', confidence: 92, reasoning: 'Downloaded pricing 3x, similar to closed-won profile' },
    { lead: 'Mike Chen', action: 'Schedule call', confidence: 88, reasoning: 'Opened last 5 emails, viewed demo video' },
    { lead: 'Lisa Brown', action: 'Share ROI calculator', confidence: 76, reasoning: 'Asked about pricing in last reply' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="text-primary-500" size={20} />
          <CardTitle>Next Best Action Engine</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/10 dark:to-transparent">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{rec.lead}</h4>
                  <p className="text-sm text-primary-600 font-medium mt-1">→ {rec.action}</p>
                </div>
                <Badge variant="success">{rec.confidence}% confident</Badge>
              </div>
              <p className="text-xs text-gray-600 mb-3">{rec.reasoning}</p>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">Take Action</Button>
                <Button size="sm" variant="outline">Dismiss</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const EmailReplyCategorizer = () => {
  const [categories, setCategories] = useState([
    { name: 'Interested', count: 34, color: 'bg-green-500', examples: ['Let\'s schedule a call', 'Tell me more'] },
    { name: 'Not Interested', count: 12, color: 'bg-red-500', examples: ['Not the right time', 'Already have solution'] },
    { name: 'Objection', count: 8, color: 'bg-yellow-500', examples: ['Too expensive', 'Need more info'] },
    { name: 'Out of Office', count: 15, color: 'bg-gray-500', examples: ['On vacation', 'Will return'] },
    { name: 'Request More Info', count: 22, color: 'bg-blue-500', examples: ['Send pricing', 'Share case study'] }
  ]);

  const total = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="text-primary-500" size={20} />
          <CardTitle>Email Reply Auto-Categorizer</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-1 h-4 rounded-full overflow-hidden">
            {categories.map(cat => (
              <div 
                key={cat.name}
                className={cat.color}
                style={{ width: `${(cat.count / total) * 100}%` }}
                title={`${cat.name}: ${cat.count}`}
              ></div>
            ))}
          </div>
          
          <div className="space-y-2">
            {categories.map(cat => (
              <div key={cat.name} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                  <span className="font-medium">{cat.name}</span>
                </div>
                <Badge variant="secondary">{cat.count} replies</Badge>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full">Configure Categories</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const ABTestOptimizer = () => {
  const [tests, setTests] = useState([
    { name: 'Subject Line Test', variants: 3, winner: 'B', improvement: '+12%', status: 'completed' },
    { name: 'Send Time Test', variants: 4, winner: 'TBD', improvement: 'N/A', status: 'running' },
    { name: 'Email Copy Test', variants: 2, winner: 'TBD', improvement: 'N/A', status: 'running' }
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="text-primary-500" size={20} />
          <CardTitle>A/B Test Auto-Optimizer</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tests.map((test, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-sm">{test.name}</h4>
                <Badge variant={test.status === 'completed' ? 'success' : 'warning'}>
                  {test.status}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 text-xs">Variants</p>
                  <p className="font-bold">{test.variants}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Winner</p>
                  <p className="font-bold">{test.winner}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Improvement</p>
                  <p className="font-bold text-green-600">{test.improvement}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">Create New Test</Button>
      </CardContent>
    </Card>
  );
};

export const SentimentTrendAnalysis = () => {
  const data = [
    { date: 'Week 1', positive: 65, neutral: 25, negative: 10 },
    { date: 'Week 2', positive: 70, neutral: 22, negative: 8 },
    { date: 'Week 3', positive: 68, neutral: 24, negative: 8 },
    { date: 'Week 4', positive: 75, neutral: 20, negative: 5 }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="text-primary-500" size={20} />
          <CardTitle>Sentiment Trend Analysis</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="neutral" stroke="#f59e0b" strokeWidth={2} />
            <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-2xl font-bold text-green-600">↑ 10%</p>
            <p className="text-xs text-gray-600">Positive Trend</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">→ 0%</p>
            <p className="text-xs text-gray-600">Neutral Stable</p>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-2xl font-bold text-red-600">↓ 5%</p>
            <p className="text-xs text-gray-600">Negative Down</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const SmartReplyGenerator = () => {
  const [context, setContext] = useState('Customer asks about pricing for Enterprise plan');
  const [suggestions, setSuggestions] = useState([
    { reply: 'Our Enterprise plan starts at $999/month and includes...', tone: 'Professional', confidence: 94 },
    { reply: 'Great question! Let me share our Enterprise pricing...', tone: 'Friendly', confidence: 89 },
    { reply: 'I\'d be happy to discuss Enterprise pricing with you...', tone: 'Conversational', confidence: 86 }
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="text-primary-500" size={20} />
          <CardTitle>Smart Reply Generator</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Context</label>
            <Input 
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Describe the conversation context..."
              className="mt-1"
            />
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">AI-Generated Replies</h4>
            {suggestions.map((sug, idx) => (
              <div key={idx} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="text-xs">{sug.tone}</Badge>
                  <Badge variant="success" className="text-xs">{sug.confidence}%</Badge>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{sug.reply}</p>
                <Button size="sm" variant="outline" className="mt-2">Use This Reply</Button>
              </div>
            ))}
          </div>

          <Button className="w-full">Generate More Suggestions</Button>
        </div>
      </CardContent>
    </Card>
  );
};
