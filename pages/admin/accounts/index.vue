<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">帳號管理</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">共 {{ items.length }} 個帳號</p>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-eco-red-600 hover:bg-eco-red-500 text-white text-sm font-medium transition-all"
        @click="openModal()"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        新增帳號
      </button>
    </div>

    <!-- Role permissions info -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div
        v-for="role in roleList"
        :key="role.value"
        class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-4"
      >
        <div class="flex items-center gap-2 mb-2">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="role.badgeClass">
            {{ role.label }}
          </span>
        </div>
        <ul class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <li v-for="perm in role.perms" :key="perm" class="flex items-center gap-1">
            <svg class="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            {{ perm }}
          </li>
          <li v-for="perm in role.denied" :key="perm" class="flex items-center gap-1">
            <svg class="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            {{ perm }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Accounts table -->
    <div class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>帳號</th>
              <th class="w-32">角色</th>
              <th class="hidden md:table-cell w-40">建立時間</th>
              <th class="w-28">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="4" class="text-center py-12">
                <div class="flex items-center justify-center gap-2 text-gray-400">
                  <div class="spinner w-5 h-5" />
                  <span class="text-sm">載入中...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="fetchError">
              <td colspan="4" class="text-center py-12 text-eco-red-500 text-sm">載入失敗：{{ fetchError }}</td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="4" class="text-center py-12 text-gray-400 text-sm">尚無帳號資料</td>
            </tr>
            <template v-else>
              <tr v-for="item in items" :key="item.id">
                <td>
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-eco-red-100 dark:bg-eco-red-900/30 flex items-center justify-center">
                      <span class="text-xs font-bold text-eco-red-600 dark:text-eco-red-400">
                        {{ item.account.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900 dark:text-white text-sm">{{ item.account }}</div>
                      <div v-if="item.id === currentUserId" class="text-xs text-eco-red-500">（目前登入）</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="getRoleBadge(item.role)">
                    {{ getRoleLabel(item.role) }}
                  </span>
                </td>
                <td class="hidden md:table-cell text-gray-500 dark:text-gray-400 text-sm">
                  {{ formatDate(item.created_at) }}
                </td>
                <td>
                  <div class="flex items-center gap-1">
                    <button
                      class="text-xs px-2 py-1 rounded text-ocean-blue-600 dark:text-ocean-blue-400 hover:bg-ocean-blue-50 dark:hover:bg-ocean-blue-900/20 transition-colors"
                      @click="openModal(item)"
                    >
                      編輯
                    </button>
                    <button
                      v-if="item.id !== currentUserId"
                      class="text-xs px-2 py-1 rounded text-eco-red-600 dark:text-eco-red-400 hover:bg-eco-red-50 dark:hover:bg-eco-red-900/20 transition-colors"
                      @click="confirmDelete(item)"
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <div v-if="modal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="modal.show = false" />
        <div class="relative bg-white dark:bg-dark-800 rounded-xl shadow-xl w-full max-w-sm p-6">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
            {{ modal.form.id ? '編輯帳號' : '新增帳號' }}
          </h3>
          <div class="space-y-4">
            <div>
              <label class="form-label">帳號 <span class="text-eco-red-500">*</span></label>
              <input
                v-model="modal.form.account"
                type="text"
                class="form-input"
                placeholder="登入帳號"
                :readonly="!!modal.form.id"
              >
            </div>
            <div>
              <label class="form-label">角色 <span class="text-eco-red-500">*</span></label>
              <select v-model="modal.form.role" class="form-input">
                <option value="admin">管理者（完整權限）</option>
                <option value="editor">編輯（可新增修改）</option>
                <option value="observer">觀察（僅可瀏覽）</option>
              </select>
            </div>
            <div>
              <label class="form-label">
                密碼
                <span v-if="!modal.form.id" class="text-eco-red-500">*</span>
                <span v-else class="text-gray-400 text-xs ml-1">（留空保持不變）</span>
              </label>
              <input
                v-model="modal.form.password"
                type="password"
                class="form-input"
                :placeholder="modal.form.id ? '留空表示不修改' : '至少 6 個字元'"
              >
            </div>
          </div>
          <p v-if="modal.error" class="mt-3 text-sm text-eco-red-500">{{ modal.error }}</p>
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

    <!-- Delete Confirm Modal -->
    <Teleport to="body">
      <div v-if="deleteModal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="deleteModal.show = false" />
        <div class="relative bg-white dark:bg-dark-800 rounded-xl shadow-xl w-full max-w-sm p-6">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">確認刪除</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            確定要刪除帳號 <strong class="text-gray-900 dark:text-white">{{ deleteModal.item?.account }}</strong> 嗎？此操作無法復原。
          </p>
          <p v-if="deleteModal.error" class="mb-3 text-sm text-eco-red-500">{{ deleteModal.error }}</p>
          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-dark-700 transition-all"
              @click="deleteModal.show = false"
            >
              取消
            </button>
            <button
              class="px-4 py-2 rounded-lg bg-eco-red-600 hover:bg-eco-red-500 text-white text-sm font-medium transition-all disabled:opacity-50"
              :disabled="deleteModal.deleting"
              @click="doDelete"
            >
              {{ deleteModal.deleting ? '刪除中...' : '確認刪除' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const authStore = useAuthStore()
const currentUserId = computed(() => authStore.user?.id)

interface AccountItem {
  id: string
  account: string
  role: string
  created_at: string
}

const loading = ref(true)
const items = ref<AccountItem[]>([])
const fetchError = ref('')

const modal = reactive({
  show: false,
  saving: false,
  error: '',
  form: {} as { id?: string; account?: string; role?: string; password?: string },
})

const deleteModal = reactive({
  show: false,
  deleting: false,
  error: '',
  item: null as AccountItem | null,
})

const roleList = [
  {
    value: 'admin',
    label: '管理者',
    badgeClass: 'bg-eco-red-100 text-eco-red-700 dark:bg-eco-red-900/30 dark:text-eco-red-400',
    perms: ['完整系統存取', '新增／修改／刪除資料', '帳號管理'],
    denied: [] as string[],
  },
  {
    value: 'editor',
    label: '編輯',
    badgeClass: 'bg-ocean-blue-100 text-ocean-blue-700 dark:bg-ocean-blue-900/30 dark:text-ocean-blue-400',
    perms: ['瀏覽所有模組', '新增／修改／刪除資料'],
    denied: ['帳號管理'],
  },
  {
    value: 'observer',
    label: '觀察',
    badgeClass: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    perms: ['瀏覽所有模組'],
    denied: ['新增／修改／刪除資料', '帳號管理'],
  },
]

const getAuthHeaders = () => {
  const token = process.client ? localStorage.getItem('auth_token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchData = async () => {
  loading.value = true
  fetchError.value = ''
  try {
    const res = await $fetch<{ data: AccountItem[] }>('/api/admin/accounts', {
      headers: getAuthHeaders(),
    })
    items.value = res.data || []
  } catch (err: unknown) {
    const e = err as { data?: { statusMessage?: string }; message?: string }
    fetchError.value = e.data?.statusMessage || e.message || '載入失敗'
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const getRoleLabel = (role: string) => {
  const map: Record<string, string> = { admin: '管理者', editor: '編輯', observer: '觀察' }
  return map[role] || role
}

const getRoleBadge = (role: string) => {
  const map: Record<string, string> = {
    admin: 'bg-eco-red-100 text-eco-red-700 dark:bg-eco-red-900/30 dark:text-eco-red-400',
    editor: 'bg-ocean-blue-100 text-ocean-blue-700 dark:bg-ocean-blue-900/30 dark:text-ocean-blue-400',
    observer: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  }
  return map[role] || 'bg-gray-100 text-gray-600'
}

const formatDate = (dt: string) => {
  if (!dt) return '-'
  return new Date(dt).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

const openModal = (item?: AccountItem) => {
  modal.error = ''
  modal.form = item
    ? { id: item.id, account: item.account, role: item.role, password: '' }
    : { role: 'editor' }
  modal.show = true
}

const save = async () => {
  modal.error = ''
  if (!modal.form.account && !modal.form.id) { modal.error = '請輸入帳號'; return }
  if (!modal.form.role) { modal.error = '請選擇角色'; return }
  if (!modal.form.id && !modal.form.password) { modal.error = '請輸入密碼'; return }

  modal.saving = true
  try {
    if (modal.form.id) {
      await $fetch(`/api/admin/accounts/${modal.form.id}`, {
        method: 'PUT',
        body: { role: modal.form.role, password: modal.form.password || '' },
        headers: getAuthHeaders(),
      })
    } else {
      await $fetch('/api/admin/accounts', {
        method: 'POST',
        body: { account: modal.form.account, role: modal.form.role, password: modal.form.password },
        headers: getAuthHeaders(),
      })
    }
    modal.show = false
    await fetchData()
  } catch (err: unknown) {
    const e = err as { data?: { statusMessage?: string }; message?: string }
    modal.error = e.data?.statusMessage || e.message || '儲存失敗'
  } finally {
    modal.saving = false
  }
}

const confirmDelete = (item: AccountItem) => {
  deleteModal.error = ''
  deleteModal.item = item
  deleteModal.show = true
}

const doDelete = async () => {
  if (!deleteModal.item) return
  deleteModal.error = ''
  deleteModal.deleting = true
  try {
    await $fetch(`/api/admin/accounts/${deleteModal.item.id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    deleteModal.show = false
    await fetchData()
  } catch (err: unknown) {
    const e = err as { data?: { statusMessage?: string }; message?: string }
    deleteModal.error = e.data?.statusMessage || e.message || '刪除失敗'
  } finally {
    deleteModal.deleting = false
  }
}
</script>
