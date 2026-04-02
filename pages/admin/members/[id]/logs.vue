<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">變更記錄</h2>
      <button
        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-eco-red-600 hover:bg-eco-red-500 text-white text-sm font-medium transition-all"
        @click="showForm = !showForm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        新增記錄
      </button>
    </div>

    <!-- Add Form -->
    <div v-if="showForm" class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-4">新增變更記錄</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="form-label">變更日期</label>
          <input v-model="logForm.change_date" type="date" class="form-input">
        </div>
        <div>
          <label class="form-label">理事會報告</label>
          <input v-model="logForm.board_report" type="text" class="form-input" placeholder="例：第X屆第X次">
        </div>
        <div class="sm:col-span-2">
          <label class="form-label">變更事項</label>
          <input v-model="logForm.change_item" type="text" class="form-input" placeholder="例：更換負責人">
        </div>
        <div class="sm:col-span-2">
          <label class="form-label">備註</label>
          <textarea v-model="logForm.remarks" class="form-input" rows="2" placeholder="詳細說明" />
        </div>
        <div>
          <label class="form-label">承辦人資訊</label>
          <input v-model="logForm.handler_info" type="text" class="form-input">
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <button
          :disabled="saving"
          class="px-4 py-2 rounded-lg bg-eco-red-600 hover:bg-eco-red-500 text-white text-sm font-medium"
          @click="saveLog"
        >
          {{ saving ? '儲存中...' : '儲存' }}
        </button>
        <button
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 text-gray-600 dark:text-gray-400 text-sm"
          @click="showForm = false"
        >
          取消
        </button>
      </div>
    </div>

    <!-- Timeline -->
    <div v-if="loading" class="text-center py-8">
      <div class="spinner w-6 h-6 mx-auto" />
    </div>

    <div v-else-if="logs.length === 0" class="text-center py-12 text-gray-400 dark:text-gray-500">
      <p class="text-sm">尚無變更記錄</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="log in logs"
        :key="log.id"
        class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-5"
      >
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-ocean-blue-100 dark:bg-ocean-blue-900/30 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-ocean-blue-600 dark:text-ocean-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-1">
              <span class="font-semibold text-gray-900 dark:text-white text-sm">{{ log.change_item || '資料變更' }}</span>
              <span class="badge badge-blue text-xs">{{ log.change_date }}</span>
            </div>
            <p v-if="log.board_report" class="text-xs text-gray-500 dark:text-gray-400">
              理事會：{{ log.board_report }}
            </p>
            <p v-if="log.remarks" class="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {{ log.remarks }}
            </p>
            <p v-if="log.handler_info" class="text-xs text-gray-400 dark:text-gray-500 mt-1">
              承辦：{{ log.handler_info }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChangeLog } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })

const route = useRoute()
const id = computed(() => route.params.id as string)
const loading = ref(true)
const saving = ref(false)
const showForm = ref(false)
const logs = ref<ChangeLog[]>([])

const logForm = reactive({
  change_date: '',
  board_report: '',
  change_item: '',
  remarks: '',
  handler_info: '',
})

const getAuthHeaders = () => {
  const token = process.client ? localStorage.getItem('auth_token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchLogs = async () => {
  loading.value = true
  try {
    const response = await $fetch<{ data: ChangeLog[] }>(`/api/members/${id.value}/logs`, {
      headers: getAuthHeaders(),
    })
    logs.value = response.data || []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const saveLog = async () => {
  saving.value = true
  try {
    await $fetch(`/api/members/${id.value}/logs`, {
      method: 'POST',
      body: logForm,
      headers: getAuthHeaders(),
    })
    showForm.value = false
    Object.assign(logForm, { change_date: '', board_report: '', change_item: '', remarks: '', handler_info: '' })
    await fetchLogs()
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}

onMounted(fetchLogs)
</script>
