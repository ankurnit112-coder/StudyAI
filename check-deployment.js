#!/usr/bin/env node

/**
 * Deployment Health Check Script
 * Run this to verify your Vercel deployment is working correctly
 */

const https = require('https');

// Replace with your actual Vercel URL
const VERCEL_URL = 'https://studyai-4ft01gvu2-ankurnit112-5736s-projects.vercel.app';

async function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function checkEndpoint(path, description) {
  try {
    console.log(`\n🔍 Checking ${description}...`);
    const response = await makeRequest(`${VERCEL_URL}${path}`);
    
    console.log(`   Status: ${response.status}`);
    
    if (response.status === 200) {
      console.log(`   ✅ ${description} is working`);
      return true;
    } else {
      console.log(`   ❌ ${description} failed`);
      console.log(`   Response: ${response.body.substring(0, 200)}...`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ ${description} error: ${error.message}`);
    return false;
  }
}

async function testAuth() {
  try {
    console.log('\n🔐 Testing authentication endpoints...');
    
    // Test signup
    const signupData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPassword123!',
      role: 'student'
    };

    const signupResponse = await fetch(`${VERCEL_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData)
    });

    console.log(`   Signup Status: ${signupResponse.status}`);
    
    if (signupResponse.status === 409) {
      console.log('   ✅ Signup endpoint working (user already exists)');
    } else if (signupResponse.status === 201) {
      console.log('   ✅ Signup endpoint working (new user created)');
    } else {
      const errorText = await signupResponse.text();
      console.log(`   ❌ Signup failed: ${errorText}`);
    }

  } catch (error) {
    console.log(`   ❌ Auth test error: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 StudyAI Deployment Health Check');
  console.log(`📍 Checking: ${VERCEL_URL}`);
  
  const checks = [
    { path: '/', description: 'Homepage' },
    { path: '/api/health', description: 'Health Check API' },
  ];

  let allPassed = true;
  
  for (const check of checks) {
    const passed = await checkEndpoint(check.path, check.description);
    if (!passed) allPassed = false;
  }

  await testAuth();

  console.log('\n📊 Summary:');
  if (allPassed) {
    console.log('✅ All basic checks passed!');
  } else {
    console.log('❌ Some checks failed. Please review the issues above.');
  }

  console.log('\n💡 If authentication is still failing:');
  console.log('1. Verify all environment variables are set in Vercel dashboard');
  console.log('2. Make sure NEXTAUTH_URL matches your actual Vercel URL');
  console.log('3. Check Supabase database tables exist and are accessible');
  console.log('4. Redeploy after updating environment variables');
}

main().catch(console.error);