
# AI Architecture - Quick Integration Guide

## 🚀 Getting Started (5 Minutes)

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Add to backend/.env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
QDRANT_HOST=localhost
QDRANT_PORT=6333
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3. Start Dependencies (Docker)

```bash
# Qdrant (Vector DB)
docker run -p 6333:6333 qdrant/qdrant

# Redis (Caching + Memory)
docker run -p 6379:6379 redis:latest
```

---

## 📖 Common Use Cases

### Use Case 1: Score a Lead

```python
from app.core.ai_orchestrator import UnifiedAIOrchestrator
from app.integrations.pydantic_agent import SalesContext, LeadScore

async def score_lead(lead_data: dict, user_id: str, org_id: str):
    """Score a lead with unified orchestration"""
    
    # Create sales context
    context = SalesContext(
        user_id=user_id,
        org_id=org_id,
        session_id=f"score_{lead_data['lead_id']}"
    )
    
    # Get orchestrator
    orchestrator = UnifiedAIOrchestrator()
    
    # Score lead with type-safe orchestration
    result = await orchestrator.score_lead(
        lead_data=lead_data,
        context=context,
    )
    
    # Result includes score, confidence, factors, recommendation
    return result

# Usage in FastAPI endpoint
@router.post("/leads/{lead_id}/score")
async def api_score_lead(
    lead_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    lead = session.get(Lead, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    result = await score_lead(
        lead_data={
            "lead_id": str(lead.id),
            "company_name": lead.name,
            "industry": getattr(lead, 'industry', 'Unknown'),
            "size": getattr(lead, 'company_size', 'Unknown'),
            "engagement": getattr(lead, 'status', ''),
            "signals": "",
        },
        user_id=str(current_user.id),
        org_id=getattr(current_user, 'org_id', 'default_org'),
    )
    
    return result
```

---

### Use Case 2: Generate Email with Memory

```python
from app.core.ai_orchestrator import UnifiedAIOrchestrator
from app.integrations.pydantic_agent import SalesContext, EmailGeneration
from app.integrations.mem0_memory import Mem0MemoryManager

async def generate_email_with_context(
    lead_id: str,
    recipient_name: str,
    company_name: str,
    user_id: str,
    org_id: str,
):
    """Generate personalized email using memory context"""
    
    # 1. Retrieve relevant memories about this lead
    memory_manager = Mem0MemoryManager()
    
    memories = await memory_manager.search_memories(
        user_id=user_id,
        query=f"interactions with {company_name}",
        limit=3,
    )
    
    # 2. Build context from memories
    memory_context = "\n".join([
        f"- {m.get('memory', '')}" for m in memories
    ])
    
    # 3. Generate email with orchestrator
    context = SalesContext(
        user_id=user_id,
        org_id=org_id,
        session_id=lead_id,
    )
    
    orchestrator = UnifiedAIOrchestrator()
    
    result = await orchestrator.generate_email(
        lead_data={
            "recipient_name": recipient_name,
            "company_name": company_name,
            "job_title": "VP Sales",
            "context": f"Previous interactions:\n{memory_context}",
        },
        campaign_objective="Schedule demo",
        tone="professional",
        context=context,
    )
    
    # 4. Store the generated email as a memory
    await memory_manager.add_memory(
        user_id=user_id,
        memory=f"Generated email to {recipient_name} at {company_name}",
        metadata={
            "lead_id": lead_id,
            "type": "email_generation",
            "company": company_name,
        }
    )
    
    return result
```

---

### Use Case 3: Chat with Memory + RAG

```python
from app.core.ai_orchestrator import UnifiedAIOrchestrator
from app.integrations.pydantic_agent import SalesContext
from app.integrations.llamaindex_rag import LlamaIndexRAG

async def chat_with_ava(
    message: str,
    session_id: str,
    user_id: str,
    org_id: str,
):
    """Chat with AI assistant (Ava) using memory and RAG"""
    
    # 1. Retrieve relevant documents from RAG (if RAG is set up)
    rag_context = ""
    try:
        rag_manager = LlamaIndexRAG()
        rag_results = await rag_manager.search(
            query=message,
            limit=3,
        )
        rag_context = "\n\n".join([
            f"[Context {i+1}]\n{r['text']}"
            for i, r in enumerate(rag_results)
        ])
    except Exception as e:
        # RAG optional, continue without it
        pass
    
    # 2. Create context
    context = SalesContext(
        user_id=user_id,
        org_id=org_id,
        session_id=session_id,
    )
    
    # 3. Chat with orchestrator (memory automatically managed)
    orchestrator = UnifiedAIOrchestrator()
    
    # For streaming response (if supported)
    result = await orchestrator.chat(
        message=message,
        context=context,
        additional_context=rag_context,
    )
    
    return result
```

---

### Use Case 4: Ingest Documents into RAG

```python
from app.integrations.llamaindex_rag import LlamaIndexRAG
from datetime import datetime

async def ingest_case_study(
    title: str,
    content: str,
    org_id: str,
    tags: list[str],
    industry: str,
):
    """Ingest a case study into RAG for future retrieval"""
    
    # 1. Create RAG manager
    rag_manager = LlamaIndexRAG()
    
    # 2. Add document with metadata
    document_id = await rag_manager.add_document(
        text=content,
        metadata={
            "title": title,
            "org_id": org_id,
            "tags": tags,
            "industry": industry,
            "type": "case_study",
            "ingested_at": datetime.utcnow().isoformat(),
        }
    )
    
    return {"document_id": document_id, "status": "ingested"}
```

---

## 🔧 Configuration

### Initializing the Orchestrator

The `UnifiedAIOrchestrator` can be configured on initialization:

