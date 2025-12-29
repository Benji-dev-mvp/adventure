"""
Advanced Performance Monitoring and Optimization
Tracks key metrics, identifies bottlenecks, and provides optimization recommendations
"""

import asyncio
import logging
import time
from collections import defaultdict, deque
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import Any, Callable, Dict, List, Optional

import psutil
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)


class PerformanceMonitor:
    """Advanced performance monitoring"""

    def __init__(self, window_size: int = 1000):
        self.window_size = window_size
        self.request_times = deque(maxlen=window_size)
        self.endpoint_metrics = defaultdict(
            lambda: {
                "count": 0,
                "total_time": 0.0,
                "min_time": float("inf"),
                "max_time": 0.0,
                "errors": 0,
            }
        )
        self.slow_requests = deque(maxlen=100)
        self.error_requests = deque(maxlen=100)

    def record_request(self, endpoint: str, method: str, duration: float, status_code: int):
        """Record request metrics"""
        self.request_times.append(duration)

        key = f"{method} {endpoint}"
        metrics = self.endpoint_metrics[key]
        metrics["count"] += 1
        metrics["total_time"] += duration
        metrics["min_time"] = min(metrics["min_time"], duration)
        metrics["max_time"] = max(metrics["max_time"], duration)

        if status_code >= 400:
            metrics["errors"] += 1
            self.error_requests.append(
                {
                    "endpoint": key,
                    "duration": duration,
                    "status_code": status_code,
                    "timestamp": datetime.utcnow(),
                }
            )

        # Track slow requests (> 1 second)
        if duration > 1.0:
            self.slow_requests.append(
                {"endpoint": key, "duration": duration, "timestamp": datetime.utcnow()}
            )

    def get_stats(self) -> Dict[str, Any]:
        """Get performance statistics"""
        if not self.request_times:
            return {}

        sorted_times = sorted(self.request_times)
        count = len(sorted_times)

        return {
            "total_requests": count,
            "avg_response_time": sum(sorted_times) / count,
            "median_response_time": sorted_times[count // 2],
            "p95_response_time": (
                sorted_times[int(count * 0.95)] if count > 20 else sorted_times[-1]
            ),
            "p99_response_time": (
                sorted_times[int(count * 0.99)] if count > 100 else sorted_times[-1]
            ),
            "min_response_time": sorted_times[0],
            "max_response_time": sorted_times[-1],
            "slow_requests_count": len(self.slow_requests),
            "error_count": len(self.error_requests),
        }

    def get_endpoint_stats(self) -> List[Dict[str, Any]]:
        """Get per-endpoint statistics"""
        stats = []
        for endpoint, metrics in self.endpoint_metrics.items():
            if metrics["count"] > 0:
                stats.append(
                    {
                        "endpoint": endpoint,
                        "count": metrics["count"],
                        "avg_time": metrics["total_time"] / metrics["count"],
                        "min_time": metrics["min_time"],
                        "max_time": metrics["max_time"],
                        "error_rate": metrics["errors"] / metrics["count"] * 100,
                    }
                )

        # Sort by count descending
        stats.sort(key=lambda x: x["count"], reverse=True)
        return stats

    def get_slow_requests(self) -> List[Dict]:
        """Get recent slow requests"""
        return list(self.slow_requests)

    def get_recommendations(self) -> List[str]:
        """Get performance optimization recommendations"""
        recommendations = []
        stats = self.get_stats()

        if stats.get("p95_response_time", 0) > 1.0:
            recommendations.append(
                "95th percentile response time is high (>1s). "
                "Consider adding caching or optimizing database queries."
            )

        if stats.get("slow_requests_count", 0) > 10:
            recommendations.append(
                f"Found {stats['slow_requests_count']} slow requests (>1s). "
                "Review endpoint performance."
            )

        endpoint_stats = self.get_endpoint_stats()
        for stat in endpoint_stats[:5]:
            if stat["avg_time"] > 0.5:
                recommendations.append(
                    f"Endpoint {stat['endpoint']} has high average response time "
                    f"({stat['avg_time']:.2f}s). Consider optimization."
                )
            if stat["error_rate"] > 5:
                recommendations.append(
                    f"Endpoint {stat['endpoint']} has high error rate "
                    f"({stat['error_rate']:.1f}%). Investigate errors."
                )

        return recommendations


class QueryOptimizer:
    """Database query optimization helper"""

    def __init__(self):
        self.query_cache = {}
        self.query_metrics = defaultdict(lambda: {"count": 0, "total_time": 0.0, "cache_hits": 0})

    @asynccontextmanager
    async def track_query(self, query_name: str):
        """Context manager to track query performance"""
        start_time = time.time()
        try:
            yield
        finally:
            duration = time.time() - start_time
            metrics = self.query_metrics[query_name]
            metrics["count"] += 1
            metrics["total_time"] += duration

            if duration > 0.1:  # Log slow queries
                logger.warning(f"Slow query detected: {query_name} took {duration:.3f}s")

    def get_query_stats(self) -> List[Dict[str, Any]]:
        """Get query performance statistics"""
        stats = []
        for query_name, metrics in self.query_metrics.items():
            if metrics["count"] > 0:
                stats.append(
                    {
                        "query": query_name,
                        "count": metrics["count"],
                        "avg_time": metrics["total_time"] / metrics["count"],
                        "total_time": metrics["total_time"],
                        "cache_hit_rate": metrics["cache_hits"] / metrics["count"] * 100,
                    }
                )

        stats.sort(key=lambda x: x["total_time"], reverse=True)
        return stats


class ResourceMonitor:
    """System resource monitoring"""

    @staticmethod
    def get_system_metrics() -> Dict[str, Any]:
        """Get current system resource usage"""
        return {
            "cpu_percent": psutil.cpu_percent(interval=0.1),
            "cpu_count": psutil.cpu_count(),
            "memory_percent": psutil.virtual_memory().percent,
            "memory_available_mb": psutil.virtual_memory().available / (1024 * 1024),
            "disk_percent": psutil.disk_usage("/").percent,
            "network_connections": len(psutil.net_connections()),
        }

    @staticmethod
    def get_process_metrics() -> Dict[str, Any]:
        """Get current process metrics"""
        process = psutil.Process()
        with process.oneshot():
            return {
                "cpu_percent": process.cpu_percent(),
                "memory_mb": process.memory_info().rss / (1024 * 1024),
                "num_threads": process.num_threads(),
                "num_fds": process.num_fds() if hasattr(process, "num_fds") else 0,
                "create_time": datetime.fromtimestamp(process.create_time()).isoformat(),
            }

    @staticmethod
    def check_health() -> Dict[str, Any]:
        """Check system health"""
        system = ResourceMonitor.get_system_metrics()
        process = ResourceMonitor.get_process_metrics()

        warnings = []
        if system["cpu_percent"] > 80:
            warnings.append("High CPU usage detected")
        if system["memory_percent"] > 80:
            warnings.append("High memory usage detected")
        if system["disk_percent"] > 90:
            warnings.append("Low disk space")

        return {
            "healthy": len(warnings) == 0,
            "warnings": warnings,
            "system": system,
            "process": process,
        }


class PerformanceMiddleware(BaseHTTPMiddleware):
    """Middleware to track request performance"""

    def __init__(self, app, monitor: PerformanceMonitor):
        super().__init__(app)
        self.monitor = monitor

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.time()

        try:
            response = await call_next(request)
            duration = time.time() - start_time

            self.monitor.record_request(
                endpoint=request.url.path,
                method=request.method,
                duration=duration,
                status_code=response.status_code,
            )

            # Add performance headers
            response.headers["X-Response-Time"] = f"{duration:.3f}s"

            return response

        except Exception as e:
            duration = time.time() - start_time
            self.monitor.record_request(
                endpoint=request.url.path,
                method=request.method,
                duration=duration,
                status_code=500,
            )
            raise


# Global instances
performance_monitor = PerformanceMonitor()
query_optimizer = QueryOptimizer()


# Decorator for tracking function performance
def track_performance(func_name: Optional[str] = None):
    """Decorator to track function performance"""

    def decorator(func: Callable):
        name = func_name or func.__name__

        async def async_wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                return result
            finally:
                duration = time.time() - start_time
                if duration > 0.1:
                    logger.info(f"{name} took {duration:.3f}s")

        def sync_wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                return result
            finally:
                duration = time.time() - start_time
                if duration > 0.1:
                    logger.info(f"{name} took {duration:.3f}s")

        return async_wrapper if asyncio.iscoroutinefunction(func) else sync_wrapper

    return decorator
