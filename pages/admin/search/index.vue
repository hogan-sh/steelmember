<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">進階會員查詢</h1>
      <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">多條件組合搜尋會員資料</p>
    </div>

    <!-- Search Form -->
    <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-4">查詢條件</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="form-label">關鍵字</label>
          <input v-model="searchForm.search" type="text" class="form-input" placeholder="公司名稱/編號/統編">
        </div>
        <div>
          <label class="form-label">地區</label>
          <select v-model="searchForm.factory_area" class="form-select">
            <option value="">全部</option>
            <option value="1">北區</option>
            <option value="2">中區</option>
            <option value="3">南區</option>
          </select>
        </div>
        <div>
          <label class="form-label">縣市</label>
          <input v-model="searchForm.factory_city" type="text" class="form-input" placeholder="例：台北市">
        </div>
        <div>
          <label class="form-label">產業代碼</label>
          <select v-model="searchForm.major_number" class="form-select">
            <option value="">全部</option>
            <option v-for="(label, code) in MAJOR_NUMBER_MAP" :key="code" :value="code">{{ code }}-{{ label }}</option>
          </select>
        </div>
        <div>
          <label class="form-label">會員狀態</label>
          <select v-model="searchForm.member_status" class="form-select">
            <option value="">全部</option>
            <option value="00">正常</option>
            <option value="12">停權</option>
            <option value="14">撤銷</option>
            <option value="15">退出</option>
          </select>
        </div>
        <div>
          <label class="form-label">等級</label>
          <input v-model="searchForm.level" type="text" class="form-input" placeholder="等級">
        </div>
        <div class="lg:col-span-2 flex items-end gap-3">
          <button
            class="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-ocean-blue-600 hover:bg-ocean-blue-500 text-white text-sm font-medium transition-all"
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
            class="flex-1 py-2 rounded-lg border border-gray-300 dark:border-dark-600 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-dark-700 transition-all"
            @click="resetSearch"
          >
            重設
          </button>
        </div>
      </div>
    </div>

    <!-- Results count + export -->
    <div v-if="searched" class="flex items-center justify-between">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        查詢結果：<span class="font-bold text-gray-900 dark:text-white">{{ results.length }}</span> 筆
      </p>
      <button
        v-if="results.length > 0"
        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-all"
        @click="exportExcel"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        匯出 Excel
      </button>
    </div>

    <!-- Results table -->
    <div v-if="searched" class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden">
      <div v-if="results.length === 0" class="text-center py-12 text-gray-400 text-sm">
        查無符合條件的會員
      </div>
      <div v-else class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>編號</th>
              <th>公司名稱</th>
              <th class="hidden sm:table-cell">負責人</th>
              <th class="hidden md:table-cell">地區</th>
              <th class="hidden md:table-cell">縣市</th>
              <th class="hidden lg:table-cell">產業</th>
              <th class="hidden lg:table-cell">統一編號</th>
              <th class="hidden xl:table-cell">入會日</th>
              <th>狀態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in results" :key="member.id">
              <td class="font-mono text-xs text-gray-500">{{ member.member_number }}</td>
              <td>
                <div class="font-medium text-gray-900 dark:text-white">{{ member.member_name }}</div>
                <div v-if="member.short_name" class="text-xs text-gray-400">{{ member.short_name }}</div>
              </td>
              <td class="hidden sm:table-cell text-gray-600 dark:text-gray-400">{{ member.chairman_name || '-' }}</td>
              <td class="hidden md:table-cell">
                <span v-if="member.factory_area" class="badge badge-blue text-xs">{{ FACTORY_AREA_MAP[member.factory_area] }}</span>
              </td>
              <td class="hidden md:table-cell text-sm text-gray-600 dark:text-gray-400">{{ member.factory_city || '-' }}</td>
              <td class="hidden lg:table-cell text-xs text-gray-600 dark:text-gray-400">
                {{ member.major_number ? `${member.major_number}-${MAJOR_NUMBER_MAP[member.major_number]}` : '-' }}
              </td>
              <td class="hidden lg:table-cell font-mono text-xs text-gray-500">{{ member.unified_business_number || '-' }}</td>
              <td class="hidden xl:table-cell text-xs text-gray-600 dark:text-gray-400">{{ member.join_date || '-' }}</td>
              <td>
                <span
                  class="badge text-xs"
                  :class="{
                    'badge-green': member.member_status === '00',
                    'badge-yellow': member.member_status === '12',
                    'badge-red': member.member_status === '14',
                    'badge-gray': member.member_status === '15',
                  }"
                >
                  {{ MEMBER_STATUS_MAP[member.member_status || '00'] }}
                </span>
              </td>
              <td>
                <NuxtLink
                  :to="`/admin/members/${member.id}`"
                  class="p-1.5 rounded-lg text-ocean-blue-600 hover:bg-ocean-blue-50 dark:hover:bg-ocean-blue-900/20 transition-all"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </NuxtLink>
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
import type { Member } from '~/types'
import { MAJOR_NUMBER_MAP, FACTORY_AREA_MAP, MEMBER_STATUS_MAP } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const loading = ref(false)
const results = ref<Member[]>([])
const searched = ref(false)

const searchForm = reactive({
  search: '',
  factory_area: '',
  factory_city: '',
  major_number: '',
  member_status: '',
  level: '',
})

const getAuthHeaders = () => {
  const token = process.client ? localStorage.getItem('auth_token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const doSearch = async () => {
  loading.value = true
  searched.value = true
  const params = new URLSearchParams()
  Object.entries(searchForm).forEach(([k, v]) => { if (v) params.set(k, v) })
  params.set('pageSize', '500')

  try {
    const response = await $fetch<{ data: Member[] }>(`/api/members?${params.toString()}`, {
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
  Object.assign(searchForm, { search: '', factory_area: '', factory_city: '', major_number: '', member_status: '', level: '' })
  results.value = []
  searched.value = false
}

const exportExcel = () => {
  const rows = results.value.map(m => ({
    會員編號: m.member_number,
    公司名稱: m.member_name,
    簡稱: m.short_name || '',
    英文名稱: m.member_en_name || '',
    負責人: m.chairman_name || '',
    負責人英文名: m.chairman_en_name || '',
    統一編號: m.unified_business_number || '',
    資本額: m.capital || '',
    等級: m.level || '',
    地區: m.factory_area ? FACTORY_AREA_MAP[m.factory_area] : '',
    縣市: m.factory_city || '',
    產業代碼: m.major_number || '',
    產業名稱: m.major_number ? MAJOR_NUMBER_MAP[m.major_number] : '',
    申請日期: m.application_date || '',
    入會日期: m.join_date || '',
    立案日期: m.license_date || '',
    狀態: MEMBER_STATUS_MAP[m.member_status || '00'],
    郵遞區號: m.member_zip || '',
    地址: m.member_address || '',
    電話: m.member_tel || '',
    傳真: m.member_fax || '',
    Email: m.co_email || '',
    網站: m.co_url || '',
    員工人數: m.employee_nums || 0,
    工人人數: m.worker_nums || 0,
    高壓用電: m.electric_power_high || '',
    低壓用電: m.electric_power_low || '',
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '會員查詢結果')
  XLSX.writeFile(wb, `會員查詢_${new Date().toISOString().slice(0, 10)}.xlsx`)
}
</script>
