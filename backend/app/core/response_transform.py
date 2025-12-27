"""
Response transformation middleware for API responses.
Handles field filtering, PII redaction, and consistent envelopes.
"""
from typing import Any, Dict, List, Optional, Set
from pydantic import BaseModel
from fastapi import Request
from app.models.user import User, UserRole, Permission


class ResponseEnvelope(BaseModel):
    """Consistent API response envelope"""
    data: Any
    meta: Optional[Dict[str, Any]] = None
    errors: Optional[List[Dict[str, Any]]] = None


class FieldFilter:
    """Filter response fields based on query parameters"""
    
    @staticmethod
    def parse_fields(fields_param: Optional[str]) -> Optional[Set[str]]:
        """
        Parse ?fields=id,name,email into set of field names.
        """
        if not fields_param:
            return None
        return set(f.strip() for f in fields_param.split(',') if f.strip())
    
    @staticmethod
    def parse_expand(expand_param: Optional[str]) -> Optional[Set[str]]:
        """
        Parse ?expand=campaign,user into set of relationship names.
        """
        if not expand_param:
            return None
        return set(e.strip() for e in expand_param.split(',') if e.strip())
    
    @staticmethod
    def filter_dict(data: Dict[str, Any], fields: Set[str]) -> Dict[str, Any]:
        """Filter dictionary to only include specified fields"""
        return {k: v for k, v in data.items() if k in fields}
    
    @staticmethod
    def apply_filters(data: Any, fields: Optional[Set[str]], expand: Optional[Set[str]]) -> Any:
        """Apply field filtering to response data"""
        if data is None:
            return data
        
        # Handle lists
        if isinstance(data, list):
            return [FieldFilter.apply_filters(item, fields, expand) for item in data]
        
        # Handle Pydantic models
        if hasattr(data, 'dict'):
            data_dict = data.dict()
            if fields:
                data_dict = FieldFilter.filter_dict(data_dict, fields)
            return data_dict
        
        # Handle dicts
        if isinstance(data, dict) and fields:
            return FieldFilter.filter_dict(data, fields)
        
        return data


class PIIRedactor:
    """Redact PII based on user permissions"""
    
    PII_FIELDS = {
        "email",
        "phone",
        "phone_number",
        "ssn",
        "tax_id",
        "credit_card",
        "address",
        "ip_address"
    }
    
    @staticmethod
    def should_redact(user: User, field_name: str) -> bool:
        """Check if field should be redacted for user"""
        if user.role == UserRole.ADMIN:
            return False
        
        if user.has_permission(Permission.LEAD_EXPORT):
            return False
        
        return field_name.lower() in PIIRedactor.PII_FIELDS
    
    @staticmethod
    def redact_value(value: Any) -> str:
        """Redact a value"""
        if isinstance(value, str):
            if '@' in value:  # Email-like
                parts = value.split('@')
                return f"{parts[0][:2]}***@{parts[1]}" if len(parts) == 2 else "***"
            if len(value) > 4:
                return f"{value[:2]}***{value[-2:]}"
        return "***"
    
    @staticmethod
    def redact_dict(data: Dict[str, Any], user: User) -> Dict[str, Any]:
        """Redact PII fields in dictionary"""
        result = {}
        for key, value in data.items():
            if PIIRedactor.should_redact(user, key):
                result[key] = PIIRedactor.redact_value(value)
            elif isinstance(value, dict):
                result[key] = PIIRedactor.redact_dict(value, user)
            elif isinstance(value, list):
                result[key] = [
                    PIIRedactor.redact_dict(item, user) if isinstance(item, dict) else item
                    for item in value
                ]
            else:
                result[key] = value
        return result
    
    @staticmethod
    def apply_redaction(data: Any, user: User) -> Any:
        """Apply PII redaction to response data"""
        if data is None:
            return data
        
        # Handle lists
        if isinstance(data, list):
            return [PIIRedactor.apply_redaction(item, user) for item in data]
        
        # Handle Pydantic models
        if hasattr(data, 'dict'):
            data_dict = data.dict()
            return PIIRedactor.redact_dict(data_dict, user)
        
        # Handle dicts
        if isinstance(data, dict):
            return PIIRedactor.redact_dict(data, user)
        
        return data


def transform_response(
    data: Any,
    request: Request,
    user: Optional[User] = None,
    meta: Optional[Dict[str, Any]] = None
) -> Any:
    """
    Transform response data based on request parameters and user permissions.
    
    Supports:
    - ?fields=id,name,email - Field filtering
    - ?expand=campaign,user - Relationship expansion
    - Automatic PII redaction based on permissions
    - Consistent envelope format (optional)
    """
    # Parse query parameters
    fields_param = request.query_params.get('fields')
    expand_param = request.query_params.get('expand')
    envelope = request.query_params.get('envelope', 'false').lower() == 'true'
    
    fields = FieldFilter.parse_fields(fields_param) if fields_param else None
    expand = FieldFilter.parse_expand(expand_param) if expand_param else None
    
    # Apply transformations
    if fields or expand:
        data = FieldFilter.apply_filters(data, fields, expand)
    
    if user:
        data = PIIRedactor.apply_redaction(data, user)
    
    # Wrap in envelope if requested
    if envelope:
        return ResponseEnvelope(data=data, meta=meta)
    
    return data


def create_error_response(
    message: str,
    code: Optional[str] = None,
    details: Optional[Dict[str, Any]] = None
) -> ResponseEnvelope:
    """Create standardized error response"""
    error = {
        "message": message,
        "code": code or "ERROR"
    }
    if details:
        error["details"] = details
    
    return ResponseEnvelope(data=None, errors=[error])
