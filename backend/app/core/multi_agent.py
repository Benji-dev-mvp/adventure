"""
Multi-Agent Orchestration System
Deploy specialized agents that collaborate on complex tasks
"""

import asyncio
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class AgentRole(str, Enum):
    RESEARCHER = "researcher"
    WRITER = "writer"
    ANALYST = "analyst"
    QUALITY_CHECKER = "quality_checker"
    STRATEGIST = "strategist"


class AgentMessage(BaseModel):
    """Message passed between agents"""

    from_agent: AgentRole
    to_agent: AgentRole
    content: Dict[str, Any]
    timestamp: datetime
    message_type: str  # "request", "response", "feedback"


class AgentState(BaseModel):
    """Current state of an agent"""

    role: AgentRole
    status: str  # "idle", "working", "waiting", "complete"
    current_task: Optional[str] = None
    completed_tasks: List[str] = []
    memory: Dict[str, Any] = {}


class SpecializedAgent:
    """
    Base class for specialized agents.
    Each agent has specific expertise and capabilities.
    """

    def __init__(self, role: AgentRole, openai_client, expertise: str):
        self.role = role
        self.client = openai_client
        self.expertise = expertise
        self.state = AgentState(role=role, status="idle")
        self.message_history: List[AgentMessage] = []

    async def process_task(self, task: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Process a task according to agent's specialization"""
        self.state.status = "working"
        self.state.current_task = task

        # Build prompt based on role
        system_prompt = self._get_system_prompt()

        response = await self.client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Task: {task}\n\nContext: {context}"},
            ],
            temperature=0.7,
        )

        result = response.choices[0].message.content

        self.state.status = "complete"
        self.state.completed_tasks.append(task)
        self.state.memory[task] = result

        return {
            "agent": self.role,
            "task": task,
            "result": result,
            "timestamp": datetime.utcnow().isoformat(),
        }

    def _get_system_prompt(self) -> str:
        """Get role-specific system prompt"""
        prompts = {
            AgentRole.RESEARCHER: """You are a Research Agent specializing in B2B prospect research.
Your expertise: Company analysis, technographic research, intent signal detection, competitive intelligence.
You provide detailed, actionable research insights.""",
            AgentRole.WRITER: """You are a Writing Agent specializing in B2B sales emails.
Your expertise: Persuasive copywriting, personalization, objection handling, CTA optimization.
You craft compelling, conversion-focused messages.""",
            AgentRole.ANALYST: """You are an Analyst Agent specializing in data interpretation.
Your expertise: Lead scoring, engagement analysis, campaign performance, predictive analytics.
You provide data-driven insights and recommendations.""",
            AgentRole.QUALITY_CHECKER: """You are a Quality Assurance Agent.
Your expertise: Email review, compliance checking, brand voice consistency, error detection.
You ensure high-quality, professional output.""",
            AgentRole.STRATEGIST: """You are a Strategy Agent specializing in sales strategy.
Your expertise: Campaign planning, audience segmentation, timing optimization, multi-channel coordination.
You design winning go-to-market strategies.""",
        }

        return prompts.get(self.role, "You are a helpful AI assistant.")

    async def send_message(self, to_agent: AgentRole, content: Dict[str, Any], message_type: str):
        """Send message to another agent"""
        message = AgentMessage(
            from_agent=self.role,
            to_agent=to_agent,
            content=content,
            timestamp=datetime.utcnow(),
            message_type=message_type,
        )
        self.message_history.append(message)
        return message

    async def receive_message(self, message: AgentMessage):
        """Receive and process message from another agent"""
        self.message_history.append(message)

        if message.message_type == "feedback":
            # Incorporate feedback into memory
            self.state.memory[f"feedback_{message.from_agent}"] = message.content


