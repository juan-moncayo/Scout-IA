// contexts/auth-context.tsx
"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  email: string
  full_name: string
  role: 'admin' | 'agent'
  onboarding_completed: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAdmin: boolean
  isAgent: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const savedToken = localStorage.getItem('training_token')
    
    if (savedToken) {
      verifyToken(savedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const verifyToken = async (savedToken: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${savedToken}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setToken(savedToken)
        
        document.cookie = `training_token=${savedToken}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict`
      } else {
        localStorage.removeItem('training_token')
        document.cookie = 'training_token=; path=/; max-age=0'
      }
    } catch (error) {
      console.error('[AUTH] Error verifying token:', error)
      localStorage.removeItem('training_token')
      document.cookie = 'training_token=; path=/; max-age=0'
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    if (!token) return

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('[AUTH] Error refreshing user:', error)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Login failed')
    }

    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('training_token', data.token)
    
    document.cookie = `training_token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict`

    if (data.user.role === 'admin') {
      router.push('/training/admin')
    } else {
      router.push('/training/dashboard')
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('training_token')
    document.cookie = 'training_token=; path=/; max-age=0'
    router.push('/training/login')
  }

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    refreshUser,
    isAdmin: user?.role === 'admin',
    isAgent: user?.role === 'agent',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}