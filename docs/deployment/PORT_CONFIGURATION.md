# Port Configuration

## Standardized Ports

All port configurations have been cleaned up and standardized:

### Frontend
- **Port**: `3004`
- **URL**: http://localhost:3004
- **Configuration**: [package.json](package.json#L26-L27)

### Backend API
- **Port**: `8000`
- **URL**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/health/detailed

### Redis (for Celery)
- **Port**: `6379` (default)
- **URL**: redis://localhost:6379/0

## Changes Made

### Removed Old Ports
- ❌ Port 3000 (old frontend port)
- ❌ Port 5173 (Vite default)
- ❌ Port 3001, 3002, 3003 (unused ports)

### Updated Files
1. **[package.json](package.json)** - Updated scripts to use port 3004
   - Line 26: `"dev": "vite --host 0.0.0.0 --port 3004"`
   - Line 27: `"start": "vite --host 0.0.0.0 --port 3004"`

2. **[backend/app/core/config.py](backend/app/core/config.py)** - Updated CORS origins
   - Lines 48-51: Only allow `localhost:3004` and `[::1]:3004`

3. **[.devcontainer/devcontainer.json](.devcontainer/devcontainer.json)** - Updated port forwarding
   - Line 20: Changed from `3000` to `3004`
   - Line 25: Added both `3004` and `8000` to forward ports

## Access URLs

### Frontend
- **Main App**: http://localhost:3004
- **Landing Page**: http://localhost:3004/
- **Dashboard**: http://localhost:3004/dashboard
- **Admin Panel**: http://localhost:3004/admin

### Backend
- **API Root**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs
- **API Docs (ReDoc)**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/api/health
- **Detailed Health**: http://localhost:8000/api/health/detailed

### Admin Endpoints
- **Audit Logs**: http://localhost:8000/api/admin/audit-logs
- **User Management**: http://localhost:8000/api/admin/users
- **System Stats**: http://localhost:8000/api/admin/audit-logs/stats

## Running the Application

### Start Frontend
```bash
npm run dev
# or
npm start
```
Access at: http://localhost:3004

### Start Backend
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```
Access at: http://localhost:8000

### Start Celery (Optional)
```bash
cd backend
# Worker
celery -A app.core.celery_app worker -l info -Q emails,campaigns,analytics

# Beat (scheduled tasks)
celery -A app.core.celery_app beat -l info
```

### Start Redis (Required for Celery)
```bash
redis-server
```

## Port Conflicts

If you encounter port conflicts:

### Check what's using a port
```bash
lsof -i :3004  # Frontend
lsof -i :8000  # Backend
lsof -i :6379  # Redis
```

### Kill process on a port
```bash
lsof -ti :3004 | xargs kill -9  # Frontend
lsof -ti :8000 | xargs kill -9  # Backend
```

## Environment Variables

No environment variables needed for ports (hardcoded for consistency), but you can override:

```bash
# Frontend (not recommended)
VITE_PORT=3004 npm run dev

# Backend (not recommended)
uvicorn app.main:app --port 8000

# Redis (in .env or environment)
REDIS_URL=redis://localhost:6379/0
```

## Docker/Production

For production or Docker deployments:

### Frontend
- Internal: 80 or 3004
- External: Your domain (e.g., https://yourdomain.com)

### Backend
- Internal: 8000
- External: Your API domain (e.g., https://api.yourdomain.com)

### Docker Compose Example
```yaml
services:
  frontend:
    ports:
      - "80:80"  # Nginx serving React
  backend:
    ports:
      - "8000:8000"
  redis:
    ports:
      - "6379:6379"
```

## Summary

**Single source of truth for ports:**
- Frontend: `3004`
- Backend: `8000`
- Redis: `6379`

All old port references (3000, 5173, etc.) have been removed for consistency.
