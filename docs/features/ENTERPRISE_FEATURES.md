# Enterprise Features - Phase 1 Implementation

## Overview
This document describes the Phase 1 Enterprise Foundation features that have been implemented to make the application enterprise-ready.

## Implemented Features

### 1. Role-Based Access Control (RBAC)

#### User Roles
- **Admin**: Full system access
  - All permissions granted
  - Can manage users, audit logs, system settings
  - Access to admin dashboard

- **Manager**: Campaign and team management
  - Can create, read, update campaigns
  - Can manage leads and teams
  - Can view analytics
  - Cannot access system settings or user management

- **User**: Read-only access
  - Can view campaigns, leads, analytics
  - Cannot create or modify resources
  - Cannot access admin features

#### Permissions System
25 granular permissions across 6 categories:
- **Campaign**: create, read, update, delete, publish
- **Lead**: create, read, update, delete, export
- **Analytics**: read, export
- **Team**: read, create, update, delete, manage_members
- **User**: read, create, update, delete, manage_roles
- **System**: settings, audit, health, jobs

#### Implementation Files
- `backend/app/models/user.py` - User model with RBAC
- `backend/app/core/security.py` - RBAC decorators and middleware
- `backend/app/api/routes/admin.py` - Admin endpoints with permission checks

#### Usage Example
```python
from app.core.security import require_permission, require_role, get_current_user
from app.models.schemas import Permission
from app.models.user import UserRole

# Require specific permission
@router.delete("/campaigns/{campaign_id}")
@require_permission(Permission.CAMPAIGN_DELETE)
async def delete_campaign(campaign_id: int, user: User = Depends(get_current_user)):
    # Only users with CAMPAIGN_DELETE permission can access
    pass

# Require specific role
@router.get("/admin/stats")
@require_role(UserRole.ADMIN, UserRole.MANAGER)
async def admin_stats(user: User = Depends(get_current_user)):
    # Only admins and managers can access
    pass
```

### 2. Audit Logging

#### Tracked Actions (20+ types)
- **Authentication**: login, logout, password_reset, token_refresh
- **Campaigns**: campaign_created, campaign_updated, campaign_deleted, campaign_published
- **Leads**: lead_created, lead_updated, lead_deleted, lead_exported
- **Users**: user_created, user_updated, user_deleted, role_changed
- **Settings**: settings_updated, integration_added, integration_removed
- **System**: system_backup, system_restore, maintenance_mode

#### Captured Metadata
- User ID and email
- Action type and timestamp
- Resource type and ID
- IP address and user agent
- Success/failure status
- Error details (if failed)
- Additional context (JSON)

#### Implementation Files
- `backend/app/models/audit.py` - Audit log models
- `backend/app/core/audit.py` - Audit logging infrastructure
- `backend/app/api/routes/admin.py` - Audit log query endpoints

#### Usage Example
```python
from app.core.audit import create_audit_log, audit_action
from app.models.audit import AuditAction

# Manual logging
await create_audit_log(
    action=AuditAction.CAMPAIGN_CREATED,
    user_id=current_user.id,
    user_email=current_user.email,
    resource_type="campaign",
    resource_id=campaign.id,
    details={"name": campaign.name}
)

# Automatic logging with decorator
@router.post("/campaigns")
@audit_action(AuditAction.CAMPAIGN_CREATED, resource_type="campaign")
async def create_campaign(data: CampaignCreate, user: User = Depends(get_current_user)):
    # Automatically logs success or failure
    campaign = await create_campaign_in_db(data)
    return campaign
```

### 3. Health Check Endpoints

#### Available Endpoints

