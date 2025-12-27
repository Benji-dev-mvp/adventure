# Tailored LLM Guide - Artisan Platform

The Artisan platform now includes **domain-specific AI prompts and templates** tailored for B2B sales automation. This makes AI responses more relevant, accurate, and useful for sales teams.

## 🎯 What's New

### 1. **AI Personalities**
Choose how Ava responds to match your use case:

- **`ava_professional`** (Default) - Professional B2B sales expert
- **`ava_casual`** - Friendly, conversational sales buddy
- **`analyst`** - Data-focused, metrics-driven
- **`copywriter`** - Creative, persuasive messaging
- **`coach`** - Teaching-focused, step-by-step guidance

### 2. **Pre-Built Templates**
10 ready-to-use templates for common sales tasks:

- `email_cold_outreach` - Personalized cold emails
- `email_follow_up` - Strategic follow-ups
- `linkedin_message` - LinkedIn connection requests
- `lead_analysis` - Lead scoring and qualification
- `campaign_strategy` - Multi-channel campaign design
- `objection_handling` - Sales objection responses
- `meeting_prep` - Pre-meeting preparation
- `email_subject_line` - A/B testable subject lines
- `call_script` - Call scripts for different scenarios
- `sms_message` - Concise SMS outreach

### 3. **Context Injection**
Automatically includes platform-specific context:

- Your company information (Artisan)
- Product details (AI sales automation)
- Target industries (SaaS, Tech, etc.)
- Lead/prospect data
- Campaign history
- Best practices

## 🚀 Quick Start

### Using Personalities

**Frontend:**
```jsx
const response = await dataService.fetch('/api/ai/chat', {
  method: 'POST',
  body: JSON.stringify({
    prompt: 'How do I improve email open rates?',
    personality: 'analyst'  // Choose personality
  })
});
```

**Available personalities:**
- `ava_professional` - Default expert mode
- `ava_casual` - Friendly and conversational
- `analyst` - Data and metrics focused
- `copywriter` - Creative content generation
- `coach` - Educational guidance

### Using Templates

**Frontend:**
```jsx
const email = await dataService.fetch('/api/ai/generate-from-template', {
  method: 'POST',
  body: JSON.stringify({
    template: 'email_cold_outreach',
    context: {
      lead_name: 'Sarah Johnson',
      lead_title: 'VP of Sales',
      company: 'TechCorp',
      industry: 'SaaS',
      pain_point: 'manual prospecting taking too much time',
      tone: 'professional'
    }
  })
});

console.log(email.content); // Tailored cold email
```

**Backend:**
```python
from app.core.ai_provider import generate_from_template
from app.core.ai_prompts import PromptTemplate

content = await generate_from_template(
    PromptTemplate.EMAIL_COLD_OUTREACH,
    {
        "lead_name": "John Smith",
        "company": "Acme Corp",
        "pain_point": "low reply rates"
    }
)
```

## 📋 API Reference

### Chat with Personality

**Endpoint:** `POST /api/ai/chat`

**Request:**
```json
{
  "prompt": "Write a follow-up email",
  "personality": "copywriter",
  "additional_context": "Lead opened previous email 3 times",
  "history": [
    {"role": "user", "content": "Previous question"},
    {"role": "assistant", "content": "Previous answer"}
  ]
}
```

**Response:**
```json
{
  "role": "assistant",
  "content": "Here's a strategic follow-up approach...",
  "suggestions": ["Apply guardrail", "Schedule optimal window"],
  "personality": "copywriter"
}
```

### Generate from Template

**Endpoint:** `POST /api/ai/generate-from-template`

**Request:**
```json
{
  "template": "lead_analysis",
  "context": {
    "lead_name": "Jane Doe",
    "lead_title": "CTO",
    "company": "Innovation Labs",
    "email_opens": "3",
    "link_clicks": "2"
  },
  "personality": "analyst"
}
```

**Response:**
```json
{
  "content": "Lead Score: 85/100\nTier: Warm\n\nAnalysis: ...",
  "template": "lead_analysis",
  "personality": "analyst"
}
```

### List Available Templates

**Endpoint:** `GET /api/ai/templates`

**Response:**
```json
{
  "templates": [
    {
      "name": "email_cold_outreach",
      "description": "Generate cold outreach emails with personalization"
    },
    {
      "name": "lead_analysis",
      "description": "Analyze lead quality and recommend next actions"
    }
  ],
  "personalities": [
    "ava_professional",
    "ava_casual",
    "analyst",
    "copywriter",
    "coach"
  ]
}
```

## 💡 Use Cases

### 1. Generate Cold Email

