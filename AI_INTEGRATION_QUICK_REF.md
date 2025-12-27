# Advanced AI Integration - Quick Reference

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Start External Services
```bash
# Qdrant (vector database)
docker run -d -p 6333:6333 qdrant/qdrant:latest

# Redis (already running)
docker run -d -p 6379:6379 redis:alpine
```

### 3. Configure Environment
```env
# backend/.env
OPENAI_API_KEY=your_key_here
AI_PROVIDER=openai
AI_MODEL=gpt-4
MEM0_HOSTED=false
```

### 4. Start Backend
```bash
cd backend
python3 -m uvicorn app.main:app --reload --port 8000
```

---

## 📦 What Was Added

### New Files (7 core modules)
1. **backend/app/integrations/__init__.py** - Integration package
2. **backend/app/integrations/langchain_agent.py** (350 lines) - Agent orchestration
3. **backend/app/integrations/pydantic_agent.py** (500 lines) - Type-safe agents
4. **backend/app/integrations/mem0_memory.py** (450 lines) - Persistent memory
5. **backend/app/integrations/llamaindex_rag.py** (550 lines) - RAG system
6. **backend/app/core/ai_orchestrator.py** (500 lines) - Unified orchestrator
7. **backend/app/api/routes/ai_advanced.py** (400 lines) - API endpoints

### Updated Files
- **backend/requirements.txt** - Added 13 dependencies
- **backend/app/main.py** - Registered ai_advanced_router

### Documentation
- **ADVANCED_AI_INTEGRATIONS.md** (comprehensive guide)
- **AI_INTEGRATION_QUICK_REF.md** (this file)

---

## 🎯 Key Features

### 1. Intelligent Lead Scoring
```python
# Endpoint: POST /api/ai-advanced/lead/score
# Uses: Mem0 (past interactions) + LlamaIndex (similar leads) + Pydantic AI (type-safe scoring)
```

### 2. Personalized Email Generation
```python
# Endpoint: POST /api/ai-advanced/email/generate
# Uses: Mem0 (preferences + interactions) + LlamaIndex (successful patterns) + Pydantic AI (validation)
```

### 3. Campaign Strategy Planning
```python
# Endpoint: POST /api/ai-advanced/campaign/strategy
# Uses: Mem0 (past learnings) + LlamaIndex (historical data) + LangChain (tactical recs) + Pydantic AI (type-safe)
```

### 4. Conversational AI Assistant
```python
# Endpoint: POST /api/ai-advanced/conversation
# Uses: Mem0 (context recall) + LlamaIndex (KB search) + LangChain (agent tools)
```

### 5. Memory Management
```python
# Endpoints: POST /memory/add, POST /memory/search, GET /memory/all, DELETE /memory/{id}
# Uses: Mem0 with user-partitioned semantic search
```

### 6. RAG Document Search
```python
# Endpoints: POST /rag/ingest, POST /rag/query, POST /rag/chat
# Uses: LlamaIndex with vector embeddings
```

---

## 🔌 API Examples

### Lead Scoring
```bash
curl -X POST http://localhost:8000/api/ai-advanced/lead/score \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{
    "lead_data": {
      "name": "John Smith",
      "company": "TechCorp",
      "industry": "SaaS",
      "title": "VP of Sales"
    }
  }'
```

### Email Generation
```bash
curl -X POST http://localhost:8000/api/ai-advanced/email/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{
    "lead_data": {
      "name": "John Smith",
      "company": "TechCorp"
    },
    "campaign_objective": "Book demo meeting",
    "tone": "professional"
  }'
```

### Conversation
```bash
curl -X POST http://localhost:8000/api/ai-advanced/conversation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{
    "message": "What are best practices for SaaS sales?"
  }'
```

