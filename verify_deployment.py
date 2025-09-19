#!/usr/bin/env python3
"""
Final deployment verification script
"""

import subprocess
import sys
import os
import json
from datetime import datetime

def run_command(command, cwd=None):
    """Run a command and return success status"""
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            cwd=cwd,
            capture_output=True, 
            text=True,
            timeout=60
        )
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return False, "", "Command timed out"
    except Exception as e:
        return False, "", str(e)

def main():
    """Main verification function"""
    print("🔍 STUDYAI DEPLOYMENT VERIFICATION")
    print("=" * 50)
    
    verification_results = {
        "timestamp": datetime.now().isoformat(),
        "tests": {},
        "overall_status": "unknown"
    }
    
    tests_passed = 0
    total_tests = 0
    
    # Test 1: Frontend Build
    print("1. Testing frontend build...")
    total_tests += 1
    success, stdout, stderr = run_command("npm run build")
    if success:
        print("   ✅ Frontend builds successfully")
        verification_results["tests"]["frontend_build"] = "PASSED"
        tests_passed += 1
    else:
        print("   ❌ Frontend build failed")
        print(f"   Error: {stderr}")
        verification_results["tests"]["frontend_build"] = "FAILED"
    
    # Test 2: Backend System Test
    print("2. Testing backend system...")
    total_tests += 1
    success, stdout, stderr = run_command("python quick_test.py", cwd="backend")
    if success:
        print("   ✅ Backend system working")
        verification_results["tests"]["backend_system"] = "PASSED"
        tests_passed += 1
    else:
        print("   ❌ Backend system failed")
        print(f"   Error: {stderr}")
        verification_results["tests"]["backend_system"] = "FAILED"
    
    # Test 3: ML Models Available
    print("3. Checking ML models...")
    total_tests += 1
    models_dir = "backend/models"
    if os.path.exists(models_dir):
        model_files = [f for f in os.listdir(models_dir) if f.endswith('.joblib')]
        if len(model_files) >= 10:
            print(f"   ✅ Found {len(model_files)} ML model files")
            verification_results["tests"]["ml_models"] = "PASSED"
            tests_passed += 1
        else:
            print(f"   ⚠️  Only {len(model_files)} model files found")
            verification_results["tests"]["ml_models"] = "PARTIAL"
    else:
        print("   ❌ Models directory not found")
        verification_results["tests"]["ml_models"] = "FAILED"
    
    # Test 4: Configuration Files
    print("4. Checking configuration files...")
    total_tests += 1
    config_files = [
        "next.config.mjs",
        "docker-compose.prod.yml",
        "backend/Dockerfile.prod",
        ".github/workflows/deploy.yml"
    ]
    
    missing_files = []
    for file in config_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if not missing_files:
        print("   ✅ All configuration files present")
        verification_results["tests"]["configuration"] = "PASSED"
        tests_passed += 1
    else:
        print(f"   ❌ Missing files: {missing_files}")
        verification_results["tests"]["configuration"] = "FAILED"
    
    # Test 5: Package Dependencies
    print("5. Checking package dependencies...")
    total_tests += 1
    success, stdout, stderr = run_command("npm list --depth=0")
    if success:
        print("   ✅ All npm dependencies installed")
        verification_results["tests"]["dependencies"] = "PASSED"
        tests_passed += 1
    else:
        print("   ⚠️  Some npm dependencies may be missing")
        verification_results["tests"]["dependencies"] = "PARTIAL"
    
    # Calculate success rate
    success_rate = (tests_passed / total_tests) * 100
    verification_results["success_rate"] = success_rate
    verification_results["tests_passed"] = tests_passed
    verification_results["total_tests"] = total_tests
    
    # Overall status
    if success_rate >= 90:
        verification_results["overall_status"] = "EXCELLENT"
        status_emoji = "🎉"
        status_message = "READY FOR PRODUCTION DEPLOYMENT"
    elif success_rate >= 70:
        verification_results["overall_status"] = "GOOD"
        status_emoji = "✅"
        status_message = "READY FOR DEPLOYMENT WITH MONITORING"
    elif success_rate >= 50:
        verification_results["overall_status"] = "NEEDS_ATTENTION"
        status_emoji = "⚠️"
        status_message = "NEEDS FIXES BEFORE DEPLOYMENT"
    else:
        verification_results["overall_status"] = "CRITICAL"
        status_emoji = "❌"
        status_message = "CRITICAL ISSUES - DO NOT DEPLOY"
    
    # Print summary
    print("\n" + "=" * 50)
    print("DEPLOYMENT VERIFICATION SUMMARY")
    print("=" * 50)
    print(f"Tests Passed: {tests_passed}/{total_tests}")
    print(f"Success Rate: {success_rate:.1f}%")
    print(f"Status: {status_emoji} {status_message}")
    
    # Save results
    results_file = f"deployment_verification_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(results_file, 'w') as f:
        json.dump(verification_results, f, indent=2)
    
    print(f"\nVerification results saved to: {results_file}")
    
    # Deployment recommendations
    print("\n📋 DEPLOYMENT RECOMMENDATIONS:")
    if success_rate >= 90:
        print("✅ System is ready for immediate production deployment")
        print("✅ All critical components are functional")
        print("✅ Use automated CI/CD pipeline or manual deployment scripts")
    elif success_rate >= 70:
        print("⚠️  System is mostly ready but monitor closely after deployment")
        print("⚠️  Consider fixing remaining issues before production")
    else:
        print("❌ System needs significant fixes before deployment")
        print("❌ Address all failed tests before proceeding")
    
    print("\n🚀 DEPLOYMENT COMMANDS:")
    print("Local Development:")
    print("  npm run dev")
    print("  cd backend && python start.py")
    print("\nDocker Development:")
    print("  docker-compose -f docker-compose.dev.yml up")
    print("\nProduction Deployment:")
    print("  ./scripts/deploy.sh deploy  # Unix/Linux")
    print("  .\\scripts\\deploy.ps1 -Action deploy  # Windows")
    
    return success_rate >= 70

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)