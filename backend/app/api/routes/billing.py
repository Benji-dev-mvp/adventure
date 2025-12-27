"""
Billing and Subscription Management with Stripe Integration
Foundation layer: Stripe billing + subscription logic
"""
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, timedelta
import hashlib
import hmac

router = APIRouter(prefix="/api/billing", tags=["billing"])


class SubscriptionPlan(BaseModel):
    """Subscription plan model"""
    id: str
    name: str
    price_monthly: float
    price_yearly: float
    features: dict
    limits: dict
    active: bool = True


class CreateCheckoutSession(BaseModel):
    """Create Stripe checkout session"""
    plan_id: str
    billing_cycle: str = Field(..., pattern="^(monthly|yearly)$")
    success_url: str
    cancel_url: str
    customer_email: Optional[str] = None


class SubscriptionResponse(BaseModel):
    """Subscription response model"""
    id: str
    customer_id: str
    plan_id: str
    status: str
    current_period_start: datetime
    current_period_end: datetime
    cancel_at_period_end: bool = False
    billing_cycle: str


class UsageRecord(BaseModel):
    """Usage tracking record"""
    resource: str  # 'leads', 'emails', 'campaigns', etc.
    quantity: int
    timestamp: datetime
    metadata: Optional[dict] = None


class InvoiceResponse(BaseModel):
    """Invoice response"""
    id: str
    amount_due: float
    amount_paid: float
    status: str
    created: datetime
    due_date: datetime
    invoice_pdf: Optional[str] = None


# Mock subscription plans (would come from database in production)
SUBSCRIPTION_PLANS = {
    "starter": SubscriptionPlan(
        id="starter",
        name="Starter",
        price_monthly=99.0,
        price_yearly=79.0,
        features={
            "ai_personalization": "basic",
            "channels": ["email"],
            "crm_integrations": "basic",
        },
        limits={
            "leads_per_month": 1000,
            "emails_per_month": 5000,
            "campaigns": 3,
            "users": 1,
        }
    ),
    "professional": SubscriptionPlan(
        id="professional",
        name="Professional",
        price_monthly=299.0,
        price_yearly=239.0,
        features={
            "ai_personalization": "advanced",
            "channels": ["email", "linkedin", "sms"],
            "crm_integrations": "all",
            "api_access": True,
            "custom_domain": True,
        },
        limits={
            "leads_per_month": 10000,
            "emails_per_month": 50000,
            "campaigns": -1,  # unlimited
            "users": 5,
        }
    ),
    "enterprise": SubscriptionPlan(
        id="enterprise",
        name="Enterprise",
        price_monthly=-1,  # custom pricing
        price_yearly=-1,
        features={
            "ai_personalization": "custom",
            "channels": ["email", "linkedin", "sms", "calls"],
            "crm_integrations": "custom",
            "api_access": True,
            "custom_domain": True,
            "white_label": True,
            "sso": True,
            "dedicated_manager": True,
        },
        limits={
            "leads_per_month": -1,  # unlimited
            "emails_per_month": -1,
            "campaigns": -1,
            "users": -1,
        }
    )
}


@router.get("/plans")
async def get_subscription_plans():
    """Get all available subscription plans"""
    return {
        "plans": list(SUBSCRIPTION_PLANS.values()),
        "currency": "USD"
    }


@router.get("/plans/{plan_id}")
async def get_plan_details(plan_id: str):
    """Get details of a specific plan"""
    if plan_id not in SUBSCRIPTION_PLANS:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    return SUBSCRIPTION_PLANS[plan_id]


@router.post("/checkout/session")
async def create_checkout_session(request: CreateCheckoutSession):
    """
    Create a Stripe checkout session
    In production, this would call Stripe API: stripe.checkout.Session.create()
    """
    if request.plan_id not in SUBSCRIPTION_PLANS:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    plan = SUBSCRIPTION_PLANS[request.plan_id]
    
    # Calculate price based on billing cycle
    if request.billing_cycle == "monthly":
        amount = plan.price_monthly
    else:
        amount = plan.price_yearly
    
    if amount < 0:
        raise HTTPException(
            status_code=400, 
            detail="Enterprise plan requires contacting sales"
        )
    
    # Mock Stripe session (in production, create actual Stripe session)
    session_id = f"cs_test_{hashlib.md5(request.customer_email.encode()).hexdigest()[:16]}"
    
    return {
        "session_id": session_id,
        "checkout_url": f"https://checkout.stripe.com/pay/{session_id}",
        "amount": amount,
        "currency": "USD",
        "success_url": request.success_url,
        "cancel_url": request.cancel_url
    }


@router.get("/subscription")
async def get_current_subscription():
    """Get current user's subscription details"""
    # Mock subscription (would query database in production)
    return SubscriptionResponse(
        id="sub_test_123",
        customer_id="cus_test_123",
        plan_id="professional",
        status="active",
        current_period_start=datetime.now(),
        current_period_end=datetime.now() + timedelta(days=30),
        cancel_at_period_end=False,
        billing_cycle="monthly"
    )


