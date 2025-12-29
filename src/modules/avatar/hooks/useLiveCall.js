import { useState, useEffect, useCallback } from 'react';

// Mock call phases
const CALL_PHASES = [
  { id: 'intro', label: 'Intro', duration: 30 },
  { id: 'discovery', label: 'Discovery', duration: 120 },
  { id: 'objections', label: 'Objections', duration: 90 },
  { id: 'close', label: 'Close', duration: 60 },
];

// Mock transcript messages
const MOCK_TRANSCRIPT = [
  { id: 1, speaker: 'ava', text: 'Hi Sarah, this is Ava from Artisan. I hope I\'m not catching you at a bad time?', timestamp: '0:00', phase: 'intro' },
  { id: 2, speaker: 'prospect', text: 'No, it\'s fine. What\'s this about?', timestamp: '0:08', phase: 'intro' },
  { id: 3, speaker: 'ava', text: 'I noticed you recently downloaded our guide on automating sales outreach. I wanted to see if you\'re currently exploring solutions in that space?', timestamp: '0:15', phase: 'intro' },
  { id: 4, speaker: 'prospect', text: 'Yes, we\'ve been looking at a few options. Our team is spending too much time on manual prospecting.', timestamp: '0:28', phase: 'discovery' },
  { id: 5, speaker: 'ava', text: 'That\'s exactly what we help with. Can you tell me a bit about your current process? How many SDRs do you have and roughly how many prospects are they reaching out to weekly?', timestamp: '0:42', phase: 'discovery' },
  { id: 6, speaker: 'prospect', text: 'We have 5 SDRs. They\'re probably doing about 200 outreaches each per week, but the quality is inconsistent.', timestamp: '1:05', phase: 'discovery' },
  { id: 7, speaker: 'ava', text: 'I hear that a lot. The challenge is usually balancing volume with personalization. What if I told you our AI can help your team 3x their output while actually improving personalization?', timestamp: '1:22', phase: 'discovery' },
  { id: 8, speaker: 'prospect', text: 'That sounds too good to be true. How does that work?', timestamp: '1:45', phase: 'objections' },
  { id: 9, speaker: 'ava', text: 'Fair question! Our AI researches each prospect automatically, pulls relevant talking points, and drafts personalized messages. Your team just reviews and sends. On average, our customers see reply rates increase by 40%.', timestamp: '1:58', phase: 'objections' },
  { id: 10, speaker: 'prospect', text: 'What about data security? We\'re in fintech, so compliance is a big deal for us.', timestamp: '2:25', phase: 'objections' },
  { id: 11, speaker: 'ava', text: 'Great point. We\'re SOC 2 Type II certified and fully GDPR compliant. Many of our customers are in regulated industries. I can send you our security documentation after this call.', timestamp: '2:38', phase: 'objections' },
  { id: 12, speaker: 'prospect', text: 'That would be helpful. What does pricing look like?', timestamp: '2:58', phase: 'close' },
  { id: 13, speaker: 'ava', text: 'For a team of 5, you\'d be looking at our Growth plan at $299 per seat per month. Most teams see ROI within the first month. Would it make sense to schedule a demo so I can show you exactly how it would work for your team?', timestamp: '3:12', phase: 'close' },
];

// Call status types
const CALL_STATUSES = {
  idle: 'Idle',
  connecting: 'Connecting...',
  'in-call': 'In Call',
  scheduling: 'Scheduling Meeting',
  ended: 'Call Ended',
};

export function useLiveCall() {
  const [status, setStatus] = useState('idle');
  const [currentPhase, setCurrentPhase] = useState('intro');
  const [transcript, setTranscript] = useState([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  
  const [settings, setSettings] = useState({
    policy: 'standard',
    persona: 'helpful',
  });

  const [callInfo, setCallInfo] = useState({
    prospect: {
      name: 'Sarah Chen',
      title: 'VP of Sales',
      company: 'FinanceFlow',
      avatar: null,
    },
    startTime: null,
    endTime: null,
  });

  // Simulate call progress
  useEffect(() => {
    if (!isPlaying || currentMessageIndex >= MOCK_TRANSCRIPT.length) return;

    const timer = setTimeout(() => {
      const nextMessage = MOCK_TRANSCRIPT[currentMessageIndex];
      setTranscript(prev => [...prev, nextMessage]);
      setCurrentPhase(nextMessage.phase);
      setCurrentMessageIndex(prev => prev + 1);
    }, 2000 + Math.random() * 1500);

    return () => clearTimeout(timer);
  }, [isPlaying, currentMessageIndex]);

  // Update call duration
  useEffect(() => {
    if (status !== 'in-call') return;

    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  const startCall = useCallback(() => {
    setStatus('connecting');
    setTranscript([]);
    setCurrentMessageIndex(0);
    setCallDuration(0);
    setCallInfo(prev => ({ ...prev, startTime: new Date() }));

    setTimeout(() => {
      setStatus('in-call');
      setIsPlaying(true);
    }, 2000);
  }, []);

  const endCall = useCallback(() => {
    setIsPlaying(false);
    setStatus('ended');
    setCallInfo(prev => ({ ...prev, endTime: new Date() }));
  }, []);

  const pauseCall = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resumeCall = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const emergencyTakeover = useCallback(() => {
    setIsPlaying(false);
    setStatus('idle');
    // In real implementation, this would transfer to human
  }, []);

  const updateSettings = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    status,
    statusLabel: CALL_STATUSES[status],
    currentPhase,
    phases: CALL_PHASES,
    transcript,
    isPlaying,
    callDuration,
    formattedDuration: formatDuration(callDuration),
    callInfo,
    settings,
    updateSettings,
    startCall,
    endCall,
    pauseCall,
    resumeCall,
    emergencyTakeover,
  };
}
