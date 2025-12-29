"""OpenTelemetry distributed tracing configuration."""

from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.redis import RedisInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from opentelemetry.sdk.resources import SERVICE_NAME, SERVICE_VERSION, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.trace import Status, StatusCode

from app.core.config import settings


def init_tracing(app):
    """Initialize OpenTelemetry tracing."""
    # Create resource
    resource = Resource.create(
        {
            SERVICE_NAME: "enterprise-backend",
            SERVICE_VERSION: "1.0.0",
            "environment": settings.environment,
        }
    )

    # Set up tracer provider
    provider = TracerProvider(resource=resource)

    # Configure OTLP exporter (for Jaeger/Tempo)
    if settings.otel_exporter_endpoint:
        otlp_exporter = OTLPSpanExporter(endpoint=settings.otel_exporter_endpoint, insecure=True)
        provider.add_span_processor(BatchSpanProcessor(otlp_exporter))

    # Set global tracer provider
    trace.set_tracer_provider(provider)

    # Instrument FastAPI
    FastAPIInstrumentor.instrument_app(app)

    # Instrument SQLAlchemy
    SQLAlchemyInstrumentor().instrument()

    # Instrument Redis
    RedisInstrumentor().instrument()

    return trace.get_tracer(__name__)


def trace_function(func):
    """Decorator to trace function execution."""
    tracer = trace.get_tracer(__name__)

    async def wrapper(*args, **kwargs):
        with tracer.start_as_current_span(func.__name__) as span:
            try:
                result = await func(*args, **kwargs)
                span.set_status(Status(StatusCode.OK))
                return result
            except Exception as e:
                span.set_status(Status(StatusCode.ERROR, str(e)))
                span.record_exception(e)
                raise

    return wrapper
