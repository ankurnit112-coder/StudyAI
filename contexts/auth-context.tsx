"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService, User, LoginCredentials, SignupData } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated on app load
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser()
          setUser(currentUser)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const user = await authService.login(credentials)
      setUser(user)
    } catch (error) {
      setUser(null)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (data: SignupData) => {
    setIsLoading(true)
    try {
      const user = await authService.signup(data)
      setUser(user)
    } catch (error) {
      setUser(null)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      // Check remember me status before logout (since logout clears it)
      const wasRememberMeEnabled = authService.isRememberMeEnabled()
      await authService.logout()
      
      // Only clear remembered email if remember me was not enabled
      if (!wasRememberMeEnabled) {
        authService.clearRememberedEmail()
      }
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser()
        setUser(currentUser)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('User refresh error:', error)
      setUser(null)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-sky border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )
    }

    if (!isAuthenticated) {
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin'
      }
      return null
    }

    return <Component {...props} />
  }
}