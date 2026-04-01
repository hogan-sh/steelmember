<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">PSI 產銷存管理系統</h1>
      <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">臺灣鋼鐵同業工會產銷存資料管理</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <NuxtLink
        v-for="item in sections"
        :key="item.path"
        :to="item.path"
        class="group p-6 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 hover:border-eco-red-300 dark:hover:border-eco-red-800 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
      >
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" :class="item.color">
            <svg class="w-6 h-6" :class="item.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ item.label }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ item.desc }}</p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const sections = [
  {
    path: '/admin/psi/manufacture',
    label: '製造資料查詢',
    desc: '查詢產銷存調查資料，依年月/廠商/產品篩選',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    color: 'bg-ocean-blue-100 dark:bg-ocean-blue-900/30',
    iconColor: 'text-ocean-blue-600 dark:text-ocean-blue-400',
  },
  {
    path: '/admin/psi/industry-codes',
    label: '行業別代碼',
    desc: '管理行業分類代碼，新增/編輯行業代碼',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    color: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    path: '/admin/psi/product-codes',
    label: '產品代碼',
    desc: '管理產品分類代碼，新增/編輯產品資料',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    color: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    path: '/admin/psi/country-codes',
    label: '國家代碼',
    desc: '管理國家/地區代碼，新增/編輯國家資料',
    icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'bg-eco-red-100 dark:bg-eco-red-900/30',
    iconColor: 'text-eco-red-600 dark:text-eco-red-400',
  },
]
</script>
