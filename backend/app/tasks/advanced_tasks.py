"""
Advanced Celery tasks for automation and background processing.
"""

import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List

from celery import Task, group
from sqlmodel import select

from app.core.celery_app import celery_app
from app.core.db import get_session

logger = logging.getLogger(__name__)


# ============================================================================
# Lead Enrichment Pipeline
# ============================================================================


@celery_app.task(bind=True, max_retries=3)
def enrich_lead(self, lead_id: int, source: str = "clearbit"):
    """
    Enrich single lead with external data.
    Chains: fetch_company_data -> fetch_person_data -> update_lead_score
    """
    logger.info(f"Enriching lead {lead_id} from {source}")

    try:
        # Simulate API call to enrichment service
        enrichment_data = {
            "company_size": 500,
            "industry": "Technology",
            "tech_stack": ["Salesforce", "HubSpot"],
            "funding_stage": "Series B",
            "enriched_at": datetime.now().isoformat(),
        }

        # Update lead in database
        with get_session() as session:
            from app.models.schemas import Lead

            lead = session.get(Lead, lead_id)
            if lead:
                # Update fields
                for key, value in enrichment_data.items():
                    if hasattr(lead, key):
                        setattr(lead, key, value)
                session.add(lead)
                session.commit()
                logger.info(f"Lead {lead_id} enriched successfully")
            else:
                logger.warning(f"Lead {lead_id} not found")

        return {"lead_id": lead_id, "status": "enriched", "data": enrichment_data}

    except Exception as exc:
        logger.error(f"Failed to enrich lead {lead_id}: {exc}")
        raise self.retry(exc=exc, countdown=60 * (2**self.request.retries))


@celery_app.task
def enrich_leads_batch(lead_ids: List[int]):
    """
    Enrich multiple leads in parallel using Celery groups.
    """
    logger.info(f"Starting batch enrichment for {len(lead_ids)} leads")

    # Create parallel tasks
    job = group(enrich_lead.s(lead_id) for lead_id in lead_ids)
    result = job.apply_async()

    return {"batch_id": result.id, "lead_count": len(lead_ids), "status": "processing"}


@celery_app.task
def enrich_uploaded_leads(upload_id: int):
    """
    Triggered after CSV upload. Enriches all leads from upload.
    """
    logger.info(f"Enriching leads from upload {upload_id}")

    with get_session() as session:
        from app.models.schemas import Lead

        leads = session.exec(select(Lead).where(Lead.upload_id == upload_id)).all()

        lead_ids = [lead.id for lead in leads]

    if lead_ids:
        return enrich_leads_batch.delay(lead_ids)

    return {"message": "No leads to enrich"}


# ============================================================================
# Campaign Automation
# ============================================================================


@celery_app.task
def analyze_send_time(campaign_id: int) -> Dict[str, Any]:
    """
    Analyze optimal send time based on historical data.
    Returns best time to send campaign emails.
    """
    logger.info(f"Analyzing send time for campaign {campaign_id}")

    # Simulate ML analysis
    # In production: query analytics, run time-series analysis
    optimal_times = {
        "best_day": "Tuesday",
        "best_hour": 10,  # 10 AM
        "timezone": "America/New_York",
        "confidence": 0.85,
        "reasoning": "Historical open rates highest on Tuesday mornings",
    }

    return optimal_times


@celery_app.task
def schedule_campaign_sends(campaign_id: int):
    """
    Auto-schedule campaign based on optimal send times.
    Creates individual send tasks for each lead.
    """
    logger.info(f"Scheduling campaign {campaign_id}")

    # Get optimal time
    send_time_analysis = analyze_send_time.delay(campaign_id).get()

    with get_session() as session:
        from app.models.schemas import Campaign

        campaign = session.get(Campaign, campaign_id)

        if not campaign:
            logger.error(f"Campaign {campaign_id} not found")
            return

        # Get campaign leads
        leads = []  # In production: query campaign.leads relationship

        # Schedule sends at optimal time
        optimal_hour = send_time_analysis["best_hour"]
        send_datetime = datetime.now().replace(hour=optimal_hour, minute=0, second=0)

        # Create send tasks with staggered timing (rate limiting)
        tasks = []
        for i, lead in enumerate(leads):
            # Stagger sends by 30 seconds
            eta = send_datetime + timedelta(seconds=i * 30)
            task = send_campaign_email.apply_async(args=[campaign_id, lead.id], eta=eta)
            tasks.append(task.id)

        return {
            "campaign_id": campaign_id,
            "scheduled_count": len(tasks),
            "send_time": send_datetime.isoformat(),
            "task_ids": tasks,
        }


