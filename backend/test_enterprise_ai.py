"""
Test Enterprise AI Models

Verify that all new models can be imported and instantiated.
"""

def test_model_imports():
    """Test that all enterprise AI models can be imported"""
    try:
        from app.models.ai_enterprise import (
            ModelPolicy,
            ModelHealthMetric,
            MemoryPolicy,
            MemoryAuditLog,
            KnowledgeGraphEntity,
            KnowledgeGraphRelation,
            UsageMeteringRecord,
            TenantUsageQuota,
            VoiceSession,
            VoiceTranscriptChunk,
            VectorSearchMetric,
            EmailPerformanceMetric,
            LeadScoreAccuracyMetric,
            AIResponseQualityFeedback,
        )
        print("✓ All models imported successfully")
        return True
    except Exception as e:
        print(f"✗ Model import failed: {e}")
        return False


def test_service_imports():
    """Test that all services can be imported"""
    try:
        from app.services.memory_governance import MemoryGovernanceService, PIIScrubber
        from app.services.voice_intelligence import VoiceIntelligenceService
        from app.services.usage_metering import UsageAnalyticsService
        print("✓ All services imported successfully")
        return True
    except Exception as e:
        print(f"✗ Service import failed: {e}")
        return False


def test_task_imports():
    """Test that all tasks can be imported"""
    try:
        from app.tasks.ai_workflows import (
            daily_lead_scoring_refresh,
            auto_enrichment_job,
            scheduled_campaign_run,
            drip_workflow_trigger,
            follow_up_automation,
            memory_ttl_cleanup,
        )
        print("✓ All tasks imported successfully")
        return True
    except Exception as e:
        print(f"✗ Task import failed: {e}")
        return False


def test_api_route_imports():
    """Test that API routes can be imported"""
    try:
        from app.api.routes.ai_enterprise import router
        print("✓ API routes imported successfully")
        return True
    except Exception as e:
        print(f"✗ API route import failed: {e}")
        return False


def test_orchestrator_extensions():
    """Test orchestrator extensions"""
    try:
        from app.core.ai_orchestrator import ModelPolicyManager, model_policy_manager
        print("✓ Orchestrator extensions imported successfully")
        return True
    except Exception as e:
        print(f"✗ Orchestrator extension import failed: {e}")
        return False


def test_rag_extensions():
    """Test RAG extensions"""
    try:
        from app.integrations.llamaindex_rag import LlamaIndexRAG
        # Check if new methods exist
        rag = LlamaIndexRAG()
        assert hasattr(rag, 'ingest_graph_documents')
        assert hasattr(rag, 'query_knowledge_graph')
        print("✓ RAG extensions verified successfully")
        return True
    except Exception as e:
        print(f"✗ RAG extension verification failed: {e}")
        return False


if __name__ == "__main__":
    print("Testing Enterprise AI Implementation...\n")
    
    results = []
    results.append(("Model Imports", test_model_imports()))
    results.append(("Service Imports", test_service_imports()))
    results.append(("Task Imports", test_task_imports()))
    results.append(("API Route Imports", test_api_route_imports()))
    results.append(("Orchestrator Extensions", test_orchestrator_extensions()))
    results.append(("RAG Extensions", test_rag_extensions()))
    
    print("\n" + "="*50)
    print("Test Summary:")
    print("="*50)
    
    for name, passed in results:
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{name:.<40} {status}")
    
    total = len(results)
    passed = sum(1 for _, p in results if p)
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Enterprise AI implementation is ready.")
        exit(0)
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please review errors above.")
        exit(1)
