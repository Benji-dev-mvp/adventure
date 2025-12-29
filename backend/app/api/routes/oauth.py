"""
OAuth Integrations for Gmail and Salesforce
Handles authentication flow, token refresh, and webhook handlers
"""

import json
import logging
import secrets
from datetime import datetime, timedelta
from typing import Dict, Optional

import httpx
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()


# OAuth Configuration
GMAIL_CONFIG = {
    "client_id": settings.google_client_id,
    "client_secret": settings.google_client_secret,
    "redirect_uri": f"{settings.app_url}/api/oauth/gmail/callback",
    "auth_url": "https://accounts.google.com/o/oauth2/v2/auth",
    "token_url": "https://oauth2.googleapis.com/token",
    "scopes": [
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.modify",
    ],
}

SALESFORCE_CONFIG = {
    "client_id": settings.salesforce_client_id,
    "client_secret": settings.salesforce_client_secret,
    "redirect_uri": f"{settings.app_url}/api/oauth/salesforce/callback",
    "auth_url": "https://login.salesforce.com/services/oauth2/authorize",
    "token_url": "https://login.salesforce.com/services/oauth2/token",
    "scopes": ["api", "refresh_token", "offline_access"],
}


class OAuthToken(BaseModel):
    """OAuth token model"""

    access_token: str
    refresh_token: Optional[str] = None
    expires_at: datetime
    scope: str
    token_type: str = "Bearer"
    provider: str


class TokenStore:
    """In-memory token store (use database in production)"""

    def __init__(self):
        self._tokens: Dict[str, Dict[str, OAuthToken]] = {}

    def save_token(self, user_id: str, provider: str, token: OAuthToken):
        """Save OAuth token for user"""
        if user_id not in self._tokens:
            self._tokens[user_id] = {}
        self._tokens[user_id][provider] = token
        logger.info(f"Saved {provider} token for user {user_id}")

    def get_token(self, user_id: str, provider: str) -> Optional[OAuthToken]:
        """Get OAuth token for user"""
        return self._tokens.get(user_id, {}).get(provider)

    def delete_token(self, user_id: str, provider: str):
        """Delete OAuth token"""
        if user_id in self._tokens and provider in self._tokens[user_id]:
            del self._tokens[user_id][provider]
            logger.info(f"Deleted {provider} token for user {user_id}")


# Global token store
token_store = TokenStore()


class OAuthState:
    """Manage OAuth state for CSRF protection"""

    def __init__(self):
        self._states: Dict[str, Dict] = {}

    def create_state(self, user_id: str, provider: str) -> str:
        """Create state token"""
        state = secrets.token_urlsafe(32)
        self._states[state] = {
            "user_id": user_id,
            "provider": provider,
            "created_at": datetime.utcnow(),
        }
        return state

    def verify_state(self, state: str) -> Optional[Dict]:
        """Verify and consume state token"""
        state_data = self._states.pop(state, None)
        if state_data:
            # Check expiration (5 minutes)
            if datetime.utcnow() - state_data["created_at"] > timedelta(minutes=5):
                return None
        return state_data


oauth_state = OAuthState()


# ============= Gmail OAuth =============


@router.get("/oauth/gmail/authorize")
async def gmail_authorize(user_id: str):
    """Initiate Gmail OAuth flow"""
    state = oauth_state.create_state(user_id, "gmail")

    auth_url = (
        f"{GMAIL_CONFIG['auth_url']}?"
        f"client_id={GMAIL_CONFIG['client_id']}&"
        f"redirect_uri={GMAIL_CONFIG['redirect_uri']}&"
        f"response_type=code&"
        f"scope={' '.join(GMAIL_CONFIG['scopes'])}&"
        f"state={state}&"
        f"access_type=offline&"
        f"prompt=consent"
    )

    return {"authorization_url": auth_url}


