import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ThumbsUp, AlertCircle, Lightbulb, Download } from 'lucide-react';

const CallIntelligence = () => {
  const [selectedCall, setSelectedCall] = useState(0);

  const calls = [
    {
      id: 1,
      lead: 'Sarah Chen - TechCorp',
      duration: '18:42',
      date: '2024-01-15 10:30 AM',
      sentiment: 'positive',
      score: 85,
      transcript: [
        {
          time: '0:12',
          speaker: 'Rep',
          text: 'Hi Sarah, thanks for taking my call. How are you today?',
          sentiment: 'neutral',
        },
        {
          time: '0:18',
          speaker: 'Sarah',
          text: "Good morning! I'm doing well, thanks. I've been looking forward to this chat.",
          sentiment: 'positive',
        },
        {
          time: '0:25',
          speaker: 'Rep',
          text: "Great! I understand you're looking to improve your sales outreach?",
          sentiment: 'neutral',
        },
        {
          time: '0:32',
          speaker: 'Sarah',
          text: "Yes, we're currently struggling with response rates. Our current tool just isn't cutting it.",
          sentiment: 'negative',
        },
        {
          time: '0:45',
          speaker: 'Rep',
          text: "I hear you. That's exactly what our AI assistant Ava is designed to solve. She can personalize at scale.",
          sentiment: 'positive',
        },
        {
          time: '0:58',
          speaker: 'Sarah',
          text: 'That sounds interesting. What kind of ROI are your clients seeing?',
          sentiment: 'positive',
        },
        {
          time: '1:05',
          speaker: 'Rep',
          text: 'Most see 3-5x improvement in reply rates within 30 days. I can send you case studies.',
          sentiment: 'positive',
        },
        {
          time: '1:15',
          speaker: 'Sarah',
          text: "Perfect. What about pricing? That's always a concern.",
          sentiment: 'neutral',
        },
        {
          time: '1:22',
          speaker: 'Rep',
          text: 'Let me walk you through our plans. We have options starting at $499/month for up to 5 users.',
          sentiment: 'neutral',
        },
        {
          time: '1:35',
          speaker: 'Sarah',
          text: "That's reasonable. Can we schedule a demo with my team?",
          sentiment: 'positive',
        },
      ],
      keyMoments: [
        { type: 'pain', time: '0:32', text: 'Struggling with current tool response rates' },
        { type: 'signal', time: '0:58', text: 'Asked about ROI - buying signal' },
        { type: 'objection', time: '1:15', text: 'Pricing concern raised' },
        { type: 'success', time: '1:35', text: 'Requested team demo' },
      ],
      suggestions: [
        'Follow up with ROI case studies for similar company size',
        'Schedule demo within 48 hours while interest is high',
        'Prepare pricing comparison showing value vs competitors',
      ],
    },
  ];

  const call = calls[selectedCall];

  const getSentimentColor = sentiment => {
    return sentiment === 'positive'
      ? 'text-green-600'
      : sentiment === 'negative'
        ? 'text-red-600'
        : 'text-gray-600';
  };

  const getMomentIcon = type => {
    switch (type) {
      case 'pain':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'signal':
        return <ThumbsUp className="w-4 h-4 text-green-500" />;
      case 'objection':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'success':
        return <ThumbsUp className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <DashboardLayout title="Call Intelligence" subtitle="AI-powered call analysis and insights">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transcript */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{call.lead}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {call.date} • {call.duration}
                </p>
              </div>
              <Badge variant={call.sentiment === 'positive' ? 'success' : 'secondary'}>
                {call.sentiment} ({call.score}%)
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {call.transcript.map((line, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-xs text-gray-500 min-w-[40px]">{line.time}</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                      {line.speaker}
                    </p>
                    <p className={`text-sm ${getSentimentColor(line.sentiment)}`}>{line.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Download className="w-4 h-4 mr-2" />
              Export Transcript
            </Button>
          </CardContent>
        </Card>

        {/* Insights */}
        <div className="space-y-6">
          {/* Key Moments */}
          <Card>
            <CardHeader>
              <CardTitle>Key Moments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {call.keyMoments.map((moment, i) => (
                  <div key={i} className="flex gap-2">
                    {getMomentIcon(moment.type)}
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">{moment.time}</p>
                      <p className="text-sm">{moment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle>AI Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {call.suggestions.map((suggestion, i) => (
                  <div key={i} className="flex gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CallIntelligence;
