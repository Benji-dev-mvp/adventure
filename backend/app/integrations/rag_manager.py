"""
Enhanced RAG Manager

Hybrid search (vector + keyword), index versioning, and safe context filtering
"""

import logging
import os
import re
from datetime import datetime
from typing import Any, Dict, List, Optional

import qdrant_client
from llama_index.core import (
    Document,
    StorageContext,
    VectorStoreIndex,
)
from llama_index.core.node_parser import SentenceSplitter, SimpleNodeParser
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI
from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client.models import Distance, VectorParams

from .rag_schemas import (
    ChunkingStrategy,
    IngestionRequest,
    IngestionResult,
    SafeContextFilter,
    SearchFilter,
)

logger = logging.getLogger(__name__)


class EnhancedRAGManager:
    """
    Enhanced RAG manager with:
    - Normalized document ingestion
    - Hybrid search (vector + keyword)
    - Index versioning (blue/green deployments)
    - Safe context filtering
    - Tenant isolation
    """

    def __init__(
        self,
        qdrant_host: str = "localhost",
        qdrant_port: int = 6333,
        embedding_model: str = "text-embedding-3-small",
        llm_model: str = "gpt-4",
        current_index_version: str = "kb_v1",
    ):
        """
        Initialize enhanced RAG manager

        Args:
            qdrant_host: Qdrant server host
            qdrant_port: Qdrant server port
            embedding_model: OpenAI embedding model
            llm_model: LLM model for queries
            current_index_version: Current active index version
        """
        self.qdrant_host = qdrant_host
        self.qdrant_port = qdrant_port
        self.embedding_model = embedding_model
        self.llm_model = llm_model
        self.current_index_version = current_index_version

        # Initialize Qdrant client
        self.qdrant_client = qdrant_client.QdrantClient(
            host=qdrant_host,
            port=qdrant_port,
        )

        # Initialize embeddings and LLM
        self.embed_model = OpenAIEmbedding(
            model=embedding_model,
            api_key=os.getenv("OPENAI_API_KEY"),
        )

        self.llm = OpenAI(
            model=llm_model,
            api_key=os.getenv("OPENAI_API_KEY"),
        )

        # Index cache
        self._index_cache: Dict[str, VectorStoreIndex] = {}

        logger.info(f"Initialized RAG manager with index version {current_index_version}")

    async def ingest_documents(
        self,
        request: IngestionRequest,
    ) -> IngestionResult:
        """
        Ingest normalized documents with chunking and embedding

        Args:
            request: Ingestion request with documents and settings

        Returns:
            Ingestion result with stats
        """
        job_id = f"ingest_{datetime.utcnow().timestamp()}"

        # Get collection name for index version
        collection_name = self._get_collection_name(request.index_version)

        # Ensure collection exists
        await self._ensure_collection(collection_name, request.index_version)

        # Process documents
        documents_processed = 0
        chunks_created = 0
        failed_documents = []

        for doc in request.documents:
            try:
                # Convert to LlamaIndex Document
                llama_doc = Document(
                    text=doc.content,
                    metadata={
                        "document_id": doc.document_id,
                        "title": doc.title,
                        "source": doc.source.value,
                        "object_type": doc.object_type.value,
                        "org_id": doc.org_id,
                        "account_id": doc.account_id,
                        "access_level": doc.access_level.value,
                        "tags": doc.tags,
                        "industry": doc.industry,
                        "region": doc.region,
                        "created_at": doc.created_at.isoformat(),
                        "version": doc.version,
                        **doc.metadata,
                    },
                )

                # Chunk document
                chunks = await self._chunk_document(
                    llama_doc,
                    strategy=request.chunking_strategy,
                    chunk_size=request.chunk_size,
                    chunk_overlap=request.chunk_overlap,
                )

                # Add to index
                await self._add_chunks_to_index(
                    chunks,
                    collection_name,
                    request.index_version,
                )

                documents_processed += 1
                chunks_created += len(chunks)

            except Exception as e:
                logger.error(f"Failed to ingest document {doc.document_id}: {e}")
                failed_documents.append(doc.document_id)

        logger.info(
            f"Ingestion complete: {documents_processed} documents, {chunks_created} chunks",
            extra={
                "job_id": job_id,
                "index_version": request.index_version,
                "documents_processed": documents_processed,
                "chunks_created": chunks_created,
            },
        )

        return IngestionResult(
            job_id=job_id,
            documents_processed=documents_processed,
            chunks_created=chunks_created,
            failed_documents=failed_documents,
            index_version=request.index_version,
        )

    async def hybrid_search(
        self,
        query: str,
        filters: SearchFilter,
        similarity_threshold: float = 0.7,
        max_results: int = 5,
        index_version: Optional[str] = None,
        safe_context: bool = True,
    ) -> List[Dict[str, Any]]:
        """
        Hybrid search combining vector similarity and keyword matching

        Args:
            query: Search query
            filters: Search filters (org_id required)
            similarity_threshold: Minimum similarity score
            max_results: Maximum results to return
            index_version: Index version (defaults to current)
            safe_context: Apply safe context filtering

        Returns:
            List of search results with content and metadata
        """
        index_version = index_version or self.current_index_version
        collection_name = self._get_collection_name(index_version)

        # Build Qdrant filter conditions
        qdrant_filters = self._build_qdrant_filters(filters)

        # Vector search
        vector_results = await self._vector_search(
            query=query,
            collection_name=collection_name,
            filters=qdrant_filters,
            limit=max_results * 2,  # Get more for reranking
        )

        # Keyword search (simplified - in production, use BM25 or Elasticsearch)
        keyword_results = await self._keyword_search(
            query=query,
            collection_name=collection_name,
            filters=qdrant_filters,
            limit=max_results,
        )

        # Combine and deduplicate results
        combined_results = self._merge_results(
            vector_results,
            keyword_results,
            similarity_threshold=similarity_threshold,
        )

        # Apply safe context filtering
        if safe_context:
            combined_results = self._apply_safe_context_filter(combined_results)

        # Limit results
        combined_results = combined_results[:max_results]

        logger.info(
            f"Hybrid search returned {len(combined_results)} results",
            extra={
                "query": query[:100],
                "org_id": filters.org_id,
                "index_version": index_version,
            },
        )

        return combined_results

    async def switch_index_version(
        self,
        new_version: str,
    ) -> bool:
        """
        Switch to a new index version (blue/green deployment)

        Args:
            new_version: New index version to activate

        Returns:
            True if switch successful
        """
        collection_name = self._get_collection_name(new_version)

        # Verify collection exists
        try:
            self.qdrant_client.get_collection(collection_name)
        except Exception as e:
            raise ValueError(f"Index version {new_version} does not exist: {e}")

        # Switch
        old_version = self.current_index_version
        self.current_index_version = new_version

        # Clear cache
        self._index_cache.clear()

        logger.info(
            f"Switched index version from {old_version} to {new_version}",
            extra={
                "old_version": old_version,
                "new_version": new_version,
            },
        )

        return True

    def _get_collection_name(self, index_version: str) -> str:
        """Get Qdrant collection name for index version"""
        return f"artisan_{index_version}"

    async def _ensure_collection(
        self,
        collection_name: str,
        index_version: str,
    ):
        """Ensure Qdrant collection exists"""
        try:
            self.qdrant_client.get_collection(collection_name)
        except Exception:
            # Create collection
            self.qdrant_client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(
                    size=1536,  # OpenAI embedding dimension
                    distance=Distance.COSINE,
                ),
            )
            logger.info(f"Created collection {collection_name}")

    async def _chunk_document(
        self,
        document: Document,
        strategy: ChunkingStrategy,
        chunk_size: int,
        chunk_overlap: int,
    ) -> List[Document]:
        """Chunk document based on strategy"""
        if strategy == ChunkingStrategy.SEMANTIC:
            parser = SentenceSplitter(
                chunk_size=chunk_size,
                chunk_overlap=chunk_overlap,
            )
        else:
            parser = SimpleNodeParser.from_defaults(
                chunk_size=chunk_size,
                chunk_overlap=chunk_overlap,
            )

        nodes = parser.get_nodes_from_documents([document])

        # Convert nodes back to documents with chunk metadata
        chunks = []
        for idx, node in enumerate(nodes):
            chunk_doc = Document(
                text=node.text,
                metadata={
                    **document.metadata,
                    "chunk_index": idx,
                    "chunk_id": f"{document.metadata['document_id']}_chunk_{idx}",
                },
            )
            chunks.append(chunk_doc)

        return chunks

    async def _add_chunks_to_index(
        self,
        chunks: List[Document],
        collection_name: str,
        index_version: str,
    ):
        """Add chunks to Qdrant collection"""
        # Create vector store
        vector_store = QdrantVectorStore(
            client=self.qdrant_client,
            collection_name=collection_name,
        )

        # Create storage context
        storage_context = StorageContext.from_defaults(vector_store=vector_store)

        # Create or update index
        VectorStoreIndex.from_documents(
            chunks,
            storage_context=storage_context,
            embed_model=self.embed_model,
        )

    def _build_qdrant_filters(self, filters: SearchFilter) -> Dict[str, Any]:
        """Build Qdrant filter conditions"""
        conditions = [{"key": "org_id", "match": {"value": filters.org_id}}]

        if filters.source:
            conditions.append({"key": "source", "match": {"value": filters.source.value}})

        if filters.object_type:
            conditions.append({"key": "object_type", "match": {"value": filters.object_type.value}})

        if filters.industry:
            conditions.append({"key": "industry", "match": {"value": filters.industry}})

        if filters.region:
            conditions.append({"key": "region", "match": {"value": filters.region}})

        return {"must": conditions} if conditions else {}

    async def _vector_search(
        self,
        query: str,
        collection_name: str,
        filters: Dict[str, Any],
        limit: int,
    ) -> List[Dict[str, Any]]:
        """Perform vector similarity search"""
        # Embed query
        query_embedding = self.embed_model.get_query_embedding(query)

        # Search
        results = self.qdrant_client.search(
            collection_name=collection_name,
            query_vector=query_embedding,
            query_filter=filters,
            limit=limit,
        )

        return [
            {
                "content": r.payload.get("text", ""),
                "metadata": r.payload,
                "score": r.score,
                "search_type": "vector",
            }
            for r in results
        ]

    async def _keyword_search(
        self,
        query: str,
        collection_name: str,
        filters: Dict[str, Any],
        limit: int,
    ) -> List[Dict[str, Any]]:
        """
        Perform keyword search

        Note: This is simplified. In production, use Elasticsearch or
        Qdrant's payload-based filtering with full-text search.
        """
        # For now, return empty - would integrate with keyword index
        return []

    def _merge_results(
        self,
        vector_results: List[Dict[str, Any]],
        keyword_results: List[Dict[str, Any]],
        similarity_threshold: float,
    ) -> List[Dict[str, Any]]:
        """Merge and rerank vector and keyword results"""
        # Filter by similarity threshold
        vector_results = [r for r in vector_results if r["score"] >= similarity_threshold]

        # Combine (deduplicate by chunk_id)
        seen_chunks = set()
        merged = []

        for result in vector_results + keyword_results:
            chunk_id = result["metadata"].get("chunk_id")
            if chunk_id not in seen_chunks:
                seen_chunks.add(chunk_id)
                merged.append(result)

        # Sort by score
        merged.sort(key=lambda x: x["score"], reverse=True)

        return merged

    def _apply_safe_context_filter(
        self,
        results: List[Dict[str, Any]],
        filter_config: Optional[SafeContextFilter] = None,
    ) -> List[Dict[str, Any]]:
        """Apply safe context filtering to mitigate prompt injection"""
        if filter_config is None:
            filter_config = SafeContextFilter()

        filtered_results = []

        for result in results:
            content = result["content"]

            # Check length
            if len(content) > filter_config.max_chunk_length:
                content = content[: filter_config.max_chunk_length] + "..."

            # Check for blocked patterns
            blocked = False
            for pattern in filter_config.blocked_patterns:
                if re.search(pattern, content, re.IGNORECASE):
                    logger.warning(f"Blocked content with pattern: {pattern}")
                    blocked = True
                    break

            if blocked:
                continue

            # Remove code blocks if configured
            if filter_config.remove_code_blocks:
                content = re.sub(r"```[\s\S]*?```", "[CODE_REMOVED]", content)
                content = re.sub(r"`[^`]+`", "[CODE_REMOVED]", content)

            # Sanitize markdown
            if filter_config.sanitize_markdown:
                # Remove potentially dangerous markdown
                content = re.sub(r"!\[.*?\]\(.*?\)", "[IMAGE_REMOVED]", content)
                content = re.sub(r"\[.*?\]\(javascript:.*?\)", "[LINK_REMOVED]", content)

            result["content"] = content
            filtered_results.append(result)

        return filtered_results


# Global instance
_rag_manager: Optional[EnhancedRAGManager] = None


def get_rag_manager() -> EnhancedRAGManager:
    """Get global RAG manager instance"""
    global _rag_manager
    if _rag_manager is None:
        _rag_manager = EnhancedRAGManager()
    return _rag_manager
