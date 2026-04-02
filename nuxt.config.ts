// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@vueuse/motion/nuxt',
  ],

  supabase: {
    redirect: false,
  },

  css: ['~/assets/css/globals.css'],

  typescript: {
    strict: true,
    shim: false,
  },

  app: {
    head: {
      title: '臺灣鋼鐵同業工會 - 會員管理系統',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '臺灣鋼鐵同業工會會員管理系統' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+TC:wght@300;400;500;700;900&display=swap' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'steelmember-secret-key-2024',
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_KEY || '',
    },
  },

  nitro: {
    preset: 'vercel',
  },

  imports: {
    autoImport: true,
  },

  experimental: {
    payloadExtraction: false,
  },

  compatibilityDate: '2024-04-03',
})
