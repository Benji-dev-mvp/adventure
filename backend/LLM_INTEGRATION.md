# LLM Integration Guide

The Artisan platform now includes comprehensive LLM (Large Language Model) integration supporting multiple AI providers.

## Supported Providers

### 1. OpenAI (GPT Models)
- Models: `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`, `gpt-3.5-turbo`
- Best for: General-purpose AI tasks, fast responses
- Setup:
  ```bash
  AI_PROVIDER=openai
  AI_API_KEY=sk-your-openai-key
  AI_MODEL=gpt-4o-mini
  ```

### 2. Anthropic (Claude Models)
- Models: `claude-3-5-sonnet-20241022`, `claude-3-5-haiku-20241022`, `claude-3-opus-20240229`
- Best for: Long-context tasks, detailed analysis, safety
- Setup:
  ```bash
  AI_PROVIDER=anthropic
  ANTHROPIC_API_KEY=sk-ant-your-key
  AI_MODEL=claude-3-5-sonnet-20241022
  ```

### 3. Azure OpenAI
- Models: Your deployed models (GPT-4, GPT-3.5, etc.)
- Best for: Enterprise compliance, data residency
- Setup:
  ```bash
  AI_PROVIDER=azure
  AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
  AZURE_OPENAI_API_KEY=your-azure-key
  AZURE_OPENAI_DEPLOYMENT=your-deployment-name
  ```

### 4. Mock Provider (Development)
- No API key required
- Returns template responses for testing
- Setup:
  ```bash
  AI_PROVIDER=mock
  ```

## Configuration

### Environment Variables

Edit `backend/.env`:

```bash
# Choose provider: openai, anthropic, azure, mock
AI_PROVIDER=openai

# Model name (provider-specific)
AI_MODEL=gpt-4o-mini

# Generation parameters
AI_TEMPERATURE=0.7        # 0.0 (deterministic) to 2.0 (creative)
AI_MAX_TOKENS=2000        # Max response length

# Provider API keys
AI_API_KEY=your-key-here
ANTHROPIC_API_KEY=your-anthropic-key
AZURE_OPENAI_ENDPOINT=https://your-endpoint
AZURE_OPENAI_API_KEY=your-azure-key
```

### Quick Start

1. **Install dependencies** (already done):
   ```bash
   cd backend
   pip install openai anthropic tiktoken
   ```

2. **Configure your provider**:
   ```bash
   cp .env.example .env
   # Edit .env with your API key
   ```

3. **Test the integration**:
   ```bash
   # Start the backend
   python3 -m uvicorn app.main:app --reload --port 8000
   
   # In another terminal, test the AI endpoint
   curl -X POST http://localhost:8000/api/ai/chat \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Help me write a cold email to a VP of Sales"}'
   ```

## API Endpoints

### Chat with AI Assistant

**Endpoint**: `POST /api/ai/chat`

**Request**:
```json
{
  "prompt": "Help me optimize this campaign",
  "history": [
    {"role": "user", "content": "What's the best time to send emails?"},
    {"role": "assistant", "content": "Tuesday-Thursday, 10am-2pm typically work best..."}
  ]
}
```

**Response**:
```json
{
  "role": "assistant",
  "content": "To optimize your campaign, focus on...",
  "suggestions": ["Apply guardrail", "Schedule optimal window", "Tune subject lines"]
}
```

### Streaming Chat

**Endpoint**: `POST /api/ai/chat-stream`

Returns Server-Sent Events (SSE) for real-time streaming.

**Frontend Example**:
```javascript
const eventSource = new EventSource('/api/ai/chat-stream', {
  method: 'POST',
  body: JSON.stringify({ prompt: 'Help me...' })
});

eventSource.onmessage = (event) => {
  if (event.data === '[DONE]') {
    eventSource.close();
  } else {
    console.log('Chunk:', event.data);
  }
};
```

### Generate Email

**Endpoint**: `POST /api/ai/generate-email`

**Request**:
```json
{
  "prompt": "Schedule a product demo",
  "tone": "professional",
  "length": "medium",
  "lead": {
    "name": "John Smith",
    "company": "Acme Corp",
    "title": "VP of Sales"
  }
}
```