### Memory Search
```bash
curl -X POST http://localhost:8000/api/ai-advanced/memory/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{
    "query": "lead interactions",
    "limit": 10
  }'
```

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│              Frontend (React)                            │
│  - Lead Scorer Component                                │
│  - Email Generator Component                            │
│  - AI Assistant Chat                                    │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP POST /api/ai-advanced/*
┌──────────────────▼──────────────────────────────────────┐
│         API Routes (ai_advanced.py)                      │
│  - /lead/score                                          │
│  - /email/generate                                      │
│  - /campaign/strategy                                   │
│  - /conversation                                        │
│  - /memory/* (add, search, get, delete)                │
│  - /rag/* (ingest, query, chat)                        │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│      Unified AI Orchestrator                             │
│  - intelligent_lead_scoring()                           │
│  - personalized_email_generation()                      │
│  - strategic_campaign_planning()                        │
│  - conversational_assistance()                          │
└────┬────────┬────────┬────────┬─────────────────────────┘
     │        │        │        │
┌────▼───┐ ┌─▼──────┐ ┌▼─────┐ ┌▼──────────┐
│LangChain│ │Pydantic│ │Mem0  │ │LlamaIndex │
│Agent    │ │AI      │ │Memory│ │RAG        │
│Tools    │ │Type-   │ │Layer │ │Vector DB  │
│         │ │Safe    │ │      │ │           │
└─────────┘ └────────┘ └──────┘ └───────────┘
```

---

## 🧩 Framework Responsibilities

| Framework | Purpose | When to Use |
|-----------|---------|-------------|
| **LangChain** | Agent orchestration, tool execution, chains | Complex multi-step workflows, tool calling |
| **Pydantic AI** | Type-safe outputs, validation | When you need guaranteed structure/types |
| **Mem0** | Persistent memory, context recall | Storing/retrieving user history, preferences |
| **LlamaIndex** | RAG, document search, semantic search | Finding similar data, searching knowledge base |

---

## 💡 Common Patterns

### Pattern 1: Context-Aware Operation
```python
# 1. Recall relevant context (Mem0)
context = await memory.get_context_for_conversation(user_id, topic)

# 2. Execute with context (LangChain/Pydantic AI)
result = await agent.execute_with_context(query, context)

# 3. Remember result (Mem0)
await memory.add_memory(result, user_id=user_id)
```

### Pattern 2: Type-Safe Workflow
```python
# 1. Define output schema (Pydantic)
class Output(BaseModel):
    field1: str
    field2: int

# 2. Generate with validation (Pydantic AI)
result: Output = await agent.generate(prompt, result_type=Output)

# 3. Use with confidence (type-safe)
print(result.field1)  # Guaranteed to be string
```

### Pattern 3: RAG-Enhanced Generation
```python
# 1. Ingest documents (LlamaIndex)
await rag.ingest_documents(documents, index_name="kb")

# 2. Retrieve relevant context (LlamaIndex)
context = await rag.query(query, index_name="kb")

# 3. Generate with context (LangChain/Pydantic AI)
result = await agent.generate(f"Using context: {context}, answer: {query}")
```

---

## 🔧 Troubleshooting

### Issue: "Module not found: langchain"
```bash
pip install langchain langchain-openai langchain-anthropic langchain-community
```

### Issue: "Qdrant connection refused"
```bash
docker ps | grep qdrant
docker start <container_id>
# or
docker run -d -p 6333:6333 qdrant/qdrant:latest
```

### Issue: "OpenAI API key not found"
```bash
# Check .env
cat backend/.env | grep OPENAI

# Set manually
export OPENAI_API_KEY=sk-...
```

### Issue: "No memories found"
```python
# Verify memories exist
memories = await orchestrator.memory.get_all_memories(user_id="user_123")
print(len(memories))
```

### Issue: "High latency"
- Use smaller/faster models (gpt-3.5-turbo instead of gpt-4)
- Enable response caching
- Use batch processing for multiple operations
- Consider async/parallel execution

---

## 📈 Performance Tips

### 1. Cache LLM Responses
```python
from functools import lru_cache

@lru_cache(maxsize=1000)
def cached_llm_call(prompt: str):
    return llm.generate(prompt)
```

### 2. Batch Processing
```python
# Instead of:
for lead in leads:
    score = await score_lead(lead)

# Do:
scores = await batch_score_leads(leads)
```

### 3. Async Operations
```python
import asyncio

# Execute in parallel
results = await asyncio.gather(
    orchestrator.score_lead(lead1),
    orchestrator.score_lead(lead2),
    orchestrator.score_lead(lead3),
)
```

### 4. Pre-load Indices
```python
@app.on_event("startup")
async def preload():
    await rag.ingest_lead_database(all_leads)
    await rag.ingest_campaign_results(all_campaigns)
```

---

## 🎓 Learning Path

### Week 1: Setup & Basics
- [ ] Install dependencies
- [ ] Configure environment
- [ ] Test `/status` endpoint
- [ ] Run example scripts in integration files

### Week 2: Core Features
- [ ] Implement lead scoring in frontend
- [ ] Add memory management
- [ ] Test RAG document search
- [ ] Build simple AI chat component

### Week 3: Advanced Workflows
- [ ] Create campaign strategy planner
- [ ] Implement batch lead analysis
- [ ] Add contextual email generation
- [ ] Build comprehensive AI assistant

### Week 4: Production
- [ ] Add error handling
- [ ] Implement caching
- [ ] Set up monitoring
- [ ] Load testing
- [ ] Deploy to production

---

## 📚 Documentation Links

- **Full Guide**: [ADVANCED_AI_INTEGRATIONS.md](./ADVANCED_AI_INTEGRATIONS.md)
- **LangChain Docs**: https://python.langchain.com/docs/
- **Pydantic AI Docs**: https://ai.pydantic.dev/
- **Mem0 Docs**: https://docs.mem0.ai/
- **LlamaIndex Docs**: https://docs.llamaindex.ai/
- **API Docs**: http://localhost:8000/docs (Swagger UI)

---

## ✅ Deployment Checklist

- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Start Qdrant: `docker run -d -p 6333:6333 qdrant/qdrant:latest`
- [ ] Start Redis: `docker run -d -p 6379:6379 redis:alpine`
- [ ] Configure `.env`: `OPENAI_API_KEY`, `AI_PROVIDER`, etc.
- [ ] Test backend: `uvicorn app.main:app --reload --port 8000`
- [ ] Test endpoints: http://localhost:8000/docs
- [ ] Verify status: GET `/api/ai-advanced/status`
- [ ] Test lead scoring: POST `/api/ai-advanced/lead/score`
- [ ] Test conversation: POST `/api/ai-advanced/conversation`
- [ ] Monitor logs for errors
- [ ] Set up Sentry for error tracking
- [ ] Configure rate limiting
- [ ] Load test high-volume scenarios

---

## 🆘 Support

**Issues?** Check:
1. This quick reference for common problems
2. [ADVANCED_AI_INTEGRATIONS.md](./ADVANCED_AI_INTEGRATIONS.md) for detailed guide
3. Framework-specific documentation
4. GitHub issues for each framework

**Questions?** Review:
- Example usage in each integration file
- API endpoint documentation in Swagger UI
- Frontend integration examples in main guide

---

**Status**: ✅ Production-Ready  
**Version**: 1.0.0  
**Last Updated**: December 2025
