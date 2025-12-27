# AI Coding Agent Instructions - Artisan Platform

## Project Overview
**Artisan** is an enterprise AI-powered B2B sales automation platform with a React frontend (Vite) and FastAPI backend. The platform centers on "Ava" - an AI assistant that automates multi-channel outbound campaigns (email, LinkedIn, SMS, calls).

## Architecture Essentials

### Frontend-Backend Split
- **Frontend**: React 18 + Vite on port 3004, proxy `/api` requests to backend
- **Backend**: FastAPI on port 8000, serves REST API at `/api/*`
- **Data Flow**: Frontend → Vite proxy → FastAPI → PostgreSQL/SQLite (dev uses SQLite at `backend/data.db`)
- **Dev Server**: Run `npm run dev` (frontend) and `cd backend && uvicorn app.main:app --reload --port 8000` (backend) separately

### Key Directories
- `src/pages/`: Full-page React components (Dashboard, CampaignBuilder, AIAssistant, etc.)
- `src/components/`: Reusable UI + feature modules (campaigns, dashboard, layout, ui)
- `src/lib/`: Core utilities - `dataService.js` (API client), `hooks.js`, `storage.js`, `validation.js`
- `backend/app/core/`: Security, config, DB, cache, auth, audit, monitoring
- `backend/app/api/routes/`: API endpoints grouped by domain (leads, campaigns, analytics, auth, admin)
- `backend/app/models/`: SQLModel schemas + Pydantic validation

## Development Workflows

### Running the App
```bash
# Frontend (from root)
npm install && npm run dev  # Starts on port 3004

# Backend (from root, NOT from backend/)
cd backend
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
```

### Testing
- **Frontend**: `npm test` (Vitest + React Testing Library)
- **Backend**: `cd backend && pytest -v --cov=app` (requires postgres/redis services for full suite)
- **E2E**: `npx playwright test` (see `e2e/app.spec.js`)

### Database Migrations
- **Backend uses Alembic**: `cd backend && alembic revision --autogenerate -m "description"` → `alembic upgrade head`
- **Dev DB**: SQLite at `backend/data.db`, production uses PostgreSQL (see `docker-compose.yml`)

## Project-Specific Patterns

### Frontend Conventions
1. **Toast Notifications**: Import `useToast()` from `src/components/Toast`, returns object with methods `success()`, `error()`, `info()`, `warning()`
   ```jsx
   import { useToast } from '../components/Toast';
   const toast = useToast();
   toast.success('Draft saved successfully');
   toast.error('Validation error');
   toast.warning('Rate limit approaching');
   toast.info('Campaign scheduled');
   ```

2. **Form Validation**: Use validators from `src/lib/validation.js` (validateEmail, validateRequired, validateMinLength)
   ```jsx
   import { validateRequired, validateMinLength } from '../lib/validation';
   if (!validateRequired(campaignName)) {
     validationErrors.campaignName = 'Campaign name is required';
   }
   ```

3. **Loading States**: Wrap async operations with `<PageLoader />` or inline `<InlineLoader />` from `src/components/Loading`
   ```jsx
   const [isGenerating, setIsGenerating] = useState(false);
   {isGenerating ? <InlineLoader /> : <Button>Generate</Button>}
   ```

4. **ErrorBoundary**: All pages wrapped in `<ErrorBoundary>` (see `src/App.jsx`) - catches React errors with recovery UI
5. **Lazy Loading**: Pages are lazy-loaded via `React.lazy()` in `src/App.jsx` for performance
6. **Data Persistence**: Use `storage` API from `src/lib/storage.js` (localStorage wrapper with `artisan_` prefix)
   ```jsx
   import { saveCampaignDraft, getCampaignDraft } from '../lib/storage';
   // Auto-save every 30s pattern
   useEffect(() => {
     const autoSaveInterval = setInterval(() => {
       if (campaignName) handleSaveDraft(true);
     }, 30000);
     return () => clearInterval(autoSaveInterval);
   }, [campaignName]);
   ```

