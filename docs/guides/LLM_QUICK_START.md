# LLM Integration - Quick Reference

## ✅ What Was Added

### Backend
- **Multi-provider LLM support**: OpenAI, Anthropic (Claude), Azure OpenAI, Mock
- **Unified LLM client** with automatic fallback
- **Streaming support** for real-time AI responses
- **Tailored AI prompts** with 5 personalities and 10 templates
- **Domain-specific context injection** for B2B sales
- **Enhanced AI endpoints**:
  - `/api/ai/chat` - Basic chat with conversation history + personalities
  - `/api/ai/chat-stream` - Streaming responses (SSE)
  - `/api/ai/generate-campaign` - Campaign content generation
  - `/api/ai/generate-email` - AI-powered email drafting
  - `/api/ai/generate-from-template` - Template-based generation (NEW)
  - `/api/ai/templates` - List available templates and personalities (NEW)
  - `/api/ai/lead-score` - Lead scoring
  - `/api/ai/status` - Provider status and capabilities

### Frontend
- **AIChat component** - Full-featured AI chat interface
- **Streaming support** - Real-time response rendering
- **Provider status display** - Shows current AI configuration
- **Quick actions** - Pre-built prompts for common tasks

### Configuration
- **Environment variables** for all providers
- **Temperature and token controls**
- **Flexible model selection**
- **.env.example** with all LLM settings

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
pip install openai anthropic tiktoken
```
✅ Already installed!

### 2. Configure Provider

**Option A: OpenAI (Recommended for most use cases)**
```bash
# Edit backend/.env
AI_PROVIDER=openai
AI_API_KEY=sk-your-openai-key-here
AI_MODEL=gpt-4o-mini
```

**Option B: Anthropic Claude**
```bash
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-your-key-here
AI_MODEL=claude-3-5-sonnet-20241022
```

**Option C: Development (No API key needed)**
```bash
AI_PROVIDER=mock
```

### 3. Test It
```bash
# Terminal 1: Start backend
cd backend
python3 -m uvicorn app.main:app --reload --port 8000

# Terminal 2: Test LLM
cd backend
python test_llm.py
```

### 4. Use in Frontend
```jsx
import { AIChat } from '../components/ai/AIChat';

function MyPage() {
  return <AIChat />;
}
```

## 📋 API Examples

### Chat Request
```bash
curl -X POST http://localhost:8000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Help me write a cold email"}'
```

### Generate Email
```bash
curl -X POST http://localhost:8000/api/ai/generate-email \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Schedule a demo",
    "tone": "professional",
    "lead": {
      "name": "John",
      "company": "Acme"
    }
  }'
```

### Check Status
```bash
curl http://localhost:8000/api/ai/status
```

## 🎯 Use Cases

1. **Email Generation** - AI-powered personalized emails
2. **Campaign Content** - Multi-channel campaign creation
3. **Lead Scoring** - Intelligent lead prioritization
4. **Chat Assistant** - Ava AI assistant for sales guidance
5. **Content Optimization** - Subject line and copy improvement
6. **Template-Based Generation** - Use pre-built prompts for consistency (NEW)
7. **Personality Selection** - Choose AI tone (professional, casual, analyst, etc.) (NEW)

## 🎨 NEW: AI Personalities & Templates

### 5 AI Personalities

Choose how Ava responds:
- **`ava_professional`** - Default B2B sales expert
- **`ava_casual`** - Friendly, conversational
- **`analyst`** - Data-driven, metrics-focused
- **`copywriter`** - Creative, persuasive
- **`coach`** - Teaching-focused guidance

### 10 Ready-to-Use Templates

- `email_cold_outreach` - Personalized cold emails
- `email_follow_up` - Strategic follow-ups  
- `linkedin_message` - LinkedIn outreach
- `lead_analysis` - Lead scoring & qualification
- `campaign_strategy` - Multi-channel campaigns
- `objection_handling` - Sales objection responses
- `meeting_prep` - Pre-meeting preparation
- `email_subject_line` - A/B testable subject lines
- `call_script` - Call scripts
- `sms_message` - SMS outreach

**Quick Example:**
```bash
curl -X POST http://localhost:8000/api/ai/generate-from-template \
  -H "Content-Type: application/json" \
  -d '{
    "template": "email_cold_outreach",
    "context": {
      "lead_name": "Sarah",
      "company": "TechCorp",
      "pain_point": "manual outreach"
    }
  }'
