"""Prometheus metrics exporter for FastAPI."""

import time

from fastapi import Request, Response
from prometheus_client import (
    CONTENT_TYPE_LATEST,
    Counter,
    Gauge,
    Histogram,
    generate_latest,
)

# Define metrics
http_requests_total = Counter(
    "http_requests_total", "Total HTTP requests", ["method", "endpoint", "status"]
)

http_request_duration_seconds = Histogram(
    "http_request_duration_seconds",
    "HTTP request duration in seconds",
    ["method", "endpoint"],
)

http_requests_in_progress = Gauge(
    "http_requests_in_progress", "HTTP requests in progress", ["method", "endpoint"]
)

# Business metrics
active_users = Gauge("active_users_total", "Total active users")
campaigns_total = Gauge("campaigns_total", "Total campaigns")
leads_total = Gauge("leads_total", "Total leads")
emails_sent_total = Counter("emails_sent_total", "Total emails sent")
api_errors_total = Counter("api_errors_total", "Total API errors", ["endpoint", "error_type"])


class PrometheusMiddleware:
    """Middleware to collect Prometheus metrics."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)

        method = scope["method"]
        path = scope["path"]

        # Skip metrics endpoint
        if path == "/metrics":
            return await self.app(scope, receive, send)

        # Track request in progress
        http_requests_in_progress.labels(method=method, endpoint=path).inc()

        start_time = time.time()

        async def send_wrapper(message):
            if message["type"] == "http.response.start":
                status_code = message["status"]
                duration = time.time() - start_time

                # Record metrics
                http_requests_total.labels(method=method, endpoint=path, status=status_code).inc()

                http_request_duration_seconds.labels(method=method, endpoint=path).observe(duration)

                # Track errors
                if status_code >= 400:
                    error_type = "client_error" if status_code < 500 else "server_error"
                    api_errors_total.labels(endpoint=path, error_type=error_type).inc()

            await send(message)

        try:
            await self.app(scope, receive, send_wrapper)
        finally:
            http_requests_in_progress.labels(method=method, endpoint=path).dec()


async def metrics_endpoint(request: Request):
    """Endpoint to expose Prometheus metrics."""
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)


def update_business_metrics(db_session):
    """Update business-specific metrics."""
    from app.models.user import User

    try:
        # Update user metrics
        total_users = db_session.query(User).filter(User.is_active == True).count()
        active_users.set(total_users)

        # Add more business metrics as needed
    except Exception as e:
        print(f"Error updating business metrics: {e}")
