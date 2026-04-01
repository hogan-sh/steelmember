<template>
  <div class="min-h-screen bg-dark-950 text-white">
    <!-- Navbar -->
    <nav
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      :class="scrolled ? 'backdrop-blur-md bg-dark-950/80 border-b border-white/10 shadow-glass' : 'bg-transparent'"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-eco-red-600 to-eco-red-800 flex items-center justify-center shadow-neon-red group-hover:scale-110 transition-transform duration-300">
              <span class="text-white font-bold text-lg">鋼</span>
            </div>
            <div class="hidden sm:block">
              <div class="text-white font-bold text-sm leading-tight">臺灣鋼鐵同業工會</div>
              <div class="text-white/50 text-xs">Taiwan Steel Industry Association</div>
            </div>
          </NuxtLink>

          <!-- Desktop Nav Links -->
          <div class="hidden md:flex items-center gap-1">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 hover:text-white"
              :class="$route.path === link.path ? 'bg-white/10 text-white' : 'text-white/70'"
            >
              {{ link.label }}
            </NuxtLink>
          </div>

          <!-- Right actions -->
          <div class="flex items-center gap-3">
            <NuxtLink
              to="/admin/login"
              class="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-eco-red-600 hover:bg-eco-red-500 text-white text-sm font-medium transition-all duration-200 hover:shadow-neon-red"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              會員登入
            </NuxtLink>

            <!-- Mobile menu toggle -->
            <button
              class="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
              @click="mobileMenuOpen = !mobileMenuOpen"
            >
              <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition name="slide-down">
        <div v-if="mobileMenuOpen" class="md:hidden backdrop-blur-md bg-dark-950/90 border-t border-white/10">
          <div class="px-4 py-3 space-y-1">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              class="block px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
              @click="mobileMenuOpen = false"
            >
              {{ link.label }}
            </NuxtLink>
            <NuxtLink
              to="/admin/login"
              class="block px-4 py-2 rounded-lg text-sm font-medium bg-eco-red-600 text-white text-center mt-2"
              @click="mobileMenuOpen = false"
            >
              會員登入
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </nav>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-dark-950 border-t border-white/10 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Brand -->
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-eco-red-600 to-eco-red-800 flex items-center justify-center">
                <span class="text-white font-bold text-lg">鋼</span>
              </div>
              <div>
                <div class="text-white font-bold">臺灣鋼鐵同業工會</div>
                <div class="text-white/40 text-xs">Taiwan Steel Industry Association</div>
              </div>
            </div>
            <p class="text-white/50 text-sm leading-relaxed max-w-xs">
              臺灣鋼鐵同業工會致力於促進台灣鋼鐵產業的發展，維護會員權益，推動產業升級。
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">快速連結</h3>
            <ul class="space-y-2">
              <li v-for="link in navLinks" :key="link.path">
                <NuxtLink :to="link.path" class="text-white/50 hover:text-white text-sm transition-colors">
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h3 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">聯絡資訊</h3>
            <ul class="space-y-2 text-white/50 text-sm">
              <li>台灣台北市</li>
              <li>電話：(02) XXXX-XXXX</li>
              <li>傳真：(02) XXXX-XXXX</li>
              <li>Email：info@steelassoc.tw</li>
            </ul>
          </div>
        </div>

        <div class="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-white/30 text-xs">
            © {{ new Date().getFullYear() }} 臺灣鋼鐵同業工會. All rights reserved.
          </p>
          <p class="text-white/30 text-xs">
            系統版本 v1.0.0
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const navLinks = [
  { path: '/', label: '首頁' },
  { path: '/about', label: '關於工會' },
  { path: '/members', label: '會員名錄' },
  { path: '/news', label: '最新消息' },
  { path: '/contact', label: '聯絡我們' },
]

onMounted(() => {
  const handleScroll = () => {
    scrolled.value = window.scrollY > 20
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))
})

watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>