```

## 📦 Files Added/Modified

### New Files
- `backend/app/core/ai_provider.py` - Enhanced LLM client
- `backend/app/core/ai_prompts.py` - Tailored prompts & templates (NEW)
- `backend/.env.example` - Configuration template
- `backend/LLM_INTEGRATION.md` - Full documentation
- `backend/TAILORED_LLM_GUIDE.md` - Personality & template guide (NEW)
- `backend/test_llm.py` - Test script
- `backend/test_tailored_llm.py` - Template test script (NEW)
- `src/components/ai/AIChat.jsx` - Chat component

### Modified Files
- `backend/requirements.txt` - Added openai, anthropic, tiktoken
- `backend/app/core/config.py` - Added AI configuration
- `backend/app/api/routes/ai.py` - Enhanced AI endpoints

## 🔧 Configuration Options

```bash
# Provider Selection
AI_PROVIDER=openai|anthropic|azure|mock

# Model Selection
AI_MODEL=gpt-4o-mini              # OpenAI (cheap, fast)
AI_MODEL=gpt-4o                   # OpenAI (powerful)
AI_MODEL=claude-3-5-sonnet-20241022  # Anthropic (best quality)
AI_MODEL=claude-3-5-haiku-20241022   # Anthropic (cheap, fast)

# Generation Parameters
AI_TEMPERATURE=0.7    # 0.0=deterministic, 2.0=creative
AI_MAX_TOKENS=2000    # Max response length

# API Keys
AI_API_KEY=sk-...                 # OpenAI
ANTHROPIC_API_KEY=sk-ant-...      # Anthropic
AZURE_OPENAI_ENDPOINT=https://...  # Azure
AZURE_OPENAI_API_KEY=...          # Azure
```

## 💰 Cost Comparison

### Per 1M tokens (approximate)
- **OpenAI GPT-4o-mini**: $0.15 input / $0.60 output
- **OpenAI GPT-4o**: $2.50 input / $10.00 output
- **Claude Haiku**: $0.25 input / $1.25 output
- **Claude Sonnet**: $3.00 input / $15.00 output
- **Mock**: Free (no API calls)

**Recommendation**: Start with `gpt-4o-mini` or mock for development.

## 🛡️ Security

- ✅ API keys stored in environment variables
- ✅ Never committed to git (.env in .gitignore)
- ✅ Input sanitization on all user inputs
- ✅ Automatic fallback to mock on errors
- ✅ Rate limiting ready
- ✅ Logging for all LLM calls

## 📚 Documentation

- **Full Guide**: [backend/LLM_INTEGRATION.md](backend/LLM_INTEGRATION.md)
- **Tailored Prompts**: [backend/TAILORED_LLM_GUIDE.md](backend/TAILORED_LLM_GUIDE.md) ⭐ NEW
- **Code Examples**: [LLM_EXAMPLES.md](LLM_EXAMPLES.md)
- **OpenAI Docs**: https://platform.openai.com/docs
- **Anthropic Docs**: https://docs.anthropic.com
- **Azure OpenAI**: https://learn.microsoft.com/azure/ai-services/openai/

## 🐛 Troubleshooting

**"Missing AI_API_KEY"**
→ Set `AI_API_KEY` in `backend/.env`

**"Provider not available"**
→ System automatically falls back to mock mode

**Slow responses**
→ Use streaming: `/api/ai/chat-stream`

**High costs**
→ Use `gpt-4o-mini` or implement caching

## ✨ Next Steps

1. **Get an API key**: Sign up at OpenAI or Anthropic
2. **Configure .env**: Add your key to `backend/.env`
3. **Test integration**: Run `python backend/test_llm.py`
4. **Test templates**: Run `python backend/test_tailored_llm.py` ⭐ NEW
5. **Explore personalities**: Try different AI personalities for your use case
6. **Start using**: Import `AIChat` component in your pages
7. **Monitor usage**: Track costs in provider dashboard

---

**Ready to use!** The system works in mock mode by default, no API key required for testing.

**New in this version:** 
- 🎨 5 AI personalities (professional, casual, analyst, copywriter, coach)
- 📝 10 pre-built templates for common sales tasks
- 🎯 Domain-specific prompts tailored for B2B sales
- 🔧 Automatic context injection with platform data
