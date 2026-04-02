<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/admin/members"
          class="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-700 transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </NuxtLink>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ member?.member_name || '載入中...' }}
            </h1>
            <span
              v-if="member?.member_status"
              class="badge"
              :class="{
                'badge-green': member.member_status === '00',
                'badge-yellow': member.member_status === '12',
                'badge-red': member.member_status === '14',
                'badge-gray': member.member_status === '15',
              }"
            >
              {{ MEMBER_STATUS_MAP[member.member_status] }}
            </span>
          </div>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            {{ member?.member_number }} | {{ member?.unified_business_number }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          :to="`/admin/members/${id}/edit`"
          class="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 text-sm font-medium transition-all"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          編輯
        </NuxtLink>
      </div>
    </div>

    <!-- Sub-navigation tabs -->
    <div class="flex items-center gap-1 border-b border-gray-200 dark:border-dark-700 -mb-2 overflow-x-auto">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.path"
        :to="tab.path"
        class="px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
        :class="$route.path === tab.path
          ? 'border-eco-red-500 text-eco-red-600 dark:text-eco-red-400'
          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
      >
        {{ tab.label }}
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="spinner w-8 h-8" />
    </div>

    <!-- Member Info -->
    <div v-else-if="member" class="grid lg:grid-cols-3 gap-6">
      <!-- Left: Main info -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Company Info -->
        <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">公司基本資料</h3>
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="field in companyFields" :key="field.label">
              <dt class="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1">{{ field.label }}</dt>
              <dd class="text-sm text-gray-900 dark:text-white">{{ field.value || '-' }}</dd>
            </div>
          </dl>
        </div>

        <!-- Contact Info -->
        <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">聯絡資訊</h3>
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="field in contactFields" :key="field.label">
              <dt class="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1">{{ field.label }}</dt>
              <dd class="text-sm text-gray-900 dark:text-white break-all">{{ field.value || '-' }}</dd>
            </div>
          </dl>
        </div>

        <!-- Business Info -->
        <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">營業資訊</h3>
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="field in businessFields" :key="field.label">
              <dt class="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1">{{ field.label }}</dt>
              <dd class="text-sm text-gray-900 dark:text-white">{{ field.value || '-' }}</dd>
            </div>
          </dl>
          <div v-if="member.equi || member.prod" class="mt-4 space-y-3">
            <div v-if="member.equi">
              <dt class="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1">主要設備</dt>
              <dd class="text-sm text-gray-900 dark:text-white">{{ member.equi }}</dd>
            </div>
            <div v-if="member.prod">
              <dt class="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1">主要產品</dt>
              <dd class="text-sm text-gray-900 dark:text-white">{{ member.prod }}</dd>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Sidebar -->
      <div class="space-y-6">
        <!-- Quick info card -->
        <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
          <div class="text-center mb-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-eco-red-500 to-ocean-blue-600 flex items-center justify-center text-white text-2xl font-black mx-auto mb-3">
              {{ member.member_name?.charAt(0) }}
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ member.member_name }}</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm">{{ member.short_name }}</p>
          </div>

          <div class="space-y-2 text-sm">
            <div class="flex justify-between py-1 border-b border-gray-100 dark:border-dark-700">
              <span class="text-gray-500 dark:text-gray-400">會員編號</span>
              <span class="font-medium text-gray-900 dark:text-white font-mono">{{ member.member_number }}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-gray-100 dark:border-dark-700">
              <span class="text-gray-500 dark:text-gray-400">地區</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ FACTORY_AREA_MAP[member.factory_area || ''] || '-' }}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-gray-100 dark:border-dark-700">
              <span class="text-gray-500 dark:text-gray-400">入會日期</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ member.join_date || '-' }}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-gray-500 dark:text-gray-400">資本額</span>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ member.capital ? member.capital.toLocaleString() + ' 元' : '-' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-3">快速操作</h3>
          <div class="space-y-2">
            <NuxtLink
              v-for="action in memberActions"
              :key="action.label"
              :to="action.path"
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors group"
            >
              <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-dark-700 flex items-center justify-center group-hover:bg-eco-red-100 dark:group-hover:bg-eco-red-900/20 transition-colors">
                <svg class="w-4 h-4 text-gray-500 group-hover:text-eco-red-600 dark:group-hover:text-eco-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="action.icon" />
                </svg>
              </div>
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ action.label }}</span>
            </NuxtLink>
          </div>
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
  pageTransition: false,
})

const route = useRoute()
const id = computed(() => route.params.id as string)
const { currentMember: member, loading, fetchMember } = useMembers()

const tabs = computed(() => [
  { path: `/admin/members/${id.value}`, label: '基本資料' },
  { path: `/admin/members/${id.value}/edit`, label: '編輯' },
  { path: `/admin/members/${id.value}/factories`, label: '工廠資料' },
  { path: `/admin/members/${id.value}/deputies`, label: '代表資料' },
  { path: `/admin/members/${id.value}/fees`, label: '費用記錄' },
  { path: `/admin/members/${id.value}/logs`, label: '變更記錄' },
])

const memberActions = computed(() => [
  {
    label: '工廠資料',
    path: `/admin/members/${id.value}/factories`,
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  },
  {
    label: '代表資料',
    path: `/admin/members/${id.value}/deputies`,
    icon: '16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    label: '費用記錄',
    path: `/admin/members/${id.value}/fees`,
    icon: '12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    label: '變更記錄',
    path: `/admin/members/${id.value}/logs`,
    icon: '9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  },
])

const companyFields = computed(() => [
  { label: '英文名稱', value: member.value?.member_en_name },
  { label: '簡稱', value: member.value?.short_name },
  { label: '負責人', value: member.value?.chairman_name },
  { label: '負責人英文名', value: member.value?.chairman_en_name },
  { label: '統一編號', value: member.value?.unified_business_number },
  { label: '資本額', value: member.value?.capital ? member.value.capital.toLocaleString() + ' 元' : null },
  { label: '等級', value: member.value?.level },
  { label: '申請日期', value: member.value?.application_date },
  { label: '入會日期', value: member.value?.join_date },
  { label: '立案日期', value: member.value?.license_date },
  { label: '所在縣市', value: member.value?.factory_city },
  { label: '主要產業', value: member.value?.major_number ? `${member.value.major_number}-${MAJOR_NUMBER_MAP[member.value.major_number]}` : null },
])

const contactFields = computed(() => [
  { label: '郵遞區號', value: member.value?.member_zip },
  { label: '公司地址', value: member.value?.member_address },
  { label: '英文地址', value: member.value?.member_en_address },
  { label: '公司電話', value: member.value?.member_tel },
  { label: '公司傳真', value: member.value?.member_fax },
  { label: '電子郵件', value: member.value?.co_email },
  { label: '公司網站', value: member.value?.co_url },
])

const businessFields = computed(() => [
  { label: '員工人數', value: member.value?.employee_nums?.toString() },
  { label: '工人人數', value: member.value?.worker_nums?.toString() },
  { label: '高壓用電 (kW)', value: member.value?.electric_power_high?.toString() },
  { label: '低壓用電 (kW)', value: member.value?.electric_power_low?.toString() },
])

onMounted(() => {
  fetchMember(id.value)
})
</script>
