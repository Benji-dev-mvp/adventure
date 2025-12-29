"""OAuth2 and SSO provider integrations."""

from typing import Any, Dict

import httpx
from authlib.integrations.starlette_client import OAuth
from fastapi import HTTPException, status

from app.core.config import settings

# Initialize OAuth client
oauth = OAuth()

# Register OAuth providers
oauth.register(
    name="google",
    client_id=settings.google_client_id,
    client_secret=settings.google_client_secret,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

oauth.register(
    name="microsoft",
    client_id=settings.microsoft_client_id,
    client_secret=settings.microsoft_client_secret,
    server_metadata_url="https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

oauth.register(
    name="github",
    client_id=settings.github_client_id,
    client_secret=settings.github_client_secret,
    authorize_url="https://github.com/login/oauth/authorize",
    authorize_params=None,
    access_token_url="https://github.com/login/oauth/access_token",
    access_token_params=None,
    refresh_token_url=None,
    client_kwargs={"scope": "user:email"},
)


class OAuthProvider:
    """Base OAuth provider class."""

    def __init__(self, name: str):
        self.name = name
        self.client = oauth.create_client(name)

    async def get_authorization_url(self, redirect_uri: str) -> tuple[str, str]:
        """Get OAuth authorization URL and state."""
        return await self.client.create_authorization_url(redirect_uri=redirect_uri)

    async def get_access_token(self, code: str, redirect_uri: str) -> Dict[str, Any]:
        """Exchange authorization code for access token."""
        token = await self.client.authorize_access_token(code=code)
        return token

    async def get_user_info(self, token: Dict[str, Any]) -> Dict[str, Any]:
        """Get user information from provider."""
        raise NotImplementedError


class GoogleOAuth(OAuthProvider):
    """Google OAuth provider."""

    def __init__(self):
        super().__init__("google")

    async def get_user_info(self, token: Dict[str, Any]) -> Dict[str, Any]:
        """Get user info from Google."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f'Bearer {token["access_token"]}'},
            )
            response.raise_for_status()
            user_data = response.json()

            return {
                "email": user_data.get("email"),
                "username": user_data.get("name"),
                "first_name": user_data.get("given_name"),
                "last_name": user_data.get("family_name"),
                "picture": user_data.get("picture"),
                "email_verified": user_data.get("verified_email", False),
                "provider": "google",
                "provider_id": user_data.get("id"),
            }


class MicrosoftOAuth(OAuthProvider):
    """Microsoft OAuth provider."""

    def __init__(self):
        super().__init__("microsoft")

    async def get_user_info(self, token: Dict[str, Any]) -> Dict[str, Any]:
        """Get user info from Microsoft."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://graph.microsoft.com/v1.0/me",
                headers={"Authorization": f'Bearer {token["access_token"]}'},
            )
            response.raise_for_status()
            user_data = response.json()

            return {
                "email": user_data.get("mail") or user_data.get("userPrincipalName"),
                "username": user_data.get("displayName"),
                "first_name": user_data.get("givenName"),
                "last_name": user_data.get("surname"),
                "provider": "microsoft",
                "provider_id": user_data.get("id"),
            }


class GitHubOAuth(OAuthProvider):
    """GitHub OAuth provider."""

    def __init__(self):
        super().__init__("github")

    async def get_user_info(self, token: Dict[str, Any]) -> Dict[str, Any]:
        """Get user info from GitHub."""
        async with httpx.AsyncClient() as client:
            # Get user profile
            response = await client.get(
                "https://api.github.com/user",
                headers={"Authorization": f'Bearer {token["access_token"]}'},
            )
            response.raise_for_status()
            user_data = response.json()

            # Get primary email
            email_response = await client.get(
                "https://api.github.com/user/emails",
                headers={"Authorization": f'Bearer {token["access_token"]}'},
            )
            email_response.raise_for_status()
            emails = email_response.json()
            primary_email = next((e["email"] for e in emails if e["primary"]), None)

            return {
                "email": primary_email or user_data.get("email"),
                "username": user_data.get("login"),
                "first_name": (
                    user_data.get("name", "").split()[0] if user_data.get("name") else None
                ),
                "last_name": (
                    " ".join(user_data.get("name", "").split()[1:])
                    if user_data.get("name")
                    else None
                ),
                "picture": user_data.get("avatar_url"),
                "provider": "github",
                "provider_id": str(user_data.get("id")),
            }


def get_oauth_provider(provider_name: str) -> OAuthProvider:
    """Get OAuth provider instance by name."""
    providers = {
        "google": GoogleOAuth,
        "microsoft": MicrosoftOAuth,
        "github": GitHubOAuth,
    }

    provider_class = providers.get(provider_name.lower())
    if not provider_class:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported OAuth provider: {provider_name}",
        )

    return provider_class()
