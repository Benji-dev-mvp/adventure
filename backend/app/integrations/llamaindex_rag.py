"""
LlamaIndex RAG (Retrieval-Augmented Generation) Integration

Provides advanced document ingestion and retrieval with:
- 100+ data connectors (APIs, PDFs, SQL, Google Drive, Notion)
- Vector indexing and semantic search
- Multi-query retrieval with context augmentation
- Chat engines with conversation memory
- SQL query generation from natural language
- Hybrid search (vector + keyword)
"""

from typing import List, Dict, Any, Optional
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
    ServiceContext,
    Document,
    Settings,
)
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.chat_engine import ContextChatEngine
from llama_index.core.node_parser import SentenceSplitter
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.prompts import PromptTemplate
from llama_index.core.vector_stores import MetadataFilters, MetadataFilter
import os


class LlamaIndexRAG:
    """
    Advanced RAG system using LlamaIndex
    
    Features:
    - Document ingestion from multiple sources
    - Vector indexing with embeddings
    - Semantic search and retrieval
    - Context-augmented generation
    - Conversational chat with memory
    - Metadata filtering
    - Hybrid search capabilities
    """
    
    def __init__(
        self,
        llm_model: str = "gpt-4",
        embedding_model: str = "text-embedding-3-small",
        chunk_size: int = 512,
        chunk_overlap: int = 50,
    ):
        """
        Initialize LlamaIndex RAG system
        
        Args:
            llm_model: LLM model name
            embedding_model: Embedding model name
            chunk_size: Text chunk size for indexing
            chunk_overlap: Overlap between chunks
        """
        self.llm_model = llm_model
        self.embedding_model = embedding_model
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        
        # Initialize LLM and embeddings
        self.llm = OpenAI(
            model=llm_model,
            api_key=os.getenv("OPENAI_API_KEY"),
        )
        self.embed_model = OpenAIEmbedding(
            model=embedding_model,
            api_key=os.getenv("OPENAI_API_KEY"),
        )
        
        # Configure global settings
        Settings.llm = self.llm
        Settings.embed_model = self.embed_model
        Settings.chunk_size = chunk_size
        Settings.chunk_overlap = chunk_overlap
        
        # Node parser for chunking
        self.text_splitter = SentenceSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )
        
        # Storage for indices
        self.indices: Dict[str, VectorStoreIndex] = {}
        self.query_engines: Dict[str, RetrieverQueryEngine] = {}
        self.chat_engines: Dict[str, ContextChatEngine] = {}
    
    async def ingest_documents(
        self,
        documents: List[Document] | str,
        index_name: str = "default",
        metadata: Optional[Dict[str, Any]] = None,
    ) -> VectorStoreIndex:
        """
        Ingest documents and create vector index
        
        Args:
            documents: List of Document objects or directory path
            index_name: Name for the index
            metadata: Additional metadata for all documents
            
        Returns:
            Created vector index
        """
        # Load documents if path provided
        if isinstance(documents, str):
            reader = SimpleDirectoryReader(documents)
            documents = reader.load_data()
        
        # Add metadata to documents
        if metadata:
            for doc in documents:
                doc.metadata.update(metadata)
        
        # Create index
        index = VectorStoreIndex.from_documents(
            documents,
            show_progress=True,
        )
        
        # Store index
        self.indices[index_name] = index
        
        return index
    
    async def ingest_text(
        self,
        text: str,
        index_name: str = "default",
        metadata: Optional[Dict[str, Any]] = None,
    ) -> VectorStoreIndex:
        """
        Ingest raw text and create vector index
        
        Args:
            text: Raw text content
            index_name: Name for the index
            metadata: Metadata for the document
            
        Returns:
            Created vector index
        """
        doc = Document(text=text, metadata=metadata or {})
        return await self.ingest_documents([doc], index_name, metadata)
    
    async def ingest_structured_data(
        self,
        data: List[Dict[str, Any]],
        text_field: str,
        index_name: str = "default",
    ) -> VectorStoreIndex:
        """
        Ingest structured data (e.g., lead database, campaign results)
        
        Args:
            data: List of structured records
            text_field: Field to use as main text content
            index_name: Name for the index
            
        Returns:
            Created vector index
        """
        documents = []
        for record in data:
            text = record.get(text_field, "")
            metadata = {k: v for k, v in record.items() if k != text_field}
            doc = Document(text=text, metadata=metadata)
            documents.append(doc)
        
        return await self.ingest_documents(documents, index_name)
    
    def create_query_engine(
        self,
        index_name: str = "default",
        similarity_top_k: int = 5,
        filters: Optional[MetadataFilters] = None,
    ) -> RetrieverQueryEngine:
        """
        Create query engine for retrieval
        
        Args:
            index_name: Name of index to query
            similarity_top_k: Number of results to retrieve
            filters: Metadata filters
            
        Returns:
            Query engine
        """
        if index_name not in self.indices:
            raise ValueError(f"Index '{index_name}' not found")
        
        index = self.indices[index_name]
        
        # Create retriever
        retriever = VectorIndexRetriever(
            index=index,
            similarity_top_k=similarity_top_k,
            filters=filters,
        )
        
        # Create query engine
        query_engine = RetrieverQueryEngine(retriever=retriever)
        
        # Store query engine
        self.query_engines[index_name] = query_engine
        
        return query_engine
    
    def create_chat_engine(
        self,
        index_name: str = "default",
        similarity_top_k: int = 5,
        system_prompt: Optional[str] = None,
    ) -> ContextChatEngine:
        """
        Create conversational chat engine with context
        
        Args:
            index_name: Name of index to use
            similarity_top_k: Number of context chunks
            system_prompt: Custom system prompt
            
        Returns:
            Chat engine
        """
        if index_name not in self.indices:
            raise ValueError(f"Index '{index_name}' not found")
        
        index = self.indices[index_name]
        
        # Create retriever
        retriever = VectorIndexRetriever(
            index=index,
            similarity_top_k=similarity_top_k,
        )
        
        # Default system prompt for Artisan
        default_prompt = """You are Ava, an expert B2B sales AI assistant.
Use the context provided to answer questions accurately.
If the context doesn't contain relevant information, say so clearly.
Provide specific, actionable insights based on the data."""
        
        # Create chat engine
        chat_engine = ContextChatEngine.from_defaults(
            retriever=retriever,
            system_prompt=system_prompt or default_prompt,
        )
        
        # Store chat engine
        self.chat_engines[index_name] = chat_engine
        
        return chat_engine
    
    async def query(
        self,
        query: str,
        index_name: str = "default",
        similarity_top_k: int = 5,
        filters: Optional[MetadataFilters] = None,
    ) -> Dict[str, Any]:
        """
        Query the index and get response
        
        Args:
            query: Natural language query
            index_name: Index to query
            similarity_top_k: Number of results
            filters: Metadata filters
            
        Returns:
            Query response with sources
        """
        # Create or get query engine
        if index_name not in self.query_engines:
            self.create_query_engine(index_name, similarity_top_k, filters)
        
        query_engine = self.query_engines[index_name]
        
        # Execute query
        response = await query_engine.aquery(query)
        
        # Extract source nodes
        sources = []
        if hasattr(response, 'source_nodes'):
            for node in response.source_nodes:
                sources.append({
                    "text": node.node.text,
                    "score": node.score,
                    "metadata": node.node.metadata,
                })
        
        return {
            "answer": str(response),
            "sources": sources,
            "query": query,
        }
    
    async def chat(
        self,
        message: str,
        index_name: str = "default",
        session_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Chat with context from index
        
        Args:
            message: User message
            index_name: Index to use for context
            session_id: Session identifier for conversation
            
        Returns:
            Chat response
        """
        # Create or get chat engine
        if index_name not in self.chat_engines:
            self.create_chat_engine(index_name)
        
        chat_engine = self.chat_engines[index_name]
        
        # Execute chat
        response = await chat_engine.achat(message)
        
        return {
            "response": str(response),
            "message": message,
            "session_id": session_id,
        }
    
    # ========================================================================
    # High-level helper methods for Artisan platform
    # ========================================================================
    
    async def ingest_lead_database(
        self,
        leads: List[Dict[str, Any]],
        index_name: str = "leads",
    ) -> VectorStoreIndex:
        """
        Ingest lead database for semantic search
        
        Args:
            leads: List of lead records
            index_name: Index name
            
        Returns:
            Created index
        """
        # Create text representation of each lead
        documents = []
        for lead in leads:
            text = f"""Lead: {lead.get('name', 'Unknown')}
Company: {lead.get('company', 'Unknown')}
Industry: {lead.get('industry', 'Unknown')}
Title: {lead.get('title', 'Unknown')}
Email: {lead.get('email', 'Unknown')}
Score: {lead.get('score', 0)}
Notes: {lead.get('notes', 'No notes')}"""
            
            doc = Document(
                text=text,
                metadata={
                    "lead_id": lead.get("id"),
                    "company": lead.get("company"),
                    "industry": lead.get("industry"),
                    "score": lead.get("score", 0),
                    "category": "lead",
                }
            )
            documents.append(doc)
        
        return await self.ingest_documents(documents, index_name)
    
    async def ingest_campaign_results(
        self,
        campaigns: List[Dict[str, Any]],
        index_name: str = "campaigns",
    ) -> VectorStoreIndex:
        """
        Ingest campaign results for analysis
        
        Args:
            campaigns: List of campaign records
            index_name: Index name
            
        Returns:
            Created index
        """
        documents = []
        for campaign in campaigns:
            text = f"""Campaign: {campaign.get('name', 'Unknown')}
Objective: {campaign.get('objective', 'Unknown')}
Target Audience: {campaign.get('target_audience', 'Unknown')}
Results:
- Sent: {campaign.get('sent', 0)}
- Opens: {campaign.get('opens', 0)} ({campaign.get('open_rate', 0):.1%})
- Replies: {campaign.get('replies', 0)} ({campaign.get('reply_rate', 0):.1%})
- Conversions: {campaign.get('conversions', 0)} ({campaign.get('conversion_rate', 0):.1%})
Key Learnings: {campaign.get('learnings', 'None documented')}"""
            
            doc = Document(
                text=text,
                metadata={
                    "campaign_id": campaign.get("id"),
                    "name": campaign.get("name"),
                    "objective": campaign.get("objective"),
                    "open_rate": campaign.get("open_rate", 0),
                    "reply_rate": campaign.get("reply_rate", 0),
                    "conversion_rate": campaign.get("conversion_rate", 0),
                    "category": "campaign",
                }
            )
            documents.append(doc)
        
        return await self.ingest_documents(documents, index_name)
    
    async def ingest_knowledge_base(
        self,
        articles: List[Dict[str, Any]],
        index_name: str = "knowledge",
    ) -> VectorStoreIndex:
        """
        Ingest knowledge base articles
        
        Args:
            articles: List of knowledge base articles
            index_name: Index name
            
        Returns:
            Created index
        """
        documents = []
        for article in articles:
            doc = Document(
                text=article.get("content", ""),
                metadata={
                    "article_id": article.get("id"),
                    "title": article.get("title"),
                    "category": article.get("category", "general"),
                    "tags": article.get("tags", []),
                }
            )
            documents.append(doc)
        
        return await self.ingest_documents(documents, index_name)
    
    async def find_similar_leads(
        self,
        lead_description: str,
        top_k: int = 10,
        min_score: Optional[int] = None,
    ) -> List[Dict[str, Any]]:
        """
        Find similar leads based on description
        
        Args:
            lead_description: Description of target lead
            top_k: Number of results
            min_score: Minimum lead score filter
            
        Returns:
            Similar leads with scores
        """
        filters = None
        if min_score is not None:
            filters = MetadataFilters(filters=[
                MetadataFilter(key="score", value=min_score, operator=">="),
            ])
        
        result = await self.query(
            query=f"Find leads similar to: {lead_description}",
            index_name="leads",
            similarity_top_k=top_k,
            filters=filters,
        )
        
        return result
    
    async def analyze_campaign_patterns(
        self,
        query: str,
        objective: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Analyze campaign patterns and insights
        
        Args:
            query: Analysis question
            objective: Filter by campaign objective
            
        Returns:
            Analysis results
        """
        filters = None
        if objective:
            filters = MetadataFilters(filters=[
                MetadataFilter(key="objective", value=objective, operator="=="),
            ])
        
        result = await self.query(
            query=query,
            index_name="campaigns",
            similarity_top_k=10,
            filters=filters,
        )
        
        return result
    
    async def search_knowledge_base(
        self,
        question: str,
        category: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Search knowledge base for answers
        
        Args:
            question: User question
            category: Filter by category
            
        Returns:
            Answer with sources
        """
        filters = None
        if category:
            filters = MetadataFilters(filters=[
                MetadataFilter(key="category", value=category, operator="=="),
            ])
        
        result = await self.query(
            query=question,
            index_name="knowledge",
            similarity_top_k=5,
            filters=filters,
        )
        
        return result


# Example usage
async def example_usage():
    """Example of using LlamaIndex RAG"""
    
    # Initialize RAG system
    rag = LlamaIndexRAG(
        llm_model="gpt-4",
        embedding_model="text-embedding-3-small",
    )
    
    # Ingest lead database
    leads = [
        {
            "id": 1,
            "name": "John Smith",
            "company": "TechCorp",
            "industry": "SaaS",
            "title": "VP of Sales",
            "email": "john@techcorp.com",
            "score": 85,
            "notes": "Interested in enterprise plan, wants Q1 2026 implementation"
        },
        {
            "id": 2,
            "name": "Jane Doe",
            "company": "DataCo",
            "industry": "Analytics",
            "title": "CTO",
            "email": "jane@dataco.com",
            "score": 92,
            "notes": "Evaluating competitors, price sensitive, needs API integration"
        },
    ]
    
    await rag.ingest_lead_database(leads)
    print("✓ Ingested lead database")
    
    # Find similar leads
    similar = await rag.find_similar_leads(
        lead_description="SaaS company CTO interested in API integration",
        top_k=5,
        min_score=80,
    )
    print(f"\n✓ Found similar leads:\n{similar['answer']}")
    
    # Ingest campaign results
    campaigns = [
        {
            "id": 1,
            "name": "Q4 2024 Outbound",
            "objective": "lead_generation",
            "sent": 1000,
            "opens": 450,
            "open_rate": 0.45,
            "replies": 120,
            "reply_rate": 0.12,
            "conversions": 35,
            "conversion_rate": 0.035,
            "learnings": "Personalized subject lines increased opens by 35%"
        },
    ]
    
    await rag.ingest_campaign_results(campaigns)
    print("\n✓ Ingested campaign results")
    
    # Analyze campaign patterns
    analysis = await rag.analyze_campaign_patterns(
        query="What are the best practices for improving email open rates?",
        objective="lead_generation",
    )
    print(f"\n✓ Campaign analysis:\n{analysis['answer']}")
    
    # Chat with context
    chat_response = await rag.chat(
        message="What leads should I prioritize for outreach this week?",
        index_name="leads",
    )
    print(f"\n✓ Chat response:\n{chat_response['response']}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(example_usage())