**Response**:
```json
{
  "subject": "Quick question for Acme Corp",
  "body": "Hi John,\n\nI wanted to reach out about...",
  "tone": "professional",
  "length": "medium"
}
```

### Generate Campaign Content

**Endpoint**: `POST /api/ai/generate-campaign`

**Request**:
```json
{
  "campaign_type": "email",
  "target_audience": "VP of Sales at SaaS companies",
  "tone": "professional",
  "additional_context": "Selling sales automation platform"
}
```

**Response**:
```json
{
  "content": "Subject: Transform Your Sales Process...\n\nHi {{firstName}}...",
  "campaign_type": "email",
  "tone": "professional"
}
```

### Lead Scoring

**Endpoint**: `POST /api/ai/lead-score`

**Request**:
```json
{
  "name": "Jane Doe",
  "title": "VP of Marketing",
  "company": "TechCorp",
  "industry": "SaaS",
  "activity": [
    {"type": "email_opened", "timestamp": "2024-01-15"},
    {"type": "link_clicked", "timestamp": "2024-01-16"}
  ]
}
```

**Response**:
```json
{
  "score": 85,
  "tier": "warm",
  "rationale": "senior title, aligned industry"
}
```

### AI Status

**Endpoint**: `GET /api/ai/status`

Returns current provider configuration and capabilities.

**Response**:
```json
{
  "provider": "openai",
  "model": "gpt-4o-mini",
  "available": true,
  "capabilities": [
    "chat",
    "email_generation",
    "lead_scoring",
    "streaming",
    "campaign_generation",
    "conversation_history"
  ]
}
```

## Frontend Integration

### Using the AI Assistant

```jsx
import { dataService } from '../lib/dataService';

// Simple chat
const response = await dataService.fetch('/api/ai/chat', {
  method: 'POST',
  body: JSON.stringify({
    prompt: 'Help me write a cold email'
  })
});

// Chat with history
const responseWithHistory = await dataService.fetch('/api/ai/chat', {
  method: 'POST',
  body: JSON.stringify({
    prompt: 'Make it more casual',
    history: [
      { role: 'user', content: 'Help me write a cold email' },
      { role: 'assistant', content: 'Here\'s a professional template...' }
    ]
  })
});
```

### Streaming Chat

```jsx
const [messages, setMessages] = useState([]);
const [isStreaming, setIsStreaming] = useState(false);

const streamChat = async (prompt) => {
  setIsStreaming(true);
  let fullContent = '';
  
  try {
    const response = await fetch('/api/ai/chat-stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            setIsStreaming(false);
            return fullContent;
          }
          fullContent += data;
          setMessages(prev => [...prev.slice(0, -1), {
            role: 'assistant',
            content: fullContent
          }]);
        }
      }
    }
  } catch (error) {
    console.error('Streaming error:', error);
    setIsStreaming(false);
  }
};
```

## Use Cases

### 1. Email Generation
Generate personalized outbound emails with AI:
```python
from app.core.ai_provider import draft_email

email = draft_email(
    lead={"name": "John", "company": "Acme"},
    prompt="Schedule a product demo",
    tone="professional"
)
# Returns: {"subject": "...", "body": "..."}
```

### 2. Campaign Content Creation
Generate multi-channel campaign content:
```python
from app.core.ai_provider import generate_campaign_content

campaign = await generate_campaign_content(
    campaign_type="linkedin",
    target_audience="CTOs at Series A startups",
    tone="casual",
    additional_context="AI-powered sales automation"
)
```

### 3. Lead Analysis
Score and prioritize leads:
```python
from app.core.ai_provider import simple_lead_score

score = simple_lead_score({
    "title": "VP of Sales",
    "industry": "SaaS",
    "activity": [{"type": "email_opened"}]
})
# Returns: {"score": 85, "tier": "warm", "rationale": "..."}
```

### 4. Conversational AI Assistant
Build Ava (AI assistant) conversations:
```python
from app.core.ai_provider import chat_with_history

response = await chat_with_history([
    {"role": "system", "content": "You are Ava, a B2B sales AI assistant"},
    {"role": "user", "content": "What's the best time to send cold emails?"}
])
```

