<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">資料匯出</h1>
      <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">匯出各類統計報表與會員名冊</p>
    </div>

    <!-- Export cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Member roster -->
      <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
        <div class="flex items-start gap-4 mb-4">
          <div class="w-12 h-12 rounded-xl bg-ocean-blue-100 dark:bg-ocean-blue-900/30 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-ocean-blue-600 dark:text-ocean-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">會員名冊</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-0.5">匯出完整會員基本資料</p>
          </div>
        </div>
        <div class="space-y-3">
          <div>
            <label class="form-label">地區篩選</label>
            <select v-model="memberExport.factory_area" class="form-select">
              <option value="">全部地區</option>
              <option value="1">北區</option>
              <option value="2">中區</option>
              <option value="3">南區</option>
            </select>
          </div>
          <div>
            <label class="form-label">狀態篩選</label>
            <select v-model="memberExport.member_status" class="form-select">
              <option value="">全部狀態</option>
              <option value="00">正常</option>
              <option value="12">停權</option>
            </select>
          </div>
        </div>
        <button
          class="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-ocean-blue-600 hover:bg-ocean-blue-500 text-white text-sm font-medium transition-all"
          :disabled="exporting === 'members'"
          @click="exportMembers"
        >
          <svg v-if="exporting === 'members'" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ exporting === 'members' ? '匯出中...' : '匯出 Excel' }}
        </button>
      </div>

      <!-- Area stats -->
      <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
        <div class="flex items-start gap-4 mb-4">
          <div class="w-12 h-12 rounded-xl bg-eco-red-100 dark:bg-eco-red-900/30 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-eco-red-600 dark:text-eco-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">地區統計</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-0.5">各地區會員分佈統計</p>
          </div>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">統計各地區（北/中/南）會員數量分佈及比例</p>
        <button
          class="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-eco-red-600 hover:bg-eco-red-500 text-white text-sm font-medium transition-all"
          :disabled="exporting === 'area'"
          @click="exportStats('area')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ exporting === 'area' ? '匯出中...' : '匯出統計' }}
        </button>
      </div>

      <!-- Industry stats -->
      <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
        <div class="flex items-start gap-4 mb-4">
          <div class="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">產業統計</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-0.5">各產業類別會員分佈</p>
          </div>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">統計各產業（A-M）會員數量，了解產業分佈</p>
        <button
          class="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-all"
          :disabled="exporting === 'industry'"
          @click="exportStats('industry')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ exporting === 'industry' ? '匯出中...' : '匯出統計' }}
        </button>
      </div>

      <!-- Power stats -->
      <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
        <div class="flex items-start gap-4 mb-4">
          <div class="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">用電統計</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-0.5">會員用電量統計報表</p>
          </div>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">統計各會員高壓/低壓用電量，計算總用電</p>
        <button
          class="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-medium transition-all"
          :disabled="exporting === 'power'"
          @click="exportStats('power')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ exporting === 'power' ? '匯出中...' : '匯出統計' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx'
import type { Member } from '~/types'
import { FACTORY_AREA_MAP, MAJOR_NUMBER_MAP, MEMBER_STATUS_MAP } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const exporting = ref('')

const memberExport = reactive({
  factory_area: '',
  member_status: '',
})

const getAuthHeaders = () => {
  const token = process.client ? localStorage.getItem('auth_token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const exportMembers = async () => {
  exporting.value = 'members'
  const params = new URLSearchParams()
  if (memberExport.factory_area) params.set('factory_area', memberExport.factory_area)
  if (memberExport.member_status) params.set('member_status', memberExport.member_status)

  try {
    const response = await $fetch<{ data: Member[] }>(`/api/export/members?${params.toString()}`, {
      headers: getAuthHeaders(),
    })
    const data = response.data || []
    const rows = data.map(m => ({
      會員編號: m.member_number,
      公司名稱: m.member_name,
      簡稱: m.short_name || '',
      英文名稱: m.member_en_name || '',
      負責人: m.chairman_name || '',
      統一編號: m.unified_business_number || '',
      資本額: m.capital || '',
      等級: m.level || '',
      地區: m.factory_area ? FACTORY_AREA_MAP[m.factory_area] : '',
      縣市: m.factory_city || '',
      產業代碼: m.major_number || '',
      狀態: MEMBER_STATUS_MAP[m.member_status || '00'],
      入會日期: m.join_date || '',
      電話: m.member_tel || '',
      傳真: m.member_fax || '',
      Email: m.co_email || '',
      地址: m.member_address || '',
      員工人數: m.employee_nums || 0,
      工人人數: m.worker_nums || 0,
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '會員名冊')
    XLSX.writeFile(wb, `會員名冊_${new Date().toISOString().slice(0, 10)}.xlsx`)
  } catch (err) {
    console.error(err)
  } finally {
    exporting.value = ''
  }
}

const exportStats = async (type: string) => {
  exporting.value = type
  try {
    const response = await $fetch<{ data: unknown; type: string }>(`/api/export/statistics?type=${type}`, {
      headers: getAuthHeaders(),
    })

    let rows: Record<string, unknown>[] = []

    if (type === 'area') {
      const data = response.data as Record<string, number>
      rows = Object.entries(data).map(([area, count]) => ({
        地區代碼: area,
        地區名稱: FACTORY_AREA_MAP[area] || area,
        會員數: count,
      }))
    } else if (type === 'industry') {
      const data = response.data as Record<string, number>
      rows = Object.entries(data).map(([code, count]) => ({
        產業代碼: code,
        產業名稱: MAJOR_NUMBER_MAP[code] || code,
        會員數: count,
      }))
    } else if (type === 'power') {
      rows = (response.data as Record<string, unknown>[]).map(m => ({
        公司名稱: m.member_name,
        地區: m.factory_area ? FACTORY_AREA_MAP[m.factory_area as string] : '',
        高壓用電_kW: m.electric_power_high,
        低壓用電_kW: m.electric_power_low,
      }))
    }

    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, `${type}統計`)
    XLSX.writeFile(wb, `統計報表_${type}_${new Date().toISOString().slice(0, 10)}.xlsx`)
  } catch (err) {
    console.error(err)
  } finally {
    exporting.value = ''
  }
}
</script>
