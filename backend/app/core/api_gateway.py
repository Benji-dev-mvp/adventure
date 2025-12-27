"""
API Gateway patterns: circuit breaker, request logging, and advanced error handling.
"""
import logging
import time
import boto3
from typing import Callable, Optional, Any, Dict
from functools import wraps
from datetime import datetime, timedelta
from enum import Enum
import json

logger = logging.getLogger(__name__)


class CircuitState(str, Enum):
    CLOSED = "closed"  # Normal operation
    OPEN = "open"  # Failing, reject requests
    HALF_OPEN = "half_open"  # Testing if service recovered


class CircuitBreaker:
    """
    Circuit breaker pattern for external API calls.
    Prevents cascading failures by failing fast when service is down.
    """
    
    def __init__(
        self,
        failure_threshold: int = 5,
        timeout: int = 60,
        success_threshold: int = 2
    ):
        self.failure_threshold = failure_threshold
        self.timeout = timeout  # seconds before trying again
        self.success_threshold = success_threshold
        
        self.failure_count = 0
        self.success_count = 0
        self.last_failure_time: Optional[datetime] = None
        self.state = CircuitState.CLOSED
    
    def call(self, func: Callable, *args, **kwargs) -> Any:
        """
        Execute function with circuit breaker protection.
        """
        if self.state == CircuitState.OPEN:
            if self._should_attempt_reset():
                self.state = CircuitState.HALF_OPEN
                logger.info("Circuit breaker entering HALF_OPEN state")
            else:
                raise Exception("Circuit breaker is OPEN - service unavailable")
        
        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise
    
    def _on_success(self):
        """Handle successful call"""
        self.failure_count = 0
        
        if self.state == CircuitState.HALF_OPEN:
            self.success_count += 1
            if self.success_count >= self.success_threshold:
                self.state = CircuitState.CLOSED
                self.success_count = 0
                logger.info("Circuit breaker CLOSED - service recovered")
    
    def _on_failure(self):
        """Handle failed call"""
        self.failure_count += 1
        self.last_failure_time = datetime.now()
        
        if self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN
            logger.error(f"Circuit breaker OPEN after {self.failure_count} failures")
    
    def _should_attempt_reset(self) -> bool:
        """Check if enough time has passed to try again"""
        if not self.last_failure_time:
            return True
        return (datetime.now() - self.last_failure_time).seconds >= self.timeout


# Global circuit breakers for external services
circuit_breakers: Dict[str, CircuitBreaker] = {
    "sendgrid": CircuitBreaker(failure_threshold=5, timeout=60),
    "clearbit": CircuitBreaker(failure_threshold=3, timeout=120),
    "openai": CircuitBreaker(failure_threshold=3, timeout=30)
}


def with_circuit_breaker(service_name: str):
    """
    Decorator to protect external API calls with circuit breaker.
    
    Usage:
        @with_circuit_breaker("sendgrid")
        def send_email(to, subject, body):
            ...
    """
    def decorator(func: Callable):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if service_name not in circuit_breakers:
                circuit_breakers[service_name] = CircuitBreaker()
            
            breaker = circuit_breakers[service_name]
            return breaker.call(func, *args, **kwargs)
        return wrapper
    return decorator


class RequestLogger:
    """
    Log API requests/responses to S3 for compliance and debugging.
    """
    
    def __init__(self, bucket_name: str):
        self.bucket_name = bucket_name
        try:
            self.s3_client = boto3.client('s3')
        except Exception as e:
            logger.warning(f"S3 client not initialized: {e}")
            self.s3_client = None
    
    def log_request(
        self,
        request_id: str,
        method: str,
        path: str,
        user_id: Optional[int],
        request_body: Optional[Any] = None,
        response_body: Optional[Any] = None,
        status_code: int = 200,
        duration_ms: float = 0
    ):
        """
        Log request/response pair to S3.
        
        Stored in structured format:
        logs/YYYY/MM/DD/HH/{request_id}.json
        """
        if not self.s3_client:
            return
        
        now = datetime.now()
        log_entry = {
            "request_id": request_id,
            "timestamp": now.isoformat(),
            "method": method,
            "path": path,
            "user_id": user_id,
            "status_code": status_code,
            "duration_ms": duration_ms,
            "request_body": self._sanitize_body(request_body),
            "response_body": self._sanitize_body(response_body)
        }
        
        # S3 key with date partitioning
        key = f"logs/{now.year}/{now.month:02d}/{now.day:02d}/{now.hour:02d}/{request_id}.json"
        
        try:
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=key,
                Body=json.dumps(log_entry),
                ContentType="application/json"
            )
            logger.debug(f"Logged request {request_id} to S3")
        except Exception as e:
            logger.error(f"Failed to log to S3: {e}")
    
    def _sanitize_body(self, body: Any) -> Any:
        """Remove sensitive data before logging"""
        if body is None:
            return None
        
        if isinstance(body, dict):
            sanitized = body.copy()
            sensitive_fields = ["password", "token", "api_key", "secret", "credit_card"]
            for field in sensitive_fields:
                if field in sanitized:
                    sanitized[field] = "***REDACTED***"
            return sanitized
        
        return str(body)[:1000]  # Truncate large bodies


