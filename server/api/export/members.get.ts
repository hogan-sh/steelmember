import { getSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { factory_area, major_number, member_status, level } = query

  try {
    const supabase = getSupabaseAdmin()
    let q = supabase
      .from('members')
      .select('*')

    if (factory_area) q = q.eq('factory_area', factory_area)
    if (major_number) q = q.eq('major_number', major_number)
    if (member_status) q = q.eq('member_status', member_status)
    if (level) q = q.eq('level', level)

    const { data, error } = await q.order('member_number', { ascending: true })

    if (error) throw error

    return { data, total: data?.length || 0 }
  } catch (err: unknown) {
    const e = err as { message?: string }
    throw createError({ statusCode: 500, statusMessage: e.message || '匯出失敗' })
  }
})