class AgentTeam:
    """
    Orchestrates multiple specialized agents working together.

    Example workflow:
    1. Researcher finds company info
    2. Analyst scores the lead
    3. Strategist plans approach
    4. Writer crafts email
    5. Quality Checker reviews
    """

    def __init__(self, openai_client):
        self.client = openai_client
        self.agents: Dict[AgentRole, SpecializedAgent] = {}
        self._initialize_agents()

    def _initialize_agents(self):
        """Create team of specialized agents"""
        self.agents[AgentRole.RESEARCHER] = SpecializedAgent(
            AgentRole.RESEARCHER, self.client, "Prospect and company research"
        )
        self.agents[AgentRole.ANALYST] = SpecializedAgent(
            AgentRole.ANALYST, self.client, "Data analysis and scoring"
        )
        self.agents[AgentRole.STRATEGIST] = SpecializedAgent(
            AgentRole.STRATEGIST, self.client, "Campaign strategy"
        )
        self.agents[AgentRole.WRITER] = SpecializedAgent(
            AgentRole.WRITER, self.client, "Email copywriting"
        )
        self.agents[AgentRole.QUALITY_CHECKER] = SpecializedAgent(
            AgentRole.QUALITY_CHECKER, self.client, "Quality assurance"
        )

    async def execute_campaign_workflow(
        self, lead_data: Dict[str, Any], campaign_goal: str
    ) -> Dict[str, Any]:
        """
        Execute full multi-agent workflow for campaign creation

        Workflow:
        1. Research → 2. Analysis → 3. Strategy → 4. Writing → 5. QA
        """
        workflow_results = {
            "lead": lead_data,
            "goal": campaign_goal,
            "workflow_steps": [],
            "start_time": datetime.utcnow().isoformat(),
        }

        # Step 1: Research Agent gathers intelligence
        research_result = await self.agents[AgentRole.RESEARCHER].process_task(
            task=f"Research {lead_data.get('company')} and {lead_data.get('name')}",
            context=lead_data,
        )
        workflow_results["workflow_steps"].append(research_result)

        # Step 2: Analyst evaluates lead quality
        analysis_result = await self.agents[AgentRole.ANALYST].process_task(
            task=f"Analyze lead fit for {campaign_goal}",
            context={**lead_data, "research": research_result["result"]},
        )
        workflow_results["workflow_steps"].append(analysis_result)

        # Step 3: Strategist plans approach
        strategy_result = await self.agents[AgentRole.STRATEGIST].process_task(
            task=f"Design outreach strategy for {campaign_goal}",
            context={
                "lead": lead_data,
                "research": research_result["result"],
                "analysis": analysis_result["result"],
            },
        )
        workflow_results["workflow_steps"].append(strategy_result)

        # Step 4: Writer crafts email
        writing_result = await self.agents[AgentRole.WRITER].process_task(
            task="Write personalized outreach email",
            context={
                "lead": lead_data,
                "research": research_result["result"],
                "strategy": strategy_result["result"],
            },
        )
        workflow_results["workflow_steps"].append(writing_result)

        # Step 5: Quality Checker reviews
        qa_result = await self.agents[AgentRole.QUALITY_CHECKER].process_task(
            task="Review email for quality, compliance, and effectiveness",
            context={
                "email": writing_result["result"],
                "lead": lead_data,
                "strategy": strategy_result["result"],
            },
        )
        workflow_results["workflow_steps"].append(qa_result)

        # If QA found issues, send back to writer
        if "revision needed" in qa_result["result"].lower():
            # Writer revises based on QA feedback
            revision_result = await self.agents[AgentRole.WRITER].process_task(
                task="Revise email based on QA feedback",
                context={
                    "original_email": writing_result["result"],
                    "feedback": qa_result["result"],
                },
            )
            workflow_results["workflow_steps"].append(revision_result)
            workflow_results["final_email"] = revision_result["result"]
        else:
            workflow_results["final_email"] = writing_result["result"]

        workflow_results["end_time"] = datetime.utcnow().isoformat()
        workflow_results["total_agents_involved"] = 5
        workflow_results["quality_approved"] = "revision needed" not in qa_result["result"].lower()

        return workflow_results

    async def parallel_research(
        self, lead_data: Dict[str, Any], research_tasks: List[str]
    ) -> Dict[str, Any]:
        """
        Execute multiple research tasks in parallel

        Example: Simultaneously research company, technographics, and news
        """
        researcher = self.agents[AgentRole.RESEARCHER]

        # Execute tasks concurrently
        tasks = [researcher.process_task(task, lead_data) for task in research_tasks]

        results = await asyncio.gather(*tasks)

        return {
            "lead": lead_data,
            "parallel_tasks": len(research_tasks),
            "results": results,
            "timestamp": datetime.utcnow().isoformat(),
        }

    async def agent_collaboration(
        self,
        primary_agent: AgentRole,
        supporting_agents: List[AgentRole],
        task: str,
        context: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Have one agent lead with others providing support

        Example: Writer leads, gets input from Researcher and Strategist
        """
        primary = self.agents[primary_agent]

        # Supporting agents provide input first
        support_results = []
        for supporter_role in supporting_agents:
            supporter = self.agents[supporter_role]
            result = await supporter.process_task(
                task=f"Provide {supporter_role.value} perspective for: {task}",
                context=context,
            )
            support_results.append(result)

        # Primary agent synthesizes inputs
        combined_context = {**context, "support_inputs": support_results}

        primary_result = await primary.process_task(task, combined_context)

        return {
            "primary_agent": primary_agent,
            "supporting_agents": supporting_agents,
            "task": task,
            "support_results": support_results,
            "final_result": primary_result,
            "timestamp": datetime.utcnow().isoformat(),
        }

    def get_team_status(self) -> Dict[str, Any]:
        """Get status of all agents in the team"""
        return {
            "team_size": len(self.agents),
            "agents": {
                role.value: {
                    "status": agent.state.status,
                    "current_task": agent.state.current_task,
                    "completed_tasks": len(agent.state.completed_tasks),
                    "messages_exchanged": len(agent.message_history),
                }
                for role, agent in self.agents.items()
            },
        }


# Convenience function for FastAPI integration
async def create_multi_agent_campaign(
    lead_data: Dict[str, Any], campaign_goal: str, openai_api_key: str
) -> Dict[str, Any]:
    """
    Create campaign using multi-agent collaboration

    Returns complete workflow with insights from each specialist
    """
    from openai import AsyncOpenAI

    client = AsyncOpenAI(api_key=openai_api_key)
    team = AgentTeam(client)

    result = await team.execute_campaign_workflow(lead_data, campaign_goal)

    return result
