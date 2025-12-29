# Artisan AI BDR Platform — Copilot Guide

Concise, actionable guidance for AI coding agents to be immediately productive in this codebase.

## ⚡ Quick Start (Copy-Paste)

```bash
# Frontend (port 3004)
npm install && npm run dev

# Backend (port 8000, separate terminal)
cd backend && python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
```

## 🏗️ Architecture Overview (Big Picture)

**Frontend (React 18 + Vite):**

- Single-page app with 40+ lazy-loaded pages in [src/App.jsx](../src/App.jsx)
- Wrapped by `PostLoginShell` layout that provides nav, sidebar, settings context
- State: Zustand stores (`campaignStore`, `leadStore`, `userStore`) + server state via TanStack Query
- UI Layer: Radix-based components in [src/components/ui](../src/components/ui)
- Routing: Domain-first (campaigns, leads, analytics, admin, settings); settings pages use `@pages/Settings*` pattern

**Backend (FastAPI + SQLModel):**

- 30+ domain routers in [backend/app/api/routes](../backend/app/api/routes) (campaigns, leads, ai, admin, etc.)
- All routers imported and included in [backend/app/main.py](../backend/app/main.py) (lines 8-36)
- Middleware stack (lines 66-79): CORS → TrustedHost → SecurityHeaders → RateLimit → RequestID
- DB: SQLModel ORM with SQLite (dev) / Postgres (prod); async support via sqlalchemy+asyncpg

**AI System (Policy-Orchestrated):**

- Central entry point: [backend/app/integrations/ai_orchestrator.py](../backend/app/integrations/ai_orchestrator.py)
- Policy-driven routing via `UseCaseType` enum in [backend/app/integrations/policies.py](../backend/app/integrations/policies.py)
- Each use case (EMAIL_GENERATION, LEAD_SCORING, CAMPAIGN_STRATEGY, etc.) maps to specific model, temperature, tools, memory config
- Provider factory abstracts OpenAI, Anthropic, Azure, mock providers
- Budget control + caching + streaming baked in

**Data Flow:**

- Frontend form → POST `/api/campaigns/` → Backend route handler
- Handler validates via Pydantic schema, accesses DB via `get_session()`, calls AI orchestrator if needed
- Response streamed/returned to frontend, stored in Zustand + TanStack Query cache
- WebSocket available for real-time updates (not heavily used yet)

## 🎯 Critical Patterns (Don't Miss These)

### State Management (Frontend)

```javascript
// Zustand store with Immer middleware (src/stores/campaignStore.ts)
// Use immer to draft mutations - no manual reducer boilerplate
const useCampaignStore = create(
  immer(set => ({
    campaigns: [],
    selectedId: null,
    setCampaigns: campaigns => set({ campaigns }),
    updateCampaignDraft: (id, partial) =>
      set(draft => {
        const campaign = draft.campaigns.find(c => c.id === id);
        if (campaign) Object.assign(campaign, partial);
      }),
  }))
);

// For server state: use TanStack Query with shared queryClient
const { data: campaigns } = useQuery({
  queryKey: queryKeys.campaigns.list(filters),
  queryFn: () => dataService.getCampaigns(filters),
  staleTime: 30 * 1000,
});
```

### Backend Database Access

```python
# ALWAYS use get_session() context manager, never get_db
from app.core.db import get_session
with get_session() as session:
    user = session.exec(select(User).where(User.id == user_id)).first()
    if not user:
        raise HTTPException(status_code=404)
```

### AI Calls (Use Orchestrator, Not Direct Provider Calls)

```python
from app.integrations.ai_orchestrator import AIOrchestrator, OrchestrationContext
from app.integrations.policies import UseCaseType

orchestrator = AIOrchestrator()
result = await orchestrator.execute(
    use_case=UseCaseType.EMAIL_GENERATION,
    prompt="Write a cold email for {company}",
    context=OrchestrationContext(user_id="u123", org_id="o456"),
    variables={"company": "TechCorp Inc."},
)
# result.content = "Dear hiring manager..."
# result.cached = True/False
# result.budget_remaining = {...}

# For streaming (only when policy.streaming_enabled):
async for chunk in orchestrator.stream(use_case=UseCaseType.CONVERSATION, ...):
    yield chunk
```

### Toast Notifications (Frontend)

```javascript
// Must be inside ToastProvider (src/app/providers.tsx)
import { useToast } from '@components/Toast';
const MyComponent = () => {
  const { toast } = useToast();
  const handleClick = () => {
    toast({ description: 'Campaign created!', variant: 'default' });
    // Auto-dismisses in 5 seconds
  };
};
```

### Form Validation (Frontend)

