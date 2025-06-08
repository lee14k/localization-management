import time
import requests
import statistics
from typing import List, Dict

# Test configuration
BASE_URL = "http://localhost:8000"
TEST_ITERATIONS = 10

class PerformanceTest:
    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.results = {}
    
    def measure_time(self, func, *args, **kwargs):
        """Measure execution time of a function"""
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        execution_time = (end_time - start_time) * 1000  # Convert to milliseconds
        return result, execution_time
    
    def test_get_all_localizations(self, iterations: int = TEST_ITERATIONS):
        """Test performance of getting all localizations"""
        print(f"\n🧪 Testing GET /localizations/ ({iterations} iterations)")
        times = []
        
        for i in range(iterations):
            try:
                response, exec_time = self.measure_time(
                    requests.get, 
                    f"{self.base_url}/localizations/"
                )
                
                if response.status_code == 200:
                    times.append(exec_time)
                    print(f"  Iteration {i+1}: {exec_time:.2f}ms")
                else:
                    print(f"  ❌ Iteration {i+1}: HTTP {response.status_code}")
                    
            except Exception as e:
                print(f"  ❌ Iteration {i+1}: Error - {str(e)}")
        
        if times:
            self.results['get_all_localizations'] = self.calculate_stats(times)

    def test_get_specific_localization(self, iterations: int = TEST_ITERATIONS):
        """Test performance of getting localization for specific project and locale"""
        print(f"\n🧪 Testing GET /localizations/{{project_id}}/{{locale}} ({iterations} iterations)")
        times = []
        
        # Test with sample project and locale
        project_id = "test-project"
        locale = "en"
        
        for i in range(iterations):
            try:
                response, exec_time = self.measure_time(
                    requests.get, 
                    f"{self.base_url}/localizations/{project_id}/{locale}"
                )
                
                if response.status_code == 200:
                    times.append(exec_time)
                    print(f"  Iteration {i+1}: {exec_time:.2f}ms")
                else:
                    print(f"  ❌ Iteration {i+1}: HTTP {response.status_code}")
                    
            except Exception as e:
                print(f"  ❌ Iteration {i+1}: Error - {str(e)}")
        
        if times:
            self.results['get_specific_localization'] = self.calculate_stats(times)

    def test_get_localization_by_project_id(self, iterations: int = TEST_ITERATIONS):
        """Test performance of getting localizations by project ID"""
        print(f"\n🧪 Testing GET /localizations-by-project-id/{{project_id}} ({iterations} iterations)")
        times = []
        
        project_id = "test-project"
        
        for i in range(iterations):
            try:
                response, exec_time = self.measure_time(
                    requests.get, 
                    f"{self.base_url}/localizations-by-project-id/{project_id}"
                )
                
                # 404 is expected if project doesn't exist, still measure time
                times.append(exec_time)
                print(f"  Iteration {i+1}: {exec_time:.2f}ms (Status: {response.status_code})")
                    
            except Exception as e:
                print(f"  ❌ Iteration {i+1}: Error - {str(e)}")
        
        if times:
            self.results['get_localization_by_project_id'] = self.calculate_stats(times)

    def test_get_localizations_by_project_ids(self, iterations: int = TEST_ITERATIONS):
        """Test performance of getting localizations by multiple project IDs"""
        print(f"\n🧪 Testing GET /localizations-by-project-ids ({iterations} iterations)")
        times = []
        
        # Test with comma-separated project IDs
        project_ids = "test-project,another-project,third-project"
        
        for i in range(iterations):
            try:
                response, exec_time = self.measure_time(
                    requests.get, 
                    f"{self.base_url}/localizations-by-project-ids",
                    params={"project_ids": project_ids}
                )
                
                if response.status_code == 200:
                    times.append(exec_time)
                    print(f"  Iteration {i+1}: {exec_time:.2f}ms")
                else:
                    print(f"  ❌ Iteration {i+1}: HTTP {response.status_code}")
                    
            except Exception as e:
                print(f"  ❌ Iteration {i+1}: Error - {str(e)}")
        
        if times:
            self.results['get_localizations_by_project_ids'] = self.calculate_stats(times)
    
    def test_bulk_update_endpoint(self):
        """Comprehensive test for bulk update endpoint matching your API structure"""
        print(f"\n🧪 Testing PUT /localizations/bulk-update")
        
        # Test 1: Valid bulk update matching your BulkUpdateRequest structure
        print("  Test 1: Valid bulk update request")
        valid_payload = {
            "updates": [
                {
                    "project_id": "test-project",
                    "locale": "en",
                    "localizations": {
                        "welcome_message": "Welcome to our app!",
                        "goodbye_message": "Thanks for using our app!"
                    }
                },
                {
                    "project_id": "test-project",
                    "locale": "es",
                    "localizations": {
                        "welcome_message": "¡Bienvenido a nuestra aplicación!",
                        "goodbye_message": "¡Gracias por usar nuestra aplicación!"
                    }
                }
            ]
        }
        
        try:
            response, exec_time = self.measure_time(
                requests.put,
                f"{self.base_url}/localizations/bulk-update",
                json=valid_payload,
                headers={"Content-Type": "application/json"}
            )
            
            print(f"    Response time: {exec_time:.2f}ms")
            print(f"    Status code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"    ✅ Success: {data.get('success', False)}")
                print(f"    Updated count: {data.get('updated_count', 0)}")
                print(f"    Errors: {len(data.get('errors', []))}")
                if data.get('errors'):
                    for error in data['errors']:
                        print(f"      - {error}")
            else:
                print(f"    ❌ Failed: {response.text}")
                
        except Exception as e:
            print(f"    ❌ Error: {str(e)}")
        
        # Test 2: Invalid payload (missing required fields)
        print("\n  Test 2: Invalid payload (missing required fields)")
        invalid_payload = {
            "updates": [
                {
                    "project_id": "test-project"
                    # Missing required fields: locale, localizations
                }
            ]
        }
        
        try:
            response, exec_time = self.measure_time(
                requests.put,
                f"{self.base_url}/localizations/bulk-update",
                json=invalid_payload,
                headers={"Content-Type": "application/json"}
            )
            
            print(f"    Response time: {exec_time:.2f}ms")
            print(f"    Status code: {response.status_code}")
            
            if response.status_code == 422:  # Validation error
                print("    ✅ Correctly rejected invalid payload")
            else:
                print(f"    ⚠️  Unexpected response: {response.text}")
                
        except Exception as e:
            print(f"    ❌ Error: {str(e)}")
        
        # Test 3: Empty updates array
        print("\n  Test 3: Empty updates array")
        empty_payload = {"updates": []}
        
        try:
            response, exec_time = self.measure_time(
                requests.put,
                f"{self.base_url}/localizations/bulk-update",
                json=empty_payload,
                headers={"Content-Type": "application/json"}
            )
            
            print(f"    Response time: {exec_time:.2f}ms")
            print(f"    Status code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"    Updated count: {data.get('updated_count', 0)}")
            
        except Exception as e:
            print(f"    ❌ Error: {str(e)}")

    def test_bulk_update_performance(self, payload_sizes: List[int] = [1, 5, 10, 20]):
        """Test bulk update performance with different payload sizes using correct data structure"""
        print(f"\n🧪 Testing bulk update performance with different payload sizes")
        
        for size in payload_sizes:
            print(f"\n  Testing with {size} updates:")
            times = []
            
            # Generate test data matching your BulkUpdateRequest structure
            test_payload = {
                "updates": [
                    {
                        "project_id": f"perf-test-project-{i}",
                        "locale": "en",
                        "localizations": {
                            f"perf_test_key_{i}_1": f"Performance test value {i}-1",
                            f"perf_test_key_{i}_2": f"Performance test value {i}-2",
                            f"perf_test_key_{i}_3": f"Performance test value {i}-3"
                        }
                    }
                    for i in range(1, size + 1)
                ]
            }
            
            # Run multiple iterations for this payload size
            iterations = 5 if size <= 10 else 3  # Fewer iterations for larger payloads
            
            for i in range(iterations):
                try:
                    response, exec_time = self.measure_time(
                        requests.put,
                        f"{self.base_url}/localizations/bulk-update",
                        json=test_payload,
                        headers={"Content-Type": "application/json"}
                    )
                    
                    if response.status_code == 200:
                        times.append(exec_time)
                        print(f"    Iteration {i+1}: {exec_time:.2f}ms")
                    else:
                        print(f"    ❌ Iteration {i+1}: HTTP {response.status_code}")
                        
                except Exception as e:
                    print(f"    ❌ Iteration {i+1}: Error - {str(e)}")
            
            if times:
                stats = self.calculate_stats(times)
                self.results[f'bulk_update_{size}_items'] = stats
                print(f"    Average: {stats['avg_ms']}ms for {size} updates")
    
    def calculate_stats(self, times: List[float]) -> Dict:
        """Calculate performance statistics"""
        if not times:
            return {}
        
        return {
            'avg_ms': round(statistics.mean(times), 2),
            'min_ms': round(min(times), 2),
            'max_ms': round(max(times), 2),
            'median_ms': round(statistics.median(times), 2),
            'std_dev': round(statistics.stdev(times) if len(times) > 1 else 0, 2),
            'total_requests': len(times)
        }

    def print_summary(self):
        """Print performance test summary"""
        print("\n" + "="*60)
        print("📊 PERFORMANCE TEST SUMMARY")
        print("="*60)
        
        if not self.results:
            print("No test results available")
            return
        
        for test_name, stats in self.results.items():
            print(f"\n🔍 {test_name.replace('_', ' ').title()}:")
            print(f"  Average: {stats['avg_ms']}ms")
            print(f"  Median:  {stats['median_ms']}ms") 
            print(f"  Min:     {stats['min_ms']}ms")
            print(f"  Max:     {stats['max_ms']}ms")
            print(f"  Std Dev: {stats['std_dev']}ms")
            print(f"  Requests: {stats['total_requests']}")
            
            # Performance assessment
            if stats['avg_ms'] < 100:
                print("  📈 Performance: EXCELLENT")
            elif stats['avg_ms'] < 500:
                print("  📊 Performance: GOOD")
            elif stats['avg_ms'] < 1000:
                print("  📉 Performance: FAIR")
            else:
                print("  🐌 Performance: SLOW")

def main():
    print("Starting Localization Management API Performance Tests")
    print("=" * 60)
    print("⚠️  Make sure your FastAPI server is running on http://localhost:8000")
    print("   You can start it with: uvicorn src.localization_management_api.main:app --reload")
    print("=" * 60)
    
    # Initialize test runner
    perf_test = PerformanceTest()
    
    # Run tests for all your actual endpoints
    perf_test.test_get_all_localizations(iterations=5)
    perf_test.test_get_specific_localization(iterations=5)
    perf_test.test_get_localization_by_project_id(iterations=5)
    perf_test.test_get_localizations_by_project_ids(iterations=5)
    perf_test.test_bulk_update_endpoint()
    perf_test.test_bulk_update_performance([1, 3, 5])  # Smaller sizes for testing
    
    # Print summary
    perf_test.print_summary()

if __name__ == "__main__":
    main() 