```jsx
const email = await dataService.fetch('/api/ai/generate-from-template', {
  method: 'POST',
  body: JSON.stringify({
    template: 'email_cold_outreach',
    context: {
      lead_name: 'Sarah Johnson',
      lead_title: 'VP of Sales',
      company: 'TechCorp',
      industry: 'SaaS',
      company_size: '100-500',
      pain_point: 'manual outreach is inefficient',
      tone: 'professional',
      length: 'short'
    }
  })
});
```

**Output:**
```
Subject: Quick question about TechCorp's sales process

Hi Sarah,

I noticed TechCorp is growing fast in the SaaS space. Many VPs of Sales 
we work with struggle with manual outreach taking too much time.

We've helped similar companies save 15+ hours per week with AI-powered 
automation. Would you be open to a 15-min conversation next week?

Best,
[Your name]
```

### 2. Analyze Lead Quality

```jsx
const analysis = await dataService.fetch('/api/ai/generate-from-template', {
  method: 'POST',
  body: JSON.stringify({
    template: 'lead_analysis',
    context: {
      lead_name: 'John Smith',
      lead_title: 'CTO',
      company: 'Innovation Labs',
      industry: 'Technology',
      email_opens: '3',
      link_clicks: '2',
      replies: '0'
    },
    personality: 'analyst'
  })
});
```

**Output:**
```
Lead Score: 82/100
Tier: Warm

Analysis:
- Strong engagement (3 opens, 2 clicks)
- Senior technical role (CTO)
- Tech industry alignment
- No reply yet - needs value-add follow-up

Recommended Next Action:
Send follow-up email with specific technical value prop or case study. 
Mention the link they clicked (shows interest area).

Key Insights:
- High research phase activity
- Likely evaluating multiple solutions
- Technical decision maker

Potential Objections:
- "Already using X tool"
- "Need to see ROI data"
- "What's the implementation time?"
```

### 3. Get Subject Line Ideas

```jsx
const subjectLines = await dataService.fetch('/api/ai/generate-from-template', {
  method: 'POST',
  body: JSON.stringify({
    template: 'email_subject_line',
    context: {
      campaign_type: 'cold outreach',
      audience: 'VP of Sales at SaaS companies',
      benefit: 'save 15+ hours per week',
      tone: 'professional',
      goal: 'book demo calls'
    },
    personality: 'copywriter'
  })
});
```

**Output:**
```
10 A/B Testable Subject Lines:

Value-Based:
1. Save 15+ hours/week on sales outreach
2. {{Company}}: Your outreach could be 3x faster

Question-Based:
3. Still doing manual prospecting?
4. {{FirstName}}, wasting time on repetitive tasks?

Curiosity:
5. The secret to 40% higher reply rates
6. Why top SaaS sales teams switched to AI

Social Proof:
7. How {{Competitor}} books 3x more meetings
8. Join 500+ SaaS teams automating outreach

Urgency:
9. {{FirstName}} - 15 minutes could change everything
10. Your Q1 pipeline starts here
```

### 4. Handle Sales Objections

```jsx
const response = await dataService.fetch('/api/ai/generate-from-template', {
  method: 'POST',
  body: JSON.stringify({
    template: 'objection_handling',
    context: {
      objection: "We're happy with our current process",
      context: 'Mid-demo with VP of Sales',
      product_info: 'AI sales automation platform',
      tone: 'consultative'
    },
    personality: 'coach'
  })
});
```

**Output:**
```
Handling: "We're happy with our current process"

1. Empathetic Acknowledgment:
"That's great to hear you have a process that's working! Many of our best 
customers came to us in a similar position."

2. Clarifying Questions:
- "What's working best about your current approach?"
- "If you could wave a magic wand, what would you improve?"
- "How much time does your team spend on manual outreach weekly?"

3. Response Framework:
"What we're seeing is that teams who thought their process was working 
discovered they could [specific metric] without changing what's already 
working - just enhancing it with AI."

4. Proof Points:
- "[Similar company] said the same thing - they increased reply rates 
  by 40% in 30 days while keeping their process"
- "Most teams find 15+ hours/week they didn't know they were losing"

5. Path Forward:
"What if we spend 10 minutes looking at one specific area - like your 
follow-up sequence - and see if there's an opportunity to test?"
```

### 5. Design Campaign Strategy

```jsx
const strategy = await dataService.fetch('/api/ai/generate-from-template', {
  method: 'POST',
  body: JSON.stringify({
    template: 'campaign_strategy',
    context: {
      audience: 'Directors and VPs of Sales at 100-500 person companies',
      industry: 'B2B SaaS',
      goal: 'book 20 qualified demos per month',
      budget: 'mid-market',
      timeline: '90 days',
      channels: 'email, LinkedIn, calls'
    }
  })
});
```

## 🎨 Customizing Personalities

### Backend - Add Custom Personality

Edit `/workspaces/codespaces-react/backend/app/core/ai_prompts.py`:

