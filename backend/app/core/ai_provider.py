import logging
import os
from enum import Enum
from typing import Any, AsyncGenerator, Dict, List, Optional

from app.core.ai_prompts import (
    PLATFORM_CONTEXT,
    AIPersonality,
    PromptBuilder,
    PromptTemplate,
)

logger = logging.getLogger(__name__)

# Import LLM providers
try:
    from openai import AsyncOpenAI

    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    logger.warning("OpenAI library not installed")

try:
    from anthropic import AsyncAnthropic

    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False
    logger.warning("Anthropic library not installed")


class AIProvider(str, Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    AZURE = "azure"
    MOCK = "mock"


class LLMClient:
    """Unified LLM client supporting multiple providers."""

    def __init__(self):
        self.provider = AIProvider(os.getenv("AI_PROVIDER", "mock").lower())
        self.model = os.getenv("AI_MODEL", "gpt-4o-mini")
        self.temperature = float(os.getenv("AI_TEMPERATURE", "0.7"))
        self.max_tokens = int(os.getenv("AI_MAX_TOKENS", "2000"))

        # Initialize provider-specific clients
        self.openai_client = None
        self.anthropic_client = None

        if self.provider == AIProvider.OPENAI and OPENAI_AVAILABLE:
            api_key = os.getenv("AI_API_KEY")
            if api_key:
                self.openai_client = AsyncOpenAI(api_key=api_key)
            else:
                logger.warning("OpenAI API key not provided, falling back to mock")
                self.provider = AIProvider.MOCK

        elif self.provider == AIProvider.ANTHROPIC and ANTHROPIC_AVAILABLE:
            api_key = os.getenv("ANTHROPIC_API_KEY")
            if api_key:
                self.anthropic_client = AsyncAnthropic(api_key=api_key)
                # Default to Claude model if not specified
                if "gpt" in self.model.lower():
                    self.model = "claude-3-5-sonnet-20241022"
            else:
                logger.warning("Anthropic API key not provided, falling back to mock")
                self.provider = AIProvider.MOCK

        elif self.provider == AIProvider.AZURE and OPENAI_AVAILABLE:
            endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
            api_key = os.getenv("AZURE_OPENAI_API_KEY")
            if endpoint and api_key:
                self.openai_client = AsyncOpenAI(
                    api_key=api_key,
                    base_url=f"{endpoint}/openai/deployments/{os.getenv('AZURE_OPENAI_DEPLOYMENT')}",
                    api_version="2024-02-15-preview",
                )
            else:
                logger.warning("Azure OpenAI credentials not provided, falling back to mock")
                self.provider = AIProvider.MOCK

    async def chat(
        self, messages: List[Dict[str, str]], stream: bool = False
    ) -> str | AsyncGenerator:
        """Send chat request to configured LLM provider."""
        try:
            if self.provider in [AIProvider.OPENAI, AIProvider.AZURE] and self.openai_client:
                return await self._openai_chat(messages, stream)
            elif self.provider == AIProvider.ANTHROPIC and self.anthropic_client:
                return await self._anthropic_chat(messages, stream)
            else:
                return self._mock_chat(messages)
        except Exception as e:
            logger.error(f"LLM chat error: {e}", exc_info=True)
            return self._mock_chat(messages)

    async def _openai_chat(self, messages: List[Dict[str, str]], stream: bool = False):
        """Handle OpenAI/Azure OpenAI chat."""
        if stream:

            async def stream_generator():
                response = await self.openai_client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=self.temperature,
                    max_tokens=self.max_tokens,
                    stream=True,
                )
                async for chunk in response:
                    if chunk.choices[0].delta.content:
                        yield chunk.choices[0].delta.content

            return stream_generator()
        else:
            response = await self.openai_client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens,
            )
            return response.choices[0].message.content

    async def _anthropic_chat(self, messages: List[Dict[str, str]], stream: bool = False):
        """Handle Anthropic Claude chat."""
        # Convert messages format (Anthropic uses system param separately)
        system = None
        anthropic_messages = []
        for msg in messages:
            if msg["role"] == "system":
                system = msg["content"]
            else:
                anthropic_messages.append(msg)

        if stream:

            async def stream_generator():
                async with self.anthropic_client.messages.stream(
                    model=self.model,
                    max_tokens=self.max_tokens,
                    temperature=self.temperature,
                    system=system,
                    messages=anthropic_messages,
                ) as stream:
                    async for text in stream.text_stream:
                        yield text

            return stream_generator()
        else:
            response = await self.anthropic_client.messages.create(
                model=self.model,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                system=system,
                messages=anthropic_messages,
            )
            return response.content[0].text

    def _mock_chat(self, messages: List[Dict[str, str]]) -> str:
        """Mock response for testing/development."""
        last_user_msg = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "")
        return (
            f"Quick take: '{last_user_msg[:50]}...'. Prioritize high-intent leads, throttle low-warm domains, "
            f"and schedule sends at historical peak reply windows (Tue 10am for Finance)."
        )


# Global LLM client instance
llm_client = LLMClient()


async def _call_provider_chat(prompt: str) -> str:
    """Legacy function for backwards compatibility."""
    messages = [{"role": "user", "content": prompt}]
    return await llm_client.chat(messages)


