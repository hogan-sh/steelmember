<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">會員代表名單</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">共 {{ representatives.length }} 位代表</p>
      </div>
      <div class="flex items-center gap-2">
        <select v-model="sessionFilter" class="form-select w-auto" @change="fetchReps">
          <option value="">全部屆次</option>
          <option v-for="n in [22, 21, 20, 19, 18]" :key="n" :value="n">第{{ n }}屆</option>
        </select>
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-all"
          @click="exportExcel"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          匯出 Excel
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>代表號</th>
              <th>代表姓名</th>
              <th>性別</th>
              <th class="hidden sm:table-cell">出生日期</th>
              <th class="hidden md:table-cell">職稱</th>
              <th>屆次</th>
              <th class="hidden lg:table-cell">所屬公司</th>
              <th class="hidden lg:table-cell">地區</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="text-center py-12">
                <div class="flex items-center justify-center gap-2 text-gray-400">
                  <div class="spinner w-5 h-5" />
                </div>
              </td>
            </tr>
            <tr v-else-if="representatives.length === 0">
              <td colspan="8" class="text-center py-12 text-gray-400 text-sm">查無代表資料</td>
            </tr>
            <tr v-for="rep in representatives" v-else :key="rep.id">
              <td class="font-mono text-xs text-gray-500">{{ rep.deputation_number || '-' }}</td>
              <td class="font-medium text-gray-900 dark:text-white">{{ rep.deputation_name }}</td>
              <td>{{ rep.deputation_sex === 0 ? '女' : '男' }}</td>
              <td class="hidden sm:table-cell text-gray-600 dark:text-gray-400">{{ rep.deputation_birth || '-' }}</td>
              <td class="hidden md:table-cell text-gray-600 dark:text-gray-400">{{ rep.deputation_title || '-' }}</td>
              <td>{{ rep.session_number ? `第${rep.session_number}屆` : '-' }}</td>
              <td class="hidden lg:table-cell text-sm text-gray-700 dark:text-gray-300">
                {{ (rep as Record<string, unknown>).members ? ((rep as Record<string, unknown>).members as Record<string, unknown>).member_name as string : '-' }}
              </td>
              <td class="hidden lg:table-cell">
                <span v-if="(rep as Record<string, unknown>).members" class="badge badge-blue text-xs">
                  {{ FACTORY_AREA_MAP[((rep as Record<string, unknown>).members as Record<string, unknown>).factory_area as string] || '-' }}
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
import * as XLSX from 'xlsx'
import type { Deputy } from '~/types'
import { FACTORY_AREA_MAP } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const loading = ref(false)
const representatives = ref<Deputy[]>([])
const sessionFilter = ref('')

const getAuthHeaders = () => {
  const token = process.client ? localStorage.getItem('auth_token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchReps = async () => {
  loading.value = true
  const params = new URLSearchParams()
  if (sessionFilter.value) params.set('session_number', sessionFilter.value)
  params.set('deputy_type', '0')

  try {
    const response = await $fetch<{ data: Deputy[] }>(`/api/representatives?${params.toString()}`, {
      headers: getAuthHeaders(),
    })
    representatives.value = response.data || []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const exportExcel = () => {
  const rows = representatives.value.map(r => ({
    代表號: r.deputation_number || '',
    姓名: r.deputation_name || '',
    性別: r.deputation_sex === 0 ? '女' : '男',
    出生日期: r.deputation_birth || '',
    職稱: r.deputation_title || '',
    屆次: r.session_number ? `第${r.session_number}屆` : '',
    所屬公司: (r as Record<string, unknown>).members ? ((r as Record<string, unknown>).members as Record<string, unknown>).member_name as string : '',
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '會員代表')
  XLSX.writeFile(wb, `會員代表名單_${new Date().toISOString().slice(0, 10)}.xlsx`)
}

onMounted(fetchReps)
</script>
