from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.core.db import get_session
from app.core.security import sanitize_text
from app.models.schemas import Campaign, CampaignCreate

router = APIRouter()


@router.get("/campaigns", response_model=List[Campaign])
def list_campaigns(session: Session = Depends(get_session)):
    return session.exec(select(Campaign)).all()


@router.post("/campaigns", response_model=Campaign, status_code=status.HTTP_201_CREATED)
def create_campaign(payload: CampaignCreate, session: Session = Depends(get_session)):
    # Basic sanitization of free-text fields to reduce risk of storing markup
    data = payload.dict()
    data["name"] = sanitize_text(data.get("name", ""))
    data["objective"] = sanitize_text(data.get("objective", ""))
    campaign = Campaign(**data)
    session.add(campaign)
    session.commit()
    session.refresh(campaign)
    return campaign


@router.get("/campaigns/{campaign_id}", response_model=Campaign)
def get_campaign(campaign_id: int, session: Session = Depends(get_session)):
    campaign = session.get(Campaign, campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign
