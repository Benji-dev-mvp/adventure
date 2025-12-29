"""API Key service for external integration management."""
from typing import Optional, List
from datetime import datetime
from sqlmodel import Session, select
from fastapi import HTTPException

from app.models.db.api_key import APIKey, APIKeyCreate, APIKeyResponse, APIKeyList


class APIKeyService:
    """Service for managing API keys."""
    
    @staticmethod
    def create_api_key(
        session: Session,
        tenant_id: int,
        key_data: APIKeyCreate,
        user_id: Optional[int] = None
    ) -> APIKeyResponse:
        """Create a new API key for a tenant.
        
        Returns the full key only once during creation.
        """
        # Generate key and hash
        api_key, key_hash = APIKey.generate_key()
        key_prefix = api_key[:12]  # Store prefix for display
        
        # Convert scopes list to comma-separated string
        scopes_str = None
        if key_data.scopes:
            scopes_str = ",".join(key_data.scopes)
        
        # Create API key record
        db_key = APIKey(
            tenant_id=tenant_id,
            user_id=user_id,
            label=key_data.label,
            key_hash=key_hash,
            key_prefix=key_prefix,
            scopes=scopes_str,
            expires_at=key_data.expires_at,
        )
        
        session.add(db_key)
        session.commit()
        session.refresh(db_key)
        
        # Return response with full key (only time it's shown)
        return APIKeyResponse(
            id=db_key.id,
            label=db_key.label,
            key=api_key,  # Full key returned only on creation
            key_prefix=key_prefix,
            scopes=scopes_str,
            created_at=db_key.created_at,
            expires_at=db_key.expires_at,
        )
    
    @staticmethod
    def list_api_keys(
        session: Session,
        tenant_id: int,
        include_revoked: bool = False
    ) -> List[APIKeyList]:
        """List all API keys for a tenant."""
        query = select(APIKey).where(APIKey.tenant_id == tenant_id)
        
        if not include_revoked:
            query = query.where(APIKey.is_active == True)
        
        keys = session.exec(query).all()
        
        return [
            APIKeyList(
                id=key.id,
                label=key.label,
                key_prefix=key.key_prefix,
                scopes=key.scopes,
                last_used_at=key.last_used_at,
                usage_count=key.usage_count,
                created_at=key.created_at,
                revoked_at=key.revoked_at,
                is_active=key.is_active,
            )
            for key in keys
        ]
    
    @staticmethod
    def get_api_key(session: Session, tenant_id: int, key_id: int) -> Optional[APIKey]:
        """Get a specific API key."""
        return session.exec(
            select(APIKey)
            .where(APIKey.id == key_id)
            .where(APIKey.tenant_id == tenant_id)
        ).first()
    
    @staticmethod
    def revoke_api_key(session: Session, tenant_id: int, key_id: int) -> bool:
        """Revoke an API key."""
        key = session.exec(
            select(APIKey)
            .where(APIKey.id == key_id)
            .where(APIKey.tenant_id == tenant_id)
        ).first()
        
        if not key:
            raise HTTPException(status_code=404, detail="API key not found")
        
        if key.revoked_at:
            raise HTTPException(status_code=400, detail="API key already revoked")
        
        key.is_active = False
        key.revoked_at = datetime.utcnow()
        session.add(key)
        session.commit()
        
        return True
    
    @staticmethod
    def validate_api_key(session: Session, api_key: str) -> Optional[APIKey]:
        """Validate an API key and return the key record if valid.
        
        Also updates last_used_at and usage_count.
        """
        key_hash = APIKey.hash_key(api_key)
        
        key = session.exec(
            select(APIKey).where(APIKey.key_hash == key_hash)
        ).first()
        
        if not key:
            return None
        
        # Check if key is active
        if not key.is_active or key.revoked_at:
            return None
        
        # Check expiration
        if key.expires_at and key.expires_at < datetime.utcnow():
            return None
        
        # Update usage stats
        key.last_used_at = datetime.utcnow()
        key.usage_count += 1
        session.add(key)
        session.commit()
        
        return key
    
    @staticmethod
    def check_scope(api_key: APIKey, required_scope: str) -> bool:
        """Check if API key has required scope."""
        if not api_key.scopes:
            return False
        
        scopes = api_key.scopes.split(",")
        
        # Support wildcard scope
        if "*" in scopes or "admin" in scopes:
            return True
        
        return required_scope in scopes


# Singleton instance
api_key_service = APIKeyService()