```python
SYSTEM_PROMPTS[AIPersonality.YOUR_CUSTOM] = """
You are a [role description]...

Your expertise includes:
- Area 1
- Area 2

Your personality:
- Trait 1
- Trait 2

Guidelines:
- Guideline 1
- Guideline 2
"""
```

### Frontend - Use Custom Personality

```jsx
const response = await dataService.fetch('/api/ai/chat', {
  method: 'POST',
  body: JSON.stringify({
    prompt: 'Your question',
    personality: 'your_custom'  // Must match enum value
  })
});
```

## 📝 Creating Custom Templates

### 1. Define Template in `ai_prompts.py`

```python
PromptTemplate.YOUR_TEMPLATE = "your_template"

PROMPT_TEMPLATES[PromptTemplate.YOUR_TEMPLATE] = {
    "system": SYSTEM_PROMPTS[AIPersonality.AVA_PROFESSIONAL],
    "user_template": """Your template with {variables}:

Context: {context_var}
Goal: {goal_var}

Requirements:
- Requirement 1
- Requirement 2"""
}
```

### 2. Use Template

```jsx
const result = await dataService.fetch('/api/ai/generate-from-template', {
  method: 'POST',
  body: JSON.stringify({
    template: 'your_template',
    context: {
      variables: 'value',
      context_var: 'context',
      goal_var: 'goal'
    }
  })
});
```

## 🔧 Context Injection

### Automatic Platform Context

The system automatically injects Artisan platform details:

```python
PLATFORM_CONTEXT = {
    "company_name": "Artisan",
    "product_description": "AI-powered B2B sales automation",
    "key_benefits": ["Automate tasks", "AI scoring", "Multi-channel"],
    "target_industries": ["SaaS", "Technology", "Finance"]
}
```

### Custom Context

```python
from app.core.ai_prompts import PromptBuilder

builder = PromptBuilder()

# Inject lead context
lead_context = builder.inject_lead_context({
    "name": "Jane Doe",
    "title": "VP Sales",
    "company": "Acme",
    "activity": [...]
})

# Use in prompt
messages = builder.build_custom(
    "Analyze this lead",
    additional_context=lead_context
)
```

## 🧪 Testing

Run the test suite:

```bash
cd backend
python test_tailored_llm.py
```

This tests:
- All personalities
- All templates
- Context injection
- Prompt building

## 📊 Best Practices

1. **Choose the right personality:**
   - Use `analyst` for data/metrics questions
   - Use `copywriter` for content generation
   - Use `coach` for training/guidance
   - Use `ava_professional` for general sales advice

2. **Provide complete context:**
   - More context = better results
   - Include lead engagement history
   - Mention industry and company size
   - Specify desired tone and length

3. **Use templates for consistency:**
   - Templates ensure quality output
   - Pre-tested prompts work better
   - Easier to A/B test variations

4. **Combine with conversation history:**
   - Multi-turn conversations provide better context
   - Reference previous exchanges
   - Build on prior answers

## 🔗 Integration Examples

### Campaign Builder Integration

```jsx
// In CampaignBuilder component
const generateCampaignContent = async (step) => {
  const response = await dataService.fetch('/api/ai/generate-from-template', {
    method: 'POST',
    body: JSON.stringify({
      template: step.channel === 'email' 
        ? 'email_cold_outreach' 
        : 'linkedin_message',
      context: {
        lead_name: '{{firstName}}',
        company: '{{company}}',
        pain_point: campaignObjective,
        tone: selectedTone
      }
    })
  });
  
  return response.content;
};
```

### Lead Scoring Integration

```jsx
// In LeadDatabase component
const analyzeLeadWithAI = async (lead) => {
  const analysis = await dataService.fetch('/api/ai/generate-from-template', {
    method: 'POST',
    body: JSON.stringify({
      template: 'lead_analysis',
      context: {
        lead_name: lead.name,
        lead_title: lead.title,
        company: lead.company,
        email_opens: lead.emailOpens,
        link_clicks: lead.linkClicks
      },
      personality: 'analyst'
    })
  });
  
  // Parse and display analysis
  setLeadAnalysis(analysis.content);
};
```

## 📖 Related Documentation

- [LLM_INTEGRATION.md](./LLM_INTEGRATION.md) - Core LLM setup
- [LLM_QUICK_START.md](../LLM_QUICK_START.md) - Getting started
- [LLM_EXAMPLES.md](../LLM_EXAMPLES.md) - Code examples

## 🎯 Summary

The tailored LLM system provides:

✅ **5 AI personalities** for different use cases
✅ **10 pre-built templates** for common sales tasks  
✅ **Automatic context injection** with platform data
✅ **Domain-specific prompts** for B2B sales
✅ **Consistent, high-quality outputs**
✅ **Easy customization** and extension

This makes AI responses more relevant, accurate, and immediately useful for your sales team!
