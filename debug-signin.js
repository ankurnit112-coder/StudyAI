import https from 'https';

const baseUrl = 'https://studyai-o0vk95tv3-ankurnit112-5736s-projects.vercel.app';

function makeRequest(path, method, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function debugSignIn() {
  console.log('🔍 Debugging Sign-In Issue...\n');
  
  try {
    // Test 1: Check if database is accessible
    console.log('1. Checking database status...');
    const dbCheck = await makeRequest('/api/fix-db', 'GET');
    console.log(`   Database Status: ${dbCheck.status}`);
    console.log(`   Tables: ${dbCheck.data.summary?.existing}/${dbCheck.data.summary?.total} ready`);
    
    if (dbCheck.data.summary?.missing > 0) {
      console.log('   ❌ Database tables missing! Run migration first.');
      return;
    }
    
    // Test 2: Try to create a test user
    const testEmail = `debug-${Date.now()}@test.com`;
    const testPassword = 'DebugTest123!';
    
    console.log(`\n2. Creating test user: ${testEmail}`);
    const signupResult = await makeRequest('/api/auth/signup', 'POST', {
      name: 'Debug User',
      email: testEmail,
      password: testPassword,
      role: 'student',
      agreeToTerms: true
    });
    
    console.log(`   Signup Status: ${signupResult.status}`);
    if (signupResult.status !== 201) {
      console.log('   ❌ Signup failed:', signupResult.data);
      
      // Check if user already exists
      if (signupResult.status === 409) {
        console.log('   ℹ️  User already exists, proceeding with login test...');
      } else {
        return;
      }
    } else {
      console.log('   ✅ Signup successful');
      console.log(`   User ID: ${signupResult.data.user?.id}`);
    }
    
    // Test 3: Try login with correct credentials
    console.log(`\n3. Testing login with correct credentials...`);
    const loginResult = await makeRequest('/api/auth/login', 'POST', {
      email: testEmail,
      password: testPassword
    });
    
    console.log(`   Login Status: ${loginResult.status}`);
    console.log(`   Response:`, JSON.stringify(loginResult.data, null, 2));
    
    if (loginResult.status === 200) {
      console.log('   ✅ Login successful!');
    } else {
      console.log('   ❌ Login failed with correct credentials');
    }
    
    // Test 4: Try login with wrong password
    console.log(`\n4. Testing login with wrong password...`);
    const wrongPasswordResult = await makeRequest('/api/auth/login', 'POST', {
      email: testEmail,
      password: 'WrongPassword123!'
    });
    
    console.log(`   Wrong Password Status: ${wrongPasswordResult.status}`);
    console.log(`   Response:`, wrongPasswordResult.data.detail);
    
    // Test 5: Try login with non-existent user
    console.log(`\n5. Testing login with non-existent user...`);
    const nonExistentResult = await makeRequest('/api/auth/login', 'POST', {
      email: 'nonexistent@test.com',
      password: 'SomePassword123!'
    });
    
    console.log(`   Non-existent User Status: ${nonExistentResult.status}`);
    console.log(`   Response:`, nonExistentResult.data.detail);
    
    // Test 6: Check existing test user
    console.log(`\n6. Testing with existing test user...`);
    const existingUserResult = await makeRequest('/api/auth/login', 'POST', {
      email: 'test@example.com',
      password: 'testpassword123'
    });
    
    console.log(`   Existing User Status: ${existingUserResult.status}`);
    if (existingUserResult.status !== 200) {
      console.log(`   Response:`, existingUserResult.data.detail);
    }
    
    console.log('\n📊 Debug Summary:');
    console.log(`   Database: ${dbCheck.data.summary?.existing === 6 ? '✅ Ready' : '❌ Issues'}`);
    console.log(`   Signup: ${signupResult.status === 201 ? '✅ Working' : '❌ Issues'}`);
    console.log(`   Login (new user): ${loginResult.status === 200 ? '✅ Working' : '❌ Issues'}`);
    console.log(`   Login (existing): ${existingUserResult.status === 200 ? '✅ Working' : '❌ Issues'}`);
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugSignIn();