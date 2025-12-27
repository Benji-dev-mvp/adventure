import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Loader2, 
  MessageSquare,
  Zap,
  Wand2,
  ChevronUp,
  ChevronDown,
  Copy,
  Check,
  Bot,
  User
} from 'lucide-react';

// AI-generated workflow templates based on prompts
const workflowTemplates = {
  'cold outreach': {
    name: 'Cold Outreach Campaign',
    nodes: [
      { id: 'trigger-1', type: 'trigger', position: { x: 300, y: 50 }, data: { label: 'New Lead Added', triggerType: 'event', description: 'Triggers when a new lead enters the system' } },
      { id: 'delay-1', type: 'delay', position: { x: 300, y: 180 }, data: { label: 'Research Period', days: 1, hours: 0, description: 'Allow time for lead enrichment' } },
      { id: 'linkedin-1', type: 'linkedin', position: { x: 300, y: 310 }, data: { label: 'LinkedIn Connection', content: 'Hi {{firstName}}, I noticed your work at {{company}}. Would love to connect!', connectionRequest: true } },
      { id: 'delay-2', type: 'delay', position: { x: 300, y: 440 }, data: { label: 'Wait for Accept', days: 3, hours: 0, description: 'Wait for connection acceptance' } },
      { id: 'condition-1', type: 'condition', position: { x: 300, y: 570 }, data: { label: 'Connection Accepted?', field: 'linkedin_connected', operator: 'equals', value: 'true' } },
      { id: 'email-1', type: 'email', position: { x: 150, y: 700 }, data: { label: 'Intro Email', subject: 'Quick question about {{company}}', content: 'Hi {{firstName}},\n\nI noticed you accepted my connection...', tone: 'professional' } },
      { id: 'linkedin-2', type: 'linkedin', position: { x: 450, y: 700 }, data: { label: 'LinkedIn Follow-up', content: 'Thanks for connecting! I wanted to reach out because...', connectionRequest: false } },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'delay-1' },
      { id: 'e2', source: 'delay-1', target: 'linkedin-1' },
      { id: 'e3', source: 'linkedin-1', target: 'delay-2' },
      { id: 'e4', source: 'delay-2', target: 'condition-1' },
      { id: 'e5', source: 'condition-1', target: 'email-1', sourceHandle: 'yes' },
      { id: 'e6', source: 'condition-1', target: 'linkedin-2', sourceHandle: 'no' },
    ],
  },
  'follow up': {
    name: 'Smart Follow-up Sequence',
    nodes: [
      { id: 'trigger-1', type: 'trigger', position: { x: 300, y: 50 }, data: { label: 'Email Sent Trigger', triggerType: 'event', description: 'After initial email sent' } },
      { id: 'delay-1', type: 'delay', position: { x: 300, y: 180 }, data: { label: 'Wait 2 Days', days: 2, hours: 0, description: 'Give time to respond' } },
      { id: 'condition-1', type: 'condition', position: { x: 300, y: 310 }, data: { label: 'Email Opened?', field: 'email_opened', operator: 'equals', value: 'true' } },
      { id: 'condition-2', type: 'condition', position: { x: 150, y: 440 }, data: { label: 'Replied?', field: 'email_replied', operator: 'equals', value: 'true' } },
      { id: 'email-1', type: 'email', position: { x: 450, y: 440 }, data: { label: 'Re-engage Email', subject: 'Did you see my previous note?', content: 'Hi {{firstName}},\n\nJust wanted to bump this to the top...', tone: 'friendly' } },
      { id: 'call-1', type: 'call', position: { x: 50, y: 570 }, data: { label: 'Schedule Call', script: 'Hi {{firstName}}, this is {{senderName}}...', duration: 5 } },
      { id: 'email-2', type: 'email', position: { x: 250, y: 570 }, data: { label: 'Value Email', subject: 'Resource for {{company}}', content: 'I thought you might find this useful...', tone: 'helpful' } },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'delay-1' },
      { id: 'e2', source: 'delay-1', target: 'condition-1' },
      { id: 'e3', source: 'condition-1', target: 'condition-2', sourceHandle: 'yes' },
      { id: 'e4', source: 'condition-1', target: 'email-1', sourceHandle: 'no' },
      { id: 'e5', source: 'condition-2', target: 'call-1', sourceHandle: 'yes' },
      { id: 'e6', source: 'condition-2', target: 'email-2', sourceHandle: 'no' },
    ],
  },
  'ab test': {
    name: 'A/B Testing Campaign',
    nodes: [
      { id: 'trigger-1', type: 'trigger', position: { x: 300, y: 50 }, data: { label: 'Campaign Start', triggerType: 'manual', description: 'Manual campaign trigger' } },
      { id: 'abtest-1', type: 'abtest', position: { x: 300, y: 180 }, data: { label: 'Subject Line Test', variants: ['Direct Approach', 'Question Hook'], splitRatio: 50 } },
      { id: 'email-1', type: 'email', position: { x: 150, y: 310 }, data: { label: 'Variant A: Direct', subject: '{{firstName}}, quick question', content: 'Hi {{firstName}},\n\nI have a quick question...', tone: 'direct' } },
      { id: 'email-2', type: 'email', position: { x: 450, y: 310 }, data: { label: 'Variant B: Hook', subject: 'Are you still struggling with...?', content: 'Hi {{firstName}},\n\nI noticed many companies like yours...', tone: 'curious' } },
      { id: 'delay-1', type: 'delay', position: { x: 150, y: 440 }, data: { label: 'Wait 3 Days', days: 3, hours: 0 } },
      { id: 'delay-2', type: 'delay', position: { x: 450, y: 440 }, data: { label: 'Wait 3 Days', days: 3, hours: 0 } },
      { id: 'condition-1', type: 'condition', position: { x: 300, y: 570 }, data: { label: 'Any Response?', field: 'email_replied', operator: 'equals', value: 'true' } },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'abtest-1' },
      { id: 'e2', source: 'abtest-1', target: 'email-1', sourceHandle: 'a' },
      { id: 'e3', source: 'abtest-1', target: 'email-2', sourceHandle: 'b' },
      { id: 'e4', source: 'email-1', target: 'delay-1' },
      { id: 'e5', source: 'email-2', target: 'delay-2' },
      { id: 'e6', source: 'delay-1', target: 'condition-1' },
      { id: 'e7', source: 'delay-2', target: 'condition-1' },
    ],
  },
  'multi-channel': {
    name: 'Multi-Channel Blitz',
    nodes: [
      { id: 'trigger-1', type: 'trigger', position: { x: 300, y: 50 }, data: { label: 'High-Value Lead', triggerType: 'event', description: 'When lead score > 80' } },
      { id: 'email-1', type: 'email', position: { x: 300, y: 180 }, data: { label: 'Intro Email', subject: 'Partnership opportunity for {{company}}', content: 'Hi {{firstName}}...', tone: 'professional' } },
      { id: 'linkedin-1', type: 'linkedin', position: { x: 300, y: 310 }, data: { label: 'LinkedIn Touch', content: 'Hi {{firstName}}, just sent you an email...', connectionRequest: true } },
      { id: 'delay-1', type: 'delay', position: { x: 300, y: 440 }, data: { label: 'Wait 1 Day', days: 1, hours: 0 } },
      { id: 'sms-1', type: 'sms', position: { x: 300, y: 570 }, data: { label: 'SMS Ping', content: 'Hi {{firstName}}, did you get a chance to review my email? - {{senderName}}', maxLength: 160 } },
      { id: 'delay-2', type: 'delay', position: { x: 300, y: 700 }, data: { label: 'Wait 2 Days', days: 2, hours: 0 } },
      { id: 'call-1', type: 'call', position: { x: 300, y: 830 }, data: { label: 'Personal Call', script: 'Hi {{firstName}}, I wanted to personally follow up...', duration: 10 } },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'email-1' },
      { id: 'e2', source: 'email-1', target: 'linkedin-1' },
      { id: 'e3', source: 'linkedin-1', target: 'delay-1' },
      { id: 'e4', source: 'delay-1', target: 'sms-1' },
      { id: 'e5', source: 'sms-1', target: 'delay-2' },
      { id: 'e6', source: 'delay-2', target: 'call-1' },
    ],
  },
  'nurture': {
    name: 'Lead Nurture Sequence',
    nodes: [
      { id: 'trigger-1', type: 'trigger', position: { x: 300, y: 50 }, data: { label: 'Newsletter Signup', triggerType: 'event', description: 'When user signs up for newsletter' } },
      { id: 'email-1', type: 'email', position: { x: 300, y: 180 }, data: { label: 'Welcome Email', subject: 'Welcome to {{company}}!', content: 'Thanks for joining...', tone: 'friendly' } },
      { id: 'delay-1', type: 'delay', position: { x: 300, y: 310 }, data: { label: 'Wait 3 Days', days: 3, hours: 0 } },
      { id: 'email-2', type: 'email', position: { x: 300, y: 440 }, data: { label: 'Value Content', subject: '5 tips for {{industry}}', content: 'Here are some insights...', tone: 'educational' } },
      { id: 'delay-2', type: 'delay', position: { x: 300, y: 570 }, data: { label: 'Wait 1 Week', days: 7, hours: 0 } },
      { id: 'email-3', type: 'email', position: { x: 300, y: 700 }, data: { label: 'Case Study', subject: 'How {{successCompany}} achieved 3x growth', content: 'Check out this success story...', tone: 'inspiring' } },
      { id: 'delay-3', type: 'delay', position: { x: 300, y: 830 }, data: { label: 'Wait 5 Days', days: 5, hours: 0 } },
      { id: 'email-4', type: 'email', position: { x: 300, y: 960 }, data: { label: 'Soft Pitch', subject: 'Ready to take the next step?', content: 'If you are ready to...', tone: 'persuasive' } },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'email-1' },
      { id: 'e2', source: 'email-1', target: 'delay-1' },
      { id: 'e3', source: 'delay-1', target: 'email-2' },
      { id: 'e4', source: 'email-2', target: 'delay-2' },
      { id: 'e5', source: 'delay-2', target: 'email-3' },
      { id: 'e6', source: 'email-3', target: 'delay-3' },
      { id: 'e7', source: 'delay-3', target: 'email-4' },
    ],
  },
};

