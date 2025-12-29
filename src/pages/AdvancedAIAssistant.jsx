import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Brain,
  Database,
  Search,
  Sparkles,
  Clock,
  Tag,
  Trash2,
  Loader2,
  MessageSquare,
  BookOpen,
} from 'lucide-react';
import { dataService } from '../lib/dataService';
import { useToast } from '../components/Toast';

export default function AdvancedAIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // chat, memory, rag
  const [memories, setMemories] = useState([]);
  const [memorySearch, setMemorySearch] = useState('');
  const [ragQuery, setRagQuery] = useState('');
  const [ragResults, setRagResults] = useState(null);
  const messagesEndRef = useRef(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const result = await dataService.post('/ai-advanced/conversation', {
        message: input,
      });

      const assistantMessage = {
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
        context_used: result.memory_context_used,
        kb_used: result.knowledge_base_used,
        steps: result.intermediate_steps,
      };

      setMessages(prev => [...prev, assistantMessage]);
      toast.success('Response generated with full context');
    } catch (error) {
      console.error('Chat failed:', error);
      toast.error('Failed to get response: ' + (error.message || 'Unknown error'));

      const errorMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
        error: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const searchMemories = async () => {
    if (!memorySearch.trim()) {
      loadAllMemories();
      return;
    }

    try {
      const result = await dataService.post('/ai-advanced/memory/search', {
        query: memorySearch,
        limit: 20,
      });
      setMemories(result.results);
      toast.success(`Found ${result.count} memories`);
    } catch (error) {
      console.error('Memory search failed:', error);
      toast.error('Failed to search memories');
    }
  };

  const loadAllMemories = async () => {
    try {
      const result = await dataService.get('/ai-advanced/memory/all');
      setMemories(result.results);
    } catch (error) {
      console.error('Failed to load memories:', error);
    }
  };

  const deleteMemory = async memoryId => {
    try {
      await dataService.delete(`/ai-advanced/memory/${memoryId}`);
      setMemories(prev => prev.filter(m => m.id !== memoryId));
      toast.success('Memory deleted');
    } catch (error) {
      console.error('Failed to delete memory:', error);
      toast.error('Failed to delete memory');
    }
  };

  const queryRAG = async () => {
    if (!ragQuery.trim()) return;

    setLoading(true);
    try {
      const result = await dataService.post('/ai-advanced/rag/query', {
        query: ragQuery,
        index_name: 'knowledge_base',
        top_k: 5,
      });
      setRagResults(result.result);
      toast.success('Found relevant documents');
    } catch (error) {
      console.error('RAG query failed:', error);
      toast.error('Failed to query documents: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    'What are best practices for B2B sales?',
    'How should I follow up with leads?',
    'What makes a high-priority lead?',
    'Analyze my recent campaign performance',
    'Suggest improvements for email outreach',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Advanced AI Assistant</h1>
            <p className="text-gray-600 mt-1">
              Context-aware conversations with memory, RAG, and agent tools
            </p>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-1">
            <Brain className="w-3 h-3" /> Mem0 Memory
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
            <Database className="w-3 h-3" /> LlamaIndex RAG
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> LangChain Tools
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-2 border-b border-gray-200 bg-white rounded-t-2xl px-4">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-3 font-medium transition-all flex items-center gap-2 ${
              activeTab === 'chat'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            AI Chat
          </button>
          <button
            onClick={() => {
              setActiveTab('memory');
              loadAllMemories();
            }}
            className={`px-4 py-3 font-medium transition-all flex items-center gap-2 ${
              activeTab === 'memory'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Brain className="w-4 h-4" />
            Memory Store
          </button>
          <button
            onClick={() => setActiveTab('rag')}
            className={`px-4 py-3 font-medium transition-all flex items-center gap-2 ${
              activeTab === 'rag'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Knowledge Base
          </button>
        </div>
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Chat Area */}
            <div
              className="lg:col-span-2 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col"
              style={{ height: '600px' }}
            >
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Bot className="w-16 h-16 mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">Ask me anything about B2B sales</p>
                    <p className="text-sm">
                      I have access to your memories, knowledge base, and agent tools
                    </p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-4`}
                      >
                        <div className="whitespace-pre-wrap">{msg.content}</div>

                        {msg.role === 'assistant' && (msg.context_used || msg.kb_used) && (
                          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-300">
                            {msg.context_used && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs flex items-center gap-1">
                                <Brain className="w-3 h-3" />
                                Used Memory
                              </span>
                            )}
                            {msg.kb_used && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs flex items-center gap-1">
                                <Database className="w-3 h-3" />
                                Used KB
                              </span>
                            )}
                          </div>
                        )}

                        <div className="text-xs opacity-70 mt-2">
                          {msg.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && !loading && sendMessage()}
                    placeholder="Ask Ava anything..."
                    disabled={loading}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none disabled:opacity-50"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Suggested Questions */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Suggested Questions
              </h3>
              <div className="space-y-2">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(question)}
                    disabled={loading}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-300 border border-gray-200 rounded-lg text-sm transition-all disabled:opacity-50"
                  >
                    {question}
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                <div className="text-xs font-medium text-gray-900 mb-2">Context-Aware AI</div>
                <div className="text-xs text-gray-600">
                  Every response uses your past interactions (Mem0), searches knowledge base
                  (LlamaIndex), and can execute agent tools (LangChain) for comprehensive answers.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Memory Tab */}
      {activeTab === 'memory' && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            {/* Search */}
            <div className="mb-6 flex gap-2">
              <input
                type="text"
                value={memorySearch}
                onChange={e => setMemorySearch(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && searchMemories()}
                placeholder="Search memories semantically..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
              />
              <button
                onClick={searchMemories}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>

            {/* Memory List */}
            <div className="space-y-3">
              {memories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Brain className="w-12 h-9 mb-3 text-gray-400" />
                  <p>No memories found</p>
                  <p className="text-sm mt-1">Start chatting to build your memory store</p>
                </div>
              ) : (
                memories.map((memory, idx) => (
                  <div
                    key={idx}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm text-gray-900 mb-2">
                          {memory.memory || memory.content}
                        </div>
                        {memory.metadata && (
                          <div className="flex gap-2 flex-wrap">
                            {memory.metadata.category && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {memory.metadata.category}
                              </span>
                            )}
                            {memory.score && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                                Score: {(memory.score * 100).toFixed(0)}%
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {memory.id && (
                        <button
                          onClick={() => deleteMemory(memory.id)}
                          className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* RAG Tab */}
      {activeTab === 'rag' && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            {/* Query */}
            <div className="mb-6 flex gap-2">
              <input
                type="text"
                value={ragQuery}
                onChange={e => setRagQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && !loading && queryRAG()}
                placeholder="Search knowledge base..."
                disabled={loading}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={queryRAG}
                disabled={loading || !ragQuery.trim()}
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Results */}
            {ragResults ? (
              <div className="space-y-3">
                {/* Answer */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    AI-Generated Answer
                  </h3>
                  <div className="text-gray-700">{ragResults.answer}</div>
                </div>

                {/* Sources */}
                {ragResults.sources && ragResults.sources.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      Source Documents ({ragResults.sources.length})
                    </h3>
                    <div className="space-y-3">
                      {ragResults.sources.map((source, idx) => (
                        <div key={idx} className="p-4 border-2 border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="text-sm font-medium text-gray-900">
                              Document {idx + 1}
                            </div>
                            <div className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs">
                              {(source.score * 100).toFixed(0)}% match
                            </div>
                          </div>
                          <div className="text-sm text-gray-700">{source.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Database className="w-12 h-9 mb-3 text-gray-400" />
                <p>Search the knowledge base</p>
                <p className="text-sm mt-1">Find relevant documents and get AI-generated answers</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