**1. Simple Health Check** - `/api/health`
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "service": "leadgen-backend"
}
```

**2. Detailed Health Check** - `/api/health/detailed`
```json
{
  "status": "healthy",
  "system": {
    "cpu_percent": 35.2,
    "memory": {
      "total_gb": 16.0,
      "available_gb": 8.5,
      "used_percent": 46.8,
      "status": "healthy"
    },
    "disk": {
      "total_gb": 500.0,
      "free_gb": 320.0,
      "used_percent": 36.0,
      "status": "healthy"
    }
  },
  "services": {
    "database": {"status": "healthy"},
    "redis": {"status": "not_configured"},
    "email": {"status": "healthy"}
  }
}
```

**3. Kubernetes Probes**
- `/api/health/readiness` - Readiness probe
- `/api/health/liveness` - Liveness probe

#### Implementation Files
- `backend/app/api/routes/health.py` - Health check endpoints

#### Monitoring Integration
Perfect for:
- Load balancer health checks
- Kubernetes/Docker orchestration
- Monitoring tools (Datadog, New Relic, Prometheus)
- Alerting systems (PagerDuty, Opsgenie)

### 4. Background Jobs (Celery + Redis)

#### Task Queues
- **emails**: Campaign email sending
- **campaigns**: Analytics generation, optimization
- **analytics**: Metrics calculation, report generation

#### Available Tasks

**Email Tasks** (`app/tasks/email_tasks.py`)
- `send_campaign_email` - Send single email
- `send_bulk_campaign_emails` - Bulk email sending
- `send_followup_email` - Scheduled follow-ups
- `process_email_bounces` - Handle bounces
- `track_email_opens` - Track opens/clicks

**Campaign Tasks** (`app/tasks/campaign_tasks.py`)
- `generate_campaign_analytics` - Calculate metrics
- `optimize_send_times` - ML-based optimization
- `schedule_campaign_emails` - Smart scheduling

**Analytics Tasks** (`app/tasks/analytics_tasks.py`)
- `calculate_daily_metrics` - Daily aggregation
- `generate_user_report` - User-specific reports
- `export_analytics_data` - Data export
- `cleanup_old_analytics` - Data retention

#### Implementation Files
- `backend/app/core/celery_app.py` - Celery configuration
- `backend/app/tasks/email_tasks.py` - Email tasks
- `backend/app/tasks/campaign_tasks.py` - Campaign tasks
- `backend/app/tasks/analytics_tasks.py` - Analytics tasks

#### Usage Example
```python
from app.tasks.email_tasks import send_campaign_email, send_bulk_campaign_emails
from datetime import datetime, timedelta

# Send single email immediately
result = send_campaign_email.delay(
    campaign_id=123,
    lead_id=456,
    email="lead@example.com",
    subject="Hello!",
    body="Email content"
)

# Schedule email for later
send_campaign_email.apply_async(
    kwargs={...},
    eta=datetime.now() + timedelta(hours=2)
)

# Bulk email sending
send_bulk_campaign_emails.delay(
    campaign_id=123,
    leads=[...],
    email_template={...}
)
```

#### Running Workers
```bash
# Start Celery worker
celery -A app.core.celery_app worker -l info -Q emails,campaigns,analytics

# Start Celery beat (for scheduled tasks)
celery -A app.core.celery_app beat -l info
```

### 5. Error Tracking (Sentry)

#### Features
- Automatic error capture for FastAPI and Celery
- Performance monitoring (transaction tracking)
- Release tracking
- Breadcrumb trail for debugging
- Sensitive data filtering

#### Implementation Files
- `backend/app/core/sentry.py` - Sentry integration
- Integrated into `backend/app/main.py`

#### Configuration
Environment variables:
```bash
SENTRY_DSN=https://xxx@sentry.io/xxx
ENVIRONMENT=production
APP_VERSION=1.0.0
```

#### Usage Example
```python
from app.core.sentry import capture_exception, capture_message, set_user, add_breadcrumb

# Capture exception
try:
    risky_operation()
except Exception as e:
    capture_exception(e, context={
        "campaign_id": 123,
        "operation": "email_send"
    })

# Capture message
capture_message("Campaign completed successfully", level="info")

# Set user context
set_user(user_id=123, email="user@example.com")

# Add breadcrumb
add_breadcrumb(
    message="Email sent",
    category="email",
    level="info",
    data={"email": "user@example.com"}
)
```

### 6. Admin Dashboard UI

#### Features
- **Overview Tab**: System statistics and metrics
- **System Health Tab**: CPU, memory, disk usage, service status
- **Audit Logs Tab**: Recent activity with filtering
- **User Management Tab**: User CRUD operations (coming soon)
- **Background Jobs Tab**: Job queue monitoring (coming soon)

#### Implementation Files
- `src/pages/Admin.jsx` - Admin dashboard UI
- Integrated into `src/App.jsx` routing
- Added to `src/components/layout/Sidebar.jsx`

#### Access
Navigate to `/admin` (Admin role required)

## Installation & Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Install Redis (required for Celery)
```bash
# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# macOS
brew install redis
brew services start redis

# Docker
docker run -d -p 6379:6379 redis:alpine
```

### 3. Configure Environment Variables
```bash
# .env file
REDIS_URL=redis://localhost:6379/0
SENTRY_DSN=https://xxx@sentry.io/xxx  # Optional
ENVIRONMENT=development
```

### 4. Start Services
```bash
# Terminal 1: Start FastAPI
cd backend
uvicorn app.main:app --reload --port 8000

# Terminal 2: Start Celery Worker
cd backend
celery -A app.core.celery_app worker -l info

# Terminal 3: Start Celery Beat (for scheduled tasks)
cd backend
celery -A app.core.celery_app beat -l info

# Terminal 4: Start Frontend
cd ..
npm run dev
```

## API Endpoints

### Admin Endpoints
- `GET /api/admin/audit-logs` - List audit logs
- `GET /api/admin/audit-logs/stats` - Audit statistics
- `GET /api/admin/users` - List users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/{user_id}` - Update user
- `DELETE /api/admin/users/{user_id}` - Delete user
- `GET /api/admin/roles` - List roles and permissions
- `GET /api/admin/permissions/me` - Get current user permissions

### Health Endpoints
- `GET /api/health` - Simple health check
- `GET /api/health/detailed` - Detailed health check
- `GET /api/health/readiness` - Kubernetes readiness probe
- `GET /api/health/liveness` - Kubernetes liveness probe

## Database Migrations (TODO)

Create database migrations for:
- `users` table (id, email, name, hashed_password, role, is_active, created_at, last_login)
- `audit_logs` table (id, action, user_id, user_email, resource_type, resource_id, details, ip_address, user_agent, timestamp, success, error_message)

## Next Steps - Phase 2

### Advanced Security
- [ ] JWT authentication with refresh tokens
- [ ] API key management
- [ ] IP whitelisting
- [ ] Rate limiting per user/role

### Multi-Tenancy
- [ ] Organization/tenant isolation
- [ ] Tenant-specific branding
- [ ] Cross-tenant admin access

### SSO Integration
- [ ] SAML 2.0 support
- [ ] OAuth 2.0 providers (Google, Microsoft, Okta)
- [ ] LDAP/Active Directory

### Advanced Monitoring
- [ ] Real-time metrics dashboard
- [ ] Custom alerting rules
- [ ] SLA monitoring
- [ ] Performance profiling

### Webhooks & API
- [ ] Webhook system for events
- [ ] GraphQL API
- [ ] API versioning
- [ ] SDK generation

## Security Best Practices

1. **Authentication**: Always use get_current_user dependency
2. **Authorization**: Apply require_role or require_permission to protected endpoints
3. **Audit Logging**: Log all sensitive operations
4. **Error Handling**: Use Sentry to track production errors
5. **Data Filtering**: Filter sensitive data before logging
6. **Rate Limiting**: Protect against abuse
7. **Input Validation**: Use Pydantic models

## Support & Documentation

- API Documentation: http://localhost:8000/docs
- Admin Dashboard: http://localhost:3004/admin
- Health Check: http://localhost:8000/api/health/detailed

## Troubleshooting

### Celery not starting
- Check Redis is running: `redis-cli ping`
- Verify REDIS_URL in environment

### Sentry not capturing errors
- Verify SENTRY_DSN is set
- Check network connectivity to Sentry

### Health check shows unhealthy
- Check system resources (CPU, memory, disk)
- Verify service connections (database, Redis)
