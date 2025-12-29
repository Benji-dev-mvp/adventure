import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pause,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Search,
  Download,
  Activity,
  Zap,
  Mail,
  Phone,
  Globe,
  Brain,
  Timer,
  User,
  ArrowRight,
} from 'lucide-react';

/**
 * Execution Timeline Component
 * Real-time event stream showing workflow execution
 */

interface ExecutionEvent {
  id: string;
  timestamp: Date;
  type: string;
  blockId: string;
  blockName: string;
  status: 'completed' | 'running' | 'failed' | 'pending';
  leadId: string;
  leadName: string;
  company: string;
  details: string;
  duration: number | null;
  branch?: string;
  error?: string;
}

const mockExecutionEvents: ExecutionEvent[] = [
  { 
    id: 'ev-1', 
    timestamp: new Date(Date.now() - 1000 * 60 * 2), 
    type: 'lead_entered',
    blockId: 'b1',
    blockName: 'Import Leads',
    status: 'completed',
    leadId: 'lead-123',
    leadName: 'John Smith',
    company: 'Acme Corp',
    details: 'Lead imported from CSV',
    duration: 0.3,
  },
  { 
    id: 'ev-2', 
    timestamp: new Date(Date.now() - 1000 * 60 * 1.8), 
    type: 'scoring',
    blockId: 'b2',
    blockName: 'Lead Scoring',
    status: 'completed',
    leadId: 'lead-123',
    leadName: 'John Smith',
    company: 'Acme Corp',
    details: 'Score: 85 (High Intent)',
    duration: 0.8,
  },
  { 
    id: 'ev-3', 
    timestamp: new Date(Date.now() - 1000 * 60 * 1.5), 
    type: 'enrichment',
    blockId: 'b3',
    blockName: 'Data Enrichment',
    status: 'completed',
    leadId: 'lead-123',
    leadName: 'John Smith',
    company: 'Acme Corp',
    details: 'Enriched with 12 new fields',
    duration: 2.1,
  },
  { 
    id: 'ev-4', 
    timestamp: new Date(Date.now() - 1000 * 60 * 1.2), 
    type: 'condition',
    blockId: 'b4',
    blockName: 'Score Check',
    status: 'completed',
    leadId: 'lead-123',
    leadName: 'John Smith',
    company: 'Acme Corp',
    details: 'Condition: score >= 70 → TRUE',
    duration: 0.1,
    branch: 'true',
  },
  { 
    id: 'ev-5', 
    timestamp: new Date(Date.now() - 1000 * 60 * 1), 
    type: 'email_sent',
    blockId: 'b5',
    blockName: 'Hot Lead Email',
    status: 'completed',
    leadId: 'lead-123',
    leadName: 'John Smith',
    company: 'Acme Corp',
    details: 'Sent: "Quick question about your Q4 goals"',
    duration: 1.5,
  },
  { 
    id: 'ev-6', 
    timestamp: new Date(Date.now() - 1000 * 60 * 0.5), 
    type: 'lead_entered',
    blockId: 'b1',
    blockName: 'Import Leads',
    status: 'completed',
    leadId: 'lead-124',
    leadName: 'Sarah Johnson',
    company: 'TechCorp Inc',
    details: 'Lead imported from CSV',
    duration: 0.3,
  },
  { 
    id: 'ev-7', 
    timestamp: new Date(Date.now() - 1000 * 30), 
    type: 'scoring',
    blockId: 'b2',
    blockName: 'Lead Scoring',
    status: 'running',
    leadId: 'lead-124',
    leadName: 'Sarah Johnson',
    company: 'TechCorp Inc',
    details: 'Calculating score...',
    duration: null,
  },
  { 
    id: 'ev-8', 
    timestamp: new Date(Date.now() - 1000 * 60 * 5), 
    type: 'email_sent',
    blockId: 'b5',
    blockName: 'Hot Lead Email',
    status: 'failed',
    leadId: 'lead-122',
    leadName: 'Mike Davis',
    company: 'Global Industries',
    details: 'Error: Invalid email address',
    duration: 0.2,
    error: 'SMTP_INVALID_ADDRESS',
  },
];

