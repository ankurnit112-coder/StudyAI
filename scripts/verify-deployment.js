#!/usr/bin/env node

/**
 * Deployment Verification Script for StudyAI
 * Verifies that all critical functions work after Vercel deployment
 */

const https = require('https');
const fs = require('fs');

// Configuration
const DEPLOYMENT_URL = process.env.VERCEL_URL || process.env.DEPLOYMENT_URL || 'https://studyai.vercel.app';
const TIMEOUT = 10000; // 10 seconds

// Test cases
const testCases = [
  {
    name: 'Homepage Load',
    path: '/',
    expectedStatus: 200,
    expectedContent: ['StudyAI', 'CBSE', 'AI-Powered Insights']
  },
  {
    name: 'Navigation Functionality',
    path: '/',
    expectedStatus: 200,
    expectedContent: ['Get Started', 'Watch Demo', 'Features']
  },
  {
    name: 'Mobile Responsiveness',
    path: '/',
    expectedStatus: 200,
    expectedContent: ['viewport', 'mobile-friendly']
  },
  {
    name: 'Dark Mode Support',
    path: '/',
    expectedStatus: 200,
    expectedContent: ['dark:', 'theme-provider']
  },
  {
    name: 'PWA Manifest',
    path: '/manifest.json',
    expectedStatus: 200,
    expectedContent: ['StudyAI', 'start_url']
  },
  {
    name: 'Sitemap',
    path: '/sitemap.xml',
    expectedStatus: 200,
    expectedContent: ['<?xml', 'urlset']
  }
];

// Utility functions
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: TIMEOUT }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

function checkContent(body, expectedContent) {
  const missing = [];
  for (const content of expectedContent) {
    if (!body.toLowerCase().includes(content.toLowerCase())) {
      missing.push(content);
    }
  }
  return missing;
}

// Main verification function
async function verifyDeployment() {
  console.log(`🚀 Verifying deployment at: ${DEPLOYMENT_URL}`);
  console.log('=' .repeat(60));
  
  const results = [];
  let passed = 0;
  let failed = 0;
  
  for (const test of testCases) {
    const url = `${DEPLOYMENT_URL}${test.path}`;
    
    try {
      console.log(`\n📋 Testing: ${test.name}`);
      console.log(`   URL: ${url}`);
      
      const response = await makeRequest(url);
      
      // Check status code
      const statusOk = response.status === test.expectedStatus;
      console.log(`   Status: ${response.status} ${statusOk ? '✅' : '❌'}`);
      
      // Check content
      const missingContent = checkContent(response.body, test.expectedContent);
      const contentOk = missingContent.length === 0;
      
      if (contentOk) {
        console.log(`   Content: All expected content found ✅`);
      } else {
        console.log(`   Content: Missing content ❌`);
        console.log(`   Missing: ${missingContent.join(', ')}`);
      }
      
      const testPassed = statusOk && contentOk;
      
      results.push({
        name: test.name,
        url,
        status: response.status,
        passed: testPassed,
        issues: testPassed ? [] : [
          ...(statusOk ? [] : [`Expected status ${test.expectedStatus}, got ${response.status}`]),
          ...(contentOk ? [] : [`Missing content: ${missingContent.join(', ')}`])
        ]
      });
      
      if (testPassed) {
        passed++;
        console.log(`   Result: PASSED ✅`);
      } else {
        failed++;
        console.log(`   Result: FAILED ❌`);
      }
      
    } catch (error) {
      console.log(`   Error: ${error.message} ❌`);
      results.push({
        name: test.name,
        url,
        status: 'ERROR',
        passed: false,
        issues: [error.message]
      });
      failed++;
    }
  }
  
  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 DEPLOYMENT VERIFICATION SUMMARY');
  console.log('=' .repeat(60));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  // Detailed results
  if (failed > 0) {
    console.log('\n🔍 FAILED TESTS DETAILS:');
    results.filter(r => !r.passed).forEach(result => {
      console.log(`\n❌ ${result.name}`);
      console.log(`   URL: ${result.url}`);
      result.issues.forEach(issue => {
        console.log(`   Issue: ${issue}`);
      });
    });
  }
  
  // Save results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFile = `deployment-verification-${timestamp}.json`;
  
  const report = {
    timestamp: new Date().toISOString(),
    deploymentUrl: DEPLOYMENT_URL,
    summary: {
      total: testCases.length,
      passed,
      failed,
      successRate: Math.round((passed / (passed + failed)) * 100)
    },
    results
  };
  
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportFile}`);
  
  // Exit with appropriate code
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Deployment is ready for production.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please review and fix issues before going live.');
    process.exit(1);
  }
}

// Additional checks
async function checkPerformance() {
  console.log('\n⚡ PERFORMANCE CHECKS');
  console.log('-' .repeat(30));
  
  try {
    const start = Date.now();
    await makeRequest(DEPLOYMENT_URL);
    const loadTime = Date.now() - start;
    
    console.log(`📊 Homepage load time: ${loadTime}ms`);
    
    if (loadTime < 2000) {
      console.log('   Performance: Excellent ✅');
    } else if (loadTime < 5000) {
      console.log('   Performance: Good ⚠️');
    } else {
      console.log('   Performance: Needs improvement ❌');
    }
    
  } catch (error) {
    console.log(`   Performance check failed: ${error.message} ❌`);
  }
}

// Run verification
async function main() {
  try {
    await verifyDeployment();
    await checkPerformance();
  } catch (error) {
    console.error('Verification failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { verifyDeployment, checkPerformance };