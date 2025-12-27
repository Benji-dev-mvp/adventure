# Application Upgrade Guide

## Overview

This guide covers upgrading both frontend and backend components of the Artisan platform, including version management, database migrations, and rollback procedures.

## Table of Contents

1. [Version Strategy](#version-strategy)
2. [Pre-Upgrade Checklist](#pre-upgrade-checklist)
3. [Frontend Upgrades](#frontend-upgrades)
4. [Backend Upgrades](#backend-upgrades)
5. [Database Migrations](#database-migrations)
6. [Rollback Procedures](#rollback-procedures)
7. [Zero-Downtime Upgrades](#zero-downtime-upgrades)

## Version Strategy

### Semantic Versioning

We follow [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (e.g., 1.0.0 → 2.0.0)
- **MINOR**: New features, backwards compatible (e.g., 1.0.0 → 1.1.0)
- **PATCH**: Bug fixes, backwards compatible (e.g., 1.0.0 → 1.0.1)

### Release Channels

- **Stable**: Production-ready releases (e.g., v1.0.0)
- **Beta**: Pre-release testing (e.g., v1.1.0-beta.1)
- **Development**: Latest development (main branch)

## Pre-Upgrade Checklist

Before upgrading, complete these steps:

### 1. Review Release Notes

```bash
# Check GitHub releases
https://github.com/your-org/artisan/releases

# Review changelog
cat CHANGELOG.md
```

### 2. Backup Database

```bash
# PostgreSQL backup
kubectl exec -it postgresql-0 -n artisan -- \
  pg_dump -U artisan artisan | gzip > backup-pre-upgrade-$(date +%Y%m%d).sql.gz

# Or using Docker
docker-compose exec postgres pg_dump -U artisan artisan | gzip > backup.sql.gz
```

### 3. Backup Application Data

```bash
# Backup configuration
kubectl get configmaps -n artisan -o yaml > configmaps-backup.yaml
kubectl get secrets -n artisan -o yaml > secrets-backup.yaml

# Backup persistent volumes
kubectl get pvc -n artisan -o yaml > pvc-backup.yaml
```

### 4. Test in Staging

```bash
# Deploy to staging first
helm upgrade artisan-staging ./helm/enterprise-app \
  --namespace staging \
  --values helm/values-staging.yaml
```

### 5. Schedule Maintenance Window

For major upgrades:
- Notify users in advance
- Plan during low-traffic period
- Prepare rollback plan

## Frontend Upgrades

### Update Dependencies

```bash
# Check for outdated packages
npm outdated

# Update package.json
npm update

# Or update specific packages
npm update react react-dom
npm update vite

# Install new dependencies
npm install
```

### Build New Version

```bash
# Run tests
npm test

# Build production bundle
npm run build

# Verify build
npm run preview
```

### Deploy Frontend

#### Docker

```bash
# Build new image
docker build -t artisan-frontend:v1.1.0 -f Dockerfile.frontend .

# Tag as latest
docker tag artisan-frontend:v1.1.0 artisan-frontend:latest

# Push to registry
docker push your-registry/artisan-frontend:v1.1.0
docker push your-registry/artisan-frontend:latest

# Update docker-compose
docker-compose pull frontend
docker-compose up -d frontend
```

#### Kubernetes

```bash
# Update deployment with new image
kubectl set image deployment/frontend \
  frontend=your-registry/artisan-frontend:v1.1.0 \
  -n artisan

# Monitor rollout
kubectl rollout status deployment/frontend -n artisan

# Verify deployment
kubectl get pods -n artisan -l app=frontend
```

#### Helm

```bash
# Update values.yaml
image:
  frontend:
    tag: "v1.1.0"

# Upgrade release
helm upgrade artisan ./helm/enterprise-app \
  --namespace artisan \
  --values helm/values-production.yaml

# Check status
helm status artisan -n artisan
```

### Verify Frontend

```bash
# Check version endpoint (if implemented)
curl https://yourapp.com/version

# Test critical pages
curl https://yourapp.com/
curl https://yourapp.com/dashboard

# Check browser console for errors
# Visit https://yourapp.com and open Developer Tools
```

## Backend Upgrades

### Update Dependencies

```bash
cd backend

# Check for outdated packages
pip list --outdated

# Update requirements.txt with new versions
# Then install
pip install -r requirements.txt

# Or update specific packages
pip install --upgrade fastapi uvicorn
```

### Run Tests

```bash
# Unit tests
pytest tests/ -v

# Integration tests
pytest tests/integration/ -v

# Coverage
pytest --cov=app tests/
```

### Build New Version

```bash
# Build Docker image
docker build -t artisan-backend:v1.1.0 ./backend

# Tag as latest
docker tag artisan-backend:v1.1.0 artisan-backend:latest

# Push to registry
docker push your-registry/artisan-backend:v1.1.0
docker push your-registry/artisan-backend:latest
```

### Database Migrations

**IMPORTANT**: Run migrations before deploying new backend version.

```bash
# Generate migration (if schema changed)
cd backend
alembic revision --autogenerate -m "Upgrade v1.1.0 schema"

# Review generated migration
cat alembic/versions/xxxx_upgrade_v1_1_0_schema.py

# Test migration on staging
alembic upgrade head

# Create migration job for production
kubectl apply -f - <<EOF
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migration-v1-1-0
  namespace: artisan
spec:
  template:
    spec:
      containers:
      - name: migration
        image: your-registry/artisan-backend:v1.1.0
        command: ["alembic", "upgrade", "head"]
        envFrom:
        - configMapRef:
            name: backend-config
        - secretRef:
            name: backend-secrets
      restartPolicy: OnFailure
  backoffLimit: 3
EOF

# Monitor migration
kubectl logs -f job/db-migration-v1-1-0 -n artisan
```

### Deploy Backend

#### Docker

```bash
# Update docker-compose.yml with new image tag
services:
  backend:
    image: your-registry/artisan-backend:v1.1.0

# Pull and restart
docker-compose pull backend
docker-compose up -d backend

# Check logs
docker-compose logs -f backend
```

#### Kubernetes (Rolling Update)

```bash
# Update deployment
kubectl set image deployment/backend \
  backend=your-registry/artisan-backend:v1.1.0 \
  -n artisan

# Monitor rollout
kubectl rollout status deployment/backend -n artisan

# Check pods
kubectl get pods -n artisan -l app=backend

# View logs
kubectl logs -f deployment/backend -n artisan
```

#### Kubernetes (Blue-Green Deployment)

```bash
# Create new deployment (green)
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-green
  namespace: artisan
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
      version: green
  template:
    metadata:
      labels:
        app: backend
        version: green
    spec:
      containers:
      - name: backend
        image: your-registry/artisan-backend:v1.1.0
        # ... rest of spec
EOF

# Test green deployment
kubectl port-forward deployment/backend-green 8080:8000 -n artisan
curl http://localhost:8080/health

# Switch service to green
kubectl patch service backend -n artisan -p \
  '{"spec":{"selector":{"version":"green"}}}'

# Monitor for issues, then delete blue
kubectl delete deployment backend-blue -n artisan
```

### Verify Backend

```bash
# Health check
curl https://api.yourapp.com/health

# System health
curl https://api.yourapp.com/api/system/health

# Check version
curl https://api.yourapp.com/api/system/info

# API docs
open https://api.yourapp.com/docs
```

## Database Migrations

### Creating Migrations

```bash
cd backend

# Auto-generate from model changes
alembic revision --autogenerate -m "Add new feature table"

# Manual migration
alembic revision -m "Custom data migration"

# Edit the generated file
vim alembic/versions/xxxx_add_new_feature_table.py
```

### Migration Best Practices

1. **Always review auto-generated migrations**
2. **Test migrations on staging data**
3. **Make migrations reversible** (implement downgrade)
4. **Backup before migrating**
5. **Don't mix schema and data changes**

### Example Migration

```python
# alembic/versions/xxxx_add_feature.py
from alembic import op
import sqlalchemy as sa

def upgrade():
    # Schema change
    op.add_column('users', sa.Column('new_field', sa.String(255)))
    
    # Data migration
    op.execute("""
        UPDATE users 
        SET new_field = 'default_value' 
        WHERE new_field IS NULL
    """)

def downgrade():
    # Reverse the changes
    op.drop_column('users', 'new_field')
```

### Running Migrations

```bash
# Development
alembic upgrade head

# Production (using kubectl)
kubectl exec -it deployment/backend -n artisan -- \
  alembic upgrade head

# Production (using Job - recommended)
# See "Deploy Backend" section above
```

### Migration Rollback

```bash
# Rollback last migration
alembic downgrade -1

# Rollback to specific version
alembic downgrade <revision_id>

# Rollback all migrations
alembic downgrade base
```

## Rollback Procedures

### Immediate Rollback (Emergency)

If critical issues are detected:

#### Docker Compose

```bash
# Rollback to previous image
docker-compose down
docker-compose up -d --scale backend=0  # Stop backend

# Edit docker-compose.yml to use previous version
services:
  backend:
    image: your-registry/artisan-backend:v1.0.0

# Restart
docker-compose up -d
```

#### Kubernetes

```bash
# Rollback deployment
kubectl rollout undo deployment/backend -n artisan

# Rollback to specific revision
kubectl rollout undo deployment/backend --to-revision=2 -n artisan

# Check rollback status
kubectl rollout status deployment/backend -n artisan
```

#### Helm

```bash
# Rollback to previous release
helm rollback artisan -n artisan

# Rollback to specific revision
helm rollback artisan 2 -n artisan

# Check status
helm status artisan -n artisan
```

### Database Rollback

```bash
# Rollback one migration
alembic downgrade -1

# Using kubectl
kubectl exec -it deployment/backend -n artisan -- \
  alembic downgrade -1

# Using migration job
kubectl apply -f - <<EOF
apiVersion: batch/v1
kind: Job
metadata:
  name: db-rollback
  namespace: artisan
spec:
  template:
    spec:
      containers:
      - name: rollback
        image: your-registry/artisan-backend:v1.0.0
        command: ["alembic", "downgrade", "-1"]
        envFrom:
        - configMapRef:
            name: backend-config
        - secretRef:
            name: backend-secrets
      restartPolicy: OnFailure
EOF
```

### Restore from Backup

If rollback isn't sufficient:

```bash
# Restore database
kubectl exec -i postgresql-0 -n artisan -- \
  psql -U artisan artisan < backup-pre-upgrade.sql

# Restore configuration
kubectl apply -f configmaps-backup.yaml
kubectl apply -f secrets-backup.yaml

# Restart pods to pick up restored config
kubectl rollout restart deployment/backend -n artisan
kubectl rollout restart deployment/frontend -n artisan
```

## Zero-Downtime Upgrades

### Strategy Overview

1. **Rolling updates** - Gradual pod replacement
2. **Blue-Green deployment** - Two full environments
3. **Canary deployment** - Gradual traffic shift

### Rolling Update (Default Kubernetes)

```yaml
# In k8s/deployment.yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Max pods above desired count
      maxUnavailable: 0  # Keep all pods running during update
```

### Canary Deployment

```bash
# 1. Deploy canary version (10% of pods)
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-canary
  namespace: artisan
spec:
  replicas: 1  # 10% of 10 total pods
  selector:
    matchLabels:
      app: backend
      version: canary
  template:
    metadata:
      labels:
        app: backend
        version: canary
    spec:
      containers:
      - name: backend
        image: your-registry/artisan-backend:v1.1.0
        # ... rest of spec
EOF

# 2. Monitor canary metrics
kubectl logs -f deployment/backend-canary -n artisan

# Check error rates in monitoring dashboard

# 3. Gradually increase canary traffic
# Scale canary: 1 → 3 → 5 → 10 pods
# Scale stable: 10 → 7 → 5 → 0 pods

# 4. Promote canary to stable
kubectl delete deployment backend-stable -n artisan
kubectl scale deployment backend-canary --replicas=10 -n artisan

# 5. Rename canary to stable
kubectl patch deployment backend-canary -n artisan -p \
  '{"metadata":{"name":"backend-stable"}}'
```

### Database Schema Compatibility

For zero-downtime, ensure schema changes are backwards compatible:

1. **Add columns as nullable** (can be made required later)
2. **Keep old columns** until all instances upgraded
3. **Use two-phase migrations**:
   - Phase 1: Add new schema, keep old
   - Deploy new code
   - Phase 2: Remove old schema

Example:

```python
# Migration 1: Add new column (nullable)
def upgrade():
    op.add_column('users', sa.Column('email_verified', sa.Boolean(), nullable=True))

# Migration 2 (after deployment): Make required
def upgrade():
    op.alter_column('users', 'email_verified', nullable=False)
```

## Automated Upgrade Scripts

### Upgrade Script Template

```bash
#!/bin/bash
# upgrade.sh - Automated upgrade script

set -e  # Exit on error

VERSION=$1
ENVIRONMENT=${2:-production}

echo "Upgrading Artisan to version $VERSION in $ENVIRONMENT"

# 1. Backup
echo "Creating backup..."
kubectl exec postgresql-0 -n artisan -- \
  pg_dump -U artisan artisan | gzip > "backup-$VERSION-$(date +%Y%m%d).sql.gz"

# 2. Run database migrations
echo "Running database migrations..."
kubectl apply -f k8s/migration-job.yaml
kubectl wait --for=condition=complete job/db-migration -n artisan --timeout=300s

# 3. Update backend
echo "Updating backend..."
kubectl set image deployment/backend \
  backend=your-registry/artisan-backend:$VERSION \
  -n artisan
kubectl rollout status deployment/backend -n artisan --timeout=300s

# 4. Update frontend
echo "Updating frontend..."
kubectl set image deployment/frontend \
  frontend=your-registry/artisan-frontend:$VERSION \
  -n artisan
kubectl rollout status deployment/frontend -n artisan --timeout=300s

# 5. Verify
echo "Verifying deployment..."
if curl -f https://yourapp.com/api/health; then
    echo "✓ Upgrade successful!"
else
    echo "✗ Health check failed, consider rollback"
    exit 1
fi

echo "Upgrade to $VERSION complete"
```

Usage:

```bash
chmod +x upgrade.sh
./upgrade.sh v1.1.0 production
```

## Post-Upgrade Verification

### Checklist

- [ ] Health checks passing (`/health`, `/api/system/health`)
- [ ] Database migrations applied successfully
- [ ] No errors in application logs
- [ ] Critical features working (test manually)
- [ ] Monitoring dashboards show normal metrics
- [ ] No spike in error rates
- [ ] User-reported issues monitored

### Monitoring

```bash
# Check pod status
kubectl get pods -n artisan

# View recent logs
kubectl logs --tail=100 deployment/backend -n artisan
kubectl logs --tail=100 deployment/frontend -n artisan

# Check for errors
kubectl logs deployment/backend -n artisan | grep -i error

# Monitor metrics
open https://your-grafana.com/dashboard/artisan

# Check Sentry for errors
open https://sentry.io/organizations/your-org/issues/
```

## Troubleshooting Upgrades

### Backend Won't Start

```bash
# Check logs
kubectl logs deployment/backend -n artisan

# Common issues:
# - Migration failed → Check migration logs
# - Configuration error → Verify ConfigMap/Secrets
# - Dependency issue → Check requirements.txt
```

### Migration Failed

```bash
# Check migration job logs
kubectl logs job/db-migration -n artisan

# Manually fix if needed
kubectl exec -it postgresql-0 -n artisan -- psql -U artisan artisan

# Rollback migration
kubectl exec -it deployment/backend -n artisan -- \
  alembic downgrade -1
```

### Frontend Assets Not Loading

```bash
# Clear CDN cache
# Check nginx configuration
# Verify build artifacts
docker run artisan-frontend:v1.1.0 ls /usr/share/nginx/html
```

## Next Steps

- Set up [Automated Backups](./BACKUP_RECOVERY.md)
- Configure [Monitoring Alerts](./MONITORING.md)
- Review [Security Updates](./SECURITY.md)
- Document [Incident Response](./INCIDENT_RESPONSE.md)
