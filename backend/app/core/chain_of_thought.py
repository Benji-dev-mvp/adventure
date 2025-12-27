"""
Chain-of-Thought Reasoning System
Provides explainable AI decision-making with visible reasoning steps
"""
from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel
import json

class ReasoningStep(BaseModel):
    """A single step in the reasoning chain"""
    step_number: int
    thought: str
    action: str
    observation: str
    timestamp: datetime
    confidence: float

class ChainOfThoughtReasoning:
    """
    Implements Chain-of-Thought reasoning for AI agents.
    
    Shows transparent decision-making process:
    1. Thought: What should I do?
    2. Action: What I'm doing
    3. Observation: What I learned
    4. Repeat until goal achieved
    """
    
    def __init__(self, openai_client, max_steps: int = 10):
        self.client = openai_client
        self.max_steps = max_steps
        self.reasoning_chain: List[ReasoningStep] = []
    
    async def reason_and_act(
        self,
        goal: str,
        context: Dict[str, Any],
        available_actions: List[str]
    ) -> Dict[str, Any]:
        """
        Execute goal-driven reasoning with explicit steps
        
        Args:
            goal: What we're trying to achieve
            context: Current state/information
            available_actions: What the AI can do
            
        Returns:
            Dict with final_answer, reasoning_chain, actions_taken
        """
        self.reasoning_chain = []
        step_number = 0
        
        system_prompt = f"""You are an AI assistant that uses chain-of-thought reasoning.

Goal: {goal}

Available Actions: {', '.join(available_actions)}

For each step, provide:
1. Thought: Your reasoning about what to do next
2. Action: The specific action you'll take
3. Expected Observation: What you expect to learn

Format your response as JSON:
{{
  "thought": "your reasoning here",
  "action": "action_name",
  "action_params": {{}},
  "is_final": false
}}

When you've achieved the goal, set is_final to true and include "final_answer".
"""
        
        conversation_history = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Context: {json.dumps(context)}"}
        ]
        
        while step_number < self.max_steps:
            step_number += 1
            
            # Get AI's reasoning step
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=conversation_history,
                response_format={"type": "json_object"},
                temperature=0.7
            )
            
            reasoning = json.loads(response.choices[0].message.content)
            
            # Execute the action and get observation
            observation = await self._execute_action(
                reasoning.get("action"),
                reasoning.get("action_params", {})
            )
            
            # Record the step
            step = ReasoningStep(
                step_number=step_number,
                thought=reasoning.get("thought", ""),
                action=reasoning.get("action", ""),
                observation=observation,
                timestamp=datetime.utcnow(),
                confidence=reasoning.get("confidence", 0.8)
            )
            self.reasoning_chain.append(step)
            
            # Add to conversation
            conversation_history.append({
                "role": "assistant",
                "content": json.dumps(reasoning)
            })
            conversation_history.append({
                "role": "user",
                "content": f"Observation: {observation}"
            })
            
            # Check if we're done
            if reasoning.get("is_final"):
                return {
                    "success": True,
                    "final_answer": reasoning.get("final_answer"),
                    "reasoning_chain": [step.dict() for step in self.reasoning_chain],
                    "total_steps": step_number
                }
        
        return {
            "success": False,
            "error": "Max steps reached without conclusion",
            "reasoning_chain": [step.dict() for step in self.reasoning_chain],
            "total_steps": step_number
        }
    
    async def _execute_action(self, action: str, params: Dict[str, Any]) -> str:
        """Execute an action and return the observation"""
        # This will be connected to actual tools/APIs
        # For now, return simulated observations
        action_map = {
            "research_company": "Found: Company has 500 employees, $50M ARR, uses Salesforce",
            "analyze_linkedin": "Recent posts about scaling challenges, hiring sales team",
            "check_technographics": "Uses: Salesforce, HubSpot, Slack, no current email automation",
            "draft_email": "Email drafted with personalized pain points",
            "score_lead": "Lead scored 92/100 - high intent, good fit",
            "search_news": "Recent funding round announced, expanding to Europe"
        }
        
        return action_map.get(action, f"Action {action} executed with params {params}")
    
    def get_reasoning_summary(self) -> str:
        """Generate human-readable reasoning summary"""
        summary = "=== AI Reasoning Process ===\n\n"
        
        for step in self.reasoning_chain:
            summary += f"Step {step.step_number}:\n"
            summary += f"  💭 Thought: {step.thought}\n"
            summary += f"  🎯 Action: {step.action}\n"
            summary += f"  👁️ Observation: {step.observation}\n"
            summary += f"  ✅ Confidence: {step.confidence:.0%}\n\n"
        
        return summary


class ExplainableAIBDR:
    """
    Enhanced Autonomous BDR with explainable reasoning.
    
    Every action includes:
    - Why the AI chose this approach
    - What data it considered
    - Alternative approaches considered
    - Confidence level
    """
    
    def __init__(self, openai_client):
        self.client = openai_client
        self.reasoner = ChainOfThoughtReasoning(openai_client)
    
    async def research_and_engage(
        self,
        lead_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Research lead and craft personalized outreach with full reasoning trace
        
        Args:
            lead_data: Lead information (name, company, title, etc.)
            
        Returns:
            Dict with email, reasoning_chain, confidence_score
        """
        goal = f"Research {lead_data.get('name')} at {lead_data.get('company')} and craft personalized email"
        
        context = {
            "lead_name": lead_data.get("name"),
            "company": lead_data.get("company"),
            "title": lead_data.get("title"),
            "industry": lead_data.get("industry"),
            "company_size": lead_data.get("employee_count")
        }
        
        available_actions = [
            "research_company",
            "analyze_linkedin",
            "check_technographics",
            "search_news",
            "identify_pain_points",
            "draft_email",
            "score_lead"
        ]
        
        result = await self.reasoner.reason_and_act(goal, context, available_actions)
        
        # Add reasoning summary for transparency
        result["reasoning_summary"] = self.reasoner.get_reasoning_summary()
        result["explainability_score"] = self._calculate_explainability(result)
        
        return result
    
    def _calculate_explainability(self, result: Dict[str, Any]) -> float:
        """Calculate how well the AI explained its reasoning"""
        if not result.get("reasoning_chain"):
            return 0.0
        
        # Check for key elements
        has_thoughts = any(step.get("thought") for step in result["reasoning_chain"])
        has_actions = any(step.get("action") for step in result["reasoning_chain"])
        has_observations = any(step.get("observation") for step in result["reasoning_chain"])
        steps_count = len(result["reasoning_chain"])
        
        score = 0.0
        if has_thoughts: score += 0.3
        if has_actions: score += 0.3
        if has_observations: score += 0.3
        if steps_count >= 3: score += 0.1
        
        return min(score, 1.0)


# Integration helper
async def create_explainable_outreach(
    lead_data: Dict[str, Any],
    openai_api_key: str
) -> Dict[str, Any]:
    """
    Convenience function for creating explainable AI outreach
    
    Returns both the email AND the reasoning behind it
    """
    from openai import AsyncOpenAI
    
    client = AsyncOpenAI(api_key=openai_api_key)
    bdr = ExplainableAIBDR(client)
    
    result = await bdr.research_and_engage(lead_data)
    
    return {
        "email": result.get("final_answer"),
        "reasoning": result.get("reasoning_summary"),
        "confidence": result.get("explainability_score"),
        "steps_taken": result.get("total_steps"),
        "full_chain": result.get("reasoning_chain")
    }
