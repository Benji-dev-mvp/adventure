"""
Centralized error handling utilities for API routes.
Reduces duplication of try-except-HTTPException patterns.
"""
from functools import wraps
from typing import Callable, Any
from fastapi import HTTPException, status
import logging

logger = logging.getLogger(__name__)


def handle_api_errors(
    default_status: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
    error_prefix: str = "Operation failed"
):
    """
    Decorator to handle common API errors and convert them to HTTPException.
    
    Usage:
        @handle_api_errors(error_prefix="Lead scoring failed")
        async def score_lead(request):
            # Your logic here
            return result
    
    Args:
        default_status: HTTP status code for generic errors
        error_prefix: Prefix for error messages
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs) -> Any:
            try:
                return await func(*args, **kwargs)
            except HTTPException:
                # Re-raise HTTPException as-is
                raise
            except ValueError as e:
                # Handle validation errors
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"{error_prefix}: {str(e)}"
                )
            except Exception as e:
                # Log unexpected errors
                logger.error(f"{error_prefix}: {str(e)}", exc_info=True)
                raise HTTPException(
                    status_code=default_status,
                    detail=f"{error_prefix}: {str(e)}"
                )
        return wrapper
    return decorator


def handle_not_found(entity_name: str = "Resource"):
    """
    Decorator specifically for handling 404 Not Found errors.
    
    Usage:
        @handle_not_found("Campaign")
        async def get_campaign(campaign_id: int):
            campaign = db.get(campaign_id)
            if not campaign:
                raise ValueError(f"Campaign {campaign_id} not found")
            return campaign
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs) -> Any:
            try:
                result = await func(*args, **kwargs)
                if result is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"{entity_name} not found"
                    )
                return result
            except HTTPException:
                raise
            except Exception as e:
                logger.error(f"Error retrieving {entity_name}: {str(e)}", exc_info=True)
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to retrieve {entity_name}"
                )
        return wrapper
    return decorator


def require_permission(permission: str):
    """
    Decorator to check user permissions and raise 403 if insufficient.
    
    Usage:
        @require_permission("admin")
        async def delete_user(user_id: int, current_user: User = Depends(get_current_user)):
            # Will only execute if current_user has admin permission
            pass
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs) -> Any:
            # Extract current_user from kwargs if present
            current_user = kwargs.get('current_user')
            if current_user and hasattr(current_user, 'role'):
                if current_user.role != permission and current_user.role != 'admin':
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Insufficient permissions"
                    )
            return await func(*args, **kwargs)
        return wrapper
    return decorator
