"""
Sentry error tracking integration
"""
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.celery import CeleryIntegration
import os


def init_sentry():
    """
    Initialize Sentry for error tracking and performance monitoring
    """
    sentry_dsn = os.getenv("SENTRY_DSN")
    environment = os.getenv("ENVIRONMENT", "development")
    
    if not sentry_dsn:
        print("Warning: SENTRY_DSN not configured. Error tracking disabled.")
        return
    
    sentry_sdk.init(
        dsn=sentry_dsn,
        environment=environment,
        
        # Integrations
        integrations=[
            FastApiIntegration(transaction_style="endpoint"),
            CeleryIntegration(),
        ],
        
        # Performance monitoring
        traces_sample_rate=1.0 if environment == "development" else 0.1,
        
        # Error sampling
        sample_rate=1.0,
        
        # Release tracking
        release=os.getenv("APP_VERSION", "1.0.0"),
        
        # Additional options
        send_default_pii=False,  # Don't send personally identifiable information
        attach_stacktrace=True,
        max_breadcrumbs=50,
        
        # Before send hook to filter sensitive data
        before_send=filter_sensitive_data,
    )
    
    print(f"Sentry initialized for environment: {environment}")


def filter_sensitive_data(event, hint):
    """
    Filter sensitive data before sending to Sentry
    """
    # Remove sensitive headers
    if "request" in event and "headers" in event["request"]:
        headers = event["request"]["headers"]
        sensitive_headers = ["authorization", "cookie", "x-api-key"]
        
        for header in sensitive_headers:
            if header in headers:
                headers[header] = "[FILTERED]"
    
    # Remove sensitive query parameters
    if "request" in event and "query_string" in event["request"]:
        query = event["request"]["query_string"]
        if query and ("password" in query.lower() or "token" in query.lower()):
            event["request"]["query_string"] = "[FILTERED]"
    
    # Remove sensitive body data
    if "request" in event and "data" in event["request"]:
        data = event["request"]["data"]
        if isinstance(data, dict):
            sensitive_fields = ["password", "token", "secret", "api_key"]
            for field in sensitive_fields:
                if field in data:
                    data[field] = "[FILTERED]"
    
    return event


def capture_exception(error: Exception, context: dict = None):
    """
    Capture an exception with additional context
    """
    if context:
        sentry_sdk.set_context("custom", context)
    
    sentry_sdk.capture_exception(error)


def capture_message(message: str, level: str = "info", context: dict = None):
    """
    Capture a message with additional context
    """
    if context:
        sentry_sdk.set_context("custom", context)
    
    sentry_sdk.capture_message(message, level=level)


def set_user(user_id: int, email: str = None, username: str = None):
    """
    Set the current user for error tracking
    """
    sentry_sdk.set_user({
        "id": user_id,
        "email": email,
        "username": username
    })


def add_breadcrumb(message: str, category: str = "default", level: str = "info", data: dict = None):
    """
    Add a breadcrumb for better error context
    """
    sentry_sdk.add_breadcrumb(
        message=message,
        category=category,
        level=level,
        data=data or {}
    )
