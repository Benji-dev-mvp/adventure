import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Star,
  Clock,
  TrendingUp,
  ChevronRight,
  Plus,
  Copy,
  Zap,
  Mail,
  Linkedin,
  Phone,
  Target,
} from 'lucide-react';
import PropTypes from 'prop-types';

// Helper factories to reduce duplication
const createNode = (id, type, position, data) => ({ id, type, position, data });
const createEdge = (id, source, target, sourceHandle) => {
  const edge = { id, source, target };
  if (sourceHandle) edge.sourceHandle = sourceHandle;
  return edge;
};
const nodePos = (y, x = 250) => ({ x, y });

// Pre-built campaign playbooks
const playbooks = [
  {
    id: 'enterprise-outreach',
    name: 'Enterprise Outreach',
    description: 'Multi-touch sequence for enterprise accounts with email, LinkedIn, and calls',
    category: 'Outbound',
    difficulty: 'Advanced',
    avgConversion: '12%',
    duration: '21 days',
    steps: 8,
    popular: true,
    nodes: [
      { type: 'trigger', label: 'Start' },
      { type: 'email', label: 'Initial Email' },
      { type: 'delay', label: 'Wait 3 days' },
      { type: 'linkedin', label: 'LinkedIn Connect' },
      { type: 'delay', label: 'Wait 2 days' },
      { type: 'condition', label: 'Email Opened?' },
      { type: 'email', label: 'Follow-up' },
      { type: 'call', label: 'Schedule Call' },
    ],
    workflow: {
      nodes: [
        createNode('trigger-1', 'trigger', nodePos(0), { label: 'Campaign Start', triggerType: 'manual' }),
        createNode('email-1', 'email', nodePos(120), { label: 'Initial Outreach', subject: 'Partnership opportunity with {{company}}' }),
        createNode('delay-1', 'delay', nodePos(260), { label: 'Wait', days: 3, hours: 0 }),
        createNode('linkedin-1', 'linkedin', nodePos(400), { label: 'LinkedIn Connect', connectionRequest: true }),
        createNode('delay-2', 'delay', nodePos(540), { label: 'Wait', days: 2, hours: 0 }),
        createNode('condition-1', 'condition', nodePos(680), { label: 'Email Opened?', field: 'email_opened', operator: 'equals', value: 'true' }),
        createNode('email-2', 'email', nodePos(850, 100), { label: 'Warm Follow-up', subject: 'Re: Partnership opportunity' }),
        createNode('call-1', 'call', nodePos(850, 400), { label: 'Cold Call', script: 'Hi {{firstName}}, I sent you an email about...' }),
      ],
      edges: [
        createEdge('e1-2', 'trigger-1', 'email-1'),
        createEdge('e2-3', 'email-1', 'delay-1'),
        createEdge('e3-4', 'delay-1', 'linkedin-1'),
        createEdge('e4-5', 'linkedin-1', 'delay-2'),
        createEdge('e5-6', 'delay-2', 'condition-1'),
        createEdge('e6-7', 'condition-1', 'email-2', 'yes'),
        createEdge('e6-8', 'condition-1', 'call-1', 'no'),
      ],
    },
  },
  {
    id: 'quick-follow-up',
    name: 'Quick Follow-up',
    description: 'Simple 3-step email sequence for warm leads',
    category: 'Follow-up',
    difficulty: 'Beginner',
    avgConversion: '18%',
    duration: '7 days',
    steps: 4,
    popular: true,
    nodes: [
      { type: 'trigger', label: 'Start' },
      { type: 'email', label: 'Follow-up #1' },
      { type: 'delay', label: 'Wait 3 days' },
      { type: 'email', label: 'Follow-up #2' },
    ],
    workflow: {
      nodes: [
        createNode('trigger-1', 'trigger', nodePos(0), { label: 'Campaign Start', triggerType: 'manual' }),
        createNode('email-1', 'email', nodePos(120), { label: 'Follow-up #1', subject: 'Following up on our conversation' }),
        createNode('delay-1', 'delay', nodePos(260), { label: 'Wait', days: 3, hours: 0 }),
        createNode('email-2', 'email', nodePos(400), { label: 'Follow-up #2', subject: 'Quick question' }),
      ],
      edges: [
        createEdge('e1-2', 'trigger-1', 'email-1'),
        createEdge('e2-3', 'email-1', 'delay-1'),
        createEdge('e3-4', 'delay-1', 'email-2'),
      ],
    },
  },
  {
    id: 'linkedin-first',
    name: 'LinkedIn-First Approach',
    description: 'Start with LinkedIn before moving to email',
    category: 'Social Selling',
    difficulty: 'Intermediate',
    avgConversion: '15%',
    duration: '14 days',
    steps: 6,
    popular: false,
    nodes: [
      { type: 'trigger', label: 'Start' },
      { type: 'linkedin', label: 'Connect Request' },
      { type: 'delay', label: 'Wait 2 days' },
      { type: 'condition', label: 'Accepted?' },
      { type: 'linkedin', label: 'Message' },
      { type: 'email', label: 'Email Intro' },
    ],
    workflow: {
      nodes: [
        createNode('trigger-1', 'trigger', nodePos(0), { label: 'Campaign Start', triggerType: 'manual' }),
        createNode('linkedin-1', 'linkedin', nodePos(120), { label: 'Connection Request', connectionRequest: true }),
        createNode('delay-1', 'delay', nodePos(260), { label: 'Wait', days: 2, hours: 0 }),
        createNode('condition-1', 'condition', nodePos(400), { label: 'Connection Accepted?', field: 'linkedin_accepted', operator: 'equals', value: 'true' }),
        createNode('linkedin-2', 'linkedin', nodePos(570, 100), { label: 'LinkedIn Message', content: 'Thanks for connecting!' }),
        createNode('email-1', 'email', nodePos(570, 400), { label: 'Email Introduction', subject: 'Connecting from LinkedIn' }),
      ],
      edges: [
        createEdge('e1-2', 'trigger-1', 'linkedin-1'),
        createEdge('e2-3', 'linkedin-1', 'delay-1'),
        createEdge('e3-4', 'delay-1', 'condition-1'),
        createEdge('e4-5', 'condition-1', 'linkedin-2', 'yes'),
        createEdge('e4-6', 'condition-1', 'email-1', 'no'),
      ],
    },
  },
  {
    id: 'ab-test-subject',
    name: 'A/B Test Subject Lines',
    description: 'Test two different email approaches',
    category: 'Testing',
    difficulty: 'Intermediate',
    avgConversion: '20%',
    duration: '10 days',
    steps: 5,
    popular: true,
    nodes: [
      { type: 'trigger', label: 'Start' },
      { type: 'abtest', label: 'Split Test' },
      { type: 'email', label: 'Version A' },
      { type: 'email', label: 'Version B' },
      { type: 'delay', label: 'Analyze' },
    ],
    workflow: {
      nodes: [
        createNode('trigger-1', 'trigger', nodePos(0), { label: 'Campaign Start', triggerType: 'manual' }),
        createNode('abtest-1', 'abtest', nodePos(120), { label: 'A/B Split', splitRatio: 50, variantAName: 'Direct', variantBName: 'Question' }),
        createNode('email-1', 'email', nodePos(300, 100), { label: 'Direct Approach', subject: 'Boost your sales by 30%' }),
        createNode('email-2', 'email', nodePos(300, 400), { label: 'Question Approach', subject: 'Quick question about {{company}}' }),
      ],
      edges: [
        createEdge('e1-2', 'trigger-1', 'abtest-1'),
        createEdge('e2-3', 'abtest-1', 'email-1', 'yes'),
        createEdge('e2-4', 'abtest-1', 'email-2', 'no'),
      ],
    },
  },
];

