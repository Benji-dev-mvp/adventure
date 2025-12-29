"""
Enhanced Memory Manager with Typed Memory System

Wraps Mem0 with typed memory models, retention policies, PII redaction, and tenant isolation
"""

import logging
import os
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from mem0 import Memory, MemoryClient

from .memory_models import (
    RETENTION_CONFIG,
    BaseMemory,
    MemoryNamespace,
    MemoryType,
    PIIRedactor,
)

logger = logging.getLogger(__name__)


class EnhancedMemoryManager:
    """
    Enhanced memory manager with typed memory system on top of Mem0

    Features:
    - Typed memory models with Pydantic validation
    - Retention policies with TTL and compression
    - Namespace-based tenant isolation
    - PII redaction before persistence
    - Semantic search
    - Memory summarization
    """

    def __init__(
        self,
        hosted: bool = False,
        config: Optional[Dict[str, Any]] = None,
        enable_pii_redaction: bool = True,
    ):
        """
        Initialize enhanced memory manager

        Args:
            hosted: Use Mem0 hosted service or self-hosted
            config: Configuration for self-hosted
            enable_pii_redaction: Enable PII redaction before persistence
        """
        self.hosted = hosted
        self.enable_pii_redaction = enable_pii_redaction

        if hosted:
            api_key = os.getenv("MEM0_API_KEY")
            if not api_key:
                raise ValueError("MEM0_API_KEY required for hosted service")
            self.client = MemoryClient(api_key=api_key)
        else:
            default_config = {
                "vector_store": {
                    "provider": "qdrant",
                    "config": {
                        "host": os.getenv("QDRANT_HOST", "localhost"),
                        "port": int(os.getenv("QDRANT_PORT", "6333")),
                        "collection_name": "artisan_memories",
                    },
                },
                "embedder": {
                    "provider": "openai",
                    "config": {
                        "api_key": os.getenv("OPENAI_API_KEY"),
                        "model": "text-embedding-3-small",
                    },
                },
                "llm": {
                    "provider": "openai",
                    "config": {
                        "api_key": os.getenv("OPENAI_API_KEY"),
                        "model": "gpt-4",
                    },
                },
                "history_db": {
                    "provider": "redis",
                    "config": {
                        "host": os.getenv("REDIS_HOST", "localhost"),
                        "port": int(os.getenv("REDIS_PORT", "6379")),
                    },
                },
            }
            final_config = {**default_config, **(config or {})}
            self.client = Memory.from_config(final_config)

    async def store_memory(
        self,
        memory: BaseMemory,
    ) -> Dict[str, Any]:
        """
        Store typed memory with retention policies and PII redaction

        Args:
            memory: Typed memory object

        Returns:
            Result with memory_id and metadata
        """
        # Apply PII redaction if enabled
        content = memory.content
        if self.enable_pii_redaction and memory.memory_type != MemoryType.CAMPAIGN_RESULT:
            content, was_redacted = PIIRedactor.redact(content)
            memory.content = content
            memory.redacted = was_redacted
            memory.contains_pii = was_redacted

        # Build namespace for tenant isolation
        namespace = MemoryNamespace.build(
            org_id=memory.org_id,
            user_id=memory.user_id,
            account_id=memory.account_id,
            memory_type=memory.memory_type,
        )

        # Apply retention policy
        retention_config = RETENTION_CONFIG.get(memory.retention_policy, {})
        if memory.ttl_seconds is None and retention_config.get("ttl_seconds"):
            memory.ttl_seconds = retention_config["ttl_seconds"]

        if memory.ttl_seconds:
            memory.expires_at = datetime.utcnow() + timedelta(seconds=memory.ttl_seconds)

        # Store in Mem0
        try:
            result = self.client.add(
                messages=memory.content,
                user_id=namespace,
                metadata={
                    "memory_type": memory.memory_type.value,
                    "org_id": memory.org_id,
                    "user_id": memory.user_id,
                    "account_id": memory.account_id,
                    "retention_policy": memory.retention_policy.value,
                    "ttl_seconds": memory.ttl_seconds,
                    "expires_at": (memory.expires_at.isoformat() if memory.expires_at else None),
                    "contains_pii": memory.contains_pii,
                    "redacted": memory.redacted,
                    **memory.metadata,
                    **memory.model_dump(exclude={"content", "memory_id", "metadata"}),
                },
            )

            memory.memory_id = result.get("id")

            logger.info(
                f"Stored {memory.memory_type.value} memory",
                extra={
                    "memory_id": memory.memory_id,
                    "org_id": memory.org_id,
                    "namespace": namespace,
                    "retention_policy": memory.retention_policy.value,
                    "redacted": memory.redacted,
                },
            )

            return {
                "memory_id": memory.memory_id,
                "namespace": namespace,
                "expires_at": memory.expires_at,
                "redacted": memory.redacted,
            }

        except Exception as e:
            logger.error(f"Failed to store memory: {e}")
            raise

    async def retrieve_memories(
        self,
        org_id: str,
        query: str,
        user_id: Optional[str] = None,
        account_id: Optional[str] = None,
        memory_type: Optional[MemoryType] = None,
        limit: int = 5,
    ) -> List[Dict[str, Any]]:
        """
        Retrieve memories with semantic search

        Args:
            org_id: Organization ID (required for tenancy)
            query: Search query
            user_id: Optional user ID filter
            account_id: Optional account ID filter
            memory_type: Optional memory type filter
            limit: Max results

        Returns:
            List of matching memories
        """
        # Build namespace
        namespace = MemoryNamespace.build(
            org_id=org_id,
            user_id=user_id,
            account_id=account_id,
            memory_type=memory_type,
        )

        try:
            results = self.client.search(
                query=query,
                user_id=namespace,
                limit=limit,
            )

            logger.info(
                f"Retrieved {len(results)} memories",
                extra={
                    "org_id": org_id,
                    "namespace": namespace,
                    "query": query[:100],
                },
            )

            return results

        except Exception as e:
            logger.error(f"Failed to retrieve memories: {e}")
            raise

    async def get_all_memories(
        self,
        org_id: str,
        user_id: Optional[str] = None,
        account_id: Optional[str] = None,
        memory_type: Optional[MemoryType] = None,
    ) -> List[Dict[str, Any]]:
        """
        Get all memories for a namespace

        Args:
            org_id: Organization ID
            user_id: Optional user ID filter
            account_id: Optional account ID filter
            memory_type: Optional memory type filter

        Returns:
            List of all memories
        """
        namespace = MemoryNamespace.build(
            org_id=org_id,
            user_id=user_id,
            account_id=account_id,
            memory_type=memory_type,
        )

        try:
            results = self.client.get_all(user_id=namespace)
            return results
        except Exception as e:
            logger.error(f"Failed to get all memories: {e}")
            raise

    async def delete_memory(
        self,
        memory_id: str,
        org_id: str,
    ) -> bool:
        """
        Delete a specific memory

        Args:
            memory_id: Memory ID
            org_id: Organization ID (for validation)

        Returns:
            True if deleted successfully
        """
        try:
            # Validate tenancy before deletion
            memory = self.client.get(memory_id)
            if memory and memory.get("metadata", {}).get("org_id") != org_id:
                raise ValueError("Memory does not belong to this organization")

            self.client.delete(memory_id)

            logger.info(
                f"Deleted memory {memory_id}",
                extra={"memory_id": memory_id, "org_id": org_id},
            )

            return True

        except Exception as e:
            logger.error(f"Failed to delete memory: {e}")
            raise

    async def delete_all_memories(
        self,
        org_id: str,
        user_id: Optional[str] = None,
        account_id: Optional[str] = None,
        memory_type: Optional[MemoryType] = None,
    ) -> int:
        """
        Delete all memories for a namespace

        Args:
            org_id: Organization ID
            user_id: Optional user ID filter
            account_id: Optional account ID filter
            memory_type: Optional memory type filter

        Returns:
            Number of memories deleted
        """
        namespace = MemoryNamespace.build(
            org_id=org_id,
            user_id=user_id,
            account_id=account_id,
            memory_type=memory_type,
        )

        try:
            result = self.client.delete_all(user_id=namespace)
            count = result.get("deleted_count", 0)

            logger.info(
                f"Deleted {count} memories",
                extra={"org_id": org_id, "namespace": namespace},
            )

            return count

        except Exception as e:
            logger.error(f"Failed to delete memories: {e}")
            raise

    async def summarize_memories(
        self,
        org_id: str,
        user_id: Optional[str] = None,
        account_id: Optional[str] = None,
        memory_type: Optional[MemoryType] = None,
        max_memories: int = 50,
    ) -> str:
        """
        Summarize a set of memories into compressed format

        Useful for long-term memory compression per retention policies

        Args:
            org_id: Organization ID
            user_id: Optional user ID filter
            account_id: Optional account ID filter
            memory_type: Optional memory type filter
            max_memories: Max memories to summarize

        Returns:
            Summary text
        """
        memories = await self.get_all_memories(
            org_id=org_id,
            user_id=user_id,
            account_id=account_id,
            memory_type=memory_type,
        )

        if not memories:
            return ""

        # Limit to max_memories
        memories = memories[:max_memories]

        # Build prompt for summarization
        memory_texts = [m.get("memory", "") for m in memories]
        combined_text = "\n\n".join(memory_texts)

        prompt = f"""Summarize the following memories into a concise overview that captures the key information:

{combined_text}

Provide a summary that preserves important facts, patterns, and insights while removing redundancy."""

        # Use Mem0's LLM to summarize
        try:
            # This is a simplified example - Mem0 doesn't expose summarization directly
            # In practice, you'd use the provider's LLM directly
            from .providers import ProviderFactory

            provider = ProviderFactory.create()
            response = await provider.generate(
                prompt=prompt,
                system_prompt="You are an expert at summarizing information concisely.",
            )

            summary = response.content

            logger.info(
                f"Summarized {len(memories)} memories",
                extra={"org_id": org_id, "memory_count": len(memories)},
            )

            return summary

        except Exception as e:
            logger.error(f"Failed to summarize memories: {e}")
            raise


# Global instance
_memory_manager: Optional[EnhancedMemoryManager] = None


def get_memory_manager() -> EnhancedMemoryManager:
    """Get global memory manager instance"""
    global _memory_manager
    if _memory_manager is None:
        _memory_manager = EnhancedMemoryManager()
    return _memory_manager
