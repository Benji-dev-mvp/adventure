import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { InlineLoader } from '../Loading';
import { useToast } from '../Toast';
import { dataService } from '../../lib/dataService';

/**
 * AI Chat Component - Demonstrates LLM integration
 *
 * Features:
 * - Real-time chat with AI assistant
 * - Conversation history
 * - Streaming responses
 * - Provider status display
 */
export function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);
  const toast = useToast();

  // Load AI status on mount
  React.useEffect(() => {
    loadAIStatus();
  }, []);

  const loadAIStatus = async () => {
    try {
      const status = await dataService.fetch('/api/ai/status');
      setAiStatus(status);
    } catch (error) {
      console.error('Failed to load AI status:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send chat request with history
      const response = await dataService.fetch('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          prompt: input,
          history: messages,
        }),
      });

      const assistantMessage = {
        role: response.role,
        content: response.content,
        suggestions: response.suggestions,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Failed to send message');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendStreamingMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          history: messages,
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      // Add placeholder message
      setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              setMessages(prev =>
                prev.map((msg, i) => (i === prev.length - 1 ? { ...msg, streaming: false } : msg))
              );
              setIsLoading(false);
              return;
            }
            fullContent += data;
            // Update last message with accumulated content
            setMessages(prev =>
              prev.map((msg, i) => (i === prev.length - 1 ? { ...msg, content: fullContent } : msg))
            );
          }
        }
      }
    } catch (error) {
      toast.error('Failed to stream message');
      console.error(error);
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast.info('Chat cleared');
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-3">
      {/* AI Status */}
      {aiStatus && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${aiStatus.available ? 'bg-green-500' : 'bg-yellow-500'}`}
              />
              <div>
                <p className="font-medium text-sm">
                  AI Provider: <span className="capitalize">{aiStatus.provider}</span>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Model: {aiStatus.model}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">{aiStatus.capabilities.length} capabilities</div>
          </div>
        </Card>
      )}

      {/* Chat Messages */}
      <Card className="p-4 min-h-[400px] max-h-[600px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p className="text-lg mb-2">👋 Hi! I'm Ava, your AI assistant</p>
            <p className="text-sm">Ask me anything about campaigns, leads, or sales strategy</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.streaming && (
                    <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
                  )}
                  {msg.suggestions && (
                    <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                      <p className="text-xs font-medium mb-1">Suggestions:</p>
                      <div className="flex flex-wrap gap-1">
                        {msg.suggestions.map((suggestion, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded bg-white/20 dark:bg-black/20"
                          >
                            {suggestion}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && !messages[messages.length - 1]?.streaming && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <InlineLoader />
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Input Area */}
      <Card className="p-4">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            disabled={isLoading}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="whitespace-nowrap"
            >
              Send
            </Button>
            {aiStatus?.capabilities.includes('streaming') && (
              <Button
                onClick={sendStreamingMessage}
                disabled={!input.trim() || isLoading}
                variant="outline"
                className="whitespace-nowrap text-xs"
              >
                Stream
              </Button>
            )}
          </div>
        </div>

        {messages.length > 0 && (
          <div className="flex justify-end mt-2">
            <Button onClick={clearChat} variant="ghost" size="sm" disabled={isLoading}>
              Clear Chat
            </Button>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="p-4">
        <p className="text-sm font-medium mb-2">Quick Actions:</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput('Help me write a cold email to a VP of Sales')}
            disabled={isLoading}
          >
            Write Cold Email
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput('What are best practices for LinkedIn outreach?')}
            disabled={isLoading}
          >
            LinkedIn Tips
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput('How do I improve my email open rates?')}
            disabled={isLoading}
          >
            Improve Open Rates
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput('Analyze this lead: VP of Sales at TechCorp, opened 3 emails')}
            disabled={isLoading}
          >
            Analyze Lead
          </Button>
        </div>
      </Card>
    </div>
  );
}
