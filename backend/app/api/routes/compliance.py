"""Compliance and GDPR API routes."""
from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import StreamingResponse
from app.core.compliance import compliance_service
from app.core.security import get_current_user
from app.models.user import User
from app.core.db import get_session
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/compliance", tags=["compliance"])


@router.get("/export-data")
async def export_user_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Export all user data for GDPR compliance."""
    try:
        data_buffer = await compliance_service.export_user_data(current_user.id, db)
        
        return StreamingResponse(
            data_buffer,
            media_type="application/json",
            headers={
                "Content-Disposition": f"attachment; filename=user_data_{current_user.id}.json"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/delete-account")
async def delete_user_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Delete user account and all data (Right to be forgotten)."""
    try:
        success = await compliance_service.delete_user_data(current_user.id, db)
        
        if success:
            return {"message": "Account and data deleted successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to delete account")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/privacy-report")
async def get_privacy_report():
    """Get privacy and compliance report."""
    report = compliance_service.generate_privacy_report()
    return report


@router.post("/consent")
async def record_consent(
    consent_type: str,
    granted: bool,
    current_user: User = Depends(get_current_user)
):
    """Record user consent for GDPR compliance."""
    record = compliance_service.generate_consent_record(
        current_user.id,
        consent_type,
        granted
    )
    return record