@router.post("/subscription/upgrade")
async def upgrade_subscription(new_plan_id: str):
    """Upgrade subscription to a higher tier"""
    if new_plan_id not in SUBSCRIPTION_PLANS:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    # In production: call stripe.Subscription.modify()
    return {
        "success": True,
        "message": f"Subscription upgraded to {new_plan_id}",
        "effective_date": datetime.now(),
        "proration": True
    }


@router.post("/subscription/cancel")
async def cancel_subscription(cancel_immediately: bool = False):
    """Cancel subscription"""
    # In production: call stripe.Subscription.delete() or modify
    return {
        "success": True,
        "message": "Subscription cancelled",
        "access_until": datetime.now() + timedelta(days=30) if not cancel_immediately else datetime.now()
    }


@router.get("/invoices")
async def get_invoices(limit: int = 10) -> List[InvoiceResponse]:
    """Get customer invoices"""
    # Mock invoices (would query Stripe in production)
    invoices = []
    for i in range(min(limit, 5)):
        invoices.append(InvoiceResponse(
            id=f"in_test_{i}",
            amount_due=299.0,
            amount_paid=299.0,
            status="paid" if i > 0 else "open",
            created=datetime.now() - timedelta(days=30*i),
            due_date=datetime.now() - timedelta(days=30*i) + timedelta(days=7),
            invoice_pdf=f"https://invoice.stripe.com/i/{i}"
        ))
    return invoices


@router.get("/usage")
async def get_usage_statistics():
    """Get current billing period usage statistics"""
    # Mock usage data (would query from database in production)
    return {
        "billing_period": {
            "start": datetime.now().replace(day=1),
            "end": (datetime.now().replace(day=1) + timedelta(days=32)).replace(day=1)
        },
        "usage": {
            "leads": {
                "used": 1247,
                "limit": 10000,
                "percentage": 12.47
            },
            "emails": {
                "used": 8932,
                "limit": 50000,
                "percentage": 17.86
            },
            "campaigns": {
                "used": 12,
                "limit": -1,  # unlimited
                "percentage": 0
            },
            "users": {
                "used": 3,
                "limit": 5,
                "percentage": 60.0
            }
        },
        "overage": {
            "leads": 0,
            "emails": 0,
            "cost": 0.0
        }
    }


@router.post("/usage/record")
async def record_usage(usage: UsageRecord):
    """Record usage for metering"""
    # In production: store in database and potentially report to Stripe metering
    return {
        "success": True,
        "recorded_at": datetime.now(),
        "resource": usage.resource,
        "quantity": usage.quantity
    }


@router.post("/webhook")
async def stripe_webhook(
    stripe_signature: str = Header(None),
    payload: dict = None
):
    """
    Stripe webhook endpoint
    Handles events: invoice.paid, customer.subscription.deleted, etc.
    """
    # In production: verify signature with stripe.Webhook.construct_event()
    
    event_type = payload.get("type", "unknown")
    
    # Handle different event types
    handlers = {
        "invoice.paid": handle_invoice_paid,
        "invoice.payment_failed": handle_payment_failed,
        "customer.subscription.deleted": handle_subscription_deleted,
        "customer.subscription.updated": handle_subscription_updated,
    }
    
    handler = handlers.get(event_type)
    if handler:
        await handler(payload.get("data", {}).get("object", {}))
    
    return {"received": True}


async def handle_invoice_paid(invoice: dict):
    """Handle successful invoice payment"""
    # Update database, send confirmation email, etc.
    pass


async def handle_payment_failed(invoice: dict):
    """Handle failed payment"""
    # Send notification, update subscription status, etc.
    pass


async def handle_subscription_deleted(subscription: dict):
    """Handle subscription cancellation"""
    # Revoke access, cleanup resources, etc.
    pass


async def handle_subscription_updated(subscription: dict):
    """Handle subscription changes"""
    # Update user permissions, features, etc.
    pass


@router.get("/payment-methods")
async def get_payment_methods():
    """Get customer's payment methods"""
    # Mock payment methods (would query Stripe in production)
    return {
        "payment_methods": [
            {
                "id": "pm_test_visa",
                "type": "card",
                "card": {
                    "brand": "visa",
                    "last4": "4242",
                    "exp_month": 12,
                    "exp_year": 2025
                },
                "default": True
            }
        ]
    }


@router.post("/payment-methods")
async def add_payment_method(payment_method_id: str):
    """Add new payment method"""
    # In production: call stripe.PaymentMethod.attach()
    return {
        "success": True,
        "payment_method_id": payment_method_id,
        "message": "Payment method added successfully"
    }


@router.delete("/payment-methods/{payment_method_id}")
async def remove_payment_method(payment_method_id: str):
    """Remove payment method"""
    # In production: call stripe.PaymentMethod.detach()
    return {
        "success": True,
        "message": "Payment method removed"
    }


@router.get("/portal-session")
async def create_customer_portal_session():
    """
    Create Stripe customer portal session
    Allows customers to manage their subscription, payment methods, invoices
    """
    # In production: call stripe.billing_portal.Session.create()
    return {
        "url": "https://billing.stripe.com/session/test_123",
        "return_url": "https://app.artisan.com/settings/billing"
    }
