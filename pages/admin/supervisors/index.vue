<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">理監事名單</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">共 {{ supervisors.length }} 位理監事</p>
      </div>
      <div class="flex items-center gap-2">
        <select v-model="sessionFilter" class="form-select w-auto" @change="fetchSupervisors">
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

    <!-- Group by type -->
    <template v-for="group in groupedSupervisors" :key="group.type">
      <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden">
        <div class="px-4 py-3 bg-gray-50 dark:bg-dark-700 border-b border-gray-200 dark:border-dark-600">
          <h3 class="font-semibold text-gray-900 dark:text-white text-sm">
            {{ DEPUTY_TYPE_MAP[group.type] }}
            <span class="ml-2 text-gray-400">({{ group.members.length }} 人)</span>
          </h3>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>代表號</th>
              <th>姓名</th>
              <th>性別</th>
              <th class="hidden sm:table-cell">職稱</th>
              <th>屆次</th>
              <th class="hidden lg:table-cell">所屬公司</th>
              <th class="hidden lg:table-cell">地區</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rep in group.members" :key="rep.id">
              <td class="font-mono text-xs text-gray-500">{{ rep.deputation_number || '-' }}</td>
              <td class="font-medium text-gray-900 dark:text-white">{{ rep.deputation_name }}</td>
              <td>{{ rep.deputation_sex === 0 ? '女' : '男' }}</td>
              <td class="hidden sm:table-cell">{{ rep.deputation_title || '-' }}</td>
              <td>{{ rep.session_number ? `第${rep.session_number}屆` : '-' }}</td>
              <td class="hidden lg:table-cell text-sm">
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
    </template>

    <div v-if="loading" class="text-center py-12">
      <div class="spinner w-6 h-6 mx-auto" />
    </div>
    <div v-else-if="!loading && supervisors.length === 0" class="text-center py-12 text-gray-400 text-sm">
      查無理監事資料
    </div>
  </div>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx'
import type { Deputy } from '~/types'
import { DEPUTY_TYPE_MAP, FACTORY_AREA_MAP } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const loading = ref(false)
const supervisors = ref<Deputy[]>([])
const sessionFilter = ref('')

const groupedSupervisors = computed(() => {
  const groups: Record<number, Deputy[]> = {}
  supervisors.value.forEach(s => {
    const type = s.deputy_type || 0
    if (!groups[type]) groups[type] = []
    groups[type].push(s)
  })
  return Object.entries(groups)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([type, members]) => ({ type: Number(type), members }))
})

const getAuthHeaders = () => {
  const token = process.client ? localStorage.getItem('auth_token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchSupervisors = async () => {
  loading.value = true
  const params = new URLSearchParams()
  if (sessionFilter.value) params.set('session_number', sessionFilter.value)

  try {
    const response = await $fetch<{ data: Deputy[] }>(`/api/supervisors?${params.toString()}`, {
      headers: getAuthHeaders(),
    })
    supervisors.value = response.data || []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const exportExcel = () => {
  const rows = supervisors.value.map(r => ({
    類型: DEPUTY_TYPE_MAP[r.deputy_type || 0] || '',
    代表號: r.deputation_number || '',
    姓名: r.deputation_name || '',
    性別: r.deputation_sex === 0 ? '女' : '男',
    職稱: r.deputation_title || '',
    屆次: r.session_number ? `第${r.session_number}屆` : '',
    所屬公司: (r as Record<string, unknown>).members ? ((r as Record<string, unknown>).members as Record<string, unknown>).member_name as string : '',
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '理監事名單')
  XLSX.writeFile(wb, `理監事名單_${new Date().toISOString().slice(0, 10)}.xlsx`)
}

onMounted(fetchSupervisors)
</script>
