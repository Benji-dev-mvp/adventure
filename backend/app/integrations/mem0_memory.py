"""
Mem0 Advanced Memory Layer Integration

Provides persistent, semantic memory for AI agents with:
- User-partitioned memory (by user_id, agent_id, app_id)
- Semantic search with vector similarity
- Cross-session memory retention
- Memory decay and importance weighting
- Redis/Qdrant backing for persistence
"""

from typing import List, Dict, Any, Optional
from mem0 import Memory, MemoryClient
from datetime import datetime
import os
import json


class Mem0MemoryManager:
    """
    Advanced memory management using Mem0
    
    Features:
    - Persistent memory across sessions
    - User/agent/app partitioning
    - Semantic search with embeddings
    - Memory importance scoring
    - Automatic memory decay
    - Integration with Redis/Qdrant
    """
    
    def __init__(
        self,
        hosted: bool = False,
        config: Optional[Dict[str, Any]] = None,
    ):
        """
        Initialize Mem0 memory manager
        
        Args:
            hosted: Use Mem0 hosted service or self-hosted
            config: Configuration for self-hosted (Redis, Qdrant, embeddings)
        """
        self.hosted = hosted
        
        if hosted:
            # Use Mem0 hosted platform
            api_key = os.getenv("MEM0_API_KEY")
            if not api_key:
                raise ValueError("MEM0_API_KEY required for hosted service")
            self.client = MemoryClient(api_key=api_key)
        else:
            # Use self-hosted Mem0
            default_config = {
                "vector_store": {
                    "provider": "qdrant",
                    "config": {
                        "host": os.getenv("QDRANT_HOST", "localhost"),
                        "port": int(os.getenv("QDRANT_PORT", "6333")),
                        "collection_name": "artisan_memories",
                    }
                },
                "embedder": {
                    "provider": "openai",
                    "config": {
                        "api_key": os.getenv("OPENAI_API_KEY"),
                        "model": "text-embedding-3-small",
                    }
                },
                "llm": {
                    "provider": "openai",
                    "config": {
                        "api_key": os.getenv("OPENAI_API_KEY"),
                        "model": "gpt-4",
                    }
                },
                "history_db": {
                    "provider": "redis",
                    "config": {
                        "host": os.getenv("REDIS_HOST", "localhost"),
                        "port": int(os.getenv("REDIS_PORT", "6379")),
                    }
                }
            }
            final_config = {**default_config, **(config or {})}
            self.client = Memory.from_config(final_config)
    
    async def add_memory(
        self,
        messages: str | List[Dict[str, str]],
        user_id: Optional[str] = None,
        agent_id: Optional[str] = None,
        app_id: Optional[str] = None,
        run_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Add memory from conversation or interaction
        
        Args:
            messages: Single message string or list of message dicts
            user_id: User identifier for memory partitioning
            agent_id: Agent identifier (e.g., "ava")
            app_id: Application identifier (e.g., "artisan")
            run_id: Session/run identifier
            metadata: Additional metadata (tags, importance, etc.)
            
        Returns:
            Memory addition result with IDs
        """
        # Prepare messages
        if isinstance(messages, str):
            messages = [{"role": "user", "content": messages}]
        
        # Add timestamp if not present
        if metadata is None:
            metadata = {}
        metadata["timestamp"] = metadata.get("timestamp", datetime.utcnow().isoformat())
        
        result = self.client.add(
            messages=messages,
            user_id=user_id,
            agent_id=agent_id,
            app_id=app_id,
            run_id=run_id,
            metadata=metadata,
        )
        
        return result
    
    async def search_memory(
        self,
        query: str,
        user_id: Optional[str] = None,
        agent_id: Optional[str] = None,
        app_id: Optional[str] = None,
        run_id: Optional[str] = None,
        limit: int = 10,
        threshold: float = 0.7,
        filters: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Search memories with semantic similarity
        
        Args:
            query: Search query
            user_id: Filter by user
            agent_id: Filter by agent
            app_id: Filter by application
            run_id: Filter by session/run
            limit: Maximum results
            threshold: Similarity threshold (0.0-1.0)
            filters: Additional metadata filters
            
        Returns:
            List of matching memories with scores
        """
        results = self.client.search(
            query=query,
            user_id=user_id,
            agent_id=agent_id,
            app_id=app_id,
            run_id=run_id,
            limit=limit,
            threshold=threshold,
            filters=filters,
        )
        
        return results
    
    async def get_all_memories(
        self,
        user_id: Optional[str] = None,
        agent_id: Optional[str] = None,
        app_id: Optional[str] = None,
        run_id: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Get all memories for a partition
        
        Args:
            user_id: Filter by user
            agent_id: Filter by agent
            app_id: Filter by application
            run_id: Filter by session/run
            
        Returns:
            List of all memories in partition
        """
        memories = self.client.get_all(
            user_id=user_id,
            agent_id=agent_id,
            app_id=app_id,
            run_id=run_id,
        )
        
        return memories
    
    async def get_memory(
        self,
        memory_id: str,
    ) -> Dict[str, Any]:
        """
        Get specific memory by ID
        
        Args:
            memory_id: Memory identifier
            
        Returns:
            Memory details
        """
        memory = self.client.get(memory_id=memory_id)
        return memory
    
    async def update_memory(
        self,
        memory_id: str,
        data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Update existing memory
        
        Args:
            memory_id: Memory identifier
            data: Updated memory data
            
        Returns:
            Update result
        """
        result = self.client.update(
            memory_id=memory_id,
            data=data,
        )
        return result
    
    async def delete_memory(
        self,
        memory_id: str,
    ) -> Dict[str, Any]:
        """
        Delete specific memory
        
        Args:
            memory_id: Memory identifier
            
        Returns:
            Deletion result
        """
        result = self.client.delete(memory_id=memory_id)
        return result
    
    async def delete_all_memories(
        self,
        user_id: Optional[str] = None,
        agent_id: Optional[str] = None,
        app_id: Optional[str] = None,
        run_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Delete all memories in a partition
        
        Args:
            user_id: Filter by user
            agent_id: Filter by agent
            app_id: Filter by application
            run_id: Filter by session/run
            
        Returns:
            Deletion result
        """
        result = self.client.delete_all(
            user_id=user_id,
            agent_id=agent_id,
            app_id=app_id,
            run_id=run_id,
        )
        return result
    
    # ========================================================================
    # High-level helper methods for Artisan platform
    # ========================================================================
    
    async def remember_lead_interaction(
        self,
        user_id: str,
        lead_name: str,
        lead_company: str,
        interaction_type: str,
        interaction_content: str,
        sentiment: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Remember a lead interaction
        
        Args:
            user_id: Artisan user ID
            lead_name: Lead's name
            lead_company: Lead's company
            interaction_type: email, call, linkedin, meeting
            interaction_content: Content of interaction
            sentiment: positive, negative, neutral
            metadata: Additional context
            
        Returns:
            Memory creation result
        """
        memory_text = f"""Lead Interaction with {lead_name} from {lead_company}:
Type: {interaction_type}
Content: {interaction_content}
Sentiment: {sentiment or 'unknown'}"""
        
        meta = metadata or {}
        meta.update({
            "lead_name": lead_name,
            "lead_company": lead_company,
            "interaction_type": interaction_type,
            "sentiment": sentiment,
            "category": "lead_interaction",
        })
        
        return await self.add_memory(
            messages=memory_text,
            user_id=user_id,
            agent_id="ava",
            app_id="artisan",
            metadata=meta,
        )
    
    async def remember_campaign_insight(
        self,
        user_id: str,
        campaign_name: str,
        insight: str,
        metrics: Dict[str, float],
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Remember campaign performance insights
        
        Args:
            user_id: Artisan user ID
            campaign_name: Campaign name
            insight: Key insight or learning
            metrics: Performance metrics
            metadata: Additional context
            
        Returns:
            Memory creation result
        """
        memory_text = f"""Campaign Insight for '{campaign_name}':
{insight}

Metrics:
{json.dumps(metrics, indent=2)}"""
        
        meta = metadata or {}
        meta.update({
            "campaign_name": campaign_name,
            "metrics": metrics,
            "category": "campaign_insight",
        })
        
        return await self.add_memory(
            messages=memory_text,
            user_id=user_id,
            agent_id="ava",
            app_id="artisan",
            metadata=meta,
        )
    
    async def remember_user_preference(
        self,
        user_id: str,
        preference_type: str,
        preference_value: Any,
        context: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Remember user preferences and patterns
        
        Args:
            user_id: Artisan user ID
            preference_type: Type of preference (tone, channel, timing, etc.)
            preference_value: Preference value
            context: Additional context
            
        Returns:
            Memory creation result
        """
        memory_text = f"""User Preference:
Type: {preference_type}
Value: {preference_value}
Context: {context or 'General preference'}"""
        
        return await self.add_memory(
            messages=memory_text,
            user_id=user_id,
            agent_id="ava",
            app_id="artisan",
            metadata={
                "preference_type": preference_type,
                "preference_value": preference_value,
                "category": "user_preference",
            },
        )
    
    async def recall_lead_history(
        self,
        user_id: str,
        lead_name: str,
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        """
        Recall all interactions with a specific lead
        
        Args:
            user_id: Artisan user ID
            lead_name: Lead's name to search for
            limit: Maximum results
            
        Returns:
            List of lead interaction memories
        """
        results = await self.search_memory(
            query=f"interactions with {lead_name}",
            user_id=user_id,
            agent_id="ava",
            app_id="artisan",
            limit=limit,
            filters={"category": "lead_interaction"},
        )
        return results
    
    async def recall_campaign_learnings(
        self,
        user_id: str,
        campaign_type: str,
        limit: int = 5,
    ) -> List[Dict[str, Any]]:
        """
        Recall learnings from similar past campaigns
        
        Args:
            user_id: Artisan user ID
            campaign_type: Type of campaign (outbound, nurture, reengagement)
            limit: Maximum results
            
        Returns:
            List of relevant campaign insights
        """
        results = await self.search_memory(
            query=f"{campaign_type} campaign insights and learnings",
            user_id=user_id,
            agent_id="ava",
            app_id="artisan",
            limit=limit,
            filters={"category": "campaign_insight"},
        )
        return results
    
    async def recall_user_preferences(
        self,
        user_id: str,
        preference_type: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Recall user preferences
        
        Args:
            user_id: Artisan user ID
            preference_type: Specific preference type to filter
            
        Returns:
            List of user preference memories
        """
        filters = {"category": "user_preference"}
        if preference_type:
            filters["preference_type"] = preference_type
        
        results = await self.search_memory(
            query="user preferences",
            user_id=user_id,
            agent_id="ava",
            app_id="artisan",
            limit=20,
            filters=filters,
        )
        return results
    
    async def get_context_for_conversation(
        self,
        user_id: str,
        conversation_topic: str,
        limit: int = 5,
    ) -> str:
        """
        Get relevant context for a conversation
        
        Args:
            user_id: Artisan user ID
            conversation_topic: Topic or query to get context for
            limit: Maximum memories to retrieve
            
        Returns:
            Formatted context string
        """
        memories = await self.search_memory(
            query=conversation_topic,
            user_id=user_id,
            agent_id="ava",
            app_id="artisan",
            limit=limit,
        )
        
        if not memories:
            return "No relevant context found."
        
        context_parts = [f"Relevant context for '{conversation_topic}':\n"]
        for i, memory in enumerate(memories, 1):
            context_parts.append(f"{i}. {memory.get('memory', 'N/A')} (score: {memory.get('score', 0):.2f})")
        
        return "\n".join(context_parts)


# Example usage
async def example_usage():
    """Example of using Mem0 memory manager"""
    
    # Initialize memory manager (self-hosted)
    memory = Mem0MemoryManager(hosted=False)
    
    user_id = "user_123"
    
    # Remember lead interactions
    await memory.remember_lead_interaction(
        user_id=user_id,
        lead_name="John Smith",
        lead_company="TechCorp",
        interaction_type="email",
        interaction_content="Discussed pricing and timeline for enterprise plan. Interested in Q1 2026 rollout.",
        sentiment="positive",
        metadata={"importance": "high"},
    )
    
    # Remember campaign insights
    await memory.remember_campaign_insight(
        user_id=user_id,
        campaign_name="Q4 2024 Outbound",
        insight="Personalized subject lines with company name increased open rates by 35%",
        metrics={"open_rate": 0.45, "reply_rate": 0.12, "conversion_rate": 0.035},
    )
    
    # Remember user preferences
    await memory.remember_user_preference(
        user_id=user_id,
        preference_type="email_tone",
        preference_value="professional with light humor",
        context="User feedback: emails feel too formal",
    )
    
    # Recall lead history
    lead_history = await memory.recall_lead_history(
        user_id=user_id,
        lead_name="John Smith",
        limit=10,
    )
    print(f"Found {len(lead_history)} interactions with John Smith")
    
    # Recall campaign learnings
    learnings = await memory.recall_campaign_learnings(
        user_id=user_id,
        campaign_type="outbound",
        limit=5,
    )
    print(f"Found {len(learnings)} relevant campaign insights")
    
    # Get context for conversation
    context = await memory.get_context_for_conversation(
        user_id=user_id,
        conversation_topic="best practices for TechCorp outreach",
        limit=5,
    )
    print(f"Context:\n{context}")
    
    # Search across all memories
    results = await memory.search_memory(
        query="pricing discussions",
        user_id=user_id,
        agent_id="ava",
        limit=10,
        threshold=0.7,
    )
    print(f"Found {len(results)} memories about pricing")


if __name__ == "__main__":
    import asyncio
    asyncio.run(example_usage())
