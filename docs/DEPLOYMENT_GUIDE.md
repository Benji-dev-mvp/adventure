# Application Deployment Guide

## Overview

This guide covers deploying the Artisan platform (frontend + backend) to production environments including Docker, Kubernetes, and cloud platforms.

## Deployment Options

1. **Docker Compose** - Simple single-host deployment
2. **Kubernetes** - Scalable orchestrated deployment
3. **Cloud Platforms** - Managed services (AWS, GCP, Azure)
4. **Helm Chart** - Kubernetes package manager

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+ (for Docker deployment)
- kubectl 1.24+ (for Kubernetes deployment)
- Helm 3.0+ (for Helm deployment)
- Access to container registry (Docker Hub, GHCR, ECR, etc.)

## Quick Start with Docker Compose

### 1. Configuration

Create a `.env` file in the project root:

```bash
# Application
APP_NAME=Artisan
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=INFO

# Database (use PostgreSQL in production)
DATABASE_URL=postgresql://artisan:yourpassword@postgres:5432/artisan

# Redis
REDIS_URL=redis://redis:6379/0

# Security
SECRET_KEY=generate-strong-random-key-here
JWT_ALGORITHM=HS256

# AI Provider
AI_PROVIDER=openai
AI_API_KEY=your-openai-api-key
AI_MODEL=gpt-4o-mini

# Kapa.ai Integration
KAPA_API_KEY=your-kapa-api-key
KAPA_PROJECT_ID=your-kapa-project-id
KAPA_INTEGRATION_ID=production
KAPA_WIDGET_ENABLED=true

# Monitoring
SENTRY_DSN=your-sentry-dsn
SENTRY_ENVIRONMENT=production
```

### 2. Update docker-compose.yml

The project includes a `docker-compose.yml` with frontend, backend, PostgreSQL, and Redis services.

To add PostgreSQL and Redis (currently commented out), uncomment the services:

```yaml
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: artisan
      POSTGRES_PASSWORD: yourpassword
      POSTGRES_DB: artisan
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U artisan"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass yourredispassword
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
```

### 3. Build and Deploy

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 4. Initialize Database

```bash
# Run migrations
docker-compose exec backend alembic upgrade head

# (Optional) Seed data
docker-compose exec backend python -c "from app.core.db import seed_if_empty; seed_if_empty()"
```

### 5. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### 6. SSL/TLS with Nginx Proxy

For production with HTTPS, use nginx-proxy or Traefik:

```bash
# Add to docker-compose.yml
nginx-proxy:
  image: nginxproxy/nginx-proxy
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - /var/run/docker.sock:/tmp/docker.sock:ro
    - ./certs:/etc/nginx/certs
  environment:
    - DEFAULT_HOST=yourapp.com
```

## Kubernetes Deployment

### 1. Prepare Configuration

Update `k8s/deployment.yaml` with your configuration:

```yaml
# Update image references
image: ghcr.io/your-org/artisan/backend:latest
image: ghcr.io/your-org/artisan/frontend:latest

# Update secrets
stringData:
  SECRET_KEY: "your-production-secret-key"
  KAPA_API_KEY: "your-kapa-api-key"
  # ... other secrets

# Update ingress host
spec:
  rules:
  - host: yourapp.com
    http:
      paths:
      - path: /
```

### 2. Create Namespace

```bash
kubectl apply -f - <<EOF
apiVersion: v1
kind: Namespace
metadata:
  name: artisan
EOF
```

### 3. Create Secrets

```bash
# Create secrets from file
kubectl create secret generic backend-secrets \
  --from-literal=SECRET_KEY=your-secret-key \
  --from-literal=DATABASE_URL=postgresql://... \
  --from-literal=KAPA_API_KEY=your-kapa-key \
  -n artisan

# Or use kubectl apply with k8s/deployment.yaml
kubectl apply -f k8s/deployment.yaml
```

### 4. Deploy Application

```bash
# Apply all resources
kubectl apply -f k8s/deployment.yaml

# Check deployment status
kubectl get pods -n artisan
kubectl get services -n artisan
kubectl get ingress -n artisan
```

### 5. Configure Ingress

Install ingress-nginx controller if not already installed:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx
```

### 6. SSL with cert-manager

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@yourapp.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

### 7. Monitor Deployment

```bash
# Watch pods
kubectl get pods -n artisan -w

