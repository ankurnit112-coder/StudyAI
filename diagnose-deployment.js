#!/usr/bin/env node

/**
 * StudyAI Deployment Diagnostic Tool
 * This script will help identify why login/signup is failing
 */

import https from 'https';
import http from 'http';

// Your current Vercel URL - UPDATE THIS if different
const VERCEL_URL = 'https://studyai-4ft01gvu2-ankurnit112-5736s-projects.vercel.app';

console.log('🔍 StudyAI Deployment Diagnostic Tool');
console.log('=====================================\n');

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'StudyAI-Diagnostic/1.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
      },
      timeout: 10000
    };

    if (options.body) {
      requestOptions.headers['Content-Length'] = Buffer.byteLength(options.body);
    }

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
          url: url
        });
      });
    });

    req.on('error', (error) => {
      reject({
        error: error.message,
        code: error.code,
        url: url
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({
        error: 'Request timeout',
        code: 'TIMEOUT',
        url: url
      });
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

async function testEndpoint(path, description, options = {}) {
  const url = `${VERCEL_URL}${path}`;
  console.log(`\n🔍 Testing ${description}...`);
  console.log(`   URL: ${url}`);
  
  try {
    const response = await makeRequest(url, options);
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Headers: ${JSON.stringify(response.headers, null, 2)}`);
    
    if (response.status >= 200 && response.status < 300) {
      console.log(`   ✅ ${description} - SUCCESS`);
      if (response.body && response.body.length < 500) {
        console.log(`   Response: ${response.body}`);
      }
      return { success: true, status: response.status, body: response.body };
    } else if (response.status >= 300 && response.status < 400) {
      console.log(`   🔄 ${description} - REDIRECT`);
      console.log(`   Location: ${response.headers.location || 'Not specified'}`);
      return { success: false, status: response.status, redirect: true };
    } else {
      console.log(`   ❌ ${description} - ERROR`);
      console.log(`   Error Response: ${response.body}`);
      return { success: false, status: response.status, body: response.body };
    }
  } catch (error) {
    console.log(`   ❌ ${description} - NETWORK ERROR`);
    console.log(`   Error: ${error.error}`);
    console.log(`   Code: ${error.code}`);
    return { success: false, error: error.error, code: error.code };
  }
}

async function testAuth() {
  console.log('\n🔐 Testing Authentication Endpoints');
  console.log('====================================');
  
  // Test signup
  const signupData = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'TestPassword123!',
    role: 'student'
  };

  const signupResult = await testEndpoint('/api/auth/signup', 'Signup API', {
    method: 'POST',
    body: JSON.stringify(signupData)
  });

  // Test login with a common test account
  const loginData = {
    email: 'test@example.com',
    password: 'TestPassword123!'
  };

  const loginResult = await testEndpoint('/api/auth/login', 'Login API', {
    method: 'POST',
    body: JSON.stringify(loginData)
  });

  return { signup: signupResult, login: loginResult };
}

async function checkEnvironment() {
  console.log('\n🌍 Environment Check');
  console.log('====================');
  
  // Check if we can reach the domain at all
  const domainResult = await testEndpoint('/', 'Homepage');
  
  // Check health endpoint
  const healthResult = await testEndpoint('/api/health', 'Health Check API');
  
  // Check if API directory is accessible
  const apiResult = await testEndpoint('/api', 'API Root');
  
  return { domain: domainResult, health: healthResult, api: apiResult };
}

async function analyzeResults(envResults, authResults) {
  console.log('\n📊 Analysis & Recommendations');
  console.log('==============================');
  
  // Check domain accessibility
  if (!envResults.domain.success) {
    if (envResults.domain.code === 'ENOTFOUND') {
      console.log('❌ CRITICAL: Domain not found');
      console.log('   → Your Vercel deployment URL might be incorrect');
      console.log('   → Check your Vercel dashboard for the correct URL');
      return;
    } else if (envResults.domain.redirect) {
      console.log('⚠️  WARNING: Homepage redirects');
      console.log('   → This might be normal for authentication-required apps');
    }
  } else {
    console.log('✅ Domain is accessible');
  }
  
  // Check API health
  if (!envResults.health.success) {
    if (envResults.health.status === 404) {
      console.log('❌ CRITICAL: Health API not found');
      console.log('   → API routes might not be deployed correctly');
      console.log('   → Check if app/api/health/route.ts exists and is deployed');
    } else if (envResults.health.status >= 500) {
      console.log('❌ CRITICAL: Server error in health check');
      console.log('   → Backend server has internal errors');
      console.log('   → Check Vercel function logs');
    } else if (envResults.health.redirect) {
      console.log('⚠️  WARNING: Health API redirects to authentication');
      console.log('   → This suggests the API is protected when it shouldn\'t be');
    }
  } else {
    console.log('✅ Health API is working');
  }
  
  // Check authentication
  if (!authResults.signup.success && !authResults.login.success) {
    console.log('❌ CRITICAL: Both signup and login are failing');
    
    if (authResults.signup.status === 404 || authResults.login.status === 404) {
      console.log('   → Authentication API routes are not deployed');
      console.log('   → Check if app/api/auth/*/route.ts files exist and are deployed');
    } else if (authResults.signup.status >= 500 || authResults.login.status >= 500) {
      console.log('   → Server errors in authentication');
      console.log('   → Likely database connection or environment variable issues');
    } else if (authResults.signup.error || authResults.login.error) {
      console.log('   → Network connectivity issues');
      console.log('   → CORS or timeout problems');
    }
  }
  
  console.log('\n🔧 Recommended Actions:');
  console.log('1. Check Vercel dashboard for deployment status');
  console.log('2. Verify all environment variables are set in Vercel');
  console.log('3. Check Vercel function logs for errors');
  console.log('4. Ensure Supabase database is accessible');
  console.log('5. Redeploy after fixing environment variables');
}

async function main() {
  try {
    console.log(`Target URL: ${VERCEL_URL}\n`);
    
    // Run diagnostics
    const envResults = await checkEnvironment();
    const authResults = await testAuth();
    
    // Analyze and provide recommendations
    await analyzeResults(envResults, authResults);
    
    console.log('\n✨ Diagnostic complete!');
    console.log('\nIf you need help with any of these issues, share this output for assistance.');
    
  } catch (error) {
    console.error('❌ Diagnostic failed:', error);
  }
}

main();