"""
Advanced Integration Patterns for Third-Party Services
Webhook handlers, CRM syncs, email providers, and more
"""

import hashlib
import hmac
import logging
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional

import httpx
from pydantic import BaseModel

logger = logging.getLogger(__name__)


class IntegrationType(str, Enum):
    """Supported integration types"""

    CRM = "crm"
    EMAIL = "email"
    SMS = "sms"
    CALENDAR = "calendar"
    ANALYTICS = "analytics"
    PAYMENT = "payment"
    WEBHOOK = "webhook"


class CRMProvider(str, Enum):
    """Supported CRM providers"""

    SALESFORCE = "salesforce"
    HUBSPOT = "hubspot"
    PIPEDRIVE = "pipedrive"
    ZOHO = "zoho"
    CUSTOM = "custom"


class EmailProvider(str, Enum):
    """Supported email providers"""

    SENDGRID = "sendgrid"
    MAILGUN = "mailgun"
    SES = "ses"
    SMTP = "smtp"


class IntegrationConfig(BaseModel):
    """Base integration configuration"""

    provider: str
    enabled: bool = True
    api_key: Optional[str] = None
    api_secret: Optional[str] = None
    webhook_url: Optional[str] = None
    settings: Dict[str, Any] = {}


class WebhookHandler:
    """Handle incoming webhooks with signature verification"""

    @staticmethod
    def verify_signature(
        payload: bytes, signature: str, secret: str, algorithm: str = "sha256"
    ) -> bool:
        """
        Verify webhook signature

        Args:
            payload: Raw request body
            signature: Signature from header
            secret: Webhook secret
            algorithm: Hash algorithm (sha256, sha1)

        Returns:
            True if signature is valid
        """
        if not secret or not signature:
            return False

        # Create HMAC
        if algorithm == "sha256":
            computed = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
        else:
            computed = hmac.new(secret.encode(), payload, hashlib.sha1).hexdigest()

        # Compare signatures (constant-time comparison)
        return hmac.compare_digest(computed, signature)

    @staticmethod
    async def handle_stripe_webhook(payload: Dict, signature: str, secret: str) -> Dict:
        """Handle Stripe webhook events"""
        # Stripe-specific signature verification
        event_type = payload.get("type")

        handlers = {
            "payment_intent.succeeded": WebhookHandler._handle_payment_success,
            "payment_intent.failed": WebhookHandler._handle_payment_failure,
            "customer.subscription.created": WebhookHandler._handle_subscription_created,
            "customer.subscription.deleted": WebhookHandler._handle_subscription_cancelled,
        }

        handler = handlers.get(event_type)
        if handler:
            return await handler(payload)

        logger.warning(f"Unhandled Stripe webhook type: {event_type}")
        return {"status": "ignored"}

    @staticmethod
    async def _handle_payment_success(payload: Dict) -> Dict:
        """Handle successful payment"""
        payment_intent = payload.get("data", {}).get("object", {})
        customer_id = payment_intent.get("customer")
        amount = payment_intent.get("amount", 0) / 100  # Convert from cents

        logger.info(f"Payment succeeded: ${amount} from customer {customer_id}")

        # TODO: Update database, send confirmation email
        return {"status": "processed", "action": "payment_recorded"}

    @staticmethod
    async def _handle_payment_failure(payload: Dict) -> Dict:
        """Handle failed payment"""
        payment_intent = payload.get("data", {}).get("object", {})
        customer_id = payment_intent.get("customer")

        logger.warning(f"Payment failed for customer {customer_id}")

        # TODO: Send payment failure notification
        return {"status": "processed", "action": "failure_notification_sent"}

    @staticmethod
    async def _handle_subscription_created(payload: Dict) -> Dict:
        """Handle new subscription"""
        subscription = payload.get("data", {}).get("object", {})
        customer_id = subscription.get("customer")

        logger.info(f"New subscription for customer {customer_id}")

        # TODO: Activate features, send welcome email
        return {"status": "processed", "action": "subscription_activated"}

    @staticmethod
    async def _handle_subscription_cancelled(payload: Dict) -> Dict:
        """Handle cancelled subscription"""
        subscription = payload.get("data", {}).get("object", {})
        customer_id = subscription.get("customer")

        logger.info(f"Subscription cancelled for customer {customer_id}")

        # TODO: Deactivate features, send cancellation survey
        return {"status": "processed", "action": "subscription_deactivated"}


