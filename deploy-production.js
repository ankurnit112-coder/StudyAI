#!/usr/bin/env node

/**
 * StudyAI Production Deployment Script
 * Complete deployment automation with all checks
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 StudyAI Production Deployment\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const runCommand = (command, description) => {
  try {
    log(`🔄 ${description}...`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'red');
    return false;
  }
};

// Pre-deployment checks
log('📋 Running pre-deployment checks...', 'blue');

const checks = [
  {
    name: 'Dependencies Check',
    command: 'npm list --depth=0',
    required: true
  },
  {
    name: 'TypeScript Check',
    command: 'npm run type-check',
    required: true
  },
  {
    name: 'Build Test',
    command: 'npm run build',
    required: true
  },
  {
    name: 'Lint Check',
    command: 'npm run lint',
    required: false
  }
];

let allChecksPassed = true;

for (const check of checks) {
  const success = runCommand(check.command, check.name);
  if (!success && check.required) {
    allChecksPassed = false;
    break;
  }
}

if (!allChecksPassed) {
  log('❌ Pre-deployment checks failed. Please fix issues before deploying.', 'red');
  process.exit(1);
}

log('\n🎉 All checks passed! Application is ready for deployment.', 'green');

// Environment variables check
log('\n📝 Environment Variables Check:', 'blue');

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

const envFile = '.env.local';
let envConfigured = true;

if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf8');
  
  for (const envVar of requiredEnvVars) {
    if (envContent.includes(`${envVar}=`) && !envContent.includes(`${envVar}=your-`)) {
      log(`✅ ${envVar} configured`, 'green');
    } else {
      log(`⚠️  ${envVar} needs configuration`, 'yellow');
      envConfigured = false;
    }
  }
} else {
  log('⚠️  .env.local not found', 'yellow');
  envConfigured = false;
}

if (!envConfigured) {
  log('\n📋 Environment Setup Required:', 'yellow');
  log('1. Create Supabase project at https://supabase.com');
  log('2. Run database migration from supabase/migrations/001_initial_schema.sql');
  log('3. Update .env.local with your Supabase credentials');
  log('4. Set the same variables in Vercel dashboard');
}

// Deployment options
log('\n🚀 Deployment Options:', 'blue');
log('1. Automated Vercel deployment (recommended)');
log('2. Manual Vercel CLI deployment');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\nChoose deployment option (1 or 2): ', (answer) => {
  if (answer === '1') {
    log('\n🚀 Starting automated Vercel deployment...', 'blue');
    
    // Check if Vercel CLI is available
    try {
      execSync('vercel --version', { stdio: 'pipe' });
      log('✅ Vercel CLI found', 'green');
    } catch (error) {
      log('📦 Installing Vercel CLI...', 'yellow');
      try {
        execSync('npm install -g vercel', { stdio: 'inherit' });
        log('✅ Vercel CLI installed', 'green');
      } catch (installError) {
        log('❌ Failed to install Vercel CLI. Please install manually: npm install -g vercel', 'red');
        rl.close();
        return;
      }
    }

    // Deploy to Vercel
    try {
      execSync('vercel --prod', { stdio: 'inherit' });
      log('\n🎉 Deployment successful!', 'green');
      log('📊 Check your deployment at: https://vercel.com/dashboard', 'blue');
      log('\n📋 Post-deployment checklist:', 'blue');
      log('1. Test user registration and login');
      log('2. Verify academic data input works');
      log('3. Check AI predictions functionality');
      log('4. Test mobile responsiveness');
      log('5. Monitor performance metrics');
    } catch (error) {
      log('❌ Deployment failed. Try running "vercel login" first.', 'red');
    }
    
  } else if (answer === '2') {
    log('\n📋 Manual deployment steps:', 'blue');
    log('1. Run: vercel login');
    log('2. Run: vercel --prod');
    log('3. Follow the prompts');
    log('4. Set environment variables in Vercel dashboard');
    
  } else {
    log('❌ Invalid option. Please run the script again.', 'red');
  }
  
  rl.close();
});

// Handle script termination
process.on('SIGINT', () => {
  log('\n👋 Deployment cancelled by user.', 'yellow');
  rl.close();
  process.exit(0);
});