@celery_app.task(bind=True, max_retries=5)
def send_campaign_email(self, campaign_id: int, lead_id: int):
    """
    Send individual campaign email with retry logic.
    """
    logger.info(f"Sending campaign {campaign_id} email to lead {lead_id}")

    try:
        # In production: integrate with email provider (SendGrid, AWS SES)
        # Simulate send
        result = {
            "campaign_id": campaign_id,
            "lead_id": lead_id,
            "sent_at": datetime.now().isoformat(),
            "status": "sent",
            "message_id": f"msg_{campaign_id}_{lead_id}_{int(datetime.now().timestamp())}",
        }

        # Log activity
        logger.info(f"Email sent successfully: {result['message_id']}")

        return result

    except Exception as exc:
        logger.error(f"Failed to send email: {exc}")
        raise self.retry(exc=exc, countdown=300)  # Retry after 5 min


# ============================================================================
# Daily Digest & Analytics
# ============================================================================


@celery_app.task
def generate_daily_digest():
    """
    Generate daily analytics digest.
    Runs every day at 8 AM via Celery Beat.
    """
    logger.info("Generating daily digest")

    with get_session() as session:
        from app.models.schemas import Campaign, Lead

        # Calculate daily metrics
        total_leads = session.exec(select(Lead)).all()
        total_campaigns = session.exec(select(Campaign)).all()

        # Calculate rates (simplified)
        digest = {
            "date": datetime.now().date().isoformat(),
            "metrics": {
                "total_leads": len(total_leads),
                "new_leads_today": 0,  # Count by created_at
                "total_campaigns": len(total_campaigns),
                "active_campaigns": 0,  # Count by status
                "emails_sent_today": 0,
                "open_rate": 0.35,
                "click_rate": 0.12,
                "reply_rate": 0.05,
            },
            "top_performers": {"campaigns": [], "leads": []},
            "alerts": [],
        }

        # In production: email digest to admins
        logger.info(f"Daily digest generated: {digest}")

        return digest


@celery_app.task
def compute_analytics_rollup():
    """
    Roll up hourly/daily analytics into summary tables.
    Optimizes dashboard query performance.
    """
    logger.info("Computing analytics rollup")

    with get_session() as session:
        # In production: aggregate events into summary tables
        # This is a scheduled task that runs hourly/daily

        rollup_data = {
            "period": "daily",
            "timestamp": datetime.now().isoformat(),
            "rows_processed": 0,
        }

        return rollup_data


# ============================================================================
# Lead Scoring & Triggers
# ============================================================================


@celery_app.task
def recalculate_lead_scores():
    """
    Batch recalculate lead scores.
    Runs periodically to update all scores.
    """
    logger.info("Recalculating lead scores")

    with get_session() as session:
        from app.models.schemas import Lead

        leads = session.exec(select(Lead)).all()

        updated_count = 0
        for lead in leads:
            # Call ML scoring model
            # In production: use actual ML model from ml_lead_scoring.py
            new_score = 50  # Placeholder

            if hasattr(lead, "score"):
                lead.score = new_score
                session.add(lead)
                updated_count += 1

        session.commit()

        logger.info(f"Updated {updated_count} lead scores")

        return {"updated_count": updated_count}


@celery_app.task
def trigger_lead_actions():
    """
    Check leads for threshold triggers and create actions.
    Example: High score leads → create task for rep to call
    """
    logger.info("Checking lead triggers")

    with get_session() as session:
        from app.models.schemas import Lead

        # Find high-score leads without recent activity
        high_score_leads = session.exec(select(Lead).where(Lead.score >= 80)).all()

        actions_created = 0
        for lead in high_score_leads:
            # In production: create task, send notification, etc.
            logger.info(f"Lead {lead.id} triggered action (score: {lead.score})")
            actions_created += 1

        return {"actions_created": actions_created}


# ============================================================================
# Cleanup & Maintenance
# ============================================================================


@celery_app.task
def cleanup_old_data():
    """
    Delete old data based on retention policies.
    Runs weekly.
    """
    logger.info("Running data cleanup")

    cutoff_date = datetime.now() - timedelta(days=365)

    with get_session() as session:
        # In production: delete audit logs, old events, etc.
        # Respect compliance requirements (GDPR, etc.)

        deleted_count = 0
        # Example: Delete old audit logs
        # deleted = session.exec(
        #     delete(AuditLog).where(AuditLog.created_at < cutoff_date)
        # )

        session.commit()

        logger.info(f"Cleaned up {deleted_count} old records")

        return {"deleted_count": deleted_count, "cutoff_date": cutoff_date.isoformat()}


# ============================================================================
# Task Monitoring & Retry
# ============================================================================


class MonitoredTask(Task):
    """Base task with automatic monitoring and logging"""

    def on_success(self, retval, task_id, args, kwargs):
        logger.info(f"Task {task_id} succeeded: {self.name}")

    def on_failure(self, exc, task_id, args, kwargs, einfo):
        logger.error(f"Task {task_id} failed: {self.name} - {exc}")

    def on_retry(self, exc, task_id, args, kwargs, einfo):
        logger.warning(f"Task {task_id} retrying: {self.name}")


@celery_app.task(base=MonitoredTask)
def monitored_task_example():
    """Example of task with automatic monitoring"""
    return {"status": "success"}