# View logs
kubectl logs -f deployment/backend -n artisan
kubectl logs -f deployment/frontend -n artisan

# Check health
kubectl exec -it deployment/backend -n artisan -- curl http://localhost:8000/health
```

## Helm Deployment

### 1. Update values.yaml

Edit `helm/enterprise-app/values.yaml`:

```yaml
image:
  backend:
    repository: ghcr.io/your-org/artisan/backend
    tag: "v1.0.0"
  frontend:
    repository: ghcr.io/your-org/artisan/frontend
    tag: "v1.0.0"

ingress:
  enabled: true
  hosts:
    - host: yourapp.com
      paths:
        - path: /
          service: frontend
    - host: api.yourapp.com
      paths:
        - path: /
          service: backend

secrets:
  secretKey: "your-production-secret"
  kapaApiKey: "your-kapa-api-key"
  # ... other secrets

postgresql:
  enabled: true
  auth:
    password: "your-postgres-password"

redis:
  enabled: true
  auth:
    password: "your-redis-password"
```

### 2. Install Dependencies

```bash
cd helm/enterprise-app
helm dependency update
```

### 3. Deploy with Helm

```bash
# Install
helm install artisan ./helm/enterprise-app \
  --namespace artisan \
  --create-namespace \
  --values helm/enterprise-app/values.yaml

# Upgrade
helm upgrade artisan ./helm/enterprise-app \
  --namespace artisan \
  --values helm/enterprise-app/values.yaml

# Check status
helm status artisan -n artisan
```

### 4. Verify Deployment

```bash
# Check pods
kubectl get pods -n artisan

# Check services
kubectl get svc -n artisan

# Check ingress
kubectl get ingress -n artisan

# Test endpoints
curl https://yourapp.com/health
curl https://api.yourapp.com/health
```

## Cloud Platform Deployment

### AWS (ECS/EKS)

#### ECS with Fargate

1. **Build and Push Images**
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_URI
   
   docker build -t artisan-backend ./backend
   docker tag artisan-backend:latest YOUR_ECR_URI/artisan-backend:latest
   docker push YOUR_ECR_URI/artisan-backend:latest
   
   docker build -t artisan-frontend -f Dockerfile.frontend .
   docker tag artisan-frontend:latest YOUR_ECR_URI/artisan-frontend:latest
   docker push YOUR_ECR_URI/artisan-frontend:latest
   ```

2. **Create Task Definitions** (use AWS Console or CLI)

3. **Create ECS Service** with Application Load Balancer

4. **Configure RDS and ElastiCache**
   - RDS PostgreSQL for database
   - ElastiCache Redis for caching

#### EKS (Elastic Kubernetes Service)

1. **Create EKS Cluster**
   ```bash
   eksctl create cluster \
     --name artisan \
     --region us-east-1 \
     --nodegroup-name standard-workers \
     --node-type t3.medium \
     --nodes 3
   ```

2. **Deploy using kubectl or Helm** (see Kubernetes section above)

### Google Cloud Platform (GKE)

```bash
# Create GKE cluster
gcloud container clusters create artisan \
  --num-nodes=3 \
  --machine-type=n1-standard-2 \
  --region=us-central1

# Get credentials
gcloud container clusters get-credentials artisan --region=us-central1

# Deploy (see Kubernetes section)
kubectl apply -f k8s/deployment.yaml
```

### Azure (AKS)

```bash
# Create resource group
az group create --name artisan-rg --location eastus

# Create AKS cluster
az aks create \
  --resource-group artisan-rg \
  --name artisan \
  --node-count 3 \
  --node-vm-size Standard_B2s \
  --generate-ssh-keys

# Get credentials
az aks get-credentials --resource-group artisan-rg --name artisan

# Deploy (see Kubernetes section)
kubectl apply -f k8s/deployment.yaml
```

## CI/CD with GitHub Actions

The project includes `.github/workflows/ci-cd.yml` for automated deployment:

### Configure Secrets

Add these secrets in GitHub repository settings:

- `GITHUB_TOKEN` (automatic)
- `KUBE_CONFIG_STAGING` - Base64 encoded kubeconfig for staging
- `KUBE_CONFIG_PROD` - Base64 encoded kubeconfig for production
- `SLACK_WEBHOOK` - (Optional) For deployment notifications

### Workflow Triggers

