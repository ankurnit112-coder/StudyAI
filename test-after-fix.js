#!/usr/bin/env node

/**
 * Test script to verify deployment is working after disabling protection
 */

import https from 'https';

const VERCEL_URL = 'https://studyai-jq5pdn4s6-ankurnit112-5736s-projects.vercel.app';

async function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    const url = `${VERCEL_URL}${path}`;
    console.log(`Testing: ${url}`);
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
          console.log('✅ SUCCESS - Endpoint is accessible');
        } else if (res.statusCode === 401) {
          console.log('❌ STILL PROTECTED - Deployment protection is still enabled');
        } else {
          console.log(`⚠️  Status ${res.statusCode} - Check the response`);
        }
        resolve({ status: res.statusCode, body: data });
      });
    }).on('error', (err) => {
      console.log(`❌ Network error: ${err.message}`);
      reject(err);
    });
  });
}

async function main() {
  console.log('🔍 Testing StudyAI after disabling deployment protection\n');
  
  try {
    await testEndpoint('/api/health');
    console.log('\n---\n');
    await testEndpoint('/');
    
    console.log('\n📝 Next steps:');
    console.log('1. If you see 401 errors, deployment protection is still enabled');
    console.log('2. If you see 200 status, try logging in to your app');
    console.log('3. Check browser console for any remaining errors');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

main();