"""Database backup and disaster recovery system."""

import gzip
import os
import shutil
import subprocess
from datetime import datetime, timedelta
from typing import Optional

import boto3
from botocore.exceptions import ClientError

from app.core.config import settings


class BackupService:
    """Service for database backups and disaster recovery."""

    def __init__(self):
        """Initialize backup service."""
        self.s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
            region_name=settings.aws_region,
        )
        self.backup_bucket = settings.backup_bucket_name
        self.backup_dir = "/tmp/backups"
        os.makedirs(self.backup_dir, exist_ok=True)

    def create_database_backup(self) -> str:
        """Create PostgreSQL database backup."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_filename = f"backup_{timestamp}.sql"
        backup_path = os.path.join(self.backup_dir, backup_filename)

        # PostgreSQL backup command
        pg_dump_cmd = [
            "pg_dump",
            "-h",
            settings.db_host,
            "-p",
            str(settings.db_port),
            "-U",
            settings.db_user,
            "-d",
            settings.db_name,
            "-F",
            "c",  # Custom format for faster restore
            "-f",
            backup_path,
        ]

        try:
            # Set password environment variable
            env = os.environ.copy()
            env["PGPASSWORD"] = settings.db_password

            # Run pg_dump
            subprocess.run(pg_dump_cmd, env=env, check=True, capture_output=True)

            # Compress backup
            compressed_path = f"{backup_path}.gz"
            with open(backup_path, "rb") as f_in:
                with gzip.open(compressed_path, "wb") as f_out:
                    shutil.copyfileobj(f_in, f_out)

            # Remove uncompressed file
            os.remove(backup_path)

            return compressed_path

        except subprocess.CalledProcessError as e:
            raise Exception(f"Database backup failed: {e.stderr.decode()}")

    def upload_backup_to_s3(self, backup_path: str) -> str:
        """Upload backup file to S3."""
        filename = os.path.basename(backup_path)
        s3_key = f"database-backups/{datetime.now().year}/{datetime.now().month}/{filename}"

        try:
            self.s3_client.upload_file(
                backup_path,
                self.backup_bucket,
                s3_key,
                ExtraArgs={
                    "StorageClass": "STANDARD_IA",  # Infrequent Access for cost savings
                    "ServerSideEncryption": "AES256",
                },
            )

            # Clean up local file
            os.remove(backup_path)

            return s3_key

        except ClientError as e:
            raise Exception(f"Failed to upload backup to S3: {str(e)}")

    def perform_full_backup(self) -> dict:
        """Perform full database backup and upload to S3."""
        backup_path = self.create_database_backup()
        s3_key = self.upload_backup_to_s3(backup_path)

        return {
            "backup_key": s3_key,
            "timestamp": datetime.now().isoformat(),
            "size": os.path.getsize(backup_path) if os.path.exists(backup_path) else 0,
            "status": "completed",
        }

    def list_backups(self, days: int = 30) -> list:
        """List available backups from last N days."""
        cutoff_date = datetime.now() - timedelta(days=days)

        try:
            response = self.s3_client.list_objects_v2(
                Bucket=self.backup_bucket, Prefix="database-backups/"
            )

            backups = []
            for obj in response.get("Contents", []):
                if obj["LastModified"].replace(tzinfo=None) >= cutoff_date:
                    backups.append(
                        {
                            "key": obj["Key"],
                            "size": obj["Size"],
                            "last_modified": obj["LastModified"].isoformat(),
                        }
                    )

            return sorted(backups, key=lambda x: x["last_modified"], reverse=True)

        except ClientError as e:
            raise Exception(f"Failed to list backups: {str(e)}")

    def download_backup(self, s3_key: str) -> str:
        """Download backup from S3."""
        local_path = os.path.join(self.backup_dir, os.path.basename(s3_key))

        try:
            self.s3_client.download_file(self.backup_bucket, s3_key, local_path)
            return local_path

        except ClientError as e:
            raise Exception(f"Failed to download backup: {str(e)}")

    def restore_database(self, backup_path: str) -> bool:
        """Restore database from backup file."""
        # Decompress if needed
        if backup_path.endswith(".gz"):
            decompressed_path = backup_path[:-3]
            with gzip.open(backup_path, "rb") as f_in:
                with open(decompressed_path, "wb") as f_out:
                    shutil.copyfileobj(f_in, f_out)
            backup_path = decompressed_path

        # PostgreSQL restore command
        pg_restore_cmd = [
            "pg_restore",
            "-h",
            settings.db_host,
            "-p",
            str(settings.db_port),
            "-U",
            settings.db_user,
            "-d",
            settings.db_name,
            "--clean",
            "--if-exists",
            backup_path,
        ]

        try:
            env = os.environ.copy()
            env["PGPASSWORD"] = settings.db_password

            subprocess.run(pg_restore_cmd, env=env, check=True, capture_output=True)

            # Clean up
            os.remove(backup_path)

            return True

        except subprocess.CalledProcessError as e:
            raise Exception(f"Database restore failed: {e.stderr.decode()}")

    def cleanup_old_backups(self, days: int = 90):
        """Delete backups older than N days."""
        cutoff_date = datetime.now() - timedelta(days=days)

        try:
            response = self.s3_client.list_objects_v2(
                Bucket=self.backup_bucket, Prefix="database-backups/"
            )

            deleted_count = 0
            for obj in response.get("Contents", []):
                if obj["LastModified"].replace(tzinfo=None) < cutoff_date:
                    self.s3_client.delete_object(Bucket=self.backup_bucket, Key=obj["Key"])
                    deleted_count += 1

            return {"deleted_count": deleted_count}

        except ClientError as e:
            raise Exception(f"Failed to cleanup old backups: {str(e)}")


# Global instance
backup_service = BackupService()
