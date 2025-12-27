"""
Quick test script for LLM integration
Run: python test_llm.py
"""
import asyncio
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.ai_provider import llm_client, chat, draft_email, simple_lead_score


async def test_basic_chat():
    """Test basic chat functionality"""
    print("\n=== Testing Basic Chat ===")
    print(f"Provider: {llm_client.provider.value}")
    print(f"Model: {llm_client.model}")
    
    response = await chat("What are 3 tips for writing cold emails?")
    print(f"\nResponse:\n{response['content']}")
    print(f"Suggestions: {response['suggestions']}")


async def test_email_generation():
    """Test email generation"""
    print("\n=== Testing Email Generation ===")
    
    lead = {
        "name": "Sarah Johnson",
        "company": "TechCorp",
        "title": "VP of Sales"
    }
    
    email = draft_email(
        lead=lead,
        prompt="I'd like to schedule a demo of our sales automation platform",
        tone="professional",
        length="medium"
    )
    
    print(f"Subject: {email['subject']}")
    print(f"\nBody:\n{email['body']}")


def test_lead_scoring():
    """Test lead scoring"""
    print("\n=== Testing Lead Scoring ===")
    
    lead = {
        "name": "John Smith",
        "title": "VP of Marketing",
        "company": "SaaS Startup",
        "industry": "SaaS",
        "activity": [
            {"type": "email_opened"},
            {"type": "email_opened"},
            {"type": "link_clicked"}
        ]
    }
    
    score = simple_lead_score(lead)
    print(f"Score: {score['score']}/100")
    print(f"Tier: {score['tier']}")
    print(f"Rationale: {score['rationale']}")


async def test_streaming():
    """Test streaming chat"""
    print("\n=== Testing Streaming Chat ===")
    
    messages = [{"role": "user", "content": "Write a short cold email subject line"}]
    
    if llm_client.provider.value != "mock":
        print("Streaming response: ", end="", flush=True)
        result = await llm_client.chat(messages, stream=True)
        async for chunk in result:
            print(chunk, end="", flush=True)
        print("\n")
    else:
        print("Streaming not available in mock mode")


async def main():
    """Run all tests"""
    print("=" * 60)
    print("LLM Integration Test Suite")
    print("=" * 60)
    
    try:
        await test_basic_chat()
        await test_email_generation()
        test_lead_scoring()
        await test_streaming()
        
        print("\n" + "=" * 60)
        print("✅ All tests completed successfully!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
