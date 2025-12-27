# LLM Integration Examples

## Frontend Integration Patterns

### 1. Simple Chat

```jsx
import { dataService } from '../lib/dataService';

async function sendChatMessage(prompt) {
  const response = await dataService.fetch('/api/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ prompt })
  });
  
  return response.content;
}

// Usage
const answer = await sendChatMessage('How do I improve email open rates?');
```

### 2. Chat with History (Context-Aware)

```jsx
const [messages, setMessages] = useState([]);

async function sendMessageWithContext(prompt) {
  const response = await dataService.fetch('/api/ai/chat', {
    method: 'POST',
    body: JSON.stringify({
      prompt,
      history: messages  // Previous conversation
    })
  });
  
  // Update message history
  setMessages([
    ...messages,
    { role: 'user', content: prompt },
    { role: 'assistant', content: response.content }
  ]);
  
  return response;
}
```

### 3. Streaming Responses

```jsx
async function streamAIResponse(prompt, onChunk) {
  const response = await fetch('/api/ai/chat-stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullContent = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return fullContent;
        
        fullContent += data;
        onChunk(data); // Call update function for each chunk
      }
    }
  }
}

// Usage with React
const [response, setResponse] = useState('');

await streamAIResponse('Write an email', (chunk) => {
  setResponse(prev => prev + chunk);
});
```

### 4. Email Generation

```jsx
async function generateEmail(lead, prompt, tone = 'professional') {
  const response = await dataService.fetch('/api/ai/generate-email', {
    method: 'POST',
    body: JSON.stringify({
      prompt,
      tone,
      length: 'medium',
      lead: {
        name: lead.name,
        company: lead.company,
        title: lead.title
      }
    })
  });
  
  return {
    subject: response.subject,
    body: response.body
  };
}

// Usage
const email = await generateEmail(
  { name: 'John', company: 'Acme', title: 'VP Sales' },
  'Schedule a product demo',
  'professional'
);

console.log('Subject:', email.subject);
console.log('Body:', email.body);
```

### 5. Campaign Content Generation

```jsx
async function generateCampaignContent(type, audience, tone) {
  const response = await dataService.fetch('/api/ai/generate-campaign', {
    method: 'POST',
    body: JSON.stringify({
      campaign_type: type,
      target_audience: audience,
      tone,
      additional_context: 'Selling AI-powered sales automation'
    })
  });
  
  return response.content;
}

// Usage
const linkedInPost = await generateCampaignContent(
  'linkedin',
  'CTOs at SaaS companies',
  'professional'
);
```

### 6. Complete AI Chat Component

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { InlineLoader } from '../Loading';
import { useToast } from '../Toast';