// Parse user intent and generate workflow
const parseIntent = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();
  
  // Match patterns
  if (lowerPrompt.includes('cold') || lowerPrompt.includes('outreach') || lowerPrompt.includes('prospect')) {
    return { template: 'cold outreach', confidence: 0.9 };
  }
  if (lowerPrompt.includes('follow') || lowerPrompt.includes('reminder') || lowerPrompt.includes('bump')) {
    return { template: 'follow up', confidence: 0.85 };
  }
  if (lowerPrompt.includes('a/b') || lowerPrompt.includes('test') || lowerPrompt.includes('compare') || lowerPrompt.includes('variant')) {
    return { template: 'ab test', confidence: 0.9 };
  }
  if (lowerPrompt.includes('multi') || lowerPrompt.includes('channel') || lowerPrompt.includes('blitz') || lowerPrompt.includes('aggressive')) {
    return { template: 'multi-channel', confidence: 0.85 };
  }
  if (lowerPrompt.includes('nurture') || lowerPrompt.includes('drip') || lowerPrompt.includes('sequence') || lowerPrompt.includes('series')) {
    return { template: 'nurture', confidence: 0.8 };
  }
  
  // Default to cold outreach
  return { template: 'cold outreach', confidence: 0.5 };
};

// Suggested prompts
const suggestedPrompts = [
  "Create a cold outreach campaign for enterprise leads",
  "Build a follow-up sequence for warm leads",
  "Design an A/B test for email subject lines",
  "Create a multi-channel campaign with email, LinkedIn, and calls",
  "Build a nurture sequence for newsletter signups",
];

