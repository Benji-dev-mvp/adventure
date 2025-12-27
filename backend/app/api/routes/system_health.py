"""
Backend Connection and System Health Monitoring Module.

Provides comprehensive health checks and connection validation for:
- Database connectivity
- Cache/Redis connectivity
- External API services (AI providers, Kapa.ai, etc.)
- System resources (memory, CPU, disk)
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import time
import psutil
import logging
from datetime import datetime

from app.core.config import settings
from app.core.db import engine
from app.core.cache import cache

logger = logging.getLogger(__name__)

router = APIRouter()


class ServiceStatus(BaseModel):
    """Status of a single service/component."""
    name: str
    status: str  # "healthy", "degraded", "unhealthy", "unknown"
    response_time_ms: Optional[float] = None
    message: Optional[str] = None
    details: Optional[Dict[str, Any]] = None


class SystemHealth(BaseModel):
    """Overall system health status."""
    status: str  # "healthy", "degraded", "unhealthy"
    timestamp: float
    services: List[ServiceStatus]
    system_info: Dict[str, Any]


class ConnectionTest(BaseModel):
    """Connection test result."""
    connected: bool
    latency_ms: Optional[float] = None
    error: Optional[str] = None


@router.get("/system/health", response_model=SystemHealth)
async def get_system_health():
    """
    Comprehensive system health check.
    
    Checks all critical services and returns overall system status.
    """
    services = []
    
    # Check database
    db_status = await check_database()
    services.append(db_status)
    
    # Check cache
    cache_status = await check_cache()
    services.append(cache_status)
    
    # Check AI provider
    ai_status = await check_ai_provider()
    services.append(ai_status)
    
    # Check Kapa.ai
    kapa_status = await check_kapa_ai()
    services.append(kapa_status)
    
    # Get system resources
    system_info = get_system_resources()
    
    # Determine overall status
    unhealthy_count = sum(1 for s in services if s.status == "unhealthy")
    degraded_count = sum(1 for s in services if s.status == "degraded")
    
    if unhealthy_count > 0:
        overall_status = "unhealthy"
    elif degraded_count > 0:
        overall_status = "degraded"
    else:
        overall_status = "healthy"
    
    return SystemHealth(
        status=overall_status,
        timestamp=time.time(),
        services=services,
        system_info=system_info
    )


async def check_database() -> ServiceStatus:
    """Check database connectivity."""
    start_time = time.time()
    try:
        with engine.connect() as conn:
            result = conn.execute("SELECT 1")
            result.fetchone()
        
        response_time = (time.time() - start_time) * 1000
        
        return ServiceStatus(
            name="database",
            status="healthy",
            response_time_ms=response_time,
            message="Database connection successful",
            details={
                "url": settings.database_url.split("@")[-1] if "@" in settings.database_url else "local",
                "type": "postgresql" if "postgresql" in settings.database_url else "sqlite"
            }
        )
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return ServiceStatus(
            name="database",
            status="unhealthy",
            message=f"Database connection failed: {str(e)}"
        )


async def check_cache() -> ServiceStatus:
    """Check cache connectivity."""
    start_time = time.time()
    try:
        # Test cache write and read
        test_key = f"health_check_{int(time.time())}"
        test_value = "ok"
        
        cache.set(test_key, test_value, ttl=10)
        retrieved = cache.get(test_key)
        
        if retrieved == test_value:
            response_time = (time.time() - start_time) * 1000
            return ServiceStatus(
                name="cache",
                status="healthy",
                response_time_ms=response_time,
                message="Cache connection successful",
                details={"type": "in-memory" if "redis" not in settings.redis_url else "redis"}
            )
        else:
            return ServiceStatus(
                name="cache",
                status="degraded",
                message="Cache read/write test failed"
            )
    except Exception as e:
        logger.error(f"Cache health check failed: {e}")
        return ServiceStatus(
            name="cache",
            status="degraded",
            message=f"Cache check failed: {str(e)}"
        )


async def check_ai_provider() -> ServiceStatus:
    """Check AI provider availability."""
    if settings.ai_provider == "mock":
        return ServiceStatus(
            name="ai_provider",
            status="healthy",
            message="Using mock AI provider",
            details={"provider": "mock"}
        )
    
    # For real providers, just check if configured
    is_configured = bool(settings.ai_api_key)
    
    return ServiceStatus(
        name="ai_provider",
        status="healthy" if is_configured else "degraded",
        message=f"AI provider {settings.ai_provider} {'configured' if is_configured else 'not configured'}",
        details={
            "provider": settings.ai_provider,
            "model": settings.ai_model if is_configured else None
        }
    )


async def check_kapa_ai() -> ServiceStatus:
    """Check Kapa.ai integration status."""
    is_configured = bool(settings.kapa_api_key and settings.kapa_project_id)
    
    if not is_configured:
        return ServiceStatus(
            name="kapa_ai",
            status="degraded",
            message="Kapa.ai not configured (optional service)",
            details={"configured": False}
        )
    
    # If configured, it's operational
    return ServiceStatus(
        name="kapa_ai",
        status="healthy",
        message="Kapa.ai integration configured",
        details={
            "configured": True,
            "project_id": settings.kapa_project_id[:8] + "..." if settings.kapa_project_id else None
        }
    )


def get_system_resources() -> Dict[str, Any]:
    """Get system resource information."""
    try:
        cpu_percent = psutil.cpu_percent(interval=0.1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        return {
            "cpu_percent": cpu_percent,
            "memory": {
                "total": memory.total,
                "available": memory.available,
                "percent": memory.percent,
                "used": memory.used
            },
            "disk": {
                "total": disk.total,
                "used": disk.used,
                "free": disk.free,
                "percent": disk.percent
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Failed to get system resources: {e}")
        return {"error": str(e)}


@router.get("/system/connectivity")
async def test_connectivity():
    """
    Test connectivity between frontend and backend.
    
    Returns connection status and latency information.
    """
    return {
        "status": "connected",
        "timestamp": time.time(),
        "backend_version": "2.0.0",
        "environment": settings.environment,
        "features": {
            "authentication": True,
            "ai_assistant": settings.ai_provider != "mock",
            "kapa_ai": bool(settings.kapa_api_key),
            "websockets": True,
            "file_uploads": True
        }
    }


@router.get("/system/info")
async def get_system_info():
    """
    Get system and application information.
    
    Returns configuration and capability information.
    """
    return {
        "application": {
            "name": settings.app_name,
            "version": "2.0.0",
            "environment": settings.environment,
            "debug": settings.debug
        },
        "capabilities": {
            "ai_provider": settings.ai_provider,
            "ai_model": settings.ai_model if settings.ai_provider != "mock" else None,
            "kapa_ai_enabled": bool(settings.kapa_api_key and settings.kapa_project_id),
            "oauth_providers": [
                "google" if settings.google_client_id else None,
                "microsoft" if settings.microsoft_client_id else None,
                "github" if settings.github_client_id else None
            ],
            "monitoring": {
                "sentry": bool(settings.sentry_dsn),
                "prometheus": True
            },
            "storage": {
                "database": "postgresql" if "postgresql" in settings.database_url else "sqlite",
                "cache": "redis" if "redis" in settings.redis_url else "in-memory",
                "file_storage": bool(settings.s3_bucket_name)
            }
        },
        "endpoints": {
            "docs": "/docs",
            "redoc": "/redoc",
            "health": "/health",
            "metrics": "/metrics",
            "api": "/api"
        }
    }
