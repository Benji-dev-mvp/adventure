# Artisan Platform - Developer Quick Reference

## 🚀 Quick Start

```bash
# Frontend (port 3004)
npm install
npm run dev

# Backend (port 8000)
cd backend
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Access application
http://localhost:3004
```

---

## 📡 New API Endpoints

### Autonomous AI Features

```bash
# Prospect Research
curl -X POST http://localhost:8000/api/autonomous/research/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prospect_name": "John Doe", "company_name": "Acme Corp", "priority": "high"}'

curl -X GET http://localhost:8000/api/autonomous/research/queue

curl -X GET http://localhost:8000/api/autonomous/research/research_12345

# Objection Handling
curl -X GET http://localhost:8000/api/autonomous/objections

curl -X POST http://localhost:8000/api/autonomous/objections/obj_12345/approve

# Meeting Booking
curl -X GET http://localhost:8000/api/autonomous/meetings/autonomous

curl -X POST http://localhost:8000/api/autonomous/meetings/propose \
  -H "Content-Type: application/json" \
  -d '{"prospect_email": "john@acme.com", "proposed_times": ["2024-01-20 2:00 PM", "2024-01-21 10:00 AM"], "meeting_duration": 30}'

# Follow-Ups
curl -X GET http://localhost:8000/api/autonomous/followups/queue

curl -X POST http://localhost:8000/api/autonomous/followups/followup_12345/execute

# Insights
curl -X GET http://localhost:8000/api/autonomous/insights/autonomous
```

### Email Deliverability

```bash
# Mailbox Management
curl -X GET http://localhost:8000/api/deliverability/mailboxes

curl -X GET http://localhost:8000/api/deliverability/mailboxes/1/health

curl -X POST http://localhost:8000/api/deliverability/mailboxes/connect \
  -H "Content-Type: application/json" \
  -d '{"provider": "gmail", "email": "user@gmail.com", "credentials": {}}'

# Warmup Control
curl -X POST http://localhost:8000/api/deliverability/mailboxes/1/warmup/start?target_daily_limit=80

curl -X POST http://localhost:8000/api/deliverability/mailboxes/1/warmup/pause

# Authentication & Spam
curl -X GET http://localhost:8000/api/deliverability/mailboxes/1/authentication

curl -X GET http://localhost:8000/api/deliverability/mailboxes/1/spam-score

# Analytics
curl -X GET http://localhost:8000/api/deliverability/analytics?days=30
```

---

## 🎨 Frontend Components

### Using Autonomous Features

```jsx
import {
  AutonomousProspectResearcher,
  ObjectionHandler,
  AutonomousMeetingBooker,
  AutonomousFollowUpEngine
} from '../components/ava/AutonomousFeatures';

// In your component
<AutonomousProspectResearcher />
<ObjectionHandler />
<AutonomousMeetingBooker />
<AutonomousFollowUpEngine />
```

### Using Existing Ava Components

```jsx
import {
  AvaChatInterface,
  EmailDeliverabilityDashboard,
  DataMinerDashboard,
  PersonalizationWaterfallViewer,
  SentimentAnalysisDashboard,
  LeadQualificationPipeline,
  AvaPerformanceTracker,
  AvaTrainingInterface,
  B2BDatabaseSearch
} from '../components/ava/AvaComponents';
```

---

## 🔧 Configuration

### Environment Variables

```bash
# Frontend (.env)
VITE_API_URL=http://localhost:8000

# Backend (.env)
DATABASE_URL=sqlite:///./data.db
REDIS_URL=redis://localhost:6379
ALLOWED_ORIGINS=http://localhost:3004,http://localhost:3000
JWT_SECRET_KEY=your-secret-key-here
AI_PROVIDER=openai  # or mock
OPENAI_API_KEY=sk-...
```

---

## 📝 Key File Locations

### New Files Created

```
Frontend:
src/pages/HelpCenter.jsx
src/components/ava/AutonomousFeatures.jsx

Backend:
backend/app/api/routes/autonomous.py
backend/app/api/routes/deliverability.py

Documentation:
ARTISAN_ENHANCEMENT_COMPLETE.md
ARTISAN_PLATFORM_QUICK_REF.md (this file)
```

### Modified Files

```
Frontend:
src/App.jsx (added /help route)
src/pages/AvaHub.jsx (added 4 new tabs)
src/components/layout/Sidebar.jsx (added help link)

Backend:
backend/app/main.py (added 2 new routers)
```

---

## 🎯 Feature Flags

All new features are **enabled by default**. To disable:

```python
# backend/app/core/config.py
FEATURE_AUTONOMOUS_AI = False
FEATURE_DELIVERABILITY = False
FEATURE_HELP_CENTER = False
```

---

## 🧪 Testing

```bash
# Frontend tests
npm test

# Backend tests
cd backend
pytest -v

# Test specific endpoint
pytest tests/test_autonomous.py -v
pytest tests/test_deliverability.py -v
```

