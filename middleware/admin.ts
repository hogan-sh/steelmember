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

  // Role-based access control
  const role = authStore.user?.role

  // Fee-only routes
  if (to.path.startsWith('/admin/fees') && role === 'admins') {
    return navigateTo('/admin')
  }

  // Statistics/representatives routes
  if (
    (to.path.startsWith('/admin/representatives') ||
     to.path.startsWith('/admin/attendance') ||
     to.path.startsWith('/admin/supervisors')) &&
    role === 'adminfee'
  ) {
    return navigateTo('/admin')
  }
})
