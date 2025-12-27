"""Tenant service for multi-tenancy management."""
from typing import Optional, List
from datetime import datetime
from sqlmodel import Session, select
from fastapi import HTTPException

from app.models.db.tenant import Tenant, TenantCreate, TenantUpdate


class TenantService:
    """Service for managing tenants."""
    
    @staticmethod
    def create_tenant(session: Session, tenant_data: TenantCreate) -> Tenant:
        """Create a new tenant."""
        # Check if slug already exists
        existing = session.exec(
            select(Tenant).where(Tenant.slug == tenant_data.slug)
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=400,
                detail=f"Tenant with slug '{tenant_data.slug}' already exists"
            )
        
        tenant = Tenant(**tenant_data.dict())
        session.add(tenant)
        session.commit()
        session.refresh(tenant)
        
        return tenant
    
    @staticmethod
    def get_tenant(session: Session, tenant_id: int) -> Optional[Tenant]:
        """Get tenant by ID."""
        return session.get(Tenant, tenant_id)
    
    @staticmethod
    def get_tenant_by_slug(session: Session, slug: str) -> Optional[Tenant]:
        """Get tenant by slug."""
        return session.exec(
            select(Tenant).where(Tenant.slug == slug)
        ).first()
    
    @staticmethod
    def list_tenants(
        session: Session,
        skip: int = 0,
        limit: int = 100,
        is_active: Optional[bool] = None
    ) -> List[Tenant]:
        """List all tenants with optional filtering."""
        query = select(Tenant)
        
        if is_active is not None:
            query = query.where(Tenant.is_active == is_active)
        
        query = query.offset(skip).limit(limit)
        
        return list(session.exec(query).all())
    
    @staticmethod
    def update_tenant(
        session: Session,
        tenant_id: int,
        tenant_data: TenantUpdate
    ) -> Tenant:
        """Update a tenant."""
        tenant = session.get(Tenant, tenant_id)
        
        if not tenant:
            raise HTTPException(status_code=404, detail="Tenant not found")
        
        update_data = tenant_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(tenant, key, value)
        
        tenant.updated_at = datetime.utcnow()
        session.add(tenant)
        session.commit()
        session.refresh(tenant)
        
        return tenant
    
    @staticmethod
    def delete_tenant(session: Session, tenant_id: int) -> bool:
        """Soft delete a tenant."""
        tenant = session.get(Tenant, tenant_id)
        
        if not tenant:
            raise HTTPException(status_code=404, detail="Tenant not found")
        
        tenant.is_active = False
        tenant.updated_at = datetime.utcnow()
        session.add(tenant)
        session.commit()
        
        return True
    
    @staticmethod
    def check_limits(session: Session, tenant_id: int, resource_type: str) -> bool:
        """Check if tenant has reached resource limits.
        
        Args:
            tenant_id: Tenant ID
            resource_type: 'users', 'leads', or 'campaigns'
        
        Returns:
            True if within limits, False otherwise
        """
        tenant = session.get(Tenant, tenant_id)
        
        if not tenant:
            raise HTTPException(status_code=404, detail="Tenant not found")
        
        # Get current count based on resource type
        # In production, query actual counts from database
        current_count = 0  # Placeholder
        
        if resource_type == 'users':
            return current_count < tenant.max_users
        elif resource_type == 'leads':
            return current_count < tenant.max_leads
        elif resource_type == 'campaigns':
            return current_count < tenant.max_campaigns
        
        return True


# Singleton instance
tenant_service = TenantService()
