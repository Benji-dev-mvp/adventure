import asyncio
from typing import Any, Dict, List, Optional

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.core.ai_prompts import (
    PROMPT_TEMPLATES,
    AIPersonality,
    PromptBuilder,
    PromptTemplate,
)
from app.core.ai_provider import chat as ai_chat
from app.core.ai_provider import (
    chat_with_history,
    draft_email,
    generate_campaign_content,
    generate_from_template,
    llm_client,
    simple_lead_score,
)

router = APIRouter()


class ChatRequest(BaseModel):
    prompt: str
    history: List[dict] | None = None
    personality: Optional[str] = None  # ava_professional, ava_casual, analyst, etc.
    additional_context: Optional[str] = None


class ChatResponse(BaseModel):
    role: str
    content: str
    suggestions: list[str] | None = None
    personality: Optional[str] = None


class LeadPayload(BaseModel):
    name: str | None = None
    title: str | None = None
    company: str | None = None
    industry: str | None = None
    activity: list[dict] | None = None


class LeadScoreResponse(BaseModel):
    score: int
    tier: str
    rationale: str


class EmailDraftRequest(BaseModel):
    prompt: str
    tone: str | None = "professional"
    length: str | None = "medium"
    lead: LeadPayload


class EmailDraftResponse(BaseModel):
    subject: str
    body: str
    tone: str
    length: str


@router.post("/ai/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """Chat with AI assistant - supports conversation history and personalities."""
    # Parse personality
    personality = AIPersonality.AVA_PROFESSIONAL
    if req.personality:
        try:
            personality = AIPersonality(req.personality)
        except ValueError:
            pass  # Use default

    if req.history:
        # Add current prompt to history
        messages = req.history + [{"role": "user", "content": req.prompt}]
        response = await chat_with_history(messages)
        return {
            **response,
            "suggestions": [
                "Apply guardrail",
                "Schedule optimal window",
                "Tune subject lines",
            ],
            "personality": personality.value,
        }
    else:
        response = await ai_chat(
            req.prompt,
            personality=personality,
            additional_context=req.additional_context,
        )
        return {**response, "personality": personality.value}


@router.post("/ai/lead-score", response_model=LeadScoreResponse)
async def lead_score(lead: LeadPayload):
    return simple_lead_score(lead.dict())


@router.post("/ai/generate-email", response_model=EmailDraftResponse)
async def generate_email(payload: EmailDraftRequest):
    return draft_email(
        payload.lead.dict(),
        payload.prompt,
        payload.tone or "professional",
        payload.length or "medium",
    )


@router.post("/ai/chat-stream")
async def chat_stream(req: ChatRequest):
    """Server-Sent Events (SSE) streaming chat endpoint."""

    async def event_generator():
        try:
            messages = [{"role": "user", "content": req.prompt}]
            if req.history:
                messages = req.history + messages

            # Use real streaming if available
            if llm_client.provider.value != "mock":
                result = await llm_client.chat(messages, stream=True)
                async for chunk in result:
                    yield f"data: {chunk}\n\n"
            else:
                # Fallback mock streaming
                response = await ai_chat(req.prompt)
                content = response["content"]
                words = content.split()
                for i, word in enumerate(words):
                    chunk = word + (" " if i < len(words) - 1 else "")
                    yield f"data: {chunk}\n\n"
                    await asyncio.sleep(0.05)

            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: Error: {str(e)}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


class CampaignContentRequest(BaseModel):
    campaign_type: str  # email, linkedin, sms, call
    target_audience: str
    tone: str = "professional"
    additional_context: str = ""


class CampaignContentResponse(BaseModel):
    content: str
    campaign_type: str
    tone: str


@router.post("/ai/generate-campaign", response_model=CampaignContentResponse)
async def generate_campaign(payload: CampaignContentRequest):
    """Generate campaign content using AI."""
    return await generate_campaign_content(
        campaign_type=payload.campaign_type,
        target_audience=payload.target_audience,
        tone=payload.tone,
        additional_context=payload.additional_context,
    )


class ProviderStatusResponse(BaseModel):
    provider: str
    model: str
    available: bool
    capabilities: List[str]


@router.get("/ai/status", response_model=ProviderStatusResponse)
async def get_ai_status():
    """Get current AI provider status and capabilities."""
    capabilities = ["chat", "email_generation", "lead_scoring"]

    if llm_client.provider.value != "mock":
        capabilities.extend(["streaming", "campaign_generation", "conversation_history"])

    return {
        "provider": llm_client.provider.value,
        "model": llm_client.model,
        "available": llm_client.provider.value != "mock",
        "capabilities": capabilities,
    }


class TemplateGenerateRequest(BaseModel):
    template: str  # Template name (e.g., "email_cold_outreach")
    context: Dict[str, Any]  # Template variables
    personality: Optional[str] = None  # Override default personality


class TemplateGenerateResponse(BaseModel):
    content: str
    template: str
    personality: str


@router.post("/ai/generate-from-template", response_model=TemplateGenerateResponse)
async def generate_from_template_endpoint(payload: TemplateGenerateRequest):
    """Generate content from predefined template with context injection."""
    try:
        template_enum = PromptTemplate(payload.template)
    except ValueError:
        return {"error": f"Unknown template: {payload.template}"}, 400

    personality = None
    if payload.personality:
        try:
            personality = AIPersonality(payload.personality)
        except ValueError:
            pass

    content = await generate_from_template(template_enum, payload.context, personality)

    # Determine which personality was used
    used_personality = personality if personality else AIPersonality.AVA_PROFESSIONAL
    if template_enum == PromptTemplate.LEAD_ANALYSIS:
        used_personality = AIPersonality.ANALYST
    elif template_enum in [
        PromptTemplate.EMAIL_SUBJECT_LINE,
        PromptTemplate.CALL_SCRIPT,
    ]:
        used_personality = AIPersonality.COPYWRITER

    return {
        "content": content,
        "template": payload.template,
        "personality": used_personality.value,
    }


class TemplatesListResponse(BaseModel):
    templates: List[Dict[str, str]]
    personalities: List[str]


@router.get("/ai/templates", response_model=TemplatesListResponse)
async def list_templates():
    """List all available prompt templates and personalities."""
    templates = [
        {"name": template.value, "description": get_template_description(template)}
        for template in PromptTemplate
    ]

    personalities = [p.value for p in AIPersonality]

    return {"templates": templates, "personalities": personalities}


def get_template_description(template: PromptTemplate) -> str:
    """Get human-readable description of template"""
    descriptions = {
        PromptTemplate.EMAIL_COLD_OUTREACH: "Generate cold outreach emails with personalization",
        PromptTemplate.EMAIL_FOLLOW_UP: "Create follow-up emails that add value",
        PromptTemplate.LINKEDIN_MESSAGE: "Write LinkedIn connection requests and messages",
        PromptTemplate.LEAD_ANALYSIS: "Analyze lead quality and recommend next actions",
        PromptTemplate.CAMPAIGN_STRATEGY: "Design multi-channel campaign strategies",
        PromptTemplate.OBJECTION_HANDLING: "Handle common sales objections",
        PromptTemplate.MEETING_PREP: "Prepare for sales meetings and demos",
        PromptTemplate.EMAIL_SUBJECT_LINE: "Generate A/B testable subject lines",
        PromptTemplate.CALL_SCRIPT: "Create call scripts for different scenarios",
        PromptTemplate.SMS_MESSAGE: "Write concise SMS outreach messages",
    }
    return descriptions.get(template, "No description available")