## Cost Optimization

### Token Usage
- Use `gpt-4o-mini` for most tasks (cheaper)
- Reserve `gpt-4o` for complex analysis
- Claude Haiku for cost-effective operations
- Claude Opus for detailed work

### Caching
Implement response caching for repeated queries:
```python
from app.core.cache import cache

cache_key = f"ai:email:{lead_id}:{prompt_hash}"
cached = await cache.get(cache_key)
if cached:
    return cached

result = await llm_client.chat(messages)
await cache.set(cache_key, result, ttl=3600)  # 1 hour
```

### Rate Limiting
Provider rate limits:
- OpenAI: Tier-based (see dashboard)
- Anthropic: 50 requests/minute (standard)
- Azure: Based on your quota

## Error Handling

The system automatically falls back to mock responses if:
- API key is missing
- Provider is unavailable
- Rate limit is exceeded
- Network errors occur

Example with custom error handling:
```python
from app.core.ai_provider import llm_client, AIProvider

try:
    response = await llm_client.chat(messages)
except Exception as e:
    logger.error(f"LLM error: {e}")
    # Fallback to template
    response = "I'm currently unavailable. Please try again."
```

## Testing

### Unit Tests
```python
import pytest
from app.core.ai_provider import llm_client, AIProvider

@pytest.mark.asyncio
async def test_chat():
    # Uses mock provider in tests
    response = await llm_client.chat([
        {"role": "user", "content": "Hello"}
    ])
    assert isinstance(response, str)
```

### Integration Tests
```bash
# Test with real API (requires API key)
export AI_PROVIDER=openai
export AI_API_KEY=sk-...
pytest tests/test_ai_integration.py
```

## Monitoring

### Logging
All LLM calls are logged with:
- Provider and model used
- Token usage (when available)
- Response time
- Error details

### Metrics
Track LLM usage:
```python
from prometheus_client import Counter, Histogram

llm_requests = Counter('llm_requests_total', 'LLM API requests', ['provider', 'status'])
llm_latency = Histogram('llm_request_duration_seconds', 'LLM request latency')
```

## Best Practices

1. **Use appropriate models**:
   - Development: `mock` provider
   - Production: `gpt-4o-mini` for most tasks
   - Complex tasks: `gpt-4o` or Claude Opus

2. **Set reasonable limits**:
   ```bash
   AI_TEMPERATURE=0.7    # Balance creativity/consistency
   AI_MAX_TOKENS=2000    # Prevent runaway costs
   ```

3. **Implement caching**: Cache AI-generated content for repeated queries

4. **Monitor costs**: Track token usage and set budget alerts

5. **Graceful degradation**: Always have fallback templates

6. **User privacy**: Never send PII to LLM without explicit consent

## Troubleshooting

### Issue: "Missing AI_API_KEY"
- Solution: Set `AI_API_KEY` in `backend/.env`

### Issue: Rate limit errors
- Solution: Implement exponential backoff or upgrade API tier

### Issue: Slow responses
- Solution: Use streaming endpoints or smaller models

### Issue: Poor quality outputs
- Solution: Adjust temperature, improve prompts, or upgrade model

## Security Considerations

1. **API Key Management**:
   - Never commit API keys to git
   - Use environment variables
   - Rotate keys regularly

2. **Input Sanitization**:
   ```python
   from app.core.security import sanitize_text
   prompt = sanitize_text(user_input)
   ```

3. **Output Validation**:
   - Validate AI responses before using
   - Implement content filters
   - Log suspicious outputs

4. **Rate Limiting**:
   - Implement per-user rate limits
   - Monitor for abuse
   - Set cost budgets

## Resources

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Anthropic API Docs](https://docs.anthropic.com)
- [Azure OpenAI Docs](https://learn.microsoft.com/azure/ai-services/openai/)
- [Best Practices Guide](https://platform.openai.com/docs/guides/production-best-practices)

## Support

For issues or questions:
1. Check logs: `tail -f backend/logs/app.log`
2. Test with mock provider: `AI_PROVIDER=mock`
3. Review API status: `GET /api/ai/status`
4. Check provider status pages
