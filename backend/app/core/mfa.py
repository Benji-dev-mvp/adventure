"""Two-Factor Authentication (2FA/MFA) implementation."""

import base64
import io
from typing import Optional, Tuple

import pyotp
import qrcode
from pydantic import BaseModel


class MFASetup(BaseModel):
    """MFA setup response model."""

    secret: str
    qr_code: str
    backup_codes: list[str]


class MFAService:
    """Service for handling MFA/2FA operations."""

    @staticmethod
    def generate_secret() -> str:
        """Generate a random base32 secret for TOTP."""
        return pyotp.random_base32()

    @staticmethod
    def generate_qr_code(email: str, secret: str, issuer: str = "Enterprise App") -> str:
        """Generate QR code for authenticator apps."""
        totp = pyotp.TOTP(secret)
        provisioning_uri = totp.provisioning_uri(name=email, issuer_name=issuer)

        # Generate QR code
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(provisioning_uri)
        qr.make(fit=True)

        # Convert to base64 image
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)
        img_str = base64.b64encode(buffer.read()).decode()

        return f"data:image/png;base64,{img_str}"

    @staticmethod
    def generate_backup_codes(count: int = 10) -> list[str]:
        """Generate backup codes for account recovery."""
        codes = []
        for _ in range(count):
            code = pyotp.random_base32(length=8)
            # Format as XXXX-XXXX for readability
            formatted = f"{code[:4]}-{code[4:8]}"
            codes.append(formatted)
        return codes

    @staticmethod
    def verify_totp(secret: str, token: str) -> bool:
        """Verify TOTP token."""
        totp = pyotp.TOTP(secret)
        return totp.verify(token, valid_window=1)  # Allow 1 step tolerance

    @staticmethod
    def setup_mfa(email: str) -> MFASetup:
        """Setup MFA for a user."""
        secret = MFAService.generate_secret()
        qr_code = MFAService.generate_qr_code(email, secret)
        backup_codes = MFAService.generate_backup_codes()

        return MFASetup(secret=secret, qr_code=qr_code, backup_codes=backup_codes)

    @staticmethod
    def verify_backup_code(
        stored_codes: list[str], provided_code: str
    ) -> Tuple[bool, Optional[list[str]]]:
        """
        Verify a backup code and return updated list with code removed.

        Returns:
            (is_valid, updated_codes)
        """
        # Normalize code format
        provided_code = provided_code.strip().upper().replace("-", "")

        for i, stored_code in enumerate(stored_codes):
            normalized_stored = stored_code.strip().upper().replace("-", "")
            if normalized_stored == provided_code:
                # Remove used code
                updated_codes = stored_codes[:i] + stored_codes[i + 1 :]
                return True, updated_codes

        return False, None


# Global MFA service instance
mfa_service = MFAService()
