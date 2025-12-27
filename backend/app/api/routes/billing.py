"""
Billing and subscription management API routes
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime, timedelta
from app.core.db import get_session
from app.models.growth_models import (
    Subscription, SubscriptionTier, SubscriptionStatus, BillingPeriod,
    UsageMetrics, Invoice
)
from pydantic import BaseModel


router = APIRouter()


# ============================================================================
# Request/Response Models
# ============================================================================

class SubscriptionCreate(BaseModel):
    tier: SubscriptionTier
    billing_period: BillingPeriod = BillingPeriod.MONTHLY
    seats: int = 1


class SubscriptionUpdate(BaseModel):
    tier: Optional[SubscriptionTier] = None
    seats: Optional[int] = None
    cancel_at_period_end: Optional[bool] = None


class UsageMetricCreate(BaseModel):
    metric_type: str
    quantity: int


class UsageMetricResponse(BaseModel):
    metric_type: str
    quantity: int
    limit: int
    percentage_used: float


# ============================================================================
# Subscription Endpoints
# ============================================================================

@router.get("/subscriptions/current")
def get_current_subscription(
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Get current user subscription"""
    statement = select(Subscription).where(
        Subscription.user_id == user_id,
        Subscription.status == SubscriptionStatus.ACTIVE
    )
    subscription = session.exec(statement).first()
    
    if not subscription:
        # Create free tier subscription
        subscription = Subscription(
            user_id=user_id,
            tier=SubscriptionTier.FREE,
            status=SubscriptionStatus.ACTIVE,
            billing_period=BillingPeriod.MONTHLY,
            seats=1,
            price_per_seat=0.0,
            total_price=0.0,
            current_period_start=datetime.utcnow(),
            current_period_end=datetime.utcnow() + timedelta(days=30)
        )
        session.add(subscription)
        session.commit()
        session.refresh(subscription)
    
    return subscription


