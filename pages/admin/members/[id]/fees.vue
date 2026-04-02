<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">費用記錄</h2>
      <button
        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-eco-red-600 hover:bg-eco-red-500 text-white text-sm font-medium transition-all"
        @click="showForm = !showForm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        新增費用
      </button>
    </div>

    <!-- Add Form -->
    <div v-if="showForm" class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-4">新增費用記錄</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="form-label">繳費單號</label>
          <input v-model="feeForm.payment_number" type="text" class="form-input">
        </div>
        <div>
          <label class="form-label">費用期間起</label>
          <input v-model="feeForm.period_start" type="date" class="form-input">
        </div>
        <div>
          <label class="form-label">費用期間迄</label>
          <input v-model="feeForm.period_end" type="date" class="form-input">
        </div>
        <div>
          <label class="form-label">應繳金額</label>
          <input v-model.number="feeForm.amount_due" type="number" class="form-input" step="0.01">
        </div>
        <div>
          <label class="form-label">繳費方式</label>
          <select v-model="feeForm.payment_type" class="form-select">
            <option value="">請選擇</option>
            <option value="1">支票</option>
            <option value="2">郵匯</option>
            <option value="3">現金</option>
          </select>
        </div>
        <div>
          <label class="form-label">繳費日期</label>
          <input v-model="feeForm.pay_date" type="date" class="form-input">
        </div>
        <div>
          <label class="form-label">繳費金額</label>
          <input v-model.number="feeForm.pay_money" type="number" class="form-input" step="0.01">
        </div>
        <!-- Check fields (conditional) -->
        <template v-if="feeForm.payment_type === '1'">
          <div>
            <label class="form-label">支票號碼</label>
            <input v-model="feeForm.check_number" type="text" class="form-input">
          </div>
          <div>
            <label class="form-label">支票到期日</label>
            <input v-model="feeForm.check_due_date" type="date" class="form-input">
          </div>
          <div>
            <label class="form-label">銀行代號</label>
            <input v-model="feeForm.bank_code" type="text" class="form-input">
          </div>
        </template>
        <template v-if="feeForm.payment_type === '2'">
          <div>
            <label class="form-label">匯款銀行</label>
            <input v-model="feeForm.remit_bank" type="text" class="form-input">
          </div>
          <div>
            <label class="form-label">匯款帳號</label>
            <input v-model="feeForm.remit_account" type="text" class="form-input">
          </div>
        </template>
      </div>
      <div class="flex gap-3 mt-4">
        <button
          :disabled="saving"
          class="px-4 py-2 rounded-lg bg-eco-red-600 hover:bg-eco-red-500 text-white text-sm font-medium"
          @click="saveFee"
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

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <div class="spinner w-6 h-6 mx-auto" />
    </div>

    <div v-else-if="fees.length === 0" class="text-center py-12 text-gray-400 dark:text-gray-500">
      <p class="text-sm">尚無費用記錄</p>
    </div>

    <!-- Fees table -->
    <div v-else class="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden">
      <table class="data-table">
        <thead>
          <tr>
            <th>繳費單號</th>
            <th>費用期間</th>
            <th>應繳</th>
            <th>繳費方式</th>
            <th>繳費日期</th>
            <th>繳費金額</th>
            <th>狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fee in fees" :key="fee.id">
            <td class="font-mono text-xs text-gray-500">{{ fee.payment_number || '-' }}</td>
            <td class="text-sm text-gray-700 dark:text-gray-300">
              {{ fee.period_start }} ~ {{ fee.period_end }}
            </td>
            <td class="text-right font-medium text-gray-900 dark:text-white">
              {{ fee.amount_due ? fee.amount_due.toLocaleString() : '-' }}
            </td>
            <td>
              <span v-if="fee.payment_type" class="badge badge-blue">{{ PAYMENT_TYPE_MAP[fee.payment_type] }}</span>
              <span v-else class="text-gray-400">-</span>
            </td>
            <td class="text-sm text-gray-600 dark:text-gray-400">{{ fee.pay_date || '-' }}</td>
            <td class="text-right font-medium text-green-600 dark:text-green-400">
              {{ fee.pay_money ? fee.pay_money.toLocaleString() : '-' }}
            </td>
            <td>
              <span class="badge" :class="fee.pay_date ? 'badge-green' : 'badge-yellow'">
                {{ fee.pay_date ? '已繳' : '待繳' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MemberFee } from '~/types'
import { PAYMENT_TYPE_MAP } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })

const route = useRoute()
const id = computed(() => route.params.id as string)
const loading = ref(true)
const saving = ref(false)
const showForm = ref(false)
const fees = ref<MemberFee[]>([])

const feeForm = reactive({
  payment_number: '',
  period_start: '',
  period_end: '',
  amount_due: null as number | null,
  payment_type: '',
  check_code: '',
  check_number: '',
  check_due_date: '',
  bank_code: '',
  bank_account: '',
  remit_bank: '',
  remit_account: '',
  pay_date: '',
  pay_money: null as number | null,
})

const getAuthHeaders = () => {
  const token = process.client ? localStorage.getItem('auth_token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchFees = async () => {
  loading.value = true
  try {
    const response = await $fetch<{ data: MemberFee[] }>(`/api/members/${id.value}/fees`, {
      headers: getAuthHeaders(),
    })
    fees.value = response.data || []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const saveFee = async () => {
  saving.value = true
  try {
    await $fetch(`/api/members/${id.value}/fees`, {
      method: 'POST',
      body: feeForm,
      headers: getAuthHeaders(),
    })
    showForm.value = false
    await fetchFees()
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}

onMounted(fetchFees)
</script>
