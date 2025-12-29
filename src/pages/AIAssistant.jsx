import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import {
  getAIMessages,
  addAIMessage,
  askAva,
  applyGuardrail,
  updateTemplateCTA,
  scheduleOptimalWindow,
  getLeadSources,
  getExampleLead,
  getSavedPrompts,
  addSavedPrompt,
  removeSavedPrompt,
  getLeads,
  getSourceIcon,
  estimateTokens,
  scoreLeadWithAI,
  generateEmailWithAI,
} from '../lib/dataService';
import { useToast } from '../components/Toast';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';
import {
  Sparkles,
  Send,
  MessageSquare,
  Lightbulb,
  Target,
  Mail,
  TrendingUp,
  FileText,
  Sliders,
  Zap,
  Activity,
  Brain,
  Clock,
  CheckCircle2,
} from 'lucide-react';

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
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
      countRef.current = currentCount;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return (
    <span>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

// Live Typing Indicator
const TypingIndicator = () => (
  <div className="flex items-center gap-2 p-4">
    <div className="flex gap-1">
      <span
        className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
        style={{ animationDelay: '0ms' }}
      ></span>
      <span
        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
        style={{ animationDelay: '150ms' }}
      ></span>
      <span
        className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
        style={{ animationDelay: '300ms' }}
      ></span>
    </div>
    <span className="text-sm text-slate-400">Ava is thinking...</span>
  </div>
);

const AIAssistant = () => {
  const [messages, setMessages] = useState(getAIMessages());
  const [input, setInput] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [sourceSummary] = useState(getLeadSources());
  const [contextSource, setContextSource] = useState(sourceSummary[0]?.source || 'Unknown');
  const [savedPrompts, setSavedPrompts] = useState(getSavedPrompts());
  const leadOptions = getLeads().slice(0, 20);
  const [selectedLeadId, setSelectedLeadId] = useState(leadOptions[0]?.id || null);
  const selectedLead = leadOptions.find(l => l.id === selectedLeadId) || null;
  const [stats, setStats] = useState({ promptTokens: 0, responseTokens: 0, totalTime: 0 });
  const [leadScoreResult, setLeadScoreResult] = useState(null);
  const [emailDraft, setEmailDraft] = useState(null);
  const [scoringLead, setScoringLead] = useState(false);
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({
    emailsGenerated: 1247,
    timeSaved: 42,
    replyRate: 145,
  });
  const toast = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Simulate live metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        emailsGenerated: prev.emailsGenerated + Math.floor(Math.random() * 3),
        timeSaved: prev.timeSaved + Math.random() * 0.1,
        replyRate: Math.max(140, Math.min(150, prev.replyRate + (Math.random() * 2 - 1))),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const surfaces = {
    hero: isDark
      ? 'border border-white/20 bg-slate-900/60 backdrop-blur-3xl text-slate-100'
      : 'border border-gray-200 bg-white shadow-card text-slate-900',
    panel: isDark
      ? 'border border-white/20 bg-slate-900/60 backdrop-blur-xl text-slate-100'
      : 'border border-gray-200 bg-white shadow-card text-slate-900',
    soft: isDark
      ? 'border border-white/15 bg-white/5 text-slate-200'
      : 'border border-gray-200 bg-slate-50 text-slate-800',
  };

  const textTones = {
    heading: isDark ? 'text-white' : 'text-slate-900',
    muted: isDark ? 'text-gray-300' : 'text-slate-600',
    subtle: isDark ? 'text-gray-400' : 'text-slate-500',
  };

  const chips = {
    active: 'bg-gradient-to-r from-accent-500 to-primary-500 text-white shadow-lg scale-105',
    idle: isDark
      ? 'bg-white/10 text-gray-200 border border-white/30 hover:bg-white/20'
      : 'bg-slate-100 text-slate-800 border border-gray-200 hover:bg-slate-200',
  };

  const toneOptions = ['Professional', 'Casual', 'Enthusiastic', 'Formal'];
  const lengthOptions = ['Short', 'Medium', 'Long'];

  const promptTemplates = [
    {
      icon: Mail,
      title: 'Write Cold Email',
      description: 'Generate personalized outreach',
      prompt: 'Write a cold email for a VP of Sales at an enterprise SaaS company',
    },
    {
      icon: Target,
      title: 'Subject Line Ideas',
      description: 'Get high-performing subject lines',
      prompt: 'Generate 10 subject line ideas for a product launch email',
    },
    {
      icon: TrendingUp,
      title: 'Campaign Analysis',
      description: 'Analyze campaign performance',
      prompt: 'Analyze my Q1 Enterprise Outreach campaign and suggest improvements',
    },
    {
      icon: FileText,
      title: 'Follow-up Sequence',
      description: 'Create a follow-up sequence',
      prompt: 'Create a 3-step follow-up sequence for non-responders',
    },
    {
      icon: Lightbulb,
      title: 'Value Proposition',
      description: 'Craft compelling value props',
      prompt: 'Help me write a strong value proposition for my product',
    },
    {
      icon: MessageSquare,
      title: 'LinkedIn Message',
      description: 'Write LinkedIn outreach',
      prompt: 'Write a LinkedIn connection request message for CTOs',
    },
  ];

  const handleSend = async overrideText => {
    const promptText = (overrideText ?? input)?.trim();
    if (!promptText) return;

    const userMessage = { role: 'user', content: promptText };
    setMessages(prev => [...prev, userMessage]);
    addAIMessage(userMessage);
    setInput('');
    setIsTyping(true);

    try {
      const startTime = Date.now();
      const promptTokens = estimateTokens(promptText);
      const example = selectedLead || getExampleLead(contextSource);
      const summary = sourceSummary.find(s => s.source === contextSource) || {
        total: 0,
        verified: 0,
      };
      const context = `Context: using leads from ${contextSource} (verified ${summary.verified}/${summary.total}). Example: ${example ? `${example.name}, ${example.title} at ${example.company} (${example.email})` : 'n/a'}.`;
      const constraints = `Constraints: maintain compliance, avoid sensitive PII; respect unsubscribe policies; do not fabricate claims.`;
      const decoratedPrompt = `${promptText}\n\n${context}\n${constraints}\n\nPlease respond in a ${tone} tone and ${length} length.`;

      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const res = await askAva(decoratedPrompt);
      const responseTokens = estimateTokens(res.content);
      const totalTime = Date.now() - startTime;
      const assistantMessage = {
        role: res.role || 'assistant',
        content: res.content,
        suggestions: res.suggestions || [
          'Apply guardrail',
          'Schedule optimal window',
          'Tune subject lines',
        ],
        metrics: { promptTokens, responseTokens, totalTime },
      };
      setIsTyping(false);
      setMessages(prev => [...prev, assistantMessage]);
      addAIMessage(assistantMessage);
      setStats({ promptTokens, responseTokens, totalTime });
      toast.success('Ava responded with recommendations');
    } catch (e) {
      setIsTyping(false);
      toast.error('Failed to get Ava response');
    }
  };

  const handleTemplateClick = template => {
    setInput(template.prompt);
    // Auto-send to streamline flow
    setTimeout(() => handleSend(template.prompt), 0);
  };

  const runSmartAction = async action => {
    try {
      if (action === 'guardrail') {
        await applyGuardrail({ policy: 'auto-throttle', amount: 0.12 });
        toast.success('Guardrail applied');
      } else if (action === 'template') {
        await updateTemplateCTA({ sequence: 3, cta: 'calendar-link' });
        toast.success('Template CTA updated');
      } else if (action === 'schedule') {
        await scheduleOptimalWindow({ day: 'Tuesday', time: '10:00' });
        toast.success('Send window scheduled');
      }
    } catch (e) {
      toast.error('Action failed');
    }
  };

  const handleScoreLead = async () => {
    if (!selectedLead) {
      toast.warning('Select a lead first');
      return;
    }
    setScoringLead(true);
    try {
      const result = await scoreLeadWithAI(selectedLead);
      setLeadScoreResult(result);
      toast.success(`Scored ${selectedLead.name}: ${result.score}/100 (${result.tier})`);
    } catch (e) {
      toast.error('Lead scoring failed');
    } finally {
      setScoringLead(false);
    }
  };

  const handleGenerateEmail = async () => {
    if (!selectedLead) {
      toast.warning('Select a lead first');
      return;
    }
    const prompt = input.trim() || 'Draft a cold outreach email';
    setGeneratingEmail(true);
    try {
      const draft = await generateEmailWithAI(selectedLead, prompt, tone, length);
      setEmailDraft(draft);
      toast.success('Email draft ready');
    } catch (e) {
      toast.error('Email generation failed');
    } finally {
      setGeneratingEmail(false);
    }
  };

  return (
    <DashboardLayout
      title="AI Assistant"
      subtitle="Chat with Ava to optimize your outbound strategy"
    >
      {/* Futuristic Animated Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-cyan-50/30 to-purple-50/20 dark:from-slate-950 dark:via-cyan-950/20 dark:to-purple-950/10" />

        {/* Animated Orbs */}
        <div
          className="absolute top-20 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 dark:from-cyan-500/10 dark:to-blue-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '7s' }}
        />
        <div
          className="absolute bottom-20 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '9s', animationDelay: '1s' }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      {/* Modern Hero Command Bar */}
      <div className="mb-6 relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
        <Card className={cn('relative overflow-hidden backdrop-blur-xl', surfaces.hero)}>
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-white/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <CardContent className="relative p-8">
            {/* Futuristic Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Glowing Ava Logo */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur-xl opacity-75 animate-pulse" />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl border-2 border-white/30 transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300">
                    <Sparkles className="text-white animate-pulse" size={32} />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                      Ava AI Command Center
                    </h2>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span className="text-xs font-bold text-green-600 dark:text-green-400 tracking-wider">
                        ONLINE
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn('text-sm font-medium', textTones.muted)}>
                      <Brain className="inline w-4 h-4 mr-1 animate-pulse" />
                      Neural Engine Active
                    </span>
                    <span className={cn('text-sm font-medium', textTones.muted)}>
                      <Activity className="inline w-4 h-4 mr-1" />
                      <AnimatedCounter
                        end={stats.promptTokens + stats.responseTokens}
                        duration={1000}
                      />{' '}
                      tokens processed
                    </span>
                  </div>
                </div>
              </div>

              <button
                className={cn(
                  'group/btn px-6 py-3 rounded-xl transition-all duration-300 font-bold text-sm border-2 hover:scale-105 hover:shadow-xl relative overflow-hidden',
                  'bg-gradient-to-r from-cyan-500 to-purple-500 border-transparent text-white'
                )}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sliders size={16} />
                  Settings
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              </button>
            </div>

            {/* Lead & Source Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Source Selector */}
              <div>
                <label
                  className={cn('text-xs font-bold uppercase tracking-widest', textTones.muted)}
                >
                  📍 Data Source
                </label>
                <div className="mt-3 flex flex-wrap gap-3">
                  {sourceSummary.map(s => (
                    <button
                      key={s.source}
                      onClick={() => setContextSource(s.source)}
                      className={cn(
                        'relative group/source px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300',
                        contextSource === s.source ? chips.active : chips.idle
                      )}
                    >
                      {getSourceIcon(s.source)} {s.source}
                      <span className={cn('ml-2 text-xs opacity-75', textTones.muted)}>
                        ({s.verified}/{s.total})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lead Selector */}
              <div>
                <label
                  className={cn('text-xs font-bold uppercase tracking-widest', textTones.muted)}
                >
                  👤 Target Lead
                </label>
                <select
                  value={selectedLeadId || ''}
                  onChange={e => setSelectedLeadId(Number(e.target.value))}
                  className={cn(
                    'w-full mt-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent',
                    isDark
                      ? 'bg-white/10 border border-white/30 text-white placeholder-gray-400 hover:bg-white/20 backdrop-blur-sm'
                      : 'bg-white border border-gray-300 text-slate-900 placeholder-gray-500 hover:bg-gray-50'
                  )}
                >
                  <option value="">Choose a lead...</option>
                  {leadOptions.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.company})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Analytics Bar */}
            <div className="mt-6 relative group/analytics">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur opacity-0 group-hover/analytics:opacity-100 transition-opacity duration-300" />
              <div
                className={cn(
                  'relative rounded-2xl p-6 transition-all duration-300 border-2',
                  isDark
                    ? 'border-purple-500/30 bg-gradient-to-br from-slate-900/60 via-purple-900/20 to-slate-900/60 backdrop-blur-md hover:border-purple-500/50'
                    : 'border-purple-200 bg-gradient-to-br from-white to-purple-50/30 shadow-xl hover:border-purple-300'
                )}
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="group/stat relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                    <p
                      className={cn(
                        'text-xs uppercase font-black tracking-wider mb-2',
                        textTones.muted
                      )}
                    >
                      <Zap className="inline w-3 h-3 mr-1 animate-pulse" />
                      Tokens Used
                    </p>
                    <p className="text-3xl font-black bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                      <AnimatedCounter
                        end={stats.promptTokens + stats.responseTokens}
                        duration={1000}
                      />
                    </p>
                    <p className={cn('text-xs mt-2 font-medium', textTones.subtle)}>
                      ↑<AnimatedCounter end={stats.promptTokens} duration={800} /> ↓
                      <AnimatedCounter end={stats.responseTokens} duration={800} />
                    </p>
                  </div>
                  <div className="border-l-2 border-r-2 border-white/10 group/stat relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                    <p
                      className={cn(
                        'text-xs uppercase font-black tracking-wider mb-2',
                        textTones.muted
                      )}
                    >
                      <Clock className="inline w-3 h-3 mr-1 animate-pulse" />
                      Response Time
                    </p>
                    <p className="text-3xl font-black bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                      <AnimatedCounter end={stats.totalTime || 2500} duration={1000} suffix="ms" />
                    </p>
                    <p
                      className={cn(
                        'text-xs mt-2 font-medium flex items-center justify-center gap-1',
                        textTones.subtle
                      )}
                    >
                      <CheckCircle2 size={12} className="text-green-500" />
                      Optimal
                    </p>
                  </div>
                  <div className="group/stat relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                    <p
                      className={cn(
                        'text-xs uppercase font-black tracking-wider mb-2',
                        textTones.muted
                      )}
                    >
                      <TrendingUp className="inline w-3 h-3 mr-1 animate-pulse" />
                      Quality Score
                    </p>
                    <p className="text-3xl font-black bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                      <AnimatedCounter end={9.2} duration={1500} />
                      <span className="text-lg">/10</span>
                    </p>
                    <p
                      className={cn(
                        'text-xs mt-2 font-medium text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1'
                      )}
                    >
                      ⭐ Excellent
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modern Grid Layout */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Chat Interface - Glassmorphism */}
        <div className="lg:col-span-2">
          <div className="relative h-[calc(100vh-350px)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-primary-500/5 rounded-3xl" />
            <Card className={cn('relative h-full flex flex-col', surfaces.panel)}>
              <CardContent className="flex-1 flex flex-col p-6">
                {/* Messages with smooth animations */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-4 scroll-smooth">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in-50 slide-in-from-bottom-4 duration-500`}
                    >
                      <div
                        className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}
                      >
                        {message.role === 'assistant' && (
                          <div className="flex items-center gap-3 mb-3 pl-2">
                            <div className="relative w-10 h-10">
                              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl blur opacity-75 animate-pulse" />
                              <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center border-2 border-white/30 shadow-xl">
                                <Sparkles className="text-white" size={16} />
                              </div>
                            </div>
                            <span className="text-sm font-black bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
                              Ava AI
                            </span>
                          </div>
                        )}

                        <div
                          className={cn(
                            'p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg relative overflow-hidden',
                            message.role === 'user'
                              ? 'bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
                              : isDark
                                ? 'bg-white/15 border-2 border-white/30 text-gray-100 shadow-md hover:bg-white/20 hover:border-white/40'
                                : 'bg-white border-2 border-slate-200 text-slate-900 shadow-sm hover:bg-slate-50 hover:border-slate-300'
                          )}
                        >
                          {message.role === 'assistant' && (
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-purple-500/10 rounded-full blur-2xl -z-10" />
                          )}
                          <p className="text-sm whitespace-pre-line leading-relaxed font-medium">
                            {message.content}
                          </p>
                        </div>

                        {message.suggestions && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, sIndex) => (
                              <button
                                key={sIndex}
                                onClick={() => handleSend(suggestion)}
                                className={cn(
                                  'px-3 py-2 text-sm rounded-lg transition-all duration-200 font-medium hover:scale-105 border',
                                  isDark
                                    ? 'bg-white/10 border-white/30 text-gray-200 hover:bg-gradient-to-r hover:from-accent-500/30 hover:to-primary-500/30 hover:border-accent-300 hover:text-white'
                                    : 'bg-slate-100 border-gray-200 text-slate-700 hover:bg-slate-200 hover:border-gray-300'
                                )}
                              >
                                ✨ {suggestion}
                              </button>
                            ))}
                          </div>
                        )}

                        {message.role === 'assistant' && (
                          <div className="mt-3 flex flex-col gap-2">
                            {message.metrics && (
                              <div
                                className={cn('text-xs flex items-center gap-3', textTones.muted)}
                              >
                                <span>
                                  📊 {message.metrics.promptTokens + message.metrics.responseTokens}{' '}
                                  tokens
                                </span>
                                <span>⏱️ {message.metrics.totalTime}ms</span>
                              </div>
                            )}
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="outline"
                                className={cn(
                                  'text-xs',
                                  isDark
                                    ? 'bg-white/10 border-white/30 text-gray-200 hover:bg-white/20'
                                    : 'bg-white border border-gray-300 text-slate-700 hover:bg-gray-50'
                                )}
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(message.content);
                                    toast.info('Response copied');
                                  } catch {}
                                }}
                              >
                                📋 Copy
                              </Button>
                              <Button
                                variant="outline"
                                className={cn(
                                  'text-xs',
                                  isDark
                                    ? 'bg-white/10 border-white/30 text-gray-200 hover:bg-white/20'
                                    : 'bg-white border border-gray-300 text-slate-700 hover:bg-gray-50'
                                )}
                                onClick={() => {
                                  const title =
                                    (message.content || '').slice(0, 40) || 'Saved Response';
                                  setSavedPrompts(addSavedPrompt(title, message.content));
                                  toast.success('Response saved');
                                }}
                              >
                                💾 Save
                              </Button>
                            </div>
                          </div>
                        )}

                        {message.role === 'user' && (
                          <div className="flex items-center gap-2 mt-2 justify-end">
                            <span className={cn('text-xs', textTones.muted)}>You</span>
                            <div className="w-6 h-6 bg-gradient-to-br from-accent-400 to-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              👤
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start animate-in fade-in-50 slide-in-from-bottom-4 duration-300">
                      <div className="max-w-[85%]">
                        <div className="flex items-center gap-3 mb-3 pl-2">
                          <div className="relative w-10 h-10">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl blur opacity-75 animate-pulse" />
                            <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center border-2 border-white/30 shadow-xl">
                              <Sparkles className="text-white animate-spin" size={16} />
                            </div>
                          </div>
                          <span className="text-sm font-black bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
                            Ava AI
                          </span>
                        </div>
                        <TypingIndicator />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Builder and Input Area */}
                <div className="border-t border-white/30 pt-6 space-y-4 bg-gradient-to-t from-white/10 to-transparent">
                  {/* Builder row */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="group/builder">
                      <label
                        className={cn(
                          'text-xs font-bold uppercase tracking-wider',
                          textTones.muted
                        )}
                      >
                        🎭 Persona
                      </label>
                      <input
                        className={cn(
                          'w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all',
                          isDark
                            ? 'border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 hover:bg-white/20'
                            : 'border border-gray-300 bg-white text-slate-900 placeholder-gray-500 hover:bg-gray-50'
                        )}
                        placeholder="VP Sales, Product Manager, CTO"
                        onChange={e => setInput(`${input}\nPersona: ${e.target.value}`)}
                      />
                    </div>
                    <div className="group/builder">
                      <label
                        className={cn(
                          'text-xs font-bold uppercase tracking-wider',
                          textTones.muted
                        )}
                      >
                        🎯 Goal
                      </label>
                      <input
                        className={cn(
                          'w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all',
                          isDark
                            ? 'border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 hover:bg-white/20'
                            : 'border border-gray-300 bg-white text-slate-900 placeholder-gray-500 hover:bg-gray-50'
                        )}
                        placeholder="Book meeting, Improve reply rate"
                        onChange={e => setInput(`${input}\nGoal: ${e.target.value}`)}
                      />
                    </div>
                    <div className="group/builder">
                      <label
                        className={cn(
                          'text-xs font-bold uppercase tracking-wider',
                          textTones.muted
                        )}
                      >
                        ⚙️ Constraints
                      </label>
                      <input
                        className={cn(
                          'w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all',
                          isDark
                            ? 'border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 hover:bg-white/20'
                            : 'border border-gray-300 bg-white text-slate-900 placeholder-gray-500 hover:bg-gray-50'
                        )}
                        placeholder="No PII, Formal tone, 2 sentences max"
                        onChange={e => setInput(`${input}\nConstraints: ${e.target.value}`)}
                      />
                    </div>
                  </div>

                  <div className="flex items-end gap-4">
                    <Textarea
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder={`Ask Ava... (Lead: ${selectedLead ? selectedLead.name : 'n/a'} • Source: ${contextSource})`}
                      rows={4}
                      className={cn(
                        'rounded-xl focus:ring-2 focus:ring-accent-500/50',
                        isDark
                          ? 'bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-gray-400'
                          : 'bg-white border border-gray-300 text-slate-900 placeholder-gray-500'
                      )}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                    <div className="flex flex-col gap-3">
                      <Button
                        onClick={() => handleSend()}
                        className="gap-2 bg-gradient-to-r from-accent-500 to-primary-500 hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold"
                      >
                        <Send size={18} />
                        Send
                      </Button>
                      <Button
                        variant="outline"
                        className={cn(
                          'text-xs',
                          isDark
                            ? 'bg-white/10 border-white/30 text-gray-200 hover:bg-white/20'
                            : 'bg-white border border-gray-300 text-slate-700 hover:bg-gray-50'
                        )}
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(input);
                            toast.info('Prompt copied');
                          } catch {}
                        }}
                      >
                        📋 Copy
                      </Button>
                      <Button
                        variant="outline"
                        className={cn(
                          'text-xs',
                          isDark
                            ? 'bg-white/10 border-white/30 text-gray-200 hover:bg-white/20'
                            : 'bg-white border border-gray-300 text-slate-700 hover:bg-gray-50'
                        )}
                        onClick={() => {
                          const title = input.slice(0, 40) || 'Saved Prompt';
                          setSavedPrompts(addSavedPrompt(title, input));
                          toast.success('Prompt saved');
                        }}
                      >
                        💾 Save
                      </Button>
                    </div>
                  </div>
                  <p className={cn('text-xs', textTones.subtle)}>
                    Press Enter to send • Shift+Enter for new line
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Sidebar - Modern Cards */}
        <div className="space-y-4">
          {/* Smart Actions */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-500/25 to-primary-500/25 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            <Card
              className={cn(
                'relative hover:shadow-3xl transition-all duration-300',
                surfaces.panel
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 bg-gradient-to-br from-accent-500/30 to-primary-500/30 rounded-xl border border-accent-500/20">
                    <Sparkles
                      size={20}
                      className={isDark ? 'text-accent-300' : 'text-accent-600'}
                    />
                  </div>
                  <h3 className={cn('font-bold text-lg', textTones.heading)}>Smart Actions</h3>
                </div>
                <div className="space-y-2.5">
                  <Button
                    className="w-full justify-start gap-3 bg-gradient-to-r from-accent-500 to-primary-500 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 font-semibold text-white border-0"
                    onClick={() => runSmartAction('guardrail')}
                  >
                    🛡️ Apply deliverability guardrail
                  </Button>
                  <Button
                    className="w-full justify-start gap-3 bg-gradient-to-r from-accent-500 to-primary-500 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 font-semibold text-white border-0"
                    onClick={() => runSmartAction('template')}
                  >
                    📅 Update sequence CTA to calendar
                  </Button>
                  <Button
                    className="w-full justify-start gap-3 bg-gradient-to-r from-accent-500 to-primary-500 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 font-semibold text-white border-0"
                    onClick={() => runSmartAction('schedule')}
                  >
                    ⏰ Schedule optimal send window
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tone & Length Controls */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/25 to-pink-500/25 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            <Card
              className={cn(
                'relative hover:shadow-3xl transition-all duration-300',
                surfaces.panel
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl border border-purple-500/20">
                    <Sliders size={20} className={isDark ? 'text-purple-300' : 'text-purple-700'} />
                  </div>
                  <h3 className={cn('font-bold text-lg', textTones.heading)}>Content Settings</h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <label
                      className={cn(
                        'block text-xs font-bold uppercase tracking-wider mb-3',
                        textTones.muted
                      )}
                    >
                      🎭 Tone
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {toneOptions.map(option => (
                        <button
                          key={option}
                          onClick={() => setTone(option.toLowerCase())}
                          className={cn(
                            'px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200',
                            tone === option.toLowerCase()
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                              : isDark
                                ? 'bg-white/15 text-gray-200 border border-white/30 hover:bg-white/25 hover:border-white/40'
                                : 'bg-slate-100 text-slate-800 border border-gray-200 hover:bg-slate-200'
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      className={cn(
                        'block text-xs font-bold uppercase tracking-wider mb-3',
                        textTones.muted
                      )}
                    >
                      📏 Length
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {lengthOptions.map(option => (
                        <button
                          key={option}
                          onClick={() => setLength(option.toLowerCase())}
                          className={cn(
                            'px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200',
                            length === option.toLowerCase()
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                              : isDark
                                ? 'bg-white/15 text-gray-200 border border-white/30 hover:bg-white/25 hover:border-white/40'
                                : 'bg-slate-100 text-slate-800 border border-gray-200 hover:bg-slate-200'
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prompt Templates */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/25 to-orange-500/25 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            <Card
              className={cn(
                'relative hover:shadow-3xl transition-all duration-300',
                surfaces.panel
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-xl border border-yellow-500/20">
                    <Lightbulb
                      size={20}
                      className={isDark ? 'text-yellow-300' : 'text-amber-600'}
                    />
                  </div>
                  <h3 className={cn('font-bold text-lg', textTones.heading)}>Quick Templates</h3>
                </div>

                <div className="space-y-2.5">
                  {promptTemplates.map((template, index) => {
                    const Icon = template.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleTemplateClick(template)}
                        className={cn(
                          'w-full p-3.5 text-left rounded-xl border transition-all duration-200 group/btn hover:scale-[1.02]',
                          isDark
                            ? 'border-white/20 bg-white/10 hover:bg-gradient-to-r hover:from-accent-500/20 hover:to-primary-500/20 hover:border-white/40'
                            : 'border-gray-200 bg-white hover:bg-slate-50 hover:border-gray-300'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'p-2.5 rounded-lg transition-all border',
                              isDark
                                ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 group-hover/btn:from-yellow-500/40 group-hover/btn:to-orange-500/40 border-yellow-500/20'
                                : 'bg-amber-50 border-amber-200'
                            )}
                          >
                            <Icon
                              size={16}
                              className={isDark ? 'text-yellow-300' : 'text-amber-700'}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn('text-sm font-bold', textTones.heading)}>
                              {template.title}
                            </p>
                            <p className={cn('text-xs mt-0.5', textTones.muted)}>
                              {template.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Saved Prompts */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/25 to-emerald-500/25 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            <Card
              className={cn(
                'relative hover:shadow-3xl transition-all duration-300',
                surfaces.panel
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-xl border border-green-500/20">
                    <Lightbulb
                      size={20}
                      className={isDark ? 'text-green-300' : 'text-emerald-700'}
                    />
                  </div>
                  <h3 className={cn('font-bold text-lg', textTones.heading)}>Saved Prompts</h3>
                </div>
                <div className="space-y-2.5 max-h-48 overflow-y-auto">
                  {savedPrompts.map(p => (
                    <div
                      key={p.id}
                      className={cn(
                        'flex items-center justify-between gap-3 p-3 rounded-lg border transition-all',
                        isDark
                          ? 'border-white/20 bg-white/10 hover:bg-white/20'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className={cn('text-sm font-semibold truncate', textTones.heading)}>
                          {p.title}
                        </p>
                        <p className={cn('text-xs truncate', textTones.muted)}>{p.prompt}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSend(p.prompt)}
                          className={cn(
                            'text-xs',
                            isDark
                              ? 'bg-white/10 border-white/30 text-gray-200 hover:bg-accent-500/30 hover:border-accent-500/50'
                              : 'bg-white border border-gray-300 text-slate-700 hover:bg-emerald-50 hover:border-emerald-200'
                          )}
                        >
                          Use
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSavedPrompts(removeSavedPrompt(p.id));
                            toast.info('Deleted');
                          }}
                          className={cn(
                            'text-xs',
                            isDark
                              ? 'bg-white/10 border-white/30 text-gray-200 hover:bg-red-500/30 hover:border-red-500/50'
                              : 'bg-white border border-gray-300 text-slate-700 hover:bg-red-50 hover:border-red-200'
                          )}
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  ))}
                  {savedPrompts.length === 0 && (
                    <p className={cn('text-xs text-center py-4', textTones.muted)}>
                      No saved prompts yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Source Citations */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/25 to-cyan-500/25 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            <Card
              className={cn(
                'relative hover:shadow-3xl transition-all duration-300',
                surfaces.panel
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl border border-blue-500/20">
                    <FileText size={20} className={isDark ? 'text-blue-300' : 'text-blue-700'} />
                  </div>
                  <h3 className={cn('font-bold text-lg', textTones.heading)}>Source Citations</h3>
                </div>
                <div className="space-y-2.5">
                  {sourceSummary.map(s => (
                    <div
                      key={s.source}
                      className={cn(
                        'flex items-center justify-between text-sm p-3 rounded-lg border transition-all',
                        isDark
                          ? 'border-white/20 bg-white/10 hover:bg-white/15'
                          : 'border-gray-200 bg-white hover:bg-slate-50'
                      )}
                    >
                      <span className={cn('font-semibold', textTones.heading)}>
                        {getSourceIcon(s.source)} {s.source}
                      </span>
                      <span className={cn('text-xs font-medium', textTones.muted)}>
                        ✓ {s.verified}/{s.total}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Stats */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/25 to-red-500/25 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            <Card
              className={cn(
                'relative hover:shadow-3xl transition-all duration-300',
                surfaces.panel
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 bg-gradient-to-br from-pink-500/30 to-red-500/30 rounded-xl border border-pink-500/20">
                    <Sparkles
                      size={20}
                      className={cn(isDark ? 'text-pink-300' : 'text-rose-700', 'animate-pulse')}
                    />
                  </div>
                  <h3 className={cn('font-bold text-lg', textTones.heading)}>Ava's Impact</h3>
                  <div className="ml-auto">
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                      </span>
                      <span className="text-[10px] font-bold text-green-600 dark:text-green-400 tracking-wider">
                        LIVE
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div
                    className={cn(
                      'group/metric flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:scale-[1.02] relative overflow-hidden',
                      isDark
                        ? 'border-pink-500/30 bg-gradient-to-r from-pink-500/10 to-rose-500/10 hover:border-pink-500/50'
                        : 'border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50 hover:border-pink-300'
                    )}
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-400/20 to-rose-500/20 rounded-full blur-xl -z-10 group-hover/metric:scale-150 transition-transform duration-300" />
                    <div>
                      <span
                        className={cn(
                          'text-xs font-bold uppercase tracking-wider',
                          textTones.muted
                        )}
                      >
                        <Mail className="inline w-3 h-3 mr-1" />
                        Emails Generated
                      </span>
                      <p className="text-2xl font-black bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent mt-1">
                        <AnimatedCounter end={liveMetrics.emailsGenerated} duration={2000} />
                      </p>
                    </div>
                    <TrendingUp
                      className={cn(isDark ? 'text-pink-400' : 'text-pink-600', 'animate-pulse')}
                      size={24}
                    />
                  </div>

                  <div
                    className={cn(
                      'group/metric flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:scale-[1.02] relative overflow-hidden',
                      isDark
                        ? 'border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:border-green-500/50'
                        : 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 hover:border-green-300'
                    )}
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-xl -z-10 group-hover/metric:scale-150 transition-transform duration-300" />
                    <div>
                      <span
                        className={cn(
                          'text-xs font-bold uppercase tracking-wider',
                          textTones.muted
                        )}
                      >
                        <Clock className="inline w-3 h-3 mr-1" />
                        Time Saved
                      </span>
                      <p className="text-2xl font-black bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mt-1">
                        <AnimatedCounter end={Math.floor(liveMetrics.timeSaved)} duration={2000} />{' '}
                        hrs
                      </p>
                    </div>
                    <Zap
                      className={cn(
                        isDark ? 'text-green-400' : 'text-emerald-600',
                        'animate-pulse'
                      )}
                      size={24}
                    />
                  </div>

                  <div
                    className={cn(
                      'group/metric flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:scale-[1.02] relative overflow-hidden',
                      isDark
                        ? 'border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 hover:border-purple-500/50'
                        : 'border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 hover:border-purple-300'
                    )}
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-indigo-500/20 rounded-full blur-xl -z-10 group-hover/metric:scale-150 transition-transform duration-300" />
                    <div>
                      <span
                        className={cn(
                          'text-xs font-bold uppercase tracking-wider',
                          textTones.muted
                        )}
                      >
                        <Target className="inline w-3 h-3 mr-1" />
                        Reply Rate
                      </span>
                      <p className="text-2xl font-black bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent mt-1">
                        +<AnimatedCounter end={Math.floor(liveMetrics.replyRate)} duration={2000} />
                        %
                      </p>
                    </div>
                    <TrendingUp
                      className={cn(
                        isDark ? 'text-purple-400' : 'text-purple-600',
                        'animate-pulse'
                      )}
                      size={24}
                    />
                  </div>
                </div>

                <div
                  className={cn(
                    'mt-4 p-4 rounded-xl border-2 bg-gradient-to-r relative overflow-hidden',
                    isDark
                      ? 'border-cyan-500/30 from-cyan-500/10 to-purple-500/10 text-gray-200'
                      : 'border-cyan-200 from-cyan-50 to-purple-50 text-slate-700'
                  )}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-pulse" />
                  <p className="text-xs leading-relaxed flex items-start gap-2">
                    <Lightbulb
                      size={16}
                      className="text-cyan-500 flex-shrink-0 mt-0.5 animate-pulse"
                    />
                    <span className="font-medium">
                      The more you use Ava, the better she understands your voice and style!
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIAssistant;