@router.post("/subscriptions")
def create_subscription(
    data: SubscriptionCreate,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Create or upgrade subscription"""
    # Check for existing subscription
    statement = select(Subscription).where(Subscription.user_id == user_id)
    existing = session.exec(statement).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Subscription already exists. Use update endpoint.")
    
    # Pricing logic
    price_map = {
        SubscriptionTier.FREE: 0.0,
        SubscriptionTier.STARTER: 49.0,
        SubscriptionTier.PROFESSIONAL: 299.0,
        SubscriptionTier.ENTERPRISE: 999.0,
    }
    
    price_per_seat = price_map.get(data.tier, 0.0)
    total_price = price_per_seat * data.seats
    
    # Apply discount for yearly billing
    if data.billing_period == BillingPeriod.YEARLY:
        total_price = total_price * 10  # 2 months free
    
    subscription = Subscription(
        user_id=user_id,
        tier=data.tier,
        status=SubscriptionStatus.ACTIVE,
        billing_period=data.billing_period,
        seats=data.seats,
        price_per_seat=price_per_seat,
        total_price=total_price,
        current_period_start=datetime.utcnow(),
        current_period_end=datetime.utcnow() + timedelta(days=30 if data.billing_period == BillingPeriod.MONTHLY else 365)
    )
    
    session.add(subscription)
    session.commit()
    session.refresh(subscription)
    
    return subscription


@router.put("/subscriptions/{subscription_id}")
def update_subscription(
    subscription_id: int,
    data: SubscriptionUpdate,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Update subscription"""
    subscription = session.get(Subscription, subscription_id)
    
    if not subscription or subscription.user_id != user_id:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    # Update fields
    if data.tier:
        subscription.tier = data.tier
    if data.seats:
        subscription.seats = data.seats
    if data.cancel_at_period_end is not None:
        subscription.cancel_at_period_end = data.cancel_at_period_end
        if data.cancel_at_period_end:
            subscription.canceled_at = datetime.utcnow()
    
    subscription.updated_at = datetime.utcnow()
    
    session.add(subscription)
    session.commit()
    session.refresh(subscription)
    
    return subscription


@router.post("/subscriptions/{subscription_id}/trial")
def start_trial(
    subscription_id: int,
    trial_days: int = 14,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Start subscription trial"""
    subscription = session.get(Subscription, subscription_id)
    
    if not subscription or subscription.user_id != user_id:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    if subscription.is_trial:
        raise HTTPException(status_code=400, detail="Trial already active")
    
    subscription.is_trial = True
    subscription.status = SubscriptionStatus.TRIALING
    subscription.trial_start = datetime.utcnow()
    subscription.trial_end = datetime.utcnow() + timedelta(days=trial_days)
    subscription.updated_at = datetime.utcnow()
    
    session.add(subscription)
    session.commit()
    session.refresh(subscription)
    
    return subscription


@router.delete("/subscriptions/{subscription_id}")
def cancel_subscription(
    subscription_id: int,
    immediate: bool = False,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Cancel subscription"""
    subscription = session.get(Subscription, subscription_id)
    
    if not subscription or subscription.user_id != user_id:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    if immediate:
        subscription.status = SubscriptionStatus.CANCELED
        subscription.canceled_at = datetime.utcnow()
    else:
        subscription.cancel_at_period_end = True
        subscription.canceled_at = datetime.utcnow()
    
    subscription.updated_at = datetime.utcnow()
    
    session.add(subscription)
    session.commit()
    session.refresh(subscription)
    
    return {"message": "Subscription canceled", "subscription": subscription}


# ============================================================================
# Usage Metering Endpoints
# ============================================================================

@router.get("/usage/current")
def get_current_usage(
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Get current period usage metrics"""
    # Get current subscription
    subscription = session.exec(
        select(Subscription).where(
            Subscription.user_id == user_id,
            Subscription.status == SubscriptionStatus.ACTIVE
        )
    ).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="No active subscription")
    
    # Get usage for current period
    statement = select(UsageMetrics).where(
        UsageMetrics.user_id == user_id,
        UsageMetrics.period_start >= subscription.current_period_start
    )
    usage_records = session.exec(statement).all()
    
    # Aggregate by metric type
    usage_summary = {}
    for record in usage_records:
        if record.metric_type not in usage_summary:
            usage_summary[record.metric_type] = 0
        usage_summary[record.metric_type] += record.quantity
    
    # Define limits per tier
    limits = {
        SubscriptionTier.FREE: {
            "emails_sent": 100,
            "leads_created": 50,
            "campaigns_active": 1,
            "api_calls": 100
        },
        SubscriptionTier.STARTER: {
            "emails_sent": 5000,
            "leads_created": 1000,
            "campaigns_active": 10,
            "api_calls": 10000
        },
        SubscriptionTier.PROFESSIONAL: {
            "emails_sent": 50000,
            "leads_created": 10000,
            "campaigns_active": 100,
            "api_calls": 100000
        },
        SubscriptionTier.ENTERPRISE: {
            "emails_sent": 500000,
            "leads_created": 100000,
            "campaigns_active": 1000,
            "api_calls": 1000000
        }
    }
    
    tier_limits = limits.get(subscription.tier, limits[SubscriptionTier.FREE])
    
    # Build response
    usage_response = []
    for metric_type, limit in tier_limits.items():
        quantity = usage_summary.get(metric_type, 0)
        usage_response.append({
            "metric_type": metric_type,
            "quantity": quantity,
            "limit": limit,
            "percentage_used": (quantity / limit * 100) if limit > 0 else 0
        })
    
    return {
        "subscription_tier": subscription.tier,
        "period_start": subscription.current_period_start,
        "period_end": subscription.current_period_end,
        "usage": usage_response
    }


@router.post("/usage/track")
def track_usage(
    data: UsageMetricCreate,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Track usage metric"""
    # Get current subscription
    subscription = session.exec(
        select(Subscription).where(
            Subscription.user_id == user_id,
            Subscription.status == SubscriptionStatus.ACTIVE
        )
    ).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="No active subscription")
    
    # Create usage record
    usage = UsageMetrics(
        user_id=user_id,
        subscription_id=subscription.id,
        metric_type=data.metric_type,
        quantity=data.quantity,
        period_start=subscription.current_period_start,
        period_end=subscription.current_period_end,
        unit_price=0.0,  # TODO: Calculate based on overage pricing
        total_cost=0.0
    )
    
    session.add(usage)
    session.commit()
    session.refresh(usage)
    
    return usage


# ============================================================================
# Invoice Endpoints
# ============================================================================

@router.get("/invoices")
def list_invoices(
    user_id: int = 1,  # TODO: Get from auth
    limit: int = 10,
    session: Session = Depends(get_session)
):
    """List user invoices"""
    statement = select(Invoice).where(
        Invoice.user_id == user_id
    ).order_by(Invoice.invoice_date.desc()).limit(limit)
    
    invoices = session.exec(statement).all()
    return invoices


@router.get("/invoices/{invoice_id}")
def get_invoice(
    invoice_id: int,
    user_id: int = 1,  # TODO: Get from auth
    session: Session = Depends(get_session)
):
    """Get invoice details"""
    invoice = session.get(Invoice, invoice_id)
    
    if not invoice or invoice.user_id != user_id:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    return invoice


# ============================================================================
# Pricing Plans Endpoint
# ============================================================================

@router.get("/pricing-plans")
def get_pricing_plans():
    """Get available pricing plans"""
    return {
        "plans": [
            {
                "tier": "free",
                "name": "Free",
                "price": 0,
                "billing_period": "monthly",
                "features": [
                    "100 emails/month",
                    "50 leads",
                    "1 active campaign",
                    "Basic AI assistant",
                    "Email support"
                ],
                "limits": {
                    "emails_sent": 100,
                    "leads_created": 50,
                    "campaigns_active": 1
                }
            },
            {
                "tier": "starter",
                "name": "Starter",
                "price": 49,
                "billing_period": "monthly",
                "features": [
                    "5,000 emails/month",
                    "1,000 leads",
                    "10 active campaigns",
                    "Advanced AI assistant",
                    "Multi-channel outreach",
                    "Priority support"
                ],
                "limits": {
                    "emails_sent": 5000,
                    "leads_created": 1000,
                    "campaigns_active": 10
                }
            },
            {
                "tier": "professional",
                "name": "Professional",
                "price": 299,
                "billing_period": "monthly",
                "features": [
                    "50,000 emails/month",
                    "10,000 leads",
                    "100 active campaigns",
                    "AI Salesboard",
                    "Knowledge Fusion",
                    "Workflow Builder",
                    "Advanced analytics",
                    "24/7 support"
                ],
                "limits": {
                    "emails_sent": 50000,
                    "leads_created": 10000,
                    "campaigns_active": 100
                },
                "highlighted": True
            },
            {
                "tier": "enterprise",
                "name": "Enterprise",
                "price": 999,
                "billing_period": "monthly",
                "features": [
                    "500,000 emails/month",
                    "100,000 leads",
                    "Unlimited campaigns",
                    "All Professional features",
                    "AI Safety Console",
                    "Voice-to-Action Agent",
                    "Custom integrations",
                    "Dedicated success manager",
                    "SLA guarantees"
                ],
                "limits": {
                    "emails_sent": 500000,
                    "leads_created": 100000,
                    "campaigns_active": 1000
                }
            }
        ],
        "yearly_discount": 0.17  # 17% discount (2 months free)
    }
