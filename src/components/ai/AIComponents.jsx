// AI Assistant Components
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Mic, Smile, Meh, Frown, Lightbulb, MessageSquare } from 'lucide-react';

export const VoiceInput = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);

  return (
    <Button
      variant={isListening ? 'danger' : 'outline'}
      onClick={() => setIsListening(!isListening)}
      className="gap-2"
    >
      <Mic size={16} className={isListening ? 'animate-pulse' : ''} />
      {isListening ? 'Listening...' : 'Voice Input'}
    </Button>
  );
};

export const SentimentAnalysis = ({ text }) => {
  const sentiments = [
    { label: 'Positive', icon: Smile, score: 65, color: 'text-green-600' },
    { label: 'Neutral', icon: Meh, score: 25, color: 'text-yellow-600' },
    { label: 'Negative', icon: Frown, score: 10, color: 'text-red-600' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sentiments.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-3">
                <Icon className={s.color} size={20} />
                <span className="text-sm font-medium w-20">{s.label}</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${
                      s.label === 'Positive'
                        ? 'from-green-400 to-green-600'
                        : s.label === 'Neutral'
                          ? 'from-yellow-400 to-yellow-600'
                          : 'from-red-400 to-red-600'
                    }`}
                    style={{ width: `${s.score}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold w-12 text-right">{s.score}%</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export const ObjectionHandling = () => {
  const objections = [
    {
      objection: "We're already using a competitor",
      response:
        "That's great! Many of our best customers switched from [Competitor]. What's missing in your current setup?",
      category: 'Competition',
    },
    {
      objection: 'The price is too high',
      response:
        'I understand budget is important. Let me show you the ROI - our customers see 3x return in the first quarter.',
      category: 'Pricing',
    },
    {
      objection: 'Not the right time',
      response:
        "I hear you. When would be a better time? Let's schedule a quick 15-min call for [future date].",
      category: 'Timing',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="text-yellow-500" size={20} />
          Objection Handling Library
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {objections.map((obj, i) => (
            <div key={i} className="p-4 border border-gray-200 dark:border-white/10 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">"{obj.objection}"</h4>
                <Badge variant="secondary" className="text-xs">
                  {obj.category}
                </Badge>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                <p className="text-sm text-gray-700 dark:text-gray-300">{obj.response}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const FollowUpSuggestions = () => {
  const suggestions = [
    {
      when: 'In 2 days',
      message: 'Just following up on my previous email. Did you get a chance to review?',
    },
    {
      when: 'After no response',
      message: "I know you're busy. Should I reach out next quarter instead?",
    },
    {
      when: 'After meeting',
      message: "Thanks for the great conversation! Here's the demo link we discussed.",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="text-primary-500" size={20} />
          AI Follow-up Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestions.map((s, i) => (
            <div
              key={i}
              className="p-3 border border-gray-200 dark:border-white/10 rounded-lg hover:border-primary-300 cursor-pointer"
            >
              <Badge variant="accent" className="text-xs mb-2">
                {s.when}
              </Badge>
              <p className="text-sm text-gray-700 dark:text-gray-300">{s.message}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
