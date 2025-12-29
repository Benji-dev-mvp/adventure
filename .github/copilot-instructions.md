# Artisan AI BDR Platform - Copilot Instructions

An AI-powered Business Development Representative (BDR) SaaS platform with React/Vite frontend and FastAPI backend.

## Quick Start
```bash
# Frontend (port 3004)
npm install && npm run dev

# Backend (port 8000) - must run from backend/ directory
cd backend && python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
```

## Architecture Overview
- **Frontend**: React 18 + Vite + TanStack Query + Zustand state, Radix UI primitives
- **Backend**: FastAPI + SQLModel ORM, SQLite (dev) / PostgreSQL (prod)
- **AI Layer**: Policy-based orchestrator ([ai_orchestrator.py](../backend/app/integrations/ai_orchestrator.py)) with multi-provider support, budget management, and caching
- **API Communication**: Vite proxies `/api/*` → `localhost:8000/api` (see [vite.config.js](../vite.config.js#L19-L24))
- **Path Aliases**: `@/` → `src/`, `@components/` → `src/components/`, `@lib/` → `src/lib/`, `@pages/` → `src/pages/`, `@hooks/` → `src/hooks/`

## Critical Patterns

### Frontend State & Data Flow
```typescript
// Zustand stores with immer middleware for campaigns, leads, UI state
import { useCampaignStore } from '@/stores/campaignStore';
const { campaigns, addCampaign } = useCampaignStore();

// TanStack Query for server state - always use queryClient from @lib/queryClient
import { useQuery, useMutation } from '@tanstack/react-query';
const { data, isLoading } = useQuery({ queryKey: ['campaigns'], queryFn: fetchCampaigns });

// dataService.js handles all HTTP - uses fetch with API_BASE from VITE_API_URL env
import { getCampaigns, createCampaign } from '@lib/dataService';
```

### Toasts (User Feedback)
```javascript
// Toast context must be inside ToastProvider (see providers.tsx)
import { useToast } from '@/components/Toast';
const toast = useToast();
toast.success('Campaign launched!'); // Auto-dismiss after 5s
toast.error('Failed to save'); 
toast.info('Processing...'); // Other variants: warning
```

### Backend DB & Security
```python
# ALWAYS use get_session (NOT get_db) for database access
from app.core.db import get_session
from app.core.security import sanitize_text
from sqlmodel import Session, select

@router.post("/campaigns", status_code=status.HTTP_201_CREATED)
def create_campaign(payload: CampaignCreate, session: Session = Depends(get_session)):
    data = payload.dict()
    data["name"] = sanitize_text(data.get("name", ""))  # Strip HTML/JS from user input
    campaign = Campaign(**data)
    session.add(campaign)
    session.commit()
    session.refresh(campaign)  # Get DB-assigned ID
    return campaign
```

### Provider Hierarchy (Order Matters!)
```tsx
// src/app/providers.tsx - DO NOT reorder, breaks context dependencies
<QueryClientProvider> {/* Data fetching layer */}
  <ThemeProvider> {/* Dark/light mode */}
    <TenantProvider> {/* Segment-aware behavior */}
      <ToastProvider> {/* Notifications */}
        {children}
      </ToastProvider>
    </TenantProvider>
  </ThemeProvider>
</QueryClientProvider>
```

### AI Integration Pattern
```python
# Use AIOrchestrator for all LLM calls - handles routing, caching, budgets
from app.integrations.ai_orchestrator import AIOrchestrator, OrchestrationContext

orchestrator = AIOrchestrator()  # Loads ai_config.yaml
result = await orchestrator.execute(
    use_case="email_generation",  # Routes to policy in policies.py
    prompt="Write cold email...",
    context=OrchestrationContext(user_id="u123", org_id="org456"),
    stream=False  # Set True for SSE streaming
)
# Returns: content, provider_response, policy_used, cached, budget_remaining
```

## Testing
```bash
npm test                           # Frontend (Vitest) - jsdom env
cd backend && pytest -v --cov=app  # Backend (pytest) - in-memory SQLite
npx playwright test                # E2E browser tests
```

**Test Fixtures**: [backend/tests/conftest.py](../backend/tests/conftest.py) creates in-memory SQLite, overrides `get_session` dependency
```python
# Override auth in tests
from app.core.security import get_current_user
app.dependency_overrides[get_current_user] = lambda: User(id=1, email="test@test.com")
```

## Key Conventions
| Category | Pattern | Why |
|----------|---------|-----|
| **Storage** | `storage.get/set()` from `@lib/storage.js` prefixes all keys with `artisan_` | Namespace isolation in localStorage |
| **Validation** | `validateRequired()`, `validateEmail()` from `@lib/validation.js` return booleans | Consistent validation across forms |
| **Loading UI** | `<PageLoader />` for pages, `<InlineLoader />` for buttons/sections | Unified loading experience |
| **Route Registration** | Domain-grouped routers in `backend/app/api/routes/`, imported in [main.py](../backend/app/main.py#L8-L36) | Modular API organization |
| **Middleware Order** | CORS → TrustedHost → SecurityHeaders → RateLimit → RequestID ([main.py](../backend/app/main.py#L66-L79)) | Security layers applied correctly |
| **Lazy Loading** | Pages use `React.lazy()` in [App.jsx](../src/App.jsx) | Code splitting per route |

## Common Pitfalls
| Issue | Root Cause | Fix |
|-------|------------|-----|
| API returns 404 | Backend not running or proxy misconfigured | Ensure backend on port 8000, check [vite.config.js](../vite.config.js#L19-L24) proxy |
| Toast doesn't appear | `useToast()` called outside `<ToastProvider>` | Verify [providers.tsx](../src/app/providers.tsx#L28) wraps app |
| CORS error | Origin not whitelisted | Add origin to `settings.allowed_origins` in [config.py](../backend/app/core/config.py) |
| DB locks (SQLite) | Concurrent writes to SQLite | Use PostgreSQL for production (connection pooling in [db.py](../backend/app/core/db.py#L13-L27)) |
| Import path error | Relative import instead of alias | Use `@/` prefix (e.g., `@/components/Button` not `../components/Button`) |

## Project Structure
```
src/
├── pages/           # Full routes (lazy-loaded)
├── components/ui/   # Radix primitives (Button, Card, Dialog, Toast)
├── lib/             # dataService.js, validation.js, storage.js, queryClient.js
├── stores/          # Zustand stores (campaignStore.ts, leadStore.ts, uiStore.ts)
├── app/             # providers.tsx, router setup
├── ai/              # AI-related frontend components
└── hooks/           # Custom React hooks

backend/app/
├── api/routes/      # Domain routers (campaigns.py, leads.py, ai.py, ...)
├── core/            # db.py, security.py, config.py, cache.py, metrics.py
├── integrations/    # ai_orchestrator.py, providers/, memory_manager.py, rag_manager.py
├── models/          # SQLModel schemas (schemas.py, user.py)
├── services/        # Business logic services
└── tasks/           # Background task definitions

tests/               # Backend pytest tests
e2e/                 # Playwright E2E tests
```

## Deployment & DevOps
```bash
npm run build && npm run type-check  # Frontend production build
docker build -f Dockerfile.frontend -t frontend .
docker build -f backend/Dockerfile -t backend ./backend
```
- **Kubernetes**: Manifests in [k8s/](../k8s/), Helm chart in [helm/enterprise-app/](../helm/enterprise-app/)
- **Docker Compose**: [docker-compose.yml](../docker-compose.yml) for local multi-service orchestration
- **Nginx**: Config in [nginx.conf](../nginx.conf) for reverse proxy
