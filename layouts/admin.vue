<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-950 flex">
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-700 shadow-lg"
      :class="sidebarOpen ? 'w-64' : 'w-16'"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-4 py-4 border-b border-gray-200 dark:border-dark-700 min-h-[65px]">
        <div class="w-8 h-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-eco-red-600 to-eco-red-800 flex items-center justify-center">
          <span class="text-white font-bold text-sm">鋼</span>
        </div>
        <div v-if="sidebarOpen" class="overflow-hidden">
          <div class="text-gray-900 dark:text-white font-bold text-xs leading-tight whitespace-nowrap">臺灣鋼鐵同業工會</div>
          <div class="text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">管理系統</div>
        </div>
      </div>

      <!-- Nav Items -->
      <nav class="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        <template v-for="group in navGroups" :key="group.label">
          <!-- Group label -->
          <div v-if="sidebarOpen && group.label" class="px-3 py-2 mt-2 first:mt-0">
            <p class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {{ group.label }}
            </p>
          </div>
          <div v-else-if="!sidebarOpen && group.label" class="my-2 mx-2 border-t border-gray-200 dark:border-dark-700" />

          <!-- Nav links -->
          <NuxtLink
            v-for="item in group.items"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative"
            :class="isActive(item.path)
              ? 'bg-eco-red-50 dark:bg-eco-red-900/20 text-eco-red-600 dark:text-eco-red-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-gray-900 dark:hover:text-white'"
          >
            <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
            <span v-if="sidebarOpen" class="truncate">{{ item.label }}</span>
            <!-- Tooltip when collapsed -->
            <div
              v-if="!sidebarOpen"
              class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
            >
              {{ item.label }}
            </div>
          </NuxtLink>
        </template>
      </nav>

      <!-- Bottom actions -->
      <div class="border-t border-gray-200 dark:border-dark-700 p-3 space-y-1">
        <button
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-gray-900 dark:hover:text-white transition-all group relative"
          @click="handleLogout"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span v-if="sidebarOpen">登出</span>
          <div
            v-if="!sidebarOpen"
            class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
          >
            登出
          </div>
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col min-w-0 transition-all duration-300" :class="sidebarOpen ? 'ml-64' : 'ml-16'">
      <!-- Top bar -->
      <header class="sticky top-0 z-40 bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700 px-4 sm:px-6">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <!-- Toggle sidebar -->
            <button
              class="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-800 transition-all"
              @click="sidebarOpen = !sidebarOpen"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <!-- Breadcrumb -->
            <nav class="hidden sm:flex items-center gap-2 text-sm">
              <NuxtLink to="/admin" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors">
                管理後台
              </NuxtLink>
              <template v-if="breadcrumbs.length > 0">
                <span class="text-gray-300 dark:text-gray-600">/</span>
                <template v-for="(crumb, idx) in breadcrumbs" :key="idx">
                  <NuxtLink
                    v-if="crumb.path && idx < breadcrumbs.length - 1"
                    :to="crumb.path"
                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    {{ crumb.label }}
                  </NuxtLink>
                  <span v-else class="text-gray-700 dark:text-gray-200 font-medium">{{ crumb.label }}</span>
                  <span v-if="idx < breadcrumbs.length - 1" class="text-gray-300 dark:text-gray-600">/</span>
                </template>
              </template>
            </nav>
          </div>

          <!-- User info -->
          <div class="flex items-center gap-3">
            <div class="hidden sm:flex flex-col items-end">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ authStore.userName }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ roleLabel }}</span>
            </div>
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-eco-red-500 to-ocean-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {{ authStore.userName?.charAt(0).toUpperCase() }}
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-4 sm:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(true)

const roleLabel = computed(() => {
  const map: Record<string, string> = {
    admin: '系統管理員',
    adminfee: '費用管理員',
    admins: '統計管理員',
    member: '會員',
  }
  return map[authStore.user?.role || ''] || '管理員'
})

// Build nav groups
const navGroups = computed(() => [
  {
    label: '主要功能',
    items: [
      {
        path: '/admin',
        label: '儀表板',
        icon: resolveComponent('IconDashboard'),
      },
    ],
  },
  {
    label: '會員管理',
    items: [
      { path: '/admin/members', label: '會員列表', icon: resolveComponent('IconUsers') },
      { path: '/admin/members/new', label: '新增會員', icon: resolveComponent('IconUserPlus') },
      { path: '/admin/search', label: '進階查詢', icon: resolveComponent('IconSearch') },
    ],
  },
  {
    label: '費用管理',
    items: [
      { path: '/admin/fees', label: '費用列表', icon: resolveComponent('IconDollar') },
      { path: '/admin/fees/search', label: '費用查詢', icon: resolveComponent('IconSearchFee') },
    ],
  },
  {
    label: '代表管理',
    items: [
      { path: '/admin/representatives', label: '會員代表', icon: resolveComponent('IconRep') },
      { path: '/admin/attendance', label: '出席代表', icon: resolveComponent('IconAttend') },
      { path: '/admin/supervisors', label: '理監事名單', icon: resolveComponent('IconSupervisor') },
    ],
  },
  {
    label: '統計匯出',
    items: [
      { path: '/admin/export', label: '資料匯出', icon: resolveComponent('IconExport') },
    ],
  },
  {
    label: 'PSI 系統',
    items: [
      { path: '/admin/psi', label: 'PSI 總覽', icon: resolveComponent('IconPsi') },
      { path: '/admin/psi/manufacture', label: '製造資料', icon: resolveComponent('IconManufacture') },
      { path: '/admin/psi/industry-codes', label: '產業代碼', icon: resolveComponent('IconCode') },
      { path: '/admin/psi/product-codes', label: '產品代碼', icon: resolveComponent('IconProduct') },
      { path: '/admin/psi/country-codes', label: '國家代碼', icon: resolveComponent('IconCountry') },
    ],
  },
])

// Simple icon components using SVG
const IconDashboard = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0M3 7l9-4 9 4M13 13h4m-4 4h4m-9-4h.01M8 17h.01"/></svg>`,
}
const IconUsers = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
}
const IconUserPlus = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>`,
}
const IconSearch = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>`,
}
const IconDollar = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
}
const IconSearchFee = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>`,
}
const IconRep = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`,
}
const IconAttend = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
}
const IconSupervisor = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>`,
}
const IconExport = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
}
const IconPsi = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
}
const IconManufacture = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>`,
}
const IconCode = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>`,
}
const IconProduct = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`,
}
const IconCountry = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
}

const isActive = (path: string) => {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

const breadcrumbs = computed(() => {
  const pathParts = route.path.replace('/admin/', '').split('/')
  const crumbs = []

  const labels: Record<string, string> = {
    members: '會員管理',
    new: '新增會員',
    edit: '編輯',
    factories: '工廠資料',
    deputies: '代表資料',
    fees: '費用記錄',
    logs: '變更記錄',
    'fees-list': '費用管理',
    search: '查詢',
    representatives: '會員代表',
    attendance: '出席代表',
    supervisors: '理監事',
    export: '匯出',
    psi: 'PSI 系統',
    manufacture: '製造資料',
    'industry-codes': '產業代碼',
    'product-codes': '產品代碼',
    'country-codes': '國家代碼',
  }

  let currentPath = '/admin'
  for (const part of pathParts) {
    if (!part || part === 'admin') continue
    currentPath += `/${part}`
    crumbs.push({
      label: labels[part] || part,
      path: currentPath,
    })
  }

  return crumbs
})

const handleLogout = async () => {
  const { logout } = useAuth()
  await logout()
}
</script>
