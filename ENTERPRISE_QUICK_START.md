# Quick Start Guide - Enterprise Features

## Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL 14+ (or SQLite for development)
- Redis (optional, for caching)

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Environment Configuration
Create `backend/.env`:
```env
# Database
DATABASE_URL=sqlite:///./data.db
# For PostgreSQL: postgresql://user:pass@localhost:5432/dbname

# Security
SECRET_KEY=your-secret-key-change-this-in-production
JWT_SECRET_KEY=your-jwt-secret-key
ALLOWED_ORIGINS=http://localhost:3004,http://localhost:3000
ALLOWED_HOSTS=localhost,127.0.0.1

# Features
ENABLE_HTTPS_REDIRECT=false
MAX_REQUEST_BODY_SIZE=10485760  # 10MB

# Cache (optional)
REDIS_URL=redis://localhost:6379/0

# Monitoring (optional)
SENTRY_DSN=
OTEL_EXPORTER_ENDPOINT=
```

### 3. Run Database Migrations
```bash
cd backend
alembic upgrade head
```

### 4. Start Backend Server
```bash
cd backend
uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
```

Backend will be available at: http://localhost:8000

## Frontend Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create `.env.local`:
```env
VITE_API_URL=http://localhost:8000/api
```

### 3. Start Frontend Development Server
```bash
npm run dev
```

Frontend will be available at: http://localhost:3004

## Accessing Enterprise Features

### API Keys Management
1. Navigate to: http://localhost:3004/admin/api-keys
2. Click "Create New Key"
3. Enter a name and select permissions (read, write, delete, admin)
4. **Important**: Copy the key immediately - it won't be shown again!
5. Use the key in API requests:
   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        http://localhost:8000/api/campaigns
   ```

### Webhooks Management
1. Navigate to: http://localhost:3004/admin/webhooks
2. Click "Add Webhook"
3. Enter HTTPS URL (e.g., https://your-app.com/webhooks/artisan)
4. Select events to subscribe to
5. **Important**: Save the webhook secret for signature verification
6. Test webhook with "Test Webhook" button

**Verifying Webhook Signatures:**
```python
import hmac
import hashlib
import json

def verify_webhook(payload, signature, secret):
    payload_str = json.dumps(payload, sort_keys=True)
    expected = hmac.new(
        secret.encode(),
        payload_str.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)

# In your webhook handler
signature = request.headers.get('X-Webhook-Signature')
if verify_webhook(request.json, signature, webhook_secret):
    # Process webhook
    pass
```

### Audit Logs
1. Navigate to: http://localhost:3004/admin/audit-log
2. View all security and administrative actions
3. Filter by:
   - User
   - Action type
   - Date range
   - Severity
4. Export logs as CSV for compliance

## Using the API

### Authentication with API Keys

**Create API Key (via UI):**
1. Go to Admin → API Keys
2. Create a key with desired permissions
3. Copy the key (starts with `sk_live_`)

**Use API Key:**
```bash
# List campaigns
curl -H "Authorization: Bearer sk_live_YOUR_KEY" \
     http://localhost:8000/api/campaigns

# Create campaign
curl -X POST \
     -H "Authorization: Bearer sk_live_YOUR_KEY" \
     -H "Content-Type: application/json" \
     -d '{"name":"Q1 Outreach","objective":"Generate leads"}' \
     http://localhost:8000/api/campaigns
