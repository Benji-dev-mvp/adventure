# Enterprise Deployment Guide

This guide covers deploying the application with all enterprise features enabled.

## Prerequisites

### Required Services
- **PostgreSQL 14+** or **MySQL 8+** (production database)
- **Redis 6+** (caching and message broker)
- **Python 3.10+**
- **Node.js 18+**

### Optional Services
- **Sentry** (error tracking)
- **Datadog/New Relic** (monitoring)
- **Kubernetes** (orchestration)

## Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   React     │────▶│   FastAPI    │────▶│  PostgreSQL │
│  Frontend   │     │   Backend    │     │  Database   │
└─────────────┘     └──────────────┘     └─────────────┘
                            │
                            ▼
                    ┌──────────────┐     ┌─────────────┐
                    │    Redis     │◀────│   Celery    │
                    │   (Broker)   │     │   Workers   │
                    └──────────────┘     └─────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │    Sentry    │
                    │ (Error Track)│
                    └──────────────┘
```

## Quick Start (Development)

### 1. Run Setup Script
```bash
./start-enterprise.sh
```

### 2. Start Services Manually
```bash
# Terminal 1: Backend
cd backend
uvicorn app.main:app --reload --port 8000

# Terminal 2: Celery Worker
cd backend
celery -A app.core.celery_app worker -l info -Q emails,campaigns,analytics

# Terminal 3: Celery Beat
cd backend
celery -A app.core.celery_app beat -l info

# Terminal 4: Frontend
npm run dev
```

## Production Deployment

### Option 1: Docker Compose

#### 1. Create `docker-compose.yml`
```yaml
version: '3.8'

services:
  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: leadgen
      POSTGRES_USER: leadgen
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U leadgen"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://leadgen:${DB_PASSWORD}@db:5432/leadgen
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379/0
      SENTRY_DSN: ${SENTRY_DSN}
      ENVIRONMENT: production
    depends_on:
      - db
      - redis
    ports:
      - "8000:8000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  celery_worker:
    build: ./backend
    command: celery -A app.core.celery_app worker -l info -Q emails,campaigns,analytics
    environment:
      DATABASE_URL: postgresql://leadgen:${DB_PASSWORD}@db:5432/leadgen
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379/0
      SENTRY_DSN: ${SENTRY_DSN}
      ENVIRONMENT: production
    depends_on:
      - db
      - redis

  celery_beat:
    build: ./backend
    command: celery -A app.core.celery_app beat -l info
    environment:
      DATABASE_URL: postgresql://leadgen:${DB_PASSWORD}@db:5432/leadgen
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379/0
    depends_on:
      - redis

  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:
```

#### 2. Create `.env` file
```bash
DB_PASSWORD=your_secure_password
REDIS_PASSWORD=your_redis_password
SENTRY_DSN=https://xxx@sentry.io/xxx
```

#### 3. Deploy
```bash
docker-compose up -d
```

### Option 2: Kubernetes

#### 1. Create Secrets
```bash
kubectl create secret generic app-secrets \
  --from-literal=db-password=your_password \
  --from-literal=redis-password=your_password \
  --from-literal=sentry-dsn=https://xxx@sentry.io/xxx
```

#### 2. Apply Manifests
```bash
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/celery.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/ingress.yaml
```

See `k8s/` directory for example manifests.

### Option 3: Cloud Platforms

#### AWS Elastic Beanstalk
```bash
eb init -p python-3.10 leadgen-backend
eb create production-env
```

#### Google Cloud Run
```bash
gcloud run deploy leadgen-backend \
  --source ./backend \
  --region us-central1 \
  --allow-unauthenticated
```

#### Azure App Service
```bash
az webapp up --name leadgen-backend \
  --runtime PYTHON:3.10 \
  --sku B1
```

## Environment Variables

### Backend Required
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Redis
REDIS_URL=redis://:password@host:6379/0

# Security
SECRET_KEY=your-secret-key-here
ALLOWED_ORIGINS=https://yourdomain.com
ALLOWED_HOSTS=yourdomain.com

# Environment
ENVIRONMENT=production
APP_VERSION=1.0.0
```

### Backend Optional
```bash
# Sentry
SENTRY_DSN=https://xxx@sentry.io/xxx

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# OAuth (for SSO)
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

### Frontend Required
```bash
VITE_API_URL=https://api.yourdomain.com
VITE_ENVIRONMENT=production
```

### Frontend Optional
```bash
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

