<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">儀表板</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
          歡迎回來，{{ authStore.userName }} | {{ new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }) }}
        </p>
      </div>
      <NuxtLink
        to="/admin/members/new"
        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-eco-red-600 hover:bg-eco-red-500 text-white text-sm font-medium transition-all duration-200"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        新增會員
      </NuxtLink>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="stat-card h-28 animate-pulse bg-gray-200 dark:bg-dark-700" />
    </div>

    <!-- Stats Cards -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="stat-card">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">總會員數</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.totalMembers }}</p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-ocean-blue-100 dark:bg-ocean-blue-900/30 flex items-center justify-center">
            <svg class="w-5 h-5 text-ocean-blue-600 dark:text-ocean-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <span class="text-green-500">正常：{{ stats.activeMembers }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">正常會員</p>
            <p class="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{{ stats.activeMembers }}</p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-3 text-xs text-gray-500 dark:text-gray-400">
          佔全部 {{ stats.totalMembers > 0 ? Math.round(stats.activeMembers / stats.totalMembers * 100) : 0 }}%
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">停權/撤銷</p>
            <p class="text-3xl font-bold text-eco-red-600 dark:text-eco-red-400 mt-1">{{ stats.suspendedMembers }}</p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-eco-red-100 dark:bg-eco-red-900/30 flex items-center justify-center">
            <svg class="w-5 h-5 text-eco-red-600 dark:text-eco-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
        </div>
        <div class="mt-3 text-xs text-gray-500 dark:text-gray-400">
          停權 + 撤銷
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">北/中/南區</p>
            <p class="text-3xl font-bold text-ocean-blue-600 dark:text-ocean-blue-400 mt-1">3</p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-ocean-blue-100 dark:bg-ocean-blue-900/30 flex items-center justify-center">
            <svg class="w-5 h-5 text-ocean-blue-600 dark:text-ocean-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-3 flex gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span v-for="area in stats.membersByArea" :key="area.area">{{ area.area }}: {{ area.count }}</span>
        </div>
      </div>
    </div>

    <!-- Charts & Recent activity -->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Area distribution -->
      <div class="lg:col-span-1 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">地區分佈</h3>
        <div class="space-y-3">
          <div v-for="area in stats.membersByArea" :key="area.area">
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="text-gray-600 dark:text-gray-400">{{ area.area }}</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ area.count }} 家</span>
            </div>
            <div class="h-2 rounded-full bg-gray-100 dark:bg-dark-700">
              <div
                class="h-2 rounded-full transition-all duration-1000"
                :class="area.area === '北區' ? 'bg-eco-red-500' : area.area === '中區' ? 'bg-ocean-blue-500' : 'bg-green-500'"
                :style="{ width: stats.totalMembers > 0 ? `${(area.count / stats.totalMembers) * 100}%` : '0%' }"
              />
            </div>
          </div>
        </div>

        <!-- Quick stats -->
        <div class="mt-6 pt-4 border-t border-gray-100 dark:border-dark-700 grid grid-cols-2 gap-3">
          <NuxtLink
            to="/admin/members"
            class="p-3 rounded-lg bg-gray-50 dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors text-center"
          >
            <div class="text-lg font-bold text-gray-900 dark:text-white">{{ stats.totalMembers }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">全部會員</div>
          </NuxtLink>
          <NuxtLink
            to="/admin/fees"
            class="p-3 rounded-lg bg-gray-50 dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors text-center"
          >
            <div class="text-lg font-bold text-eco-red-600 dark:text-eco-red-400">{{ stats.recentFees?.length || 0 }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">待收費用</div>
          </NuxtLink>
        </div>
      </div>

      <!-- Recent Changes -->
      <div class="lg:col-span-2 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-900 dark:text-white">最近變更記錄</h3>
          <NuxtLink to="/admin/members" class="text-xs text-eco-red-500 hover:text-eco-red-400 transition-colors">
            查看全部
          </NuxtLink>
        </div>

        <div v-if="loading" class="space-y-3">
          <div v-for="i in 5" :key="i" class="h-12 bg-gray-100 dark:bg-dark-700 rounded-lg animate-pulse" />
        </div>

        <div v-else-if="stats.recentChanges?.length === 0" class="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
          暫無最近變更記錄
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="log in stats.recentChanges"
            :key="log.id"
            class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
          >
            <div class="w-8 h-8 rounded-full bg-ocean-blue-100 dark:bg-ocean-blue-900/30 flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-ocean-blue-600 dark:text-ocean-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ (log as Record<string, unknown>).members ? ((log as Record<string, unknown>).members as Record<string, unknown>).member_name as string : log.member_number }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ log.change_item }}</p>
            </div>
            <span class="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
              {{ log.change_date }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <NuxtLink
        v-for="action in quickActions"
        :key="action.label"
        :to="action.path"
        class="group p-4 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 hover:border-eco-red-300 dark:hover:border-eco-red-800 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
      >
        <div class="flex flex-col items-start gap-3">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
            :class="action.color"
          >
            <svg class="w-5 h-5" :class="action.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="action.icon" />
            </svg>
          </div>
          <div>
            <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ action.label }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ action.desc }}</p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import type { DashboardStats } from '~/types'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const authStore = useAuthStore()
const loading = ref(true)
const stats = ref<DashboardStats>({
  totalMembers: 0,
  activeMembers: 0,
  suspendedMembers: 0,
  withdrawnMembers: 0,
  membersByArea: [
    { area: '北區', count: 0 },
    { area: '中區', count: 0 },
    { area: '南區', count: 0 },
  ],
  membersByLevel: [],
  membersByIndustry: [],
  recentFees: [],
  recentChanges: [],
})

const quickActions = [
  {
    label: '新增會員',
    desc: '建立新會員資料',
    path: '/admin/members/new',
    icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    color: 'bg-eco-red-100 dark:bg-eco-red-900/30',
    iconColor: 'text-eco-red-600 dark:text-eco-red-400',
  },
  {
    label: '費用管理',
    desc: '查看費用記錄',
    path: '/admin/fees',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    label: '資料匯出',
    desc: '匯出 Excel 報表',
    path: '/admin/export',
    icon: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    color: 'bg-ocean-blue-100 dark:bg-ocean-blue-900/30',
    iconColor: 'text-ocean-blue-600 dark:text-ocean-blue-400',
  },
  {
    label: 'PSI 系統',
    desc: '產銷存資料管理',
    path: '/admin/psi',
    icon: '9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    color: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
]

const getAuthHeaders = () => {
  if (process.client) {
    const token = localStorage.getItem('auth_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
  return {}
}

onMounted(async () => {
  try {
    const response = await $fetch<{ data: DashboardStats }>('/api/dashboard/stats', {
      headers: getAuthHeaders(),
    })
    if (response.data) {
      stats.value = response.data
    }
  } catch (err) {
    console.error('Failed to load dashboard stats:', err)
  } finally {
    loading.value = false
  }
})
</script>