---

## 📊 Monitoring Endpoints

```bash
# Health checks
curl http://localhost:8000/health
curl http://localhost:8000/health/ready

# Metrics
curl http://localhost:8000/metrics

# API docs
open http://localhost:8000/docs
```

---

## 🐛 Debugging

### Enable Debug Logs

```python
# backend/app/core/config.py
LOG_LEVEL = "DEBUG"
```

### Frontend Dev Tools

```bash
# React DevTools
npm install -g react-devtools

# Redux DevTools (if using Redux)
# Install browser extension
```

### Backend Debugging

```bash
# Run with debugger
python -m debugpy --listen 5678 -m uvicorn app.main:app --reload
```

---

## 🚀 Deployment Checklist

- [ ] Update environment variables
- [ ] Run database migrations
- [ ] Build frontend: `npm run build`
- [ ] Test all API endpoints
- [ ] Check health endpoints
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS redirect
- [ ] Set up monitoring (Sentry, Prometheus)
- [ ] Configure rate limiting
- [ ] Run security audit

---

## 📚 Documentation Links

- **Help Center:** http://localhost:3004/help
- **API Docs:** http://localhost:8000/docs
- **Architecture:** [ARCHITECTURE.md](ARCHITECTURE.md)
- **Features:** [FEATURES.md](FEATURES.md)
- **Enterprise Features:** [ENTERPRISE_FEATURES.md](ENTERPRISE_FEATURES.md)
- **Enhancement Summary:** [ARTISAN_ENHANCEMENT_COMPLETE.md](ARTISAN_ENHANCEMENT_COMPLETE.md)

---

## 💡 Common Patterns

### Making API Calls from Frontend

```javascript
import { dataService } from '../lib/dataService';

// Autonomous research
const startResearch = async (prospect) => {
  try {
    const response = await dataService.post('/autonomous/research/start', {
      prospect_name: prospect.name,
      company_name: prospect.company,
      priority: 'high'
    });
    return response.data;
  } catch (error) {
    console.error('Research failed:', error);
  }
};

// Get mailbox health
const getMailboxHealth = async (mailboxId) => {
  try {
    const response = await dataService.get(`/deliverability/mailboxes/${mailboxId}/health`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch health:', error);
  }
};
```

### Adding Toast Notifications

```javascript
import { useToast } from '../components/Toast';

const MyComponent = () => {
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast('Research started successfully!', 'success');
  };

  const handleError = () => {
    showToast('Failed to start research', 'error');
  };

  return <button onClick={handleSuccess}>Start Research</button>;
};
```

### Using Loading States

```javascript
import { InlineLoader } from '../components/Loading';

const [isLoading, setIsLoading] = useState(false);

{isLoading ? <InlineLoader /> : <button>Start</button>}
```

---

## 🔑 Key Metrics to Monitor

### Autonomous AI
- Prospects researched per day: Target 200+
- Average data points per prospect: Target 15+
- High-intent prospects found: Target 30%+
- Objection resolution rate: Target 70%+
- Meeting booking success rate: Target 60%+

### Email Deliverability
- Inbox placement rate: Target 95%+
- Spam rate: Target <2%
- Bounce rate: Target <1.5%
- Health score: Target 90+
- Warmup completion rate: Target 100%

### Help Center
- Article views per session: Target 2+
- Search usage rate: Target 40%+
- Time on page: Target 3+ minutes
- Bounce rate: Target <30%

---

## ⚠️ Important Notes

1. **API Mocking**: Current backend routes return mock data. Integrate real data sources before production.
2. **Authentication**: All routes require JWT. Use `get_current_user` dependency.
3. **Rate Limiting**: 100 requests/min per user. Adjust in `app/core/security.py`.
4. **Database**: Development uses SQLite. Switch to PostgreSQL for production.
5. **Caching**: Redis required for rate limiting and session management.

---

## 🆘 Troubleshooting

### Issue: API returns 401 Unauthorized
**Solution:** Check JWT token in localStorage. Re-login if expired.

### Issue: CORS errors
**Solution:** Add frontend URL to `ALLOWED_ORIGINS` in backend `.env`

### Issue: Warmup not starting
**Solution:** Verify mailbox is connected and status is not 'issue'

### Issue: Research queue stuck
**Solution:** Check background worker is running. Restart if needed.

### Issue: Help Center search not working
**Solution:** Verify state management. Check `searchQuery` and `filteredArticles`

---

## 📞 Support

- **Technical Issues:** Check [ARTISAN_ENHANCEMENT_COMPLETE.md](ARTISAN_ENHANCEMENT_COMPLETE.md)
- **API Questions:** Visit http://localhost:8000/docs
- **Feature Requests:** Add to `TODO.md`
- **Bug Reports:** Create issue with reproduction steps

---

**Last Updated:** December 27, 2025  
**Version:** 2.0.0  
**Status:** ✅ Production Ready (with data source integration)
