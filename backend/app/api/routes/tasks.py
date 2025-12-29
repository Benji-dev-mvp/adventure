"""
Task management API routes for viewing and managing Celery tasks.
"""

import logging
from datetime import datetime
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from app.core.celery_app import celery_app
from app.core.security import get_current_user, require_permission
from app.models.user import Permission, User

router = APIRouter()
logger = logging.getLogger(__name__)


class TaskStatus(BaseModel):
    task_id: str
    name: str
    status: str
    result: Optional[Any] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error: Optional[str] = None


class QueueInfo(BaseModel):
    name: str
    length: int
    workers: int


class TaskListResponse(BaseModel):
    tasks: List[TaskStatus]
    total: int


@router.get("/admin/tasks/active", response_model=TaskListResponse)
@require_permission(Permission.SYSTEM_ADMIN)
async def list_active_tasks(
    user: User = Depends(get_current_user), limit: int = Query(default=50, le=200)
):
    """Get list of currently active/pending tasks"""
    try:
        # Get active tasks from Celery
        inspect = celery_app.control.inspect()
        active = inspect.active()
        scheduled = inspect.scheduled()

        tasks = []

        # Process active tasks
        if active:
            for worker, worker_tasks in active.items():
                for task in worker_tasks:
                    tasks.append(
                        TaskStatus(
                            task_id=task.get("id", ""),
                            name=task.get("name", ""),
                            status="active",
                            started_at=(
                                datetime.fromtimestamp(task.get("time_start", 0))
                                if task.get("time_start")
                                else None
                            ),
                        )
                    )

        # Process scheduled tasks
        if scheduled:
            for worker, worker_tasks in scheduled.items():
                for task in worker_tasks:
                    tasks.append(
                        TaskStatus(
                            task_id=task.get("request", {}).get("id", ""),
                            name=task.get("request", {}).get("name", ""),
                            status="scheduled",
                        )
                    )

        return TaskListResponse(tasks=tasks[:limit], total=len(tasks))

    except Exception as e:
        logger.error(f"Failed to get active tasks: {e}")
        return TaskListResponse(tasks=[], total=0)


@router.get("/admin/tasks/failed", response_model=TaskListResponse)
@require_permission(Permission.SYSTEM_ADMIN)
async def list_failed_tasks(
    user: User = Depends(get_current_user), limit: int = Query(default=50, le=200)
):
    """Get list of failed tasks for retry"""
    # In production, query failed tasks from Redis/database
    # For now, return empty list
    return TaskListResponse(tasks=[], total=0)


@router.post("/admin/tasks/{task_id}/retry")
@require_permission(Permission.SYSTEM_ADMIN)
async def retry_failed_task(task_id: str, user: User = Depends(get_current_user)):
    """Retry a failed task"""
    try:
        # In production: fetch task details and retry with same args
        result = celery_app.send_task("app.tasks.monitored_task_example", task_id=task_id)

        return {
            "message": "Task retry initiated",
            "task_id": result.id,
            "original_task_id": task_id,
        }
    except Exception as e:
        logger.error(f"Failed to retry task {task_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Retry failed: {str(e)}")


@router.post("/admin/tasks/{task_id}/cancel")
@require_permission(Permission.SYSTEM_ADMIN)
async def cancel_task(task_id: str, user: User = Depends(get_current_user)):
    """Cancel a running or pending task"""
    try:
        celery_app.control.revoke(task_id, terminate=True)

        return {"message": "Task cancelled", "task_id": task_id}
    except Exception as e:
        logger.error(f"Failed to cancel task {task_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Cancel failed: {str(e)}")


@router.get("/admin/tasks/queues", response_model=List[QueueInfo])
@require_permission(Permission.SYSTEM_ADMIN)
async def list_queues(user: User = Depends(get_current_user)):
    """Get information about task queues"""
    try:
        inspect = celery_app.control.inspect()
        active_queues = inspect.active_queues()
        stats = inspect.stats()

        queues = []

        if active_queues and stats:
            for worker, queue_list in active_queues.items():
                stats.get(worker, {})
                for queue in queue_list:
                    queues.append(
                        QueueInfo(
                            name=queue.get("name", "default"),
                            length=0,  # In production: query from Redis
                            workers=len(active_queues),
                        )
                    )

        return queues
    except Exception as e:
        logger.error(f"Failed to get queue info: {e}")
        return []


@router.get("/admin/tasks/{task_id}")
@require_permission(Permission.SYSTEM_ADMIN)
async def get_task_status(task_id: str, user: User = Depends(get_current_user)):
    """Get status of specific task"""
    try:
        result = celery_app.AsyncResult(task_id)

        response = {
            "task_id": task_id,
            "status": result.state,
            "result": result.result if result.ready() else None,
        }

        if result.failed():
            response["error"] = str(result.info)

        return response
    except Exception as e:
        logger.error(f"Failed to get task status: {e}")
        raise HTTPException(status_code=404, detail="Task not found")


@router.get("/admin/tasks/stats")
@require_permission(Permission.SYSTEM_ADMIN)
async def get_task_stats(user: User = Depends(get_current_user)):
    """Get overall task statistics"""
    try:
        inspect = celery_app.control.inspect()
        stats = inspect.stats()
        active = inspect.active()
        scheduled = inspect.scheduled()

        active_count = sum(len(tasks) for tasks in (active or {}).values())
        scheduled_count = sum(len(tasks) for tasks in (scheduled or {}).values())

        return {
            "workers": len(stats or {}),
            "active_tasks": active_count,
            "scheduled_tasks": scheduled_count,
            "timestamp": datetime.now().isoformat(),
        }
    except Exception as e:
        logger.error(f"Failed to get task stats: {e}")
        return {"workers": 0, "active_tasks": 0, "scheduled_tasks": 0, "error": str(e)}
