# Quick Reference - Backend Connection & Kapa.ai

## 🚀 Quick Start

### Start Development Environment

```bash
# Backend
cd backend
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
uvicorn app.main:app --reload --port 8000

# Frontend (new terminal)
npm run dev
```

Access:
- Frontend: http://localhost:3004
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- System Health: http://localhost:3004/system-status

## 📌 New Endpoints

### Kapa.ai Integration

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/kapa/query` | POST | Query AI assistant |
| `/api/kapa/feedback` | POST | Submit feedback |
| `/api/kapa/status` | GET | Check status |

### System Health

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/system/health` | GET | Full health status |
| `/api/system/connectivity` | GET | Test connection |
| `/api/system/info` | GET | System capabilities |

## ⚙️ Configuration

### Kapa.ai Setup

1. Get API credentials from https://www.kapa.ai/
2. Add to `backend/.env`:
   ```bash
   KAPA_API_KEY=your-api-key
   KAPA_PROJECT_ID=your-project-id
   KAPA_INTEGRATION_ID=webapp
   ```
3. Restart backend
4. Click (?) icon on any page to use

### Environment Variables

```bash
# Kapa.ai
KAPA_API_KEY=          # Your Kapa.ai API key
KAPA_PROJECT_ID=       # Your Kapa.ai project ID
KAPA_INTEGRATION_ID=   # Integration identifier (e.g., "webapp")
KAPA_WIDGET_ENABLED=   # true/false

# Database
DATABASE_URL=          # PostgreSQL or SQLite connection string

# Security
SECRET_KEY=            # JWT secret key
JWT_ALGORITHM=         # HS256 (default)

# AI Provider (optional)
AI_PROVIDER=           # openai, anthropic, or mock
AI_API_KEY=            # Your AI provider API key
```

## 🧪 Testing

### Verify Backend Integration

```bash
cd backend
python verify_connection.py
```

Expected: ✅ All tests passed!

### Test Endpoints

```bash
# Health check
curl http://localhost:8000/health

# System health
curl http://localhost:8000/api/system/health

# Kapa.ai status
curl http://localhost:8000/api/kapa/status
```

### Test Kapa.ai Query

```bash
curl -X POST http://localhost:8000/api/kapa/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How do I create a campaign?",
    "integration_id": "webapp"
  }'
```

## 🐳 Docker Deployment

```bash
# Build and start
docker-compose up -d

# Run migrations
docker-compose exec backend alembic upgrade head

# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop
docker-compose down
```

## ☸️ Kubernetes Deployment

```bash
# Apply configuration
kubectl apply -f k8s/deployment.yaml

# Check status
kubectl get pods -n artisan
kubectl get svc -n artisan

# View logs
kubectl logs -f deployment/backend -n artisan
kubectl logs -f deployment/frontend -n artisan
```

## 📊 Monitoring

### Access Dashboards

- **System Health**: http://localhost:3004/system-status
- **API Docs**: http://localhost:8000/docs
- **Metrics**: http://localhost:8000/metrics
- **Redoc**: http://localhost:8000/redoc

### Health Check Endpoints

| Endpoint | Purpose | Use Case |
|----------|---------|----------|
| `/health` | Basic liveness | Kubernetes liveness probe |
| `/health/ready` | Readiness check | Kubernetes readiness probe |
| `/api/system/health` | Full health | Monitoring & debugging |

## 🔄 Common Tasks

### Update Dependencies

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
npm install
```

### Database Migrations

```bash
cd backend

# Create migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback one version
alembic downgrade -1
```

### Restart Services

**Docker:**
```bash
docker-compose restart backend
docker-compose restart frontend
```

**Kubernetes:**
```bash
kubectl rollout restart deployment/backend -n artisan
kubectl rollout restart deployment/frontend -n artisan
```

## 🐛 Troubleshooting

### Backend Won't Start

1. Check logs: `docker-compose logs backend`
2. Verify `.env` file exists
3. Check database connection
4. Ensure dependencies installed

### Frontend Can't Connect

1. Verify backend is running: `curl http://localhost:8000/health`
2. Check Vite proxy in `vite.config.js`
3. Check browser console for CORS errors
4. Verify port 8000 is accessible

### Kapa.ai Not Working

1. Check API key: `curl http://localhost:8000/api/kapa/status`
2. Verify environment variables set
3. Check backend logs for errors
4. Ensure Kapa.ai project is active

### Database Connection Failed

1. Check `DATABASE_URL` in `.env`
2. For PostgreSQL: Verify database exists
3. For SQLite: Check file permissions
4. Run migrations: `alembic upgrade head`

## 📚 Documentation

- **[Backend Connection Guide](./BACKEND_CONNECTION_GUIDE.md)** - Complete setup guide
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Production deployment
- **[Upgrade Guide](./UPGRADE_GUIDE.md)** - Version upgrades
- **[Implementation Summary](./IMPLEMENTATION_SUMMARY.md)** - What was built

## 💡 Tips

1. **Use the help assistant**: Click (?) icon on any page
2. **Monitor system health**: Visit `/system-status` regularly
3. **Check API docs**: Visit `/docs` for interactive API documentation
4. **Enable auto-refresh**: System health auto-updates every 30 seconds
5. **Provide feedback**: Use thumbs up/down in help assistant

## 🔑 Quick Commands

```bash
# Verify everything works
cd backend && python verify_connection.py

# Start development
# Terminal 1:
cd backend && source .venv/bin/activate && uvicorn app.main:app --reload
# Terminal 2:
npm run dev

# Docker deployment
docker-compose up -d && docker-compose logs -f

# Kubernetes deployment
kubectl apply -f k8s/deployment.yaml && kubectl get pods -n artisan -w

# Health check
curl http://localhost:8000/api/system/health | jq

# Kapa.ai test
curl -X POST http://localhost:8000/api/kapa/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Hello"}'
```

## 📞 Support

- **Documentation**: Check `docs/` directory
- **Verification**: Run `backend/verify_connection.py`
- **Logs**: Check application logs for errors
- **Help Assistant**: Use the (?) icon in application

---

**Version**: 2.0.0
**Updated**: December 27, 2024
