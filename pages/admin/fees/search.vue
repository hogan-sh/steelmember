<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">費用查詢</h1>
      <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">進階費用搜尋與統計</p>
    </div>

    <!-- Search Form -->
    <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-4">查詢條件</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="form-label">搜尋</label>
          <input v-model="searchForm.search" type="text" class="form-input" placeholder="會員編號/繳費單號">
        </div>
        <div>
          <label class="form-label">年度</label>
          <input v-model="searchForm.year" type="number" class="form-input" placeholder="例：2024">
        </div>
        <div>
          <label class="form-label">繳費方式</label>
          <select v-model="searchForm.payment_type" class="form-select">
            <option value="">全部</option>
            <option value="1">支票</option>
            <option value="2">郵匯</option>
            <option value="3">現金</option>
          </select>
        </div>
        <div class="flex items-end">
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="searchForm.unpaid" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-eco-red-600">
            <span class="text-sm text-gray-700 dark:text-gray-300">僅顯示待繳</span>
          </label>
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-ocean-blue-600 hover:bg-ocean-blue-500 text-white text-sm font-medium transition-all"
          :disabled="loading"
          @click="doSearch"
        >
          <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          查詢
        </button>
        <button
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-dark-700 transition-all"
          @click="resetSearch"
        >
          重設
        </button>
      </div>
    </div>

    <!-- Summary -->
    <div v-if="results.length > 0" class="grid grid-cols-3 gap-4">
      <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-4 text-center">
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ results.length }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">筆記錄</p>
      </div>
      <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-4 text-center">
        <p class="text-2xl font-bold text-ocean-blue-600 dark:text-ocean-blue-400">
          ${{ totalAmount.toLocaleString() }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400">總應繳金額</p>
      </div>
      <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-4 text-center">
        <p class="text-2xl font-bold text-eco-red-600 dark:text-eco-red-400">
          {{ unpaidCount }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400">待繳筆數</p>
      </div>
    </div>

    <!-- Results table -->
    <div v-if="searched" class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden">
      <div v-if="results.length === 0" class="text-center py-12 text-gray-400 text-sm">
        查無符合條件的費用記錄
      </div>
      <div v-else class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>繳費單號</th>
              <th>會員編號</th>
              <th class="hidden sm:table-cell">公司名稱</th>
              <th>費用期間</th>
              <th>應繳</th>
              <th>繳費方式</th>
              <th>繳費日</th>
              <th>已繳</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="fee in results" :key="fee.id">
              <td class="font-mono text-xs text-gray-500">{{ fee.payment_number || '-' }}</td>
              <td class="font-mono text-xs">{{ fee.member_number }}</td>
              <td class="hidden sm:table-cell text-sm text-gray-700 dark:text-gray-300">
                {{ (fee as Record<string, unknown>).members ? ((fee as Record<string, unknown>).members as Record<string, unknown>).member_name as string : '-' }}
              </td>
              <td class="text-xs">{{ fee.period_start }} ~ {{ fee.period_end }}</td>
              <td class="text-right">${{ fee.amount_due?.toLocaleString() || '-' }}</td>
              <td>{{ fee.payment_type ? PAYMENT_TYPE_MAP[fee.payment_type] : '-' }}</td>
              <td class="text-sm">{{ fee.pay_date || '-' }}</td>
              <td class="text-right text-green-600 dark:text-green-400">${{ fee.pay_money?.toLocaleString() || '-' }}</td>
              <td>
                <span class="badge" :class="fee.pay_date ? 'badge-green' : 'badge-yellow'">
                  {{ fee.pay_date ? '已繳' : '待繳' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MemberFee } from '~/types'
import { PAYMENT_TYPE_MAP } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const loading = ref(false)
const results = ref<MemberFee[]>([])
const searched = ref(false)

const searchForm = reactive({
  search: '',
  year: '',
  payment_type: '',
  unpaid: false,
})

const totalAmount = computed(() =>
  results.value.reduce((sum, f) => sum + (f.amount_due || 0), 0)
)
const unpaidCount = computed(() =>
  results.value.filter(f => !f.pay_date).length
)

const getAuthHeaders = () => {
  const token = process.client ? localStorage.getItem('auth_token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const doSearch = async () => {
  loading.value = true
  searched.value = true
  const params = new URLSearchParams()
  if (searchForm.search) params.set('search', searchForm.search)
  if (searchForm.year) params.set('year', searchForm.year)
  if (searchForm.payment_type) params.set('payment_type', searchForm.payment_type)
  if (searchForm.unpaid) params.set('unpaid', 'true')

  try {
    const response = await $fetch<{ data: MemberFee[] }>(`/api/fees/search?${params.toString()}`, {
      headers: getAuthHeaders(),
    })
    results.value = response.data || []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  Object.assign(searchForm, { search: '', year: '', payment_type: '', unpaid: false })
  results.value = []
  searched.value = false
}
</script>