@router.get("/oauth/gmail/callback")
async def gmail_callback(code: str, state: str):
    """Handle Gmail OAuth callback"""
    # Verify state
    state_data = oauth_state.verify_state(state)
    if not state_data:
        raise HTTPException(status_code=400, detail="Invalid or expired state")

    user_id = state_data["user_id"]

    # Exchange code for token
    async with httpx.AsyncClient() as client:
        response = await client.post(
            GMAIL_CONFIG["token_url"],
            data={
                "code": code,
                "client_id": GMAIL_CONFIG["client_id"],
                "client_secret": GMAIL_CONFIG["client_secret"],
                "redirect_uri": GMAIL_CONFIG["redirect_uri"],
                "grant_type": "authorization_code",
            },
        )

    if response.status_code != 200:
        logger.error(f"Gmail OAuth error: {response.text}")
        raise HTTPException(status_code=400, detail="Failed to get access token")

    token_data = response.json()

    # Save token
    token = OAuthToken(
        access_token=token_data["access_token"],
        refresh_token=token_data.get("refresh_token"),
        expires_at=datetime.utcnow() + timedelta(seconds=token_data.get("expires_in", 3600)),
        scope=token_data.get("scope", ""),
        provider="gmail",
    )

    token_store.save_token(user_id, "gmail", token)

    # Redirect to success page
    return RedirectResponse(url=f"{settings.frontend_url}/integrations?gmail=success")


async def refresh_gmail_token(user_id: str) -> OAuthToken:
    """Refresh Gmail access token"""
    token = token_store.get_token(user_id, "gmail")
    if not token or not token.refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token available")

    async with httpx.AsyncClient() as client:
        response = await client.post(
            GMAIL_CONFIG["token_url"],
            data={
                "refresh_token": token.refresh_token,
                "client_id": GMAIL_CONFIG["client_id"],
                "client_secret": GMAIL_CONFIG["client_secret"],
                "grant_type": "refresh_token",
            },
        )

    if response.status_code != 200:
        logger.error(f"Gmail token refresh error: {response.text}")
        raise HTTPException(status_code=400, detail="Failed to refresh token")

    token_data = response.json()

    # Update token
    token.access_token = token_data["access_token"]
    token.expires_at = datetime.utcnow() + timedelta(seconds=token_data.get("expires_in", 3600))

    token_store.save_token(user_id, "gmail", token)

    return token


async def get_gmail_token(user_id: str) -> str:
    """Get valid Gmail access token (refresh if needed)"""
    token = token_store.get_token(user_id, "gmail")
    if not token:
        raise HTTPException(status_code=401, detail="Gmail not connected")

    # Check if expired
    if datetime.utcnow() >= token.expires_at - timedelta(minutes=5):
        token = await refresh_gmail_token(user_id)

    return token.access_token


# ============= Salesforce OAuth =============


@router.get("/oauth/salesforce/authorize")
async def salesforce_authorize(user_id: str):
    """Initiate Salesforce OAuth flow"""
    state = oauth_state.create_state(user_id, "salesforce")

    auth_url = (
        f"{SALESFORCE_CONFIG['auth_url']}?"
        f"client_id={SALESFORCE_CONFIG['client_id']}&"
        f"redirect_uri={SALESFORCE_CONFIG['redirect_uri']}&"
        f"response_type=code&"
        f"scope={' '.join(SALESFORCE_CONFIG['scopes'])}&"
        f"state={state}"
    )

    return {"authorization_url": auth_url}


@router.get("/oauth/salesforce/callback")
async def salesforce_callback(code: str, state: str):
    """Handle Salesforce OAuth callback"""
    # Verify state
    state_data = oauth_state.verify_state(state)
    if not state_data:
        raise HTTPException(status_code=400, detail="Invalid or expired state")

    user_id = state_data["user_id"]

    # Exchange code for token
    async with httpx.AsyncClient() as client:
        response = await client.post(
            SALESFORCE_CONFIG["token_url"],
            data={
                "code": code,
                "client_id": SALESFORCE_CONFIG["client_id"],
                "client_secret": SALESFORCE_CONFIG["client_secret"],
                "redirect_uri": SALESFORCE_CONFIG["redirect_uri"],
                "grant_type": "authorization_code",
            },
        )

    if response.status_code != 200:
        logger.error(f"Salesforce OAuth error: {response.text}")
        raise HTTPException(status_code=400, detail="Failed to get access token")

    token_data = response.json()

    # Save token
    token = OAuthToken(
        access_token=token_data["access_token"],
        refresh_token=token_data.get("refresh_token"),
        expires_at=datetime.utcnow() + timedelta(hours=2),  # Salesforce tokens last ~2 hours
        scope=token_data.get("scope", ""),
        provider="salesforce",
    )

    token_store.save_token(user_id, "salesforce", token)

    # Store instance URL
    token_data.get("instance_url", "")
    # TODO: Save to database

    return RedirectResponse(url=f"{settings.frontend_url}/integrations?salesforce=success")


