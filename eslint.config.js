import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import nextPlugin from '@next/eslint-plugin-next'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
})

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'dist/**',
      'backend/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'jest.config.js',
      'next-env.d.ts',
      'deploy-vercel.js',
      'verify-deployment.js',
      'scripts/**/*.js'
    ]
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      '@next/next': nextPlugin
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-require-imports': 'off', // Allow for config files
      '@typescript-eslint/triple-slash-reference': 'off', // Allow for Next.js types
      
      // React rules
      'react/no-unescaped-entities': 'error',
      'react/jsx-no-undef': 'error',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/immutability': 'warn',
      
      // Next.js rules
      '@next/next/no-img-element': 'error',
      
      // Accessibility rules
      'jsx-a11y/alt-text': 'error',
      
      // General rules
      'no-console': 'off', // Allow console for debugging
      'prefer-const': 'warn',
      'no-var': 'warn'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
]