const ExecutionTimeline = () => {
  const [events] = useState<ExecutionEvent[]>(mockExecutionEvents);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);

  const stats = useMemo(() => ({
    total: events.length,
    completed: events.filter(e => e.status === 'completed').length,
    running: events.filter(e => e.status === 'running').length,
    failed: events.filter(e => e.status === 'failed').length,
    avgDuration: events.filter(e => e.duration).reduce((a, b) => a + (b.duration || 0), 0) / events.filter(e => e.duration).length,
  }), [events]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (filter !== 'all' && event.status !== filter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!event.leadName?.toLowerCase().includes(query) &&
            !event.company?.toLowerCase().includes(query) &&
            !event.blockName?.toLowerCase().includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [events, filter, searchQuery]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'running':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
          </motion.div>
        );
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'lead_entered': return User;
      case 'scoring': return Activity;
      case 'enrichment': return Zap;
      case 'condition': return ArrowRight;
      case 'email_sent': return Mail;
      case 'call_scheduled': return Phone;
      case 'linkedin_sent': return Globe;
      case 'ai_action': return Brain;
      case 'wait_started': return Timer;
      default: return Activity;
    }
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Header */}
      <div className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-white">Execution Timeline</h2>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isLive 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            {isLive ? (
              <>
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                Live
              </>
            ) : (
              <>
                <Pause className="w-3 h-3" />
                Paused
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-9 pr-4 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none"
            />
          </div>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:border-violet-500 focus:outline-none"
          >
            <option value="all">All Events</option>
            <option value="completed">Completed</option>
            <option value="running">Running</option>
            <option value="failed">Failed</option>
          </select>

          <button className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gray-900/50 border-b border-gray-800 px-4 py-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-400">Total:</span>
            <span className="text-sm font-medium text-white">{stats.total}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-400">Completed:</span>
            <span className="text-sm font-medium text-green-400">{stats.completed}</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-gray-400">Running:</span>
            <span className="text-sm font-medium text-amber-400">{stats.running}</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-gray-400">Failed:</span>
            <span className="text-sm font-medium text-red-400">{stats.failed}</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Timer className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-400">Avg Duration:</span>
            <span className="text-sm font-medium text-violet-400">{stats.avgDuration.toFixed(1)}s</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-gray-800" />

          {/* Events */}
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, idx) => {
                const EventIcon = getEventIcon(event.type);
                const isExpanded = expandedEvent === event.id;

                return (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.02 }}
                    className={`relative pl-12 ${
                      event.status === 'running' ? 'animate-pulse' : ''
                    }`}
                  >
                    {/* Timeline node */}
                    <div className="absolute left-0 top-3 w-11 flex items-center justify-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        event.status === 'completed' ? 'bg-green-500/20 ring-2 ring-green-500/50' :
                        event.status === 'running' ? 'bg-amber-500/20 ring-2 ring-amber-500/50' :
                        event.status === 'failed' ? 'bg-red-500/20 ring-2 ring-red-500/50' :
                        'bg-gray-700'
                      }`}>
                        <EventIcon className={`w-3.5 h-3.5 ${
                          event.status === 'completed' ? 'text-green-400' :
                          event.status === 'running' ? 'text-amber-400' :
                          event.status === 'failed' ? 'text-red-400' :
                          'text-gray-400'
                        }`} />
                      </div>
                    </div>

                    {/* Event card */}
                    <div
                      className={`bg-gray-900 border rounded-lg overflow-hidden cursor-pointer transition-colors ${
                        event.status === 'failed' ? 'border-red-500/30 hover:border-red-500/50' :
                        event.status === 'running' ? 'border-amber-500/30 hover:border-amber-500/50' :
                        'border-gray-800 hover:border-gray-700'
                      }`}
                      onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                    >
                      <div className="p-3 flex items-center gap-3">
                        {getStatusIcon(event.status)}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{event.blockName}</span>
                            <ChevronRight className="w-3 h-3 text-gray-600" />
                            <span className="text-sm text-gray-400 truncate">{event.leadName}</span>
                            <span className="text-xs text-gray-600">•</span>
                            <span className="text-xs text-gray-500 truncate">{event.company}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">{event.details}</div>
                        </div>

                        <div className="flex items-center gap-3">
                          {event.duration && (
                            <span className="text-xs text-gray-500">{event.duration}s</span>
                          )}
                          <span className="text-xs text-gray-600">{formatTime(event.timestamp)}</span>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>

                      {/* Expanded details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-gray-800"
                          >
                            <div className="p-4 space-y-3">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Event ID</span>
                                  <div className="text-white font-mono text-xs mt-0.5">{event.id}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Block ID</span>
                                  <div className="text-white font-mono text-xs mt-0.5">{event.blockId}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Lead ID</span>
                                  <div className="text-white font-mono text-xs mt-0.5">{event.leadId}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Timestamp</span>
                                  <div className="text-white text-xs mt-0.5">{event.timestamp.toLocaleString()}</div>
                                </div>
                              </div>

                              {event.error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                  <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
                                    <AlertCircle className="w-4 h-4" />
                                    Error: {event.error}
                                  </div>
                                </div>
                              )}

                              {event.branch && (
                                <div className="bg-gray-800 rounded-lg p-3">
                                  <span className="text-gray-500 text-sm">Branch taken:</span>
                                  <span className={`ml-2 text-sm font-medium ${
                                    event.branch === 'true' ? 'text-green-400' : 'text-red-400'
                                  }`}>
                                    {event.branch.toUpperCase()}
                                  </span>
                                </div>
                              )}

                              <div className="flex gap-2">
                                <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium rounded-lg transition-colors">
                                  View Lead
                                </button>
                                <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium rounded-lg transition-colors">
                                  Retry Event
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ExecutionTimeline };
export default ExecutionTimeline;
