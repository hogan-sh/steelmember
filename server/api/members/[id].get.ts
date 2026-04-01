import { getSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '缺少 ID 參數' })
  }

  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      throw createError({ statusCode: 404, statusMessage: '找不到該會員' })
    }

    return { data }
  } catch (err: unknown) {
    const e = err as { statusCode?: number; statusMessage?: string; message?: string }
    if (e.statusCode) throw err
    throw createError({ statusCode: 500, statusMessage: e.message || '查詢失敗' })
  }
})
