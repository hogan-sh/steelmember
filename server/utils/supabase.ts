import { createClient } from '@supabase/supabase-js'

let supabaseAdmin: ReturnType<typeof createClient> | null = null

export const getSupabaseAdmin = () => {
  if (!supabaseAdmin) {
    const config = useRuntimeConfig()
    const supabaseUrl = process.env.SUPABASE_URL || config.public.supabaseUrl
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || (config as Record<string, unknown>).supabaseServiceKey as string || process.env.SUPABASE_KEY || config.public.supabaseKey

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing. Set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.')
    }

    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }
  return supabaseAdmin
}

export const getSupabaseClient = () => {
  const config = useRuntimeConfig()
  const supabaseUrl = process.env.SUPABASE_URL || config.public.supabaseUrl
  const supabaseKey = process.env.SUPABASE_KEY || config.public.supabaseKey

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing.')
  }

  return createClient(supabaseUrl, supabaseKey)
}
