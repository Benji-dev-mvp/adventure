"""
OpenAI Service
Clean integration for AI-powered email generation and chat
"""
import os
import logging
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

logger = logging.getLogger(__name__)

# Try to import OpenAI
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    logger.warning("OpenAI library not installed. Using mock responses.")


class EmailGenerationRequest(BaseModel):
    """Request for email generation"""
    persona: str  # e.g., "VP of Sales at a SaaS company"
    pain_point: str  # e.g., "low response rates on cold outreach"
    tone: str = "professional"  # professional, casual, friendly, urgent
    context: Optional[str] = None  # Additional context


class EmailGenerationResponse(BaseModel):
    """Generated email response"""
    subject: str
    body: str
    call_to_action: str
    tokens_used: int = 0
    model: str = "mock"


class OpenAIService:
    """
    OpenAI integration service
    Falls back to mock responses if API key not configured
    """
    
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.client = None
        self.model = os.getenv("OPENAI_MODEL", "gpt-4")
        
        if self.api_key and OPENAI_AVAILABLE:
            self.client = OpenAI(api_key=self.api_key)
            logger.info("OpenAI client initialized")
        else:
            logger.info("OpenAI not configured - using mock responses")
    
    def generate_email(
        self,
        persona: str,
        pain_point: str,
        tone: str = "professional",
        context: Optional[str] = None
    ) -> EmailGenerationResponse:
        """
        Generate a cold email using AI
        
        Args:
            persona: Target person description (e.g., "VP of Sales")
            pain_point: The problem they're facing
            tone: Email tone (professional, casual, friendly, urgent)
            context: Additional context about the outreach
        
        Returns:
            Generated email with subject and body
        """
        if not self.client:
            return self._mock_email(persona, pain_point, tone)
        
        prompt = self._build_email_prompt(persona, pain_point, tone, context)
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": """You are an expert B2B sales copywriter. Generate cold emails that:
                        - Are personalized and relevant
                        - Address specific pain points
                        - Have compelling subject lines
                        - Include clear calls to action
                        - Are concise (under 150 words for body)
                        
                        Format your response as:
                        SUBJECT: [subject line]
                        BODY: [email body]
                        CTA: [call to action]"""
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            content = response.choices[0].message.content
            tokens = response.usage.total_tokens if response.usage else 0
            
            return self._parse_email_response(content, tokens, self.model)
            
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            return self._mock_email(persona, pain_point, tone)
    
    def chat(
        self,
        message: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        system_prompt: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        General chat completion
        
        Args:
            message: User's message
            conversation_history: Previous messages in the conversation
            system_prompt: Custom system prompt
        
        Returns:
            AI response with metadata
        """
        if not self.client:
            return self._mock_chat(message)
        
        messages = []
        
        # Add system prompt
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        else:
            messages.append({
                "role": "system",
                "content": "You are Ava, an AI sales assistant. Help users with sales strategies, email writing, and lead management."
            })
        
        # Add conversation history
        if conversation_history:
            messages.extend(conversation_history)
        
        # Add current message
        messages.append({"role": "user", "content": message})
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=1000
            )
            
            return {
                "message": response.choices[0].message.content,
                "tokens_used": response.usage.total_tokens if response.usage else 0,
                "model": self.model,
                "finish_reason": response.choices[0].finish_reason
            }
            
        except Exception as e:
            logger.error(f"OpenAI chat error: {e}")
            return self._mock_chat(message)
    
    def personalize_template(
        self,
        template: str,
        lead_data: Dict[str, Any]
    ) -> str:
        """
        Personalize an email template using AI
        
        Args:
            template: Email template with {{placeholders}}
            lead_data: Lead information for personalization
        
        Returns:
            Personalized email content
        """
        if not self.client:
            # Simple replacement fallback
            result = template
            for key, value in lead_data.items():
                result = result.replace(f"{{{{{key}}}}}", str(value))
            return result
        
        prompt = f"""Personalize this email template for the following lead.
        
Template:
{template}

Lead Data:
{lead_data}

Instructions:
1. Replace all {{placeholders}} with appropriate values
2. Add relevant personalization based on the lead's company/role
3. Make the email feel natural, not templated
4. Keep the core message and structure intact

Return ONLY the personalized email, no explanations."""
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                max_tokens=800
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"Personalization error: {e}")
            # Fallback to simple replacement
            result = template
            for key, value in lead_data.items():
                result = result.replace(f"{{{{{key}}}}}", str(value))
            return result
    
    def _build_email_prompt(
        self,
        persona: str,
        pain_point: str,
        tone: str,
        context: Optional[str] = None
    ) -> str:
        """Build the prompt for email generation"""
        prompt = f"""Write a {tone} cold email to a {persona} who is dealing with {pain_point}.

The email should:
- Start with a hook that shows you understand their situation
- Briefly mention how you can help
- End with a soft call to action

Tone guidelines:
- professional: formal but approachable
- casual: conversational, like a colleague
- friendly: warm and personable  
- urgent: emphasize time-sensitivity"""
        
        if context:
            prompt += f"\n\nAdditional context: {context}"
        
        return prompt
    
    def _parse_email_response(
        self,
        content: str,
        tokens: int,
        model: str
    ) -> EmailGenerationResponse:
        """Parse the AI response into structured email"""
        lines = content.strip().split("\n")
        
        subject = ""
        body = ""
        cta = ""
        
        current_section = None
        for line in lines:
            line = line.strip()
            if line.upper().startswith("SUBJECT:"):
                subject = line[8:].strip()
                current_section = "subject"
            elif line.upper().startswith("BODY:"):
                body = line[5:].strip()
                current_section = "body"
            elif line.upper().startswith("CTA:"):
                cta = line[4:].strip()
                current_section = "cta"
            elif current_section == "body" and line:
                body += "\n" + line
            elif current_section == "cta" and line:
                cta += " " + line
        
        return EmailGenerationResponse(
            subject=subject or "Quick question",
            body=body.strip() or content,
            call_to_action=cta or "Would you be open to a quick call?",
            tokens_used=tokens,
            model=model
        )
    
    def _mock_email(
        self,
        persona: str,
        pain_point: str,
        tone: str
    ) -> EmailGenerationResponse:
        """Generate mock email when API not available"""
        return EmailGenerationResponse(
            subject=f"Quick question about {pain_point}",
            body=f"""Hi there,

I noticed that many {persona}s are struggling with {pain_point}.

We've helped similar companies overcome this challenge and achieve significant improvements in their outreach effectiveness.

Would you be open to a brief 15-minute call to explore how we might help?

Best regards""",
            call_to_action="Schedule a 15-minute call",
            tokens_used=0,
            model="mock"
        )
    
    def _mock_chat(self, message: str) -> Dict[str, Any]:
        """Mock chat response"""
        return {
            "message": f"Thanks for your message! I'm Ava, your AI sales assistant. You asked about: '{message[:50]}...' I'd be happy to help with that. (Note: OpenAI API not configured, using mock response)",
            "tokens_used": 0,
            "model": "mock",
            "finish_reason": "stop"
        }
    
    @property
    def is_configured(self) -> bool:
        """Check if OpenAI is properly configured"""
        return self.client is not None


# Singleton instance
openai_service = OpenAIService()
