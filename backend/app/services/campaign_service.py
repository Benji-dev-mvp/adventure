"""Campaign service for campaign management."""
from typing import Optional, List, Dict, Any
from datetime import datetime
from sqlmodel import Session, select
from fastapi import HTTPException
import json

from app.models.db.campaign import CampaignDB, CampaignStatus, CampaignEvent
from app.models.db.event import Event, EventCreate


class CampaignService:
    """Service for managing campaigns."""
    
    @staticmethod
    def create_campaign(
        session: Session,
        tenant_id: int,
        name: str,
        objective: str,
        description: Optional[str] = None,
        user_id: Optional[int] = None,
        config: Optional[Dict[str, Any]] = None
    ) -> CampaignDB:
        """Create a new campaign."""
        campaign = CampaignDB(
            tenant_id=tenant_id,
            user_id=user_id,
            name=name,
            objective=objective,
            description=description,
            status=CampaignStatus.DRAFT,
            config=json.dumps(config) if config else None,
        )
        
        session.add(campaign)
        session.commit()
        session.refresh(campaign)
        
        return campaign
    
    @staticmethod
    def get_campaign(session: Session, tenant_id: int, campaign_id: int) -> Optional[CampaignDB]:
        """Get a campaign by ID."""
        return session.exec(
            select(CampaignDB)
            .where(CampaignDB.id == campaign_id)
            .where(CampaignDB.tenant_id == tenant_id)
        ).first()
    
    @staticmethod
    def list_campaigns(
        session: Session,
        tenant_id: int,
        status: Optional[CampaignStatus] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[CampaignDB]:
        """List campaigns for a tenant."""
        query = select(CampaignDB).where(CampaignDB.tenant_id == tenant_id)
        
        if status:
            query = query.where(CampaignDB.status == status)
        
        query = query.order_by(CampaignDB.created_at.desc())
        query = query.offset(skip).limit(limit)
        
        return list(session.exec(query).all())
    
    @staticmethod
    def update_campaign(
        session: Session,
        tenant_id: int,
        campaign_id: int,
        **updates
    ) -> CampaignDB:
        """Update a campaign."""
        campaign = CampaignService.get_campaign(session, tenant_id, campaign_id)
        
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        
        for key, value in updates.items():
            if hasattr(campaign, key):
                setattr(campaign, key, value)
        
        campaign.updated_at = datetime.utcnow()
        session.add(campaign)
        session.commit()
        session.refresh(campaign)
        
        return campaign
    
    @staticmethod
    def activate_campaign(session: Session, tenant_id: int, campaign_id: int) -> CampaignDB:
        """Activate a campaign."""
        campaign = CampaignService.get_campaign(session, tenant_id, campaign_id)
        
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        
        if campaign.status != CampaignStatus.DRAFT:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot activate campaign with status {campaign.status}"
            )
        
        campaign.status = CampaignStatus.ACTIVE
        campaign.activated_at = datetime.utcnow()
        campaign.updated_at = datetime.utcnow()
        
        session.add(campaign)
        session.commit()
        session.refresh(campaign)
        
        return campaign
    
    @staticmethod
    def pause_campaign(session: Session, tenant_id: int, campaign_id: int) -> CampaignDB:
        """Pause a campaign."""
        campaign = CampaignService.get_campaign(session, tenant_id, campaign_id)
        
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        
        if campaign.status != CampaignStatus.ACTIVE:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot pause campaign with status {campaign.status}"
            )
        
        campaign.status = CampaignStatus.PAUSED
        campaign.updated_at = datetime.utcnow()
        
        session.add(campaign)
        session.commit()
        session.refresh(campaign)
        
        return campaign
    
    @staticmethod
    def log_campaign_event(
        session: Session,
        tenant_id: int,
        campaign_id: int,
        event_type: str,
        lead_email: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> CampaignEvent:
        """Log a campaign event (sent, opened, clicked, etc.)."""
        event = CampaignEvent(
            campaign_id=campaign_id,
            tenant_id=tenant_id,
            event_type=event_type,
            lead_email=lead_email,
            metadata=json.dumps(metadata) if metadata else None,
        )
        
        session.add(event)
        session.commit()
        session.refresh(event)
        
        return event
    
    @staticmethod
    def simulate_campaign(
        session: Session,
        tenant_id: int,
        campaign_id: int
    ) -> Dict[str, Any]:
        """Simulate campaign performance (for testing/preview)."""
        campaign = CampaignService.get_campaign(session, tenant_id, campaign_id)
        
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        
        # Return mock simulation results
        return {
            "campaign_id": campaign_id,
            "campaign_name": campaign.name,
            "estimated_recipients": 100,
            "estimated_opens": 35,
            "estimated_clicks": 12,
            "estimated_replies": 5,
            "estimated_meetings": 2,
            "confidence": 0.75,
            "recommendation": "Good targeting and timing. Expected above-average performance."
        }


# Singleton instance
campaign_service = CampaignService()
