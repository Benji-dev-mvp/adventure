# Enterprise Hardening & Productization Guide

This document outlines the enterprise-grade capabilities, security controls, and operational tooling that make this platform production-ready beyond basic infrastructure and wiring.

## Table of Contents

1. [Enterprise Hardening](#enterprise-hardening)
2. [Observability & Reliability](#observability--reliability)
3. [Kapa.ai Deep Integration Enhancements](#kapaai-deep-integration-enhancements)
4. [Analytics & Product Insights](#analytics--product-insights)
5. [Operational Tooling](#operational-tooling)

---

## Enterprise Hardening

### Authentication & Access Control

#### Centralized Authentication
- **JWT/Session Management**: Implemented in `backend/app/core/security.py`
  - Secure token generation and validation
  - Configurable token expiration (default: 24 hours)
  - Refresh token support for long-lived sessions
  - Token revocation capability via blacklist

- **OAuth2 Integration**: `backend/app/api/routes/oauth_mfa.py`
  - Support for Google, Microsoft, and GitHub OAuth
  - PKCE flow for enhanced security
  - Automatic user provisioning on first login

#### Role-Based Access Control (RBAC)
- **Admin Role**: Full system access
  - System health dashboard access
  - Kapa.ai configuration management
  - User and tenant management
  - Audit log access
  
- **Operator Role**: Operational access
  - Read-only system health monitoring
  - Campaign management
  - Lead operations
  
- **Viewer Role**: Read-only access
  - Dashboard viewing
  - Report access
  - Limited analytics

**Implementation**: See `backend/app/core/security.py` for role decorators:
```python
@require_role("admin")
@require_role("operator")
@require_role("viewer")
```

#### API Key Management
- **Kapa.ai API Keys**: Stored securely in environment variables
  - Never committed to repository
  - Rotated regularly (recommended: quarterly)
  - Scoped to specific environments
  
- **Internal Service Keys**: `backend/app/api/routes/admin.py`
  - Admin API for generating service-to-service keys
  - Key rotation with grace period
  - Activity tracking per API key

### Security & Compliance Controls

#### Secrets Management
- **Environment-Based**: All secrets via environment variables
  - `KAPA_API_KEY` - Kapa.ai authentication
  - `SECRET_KEY` - JWT signing
  - `DATABASE_URL` - Database connection
  - `AI_API_KEY` - AI provider keys
  
- **Vault Integration Ready**: `backend/app/core/config.py` supports:
  - HashiCorp Vault
  - AWS Secrets Manager
  - Azure Key Vault
  - Google Secret Manager

#### Request Security
- **Webhook Verification**: `backend/app/core/webhooks.py`
  - HMAC-SHA256 signature verification
  - Timestamp validation (prevent replay attacks)
  - IP allowlisting support
  
- **Rate Limiting**: `backend/app/core/security.py`
  - Per-endpoint rate limits
  - Per-user rate limits
  - Per-IP rate limits
  - Configurable via `RATE_LIMIT_PER_MINUTE`

#### Compliance Controls
- **Audit Logging**: `backend/app/core/audit.py` and `audit_enhanced.py`
  - All API calls logged
  - User actions tracked
  - System changes recorded
  - Compliance reports available
  
- **Data Privacy**:
  - PII encryption at rest
  - Field-level encryption for sensitive data
  - GDPR-compliant data export
  - Right to be forgotten implementation

### Multi-Tenancy Readiness

#### Tenant-Aware Configuration
- **Kapa.ai Per-Tenant**: `backend/app/api/routes/kapa_integration.py`
  - Tenant-specific project IDs
  - Isolated knowledge bases per tenant
  - Custom branding support
  
```python
# Example: Tenant-specific Kapa.ai configuration
def get_kapa_config(tenant_id: str):
    return {
        "api_key": get_tenant_secret(tenant_id, "kapa_api_key"),
        "project_id": get_tenant_config(tenant_id, "kapa_project_id"),
        "integration_id": f"webapp-{tenant_id}"
    }
```

#### Namespaced Health Metrics
- **Per-Tenant Metrics**: `backend/app/core/metrics.py`
  - Separate metric namespaces per tenant
  - Resource usage tracking per tenant
  - Cost allocation support
  
```python
# Prometheus metrics with tenant labels
kapa_query_count = Counter(
    'kapa_queries_total',
    'Total Kapa.ai queries',
    ['tenant_id', 'status']
)
```

#### Data Isolation
- **Database Level**: 
  - Tenant ID in all tables
  - Row-level security policies
  - Separate schemas per tenant (optional)
  
- **Cache Level**:
  - Tenant-prefixed cache keys
  - Isolated Redis namespaces
  
- **File Storage**:
  - Tenant-specific S3 buckets/prefixes
  - Separate access policies per tenant

---

## Observability & Reliability

### Metrics & Tracing

#### Application Metrics
- **Prometheus Metrics**: `backend/app/core/metrics.py`
  - Request count by endpoint, method, status
  - Request latency (P50, P95, P99)
  - Error rates and types
  - Active connections
  - Database query times
  - Cache hit/miss rates

**Available at**: `/metrics` endpoint

Example metrics:
```
http_requests_total{method="POST",endpoint="/api/kapa/query",status="200"} 1234
http_request_duration_seconds_bucket{le="0.1"} 950
kapa_api_latency_seconds{operation="query"} 0.345
database_query_duration_seconds{query="select_leads"} 0.023
```

#### OpenTelemetry Tracing
- **Distributed Tracing**: `backend/app/core/tracing.py`
  - End-to-end request tracing
  - Frontend → Backend → Kapa.ai correlation
  - Automatic span creation for:
    - HTTP requests
    - Database queries
    - Cache operations
    - External API calls

**Trace Example**:
```
Frontend Request (trace_id: abc123)
  ├─ Backend API Call (span_id: def456)
  │   ├─ Database Query (span_id: ghi789)
  │   ├─ Kapa.ai Query (span_id: jkl012)
  │   │   └─ Kapa.ai Response (span_id: mno345)
  │   └─ Response Processing (span_id: pqr678)
  └─ Frontend Render (span_id: stu901)
```

#### Kapa.ai Call Tracing
- **Instrumented Endpoints**: All Kapa.ai calls traced
  - Request/response payloads (sanitized)
  - Latency measurements
  - Success/failure tracking
  - Retry attempts

### Logging

#### Structured JSON Logging
- **Format**: All logs in JSON for easy parsing
```json
{
  "timestamp": "2024-12-27T23:24:38.072Z",
  "level": "INFO",
  "service": "backend",
  "correlation_id": "abc123",
  "user_id": "user-456",
  "tenant_id": "tenant-789",
  "message": "Kapa.ai query successful",
  "duration_ms": 345,
  "endpoint": "/api/kapa/query"
}
```

#### Correlation IDs
- **Propagation**: `backend/app/core/tracing.py`
  - Frontend generates correlation ID
  - Passed via `X-Correlation-ID` header
  - Propagated to all downstream services
  - Included in all logs
  - Visible in Kapa.ai requests

#### Log Levels & Sampling
- **Dynamic Log Levels**: Configurable per environment
  - `DEBUG`: Development (all logs)
  - `INFO`: Staging (important events)
  - `WARNING`: Production (warnings and errors)
  - `ERROR`: Production high-priority only

- **High-Volume Endpoint Sampling**: `backend/app/core/config.py`
  - Sample 1% of successful requests
  - Log 100% of errors
  - Configurable via `LOG_SAMPLING_RATE`

### SLOs & Health

#### Defined Service Level Objectives

**Kapa.ai Integration**:
- **Availability**: 99.9% uptime
- **Success Rate**: 99.5% of queries successful
- **Latency**: P95 < 500ms, P99 < 1000ms
- **Error Budget**: 0.1% (43 minutes downtime/month)

**Backend API**:
- **Availability**: 99.95% uptime
- **Success Rate**: 99.9% of requests successful
- **Latency**: P95 < 200ms, P99 < 500ms
- **Error Budget**: 0.05% (22 minutes downtime/month)

#### Error Budget Tracking
- **Implementation**: `backend/app/core/metrics.py`
- **Monitoring**: Prometheus + Grafana dashboards
- **Alerting**: PagerDuty/Slack when budget consumed > 50%

#### Expanded Health Endpoints

**Liveness Probe**: `GET /health`
- Basic application health
- Returns 200 if app is running

**Readiness Probe**: `GET /health/ready`
- Checks all dependencies
- Database connectivity
- Cache availability
- Returns 200 only when ready to serve traffic

**Comprehensive Health**: `GET /api/system/health`
- All service statuses
- Dependency health checks
- System resource metrics
- Response time measurements
- Automatic every 30s in SystemHealthDashboard

**Dependency Checks**: Each check returns:
```json
{
  "name": "kapa_ai",
  "status": "healthy",
  "response_time_ms": 234,
  "message": "Kapa.ai integration operational",
  "details": {
    "last_successful_query": "2024-12-27T23:20:00Z",
    "success_rate_24h": 99.87
  }
}
```

---

## Kapa.ai Deep Integration Enhancements

### Context & Telemetry

#### User/Tenant Context Attachment
- **Privacy-Compliant Context**: `backend/app/api/routes/kapa_integration.py`
```python
def enrich_kapa_query(query: str, user: User, tenant: Tenant):
    context = {
        "tenant_id": tenant.id,
        "tenant_name": tenant.name,  # Optional
        "user_role": user.role,
        "user_language": user.language,
        "session_id": get_session_id(),
        # NO PII: No email, name, or sensitive data
    }
    return {
        "query": query,
        "metadata": context
    }
```

#### Response Quality Signals
- **Feedback Collection**: `POST /api/kapa/feedback`
  - Thumbs up/down
  - Resolution time tracking
  - Follow-up questions count
  - User satisfaction score

- **Analytics Storage**: `backend/app/models/schemas.py`
```python
class KapaInteraction(SQLModel, table=True):
    id: int
    tenant_id: str
    user_id: str
    query: str
    response_id: str
    thread_id: str
    helpful: Optional[bool]
    resolution_time_seconds: Optional[int]
    follow_up_count: int
    created_at: datetime
```

#### Interaction Events
- **Event Tracking**: `backend/app/core/events.py`
  - Query submitted
  - Response received
  - Feedback provided
  - Thread continued
  - Issue resolved

### Knowledge Management

#### Admin Controls
- **Knowledge Source Management**: `backend/app/api/routes/admin.py`
  - Add/remove documentation sources
  - Update source priorities
  - Configure indexing schedules
  - Manage source access controls

**API Endpoints**:
```
POST   /api/admin/kapa/sources          - Add knowledge source
GET    /api/admin/kapa/sources          - List all sources
PUT    /api/admin/kapa/sources/{id}     - Update source
DELETE /api/admin/kapa/sources/{id}     - Remove source
POST   /api/admin/kapa/sources/{id}/sync - Trigger re-index
```

#### Sync Status View
- **Real-Time Status**: `GET /api/admin/kapa/sync-status`
```json
{
  "sources": [
    {
      "id": "github-docs",
      "name": "GitHub Documentation",
      "type": "github",
      "status": "synced",
      "last_indexed": "2024-12-27T22:00:00Z",
      "documents_count": 1234,
      "next_sync": "2024-12-28T02:00:00Z",
      "errors": []
    },
    {
      "id": "notion-wiki",
      "name": "Internal Wiki",
      "type": "notion",
      "status": "indexing",
      "progress": 67,
      "documents_count": 456,
      "errors": []
    }
  ]
}
```

#### Background Jobs
- **Incremental Re-indexing**: `backend/app/core/celery_app.py`
  - Scheduled via Celery Beat
  - Detects changed documents only
  - Updates index without full rebuild
  - Configurable frequency per source

**Task Configuration**:
```python
@celery.task
def sync_kapa_source(source_id: str, full_sync: bool = False):
    """Sync knowledge source with Kapa.ai"""
    source = get_source(source_id)
    if full_sync:
        return full_reindex(source)
    else:
        return incremental_update(source)
```

### Safety & Guardrails

#### Content Policies
- **Response Filtering**: `backend/app/core/ai_provider.py`
  - Block inappropriate content
  - Filter PII from responses
  - Validate against company policies
  - Redact sensitive information

#### Configurable Guardrails
- **Environment-Specific**: `backend/app/core/config.py`
```python
# Development: Relaxed
KAPA_GUARDRAILS = {
    "max_response_length": 2000,
    "allow_code_snippets": True,
    "pii_detection": False
}

# Production: Strict
KAPA_GUARDRAILS = {
    "max_response_length": 1000,
    "allow_code_snippets": False,
    "pii_detection": True,
    "require_sources": True,
    "confidence_threshold": 0.7
}
```

#### Tenant-Specific Policies
- **Custom Rules Per Tenant**:
```python
def apply_guardrails(response: str, tenant: Tenant) -> str:
    rules = get_tenant_guardrails(tenant.id)
    
    if rules.pii_detection:
        response = redact_pii(response)
    
    if rules.require_approval:
        response = add_disclaimer(response)
    
    if len(response) > rules.max_length:
        response = truncate_response(response, rules.max_length)
    
    return response
```

---

## Analytics & Product Insights

### Usage Analytics

#### Kapa.ai Query Dashboards
- **Metrics Tracked**:
  - Queries per day/week/month
  - Unique users querying
  - Top query topics/intents
  - Average response time
  - Success vs. failure rates
  - Feedback scores

**Grafana Dashboard Components**:
1. **Query Volume Timeline**
   - Line chart showing queries over time
   - Segmented by tenant/user role
   
2. **Top Intents**
   - Bar chart of most common query types
   - Helps prioritize documentation
   
3. **Response Quality**
   - Pie chart of helpful vs. not helpful
   - Average resolution time
   
4. **Failure Analysis**
   - Error types breakdown
   - Failed query patterns

#### Endpoint Success/Failure Rates
- **API Health Metrics**: `backend/app/core/metrics.py`
```python
# Prometheus metrics
api_requests_total = Counter(
    'api_requests_total',
    'Total API requests',
    ['endpoint', 'method', 'status']
)

api_request_duration = Histogram(
    'api_request_duration_seconds',
    'API request duration',
    ['endpoint'],
    buckets=[0.1, 0.25, 0.5, 1.0, 2.5, 5.0]
)
```

**Available Dashboards**:
- Overall API health
- Per-endpoint success rates
- Latency percentiles
- Error rate trends

#### Intent & Topic Analysis
- **Query Classification**: `backend/app/core/ml_analytics.py`
  - Automatic categorization of queries
  - Topic modeling (LDA/BERT)
  - Trend detection
  - Gap analysis (unanswered topics)

**Output Example**:
```
Top 10 Topics (Last 30 Days):
1. Campaign creation - 1,234 queries
2. Lead import - 987 queries
3. Integration setup - 756 queries
4. Billing questions - 543 queries
5. API documentation - 432 queries
...
```

#### Funnel Metrics
- **User Journey Tracking**:
```
Open Assistant → Ask Question → Get Response → Provide Feedback → Resolved
     100%            85%            82%             45%              38%
```

**Tracked Events**:
- Assistant opened
- Query submitted
- Response viewed
- Sources clicked
- Feedback provided
- Follow-up query
- Issue marked resolved

### SystemHealthDashboard Enhancements

#### Aggregate Status View
- **Component Status**: `/system-status` page
  - Backend API: Healthy ✓
  - Database: Healthy ✓
  - Cache (Redis): Healthy ✓
  - Kapa.ai Integration: Healthy ✓
  - AI Provider: Healthy ✓

**Status Indicators**:
- 🟢 Healthy: All checks passing
- 🟡 Degraded: Some non-critical issues
- 🔴 Unhealthy: Critical service down

#### Infrastructure Components
- **Detailed Service Health**:
```json
{
  "postgres": {
    "status": "healthy",
    "connections": 45,
    "max_connections": 100,
    "query_time_p95_ms": 23,
    "slow_queries": 0
  },
  "redis": {
    "status": "healthy",
    "memory_used_mb": 256,
    "memory_max_mb": 1024,
    "hit_rate": 94.5,
    "operations_per_sec": 1234
  },
  "celery": {
    "status": "healthy",
    "active_tasks": 12,
    "pending_tasks": 3,
    "failed_tasks_24h": 2
  }
}
```

#### Historical Trends
- **Time-Series Data**: `backend/app/core/time_series_forecasting.py`
  - Last 24 hours trend
  - Last 7 days trend
  - Last 30 days trend
  
**Chart Types**:
- Response time trends
- Error rate over time
- Resource utilization
- Query volume patterns

**Implementation**:
```python
@router.get("/api/system/health/history")
async def get_health_history(
    hours: int = 24,
    metric: str = "latency"
):
    """Get historical health metrics"""
    return get_time_series_data(metric, hours)
```

---

## Operational Tooling

### Feature Flags

#### Toggle System
- **Implementation**: `backend/app/core/feature_flags.py`
  - LaunchDarkly integration
  - Local configuration fallback
  - Per-environment flags
  - Per-tenant overrides

**Flag Examples**:
```python
# Check if Kapa.ai is enabled
if feature_flags.is_enabled("kapa_ai_assistant", tenant_id):
    return show_kapa_widget()

# Gradual rollout
if feature_flags.is_enabled_for_percentage("new_dashboard", user_id, 25):
    return new_dashboard()
```

#### Environment-Based Flags
```yaml
# config/feature_flags.yaml
development:
  kapa_ai_assistant: true
  advanced_analytics: true
  debug_mode: true

staging:
  kapa_ai_assistant: true
  advanced_analytics: false
  debug_mode: false

production:
  kapa_ai_assistant: true  # Full rollout
  advanced_analytics: false  # Not ready
  debug_mode: false
```

#### Tenant-Level Control
- **Override System**: `GET /api/admin/feature-flags/{tenant_id}`
```json
{
  "tenant_id": "tenant-123",
  "overrides": {
    "kapa_ai_assistant": false,  # Disabled for this tenant
    "advanced_analytics": true   # Early access
  }
}
```

### Runbooks & Playbooks

#### Operational Runbooks

**1. Kapa.ai Outage Runbook**
```markdown
## Kapa.ai Service Outage

**Detection**: Health check failures, increased error rates

**Immediate Actions**:
1. Check Kapa.ai status page: https://status.kapa.ai
2. Verify API key validity
3. Check rate limits
4. Review recent configuration changes

**Mitigation**:
1. Enable fallback mode (disable Kapa widget)
   ```bash
   kubectl set env deployment/backend KAPA_WIDGET_ENABLED=false
   ```
2. Display maintenance message to users
3. Log all failed queries for replay

**Recovery**:
1. Wait for Kapa.ai service restoration
2. Re-enable widget
3. Replay failed queries if needed
4. Monitor error rates return to normal

**Post-Incident**:
- Review impact duration
- Update status page
- Incident report
```

**2. Backend Degradation Runbook**
```markdown
## Backend Performance Degradation

**Detection**: Increased latency, timeout errors

**Investigation**:
1. Check system resources
   ```bash
   kubectl top pods -n artisan
   ```
2. Review slow query logs
3. Check database connection pool
4. Review recent deployments

**Mitigation**:
1. Scale up replicas
   ```bash
   kubectl scale deployment/backend --replicas=6
   ```
2. Clear cache if stale
3. Restart problematic pods
4. Enable rate limiting if needed

**Prevention**:
- Add more database read replicas
- Optimize slow queries
- Increase resource limits
```

**3. Deployment Rollback Runbook**
```markdown
## Emergency Rollback

**When to Rollback**:
- Error rate > 5%
- P95 latency > 2x baseline
- Critical functionality broken

**Rollback Commands**:
```bash
# Kubernetes
kubectl rollout undo deployment/backend -n artisan

# Helm
helm rollback artisan -n artisan

# Verify
kubectl rollout status deployment/backend -n artisan
```

**Post-Rollback**:
- Identify root cause
- Fix in development
- Test thoroughly
- Redeploy with fix
```

### Performance & Load Testing

#### Baseline Load Tests
- **Test Scenarios**: `tests/load/`
  1. **Normal Load**: 100 req/s sustained
  2. **Peak Load**: 500 req/s for 5 minutes
  3. **Spike Test**: 1000 req/s for 1 minute
  4. **Soak Test**: 50 req/s for 24 hours

**Kapa.ai Endpoint Tests**:
```python
# locust test file
class KapaLoadTest(HttpUser):
    wait_time = between(1, 3)
    
    @task(3)
    def query_kapa(self):
        self.client.post("/api/kapa/query", json={
            "query": "How do I create a campaign?",
            "integration_id": "load-test"
        })
    
    @task(1)
    def check_health(self):
        self.client.get("/api/system/health")
```

**Run Load Test**:
```bash
locust -f tests/load/kapa_load_test.py \
  --host http://staging-api.yourapp.com \
  --users 100 \
  --spawn-rate 10 \
  --run-time 10m
```

#### Performance Budgets
**Documented Targets**: `docs/PERFORMANCE_BUDGETS.md`

| Endpoint | P50 | P95 | P99 | Max |
|----------|-----|-----|-----|-----|
| `/api/kapa/query` | 200ms | 500ms | 1000ms | 2000ms |
| `/api/system/health` | 10ms | 50ms | 100ms | 200ms |
| `/api/leads` | 50ms | 150ms | 300ms | 500ms |
| `/api/campaigns` | 100ms | 300ms | 600ms | 1000ms |

**Budget Enforcement**:
- CI/CD pipeline fails if budgets exceeded
- Alerts triggered when approaching limits
- Regular performance reviews

#### Load Test Automation
```yaml
# .github/workflows/load-test.yml
name: Weekly Load Test

on:
  schedule:
    - cron: '0 2 * * 0'  # Every Sunday at 2 AM

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Load Test
        run: |
          docker-compose up -d
          pip install locust
          locust -f tests/load/ --headless --users 50 --spawn-rate 5 --run-time 5m
      - name: Analyze Results
        run: python scripts/analyze_load_test.py
      - name: Report
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          payload: '{"text": "Load test failed!"}'
```

---

## Implementation Roadmap

### Phase 1: Security & Auth (Weeks 1-2)
- [ ] Implement RBAC for system health dashboard
- [ ] Add API key management endpoints
- [ ] Configure secrets via vault
- [ ] Enable webhook signature verification

### Phase 2: Observability (Weeks 3-4)
- [ ] Set up OpenTelemetry tracing
- [ ] Implement correlation ID propagation
- [ ] Create Grafana dashboards
- [ ] Configure SLO monitoring

### Phase 3: Kapa.ai Enhancements (Weeks 5-6)
- [ ] Add user context to queries
- [ ] Implement feedback analytics
- [ ] Create knowledge source admin UI
- [ ] Configure content guardrails

### Phase 4: Analytics & Insights (Weeks 7-8)
- [ ] Build usage analytics dashboards
- [ ] Implement funnel tracking
- [ ] Add historical trends to health dashboard
- [ ] Create intent analysis reports

### Phase 5: Operational Excellence (Weeks 9-10)
- [ ] Implement feature flags
- [ ] Create all runbooks
- [ ] Set up load testing automation
- [ ] Document performance budgets
- [ ] Conduct chaos engineering exercises

---

## Success Metrics

### Security
- ✅ Zero secrets in repository
- ✅ 100% of endpoints have rate limiting
- ✅ All webhook requests verified
- ✅ RBAC enforced on sensitive endpoints

### Reliability
- ✅ 99.9% uptime SLO met
- ✅ P95 latency < 500ms
- ✅ Zero data loss incidents
- ✅ < 5 minute MTTR (Mean Time To Recovery)

### Observability
- ✅ 100% of requests traced
- ✅ All logs structured and queryable
- ✅ Real-time alerting on SLO violations
- ✅ < 10 minute incident detection time

### User Experience
- ✅ 80%+ helpful feedback on Kapa.ai responses
- ✅ < 2 second query response time
- ✅ 95%+ query success rate
- ✅ Feature flags enable safe rollouts

---

## References

- **Code**: `backend/app/core/` - Core implementation
- **Configuration**: `backend/app/core/config.py` - Environment settings
- **Documentation**: `docs/` - Additional guides
- **Monitoring**: `/metrics` - Prometheus endpoint
- **Health**: `/api/system/health` - System status