## Database Setup

### 1. Run Migrations
```bash
cd backend
alembic upgrade head
```

### 2. Create Admin User
```bash
python -c "
from app.models.user import User, UserRole
from app.core.db import engine
from sqlmodel import Session

with Session(engine) as session:
    admin = User(
        email='admin@yourdomain.com',
        name='Admin User',
        hashed_password='$2b$12$...',  # Use proper password hashing
        role=UserRole.ADMIN,
        is_active=True
    )
    session.add(admin)
    session.commit()
"
```

## Security Checklist

### Pre-Production
- [ ] Change all default passwords
- [ ] Set strong SECRET_KEY
- [ ] Configure CORS (ALLOWED_ORIGINS)
- [ ] Enable HTTPS (TLS/SSL)
- [ ] Set up firewall rules
- [ ] Configure rate limiting
- [ ] Enable security headers
- [ ] Set up backup strategy

### Post-Production
- [ ] Monitor error rates (Sentry)
- [ ] Monitor system health
- [ ] Set up alerting (PagerDuty)
- [ ] Review audit logs weekly
- [ ] Update dependencies monthly
- [ ] Conduct security audits quarterly

## Monitoring & Alerting

### Health Checks
```bash
# Simple health check
curl https://api.yourdomain.com/api/health

# Detailed health check
curl https://api.yourdomain.com/api/health/detailed
```

### Sentry Dashboard
- Error tracking
- Performance monitoring
- Release tracking
- User feedback

### Datadog/New Relic
- Application metrics
- Infrastructure monitoring
- Log aggregation
- Custom dashboards

### Alert Rules
- **CPU > 85%** for 5 minutes
- **Memory > 90%** for 5 minutes
- **Disk > 85%**
- **Error rate > 5%**
- **Response time > 2s**
- **Database connections > 90%**

## Scaling

### Horizontal Scaling
```bash
# Scale Celery workers
kubectl scale deployment celery-worker --replicas=5

# Scale backend
kubectl scale deployment backend --replicas=3
```

### Auto-scaling (Kubernetes HPA)
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Database Scaling
- **Read replicas** for read-heavy workloads
- **Connection pooling** (PgBouncer)
- **Partitioning** for large tables
- **Caching** with Redis

### Redis Scaling
- **Redis Cluster** for high availability
- **Sentinel** for automatic failover
- **Separate instances** for cache vs. message broker

## Backup & Disaster Recovery

### Database Backups
```bash
# Daily automated backups
0 2 * * * pg_dump leadgen | gzip > backup_$(date +\%Y\%m\%d).sql.gz

# Restore from backup
gunzip -c backup_20240115.sql.gz | psql leadgen
```

### Redis Backups
```bash
# Enable RDB persistence
redis-cli CONFIG SET save "900 1 300 10 60 10000"

# Manual backup
redis-cli BGSAVE
```

### Application State
- Store file uploads in S3/GCS
- Database for all persistent data
- Redis only for temporary data

## Performance Optimization

### Backend
- Enable response compression (gzip)
- Use database connection pooling
- Implement caching (Redis)
- Optimize database queries (indexes)
- Use async endpoints where possible

### Frontend
- Code splitting (lazy loading)
- Image optimization
- CDN for static assets
- Service worker for offline support
- Bundle size optimization

### Celery
- Set appropriate worker concurrency
- Use dedicated queues for different task types
- Monitor queue depth
- Implement task timeouts
- Retry failed tasks with exponential backoff

## Troubleshooting

### Backend won't start
```bash
# Check logs
docker logs backend

# Check database connection
psql $DATABASE_URL -c "SELECT 1"

# Check Redis connection
redis-cli -u $REDIS_URL ping
```

### Celery workers not processing tasks
```bash
# Check worker status
celery -A app.core.celery_app inspect active

# Check queue length
redis-cli LLEN celery

# Restart workers
docker restart celery-worker
```

### High error rate
- Check Sentry for error details
- Review application logs
- Check system resources
- Verify external service status

## Support

- **Documentation**: https://docs.yourdomain.com
- **API Docs**: https://api.yourdomain.com/docs
- **Support Email**: support@yourdomain.com
- **Status Page**: https://status.yourdomain.com

## License

Proprietary - All Rights Reserved