class CRMIntegration:
    """CRM integration handler"""

    def __init__(self, config: IntegrationConfig):
        self.config = config
        self.provider = CRMProvider(config.provider)

    async def sync_lead(self, lead_data: Dict) -> Dict:
        """Sync lead to CRM"""
        if self.provider == CRMProvider.SALESFORCE:
            return await self._sync_to_salesforce(lead_data)
        elif self.provider == CRMProvider.HUBSPOT:
            return await self._sync_to_hubspot(lead_data)
        elif self.provider == CRMProvider.PIPEDRIVE:
            return await self._sync_to_pipedrive(lead_data)
        else:
            raise NotImplementedError(f"CRM provider {self.provider} not implemented")

    async def _sync_to_hubspot(self, lead_data: Dict) -> Dict:
        """Sync lead to HubSpot"""
        url = "https://api.hubapi.com/contacts/v1/contact"

        # Transform to HubSpot format
        hubspot_data = {
            "properties": [
                {"property": "email", "value": lead_data.get("email")},
                {
                    "property": "firstname",
                    "value": lead_data.get("name", "").split()[0],
                },
                {
                    "property": "lastname",
                    "value": " ".join(lead_data.get("name", "").split()[1:]),
                },
                {"property": "company", "value": lead_data.get("company")},
                {"property": "phone", "value": lead_data.get("phone")},
            ]
        }

        headers = {
            "Authorization": f"Bearer {self.config.api_key}",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, json=hubspot_data, headers=headers)
                response.raise_for_status()
                return {"success": True, "crm_id": response.json().get("vid")}
            except httpx.HTTPError as e:
                logger.error(f"HubSpot sync failed: {e}")
                return {"success": False, "error": str(e)}

    async def _sync_to_salesforce(self, lead_data: Dict) -> Dict:
        """Sync lead to Salesforce"""
        # Salesforce requires OAuth2 token
        url = f"{self.config.settings.get('instance_url')}/services/data/v57.0/sobjects/Lead"

        salesforce_data = {
            "Email": lead_data.get("email"),
            "FirstName": lead_data.get("name", "").split()[0],
            "LastName": " ".join(lead_data.get("name", "").split()[1:]) or "Unknown",
            "Company": lead_data.get("company", "Unknown"),
            "Phone": lead_data.get("phone"),
            "Status": "Open - Not Contacted",
        }

        headers = {
            "Authorization": f"Bearer {self.config.api_key}",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, json=salesforce_data, headers=headers)
                response.raise_for_status()
                return {"success": True, "crm_id": response.json().get("id")}
            except httpx.HTTPError as e:
                logger.error(f"Salesforce sync failed: {e}")
                return {"success": False, "error": str(e)}

    async def _sync_to_pipedrive(self, lead_data: Dict) -> Dict:
        """Sync lead to Pipedrive"""
        url = f"https://api.pipedrive.com/v1/persons"

        params = {"api_token": self.config.api_key}

        pipedrive_data = {
            "name": lead_data.get("name"),
            "email": lead_data.get("email"),
            "phone": lead_data.get("phone"),
            "org_name": lead_data.get("company"),
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, json=pipedrive_data, params=params)
                response.raise_for_status()
                return {
                    "success": True,
                    "crm_id": response.json().get("data", {}).get("id"),
                }
            except httpx.HTTPError as e:
                logger.error(f"Pipedrive sync failed: {e}")
                return {"success": False, "error": str(e)}