const PlaybookLibrary = ({ isOpen, onClose, onSelectPlaybook }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Outbound', 'Follow-up', 'Social Selling', 'Testing'];

  const filteredPlaybooks = playbooks.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const difficultyColors = {
    Beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const nodeIcons = {
    trigger: Target,
    email: Mail,
    linkedin: Linkedin,
    call: Phone,
    delay: Clock,
    condition: Zap,
    abtest: TrendingUp,
  };

  const handleClose = event => {
    if (event.type === 'click' || event.key === 'Enter' || event.key === ' ') {
      onClose();
    }
  };

  const handleSelect = playbook => {
    onSelectPlaybook(playbook);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        role="button"
        tabIndex={0}
        aria-label="Close playbook library"
        onClick={handleClose}
        onKeyDown={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-10 bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Playbook Library</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pre-built campaign templates to get started quickly
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search playbooks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedCategory === cat
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Playbook Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredPlaybooks.map(playbook => (
              <div
                key={playbook.id}
                className="group bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`Select ${playbook.name}`}
                onClick={() => handleSelect(playbook)}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    handleSelect(playbook);
                  }
                }}
              >
                {/* Card Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-600">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {playbook.name}
                    </h3>
                    {playbook.popular && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        <Star className="w-3 h-3" /> Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {playbook.description}
                  </p>
                </div>

                {/* Node Preview */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-1 mb-3 overflow-x-auto">
                    {playbook.nodes.slice(0, 5).map((node, idx) => {
                      const Icon = nodeIcons[node.type] || Zap;
                      return (
                        <React.Fragment key={idx}>
                          <div
                            className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                            title={node.label}
                          >
                            <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </div>
                          {idx < playbook.nodes.slice(0, 5).length - 1 && (
                            <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          )}
                        </React.Fragment>
                      );
                    })}
                    {playbook.nodes.length > 5 && (
                      <span className="text-xs text-gray-500 ml-1">
                        +{playbook.nodes.length - 5} more
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" /> {playbook.duration}
                      </span>
                      <span className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-3 h-3" /> {playbook.avgConversion} conv.
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full ${difficultyColors[playbook.difficulty]}`}
                    >
                      {playbook.difficulty}
                    </span>
                  </div>
                </div>

                {/* Use Button */}
                <div className="p-3 border-t border-gray-100 dark:border-gray-600">
                  <button className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium">
                    <Copy className="w-4 h-4" />
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredPlaybooks.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-9 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No playbooks found matching your search
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredPlaybooks.length} playbooks available
            </span>
            <button className="flex items-center gap-2 px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors text-sm font-medium">
              <Plus className="w-4 h-4" />
              Create Custom Playbook
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

PlaybookLibrary.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectPlaybook: PropTypes.func.isRequired,
};

export default PlaybookLibrary;
