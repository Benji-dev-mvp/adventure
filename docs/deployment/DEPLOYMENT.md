# Enterprise Production Deployment Guide

## Quick Start

### Local Development
```bash
# Frontend
npm install
npm start

# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Docker Deployment
```bash
# Build and run all services
docker-compose up --build

# Production build
docker-compose -f docker-compose.prod.yml up -d
```

## Architecture Overview

### Backend Stack
- **FastAPI**: Async web framework with automatic OpenAPI docs
- **SQLModel**: Type-safe ORM with Pydantic validation
- **Structured Logging**: JSON logs with correlation IDs
- **Connection Pooling**: Optimized DB connections with health checks
- **Rate Limiting**: In-memory (Redis-ready) request throttling
- **Caching**: TTL-based response caching
- **Security**: CORS, CSP, request size limits, input sanitization

### Frontend Stack
- **React 18**: With concurrent features
- **Vite**: Lightning-fast HMR and optimized builds
- **TailwindCSS**: Utility-first styling with custom theme
- **Error Boundaries**: Graceful error handling with recovery
- **Performance Monitoring**: Web Vitals tracking
- **Offline Detection**: Network status awareness

## Production Checklist

### Environment Variables

#### Backend (.env)
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
AI_PROVIDER=openai
AI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
LOG_LEVEL=INFO
CACHE_TTL=300
DB_POOL_SIZE=10
DB_MAX_OVERFLOW=20
MAX_REQUEST_BODY_SIZE=1048576
ENABLE_HTTPS_REDIRECT=true
```

#### Frontend (.env.production)
```bash
VITE_API_URL=https://api.yourdomain.com/api
VITE_SENTRY_DSN=https://...
VITE_GA_ID=G-...
```

### Security Hardening

1. **Enable HTTPS** everywhere
2. **Set secure CORS origins** in `backend/app/core/config.py`
3. **Add API authentication** (JWT/OAuth2)
4. **Enable rate limiting** per user/IP
5. **Add input validation** on all endpoints
6. **Implement RBAC** for multi-tenant access
7. **Regular security audits** and dependency updates

### Performance Optimization

#### Backend
- [ ] Switch to PostgreSQL/MySQL for production
- [ ] Add Redis for caching and sessions
- [ ] Enable connection pooling (configured)
- [ ] Add CDN for static assets
- [ ] Implement database indexing
- [ ] Use async DB queries everywhere
- [ ] Add response compression

#### Frontend
- [ ] Enable code splitting
- [ ] Lazy load routes and components
- [ ] Optimize images (WebP, lazy loading)
- [ ] Use service workers for offline support
- [ ] Implement virtual scrolling for long lists
- [ ] Add skeleton loaders
- [ ] Minify and tree-shake in production

### Observability

#### Logging
```python
import logging
logger = logging.getLogger(__name__)
logger.info("Event occurred", extra={"user_id": 123, "action": "login"})
```

#### Monitoring Integrations
- **Sentry**: Error tracking and performance monitoring
- **Datadog/New Relic**: APM and infrastructure monitoring
- **Google Analytics**: User behavior tracking
- **Prometheus**: Metrics collection
- **Grafana**: Dashboards and alerting

#### Health Checks
- `GET /health` - Basic liveness probe
- `GET /health/ready` - Readiness check with dependencies
- Configure in Kubernetes/ECS for orchestration

### Scaling Strategy

#### Horizontal Scaling
```yaml
# kubernetes deployment
replicas: 3
resources:
  requests:
    memory: "256Mi"
    cpu: "100m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

#### Load Balancing
- Use nginx/HAProxy for L7 load balancing
- Enable session affinity for WebSocket
- Configure health check endpoints

#### Database Scaling
- Read replicas for analytics queries
- Connection pooling (already configured)
- Query optimization and indexing
- Consider sharding for multi-tenant

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          npm test
          cd backend && pytest

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          docker-compose -f docker-compose.prod.yml up -d
```

### Backup Strategy
- **Database**: Daily automated backups with 30-day retention
- **User uploads**: S3/CloudStorage with versioning
- **Configuration**: Version control (Git)
- **Disaster recovery**: Documented runbooks

## API Documentation

Access interactive API docs at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Testing

### Backend Tests
```bash
cd backend
pytest
pytest --cov=app --cov-report=html
```

### Frontend Tests
```bash
npm test
npm run test:e2e
```

### Load Testing
```bash
# Using Apache Bench
ab -n 10000 -c 100 http://localhost:8000/health

# Using k6
k6 run loadtest.js
```

## Troubleshooting

### High Memory Usage
- Check for memory leaks with profiling
- Adjust connection pool sizes
- Enable response streaming for large payloads

### Slow Queries
- Add database indexes
- Use query explain plans
- Implement caching layer
- Consider materialized views

### Rate Limit Issues
- Tune limits in `RequestSizeLimitMiddleware`
- Upgrade to Redis-backed rate limiting
- Implement user-based quotas

## Support & Maintenance

### Log Locations
- Backend: JSON logs to stdout (captured by container orchestrator)
- Frontend: Browser console + Sentry
- Nginx: `/var/log/nginx/`

### Monitoring Dashboards
- Application metrics: Grafana
- Error tracking: Sentry
- User analytics: Google Analytics

### Security Updates
```bash
# Backend
pip list --outdated
pip install -U package-name

# Frontend
npm outdated
npm update
```

## License
MIT
