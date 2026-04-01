import { useAuthStore } from '~/stores/auth'

export const useAuth = () => {
  const authStore = useAuthStore()
  const router = useRouter()

  const login = async (account: string, password: string) => {
    const result = await authStore.login(account, password)
    if (result.success) {
      await router.push('/admin')
    }
    return result
  }

  const logout = async () => {
    await authStore.logout()
    await router.push('/admin/login')
  }

  const requireAuth = () => {
    if (!authStore.isAuthenticated) {
      router.push('/admin/login')
      return false
    }
    return true
  }

  return {
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isAdmin: computed(() => authStore.isAdmin),
    isAdminFee: computed(() => authStore.isAdminFee),
    isAdminS: computed(() => authStore.isAdminS),
    loading: computed(() => authStore.loading),
    login,
    logout,
    requireAuth,
    fetchCurrentUser: authStore.fetchCurrentUser.bind(authStore),
  }
}
