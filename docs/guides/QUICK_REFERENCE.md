# 🚀 Enterprise Application - Quick Reference

## Essential Commands

### Development
```bash
# Start backend
cd backend && uvicorn app.main:app --reload --port 8000

# Start frontend
npm run dev

# Start with Docker
docker-compose up -d
```

### Testing
```bash
# Backend tests
cd backend && pytest -v

# With coverage
pytest --cov=app --cov-report=html

# Frontend tests
npm test

# E2E tests
npx playwright test
```

### Database
```bash
# Create migration
cd backend && alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

### Deployment
```bash
# Build Docker images
docker build -t backend:latest ./backend
docker build -t frontend:latest .

# Deploy with Helm
helm install enterprise-app ./helm/enterprise-app

# Deploy with kubectl
kubectl apply -f k8s/deployment.yaml
```

---

## Important URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3004 | React application |
| Backend API | http://localhost:8000 | FastAPI backend |
| API Docs | http://localhost:8000/docs | Swagger UI |
| ReDoc | http://localhost:8000/redoc | Alternative API docs |
| Health Check | http://localhost:8000/health | Basic health |
| Metrics | http://localhost:8000/metrics | Prometheus metrics |

---

## Key API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/mfa/setup` - Setup MFA
- `GET /api/auth/oauth/{provider}/login` - OAuth login

### Admin
- `GET /api/admin/users` - List users
- `GET /api/admin/audit-logs` - Audit logs
- `POST /api/backup/create` - Create backup

### Features
- `GET /api/feature-flags` - List feature flags
- `POST /api/files/upload` - Upload file
- `GET /api/compliance/export-data` - Export user data
- `WS /ws/updates` - WebSocket connection

---

## Environment Variables

### Required
```env
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:pass@localhost/db
REDIS_URL=redis://localhost:6379
```

### OAuth (Optional)
```env
GOOGLE_CLIENT_ID=your-id
GOOGLE_CLIENT_SECRET=your-secret
MICROSOFT_CLIENT_ID=your-id
MICROSOFT_CLIENT_SECRET=your-secret
```

### AWS (Optional)
```env
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
S3_BUCKET_NAME=your-bucket
```

---

## Troubleshooting

### Backend won't start
```bash
# Check dependencies
pip install -r backend/requirements.txt

# Check database
psql -h localhost -U postgres

# Check Redis
redis-cli ping
```

### Tests failing
```bash
# Update test database
cd backend && alembic upgrade head

# Clear cache
redis-cli FLUSHALL

# Reinstall dependencies
rm -rf node_modules && npm install
```

### Docker issues
```bash
# Rebuild images
docker-compose build --no-cache

# Clean up
docker-compose down -v
docker system prune -a
```

---

## Monitoring Queries

### Prometheus
```promql
# Request rate
rate(http_requests_total[5m])

# Error rate
rate(http_requests_total{status=~"5.."}[5m])

# Request duration
histogram_quantile(0.95, http_request_duration_seconds)
```

### Health Checks
```bash
# Basic health
curl http://localhost:8000/health

# Detailed health
curl http://localhost:8000/api/health/detailed

# Readiness probe
curl http://localhost:8000/api/health/readiness
```

---

## Security Notes

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Rate Limits
- 100 requests per minute per IP
- 60 requests per minute per user
- Bypass with `X-API-Key` header (admin only)

### RBAC Roles
- **Admin**: Full access
- **Manager**: Campaign & team management
- **User**: Read-only access

---

## Backup & Recovery

### Create Backup
```bash
# Via API
curl -X POST http://localhost:8000/api/backup/create \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Manual
pg_dump -h localhost -U postgres appdb > backup.sql
```

### Restore Backup
```bash
# Via API (Admin only)
curl -X POST http://localhost:8000/api/backup/restore \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"backup_key": "backups/2024/12/backup_20241226.sql.gz"}'

# Manual
psql -h localhost -U postgres appdb < backup.sql
```

---

## Performance Tips

### Database
- Use connection pooling (default: 10)
- Enable query caching
- Create indexes on frequently queried columns
- Use `EXPLAIN ANALYZE` for slow queries

### Caching
- Redis for session data
- Cache API responses (5 min TTL)
- Use CDN for static assets

### Scaling
- Horizontal: Add more K8s pods
- Vertical: Increase pod resources
- Database: Use read replicas

---

## Common Tasks

### Add New User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "newuser",
    "password": "SecurePass123"
  }'
```

### Enable Feature Flag
```bash
curl -X POST http://localhost:8000/api/feature-flags/oauth_login/enable \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"user_id": 123}'
```

### Export User Data
```bash
curl http://localhost:8000/api/compliance/export-data \
  -H "Authorization: Bearer $USER_TOKEN" \
  -o user_data.json
```

---

## Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes**
   - Write code
   - Add tests
   - Update docs

3. **Run Tests**
   ```bash
   pytest && npm test
   ```

4. **Commit**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push & Create PR**
   ```bash
   git push origin feature/new-feature
   ```

6. **CI/CD Pipeline Runs**
   - Linting
   - Tests
   - Security scanning
   - Build images
   - Deploy to staging

---

## Support Resources

- **Documentation**: `/ENTERPRISE_COMPLETE_V2.md`
- **API Docs**: `http://localhost:8000/docs`
- **Test Examples**: `backend/tests/`
- **Architecture**: `/ARCHITECTURE.md`

---

**Happy Building! 🎉**