```

### Rate Limiting
Each API key has a configurable rate limit (default: 1000 requests/hour)
- Current usage tracked automatically
- `429 Too Many Requests` returned when limit exceeded
- Check `X-RateLimit-Remaining` header

### Webhook Events

**Available Events:**
- `campaign.sent` - Campaign email sent
- `campaign.completed` - Campaign finished
- `campaign.paused` - Campaign paused
- `lead.created` - New lead added
- `lead.updated` - Lead information updated
- `lead.replied` - Lead replied to email
- `lead.unsubscribed` - Lead opted out
- `meeting.booked` - Meeting scheduled
- `meeting.completed` - Meeting finished
- `meeting.cancelled` - Meeting cancelled
- `email.opened` - Email opened by lead
- `email.clicked` - Link clicked in email
- `email.bounced` - Email bounced

**Webhook Payload Example:**
```json
{
  "event": "lead.replied",
  "timestamp": "2024-12-27T23:45:00Z",
  "webhook_id": 123,
  "data": {
    "lead_id": "lead_456",
    "lead_name": "Sarah Chen",
    "campaign_id": "camp_789",
    "reply_content": "Thanks for reaching out..."
  }
}
```

## Multi-Tenant Organization Setup

### Create Organization
```python
# Via API or admin panel
POST /api/admin/organizations
{
  "name": "Acme Corp",
  "slug": "acme-corp",
  "plan_tier": "professional",
  "seat_limit": 25
}
```

### Create Workspace
```python
POST /api/admin/workspaces
{
  "name": "Sales Team",
  "slug": "sales",
  "organization_id": 1,
  "description": "Sales team workspace"
}
```

### Invite Users
```python
POST /api/admin/organizations/1/invite
{
  "email": "user@example.com",
  "role": "member",  # admin, manager, member, read_only
  "workspace_id": 1
}
```

## Security Best Practices

### API Keys
1. **Never commit keys to version control**
2. **Rotate keys regularly** (monthly recommended)
3. **Use minimum required permissions**
4. **Set expiration dates** for temporary keys
5. **Monitor usage** for anomalies
6. **Revoke compromised keys** immediately

### Webhooks
1. **Always verify signatures**
2. **Use HTTPS only** (enforced)
3. **Implement idempotency** (webhooks may retry)
4. **Return 2xx status quickly** (under 30 seconds)
5. **Log all deliveries** for debugging
6. **Handle replay attacks** (check timestamp)

### Production Deployment
1. **Use PostgreSQL** (not SQLite)
2. **Enable HTTPS redirect**
3. **Configure CORS properly**
4. **Set up Redis** for caching
5. **Enable Sentry** for error tracking
6. **Configure rate limiting**
7. **Set up backup cron jobs**
8. **Monitor disk space** for audit logs

## Troubleshooting

### Backend Issues

**Database connection errors:**
```bash
# Check database URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Run migrations
alembic upgrade head
```

**Module not found:**
```bash
# Reinstall dependencies
pip install -r requirements.txt

# Check virtual environment
which python
```

**Port already in use:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or use different port
uvicorn app.main:app --port 8001
```

### Frontend Issues

**API connection errors:**
- Check `VITE_API_URL` in `.env.local`
- Verify backend is running on correct port
- Check browser console for CORS errors

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
```

### Webhook Issues

**Webhooks not receiving:**
1. Check webhook URL is HTTPS
2. Verify webhook is active (not paused)
3. Check delivery logs for errors
4. Test webhook manually
5. Verify server is responding quickly (< 30s)

**Signature verification failing:**
1. Use exact secret from creation
2. Sort JSON keys before hashing
3. Use SHA-256 HMAC
4. Compare with constant-time comparison

## Development Tips

### Hot Reload
- Backend: `--reload` flag enables auto-reload
- Frontend: Vite provides instant HMR

### Debugging
```python
# Backend - Add breakpoints
import pdb; pdb.set_trace()

# Or use VS Code debugger
```

### Testing
```bash
# Backend unit tests
cd backend
pytest -v

# Frontend tests
npm test

# E2E tests
npx playwright test
```

### Database Migrations
```bash
# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1
```

## Support

- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **Readiness Check**: http://localhost:8000/health/ready

## Next Steps

1. ✅ You've set up the enterprise platform
2. 📝 Create your first organization
3. 🔑 Generate API keys
4. 🔗 Configure webhooks
5. 👥 Invite team members
6. 📊 Monitor audit logs
7. 🚀 Deploy to production

For production deployment, see `DEPLOYMENT.md` (coming soon).
