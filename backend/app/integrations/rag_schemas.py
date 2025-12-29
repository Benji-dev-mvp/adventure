"""
Enhanced RAG Document Schemas

Normalized document ingestion pipeline with metadata, permissions, and versioning
"""

from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class DocumentSource(str, Enum):
    """Source system for documents"""

    CRM = "crm"
    KNOWLEDGE_BASE = "knowledge_base"
    EMAIL = "email"
    MEETING_NOTES = "meeting_notes"
    SALES_COLLATERAL = "sales_collateral"
    PRODUCT_DOCS = "product_docs"
    CUSTOMER_DATA = "customer_data"
    WEB_CONTENT = "web_content"


class ObjectType(str, Enum):
    """Type of business object"""

    LEAD = "lead"
    CONTACT = "contact"
    ACCOUNT = "account"
    OPPORTUNITY = "opportunity"
    CAMPAIGN = "campaign"
    EMAIL_TEMPLATE = "email_template"
    PLAYBOOK = "playbook"
    CASE_STUDY = "case_study"
    PRODUCT = "product"
    DOCUMENT = "document"


class AccessLevel(str, Enum):
    """Access control levels"""

    PUBLIC = "public"
    INTERNAL = "internal"
    RESTRICTED = "restricted"
    CONFIDENTIAL = "confidential"


class NormalizedDocument(BaseModel):
    """
    Normalized document schema for RAG ingestion

    All documents ingested into RAG must conform to this schema
    for consistent metadata, permissions, and searchability
    """

    # Core identification
    document_id: str = Field(..., description="Unique document identifier")
    source: DocumentSource = Field(..., description="Source system")
    object_type: ObjectType = Field(..., description="Business object type")

    # Content
    title: str = Field(..., min_length=1, max_length=500)
    content: str = Field(..., min_length=1)
    summary: Optional[str] = Field(None, max_length=1000, description="Document summary")

    # Tenancy and permissions
    org_id: str = Field(..., description="Organization ID for tenant isolation")
    account_id: Optional[str] = Field(None, description="Account ID if account-specific")
    access_level: AccessLevel = AccessLevel.INTERNAL
    allowed_roles: List[str] = Field(default_factory=lambda: ["admin", "sales", "marketing"])

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    indexed_at: Optional[datetime] = None

    # Metadata for search and filtering
    metadata: Dict[str, Any] = Field(default_factory=dict)
    tags: List[str] = Field(default_factory=list, max_items=20)

    # Business context
    industry: Optional[str] = None
    region: Optional[str] = None
    product_lines: List[str] = Field(default_factory=list)
    deal_stage: Optional[str] = None

    # Version control
    version: int = Field(1, ge=1)
    index_version: str = Field("kb_v1", description="RAG index version")

    # Quality and relevance
    quality_score: Optional[float] = Field(None, ge=0.0, le=1.0)
    relevance_score: Optional[float] = Field(None, ge=0.0, le=1.0)

    class Config:
        json_schema_extra = {
            "example": {
                "document_id": "doc_abc123",
                "source": "knowledge_base",
                "object_type": "case_study",
                "title": "How Acme Corp Increased Pipeline by 300%",
                "content": "Acme Corp, a Fortune 500 manufacturing company...",
                "summary": "Case study showing 300% pipeline increase using multi-channel outbound",
                "org_id": "org_12345",
                "access_level": "internal",
                "tags": ["enterprise", "manufacturing", "success_story"],
                "industry": "manufacturing",
                "region": "north_america",
                "product_lines": ["enterprise_plan"],
            }
        }


class ChunkingStrategy(str, Enum):
    """Document chunking strategies"""

    FIXED_SIZE = "fixed_size"
    SEMANTIC = "semantic"
    PARAGRAPH = "paragraph"
    SENTENCE = "sentence"


class DocumentChunk(BaseModel):
    """
    Individual chunk for vector indexing

    Documents are split into chunks for embedding and retrieval
    """

    chunk_id: str = Field(..., description="Unique chunk identifier")
    document_id: str = Field(..., description="Parent document ID")

    content: str = Field(..., min_length=1)
    chunk_index: int = Field(..., ge=0, description="Position in document")

    # Inherit key metadata from parent document
    org_id: str
    source: DocumentSource
    object_type: ObjectType
    access_level: AccessLevel

    # Chunking metadata
    chunking_strategy: ChunkingStrategy
    token_count: Optional[int] = None
    char_count: Optional[int] = None

    # Context for better retrieval
    previous_chunk_id: Optional[str] = None
    next_chunk_id: Optional[str] = None
    section_title: Optional[str] = None

    # Search metadata
    metadata: Dict[str, Any] = Field(default_factory=dict)

    class Config:
        json_schema_extra = {
            "example": {
                "chunk_id": "chunk_abc123_0",
                "document_id": "doc_abc123",
                "content": "Acme Corp implemented a 5-touch email sequence...",
                "chunk_index": 0,
                "org_id": "org_12345",
                "source": "knowledge_base",
                "object_type": "case_study",
                "access_level": "internal",
                "chunking_strategy": "semantic",
                "token_count": 150,
            }
        }


class IngestionRequest(BaseModel):
    """Request to ingest documents into RAG"""

    documents: List[NormalizedDocument] = Field(..., min_items=1, max_items=100)
    index_version: str = Field("kb_v1", description="Target index version")
    chunking_strategy: ChunkingStrategy = ChunkingStrategy.SEMANTIC
    chunk_size: int = Field(512, ge=100, le=2000, description="Target chunk size in tokens")
    chunk_overlap: int = Field(50, ge=0, le=500, description="Overlap between chunks")
    upsert: bool = Field(False, description="Update if document already exists")


class IngestionResult(BaseModel):
    """Result of document ingestion"""

    job_id: str
    documents_processed: int
    chunks_created: int
    failed_documents: List[str] = Field(default_factory=list)
    index_version: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class SearchFilter(BaseModel):
    """Filters for RAG search"""

    org_id: str = Field(..., description="Required for tenant isolation")
    source: Optional[DocumentSource] = None
    object_type: Optional[ObjectType] = None
    access_level: Optional[AccessLevel] = None
    tags: List[str] = Field(default_factory=list)
    industry: Optional[str] = None
    region: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None


class SafeContextFilter(BaseModel):
    """Filters to mitigate prompt injection from RAG content"""

    max_chunk_length: int = Field(1000, description="Max characters per chunk")
    blocked_patterns: List[str] = Field(
        default_factory=lambda: [
            r"ignore (previous|above) instructions",
            r"disregard .* context",
            r"<script",
            r"javascript:",
        ]
    )
    remove_code_blocks: bool = True
    sanitize_markdown: bool = True
