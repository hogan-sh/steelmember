import { getSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (user?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: '帳號管理僅限管理者操作' })
  }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('accounts')
    .select('id, account, role, created_at')
    .order('created_at', { ascending: true })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { data }
})
