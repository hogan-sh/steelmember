import { getSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (user?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: '帳號管理僅限管理者操作' })
  }

  const id = getRouterParam(event, 'id')

  if (id === user.id) {
    throw createError({ statusCode: 400, statusMessage: '無法刪除自己的帳號' })
  }

  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id)

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { success: true }
})
