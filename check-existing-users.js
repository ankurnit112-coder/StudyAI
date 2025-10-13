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
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
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

async function checkExistingUsers() {
  console.log('🔍 Checking Existing Users Issue...\n');
  
  // Test with the known existing user
  console.log('Testing existing user: test@example.com');
  
  // Try different password variations that might have been used
  const passwordVariations = [
    'testpassword123',
    'password',
    'test123',
    'TestPassword123',
    'testPassword123'
  ];
  
  for (const password of passwordVariations) {
    console.log(`\nTrying password: "${password}"`);
    const result = await makeRequest('/api/auth/login', 'POST', {
      email: 'test@example.com',
      password: password
    });
    
    console.log(`Status: ${result.status}`);
    if (result.status === 200) {
      console.log('✅ Found working password!');
      break;
    } else {
      console.log(`❌ Failed: ${result.data.detail}`);
    }
  }
  
  console.log('\n💡 Solution: Existing users need to reset their passwords or be recreated');
  console.log('   The password hashing fix only applies to newly created users.');
  console.log('   Existing users have double-hashed passwords that cannot be verified.');
}

checkExistingUsers();