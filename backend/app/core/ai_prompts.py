"""
Custom AI prompts tailored for Artisan B2B sales automation platform.

Provides domain-specific system prompts, templates, and context injection
for different use cases like email generation, lead analysis, campaign optimization.
"""

from enum import Enum
from typing import Dict, Any, List


class AIPersonality(str, Enum):
    """Different AI assistant personalities"""
    AVA_PROFESSIONAL = "ava_professional"  # Default Ava persona
    AVA_CASUAL = "ava_casual"  # Friendly, conversational Ava
    ANALYST = "analyst"  # Data-focused, analytical
    COPYWRITER = "copywriter"  # Creative, persuasive
    COACH = "coach"  # Teaching, guiding


class PromptTemplate(str, Enum):
    """Pre-built prompt templates for common tasks"""
    EMAIL_COLD_OUTREACH = "email_cold_outreach"
    EMAIL_FOLLOW_UP = "email_follow_up"
    LINKEDIN_MESSAGE = "linkedin_message"
    LEAD_ANALYSIS = "lead_analysis"
    CAMPAIGN_STRATEGY = "campaign_strategy"
    OBJECTION_HANDLING = "objection_handling"
    MEETING_PREP = "meeting_prep"
    EMAIL_SUBJECT_LINE = "email_subject_line"
    CALL_SCRIPT = "call_script"
    SMS_MESSAGE = "sms_message"


# System prompts for different personalities
SYSTEM_PROMPTS = {
    AIPersonality.AVA_PROFESSIONAL: """You are Ava, an expert AI sales assistant for the Artisan B2B sales automation platform.

Your expertise includes:
- Multi-channel outbound campaigns (email, LinkedIn, SMS, calls)
- Lead scoring and qualification
- Sales copywriting and personalization
- Campaign optimization and A/B testing
- Reply rate and conversion optimization

Your personality:
- Professional yet approachable
- Data-driven and strategic
- Action-oriented with specific recommendations
- Empathetic to sales challenges

Guidelines:
- Provide specific, actionable advice
- Reference data and best practices when available
- Keep responses concise but comprehensive
- Use examples from B2B sales context
- Always consider ROI and efficiency""",

    AIPersonality.AVA_CASUAL: """You are Ava, a friendly AI sales assistant who helps teams crush their B2B sales goals.

You're like a smart colleague who:
- Gets excited about wins and optimizations
- Speaks naturally, not like a robot
- Shares practical tips from the trenches
- Celebrates progress and encourages experimentation

Your style:
- Conversational and relatable
- Uses modern sales lingo (but not too much)
- Occasionally uses emojis to emphasize points
- Tells it straight but stays positive

You still bring the same expertise - lead scoring, multi-channel campaigns, copy optimization - just with more personality!""",

    AIPersonality.ANALYST: """You are a data-driven B2B sales analyst specializing in performance metrics and optimization.

Your focus:
- Statistical analysis of campaign performance
- Lead scoring algorithms and conversion funnels
- A/B test design and interpretation
- ROI calculations and forecasting
- Identifying patterns in sales data

Your approach:
- Lead with numbers and data
- Provide confidence intervals when estimating
- Recommend data-driven experiments
- Explain statistical significance
- Visualize findings when possible""",

    AIPersonality.COPYWRITER: """You are a creative B2B sales copywriter with a track record of high-converting campaigns.

Your strengths:
- Compelling subject lines that get opened
- Personalized email copy that drives replies
- Clear value propositions
- Overcoming objections through copy
- Multi-channel messaging consistency

Your style:
- Creative but professional
- Benefit-focused, not feature-focused
- Uses storytelling and social proof
- Tests multiple angles
- Writes for the reader, not yourself""",

    AIPersonality.COACH: """You are a sales coach helping teams improve their B2B outreach and conversion skills.

Your role:
- Teach best practices step-by-step
- Explain the "why" behind strategies
- Provide feedback on current approaches
- Help build systematic processes
- Encourage continuous improvement

Your method:
- Ask questions to understand context
- Break complex topics into steps
- Share frameworks and models
- Celebrate progress and learning
- Adapt explanations to skill level"""
}


