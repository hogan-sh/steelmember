import { getSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '缺少 ID 參數' })
  }

  const body = await readBody(event)

  // Remove read-only fields
  const { id: _id, created_at: _ca, ...updateData } = body
  updateData.updated_at = new Date().toISOString()

  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('members')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return { data, message: '更新成功' }
  } catch (err: unknown) {
    const e = err as { statusCode?: number; statusMessage?: string; message?: string }
    if (e.statusCode) throw err
    throw createError({ statusCode: 500, statusMessage: e.message || '更新失敗' })
  }
})
