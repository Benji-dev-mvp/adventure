# Artisan Platform - AI Coding Agent Instructions

## Quick Start
```bash
# Frontend (port 3004)
npm install && npm run dev

# Backend (port 8000) - run from backend/ directory
cd backend && python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
```

## Architecture
- **Frontend**: React 18 + Vite + TanStack Query + Zustand, proxies `/api` to backend
- **Backend**: FastAPI + SQLModel ORM, SQLite (dev) / PostgreSQL (prod)
- **Path Aliases**: Use `@/` for `src/`, `@components/`, `@lib/`, `@pages/` (see [vite.config.js](vite.config.js))

## Key Patterns

### Frontend
- **Toasts**: `useToast()` from `@/components/Toast` → `toast.success()`, `toast.error()`, etc.
- **Validation**: `validateRequired()`, `validateEmail()` from `@lib/validation.js` return booleans
- **Storage**: `storage.get/set()` from `@lib/storage.js` uses `artisan_` prefix in localStorage
- **Loading**: `<PageLoader />` for full-page, `<InlineLoader />` for inline states
- **Providers**: [src/app/providers.tsx](src/app/providers.tsx) wraps QueryClient → Theme → Toast (order matters)
- **Pages**: Lazy-loaded in [src/App.jsx](src/App.jsx) via `React.lazy()` for code splitting

### Backend
- **DB Sessions**: Use `session: Session = Depends(get_session)` — NOT `get_db`
- **Sanitization**: `sanitize_text()` from `app/core/security` for user text fields
- **Routes**: Group by domain in `backend/app/api/routes/`, register in [main.py](backend/app/main.py)
- **Middleware Stack**: CORS → TrustedHost → SecurityHeaders → RateLimit → RequestID

### API Pattern
```python
# backend/app/api/routes/campaigns.py
from app.core.db import get_session
from app.core.security import sanitize_text

@router.post("/campaigns", status_code=status.HTTP_201_CREATED)
def create_campaign(payload: CampaignCreate, session: Session = Depends(get_session)):
    data = payload.dict()
    data["name"] = sanitize_text(data.get("name", ""))
    campaign = Campaign(**data)
    session.add(campaign)
    session.commit()
    return campaign
```

## Testing
```bash
npm test                           # Frontend - Vitest
cd backend && pytest -v --cov=app  # Backend - pytest
npx playwright test                # E2E
```
- Backend tests use in-memory SQLite via [conftest.py](backend/tests/conftest.py)
- Override auth with `app.dependency_overrides[get_current_user] = lambda: mock_user`

## Common Issues
| Issue | Fix |
|-------|-----|
| API 404 | Vite proxy requires backend on port 8000 |
| Toast not showing | Verify `<ToastProvider>` in providers.tsx |
| CORS error | Add origin to `settings.allowed_origins` in config.py |
| DB locks (SQLite) | Use PostgreSQL for concurrent writes |

## Project Structure
```
src/
├── pages/           # Full-page components (lazy-loaded)
├── components/ui/   # Radix-based primitives (Button, Card, Dialog)
├── lib/             # dataService.js, validation.js, storage.js
└── app/             # providers.tsx, router.tsx

backend/app/
├── api/routes/      # Domain-grouped endpoints
├── core/            # db.py, security.py, config.py, cache.py
└── models/          # SQLModel schemas
```

## Deployment
- `npm run build && npm run type-check` for frontend
- Docker: [Dockerfile.frontend](Dockerfile.frontend), [backend/Dockerfile](backend/Dockerfile)
- K8s manifests in `k8s/`, Helm charts in `helm/enterprise-app/`
