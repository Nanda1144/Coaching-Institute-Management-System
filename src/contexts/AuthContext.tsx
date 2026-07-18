import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import authService from '../services/auth/auth.service'

interface User {
  id: string
  facultyId: string
  role: string
  name?: string
  email?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      setUser(null)
      setIsLoading(false)
      return
    }
    try {
      const response = await authService.getMe()
      const userData = response.data || response
      setUser({
        id: userData.id || userData.facultyId,
        facultyId: userData.facultyId || userData.id,
        role: userData.role || 'FACULTY',
        name: userData.fullName || userData.name,
        email: userData.email,
      })
    } catch {
      localStorage.removeItem('accessToken')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password })
    const { accessToken, data } = response.data || response
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken)
    }
    const userData = data || response.data || response
    setUser({
      id: userData.id || userData.facultyId,
      facultyId: userData.facultyId || userData.id,
      role: userData.role || 'FACULTY',
      name: userData.fullName || userData.name,
      email: userData.email,
    })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
