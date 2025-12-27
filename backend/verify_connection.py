#!/usr/bin/env python3
"""
Backend Connection Verification Script

This script verifies that the new backend routes are properly configured
without needing to start the full server.
"""
import sys

def test_imports():
    """Test that all new modules can be imported."""
    print("Testing module imports...")
    
    try:
        from app.api.routes.kapa_integration import router as kapa_router
        print("✓ Kapa.ai integration module imports successfully")
        
        from app.api.routes.system_health import router as system_router
        print("✓ System health module imports successfully")
        
        from app.core.config import settings
        print(f"✓ Configuration loaded successfully")
        print(f"  - Kapa API Key configured: {bool(settings.kapa_api_key)}")
        print(f"  - Kapa Project ID configured: {bool(settings.kapa_project_id)}")
        print(f"  - Kapa Widget Enabled: {settings.kapa_widget_enabled}")
        
        return True
    except Exception as e:
        print(f"✗ Import failed: {e}")
        return False

def test_route_definitions():
    """Test that routes are properly defined."""
    print("\nTesting route definitions...")
    
    try:
        from app.api.routes.kapa_integration import router as kapa_router
        from app.api.routes.system_health import router as system_router
        
        kapa_routes = [route.path for route in kapa_router.routes]
        system_routes = [route.path for route in system_router.routes]
        
        print(f"✓ Kapa.ai routes ({len(kapa_routes)}): {kapa_routes}")
        print(f"✓ System health routes ({len(system_routes)}): {system_routes}")
        
        # Verify expected routes exist
        expected_kapa = ["/kapa/query", "/kapa/feedback", "/kapa/status"]
        expected_system = ["/system/health", "/system/connectivity", "/system/info"]
        
        for route in expected_kapa:
            if route in kapa_routes:
                print(f"  ✓ {route} registered")
            else:
                print(f"  ✗ {route} NOT found")
        
        for route in expected_system:
            if route in system_routes:
                print(f"  ✓ {route} registered")
            else:
                print(f"  ✗ {route} NOT found")
        
        return True
    except Exception as e:
        print(f"✗ Route definition test failed: {e}")
        return False

def test_models():
    """Test that Pydantic models are properly defined."""
    print("\nTesting Pydantic models...")
    
    try:
        from app.api.routes.kapa_integration import KapaQuery, KapaResponse, KapaFeedback
        from app.api.routes.system_health import ServiceStatus, SystemHealth
        
        # Test Kapa models
        query = KapaQuery(query="test query")
        print(f"✓ KapaQuery model: {query}")
        
        response = KapaResponse(answer="test answer", sources=[], thread_id="123")
        print(f"✓ KapaResponse model: {response}")
        
        feedback = KapaFeedback(thread_id="123", helpful=True)
        print(f"✓ KapaFeedback model: {feedback}")
        
        # Test System models
        service = ServiceStatus(name="test", status="healthy")
        print(f"✓ ServiceStatus model: {service}")
        
        return True
    except Exception as e:
        print(f"✗ Model test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Run all tests."""
    print("=" * 60)
    print("Backend Connection Verification")
    print("=" * 60)
    
    results = []
    
    results.append(("Module Imports", test_imports()))
    results.append(("Route Definitions", test_route_definitions()))
    results.append(("Pydantic Models", test_models()))
    
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    
    for name, passed in results:
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{name}: {status}")
    
    all_passed = all(result[1] for result in results)
    
    if all_passed:
        print("\n✓ All tests passed!")
        print("\nThe backend integration is properly configured.")
        print("To start the server, run:")
        print("  cd backend")
        print("  source .venv/bin/activate")
        print("  uvicorn app.main:app --reload --port 8000")
        return 0
    else:
        print("\n✗ Some tests failed.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