7. **Theming**: Dark mode via `ThemeContext` (`src/contexts/ThemeContext.jsx`) - use `theme` and `toggleTheme` from context
8. **API Client**: Import `dataService` from `src/lib/dataService.js` - handles auth, errors, and API base URL override via `VITE_API_URL`
9. **UI Components**: Built with shadcn/ui (Radix UI primitives) + Tailwind CSS + DaisyUI - see `src/components/ui/` for reusable components (Button, Card, Dialog, Input, etc.)
10. **Styling**: Tailwind CSS with custom theme in `tailwind.config.js` - primary color `#0F2540`, dark mode enabled via `class` strategy

### Backend Conventions
1. **Security Layers**: All requests pass through middleware stack (CORS → TrustedHost → SecurityHeaders → RateLimit → RequestID)
2. **RBAC**: Use `@require_permission()` decorator (from `app/core/security.py`) on routes - checks JWT + user role/permissions
3. **Structured Logging**: JSON logs via `JsonFormatter` in `app/core/config.py` - include `request_id` for traceability
4. **Error Tracking**: Sentry auto-initialized in `app/main.py` - exceptions logged to Sentry with user context
5. **Caching**: Import `cache` from `app/core/cache.py` - Redis-backed with TTL, use `cache.get()` / `cache.set()` for frequent reads
6. **Async Tasks**: Celery workers for background jobs (email queues, analytics) - define tasks in `backend/app/tasks/`
7. **Health Checks**: `/health` (liveness), `/health/ready` (readiness with DB + cache checks) - used by Kubernetes probes
8. **Input Sanitization**: Use `sanitize_text()` from `app/core/security.py` for user-submitted text fields
   ```python
   from app.core.security import sanitize_text
   data["name"] = sanitize_text(data.get("name", ""))
   ```

9. **API Route Pattern**: Group routes by domain in `backend/app/api/routes/`, use dependency injection for DB session
   ```python
   from fastapi import APIRouter, Depends, HTTPException, status
   from sqlmodel import Session, select
   from app.core.db import get_session
   
   router = APIRouter()
   
   @router.get("/campaigns", response_model=List[Campaign])
   def list_campaigns(session: Session = Depends(get_session)):
       return session.exec(select(Campaign)).all()
   
   @router.post("/campaigns", status_code=status.HTTP_201_CREATED)
   def create_campaign(payload: CampaignCreate, session: Session = Depends(get_session)):
       campaign = Campaign(**payload.dict())
       session.add(campaign)
       session.commit()
       session.refresh(campaign)
       return campaign
   ```
   **IMPORTANT**: Always use `get_session` (not `get_db`) as the dependency function name - this is the standard throughout the codebase.

## Integration Points

### Multi-Channel Campaigns
- **Campaign Builder** (`src/pages/CampaignBuilder.jsx`): Creates sequences with delays, validates via API at `/api/campaigns`
- **Backend routes**: `backend/app/api/routes/campaigns.py` handles CRUD, Celery queues email sends
- **Lead Scoring**: AI-powered scoring (0-100) at `/api/leads/{id}/score`, updates `leads.score` in DB

### AI Assistant (Ava)
- **Frontend**: `src/pages/AIAssistant.jsx` chat interface, sends prompts to `/api/ai/generate`
- **Backend**: `backend/app/api/routes/ai.py` uses OpenAI/mock provider (toggle via `AI_PROVIDER` env var)
- **Tone Control**: Professional/Casual/Enthusiastic modes adjust prompt templates

### Authentication Flow
1. User logs in at `/api/auth/login` → JWT returned with role + permissions
2. Frontend stores JWT in `localStorage` (via `dataService.js`)
3. Backend validates JWT on protected routes → injects `current_user` dependency
4. Admin routes require `admin` role (see `backend/app/models/user.py` for ROLE_PERMISSIONS)

### External Dependencies
- **Database**: PostgreSQL (prod) / SQLite (dev) via SQLModel ORM
- **Cache/Queue**: Redis for both cache and Celery broker
- **Monitoring**: Sentry for errors, Prometheus metrics at `/metrics` endpoint
- **Storage**: S3-compatible (boto3) for file uploads (PDFs, CSVs)

## Testing Patterns
- **Frontend**: Mock `dataService` API calls in tests, use `@testing-library/react` queries
- **Backend**: Fixture `test_client` in `backend/tests/conftest.py` - FastAPI TestClient with in-memory DB
- **Auth Testing**: Use `override_get_current_user` dependency in tests to inject mock users