```python
from app.core.ai_orchestrator import UnifiedAIOrchestrator

# OpenAI (default)
orchestrator = UnifiedAIOrchestrator(
    model_provider="openai",
    model_name="gpt-4",
    temperature=0.7,
    use_hosted_mem0=False,  # Use local Qdrant for memory
)

# Anthropic Claude
orchestrator = UnifiedAIOrchestrator(
    model_provider="anthropic",
    model_name="claude-3-5-sonnet-20241022",
    temperature=0.8,
    use_hosted_mem0=True,  # Use Mem0 hosted service
)
```

### Environment Variables

Configure in `backend/.env`:

```bash
# OpenAI
OPENAI_API_KEY=sk-your-key-here

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Mem0 (if using hosted)
MEM0_API_KEY=your-mem0-key

# Qdrant (for local memory)
QDRANT_HOST=localhost
QDRANT_PORT=6333

# LlamaIndex (optional)
LLAMA_CLOUD_API_KEY=your-llamaindex-key
```

---

## 🧪 Testing

### Unit Test Example

```python
import pytest
from app.core.ai_orchestrator import UnifiedAIOrchestrator
from app.integrations.pydantic_agent import SalesContext

@pytest.mark.asyncio
async def test_lead_scoring():
    """Test lead scoring with orchestrator"""
    
    orchestrator = UnifiedAIOrchestrator(
        model_provider="openai",
        model_name="gpt-4o-mini",
        temperature=0.3,
    )
    
    context = SalesContext(
        user_id="test_user",
        org_id="test_org",
        session_id="test_session",
    )
    
    result = await orchestrator.score_lead(
        lead_data={
            "company_name": "Test Corp",
            "industry": "Technology",
            "company_size": "500",
            "engagement": "High engagement",
            "signals": "Budget approved",
        },
        context=context,
    )
    
    assert result is not None
    assert "score" in result or hasattr(result, 'score')
```

---

## 🐛 Debugging

### Check Orchestrator Status

```python
from app.core.ai_orchestrator import UnifiedAIOrchestrator

orchestrator = UnifiedAIOrchestrator()

# Check configuration
print(f"Provider: {orchestrator.model_provider}")
print(f"Model: {orchestrator.model_name}")
print(f"Temperature: {orchestrator.temperature}")
print(f"Mem0 enabled: {orchestrator.memory_manager is not None}")
print(f"RAG enabled: {orchestrator.rag_manager is not None}")
```

### View Memories

```python
from app.integrations.mem0_memory import Mem0MemoryManager

memory_manager = Mem0MemoryManager()

# Get all memories for a user
memories = await memory_manager.get_all_memories(
    user_id="user_123",
)

for memory in memories:
    print(f"Memory: {memory.get('memory', '')}")
    print(f"Created: {memory.get('created_at', '')}")
    print("---")

# Search memories
results = await memory_manager.search_memories(
    user_id="user_123",
    query="recent interactions",
    limit=5,
)
```

### Test RAG Search

```python
from app.integrations.llamaindex_rag import LlamaIndexRAG

rag_manager = LlamaIndexRAG()

# Search for documents
results = await rag_manager.search(
    query="enterprise features",
    limit=3,
)

for i, result in enumerate(results):
    print(f"Result {i+1}: {result['text'][:200]}...")
    print(f"Score: {result.get('score', 'N/A')}")
    print("---")
```

---

## 🚨 Common Issues

### Issue: "API key not configured"

**Cause:** Missing environment variables

**Solution:**
```bash
# Add to backend/.env
OPENAI_API_KEY=sk-your-key-here
# or
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

---

### Issue: "Memory not persisting"

**Cause:** Qdrant not running or connection failed

**Solution:**
```bash
# Start Qdrant
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant

# Or use Mem0 hosted service
# Set in .env:
MEM0_API_KEY=your-mem0-key

# Initialize with hosted:
orchestrator = UnifiedAIOrchestrator(use_hosted_mem0=True)
```

---

### Issue: "RAG returns no results"

**Cause:** No documents ingested or index not built

**Solution:**
```python
from app.integrations.llamaindex_rag import LlamaIndexRAG

rag = LlamaIndexRAG()

# Add some test documents first
await rag.add_document(
    text="Test content for RAG",
    metadata={"title": "Test Doc", "type": "test"}
)

# Then search
results = await rag.search(query="test", limit=5)
```

---

## 📚 Learn More

- **Main orchestrator:** `/backend/app/core/ai_orchestrator.py`
- **AI integrations:** `/backend/app/integrations/`
- **Pydantic AI agent:** `/backend/app/integrations/pydantic_agent.py`
- **LangChain orchestrator:** `/backend/app/integrations/langchain_agent.py`
- **Mem0 memory:** `/backend/app/integrations/mem0_memory.py`
- **LlamaIndex RAG:** `/backend/app/integrations/llamaindex_rag.py`
- **API routes:** `/backend/app/api/routes/ai_advanced.py`
- **Config:** `/backend/app/integrations/ai_config.yaml`

---

## 💡 Pro Tips

1. **Use SalesContext consistently** - Enables memory and proper user/org isolation
2. **Start Qdrant before testing memory** - Required for local memory persistence
3. **Use type-safe methods** - `score_lead()`, `generate_email()` provide better validation
4. **Ingest documents early** - RAG works best with a good knowledge base
5. **Monitor API keys and quotas** - OpenAI/Anthropic usage can add up quickly
6. **Test with smaller models first** - Use `gpt-4o-mini` before `gpt-4` for development
7. **Check logs for errors** - Orchestrator logs helpful debug information

---

**Questions?** Check the full implementation summary or reach out to the team.
