"""
Celery configuration for background tasks
"""
from celery import Celery
import os

# Redis connection for Celery broker and result backend
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Create Celery app
celery_app = Celery(
    "leadgen_tasks",
    broker=REDIS_URL,
    backend=REDIS_URL
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    
    # Task routing
    task_routes={
        "app.tasks.email_tasks.*": {"queue": "emails"},
        "app.tasks.campaign_tasks.*": {"queue": "campaigns"},
        "app.tasks.analytics_tasks.*": {"queue": "analytics"},
    },
    
    # Task execution settings
    task_track_started=True,
    task_time_limit=300,  # 5 minutes
    task_soft_time_limit=270,  # 4.5 minutes
    
    # Result backend settings
    result_expires=3600,  # 1 hour
    
    # Worker settings
    worker_prefetch_multiplier=4,
    worker_max_tasks_per_child=1000,
)

# Auto-discover tasks
celery_app.autodiscover_tasks([
    "app.tasks.email_tasks",
    "app.tasks.campaign_tasks", 
    "app.tasks.analytics_tasks",
    "app.tasks.ai_workflows"  # NEW: AI workflow tasks
])


@celery_app.task(bind=True)
def debug_task(self):
    """Debug task to test Celery setup"""
    print(f"Request: {self.request!r}")
    return "Celery is working!"
