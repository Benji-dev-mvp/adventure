"""
AI Agent Orchestration Framework.
Multi-step tool execution, context memory, prompt versioning, and cost tracking.
"""

import json
import logging
from datetime import datetime
from enum import Enum
from typing import Any, Callable, Dict, List, Optional

from pydantic import BaseModel

from app.core.ai_provider import AIProvider
from app.core.cache import cache

logger = logging.getLogger(__name__)


class ToolType(str, Enum):
    RESEARCH = "research"
    DRAFT = "draft"
    REVIEW = "review"
    SEND = "send"
    SCORE = "score"
    ENRICH = "enrich"


class AgentStep(BaseModel):
    """Single step in multi-step workflow"""

    id: str
    name: str
    tool_type: ToolType
    input: Dict[str, Any]
    output: Optional[Dict[str, Any]] = None
    status: str = "pending"  # pending, running, completed, failed
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error: Optional[str] = None


class AgentWorkflow(BaseModel):
    """Multi-step agent workflow"""

    workflow_id: str
    name: str
    steps: List[AgentStep]
    context: Dict[str, Any] = {}
    status: str = "pending"
    created_at: datetime = datetime.now()
    completed_at: Optional[datetime] = None


class ContextMemory:
    """
    Store conversation and workflow context in Redis.
    Maintains state across agent interactions.
    """

    @staticmethod
    def save_context(session_id: str, context: Dict[str, Any], ttl: int = 3600):
        """Save context to Redis with TTL"""
        key = f"agent:context:{session_id}"
        cache.set(key, context, ttl=ttl)
        logger.info(f"Context saved for session {session_id}")

    @staticmethod
    def get_context(session_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve context from Redis"""
        key = f"agent:context:{session_id}"
        return cache.get(key)

    @staticmethod
    def append_to_history(session_id: str, message: Dict[str, Any]):
        """Append message to conversation history"""
        context = ContextMemory.get_context(session_id) or {"history": []}

        if "history" not in context:
            context["history"] = []

        context["history"].append({**message, "timestamp": datetime.now().isoformat()})

        # Keep last 50 messages
        context["history"] = context["history"][-50:]

        ContextMemory.save_context(session_id, context)

    @staticmethod
    def get_history(session_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get conversation history"""
        context = ContextMemory.get_context(session_id)
        if not context or "history" not in context:
            return []
        return context["history"][-limit:]


class PromptTemplate:
    """
    Versioned prompt templates for A/B testing.
    """

    TEMPLATES = {
        "email_draft_v1": {
            "version": "1.0",
            "template": """Draft a professional email for {lead_name} at {company}.
                
                Context: {context}
                Goal: {goal}
                Tone: {tone}
                
                Include personalization based on their industry: {industry}
                """,
            "metadata": {"created_at": "2024-01-01", "performance_score": 0.75},
        },
        "email_draft_v2": {
            "version": "2.0",
            "template": """Create an engaging email to {lead_name}, {title} at {company}.
                
                Background research: {context}
                Our objective: {goal}
                Communication style: {tone}
                
                Their industry ({industry}) insights:
                - {industry_insight_1}
                - {industry_insight_2}
                
                Make it conversational and value-focused.
                """,
            "metadata": {"created_at": "2024-06-01", "performance_score": 0.82},
        },
        "lead_research_v1": {
            "version": "1.0",
            "template": """Research the following lead:
                
                Name: {name}
                Company: {company}
                Title: {title}
                Industry: {industry}
                
                Find:
                1. Recent company news
                2. Funding information
                3. Tech stack
                4. Pain points in their industry
                5. Potential value propositions
                """,
            "metadata": {"created_at": "2024-01-01", "performance_score": 0.68},
        },
    }

    @staticmethod
    def get_template(name: str, version: Optional[str] = None) -> str:
        """Get prompt template by name and version"""
        if version:
            key = f"{name}_v{version}"
            if key in PromptTemplate.TEMPLATES:
                return PromptTemplate.TEMPLATES[key]["template"]

        # Return latest version
        matching = [k for k in PromptTemplate.TEMPLATES.keys() if k.startswith(name)]
        if not matching:
            raise ValueError(f"Template {name} not found")

        latest = sorted(matching)[-1]
        return PromptTemplate.TEMPLATES[latest]["template"]

    @staticmethod
    def render(name: str, **kwargs) -> str:
        """Render template with variables"""
        template = PromptTemplate.get_template(name)
        return template.format(**kwargs)

    @staticmethod
    def get_performance_metrics(name: str) -> Dict[str, Any]:
        """Get A/B test metrics for template"""
        versions = [k for k in PromptTemplate.TEMPLATES.keys() if k.startswith(name)]

        metrics = {}
        for version in versions:
            template_data = PromptTemplate.TEMPLATES[version]
            metrics[version] = {
                "performance_score": template_data["metadata"]["performance_score"],
                "created_at": template_data["metadata"]["created_at"],
            }

        return metrics


class CostTracker:
    """Track LLM API costs and enforce budgets"""

    TOKEN_COSTS = {
        "gpt-4": {"input": 0.03, "output": 0.06},  # per 1K tokens
        "gpt-3.5-turbo": {"input": 0.0015, "output": 0.002},
        "claude-3-opus": {"input": 0.015, "output": 0.075},
        "claude-3-sonnet": {"input": 0.003, "output": 0.015},
    }

    @staticmethod
    def calculate_cost(model: str, input_tokens: int, output_tokens: int) -> float:
        """Calculate cost for API call"""
        if model not in CostTracker.TOKEN_COSTS:
            logger.warning(f"Unknown model {model}, using default pricing")
            model = "gpt-3.5-turbo"

        costs = CostTracker.TOKEN_COSTS[model]
        cost = (input_tokens / 1000 * costs["input"]) + (output_tokens / 1000 * costs["output"])
        return round(cost, 4)

    @staticmethod
    def log_usage(user_id: int, model: str, input_tokens: int, output_tokens: int, purpose: str):
        """Log usage and cost to Redis"""
        cost = CostTracker.calculate_cost(model, input_tokens, output_tokens)

        # Store daily totals
        date_key = datetime.now().strftime("%Y-%m-%d")
        usage_key = f"ai:usage:{user_id}:{date_key}"

        current_usage = cache.get(usage_key) or {
            "total_cost": 0,
            "total_input_tokens": 0,
            "total_output_tokens": 0,
            "calls": 0,
        }

        current_usage["total_cost"] += cost
        current_usage["total_input_tokens"] += input_tokens
        current_usage["total_output_tokens"] += output_tokens
        current_usage["calls"] += 1

        cache.set(usage_key, current_usage, ttl=86400 * 90)  # 90 days

        logger.info(f"User {user_id} - {purpose}: ${cost} ({input_tokens}+{output_tokens} tokens)")

        return cost

    @staticmethod
    def get_user_usage(user_id: int, date: Optional[str] = None) -> Dict[str, Any]:
        """Get usage stats for user"""
        if not date:
            date = datetime.now().strftime("%Y-%m-%d")

        usage_key = f"ai:usage:{user_id}:{date}"
        usage = cache.get(usage_key)

        return usage or {
            "total_cost": 0,
            "total_input_tokens": 0,
            "total_output_tokens": 0,
            "calls": 0,
        }

    @staticmethod
    def check_budget(user_id: int, daily_limit: float = 10.0) -> bool:
        """Check if user is within budget"""
        usage = CostTracker.get_user_usage(user_id)
        return usage["total_cost"] < daily_limit


class AgentOrchestrator:
    """
    Orchestrate multi-step AI agent workflows.
    """

    def __init__(self, session_id: str):
        self.session_id = session_id
        self.ai_provider = AIProvider()

    async def execute_workflow(self, workflow: AgentWorkflow) -> AgentWorkflow:
        """Execute multi-step workflow"""
        workflow.status = "running"

        for step in workflow.steps:
            try:
                step.status = "running"
                step.started_at = datetime.now()

                # Execute step based on tool type
                if step.tool_type == ToolType.RESEARCH:
                    result = await self._research_tool(step.input, workflow.context)
                elif step.tool_type == ToolType.DRAFT:
                    result = await self._draft_tool(step.input, workflow.context)
                elif step.tool_type == ToolType.REVIEW:
                    result = await self._review_tool(step.input, workflow.context)
                elif step.tool_type == ToolType.SCORE:
                    result = await self._score_tool(step.input, workflow.context)
                else:
                    result = {"error": f"Unknown tool type: {step.tool_type}"}

                step.output = result
                step.status = "completed"
                step.completed_at = datetime.now()

                # Update workflow context with step output
                workflow.context[step.id] = result

            except Exception as e:
                logger.error(f"Step {step.id} failed: {e}")
                step.status = "failed"
                step.error = str(e)
                workflow.status = "failed"
                break

        if workflow.status != "failed":
            workflow.status = "completed"
            workflow.completed_at = datetime.now()

        # Save workflow state
        ContextMemory.save_context(f"workflow:{workflow.workflow_id}", workflow.dict())

        return workflow

    async def _research_tool(self, input_data: Dict, context: Dict) -> Dict:
        """Execute research tool"""
        prompt = PromptTemplate.render("lead_research", **input_data)

        response = await self.ai_provider.generate_text(prompt, model="gpt-3.5-turbo")

        # Track cost
        CostTracker.log_usage(
            user_id=context.get("user_id", 0),
            model="gpt-3.5-turbo",
            input_tokens=len(prompt.split()) * 1.3,  # Rough estimate
            output_tokens=len(response.split()) * 1.3,
            purpose="research",
        )

        return {"research_findings": response}

    async def _draft_tool(self, input_data: Dict, context: Dict) -> Dict:
        """Execute draft tool"""
        # Include research context if available
        if "research" in context:
            input_data["context"] = context["research"].get("research_findings", "")

        prompt = PromptTemplate.render("email_draft", **input_data)

        response = await self.ai_provider.generate_text(prompt, model="gpt-4")

        CostTracker.log_usage(
            user_id=context.get("user_id", 0),
            model="gpt-4",
            input_tokens=len(prompt.split()) * 1.3,
            output_tokens=len(response.split()) * 1.3,
            purpose="email_draft",
        )

        return {"draft": response}

    async def _review_tool(self, input_data: Dict, context: Dict) -> Dict:
        """Execute review tool"""
        draft = input_data.get("draft", "")

        review_prompt = f"""Review this email draft for:
        1. Tone and professionalism
        2. Clarity and conciseness
        3. Call-to-action effectiveness
        4. Personalization
        
        Draft:
        {draft}
        
        Provide scores (1-10) and suggestions.
        """

        response = await self.ai_provider.generate_text(review_prompt, model="gpt-3.5-turbo")

        return {"review": response, "approved": True}

    async def _score_tool(self, input_data: Dict, context: Dict) -> Dict:
        """Execute scoring tool"""
        # In production: call ML model
        return {"score": 75, "confidence": 0.85}