# Domain-specific prompt templates
PROMPT_TEMPLATES = {
    PromptTemplate.EMAIL_COLD_OUTREACH: {
        "system": SYSTEM_PROMPTS[AIPersonality.AVA_PROFESSIONAL],
        "user_template": """Write a cold outreach email for:

Target: {lead_name} - {lead_title} at {company}
Industry: {industry}
Company Size: {company_size}
Pain Point: {pain_point}
Our Solution: {solution}
Tone: {tone}
Length: {length}

Requirements:
- Compelling subject line
- Personalized opening
- Clear value proposition
- Specific CTA
- Keep it under 150 words"""
    },
    
    PromptTemplate.EMAIL_FOLLOW_UP: {
        "system": SYSTEM_PROMPTS[AIPersonality.AVA_PROFESSIONAL],
        "user_template": """Write a follow-up email for:

Original Email: {original_subject}
Recipient: {lead_name} at {company}
Days Since Last Email: {days_since}
Previous Engagement: {engagement}
Next Step: {desired_action}
Tone: {tone}

Requirements:
- Reference previous email naturally
- Add new value or insight
- Non-pushy but clear CTA
- Keep brief (75-100 words)"""
    },

    PromptTemplate.LINKEDIN_MESSAGE: {
        "system": SYSTEM_PROMPTS[AIPersonality.AVA_CASUAL],
        "user_template": """Write a LinkedIn connection/message for:

Target: {lead_name} - {lead_title} at {company}
Connection Reason: {reason}
Mutual Interests: {mutual_interests}
Our Value: {value_prop}
Tone: {tone}

Requirements:
- Conversational, not salesy
- Mention specific mutual connection or interest
- Under 150 characters (LinkedIn limits)
- Clear but soft CTA"""
    },

    PromptTemplate.LEAD_ANALYSIS: {
        "system": SYSTEM_PROMPTS[AIPersonality.ANALYST],
        "user_template": """Analyze this lead:

Name: {lead_name}
Title: {lead_title}
Company: {company}
Industry: {industry}
Employee Count: {employee_count}
Recent Activity: {activity}
Email Opens: {email_opens}
Link Clicks: {link_clicks}
Replies: {replies}

Provide:
1. Lead Score (0-100) with rationale
2. Tier (Hot/Warm/Cold)
3. Recommended next action
4. Key insights
5. Potential objections to prepare for"""
    },

    PromptTemplate.CAMPAIGN_STRATEGY: {
        "system": SYSTEM_PROMPTS[AIPersonality.AVA_PROFESSIONAL],
        "user_template": """Design a multi-channel campaign strategy for:

Target Audience: {audience}
Industry: {industry}
Goal: {goal}
Budget: {budget}
Timeline: {timeline}
Channels Available: {channels}

Provide:
1. Channel mix recommendation
2. Sequence structure (touchpoints & timing)
3. Messaging themes per channel
4. Expected metrics and KPIs
5. A/B test recommendations"""
    },

    PromptTemplate.OBJECTION_HANDLING: {
        "system": SYSTEM_PROMPTS[AIPersonality.COACH],
        "user_template": """Help handle this sales objection:

Objection: "{objection}"
Context: {context}
Our Product: {product_info}
Competitor: {competitor}

Provide:
1. Empathetic acknowledgment
2. Clarifying questions to ask
3. Response framework
4. Proof points or social proof to share
5. Path forward"""
    },

    PromptTemplate.EMAIL_SUBJECT_LINE: {
        "system": SYSTEM_PROMPTS[AIPersonality.COPYWRITER],
        "user_template": """Generate 10 email subject lines for:

Campaign Type: {campaign_type}
Target Audience: {audience}
Main Benefit: {benefit}
Tone: {tone}
Goal: {goal}

Requirements:
- Mix of approaches (question, curiosity, value, urgency)
- Under 50 characters
- No spam trigger words
- A/B testable pairs"""
    },

    PromptTemplate.CALL_SCRIPT: {
        "system": SYSTEM_PROMPTS[AIPersonality.AVA_PROFESSIONAL],
        "user_template": """Create a call script for:

Call Type: {call_type}
Prospect: {lead_name} at {company}
Call Objective: {objective}
Time Available: {duration} minutes
Key Points to Cover: {key_points}

Include:
1. Opening (first 30 seconds)
2. Discovery questions
3. Value proposition
4. Objection responses
5. Closing/next steps"""
    },

    PromptTemplate.SMS_MESSAGE: {
        "system": SYSTEM_PROMPTS[AIPersonality.AVA_CASUAL],
        "user_template": """Write an SMS message for:

Recipient: {lead_name}
Context: {context}
Goal: {goal}
Tone: {tone}

Requirements:
- Under 160 characters
- Include name
- Clear CTA
- Professional but conversational
- No links (unless requested)"""
    },

    PromptTemplate.MEETING_PREP: {
        "system": SYSTEM_PROMPTS[AIPersonality.COACH],
        "user_template": """Prepare me for this meeting:

Attendees: {attendees}
Company: {company}
Meeting Purpose: {purpose}
Their Pain Points: {pain_points}
Our Solution: {solution}
Meeting Duration: {duration}

Provide:
1. Pre-meeting research checklist
2. Opening strategy
3. Key questions to ask
4. Demo/presentation outline
5. Potential objections and responses
6. Closing strategy"""
    }
}


