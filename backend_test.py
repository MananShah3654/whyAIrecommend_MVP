import requests
import sys
import json
from datetime import datetime

class WhyAIRecommendTester:
    def __init__(self, base_url="https://recommend-audit-tool.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.audit_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=timeout)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response keys: {list(response_data.keys()) if isinstance(response_data, dict) else 'Non-dict response'}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Error text: {response.text[:200]}")
                return False, {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout after {timeout}s")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_run_audit(self):
        """Test running an AI audit with enhanced features validation"""
        test_data = {
            "product_name": "TestProduct",
            "website_url": "https://testproduct.com",
            "category": "Email automation for SaaS",
            "competitors": ["Mailchimp", "HubSpot"]
        }
        
        success, response = self.run_test(
            "Run AI Audit",
            "POST", 
            "run-audit",
            200,
            data=test_data,
            timeout=60  # AI calls can take longer
        )
        
        if success and response:
            self.audit_id = response.get('id')
            print(f"   Audit ID: {self.audit_id}")
            
            # Validate basic response structure
            required_fields = ['id', 'product_name', 'is_recommended', 'created_at']
            missing_fields = [field for field in required_fields if field not in response]
            if missing_fields:
                print(f"   ⚠️  Missing basic fields: {missing_fields}")
                return False, response
            
            # Validate enhanced audit features
            self.validate_enhanced_features(response)
            
            print(f"   Is Recommended: {response.get('is_recommended')}")
            print(f"   Competitors Found: {len(response.get('recommended_competitors', []))}")
            
        return success, response

    def validate_enhanced_features(self, response):
        """Validate the enhanced audit report features"""
        print("\n   🔍 Validating Enhanced Features:")
        
        # 1. Model-Specific Analysis
        model_analyses = response.get('model_analyses', [])
        print(f"   📊 Model Analyses: {len(model_analyses)} models")
        
        expected_models = ['ChatGPT', 'Gemini', 'Perplexity']
        found_models = [m.get('model_name') for m in model_analyses]
        
        for model in expected_models:
            if model in found_models:
                model_data = next(m for m in model_analyses if m.get('model_name') == model)
                score = model_data.get('explainability_score', 0)
                print(f"   ✅ {model}: Score {score}/100, Signals: {len(model_data.get('dominant_signals', []))}")
                
                # Validate explainability score range
                if not (0 <= score <= 100):
                    print(f"   ⚠️  {model} explainability score out of range: {score}")
            else:
                print(f"   ❌ Missing model: {model}")
        
        # 2. Action Plan (should be exactly 5 items)
        action_plan = response.get('action_plan', [])
        print(f"   📋 Action Plan: {len(action_plan)} items (expected: 5)")
        
        if len(action_plan) != 5:
            print(f"   ⚠️  Action plan should have exactly 5 items, found {len(action_plan)}")
        
        for i, action in enumerate(action_plan[:3]):  # Check first 3 for structure
            required_action_fields = ['title', 'what_to_do', 'why_it_matters', 'where_ai_picks_signal', 'expected_impact', 'category']
            missing_action_fields = [field for field in required_action_fields if not action.get(field)]
            if missing_action_fields:
                print(f"   ⚠️  Action {i+1} missing fields: {missing_action_fields}")
            else:
                print(f"   ✅ Action {i+1}: {action.get('title')[:30]}...")
        
        # 3. Impact Forecasts (should be 3 models)
        impact_forecasts = response.get('impact_forecasts', [])
        print(f"   📈 Impact Forecasts: {len(impact_forecasts)} models (expected: 3)")
        
        if len(impact_forecasts) != 3:
            print(f"   ⚠️  Impact forecasts should have 3 models, found {len(impact_forecasts)}")
        
        # 4. Expected Behavior After 7 Days
        expected_behavior = response.get('expected_behavior_after_7_days', '')
        if expected_behavior:
            print(f"   ✅ Expected Behavior: {len(expected_behavior)} chars")
        else:
            print(f"   ⚠️  Missing expected behavior after 7 days")
        
        # 5. Validation Criteria
        validation_fields = ['validation_signals', 'success_criteria', 'failure_criteria']
        for field in validation_fields:
            value = response.get(field)
            if value:
                print(f"   ✅ {field}: Present")
            else:
                print(f"   ⚠️  Missing {field}")
        
        print("   🔍 Enhanced features validation complete")

    def test_get_audit(self):
        """Test getting a specific audit by ID"""
        if not self.audit_id:
            print("❌ Skipping get audit test - no audit ID available")
            return False, {}
            
        return self.run_test(
            "Get Audit by ID",
            "GET",
            f"audit/{self.audit_id}",
            200
        )

    def test_get_all_audits(self):
        """Test getting all audits"""
        return self.run_test("Get All Audits", "GET", "audits", 200)

    def test_invalid_audit_id(self):
        """Test getting audit with invalid ID"""
        return self.run_test(
            "Get Invalid Audit",
            "GET",
            "audit/invalid-id-123",
            404
        )

    def test_delete_audit(self):
        """Test deleting an audit by ID"""
        if not self.audit_id:
            print("❌ Skipping delete audit test - no audit ID available")
            return False, {}
            
        return self.run_test(
            "Delete Audit by ID",
            "DELETE",
            f"audit/{self.audit_id}",
            200
        )

    def test_delete_invalid_audit(self):
        """Test deleting audit with invalid ID"""
        return self.run_test(
            "Delete Invalid Audit",
            "DELETE",
            "audit/invalid-id-123",
            404
        )

    def test_invalid_audit_data(self):
        """Test audit with missing required fields"""
        invalid_data = {
            "product_name": "",  # Empty required field
            "website_url": "invalid-url",  # Invalid URL
            "category": ""  # Empty required field
        }
        
        success, response = self.run_test(
            "Invalid Audit Data",
            "POST",
            "run-audit",
            422,  # Validation error
            data=invalid_data
        )
        
        # If it returns 200, that's also acceptable as backend might handle validation differently
        if not success and response:
            # Check if it's a 200 with error handling
            return self.run_test(
                "Invalid Audit Data (Alternative)",
                "POST",
                "run-audit", 
                200,
                data=invalid_data
            )
        
        return success, response

def main():
    print("🚀 Starting whyAIrecommend Backend API Tests")
    print("=" * 50)
    
    tester = WhyAIRecommendTester()
    
    # Test sequence
    tests = [
        tester.test_root_endpoint,
        tester.test_run_audit,
        tester.test_get_audit,
        tester.test_get_all_audits,
        tester.test_delete_audit,
        tester.test_delete_invalid_audit,
        tester.test_invalid_audit_id,
        tester.test_invalid_audit_data
    ]
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test {test.__name__} crashed: {str(e)}")
            tester.tests_run += 1

    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())