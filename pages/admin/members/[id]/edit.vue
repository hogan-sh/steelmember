<template>
  <div class="max-w-5xl space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <NuxtLink
        :to="`/admin/members/${id}`"
        class="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-700 transition-all"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">編輯會員</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">{{ form.member_name }}</p>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading && !form.member_name" class="flex items-center justify-center py-20">
      <div class="spinner w-8 h-8" />
    </div>

    <form v-else @submit.prevent="handleSubmit">
      <!-- Basic Info -->
      <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6 mb-6">
        <h2 class="font-semibold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-100 dark:border-dark-700">基本資料</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="form-label">會員編號</label>
            <input v-model="form.member_number" type="text" class="form-input" readonly>
          </div>
          <div class="sm:col-span-2">
            <label class="form-label">公司名稱 <span class="text-eco-red-500">*</span></label>
            <input v-model="form.member_name" type="text" class="form-input" required>
          </div>
          <div>
            <label class="form-label">英文名稱</label>
            <input v-model="form.member_en_name" type="text" class="form-input">
          </div>
          <div>
            <label class="form-label">簡稱</label>
            <input v-model="form.short_name" type="text" class="form-input">
          </div>
          <div>
            <label class="form-label">統一編號</label>
            <input v-model="form.unified_business_number" type="text" class="form-input">
          </div>
          <div>
            <label class="form-label">負責人</label>
            <input v-model="form.chairman_name" type="text" class="form-input">
          </div>
          <div>
            <label class="form-label">負責人英文名</label>
            <input v-model="form.chairman_en_name" type="text" class="form-input">
          </div>
          <div>
            <label class="form-label">資本額</label>
            <input v-model.number="form.capital" type="number" class="form-input">
          </div>
          <div>
            <label class="form-label">等級</label>
            <input v-model="form.level" type="text" class="form-input">
          </div>
        </div>
      </div>

      <!-- Classification & Status -->
      <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6 mb-6">
        <h2 class="font-semibold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-100 dark:border-dark-700">分類與狀態</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="form-label">申請日期</label>
            <input v-model="form.application_date" type="date" class="form-input">
          </div>
          <div>
            <label class="form-label">入會日期</label>
            <input v-model="form.join_date" type="date" class="form-input">
          </div>
          <div>
            <label class="form-label">立案日期</label>
            <input v-model="form.license_date" type="date" class="form-input">
          </div>
          <div>
            <label class="form-label">所在區域</label>
            <select v-model="form.factory_area" class="form-select">
              <option value="">請選擇</option>
              <option value="1">北區</option>
              <option value="2">中區</option>
              <option value="3">南區</option>
            </select>
          </div>
          <div>
            <label class="form-label">所在縣市</label>
            <input v-model="form.factory_city" type="text" class="form-input">
          </div>
          <div>
            <label class="form-label">主要產業代碼</label>
            <select v-model="form.major_number" class="form-select">
              <option value="">請選擇</option>
              <option v-for="(label, code) in MAJOR_NUMBER_MAP" :key="code" :value="code">{{ code }}-{{ label }}</option>
            </select>
          </div>
          <div>
            <label class="form-label">次要產業代碼</label>
            <input v-model="form.more_number" type="text" class="form-input">
          </div>
          <div>
            <label class="form-label">會員狀態</label>
            <select v-model="form.member_status" class="form-select">
              <option value="00">正常</option>
              <option value="12">停權</option>
              <option value="14">撤銷</option>
              <option value="15">退出</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Contact -->
      <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6 mb-6">
        <h2 class="font-semibold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-100 dark:border-dark-700">聯絡資訊</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="form-label">郵遞區號</label>
            <input v-model="form.member_zip" type="text" class="form-input">
          </div>
          <div>
            <label class="form-label">電子郵件</label>
            <input v-model="form.co_email" type="email" class="form-input">
          </div>
          <div class="sm:col-span-2">
            <label class="form-label">公司地址</label>
            <input v-model="form.member_address" type="text" class="form-input">
          </div>
          <div class="sm:col-span-2">
            <label class="form-label">英文地址</label>
            <input v-model="form.member_en_address" type="text" class="form-input">
          </div>
          <div>
            <label class="form-label">公司電話</label>
            <input v-model="form.member_tel" type="text" class="form-input">
          </div>
          <div>
            <label class="form-label">公司傳真</label>
            <input v-model="form.member_fax" type="text" class="form-input">
          </div>
          <div class="sm:col-span-2">
            <label class="form-label">公司網站</label>
            <input v-model="form.co_url" type="url" class="form-input">
          </div>
        </div>
      </div>

      <!-- Business Info -->
      <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6 mb-6">
        <h2 class="font-semibold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-100 dark:border-dark-700">營業資訊</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="form-label">員工人數</label>
            <input v-model.number="form.employee_nums" type="number" class="form-input" min="0">
          </div>
          <div>
            <label class="form-label">工人人數</label>
            <input v-model.number="form.worker_nums" type="number" class="form-input" min="0">
          </div>
          <div>
            <label class="form-label">高壓用電 (kW)</label>
            <input v-model.number="form.electric_power_high" type="number" class="form-input" step="0.01">
          </div>
          <div>
            <label class="form-label">低壓用電 (kW)</label>
            <input v-model.number="form.electric_power_low" type="number" class="form-input" step="0.01">
          </div>
          <div class="sm:col-span-2">
            <label class="form-label">主要設備</label>
            <textarea v-model="form.equi" class="form-input" rows="2" />
          </div>
          <div class="sm:col-span-2">
            <label class="form-label">主要產品</label>
            <textarea v-model="form.prod" class="form-input" rows="2" />
          </div>
        </div>
      </div>

      <!-- Success message -->
      <Transition name="slide-down">
        <div v-if="successMsg" class="flex items-center gap-2 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm mb-4">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ successMsg }}
        </div>
      </Transition>

      <!-- Error message -->
      <Transition name="slide-down">
        <div v-if="errorMsg" class="flex items-center gap-2 p-4 rounded-xl bg-eco-red-50 dark:bg-eco-red-900/20 border border-eco-red-200 dark:border-eco-red-800 text-eco-red-700 dark:text-eco-red-400 text-sm mb-4">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ errorMsg }}
        </div>
      </Transition>

      <!-- Submit buttons -->
      <div class="flex items-center justify-end gap-3">
        <NuxtLink
          :to="`/admin/members/${id}`"
          class="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 text-sm font-medium transition-all"
        >
          取消
        </NuxtLink>
        <button
          type="submit"
          :disabled="saving"
          class="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-eco-red-600 hover:bg-eco-red-500 disabled:opacity-50 text-white text-sm font-medium transition-all"
        >
          <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ saving ? '儲存中...' : '儲存變更' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { MAJOR_NUMBER_MAP } from '~/types'
