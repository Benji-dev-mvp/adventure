"""Backup and disaster recovery API routes."""
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from typing import List
from app.core.backup import backup_service
from app.core.security import get_current_user, require_role
from app.models.user import User, UserRole

router = APIRouter(prefix="/api/backup", tags=["backup"])


@router.post("/create")
@require_role(UserRole.ADMIN)
async def create_backup(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """Create database backup (Admin only)."""
    try:
        # Run backup in background
        background_tasks.add_task(backup_service.perform_full_backup)
        return {"message": "Backup initiated", "status": "in_progress"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/list")
@require_role(UserRole.ADMIN)
async def list_backups(
    days: int = 30,
    current_user: User = Depends(get_current_user)
) -> List[dict]:
    """List available backups (Admin only)."""
    try:
        backups = backup_service.list_backups(days)
        return backups
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/restore")
@require_role(UserRole.ADMIN)
async def restore_backup(
    backup_key: str,
    current_user: User = Depends(get_current_user)
):
    """Restore database from backup (Admin only - USE WITH CAUTION!)."""
    try:
        # Download backup
        local_path = backup_service.download_backup(backup_key)
        
        # Restore (this will overwrite current database)
        success = backup_service.restore_database(local_path)
        
        if success:
            return {"message": "Database restored successfully"}
        else:
            raise HTTPException(status_code=500, detail="Restore failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/cleanup")
@require_role(UserRole.ADMIN)
async def cleanup_old_backups(
    days: int = 90,
    current_user: User = Depends(get_current_user)
):
    """Delete backups older than specified days (Admin only)."""
    try:
        result = backup_service.cleanup_old_backups(days)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
