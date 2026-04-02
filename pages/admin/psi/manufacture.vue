<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <NuxtLink
        to="/admin/psi"
        class="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-700 transition-all"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">製造資料查詢</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">查詢產銷存調查資料</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label class="form-label">資料年月</label>
          <input v-model="filter.year_month" type="text" class="form-input" placeholder="例：202401">
        </div>
        <div>
          <label class="form-label">廠商代號</label>
          <input v-model="filter.member_number" type="text" class="form-input" placeholder="空白搜尋全部">
        </div>
        <div>
          <label class="form-label">產品序號</label>
          <input v-model="filter.product_serial" type="text" class="form-input" placeholder="產品序號">
        </div>
        <div class="flex items-end gap-2">
          <button
            class="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-ocean-blue-600 hover:bg-ocean-blue-500 text-white text-sm font-medium transition-all"
            :disabled="loading"
            @click="fetchData(1)"
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
            class="px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700 text-sm transition-all"
            @click="resetFilter"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-100 dark:border-dark-700 flex items-center justify-between">
        <span class="text-sm text-gray-500 dark:text-gray-400">共 {{ total }} 筆資料</span>
      </div>
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>資料年月</th>
              <th>廠商代號</th>
              <th>產品序號</th>
              <th class="text-right">數量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="4" class="text-center py-12">
                <div class="flex items-center justify-center gap-2 text-gray-400">
                  <div class="spinner w-5 h-5" />
                  <span class="text-sm">載入中...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="4" class="text-center py-12 text-gray-400 text-sm">查無符合資料</td>
            </tr>
            <tr v-for="item in items" v-else :key="item.id">
              <td class="font-mono text-sm">{{ item.data_year_month }}</td>
              <td class="text-gray-700 dark:text-gray-300">{{ item.member_number }}</td>
              <td class="text-gray-700 dark:text-gray-300">{{ item.product_serial }}</td>
              <td class="text-right font-medium tabular-nums">{{ item.quantity?.toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div v-if="total > pageSize" class="px-4 py-3 border-t border-gray-100 dark:border-dark-700 flex items-center justify-between">
        <span class="text-xs text-gray-500 dark:text-gray-400">
          第 {{ page }} / {{ Math.ceil(total / pageSize) }} 頁，共 {{ total }} 筆
        </span>
        <div class="flex gap-2">
          <button
            class="px-3 py-1 text-xs rounded border border-gray-300 dark:border-dark-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
            :disabled="page <= 1"
            @click="fetchData(page - 1)"
          >
            上一頁
          </button>
          <button
            class="px-3 py-1 text-xs rounded border border-gray-300 dark:border-dark-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
            :disabled="page >= Math.ceil(total / pageSize)"
            @click="fetchData(page + 1)"
          >
            下一頁
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PsiManufacture } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const loading = ref(false)
const items = ref<PsiManufacture[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = 50
const filter = reactive({ year_month: '', member_number: '', product_serial: '' })

const getAuthHeaders = () => {
  const token = process.client ? localStorage.getItem('auth_token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchData = async (p = 1) => {
  loading.value = true
  page.value = p
  const params = new URLSearchParams({ page: String(p), pageSize: String(pageSize) })
  if (filter.year_month) params.set('year_month', filter.year_month)
  if (filter.member_number) params.set('member_number', filter.member_number)
  if (filter.product_serial) params.set('product_serial', filter.product_serial)

  try {
    const res = await $fetch<{ data: PsiManufacture[]; total: number }>(`/api/psi/manufacture?${params}`, {
      headers: getAuthHeaders(),
    })
    items.value = res.data || []
    total.value = res.total || 0
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const resetFilter = () => {
  filter.year_month = ''
  filter.member_number = ''
  filter.product_serial = ''
  fetchData(1)
}

onMounted(() => fetchData(1))
</script>
