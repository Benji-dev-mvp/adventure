"""Structured logging module with correlation IDs and JSON formatting."""
import logging
import json
from datetime import datetime
from typing import Optional, Dict, Any
from contextvars import ContextVar
from functools import wraps

# Context variable for request correlation ID
correlation_id_var: ContextVar[Optional[str]] = ContextVar('correlation_id', default=None)


class StructuredFormatter(logging.Formatter):
    """Custom formatter that outputs logs as structured JSON."""
    
    def format(self, record: logging.LogRecord) -> str:
        """Format log record as JSON."""
        log_data = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        # Add correlation ID if available
        correlation_id = correlation_id_var.get()
        if correlation_id:
            log_data["correlation_id"] = correlation_id
        
        # Add request ID from record if available
        if hasattr(record, "request_id"):
            log_data["request_id"] = record.request_id
        
        # Add tenant ID from record if available
        if hasattr(record, "tenant_id"):
            log_data["tenant_id"] = record.tenant_id
        
        # Add user ID from record if available
        if hasattr(record, "user_id"):
            log_data["user_id"] = record.user_id
        
        # Add exception info if present
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
            log_data["exc_type"] = record.exc_info[0].__name__ if record.exc_info[0] else None
        
        # Add extra fields
        if hasattr(record, "extra"):
            log_data["extra"] = record.extra
        
        return json.dumps(log_data)


class StructuredLogger:
    """Wrapper for standard logger with structured logging support."""
    
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
    
    def _log(
        self,
        level: int,
        message: str,
        correlation_id: Optional[str] = None,
        tenant_id: Optional[int] = None,
        user_id: Optional[int] = None,
        extra: Optional[Dict[str, Any]] = None,
        exc_info: Optional[bool] = None
    ):
        """Internal logging method with structured fields."""
        # Create extra dict
        log_extra = {}
        
        if correlation_id:
            log_extra["correlation_id"] = correlation_id
        elif correlation_id_var.get():
            log_extra["correlation_id"] = correlation_id_var.get()
        
        if tenant_id:
            log_extra["tenant_id"] = tenant_id
        
        if user_id:
            log_extra["user_id"] = user_id
        
        if extra:
            log_extra["extra"] = extra
        
        self.logger.log(level, message, extra=log_extra, exc_info=exc_info)
    
    def debug(self, message: str, **kwargs):
        """Log debug message."""
        self._log(logging.DEBUG, message, **kwargs)
    
    def info(self, message: str, **kwargs):
        """Log info message."""
        self._log(logging.INFO, message, **kwargs)
    
    def warning(self, message: str, **kwargs):
        """Log warning message."""
        self._log(logging.WARNING, message, **kwargs)
    
    def error(self, message: str, **kwargs):
        """Log error message."""
        self._log(logging.ERROR, message, **kwargs)
    
    def critical(self, message: str, **kwargs):
        """Log critical message."""
        self._log(logging.CRITICAL, message, **kwargs)
    
    def exception(self, message: str, **kwargs):
        """Log exception with traceback."""
        kwargs["exc_info"] = True
        self._log(logging.ERROR, message, **kwargs)


def setup_structured_logging(
    level: str = "INFO",
    format_json: bool = True
) -> None:
    """Configure structured logging for the application.
    
    Args:
        level: Log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        format_json: Whether to use JSON formatting (True) or standard (False)
    """
    log_level = getattr(logging, level.upper(), logging.INFO)
    
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)
    root_logger.handlers.clear()
    
    # Create console handler
    handler = logging.StreamHandler()
    handler.setLevel(log_level)
    
    # Set formatter
    if format_json:
        formatter = StructuredFormatter()
    else:
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
    
    handler.setFormatter(formatter)
    root_logger.addHandler(handler)
    
    # Reduce noise from verbose libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)


def set_correlation_id(correlation_id: str) -> None:
    """Set correlation ID for current context."""
    correlation_id_var.set(correlation_id)


def get_correlation_id() -> Optional[str]:
    """Get correlation ID from current context."""
    return correlation_id_var.get()


def clear_correlation_id() -> None:
    """Clear correlation ID from current context."""
    correlation_id_var.set(None)


def log_with_context(
    tenant_id: Optional[int] = None,
    user_id: Optional[int] = None,
    correlation_id: Optional[str] = None
):
    """Decorator to add context to all logs in a function.
    
    Usage:
        @log_with_context(tenant_id=1, user_id=123)
        async def my_function():
            logger.info("This will include tenant and user context")
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Set context
            old_correlation_id = correlation_id_var.get()
            
            if correlation_id:
                set_correlation_id(correlation_id)
            
            try:
                # Execute function
                result = await func(*args, **kwargs)
                return result
            finally:
                # Restore old context
                if old_correlation_id:
                    set_correlation_id(old_correlation_id)
                else:
                    clear_correlation_id()
        
        return wrapper
    return decorator


# Create default logger
logger = StructuredLogger(__name__)
