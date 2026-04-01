<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">會員列表</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">共 {{ total }} 筆會員資料</p>
      </div>
      <NuxtLink
        to="/admin/members/new"
        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-eco-red-600 hover:bg-eco-red-500 text-white text-sm font-medium transition-all w-fit"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        新增會員
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <!-- Search -->
        <div class="lg:col-span-2 relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="filters.search"
            type="text"
            placeholder="搜尋會員名稱/編號/統編..."
            class="form-input pl-9"
            @input="debouncedSearch"
          >
        </div>

        <!-- Area -->
        <select v-model="filters.factory_area" class="form-select" @change="applyFilters">
          <option value="">全部地區</option>
          <option value="1">北區</option>
          <option value="2">中區</option>
          <option value="3">南區</option>
        </select>

        <!-- Status -->
        <select v-model="filters.member_status" class="form-select" @change="applyFilters">
          <option value="">全部狀態</option>
          <option value="00">正常</option>
          <option value="12">停權</option>
          <option value="14">撤銷</option>
          <option value="15">退出</option>
        </select>

        <!-- Industry -->
        <select v-model="filters.major_number" class="form-select" @change="applyFilters">
          <option value="">全部類別</option>
          <option v-for="(label, code) in MAJOR_NUMBER_MAP" :key="code" :value="code">{{ code }}-{{ label }}</option>
        </select>

        <!-- Reset -->
        <button
          class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700 text-sm transition-all"
          @click="resetFilters"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          重設
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th class="w-24">會員編號</th>
              <th>公司名稱</th>
              <th class="hidden sm:table-cell">負責人</th>
              <th class="hidden md:table-cell">地區</th>
              <th class="hidden lg:table-cell">產業類別</th>
              <th class="hidden lg:table-cell">統一編號</th>
              <th>狀態</th>
              <th class="w-32">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="text-center py-12">
                <div class="flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500">
                  <div class="spinner w-5 h-5" />
                  <span class="text-sm">載入中...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="members.length === 0">
              <td colspan="8" class="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
                沒有符合條件的會員資料
              </td>
            </tr>
            <tr v-for="member in members" v-else :key="member.id" class="group">
              <td class="font-mono text-xs text-gray-500">{{ member.member_number }}</td>
              <td>
                <div class="font-medium text-gray-900 dark:text-white">{{ member.member_name }}</div>
                <div v-if="member.short_name" class="text-xs text-gray-400">{{ member.short_name }}</div>
              </td>
              <td class="hidden sm:table-cell text-gray-600 dark:text-gray-400">
                {{ member.chairman_name || '-' }}
              </td>
              <td class="hidden md:table-cell">
                <span
                  v-if="member.factory_area"
                  class="badge"
                  :class="member.factory_area === '1' ? 'badge-red' : member.factory_area === '2' ? 'badge-blue' : 'badge-green'"
                >
                  {{ FACTORY_AREA_MAP[member.factory_area] || member.factory_area }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="hidden lg:table-cell text-gray-600 dark:text-gray-400 text-xs">
                {{ member.major_number ? `${member.major_number}-${MAJOR_NUMBER_MAP[member.major_number] || ''}` : '-' }}
              </td>
              <td class="hidden lg:table-cell font-mono text-xs text-gray-500">
                {{ member.unified_business_number || '-' }}
              </td>
              <td>
                <span
                  class="badge"
                  :class="{
                    'badge-green': member.member_status === '00',
                    'badge-yellow': member.member_status === '12',
                    'badge-red': member.member_status === '14',
                    'badge-gray': member.member_status === '15',
                  }"
                >
                  {{ MEMBER_STATUS_MAP[member.member_status || '00'] || member.member_status }}
                </span>
              </td>
              <td>
                <div class="flex items-center gap-1">
                  <NuxtLink
                    :to="`/admin/members/${member.id}`"
                    class="p-1.5 rounded-lg text-ocean-blue-600 dark:text-ocean-blue-400 hover:bg-ocean-blue-50 dark:hover:bg-ocean-blue-900/20 transition-all"
                    title="查看"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </NuxtLink>
                  <NuxtLink
                    :to="`/admin/members/${member.id}/edit`"
                    class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700 transition-all"
                    title="編輯"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-4 py-3 border-t border-gray-100 dark:border-dark-700 flex items-center justify-between">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          顯示 {{ (currentPage - 1) * pageSize + 1 }}–{{ Math.min(currentPage * pageSize, total) }} 筆，共 {{ total }} 筆
        </p>
        <div class="flex items-center gap-2">
          <button
            :disabled="currentPage <= 1"
            class="p-1.5 rounded-lg border border-gray-300 dark:border-dark-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
            @click="changePage(currentPage - 1)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200 min-w-[80px] text-center">
            第 {{ currentPage }} / {{ totalPages }} 頁
          </span>
          <button
            :disabled="currentPage >= totalPages"
            class="p-1.5 rounded-lg border border-gray-300 dark:border-dark-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
            @click="changePage(currentPage + 1)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MEMBER_STATUS_MAP, FACTORY_AREA_MAP, MAJOR_NUMBER_MAP } from '~/types'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { members, loading, total, fetchMembers } = useMembers()

const currentPage = ref(1)
const pageSize = ref(20)
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const filters = reactive({
  search: '',
  factory_area: '',
  member_status: '',
  major_number: '',
  level: '',
})

const applyFilters = async () => {
  currentPage.value = 1
  await fetchMembers({ ...filters, page: 1, pageSize: pageSize.value })
}

let searchTimer: ReturnType<typeof setTimeout>
const debouncedSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(applyFilters, 400)
}

const resetFilters = async () => {
  filters.search = ''
  filters.factory_area = ''
  filters.member_status = ''
  filters.major_number = ''
  currentPage.value = 1
  await fetchMembers({ page: 1, pageSize: pageSize.value })
}

const changePage = async (page: number) => {
  currentPage.value = page
  await fetchMembers({ ...filters, page, pageSize: pageSize.value })
}

onMounted(() => {
  fetchMembers({ page: 1, pageSize: pageSize.value })
})
</script>