async def refresh_salesforce_token(user_id: str) -> OAuthToken:
    """Refresh Salesforce access token"""
    token = token_store.get_token(user_id, "salesforce")
    if not token or not token.refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token available")

    async with httpx.AsyncClient() as client:
        response = await client.post(
            SALESFORCE_CONFIG["token_url"],
            data={
                "refresh_token": token.refresh_token,
                "client_id": SALESFORCE_CONFIG["client_id"],
                "client_secret": SALESFORCE_CONFIG["client_secret"],
                "grant_type": "refresh_token",
            },
        )

    if response.status_code != 200:
        logger.error(f"Salesforce token refresh error: {response.text}")
        raise HTTPException(status_code=400, detail="Failed to refresh token")

    token_data = response.json()

    # Update token
    token.access_token = token_data["access_token"]
    token.expires_at = datetime.utcnow() + timedelta(hours=2)

    token_store.save_token(user_id, "salesforce", token)

    return token


async def get_salesforce_token(user_id: str) -> str:
    """Get valid Salesforce access token (refresh if needed)"""
    token = token_store.get_token(user_id, "salesforce")
    if not token:
        raise HTTPException(status_code=401, detail="Salesforce not connected")

    # Check if expired
    if datetime.utcnow() >= token.expires_at - timedelta(minutes=10):
        token = await refresh_salesforce_token(user_id)

    return token.access_token


# ============= Webhook Handlers =============


@router.post("/webhooks/salesforce")
async def salesforce_webhook(request: Request):
    """
    Handle Salesforce webhooks (Platform Events, Outbound Messages)

    Salesforce can send notifications when:
    - Lead is created/updated
    - Opportunity stage changes
    - Contact is updated
    """
    body = await request.body()

    try:
        # Parse webhook payload
        data = json.loads(body)

        logger.info(f"Received Salesforce webhook: {data}")

        # Process based on event type
        event_type = data.get("type") or data.get("sObject")

        if event_type == "Lead":
            await process_lead_update(data)
        elif event_type == "Opportunity":
            await process_opportunity_update(data)
        elif event_type == "Contact":
            await process_contact_update(data)

        return {"status": "success", "processed": True}

    except Exception as e:
        logger.error(f"Error processing Salesforce webhook: {e}")
        raise HTTPException(status_code=400, detail=str(e))


async def process_lead_update(data: Dict):
    """Process Lead update from Salesforce"""
    logger.info(f"Processing Lead update: {data.get('Id')}")
    # TODO: Update local lead record, trigger campaign actions


async def process_opportunity_update(data: Dict):
    """Process Opportunity update from Salesforce"""
    logger.info(f"Processing Opportunity update: {data.get('Id')}")
    # TODO: Update pipeline, notify team


async def process_contact_update(data: Dict):
    """Process Contact update from Salesforce"""
    logger.info(f"Processing Contact update: {data.get('Id')}")
    # TODO: Sync contact data


@router.post("/webhooks/gmail")
async def gmail_webhook(request: Request):
    """
    Handle Gmail push notifications (email replies)

    Requires setting up Gmail Pub/Sub notifications
    """
    body = await request.body()

    try:
        data = json.loads(body)

        logger.info(f"Received Gmail webhook: {data}")

        # Decode message
        message = data.get("message", {})
        message.get("data", "")

        # Process email notification
        # TODO: Fetch email, detect reply, analyze with AI, take action

        return {"status": "success"}

    except Exception as e:
        logger.error(f"Error processing Gmail webhook: {e}")
        raise HTTPException(status_code=400, detail=str(e))


# ============= Integration Status =============


@router.get("/integrations/status")
async def get_integration_status(user_id: str):
    """Get status of all integrations for a user"""
    gmail_token = token_store.get_token(user_id, "gmail")
    salesforce_token = token_store.get_token(user_id, "salesforce")

    return {
        "gmail": {
            "connected": gmail_token is not None,
            "expires_at": gmail_token.expires_at.isoformat() if gmail_token else None,
        },
        "salesforce": {
            "connected": salesforce_token is not None,
            "expires_at": (salesforce_token.expires_at.isoformat() if salesforce_token else None),
        },
    }


@router.delete("/integrations/{provider}")
async def disconnect_integration(provider: str, user_id: str):
    """Disconnect an integration"""
    if provider not in ["gmail", "salesforce"]:
        raise HTTPException(status_code=400, detail="Invalid provider")

    token_store.delete_token(user_id, provider)

    return {"status": "disconnected", "provider": provider}
