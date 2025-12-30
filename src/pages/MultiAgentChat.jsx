/**
 * MultiAgentChat.jsx - Premium Multi-Agent Conversation Interface
 *
 * Inspired by modern messaging apps with:
 * - Multiple AI agents specialized for different sales roles
 * - Sidebar with agent list and status
 * - Beautiful dark theme with message bubbles
 * - Agent creation based on sales methodology
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageScaffold } from '../components/layout/OperatorShell';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { useToast } from '../components/Toast';
import {
  MessageSquare,
  Search,
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Plus,
  Brain,
  Target,
  Users,
  Mail,
  TrendingUp,
  Zap,
  Settings,
  CheckCircle2,
  Circle,
  X,
} from 'lucide-react';

// ============================================================================
// PREDEFINED AI AGENTS WITH SPECIALIZATIONS
// ============================================================================
const INITIAL_AGENTS = [
  {
    id: 'ava-bdr',
    name: 'Ava',
    role: 'BDR Specialist',
    avatar: '🤖',
    color: 'cyan',
    status: 'available',
    methodology: 'MEDDIC',
    specialty: 'Enterprise outreach & qualification',
    lastSeen: 'Active now',
    unreadCount: 2,
  },
  {
    id: 'max-closer',
    name: 'Max',
    role: 'Deal Closer',
    avatar: '🎯',
    color: 'purple',
    status: 'available',
    methodology: 'SPIN Selling',
    specialty: 'Negotiation & deal closing',
    lastSeen: 'Active now',
    unreadCount: 0,
  },
  {
    id: 'sofia-prospector',
    name: 'Sofia',
    role: 'Prospecting Expert',
    avatar: '🔍',
    color: 'blue',
    status: 'available',
    methodology: 'Challenger Sale',
    specialty: 'Cold outreach & lead generation',
    lastSeen: 'Last seen 5 min ago',
    unreadCount: 1,
  },
  {
    id: 'leo-strategist',
    name: 'Leo',
    role: 'Campaign Strategist',
    avatar: '📊',
    color: 'green',
    status: 'do-not-disturb',
    methodology: 'Account-Based Selling',
    specialty: 'Multi-channel campaign design',
    lastSeen: 'Last seen 2 hours ago',
    unreadCount: 0,
  },
];

const SALES_METHODOLOGIES = [
  {
    value: 'meddic',
    label: 'MEDDIC',
    description: 'Metrics, Economic Buyer, Decision Criteria...',
  },
  {
    value: 'spin',
    label: 'SPIN Selling',
    description: 'Situation, Problem, Implication, Need-payoff',
  },
  { value: 'challenger', label: 'Challenger Sale', description: 'Teach, Tailor, Take Control' },
  { value: 'sandler', label: 'Sandler Selling', description: 'Pain, Budget, Decision process' },
  { value: 'gap', label: 'GAP Selling', description: 'Current State, Future State, Impact' },
  { value: 'conceptual', label: 'Conceptual Selling', description: 'Concept, Solution, Benefits' },
  { value: 'snap', label: 'SNAP Selling', description: 'Simple, iNvaluable, Align, Priority' },
];

const AGENT_ROLES = [
  { value: 'bdr', label: 'BDR - Business Development', icon: Target },
  { value: 'sdr', label: 'SDR - Sales Development', icon: Users },
  { value: 'ae', label: 'AE - Account Executive', icon: TrendingUp },
  { value: 'closer', label: 'Deal Closer', icon: CheckCircle2 },
  { value: 'prospector', label: 'Prospecting Specialist', icon: Search },
  { value: 'strategist', label: 'Campaign Strategist', icon: Brain },
  { value: 'email', label: 'Email Specialist', icon: Mail },
  { value: 'multi', label: 'Multi-Channel Expert', icon: Zap },
];

// ============================================================================
// STATUS INDICATOR
// ============================================================================
const StatusIndicator = ({ status }) => {
  const colors = {
    available: 'bg-emerald-500',
    'do-not-disturb': 'bg-yellow-500',
    offline: 'bg-slate-500',
  };

  return <span className={`w-3 h-3 rounded-full ${colors[status]} border-2 border-slate-800`} />;
};

// ============================================================================
// AGENT LIST ITEM
// ============================================================================
const AgentListItem = ({ agent, isActive, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
      isActive
        ? 'bg-slate-700/50 border-l-4 border-cyan-500'
        : 'hover:bg-slate-700/30 border-l-4 border-transparent'
    }`}
  >
    <div className="relative">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-2xl">
        {agent.avatar}
      </div>
      <div className="absolute -bottom-0.5 -right-0.5">
        <StatusIndicator status={agent.status} />
      </div>
    </div>

    <div className="flex-1 text-left min-w-0">
      <div className="flex items-center justify-between mb-0.5">
        <h4 className="font-semibold text-white text-sm truncate">{agent.name}</h4>
        {agent.unreadCount > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-white text-xs font-bold">
            {agent.unreadCount}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-400 truncate">{agent.role}</p>
    </div>
  </motion.button>
);

// ============================================================================
// MESSAGE BUBBLE
// ============================================================================
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

// ============================================================================
// TYPING INDICATOR
// ============================================================================
const TypingIndicator = ({ agentName }) => (
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
      <span className="text-xs text-slate-400">{agentName} is typing...</span>
    </div>
  </motion.div>
);

// ============================================================================
// CREATE AGENT MODAL
// ============================================================================
const CreateAgentModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('bdr');
  const [methodology, setMethodology] = useState('meddic');
  const [specialty, setSpecialty] = useState('');
  const [avatar, setAvatar] = useState('🤖');

  const avatarOptions = ['🤖', '🎯', '🔍', '📊', '💼', '⚡', '🚀', '🎨', '🧠', '💡'];

  const handleCreate = () => {
    const roleData = AGENT_ROLES.find(r => r.value === role);
    const methodData = SALES_METHODOLOGIES.find(m => m.value === methodology);

    onCreate({
      id: `agent-${Date.now()}`,
      name: name || 'New Agent',
      role: roleData.label,
      avatar,
      color: 'cyan',
      status: 'available',
      methodology: methodData.label,
      specialty: specialty || roleData.label,
      lastSeen: 'Just created',
      unreadCount: 0,
    });

    // Reset form
    setName('');
    setRole('bdr');
    setMethodology('meddic');
    setSpecialty('');
    setAvatar('🤖');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        className="bg-slate-800 rounded-2xl border border-white/10 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Create New AI Agent</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Avatar Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Avatar</label>
            <div className="flex gap-2 flex-wrap">
              {avatarOptions.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setAvatar(emoji)}
                  className={`w-12 h-12 rounded-lg text-2xl transition-all ${
                    avatar === emoji
                      ? 'bg-cyan-500/20 ring-2 ring-cyan-500'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <Input
            label="Agent Name"
            placeholder="e.g., Alex, Morgan, Jordan"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Primary Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {AGENT_ROLES.map(r => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Methodology */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Sales Methodology
            </label>
            <select
              value={methodology}
              onChange={e => setMethodology(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {SALES_METHODOLOGIES.map(m => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-400 mt-1">
              {SALES_METHODOLOGIES.find(m => m.value === methodology)?.description}
            </p>
          </div>

          {/* Specialty */}
          <Textarea
            label="Specialty Description"
            placeholder="e.g., Expert in B2B SaaS outreach with 10+ years experience..."
            value={specialty}
            onChange={e => setSpecialty(e.target.value)}
            rows={3}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600"
            >
              Create Agent
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const MultiAgentChat = () => {
  const { showToast } = useToast();
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [activeAgent, setActiveAgent] = useState(agents[0]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `Hi! I'm ${agents[0].name}, your ${agents[0].role}. I specialize in ${agents[0].methodology} methodology. How can I help you today?`,
      timestamp: '11:30 AM',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userStatus, setUserStatus] = useState('available');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Great question! As a ${activeAgent.methodology} specialist, I'd recommend focusing on ${activeAgent.specialty.toLowerCase()}. Let me help you with that...`,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleAgentSwitch = agent => {
    setActiveAgent(agent);

    // Clear unread count
    setAgents(prev => prev.map(a => (a.id === agent.id ? { ...a, unreadCount: 0 } : a)));

    // Load conversation for this agent (in real app, would fetch from backend)
    setMessages([
      {
        id: Date.now(),
        role: 'assistant',
        content: `Hi! I'm ${agent.name}, your ${agent.role}. I specialize in ${agent.methodology} methodology. How can I help you today?`,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);

    showToast(`Switched to ${agent.name}`, 'success');
  };

  const handleCreateAgent = newAgent => {
    setAgents(prev => [...prev, newAgent]);
    showToast(`${newAgent.name} created successfully!`, 'success');
  };

  const filteredAgents = agents.filter(
    agent =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageScaffold
      config={{
        title: 'Multi-Agent Sales Intelligence',
        subtitle: 'Collaborate with specialized AI agents trained in different sales methodologies',
        badges: [{ label: 'Multi-Agent', color: 'purple' }],
      }}
    >
      <div className="h-[calc(100vh-200px)] flex bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
        {/* LEFT SIDEBAR - AGENT LIST */}
        <div className="w-80 border-r border-white/10 flex flex-col bg-slate-800/50">
          {/* User Profile Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    JU
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5">
                    <StatusIndicator status={userStatus} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">JWT User</h3>
                  <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
                    <Circle size={8} className="fill-current" />
                    {userStatus === 'available' && 'Available'}
                    {userStatus === 'do-not-disturb' && 'Do not disturb'}
                    {userStatus === 'offline' && 'Offline'}
                  </button>
                </div>
              </div>
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <Settings size={18} className="text-slate-400" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700/50 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Agent List */}
          <div className="flex-1 overflow-y-auto">
            {filteredAgents.map(agent => (
              <AgentListItem
                key={agent.id}
                agent={agent}
                isActive={activeAgent.id === agent.id}
                onClick={() => handleAgentSwitch(agent)}
              />
            ))}
          </div>

          {/* Create Agent Button */}
          <div className="p-4 border-t border-white/10">
            <Button
              onClick={() => setShowCreateModal(true)}
              className="w-full gap-2 bg-gradient-to-r from-cyan-500 to-purple-600"
            >
              <Plus size={16} />
              Create New Agent
            </Button>
          </div>
        </div>

        {/* MAIN CHAT AREA */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-white/10 bg-slate-800/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="lg:hidden p-2 hover:bg-slate-700 rounded-lg">
                <MessageSquare size={20} className="text-slate-400" />
              </button>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xl">
                    {activeAgent.avatar}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5">
                    <StatusIndicator status={activeAgent.status} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{activeAgent.name}</h3>
                  <p className="text-xs text-slate-400">{activeAgent.lastSeen}</p>
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

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-1">
            <AnimatePresence>
              {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} isUser={msg.role === 'user'} />
              ))}
              {isTyping && <TypingIndicator agentName={activeAgent.name} />}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="px-6 py-4 border-t border-white/10 bg-slate-800/30">
            <div className="flex items-end gap-3">
              <button className="p-3 hover:bg-slate-700 rounded-lg transition-colors">
                <Paperclip size={20} className="text-slate-400" />
              </button>

              <button className="p-3 hover:bg-slate-700 rounded-lg transition-colors">
                <Smile size={20} className="text-slate-400" />
              </button>

              <div className="flex-1">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type a Message"
                  rows={1}
                  className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                />
              </div>

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

      {/* Create Agent Modal */}
      <CreateAgentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateAgent}
      />
    </PageScaffold>
  );
};

export default MultiAgentChat;
