import { getSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: '缺少 ID' })

  const body = await readBody(event)

  try {
    const supabase = getSupabaseAdmin()
    const { data: member } = await supabase
      .from('members')
      .select('member_number')
      .eq('id', id)
      .single()

    const { data, error } = await supabase
      .from('member_fees')
      .insert({ ...body, member_id: id, member_number: member?.member_number })
      .select()
      .single()

    if (error) throw error
    return { data, message: '費用記錄建立成功' }
  } catch (err: unknown) {
    const e = err as { statusCode?: number; statusMessage?: string; message?: string }
    if (e.statusCode) throw err
    throw createError({ statusCode: 500, statusMessage: e.message || '建立失敗' })
  }
})
