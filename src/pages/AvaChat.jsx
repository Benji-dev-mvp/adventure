/**
 * AvaChat.jsx - Split-view Multi-Agent Chat Interface
 * 
 * Left sidebar: Agent/contact list
 * Right side: Active conversation
 * Matches premium chat UI (Telegram/WhatsApp style)
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useToast } from '../components/Toast';
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Circle,
} from 'lucide-react';

// Sample agents
const AGENTS = [
  {
    id: 1,
    name: 'Alene',
    role: 'Technical Department',
    avatar: '👩‍💼',
    color: 'bg-blue-500',
    status: 'available',
    unread: 2,
    lastMessage: 'Hey, how are you?',
    lastTime: '11:30 AM',
  },
  {
    id: 2,
    name: 'Keefe',
    role: 'Support Executive',
    avatar: '👨‍💼',
    color: 'bg-red-500',
    status: 'available',
    unread: 3,
    lastMessage: 'Sure, let me check',
    lastTime: '10:16 AM',
  },
  {
    id: 3,
    name: 'Lazaro',
    role: 'Resource Investigator',
    avatar: '👨‍🔬',
    color: 'bg-purple-500',
    status: 'available',
    unread: 1,
    lastMessage: 'Got it!',
    lastTime: '9:00 AM',
  },
  {
    id: 4,
    name: 'Hazle',
    role: 'Teamworker',
    avatar: '👩‍💻',
    color: 'bg-yellow-500',
    status: 'offline',
    unread: 0,
    lastMessage: 'Thanks for update',
    lastTime: '08:36 AM',
  },
  {
    id: 5,
    name: 'Backend Squad',
    role: 'API & Database',
    avatar: 'B',
    color: 'bg-indigo-500',
    status: 'offline',
    unread: 1,
    lastMessage: 'Deployment complete',
    lastTime: 'Yesterday',
  },
];

const StatusIndicator = ({ status }) => {
  if (status === 'available') {
    return <Circle size={12} className="fill-emerald-500 text-emerald-500" />;
  }
  return <Circle size={12} className="fill-slate-600 text-slate-600" />;
};

const AgentListItem = ({ agent, isActive, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full text-left px-4 py-3 transition-all border-l-4 ${
      isActive
        ? 'bg-slate-700/50 border-l-cyan-500'
        : 'border-l-transparent hover:bg-slate-700/30'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className={`w-12 h-12 rounded-full ${agent.color} flex items-center justify-center text-white font-bold text-lg`}>
          {agent.avatar}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5">
          <StatusIndicator status={agent.status} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-white text-sm truncate">{agent.name}</h4>
          {agent.unread > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-white text-xs font-bold">
              {agent.unread}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 truncate">{agent.role}</p>
      </div>
    </div>
  </motion.button>
);

const MessageBubble = ({ message, isUser }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
  >
    <div
      className={`max-w-lg px-4 py-3 rounded-2xl ${
        isUser
          ? 'bg-indigo-500/90 text-white rounded-br-md'
          : 'bg-slate-700/80 text-slate-100 rounded-bl-md'
      }`}
    >
      <p className="text-sm leading-relaxed">{message.content}</p>
      <p className={`text-xs mt-1 ${isUser ? 'text-indigo-200' : 'text-slate-400'}`}>
        {message.timestamp}
      </p>
    </div>
  </motion.div>
);

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center gap-3 mb-4"
  >
    <div className="px-4 py-3 bg-slate-700/80 rounded-2xl rounded-bl-md flex items-center gap-2">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-cyan-400"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
          />
        ))}
      </div>
      <span className="text-xs text-slate-400">Typing...</span>
    </div>
  </motion.div>
);

const AvaChat = () => {
  const [agents] = useState(AGENTS);
  const [activeAgent, setActiveAgent] = useState(AGENTS[0]);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey, have you checked the new design draft?",
      timestamp: '5:15 PM',
    },
    {
      role: 'user',
      content: "Yes, I reviewed it this morning. Looks good overall.",
      timestamp: '5:20 PM',
    },
    {
      role: 'assistant',
      content: "Great! Do you think we should update the header section?",
      timestamp: '5:22 PM',
    },
    {
      role: 'user',
      content: "Yeah, the font size feels a bit small.",
      timestamp: '5:40 PM',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const { showToast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const userMessage = {
      role: 'user',
      content: input,
      timestamp,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage = {
        role: 'assistant',
        content: `Great question! I'll help you with that. Let me look into it and get back to you shortly.`,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      showToast(`Message sent to ${activeAgent.name}`, 'success');
    }, 1500);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAgentSwitch = agent => {
    setActiveAgent(agent);
    // Load different conversation for each agent
    setMessages([
      {
        role: 'assistant',
        content: `Hi! This is ${agent.name} from ${agent.role}. How can I help you today?`,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      },
    ]);
    showToast(`Switched to ${agent.name}`, 'success');
  };

  const filteredAgents = agents.filter(
    agent =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)] flex bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
        {/* LEFT SIDEBAR - AGENT LIST */}
        <div className="w-96 border-r border-white/10 flex flex-col bg-slate-800/50">
          {/* User Profile Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                  JU
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">JWT User</h3>
                  <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
                    <Circle size={8} className="fill-emerald-500 text-emerald-500" />
                    Available
                  </button>
                </div>
              </div>
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <MoreVertical size={18} className="text-slate-400" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search Mail"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700/50 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Status Options */}
          <div className="px-4 py-2 text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-2 py-1.5 hover:text-white cursor-pointer transition-colors">
              <Circle size={8} className="fill-emerald-500 text-emerald-500" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2 py-1.5 hover:text-white cursor-pointer transition-colors">
              <Circle size={8} className="fill-yellow-500 text-yellow-500" />
              <span>Do not disturb</span>
            </div>
            <div className="flex items-center gap-2 py-1.5 hover:text-white cursor-pointer transition-colors">
              <Circle size={8} className="fill-slate-600 text-slate-600" />
              <span>Offline</span>
            </div>
          </div>

          {/* Agent List */}
          <div className="flex-1 overflow-y-auto border-t border-white/10">
            {filteredAgents.map(agent => (
              <AgentListItem
                key={agent.id}
                agent={agent}
                isActive={activeAgent.id === agent.id}
                onClick={() => handleAgentSwitch(agent)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - CHAT AREA */}
        <div className="flex-1 flex flex-col">
          {/* CHAT HEADER */}
          <div className="px-6 py-4 border-b border-white/10 bg-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${activeAgent.color} flex items-center justify-center text-white font-bold`}>
                  {activeAgent.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{activeAgent.name}</h3>
                  <p className="text-xs text-slate-400">
                    {activeAgent.status === 'available' ? (
                      <>
                        <Circle size={6} className="inline fill-emerald-500 text-emerald-500 mr-1" />
                        Last seen 11:30 AM
                      </>
                    ) : (
                      <>
                        <Circle size={6} className="inline fill-slate-600 text-slate-600 mr-1" />
                        Offline
                      </>
                    )}
                  </p>
                </div>
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

          {/* MESSAGES AREA */}
          <div className="flex-1 overflow-y-auto p-6 space-y-1 bg-gradient-to-b from-slate-900 to-slate-800">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <MessageBubble
                  key={idx}
                  message={msg}
                  isUser={msg.role === 'user'}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>

          {/* INPUT AREA */}
          <div className="px-6 py-4 border-t border-white/10 bg-slate-800/50">
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <Paperclip size={20} className="text-slate-400" />
              </button>

              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a Message"
                className="flex-1 px-4 py-3 rounded-lg bg-slate-700/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />

              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <Smile size={20} className="text-slate-400" />
              </button>

              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
