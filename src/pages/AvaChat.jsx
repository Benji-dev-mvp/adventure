import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import {
  getAIMessages,
  addAIMessage,
  askAva,
  getSavedPrompts,
  addSavedPrompt,
  removeSavedPrompt,
} from '../lib/dataService';
import { useToast } from '../components/Toast';
import '../styles/ava-chat.css';
import {
  Sparkles,
  Send,
  MessageSquare,
  Brain,
  Zap,
  Clock,
  Target,
  Mail,
  Lightbulb,
  Bookmark,
  Trash2,
  Copy,
  Check,
  ChevronRight,
  Volume2,
  Maximize2,
  Minimize2,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
} from 'lucide-react';

// ============================================================================
// TYPING INDICATOR - ANIMATED DOTS
// ============================================================================
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-3 px-4 py-3"
  >
    <div className="flex gap-2">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.4, delay: i * 0.2, repeat: Infinity }}
        />
      ))}
    </div>
    <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
      Ava is thinking...
    </span>
  </motion.div>
);

// ============================================================================
// MESSAGE BUBBLE - USER/ASSISTANT
// ============================================================================
const MessageBubble = ({ message, isUser, index }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-xl lg:max-w-2xl group ${
          isUser
            ? 'bg-indigo-500/90 text-white rounded-2xl rounded-br-md px-5 py-3'
            : 'bg-slate-700/80 border border-white/10 text-slate-100 rounded-2xl rounded-bl-md px-5 py-3 backdrop-blur-md'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

        {!isUser && (
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10"
          >
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
              title="Copy message"
            >
              {isCopied ? (
                <>
                  <Check size={14} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy
                </>
              )}
            </button>
            <button
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
              title="Speak response"
            >
              <Volume2 size={14} />
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================================
// SUGGESTION CHIPS - QUICK ACTIONS
// ============================================================================
const SuggestionChips = ({ suggestions, onSelect, isLoading }) => {
  if (!suggestions || suggestions.length === 0 || isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <p className="text-xs text-slate-400 font-semibold tracking-wide">QUICK ACTIONS</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {suggestions.slice(0, 4).map(suggestion => (
          <motion.button
            key={suggestion}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => onSelect(suggestion)}
            className="text-left p-3 rounded-xl bg-slate-800/50 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all group"
          >
            <p className="text-sm font-medium text-slate-200 group-hover:text-cyan-300">
              {suggestion}
            </p>
            <ChevronRight
              size={14}
              className="mt-1 text-slate-500 group-hover:text-cyan-400 transition-colors"
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// ============================================================================
// PROMPT TEMPLATE GRID
// ============================================================================
const PromptTemplates = ({ onSelect }) => {
  const templates = [
    {
      id: 'cold-email',
      icon: Mail,
      title: 'Cold Email',
      description: 'Personalized outreach',
      color: 'from-blue-500 to-cyan-500',
      prompt:
        'Write a compelling cold email for a VP of Sales at an enterprise SaaS company. Make it personalized and include specific value propositions.',
    },
    {
      id: 'subject-lines',
      icon: Target,
      title: 'Subject Lines',
      description: 'High-performing variations',
      color: 'from-purple-500 to-pink-500',
      prompt:
        'Generate 5 alternative subject lines for a product launch email. Make them compelling, specific, and action-oriented.',
    },
    {
      id: 'campaign-analysis',
      icon: Sparkles,
      title: 'Campaign Analysis',
      description: 'Performance insights',
      color: 'from-yellow-500 to-orange-500',
      prompt:
        'Analyze my campaign performance and suggest 3 key improvements based on industry benchmarks.',
    },
    {
      id: 'follow-up',
      icon: MessageSquare,
      title: 'Follow-up Sequence',
      description: 'Multi-step strategy',
      color: 'from-green-500 to-emerald-500',
      prompt:
        "Create a 3-step follow-up sequence for prospects who opened but didn't reply. Include timing and messaging variations.",
    },
    {
      id: 'value-prop',
      icon: Lightbulb,
      title: 'Value Proposition',
      description: 'Compelling positioning',
      color: 'from-red-500 to-pink-500',
      prompt:
        'Help me craft a strong value proposition for my B2B SaaS product targeting enterprise customers.',
    },
    {
      id: 'linkedin',
      icon: Brain,
      title: 'LinkedIn Messaging',
      description: 'Effective outreach',
      color: 'from-indigo-500 to-blue-500',
      prompt:
        'Write a LinkedIn connection request message for CTOs that starts a conversation about their tech stack challenges.',
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-3 tracking-wide">QUICK TEMPLATES</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {templates.map((template, idx) => {
            const Icon = template.icon;
            return (
              <motion.button
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onSelect(template.prompt)}
                className={`p-4 rounded-2xl bg-gradient-to-br ${template.color} bg-opacity-10 border border-white/10 hover:border-white/30 transition-all group overflow-hidden relative`}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity" />
                <div className="relative z-10">
                  <Icon
                    size={24}
                    className="mb-2 text-white/70 group-hover:text-white transition-colors"
                  />
                  <h4 className="text-sm font-semibold text-white text-left">{template.title}</h4>
                  <p className="text-xs text-slate-300 text-left mt-1">{template.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SAVED PROMPTS SIDEBAR
// ============================================================================
const SavedPromptsSidebar = ({ savedPrompts, onSelect, onDelete, isOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed right-0 top-0 h-screen w-80 bg-slate-900/95 backdrop-blur-xl border-l border-white/10 overflow-y-auto"
        >
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Saved Prompts</h3>
              <p className="text-sm text-slate-400">Your favorite templates for quick access</p>
            </div>

            <div className="space-y-3">
              {savedPrompts.map(prompt => (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 transition-all group cursor-pointer"
                  onClick={() => onSelect(prompt.prompt)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium text-slate-200 flex-1 line-clamp-2">
                      {prompt.title}
                    </p>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onDelete(prompt.id);
                      }}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{prompt.prompt}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// MAIN COMPONENT - AVA CHAT
// ============================================================================
const AvaChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hi! I'm Ava, your AI BDR. I've analyzed your target accounts and found 247 high-intent prospects. Ready to launch a campaign?",
      timestamp: '2 min ago',
      suggestions: [
        { icon: '📊', label: 'Show campaign performance' },
        { icon: '🎯', label: 'Find more prospects' },
        { icon: '📧', label: 'Write email for me' },
        { icon: '🚀', label: 'Create sequence' },
        { icon: '💬', label: 'Analyze replies' },
      ],
    },
    {
      role: 'assistant',
      content: "💡 I recommend a 5-step email sequence targeting VP of Sales at Series B companies. I found 89 prospects who just raised funding. Want me to set it up?",
      timestamp: '30 sec ago',
      suggestions: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { showToast } = useToast();

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = useCallback(
    async (text = null) => {
      const promptText = (text || input).trim();
      if (!promptText) return;

      const now = new Date();
      const timestamp = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });

      const userMessage = { 
        role: 'user', 
        content: promptText,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const response = await askAva(promptText);

        setIsLoading(false);
        const assistantMessage = {
          role: 'assistant',
          content: response.content,
          timestamp: 'Just now',
          suggestions: response.suggestions || [],
        };

        setMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
        setIsLoading(false);
        console.error('Failed to get response from Ava:', error);
        showToast('Failed to get response from Ava', 'error');
      }
    },
    [input, showToast]
  );

  const handleSuggestionClick = (suggestion) => {
    // Handle different suggestion types
    showToast(`Action: ${suggestion.label}`, 'info');
    // In real app, trigger specific actions based on suggestion
  };

  const handleDeletePrompt = id => {
    setSavedPrompts(removeSavedPrompt(id));
    toast.success('Prompt deleted');
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-120px)] bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
        <div className="flex-1 flex flex-col">
          {/* HEADER - Matching screenshot style */}
          <div className="px-6 py-4 border-b border-white/10 bg-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <Brain size={24} className="text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-800" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Chat with Ava</h3>
                <p className="text-sm text-slate-400">Your AI BDR • Online</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <Phone size={20} className="text-slate-400" />
              </button>
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <Video size={20} className="text-slate-400" />
              </button>
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <MoreVertical size={20} className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* MESSAGES AREA - Dark purple/navy background like screenshot */}
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-slate-900 to-slate-800">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <div key={idx}>
                  <MessageBubble message={msg} isUser={msg.role === 'user'} index={idx} />
                  
                  {/* AI Recommendations Pills - Only show for last assistant message */}
                  {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && idx === messages.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mb-6 ml-0"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb size={14} className="text-yellow-400" />
                        <span className="text-xs font-medium text-slate-400">
                          AI Recommendations (click to use):
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.suggestions.map((suggestion, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-700/80 hover:bg-slate-600/80 border border-white/10 text-sm text-white transition-all"
                          >
                            <span>{suggestion.icon}</span>
                            <span>{suggestion.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}

              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>

          {/* INPUT AREA - Matching screenshot style */}
          <div className="px-6 py-4 border-t border-white/10 bg-slate-800/50">
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <Paperclip size={20} className="text-slate-400" />
              </button>

              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <Smile size={20} className="text-slate-400" />
              </button>

              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Ava anything..."
                className="flex-1 px-4 py-3 rounded-lg bg-slate-700/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />

              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="p-3 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AvaChat;