const AIWorkflowAssistant = ({ isOpen, onClose, onGenerateWorkflow }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm Ava, your AI workflow assistant. Describe the campaign you want to create, and I'll build it for you. For example: \"Create a cold outreach campaign with LinkedIn and email follow-ups.\""
    }
  ]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    // Add user message
    const userMessage = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsGenerating(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Parse intent
    const { template, confidence } = parseIntent(prompt);
    const workflow = workflowTemplates[template];

    // Add assistant response
    const assistantMessage = {
      role: 'assistant',
      content: `I've created a "${workflow.name}" workflow for you! This campaign includes ${workflow.nodes.length} steps with ${workflow.edges.length} connections. The workflow is optimized for your use case with proper timing and sequencing.\n\nClick "Apply Workflow" to add it to your canvas.`,
      workflow: workflow,
      confidence: confidence,
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsGenerating(false);
  };

  const handleApplyWorkflow = (workflow) => {
    onGenerateWorkflow(workflow);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: "Great! I've added the workflow to your canvas. You can now customize each node by clicking on it, or ask me to modify the workflow."
    }]);
  };

  const handleSuggestedPrompt = (suggestedPrompt) => {
    setPrompt(suggestedPrompt);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col">
      {/* Chat Window */}
      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${isExpanded ? 'w-96 h-[500px]' : 'w-96 h-16'}`}>
        {/* Header */}
        <div 
          className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Ava - AI Assistant</h3>
              <p className="text-xs text-white/70">Build workflows with AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronUp className="w-5 h-5" />
            )}
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="p-1 hover:bg-white/20 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isExpanded && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[340px]">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                    {/* Avatar */}
                    <div className={`flex items-start gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user' 
                          ? 'bg-indigo-100 dark:bg-indigo-900' 
                          : 'bg-purple-100 dark:bg-purple-900'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                          <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        )}
                      </div>
                      
                      <div className={`rounded-2xl px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        
                        {/* Workflow Preview */}
                        {message.workflow && (
                          <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm text-gray-900 dark:text-white">
                                {message.workflow.name}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                {Math.round(message.confidence * 100)}% match
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                              <span>{message.workflow.nodes.length} nodes</span>
                              <span>{message.workflow.edges.length} connections</span>
                            </div>
                            <button
                              onClick={() => handleApplyWorkflow(message.workflow)}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-all"
                            >
                              <Wand2 className="w-4 h-4" />
                              Apply Workflow
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Creating your workflow...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Try these:</p>
                <div className="flex flex-wrap gap-1">
                  {suggestedPrompts.slice(0, 3).map((sp, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestedPrompt(sp)}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors truncate max-w-[150px]"
                    >
                      {sp.length > 25 ? sp.slice(0, 25) + '...' : sp}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleGenerate()}
                  placeholder="Describe your campaign..."
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-full text-sm focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white placeholder-gray-500"
                  disabled={isGenerating}
                />
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full disabled:opacity-50 hover:from-purple-700 hover:to-indigo-700 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIWorkflowAssistant;