import type { Member } from '~/types'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const route = useRoute()
const id = computed(() => route.params.id as string)
const { currentMember, loading, fetchMember, updateMember } = useMembers()
const saving = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const form = reactive<Partial<Member>>({
  member_number: '',
  member_name: '',
  member_en_name: '',
  short_name: '',
  chairman_name: '',
  chairman_en_name: '',
  application_date: '',
  join_date: '',
  license_date: '',
  capital: null,
  level: '',
  unified_business_number: '',
  factory_area: '',
  factory_city: '',
  major_number: '',
  more_number: '',
  member_status: '00',
  co_url: '',
  co_email: '',
  member_zip: '',
  member_address: '',
  member_en_address: '',
  member_tel: '',
  member_fax: '',
  equi: '',
  prod: '',
  electric_power_high: null,
  electric_power_low: null,
  employee_nums: 0,
  worker_nums: 0,
})

onMounted(async () => {
  await fetchMember(id.value)
  if (currentMember.value) {
    Object.assign(form, currentMember.value)
  }
})

const handleSubmit = async () => {
  saving.value = true
  errorMsg.value = ''
  successMsg.value = ''

  const result = await updateMember(id.value, form)
  if (result.success) {
    successMsg.value = '會員資料已更新成功'
    setTimeout(() => { successMsg.value = '' }, 3000)
  } else {
    errorMsg.value = result.error || '更新失敗，請稍後再試'
  }
  saving.value = false
}
</script>
