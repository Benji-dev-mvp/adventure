"""
Unified AI Orchestration Layer

Combines all advanced AI frameworks into a cohesive system:
- LangChain: Agent orchestration and tool management
- Pydantic AI: Type-safe structured outputs
- Mem0: Persistent memory across sessions
- LlamaIndex: RAG and document retrieval

Provides high-level orchestration for complex AI workflows.
"""

import json
from typing import Any, Dict, List, Optional

from ..integrations.langchain_agent import LangChainOrchestrator
from ..integrations.llamaindex_rag import LlamaIndexRAG
from ..integrations.mem0_memory import Mem0MemoryManager
from ..integrations.pydantic_agent import (
    PydanticAIAgent,
    SalesContext,
)


class UnifiedAIOrchestrator:
    """
    Unified orchestrator combining all AI frameworks

    Orchestrates complex workflows by:
    1. Using Mem0 to recall relevant context
    2. Using LlamaIndex to retrieve documents/data
    3. Using LangChain for agent tool execution
    4. Using Pydantic AI for type-safe structured outputs
    5. Storing results back to Mem0 for future use
    """

    def __init__(
        self,
        model_provider: str = "openai",
        model_name: str = "gpt-4",
        temperature: float = 0.7,
        use_hosted_mem0: bool = False,
    ):
        """
        Initialize unified orchestrator

        Args:
            model_provider: openai or anthropic
            model_name: Model name
            temperature: Generation temperature
            use_hosted_mem0: Use Mem0 hosted service
        """
        self.model_provider = model_provider
        self.model_name = model_name
        self.temperature = temperature

        # Initialize all frameworks
        self.langchain = LangChainOrchestrator(
            model_provider=model_provider,
            model_name=model_name,
            temperature=temperature,
        )

        self.pydantic_ai = PydanticAIAgent(
            model_provider=model_provider,
            model_name=model_name,
            temperature=temperature,
        )

        self.memory = Mem0MemoryManager(hosted=use_hosted_mem0)

        self.rag = LlamaIndexRAG(
            llm_model=model_name,
            embedding_model="text-embedding-3-small",
        )

    # ========================================================================
    # High-Level Orchestrated Workflows
    # ========================================================================

    async def intelligent_lead_scoring(
        self,
        user_id: str,
        lead_data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Score a lead using memory context and type-safe output

        Workflow:
        1. Recall past interactions with this lead (Mem0)
        2. Find similar leads for comparison (LlamaIndex)
        3. Score lead with type-safe output (Pydantic AI)
        4. Remember the scoring decision (Mem0)

        Args:
            user_id: User identifier
            lead_data: Lead information

        Returns:
            Type-safe lead score with context
        """
        company_name = lead_data.get("company", "Unknown")

        # Step 1: Recall past interactions
        past_interactions = await self.memory.recall_lead_history(
            user_id=user_id,
            lead_name=lead_data.get("name", ""),
            limit=5,
        )

        # Step 2: Find similar leads
        similar_leads = await self.rag.find_similar_leads(
            lead_description=f"{company_name} in {lead_data.get('industry', 'Unknown')} industry",
            top_k=5,
            min_score=70,
        )

        # Step 3: Score lead with context
        context = SalesContext(
            user_id=user_id,
            company_name=company_name,
            industry=lead_data.get("industry"),
            lead_database={company_name: lead_data},
        )

        # Enhance lead data with context
        enhanced_lead_data = {
            **lead_data,
            "past_interactions": len(past_interactions),
            "similar_high_value_leads": len(similar_leads.get("sources", [])),
        }

        lead_score = await self.pydantic_ai.score_lead(
            lead_data=enhanced_lead_data,
            context=context,
        )

        # Step 4: Remember scoring decision
        await self.memory.add_memory(
            messages=f"Scored {lead_data.get('name')} at {company_name}: {lead_score.score}/100. Factors: {', '.join(lead_score.factors)}. Recommendation: {lead_score.recommendation}",
            user_id=user_id,
            agent_id="ava",
            app_id="artisan",
            metadata={
                "category": "lead_scoring",
                "lead_name": lead_data.get("name"),
                "company": company_name,
                "score": lead_score.score,
            },
        )

        return {
            "lead_score": lead_score.dict(),
            "past_interactions": len(past_interactions),
            "similar_leads_found": len(similar_leads.get("sources", [])),
            "context_used": True,
        }

    async def personalized_email_generation(
        self,
        user_id: str,
        lead_data: Dict[str, Any],
        campaign_objective: str,
        tone: str = "professional",
    ) -> Dict[str, Any]:
        """
        Generate highly personalized email using all context

        Workflow:
        1. Recall user's email preferences (Mem0)
        2. Recall past interactions with lead (Mem0)
        3. Retrieve similar successful campaigns (LlamaIndex)
        4. Generate email with type-safe output (Pydantic AI)
        5. Remember generated email (Mem0)

        Args:
            user_id: User identifier
            lead_data: Lead information
            campaign_objective: Campaign goal
            tone: Email tone

        Returns:
            Type-safe email with context
        """
        # Step 1: Recall user preferences
        preferences = await self.memory.recall_user_preferences(
            user_id=user_id,
            preference_type="email_tone",
        )

        # Apply preference if found
        if preferences and not tone:
            tone = preferences[0].get("metadata", {}).get("preference_value", "professional")

        # Step 2: Recall lead interactions
        interactions = await self.memory.recall_lead_history(
            user_id=user_id,
            lead_name=lead_data.get("name", ""),
            limit=3,
        )

        # Step 3: Retrieve successful campaigns
        campaign_insights = await self.rag.analyze_campaign_patterns(
            query=f"Best practices for {campaign_objective} emails",
            objective=campaign_objective,
        )

        # Step 4: Generate email
        context = SalesContext(
            user_id=user_id,
            company_name=lead_data.get("company"),
            industry=lead_data.get("industry"),
        )

        email = await self.pydantic_ai.generate_email(
            lead_data=lead_data,
            campaign_objective=campaign_objective,
            tone=tone,
            context=context,
        )

        # Step 5: Remember generation
        await self.memory.add_memory(
            messages=f"Generated {tone} email for {lead_data.get('name')} with objective: {campaign_objective}. Subject: {email.subject}",
            user_id=user_id,
            agent_id="ava",
            app_id="artisan",
            metadata={
                "category": "email_generation",
                "lead_name": lead_data.get("name"),
                "company": lead_data.get("company"),
                "tone": tone,
                "personalization_score": email.personalization_score,
            },
        )

        return {
            "email": email.dict(),
            "preferences_applied": len(preferences) > 0,
            "past_interactions_considered": len(interactions),
            "campaign_insights_used": len(campaign_insights.get("sources", [])),
        }

    async def strategic_campaign_planning(
        self,
        user_id: str,
        objective: str,
        target_audience: str,
        budget_range: str,
    ) -> Dict[str, Any]:
        """
        Create data-driven campaign strategy

        Workflow:
        1. Recall past campaign learnings (Mem0)
        2. Analyze historical campaign data (LlamaIndex)
        3. Generate strategy with type-safe output (Pydantic AI)
        4. Get tactical recommendations (LangChain agent)
        5. Remember strategy (Mem0)

        Args:
            user_id: User identifier
            objective: Campaign objective
            target_audience: Target description
            budget_range: Budget range

        Returns:
            Comprehensive campaign strategy
        """
        # Step 1: Recall learnings
        learnings = await self.memory.recall_campaign_learnings(
            user_id=user_id,
            campaign_type=objective,
            limit=5,
        )

        # Step 2: Analyze historical data
        historical_analysis = await self.rag.analyze_campaign_patterns(
            query=f"Campaign performance patterns for {objective} targeting {target_audience}",
            objective=objective,
        )

        # Step 3: Generate strategy
        context = SalesContext(
            user_id=user_id,
            historical_campaigns=[{"name": "Past Campaign", "roi": 250.0, "conversion": 0.035}],
        )

        strategy = await self.pydantic_ai.create_campaign_strategy(
            objective=objective,
            target_audience=target_audience,
            budget_range=budget_range,
            context=context,
        )

        # Step 4: Get tactical recommendations
        tactical_query = f"""Based on this campaign strategy:
Objective: {objective}
Target: {target_audience}
Budget: {budget_range}
Segments: {strategy.target_segments}
Channels: {strategy.channels}

Provide 5 specific tactical recommendations for execution."""

        tactical_recommendations = await self.langchain.execute(
            query=tactical_query,
            user_id=user_id,
        )

        # Step 5: Remember strategy
        await self.memory.remember_campaign_insight(
            user_id=user_id,
            campaign_name=f"{objective} - {target_audience}",
            insight=f"Created strategy with {strategy.sequence_steps} steps, estimated {strategy.estimated_roi}% ROI",
            metrics={
                "estimated_roi": strategy.estimated_roi,
                "timeline_days": strategy.timeline_days,
                "budget_estimate": strategy.budget_estimate,
            },
        )

        return {
            "strategy": strategy.dict(),
            "tactical_recommendations": tactical_recommendations.get("output", ""),
            "past_learnings_incorporated": len(learnings),
            "historical_data_analyzed": len(historical_analysis.get("sources", [])),
        }

    async def conversational_assistance(
        self,
        user_id: str,
        message: str,
        conversation_context: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Provide conversational assistance with full context

        Workflow:
        1. Get relevant memory context (Mem0)
        2. Search knowledge base if needed (LlamaIndex)
        3. Execute with agent tools (LangChain)
        4. Remember conversation (Mem0)

        Args:
            user_id: User identifier
            message: User message
            conversation_context: Optional context

        Returns:
            Contextual response
        """
        # Step 1: Get memory context
        memory_context = await self.memory.get_context_for_conversation(
            user_id=user_id,
            conversation_topic=message,
            limit=5,
        )

        # Step 2: Search knowledge base
        kb_results = await self.rag.search_knowledge_base(
            question=message,
            category=None,
        )

        # Step 3: Execute with agent
        enhanced_message = f"""User: {message}

Relevant Context from Memory:
{memory_context}

Knowledge Base Information:
{kb_results.get('answer', 'No KB articles found')}

Please provide a helpful, context-aware response."""

        response = await self.langchain.execute(
            query=enhanced_message,
            user_id=user_id,
        )

        # Step 4: Remember conversation
        await self.memory.add_memory(
            messages=[
                {"role": "user", "content": message},
                {"role": "assistant", "content": response.get("output", "")},
            ],
            user_id=user_id,
            agent_id="ava",
            app_id="artisan",
            metadata={"category": "conversation"},
        )

        return {
            "response": response.get("output", ""),
            "memory_context_used": len(memory_context) > 0,
            "knowledge_base_used": len(kb_results.get("sources", [])) > 0,
            "intermediate_steps": response.get("intermediate_steps", []),
        }

    async def batch_lead_analysis(
        self,
        user_id: str,
        leads: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """
        Analyze multiple leads in batch with intelligent prioritization

        Args:
            user_id: User identifier
            leads: List of leads to analyze

        Returns:
            Prioritized leads with scores and recommendations
        """
        results = []

        # First, ingest leads into RAG for similarity search
        await self.rag.ingest_lead_database(leads, index_name=f"leads_{user_id}")

        for lead in leads:
            try:
                score_result = await self.intelligent_lead_scoring(
                    user_id=user_id,
                    lead_data=lead,
                )
                results.append(
                    {
                        "lead": lead,
                        "score": score_result["lead_score"]["score"],
                        "recommendation": score_result["lead_score"]["recommendation"],
                        "confidence": score_result["lead_score"]["confidence"],
                    }
                )
            except Exception as e:
                results.append(
                    {
                        "lead": lead,
                        "error": str(e),
                        "score": 0,
                    }
                )

        # Sort by score descending
        results.sort(key=lambda x: x.get("score", 0), reverse=True)

        return results

    def reset_all_memory(self):
        """Reset all conversation memory"""
        self.langchain.reset_memory()

    async def get_system_status(self) -> Dict[str, Any]:
        """Get status of all integrated systems"""
        return {
            "langchain": {"initialized": self.langchain is not None},
            "pydantic_ai": {"initialized": self.pydantic_ai is not None},
            "mem0": {"initialized": self.memory is not None},
            "llamaindex": {"initialized": self.rag is not None},
            "model_provider": self.model_provider,
            "model_name": self.model_name,
        }


# Example usage
async def example_usage():
    """Example of using unified orchestrator"""

    # Initialize orchestrator
    orchestrator = UnifiedAIOrchestrator(
        model_provider="openai",
        model_name="gpt-4",
        temperature=0.7,
        use_hosted_mem0=False,
    )

    user_id = "user_123"

    # Example 1: Intelligent lead scoring
    lead = {
        "id": 1,
        "name": "John Smith",
        "company": "TechCorp",
        "industry": "SaaS",
        "title": "VP of Sales",
        "email": "john@techcorp.com",
        "engagement": "high",
    }

    score_result = await orchestrator.intelligent_lead_scoring(
        user_id=user_id,
        lead_data=lead,
    )
    print(f"Lead Score: {score_result['lead_score']['score']}/100")
    print(f"Recommendation: {score_result['lead_score']['recommendation']}")

    # Example 2: Personalized email generation
    email_result = await orchestrator.personalized_email_generation(
        user_id=user_id,
        lead_data=lead,
        campaign_objective="Book demo meeting",
        tone="professional",
    )
    print(f"\nSubject: {email_result['email']['subject']}")
    print(f"Personalization: {email_result['email']['personalization_score']:.2f}")

    # Example 3: Strategic campaign planning
    strategy_result = await orchestrator.strategic_campaign_planning(
        user_id=user_id,
        objective="Generate qualified leads",
        target_audience="SaaS companies 100-1000 employees",
        budget_range="$10,000-$20,000",
    )
    print(f"\nCampaign Strategy:")
    print(f"Estimated ROI: {strategy_result['strategy']['estimated_roi']:.1f}%")
    print(f"Timeline: {strategy_result['strategy']['timeline_days']} days")

    # Example 4: Conversational assistance
    conversation_result = await orchestrator.conversational_assistance(
        user_id=user_id,
        message="What are the best practices for following up with leads who haven't responded?",
    )
    print(f"\nAssistant Response:\n{conversation_result['response']}")

    # Check system status
    status = await orchestrator.get_system_status()
    print(f"\nSystem Status:\n{json.dumps(status, indent=2)}")


if __name__ == "__main__":
    import asyncio

    asyncio.run(example_usage())
