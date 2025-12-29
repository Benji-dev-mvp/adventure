import json
import logging
import os
from datetime import datetime
from typing import List

from dotenv import load_dotenv

load_dotenv()


class JsonFormatter(logging.Formatter):
    """Format logs as JSON for structured logging."""

    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
        }
        if hasattr(record, "request_id"):
            log_data["request_id"] = record.request_id
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_data)


def setup_logging():
    """Configure structured logging for the application."""
    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    handler = logging.StreamHandler()
    handler.setFormatter(JsonFormatter())

    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)
    root_logger.handlers.clear()
    root_logger.addHandler(handler)

    # Reduce noise from verbose libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)


class Settings:
    """Application settings with all enterprise features."""

    # Application
    app_name: str = os.getenv("APP_NAME", "Enterprise App")
    environment: str = os.getenv("ENVIRONMENT", "test" if "pytest" in os.getenv("_", "") else "development")
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    log_level: str = os.getenv("LOG_LEVEL", "INFO")

    # CORS
    allowed_origins: List[str] = [
        "http://localhost:3004",
        "http://127.0.0.1:3004",
        "http://[::1]:3004",
        "https://yourapp.com",
    ]
    allowed_hosts: List[str] = ["*"]
    enable_https_redirect: bool = os.getenv("HTTPS_REDIRECT", "false").lower() == "true"

    # Database
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")
    db_host: str = os.getenv("DB_HOST", "localhost")
    db_port: int = int(os.getenv("DB_PORT", "5432"))
    db_user: str = os.getenv("DB_USER", "postgres")
    db_password: str = os.getenv("DB_PASSWORD", "")
    db_name: str = os.getenv("DB_NAME", "appdb")

    # Redis
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    cache_ttl: int = 300

    # JWT
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24

    # OAuth - Gmail
    google_client_id: str = os.getenv("GOOGLE_CLIENT_ID", "")
    google_client_secret: str = os.getenv("GOOGLE_CLIENT_SECRET", "")

    # OAuth - Salesforce
    salesforce_client_id: str = os.getenv("SALESFORCE_CLIENT_ID", "")
    salesforce_client_secret: str = os.getenv("SALESFORCE_CLIENT_SECRET", "")

    # URLs
    app_url: str = os.getenv("APP_URL", "http://localhost:8000")
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:3004")

    # OAuth2
    google_client_id: str = os.getenv("GOOGLE_CLIENT_ID", "")
    google_client_secret: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    microsoft_client_id: str = os.getenv("MICROSOFT_CLIENT_ID", "")
    microsoft_client_secret: str = os.getenv("MICROSOFT_CLIENT_SECRET", "")
    github_client_id: str = os.getenv("GITHUB_CLIENT_ID", "")
    github_client_secret: str = os.getenv("GITHUB_CLIENT_SECRET", "")

    # AWS
    aws_access_key_id: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    aws_secret_access_key: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    aws_region: str = os.getenv("AWS_REGION", "us-east-1")
    s3_bucket_name: str = os.getenv("S3_BUCKET_NAME", "")
    backup_bucket_name: str = os.getenv("BACKUP_BUCKET_NAME", "")

    # Sentry
    sentry_dsn: str = os.getenv("SENTRY_DSN", "")
    sentry_environment: str = os.getenv("SENTRY_ENVIRONMENT", "development")
    sentry_traces_sample_rate: float = 0.1

    # AI/LLM Configuration
    ai_provider: str = os.getenv("AI_PROVIDER", "mock")  # openai, anthropic, azure, mock
    ai_api_key: str = os.getenv("AI_API_KEY", "")
    ai_model: str = os.getenv("AI_MODEL", "gpt-4o-mini")
    ai_api_base: str = os.getenv("AI_API_BASE", "")
    ai_temperature: float = float(os.getenv("AI_TEMPERATURE", "0.7"))
    ai_max_tokens: int = int(os.getenv("AI_MAX_TOKENS", "2000"))
    anthropic_api_key: str = os.getenv("ANTHROPIC_API_KEY", "")
    azure_openai_endpoint: str = os.getenv("AZURE_OPENAI_ENDPOINT", "")
    azure_openai_api_key: str = os.getenv("AZURE_OPENAI_API_KEY", "")
    azure_openai_deployment: str = os.getenv("AZURE_OPENAI_DEPLOYMENT", "")

    # OpenTelemetry
    otel_exporter_endpoint: str = os.getenv("OTEL_EXPORTER_ENDPOINT", "")

    # Email
    smtp_host: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port: int = int(os.getenv("SMTP_PORT", "587"))
    smtp_user: str = os.getenv("SMTP_USER", "")
    smtp_password: str = os.getenv("SMTP_PASSWORD", "")

    # Security
    rate_limit_per_minute: int = 60
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./data.db")
    # Restrict accepted hosts to mitigate Host header attacks
    allowed_hosts: List[str] = ["localhost", "127.0.0.1", "*.gitpod.io", "*.github.dev"]
    # Basic request body size limit (bytes) to reduce DoS risk
    max_request_body_size: int = int(os.getenv("MAX_REQUEST_BODY_SIZE", "10485760"))
    # Enable HTTPS redirect when running behind TLS-enabled proxy
    enable_https_redirect: bool = os.getenv("ENABLE_HTTPS_REDIRECT", "false").lower() in {
        "1",
        "true",
        "yes",
    }
    # Cache TTL in seconds
    cache_ttl: int = int(os.getenv("CACHE_TTL", "300"))
    # Connection pool settings
    db_pool_size: int = int(os.getenv("DB_POOL_SIZE", "5"))
    db_max_overflow: int = int(os.getenv("DB_MAX_OVERFLOW", "10"))
    db_pool_timeout: int = int(os.getenv("DB_POOL_TIMEOUT", "30"))


setup_logging()
settings = Settings()
