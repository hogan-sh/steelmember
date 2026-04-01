<template>
  <div>
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden mesh-bg">
      <!-- Animated background orbs -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-eco-red-600/10 blur-3xl animate-float" />
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-ocean-blue-600/10 blur-3xl animate-float-delayed" />
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-ocean-blue-950/50 blur-3xl" />
      </div>

      <!-- Grid overlay -->
      <div
        class="absolute inset-0 opacity-5"
        style="background-image: linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px); background-size: 60px 60px;"
      />

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <!-- Badge -->
        <div
          v-motion
          :initial="{ opacity: 0, y: -20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-eco-red-600/10 border border-eco-red-600/30 text-eco-red-400 text-sm font-medium mb-8"
        >
          <span class="w-2 h-2 rounded-full bg-eco-red-500 animate-pulse-slow" />
          臺灣鋼鐵同業工會 官方平台
        </div>

        <!-- Main heading -->
        <h1
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 700, delay: 200 } }"
          class="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
        >
          <span class="block">臺灣鋼鐵</span>
          <span class="block bg-clip-text text-transparent bg-gradient-to-r from-eco-red-400 via-eco-red-500 to-ocean-blue-400">
            同業工會
          </span>
        </h1>

        <p
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 700, delay: 400 } }"
          class="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          凝聚台灣鋼鐵產業力量，促進永續發展，維護會員共同權益，
          推動產業技術升級與國際合作。
        </p>

        <!-- CTA Buttons -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 700, delay: 600 } }"
          class="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <NuxtLink
            to="/members"
            class="group flex items-center gap-2 px-8 py-3.5 rounded-xl bg-eco-red-600 hover:bg-eco-red-500 text-white font-semibold text-base transition-all duration-300 hover:shadow-neon-red hover:-translate-y-0.5"
          >
            查看會員名錄
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-base transition-all duration-300 hover:-translate-y-0.5"
          >
            認識工會
          </NuxtLink>
        </div>

        <!-- Stats bar -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 40 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 700, delay: 800 } }"
          class="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          <div
            v-for="stat in heroStats"
            :key="stat.label"
            class="p-4 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 text-center"
          >
            <div class="text-2xl sm:text-3xl font-black text-white mb-1">{{ stat.value }}</div>
            <div class="text-white/50 text-xs">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
        <span class="text-xs">向下捲動</span>
        <div class="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
          <div class="w-1 h-2 rounded-full bg-white/50 animate-bounce" />
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="py-24 bg-dark-950 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <!-- Left: Image -->
          <div class="relative">
            <div class="rounded-2xl overflow-hidden aspect-video shadow-glass">
              <img
                src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80"
                alt="鋼鐵工業"
                class="w-full h-full object-cover"
              >
            </div>
            <!-- Floating badge -->
            <div class="absolute -bottom-4 -right-4 p-4 rounded-xl backdrop-blur-md bg-dark-900/80 border border-white/10 shadow-glass">
              <div class="text-eco-red-400 font-bold text-2xl">40+</div>
              <div class="text-white/50 text-xs">年服務歷史</div>
            </div>
          </div>

          <!-- Right: Content -->
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ocean-blue-900/30 border border-ocean-blue-700/30 text-ocean-blue-400 text-xs font-medium mb-4">
              關於工會
            </div>
            <h2 class="text-3xl sm:text-4xl font-black text-white mb-6 leading-tight">
              推動台灣鋼鐵<br>
              <span class="bg-clip-text text-transparent bg-gradient-to-r from-eco-red-400 to-ocean-blue-400">
                產業永續發展
              </span>
            </h2>
            <p class="text-white/60 leading-relaxed mb-6">
              臺灣鋼鐵同業工會成立以來，致力於整合鋼鐵產業資源，提供會員優質服務，
              促進同業交流合作，並積極參與政府政策制定，維護台灣鋼鐵產業的國際競爭力。
            </p>
            <div class="grid grid-cols-2 gap-4 mb-8">
              <div
                v-for="feature in features"
                :key="feature.title"
                class="p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div class="text-eco-red-400 mb-2">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="feature.icon" />
                  </svg>
                </div>
                <div class="text-white font-semibold text-sm">{{ feature.title }}</div>
                <div class="text-white/40 text-xs mt-1">{{ feature.desc }}</div>
              </div>
            </div>
            <NuxtLink
              to="/about"
              class="inline-flex items-center gap-2 text-eco-red-400 hover:text-eco-red-300 font-medium transition-colors"
            >
              了解更多
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Industry Stats Section -->
    <section class="py-24 bg-dark-900 relative overflow-hidden">
      <div class="absolute inset-0 mesh-bg opacity-50" />
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-black text-white mb-4">
            台灣鋼鐵產業現況
          </h2>
          <p class="text-white/50 max-w-xl mx-auto">
            台灣鋼鐵產業規模龐大，在全球市場占有重要地位
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(card, idx) in industryCards"
            :key="card.title"
            class="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-glass overflow-hidden"
          >
            <div
              class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              :class="idx % 2 === 0 ? 'bg-gradient-to-br from-eco-red-600/5 to-transparent' : 'bg-gradient-to-br from-ocean-blue-600/5 to-transparent'"
            />
            <div class="relative">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                :class="idx % 2 === 0 ? 'bg-eco-red-600/20' : 'bg-ocean-blue-600/20'"
              >
                <svg class="w-6 h-6" :class="idx % 2 === 0 ? 'text-eco-red-400' : 'text-ocean-blue-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="card.icon" />
                </svg>
              </div>
              <div class="text-3xl font-black text-white mb-1">{{ card.value }}</div>
              <div class="text-white font-semibold mb-2">{{ card.title }}</div>
              <div class="text-white/40 text-sm">{{ card.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- News Section -->
    <section class="py-24 bg-dark-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-12">
          <div>
            <h2 class="text-3xl font-black text-white mb-2">最新消息</h2>
            <p class="text-white/50">掌握工會最新動態</p>
          </div>
          <NuxtLink
            to="/news"
            class="flex items-center gap-2 text-eco-red-400 hover:text-eco-red-300 font-medium transition-colors"
          >
            查看全部
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div
            v-for="news in latestNews"
            :key="news.title"
            class="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div class="flex items-center gap-2 mb-4">
              <span
                class="text-xs px-2.5 py-1 rounded-full font-medium"
                :class="news.tag === '公告' ? 'bg-eco-red-600/20 text-eco-red-400' : 'bg-ocean-blue-600/20 text-ocean-blue-400'"
              >
                {{ news.tag }}
              </span>
              <span class="text-white/30 text-xs">{{ news.date }}</span>
            </div>
            <h3 class="text-white font-semibold mb-2 group-hover:text-eco-red-400 transition-colors">
              {{ news.title }}
            </h3>
            <p class="text-white/50 text-sm leading-relaxed">{{ news.excerpt }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-gradient-to-br from-eco-red-900 via-dark-950 to-ocean-blue-950 relative overflow-hidden">
      <div class="absolute inset-0 opacity-30">
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-eco-red-600/20 to-ocean-blue-600/20" />
      </div>
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-black text-white mb-6">
          加入臺灣鋼鐵同業工會
        </h2>
        <p class="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
          共同推動台灣鋼鐵產業發展，享受多項會員專屬服務與資源
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/contact"
            class="px-8 py-3.5 rounded-xl bg-white text-dark-900 font-semibold hover:bg-gray-100 transition-all duration-300 hover:-translate-y-0.5"
          >
            申請入會
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="px-8 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/15 transition-all duration-300 hover:-translate-y-0.5"
          >
            了解更多
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const heroStats = [
  { value: '500+', label: '會員企業' },
  { value: '3', label: '全台區域' },
  { value: '13', label: '產業類別' },
  { value: '40+', label: '年服務歷史' },
]

const features = [
  {
    title: '會員服務',
    desc: '多元化會員支援',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    title: '政策倡議',
    desc: '代表業界發聲',
    icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
  },
  {
    title: '技術交流',
    desc: '促進產業升級',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  },
  {
    title: '統計資訊',
    desc: 'PSI產銷存報表',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
]

const industryCards = [
  {
    title: '年產鋼量',
    value: '2,000萬噸',
    desc: '台灣每年鋼鐵生產總量',
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  },
  {
    title: '從業人員',
    value: '10萬人',
    desc: '直接相關就業人口',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    title: '出口總值',
    value: '50億美元',
    desc: '年度鋼鐵出口金額',
    icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: '研發投入',
    value: '持續增長',
    desc: '產業技術創新投資',
    icon: '12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    title: '環保認證',
    value: '綠色製程',
    desc: '符合國際環保標準',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  },
  {
    title: '國際合作',
    value: '全球連結',
    desc: '跨國策略聯盟',
    icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
  },
]

const latestNews = [
  {
    tag: '公告',
    date: '2024-04-01',
    title: '113年第一季會員大會通知',
    excerpt: '臺灣鋼鐵同業工會113年第一季會員大會將於近期舉行，請各會員踴躍參與...',
  },
  {
    tag: '活動',
    date: '2024-03-20',
    title: '鋼鐵產業技術交流研討會',
    excerpt: '本次研討會將邀請國內外鋼鐵產業專家分享最新技術趨勢及市場展望...',
  },
  {
    tag: '公告',
    date: '2024-03-10',
    title: '113年度會費繳納公告',
    excerpt: '請各會員依規定期限繳納113年度會費，如有問題請聯絡本會秘書處...',
  },
]
</script>
