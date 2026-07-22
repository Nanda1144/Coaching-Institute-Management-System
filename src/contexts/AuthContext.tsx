import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import authService from '../services/auth/auth.service'

interface User {
  id: string
  facultyId?: string
  studentId?: string
  role: string
  name?: string
  email?: string
  fullName?: string
  permissions?: string[]
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
      const responseData = response.data || response
      const userData = responseData.data?.user || responseData.user || responseData

      const userRole = userData.role
      if (!userRole) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userRole')
        localStorage.removeItem('userName')
        setUser(null)
        setIsLoading(false)
        return
      }

      const userName = userData.fullName || userData.name || userData.full_name || ''
      localStorage.setItem('userRole', userRole)
      localStorage.setItem('userName', userName)

      setUser({
        id: userData.id || userData.facultyId || userData.studentId || '',
        facultyId: userData.facultyId || userData.id,
        studentId: userData.studentId,
        role: userRole,
        name: userName,
        email: userData.email || '',
        fullName: userName,
        permissions: userData.permissions,
      })
    } catch {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
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
    const responseData = response.data || response
    const accessToken = responseData.data?.accessToken || responseData.accessToken || responseData.token
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken)
    }
    const refreshToken = responseData.data?.refreshToken || responseData.refreshToken
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }

    const userData = responseData.data?.user || responseData.user || responseData
    const userRole = userData.role
    if (!userRole) throw new Error('Invalid user data: missing role')

    const userName = userData.fullName || userData.name || userData.full_name || ''
    localStorage.setItem('userRole', userRole)
    localStorage.setItem('userName', userName)

    setUser({
      id: userData.id || userData.facultyId || userData.studentId || '',
      facultyId: userData.facultyId || userData.id,
      studentId: userData.studentId,
      role: userRole,
      name: userName,
      email: userData.email || '',
      fullName: userName,
      permissions: userData.permissions,
    })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
    setUser(null)
    authService.logout().catch(() => {})
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