def _mock_chat(prompt: str) -> str:
    """Legacy mock function."""
    return (
        f"Quick take: '{prompt}'. Prioritize high-intent leads, throttle low-warm domains, "
        f"and schedule sends at historical peak reply windows (Tue 10am for Finance)."
    )


def simple_lead_score(lead: Dict[str, Any]) -> Dict[str, Any]:
    """Deterministic scoring to avoid provider dependency."""
    title = (lead.get("title") or "").lower()
    industry = (lead.get("industry") or "").lower()
    activity = lead.get("activity") or []
    score = 60
    rationale = []

    if any(k in title for k in ["vp", "cto", "head", "director"]):
        score += 20
        rationale.append("senior title")
    if "ai" in industry or "saas" in industry or "cloud" in industry:
        score += 10
        rationale.append("aligned industry")
    opens = sum(1 for a in activity if a.get("type") == "email_opened")
    replies = sum(1 for a in activity if "replied" in (a.get("type") or ""))
    meetings = sum(1 for a in activity if "meeting" in (a.get("type") or ""))
    score += min(opens * 2, 10)
    score += replies * 15
    score += meetings * 25

    score = max(1, min(100, score))
    tier = "hot" if score >= 90 else ("warm" if score >= 75 else "cold")
    return {
        "score": score,
        "tier": tier,
        "rationale": ", ".join(rationale) or "baseline",
    }


def draft_email(
    lead: Dict[str, Any],
    prompt: str,
    tone: str = "professional",
    length: str = "medium",
) -> Dict[str, str]:
    """Generate email draft using LLM or fallback to template."""
    name = lead.get("name") or "there"
    company = lead.get("company") or "your team"

    # Try to use LLM for better quality
    try:
        if llm_client.provider != AIProvider.MOCK:
            import asyncio

            system_msg = (
                f"You are an expert B2B sales email writer. Write {length} emails in a {tone} tone."
            )
            user_msg = f"Write an email to {name} at {company}. Context: {prompt}"
            messages = [
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg},
            ]
            email_content = asyncio.run(llm_client.chat(messages))

            # Parse subject and body (basic heuristic)
            lines = email_content.strip().split("\n")
            subject = f"Quick question for {company}"
            body = email_content

            for i, line in enumerate(lines):
                if line.lower().startswith("subject:"):
                    subject = line.split(":", 1)[1].strip()
                    body = "\n".join(lines[i + 1 :]).strip()
                    break

            return {"subject": subject, "body": body, "tone": tone, "length": length}
    except Exception as e:
        logger.warning(f"LLM email generation failed: {e}, using template")

    # Fallback template
    subject = f"Quick question for {company}"
    body = (
        f"Hi {name},\n\n"
        f"{prompt.strip()}\n\n"
        f"We help teams like {company} improve reply rates and meetings booked."
        f" Would you be open to a 15-min chat next week?\n\n"
        f"Best,\nYour Team\n"
    )
    return {"subject": subject, "body": body, "tone": tone, "length": length}


async def chat(
    prompt: str,
    personality: AIPersonality = AIPersonality.AVA_PROFESSIONAL,
    additional_context: Optional[str] = None,
) -> Dict[str, Any]:
    """Main chat function - uses configured LLM provider with custom personality."""
    builder = PromptBuilder(personality=personality)
    messages = builder.build_custom(prompt, additional_context=additional_context or "")
    content = await llm_client.chat(messages)

    suggestions = ["Apply guardrail", "Schedule optimal window", "Tune subject lines"]
    return {"role": "assistant", "content": content, "suggestions": suggestions}


async def chat_with_history(messages: List[Dict[str, str]]) -> Dict[str, Any]:
    """Chat with conversation history."""
    content = await llm_client.chat(messages)
    return {"role": "assistant", "content": content}


async def generate_campaign_content(
    campaign_type: str,
    target_audience: str,
    tone: str = "professional",
    additional_context: str = "",
    use_platform_context: bool = True,
) -> Dict[str, Any]:
    """Generate campaign content using LLM with platform-specific context."""
    builder = PromptBuilder(personality=AIPersonality.COPYWRITER)

    # Build context with platform info
    full_context = additional_context
    if use_platform_context:
        platform_ctx = builder.inject_company_context(PLATFORM_CONTEXT)
        full_context = (
            f"{platform_ctx}\n\n{additional_context}" if additional_context else platform_ctx
        )

    user_prompt = (
        f"Create {campaign_type} content for this audience: {target_audience}. Tone: {tone}"
    )

    messages = builder.build_custom(user_prompt, additional_context=full_context)
    content = await llm_client.chat(messages)

    return {"content": content, "campaign_type": campaign_type, "tone": tone}


async def generate_from_template(
    template: PromptTemplate,
    context: Dict[str, Any],
    personality: Optional[AIPersonality] = None,
) -> str:
    """Generate content using a predefined template."""
    if personality is None:
        # Auto-select personality based on template
        if template in [PromptTemplate.EMAIL_SUBJECT_LINE, PromptTemplate.CALL_SCRIPT]:
            personality = AIPersonality.COPYWRITER
        elif template == PromptTemplate.LEAD_ANALYSIS:
            personality = AIPersonality.ANALYST
        else:
            personality = AIPersonality.AVA_PROFESSIONAL

    builder = PromptBuilder(personality=personality)
    messages = builder.build_from_template(template, context)

    return await llm_client.chat(messages)
