"""File storage service with S3/GCS support."""

import os
from datetime import datetime
from typing import BinaryIO, Optional

import boto3
import magic
from botocore.exceptions import ClientError

from app.core.config import settings


class FileStorageService:
    """Service for handling file uploads and storage."""

    def __init__(self):
        """Initialize S3 client."""
        self.s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
            region_name=settings.aws_region,
        )
        self.bucket_name = settings.s3_bucket_name
        self.max_file_size = 50 * 1024 * 1024  # 50MB

        # Allowed file types
        self.allowed_mime_types = {
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "application/pdf",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/csv",
            "application/zip",
        }

    def validate_file(self, file: BinaryIO, filename: str) -> tuple[bool, Optional[str]]:
        """Validate file type and size."""
        # Check file size
        file.seek(0, os.SEEK_END)
        size = file.tell()
        file.seek(0)

        if size > self.max_file_size:
            return False, "File size exceeds 50MB limit"

        # Check MIME type
        mime = magic.from_buffer(file.read(2048), mime=True)
        file.seek(0)

        if mime not in self.allowed_mime_types:
            return False, f"File type '{mime}' is not allowed"

        return True, None

    def generate_file_key(self, user_id: int, filename: str) -> str:
        """Generate S3 object key."""
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        safe_filename = filename.replace(" ", "_")
        return f"uploads/{user_id}/{timestamp}_{safe_filename}"

    async def upload_file(
        self, file: BinaryIO, filename: str, user_id: int, folder: str = "general"
    ) -> dict:
        """Upload file to S3."""
        # Validate file
        is_valid, error_message = self.validate_file(file, filename)
        if not is_valid:
            raise ValueError(error_message)

        # Generate key
        file_key = f"{folder}/{self.generate_file_key(user_id, filename)}"

        try:
            # Upload to S3
            self.s3_client.upload_fileobj(
                file,
                self.bucket_name,
                file_key,
                ExtraArgs={
                    "ContentType": magic.from_buffer(file.read(2048), mime=True),
                    "Metadata": {
                        "uploaded_by": str(user_id),
                        "original_filename": filename,
                    },
                },
            )
            file.seek(0)

            # Generate URL
            url = self.generate_presigned_url(file_key)

            return {
                "file_key": file_key,
                "url": url,
                "filename": filename,
                "size": file.tell(),
                "uploaded_at": datetime.utcnow().isoformat(),
            }

        except ClientError as e:
            raise Exception(f"Failed to upload file: {str(e)}")

    def generate_presigned_url(self, file_key: str, expiration: int = 3600) -> str:
        """Generate presigned URL for file access."""
        try:
            url = self.s3_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": self.bucket_name, "Key": file_key},
                ExpiresIn=expiration,
            )
            return url
        except ClientError as e:
            raise Exception(f"Failed to generate presigned URL: {str(e)}")

    async def delete_file(self, file_key: str) -> bool:
        """Delete file from S3."""
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=file_key)
            return True
        except ClientError as e:
            print(f"Failed to delete file: {str(e)}")
            return False

    async def list_user_files(self, user_id: int, folder: str = "general") -> list:
        """List all files for a user."""
        prefix = f"{folder}/uploads/{user_id}/"

        try:
            response = self.s3_client.list_objects_v2(Bucket=self.bucket_name, Prefix=prefix)

            files = []
            for obj in response.get("Contents", []):
                files.append(
                    {
                        "key": obj["Key"],
                        "size": obj["Size"],
                        "last_modified": obj["LastModified"].isoformat(),
                        "url": self.generate_presigned_url(obj["Key"]),
                    }
                )

            return files

        except ClientError as e:
            raise Exception(f"Failed to list files: {str(e)}")


# Global instance
storage_service = FileStorageService()
