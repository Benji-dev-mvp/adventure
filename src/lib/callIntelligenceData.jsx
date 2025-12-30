/**
 * Shared Call Intelligence Data
 * Eliminates duplication across components using call intelligence features
 */

export const MOCK_CALL_DATA = [
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

export const getSentimentColor = sentiment => {
  return sentiment === 'positive'
    ? 'text-green-600'
    : sentiment === 'negative'
      ? 'text-red-600'
      : 'text-gray-600';
};

export const getMomentIcon = (type, IconComponents) => {
  const { AlertCircle, ThumbsUp } = IconComponents;
  switch (type) {
    case 'pain':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    case 'signal':
      return <ThumbsUp className="w-4 h-4 text-green-500" />;
    case 'objection':
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    case 'success':
      return <ThumbsUp className="w-4 h-4 text-blue-500" />;
    default:
      return null;
  }
};
