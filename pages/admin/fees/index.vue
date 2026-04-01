<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">費用管理</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">共 {{ total }} 筆費用記錄</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <input
          v-model="filters.member_number"
          type="text"
          placeholder="會員編號"
          class="form-input"
          @input="debouncedSearch"
        >
        <input
          v-model="filters.period_start"
          type="date"
          class="form-input"
          placeholder="期間起"
          @change="applyFilters"
        >
        <input
          v-model="filters.period_end"
          type="date"
          class="form-input"
          placeholder="期間迄"
          @change="applyFilters"
        >
        <select v-model="filters.payment_type" class="form-select" @change="applyFilters">
          <option value="">全部繳費方式</option>
          <option value="1">支票</option>
          <option value="2">郵匯</option>
          <option value="3">現金</option>
        </select>
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
              <th>繳費單號</th>
              <th>會員編號</th>
              <th class="hidden sm:table-cell">公司名稱</th>
              <th>費用期間</th>
              <th>應繳金額</th>
              <th>繳費方式</th>
              <th>繳費日期</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="text-center py-12">
                <div class="flex items-center justify-center gap-2 text-gray-400">
                  <div class="spinner w-5 h-5" />
                  <span class="text-sm">載入中...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="fees.length === 0">
              <td colspan="8" class="text-center py-12 text-gray-400 text-sm">查無費用記錄</td>
            </tr>
            <tr v-for="fee in fees" v-else :key="fee.id">
              <td class="font-mono text-xs text-gray-500">{{ fee.payment_number || '-' }}</td>
              <td class="font-mono text-xs text-gray-500">{{ fee.member_number }}</td>
              <td class="hidden sm:table-cell text-sm text-gray-700 dark:text-gray-300">
                {{ (fee as Record<string, unknown>).members ? ((fee as Record<string, unknown>).members as Record<string, unknown>).member_name as string : '-' }}
              </td>
              <td class="text-xs text-gray-600 dark:text-gray-400">
                {{ fee.period_start }} ~ {{ fee.period_end }}
              </td>
              <td class="text-right font-medium text-gray-900 dark:text-white">
                {{ fee.amount_due ? `$${fee.amount_due.toLocaleString()}` : '-' }}
              </td>
              <td>
                <span v-if="fee.payment_type" class="badge badge-blue">{{ PAYMENT_TYPE_MAP[fee.payment_type] }}</span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="text-sm text-gray-600 dark:text-gray-400">{{ fee.pay_date || '-' }}</td>
              <td>
                <span class="badge" :class="fee.pay_date ? 'badge-green' : 'badge-yellow'">
                  {{ fee.pay_date ? '已繳' : '待繳' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div class="px-4 py-3 border-t border-gray-100 dark:border-dark-700 flex items-center justify-between">
        <p class="text-sm text-gray-500 dark:text-gray-400">共 {{ total }} 筆</p>
        <div class="flex items-center gap-2">
          <button
            :disabled="currentPage <= 1"
            class="p-1.5 rounded-lg border border-gray-300 dark:border-dark-600 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-all"
            @click="changePage(currentPage - 1)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span class="text-sm text-gray-700 dark:text-gray-200">{{ currentPage }} / {{ totalPages }}</span>
          <button
            :disabled="currentPage >= totalPages"
            class="p-1.5 rounded-lg border border-gray-300 dark:border-dark-600 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-all"
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
import { PAYMENT_TYPE_MAP } from '~/types'
import type { MemberFee } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const loading = ref(false)
const fees = ref<MemberFee[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const filters = reactive({
  member_number: '',
  period_start: '',
  period_end: '',
  payment_type: '',
})

const getAuthHeaders = () => {
  const token = process.client ? localStorage.getItem('auth_token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchFees = async (page = 1) => {
  loading.value = true
  const params = new URLSearchParams()
  if (filters.member_number) params.set('member_number', filters.member_number)
  if (filters.period_start) params.set('period_start', filters.period_start)
  if (filters.period_end) params.set('period_end', filters.period_end)
  if (filters.payment_type) params.set('payment_type', filters.payment_type)
  params.set('page', String(page))
  params.set('pageSize', String(pageSize.value))

  try {
    const response = await $fetch<{ data: MemberFee[]; total: number }>(`/api/fees?${params.toString()}`, {
      headers: getAuthHeaders(),
    })
    fees.value = response.data || []
    total.value = response.total || 0
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  fetchFees(1)
}

let searchTimer: ReturnType<typeof setTimeout>
const debouncedSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(applyFilters, 400)
}

const resetFilters = () => {
  Object.assign(filters, { member_number: '', period_start: '', period_end: '', payment_type: '' })
  fetchFees(1)
}

const changePage = (page: number) => {
  currentPage.value = page
  fetchFees(page)
}

onMounted(() => fetchFees(1))
</script>
