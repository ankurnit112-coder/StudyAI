#!/usr/bin/env node

// Load environment variables
import dotenv from 'dotenv'
dotenv.config()

// Script to check environment variables
console.log('🔍 Checking Environment Variables...\n')

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET',
  'NEXTAUTH_SECRET'
]

const optionalVars = [
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_APP_NAME',
  'NODE_ENV'
]

console.log('📋 Required Variables:')
console.log('=' .repeat(50))

let allRequired = true
requiredVars.forEach(varName => {
  const value = process.env[varName]
  const status = value ? '✅' : '❌'
  const display = value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : 'NOT SET'
  
  console.log(`${status} ${varName}: ${display}`)
  
  if (!value) allRequired = false
})

console.log('\n📋 Optional Variables:')
console.log('=' .repeat(50))

optionalVars.forEach(varName => {
  const value = process.env[varName]
  const status = value ? '✅' : '⚠️'
  const display = value || 'NOT SET'
  
  console.log(`${status} ${varName}: ${display}`)
})

console.log('\n' + '=' .repeat(50))

if (allRequired) {
  console.log('🎉 All required environment variables are set!')
  console.log('✅ Your application should work correctly.')
} else {
  console.log('❌ Some required environment variables are missing!')
  console.log('⚠️  Please check your .env file.')
}

console.log('\n📁 Environment files being loaded:')
console.log('   - .env (main configuration)')
console.log('   - .env.local (local overrides)')
console.log('   - .env.production (production settings)')

console.log('\n🔗 Supabase Project URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('🔑 JWT Secret Length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length + ' characters' : 'NOT SET')