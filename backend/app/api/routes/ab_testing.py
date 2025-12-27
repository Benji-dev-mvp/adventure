"""
Email A/B Testing Engine
Auto-test subject lines, track winners, optimize campaigns
"""
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlmodel import Session
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
from enum import Enum
import random

from app.core.db import get_session
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()


class ABTestType(str, Enum):
    SUBJECT_LINE = "subject_line"
    EMAIL_BODY = "email_body"
    CTA_BUTTON = "cta_button"
    SEND_TIME = "send_time"
    SENDER_NAME = "sender_name"


class WinnerCriteria(str, Enum):
    OPEN_RATE = "open_rate"
    CLICK_RATE = "click_rate"
    REPLY_RATE = "reply_rate"
    CONVERSION_RATE = "conversion_rate"


class ABTestConfig(BaseModel):
    """Configuration for A/B test"""
    campaign_id: int
    test_type: ABTestType
    variants: List[Dict[str, Any]]  # Each variant has name + content
    test_percentage: float = 0.2  # Send to 20% of list
    winner_criteria: WinnerCriteria = WinnerCriteria.OPEN_RATE
    min_sample_size: int = 100
    test_duration_hours: int = 2
    auto_send_winner: bool = True


class ABTestVariant(BaseModel):
    """Single variant in A/B test"""
    variant_id: str
    name: str
    content: Dict[str, Any]
    sent_count: int = 0
    opened_count: int = 0
    clicked_count: int = 0
    replied_count: int = 0
    converted_count: int = 0
    
    @property
    def open_rate(self) -> float:
        return (self.opened_count / self.sent_count * 100) if self.sent_count > 0 else 0
    
    @property
    def click_rate(self) -> float:
        return (self.clicked_count / self.sent_count * 100) if self.sent_count > 0 else 0
    
    @property
    def reply_rate(self) -> float:
        return (self.replied_count / self.sent_count * 100) if self.sent_count > 0 else 0


class ABTest(BaseModel):
    """Full A/B test with tracking"""
    test_id: int
    campaign_id: int
    test_type: ABTestType
    status: str  # "running", "completed", "winner_sent"
    variants: List[ABTestVariant]
    winner_criteria: WinnerCriteria
    test_started_at: datetime
    test_ends_at: datetime
    winner_variant_id: Optional[str] = None
    winner_sent_at: Optional[datetime] = None
    total_test_sends: int = 0
    total_winner_sends: int = 0


# In-memory storage (replace with database)
ab_tests: Dict[int, ABTest] = {}
test_counter = 0


