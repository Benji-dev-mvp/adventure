import React, { useState, useEffect } from 'react';
import { HelpCircle, X, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';

/**
 * Kapa.ai Documentation Assistant Component
 * 
 * Provides an AI-powered help assistant that can answer questions about
 * the application, features, and usage.
 */
export const KapaAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage = query;
    setQuery('');
    
    // Add user message to conversation
    setConversation(prev => [...prev, { type: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/kapa/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMessage,
          thread_id: threadId,
          integration_id: 'webapp'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Update thread ID for conversation continuity
      if (data.thread_id) {
        setThreadId(data.thread_id);
      }

      // Add AI response to conversation
      setConversation(prev => [...prev, {
        type: 'assistant',
        text: data.answer,
        sources: data.sources,
        thread_id: data.thread_id,
        confidence: data.confidence
      }]);
    } catch (error) {
      console.error('Error querying Kapa.ai:', error);
      setConversation(prev => [...prev, {
        type: 'error',
        text: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (messageThreadId, helpful) => {
    try {
      await fetch('/api/kapa/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thread_id: messageThreadId,
          helpful
        })
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const clearConversation = () => {
    setConversation([]);
    setThreadId(null);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50"
        aria-label="Open help assistant"
      >
        <HelpCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          <h3 className="font-semibold">Help Assistant</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-blue-800 rounded p-1 transition-colors"
          aria-label="Close assistant"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <HelpCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">Ask me anything about using this application!</p>
            <div className="mt-4 text-xs space-y-2">
              <p className="text-gray-400">Example questions:</p>
              <div className="space-y-1">
                <button
                  onClick={() => setQuery('How do I create a campaign?')}
                  className="block w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  How do I create a campaign?
                </button>
                <button
                  onClick={() => setQuery('What integrations are available?')}
                  className="block w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  What integrations are available?
                </button>
                <button
                  onClick={() => setQuery('How do I manage my leads?')}
                  className="block w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  How do I manage my leads?
                </button>
              </div>
            </div>
          </div>
        )}

        {conversation.map((message, index) => (
          <div
            key={index}
            className={`${
              message.type === 'user'
                ? 'ml-8 bg-blue-600 text-white'
                : message.type === 'error'
                ? 'mr-8 bg-red-50 text-red-900'
                : 'mr-8 bg-gray-100 text-gray-900'
            } rounded-lg p-3`}
          >
            <div className="text-sm whitespace-pre-wrap">{message.text}</div>
            
            {/* Sources */}
            {message.sources && message.sources.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Sources:</p>
                <div className="space-y-1">
                  {message.sources.slice(0, 3).map((source, idx) => (
                    <a
                      key={idx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline block"
                    >
                      {source.title || source.url}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback buttons for assistant messages */}
            {message.type === 'assistant' && message.thread_id && (
              <div className="mt-2 pt-2 border-t border-gray-200 flex gap-2">
                <button
                  onClick={() => handleFeedback(message.thread_id, true)}
                  className="text-xs text-gray-600 hover:text-green-600 flex items-center gap-1"
                  aria-label="Helpful"
                >
                  <ThumbsUp className="w-3 h-3" />
                  Helpful
                </button>
                <button
                  onClick={() => handleFeedback(message.thread_id, false)}
                  className="text-xs text-gray-600 hover:text-red-600 flex items-center gap-1"
                  aria-label="Not helpful"
                >
                  <ThumbsDown className="w-3 h-3" />
                  Not helpful
                </button>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="mr-8 bg-gray-100 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        {conversation.length > 0 && (
          <button
            onClick={clearConversation}
            className="text-xs text-gray-500 hover:text-gray-700 mb-2"
          >
            Clear conversation
          </button>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Powered by Kapa.ai
        </p>
      </div>
    </div>
  );
};

export default KapaAssistant;
