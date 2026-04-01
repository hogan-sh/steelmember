<template>
  <div class="min-h-screen mesh-bg flex items-center justify-center p-4">
    <!-- Background orbs -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-eco-red-600/10 blur-3xl animate-float" />
      <div class="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-ocean-blue-600/10 blur-3xl animate-float-delayed" />
    </div>

    <div class="relative w-full max-w-md">
      <!-- Card -->
      <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-glass">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-eco-red-600 to-eco-red-800 items-center justify-center shadow-neon-red mb-4">
            <span class="text-white font-black text-2xl">鋼</span>
          </div>
          <h1 class="text-white font-bold text-xl">臺灣鋼鐵同業工會</h1>
          <p class="text-white/50 text-sm mt-1">管理系統後台登入</p>
        </div>

        <!-- Form -->
        <form class="space-y-5" @submit.prevent="handleLogin">
          <!-- Account -->
          <div>
            <label class="block text-sm font-medium text-white/70 mb-2">帳號</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-3 flex items-center text-white/30">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                v-model="form.account"
                type="text"
                placeholder="請輸入帳號"
                autocomplete="username"
                class="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-eco-red-500 focus:ring-2 focus:ring-eco-red-500/20 transition-all text-sm"
              >
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-white/70 mb-2">密碼</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-3 flex items-center text-white/30">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="請輸入密碼"
                autocomplete="current-password"
                class="w-full pl-10 pr-12 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-eco-red-500 focus:ring-2 focus:ring-eco-red-500/20 transition-all text-sm"
              >
              <button
                type="button"
                class="absolute inset-y-0 right-3 flex items-center text-white/30 hover:text-white/60 transition-colors"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Error message -->
          <Transition name="slide-down">
            <div v-if="errorMsg" class="flex items-center gap-2 p-3 rounded-xl bg-eco-red-600/20 border border-eco-red-600/30 text-eco-red-400 text-sm">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ errorMsg }}
            </div>
          </Transition>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 rounded-xl bg-eco-red-600 hover:bg-eco-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 hover:shadow-neon-red flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ loading ? '登入中...' : '登入' }}
          </button>
        </form>

        <!-- Back to home -->
        <div class="mt-6 text-center">
          <NuxtLink to="/" class="text-white/30 hover:text-white/60 text-sm transition-colors">
            ← 返回官方網站
          </NuxtLink>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-white/20 text-xs mt-6">
        © {{ new Date().getFullYear() }} 臺灣鋼鐵同業工會. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { login, isAuthenticated } = useAuth()
const router = useRouter()

// Redirect if already logged in
if (isAuthenticated.value) {
  await router.push('/admin')
}

const form = reactive({
  account: '',
  password: '',
})

const loading = ref(false)
const errorMsg = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  if (!form.account || !form.password) {
    errorMsg.value = '請輸入帳號和密碼'
    return
  }

  loading.value = true
  errorMsg.value = ''

  const result = await login(form.account, form.password)
  if (!result.success) {
    errorMsg.value = result.error || '登入失敗，請確認帳號密碼是否正確'
  }

  loading.value = false
}
</script>
