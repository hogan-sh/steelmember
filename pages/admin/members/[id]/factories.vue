<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">工廠資料</h2>
      <button
        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-eco-red-600 hover:bg-eco-red-500 text-white text-sm font-medium transition-all"
        @click="showForm = !showForm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        新增工廠
      </button>
    </div>

    <!-- Add Form -->
    <div v-if="showForm" class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-4">新增工廠資料</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="form-label">工廠編號</label>
          <input v-model="factoryForm.factory_number" type="text" class="form-input" placeholder="F001">
        </div>
        <div>
          <label class="form-label">工廠名稱</label>
          <input v-model="factoryForm.factory_name" type="text" class="form-input">
        </div>
        <div>
          <label class="form-label">工廠登記證</label>
          <input v-model="factoryForm.factory_license" type="text" class="form-input">
        </div>
        <div>
          <label class="form-label">登記日期</label>
          <input v-model="factoryForm.license_date" type="date" class="form-input">
        </div>
        <div>
          <label class="form-label">郵遞區號</label>
          <input v-model="factoryForm.factory_zip" type="text" class="form-input">
        </div>
        <div class="sm:col-span-2">
          <label class="form-label">工廠地址</label>
          <input v-model="factoryForm.factory_address" type="text" class="form-input">
        </div>
        <div>
          <label class="form-label">電話</label>
          <input v-model="factoryForm.factory_tel" type="text" class="form-input">
        </div>
        <div>
          <label class="form-label">傳真</label>
          <input v-model="factoryForm.factory_fax" type="text" class="form-input">
        </div>
        <div>
          <label class="form-label">廠地面積 (m²)</label>
          <input v-model.number="factoryForm.factory_area" type="number" class="form-input" step="0.01">
        </div>
        <div>
          <label class="form-label">建物面積 (m²)</label>
          <input v-model.number="factoryForm.building_area" type="number" class="form-input" step="0.01">
        </div>
        <div class="sm:col-span-2">
          <label class="form-label">主要設備</label>
          <textarea v-model="factoryForm.equi" class="form-input" rows="2" />
        </div>
        <div class="sm:col-span-2">
          <label class="form-label">主要產品</label>
          <textarea v-model="factoryForm.prod" class="form-input" rows="2" />
        </div>
      </div>
      <div class="flex items-center gap-3 mt-4">
        <button
          class="px-4 py-2 rounded-lg bg-eco-red-600 hover:bg-eco-red-500 text-white text-sm font-medium transition-all"
          :disabled="saving"
          @click="saveFactory"
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

    <!-- Factories list -->
    <div v-if="loading" class="text-center py-8">
      <div class="spinner w-6 h-6 mx-auto" />
    </div>

    <div v-else-if="factories.length === 0" class="text-center py-12 text-gray-400 dark:text-gray-500">
      <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
      <p class="text-sm">尚無工廠資料</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="factory in factories"
        :key="factory.id"
        class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6"
      >
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">
              {{ factory.factory_name || '未命名工廠' }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ factory.factory_number }}</p>
          </div>
          <span class="badge badge-blue text-xs">登記：{{ factory.license_date || '-' }}</span>
        </div>
        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <div>
            <dt class="text-xs text-gray-400 mb-0.5">地址</dt>
            <dd class="text-gray-700 dark:text-gray-300">{{ factory.factory_address || '-' }}</dd>
          </div>
          <div>
            <dt class="text-xs text-gray-400 mb-0.5">電話</dt>
            <dd class="text-gray-700 dark:text-gray-300">{{ factory.factory_tel || '-' }}</dd>
          </div>
          <div>
            <dt class="text-xs text-gray-400 mb-0.5">廠地/建物面積</dt>
            <dd class="text-gray-700 dark:text-gray-300">
              {{ factory.factory_area || '-' }} / {{ factory.building_area || '-' }} m²
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Factory } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })

const route = useRoute()
const id = computed(() => route.params.id as string)
const loading = ref(true)
const saving = ref(false)
const showForm = ref(false)
const factories = ref<Factory[]>([])

const factoryForm = reactive({
  factory_number: '',
  factory_name: '',
  factory_zip: '',
  factory_address: '',
  factory_tel: '',
  factory_fax: '',
  factory_license: '',
  license_date: '',
  factory_area: null as number | null,
  building_area: null as number | null,
  equi: '',
  prod: '',
})

const getAuthHeaders = () => {
  if (process.client) {
    const token = localStorage.getItem('auth_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
  return {}
}

const fetchFactories = async () => {
  loading.value = true
  try {
    const response = await $fetch<{ data: Factory[] }>(`/api/members/${id.value}/factories`, {
      headers: getAuthHeaders(),
    })
    factories.value = response.data || []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const saveFactory = async () => {
  saving.value = true
  try {
    await $fetch(`/api/members/${id.value}/factories`, {
      method: 'POST',
      body: factoryForm,
      headers: getAuthHeaders(),
    })
    showForm.value = false
    Object.keys(factoryForm).forEach(key => {
      (factoryForm as Record<string, unknown>)[key] = typeof (factoryForm as Record<string, unknown>)[key] === 'number' ? null : ''
    })
    await fetchFactories()
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}

onMounted(fetchFactories)
</script>