class APIVersionManager:
    """
    Manage API versioning and deprecation warnings.
    """
    
    VERSIONS = {
        "v1": {
            "status": "deprecated",
            "sunset_date": "2025-12-31",
            "message": "API v1 is deprecated. Please upgrade to v2."
        },
        "v2": {
            "status": "current",
            "sunset_date": None,
            "message": None
        },
        "v3": {
            "status": "beta",
            "sunset_date": None,
            "message": "API v3 is in beta. Use with caution."
        }
    }
    
    @staticmethod
    def get_version_info(version: str) -> Dict[str, Any]:
        """Get version information"""
        return APIVersionManager.VERSIONS.get(version, {
            "status": "unknown",
            "message": "Unknown API version"
        })
    
    @staticmethod
    def check_deprecation(version: str) -> Optional[Dict[str, Any]]:
        """Check if version is deprecated and return warning"""
        version_info = APIVersionManager.get_version_info(version)
        
        if version_info.get("status") == "deprecated":
            sunset_date = version_info.get("sunset_date")
            return {
                "warning": version_info.get("message"),
                "sunset_date": sunset_date,
                "upgrade_url": f"/docs/api/{version}/migration"
            }
        
        return None


class RateLimiter:
    """
    Advanced rate limiter with tiered limits based on user plan.
    """
    
    TIERS = {
        "free": {"requests_per_hour": 100, "requests_per_day": 1000},
        "pro": {"requests_per_hour": 1000, "requests_per_day": 20000},
        "enterprise": {"requests_per_hour": 10000, "requests_per_day": 500000}
    }
    
    @staticmethod
    def get_limits(tier: str) -> Dict[str, int]:
        """Get rate limits for tier"""
        return RateLimiter.TIERS.get(tier, RateLimiter.TIERS["free"])
    
    @staticmethod
    def check_rate_limit(
        user_id: int,
        tier: str,
        current_usage: Dict[str, int]
    ) -> tuple[bool, Optional[Dict[str, Any]]]:
        """
        Check if request is within rate limits.
        
        Returns:
            (allowed: bool, limit_info: dict)
        """
        limits = RateLimiter.get_limits(tier)
        
        hourly_usage = current_usage.get("hourly", 0)
        daily_usage = current_usage.get("daily", 0)
        
        if hourly_usage >= limits["requests_per_hour"]:
            return False, {
                "error": "Hourly rate limit exceeded",
                "limit": limits["requests_per_hour"],
                "usage": hourly_usage,
                "reset_at": "top of next hour"
            }
        
        if daily_usage >= limits["requests_per_day"]:
            return False, {
                "error": "Daily rate limit exceeded",
                "limit": limits["requests_per_day"],
                "usage": daily_usage,
                "reset_at": "midnight UTC"
            }
        
        return True, {
            "hourly_remaining": limits["requests_per_hour"] - hourly_usage,
            "daily_remaining": limits["requests_per_day"] - daily_usage
        }


class RetryStrategy:
    """
    Intelligent retry strategy with exponential backoff.
    """
    
    @staticmethod
    def retry_with_backoff(
        func: Callable,
        max_retries: int = 3,
        initial_delay: float = 1.0,
        backoff_factor: float = 2.0,
        exceptions: tuple = (Exception,)
    ) -> Any:
        """
        Retry function with exponential backoff.
        
        Args:
            func: Function to retry
            max_retries: Maximum number of retry attempts
            initial_delay: Initial delay in seconds
            backoff_factor: Multiplier for delay after each retry
            exceptions: Tuple of exceptions to catch
        """
        delay = initial_delay
        last_exception = None
        
        for attempt in range(max_retries + 1):
            try:
                return func()
            except exceptions as e:
                last_exception = e
                
                if attempt == max_retries:
                    logger.error(f"Max retries ({max_retries}) exceeded")
                    raise
                
                logger.warning(f"Attempt {attempt + 1} failed: {e}. Retrying in {delay}s...")
                time.sleep(delay)
                delay *= backoff_factor
        
        raise last_exception


# Export singleton instances
request_logger = RequestLogger(bucket_name="api-logs")
api_version_manager = APIVersionManager()
retry_strategy = RetryStrategy()
