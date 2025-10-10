#!/usr/bin/env node

/**
 * Deployment Readiness Checker
 * Verifies that the application is ready for production deployment
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔍 StudyAI Deployment Readiness Check\n')

const checks = []

// Check 1: Build files exist
function checkBuildFiles() {
  const buildPath = path.join(process.cwd(), '.next')
  const exists = fs.existsSync(buildPath)
  
  checks.push({
    name: 'Build Files',
    status: exists ? 'PASS' : 'FAIL',
    message: exists ? 'Build directory exists' : 'Run npm run build first'
  })
}

// Check 2: Package.json has required scripts
function checkPackageScripts() {
  const packagePath = path.join(process.cwd(), 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  
  const requiredScripts = ['build', 'start', 'dev']
  const hasAllScripts = requiredScripts.every(script => packageJson.scripts[script])
  
  checks.push({
    name: 'Package Scripts',
    status: hasAllScripts ? 'PASS' : 'FAIL',
    message: hasAllScripts ? 'All required scripts present' : 'Missing required scripts'
  })
}

// Check 3: Environment files exist
function checkEnvironmentFiles() {
  const envExample = fs.existsSync('.env.example')
  const envProduction = fs.existsSync('.env.production')
  
  checks.push({
    name: 'Environment Files',
    status: (envExample && envProduction) ? 'PASS' : 'WARN',
    message: envExample && envProduction ? 'Environment templates ready' : 'Some environment files missing'
  })
}

// Check 4: API routes exist
function checkApiRoutes() {
  const apiPath = path.join(process.cwd(), 'app', 'api')
  const authPath = path.join(apiPath, 'auth')
  
  const requiredRoutes = ['login', 'signup', 'logout', 'refresh', 'me']
  const routesExist = requiredRoutes.every(route => 
    fs.existsSync(path.join(authPath, route, 'route.ts'))
  )
  
  checks.push({
    name: 'API Routes',
    status: routesExist ? 'PASS' : 'FAIL',
    message: routesExist ? 'All auth routes present' : 'Missing API routes'
  })
}

// Check 5: Dependencies
function checkDependencies() {
  const packagePath = path.join(process.cwd(), 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  
  const requiredDeps = ['next', 'react', 'jose', 'bcryptjs']
  const hasAllDeps = requiredDeps.every(dep => 
    packageJson.dependencies[dep] || packageJson.devDependencies[dep]
  )
  
  checks.push({
    name: 'Dependencies',
    status: hasAllDeps ? 'PASS' : 'FAIL',
    message: hasAllDeps ? 'All required dependencies installed' : 'Missing required dependencies'
  })
}

// Check 6: Configuration files
function checkConfigFiles() {
  const configs = [
    'next.config.mjs',
    'vercel.json',
    'tsconfig.json',
    '.eslintrc.json'
  ]
  
  const configsExist = configs.filter(config => fs.existsSync(config))
  
  checks.push({
    name: 'Configuration Files',
    status: configsExist.length >= 3 ? 'PASS' : 'WARN',
    message: `${configsExist.length}/${configs.length} config files present`
  })
}

// Run all checks
function runChecks() {
  checkBuildFiles()
  checkPackageScripts()
  checkEnvironmentFiles()
  checkApiRoutes()
  checkDependencies()
  checkConfigFiles()
  
  // Display results
  console.log('📋 Check Results:\n')
  
  checks.forEach(check => {
    const icon = check.status === 'PASS' ? '✅' : check.status === 'WARN' ? '⚠️' : '❌'
    console.log(`${icon} ${check.name}: ${check.message}`)
  })
  
  const passed = checks.filter(c => c.status === 'PASS').length
  const warnings = checks.filter(c => c.status === 'WARN').length
  const failed = checks.filter(c => c.status === 'FAIL').length
  
  console.log(`\n📊 Summary: ${passed} passed, ${warnings} warnings, ${failed} failed`)
  
  if (failed === 0) {
    console.log('\n🚀 Ready for deployment!')
    console.log('\nNext steps:')
    console.log('1. Deploy to Vercel: vercel --prod')
    console.log('2. Or use GitHub integration at vercel.com/new')
    console.log('3. Set environment variables in Vercel dashboard')
  } else {
    console.log('\n⚠️  Please fix the failed checks before deploying')
  }
}

// Run the checks
runChecks()