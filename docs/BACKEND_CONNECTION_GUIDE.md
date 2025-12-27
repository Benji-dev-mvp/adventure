# Systematic Backend Connection Guide

## Overview

This guide provides comprehensive instructions for connecting the frontend to the backend, monitoring system health, and integrating Kapa.ai for AI-powered documentation support.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Backend Connection Setup](#backend-connection-setup)
3. [System Health Monitoring](#system-health-monitoring)
4. [Kapa.ai Integration](#kapai-integration)
5. [Environment Configuration](#environment-configuration)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

## Architecture Overview

### Frontend-Backend Communication

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend      │
│  React + Vite   │  ────▶  │    FastAPI      │
│  Port: 3004     │  /api/* │   Port: 8000    │
└─────────────────┘         └─────────────────┘
        │                           │
        │                           ▼
        │                   ┌──────────────┐
        │                   │  PostgreSQL  │
        │                   │    or SQLite │
        │                   └──────────────┘
        │                           │
        │                           ▼
        │                   ┌──────────────┐
        └──────────────────▶│    Redis     │
                            │   (Cache)    │
                            └──────────────┘
```

### Key Components

1. **Frontend (React)**
   - Port: 3004
   - Proxy `/api/*` requests to backend
   - Uses `dataService.js` for API calls
   - System health monitoring via `/api/system/health`

2. **Backend (FastAPI)**
   - Port: 8000
   - All endpoints under `/api/*`
   - Health checks at `/health`, `/health/ready`
   - System info at `/api/system/health`, `/api/system/info`

3. **Kapa.ai Integration**
   - AI-powered documentation assistant
   - Endpoints: `/api/kapa/query`, `/api/kapa/feedback`
   - Widget component: `<KapaAssistant />`

## Backend Connection Setup

### 1. Environment Configuration

Create a `.env` file in the `backend/` directory:

```bash
# Database
DATABASE_URL=sqlite:///./data.db
# For PostgreSQL: postgresql://user:password@localhost:5432/appdb

# Redis (optional for caching)
REDIS_URL=redis://localhost:6379/0

# JWT Security
SECRET_KEY=your-secret-key-change-in-production
JWT_ALGORITHM=HS256

# AI Provider (optional)
AI_PROVIDER=mock  # or openai, anthropic
AI_API_KEY=your-api-key-here

# Kapa.ai Integration (optional but recommended)
KAPA_API_KEY=your-kapa-api-key
KAPA_PROJECT_ID=your-kapa-project-id
KAPA_INTEGRATION_ID=webapp
KAPA_WIDGET_ENABLED=true
```

### 2. Install Backend Dependencies

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Initialize Database

```bash
# Run migrations
alembic upgrade head

# (Optional) Seed initial data
python -c "from app.core.db import init_db, seed_if_empty; init_db(); seed_if_empty()"
```

### 4. Start Backend Server

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload --port 8000 --host 0.0.0.0

# Production mode
uvicorn app.main:app --port 8000 --host 0.0.0.0 --workers 4
```

### 5. Verify Backend Connection

Test the backend is running:

```bash
# Health check
curl http://localhost:8000/health

# System info
curl http://localhost:8000/api/system/info

# System health (comprehensive)
curl http://localhost:8000/api/system/health
```

Expected responses:
- `/health` → `{"status": "ok", "timestamp": ...}`
- `/api/system/info` → Detailed system capabilities
- `/api/system/health` → Service status for all components

### 6. Start Frontend

```bash
# From project root
npm install
npm run dev
```

The frontend will automatically proxy `/api/*` requests to `http://localhost:8000`.

### 7. Test Connection

Visit the System Status page:
- Navigate to: `http://localhost:3004/system-status`
- Should show all services as "healthy" (or "degraded" if optional services not configured)

## System Health Monitoring

### Health Check Endpoints

1. **Basic Health Check**
   - Endpoint: `GET /health`
   - Purpose: Simple alive check
   - Returns: `{"status": "ok", "timestamp": ...}`

2. **Readiness Check**
   - Endpoint: `GET /health/ready`
   - Purpose: Verify dependencies (DB, cache)
   - Returns: Status of each service

3. **Comprehensive System Health**
   - Endpoint: `GET /api/system/health`
   - Purpose: Full system status with metrics
   - Returns: Service status, response times, system resources

4. **System Information**
   - Endpoint: `GET /api/system/info`
   - Purpose: Capabilities and configuration
   - Returns: Features, providers, endpoints

### Frontend Health Dashboard

Access the System Status page at `/system-status` to view:
- Overall system status (healthy/degraded/unhealthy)
- Individual service health (database, cache, AI, Kapa.ai)
- System resources (CPU, memory, disk usage)
- Service response times
- Auto-refresh every 30 seconds

### Monitoring Integration

The health endpoints are designed for:
- **Kubernetes liveness probes**: `/health`
- **Kubernetes readiness probes**: `/health/ready`
- **Prometheus metrics**: `/metrics`
- **Custom monitoring**: `/api/system/health`

## Kapa.ai Integration

### What is Kapa.ai?

Kapa.ai provides AI-powered documentation search and support, allowing users to ask questions and get instant answers based on your documentation and knowledge base.

### Setup

1. **Create Kapa.ai Account**
   - Visit: https://www.kapa.ai/
   - Sign up and create a project
   - Connect your documentation sources (GitHub, Notion, etc.)

2. **Get API Credentials**
   - Navigate to API Keys section
   - Create a new API key
   - Note your Project ID and Integration ID

3. **Configure Backend**
   
   Add to `backend/.env`:
   ```bash
   KAPA_API_KEY=your-kapa-api-key
   KAPA_PROJECT_ID=your-kapa-project-id
   KAPA_INTEGRATION_ID=webapp
   KAPA_WIDGET_ENABLED=true
   ```

4. **Verify Integration**
   
   ```bash
   curl http://localhost:8000/api/kapa/status
   ```
   
   Should return:
   ```json
   {
     "configured": true,
     "project_id": "your-project-id",
     "status": "operational"
   }
   ```

### Using Kapa.ai in Frontend

The `<KapaAssistant />` component is automatically available on all pages:

1. **Click the help icon** in the bottom-right corner
2. **Ask a question** about the application
3. **Get AI-powered answers** with source citations
4. **Provide feedback** (thumbs up/down) to improve accuracy

Example queries:
- "How do I create a campaign?"
- "What integrations are available?"
- "How do I manage my leads?"

### Kapa.ai API Endpoints

1. **Query Kapa.ai**
   ```bash
   POST /api/kapa/query
   {
     "query": "How do I create a campaign?",
     "integration_id": "webapp",
     "thread_id": null  # for conversation continuity
   }
   ```

2. **Submit Feedback**
   ```bash
   POST /api/kapa/feedback
   {
     "thread_id": "...",
     "helpful": true,
     "comment": "Very helpful!"
   }
   ```

3. **Check Status**
   ```bash
   GET /api/kapa/status
   ```

## Environment Configuration

### Development Environment

```bash
# backend/.env
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=DEBUG
DATABASE_URL=sqlite:///./data.db
AI_PROVIDER=mock
```

### Staging Environment

```bash
# backend/.env
ENVIRONMENT=staging
DEBUG=false
LOG_LEVEL=INFO
DATABASE_URL=postgresql://user:password@staging-db:5432/appdb
REDIS_URL=redis://staging-redis:6379/0
AI_PROVIDER=openai
AI_API_KEY=your-openai-api-key
KAPA_API_KEY=your-kapa-api-key
KAPA_PROJECT_ID=your-project-id
```

### Production Environment

```bash
# backend/.env
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=WARNING
DATABASE_URL=postgresql://user:password@prod-db:5432/appdb
REDIS_URL=redis://prod-redis:6379/0
SECRET_KEY=strong-random-secret-key
AI_PROVIDER=openai
AI_API_KEY=your-openai-api-key
KAPA_API_KEY=your-kapa-api-key
KAPA_PROJECT_ID=your-project-id
SENTRY_DSN=your-sentry-dsn
```

## Deployment

See:
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Full deployment instructions
- [Upgrade Guide](./UPGRADE_GUIDE.md) - Version upgrade procedures

Quick deployment options:
1. **Docker Compose** - `docker-compose up -d`
2. **Kubernetes** - `kubectl apply -f k8s/deployment.yaml`
3. **Helm Chart** - `helm install artisan ./helm/enterprise-app`

## Troubleshooting

### Frontend Cannot Connect to Backend

**Symptoms**: API calls fail, 404 errors on `/api/*` endpoints

**Solutions**:
1. Verify backend is running: `curl http://localhost:8000/health`
2. Check Vite proxy configuration in `vite.config.js`
3. Ensure CORS is configured correctly in `backend/app/main.py`
4. Check browser console for CORS errors

### Database Connection Failed

**Symptoms**: Backend health check shows database unhealthy

**Solutions**:
1. Verify `DATABASE_URL` in `.env`
2. For PostgreSQL: Ensure database exists and is accessible
3. For SQLite: Check file permissions on `data.db`
4. Run migrations: `alembic upgrade head`

### Kapa.ai Not Working

**Symptoms**: Help assistant shows error, `/api/kapa/status` shows not configured

**Solutions**:
1. Verify `KAPA_API_KEY` and `KAPA_PROJECT_ID` are set
2. Test API key: `curl -H "X-API-KEY: your-key" https://api.kapa.ai/...`
3. Check Kapa.ai project is active and has sources
4. Review backend logs for API errors

### System Health Shows Services Degraded

**Symptoms**: `/api/system/health` shows degraded status

**Analysis**:
- **Database degraded**: Connection slow or intermittent
- **Cache degraded**: Redis not available (uses in-memory fallback)
- **AI provider degraded**: Not configured (uses mock)
- **Kapa.ai degraded**: Not configured (optional service)

**Action**: Review which services are critical for your deployment and configure accordingly.

### High CPU/Memory Usage

**Symptoms**: System resources show high utilization

**Solutions**:
1. Check number of uvicorn workers
2. Review database connection pool settings
3. Monitor slow queries and optimize
4. Consider horizontal scaling (add more instances)
5. Check for memory leaks in long-running processes

## Next Steps

1. Review [API Documentation](http://localhost:8000/docs) for full endpoint reference
2. Set up [Monitoring & Observability](./MONITORING.md)
3. Configure [Production Deployment](./DEPLOYMENT_GUIDE.md)
4. Implement [Backup & Recovery](./BACKUP_RECOVERY.md)
5. Review [Security Best Practices](./SECURITY.md)
