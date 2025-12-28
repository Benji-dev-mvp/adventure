# Enterprise AI Operating System - Implementation Guide

## Overview

This implementation transforms the Artisan AI engine into a comprehensive Enterprise AI Operating System with 6 major feature sets:

1. **AI Model Orchestration Control Plane**
2. **AI Memory Governance (Enterprise Safe Mode)**
3. **Knowledge Graph for RAG**
4. **Automated AI Workflows**
5. **Realtime Streaming + Voice Intelligence**
6. **Usage Metering + Billing Engine**

## Architecture

### Backend Structure

```
backend/
├── app/
│   ├── models/
│   │   └── ai_enterprise.py          # All enterprise AI models
│   ├── services/
│   │   ├── memory_governance.py      # Memory TTL, PII scrubbing, compliance
│   │   ├── usage_metering.py         # Usage tracking and billing
│   │   └── voice_intelligence.py     # Voice/call sessions and streaming
│   ├── tasks/
│   │   └── ai_workflows.py           # Celery background tasks
│   ├── api/routes/
│   │   └── ai_enterprise.py          # All enterprise AI endpoints
│   ├── core/
│   │   ├── ai_orchestrator.py        # Extended with model policy manager
│   │   └── celery_app.py             # Updated with new task queues
│   └── integrations/
│       └── llamaindex_rag.py         # Extended with knowledge graph
└── alembic/versions/
    └── 002_enterprise_ai.py          # Database migration
```

### Frontend Structure

```
src/
├── pages/
│   ├── AdminAIControl.jsx            # Model policy management UI
│   └── ComplianceCenter.jsx          # Extended with memory governance
└── App.jsx                           # Updated routing
```

## Database Schema

### New Tables (18 total)

1. **model_policies** - Model routing policies per workspace
2. **model_health_metrics** - Provider health and latency tracking
3. **memory_policies** - TTL and PII scrubbing policies per tenant
4. **memory_audit_logs** - Audit trail for memory operations
5. **kg_entities** - Knowledge graph entity nodes
6. **kg_relations** - Knowledge graph relationship edges
7. **usage_metering** - Per-request usage tracking
8. **tenant_usage_quotas** - Usage limits and billing
9. **voice_sessions** - Voice/call session records
10. **voice_transcript_chunks** - Real-time transcript segments
11. **vector_search_metrics** - RAG quality tracking
12. **email_performance_metrics** - Email attribution
13. **lead_score_accuracy_metrics** - Lead scoring accuracy
14. **ai_response_quality_feedback** - User feedback on AI responses

## API Endpoints

### Model Orchestration (`/api/ai-advanced/model-policy`)

- `POST /model-policy/set` - Configure model routing rules
- `GET /model-policy?workspace_id={id}` - Get current policy

**Example Policy:**
```json
{
  "workspace_id": "default",
  "rules": [
    {
      "segment": "executives",
      "provider": "openai",
      "model": "gpt-4",
      "fallback": ["gpt-4-turbo", "gpt-3.5-turbo"],
      "latency_budget_ms": 3000
    },
    {
      "segment": "bulk",
      "provider": "openai",
      "model": "gpt-3.5-turbo",
      "fallback": [],
      "latency_budget_ms": 2000
    }
  ],
  "fallback_strategy": "latency",
  "auto_fallback_enabled": true
}
```

### Memory Governance (`/api/ai-advanced/memory`)

- `POST /memory/policy` - Set TTL, PII scrubbing, compliance mode
- `DELETE /memory/purge` - Compliance purge with audit logging
- `GET /memory/audit-logs` - Query audit trail

**Example Purge:**
```json
{
  "reason": "GDPR Right to be Forgotten request",
  "category": "lead_interactions",
  "before_date": "2024-01-01T00:00:00Z"
}
```

### Knowledge Graph (`/api/ai-advanced/rag/graph`)

- `POST /graph/ingest` - Ingest documents with entity extraction
- `POST /graph/query` - Natural language graph queries

**Example Query:**
```json
{
  "query": "Show customers who reported issues after feature X release",
  "entity_types": ["customer", "issue", "feature"],
  "relation_types": ["reported_by", "related_to"],
  "max_hops": 2
}
```

### Voice Intelligence (`/api/ai-advanced/voice`)

