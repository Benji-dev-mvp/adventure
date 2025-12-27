# System Architecture - Backend Connection & Kapa.ai Integration

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          User Browser                                │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                     Frontend (React + Vite)                          │
│                         Port: 3004                                   │
├──────────────────────────────────────────────────────────────────────┤
│  Components:                                                         │
│  • KapaAssistant       - AI help widget (all pages)                 │
│  • SystemHealthDashboard - Real-time monitoring                     │
│  • SystemStatus page    - Full health visualization                 │
├──────────────────────────────────────────────────────────────────────┤
│  Routes:                                                             │
│  • /                    - Landing page                               │
│  • /dashboard           - Main dashboard                             │
│  • /system-status       - System health (NEW)                        │
│  • /api/*              → Proxy to backend                            │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ Vite Dev Proxy
                                │ /api/* → http://localhost:8000
┌───────────────────────────────▼─────────────────────────────────────┐
│                      Backend (FastAPI)                               │
│                        Port: 8000                                    │
├──────────────────────────────────────────────────────────────────────┤
│  Core Endpoints:                                                     │
│  • /health             - Basic liveness check                        │
│  • /health/ready       - Readiness with dependencies                │
│  • /docs               - OpenAPI documentation                       │
│  • /metrics            - Prometheus metrics                          │
├──────────────────────────────────────────────────────────────────────┤
│  API Endpoints:                                                      │
│  • /api/leads          - Lead management                             │
│  • /api/campaigns      - Campaign operations                         │
│  • /api/analytics      - Analytics data                              │
│  • /api/auth           - Authentication                              │
│  • /api/ai             - AI features                                 │
├──────────────────────────────────────────────────────────────────────┤
│  NEW Endpoints:                                                      │
│  • /api/kapa/query     - Query Kapa.ai assistant ───┐               │
│  • /api/kapa/feedback  - Submit feedback            │               │
│  • /api/kapa/status    - Check integration          │               │
│  • /api/system/health  - Full system health         │               │
│  • /api/system/connectivity - Connection test       │               │
│  • /api/system/info    - System capabilities        │               │
└─────────────────────────┬────────────────────────────┼───────────────┘
                          │                            │
         ┌────────────────┼────────────────┐          │
         │                │                │          │
┌────────▼────────┐  ┌───▼────────┐  ┌───▼──────┐   │
│   PostgreSQL    │  │   Redis    │  │  Local   │   │
│   or SQLite     │  │   Cache    │  │  Files   │   │
│                 │  │            │  │          │   │
│ • Leads         │  │ • Sessions │  │ • Logs   │   │
│ • Campaigns     │  │ • Temp Data│  │ • Uploads│   │
│ • Users         │  │            │  │          │   │
└─────────────────┘  └────────────┘  └──────────┘   │
                                                      │
                                 ┌────────────────────▼────────────┐
                                 │    External Services            │
                                 ├─────────────────────────────────┤
                                 │  Kapa.ai API                    │
                                 │  https://api.kapa.ai/           │
                                 │                                 │
                                 │  • Query endpoint               │
                                 │  • Feedback endpoint            │
                                 │  • Project management           │
                                 └─────────────────────────────────┘
```

## Component Details

### Frontend Components

```
src/
├── components/
│   ├── KapaAssistant.jsx              ← NEW: AI help widget
│   ├── SystemHealthDashboard.jsx      ← NEW: Health monitoring
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   └── Input.jsx
│   └── layout/
│       ├── DashboardLayout.jsx
│       └── Sidebar.jsx
├── pages/
│   ├── SystemStatus.jsx               ← NEW: Health page
│   ├── Dashboard.jsx
│   ├── Leads.jsx
│   └── ...
└── lib/
    ├── dataService.js                 - API client
    └── storage.js                     - localStorage utils
```

### Backend Routes

```
backend/app/api/routes/
├── kapa_integration.py         ← NEW: Kapa.ai integration
├── system_health.py            ← NEW: Health monitoring
├── leads.py                    - Lead management
├── campaigns.py                - Campaign operations
├── analytics.py                - Analytics endpoints
├── auth.py                     - Authentication
├── ai.py                       - AI features
└── ...
```

## Data Flow: Kapa.ai Query

```
┌──────────┐
│   User   │ 1. Clicks help icon (?)
└────┬─────┘
     │
     ▼
┌─────────────────────┐
│  KapaAssistant.jsx  │ 2. User types question
└────┬────────────────┘
     │
     ▼ 3. POST /api/kapa/query
┌────────────────────────────┐
│  Backend FastAPI           │
│  /api/kapa/query endpoint  │
└────┬───────────────────────┘
     │
     ▼ 4. Forward to Kapa.ai
┌────────────────────────────┐
│  Kapa.ai API               │
│  https://api.kapa.ai/      │
│  - Process query           │
│  - Search documentation    │
│  - Generate answer         │
└────┬───────────────────────┘
     │
     ▼ 5. Return answer + sources
┌────────────────────────────┐
│  Backend FastAPI           │
│  - Validate response       │
│  - Add metadata            │
└────┬───────────────────────┘
     │
     ▼ 6. JSON response
┌─────────────────────┐
│  KapaAssistant.jsx  │
│  - Display answer   │
│  - Show sources     │
│  - Collect feedback │
└─────────────────────┘
```

## Data Flow: System Health Check

```
┌──────────┐
│   User   │ Visits /system-status
└────┬─────┘
     │
     ▼
┌─────────────────────────┐
│  SystemStatus.jsx       │
│  - Renders page         │
└────┬────────────────────┘
     │
     ▼ GET /api/system/health
┌────────────────────────────────┐
│  Backend /api/system/health    │
│  - Check database              │
│  - Check cache                 │
│  - Check AI provider           │
│  - Check Kapa.ai               │
│  - Get system resources        │
└────┬───────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│  Health Check Functions         │
│  ┌───────────────────────────┐  │
│  │  check_database()         │  │
│  │  • Connect to DB          │  │
│  │  • Execute test query     │  │
│  │  • Measure latency        │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │  check_cache()            │  │
│  │  • Test read/write        │  │
│  │  • Measure latency        │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │  check_kapa_ai()          │  │
│  │  • Verify configuration   │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │  get_system_resources()   │  │
│  │  • CPU usage              │  │
│  │  • Memory usage           │  │
│  │  • Disk usage             │  │
│  └───────────────────────────┘  │
└────┬────────────────────────────┘
     │
     ▼ Return aggregated health data
┌────────────────────────────────┐
│  SystemHealthDashboard.jsx     │
│  - Display overall status      │
│  - Show service statuses       │
│  - Display metrics             │
│  - Auto-refresh (30s)          │
└────────────────────────────────┘
```

## Deployment Architecture

### Development

```
┌─────────────────────────────────────┐
│  Local Development Machine          │
├─────────────────────────────────────┤
│  Terminal 1:                        │
│  npm run dev (port 3004)            │
│                                     │
│  Terminal 2:                        │
│  uvicorn app.main:app (port 8000)  │
│                                     │
│  Database: SQLite (local file)     │
│  Cache: In-memory                   │
└─────────────────────────────────────┘
```

### Docker Compose

```
┌─────────────────────────────────────────┐
│  Docker Host                            │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │  frontend:3000                  │   │
│  │  • Nginx                        │   │
│  │  • React build                  │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  backend:8000                   │   │
│  │  • FastAPI                      │   │
│  │  • Python 3.11                  │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  postgres:5432                  │   │
│  │  • PostgreSQL 15                │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  redis:6379                     │   │
│  │  • Redis 7                      │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Kubernetes

```
┌───────────────────────────────────────────────────────────┐
│  Kubernetes Cluster                                       │
├───────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Ingress Controller                                 │ │
│  │  • NGINX                                            │ │
│  │  • SSL/TLS termination                              │ │
│  │  • yourapp.com → frontend                           │ │
│  │  • api.yourapp.com → backend                        │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌────────────────────────┐  ┌──────────────────────┐   │
│  │  Frontend Deployment   │  │  Backend Deployment  │   │
│  │  • Replicas: 2         │  │  • Replicas: 3       │   │
│  │  • Port: 80            │  │  • Port: 8000        │   │
│  │  • HPA: 2-5 pods       │  │  • HPA: 3-10 pods    │   │
│  └────────────────────────┘  └──────────────────────┘   │
│                                                           │
│  ┌────────────────────────┐  ┌──────────────────────┐   │
│  │  PostgreSQL            │  │  Redis               │   │
│  │  • StatefulSet         │  │  • StatefulSet       │   │
│  │  • Persistent Volume   │  │  • Persistent Volume │   │
│  └────────────────────────┘  └──────────────────────┘   │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Monitoring                                         │ │
│  │  • Prometheus (metrics)                             │ │
│  │  • Grafana (dashboards)                             │ │
│  │  • Sentry (error tracking)                          │ │
│  └─────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌────────────────────────────────────────────┐
│  Request Flow with Security Layers         │
├────────────────────────────────────────────┤
│                                            │
│  1. User Request                           │
│     ↓                                      │
│  2. HTTPS/TLS (SSL Certificate)            │
│     ↓                                      │
│  3. Ingress/Load Balancer                  │
│     ↓                                      │
│  4. Network Policy (K8s)                   │
│     ↓                                      │
│  5. Rate Limiting Middleware               │
│     ↓                                      │
│  6. CORS Validation                        │
│     ↓                                      │
│  7. JWT Authentication (if required)       │
│     ↓                                      │
│  8. Request Size Limit                     │
│     ↓                                      │
│  9. Security Headers                       │
│     ↓                                      │
│  10. API Endpoint                          │
│     ↓                                      │
│  11. Database Query (parameterized)        │
│     ↓                                      │
│  12. Response                              │
│                                            │
└────────────────────────────────────────────┘
```

## Monitoring & Observability

```
┌────────────────────────────────────────────────────────┐
│  Monitoring Stack                                      │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │  Application Metrics                         │    │
│  │  • Request count & latency                   │    │
│  │  • Error rates                               │    │
│  │  • Active connections                        │    │
│  │  • Database query times                      │    │
│  │  • Cache hit rates                           │    │
│  └──────────────────┬───────────────────────────┘    │
│                     │                                 │
│                     ▼                                 │
│  ┌──────────────────────────────────────────────┐    │
│  │  Prometheus                                  │    │
│  │  • Scrape metrics from /metrics             │    │
│  │  • Store time-series data                   │    │
│  │  • Alert on thresholds                      │    │
│  └──────────────────┬───────────────────────────┘    │
│                     │                                 │
│                     ▼                                 │
│  ┌──────────────────────────────────────────────┐    │
│  │  Grafana                                     │    │
│  │  • System health dashboard                  │    │
│  │  • Performance metrics                      │    │
│  │  • Alert notifications                      │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │  Sentry                                      │    │
│  │  • Error tracking                            │    │
│  │  • Stack traces                              │    │
│  │  • User context                              │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │  System Health Dashboard (Custom)            │    │
│  │  • Real-time service status                  │    │
│  │  • System resources (CPU, memory, disk)      │    │
│  │  • Available at /system-status               │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## CI/CD Pipeline

```
┌────────────────────────────────────────────────────────┐
│  GitHub Actions Workflow                               │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Push to main/develop                                 │
│       ↓                                               │
│  ┌────────────────────────────────────┐              │
│  │  Test Phase                        │              │
│  │  • Backend tests (pytest)          │              │
│  │  • Frontend tests (vitest)         │              │
│  │  • Linting (flake8, eslint)        │              │
│  │  • Security scan (Trivy)           │              │
│  └────────────────┬───────────────────┘              │
│                   │ ✓ All pass                       │
│                   ▼                                   │
│  ┌────────────────────────────────────┐              │
│  │  Build Phase                       │              │
│  │  • Build Docker images             │              │
│  │  • Tag with git SHA                │              │
│  │  • Push to GHCR                    │              │
│  └────────────────┬───────────────────┘              │
│                   │                                   │
│                   ▼                                   │
│  ┌────────────────────────────────────┐              │
│  │  Deploy Phase                      │              │
│  │  develop → staging                 │              │
│  │  main → production                 │              │
│  │  • Update Kubernetes deployments   │              │
│  │  • Run database migrations         │              │
│  │  • Smoke tests                     │              │
│  │  • Slack notification              │              │
│  └────────────────────────────────────┘              │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

**Legend:**
- `→` : Data flow
- `↓` : Process flow
- `┌─┐` : Component/Container
- `├─┤` : Section divider
