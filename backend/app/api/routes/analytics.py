from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.core.db import get_session
from app.models.schemas import AnalyticsSummary, DashboardSnapshot, Lead, Campaign

router = APIRouter()


@router.get("/analytics", response_model=AnalyticsSummary)
def get_analytics_summary(session: Session = Depends(get_session)):
    total_leads = len(session.exec(select(Lead)).all())
    active_campaigns = len(session.exec(select(Campaign).where(Campaign.active == True)).all())  # noqa: E712
    conversion_rate = round(0.0725, 4)
    return AnalyticsSummary(
        total_leads=total_leads,
        active_campaigns=active_campaigns,
        conversion_rate=conversion_rate,
    )


@router.get("/analytics/dashboard", response_model=DashboardSnapshot)
def get_dashboard_snapshot(session: Session = Depends(get_session)):
    # Simple derivations; in a real system these come from analytics storage
    total_leads = len(session.exec(select(Lead)).all()) or 1284
    reply_rate = 8.4
    meetings = 47
    sent = 12453

    kpis = [
        {"title": "Emails Sent", "value": f"{sent:,}", "change": "+12.5%", "trend": "up", "icon": "Mail", "color": "text-blue-600", "bgColor": "bg-blue-100"},
        {"title": "Reply Rate", "value": f"{reply_rate}%", "change": "+2.3%", "trend": "up", "icon": "TrendingUp", "color": "text-green-600", "bgColor": "bg-green-100"},
        {"title": "Meetings Booked", "value": f"{meetings}", "change": "+18%", "trend": "up", "icon": "Calendar", "color": "text-purple-600", "bgColor": "bg-purple-100"},
        {"title": "Active Leads", "value": f"{total_leads:,}", "change": "-3.2%", "trend": "down", "icon": "Users", "color": "text-orange-600", "bgColor": "bg-orange-100"},
    ]

    kpi_trends = {
        "Emails Sent": [320, 380, 450, 510, 490, 120, 80],
        "Reply Rate": [6.2, 6.8, 7.3, 8.1, 8.4, 3.0, 2.5],
        "Meetings Booked": [22, 28, 31, 39, 47, 12, 8],
        "Active Leads": [1180, 1214, 1288, 1320, total_leads, 980, 840],
    }

    email_data = [
        {"date": "Mon", "sent": 420, "opened": 180, "replied": 32},
        {"date": "Tue", "sent": 380, "opened": 165, "replied": 28},
        {"date": "Wed", "sent": 450, "opened": 198, "replied": 38},
        {"date": "Thu", "sent": 510, "opened": 225, "replied": 45},
        {"date": "Fri", "sent": 490, "opened": 215, "replied": 41},
        {"date": "Sat", "sent": 120, "opened": 45, "replied": 8},
        {"date": "Sun", "sent": 80, "opened": 28, "replied": 5},
    ]

    return DashboardSnapshot(kpis=kpis, kpiTrends=kpi_trends, emailData=email_data)
