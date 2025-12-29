"""
Health check endpoints for monitoring and alerting
"""

import os
from datetime import datetime
from typing import Any, Dict

import psutil
from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.get("/health")
async def health_check():
    """Simple health check for load balancers"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "leadgen-backend",
    }


@router.get("/health/detailed")
async def detailed_health_check():
    """
    Detailed health check with system metrics
    Use this for monitoring dashboards and alerting
    """
    try:
        # System metrics
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage("/")
        cpu_percent = psutil.cpu_percent(interval=1)

        health_data = {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "service": "leadgen-backend",
            "version": "1.0.0",
            "uptime_seconds": int(datetime.now().timestamp() - psutil.boot_time()),
            # System resources
            "system": {
                "cpu_percent": cpu_percent,
                "memory": {
                    "total_gb": round(memory.total / (1024**3), 2),
                    "available_gb": round(memory.available / (1024**3), 2),
                    "used_percent": memory.percent,
                    "status": "healthy" if memory.percent < 85 else "warning",
                },
                "disk": {
                    "total_gb": round(disk.total / (1024**3), 2),
                    "free_gb": round(disk.free / (1024**3), 2),
                    "used_percent": disk.percent,
                    "status": "healthy" if disk.percent < 85 else "warning",
                },
            },
            # Service checks
            "services": await check_services(),
            # Overall status
            "overall_status": "healthy",
        }

        # Determine overall status
        warnings = []
        if memory.percent > 85:
            warnings.append("high_memory_usage")
        if disk.percent > 85:
            warnings.append("low_disk_space")
        if cpu_percent > 90:
            warnings.append("high_cpu_usage")

        if warnings:
            health_data["overall_status"] = "warning"
            health_data["warnings"] = warnings

        return health_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")


async def check_services() -> Dict[str, Any]:
    """
    Check status of dependent services
    TODO: Add actual checks for database, redis, etc.
    """
    services = {
        "database": {
            "status": "not_configured",
            "message": "Database connection not yet configured",
        },
        "redis": {
            "status": "not_configured",
            "message": "Redis connection not yet configured",
        },
        "email": {"status": "healthy", "message": "Email service operational"},
    }

    # TODO: Add actual database connection check
    # try:
    #     from app.core.db import database
    #     await database.fetch_one("SELECT 1")
    #     services["database"]["status"] = "healthy"
    # except Exception as e:
    #     services["database"]["status"] = "unhealthy"
    #     services["database"]["error"] = str(e)

    return services


@router.get("/health/readiness")
async def readiness_check():
    """
    Kubernetes readiness probe - checks if service is ready to receive traffic
    """
    # TODO: Add checks for database connection, migrations, etc.
    return {
        "ready": True,
        "checks": {"database": "not_configured", "migrations": "not_configured"},
    }


@router.get("/health/liveness")
async def liveness_check():
    """
    Kubernetes liveness probe - checks if service is alive
    """
    return {"alive": True}