class PromptBuilder:
    """Build customized prompts with context injection"""
    
    def __init__(self, personality: AIPersonality = AIPersonality.AVA_PROFESSIONAL):
        self.personality = personality
        self.system_prompt = SYSTEM_PROMPTS[personality]
    
    def build_from_template(
        self, 
        template: PromptTemplate, 
        context: Dict[str, Any]
    ) -> List[Dict[str, str]]:
        """Build prompt messages from template with context"""
        template_config = PROMPT_TEMPLATES[template]
        
        # Use template's system prompt or default
        system = template_config.get("system", self.system_prompt)
        user_template = template_config["user_template"]
        
        # Inject context into user prompt
        user_prompt = user_template.format(**self._fill_defaults(context))
        
        return [
            {"role": "system", "content": system},
            {"role": "user", "content": user_prompt}
        ]
    
    def build_custom(
        self,
        user_prompt: str,
        additional_context: str = "",
        conversation_history: List[Dict[str, str]] = None
    ) -> List[Dict[str, str]]:
        """Build custom prompt with optional context and history"""
        messages = [{"role": "system", "content": self.system_prompt}]
        
        # Add conversation history if provided
        if conversation_history:
            messages.extend(conversation_history)
        
        # Add context to user prompt if provided
        full_prompt = user_prompt
        if additional_context:
            full_prompt = f"Context: {additional_context}\n\nQuestion: {user_prompt}"
        
        messages.append({"role": "user", "content": full_prompt})
        
        return messages
    
    def inject_company_context(self, context: Dict[str, Any]) -> str:
        """Create context string from company/platform data"""
        ctx_parts = []
        
        if context.get("company_name"):
            ctx_parts.append(f"Our Company: {context['company_name']}")
        
        if context.get("product_description"):
            ctx_parts.append(f"Our Product: {context['product_description']}")
        
        if context.get("target_industries"):
            industries = ", ".join(context['target_industries'])
            ctx_parts.append(f"Target Industries: {industries}")
        
        if context.get("key_benefits"):
            benefits = ", ".join(context['key_benefits'])
            ctx_parts.append(f"Key Benefits: {benefits}")
        
        if context.get("case_studies"):
            ctx_parts.append(f"Success Stories: {len(context['case_studies'])} case studies available")
        
        return "\n".join(ctx_parts)
    
    def inject_lead_context(self, lead: Dict[str, Any]) -> str:
        """Create context string from lead data"""
        ctx = f"Lead: {lead.get('name', 'Unknown')}"
        
        if lead.get('title'):
            ctx += f"\nTitle: {lead['title']}"
        if lead.get('company'):
            ctx += f"\nCompany: {lead['company']}"
        if lead.get('industry'):
            ctx += f"\nIndustry: {lead['industry']}"
        if lead.get('company_size'):
            ctx += f"\nCompany Size: {lead['company_size']}"
        
        # Add engagement data
        activity = lead.get('activity', [])
        if activity:
            ctx += f"\nRecent Activity: {len(activity)} interactions"
            opens = sum(1 for a in activity if 'open' in a.get('type', '').lower())
            clicks = sum(1 for a in activity if 'click' in a.get('type', '').lower())
            if opens:
                ctx += f"\n- Email opens: {opens}"
            if clicks:
                ctx += f"\n- Link clicks: {clicks}"
        
        return ctx
    
    def _fill_defaults(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Fill missing context values with defaults"""
        defaults = {
            "lead_name": "there",
            "lead_title": "Decision Maker",
            "company": "their company",
            "industry": "Technology",
            "company_size": "50-200 employees",
            "pain_point": "improving sales efficiency",
            "solution": "our sales automation platform",
            "tone": "professional",
            "length": "medium",
            "engagement": "no engagement yet",
            "channels": "email, LinkedIn",
            "goal": "book a meeting",
            "duration": "15",
            "call_type": "discovery",
            "campaign_type": "cold outreach",
            "audience": "B2B decision makers",
            "benefit": "save time and increase conversions",
            "context": "initial outreach",
            "objective": "qualify and schedule next meeting",
            "key_points": "product value, their needs, timeline",
            "days_since": "3",
            "original_subject": "previous email",
            "desired_action": "schedule a call",
            "reason": "shared interest in sales automation",
            "mutual_interests": "B2B sales optimization",
            "value_prop": "help improve sales efficiency",
            "activity": "opened 2 emails, clicked 1 link",
            "email_opens": "2",
            "link_clicks": "1",
            "replies": "0",
            "budget": "standard",
            "timeline": "30 days",
            "objection": "unknown",
            "product_info": "B2B sales automation platform",
            "competitor": "traditional approaches",
            "attendees": "decision makers",
            "purpose": "discovery",
            "pain_points": "current process inefficiencies",
            "employee_count": "100-500"
        }
        
        # Merge with provided context
        return {**defaults, **context}


# Tone modifiers for personality adjustment
TONE_MODIFIERS = {
    "professional": "Maintain a professional, business-appropriate tone.",
    "casual": "Use a friendly, conversational tone while staying professional.",
    "enthusiastic": "Be energetic and excited about the opportunity.",
    "consultative": "Take an advisory, expert consultant approach.",
    "direct": "Be straightforward and to-the-point, no fluff.",
    "empathetic": "Show understanding of their challenges and pain points.",
    "urgent": "Create appropriate sense of timeliness without being pushy."
}


def get_tone_instruction(tone: str) -> str:
    """Get instruction for tone modification"""
    return TONE_MODIFIERS.get(tone, TONE_MODIFIERS["professional"])


# Platform-specific context (can be loaded from settings/database)
PLATFORM_CONTEXT = {
    "company_name": "Artisan",
    "product_description": "AI-powered B2B sales automation platform with multi-channel outreach",
    "key_benefits": [
        "Automate repetitive outreach tasks",
        "AI-powered lead scoring",
        "Multi-channel campaigns (email, LinkedIn, SMS, calls)",
        "Real-time analytics and optimization",
        "Personalization at scale"
    ],
    "target_industries": ["SaaS", "Technology", "Professional Services", "Finance"],
    "unique_features": [
        "Ava AI assistant for real-time guidance",
        "Predictive lead scoring",
        "Automated A/B testing",
        "CRM integration"
    ]
}
