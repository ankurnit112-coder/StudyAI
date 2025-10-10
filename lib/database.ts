// Mock database implementation - replace with actual database in production
// This could be PostgreSQL, MongoDB, or any other database

export interface UserRecord {
  id: number
  email: string
  name: string
  password: string
  role: 'student' | 'admin'
  currentClass?: number
  schoolName?: string
  createdAt: Date
  lastLogin: Date | null
  isActive: boolean
  emailVerified: boolean
  profilePicture?: string
  preferences: {
    theme: 'light' | 'dark'
    language: string
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
  }
  loginAttempts: number
  lockedUntil?: Date
}

export interface SessionRecord {
  id: string
  userId: number
  refreshToken: string
  deviceInfo: string
  ipAddress: string
  createdAt: Date
  expiresAt: Date
  isActive: boolean
}

class MockDatabase {
  private static instance: MockDatabase
  private users = new Map<string, UserRecord>()
  private sessions = new Map<string, SessionRecord>()
  private userIdCounter = 1

  private constructor() {
    // Initialize with test user
    this.users.set('test@example.com', {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hGx9S8jyG', // password
      role: 'student',
      currentClass: 12,
      schoolName: 'Test School',
      createdAt: new Date(),
      lastLogin: null,
      isActive: true,
      emailVerified: true,
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      },
      loginAttempts: 0
    })
  }

  static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase()
    }
    return MockDatabase.instance
  }

  // User operations
  async createUser(userData: Omit<UserRecord, 'id' | 'createdAt' | 'lastLogin' | 'loginAttempts'>): Promise<UserRecord> {
    const user: UserRecord = {
      ...userData,
      id: this.userIdCounter++,
      createdAt: new Date(),
      lastLogin: null,
      loginAttempts: 0
    }
    
    this.users.set(userData.email.toLowerCase(), user)
    return user
  }

  async getUserByEmail(email: string): Promise<UserRecord | null> {
    return this.users.get(email.toLowerCase()) || null
  }

  async getUserById(id: number): Promise<UserRecord | null> {
    for (const user of this.users.values()) {
      if (user.id === id) {
        return user
      }
    }
    return null
  }

  async updateUser(id: number, updates: Partial<UserRecord>): Promise<UserRecord | null> {
    const user = await this.getUserById(id)
    if (!user) return null

    const updatedUser = { ...user, ...updates }
    this.users.set(user.email, updatedUser)
    return updatedUser
  }

  async updateLastLogin(id: number): Promise<void> {
    const user = await this.getUserById(id)
    if (user) {
      user.lastLogin = new Date()
      user.loginAttempts = 0 // Reset on successful login
    }
  }

  async incrementLoginAttempts(email: string): Promise<number> {
    const user = this.users.get(email.toLowerCase())
    if (user) {
      user.loginAttempts = (user.loginAttempts || 0) + 1
      
      // Lock account after 5 failed attempts for 15 minutes
      if (user.loginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000)
      }
      
      return user.loginAttempts
    }
    return 0
  }

  async isAccountLocked(email: string): Promise<boolean> {
    const user = this.users.get(email.toLowerCase())
    if (!user || !user.lockedUntil) return false
    
    if (user.lockedUntil > new Date()) {
      return true
    }
    
    // Unlock account if lock period has passed
    user.lockedUntil = undefined
    user.loginAttempts = 0
    return false
  }

  // Session operations
  async createSession(sessionData: Omit<SessionRecord, 'id' | 'createdAt'>): Promise<SessionRecord> {
    const sessionId = this.generateSessionId()
    const session: SessionRecord = {
      ...sessionData,
      id: sessionId,
      createdAt: new Date()
    }
    
    this.sessions.set(sessionId, session)
    return session
  }

  async getSession(sessionId: string): Promise<SessionRecord | null> {
    return this.sessions.get(sessionId) || null
  }

  async invalidateSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId)
    if (session) {
      session.isActive = false
    }
  }

  async invalidateAllUserSessions(userId: number): Promise<void> {
    for (const session of this.sessions.values()) {
      if (session.userId === userId) {
        session.isActive = false
      }
    }
  }

  async cleanupExpiredSessions(): Promise<void> {
    const now = new Date()
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.sessions.delete(sessionId)
      }
    }
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  // Analytics and monitoring
  async getUserStats(): Promise<{
    totalUsers: number
    activeUsers: number
    newUsersToday: number
    lockedAccounts: number
  }> {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    let totalUsers = 0
    let activeUsers = 0
    let newUsersToday = 0
    let lockedAccounts = 0

    for (const user of this.users.values()) {
      totalUsers++
      
      if (user.isActive) activeUsers++
      if (user.createdAt >= today) newUsersToday++
      if (user.lockedUntil && user.lockedUntil > now) lockedAccounts++
    }

    return { totalUsers, activeUsers, newUsersToday, lockedAccounts }
  }
}

export const database = MockDatabase.getInstance()