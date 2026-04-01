import type { Member, MemberFilter, ApiResponse } from '~/types'

export const useMembers = () => {
  const members = ref<Member[]>([])
  const currentMember = ref<Member | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)

  const getAuthHeaders = () => {
    if (process.client) {
      const token = localStorage.getItem('auth_token')
      return token ? { Authorization: `Bearer ${token}` } : {}
    }
    return {}
  }

  const fetchMembers = async (filter: MemberFilter = {}) => {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      if (filter.search) params.set('search', filter.search)
      if (filter.factory_area) params.set('factory_area', filter.factory_area)
      if (filter.factory_city) params.set('factory_city', filter.factory_city)
      if (filter.major_number) params.set('major_number', filter.major_number)
      if (filter.member_status) params.set('member_status', filter.member_status)
      if (filter.level) params.set('level', filter.level)
      if (filter.page) params.set('page', String(filter.page))
      if (filter.pageSize) params.set('pageSize', String(filter.pageSize))

      const response = await $fetch<ApiResponse<Member[]>>(`/api/members?${params.toString()}`, {
        headers: getAuthHeaders(),
      })
      members.value = response.data || []
      total.value = response.total || 0
    } catch (err: unknown) {
      const e = err as { message?: string }
      error.value = e.message || '載入失敗'
    } finally {
      loading.value = false
    }
  }

  const fetchMember = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<ApiResponse<Member>>(`/api/members/${id}`, {
        headers: getAuthHeaders(),
      })
      currentMember.value = response.data || null
    } catch (err: unknown) {
      const e = err as { message?: string }
      error.value = e.message || '載入失敗'
    } finally {
      loading.value = false
    }
  }

  const createMember = async (data: Partial<Member>) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<ApiResponse<Member>>('/api/members', {
        method: 'POST',
        body: data,
        headers: getAuthHeaders(),
      })
      return { success: true, data: response.data }
    } catch (err: unknown) {
      const e = err as { statusMessage?: string; message?: string }
      error.value = e.statusMessage || e.message || '建立失敗'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateMember = async (id: string, data: Partial<Member>) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<ApiResponse<Member>>(`/api/members/${id}`, {
        method: 'PUT',
        body: data,
        headers: getAuthHeaders(),
      })
      return { success: true, data: response.data }
    } catch (err: unknown) {
      const e = err as { statusMessage?: string; message?: string }
      error.value = e.statusMessage || e.message || '更新失敗'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    members,
    currentMember,
    loading,
    error,
    total,
    fetchMembers,
    fetchMember,
    createMember,
    updateMember,
  }
}