@router.post("/ab-tests/create", response_model=Dict[str, Any])
async def create_ab_test(
    config: ABTestConfig,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """
    Create and start A/B test
    
    Process:
    1. Split audience into test group (20%) and holdout (80%)
    2. Send variants to test group
    3. Track opens/clicks/replies
    4. After 2 hours, pick winner
    5. Send winner to remaining 80%
    """
    global test_counter
    test_counter += 1
    
    # Create variant objects
    variants = []
    for i, variant_data in enumerate(config.variants):
        variant = ABTestVariant(
            variant_id=f"variant_{i+1}",
            name=variant_data.get("name", f"Variant {i+1}"),
            content=variant_data
        )
        variants.append(variant)
    
    # Create test
    test_ends_at = datetime.utcnow() + timedelta(hours=config.test_duration_hours)
    
    ab_test = ABTest(
        test_id=test_counter,
        campaign_id=config.campaign_id,
        test_type=config.test_type,
        status="running",
        variants=variants,
        winner_criteria=config.winner_criteria,
        test_started_at=datetime.utcnow(),
        test_ends_at=test_ends_at
    )
    
    ab_tests[test_counter] = ab_test
    
    # Schedule winner selection
    if config.auto_send_winner:
        background_tasks.add_task(
            _schedule_winner_selection,
            test_counter,
            config.test_duration_hours
        )
    
    return {
        "test_id": test_counter,
        "status": "running",
        "variants": [v.dict() for v in variants],
        "test_ends_at": test_ends_at.isoformat(),
        "message": f"A/B test started with {len(variants)} variants"
    }


@router.get("/ab-tests/{test_id}", response_model=Dict[str, Any])
async def get_ab_test(
    test_id: int,
    current_user: User = Depends(get_current_user)
):
    """Get A/B test details and results"""
    if test_id not in ab_tests:
        raise HTTPException(status_code=404, detail="A/B test not found")
    
    test = ab_tests[test_id]
    
    return {
        "test_id": test.test_id,
        "campaign_id": test.campaign_id,
        "test_type": test.test_type,
        "status": test.status,
        "variants": [
            {
                **v.dict(),
                "open_rate": v.open_rate,
                "click_rate": v.click_rate,
                "reply_rate": v.reply_rate
            }
            for v in test.variants
        ],
        "winner_variant_id": test.winner_variant_id,
        "test_started_at": test.test_started_at.isoformat(),
        "test_ends_at": test.test_ends_at.isoformat(),
        "time_remaining": _get_time_remaining(test)
    }


@router.post("/ab-tests/{test_id}/track-event")
async def track_event(
    test_id: int,
    event_type: str,  # "open", "click", "reply", "convert"
    variant_id: str,
    lead_email: str,
    current_user: User = Depends(get_current_user)
):
    """Track email engagement event for A/B test"""
    if test_id not in ab_tests:
        raise HTTPException(status_code=404, detail="A/B test not found")
    
    test = ab_tests[test_id]
    
    # Find variant
    variant = next((v for v in test.variants if v.variant_id == variant_id), None)
    if not variant:
        raise HTTPException(status_code=404, detail="Variant not found")
    
    # Update counts
    if event_type == "open":
        variant.opened_count += 1
    elif event_type == "click":
        variant.clicked_count += 1
    elif event_type == "reply":
        variant.replied_count += 1
    elif event_type == "convert":
        variant.converted_count += 1
    
    return {
        "success": True,
        "test_id": test_id,
        "variant_id": variant_id,
        "event_type": event_type,
        "updated_stats": {
            "open_rate": variant.open_rate,
            "click_rate": variant.click_rate,
            "reply_rate": variant.reply_rate
        }
    }


@router.post("/ab-tests/{test_id}/select-winner")
async def select_winner(
    test_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Manually select winner and send to remaining audience
    
    Winner selection based on configured criteria:
    - open_rate: Most opens
    - click_rate: Most clicks
    - reply_rate: Most replies
    - conversion_rate: Most conversions
    """
    if test_id not in ab_tests:
        raise HTTPException(status_code=404, detail="A/B test not found")
    
    test = ab_tests[test_id]
    
    if test.status != "running":
        raise HTTPException(status_code=400, detail="Test is not running")
    
    # Select winner based on criteria
    winner = _select_winner_variant(test)
    
    test.winner_variant_id = winner.variant_id
    test.status = "completed"
    
    return {
        "success": True,
        "test_id": test_id,
        "winner_variant_id": winner.variant_id,
        "winner_name": winner.name,
        "winning_metric": _get_winning_metric(winner, test.winner_criteria),
        "improvement_over_others": _calculate_improvement(test, winner),
        "message": "Winner selected - ready to send to remaining audience"
    }


@router.post("/ab-tests/{test_id}/send-winner")
async def send_winner_to_audience(
    test_id: int,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """Send winning variant to remaining 80% of audience"""
    if test_id not in ab_tests:
        raise HTTPException(status_code=404, detail="A/B test not found")
    
    test = ab_tests[test_id]
    
    if test.status != "completed":
        raise HTTPException(status_code=400, detail="Test must be completed first")
    
    if not test.winner_variant_id:
        raise HTTPException(status_code=400, detail="No winner selected")
    
    winner = next(v for v in test.variants if v.variant_id == test.winner_variant_id)
    
    # Simulate sending to remaining audience
    # In production, this would queue actual email sends
    background_tasks.add_task(_send_winner_emails, test_id, winner)
    
    test.status = "winner_sent"
    test.winner_sent_at = datetime.utcnow()
    
    return {
        "success": True,
        "test_id": test_id,
        "winner_variant": winner.dict(),
        "message": "Sending winner to remaining audience",
        "estimated_sends": "80% of campaign list"
    }


@router.get("/ab-tests/campaign/{campaign_id}")
async def get_campaign_tests(
    campaign_id: int,
    current_user: User = Depends(get_current_user)
):
    """Get all A/B tests for a campaign"""
    campaign_tests = [
        test for test in ab_tests.values()
        if test.campaign_id == campaign_id
    ]
    
    return {
        "campaign_id": campaign_id,
        "total_tests": len(campaign_tests),
        "tests": [
            {
                "test_id": t.test_id,
                "test_type": t.test_type,
                "status": t.status,
                "winner_variant_id": t.winner_variant_id,
                "started_at": t.test_started_at.isoformat()
            }
            for t in campaign_tests
        ]
    }


async def _schedule_winner_selection(test_id: int, hours: int):
    """Background task to auto-select winner after test duration"""
    import asyncio
    await asyncio.sleep(hours * 3600)
    
    if test_id in ab_tests:
        test = ab_tests[test_id]
        if test.status == "running":
            winner = _select_winner_variant(test)
            test.winner_variant_id = winner.variant_id
            test.status = "completed"
            
            # Auto-send if configured
            await _send_winner_emails(test_id, winner)
            test.status = "winner_sent"
            test.winner_sent_at = datetime.utcnow()


def _select_winner_variant(test: ABTest) -> ABTestVariant:
    """Select winning variant based on criteria"""
    if test.winner_criteria == WinnerCriteria.OPEN_RATE:
        return max(test.variants, key=lambda v: v.open_rate)
    elif test.winner_criteria == WinnerCriteria.CLICK_RATE:
        return max(test.variants, key=lambda v: v.click_rate)
    elif test.winner_criteria == WinnerCriteria.REPLY_RATE:
        return max(test.variants, key=lambda v: v.reply_rate)
    else:
        return max(test.variants, key=lambda v: v.converted_count)


def _get_winning_metric(variant: ABTestVariant, criteria: WinnerCriteria) -> float:
    """Get the metric value that won"""
    if criteria == WinnerCriteria.OPEN_RATE:
        return variant.open_rate
    elif criteria == WinnerCriteria.CLICK_RATE:
        return variant.click_rate
    elif criteria == WinnerCriteria.REPLY_RATE:
        return variant.reply_rate
    else:
        return (variant.converted_count / variant.sent_count * 100) if variant.sent_count > 0 else 0


def _calculate_improvement(test: ABTest, winner: ABTestVariant) -> Dict[str, float]:
    """Calculate how much winner improved over other variants"""
    winner_metric = _get_winning_metric(winner, test.winner_criteria)
    
    improvements = {}
    for variant in test.variants:
        if variant.variant_id != winner.variant_id:
            variant_metric = _get_winning_metric(variant, test.winner_criteria)
            if variant_metric > 0:
                improvement = ((winner_metric - variant_metric) / variant_metric) * 100
                improvements[variant.name] = round(improvement, 1)
    
    return improvements


def _get_time_remaining(test: ABTest) -> str:
    """Get human-readable time remaining"""
    if test.status != "running":
        return "Test completed"
    
    remaining = test.test_ends_at - datetime.utcnow()
    hours = remaining.seconds // 3600
    minutes = (remaining.seconds % 3600) // 60
    
    return f"{hours}h {minutes}m remaining"


async def _send_winner_emails(test_id: int, winner: ABTestVariant):
    """Background task to send winner to remaining audience"""
    # Simulate email sending
    # In production: queue emails, update campaign, track deliverability
    test = ab_tests[test_id]
    test.total_winner_sends = int(test.total_test_sends * 4)  # 80% of total
    
    return {"sent": test.total_winner_sends}
