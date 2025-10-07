#!/usr/bin/env node

/**
 * Deployment Verification Script for StudyAI
 * Tests key functionality after deployment
 */

const https = require('https');
const http = require('http');

// Configuration
const DEPLOYMENT_URL = process.argv[2] || 'https://your-app.vercel.app';
const TIMEOUT = 10000; // 10 seconds

console.log('🔍 StudyAI Deployment Verification\n');
console.log(`Testing deployment at: ${DEPLOYMENT_URL}\n`);

// Test endpoints
const endpoints = [
  { path: '/', name: 'Homepage', critical: true },
  { path: '/api/health', name: 'Health API', critical: true },
  { path: '/api/predictions', name: 'Predictions API', critical: false, method: 'POST' },
  { path: '/dashboard', name: 'Dashboard', critical: true },
  { path: '/predictions', name: 'Predictions Page', critical: true },
  { path: '/sitemap.xml', name: 'Sitemap', critical: false }
];

// Helper function to make HTTP requests
function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname,
      method: method,
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'StudyAI-Deployment-Verifier/1.0',
        'Accept': 'text/html,application/json,*/*'
      }
    };

    if (method === 'POST' && data) {
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }

    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body,
          responseTime: Date.now() - startTime
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    const startTime = Date.now();
    
    if (method === 'POST' && data) {
      req.write(data);
    }
    
    req.end();
  });
}

// Test function
async function testEndpoint(endpoint) {
  const url = `${DEPLOYMENT_URL}${endpoint.path}`;
  const method = endpoint.method || 'GET';
  
  let data = null;
  if (method === 'POST' && endpoint.path === '/api/predictions') {
    data = JSON.stringify({
      name: "Test Student",
      currentClass: "12",
      subjects: ["Mathematics", "English"],
      recentScores: { "Mathematics": 85, "English": 78 }
    });
  }

  try {
    const response = await makeRequest(url, method, data);
    const success = response.statusCode >= 200 && response.statusCode < 400;
    
    console.log(`${success ? '✅' : '❌'} ${endpoint.name}`);
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   Response Time: ${response.responseTime}ms`);
    
    if (!success && endpoint.critical) {
      console.log(`   ⚠️  Critical endpoint failed!`);
    }
    
    return { ...endpoint, success, statusCode: response.statusCode, responseTime: response.responseTime };
    
  } catch (error) {
    console.log(`❌ ${endpoint.name}`);
    console.log(`   Error: ${error.message}`);
    
    if (endpoint.critical) {
      console.log(`   ⚠️  Critical endpoint failed!`);
    }
    
    return { ...endpoint, success: false, error: error.message };
  }
}

// Main verification function
async function verifyDeployment() {
  console.log('Running verification tests...\n');
  
  const results = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);
    console.log(''); // Empty line for readability
  }
  
  // Summary
  console.log('📊 Verification Summary\n');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const criticalFailed = results.filter(r => !r.success && r.critical).length;
  
  console.log(`✅ Successful: ${successful}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);
  console.log(`⚠️  Critical failures: ${criticalFailed}`);
  
  if (criticalFailed === 0) {
    console.log('\n🎉 Deployment verification passed!');
    console.log('Your StudyAI application is working correctly.');
  } else {
    console.log('\n⚠️  Deployment verification failed!');
    console.log('Critical endpoints are not working. Please check your deployment.');
  }
  
  // Performance summary
  const responseTimes = results.filter(r => r.responseTime).map(r => r.responseTime);
  if (responseTimes.length > 0) {
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    console.log(`\n⚡ Average response time: ${Math.round(avgResponseTime)}ms`);
  }
  
  return criticalFailed === 0;
}

// Run verification
if (require.main === module) {
  verifyDeployment()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error('❌ Verification script failed:', error);
      process.exit(1);
    });
}

module.exports = { verifyDeployment };