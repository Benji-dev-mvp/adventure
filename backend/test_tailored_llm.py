"""
Test script for tailored AI prompts and templates
Run: python test_tailored_llm.py
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.ai_provider import generate_from_template, chat
from app.core.ai_prompts import (
    PromptTemplate,
    AIPersonality,
    PromptBuilder,
    PLATFORM_CONTEXT
)


async def test_personalities():
    """Test different AI personalities"""
    print("\n=== Testing AI Personalities ===\n")
    
    test_prompt = "How do I improve my cold email open rates?"
    
    personalities = [
        AIPersonality.AVA_PROFESSIONAL,
        AIPersonality.AVA_CASUAL,
        AIPersonality.ANALYST,
        AIPersonality.COACH
    ]
    
    for personality in personalities:
        print(f"\n--- {personality.value.upper()} ---")
        response = await chat(test_prompt, personality=personality)
        print(f"{response['content'][:200]}...")


async def test_email_template():
    """Test cold email template"""
    print("\n=== Testing Email Cold Outreach Template ===\n")
    
    context = {
        "lead_name": "Sarah Johnson",
        "lead_title": "VP of Sales",
        "company": "TechCorp",
        "industry": "SaaS",
        "company_size": "100-500 employees",
        "pain_point": "manual outreach processes taking too much time",
        "solution": "AI-powered sales automation that saves 15+ hours per week",
        "tone": "professional",
        "length": "short"
    }
    
    content = await generate_from_template(
        PromptTemplate.EMAIL_COLD_OUTREACH,
        context
    )
    
    print(f"Generated Email:\n{content}")


async def test_lead_analysis():
    """Test lead analysis template"""
    print("\n=== Testing Lead Analysis Template ===\n")
    
    context = {
        "lead_name": "John Smith",
        "lead_title": "CTO",
        "company": "Innovation Labs",
        "industry": "Technology",
        "employee_count": "200-500",
        "activity": "Opened 3 emails, clicked 2 links, visited pricing page",
        "email_opens": "3",
        "link_clicks": "2",
        "replies": "0"
    }
    
    analysis = await generate_from_template(
        PromptTemplate.LEAD_ANALYSIS,
        context,
        personality=AIPersonality.ANALYST
    )
    
    print(f"Lead Analysis:\n{analysis}")


async def test_subject_lines():
    """Test subject line generation"""
    print("\n=== Testing Email Subject Line Template ===\n")
    
    context = {
        "campaign_type": "cold outreach",
        "audience": "VP of Sales at mid-market SaaS companies",
        "benefit": "reduce sales cycle by 40%",
        "tone": "professional",
        "goal": "book demo calls"
    }
    
    subject_lines = await generate_from_template(
        PromptTemplate.EMAIL_SUBJECT_LINE,
        context
    )
    
    print(f"Subject Lines:\n{subject_lines}")


async def test_linkedin_message():
    """Test LinkedIn message template"""
    print("\n=== Testing LinkedIn Message Template ===\n")
    
    context = {
        "lead_name": "Michael Chen",
        "lead_title": "Director of Revenue Operations",
        "company": "GrowthTech",
        "reason": "noticed your post about sales automation",
        "mutual_interests": "optimizing B2B sales processes",
        "value_prop": "help teams achieve 3x more meetings",
        "tone": "casual"
    }
    
    message = await generate_from_template(
        PromptTemplate.LINKEDIN_MESSAGE,
        context
    )
    
    print(f"LinkedIn Message:\n{message}")


async def test_objection_handling():
    """Test objection handling template"""
    print("\n=== Testing Objection Handling Template ===\n")
    
    context = {
        "objection": "We're already using Salesforce and it works fine",
        "context": "Mid-demo with VP of Sales at 200-person company",
        "product_info": "Artisan AI sales automation - works with Salesforce",
        "competitor": "Salesforce without AI automation"
    }
    
    response = await generate_from_template(
        PromptTemplate.OBJECTION_HANDLING,
        context,
        personality=AIPersonality.COACH
    )
    
    print(f"Objection Response:\n{response}")


async def test_campaign_strategy():
    """Test campaign strategy template"""
    print("\n=== Testing Campaign Strategy Template ===\n")
    
    context = {
        "audience": "VPs and Directors of Sales at 50-500 person SaaS companies",
        "industry": "B2B SaaS",
        "goal": "book 20 qualified demos per month",
        "budget": "mid-market",
        "timeline": "90 days",
        "channels": "email, LinkedIn, calls"
    }
    
    strategy = await generate_from_template(
        PromptTemplate.CAMPAIGN_STRATEGY,
        context
    )
    
    print(f"Campaign Strategy:\n{strategy[:500]}...")


async def test_context_injection():
    """Test context injection"""
    print("\n=== Testing Context Injection ===\n")
    
    builder = PromptBuilder(personality=AIPersonality.AVA_PROFESSIONAL)
    
    # Test company context
    print("\n--- Company Context ---")
    company_ctx = builder.inject_company_context(PLATFORM_CONTEXT)
    print(company_ctx)
    
    # Test lead context
    print("\n--- Lead Context ---")
    lead = {
        "name": "Jane Doe",
        "title": "VP Marketing",
        "company": "Acme Corp",
        "industry": "SaaS",
        "company_size": "100-200",
        "activity": [
            {"type": "email_opened"},
            {"type": "link_clicked"},
            {"type": "email_opened"}
        ]
    }
    lead_ctx = builder.inject_lead_context(lead)
    print(lead_ctx)


def test_prompt_builder():
    """Test prompt builder without API calls"""
    print("\n=== Testing Prompt Builder ===\n")
    
    builder = PromptBuilder(personality=AIPersonality.AVA_CASUAL)
    
    # Test building from template
    messages = builder.build_from_template(
        PromptTemplate.EMAIL_COLD_OUTREACH,
        {
            "lead_name": "Test Lead",
            "company": "Test Corp"
        }
    )
    
    print(f"System Prompt Length: {len(messages[0]['content'])} chars")
    print(f"User Prompt Preview: {messages[1]['content'][:150]}...")
    
    # Test custom prompt
    custom = builder.build_custom(
        "Help me write an email",
        additional_context="Lead is interested in automation"
    )
    
    print(f"\nCustom Prompt Messages: {len(custom)}")


async def main():
    """Run all tests"""
    print("=" * 60)
    print("Tailored LLM Test Suite")
    print("=" * 60)
    
    try:
        # Quick non-async tests
        test_prompt_builder()
        
        # Async tests (only run if not in mock mode or just show what would happen)
        print("\n\n🤖 Testing with AI Provider...")
        print("(Using mock responses in development mode)\n")
        
        await test_personalities()
        await test_email_template()
        await test_subject_lines()
        await test_linkedin_message()
        await test_lead_analysis()
        await test_objection_handling()
        await test_campaign_strategy()
        await test_context_injection()
        
        print("\n" + "=" * 60)
        print("✅ All tests completed!")
        print("=" * 60)
        print("\nTo use real AI, configure your API key in backend/.env:")
        print("  AI_PROVIDER=openai")
        print("  AI_API_KEY=sk-your-key-here")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