## Deployment
- **Docker**: Multi-stage builds (see `Dockerfile.frontend`, `backend/Dockerfile`)
- **Kubernetes**: Helm charts in `helm/enterprise-app/`, manifests in `k8s/`
- **CI/CD**: GitHub Actions (`.github/workflows/ci-cd.yml`) - pytest + vitest on PR, builds + pushes images on merge
- **Env Vars**: Frontend uses `VITE_*` prefix, backend loads from `.env` via `python-dotenv`

## Common Pitfalls
- **Port Mismatch**: Frontend dev server is 3004 (not 3000), backend is 8000 - update `VITE_API_URL` if deploying separately
- **CORS Errors**: Add new origins to `settings.allowed_origins` in `backend/app/core/config.py`
- **Toast Not Showing**: Ensure component is wrapped in `<ToastProvider>` (already done in `App.jsx`)
- **DB Locks**: SQLite doesn't handle concurrent writes well - use PostgreSQL for load testing
- **Celery Tasks**: Must start Celery worker separately (`celery -A app.core.celery_app worker`) for async features

## Component-Specific Patterns

### Campaign Builder (`src/pages/CampaignBuilder.jsx`)
- **Auto-save**: Draft persists every 30s using `saveCampaignDraft()` from storage utils
- **Multi-step validation**: Validate each step individually before launch, collect all errors first
- **Channel types**: Email (subject+content), LinkedIn (content only), Call (script), SMS (short content)
- **AI generation**: Set `isGenerating` state, simulate 2s delay, update specific step content with variables like `{{firstName}}`, `{{company}}`

### Lead Database (`src/pages/LeadDatabase.jsx`)
- **Tabs pattern**: Use `<Tabs>` from ui/Tabs for Search/Upload/Saved views
- **Search filters**: Store as array of selected filter IDs, render badges
- **File upload**: Accept CSV/Excel, show recent uploads with status badges
- **Saved searches**: Persist filter combinations in localStorage, display result counts

### Testing Patterns
- **Frontend**: Mock `dataService` API calls in tests, use `@testing-library/react` queries
- **Backend**: Fixture `test_client` in `backend/tests/conftest.py` provides FastAPI TestClient with in-memory SQLite
  ```python
  def test_create_campaign(client, db_session):
      response = client.post("/api/campaigns", json={"name": "Test", "objective": "Outbound"})
      assert response.status_code == 201
  ```
- **Auth Testing**: Override `get_current_user` dependency in tests to inject mock users without JWT
  ```python
  from app.core.security import get_current_user
  app.dependency_overrides[get_current_user] = lambda: mock_user
  ```

## Debugging Workflows

### Frontend Issues
1. **API not responding**: Check Vite proxy in `vite.config.js` points to `http://localhost:8000`, verify backend is running
2. **Toast not appearing**: Open React DevTools → Components → search for ToastProvider, verify context is available
3. **Validation not triggering**: Check `useFormValidation` hook setup, ensure `validateRequired()` etc. return boolean
4. **Dark mode broken**: Verify `ThemeProvider` wraps app, check `localStorage` for `artisan_theme` key

### Backend Issues
1. **500 errors**: Check terminal for Python traceback, verify Sentry DSN if configured, inspect JSON logs for `request_id`
2. **Auth failing**: Test JWT with `curl -H "Authorization: Bearer {token}" http://localhost:8000/api/admin/users`, check token expiry
3. **DB migration errors**: Run `cd backend && alembic current` to check version, `alembic history` to see all migrations
4. **Cache not working**: Verify Redis is running (`redis-cli ping`), check `REDIS_URL` env var in `backend/.env`

### Performance Debugging
- **Slow API**: Check Prometheus metrics at `/metrics`, look for high `http_request_duration_seconds` values
- **Memory leaks**: Run `docker stats` to monitor container memory, check Celery worker logs for task failures
- **Frontend bundle size**: Run `npm run build` and inspect `dist/assets/` for large JS chunks, consider code-splitting

## Documentation References
- Architecture diagrams: `ARCHITECTURE.md`
- Feature list: `FEATURES.md`, `ENTERPRISE_FEATURES.md`
- Production checklist: `PRODUCTION_CHECKLIST.md`
- Dark mode guide: `DARK_MODE_IMPLEMENTATION.md`
- Quick start: `QUICK_START.md`
