"""File upload and storage API routes."""
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from typing import List
from app.core.storage import storage_service
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/files", tags=["files"])


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    folder: str = "general",
    current_user: User = Depends(get_current_user)
):
    """Upload a file to S3."""
    try:
        result = await storage_service.upload_file(
            file.file,
            file.filename,
            current_user.id,
            folder
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.get("/list")
async def list_files(
    folder: str = "general",
    current_user: User = Depends(get_current_user)
) -> List[dict]:
    """List all files for current user."""
    try:
        files = await storage_service.list_user_files(current_user.id, folder)
        return files
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{file_key:path}")
async def delete_file(
    file_key: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a file."""
    # Verify user owns the file
    if not file_key.startswith(f"uploads/{current_user.id}/"):
        raise HTTPException(status_code=403, detail="Access denied")
    
    success = await storage_service.delete_file(file_key)
    if success:
        return {"message": "File deleted successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to delete file")


@router.get("/presigned-url/{file_key:path}")
async def get_presigned_url(
    file_key: str,
    expiration: int = 3600,
    current_user: User = Depends(get_current_user)
):
    """Generate presigned URL for file access."""
    try:
        url = storage_service.generate_presigned_url(file_key, expiration)
        return {"url": url, "expires_in": expiration}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
