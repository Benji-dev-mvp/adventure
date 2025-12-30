import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  getAIMessages,
  addAIMessage,
  askAva,
  getLeads,
  getSavedPrompts,
  addSavedPrompt,
  removeSavedPrompt,
} from '../lib/dataService';
import { useToast } from '../components/Toast';
import { useTheme } from '../contexts/ThemeContext';
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
  Plus,
  Settings,
  Copy,
  Check,
  ChevronRight,
  Volume2,
  Maximize2,
  Minimize2,
  MoreVertical,
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
            ? 'bg-gradient-to-br from-cyan-500 to-purple-600 text-white rounded-3xl rounded-tr-lg px-5 py-3'
            : 'bg-slate-800/50 border border-white/10 text-slate-100 rounded-3xl rounded-tl-lg px-5 py-3 backdrop-blur-md'
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
        {suggestions.slice(0, 4).map((suggestion, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
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
const SavedPromptsSidebar = ({ savedPrompts, onSelect, onDelete, onAdd, isOpen }) => {
  const [newPromptTitle, setNewPromptTitle] = useState('');

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
              {savedPrompts.map((prompt, idx) => (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
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
  const [messages, setMessages] = useState(getAIMessages());
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState(getSavedPrompts());
  const [showSavedPrompts, setShowSavedPrompts] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();
  const { theme } = useTheme();

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

      const userMessage = { role: 'user', content: promptText };
      setMessages(prev => [...prev, userMessage]);
      addAIMessage(userMessage);
      setInput('');
      setIsLoading(true);

      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const response = await askAva(promptText);

        setIsLoading(false);
        const assistantMessage = {
          role: 'assistant',
          content: response.content,
          suggestions: response.suggestions || [],
        };

        setMessages(prev => [...prev, assistantMessage]);
        addAIMessage(assistantMessage);
      } catch (error) {
        setIsLoading(false);
        toast.error('Failed to get response from Ava');
      }
    },
    [input, toast]
  );

  const handleSavePrompt = () => {
    if (!input.trim()) {
      toast.warning('Enter a prompt to save');
      return;
    }

    const title = prompt('Save this prompt as:');
    if (title) {
      setSavedPrompts(addSavedPrompt(title, input));
      toast.success('Prompt saved!');
      setInput('');
    }
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
      <div className={`flex h-full gap-6 ${showSavedPrompts ? 'pr-80' : ''}`}>
        {/* ===== MAIN CHAT AREA ===== */}
        <div className="flex-1 flex flex-col h-screen-minus-header bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl px-6 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Brain size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Chat with Ava</h1>
                <p className="text-sm text-slate-400">
                  Your AI Business Development Representative
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-emerald-400"
              />
              <span className="text-sm text-slate-400">Online</span>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSavedPrompts(!showSavedPrompts)}
                className="gap-2"
              >
                <Bookmark size={16} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullscreen(!showFullscreen)}
                className="gap-2"
              >
                {showFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </Button>
            </div>
          </motion.div>

          {/* MESSAGES AREA */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            <AnimatePresence>
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center space-y-8"
                >
                  <div className="text-center space-y-4">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="inline-block"
                    >
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
                        <Sparkles size={40} className="text-white" />
                      </div>
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Welcome to Ava</h2>
                      <p className="text-slate-400">
                        Your AI BDR is ready to help with email, campaigns, and strategy
                      </p>
                    </div>
                  </div>

                  {/* TEMPLATE GRID */}
                  <PromptTemplates onSelect={handleSend} />
                </motion.div>
              ) : (
                <>
                  {messages.map((msg, idx) => (
                    <MessageBubble
                      key={idx}
                      message={msg}
                      isUser={msg.role === 'user'}
                      index={idx}
                    />
                  ))}

                  {isLoading && <TypingIndicator />}

                  {!isLoading &&
                    messages.length > 0 &&
                    messages[messages.length - 1]?.suggestions && (
                      <SuggestionChips
                        suggestions={messages[messages.length - 1].suggestions}
                        onSelect={handleSend}
                        isLoading={isLoading}
                      />
                    )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </AnimatePresence>
          </div>

          {/* INPUT AREA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-white/10 bg-slate-900/50 backdrop-blur-xl p-6 space-y-4"
          >
            {/* CONTEXT BAR */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock size={14} />
              <span>Avg response time: 2.3s</span>
              <span className="text-slate-600">•</span>
              <span>Messages: {messages.length}</span>
            </div>

            {/* INPUT FIELD */}
            <div className="relative group">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Ava anything... (Shift+Enter for new line)"
                rows={3}
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
              />

              {/* ACTION BUTTONS */}
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSavePrompt}
                  title="Save this prompt"
                  className="text-slate-400 hover:text-yellow-400"
                >
                  <Bookmark size={16} />
                </Button>

                <div className="w-px h-5 bg-white/10" />

                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white disabled:opacity-50"
                >
                  <Send size={16} />
                  Send
                </Button>
              </div>
            </div>

            {/* FOOTER INFO */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <p>💡 Tip: Use templates above for quick-start prompts</p>
              <p>Powered by OpenAI GPT-4</p>
            </div>
          </motion.div>
        </div>

        {/* SAVED PROMPTS SIDEBAR */}
        <SavedPromptsSidebar
          savedPrompts={savedPrompts}
          onSelect={handleSend}
          onDelete={handleDeletePrompt}
          isOpen={showSavedPrompts}
        />
      </div>
    </DashboardLayout>
  );
};

export default AvaChat;
