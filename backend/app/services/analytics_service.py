"""Analytics service for metrics and reporting."""
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from sqlmodel import Session, select, func
from collections import defaultdict

from app.models.db.event import Event
from app.models.db.campaign import CampaignEvent, CampaignDB


class AnalyticsService:
    """Service for analytics and metrics."""
    
    @staticmethod
    def get_campaign_metrics(
        session: Session,
        tenant_id: int,
        campaign_id: Optional[int] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Get campaign performance metrics."""
        query = select(CampaignEvent).where(CampaignEvent.tenant_id == tenant_id)
        
        if campaign_id:
            query = query.where(CampaignEvent.campaign_id == campaign_id)
        
        if start_date:
            query = query.where(CampaignEvent.timestamp >= start_date)
        
        if end_date:
            query = query.where(CampaignEvent.timestamp <= end_date)
        
        events = session.exec(query).all()
        
        # Aggregate metrics
        metrics = {
            "sent": 0,
            "opened": 0,
            "clicked": 0,
            "replied": 0,
            "bounced": 0,
            "unsubscribed": 0,
        }
        
        for event in events:
            event_type = event.event_type.lower()
            if event_type in metrics:
                metrics[event_type] += 1
        
        # Calculate rates
        sent = metrics["sent"] or 1  # Avoid division by zero
        
        return {
            "sent": metrics["sent"],
            "opened": metrics["opened"],
            "clicked": metrics["clicked"],
            "replied": metrics["replied"],
            "bounced": metrics["bounced"],
            "unsubscribed": metrics["unsubscribed"],
            "open_rate": round(metrics["opened"] / sent * 100, 2),
            "click_rate": round(metrics["clicked"] / sent * 100, 2),
            "reply_rate": round(metrics["replied"] / sent * 100, 2),
            "bounce_rate": round(metrics["bounced"] / sent * 100, 2),
        }
    
    @staticmethod
    def get_time_series_metrics(
        session: Session,
        tenant_id: int,
        metric: str = "sent",
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        granularity: str = "day"  # day, week, month
    ) -> List[Dict[str, Any]]:
        """Get time series data for a metric."""
        if not start_date:
            start_date = datetime.utcnow() - timedelta(days=30)
        
        if not end_date:
            end_date = datetime.utcnow()
        
        query = select(CampaignEvent).where(
            CampaignEvent.tenant_id == tenant_id,
            CampaignEvent.event_type == metric,
            CampaignEvent.timestamp >= start_date,
            CampaignEvent.timestamp <= end_date
        )
        
        events = session.exec(query).all()
        
        # Group by time period
        time_series = defaultdict(int)
        
        for event in events:
            if granularity == "day":
                key = event.timestamp.strftime("%Y-%m-%d")
            elif granularity == "week":
                key = event.timestamp.strftime("%Y-W%W")
            elif granularity == "month":
                key = event.timestamp.strftime("%Y-%m")
            else:
                key = event.timestamp.strftime("%Y-%m-%d")
            
            time_series[key] += 1
        
        # Convert to list of dicts
        result = [
            {"date": date, "value": count}
            for date, count in sorted(time_series.items())
        ]
        
        return result
    
    @staticmethod
    def get_funnel_metrics(
        session: Session,
        tenant_id: int,
        campaign_id: Optional[int] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Get funnel conversion metrics."""
        metrics = AnalyticsService.get_campaign_metrics(
            session, tenant_id, campaign_id, start_date, end_date
        )
        
        # Build funnel
        funnel = [
            {"stage": "Sent", "count": metrics["sent"], "conversion": 100.0},
            {"stage": "Opened", "count": metrics["opened"], "conversion": metrics["open_rate"]},
            {"stage": "Clicked", "count": metrics["clicked"], "conversion": metrics["click_rate"]},
            {"stage": "Replied", "count": metrics["replied"], "conversion": metrics["reply_rate"]},
        ]
        
        return {
            "funnel": funnel,
            "total_sent": metrics["sent"],
            "conversion_to_reply": metrics["reply_rate"],
        }
    
    @staticmethod
    def get_channel_breakdown(
        session: Session,
        tenant_id: int,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, Dict[str, int]]:
        """Get metrics broken down by channel (email, linkedin, sms, etc.)."""
        query = select(Event).where(Event.tenant_id == tenant_id)
        
        if start_date:
            query = query.where(Event.timestamp >= start_date)
        
        if end_date:
            query = query.where(Event.timestamp <= end_date)
        
        events = session.exec(query).all()
        
        # Group by channel
        channel_metrics = defaultdict(lambda: defaultdict(int))
        
        for event in events:
            channel = event.channel or "unknown"
            event_type = event.event_type
            channel_metrics[channel][event_type] += 1
        
        return dict(channel_metrics)
    
    @staticmethod
    def get_dashboard_summary(
        session: Session,
        tenant_id: int,
        days: int = 30
    ) -> Dict[str, Any]:
        """Get summary metrics for dashboard."""
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Get campaign metrics
        campaign_metrics = AnalyticsService.get_campaign_metrics(
            session, tenant_id, start_date=start_date
        )
        
        # Get active campaigns count
        active_campaigns = session.exec(
            select(func.count(CampaignDB.id))
            .where(CampaignDB.tenant_id == tenant_id)
            .where(CampaignDB.status == "active")
        ).one()
        
        # Get time series for trend
        time_series = AnalyticsService.get_time_series_metrics(
            session, tenant_id, metric="sent", start_date=start_date, granularity="day"
        )
        
        return {
            "period_days": days,
            "active_campaigns": active_campaigns,
            "total_sent": campaign_metrics["sent"],
            "total_opened": campaign_metrics["opened"],
            "total_replied": campaign_metrics["replied"],
            "open_rate": campaign_metrics["open_rate"],
            "reply_rate": campaign_metrics["reply_rate"],
            "time_series": time_series[-7:],  # Last 7 days
        }


# Singleton instance
analytics_service = AnalyticsService()
