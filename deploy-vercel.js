#!/usr/bin/env node

/**
 * Vercel Deployment Script for StudyAI
 * This script helps automate the deployment process
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 StudyAI Vercel Deployment Script\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Please run this script from the project root.');
  process.exit(1);
}

// Check if vercel.json exists
if (!fs.existsSync('vercel.json')) {
  console.error('❌ Error: vercel.json not found. Please ensure the configuration file exists.');
  process.exit(1);
}

console.log('✅ Project structure validated');

// Run pre-deployment checks
console.log('\n📋 Running pre-deployment checks...');

try {
  // Check if dependencies are installed
  if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }

  // Run build to check for errors
  console.log('🔨 Testing build process...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful');

  // Run linting (optional, don't fail on warnings)
  try {
    console.log('🔍 Running linter...');
    execSync('npm run lint', { stdio: 'inherit' });
    console.log('✅ Linting passed');
  } catch (error) {
    console.log('⚠️  Linting warnings found (deployment will continue)');
  }

} catch (error) {
  console.error('❌ Pre-deployment checks failed:', error.message);
  process.exit(1);
}

console.log('\n🎉 All checks passed! Ready for deployment.');

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI found');
} catch (error) {
  console.log('📦 Installing Vercel CLI...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
  } catch (installError) {
    console.error('❌ Failed to install Vercel CLI. Please install manually: npm install -g vercel');
    process.exit(1);
  }
}

// Display environment variables reminder
console.log('\n📝 Environment Variables Reminder:');
console.log('Make sure these are set in your Vercel dashboard:');
console.log('- NEXT_PUBLIC_API_URL');
console.log('- NEXT_PUBLIC_APP_NAME');
console.log('- NEXT_PUBLIC_APP_VERSION');
console.log('- NEXT_PUBLIC_ENABLE_ANALYTICS');
console.log('- NEXT_PUBLIC_VERCEL_ANALYTICS');
console.log('- NODE_ENV=production');

// Ask user if they want to proceed with deployment
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\n🚀 Deploy to Vercel now? (y/N): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    console.log('\n🚀 Deploying to Vercel...');
    try {
      execSync('vercel --prod', { stdio: 'inherit' });
      console.log('\n🎉 Deployment successful!');
      console.log('📊 Check your deployment at: https://vercel.com/dashboard');
    } catch (error) {
      console.error('❌ Deployment failed:', error.message);
      console.log('\n💡 Try running "vercel login" first if you haven\'t authenticated.');
    }
  } else {
    console.log('\n📋 Deployment cancelled. Run "vercel --prod" when ready.');
  }
  rl.close();
});