import { defineStore } from 'pinia'
import type { AuthUser } from '~/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    token: null as string | null,
    loading: false,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    isAdminFee: (state) => state.user?.role === 'adminfee' || state.user?.role === 'admin',
    isAdminS: (state) => state.user?.role === 'admins' || state.user?.role === 'admin',
    userRole: (state) => state.user?.role,
    userName: (state) => state.user?.account,
  },

  actions: {
    setUser(user: AuthUser | null) {
      this.user = user
    },

    setToken(token: string | null) {
      this.token = token
    },

    async login(account: string, password: string) {
      this.loading = true
      try {
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: { account, password },
        }) as { token: string; user: AuthUser }

        this.user = response.user
        this.token = response.token

        // Store token in localStorage for persistence
        if (process.client) {
          localStorage.setItem('auth_token', response.token)
        }

        return { success: true }
      } catch (err: unknown) {
        const error = err as { statusMessage?: string; message?: string }
        return { success: false, error: error.statusMessage || error.message || '登入失敗' }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await $fetch('/api/auth/logout', { method: 'POST' })
      } catch {
        // ignore errors
      }
      this.user = null
      this.token = null
      if (process.client) {
        localStorage.removeItem('auth_token')
      }
    },

    async fetchCurrentUser() {
      if (this.initialized) return

      const token = process.client ? localStorage.getItem('auth_token') : null
      if (!token) {
        this.initialized = true
        return
      }

      try {
        const user = await $fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        }) as AuthUser

        this.user = user
        this.token = token
      } catch {
        this.user = null
        this.token = null
        if (process.client) {
          localStorage.removeItem('auth_token')
        }
      } finally {
        this.initialized = true
      }
    },
  },
})
