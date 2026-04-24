import { create } from 'zustand'
import { AuthUser } from '@/types/api.types'

interface AuthStore {
  user: AuthUser | null
  accessToken: string | null
  isAuthenticated: boolean
  setAuth: (user: AuthUser, token: string) => void
  setAccessToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setAuth: (user, accessToken) => {
    localStorage.setItem('edu-access-token', accessToken)
    set({ user, accessToken, isAuthenticated: true })
  },

  setAccessToken: (accessToken) => {
    localStorage.setItem('edu-access-token', accessToken)
    set({ accessToken })
  },

  logout: () => {
    localStorage.removeItem('edu-access-token')
    set({ user: null, accessToken: null, isAuthenticated: false })
  },
}))