```javascript
import { validateRequired, validateEmail } from '@lib/validation';
// Reuse these instead of regex sprinkled everywhere
const errors = {};
if (!validateRequired(name)) errors.name = 'Required';
if (!validateEmail(email)) errors.email = 'Invalid email';
```

### API Proxy & Environment

- Frontend proxy: `/api/*` → `http://localhost:8000` (see [vite.config.js](../vite.config.js#L19-L24))
- Use `import.meta.env.VITE_API_URL` or dataService defaults
- Centralized HTTP calls in [src/lib/dataService.js](../src/lib/dataService.js)

### Provider Order (Non-Negotiable)

In [src/app/providers.tsx](../src/app/providers.tsx):

1. QueryClientProvider (data fetching)
2. ThemeProvider (visual theming)
3. DensityProvider (compact/comfortable layout)
4. TenantProvider (org-aware settings)
5. ToastProvider (notifications)

Do NOT reorder—each depends on previous.

### Security Sanitization

```python
from app.core.security import sanitize_text
# Always sanitize user-provided text to mitigate XSS
clean_email = sanitize_text(user_email_input)
```

## 📝 Conventions & Patterns

| Pattern          | Location                                                              | Example                                                     |
| ---------------- | --------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Storage**      | [src/lib/storage.js](../src/lib/storage.js)                           | `storage.set('artisan_campaign_draft', data)`               |
| **API Routes**   | [backend/app/api/routes/](../backend/app/api/routes/)                 | Domain-per-file: `campaigns.py`, `leads.py`, `ai.py`        |
| **Lazy Pages**   | [src/App.jsx](../src/App.jsx)                                         | `const Dashboard = lazy(() => import('./pages/Dashboard'))` |
| **Path Aliases** | [vite.config.js](../vite.config.js#L8-L16)                            | `@/lib`, `@components`, `@pages`, `@hooks`                  |
| **Query Keys**   | [src/lib/queryClient.js](../src/lib/queryClient.js)                   | `queryKeys.campaigns.detail(id)` for cache invalidation     |
| **Models**       | [backend/app/models/schemas.py](../backend/app/models/schemas.py)     | SQLModel + Pydantic (table=True for DB, False for schemas)  |
| **Logging**      | [backend/app/core/config.py](../backend/app/core/config.py)           | Structured JSON via JsonFormatter; set `LOG_LEVEL` env var  |
| **Metrics**      | [src/config/metricsFactory.js](../src/config/metricsFactory.js)       | Plan-based metrics + reusable sparkline templates           |
| **Navigation**   | [src/config/navigationFactory.js](../src/config/navigationFactory.js) | Routes, commands, page chrome (single source of truth)      |

## 🚫 Avoiding Duplication (Critical!)

**Problem:** Files with high duplication (metrics, navigation configs) have been refactored into factory modules.

**Solution:** Use data-driven configuration and factory functions:

```javascript
// ❌ BAD: Duplicated metrics in STARTUP_METRICS, MIDMARKET_METRICS, ENTERPRISE_METRICS
const sparklines = [
  { id: 'meetings', label: 'Meetings/Week', value: '12', color: '#06b6d4' },
  // repeated in 3 different blocks...
];

// ✅ GOOD: Factory pattern (src/config/metricsFactory.js)
import { SPARKLINE_TEMPLATES, getMetricsForPlan } from '@/config/metricsFactory';
const metrics = getMetricsForPlan(plan); // Fully structured metrics
```

**Key Factory Modules:**

- [src/config/metricsFactory.js](../src/config/metricsFactory.js) — Unified `PLAN_METRICS` object + template helpers → ~96% duplication eliminated
- [src/config/navigationFactory.js](../src/config/navigationFactory.js) — Single `PAGE_ROUTES`, `NAVIGATION_ITEMS`, `QUICK_ACTIONS` → powers command palette + page chrome
- [src/config/pageChrome.ts](../src/config/pageChrome.ts) — Now imports from navigationFactory → reduced duplication

**When Adding New Content:**

1. **New plan-specific metric?** → Add to `PLAN_METRICS[plan]` in metricsFactory
2. **New navigation route?** → Add to `PAGE_ROUTES` in navigationFactory (auto-generates commands + chrome)
3. **New command/action?** → Add to `QUICK_ACTIONS` in navigationFactory (shared across palette)

### Enforcement Rules for Copilot (Do/Don’t)

- ✅ Do use factory exports: `getMetricsForPlan`, `PAGE_ROUTES`, `buildCommandsList`.
- ✅ Do update only the factory file when adding metrics/routes/actions.
- ❌ Don’t hardcode repeated structures in pages/hooks/components.
- ❌ Don’t diverge definitions between files; factories are the single source.

### Navigation Model Guidance

- Sidebar/nav sections live in [src/config/navConfig.js](../src/config/navConfig.js) for plan/admin gating and grouping.
- Commands + page chrome live in [src/config/navigationFactory.js](../src/config/navigationFactory.js); this is authoritative for palette/chrome.
- When adding a new page:
  - Add route metadata in `PAGE_ROUTES` (factory).
  - If it needs to appear in sidebar, add it to `navSections` in `navConfig.js` once.
- Copilot: prefer reusing `PAGE_ROUTES`/`NAVIGATION_ITEMS` in new code; avoid duplicating text labels/paths.

## 🧪 Testing

```bash
# Frontend (Vitest)
npm test                  # Watch mode
npm run test:ui          # UI browser
npm run test:coverage    # With coverage

# Backend (pytest)
cd backend
pytest -v --cov=app                    # All tests
pytest -v tests/test_campaigns.py       # Single file
pytest -v -k "test_create_campaign"     # By name
```

**Test Setup:**

- In-memory SQLite DB per test (`backend/tests/conftest.py`)
- Dependency overrides for `get_session`, `get_current_user`
- Fixtures: `test_user`, `test_admin`, `user_token`, `client` (TestClient)
- No live HTTP—use mock/fixture data

## ⚠️ Common Pitfalls

| Issue                           | Fix                                                                                                                               |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **API returns 404**             | (1) Check backend is running `uvicorn app.main:app ...` (2) Verify proxy in vite.config.js (3) Check route is imported in main.py |
| **Toasts don't appear**         | Ensure component renders inside ToastProvider tree (check PostLoginShell wrapper)                                                 |
| **CORS errors in dev**          | Add localhost:3004 to `settings.allowed_origins` in [backend/app/core/config.py](../backend/app/core/config.py#L25-L31)           |
| **SQLite "database is locked"** | Avoid concurrent writes; use Postgres in multi-worker setup; don't use db in multiple threads                                     |
| **Import fails**                | Use path aliases (`@/lib/dataService`) not relative paths; aliases defined in vite.config.js                                      |
| **Query cache stale**           | Call `queryClient.invalidateQueries({queryKey})` after mutations (see TanStack Query docs)                                        |
| **TypeScript errors in stores** | Stores are `.ts` files (campaignStore.ts, leadStore.ts); import types from there                                                  |

## 🚀 Key Files by Task

| Task                         | Start Here                                                                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Add new backend API endpoint | [backend/app/api/routes/](../backend/app/api/routes/) — create or edit domain router, import in main.py                                     |
| Add new frontend page        | [src/pages/](../src/pages/) — create component, lazy-load in App.jsx                                                                        |
| Call AI for new use case     | Add `UseCaseType` enum to [backend/app/integrations/policies.py](../backend/app/integrations/policies.py), create policy, call orchestrator |
| Add DB model                 | [backend/app/models/schemas.py](../backend/app/models/schemas.py) — define SQLModel, add migration                                          |
| Update component library     | [src/components/ui/](../src/components/ui/) — Radix-based primitives                                                                        |
| Configure environment        | [backend/app/core/config.py](../backend/app/core/config.py) — Settings class reads `.env`                                                   |
| Write tests                  | [backend/tests/](../backend/tests/) for backend, [src/**tests**/](../src/__tests__/) for frontend                                           |

## 🔧 Build & Deploy

```bash
# Frontend build
npm run build           # Outputs dist/
npm run type-check      # TypeScript check
npm run preview         # Local preview of production build

# Backend
cd backend && pytest --cov=app  # Coverage report

# Docker (see Dockerfile.frontend, backend/Dockerfile)
docker build -f Dockerfile.frontend -t frontend .
docker build -f backend/Dockerfile -t backend ./backend
docker-compose up      # Full stack (see docker-compose.yml)
```

K8s manifests in [k8s/](../k8s/); Helm chart in [helm/enterprise-app/](../helm/enterprise-app/).

## 📚 Reference

- **AI Orchestrator Deep Dive**: [backend/app/integrations/ai_orchestrator.py](../backend/app/integrations/ai_orchestrator.py) (150+ lines, shows policy routing, budget control, caching)
- **Security Middleware**: [backend/app/core/security.py](../backend/app/core/security.py) (rate limit, JWT, RBAC)
- **Campaign Builder UI**: [src/pages/CampaignBuilder.jsx](../src/pages/CampaignBuilder.jsx) (full example of forms, validation, API calls)
- **Dashboard Stats**: [src/pages/Dashboard.jsx](../src/pages/Dashboard.jsx) (TanStack Query usage, chart rendering)
- **Database Setup**: [backend/app/core/db.py](../backend/app/core/db.py) (connection pooling, async sessions)