- `WebSocket /voice/stream` - Real-time voice streaming
- `GET /voice/summary?session_id={id}` - Get call summary
- `GET /voice/actions?session_id={id}` - Extract action items

### Usage Metering (`/api/ai-advanced/usage`)

- `GET /usage/summary` - Tenant usage summary with costs
- `GET /usage/breakdown` - Usage by model
- `GET /usage/quota` - Current quota status

## Setup & Deployment

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Run Database Migration

```bash
cd backend
alembic upgrade head
```

### 3. Configure Environment

Add to `.env`:

```bash
# AI Orchestration
AI_PROVIDER=openai
AI_MODEL=gpt-4
AI_TEMPERATURE=0.7

# Memory Governance
MEM0_HOSTED=false

# Usage Metering
STRIPE_SECRET_KEY=sk_test_...

# Redis for Celery
REDIS_URL=redis://localhost:6379/0
```

### 4. Start Services

**Backend:**
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

**Celery Worker:**
```bash
cd backend
celery -A app.core.celery_app worker --loglevel=info
```

**Celery Beat (Scheduler):**
```bash
cd backend
celery -A app.core.celery_app beat --loglevel=info
```

**Frontend:**
```bash
npm run dev
```

## Scheduled Tasks

The following tasks run automatically via Celery Beat:

1. **Daily Lead Scoring Refresh** - Every 24 hours
2. **Auto-Enrichment Job** - Hourly
3. **Drip Workflow Trigger** - Every 10 minutes
4. **Follow-up Automation** - Hourly
5. **Memory TTL Cleanup** - Daily

## UI Access

- **AI Control Panel**: `/admin/ai-control`
- **Compliance Center**: `/compliance-center` (Memory Governance tab)

## Security Features

### PII Scrubbing

Automatically redacts:
- Email addresses
- Phone numbers
- SSN
- Credit card numbers

### Tenant Isolation

All queries are automatically scoped to tenant:
```python
governance.enforce_tenant_isolation(query, tenant_id)
```

### Audit Logging

All operations logged:
- Memory operations (add, search, purge)
- Model policy changes
- Usage quota updates

## Monitoring

### Model Health

Health checks run every 5 minutes:
- Average latency
- Error rate
- Status (healthy, degraded, unhealthy)

### Usage Tracking

Per-request tracking:
- Tokens in/out
- Latency
- Cost
- Success/failure

### Analytics

Built-in metrics:
- Vector search recall rates
- Email performance attribution
- Lead scoring accuracy
- AI response quality

## Cost Management

### Hard Caps

Block requests when quota exceeded:
```python
quota.hard_cap_enabled = True
quota.monthly_token_limit = 1_000_000
```

### Soft Caps

Warnings at threshold (default 80%):
```python
quota.soft_cap_enabled = True
quota.soft_cap_threshold = 0.8
```

## Best Practices

1. **Model Selection**
   - Use GPT-4 for executives/complex tasks
   - Use GPT-3.5 for bulk operations
   - Configure fallbacks for reliability

2. **Memory Governance**
   - Set appropriate TTL based on compliance requirements
   - Enable PII scrubbing for all production data
   - Regular audit log reviews

3. **Usage Monitoring**
   - Monitor soft cap warnings
   - Review usage breakdown by model
   - Optimize model selection for cost

4. **Knowledge Graph**
   - Ingest structured data regularly
   - Use graph queries for complex relationships
   - Combine with vector search for best results

## Troubleshooting

### Model Routing Issues

Check health metrics:
```bash
curl http://localhost:8000/api/ai-advanced/model-health
```

### Memory Purge Not Working

Check policy settings:
```bash
curl http://localhost:8000/api/ai-advanced/memory/policy
```

### Celery Tasks Not Running

Verify Celery worker is running:
```bash
celery -A app.core.celery_app inspect active
```

## Future Enhancements

- [ ] Stripe webhook integration for billing events
- [ ] Advanced model routing (A/B testing, quality scoring)
- [ ] Graph visualization UI
- [ ] Voice analytics dashboard
- [ ] Multi-region deployment
- [ ] Custom model providers

## Support

For issues or questions:
- Check logs: `backend/logs/app.log`
- Review API docs: `http://localhost:8000/docs`
- Inspect database: `sqlite3 backend/data.db` (dev)

## License

Copyright © 2024 Artisan. All rights reserved.
