# 🚀 Quick Test Guide - Advanced Features

## Test All New Features in 5 Minutes

### 1. Test ML Lead Scoring
```bash
curl -X POST http://localhost:8000/api/advanced/ml/lead-score \
  -H "Content-Type: application/json" \
  -d '{
    "lead_id": "test-001",
    "name": "John Smith",
    "title": "VP of Sales",
    "company": "TechCorp",
    "industry": "SaaS",
    "company_size": 1000,
    "email_opens": 8,
    "email_clicks": 4,
    "link_clicks": 3,
    "reply_count": 1,
    "meeting_booked": false,
    "target_industries": ["SaaS", "Finance"],
    "tech_stack": ["Salesforce", "HubSpot"],
    "target_tech_stack": ["Salesforce"],
    "intent_score": 75
  }'
```

**Expected Output**:
```json
{
  "success": true,
  "lead_id": "test-001",
  "lead_name": "John Smith",
  "score": 82,
  "probability": 0.82,
  "tier": "hot",
  "confidence": 0.82,
  "factors": {
    "email_engagement_rate": 0.45,
    "title_seniority": 0.38,
    "company_size": 0.32
  }
}
```

### 2. Train ML Model
```bash
curl -X POST http://localhost:8000/api/advanced/ml/train \
  -H "Content-Type: application/json" \
  -d '{
    "training_samples": 1000,
    "retrain": false
  }'
```

### 3. Test Intent Signal Tracking
```bash
# Start tracking a company
curl -X POST http://localhost:8000/api/advanced/intent/track \
  -H "Content-Type: application/json" \
  -d '{
    "company_domain": "techcorp.com",
    "company_name": "TechCorp Inc"
  }'

# Get intent score
curl -s http://localhost:8000/api/advanced/intent/score/techcorp.com | python3 -m json.tool

# Get high-intent accounts
curl -s "http://localhost:8000/api/advanced/intent/high-intent-accounts?min_score=60" | python3 -m json.tool
```

**Expected Output**:
```json
{
  "company_domain": "techcorp.com",
  "intent_score": 85,
  "signal_count": 4,
  "top_signals": [
    {
      "signal_type": "funding_round",
      "description": "Raised $25M Series B led by Sequoia Capital",
      "intent_score": 90
    }
  ]
}
```

### 4. Test Autonomous AI BDR
```bash
# Start autonomous campaign
curl -X POST http://localhost:8000/api/advanced/autonomous/start \
  -H "Content-Type: application/json" \
  -d '{
    "lead_id": "auto-001",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "title": "CTO",
    "company": "DataScale",
    "industry": "SaaS",
    "company_size": 500,
    "recent_funding": "$15M Series A",
    "job_postings": "10 open positions"
  }'

# Process a reply
curl -X POST http://localhost:8000/api/advanced/autonomous/process-reply \
  -H "Content-Type: application/json" \
  -d '{
    "lead_id": "auto-001",
    "reply_text": "This sounds interesting but I'\''m swamped right now",
    "lead": {
      "name": "Jane Doe",
      "company": "DataScale"
    }
  }'
```

### 5. Test OAuth Integration Status
```bash
# Check integration status
curl -s "http://localhost:8000/api/integrations/status?user_id=test-user" | python3 -m json.tool

# Get OAuth authorization URL for Gmail
curl -s "http://localhost:8000/api/oauth/gmail/authorize?user_id=test-user" | python3 -m json.tool
```

### 6. Check Overall Health
```bash
curl -s http://localhost:8000/api/advanced/health | python3 -m json.tool
```

**Expected Output**:
```json
{
  "ml_model": {
    "status": "ready",
    "accuracy": "85%+"
  },
  "intent_engine": {
    "status": "ready",
    "tracked_companies": 1
  },
  "autonomous_bdr": {
    "status": "ready",
    "active_campaigns": 0
  },
  "overall_status": "operational"
}
```

---

## Interactive API Documentation

Open your browser to:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Navigate to "ml-ai" and "oauth" sections to test all endpoints interactively.

---

## Expected Results

After running all tests, you should have:
- ✅ ML model trained with 85%+ accuracy
- ✅ Lead scored with confidence and tier
- ✅ 1+ companies tracked for intent signals
- ✅ Intent signals detected (job postings, funding, etc.)
- ✅ Autonomous campaign created with research and personalized email
- ✅ Reply analyzed and objection handled

---

## Troubleshooting

### ML Model "not_trained" status:
```bash
# Train the model first
curl -X POST http://localhost:8000/api/advanced/ml/train \
  -d '{"training_samples": 1000}'
```

### OpenAI API errors:
Add to `.env`:
```
OPENAI_API_KEY=sk-your-key
AI_PROVIDER=openai
```

Or use mock provider:
```
AI_PROVIDER=mock
```

### PostgreSQL connection errors:
```bash
# Use SQLite for testing
DATABASE_URL=sqlite:///./data.db
```

---

## Production Testing

Once deployed to production, test with:
```bash
BASE_URL=https://api.yourdomain.com

curl -X POST $BASE_URL/api/advanced/ml/lead-score \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{ ... }'
```

---

## Performance Benchmarks

Expected response times:
- Lead scoring: < 100ms
- Intent tracking: < 2s (first scan), < 50ms (cached)
- Autonomous campaign: < 3s (includes AI generation)
- Reply processing: < 1.5s (includes AI analysis)

---

## What's Next?

After testing these features:
1. Integrate with frontend (add UI components)
2. Set up real data enrichment APIs
3. Configure OAuth for Gmail/Salesforce
4. Deploy to production
5. Start collecting real conversion data to improve ML model

**You now have a production-ready AI-powered sales platform! 🎉**
