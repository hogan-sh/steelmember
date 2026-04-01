import { getSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: '缺少 ID' })

  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('change_logs')
      .select('*')
      .eq('member_id', id)
      .order('change_date', { ascending: false })

    if (error) throw error
    return { data }
  } catch (err: unknown) {
    const e = err as { message?: string }
    throw createError({ statusCode: 500, statusMessage: e.message || '查詢失敗' })
  }
})
