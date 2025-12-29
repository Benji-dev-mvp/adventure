"""
Advanced validation utilities for enterprise-grade input validation
"""

import re
from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, EmailStr, Field, validator


class ValidationError(Exception):
    """Custom validation error"""

    def __init__(self, field: str, message: str):
        self.field = field
        self.message = message
        super().__init__(f"{field}: {message}")


class Validator:
    """Advanced validation utility class"""

    # Regex patterns
    PHONE_PATTERN = re.compile(r"^\+?[1-9]\d{1,14}$")
    URL_PATTERN = re.compile(
        r"^https?://"
        r"(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|"
        r"localhost|"
        r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
        r"(?::\d+)?"
        r"(?:/?|[/?]\S+)$",
        re.IGNORECASE,
    )
    SLUG_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    SQL_INJECTION_PATTERNS = [
        r"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)",
        r"(--|;|\/\*|\*\/|xp_|sp_)",
        r"(\bOR\b.*=.*)",
        r"(\bAND\b.*=.*)",
    ]
    XSS_PATTERNS = [
        r"<script[^>]*>.*?</script>",
        r"javascript:",
        r"on\w+\s*=",
        r"<iframe",
        r"<object",
        r"<embed",
    ]

    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        if not email or len(email) > 254:
            return False
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        return bool(re.match(pattern, email))

    @staticmethod
    def validate_phone(phone: str) -> bool:
        """Validate international phone number"""
        if not phone:
            return False
        # Remove spaces, dashes, parentheses
        cleaned = re.sub(r"[\s\-\(\)]", "", phone)
        return bool(Validator.PHONE_PATTERN.match(cleaned))

    @staticmethod
    def validate_url(url: str, require_https: bool = False) -> bool:
        """Validate URL format"""
        if not url:
            return False
        if require_https and not url.startswith("https://"):
            return False
        return bool(Validator.URL_PATTERN.match(url))

    @staticmethod
    def validate_slug(slug: str) -> bool:
        """Validate URL-safe slug"""
        if not slug or len(slug) > 100:
            return False
        return bool(Validator.SLUG_PATTERN.match(slug))

    @staticmethod
    def sanitize_text(text: str, max_length: Optional[int] = None) -> str:
        """Sanitize text input to prevent XSS and SQL injection"""
        if not text:
            return ""

        # Remove null bytes
        sanitized = text.replace("\x00", "")

        # Remove or escape potentially dangerous patterns
        for pattern in Validator.XSS_PATTERNS:
            sanitized = re.sub(pattern, "", sanitized, flags=re.IGNORECASE)

        # Truncate if needed
        if max_length and len(sanitized) > max_length:
            sanitized = sanitized[:max_length]

        return sanitized.strip()

    @staticmethod
    def detect_sql_injection(text: str) -> bool:
        """Detect potential SQL injection attempts"""
        if not text:
            return False

        text_upper = text.upper()
        for pattern in Validator.SQL_INJECTION_PATTERNS:
            if re.search(pattern, text_upper):
                return True
        return False

    @staticmethod
    def validate_password_strength(password: str) -> Dict[str, Any]:
        """Validate password strength and return feedback"""
        result = {"valid": False, "score": 0, "feedback": []}

        if not password:
            result["feedback"].append("Password is required")
            return result

        # Length check
        if len(password) < 8:
            result["feedback"].append("Password must be at least 8 characters")
        else:
            result["score"] += 20

        if len(password) >= 12:
            result["score"] += 10

        # Complexity checks
        if re.search(r"[a-z]", password):
            result["score"] += 15
        else:
            result["feedback"].append("Include lowercase letters")

        if re.search(r"[A-Z]", password):
            result["score"] += 15
        else:
            result["feedback"].append("Include uppercase letters")

        if re.search(r"\d", password):
            result["score"] += 15
        else:
            result["feedback"].append("Include numbers")

        if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            result["score"] += 15
        else:
            result["feedback"].append("Include special characters")

        # Common patterns to avoid
        common_patterns = [
            r"(.)\1{2,}",  # Repeated characters
            r"(012|123|234|345|456|567|678|789)",  # Sequential numbers
            r"(abc|bcd|cde|def|efg|fgh)",  # Sequential letters
        ]

        for pattern in common_patterns:
            if re.search(pattern, password.lower()):
                result["score"] -= 10
                result["feedback"].append("Avoid common patterns")
                break

        # Common words check
        common_words = ["password", "admin", "user", "test", "12345678"]
        if any(word in password.lower() for word in common_words):
            result["score"] -= 20
            result["feedback"].append("Avoid common words")

        result["score"] = max(0, min(100, result["score"]))
        result["valid"] = result["score"] >= 60 and len(result["feedback"]) == 0

        return result

    @staticmethod
    def validate_json_structure(data: Dict, schema: Dict) -> List[str]:
        """Validate JSON data against a simple schema"""
        errors = []

        for field, rules in schema.items():
            value = data.get(field)

            # Required check
            if rules.get("required", False) and value is None:
                errors.append(f"{field} is required")
                continue

            if value is None:
                continue

            # Type check
            expected_type = rules.get("type")
            if expected_type:
                if expected_type == "string" and not isinstance(value, str):
                    errors.append(f"{field} must be a string")
                elif expected_type == "number" and not isinstance(value, (int, float)):
                    errors.append(f"{field} must be a number")
                elif expected_type == "boolean" and not isinstance(value, bool):
                    errors.append(f"{field} must be a boolean")
                elif expected_type == "array" and not isinstance(value, list):
                    errors.append(f"{field} must be an array")
                elif expected_type == "object" and not isinstance(value, dict):
                    errors.append(f"{field} must be an object")

            # Min/Max for strings
            if isinstance(value, str):
                if "min_length" in rules and len(value) < rules["min_length"]:
                    errors.append(f"{field} must be at least {rules['min_length']} characters")
                if "max_length" in rules and len(value) > rules["max_length"]:
                    errors.append(f"{field} must be at most {rules['max_length']} characters")

            # Min/Max for numbers
            if isinstance(value, (int, float)):
                if "min" in rules and value < rules["min"]:
                    errors.append(f"{field} must be at least {rules['min']}")
                if "max" in rules and value > rules["max"]:
                    errors.append(f"{field} must be at most {rules['max']}")

            # Pattern check
            if "pattern" in rules and isinstance(value, str):
                if not re.match(rules["pattern"], value):
                    errors.append(f"{field} format is invalid")

        return errors


