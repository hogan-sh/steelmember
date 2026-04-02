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
      <div class="flex-1">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">產品代碼</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">共 {{ items.length }} 筆</p>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-eco-red-600 hover:bg-eco-red-500 text-white text-sm font-medium transition-all"
        @click="openModal()"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        新增產品代碼
      </button>
    </div>

    <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th class="w-20">產品序號</th>
              <th class="w-20">代號</th>
              <th class="w-24 hidden sm:table-cell">資料型態</th>
              <th>產品名稱</th>
              <th class="hidden md:table-cell">英文名稱</th>
              <th class="w-28">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="text-center py-12">
                <div class="flex items-center justify-center gap-2 text-gray-400">
                  <div class="spinner w-5 h-5" />
                  <span class="text-sm">載入中...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="fetchError">
              <td colspan="6" class="text-center py-12 text-eco-red-500 text-sm">載入失敗：{{ fetchError }}</td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="6" class="text-center py-12 text-gray-400 text-sm">尚無產品代碼資料</td>
            </tr>
            <template v-else>
              <tr v-for="item in items" :key="item.id">
                <td class="font-mono text-xs text-gray-500">{{ item.product_serial }}</td>
                <td class="font-mono text-sm font-medium">{{ item.product_code }}</td>
                <td class="hidden sm:table-cell text-gray-600 dark:text-gray-400">{{ item.data_type }}</td>
                <td class="font-medium text-gray-900 dark:text-white">{{ item.product_name }}</td>
                <td class="hidden md:table-cell text-gray-500 dark:text-gray-400 text-sm">{{ item.product_en_name }}</td>
                <td>
                  <button
                    class="text-xs px-2 py-1 rounded text-ocean-blue-600 dark:text-ocean-blue-400 hover:bg-ocean-blue-50 dark:hover:bg-ocean-blue-900/20 transition-colors"
                    @click="openModal(item)"
                  >
                    編輯
                  </button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="modal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="modal.show = false" />
        <div class="relative bg-white dark:bg-dark-800 rounded-xl shadow-xl w-full max-w-md p-6">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
            {{ modal.form.id ? '編輯產品代碼' : '新增產品代碼' }}
          </h3>
          <div class="space-y-4">
            <div>
              <label class="form-label">產品序號 <span class="text-eco-red-500">*</span></label>
              <input
                v-model="modal.form.product_serial"
                type="text"
                class="form-input"
                placeholder="例：001"
                :readonly="!!modal.form.id"
              >
            </div>
            <div>
              <label class="form-label">代號</label>
              <input v-model="modal.form.product_code" type="text" class="form-input" placeholder="產品代號">
            </div>
            <div>
              <label class="form-label">資料型態</label>
              <input v-model="modal.form.data_type" type="text" class="form-input" placeholder="資料型態">
            </div>
            <div>
              <label class="form-label">產品名稱</label>
              <input v-model="modal.form.product_name" type="text" class="form-input" placeholder="產品中文名稱">
            </div>
            <div>
              <label class="form-label">英文名稱</label>
              <input v-model="modal.form.product_en_name" type="text" class="form-input" placeholder="Product English Name">
            </div>
          </div>
          <p v-if="errorMsg" class="mt-3 text-sm text-eco-red-500">{{ errorMsg }}</p>
          <div class="flex justify-end gap-3 mt-6">
            <button
              class="px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-dark-700 transition-all"
              @click="modal.show = false"
            >
              取消
            </button>
            <button
              class="px-4 py-2 rounded-lg bg-eco-red-600 hover:bg-eco-red-500 text-white text-sm font-medium transition-all disabled:opacity-50"
              :disabled="modal.saving"
              @click="save"
            >
              {{ modal.saving ? '儲存中...' : '儲存' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { PsiProductCode } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })

const loading = ref(false)
const items = ref<PsiProductCode[]>([])
const fetchError = ref('')
const errorMsg = ref('')
const modal = reactive({
  show: false,
  saving: false,
  form: {} as Partial<PsiProductCode>,
})

const getAuthHeaders = () => {
  const token = process.client ? localStorage.getItem('auth_token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchData = async () => {
  loading.value = true
  fetchError.value = ''
  try {
    const res = await fetch('/api/psi/product-codes')
    const json = await res.json()
    items.value = json.data || []
  } catch (err: unknown) {
    fetchError.value = String(err) || '載入失敗'
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const openModal = (item?: PsiProductCode) => {
  errorMsg.value = ''
  modal.form = item ? { ...item } : {}
  modal.show = true
}

const save = async () => {
  if (!modal.form.product_serial) {
    errorMsg.value = '產品序號為必填'
    return
  }
  errorMsg.value = ''
  modal.saving = true
  try {
    await $fetch('/api/psi/product-codes', {
      method: 'POST',
      body: modal.form,
      headers: getAuthHeaders(),
    })
    modal.show = false
    await fetchData()
  } catch (err: unknown) {
    const e = err as { data?: { statusMessage?: string }; message?: string }
    errorMsg.value = e.data?.statusMessage || e.message || '儲存失敗'
  } finally {
    modal.saving = false
  }
}

</script>
