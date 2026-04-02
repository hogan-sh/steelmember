import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  // Initialize auth state from localStorage on first load
  if (!authStore.initialized) {
    await authStore.fetchCurrentUser()
  }

  // Redirect to login if not authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo('/admin/login')
  }

  // Account management: admin only
  const role = authStore.user?.role
  if (to.path.startsWith('/admin/accounts') && role !== 'admin') {
    return navigateTo('/admin')
  }
})
