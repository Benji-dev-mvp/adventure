import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../components/Toast';
import { Search, Phone, Video, MoreVertical, Send, Paperclip, Smile, Circle } from 'lucide-react';

const AGENTS = [
  {
    id: 1,
    name: 'Alene',
    role: 'Technical',
    avatar: '👩‍💼',
    color: 'bg-blue-500',
    status: 'available',
    unread: 2,
  },
  {
    id: 2,
    name: 'Keefe',
    role: 'Support',
    avatar: '👨‍💼',
    color: 'bg-red-500',
    status: 'available',
    unread: 3,
  },
  {
    id: 3,
    name: 'Lazaro',
    role: 'Developer',
    avatar: '👨‍🔬',
    color: 'bg-purple-500',
    status: 'available',
    unread: 1,
  },
  {
    id: 4,
    name: 'Hazle',
    role: 'Manager',
    avatar: '👩‍💻',
    color: 'bg-yellow-500',
    status: 'offline',
    unread: 0,
  },
];

const StatusIndicator = ({ status }) => {
  const colorClass =
    status === 'available' ? 'fill-emerald-500 text-emerald-500' : 'fill-slate-600 text-slate-600';
  return <Circle size={10} className={colorClass} />;
};

const AgentListItem = ({ agent, isActive, onClick }) => (
  <button onClick={onClick} className={`w-full text-left px-2 py-1 text-xs transition-all border-l-3 flex items-center gap-1 ${isActive ? 'bg-slate-700/50 border-l-cyan-500' : 'border-l-transparent hover:bg-slate-700/30'}`}>
    <div className={`w-6 h-6 rounded-full ${agent.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{agent.avatar}</div>
    <div className="flex-1 min-w-0">
      <h4 className="font-semibold text-white text-xs truncate">{agent.name}</h4>
      <p className="text-xs text-slate-400 truncate">{agent.role}</p>
    </div>
    {agent.unread > 0 && <span className="px-1 py-0 rounded bg-cyan-500 text-white text-xs font-bold flex-shrink-0">{agent.unread}</span>}
  </button>
);

const MessageBubble = ({ message, isUser }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
    <div
      className={`max-w-xs px-3 py-2 rounded-lg text-xs ${
        isUser
          ? 'bg-indigo-500/90 text-white rounded-br-sm'
          : 'bg-slate-700/80 text-slate-100 rounded-bl-sm'
      }`}
    >
      <p>{message.content}</p>
      <p className={`mt-0.5 text-xs ${isUser ? 'text-indigo-200' : 'text-slate-400'}`}>
        {message.timestamp}
      </p>
    </div>
  </div>
);

const TypingIndicator = () => (
  <div className="flex items-center gap-1 mb-2">
    <div className="px-2 py-1 bg-slate-700/80 rounded-lg text-xs text-slate-400 flex items-center gap-1">
      <motion.span
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        className="inline-block"
      >
        ●
      </motion.span>
      <motion.span
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 0.6, delay: 0.1, repeat: Infinity }}
        className="inline-block"
      >
        ●
      </motion.span>
      <motion.span
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 0.6, delay: 0.2, repeat: Infinity }}
        className="inline-block"
      >
        ●
      </motion.span>
    </div>
  </div>
);

const AvaChat = () => {
  const [agents] = useState(AGENTS);
  const [activeAgent, setActiveAgent] = useState(AGENTS[0]);
  const [userStatus, setUserStatus] = useState('available');
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hey, have you checked the new design draft?',
      timestamp: '5:15 PM',
    },
    {
      role: 'user',
      content: 'Yes, I reviewed it this morning. Looks good overall.',
      timestamp: '5:20 PM',
    },
    {
      role: 'assistant',
      content: 'Great! Do you think we should update the header section?',
      timestamp: '5:22 PM',
    },
    {
      role: 'user',
      content: 'Yeah, the font size feels a bit small.',
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

  const filteredAgents = agents.filter(
    agent =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-screen flex bg-slate-900 overflow-hidden">
      {/* LEFT SIDEBAR - AGENT LIST */}
      <div className="w-64 border-r border-white/10 flex flex-col bg-slate-800/50 overflow-hidden">
        {/* User Profile - Very Compact */}
        <div className="px-2 py-1 border-b border-white/10">
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">JU</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white text-xs truncate">JWT</h3>
              <button onClick={() => setShowStatusMenu(!showStatusMenu)} className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400">
                <Circle size={4} className={userStatus === 'available' ? 'fill-emerald-500 text-emerald-500' : 'fill-slate-600 text-slate-600'} />
                {userStatus === 'available' ? 'On' : 'Off'}
              </button>
            </div>
          </div>
          {showStatusMenu && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-1 space-y-0.5 py-0.5 bg-slate-700/50 rounded px-1">
              <button onClick={() => { setUserStatus('available'); setShowStatusMenu(false); showToast('✓ Available', 'success'); }} className="w-full text-left px-1 py-0.5 text-xs rounded hover:bg-slate-700 flex items-center gap-1">
                <Circle size={3} className="fill-emerald-500" /> On
              </button>
              <button onClick={() => { setUserStatus('offline'); setShowStatusMenu(false); showToast('○ Offline', 'info'); }} className="w-full text-left px-1 py-0.5 text-xs rounded hover:bg-slate-700 flex items-center gap-1">
                <Circle size={3} className="fill-slate-600" /> Off
              </button>
            </motion.div>
          )}
        </div>

        {/* Search - Tiny */}
        <div className="relative px-1 py-1 border-b border-white/10">
          <Search size={10} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Find" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-5 pr-1 py-0.5 rounded text-xs bg-slate-700/50 border border-white/10 text-white placeholder-slate-600 focus:ring-1 focus:ring-cyan-500 focus:outline-none" />
        </div>

        {/* Agents - Compact */}
        <div className="flex-1 overflow-y-auto space-y-0">
          {filteredAgents.map(agent => (
            <AgentListItem key={agent.id} agent={agent} isActive={activeAgent.id === agent.id} onClick={() => { setActiveAgent(agent); setMessages([{ role: 'assistant', content: `Hi! I'm ${agent.name}.`, timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) }]); showToast(`${agent.name}`, 'info'); }} />
          ))}
        </div>
      </div>

      {/* RIGHT SIDE - CHAT AREA */}
      <div className="flex-1 flex flex-col">
        {/* HEADER - Compact */}
        <div className="h-10 px-3 border-b border-white/10 bg-slate-800/50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 min-w-0 flex-1">
            <div className={`w-6 h-6 rounded-full ${activeAgent.color} flex items-center justify-center text-white text-xs flex-shrink-0`}>{activeAgent.avatar}</div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white text-xs truncate">{activeAgent.name}</h3>
            </div>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button onClick={() => showToast('📞 Call', 'info')} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-cyan-400" title="Call"><Phone size={14} /></button>
            <button onClick={() => showToast('📹 Video', 'info')} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-cyan-400" title="Video"><Video size={14} /></button>
            <button onClick={() => showToast('⚙️ Menu', 'info')} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-cyan-400" title="Menu"><MoreVertical size={14} /></button>
          </div>
        </div>

        {/* MESSAGES - No padding excess */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5 bg-gradient-to-b from-slate-900 to-slate-800">
          <AnimatePresence>
            {messages.map(msg => (
              <MessageBubble key={`${msg.timestamp}-${msg.role}`} message={msg} isUser={msg.role === 'user'} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>

        {/* INPUT - Compact */}
        <div className="h-10 px-2 py-1 border-t border-white/10 bg-slate-800/50 flex items-center gap-1">
          <button onClick={() => showToast('📎 File', 'info')} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-cyan-400 flex-shrink-0" title="Attach"><Paperclip size={14} /></button>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Message..." className="flex-1 px-2 py-1 rounded text-xs bg-slate-700/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 min-w-0" />
          <button onClick={() => showToast('😊 Emoji', 'info')} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-cyan-400 flex-shrink-0" title="Emoji"><Smile size={14} /></button>
          <button onClick={handleSend} disabled={!input.trim()} className="p-1 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 rounded text-white flex-shrink-0 disabled:opacity-50" title="Send"><Send size={14} /></button>
        </div>
      </div>
    </div>
  );
};

export default AvaChat;