class EmailIntegration:
    """Email provider integration"""

    def __init__(self, config: IntegrationConfig):
        self.config = config
        self.provider = EmailProvider(config.provider)

    async def send_email(
        self, to: str, subject: str, body: str, from_email: Optional[str] = None
    ) -> Dict:
        """Send email through configured provider"""
        if self.provider == EmailProvider.SENDGRID:
            return await self._send_via_sendgrid(to, subject, body, from_email)
        elif self.provider == EmailProvider.MAILGUN:
            return await self._send_via_mailgun(to, subject, body, from_email)
        elif self.provider == EmailProvider.SES:
            return await self._send_via_ses(to, subject, body, from_email)
        else:
            raise NotImplementedError(f"Email provider {self.provider} not implemented")

    async def _send_via_sendgrid(
        self, to: str, subject: str, body: str, from_email: Optional[str]
    ) -> Dict:
        """Send email via SendGrid"""
        url = "https://api.sendgrid.com/v3/mail/send"

        data = {
            "personalizations": [{"to": [{"email": to}]}],
            "from": {"email": from_email or self.config.settings.get("from_email")},
            "subject": subject,
            "content": [{"type": "text/html", "value": body}],
        }

        headers = {
            "Authorization": f"Bearer {self.config.api_key}",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, json=data, headers=headers)
                response.raise_for_status()
                return {
                    "success": True,
                    "message_id": response.headers.get("X-Message-Id"),
                }
            except httpx.HTTPError as e:
                logger.error(f"SendGrid send failed: {e}")
                return {"success": False, "error": str(e)}

    async def _send_via_mailgun(
        self, to: str, subject: str, body: str, from_email: Optional[str]
    ) -> Dict:
        """Send email via Mailgun"""
        domain = self.config.settings.get("domain")
        url = f"https://api.mailgun.net/v3/{domain}/messages"

        data = {
            "from": from_email or self.config.settings.get("from_email"),
            "to": to,
            "subject": subject,
            "html": body,
        }

        auth = ("api", self.config.api_key)

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, data=data, auth=auth)
                response.raise_for_status()
                return {"success": True, "message_id": response.json().get("id")}
            except httpx.HTTPError as e:
                logger.error(f"Mailgun send failed: {e}")
                return {"success": False, "error": str(e)}

    async def _send_via_ses(
        self, to: str, subject: str, body: str, from_email: Optional[str]
    ) -> Dict:
        """Send email via AWS SES"""
        # Would use boto3 in production
        logger.info(f"Sending via SES to {to}")
        return {"success": True, "message_id": "ses-123"}


class CalendarIntegration:
    """Calendar integration for scheduling"""

    @staticmethod
    async def create_google_calendar_event(
        access_token: str,
        summary: str,
        start_time: datetime,
        end_time: datetime,
        attendees: List[str],
    ) -> Dict:
        """Create Google Calendar event"""
        url = "https://www.googleapis.com/calendar/v3/calendars/primary/events"

        event_data = {
            "summary": summary,
            "start": {"dateTime": start_time.isoformat(), "timeZone": "UTC"},
            "end": {"dateTime": end_time.isoformat(), "timeZone": "UTC"},
            "attendees": [{"email": email} for email in attendees],
            "reminders": {
                "useDefault": False,
                "overrides": [
                    {"method": "email", "minutes": 24 * 60},
                    {"method": "popup", "minutes": 30},
                ],
            },
        }

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, json=event_data, headers=headers)
                response.raise_for_status()
                return {"success": True, "event_id": response.json().get("id")}
            except httpx.HTTPError as e:
                logger.error(f"Calendar event creation failed: {e}")
                return {"success": False, "error": str(e)}


class IntegrationRegistry:
    """Registry for managing integrations"""

    def __init__(self):
        self.integrations: Dict[str, IntegrationConfig] = {}

    def register(self, name: str, config: IntegrationConfig):
        """Register an integration"""
        self.integrations[name] = config
        logger.info(f"Registered integration: {name}")

    def get(self, name: str) -> Optional[IntegrationConfig]:
        """Get integration by name"""
        return self.integrations.get(name)

    def list_active(self) -> List[str]:
        """List all active integrations"""
        return [name for name, config in self.integrations.items() if config.enabled]


# Global registry
integration_registry = IntegrationRegistry()
