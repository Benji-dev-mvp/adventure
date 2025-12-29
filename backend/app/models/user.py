from enum import Enum
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr


class UserRole(str, Enum):
    """User role hierarchy"""
    ADMIN = "admin"
    MANAGER = "manager"
    USER = "user"


class Permission(str, Enum):
    """Granular permissions"""
    # Campaign permissions
    CAMPAIGN_CREATE = "campaign:create"
    CAMPAIGN_READ = "campaign:read"
    CAMPAIGN_UPDATE = "campaign:update"
    CAMPAIGN_DELETE = "campaign:delete"
    CAMPAIGN_SEND = "campaign:send"
    
    # Lead permissions
    LEAD_CREATE = "lead:create"
    LEAD_READ = "lead:read"
    LEAD_UPDATE = "lead:update"
    LEAD_DELETE = "lead:delete"
    LEAD_EXPORT = "lead:export"
    LEAD_IMPORT = "lead:import"
    
    # Analytics permissions
    ANALYTICS_READ = "analytics:read"
    ANALYTICS_EXPORT = "analytics:export"
    
    # Team permissions
    TEAM_CREATE = "team:create"
    TEAM_READ = "team:read"
    TEAM_UPDATE = "team:update"
    TEAM_DELETE = "team:delete"
    
    # User management
    USER_CREATE = "user:create"
    USER_READ = "user:read"
    USER_UPDATE = "user:update"
    USER_DELETE = "user:delete"
    
    # System permissions
    SYSTEM_ADMIN = "system:admin"
    AUDIT_LOG_READ = "audit:read"
    SETTINGS_UPDATE = "settings:update"


# Role-Permission mapping
ROLE_PERMISSIONS = {
    UserRole.ADMIN: [p for p in Permission],  # All permissions
    UserRole.MANAGER: [
        Permission.CAMPAIGN_CREATE,
        Permission.CAMPAIGN_READ,
        Permission.CAMPAIGN_UPDATE,
        Permission.CAMPAIGN_SEND,
        Permission.LEAD_CREATE,
        Permission.LEAD_READ,
        Permission.LEAD_UPDATE,
        Permission.LEAD_EXPORT,
        Permission.LEAD_IMPORT,
        Permission.ANALYTICS_READ,
        Permission.ANALYTICS_EXPORT,
        Permission.TEAM_READ,
        Permission.USER_READ,
    ],
    UserRole.USER: [
        Permission.CAMPAIGN_READ,
        Permission.LEAD_READ,
        Permission.ANALYTICS_READ,
    ],
}


class User(BaseModel):
    """User model"""
    id: int
    email: EmailStr
    name: str
    role: UserRole = UserRole.USER
    is_active: bool = True
    created_at: datetime
    last_login: Optional[datetime] = None
    
    # Organization membership
    organization_id: Optional[int] = None
    
    # OAuth fields
    oauth_provider: Optional[str] = None
    oauth_provider_id: Optional[str] = None
    is_verified: bool = False
    
    # MFA/2FA fields
    mfa_enabled: bool = False
    mfa_secret: Optional[str] = None
    mfa_backup_codes: Optional[List[str]] = None
    
    def has_permission(self, permission: Permission) -> bool:
        """Check if user has a specific permission"""
        return permission in ROLE_PERMISSIONS.get(self.role, [])
    
    def has_any_permission(self, permissions: List[Permission]) -> bool:
        """Check if user has any of the specified permissions"""
        return any(self.has_permission(p) for p in permissions)
    
    def has_all_permissions(self, permissions: List[Permission]) -> bool:
        """Check if user has all of the specified permissions"""
        return all(self.has_permission(p) for p in permissions)


class UserCreate(BaseModel):
    """User creation schema"""
    email: EmailStr
    name: str
    password: str
    role: UserRole = UserRole.USER


class UserUpdate(BaseModel):
    """User update schema"""
    name: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None


class UserInDB(User):
    """User with password hash"""
    hashed_password: str