export function AIChatBox({ initialContext = '' }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const toast = useToast();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (useStreaming = false) => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      if (useStreaming) {
        setIsStreaming(true);
        // Add placeholder for streaming message
        setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true }]);
        
        const response = await fetch('/api/ai/chat-stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: input,
            history: messages
          })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';

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
                  prev.map((msg, i) => 
                    i === prev.length - 1 
                      ? { ...msg, streaming: false } 
                      : msg
                  )
                );
                setIsStreaming(false);
                setIsLoading(false);
                return;
              }
              fullContent += data;
              setMessages(prev => 
                prev.map((msg, i) => 
                  i === prev.length - 1 
                    ? { ...msg, content: fullContent } 
                    : msg
                )
              );
            }
          }
        }
      } else {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: input,
            history: messages
          })
        });

        const data = await response.json();
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.content,
          suggestions: data.suggestions 
        }]);
      }
    } catch (error) {
      toast.error('Failed to get AI response');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[600px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {initialContext && messages.length === 0 && (
          <div className="text-sm text-gray-500 italic">
            Context: {initialContext}
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.streaming && <span className="animate-pulse">▊</span>}
              {msg.suggestions && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {msg.suggestions.map((s, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded bg-blue-500/20">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && !isStreaming && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <InlineLoader />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <Button onClick={() => sendMessage(false)} disabled={isLoading || !input.trim()}>
            Send
          </Button>
          <Button onClick={() => sendMessage(true)} disabled={isLoading || !input.trim()} variant="outline">
            Stream
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

## Backend Integration Patterns

### 1. Direct LLM Client Usage

```python
from app.core.ai_provider import llm_client

async def my_ai_function():
    messages = [
        {"role": "system", "content": "You are a sales expert"},
        {"role": "user", "content": "Write a cold email"}
    ]
    
    response = await llm_client.chat(messages)
    return response
```

### 2. Custom AI Endpoint

```python
from fastapi import APIRouter
from app.core.ai_provider import llm_client

router = APIRouter()

@router.post("/api/custom/analyze-lead")
async def analyze_lead(lead_data: dict):
    prompt = f"""
    Analyze this lead and provide insights:
    - Name: {lead_data['name']}
    - Title: {lead_data['title']}
    - Company: {lead_data['company']}
    - Activity: {lead_data.get('activity', [])}
    
    Provide: score (0-100), tier (hot/warm/cold), and recommendations.
    """
    
    messages = [
        {"role": "system", "content": "You are a B2B lead analyst"},
        {"role": "user", "content": prompt}
    ]
    
    response = await llm_client.chat(messages)
    
    return {
        "analysis": response,
        "lead": lead_data
    }
```

### 3. Streaming Endpoint

```python
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.core.ai_provider import llm_client

@router.post("/api/custom/stream-analysis")
async def stream_analysis(query: str):
    async def generate():
        messages = [{"role": "user", "content": query}]
        
        result = await llm_client.chat(messages, stream=True)
        
        async for chunk in result:
            yield f"data: {chunk}\n\n"
        
        yield "data: [DONE]\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")
```

### 4. Batch Processing

```python
import asyncio
from app.core.ai_provider import llm_client

async def batch_process_leads(leads: list):
    """Process multiple leads in parallel"""
    
    async def process_one(lead):
        messages = [{
            "role": "user",
            "content": f"Score this lead: {lead['name']} at {lead['company']}"
        }]
        return await llm_client.chat(messages)
    
    # Process up to 5 at a time to avoid rate limits
    results = []
    for i in range(0, len(leads), 5):
        batch = leads[i:i+5]
        batch_results = await asyncio.gather(*[process_one(lead) for lead in batch])
        results.extend(batch_results)
    
    return results
```

### 5. Error Handling and Fallback

```python
from app.core.ai_provider import llm_client, AIProvider
import logging

logger = logging.getLogger(__name__)

async def safe_ai_call(prompt: str, fallback_response: str = None):
    """AI call with automatic fallback"""
    try:
        messages = [{"role": "user", "content": prompt}]
        return await llm_client.chat(messages)
    except Exception as e:
        logger.error(f"AI call failed: {e}")
        
        if fallback_response:
            return fallback_response
        
        # Return template response
        return "I'm currently unavailable. Please try again later."
```

### 6. Caching AI Responses

```python
from app.core.cache import cache
from app.core.ai_provider import llm_client
import hashlib

async def cached_ai_chat(prompt: str, ttl: int = 3600):
    """Cache AI responses to reduce costs"""
    
    # Create cache key from prompt
    cache_key = f"ai:chat:{hashlib.md5(prompt.encode()).hexdigest()}"
    
    # Check cache
    cached = await cache.get(cache_key)
    if cached:
        return cached
    
    # Generate response
    messages = [{"role": "user", "content": prompt}]
    response = await llm_client.chat(messages)
    
    # Cache for 1 hour
    await cache.set(cache_key, response, ttl=ttl)
    
    return response
```

## Common Use Cases

### Email Campaign Optimizer

```jsx
async function optimizeEmailCampaign(emailData) {
  const prompt = `
    Analyze and optimize this email campaign:
    Subject: ${emailData.subject}
    Body: ${emailData.body}
    Target: ${emailData.targetAudience}
    
    Provide: optimized subject line, improved body, best send time
  `;
  
  const response = await dataService.fetch('/api/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ prompt })
  });
  
  return response.content;
}
```

### Lead Qualification Assistant

```jsx
async function qualifyLead(lead) {
  const response = await dataService.fetch('/api/ai/lead-score', {
    method: 'POST',
    body: JSON.stringify({
      name: lead.name,
      title: lead.title,
      company: lead.company,
      industry: lead.industry,
      activity: lead.recentActivity
    })
  });
  
  return {
    score: response.score,
    tier: response.tier,
    rationale: response.rationale,
    nextAction: getNextAction(response.tier)
  };
}

function getNextAction(tier) {
  switch(tier) {
    case 'hot': return 'Schedule call immediately';
    case 'warm': return 'Send personalized email';
    case 'cold': return 'Add to nurture sequence';
    default: return 'Continue monitoring';
  }
}
```

### Multi-Channel Content Generator

```jsx
async function generateMultiChannelContent(campaign) {
  const channels = ['email', 'linkedin', 'sms'];
  
  const contentPromises = channels.map(channel =>
    dataService.fetch('/api/ai/generate-campaign', {
      method: 'POST',
      body: JSON.stringify({
        campaign_type: channel,
        target_audience: campaign.audience,
        tone: campaign.tone,
        additional_context: campaign.description
      })
    })
  );
  
  const results = await Promise.all(contentPromises);
  
  return {
    email: results[0].content,
    linkedin: results[1].content,
    sms: results[2].content
  };
}
```

## Testing

### Mock AI for Tests

```jsx
// In test setup
jest.mock('../lib/dataService', () => ({
  fetch: jest.fn((url) => {
    if (url.includes('/api/ai/chat')) {
      return Promise.resolve({
        role: 'assistant',
        content: 'Mock AI response',
        suggestions: ['Action 1', 'Action 2']
      });
    }
  })
}));

// Test component
test('AI chat works', async () => {
  render(<AIChat />);
  
  fireEvent.change(screen.getByPlaceholderText('Ask me anything'), {
    target: { value: 'Test question' }
  });
  
  fireEvent.click(screen.getByText('Send'));
  
  await waitFor(() => {
    expect(screen.getByText('Mock AI response')).toBeInTheDocument();
  });
});
```

## Performance Tips

1. **Use streaming for long responses** - Better UX
2. **Implement caching** - Reduce API calls and costs
3. **Batch similar requests** - Process multiple items together
4. **Use smaller models** - gpt-4o-mini for simple tasks
5. **Set reasonable timeouts** - Don't wait forever
6. **Implement retry logic** - Handle transient failures
7. **Monitor token usage** - Track costs

## Next Steps

1. Review [LLM_INTEGRATION.md](../backend/LLM_INTEGRATION.md) for full documentation
2. Check [LLM_QUICK_START.md](../LLM_QUICK_START.md) for setup
3. Explore [AIChat.jsx](../src/components/ai/AIChat.jsx) component
4. Test with `python backend/test_llm.py`
5. Monitor usage in provider dashboard
