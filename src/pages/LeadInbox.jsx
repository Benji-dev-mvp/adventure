import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Mail, Star, Archive, Trash2, Tag, Clock, Send, Search, Filter, CheckSquare, Square } from 'lucide-react';

const LeadInbox = () => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [filter, setFilter] = useState('all');
  const [replyText, setReplyText] = useState('');

  const leads = [
    { 
      id: 1, 
      name: 'Sarah Chen', 
      company: 'TechCorp', 
      subject: 'Re: Partnership Opportunity',
      preview: 'Thanks for reaching out! I\'d love to learn more about your solution...',
      time: '2 hours ago',
      status: 'replied',
      starred: true,
      unread: true,
      tags: ['Hot', 'Enterprise'],
      lastMessage: 'Thanks for reaching out! I\'d love to learn more about your solution. Can we schedule a call next week?',
      thread: [
        { from: 'You', message: 'Hi Sarah, I noticed TechCorp is expanding...', time: '3 days ago' },
        { from: 'Sarah Chen', message: 'Thanks for reaching out! I\'d love to learn more...', time: '2 hours ago' }
      ]
    },
    { 
      id: 2, 
      name: 'Michael Rodriguez', 
      company: 'Growth Inc', 
      subject: 'Demo Request',
      preview: 'Can we schedule a demo for next Tuesday? Our team is very interested...',
      time: '5 hours ago',
      status: 'replied',
      starred: false,
      unread: true,
      tags: ['Demo'],
      lastMessage: 'Can we schedule a demo for next Tuesday? Our team is very interested in your platform.',
      thread: [
        { from: 'You', message: 'Hi Michael, I saw you downloaded our whitepaper...', time: '2 days ago' },
        { from: 'Michael Rodriguez', message: 'Can we schedule a demo for next Tuesday?', time: '5 hours ago' }
      ]
    },
    { 
      id: 3, 
      name: 'Emily Watson', 
      company: 'Enterprise Systems', 
      subject: 'Pricing Information',
      preview: 'What are your enterprise pricing tiers? We have a team of 50+...',
      time: '1 day ago',
      status: 'replied',
      starred: false,
      unread: false,
      tags: ['Enterprise', 'Pricing'],
      lastMessage: 'What are your enterprise pricing tiers? We have a team of 50+ sales reps.',
      thread: [
        { from: 'You', message: 'Hi Emily, thanks for your interest in Artisan...', time: '3 days ago' },
        { from: 'Emily Watson', message: 'What are your enterprise pricing tiers?', time: '1 day ago' }
      ]
    },
    { 
      id: 4, 
      name: 'James Kim', 
      company: 'Startup Hub', 
      subject: 'Not interested at this time',
      preview: 'Thanks for reaching out but we\'re not looking for new tools right now...',
      time: '2 days ago',
      status: 'closed',
      starred: false,
      unread: false,
      tags: ['Closed'],
      lastMessage: 'Thanks for reaching out but we\'re not looking for new tools right now.',
      thread: [
        { from: 'You', message: 'Hi James, I wanted to reach out about...', time: '4 days ago' },
        { from: 'James Kim', message: 'Thanks for reaching out but we\'re not interested.', time: '2 days ago' }
      ]
    },
  ];

  const filteredLeads = leads.filter(lead => {
    if (filter === 'unread') return lead.unread;
    if (filter === 'starred') return lead.starred;
    if (filter === 'replied') return lead.status === 'replied';
    return true;
  });

  const toggleSelect = (leadId) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
    );
  };

  const selectAll = () => {
    setSelectedLeads(filteredLeads.map(l => l.id));
  };

  const deselectAll = () => {
    setSelectedLeads([]);
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      alert(`Reply sent: ${replyText}`);
      setReplyText('');
    }
  };

  return (
    <DashboardLayout title="Lead Inbox" subtitle="Unified inbox for all lead conversations">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Lead List */}
        <Card className="lg:col-span-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-white/10">
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Search leads..." className="pl-10" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              {['all', 'unread', 'starred', 'replied'].map(f => (
                <Button
                  key={f}
                  variant={filter === f ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className="capitalize flex-1"
                >
                  {f}
                </Button>
              ))}
            </div>
            {selectedLeads.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedLeads.length} selected
                </span>
                <Button variant="ghost" size="sm" onClick={deselectAll}>
                  Clear
                </Button>
                <Button variant="outline" size="sm">
                  <Archive className="w-4 h-4 mr-1" />
                  Archive
                </Button>
              </div>
            )}
          </div>
          <CardContent className="p-0 overflow-y-auto flex-1">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`p-4 border-b border-gray-200 dark:border-white/10 cursor-pointer transition-colors ${
                  selectedLead?.id === lead.id 
                    ? 'bg-accent-50 dark:bg-accent-500/10 border-l-4 border-l-accent-500' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                } ${lead.unread ? 'font-semibold' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelect(lead.id);
                    }}
                    className="mt-1"
                  >
                    {selectedLeads.includes(lead.id) ? (
                      <CheckSquare className="w-4 h-4 text-accent-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {lead.starred && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                        <span className={`text-sm truncate ${lead.unread ? 'font-bold' : ''}`}>
                          {lead.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{lead.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{lead.company}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 truncate mb-2">
                      {lead.subject}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{lead.preview}</p>
                    <div className="flex gap-1 mt-2">
                      {lead.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" size="sm">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Conversation View */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col">
          {selectedLead ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedLead.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedLead.company}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Star className={`w-4 h-4 ${selectedLead.starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Tag className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  {selectedLead.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>

              {/* Thread */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedLead.thread.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.from === 'You' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${msg.from === 'You' ? 'bg-accent-500 text-white' : 'bg-gray-100 dark:bg-gray-800'} rounded-lg p-4`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold">{msg.from}</span>
                        <span className="text-xs opacity-70">{msg.time}</span>
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Reply Box */}
              <div className="p-4 border-t border-gray-200 dark:border-white/10">
                <div className="mb-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Clock className="w-4 h-4 mr-1" />
                      Schedule
                    </Button>
                    <Button variant="outline" size="sm">
                      AI Suggest
                    </Button>
                  </div>
                  <Button variant="gradient" onClick={handleSendReply}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Select a lead to view conversation</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LeadInbox;