- **Push to `develop`** → Deploy to staging
- **Push to `main`** → Deploy to production
- **Pull requests** → Run tests only

## Database Migrations

### Development

```bash
cd backend

# Create migration
alembic revision --autogenerate -m "Description of changes"

# Apply migration
alembic upgrade head

# Rollback one version
alembic downgrade -1
```

### Production

```bash
# Using Docker
docker-compose exec backend alembic upgrade head

# Using Kubernetes
kubectl exec -it deployment/backend -n artisan -- alembic upgrade head

# Using kubectl job (recommended for production)
kubectl apply -f - <<EOF
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migration
  namespace: artisan
spec:
  template:
    spec:
      containers:
      - name: migration
        image: ghcr.io/your-org/artisan/backend:latest
        command: ["alembic", "upgrade", "head"]
        envFrom:
        - configMapRef:
            name: backend-config
        - secretRef:
            name: backend-secrets
      restartPolicy: OnFailure
EOF
```

## Health Checks & Monitoring

### Application Health

- **Liveness**: `/health` - Always returns OK if app is running
- **Readiness**: `/health/ready` - Checks DB and cache connectivity
- **System Health**: `/api/system/health` - Comprehensive status

### Prometheus Metrics

Metrics available at `/metrics`:
- Request counts and latencies
- Active connections
- CPU and memory usage
- Database query times
- Cache hit rates

### Logging

Configure structured JSON logging:

```bash
# Set log level
LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR

# Logs are sent to stdout for container environments
```

### Sentry Error Tracking

```bash
# Configure Sentry
SENTRY_DSN=https://your-sentry-dsn
SENTRY_ENVIRONMENT=production
```

## Backup & Recovery

### Database Backups

```bash
# PostgreSQL backup
kubectl exec -it postgresql-0 -n artisan -- \
  pg_dump -U artisan artisan > backup-$(date +%Y%m%d).sql

# Restore
kubectl exec -i postgresql-0 -n artisan -- \
  psql -U artisan artisan < backup-20240101.sql
```

### Automated Backups

Add CronJob for regular backups:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: db-backup
  namespace: artisan
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:15
            command: ["/bin/sh", "-c"]
            args:
            - pg_dump -h postgresql -U artisan artisan | gzip > /backups/backup-$(date +\%Y\%m\%d).sql.gz
            volumeMounts:
            - name: backups
              mountPath: /backups
          volumes:
          - name: backups
            persistentVolumeClaim:
              claimName: backup-pvc
          restartPolicy: OnFailure
```

## Security Considerations

1. **Secrets Management**
   - Use Kubernetes Secrets or external secret managers (AWS Secrets Manager, HashiCorp Vault)
   - Never commit secrets to version control
   - Rotate secrets regularly

2. **Network Security**
   - Use Network Policies to restrict pod-to-pod communication
   - Enable TLS/SSL for all external traffic
   - Use private subnets for database and Redis

3. **Container Security**
   - Run containers as non-root user
   - Use read-only root filesystem where possible
   - Scan images for vulnerabilities (Trivy, Snyk)

4. **Access Control**
   - Use RBAC for Kubernetes access
   - Implement least-privilege principle
   - Enable audit logging

## Troubleshooting

### Pod CrashLoopBackOff

```bash
# Check logs
kubectl logs pod-name -n artisan --previous

# Describe pod
kubectl describe pod pod-name -n artisan

# Common issues:
# - Database connection failed (check DATABASE_URL)
# - Missing secrets (check secret configuration)
# - Out of memory (increase resource limits)
```

### Ingress Not Working

```bash
# Check ingress controller
kubectl get pods -n ingress-nginx

# Check ingress resource
kubectl describe ingress app-ingress -n artisan

# Check service endpoints
kubectl get endpoints -n artisan
```

### Database Connection Issues

```bash
# Test database connection
kubectl exec -it deployment/backend -n artisan -- \
  python -c "from app.core.db import engine; engine.connect()"

# Check database pod
kubectl get pods -l app=postgresql -n artisan
kubectl logs -l app=postgresql -n artisan
```

## Next Steps

- Set up [Monitoring & Observability](./MONITORING.md)
- Configure [Backup & Recovery](./BACKUP_RECOVERY.md)
- Review [Security Best Practices](./SECURITY.md)
- Implement [Upgrade Procedures](./UPGRADE_GUIDE.md)