class BulkOperationValidator:
    """Validator for bulk operations"""

    @staticmethod
    def validate_bulk_size(items: List[Any], max_size: int = 1000) -> None:
        """Validate bulk operation size"""
        if len(items) > max_size:
            raise ValidationError(
                "bulk_size",
                f"Bulk operations limited to {max_size} items, got {len(items)}",
            )

    @staticmethod
    def validate_ids(ids: List[int]) -> None:
        """Validate list of IDs"""
        if not ids:
            raise ValidationError("ids", "ID list cannot be empty")

        if not all(isinstance(id, int) and id > 0 for id in ids):
            raise ValidationError("ids", "All IDs must be positive integers")

        if len(ids) != len(set(ids)):
            raise ValidationError("ids", "Duplicate IDs found")


# Pydantic models for validated requests
class ValidatedEmailRequest(BaseModel):
    """Validated email request"""

    to: EmailStr
    subject: str = Field(min_length=1, max_length=200)
    body: str = Field(min_length=1, max_length=50000)
    from_email: Optional[EmailStr] = None
    reply_to: Optional[EmailStr] = None
    cc: Optional[List[EmailStr]] = None
    bcc: Optional[List[EmailStr]] = None

    @validator("body")
    def sanitize_body(cls, v):
        return Validator.sanitize_text(v)


class ValidatedCampaignRequest(BaseModel):
    """Validated campaign creation request"""

    name: str = Field(min_length=1, max_length=120)
    objective: str = Field(min_length=1, max_length=2000)
    type: str = Field(default="email", regex="^(email|linkedin|sms|call|multi-channel)$")
    scheduled_start: Optional[datetime] = None
    budget: Optional[float] = Field(default=None, ge=0, le=10000000)

    @validator("name", "objective")
    def sanitize_text_fields(cls, v):
        if Validator.detect_sql_injection(v):
            raise ValueError("Invalid input detected")
        return Validator.sanitize_text(v)


class ValidatedLeadRequest(BaseModel):
    """Validated lead creation request"""

    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = Field(default=None, max_length=200)

    @validator("phone")
    def validate_phone_format(cls, v):
        if v and not Validator.validate_phone(v):
            raise ValueError("Invalid phone number format")
        return v

    @validator("name", "company")
    def sanitize_text_fields(cls, v):
        if v and Validator.detect_sql_injection(v):
            raise ValueError("Invalid input detected")
        return Validator.sanitize_text(v) if v else v


class RateLimitConfig(BaseModel):
    """Rate limit configuration"""

    requests_per_minute: int = Field(default=60, ge=1, le=10000)
    requests_per_hour: int = Field(default=1000, ge=1, le=100000)
    requests_per_day: int = Field(default=10000, ge=1, le=1000000)
    burst_size: int = Field(default=10, ge=1, le=100)
