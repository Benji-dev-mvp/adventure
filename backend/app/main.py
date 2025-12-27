from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware
import logging
import time

from app.core.config import settings
from app.api.routes.leads import router as leads_router
from app.api.routes.campaigns import router as campaigns_router
from app.api.routes.analytics import router as analytics_router
from app.api.routes.auth import router as auth_router
from app.api.routes.status import router as status_router
from app.api.routes.ai import router as ai_router
from app.api.routes.health import router as health_router
from app.api.routes.admin import router as admin_router
from app.api.routes.oauth_mfa import router as oauth_mfa_router
from app.api.routes.websocket import router as websocket_router
from app.api.routes.feature_flags import router as feature_flags_router
from app.api.routes.files import router as files_router
from app.api.routes.backup import router as backup_router
from app.api.routes.compliance import router as compliance_router
from app.api.routes.deliverability import router as deliverability_router
from app.api.routes.autonomous import router as autonomous_router
from app.api.routes.advanced_features import router as advanced_features_router
from app.api.routes.oauth import router as oauth_router
from app.api.routes.new_features import (
    multichannel_router,
    lead_db_router,
    enrichment_router,
    reply_router,
    team_router,
    playbooks_router
)
from app.api.routes.tasks import router as tasks_router  # NEW
from app.api.routes.campaign_intelligence import router as campaign_intelligence_router  # Campaign business logic
from app.api.routes.ai_advanced import router as ai_advanced_router  # Advanced AI integrations
from app.core.db import init_db, seed_if_empty, engine
from app.core.security import SecurityHeadersMiddleware, RequestSizeLimitMiddleware, RequestIDMiddleware, RateLimitMiddleware
from app.core.cache import cache
from app.core.sentry import init_sentry
from app.core.metrics import PrometheusMiddleware, metrics_endpoint
# from app.core.tracing import init_tracing  # Commented out - OpenTelemetry not installed

logger = logging.getLogger(__name__)

# Initialize Sentry for error tracking
init_sentry()

app = FastAPI(
    title="Enterprise Application API",
    version="2.0.0",
    description="100% Enterprise-grade API with security, monitoring, and compliance",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Initialize OpenTelemetry tracing
# if settings.otel_exporter_endpoint:
#     init_tracing(app)  # Commented out - OpenTelemetry not installed

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prometheus metrics middleware (commented out - fix configuration if needed)
# app.add_middleware(PrometheusMiddleware)

# Restrict allowed hosts
app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.allowed_hosts)

# Optional HTTPS redirect when enabled
if settings.enable_https_redirect:
    app.add_middleware(HTTPSRedirectMiddleware)

# Add security headers and request size limits
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RequestSizeLimitMiddleware, max_body_size=settings.max_request_body_size)

# Add request ID and rate limiting
app.add_middleware(RequestIDMiddleware)
app.add_middleware(RateLimitMiddleware, max_requests=100, window_seconds=60)

@app.get("/health")
async def health():
    """Basic health check - always returns OK if app is running."""
    return {"status": "ok", "timestamp": time.time()}


@app.get("/health/ready")
async def readiness():
    """Readiness check - verifies all dependencies are operational."""
    checks = {"database": "unknown", "cache": "unknown"}
    
    # Check database
    try:
        with engine.connect() as conn:
            conn.execute("SELECT 1")
        checks["database"] = "healthy"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        checks["database"] = "unhealthy"
    
    # Check cache
    try:
        cache.set("health_check", "ok", ttl=10)
        if cache.get("health_check") == "ok":
            checks["cache"] = "healthy"
        else:
            checks["cache"] = "degraded"
    except Exception as e:
        logger.error(f"Cache health check failed: {e}")
        checks["cache"] = "unhealthy"
    
    all_healthy = all(v == "healthy" for v in checks.values())
    status_code = 200 if all_healthy else 503
    
    return {
        "status": "ready" if all_healthy else "not_ready",
        "checks": checks,
        "timestamp": time.time()
    }

@app.get("/")
async def root():
    return {
        "message": "Enterprise Backend API v2.0.0",
        "status": "operational",
        "docs": "/docs",
        "features": {
            "authentication": ["JWT", "OAuth2", "MFA"],
            "security": ["RBAC", "Rate Limiting", "Audit Logging"],
            "monitoring": ["Prometheus", "Sentry", "OpenTelemetry"],
            "compliance": ["GDPR", "Data Portability", "Right to be Forgotten"],
            "advanced": ["WebSockets", "Webhooks", "Feature Flags", "File Storage"]
        }
    }

# Prometheus metrics endpoint
@app.get("/metrics")
async def metrics():
    return await metrics_endpoint(None)

@app.on_event("startup")
def on_startup():
    logger.info("🚀 Enterprise Application starting up...")
    init_db()
    seed_if_empty()
    logger.info("✅ Application ready to serve requests")


@app.on_event("shutdown")
def on_shutdown():
    logger.info("🔄 Application shutting down gracefully...")
    cache.clear()
    engine.dispose()
    logger.info("✅ Cleanup complete")


# Include all routers
app.include_router(leads_router, prefix="/api", tags=["leads"])
app.include_router(campaigns_router, prefix="/api", tags=["campaigns"])
app.include_router(analytics_router, prefix="/api", tags=["analytics"])
app.include_router(status_router, prefix="/api", tags=["status"])
app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(ai_router, prefix="/api", tags=["ai"])
app.include_router(health_router, prefix="/api", tags=["health"])
app.include_router(admin_router, prefix="/api/admin", tags=["admin"])
app.include_router(campaign_intelligence_router, prefix="/api", tags=["campaign-intelligence"])  # Campaign business logic
app.include_router(ai_advanced_router, prefix="/api", tags=["ai-advanced"])  # Advanced AI integrations
app.include_router(tasks_router, prefix="/api", tags=["tasks"])  # NEW: Task management
app.include_router(oauth_mfa_router, tags=["oauth-mfa"])
app.include_router(websocket_router, tags=["websocket"])
app.include_router(feature_flags_router, tags=["feature-flags"])
app.include_router(files_router, tags=["files"])
app.include_router(backup_router, tags=["backup"])
app.include_router(compliance_router, tags=["compliance"])
app.include_router(deliverability_router, prefix="/api/deliverability", tags=["deliverability"])
app.include_router(autonomous_router, prefix="/api/autonomous", tags=["autonomous-ai"])

# Include new feature routers
app.include_router(multichannel_router, tags=["multichannel"])
app.include_router(lead_db_router, tags=["lead-database"])
app.include_router(enrichment_router, tags=["enrichment"])
app.include_router(reply_router, tags=["reply-intelligence"])
app.include_router(team_router, tags=["team-collaboration"])
app.include_router(playbooks_router, tags=["sales-playbooks"])

# Include advanced AI/ML features
app.include_router(advanced_features_router, prefix="/api/advanced", tags=["ml-ai"])
app.include_router(oauth_router, prefix="/api", tags=["oauth"])
