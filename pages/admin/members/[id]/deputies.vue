<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">代表資料</h2>
      <button
        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-eco-red-600 hover:bg-eco-red-500 text-white text-sm font-medium transition-all"
        @click="showForm = !showForm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        新增代表
      </button>
    </div>

    <!-- Add form -->
    <div v-if="showForm" class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-4">新增代表資料</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="form-label">代表號碼</label>
          <input v-model="deputyForm.deputation_number" type="text" class="form-input">
        </div>
        <div>
          <label class="form-label">代表姓名</label>
          <input v-model="deputyForm.deputation_name" type="text" class="form-input">
        </div>
        <div>
          <label class="form-label">性別</label>
          <select v-model.number="deputyForm.deputation_sex" class="form-select">
            <option :value="1">男</option>
            <option :value="0">女</option>
          </select>
        </div>
        <div>
          <label class="form-label">出生日期</label>
          <input v-model="deputyForm.deputation_birth" type="date" class="form-input">
        </div>
        <div>
          <label class="form-label">職稱</label>
          <input v-model="deputyForm.deputation_title" type="text" class="form-input" placeholder="總經理/廠長...">
        </div>
        <div>
          <label class="form-label">屆次</label>
          <input v-model.number="deputyForm.session_number" type="number" class="form-input" placeholder="20">
        </div>
        <div>
          <label class="form-label">代表類型</label>
          <select v-model.number="deputyForm.deputy_type" class="form-select">
            <option :value="0">一般代表</option>
            <option :value="1">出席代表</option>
            <option :value="2">理事長</option>
            <option :value="3">理事</option>
            <option :value="4">常務理事</option>
            <option :value="5">監事長</option>
            <option :value="6">監事</option>
            <option :value="7">常務監事</option>
            <option :value="8">候補理事</option>
          </select>
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <button
          :disabled="saving"
          class="px-4 py-2 rounded-lg bg-eco-red-600 hover:bg-eco-red-500 text-white text-sm font-medium transition-all"
          @click="saveDeputy"
        >
          {{ saving ? '儲存中...' : '儲存' }}
        </button>
        <button
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 text-gray-600 dark:text-gray-400 text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-dark-700"
          @click="showForm = false"
        >
          取消
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <div class="spinner w-6 h-6 mx-auto" />
    </div>

    <div v-else-if="deputies.length === 0" class="text-center py-12 text-gray-400 dark:text-gray-500">
      <p class="text-sm">尚無代表資料</p>
    </div>

    <!-- Deputies table -->
    <div v-else class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden">
      <table class="data-table">
        <thead>
          <tr>
            <th>代表號</th>
            <th>姓名</th>
            <th>性別</th>
            <th class="hidden sm:table-cell">出生日期</th>
            <th class="hidden md:table-cell">職稱</th>
            <th>屆次</th>
            <th>類型</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="deputy in deputies" :key="deputy.id">
            <td class="font-mono text-xs text-gray-500">{{ deputy.deputation_number || '-' }}</td>
            <td class="font-medium text-gray-900 dark:text-white">{{ deputy.deputation_name }}</td>
            <td>{{ deputy.deputation_sex === 0 ? '女' : '男' }}</td>
            <td class="hidden sm:table-cell text-gray-600 dark:text-gray-400">{{ deputy.deputation_birth || '-' }}</td>
            <td class="hidden md:table-cell text-gray-600 dark:text-gray-400">{{ deputy.deputation_title || '-' }}</td>
            <td>{{ deputy.session_number ? `第${deputy.session_number}屆` : '-' }}</td>
            <td>
              <span class="badge badge-blue">{{ DEPUTY_TYPE_MAP[deputy.deputy_type || 0] }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Deputy } from '~/types'
import { DEPUTY_TYPE_MAP } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const id = computed(() => route.params.id as string)
const loading = ref(true)
const saving = ref(false)
const showForm = ref(false)
const deputies = ref<Deputy[]>([])

const deputyForm = reactive({
  deputation_number: '',
  deputation_name: '',
  deputation_sex: 1,
  deputation_birth: '',
  deputation_title: '',
  session_number: null as number | null,
  deputy_type: 0,
})

const getAuthHeaders = () => {
  const token = process.client ? localStorage.getItem('auth_token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchDeputies = async () => {
  loading.value = true
  try {
    const response = await $fetch<{ data: Deputy[] }>(`/api/members/${id.value}/deputies`, {
      headers: getAuthHeaders(),
    })
    deputies.value = response.data || []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const saveDeputy = async () => {
  saving.value = true
  try {
    await $fetch(`/api/members/${id.value}/deputies`, {
      method: 'POST',
      body: deputyForm,
      headers: getAuthHeaders(),
    })
    showForm.value = false
    await fetchDeputies()
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}

onMounted(fetchDeputies)
</script>
