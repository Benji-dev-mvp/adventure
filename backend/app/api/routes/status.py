from datetime import datetime
from fastapi import APIRouter

from app.models.schemas import SystemStatus, ServiceStatus

router = APIRouter()


@router.get("/status", response_model=SystemStatus)
def get_status():
    services = [
        ServiceStatus(name="AI Orchestrator", status="operational", latencyMs=120),
        ServiceStatus(name="Deliverability Guard", status="operational", latencyMs=98),
        ServiceStatus(name="Sequencer", status="degraded", latencyMs=210),
        ServiceStatus(name="CRM Sync", status="operational", latencyMs=140),
    ]
    return SystemStatus(lastUpdated=datetime.utcnow().isoformat(), services=services)
