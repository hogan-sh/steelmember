import { getSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { session_number, deputy_type } = query

  try {
    const supabase = getSupabaseAdmin()
    let q = supabase
      .from('deputies')
      .select('*, members(member_name, short_name, factory_area, factory_city)')

    if (session_number) q = q.eq('session_number', session_number)
    if (deputy_type !== undefined) q = q.eq('deputy_type', deputy_type)
    else q = q.eq('deputy_type', 0)

    const { data, error } = await q.order('deputation_number', { ascending: true })

    if (error) throw error
    return { data }
  } catch (err: unknown) {
    const e = err as { message?: string }
    throw createError({ statusCode: 500, statusMessage: e.message || '查詢失敗' })
  }
})
